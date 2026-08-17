import { motion } from 'framer-motion'
import { FIGURINHAS } from '@/dominio/figurinhas'
import { urlDoSprite } from '@/assets/registro'
import { movimentoReduzido } from '@/lib/movimento'
import { cn } from './cn'

interface AlbumProps {
  coletadas: readonly string[]
}

/**
 * O álbum de figurinhas.
 *
 * Os lugares vazios ficam visíveis de propósito. É o buraco no álbum que faz a
 * criança querer voltar — um álbum que só mostra o que já se tem não convida a
 * nada. Cada slot vazio guarda a silhueta da figurinha que falta, para o
 * "quero aquela" ter alvo.
 */
export function Album({ coletadas }: AlbumProps) {
  const semMovimento = movimentoReduzido()

  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <h2 className="text-2xl uppercase text-uva-500">Álbum de figurinhas</h2>
        <p className="font-display text-lg font-bold text-tinta-400">
          {coletadas.length} de {FIGURINHAS.length}
        </p>
      </header>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {FIGURINHAS.map((f, i) => {
          const tem = coletadas.includes(f.id)
          return (
            <li key={f.id}>
              <motion.div
                initial={semMovimento || !tem ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 240, damping: 15 }}
                className={cn(
                  'grid aspect-square place-items-center rounded-bolha border-4 p-2',
                  tem ? 'border-white bg-white shadow-flutuante' : 'border-dashed border-ceu-200 bg-ceu-50',
                )}
                style={tem ? { backgroundColor: `${f.cor}22` } : undefined}
              >
                <img
                  src={urlDoSprite(f.imagem)}
                  alt={tem ? f.rotulo : `${f.rotulo}, ainda não conquistada`}
                  draggable={false}
                  className={cn(
                    'h-full w-full select-none object-contain transition-all',
                    // Vazio vira silhueta: dá para reconhecer o que falta sem
                    // entregar a figurinha antes da hora.
                    !tem && 'opacity-25 grayscale',
                  )}
                />
              </motion.div>
            </li>
          )
        })}
      </ul>

      {coletadas.length === FIGURINHAS.length && (
        <p className="rounded-bolha bg-sol-100 p-4 text-center font-display text-lg font-bold text-sol-600">
          Álbum completo! Você coletou todas as figurinhas 🏆
        </p>
      )}
    </section>
  )
}
