import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import bruto from '@/content/questionario/perguntas.json'
import { ConteudoQuestionario, pontuacaoMaxima } from '@/content/questionario/schema'
import { usarPerfil } from '@/store/usarPerfil'
import { Botao } from '@/design/Botao'
import { Card } from '@/design/Card'
import { Mascote } from '@/design/Mascote'
import { Enunciado } from '@/engines/comuns/Enunciado'
import { celebrarConclusao } from '@/design/celebrar'
import { cn } from '@/design/cn'

const CONTEUDO = ConteudoQuestionario.parse(bruto)
const MAXIMO = pontuacaoMaxima(CONTEUDO)

/**
 * O questionário pré e pós da intervenção — o instrumento de medida da
 * dissertação.
 *
 * Não é jogo: sem estrela, sem figurinha, sem certo e errado na tela. A
 * criança precisa responder o que ela realmente faz, e qualquer sinal de
 * "resposta premiada" enviesaria o dado que a pesquisa vai analisar.
 */
export function Questionario() {
  const { momento } = useParams()
  const navegar = useNavigate()
  const nome = usarPerfil((e) => e.perfil.nome)
  const salvar = usarPerfil((e) => e.salvarQuestionario)

  const [indice, setIndice] = useState(0)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [terminou, setTerminou] = useState(false)

  if (momento !== 'pre' && momento !== 'pos') return <Navigate to="/menu" replace />
  if (!nome) return <Navigate to="/nome" replace />

  const pergunta = CONTEUDO.perguntas[indice]
  const ultima = indice === CONTEUDO.perguntas.length - 1

  function responder(opcaoId: string) {
    const novas = { ...respostas, [pergunta.id]: opcaoId }
    setRespostas(novas)

    if (!ultima) {
      setIndice((i) => i + 1)
      return
    }

    const pontos = CONTEUDO.perguntas.reduce((soma, p) => {
      const escolhida = p.opcoes.find((o) => o.id === novas[p.id])
      return soma + (escolhida?.valor ?? 0)
    }, 0)

    salvar(momento as 'pre' | 'pos', {
      respostas: novas,
      pontos,
      maximo: MAXIMO,
      respondidoEm: new Date().toISOString(),
    })
    celebrarConclusao()
    setTerminou(true)
  }

  if (terminou) {
    return (
      <div className="fundo-ceu flex min-h-dvh items-center justify-center px-4">
        <Card className="max-w-lg text-center">
          <div className="flex flex-col items-center gap-5">
            <Mascote humor="comemorando" className="h-36" />
            <h2 className="text-4xl text-folha-600">Obrigado, {nome}!</h2>
            <p className="text-xl text-tinta-600">
              Suas respostas foram guardadas. Agora é hora de jogar!
            </p>
            <Botao cor="folha" tamanho="grande" onClick={() => navegar('/menu')}>
              Ir para os jogos
            </Botao>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fundo-ceu min-h-dvh px-4 py-6">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="text-center">
          <p className="font-display text-sm font-bold uppercase tracking-wide text-ceu-500">
            {momento === 'pre' ? 'Antes de começar' : 'Depois das quatro semanas'}
          </p>
          <h1 className="text-3xl text-tinta-900">{CONTEUDO.titulo}</h1>
          <p className="mt-1 text-tinta-600">{CONTEUDO.instrucao}</p>
        </header>

        <div className="flex items-center gap-3">
          <div className="h-4 flex-1 overflow-hidden rounded-full bg-ceu-100">
            <motion.div
              className="h-full rounded-full bg-ceu-400"
              animate={{ width: `${((indice + 1) / CONTEUDO.perguntas.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="font-display text-lg font-bold text-tinta-400">
            {indice + 1}/{CONTEUDO.perguntas.length}
          </span>
        </div>

        <motion.div
          key={pergunta.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-6"
        >
          <Enunciado texto={pergunta.enunciado} chave={pergunta.id} />

          <ul className="grid gap-3 sm:grid-cols-2">
            {pergunta.opcoes.map((opcao) => (
              <li key={opcao.id}>
                <button
                  type="button"
                  onClick={() => responder(opcao.id)}
                  className={cn(
                    'flex min-h-toque w-full items-center gap-4 rounded-bolha border-4 border-ceu-200 bg-white px-5 py-4',
                    'text-left transition-colors hover:border-ceu-400',
                  )}
                >
                  {opcao.emoji && (
                    <span aria-hidden="true" className="text-4xl">
                      {opcao.emoji}
                    </span>
                  )}
                  <span className="font-display text-xl font-bold">{opcao.rotulo}</span>
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </main>
    </div>
  )
}
