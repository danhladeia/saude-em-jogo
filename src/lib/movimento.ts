/**
 * O usuário pediu menos movimento na tela?
 *
 * Vale mais do que polimento aqui: o Motion pula animações de transform
 * quando isso está ligado, então qualquer mecânica que dependa de uma
 * animação terminar precisa consultar esta função e ter um caminho sem
 * animação nenhuma.
 */
export function movimentoReduzido(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
