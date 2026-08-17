import { motion } from 'framer-motion'
import { cn } from './cn'
import { movimentoReduzido } from '@/lib/movimento'
import { usarPerfil } from '@/store/usarPerfil'
import type { Personagem } from '@/dominio/tipos'

import meninoParado from '@/assets/library/personagem/parado.webp'
import meninoAcenando from '@/assets/library/personagem/acenando.webp'
import meninoComemorando from '@/assets/library/personagem/comemorando.webp'
import meninoPensando from '@/assets/library/personagem/pensando.webp'
import meninoApoiando from '@/assets/library/personagem/apoiando.webp'
import meninoPulando from '@/assets/library/personagem/pulando.webp'

import meninaParado from '@/assets/library/menina/parado.webp'
import meninaAcenando from '@/assets/library/menina/acenando.webp'
import meninaComemorando from '@/assets/library/menina/comemorando.webp'
import meninaPensando from '@/assets/library/menina/pensando.webp'
import meninaApoiando from '@/assets/library/menina/apoiando.webp'
import meninaPulando from '@/assets/library/menina/pulando.webp'

export type Humor = 'feliz' | 'comemorando' | 'pensando' | 'apoiando' | 'acenando' | 'pulando'

const ARTE: Record<Personagem, Record<Humor, string>> = {
  menino: {
    feliz: meninoParado,
    comemorando: meninoComemorando,
    pensando: meninoPensando,
    apoiando: meninoApoiando,
    acenando: meninoAcenando,
    pulando: meninoPulando,
  },
  menina: {
    feliz: meninaParado,
    comemorando: meninaComemorando,
    pensando: meninaPensando,
    apoiando: meninaApoiando,
    acenando: meninaAcenando,
    pulando: meninaPulando,
  },
}

const DESCRICAO: Record<Humor, string> = {
  feliz: 'sorrindo',
  comemorando: 'comemorando com os braços para o alto',
  pensando: 'pensando, com a mão no queixo',
  apoiando: 'fazendo joia, incentivando',
  acenando: 'acenando',
  pulando: 'pulando de alegria',
}

/** Retrato estático — usado nos cards de escolha, onde não há perfil ainda. */
export function RetratoDoPersonagem({
  personagem,
  className,
}: {
  personagem: Personagem
  className?: string
}) {
  return (
    <img
      src={ARTE[personagem].feliz}
      alt={personagem === 'menina' ? 'Personagem menina' : 'Personagem menino'}
      draggable={false}
      className={cn('h-auto w-full select-none object-contain', className)}
    />
  )
}

interface MascoteProps {
  humor?: Humor
  className?: string
}

/**
 * O personagem-guia do app, na versão que a criança escolheu no início.
 *
 * WebP e não PNG: mesma arte, um quinto do peso, e o app precisa caber num
 * laboratório com internet ruim.
 *
 * O movimento fica em CSS sobre a arte estática, não em quadro a quadro: roda a
 * 60 fps, custa zero byte a mais e fica mais fluido que qualquer animação de
 * seis quadros.
 */
export function Mascote({ humor = 'feliz', className }: MascoteProps) {
  const personagem = usarPerfil((e) => e.perfil.personagem)
  const semMovimento = movimentoReduzido()
  const animado = humor === 'comemorando' || humor === 'pulando'

  return (
    <motion.img
      key={`${personagem}-${humor}`}
      src={ARTE[personagem][humor]}
      alt={`Personagem ${DESCRICAO[humor]}`}
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
