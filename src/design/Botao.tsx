import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from './cn'

type Cor = 'ceu' | 'folha' | 'sol' | 'coral' | 'uva' | 'neutro'
type Tamanho = 'medio' | 'grande'

const CORES: Record<Cor, string> = {
  ceu: 'bg-ceu-400 text-white border-ceu-600 hover:bg-ceu-300',
  folha: 'bg-folha-400 text-white border-folha-600 hover:bg-folha-300',
  sol: 'bg-sol-400 text-tinta-900 border-sol-600 hover:bg-sol-300',
  coral: 'bg-coral-400 text-white border-coral-600 hover:bg-coral-300',
  uva: 'bg-uva-400 text-white border-uva-600 hover:bg-uva-300',
  neutro: 'bg-white text-tinta-600 border-ceu-200 hover:bg-ceu-50',
}

const TAMANHOS: Record<Tamanho, string> = {
  medio: 'min-h-toque px-6 text-xl gap-3',
  grande: 'min-h-[5.5rem] px-10 text-3xl gap-4',
}

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  cor?: Cor
  tamanho?: Tamanho
  /** Ocupa toda a largura disponível. */
  largo?: boolean
  icone?: ReactNode
}

/**
 * Botão físico: tem espessura e afunda quando pressionado. Criança pequena
 * lê profundidade como "isto é clicável" muito antes de ler o rótulo.
 *
 * Altura mínima presa em --spacing-toque (4rem) — não reduzir.
 */
export function Botao({
  cor = 'ceu',
  tamanho = 'medio',
  largo = false,
  icone,
  className,
  children,
  ...props
}: BotaoProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-bolha border-b-[6px] font-display font-extrabold',
        'transition-all duration-100 ease-pulo',
        'active:translate-y-[6px] active:border-b-0',
        'disabled:pointer-events-none disabled:opacity-45',
        CORES[cor],
        TAMANHOS[tamanho],
        largo && 'w-full',
        className,
      )}
      {...props}
    >
      {icone}
      {children}
    </button>
  )
}
