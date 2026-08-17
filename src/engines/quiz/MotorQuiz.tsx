import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConteudoQuiz } from '@/content/schemas'
import type { PropsDeMotor } from '../tipos'
import { Enunciado } from '../comuns/Enunciado'
import { Figura } from '../comuns/Figura'
import { PeleDeFeedback } from '../comuns/PeleDeFeedback'
import { Botao } from '@/design/Botao'
import { celebrarAcerto } from '@/design/celebrar'
import { narrar } from '@/lib/narracao'
import { usarPerfil } from '@/store/usarPerfil'
import { urlDoSprite } from '@/assets/registro'
import { cn } from '@/design/cn'

type Fase = 'respondendo' | 'conferindo'

/**
 * Motor de quiz ilustrado — atende 5 dos 20 jogos do documento:
 * Jogo de escolhas, Movimente-se, Equilibrista mirim, Água em jogo e
 * Corpos do mundo.
 *
 * Suporta resposta única e múltipla (Movimente-se pede "marque quais são
 * as atividades físicas") e três peles de feedback.
 */
export function MotorQuiz({ conteudo, aoConcluir }: PropsDeMotor<ConteudoQuiz>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)
  const personagem = usarPerfil((e) => e.perfil.personagem)

  const [indice, setIndice] = useState(0)
  const [fase, setFase] = useState<Fase>('respondendo')
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set())
  const [acertos, setAcertos] = useState(0)
  const [acertouAtual, setAcertouAtual] = useState(false)

  /**
   * Guardas em ref, não em state.
   *
   * Criança toca duas vezes, e os dois cliques caem no MESMO tick: o
   * `fase` capturado pelo closure ainda vale 'respondendo' no segundo
   * clique, então um guard baseado em state deixa passar — contando o
   * acerto duas vezes e pulando uma pergunta. Ref atualiza na hora.
   */
  const conferindo = useRef(false)
  const finalizando = useRef(false)

  const pergunta = conteudo.perguntas[indice]
  const ultima = indice === conteudo.perguntas.length - 1

  const corretas = useMemo(
    () => new Set(pergunta.opcoes.filter((o) => o.correta).map((o) => o.id)),
    [pergunta],
  )

  function alternar(id: string) {
    if (conferindo.current) return

    if (pergunta.tipo === 'unica') {
      conferir(new Set([id]))
      return
    }

    const proxima = new Set(selecionadas)
    if (proxima.has(id)) proxima.delete(id)
    else proxima.add(id)
    setSelecionadas(proxima)
  }

  function conferir(escolha: Set<string>) {
    if (conferindo.current) return
    conferindo.current = true

    const certo =
      escolha.size === corretas.size && [...escolha].every((id) => corretas.has(id))

    setSelecionadas(escolha)
    setAcertouAtual(certo)
    setFase('conferindo')

    if (certo) {
      setAcertos((n) => n + 1)
      celebrarAcerto()
      if (narracaoLigada) narrar(pergunta.explicacao ?? 'Isso mesmo!')
    } else if (narracaoLigada) {
      // Nunca só "errou": a criança precisa sair sabendo qual era a certa.
      const nomes = pergunta.opcoes.filter((o) => o.correta).map((o) => o.rotulo)
      narrar(pergunta.explicacao ?? `Quase! A resposta certa é ${nomes.join(', ')}.`)
    }
  }

  function avancar() {
    if (!conferindo.current || finalizando.current) return

    if (ultima) {
      finalizando.current = true
      // `acertos` já contabilizou esta pergunta em `conferir`.
      aoConcluir({ acertos, total: conteudo.perguntas.length })
      return
    }

    conferindo.current = false
    setIndice((i) => Math.min(i + 1, conteudo.perguntas.length - 1))
    setSelecionadas(new Set())
    setFase('respondendo')
  }

  return (
    <div className="flex flex-col gap-6">
      <Progresso atual={indice + 1} total={conteudo.perguntas.length} />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
        <PeleDeFeedback
          pele={conteudo.feedback}
          estado={fase === 'respondendo' ? 'neutro' : acertouAtual ? 'acerto' : 'erro'}
          acertos={acertos}
          total={conteudo.perguntas.length}
        />
      </div>

      {/* Sem AnimatePresence de propósito: com mode="wait" uma troca rápida
          de pergunta pode deixar o nó antigo preso na tela, e correção não
          pode depender de timing de animação. A entrada por `key` basta. */}
      <div className="contents">
        <motion.div
          key={pergunta.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <Enunciado texto={pergunta.enunciado} chave={pergunta.id} />

          {urlDoSprite(pergunta.imagem, personagem) && (
            <img
              src={urlDoSprite(pergunta.imagem, personagem)}
              alt=""
              draggable={false}
              className="mx-auto max-h-56 w-auto select-none object-contain"
            />
          )}

          <ul
            className={cn(
              'grid gap-4',
              pergunta.opcoes.length <= 3 ? 'sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4',
            )}
          >
            {pergunta.opcoes.map((opcao) => {
              const escolhida = selecionadas.has(opcao.id)
              const revelando = fase === 'conferindo'
              const marcarCerta = revelando && opcao.correta
              const marcarErrada = revelando && escolhida && !opcao.correta

              return (
                <li key={opcao.id}>
                  <button
                    type="button"
                    onClick={() => alternar(opcao.id)}
                    disabled={revelando}
                    aria-pressed={escolhida}
                    className={cn(
                      'flex min-h-[9rem] w-full flex-col items-center justify-center gap-2 rounded-bolha border-4 bg-white p-4',
                      'transition-all duration-150 disabled:opacity-100',
                      !revelando && escolhida && 'border-ceu-400 bg-ceu-50 ring-4 ring-ceu-200',
                      !revelando && !escolhida && 'border-ceu-100 hover:border-ceu-300',
                      marcarCerta && 'border-folha-400 bg-folha-100',
                      marcarErrada && 'border-coral-400 bg-coral-100',
                      revelando && !marcarCerta && !marcarErrada && 'opacity-50',
                    )}
                  >
                    <Figura item={opcao} />
                    {marcarCerta && (
                      <span aria-label="Resposta correta" className="text-2xl">
                        ✅
                      </span>
                    )}
                    {marcarErrada && (
                      <span aria-label="Resposta incorreta" className="text-2xl">
                        ❌
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {pergunta.tipo === 'multipla' && fase === 'respondendo' && (
            <Botao
              cor="folha"
              tamanho="grande"
              largo
              disabled={selecionadas.size === 0}
              onClick={() => conferir(selecionadas)}
            >
              Conferir
            </Botao>
          )}

          {fase === 'conferindo' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <p
                className={cn(
                  'rounded-bolha p-5 text-center font-display text-xl font-bold',
                  acertouAtual ? 'bg-folha-100 text-folha-600' : 'bg-sol-100 text-sol-600',
                )}
                role="status"
              >
                {acertouAtual ? 'Isso mesmo! 🎉' : 'Quase! Olha a resposta certa. 💡'}
                {pergunta.explicacao && (
                  <span className="mt-2 block text-lg font-medium text-tinta-600">
                    {pergunta.explicacao}
                  </span>
                )}
              </p>

              <Botao cor="ceu" tamanho="grande" largo onClick={avancar}>
                {ultima ? 'Terminar' : 'Próxima'}
              </Botao>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function Progresso({ atual, total }: { atual: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-ceu-100">
        <motion.div
          className="h-full rounded-full bg-ceu-400"
          animate={{ width: `${(atual / total) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <span className="font-display text-lg font-bold text-tinta-400">
        {atual}/{total}
      </span>
    </div>
  )
}
