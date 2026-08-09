import { z } from 'zod'

/**
 * O contrato entre motor e conteúdo.
 *
 * Motor é código, jogo é JSON. Cada arquivo em src/content/anoN/ valida
 * contra um destes schemas — conteúdo inválido quebra o build
 * (`npm run validate:content`), nunca a aula.
 */

/** Qualquer coisa que a criança vê num card: figura, emoji ou texto. */
export const Ilustracao = z.object({
  /** Caminho em /assets/library/... quando a arte definitiva existir. */
  imagem: z.string().optional(),
  /** Ponte enquanto a arte não chega. */
  emoji: z.string().optional(),
  /** Sempre obrigatório: é o alt-text e o que a narração lê. */
  rotulo: z.string().min(1),
})
export type Ilustracao = z.infer<typeof Ilustracao>

/**
 * Bloco de movimento real. Qualquer jogo pode terminar com um.
 *
 * É o que impede o app de virar só "clicar na resposta certa": o
 * documento da autora pede prática corporal explícita em Corpo que dança,
 * Equilibrista mirim, Roleta de alongamentos e Corpo em ação.
 */
export const BlocoCorpoAtivo = z.object({
  titulo: z.string(),
  instrucao: z.string(),
  passos: z
    .array(
      z.object({
        id: z.string(),
        rotulo: z.string(),
        descricao: z.string(),
        emoji: z.string().optional(),
        imagem: z.string().optional(),
        segundos: z.number().int().positive().max(120),
      }),
    )
    .min(1),
  /** Auto-relato de emoção — pedido explicitamente em "Corpo que dança". */
  perguntaEmocao: z
    .object({
      enunciado: z.string(),
      opcoes: z.array(z.object({ id: z.string(), rotulo: z.string(), emoji: z.string() })).min(2),
    })
    .optional(),
})
export type BlocoCorpoAtivo = z.infer<typeof BlocoCorpoAtivo>

const Base = {
  id: z.string().min(1),
  titulo: z.string().min(1),
  instrucao: z.string().min(1),
  corpoAtivo: BlocoCorpoAtivo.optional(),
}

/* ------------------------------------------------------------------ *
 * quiz — 5 jogos
 * ------------------------------------------------------------------ */
export const ConteudoQuiz = z.object({
  ...Base,
  motor: z.literal('quiz'),
  /**
   * Pele de feedback. Mesma mecânica, reação diferente — o .docx pede
   * barra de energia em "Movimente-se" e personagem na prancha em
   * "Equilibrista mirim".
   */
  feedback: z.enum(['padrao', 'energia', 'equilibrio']).default('padrao'),
  perguntas: z
    .array(
      z.object({
        id: z.string(),
        enunciado: z.string(),
        imagem: z.string().optional(),
        /** 'multipla' quando mais de uma opção está correta. */
        tipo: z.enum(['unica', 'multipla']).default('unica'),
        opcoes: z
          .array(
            Ilustracao.extend({
              id: z.string(),
              correta: z.boolean(),
            }),
          )
          .min(2),
        explicacao: z.string().optional(),
      }),
    )
    .min(1),
})
export type ConteudoQuiz = z.infer<typeof ConteudoQuiz>

/* ------------------------------------------------------------------ *
 * arrastar-alvo — Monte o corpo humano, Como me sinto?
 * ------------------------------------------------------------------ */
export const ConteudoArrastarAlvo = z.object({
  ...Base,
  motor: z.literal('arrastar-alvo'),
  /** Espaço de coordenadas do cenário; alvos são posicionados em %. */
  cenario: z.object({
    imagem: z.string().optional(),
    /** Proporção largura/altura da área de montagem. */
    proporcao: z.number().positive().default(1),
    corDeFundo: z.string().optional(),
  }),
  alvos: z
    .array(
      z.object({
        id: z.string(),
        rotulo: z.string(),
        /** Percentuais do centro do alvo dentro do cenário. */
        x: z.number().min(0).max(100),
        y: z.number().min(0).max(100),
        largura: z.number().min(1).max(100),
        altura: z.number().min(1).max(100),
      }),
    )
    .min(1),
  pecas: z
    .array(Ilustracao.extend({ id: z.string(), alvoId: z.string() }))
    .min(1),
})
export type ConteudoArrastarAlvo = z.infer<typeof ConteudoArrastarAlvo>

/* ------------------------------------------------------------------ *
 * associacao — Corpo que fala, Jogo da memória
 * ------------------------------------------------------------------ */
export const ConteudoAssociacao = z.object({
  ...Base,
  motor: z.literal('associacao'),
  modo: z.enum(['ligar', 'memoria']),
  pares: z
    .array(
      z.object({
        id: z.string(),
        esquerda: Ilustracao,
        direita: Ilustracao,
        /** Mensagem educativa ao formar o par. */
        explicacao: z.string().optional(),
      }),
    )
    .min(2),
})
export type ConteudoAssociacao = z.infer<typeof ConteudoAssociacao>

/* ------------------------------------------------------------------ *
 * roleta — Roleta giratória de alongamentos
 * ------------------------------------------------------------------ */
export const ConteudoRoleta = z.object({
  ...Base,
  motor: z.literal('roleta'),
  /** Quantas vezes a criança gira antes de concluir. */
  rodadas: z.number().int().positive().max(12).default(5),
  itens: z
    .array(
      Ilustracao.extend({
        id: z.string(),
        /** O que fazer com o corpo quando a roleta parar aqui. */
        instrucao: z.string(),
        segundos: z.number().int().positive().max(120).default(15),
      }),
    )
    .min(4),
})
export type ConteudoRoleta = z.infer<typeof ConteudoRoleta>

/* ------------------------------------------------------------------ *
 * corpo-ativo como atividade inteira — Corpo que dança, Corpo em ação
 * ------------------------------------------------------------------ */
export const ConteudoCorpoAtivo = z.object({
  ...Base,
  motor: z.literal('corpo-ativo'),
  bloco: BlocoCorpoAtivo,
})
export type ConteudoCorpoAtivo = z.infer<typeof ConteudoCorpoAtivo>

/* ------------------------------------------------------------------ */

export const ConteudoDeJogo = z.discriminatedUnion('motor', [
  ConteudoQuiz,
  ConteudoArrastarAlvo,
  ConteudoAssociacao,
  ConteudoRoleta,
  ConteudoCorpoAtivo,
])
export type ConteudoDeJogo = z.infer<typeof ConteudoDeJogo>

/** Lança com mensagem apontando o arquivo quando o JSON está fora do contrato. */
export function validarConteudo(bruto: unknown, origem: string): ConteudoDeJogo {
  const resultado = ConteudoDeJogo.safeParse(bruto)
  if (!resultado.success) {
    throw new Error(
      `Conteúdo inválido em ${origem}:\n${z.prettifyError(resultado.error)}`,
    )
  }
  return resultado.data
}
