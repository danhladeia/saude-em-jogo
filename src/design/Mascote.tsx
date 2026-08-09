import { motion } from 'framer-motion'
import { cn } from './cn'
import { movimentoReduzido } from '@/lib/movimento'

import parado from '@/assets/library/personagem/parado.webp'
import acenando from '@/assets/library/personagem/acenando.webp'
import comemorando from '@/assets/library/personagem/comemorando.webp'
import pensando from '@/assets/library/personagem/pensando.webp'
import apoiando from '@/assets/library/personagem/apoiando.webp'
import pulando from '@/assets/library/personagem/pulando.webp'

export type Humor = 'feliz' | 'comemorando' | 'pensando' | 'apoiando' | 'acenando' | 'pulando'

const ARTE: Record<Humor, string> = {
  feliz: parado,
  comemorando,
  pensando,
  apoiando,
  acenando,
  pulando,
}

const DESCRICAO: Record<Humor, string> = {
  feliz: 'Mascote sorrindo',
  comemorando: 'Mascote comemorando com os braços para o alto',
  pensando: 'Mascote pensando, com a mão no queixo',
  apoiando: 'Mascote fazendo joia, incentivando',
  acenando: 'Mascote acenando',
  pulando: 'Mascote pulando de alegria',
}

/**
 * O personagem-guia do app.
 *
 * WebP e não PNG: mesma arte, um quinto do peso (≈25 KB contra ≈140 KB), e o
 * app precisa caber num laboratório com internet ruim.
 *
 * O movimento fica em CSS sobre a arte estática, não em quadro a quadro: roda a
 * 60 fps, custa zero byte a mais e fica mais fluido que qualquer animação de
 * 6 quadros.
 */
interface MascoteProps {
  humor?: Humor
  className?: string
}

export function Mascote({ humor = 'feliz', className }: MascoteProps) {
  const semMovimento = movimentoReduzido()
  const animado = humor === 'comemorando' || humor === 'pulando'

  return (
    <motion.img
      key={humor}
      src={ARTE[humor]}
      alt={DESCRICAO[humor]}
      draggable={false}
      className={cn('h-32 w-auto shrink-0 select-none object-contain', className)}
      initial={semMovimento ? false : { scale: 0.88, opacity: 0 }}
      animate={
        semMovimento
          ? { scale: 1, opacity: 1, y: 0 }
          : animado
            ? { scale: 1, opacity: 1, y: [0, -10, 0] }
            : { scale: 1, opacity: 1, y: [0, -4, 0] }
      }
      transition={
        semMovimento
          ? { duration: 0 }
          : {
              scale: { type: 'spring', stiffness: 260, damping: 16 },
              opacity: { duration: 0.2 },
              // A respiração leve é o que faz o personagem parecer vivo mesmo
              // quando não está fazendo nada.
              y: { duration: animado ? 0.7 : 3.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
    />
  )
}
