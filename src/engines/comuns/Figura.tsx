import type { Ilustracao } from '@/content/schemas'
import { urlDoSprite } from '@/assets/registro'
import { usarPerfil } from '@/store/usarPerfil'
import { cn } from '@/design/cn'

interface FiguraProps {
  item: Pick<Ilustracao, 'imagem' | 'emoji' | 'rotulo'>
  className?: string
  /** Esconde o rótulo escrito — usado quando o texto já aparece ao lado. */
  semTexto?: boolean
  /**
   * 'pequeno' para as peças já encaixadas nas caixas de classificar: ali
   * cabem oito numa coluna, e 96px cada empurraria a bandeja para fora da
   * tela do laboratório.
   */
  tamanho?: 'normal' | 'pequeno'
}

/**
 * Renderiza um item do conteúdo.
 *
 * `imagem` é chave lógica no registro de sprites ("corpo/cabeca"), não
 * caminho de arquivo — ver src/assets/registro.ts. Se a chave não existir,
 * cai no emoji: conteúdo novo continua jogável antes de a arte chegar, e o
 * validador de conteúdo é quem reclama da chave errada, no build.
 */
export function Figura({ item, className, semTexto = false, tamanho = 'normal' }: FiguraProps) {
  const personagem = usarPerfil((e) => e.perfil.personagem)
  const url = urlDoSprite(item.imagem, personagem)
  const pequeno = tamanho === 'pequeno'

  return (
    <span className={cn('flex flex-col items-center justify-center gap-2 text-center', className)}>
      {url ? (
        <img
          src={url}
          alt={semTexto ? item.rotulo : ''}
          draggable={false}
          className={cn('select-none object-contain', pequeno ? 'h-12 w-12' : 'h-24 w-24')}
        />
      ) : item.emoji ? (
        <span aria-hidden={!semTexto} className={cn('leading-none', pequeno ? 'text-3xl' : 'text-6xl')}>
          {item.emoji}
        </span>
      ) : null}
      {!semTexto && (
        <span className="font-display text-lg font-bold leading-tight">{item.rotulo}</span>
      )}
    </span>
  )
}
