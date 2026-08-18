import { carregarManifesto, pararClipe, tocarClipe } from './falas'

/**
 * Narração em pt-BR, em duas camadas.
 *
 * 1. Clipe pré-gerado (voz neural ou a voz da própria professora). É o
 *    caminho normal e o que soa humano.
 * 2. Web Speech API, só quando não existe clipe — texto dinâmico, ou
 *    áudio ainda não gerado. Soa robótico, mas nunca deixa a criança
 *    sem instrução.
 *
 * Ver falas.ts para como os clipes são resolvidos.
 */

let vozPtBr: SpeechSynthesisVoice | null = null
let vozesCarregadas = false
const ouvintes = new Set<() => void>()

function suportado(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/**
 * Nem toda voz pt-BR é igual. Num Windows comum só existem a Microsoft
 * Maria e o Daniel (SAPI5, robóticas); no Edge aparecem as "Natural", e
 * no Chrome com rede aparece a do Google — ambas muito melhores. Pegar a
 * primeira da lista sorteia a pior.
 */
function pontuar(voz: SpeechSynthesisVoice): number {
  const nome = voz.name.toLowerCase()
  if (nome.includes('natural')) return 4 // vozes neurais do Edge
  if (nome.includes('google')) return 3 // voz do Chrome, via rede
  if (!voz.localService) return 2 // qualquer outra online costuma ser melhor
  return 1 // SAPI5 local
}

function escolherVoz() {
  if (!suportado()) return
  const vozes = window.speechSynthesis.getVoices()
  if (vozes.length === 0) return

  const candidatas = vozes
    .filter((v) => v.lang === 'pt-BR' || v.lang?.startsWith('pt'))
    .sort((a, b) => pontuar(b) - pontuar(a))

  vozPtBr = candidatas[0] ?? null
  vozesCarregadas = true
  ouvintes.forEach((f) => f())
}

if (suportado()) {
  escolherVoz()
  // Chrome popula as vozes de forma assíncrona; sem este listener a
  // primeira fala do app sai na voz errada ou não sai.
  window.speechSynthesis.addEventListener('voiceschanged', escolherVoz)
}

void carregarManifesto()

/** Avisa quando a lista de vozes do sistema termina de carregar. */
export function aoCarregarVozes(callback: () => void): () => void {
  if (vozesCarregadas) callback()
  ouvintes.add(callback)
  return () => ouvintes.delete(callback)
}

export function temVozPtBr(): boolean {
  return vozPtBr !== null
}

/** Nome da voz do sistema em uso — só para diagnóstico do professor. */
export function vozEmUso(): string | null {
  return vozPtBr?.name ?? null
}

/**
 * Cada pedido de narração recebe um número. `calar()` avança o contador,
 * o que invalida qualquer sequência em andamento — sem isso a criança
 * abre outro tema e ouve os dois ao mesmo tempo.
 */
let geracao = 0

/** Interrompe qualquer fala em andamento, gravada ou sintetizada. */
export function calar() {
  geracao++
  pararClipe()
  if (suportado()) window.speechSynthesis.cancel()
}

export interface OpcoesNarracao {
  /** Velocidade da voz sintetizada. Abaixo de 1 para o 1º ano. */
  velocidade?: number
  /** Não interrompe a fala atual; enfileira depois dela. */
  enfileirar?: boolean
}

/**
 * Fala um texto. Silencioso e seguro quando não há suporte, voz ou
 * clipe — nunca lança, para não derrubar um jogo no meio da aula.
 */
export function narrar(texto: string, opcoes: OpcoesNarracao = {}) {
  if (!texto.trim()) return
  if (!opcoes.enfileirar) calar()

  void tocarClipe(texto).then((tocou) => {
    if (!tocou) sintetizar(texto, opcoes)
  })
}

function sintetizar(texto: string, { velocidade = 0.95 }: OpcoesNarracao, aoTerminar?: () => void) {
  if (!suportado()) {
    aoTerminar?.()
    return
  }

  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  fala.rate = velocidade
  fala.pitch = 1.1
  if (vozPtBr) fala.voice = vozPtBr
  if (aoTerminar) {
    fala.onend = aoTerminar
    fala.onerror = aoTerminar
  }

  try {
    window.speechSynthesis.speak(fala)
  } catch {
    // Alguns navegadores bloqueiam TTS antes da primeira interação do
    // usuário. Perder a narração é aceitável; travar o jogo não é.
    aoTerminar?.()
  }
}

/** Pausa entre uma fala e a próxima. Meio segundo é o respiro de quem conversa. */
const PAUSA_ENTRE_FALAS = 500

/**
 * Quanto tempo uma fala deve durar, no pior caso.
 *
 * Existe porque nem `ended` do <audio> nem `onend` da Web Speech são
 * confiáveis: aba em segundo plano, autoplay bloqueado e voz do sistema
 * ausente engolem o evento, e a sequência ficaria parada para sempre. É
 * o mesmo princípio do resultado por temporizador nos motores — o avanço
 * não pode depender de um evento que talvez não chegue.
 */
function tetoDeDuracao(texto: string): number {
  const palavras = texto.split(/\s+/).filter(Boolean).length
  return 1500 + palavras * 900
}

function falarAteOFim(texto: string, opcoes: OpcoesNarracao): Promise<void> {
  return new Promise((resolve) => {
    let pronto = false
    const terminar = () => {
      if (pronto) return
      pronto = true
      clearTimeout(limite)
      resolve()
    }
    const limite = setTimeout(terminar, tetoDeDuracao(texto))

    void tocarClipe(texto, terminar).then((tocou) => {
      if (!tocou) sintetizar(texto, opcoes, terminar)
    })
  })
}

/**
 * Fala várias frases curtas em fila, com pausa real entre elas.
 *
 * É o que substitui o parágrafo de quarenta palavras numa string só: o
 * mesmo conteúdo, quebrado em ideias, com silêncio no meio. Ver
 * docs/plano-da-voz.md.
 *
 * Cancela o que estiver tocando e é cancelada por qualquer `calar()` ou
 * `narrar()` posterior.
 */
export async function narrarSequencia(falas: string[], opcoes: OpcoesNarracao = {}) {
  calar()
  const minha = geracao

  for (const fala of falas) {
    if (geracao !== minha) return
    if (!fala.trim()) continue
    await falarAteOFim(fala, opcoes)
    if (geracao !== minha) return
    await new Promise((r) => setTimeout(r, PAUSA_ENTRE_FALAS))
  }
}
