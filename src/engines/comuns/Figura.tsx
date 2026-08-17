import type { Ilustracao } from '@/content/schemas'
import { urlDoSprite } from '@/assets/registro'
import { cn } from '@/design/cn'

interface FiguraProps {
  item: Pick<Ilustracao, 'imagem' | 'emoji' | 'rotulo'>
  className?: string
  /** Esconde o rótulo escrito — usado quando o texto já aparece ao lado. */
  semTexto?: boolean
}

/**
 * Renderiza um item do conteúdo.
 *
 * `imagem` é chave lógica no registro de sprites ("corpo/cabeca"), não
 * caminho de arquivo — ver src/assets/registro.ts. Se a chave não existir,
 * cai no emoji: conteúdo novo continua jogável antes de a arte chegar, e o
 * validador de conteúdo é quem reclama da chave errada, no build.
 */
export function Figura({ item, className, semTexto = false }: FiguraProps) {
  const url = urlDoSprite(item.imagem)

  return (
    <span className={cn('flex flex-col items-center justify-center gap-2 text-center', className)}>
      {url ? (
        <img
          src={url}
          alt={semTexto ? item.rotulo : ''}
          draggable={false}
          className="h-24 w-24 select-none object-contain"
        />
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
