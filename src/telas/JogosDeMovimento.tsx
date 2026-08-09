import { useState } from 'react'
import { SESSOES_DE_MOVIMENTO } from '@/content/movimento'
import { CorpoAtivo } from '@/engines/comuns/CorpoAtivo'
import { Botao } from '@/design/Botao'
import { Mascote } from '@/design/Mascote'
import { cn } from '@/design/cn'

/**
 * Tela 5 do mockup: ALONGAMENTOS e MOVIMENTOS CORPORAIS.
 *
 * Diferente das Atividades, aqui não há avaliação nem estrela — é a
 * seção "solta", que a professora pode abrir a qualquer momento da aula
 * para tirar a turma da cadeira. O conteúdo vive em @/content/movimento.
 */
export function JogosDeMovimento() {
  const [ativa, setAtiva] = useState<string | null>(null)
  const [feita, setFeita] = useState(false)

  const sessao = SESSOES_DE_MOVIMENTO.find((s) => s.id === ativa)

  if (sessao && !feita) {
    return (
      <div className="py-4">
        <CorpoAtivo bloco={sessao.bloco} aoConcluir={() => setFeita(true)} />
      </div>
    )
  }

  if (sessao && feita) {
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <Mascote humor="comemorando" className="h-36" />
        <h2 className="text-4xl text-folha-600">Muito bem!</h2>
        <p className="max-w-md text-xl text-tinta-600">Quem se movimenta, se cuida!</p>
        <Botao
          cor="ceu"
          tamanho="grande"
          onClick={() => {
            setAtiva(null)
            setFeita(false)
          }}
        >
          Voltar
        </Botao>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <h1 className="text-4xl uppercase text-folha-500">Jogos de Movimento</h1>

      <ul className="grid gap-4 sm:grid-cols-2">
        {SESSOES_DE_MOVIMENTO.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setAtiva(s.id)}
              className={cn(
                'flex min-h-[8rem] w-full flex-col items-center justify-center gap-2 rounded-bolha border-b-[6px] p-6 text-white',
                'transition-all duration-100 active:translate-y-[6px] active:border-b-0',
                s.cor,
              )}
            >
              <span aria-hidden="true" className="text-6xl">
                {s.emoji}
              </span>
              <span className="font-display text-2xl font-extrabold uppercase">{s.rotulo}</span>
              <span className="text-base opacity-90">{s.bloco.passos.length} movimentos</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
