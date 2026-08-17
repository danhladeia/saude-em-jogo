import { create } from 'zustand'
import { CHAVES, gravar, ler } from '@/lib/armazenamento'
import { avancarSequencia, SEQUENCIA_ZERADA, type Sequencia } from '@/lib/dias'
import { chaveDoAluno, fundirAluno, type DadosDoAluno, type RespostaDeQuestionario } from '@/dominio/aluno'
import type { Ano, Personagem, RegistroDeConclusao } from '@/dominio/tipos'

interface Perfil {
  nome: string
  ano: Ano | null
  personagem: Personagem
}

interface Preferencias {
  som: boolean
  narracao: boolean
  modoTurma: boolean
}

const PERFIL_VAZIO: Perfil = { nome: '', ano: null, personagem: 'menino' }
const PREFERENCIAS_PADRAO: Preferencias = { som: true, narracao: true, modoTurma: false }

interface EstadoPerfil {
  perfil: Perfil
  preferencias: Preferencias
  /** atividadeId -> conclusão. Guarda sempre o melhor resultado. */
  progresso: Record<string, RegistroDeConclusao>
  /** Ids das figurinhas já coletadas, na ordem em que vieram. */
  figurinhas: string[]
  sequencia: Sequencia
  /** Respostas do aluno da sessão atual. */
  pre?: RespostaDeQuestionario
  pos?: RespostaDeQuestionario
  /** Todo aluno que já usou esta máquina. É a base da exportação da pesquisa. */
  alunos: Record<string, DadosDoAluno>
  carregado: boolean

  carregar: () => Promise<void>
  definirNome: (nome: string) => void
  definirAno: (ano: Ano) => void
  definirPersonagem: (personagem: Personagem) => void
  alternarPreferencia: (chave: keyof Preferencias) => void
  registrarConclusao: (registro: RegistroDeConclusao) => void
  ganharFigurinha: (id: string) => void
  marcarDiaDeDesafio: () => void
  salvarQuestionario: (momento: 'pre' | 'pos', resposta: RespostaDeQuestionario) => void
  /** Arquiva o aluno atual e devolve o app à tela inicial, limpo. */
  trocarDeAluno: () => void
  reiniciarSessao: () => void
}

