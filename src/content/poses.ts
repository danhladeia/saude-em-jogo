/**
 * Como o app confere que a criança executou o movimento.
 *
 * Não é comparação de foto com foto. Comparar silhueta com um modelo
 * desenhado reprova corpo que não parece com o desenho — criança gorda,
 * criança com deficiência, criança de uniforme largo —, e o conteúdo do
 * 5º ano é justamente diversidade corporal. O que se confere aqui é a
 * *relação entre as articulações*: o punho está acima do nariz? o joelho
 * subiu acima do quadril? Isso vale para qualquer corpo.
 *
 * Cada regra declara também de quais partes precisa. Num laboratório a
 * webcam costuma pegar só cabeça e tronco, e regra de perna nunca teria
 * como fechar — nesse caso o app diz isso em vez de deixar a criança
 * tentando para sempre.
 */

/** Índices dos 33 pontos do MediaPipe Pose que este app usa. */
export const PONTO = {
  nariz: 0,
  orelhaEsq: 7,
  orelhaDir: 8,
  ombroEsq: 11,
  ombroDir: 12,
  cotoveloEsq: 13,
  cotoveloDir: 14,
  punhoEsq: 15,
  punhoDir: 16,
  quadrilEsq: 23,
  quadrilDir: 24,
  joelhoEsq: 25,
  joelhoDir: 26,
  tornozeloEsq: 27,
  tornozeloDir: 28,
} as const

export interface Ponto {
  x: number
  y: number
  /** 0 a 1. Abaixo de 0,5 o ponto está fora do quadro ou encoberto. */
  visibility: number
}

/** Que parte do corpo a câmera precisa enxergar para a regra funcionar. */
export type Enquadramento = 'tronco' | 'corpo-inteiro'

export interface RegraDePose {
  id: string
  /** O que dizer para a criança enquanto ela não encaixa. */
  dica: string
  enquadramento: Enquadramento
  /** Pontos sem os quais nem dá para tentar. */
  exige: number[]
  conferir: (p: Ponto[]) => boolean
}

/** y cresce para baixo na imagem: "acima" é y menor. */
const acima = (a: Ponto, b: Ponto) => a.y < b.y

const dist = (a: Ponto, b: Ponto) => Math.hypot(a.x - b.x, a.y - b.y)

/** Referência de escala do corpo, imune à distância da criança à câmera. */
function larguraDosOmbros(p: Ponto[]): number {
  return Math.max(dist(p[PONTO.ombroEsq], p[PONTO.ombroDir]), 0.01)
}

const TRONCO = [PONTO.ombroEsq, PONTO.ombroDir, PONTO.nariz]
const BRACOS = [...TRONCO, PONTO.punhoEsq, PONTO.punhoDir]
const PERNAS = [PONTO.quadrilEsq, PONTO.quadrilDir, PONTO.joelhoEsq, PONTO.joelhoDir]

