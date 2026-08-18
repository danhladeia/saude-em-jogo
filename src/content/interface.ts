import type { Intencao } from './intencoes.ts'

/**
 * Falas fixas da interface, fora dos jogos.
 *
 * Precisam estar aqui — e não espalhadas nos componentes — porque
 * scripts/extrair-falas.ts monta o roteiro de gravação a partir desta
 * lista. Fala que não aparece aqui não ganha clipe e sai na voz robótica
 * do sistema.
 *
 * Se você acrescentar um `narrar('…')` com texto fixo em qualquer tela,
 * acrescente o mesmo texto aqui.
 *
 * A intenção é declarada uma a uma porque aqui o lugar não diz nada:
 * "Isso mesmo!" e "Tente outro lugar." são as duas falas mais repetidas
 * do app e vêm exatamente do mesmo ponto do código.
 */
export interface FalaDaInterface {
  texto: string
  intencao: Intencao
}

export const FALAS_DA_INTERFACE: FalaDaInterface[] = [
  { texto: 'Saúde em jogo!', intencao: 'comemoracao' },
  { texto: 'Seja bem-vindo! Digite o seu nome.', intencao: 'instrucao' },
  { texto: 'Isso mesmo!', intencao: 'comemoracao' },
  { texto: 'Tente outro lugar.', intencao: 'consolo' },
  { texto: 'Muito bem! Você ganhou 1 estrela.', intencao: 'comemoracao' },
  { texto: 'Muito bem! Você ganhou 2 estrelas.', intencao: 'comemoracao' },
  { texto: 'Muito bem! Você ganhou 3 estrelas.', intencao: 'comemoracao' },
]
