import { Link } from 'react-router'
import { ANOS, COR_DO_ANO, TITULO_DO_ANO, atividadesDoAno } from '@/dominio/catalogo'
import { usarPerfil } from '@/store/usarPerfil'
import { cn } from '@/design/cn'

const FUNDO: Record<string, string> = {
  ceu: 'bg-ceu-400 border-ceu-600',
  folha: 'bg-folha-400 border-folha-600',
  sol: 'bg-sol-400 border-sol-600 text-tinta-900',
  coral: 'bg-coral-400 border-coral-600',
  uva: 'bg-uva-400 border-uva-600',
}

/** Tela 4 do mockup: a lista dos cinco anos. */
export function Atividades() {
  const anoDoAluno = usarPerfil((e) => e.perfil.ano)
  const progresso = usarPerfil((e) => e.progresso)

  return (
    <div className="flex flex-col gap-6 py-4">
      <h1 className="text-4xl uppercase text-ceu-600">Atividades</h1>

      <ul className="flex flex-col gap-4">
        {ANOS.map((ano) => {
          const atividades = atividadesDoAno(ano)
          const concluidas = atividades.filter((a) => progresso[a.id]).length
          const disponiveis = atividades.filter((a) => a.disponivel).length

          return (
            <li key={ano}>
              <Link
                to={`/atividades/${ano}`}
                className={cn(
                  'flex min-h-[6rem] items-center gap-5 rounded-bolha border-b-[6px] px-6 py-4 text-white',
                  'transition-all duration-100 ease-pulo active:translate-y-[6px] active:border-b-0',
                  FUNDO[COR_DO_ANO[ano]],
                )}
              >
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white/25 font-display text-3xl font-extrabold">
                  {ano}º
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-display text-2xl font-extrabold leading-tight">
                    {ano}º ano — {TITULO_DO_ANO[ano]}
                  </span>
                  <span className="text-base font-medium opacity-90">
                    {concluidas} de {atividades.length} concluídas
                    {disponiveis < atividades.length && ` · ${disponiveis} liberadas`}
                  </span>
                </span>
                {anoDoAluno === ano && (
                  <span className="rounded-full bg-white/25 px-4 py-1 text-sm font-bold uppercase">
                    Seu ano
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
