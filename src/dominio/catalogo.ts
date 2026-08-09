import type { Ano, Atividade } from './tipos'

/** Títulos dos anos, exatamente como na tela ATIVIDADES do mockup. */
export const TITULO_DO_ANO: Record<Ano, string> = {
  1: 'Meu corpo',
  2: 'Corpo em movimento e equilíbrio',
  3: 'Movimento e hidratação',
  4: 'Escolhas saudáveis',
  5: 'Corpo e identidade',
}

/** Unidade temática de cada ano, como no cabeçalho de cada seção do .docx. */
export const UNIDADE_DO_ANO: Record<Ano, string> = {
  1: 'Percepção corporal e hábitos saudáveis',
  2: 'Corpo em movimento e equilíbrio',
  3: 'Movimento e hidratação',
  4: 'Corpo e escolhas saudáveis',
  5: 'Corpo e identidade',
}

export const COR_DO_ANO: Record<Ano, 'ceu' | 'folha' | 'sol' | 'coral' | 'uva'> = {
  1: 'ceu',
  2: 'folha',
  3: 'sol',
  4: 'coral',
  5: 'uva',
}

/**
 * As 20 atividades da intervenção de 4 semanas, transcritas do documento
 * "CONTEÚDOS PARA O APLICATIVO PSEUDO SOFTWARE".
 *
 * Cada uma aponta para um dos nove motores. O motor traz a mecânica; o
 * arquivo JSON em src/content/anoN/ traz as perguntas, os alvos e os
 * itens. Trocar uma atividade por outra do mesmo tema — previsto no P.S.
 * do documento — é editar JSON, não código.
 */
