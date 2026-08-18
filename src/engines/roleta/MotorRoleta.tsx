import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConteudoRoleta } from '@/content/schemas'
import type { PropsDeMotor } from '../tipos'
import { Enunciado } from '../comuns/Enunciado'
import { Cronometro } from '../comuns/Cronometro'
import { EspelhoDePose } from '../comuns/EspelhoDePose'
import { Botao } from '@/design/Botao'
import { celebrarConclusao } from '@/design/celebrar'
import { narrar } from '@/lib/narracao'
import { movimentoReduzido } from '@/lib/movimento'
import { urlDoSprite } from '@/assets/registro'
import { anguloParaParar, caminhoDaFatia, posicaoDoRotulo } from '@/design/geometriaDaRoda'
import { usarPerfil } from '@/store/usarPerfil'

const CORES = [
  'var(--color-ceu-400)',
  'var(--color-folha-400)',
  'var(--color-sol-400)',
  'var(--color-coral-400)',
  'var(--color-uva-400)',
  'var(--color-ceu-600)',
  'var(--color-folha-600)',
  'var(--color-coral-600)',
]

type Fase = 'parada' | 'girando' | 'executando'

/**
 * Roleta giratória — "Corpo que estica", 2º ano, semana 4.
 *
 * O documento descreve a mecânica quase como especificação: "uma
 * plaquinha com a palavra GIRAR; ao clicar nela a roleta começa a se
 * mover e ao parar indica um tipo de alongamento representado por uma
 * imagem. A criança deverá observar o desenho e realizar o movimento".
 *
 * Não há resposta certa aqui — a roleta sorteia e o corpo executa.
 */
