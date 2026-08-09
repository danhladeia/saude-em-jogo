import { motion } from 'framer-motion'
import { cn } from './cn'

interface EstrelaProps {
  /** Estrela conquistada (dourada) ou ainda vazia (contorno). */
  cheia?: boolean
  /** Atraso da animação de entrada, em segundos. */
  atraso?: number
  className?: string
}

/**
 * A moeda do app inteiro. A tela "Minhas Conquistas" do mockup diz
 * literalmente: "Cada desafio cumprido ganha uma estrela".
 */
export function Estrela({ cheia = false, atraso = 0, className }: EstrelaProps) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('h-10 w-10 shrink-0', className)}
      initial={cheia ? { scale: 0, rotate: -45 } : false}
      animate={cheia ? { scale: 1, rotate: 0 } : undefined}
      transition={{ delay: atraso, type: 'spring', stiffness: 260, damping: 14 }}
    >
      <path
        d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.35 6.2 20.4l1.1-6.45-4.7-4.6 6.5-.95z"
        fill={cheia ? 'var(--color-sol-400)' : 'transparent'}
        stroke={cheia ? 'var(--color-sol-600)' : 'var(--color-ceu-200)'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

interface FileiraDeEstrelasProps {
  ganhas: number
  total?: number
  className?: string
}

export function FileiraDeEstrelas({ ganhas, total = 3, className }: FileiraDeEstrelasProps) {
  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="img"
      aria-label={`${ganhas} de ${total} estrelas`}
    >
      {Array.from({ length: total }, (_, i) => (
        <Estrela key={i} cheia={i < ganhas} atraso={i * 0.15} />
      ))}
    </div>
  )
}
