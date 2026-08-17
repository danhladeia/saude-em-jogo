import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FIGURINHAS, sortearFigurinha, type Figurinha } from '@/dominio/figurinhas'
import { anguloParaParar, caminhoDaFatia, posicaoDoRotulo } from './geometriaDaRoda'
import { urlDoSprite } from '@/assets/registro'
import { Botao } from './Botao'
import { celebrarConclusao } from './celebrar'
import { movimentoReduzido } from '@/lib/movimento'
import { narrar } from '@/lib/narracao'
import { usarPerfil } from '@/store/usarPerfil'

type Fase = 'convite' | 'girando' | 'premio'

interface RoletaDeRecompensaProps {
  aoTerminar: () => void
}

/**
 * O prêmio por concluir uma atividade: um giro, uma figurinha.
 *
 * Recompensa variável é a mecânica que mais prende nessa idade, e aqui ela
 * custou quase nada — a geometria da roda já existia para o jogo de
 * alongamentos, e a arte veio numa folha só.
 *
 * Como no motor da roleta, o resultado sai por relógio e não por callback de
 * animação: com `prefers-reduced-motion` o Motion pula animações de transform
 * e o callback nunca chega, o que deixaria a criança olhando uma roda parada.
 */
export function RoletaDeRecompensa({ aoTerminar }: RoletaDeRecompensaProps) {
  const coletadas = usarPerfil((e) => e.figurinhas)
  const ganharFigurinha = usarPerfil((e) => e.ganharFigurinha)
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const [fase, setFase] = useState<Fase>('convite')
  const [angulo, setAngulo] = useState(0)
  const [premio, setPremio] = useState<Figurinha | null>(null)
  const pendente = useRef<Figurinha | null>(null)
  const girando = useRef(false)

  const segundosDeGiro = movimentoReduzido() ? 0 : 3

  function girar() {
    if (girando.current) return
    girando.current = true

    // Sorteia antes de girar: a roda só encena o que já foi decidido.
    const escolhida = sortearFigurinha(coletadas)
    pendente.current = escolhida
    setFase('girando')
    setAngulo((a) => anguloParaParar(a, FIGURINHAS.indexOf(escolhida), FIGURINHAS.length))
  }

  useEffect(() => {
    if (fase !== 'girando') return
    const id = setTimeout(() => {
      const ganha = pendente.current
      if (!ganha) return
      pendente.current = null
      const repetida = coletadas.includes(ganha.id)
      ganharFigurinha(ganha.id)
      setPremio(ganha)
      setFase('premio')
      celebrarConclusao()
      if (narracaoLigada) {
        narrar(repetida ? `Você tirou ${ganha.rotulo} de novo!` : `Você ganhou ${ganha.rotulo}!`)
      }
    }, segundosDeGiro * 1000 + 120)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, angulo])

  const fatia = 360 / FIGURINHAS.length

  return (
    <div className="flex flex-col items-center gap-5">
      <h3 className="text-center text-3xl text-uva-500">
        {fase === 'premio' ? 'Sua figurinha!' : 'Gire e ganhe uma figurinha!'}
      </h3>

      <div className="relative w-full max-w-xs">
        <div aria-hidden="true" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-3xl">
          🔻
        </div>

        <div
          className="w-full drop-shadow-xl"
          style={{
            transform: `rotate(${angulo}deg)`,
            transition: segundosDeGiro
              ? `transform ${segundosDeGiro}s cubic-bezier(0.15, 0.6, 0.25, 1)`
              : 'none',
          }}
        >
          <svg
            viewBox="-110 -110 220 220"
            className="w-full"
            role="img"
            aria-label={`Roleta com ${FIGURINHAS.length} figurinhas`}
          >
            {FIGURINHAS.map((f, i) => (
              <g key={f.id}>
                <path d={caminhoDaFatia(i, fatia)} fill={f.cor} stroke="white" strokeWidth="2" />
                <g transform={posicaoDoRotulo(i, fatia)}>
                  <circle r="17" fill="white" opacity="0.92" />
                  <image href={urlDoSprite(f.imagem)} x={-15} y={-15} width={30} height={30} />
                </g>
              </g>
            ))}
            <circle cx="0" cy="0" r="24" fill="white" stroke="var(--color-uva-200)" strokeWidth="4" />
          </svg>
        </div>
      </div>

      {fase === 'convite' && (
        <Botao cor="uva" tamanho="grande" onClick={girar}>
          GIRAR
        </Botao>
      )}

      {fase === 'girando' && (
        <p className="font-display text-xl font-bold text-tinta-400">Girando…</p>
      )}

      {fase === 'premio' && premio && (
        <motion.div
          initial={movimentoReduzido() ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className="flex flex-col items-center gap-3"
        >
          <img
            src={urlDoSprite(premio.imagem)}
            alt={premio.rotulo}
            draggable={false}
            className="h-32 w-32 select-none object-contain"
          />
          <p className="font-display text-2xl font-extrabold text-uva-600">{premio.rotulo}</p>
          <Botao cor="folha" tamanho="grande" onClick={aoTerminar}>
            Colar no álbum
          </Botao>
        </motion.div>
      )}
    </div>
  )
}
