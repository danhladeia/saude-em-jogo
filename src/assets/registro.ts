/**
 * Registro de sprites: chave lógica -> URL final.
 *
 * O conteúdo dos jogos é JSON, e JSON não faz `import`. Um caminho literal
 * como "/src/assets/library/corpo/cabeca.webp" também não serve: no build o
 * Vite move e renomeia tudo para /assets/cabeca-<hash>.webp, então o caminho
 * do código-fonte aponta para um arquivo que não existe em produção — e falha
 * em silêncio, com imagem quebrada só na aula.
 *
 * Aqui o glob resolve as URLs em tempo de build e o JSON usa chave lógica:
 *
 *     "imagem": "corpo/cabeca"
 *
 * WebP e não PNG: mesma arte, cerca de um quinto do peso.
 */

const ARQUIVOS = import.meta.glob<string>('./library/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** 'corpo/cabeca' -> 'https://.../assets/cabeca-a1b2c3.webp' */
const POR_CHAVE = new Map<string, string>(
  Object.entries(ARQUIVOS).map(([caminho, url]) => {
    // './library/corpo/cabeca.webp' -> 'corpo/cabeca'
    const chave = caminho.replace('./library/', '').replace(/\.webp$/, '')
    return [chave, url]
  }),
)

/**
 * Pastas que existem em duas versões, uma por personagem.
 *
 * O conteúdo escreve sempre a chave neutra ("corpo/cabeca"). Quando a
 * criança escolhe a menina, a resolução tenta antes "menina-corpo/cabeca".
 *
 * Sem isto uma menina escolhe a menina na abertura e, dois cliques depois,
 * monta o corpo de um menino e arrasta emoções de um rosto que não é o dela —
 * justamente no conteúdo que trabalha reconhecer o próprio corpo.
 */
const POR_PERSONAGEM = new Set(['corpo', 'emocoes'])

export function urlDoSprite(chave: string | undefined, personagem?: string): string | undefined {
  if (!chave) return undefined

  if (personagem === 'menina') {
    const [pasta, nome] = chave.split('/')
    if (POR_PERSONAGEM.has(pasta)) {
      const daMenina = POR_CHAVE.get(`menina-${pasta}/${nome}`)
      if (daMenina) return daMenina
    }
  }

  return POR_CHAVE.get(chave)
}

export function existeSprite(chave: string): boolean {
  return POR_CHAVE.has(chave)
}

/** Usado pelo painel de diagnóstico e pelos testes. */
export function chavesDeSprite(): string[] {
  return [...POR_CHAVE.keys()].sort()
}
