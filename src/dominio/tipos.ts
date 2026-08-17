export type Ano = 1 | 2 | 3 | 4 | 5
export type Semana = 1 | 2 | 3 | 4

/** Os nove motores. Motor é código; jogo é JSON. */
export type Motor =
  | 'quiz'
  | 'arrastar-alvo'
  | 'classificar'
  | 'rotina'
  | 'montagem'
  | 'associacao'
  | 'trilha'
  | 'roleta'
  | 'runner'
  | 'corpo-ativo'

/** Os dois eixos que a cartilha atravessa do começo ao fim. */
export type Eixo = 'letramento-corporal' | 'promocao-da-saude'

/**
 * Quem guia a criança pelo app.
 *
 * A escolha existe porque metade da turma é menina, e um menino como corpo
 * universal seria uma escolha fraca para um conteúdo que trabalha justamente
 * diversidade corporal no 5º ano.
 */
export type Personagem = 'menino' | 'menina'

export interface Atividade {
  id: string
  ano: Ano
  semana: Semana
  /** Tema da semana, como no .docx. */
  tema: string
  /** Nome do jogo, como no .docx. */
  jogo: string
  eixos: Eixo[]
  objetivo: string
  motor: Motor
  /** Falso enquanto o motor ou o conteúdo ainda não existir. */
  disponivel: boolean
}

export interface Aluno {
  id: string
  nome: string
  ano: Ano
}

/** Uma estrela por atividade concluída — regra da tela "Minhas Conquistas". */
export interface RegistroDeConclusao {
  atividadeId: string
  estrelas: number
  acertos: number
  total: number
  /** ISO 8601. */
  concluidoEm: string
  /** Segundos gastos na atividade — entra no relatório do professor. */
  duracaoSegundos: number
}