export const CATALOGO: Atividade[] = [
  // ---------------------------------------------------------------- 1º ano
  {
    id: 'ano1-s1-monte-o-corpo',
    ano: 1,
    semana: 1,
    tema: 'Descobrindo meu corpo',
    jogo: 'Monte o corpo humano',
    eixos: ['letramento-corporal'],
    objetivo: 'Reconhecer, identificar e nomear partes do corpo humano e as funções corporais.',
    motor: 'arrastar-alvo',
    disponivel: true,
  },
  {
    id: 'ano1-s2-jogo-de-escolhas',
    ano: 1,
    semana: 2,
    tema: 'Higiene e cuidado',
    jogo: 'Jogo de escolhas',
    eixos: ['promocao-da-saude'],
    objetivo: 'Reconhecer a importância da higiene corporal e dos cuidados com o corpo.',
    motor: 'quiz',
    disponivel: true,
  },
  {
    id: 'ano1-s3-como-me-sinto',
    ano: 1,
    semana: 3,
    tema: 'Corpo e emoções',
    jogo: 'Como me sinto?',
    eixos: ['letramento-corporal'],
    objetivo: 'Explorar expressões faciais e sentimentos.',
    motor: 'arrastar-alvo',
    disponivel: true,
  },
  {
    id: 'ano1-s4-corpo-que-danca',
    ano: 1,
    semana: 4,
    tema: 'Movimento e alegria',
    jogo: 'Corpo que dança',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo: 'Reconhecer a importância de se movimentar para o bem-estar.',
    motor: 'corpo-ativo',
    disponivel: true,
  },

  // ---------------------------------------------------------------- 2º ano
  {
    id: 'ano2-s1-corpo-que-fala',
    ano: 2,
    semana: 1,
    tema: 'Comunicação corporal',
    jogo: 'Corpo que fala',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo: 'Identificar as formas de comunicação corporal.',
    motor: 'associacao',
    disponivel: true,
  },
  {
    id: 'ano2-s2-movimente-se',
    ano: 2,
    semana: 2,
    tema: 'Consciência corporal',
    jogo: 'Movimente-se',
    eixos: ['letramento-corporal'],
    objetivo: 'Conhecer os benefícios da atividade física.',
    motor: 'quiz',
    disponivel: true,
  },
  {
    id: 'ano2-s3-equilibrista-mirim',
    ano: 2,
    semana: 3,
    tema: 'Equilíbrio',
    jogo: 'Equilibrista mirim',
    eixos: ['letramento-corporal'],
    objetivo:
      'Desenvolver a percepção corporal e a coordenação, reconhecendo o equilíbrio como parte do controle do corpo em movimento.',
    motor: 'quiz',
    disponivel: true,
  },
  {
    id: 'ano2-s4-roleta-alongamentos',
    ano: 2,
    semana: 4,
    tema: 'Corpo que estica — alongamentos',
    jogo: 'Roleta giratória',
    eixos: ['letramento-corporal'],
    objetivo:
      'Reconhecer a importância do alongamento para preparar e relaxar o corpo antes e depois das atividades físicas.',
    motor: 'roleta',
    disponivel: true,
  },

  // ---------------------------------------------------------------- 3º ano
  {
    id: 'ano3-s1-agua-em-jogo',
    ano: 3,
    semana: 1,
    tema: 'Hidratação',
    jogo: 'Água em jogo',
    eixos: ['promocao-da-saude'],
    objetivo: 'Compreender como a água ajuda nas funções do corpo humano.',
    motor: 'quiz',
    disponivel: false,
  },
  {
    id: 'ano3-s2-trilha-do-sono',
    ano: 3,
    semana: 2,
    tema: 'Trilha do sono saudável',
    jogo: 'Trilha saudável',
    eixos: ['promocao-da-saude'],
    objetivo: 'Compreender a importância do sono para o funcionamento do corpo e para a saúde.',
    motor: 'trilha',
    disponivel: false,
  },
  {
    id: 'ano3-s3-tipos-de-esporte',
    ano: 3,
    semana: 3,
    tema: 'Tipos de esporte',
    jogo: 'Jogo da memória',
    eixos: ['letramento-corporal'],
    objetivo:
      'Compreender os diferentes tipos de esportes, reconhecendo suas características e gestos motores.',
    motor: 'associacao',
    disponivel: false,
  },
  {
    id: 'ano3-s4-classificacao-corporal',
    ano: 3,
    semana: 4,
    tema: 'Atividade física × exercício físico',
    jogo: 'Classificação corporal',
    eixos: ['letramento-corporal'],
    objetivo:
      'Compreender a diferença entre atividade física e exercício físico, reconhecendo como ambos contribuem para a saúde.',
    motor: 'classificar',
    disponivel: false,
  },

  // ---------------------------------------------------------------- 4º ano
  {
    id: 'ano4-s1-prato-colorido',
    ano: 4,
    semana: 1,
    tema: 'Prato colorido',
    jogo: 'Prato colorido',
    eixos: ['promocao-da-saude'],
    objetivo:
      'Reconhecer a importância de uma alimentação equilibrada, estimulando escolhas conscientes de alimentos.',
    motor: 'montagem',
    disponivel: false,
  },
  {
    id: 'ano4-s2-super-lanche',
    ano: 4,
    semana: 2,
    tema: 'Lanche nutritivo',
    jogo: 'Super lanche',
    eixos: ['promocao-da-saude'],
    objetivo: 'Identificar lanches saudáveis e os impactos das escolhas alimentares.',
    motor: 'montagem',
    disponivel: false,
  },
  {
    id: 'ano4-s3-missao-corpo-e-movimento',
    ano: 4,
    semana: 3,
    tema: 'Corpo e movimento',
    jogo: 'Missão corpo e movimento',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo:
      'Estimular o movimento corporal e a consciência sobre a importância de se manter ativo.',
    motor: 'runner',
    disponivel: false,
  },
  {
    id: 'ano4-s4-dia-ativo-saudavel',
    ano: 4,
    semana: 4,
    tema: 'Rotina equilibrada',
    jogo: 'Dia ativo saudável',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo:
      'Organizar o dia de forma equilibrada, combinando alimentação, movimento, descanso e hidratação.',
    motor: 'rotina',
    disponivel: false,
  },

  // ---------------------------------------------------------------- 5º ano
  {
    id: 'ano5-s1-corpos-do-mundo',
    ano: 5,
    semana: 1,
    tema: 'Corpo e respeito: somos diferentes e únicos',
    jogo: 'Corpos do mundo',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo:
      'Reconhecer e respeitar a diversidade corporal, valorizando as diferenças entre as pessoas.',
    motor: 'quiz',
    disponivel: false,
  },
  {
    id: 'ano5-s2-digital-saude',
    ano: 5,
    semana: 2,
    tema: 'Tecnologia, tempo de tela e sono',
    jogo: 'Digital saúde',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo: 'Refletir sobre o uso equilibrado das telas e sua relação com o corpo e a saúde.',
    motor: 'rotina',
    disponivel: false,
  },
  {
    id: 'ano5-s3-missao-ambiente-saudavel',
    ano: 5,
    semana: 3,
    tema: 'Cuidar do planeta é cuidar do corpo',
    jogo: 'Missão ambiente saudável',
    eixos: ['letramento-corporal', 'promocao-da-saude'],
    objetivo:
      'Compreender a importância de manter o ambiente limpo e organizado como forma de cuidar da saúde e do bem-estar coletivo.',
    motor: 'classificar',
    disponivel: false,
  },
  {
    id: 'ano5-s4-corpo-em-acao',
    ano: 5,
    semana: 4,
    tema: 'Corpo e movimento',
    jogo: 'Corpo em ação',
    eixos: ['letramento-corporal'],
    objetivo:
      'Estimular a prática de atividade física, promovendo percepção corporal, coordenação e bem-estar.',
    motor: 'corpo-ativo',
    disponivel: false,
  },
]

export function atividadesDoAno(ano: Ano): Atividade[] {
  return CATALOGO.filter((a) => a.ano === ano).sort((a, b) => a.semana - b.semana)
}

export function acharAtividade(id: string): Atividade | undefined {
  return CATALOGO.find((a) => a.id === id)
}

export const ANOS: Ano[] = [1, 2, 3, 4, 5]