export function MotorRoleta({ conteudo, aoConcluir }: PropsDeMotor<ConteudoRoleta>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const [fase, setFase] = useState<Fase>('parada')

  /**
   * Espelho de pose: o cronômetro do alongamento só anda depois que a
   * criança entra na posição. Item sem `verificacao` já nasce liberado, e
   * câmera indisponível libera na hora — o alongamento nunca fica preso
   * atrás da câmera.
   */
  const [liberado, setLiberado] = useState(false)
  const [semCamera, setSemCamera] = useState(false)
  const [sorteado, setSorteado] = useState<number | null>(null)
  const [rodada, setRodada] = useState(0)
  const [angulo, setAngulo] = useState(0)
  /** Já sorteado, revelado só quando a roda para. */
  const pendente = useRef<number | null>(null)

  /**
   * Em ref, não em state: dois toques no mesmo tick enxergam o mesmo
   * `fase` do closure, e duas animações concorrentes deixavam a roleta
   * sem item sorteado — a tela ficava sem nenhum botão para continuar.
   */
  const girando = useRef(false)

  const fatia = 360 / conteudo.itens.length
  const item = sorteado === null ? null : conteudo.itens[sorteado]

  /**
   * Com `prefers-reduced-motion: reduce` a roda não gira — ela salta
   * direto para o resultado. Sem isto a criança encara 3,4 s de tela
   * parada esperando um giro que nunca acontece.
   */
  const segundosDeGiro = movimentoReduzido() ? 0 : 3.4

  function girar() {
    if (girando.current) return
    girando.current = true

    const alvo = Math.floor(Math.random() * conteudo.itens.length)
    pendente.current = alvo
    setFase('girando')
    setAngulo((a) => anguloParaParar(a, alvo, conteudo.itens.length))
  }

  /**
   * O resultado sai por relógio, não por callback de animação.
   *
   * Callback de animação não chega quando o movimento está reduzido, nem
   * quando a aba está em segundo plano — e a criança ficaria presa numa
   * tela sem nenhum botão. Um temporizador sempre chega.
   */
  useEffect(() => {
    if (fase !== 'girando') return
    const id = setTimeout(revelar, segundosDeGiro * 1000 + 120)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, angulo])

  function revelar() {
    if (pendente.current === null) return
    const alvo = pendente.current
    pendente.current = null

    setSorteado(alvo)
    setFase('executando')
    if (narracaoLigada) narrar(`${conteudo.itens[alvo].rotulo}. ${conteudo.itens[alvo].instrucao}`)
    setLiberado(!conteudo.itens[alvo].verificacao)
    setSemCamera(false)
  }

  function concluirRodada() {
    // O cronômetro e o botão "Já fiz!" podem cair juntos.
    if (!girando.current) return
    girando.current = false

    const feitas = rodada + 1
    setRodada(feitas)
    setSorteado(null)

    if (feitas >= conteudo.rodadas) {
      celebrarConclusao()
      aoConcluir({ acertos: feitas, total: conteudo.rodadas })
    } else {
      setFase('parada')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Enunciado texto={conteudo.instrucao} chave={conteudo.id} />

      <p className="font-display text-xl font-bold text-tinta-400">
        Alongamento {Math.min(rodada + 1, conteudo.rodadas)} de {conteudo.rodadas}
      </p>

      <div className="relative w-full max-w-md">
        {/* ponteiro */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1 text-4xl drop-shadow"
        >
          🔻
        </div>

        {/* Transição em CSS puro, num <div>, por dois motivos:
            o atributo `transform` do <svg> raiz é ignorado pelos
            navegadores, e o Motion pula animações de transform quando o
            movimento está reduzido — nos dois casos a roda não girava. */}
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
          aria-label={`Roleta com ${conteudo.itens.length} alongamentos`}
        >
          {conteudo.itens.map((it, i) => {
            const sprite = urlDoSprite(it.imagem)
            return (
              <g key={it.id}>
                <path d={caminhoDaFatia(i, fatia)} fill={CORES[i % CORES.length]} stroke="white" strokeWidth="2" />
                <g transform={posicaoDoRotulo(i, fatia)}>
                  {sprite ? (
                    // A fatia é pequena: o desenho precisa de fundo claro
                    // atrás para não sumir sobre as cores fortes da roleta.
                    <>
                      <circle r="17" fill="white" opacity="0.9" />
                      <image href={sprite} x={-15} y={-15} width={30} height={30} />
                    </>
                  ) : (
                    <text textAnchor="middle" dominantBaseline="central" fontSize="18">
                      {it.emoji ?? '🤸'}
                    </text>
                  )}
                </g>
              </g>
            )
          })}
          <circle cx="0" cy="0" r="26" fill="white" stroke="var(--color-ceu-200)" strokeWidth="4" />
        </svg>
        </div>
      </div>

      {fase !== 'executando' && (
        <Botao cor="coral" tamanho="grande" disabled={fase === 'girando'} onClick={girar}>
          {fase === 'girando' ? 'Girando…' : 'GIRAR'}
        </Botao>
      )}

      {fase === 'executando' && item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full flex-col items-center gap-4 rounded-bolha border-4 border-folha-400 bg-folha-100 p-6 text-center"
        >
          {urlDoSprite(item.imagem) ? (
            <img
              src={urlDoSprite(item.imagem)}
              alt=""
              draggable={false}
              className="h-40 w-40 select-none object-contain"
            />
          ) : (
            <span aria-hidden="true" className="text-7xl">
              {item.emoji ?? '🤸'}
            </span>
          )}
          <h3 className="text-3xl text-folha-600">{item.rotulo}</h3>
          <p className="max-w-lg text-xl text-tinta-600">{item.instrucao}</p>

          {item.verificacao && !liberado && (
            <EspelhoDePose
              verificacao={item.verificacao}
              aoConfirmar={() => setLiberado(true)}
              aoIndisponivel={() => {
                setSemCamera(true)
                setLiberado(true)
              }}
            />
          )}

          <Cronometro
            segundos={item.segundos}
            chave={`${rodada}-${item.id}-${liberado}`}
            pausado={!liberado}
            aoTerminar={concluirRodada}
          />

          {semCamera && item.verificacao && (
            <p className="text-sm text-tinta-500">
              Sem câmera aqui — faça o alongamento e a professora confere.
            </p>
          )}

          <Botao cor="ceu" onClick={concluirRodada}>
            Já fiz!
          </Botao>
        </motion.div>
      )}
    </div>
  )
}

