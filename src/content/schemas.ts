import { z } from 'zod'
// Extensão explícita: scripts/ importa este arquivo direto no Node, que
// não resolve caminho sem extensão como o Vite resolve.
import { INTENCOES } from './intencoes.ts'
import { IDS_DE_REGRA } from './poses.ts'

/** Como a fala deve ser dita. Ver intencoes.ts. */
export const Intencao = z.enum(INTENCOES)

/**
 * Como a câmera confere que a criança fez o movimento. Ver poses.ts.
 *
 * Opcional sempre, e opcional de propósito: passo sem `verificacao` roda do
 * jeito de antes, e passo com `verificacao` também roda sem câmera quando
 * não há uma. A verificação acrescenta confirmação, nunca cria barreira.
 */
export const Verificacao = z.enum(IDS_DE_REGRA)

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
        /**
         * Só quando destoa do bloco. "Pule com os dois pés" e "Respire
         * fundo" moram no mesmo lugar e não se dizem do mesmo jeito — o
         * padrão é `convite-movimento`, e o passo de respirar declara
         * `acalmar`.
         */
        intencao: Intencao.optional(),
        /** Confere a execução pela câmera antes de iniciar o cronômetro. */
        verificacao: Verificacao.optional(),
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
   * barra de energia em "Movimente-se", personagem na prancha em
   * "Equilibrista mirim" e uma trilha que avança na "Trilha saudável do
   * sono". São peles, não motores novos.
   */
  feedback: z.enum(['padrao', 'energia', 'equilibrio', 'trilha']).default('padrao'),
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
 * arrastar-alvo — Monte o corpo humano, Como me sinto?, e os jogos de
 * classificar, montar e organizar a rotina de 3º a 5º ano.
 * ------------------------------------------------------------------ */

/** Cor da caixa nos layouts 'colunas' e 'linha-do-tempo'. */
export const CorDeAlvo = z.enum(['ceu', 'folha', 'sol', 'coral', 'uva'])
export type CorDeAlvo = z.infer<typeof CorDeAlvo>

export const ConteudoArrastarAlvo = z.object({
  ...Base,
  motor: z.literal('arrastar-alvo'),
  /**
   * Como os alvos são desenhados. A mecânica é sempre a mesma — pegar uma
   * peça e soltar no lugar certo —, o que muda é o desenho da tela:
   *
   * - `cenario`: alvos posicionados em % sobre uma figura. É montar o corpo
   *   ou colocar a emoção no rosto: o *lugar* carrega o significado.
   * - `colunas`: caixas grandes lado a lado, cada uma recebendo várias
   *   peças. Cobre classificar (atividade física × exercício), montar
   *   (prato colorido, super lanche) e separar (ambiente saudável).
   * - `linha-do-tempo`: as mesmas caixas em sequência, numeradas e com
   *   legenda de horário. Cobre organizar a rotina do dia.
   *
   * Os três atendem os jogos de 3º a 5º ano sem motor novo, exatamente
   * como prevê docs/plano-remodelacao.md.
   */
  layout: z.enum(['cenario', 'colunas', 'linha-do-tempo']).default('cenario'),
  /** Espaço de coordenadas do cenário; alvos são posicionados em %. */
  cenario: z
    .object({
      imagem: z.string().optional(),
      /** Proporção largura/altura da área de montagem. */
      proporcao: z.number().positive().default(1),
      corDeFundo: z.string().optional(),
    })
    .default({ proporcao: 1 }),
  alvos: z
    .array(
      z.object({
        id: z.string(),
        rotulo: z.string(),
        /**
         * Percentuais do centro do alvo dentro do cenário.
         * Só valem no layout 'cenario' — nos outros a caixa é do tamanho
         * do conteúdo, e estes campos são ignorados.
         */
        x: z.number().min(0).max(100).default(50),
        y: z.number().min(0).max(100).default(50),
        largura: z.number().min(1).max(100).default(20),
        altura: z.number().min(1).max(100).default(20),
        /** Ilustração do cabeçalho da caixa (layouts 'colunas' e 'linha-do-tempo'). */
        imagem: z.string().optional(),
        emoji: z.string().optional(),
        /** Segunda linha do cabeçalho: "de manhã", "antes de dormir". */
        legenda: z.string().optional(),
        cor: CorDeAlvo.optional(),
      }),
    )
    .min(1),
  pecas: z
    .array(
      Ilustracao.extend({
        id: z.string(),
        alvoId: z.string(),
        /**
         * Por que esta peça vai nesse lugar. Aparece e é narrada no acerto.
         *
         * Nos jogos de classificar é aqui que mora o conteúdo: sem isso a
         * criança acerta por eliminação e não aprende a diferença entre
         * atividade física e exercício físico.
         */
        explicacao: z.string().optional(),
      }),
    )
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
        /** Só quando destoa: o alongamento de respirar pede `acalmar`. */
        intencao: Intencao.optional(),
        /** Confere a execução pela câmera antes de iniciar o cronômetro. */
        verificacao: Verificacao.optional(),
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