export const REGRAS: RegraDePose[] = [
  {
    id: 'bracos-acima-da-cabeca',
    dica: 'Levante os dois braços bem alto!',
    enquadramento: 'tronco',
    exige: BRACOS,
    conferir: (p) => acima(p[PONTO.punhoEsq], p[PONTO.nariz]) && acima(p[PONTO.punhoDir], p[PONTO.nariz]),
  },
  {
    id: 'um-braco-acima-da-cabeca',
    dica: 'Levante um braço bem alto!',
    enquadramento: 'tronco',
    exige: BRACOS,
    conferir: (p) => acima(p[PONTO.punhoEsq], p[PONTO.nariz]) || acima(p[PONTO.punhoDir], p[PONTO.nariz]),
  },
  {
    id: 'bracos-para-frente',
    dica: 'Estique os dois braços para a frente!',
    enquadramento: 'tronco',
    exige: BRACOS,
    // Punhos na altura dos ombros e afastados do corpo na horizontal.
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      const naAltura = (q: Ponto, o: Ponto) => Math.abs(q.y - o.y) < e * 0.6
      return (
        naAltura(p[PONTO.punhoEsq], p[PONTO.ombroEsq]) &&
        naAltura(p[PONTO.punhoDir], p[PONTO.ombroDir]) &&
        dist(p[PONTO.punhoEsq], p[PONTO.punhoDir]) < e * 1.6
      )
    },
  },
  {
    id: 'cabeca-inclinada',
    dica: 'Incline a cabeça para o lado, devagar.',
    enquadramento: 'tronco',
    exige: [...TRONCO, PONTO.orelhaEsq, PONTO.orelhaDir],
    // A orelha se aproxima de um ombro bem mais que do outro.
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      const esq = dist(p[PONTO.orelhaEsq], p[PONTO.ombroEsq])
      const dir = dist(p[PONTO.orelhaDir], p[PONTO.ombroDir])
      return Math.abs(esq - dir) > e * 0.22
    },
  },
  {
    id: 'tronco-inclinado-lateral',
    dica: 'Incline o corpo para o lado!',
    enquadramento: 'tronco',
    exige: [...TRONCO, PONTO.quadrilEsq, PONTO.quadrilDir],
    // A linha dos ombros deixa de ser horizontal em relação à dos quadris.
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      const inclinacaoOmbros = p[PONTO.ombroEsq].y - p[PONTO.ombroDir].y
      const inclinacaoQuadris = p[PONTO.quadrilEsq].y - p[PONTO.quadrilDir].y
      return Math.abs(inclinacaoOmbros - inclinacaoQuadris) > e * 0.25
    },
  },
  {
    id: 'tronco-girado',
    dica: 'Gire o tronco para um lado!',
    enquadramento: 'tronco',
    exige: [...TRONCO, PONTO.quadrilEsq, PONTO.quadrilDir],
    // Ao girar, os ombros encurtam na horizontal e os quadris não.
    conferir: (p) => {
      const ombros = Math.abs(p[PONTO.ombroEsq].x - p[PONTO.ombroDir].x)
      const quadris = Math.max(Math.abs(p[PONTO.quadrilEsq].x - p[PONTO.quadrilDir].x), 0.01)
      return ombros / quadris < 0.72
    },
  },
  {
    id: 'joelho-levantado',
    dica: 'Levante bem um joelho!',
    enquadramento: 'corpo-inteiro',
    exige: PERNAS,
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      return (
        acima(p[PONTO.joelhoEsq], p[PONTO.quadrilEsq]) ||
        acima(p[PONTO.joelhoDir], p[PONTO.quadrilDir]) ||
        Math.abs(p[PONTO.joelhoEsq].y - p[PONTO.joelhoDir].y) > e * 0.5
      )
    },
  },
  {
    id: 'em-um-pe-so',
    dica: 'Fique em um pé só!',
    enquadramento: 'corpo-inteiro',
    exige: [...PERNAS, PONTO.tornozeloEsq, PONTO.tornozeloDir],
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      return Math.abs(p[PONTO.tornozeloEsq].y - p[PONTO.tornozeloDir].y) > e * 0.45
    },
  },
  {
    id: 'agachado',
    dica: 'Agache como se fosse sentar!',
    enquadramento: 'corpo-inteiro',
    exige: PERNAS,
    conferir: (p) => {
      const e = larguraDosOmbros(p)
      const quadril = (p[PONTO.quadrilEsq].y + p[PONTO.quadrilDir].y) / 2
      const joelho = (p[PONTO.joelhoEsq].y + p[PONTO.joelhoDir].y) / 2
      return quadril > joelho - e * 0.35
    },
  },
  {
    id: 'de-pe-no-quadro',
    dica: 'Apareça inteiro na câmera!',
    enquadramento: 'tronco',
    exige: TRONCO,
    // Regra permissiva de propósito: para movimentos que a câmera não
    // consegue distinguir (respirar, girar punho), basta a crianca estar
    // ali, de pé e enquadrada.
    conferir: () => true,
  },
]

export const REGRA_POR_ID = new Map(REGRAS.map((r) => [r.id, r]))

export const IDS_DE_REGRA = REGRAS.map((r) => r.id) as [string, ...string[]]

/** Ponto confiável o bastante para decidir. */
export const VISIVEL = 0.5

export function pontosVisiveis(p: Ponto[], exige: number[]): boolean {
  return exige.every((i) => p[i] && p[i].visibility >= VISIVEL)
}
