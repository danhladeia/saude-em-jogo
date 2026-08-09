import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TEMAS_DE_DICA, falaDoTema } from '@/content/dicas'
import { narrar } from '@/lib/narracao'
import { cn } from '@/design/cn'

/** Tela 7 do mockup. O conteúdo vive em @/content/dicas. */
export function DicasDeSaude() {
  const [aberto, setAberto] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 py-4">
      <h1 className="text-4xl uppercase text-uva-500">Dicas de Saúde</h1>

      <ul className="grid gap-4 sm:grid-cols-2">
        {TEMAS_DE_DICA.map((tema) => {
          const expandido = aberto === tema.id
          return (
            <li key={tema.id}>
              <button
                type="button"
                onClick={() => {
                  const proximo = expandido ? null : tema.id
                  setAberto(proximo)
                  if (proximo) narrar(falaDoTema(tema))
                }}
                aria-expanded={expandido}
                className={cn(
                  'flex min-h-[6rem] w-full items-center gap-4 rounded-bolha border-b-[6px] px-6 py-4 text-white',
                  'transition-all duration-100 active:translate-y-[6px] active:border-b-0',
                  tema.cor,
                )}
              >
                <span aria-hidden="true" className="text-5xl">
                  {tema.emoji}
                </span>
                <span className="flex-1 text-left font-display text-2xl font-extrabold uppercase">
                  {tema.rotulo}
                </span>
                <span aria-hidden="true" className="text-2xl">
                  {expandido ? '▲' : '▼'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {expandido && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex flex-col gap-3 rounded-bolha bg-white p-5">
                      {tema.dicas.map((dica) => (
                        <li key={dica} className="flex gap-3 text-lg">
                          <span aria-hidden="true">✅</span>
                          <span>{dica}</span>
                        </li>
                      ))}
                    </div>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
