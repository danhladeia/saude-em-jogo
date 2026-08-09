/**
 * Clipes de fala pré-gerados.
 *
 * A voz do sistema (Web Speech API) é o que existe de graça, mas num
 * Windows típico de laboratório as únicas vozes pt-BR são a Microsoft
 * Maria e o Daniel — SAPI5 de 2010, com prosódia de robô. Para uma turma
 * de 6 anos que depende da narração para entender o enunciado, isso é
 * ruim de verdade.
 *
 * A solução é gerar o áudio UMA vez, fora do app (voz neural ou a voz da
 * própria professora), e embarcar os arquivos. Em tempo de execução é só
 * um <audio>: humano, offline e de custo zero.
 *
 * Este módulo resolve texto -> arquivo. Quando não há arquivo, quem chama
 * cai para a voz do sistema (ver narracao.ts).
 */

const PASTA = '/falas'

/**
 * Chave determinística de uma fala.
 *
 * FNV-1a de 32 bits em base36. Precisa dar exatamente o mesmo resultado
 * aqui e em scripts/extrair-falas.ts — se divergir, o app procura
 * arquivos que não existem. Textos iguais em jogos diferentes viram o
 * mesmo arquivo de propósito.
 */
export function chaveDaFala(texto: string): string {
  const normalizado = texto.trim().replace(/\s+/g, ' ')
  let h = 0x811c9dc5
  for (let i = 0; i < normalizado.length; i++) {
    h ^= normalizado.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(7, '0')
}

let disponiveis: Set<string> | null = null
let carregando: Promise<void> | null = null

/**
 * Carrega a lista de clipes existentes. Ausência do manifesto é normal —
 * significa que o áudio ainda não foi gerado, e o app usa a voz do
 * sistema.
 */
export function carregarManifesto(): Promise<void> {
  if (carregando) return carregando

  carregando = fetch(`${PASTA}/manifesto.json`)
    .then((r) => (r.ok ? r.json() : []))
    .then((chaves: string[]) => {
      disponiveis = new Set(chaves)
    })
    .catch(() => {
      disponiveis = new Set()
    })

  return carregando
}

export function temClipe(texto: string): boolean {
  return disponiveis !== null && disponiveis.has(chaveDaFala(texto))
}

let tocando: HTMLAudioElement | null = null

export function pararClipe() {
  if (!tocando) return
  tocando.pause()
  tocando.currentTime = 0
  tocando = null
}

/**
 * Toca o clipe do texto. Resolve `false` quando não há clipe ou quando a
 * reprodução falha — aí quem chama cai para a voz do sistema.
 */
export function tocarClipe(texto: string): Promise<boolean> {
  if (!temClipe(texto)) return Promise.resolve(false)

  pararClipe()
  const audio = new Audio(`${PASTA}/${chaveDaFala(texto)}.mp3`)
  tocando = audio

  return audio
    .play()
    .then(() => true)
    .catch(() => {
      // Bloqueio de autoplay antes da primeira interação, ou arquivo
      // corrompido no cache. Nos dois casos a voz do sistema assume.
      if (tocando === audio) tocando = null
      return false
    })
}
