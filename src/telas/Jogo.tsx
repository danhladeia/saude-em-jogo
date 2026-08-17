import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import type { ConteudoDeJogo } from '@/content/schemas'
import { carregarConteudo } from '@/content/registro'
import { acharAtividade } from '@/dominio/catalogo'
import { estrelasPara, type ResultadoDeJogo } from '@/engines/tipos'
import { CorpoAtivo } from '@/engines/comuns/CorpoAtivo'
import { usarPerfil } from '@/store/usarPerfil'
import { Botao } from '@/design/Botao'
import { Card } from '@/design/Card'
import { Mascote } from '@/design/Mascote'
import { RoletaDeRecompensa } from '@/design/RoletaDeRecompensa'
import { FileiraDeEstrelas } from '@/design/Estrela'
import { celebrarConclusao } from '@/design/celebrar'
import { calar, narrar } from '@/lib/narracao'

/**
 * Motores carregados sob demanda.
 *
 * O dnd-kit só desce quando a criança abre um jogo de arrastar — abrir o
 * menu não deve custar código de arraste numa máquina de laboratório.
 */
const MotorQuiz = lazy(() => import('@/engines/quiz/MotorQuiz').then((m) => ({ default: m.MotorQuiz })))
const MotorArrastarAlvo = lazy(() =>
  import('@/engines/arrastar-alvo/MotorArrastarAlvo').then((m) => ({ default: m.MotorArrastarAlvo })),
)
const MotorAssociacao = lazy(() =>
  import('@/engines/associacao/MotorAssociacao').then((m) => ({ default: m.MotorAssociacao })),
)
const MotorRoleta = lazy(() =>
  import('@/engines/roleta/MotorRoleta').then((m) => ({ default: m.MotorRoleta })),
)
const MotorCorpoAtivo = lazy(() =>
  import('@/engines/corpo-ativo/MotorCorpoAtivo').then((m) => ({ default: m.MotorCorpoAtivo })),
)

type Etapa = 'carregando' | 'jogando' | 'corpo-ativo' | 'resultado' | 'recompensa' | 'erro'

export function Jogo() {
  const { atividadeId } = useParams()
  const navegar = useNavigate()
  const registrarConclusao = usarPerfil((e) => e.registrarConclusao)
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const [conteudo, setConteudo] = useState<ConteudoDeJogo | null>(null)
  const [etapa, setEtapa] = useState<Etapa>('carregando')
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState<ResultadoDeJogo>({ acertos: 0, total: 0 })
  const inicio = useRef(Date.now())
  /**
   * Ponto único de saída de qualquer motor. Cada motor já se protege
   * internamente, mas a conclusão grava progresso — vale travar aqui
   * também para que nenhum motor futuro consiga registrar em duplicata.
   */
  const jaFinalizou = useRef(false)

  const atividade = atividadeId ? acharAtividade(atividadeId) : undefined

  useEffect(() => {
    if (!atividadeId) return
    let ativo = true

    carregarConteudo(atividadeId)
      .then((c) => {
        if (!ativo) return
        setConteudo(c)
        setEtapa('jogando')
        inicio.current = Date.now()
      })
      .catch((e: unknown) => {
        if (!ativo) return
        setErro(e instanceof Error ? e.message : String(e))
        setEtapa('erro')
      })

    return () => {
      ativo = false
      calar()
    }
  }, [atividadeId])

  if (!atividade) return <Navigate to="/atividades" replace />

  function terminarJogo(r: ResultadoDeJogo) {
    if (jaFinalizou.current) return
    setResultado(r)
    // O bloco de movimento vem depois da parte de tela — o corpo fecha a
    // atividade, não o clique.
    if (conteudo?.corpoAtivo) setEtapa('corpo-ativo')
    else finalizar(r)
  }

  function finalizar(r: ResultadoDeJogo) {
    if (jaFinalizou.current) return
    jaFinalizou.current = true

    const estrelas = estrelasPara(r)
    registrarConclusao({
      atividadeId: atividade!.id,
      estrelas,
      acertos: r.acertos,
      total: r.total,
      concluidoEm: new Date().toISOString(),
      duracaoSegundos: Math.round((Date.now() - inicio.current) / 1000),
    })
    celebrarConclusao()
    setEtapa('resultado')
    if (narracaoLigada) narrar(`Muito bem! Você ganhou ${estrelas} ${estrelas === 1 ? 'estrela' : 'estrelas'}.`)
  }

  return (
    <div className="fundo-ceu min-h-dvh">
      <header className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-3 sm:px-8">
        <button
          onClick={() => {
            calar()
            navegar(`/atividades/${atividade.ano}`)
          }}
          aria-label="Sair da atividade"
          className="grid size-toque place-items-center rounded-full border-b-[5px] border-ceu-600 bg-ceu-400 text-3xl text-white active:translate-y-[5px] active:border-b-0"
        >
          ✕
        </button>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold uppercase text-ceu-500">
            {atividade.ano}º ano · Semana {atividade.semana}
          </p>
          <h1 className="truncate text-2xl">{atividade.jogo}</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-8">
        {etapa === 'carregando' && <p className="py-20 text-center text-xl">Preparando o jogo…</p>}

        {etapa === 'erro' && (
          <Card className="mt-8">
            <h2 className="mb-2 text-2xl text-coral-500">Este jogo ainda não está pronto</h2>
            <p className="mb-4 text-tinta-600">{erro}</p>
            <Botao cor="ceu" onClick={() => navegar(`/atividades/${atividade.ano}`)}>
              Voltar
            </Botao>
          </Card>
        )}

        {etapa === 'jogando' && conteudo && (
          <Suspense fallback={<p className="py-20 text-center text-xl">Preparando o jogo…</p>}>
            <Motor conteudo={conteudo} aoConcluir={terminarJogo} />
          </Suspense>
        )}

        {etapa === 'corpo-ativo' && conteudo?.corpoAtivo && (
          <CorpoAtivo bloco={conteudo.corpoAtivo} aoConcluir={() => finalizar(resultado)} />
        )}

        {etapa === 'resultado' && (
          <Resultado
            resultado={resultado}
            aoGirar={() => setEtapa('recompensa')}
            aoRepetir={() => {
              setResultado({ acertos: 0, total: 0 })
              inicio.current = Date.now()
              jaFinalizou.current = false
              setEtapa('jogando')
            }}
            aoSair={() => navegar(`/atividades/${atividade.ano}`)}
          />
        )}

        {etapa === 'recompensa' && (
          <Card className="mx-auto mt-8 max-w-xl">
            <RoletaDeRecompensa aoTerminar={() => navegar('/conquistas')} />
          </Card>
        )}
      </main>
    </div>
  )
}

