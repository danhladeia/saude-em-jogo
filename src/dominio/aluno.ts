import type { Ano, RegistroDeConclusao } from './tipos'

/**
 * O que fica guardado de cada aluno que usou esta máquina.
 *
 * Existe porque o laboratório da escola tem poucos computadores e ~25 alunos
 * por turma: sem isso, o segundo aluno cairia no perfil do primeiro e a
 * dissertação atribuiria tudo a um nome só.
 *
 * Fica exclusivamente em IndexedDB, neste dispositivo. Sem backend, sem
 * telemetria — são dados de crianças, e a única saída é a exportação CSV que a
 * professora dispara na mão.
 */
export interface RespostaDeQuestionario {
  /** perguntaId -> opcaoId escolhida. */
  respostas: Record<string, string>
  /** Soma dos valores das opções escolhidas. */
  pontos: number
  /** Máximo possível, para a comparação pré/pós fazer sentido. */
  maximo: number
  /** ISO 8601. */
  respondidoEm: string
}

export interface DadosDoAluno {
  nome: string
  ano: Ano | null
  progresso: Record<string, RegistroDeConclusao>
  figurinhas: string[]
  pre?: RespostaDeQuestionario
  pos?: RespostaDeQuestionario
  /** ISO 8601 da última vez que este aluno mexeu no app. */
  atualizadoEm: string
}

/**
 * Chave de arquivamento.
 *
 * Normaliza caixa e acento para "Ana", "ana" e "ANA" serem a mesma criança —
 * senão a turma inteira vira nomes duplicados no CSV e a análise pré/pós não
 * fecha.
 */
export function chaveDoAluno(nome: string): string {
  return nome
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

/** Junta o que já havia com a sessão que acabou, sem perder progresso. */
export function fundirAluno(anterior: DadosDoAluno | undefined, novo: DadosDoAluno): DadosDoAluno {
  if (!anterior) return novo

  const progresso = { ...anterior.progresso }
  for (const [id, registro] of Object.entries(novo.progresso)) {
    const antes = progresso[id]
    // Mesma regra da tela: refazer e ir pior não tira estrela já conquistada.
    if (!antes || registro.estrelas > antes.estrelas) progresso[id] = registro
  }

  return {
    nome: novo.nome || anterior.nome,
    ano: novo.ano ?? anterior.ano,
    progresso,
    figurinhas: [...new Set([...anterior.figurinhas, ...novo.figurinhas])],
    pre: anterior.pre ?? novo.pre,
    pos: novo.pos ?? anterior.pos,
    atualizadoEm: novo.atualizadoEm,
  }
}
