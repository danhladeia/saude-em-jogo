import { z } from 'zod'

/**
 * O questionário pré e pós da intervenção.
 *
 * A cartilha exige aplicá-lo antes e depois das quatro semanas, mas não
 * transcreve as perguntas. O conteúdo em `perguntas.json` é uma proposta
 * inicial e **precisa da revisão da autora** — ela é a pesquisadora, e as
 * perguntas são o instrumento de medida da dissertação.
 *
 * Mesmo instrumento nas duas aplicações, de propósito: pré e pós só comparam
 * se as perguntas forem idênticas.
 */
export const OpcaoDeQuestionario = z.object({
  id: z.string(),
  rotulo: z.string(),
  emoji: z.string().optional(),
  /**
   * Pontuação desta resposta.
   *
   * Uniformiza os dois tipos de pergunta numa escala só, para o pré e o pós
   * darem um número comparável: conhecimento usa 1 para a correta e 0 para as
   * outras; hábito usa uma escala de frequência (0 a 3).
   */
  valor: z.number().int().min(0).max(3),
})

export const PerguntaDeQuestionario = z.object({
  id: z.string(),
  enunciado: z.string(),
  /** Só para a análise: separa o que a criança SABE do que ela FAZ. */
  tipo: z.enum(['conhecimento', 'habito']),
  eixo: z.enum(['letramento-corporal', 'promocao-da-saude']),
  opcoes: z.array(OpcaoDeQuestionario).min(2),
})

export const ConteudoQuestionario = z.object({
  titulo: z.string(),
  instrucao: z.string(),
  perguntas: z.array(PerguntaDeQuestionario).min(1),
})

export type OpcaoDeQuestionario = z.infer<typeof OpcaoDeQuestionario>
export type PerguntaDeQuestionario = z.infer<typeof PerguntaDeQuestionario>
export type ConteudoQuestionario = z.infer<typeof ConteudoQuestionario>

/** Soma máxima possível — o denominador da comparação pré/pós. */
export function pontuacaoMaxima(conteudo: ConteudoQuestionario): number {
  return conteudo.perguntas.reduce(
    (soma, p) => soma + Math.max(...p.opcoes.map((o) => o.valor)),
    0,
  )
}