/** Despacho por motor. O `motor` do JSON escolhe o componente. */
function Motor({
  conteudo,
  aoConcluir,
}: {
  conteudo: ConteudoDeJogo
  aoConcluir: (r: ResultadoDeJogo) => void
}) {
  switch (conteudo.motor) {
    case 'quiz':
      return <MotorQuiz conteudo={conteudo} aoConcluir={aoConcluir} />
    case 'arrastar-alvo':
      return <MotorArrastarAlvo conteudo={conteudo} aoConcluir={aoConcluir} />
    case 'associacao':
      return <MotorAssociacao conteudo={conteudo} aoConcluir={aoConcluir} />
    case 'roleta':
      return <MotorRoleta conteudo={conteudo} aoConcluir={aoConcluir} />
    case 'corpo-ativo':
      return <MotorCorpoAtivo conteudo={conteudo} aoConcluir={aoConcluir} />
  }
}

function Resultado({
  resultado,
  aoGirar,
  aoRepetir,
  aoSair,
}: {
  resultado: ResultadoDeJogo
  aoGirar: () => void
  aoRepetir: () => void
  aoSair: () => void
}) {
  const estrelas = estrelasPara(resultado)

  return (
    <Card className="mx-auto mt-8 max-w-xl">
      <div className="flex flex-col items-center gap-5 text-center">
        <Mascote humor="comemorando" className="h-36" />
        <h2 className="text-4xl text-folha-600">Muito bem!</h2>
        <FileiraDeEstrelas ganhas={estrelas} />
        <p className="text-xl text-tinta-600">
          Você acertou {resultado.acertos} de {resultado.total}.
        </p>

        {/* O giro é a recompensa da atividade, então vem antes das outras
            saídas — é o que a criança quer fazer agora. */}
        <Botao cor="uva" tamanho="grande" largo onClick={aoGirar}>
          🎁 Girar a roleta de figurinhas
        </Botao>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Botao cor="neutro" largo onClick={aoRepetir}>
            Jogar de novo
          </Botao>
          <Botao cor="neutro" largo onClick={aoSair}>
            Voltar
          </Botao>
        </div>
      </div>
    </Card>
  )
}
