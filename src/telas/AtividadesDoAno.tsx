import { Link, Navigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { TITULO_DO_ANO, UNIDADE_DO_ANO, atividadesDoAno } from '@/dominio/catalogo'
import { usarPerfil } from '@/store/usarPerfil'
import { FileiraDeEstrelas } from '@/design/Estrela'
import { cn } from '@/design/cn'
import type { Ano } from '@/dominio/tipos'

/** As quatro semanas da intervenção, para o ano escolhido. */
export function AtividadesDoAno() {
  const { ano: parametro } = useParams()
  const progresso = usarPerfil((e) => e.progresso)

  const ano = Number(parametro) as Ano
  if (!Number.isInteger(ano) || ano < 1 || ano > 5) return <Navigate to="/atividades" replace />

  const atividades = atividadesDoAno(ano)

  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <p className="font-display text-lg font-bold uppercase tracking-wide text-ceu-500">
          {ano}º ano — {TITULO_DO_ANO[ano]}
        </p>
        <h1 className="text-3xl text-tinta-900">{UNIDADE_DO_ANO[ano]}</h1>
      </header>

      <ol className="flex flex-col gap-4">
        {atividades.map((atividade, i) => {
          const registro = progresso[atividade.id]
          const bloqueada = !atividade.disponivel

          const conteudo = (
            <>
              <span
                className={cn(
                  'grid size-16 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold leading-none',
                  bloqueada ? 'bg-ceu-100 text-tinta-400' : 'bg-ceu-400 text-white',
                )}
              >
                <span className="text-xs font-bold uppercase">Sem.</span>
                {atividade.semana}
              </span>

              <span className="flex flex-1 flex-col gap-1">
                <span className="font-display text-xl font-extrabold leading-tight">
                  {atividade.jogo}
                </span>
                <span className="text-sm font-medium text-tinta-400">{atividade.tema}</span>
                {registro && <FileiraDeEstrelas ganhas={registro.estrelas} className="mt-1" />}
              </span>

              {bloqueada ? (
                <span className="shrink-0 rounded-full bg-ceu-100 px-4 py-2 text-sm font-bold text-tinta-400">
                  Em breve
                </span>
              ) : (
                <span aria-hidden="true" className="shrink-0 text-3xl">
                  ▶
                </span>
              )}
            </>
          )

          const estilo =
            'flex min-h-[6rem] items-center gap-5 rounded-bolha border-4 bg-white px-5 py-4 text-left'

          return (
            <motion.li
              key={atividade.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              {bloqueada ? (
                <div className={cn(estilo, 'border-ceu-100 opacity-70')} aria-disabled="true">
                  {conteudo}
                </div>
              ) : (
                <Link
                  to={`/jogo/${atividade.id}`}
                  className={cn(
                    estilo,
                    'border-ceu-200 shadow-flutuante transition-transform hover:border-ceu-400 active:scale-[0.98]',
                  )}
                >
                  {conteudo}
                </Link>
              )}
            </motion.li>
          )
        })}
      </ol>
    </div>
  )
}