export const usarPerfil = create<EstadoPerfil>((set, get) => ({
  perfil: PERFIL_VAZIO,
  preferencias: PREFERENCIAS_PADRAO,
  progresso: {},
  figurinhas: [],
  sequencia: SEQUENCIA_ZERADA,
  alunos: {},
  carregado: false,

  carregar: async () => {
    const [perfilSalvo, preferencias, progresso, figurinhas, sequencia, alunos, sessao] =
      await Promise.all([
        ler<Perfil>(CHAVES.perfil, PERFIL_VAZIO),
        ler<Preferencias>(CHAVES.preferencias, PREFERENCIAS_PADRAO),
        ler<Record<string, RegistroDeConclusao>>(CHAVES.progresso, {}),
        ler<string[]>(CHAVES.figurinhas, []),
        ler<Sequencia>(CHAVES.sequencia, SEQUENCIA_ZERADA),
        ler<Record<string, DadosDoAluno>>(CHAVES.alunos, {}),
        ler<{ pre?: RespostaDeQuestionario; pos?: RespostaDeQuestionario }>(CHAVES.questionario, {}),
      ])
    aplicarModoTurma(preferencias.modoTurma)
    // Perfil gravado antes da escolha de personagem existir não tem o campo.
    const perfil: Perfil = { ...PERFIL_VAZIO, ...perfilSalvo }
    set({
      perfil,
      preferencias,
      progresso,
      figurinhas,
      sequencia,
      alunos,
      pre: sessao.pre,
      pos: sessao.pos,
      carregado: true,
    })
  },

  definirNome: (nome) => {
    const perfil = { ...get().perfil, nome: nome.trim() }
    set({ perfil })
    void gravar(CHAVES.perfil, perfil)
  },

  definirAno: (ano) => {
    const perfil = { ...get().perfil, ano }
    set({ perfil })
    void gravar(CHAVES.perfil, perfil)
  },

  definirPersonagem: (personagem) => {
    const perfil = { ...get().perfil, personagem }
    set({ perfil })
    void gravar(CHAVES.perfil, perfil)
  },

  alternarPreferencia: (chave) => {
    const preferencias = { ...get().preferencias, [chave]: !get().preferencias[chave] }
    if (chave === 'modoTurma') aplicarModoTurma(preferencias.modoTurma)
    set({ preferencias })
    void gravar(CHAVES.preferencias, preferencias)
  },

  registrarConclusao: (registro) => {
    const anterior = get().progresso[registro.atividadeId]
    // Nunca rebaixa o resultado: refazer uma atividade e ir pior não pode
    // tirar estrela que a criança já conquistou.
    if (anterior && anterior.estrelas >= registro.estrelas) return

    const progresso = { ...get().progresso, [registro.atividadeId]: registro }
    set({ progresso })
    void gravar(CHAVES.progresso, progresso)
  },

  ganharFigurinha: (id) => {
    // Repetida não entra duas vezes: o álbum tem doze lugares, não uma pilha.
    if (get().figurinhas.includes(id)) return
    const figurinhas = [...get().figurinhas, id]
    set({ figurinhas })
    void gravar(CHAVES.figurinhas, figurinhas)
  },

  marcarDiaDeDesafio: () => {
    const sequencia = avancarSequencia(get().sequencia)
    if (sequencia === get().sequencia) return
    set({ sequencia })
    void gravar(CHAVES.sequencia, sequencia)
  },

  salvarQuestionario: (momento, resposta) => {
    set({ [momento]: resposta } as Partial<EstadoPerfil>)
    const { pre, pos } = get()
    void gravar(CHAVES.questionario, { pre, pos })
    arquivar(get())
  },

  trocarDeAluno: () => {
    arquivar(get())
    set({
      perfil: PERFIL_VAZIO,
      progresso: {},
      figurinhas: [],
      pre: undefined,
      pos: undefined,
    })
    // A sequência de dias fica: ela é do computador do laboratório, não de um
    // aluno. Progresso, figurinhas e questionário, não — esses são de quem
    // jogou, e é o que a dissertação precisa separar por nome.
    void gravar(CHAVES.perfil, PERFIL_VAZIO)
    void gravar(CHAVES.progresso, {})
    void gravar(CHAVES.figurinhas, [])
    void gravar(CHAVES.questionario, {})
  },

  reiniciarSessao: () => {
    set({ perfil: PERFIL_VAZIO })
    void gravar(CHAVES.perfil, PERFIL_VAZIO)
  },
}))

/**
 * Guarda a sessão atual no arquivo de alunos.
 *
 * Chamado a cada mudança relevante, não só na troca de aluno: criança que sai
 * sem avisar é a regra, não a exceção, e perder o dado dela é perder um sujeito
 * da pesquisa.
 */
function arquivar(estado: EstadoPerfil) {
  const { perfil, progresso, figurinhas, pre, pos, alunos } = estado
  if (!perfil.nome.trim()) return

  const chave = chaveDoAluno(perfil.nome)
  const atual: DadosDoAluno = {
    nome: perfil.nome.trim(),
    ano: perfil.ano,
    progresso,
    figurinhas,
    pre,
    pos,
    atualizadoEm: new Date().toISOString(),
  }

  const novos = { ...alunos, [chave]: fundirAluno(alunos[chave], atual) }
  usarPerfil.setState({ alunos: novos })
  void gravar(CHAVES.alunos, novos)
}

function aplicarModoTurma(ativo: boolean) {
  if (typeof document === 'undefined') return
  if (ativo) document.documentElement.dataset.modo = 'turma'
  else delete document.documentElement.dataset.modo
}

/** Total de estrelas conquistadas — cabeçalho de "Minhas Conquistas". */
export function totalDeEstrelas(progresso: Record<string, RegistroDeConclusao>): number {
  return Object.values(progresso).reduce((soma, r) => soma + r.estrelas, 0)
}
