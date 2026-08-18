import { useEffect, useRef, useState } from 'react'
import { REGRA_POR_ID, pontosVisiveis, type Ponto } from '@/content/poses'
import {
  abrirCamera,
  carregarDetector,
  estadoDoErro,
  suportaCamera,
  type EstadoDaCamera,
} from '@/lib/pose'
import { narrar } from '@/lib/narracao'

/**
 * O espelho: mostra a criança na câmera e confirma quando ela entra na
 * posição do exercício. Quando confirma, avisa quem chamou — e é aí que o
 * cronômetro começa a contar.
 *
 * DUAS REGRAS DE DESENHO QUE NÃO SE NEGOCIAM:
 *
 * 1. Isto NUNCA é a única porta. PC de laboratório em geral não tem
 *    webcam, permissão pode ser negada, o WASM pode não carregar, e a
 *    criança pode simplesmente não conseguir encaixar — corpo diferente do
 *    previsto, espaço apertado, luz ruim, cadeira de rodas. Em todos esses
 *    casos quem chamou continua oferecendo o caminho normal. O app tem
 *    regra dura de que o erro nunca pune, e "seu corpo não está na posição
 *    certa" seria a punição mais dura que ele já deu — ainda mais na
 *    semana do 5º ano, que é sobre diversidade corporal.
 *
 * 2. Nada é gravado. Ver src/lib/pose.ts.
 */

interface EspelhoDePoseProps {
  /** Id da regra em @/content/poses. */
  verificacao: string
  /** Chamado uma única vez, quando a pose é confirmada. */
  aoConfirmar: () => void
  /** Chamado quando a câmera não é uma opção, para a tela seguir sem ela. */
  aoIndisponivel: (motivo: EstadoDaCamera) => void
}

/** Quadros seguidos na pose antes de confirmar. Evita confirmar um esbarrão. */
const QUADROS_PARA_CONFIRMAR = 8

export function EspelhoDePose({ verificacao, aoConfirmar, aoIndisponivel }: EspelhoDePoseProps) {
  const regra = REGRA_POR_ID.get(verificacao)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [estado, setEstado] = useState<EstadoDaCamera>('ocioso')
  const [encaixou, setEncaixou] = useState(false)
  const [foraDoQuadro, setForaDoQuadro] = useState(false)

  /** Confirma uma vez só. Ref, não state: o laço de quadros roda fora do React. */
  const jaConfirmou = useRef(false)
  const seguidos = useRef(0)

  useEffect(() => {
    if (!regra) {
      aoIndisponivel('sem-suporte')
      return
    }
    if (!suportaCamera()) {
      setEstado('sem-suporte')
      aoIndisponivel('sem-suporte')
      return
    }

    let vivo = true
    let pedido = 0
    let fecharCamera: (() => void) | null = null

    setEstado('carregando')

    ;(async () => {
      let camera
      try {
        camera = await abrirCamera()
      } catch (e) {
        if (!vivo) return
        const motivo = estadoDoErro(e)
        setEstado(motivo)
        aoIndisponivel(motivo)
        return
      }
      if (!vivo) {
        camera.parar()
        return
      }
      fecharCamera = camera.parar

      let detector
      try {
        detector = await carregarDetector()
      } catch {
        if (!vivo) return
        camera.parar()
        setEstado('falhou')
        aoIndisponivel('falhou')
        return
      }
      if (!vivo) {
        camera.parar()
        return
      }

      setEstado('pronto')

      const ctx = canvasRef.current?.getContext('2d')

      const quadro = () => {
        if (!vivo) return
        pedido = requestAnimationFrame(quadro)

        let pontos: Ponto[] | undefined
        try {
          pontos = detector.detectForVideo(camera.video, performance.now()).landmarks[0]
        } catch {
          return // quadro solto falhando nao derruba o exercicio
        }

        desenhar(ctx, camera.video, pontos)

        if (!pontos) {
          seguidos.current = 0
          return
        }

        if (!pontosVisiveis(pontos, regra.exige)) {
          setForaDoQuadro(true)
          seguidos.current = 0
          return
        }
        setForaDoQuadro(false)

        if (regra.conferir(pontos)) {
          seguidos.current++
          if (seguidos.current >= QUADROS_PARA_CONFIRMAR && !jaConfirmou.current) {
            jaConfirmou.current = true
            setEncaixou(true)
            narrar('Isso mesmo!')
            aoConfirmar()
          }
        } else {
          seguidos.current = 0
        }
      }

      pedido = requestAnimationFrame(quadro)
    })()

    return () => {
      vivo = false
      cancelAnimationFrame(pedido)
      fecharCamera?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificacao])

  if (!regra || estado === 'sem-suporte' || estado === 'sem-camera' || estado === 'sem-permissao' || estado === 'falhou') {
    return null // quem chamou ja recebeu o aviso e segue sem camera
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div
        className={`relative w-full overflow-hidden rounded-bolha border-4 ${
          encaixou ? 'border-folha-500' : 'border-ceu-300'
        }`}
      >
        <canvas ref={canvasRef} width={480} height={360} className="block w-full bg-ceu-50" />

        {estado === 'carregando' && (
          <p className="absolute inset-0 flex items-center justify-center bg-ceu-50 px-4 text-center font-display text-lg font-bold text-ceu-600">
            Preparando a câmera…
          </p>
        )}

        {encaixou && (
          <p className="absolute inset-x-0 bottom-0 bg-folha-500 py-2 text-center font-display text-xl font-extrabold text-white">
            Isso mesmo! Segura aí!
          </p>
        )}
      </div>

      {!encaixou && estado === 'pronto' && (
        <p className="text-center font-display text-lg font-bold text-ceu-600">
          {foraDoQuadro ? 'Afaste-se um pouco para aparecer inteiro!' : regra.dica}
        </p>
      )}
    </div>
  )
}

/** Espelha a imagem e marca as articulações. Nenhum quadro é guardado. */
function desenhar(
  ctx: CanvasRenderingContext2D | null | undefined,
  video: HTMLVideoElement,
  pontos: Ponto[] | undefined,
) {
  if (!ctx) return
  const { width: l, height: a } = ctx.canvas

  ctx.save()
  // Espelhado: a criança precisa se ver como num espelho, senão levantar o
  // braço direito aparece do lado errado e ela corrige para o lado errado.
  ctx.translate(l, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, l, a)

  if (pontos) {
    ctx.fillStyle = '#4FC3F7'
    for (const p of pontos) {
      if (p.visibility < 0.5) continue
      ctx.beginPath()
      ctx.arc(p.x * l, p.y * a, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}
