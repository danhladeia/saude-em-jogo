export interface ResultadoDeJogo {
  acertos: number
  total: number
}

export interface PropsDeMotor<C> {
  conteudo: C
  aoConcluir: (resultado: ResultadoDeJogo) => void
}

/**
 * Estrelas por desempenho — nunca zero.
 *
 * Terminar a atividade já vale uma estrela. O erro não pune: a criança
 * revê o conteúdo, não perde progresso. Regra alinhada à tela "Minhas
 * Conquistas" do mockup ("cada desafio cumprido ganha uma estrela").
 */
export function estrelasPara({ acertos, total }: ResultadoDeJogo): number {
  if (total === 0) return 1
  const taxa = acertos / total
  if (taxa >= 0.9) return 3
  if (taxa >= 0.6) return 2
  return 1
}
