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

/** Interrompe qualquer fala em andamento, gravada ou sintetizada. */
export function calar() {
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

function sintetizar(texto: string, { velocidade = 0.95 }: OpcoesNarracao) {
  if (!suportado()) return

  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  fala.rate = velocidade
  fala.pitch = 1.1
  if (vozPtBr) fala.voice = vozPtBr

  try {
    window.speechSynthesis.speak(fala)
  } catch {
    // Alguns navegadores bloqueiam TTS antes da primeira interação do
    // usuário. Perder a narração é aceitável; travar o jogo não é.
  }
}
