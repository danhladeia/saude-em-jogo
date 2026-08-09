import type { Ilustracao } from '@/content/schemas'
import { cn } from '@/design/cn'

interface FiguraProps {
  item: Pick<Ilustracao, 'imagem' | 'emoji' | 'rotulo'>
  className?: string
  /** Esconde o rótulo escrito — usado quando o texto já aparece ao lado. */
  semTexto?: boolean
}

/**
 * Renderiza um item do conteúdo. Enquanto a arte definitiva não existe, o
 * emoji do JSON segura o jogo; trocar por `imagem` depois não mexe em
 * nenhum motor.
 */
export function Figura({ item, className, semTexto = false }: FiguraProps) {
  return (
    <span className={cn('flex flex-col items-center justify-center gap-2 text-center', className)}>
      {item.imagem ? (
        <img src={item.imagem} alt={semTexto ? item.rotulo : ''} className="h-24 w-24 object-contain" />
      ) : item.emoji ? (
        <span aria-hidden={!semTexto} className="text-6xl leading-none">
          {item.emoji}
        </span>
      ) : null}
      {!semTexto && (
        <span className="font-display text-lg font-bold leading-tight">{item.rotulo}</span>
      )}
    </span>
  )
}
