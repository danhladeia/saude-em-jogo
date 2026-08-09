import { create } from 'zustand'
import { CHAVES, gravar, ler } from '@/lib/armazenamento'
import type { Ano, RegistroDeConclusao } from '@/dominio/tipos'

interface Perfil {
  nome: string
  ano: Ano | null
}

interface Preferencias {
  som: boolean
  narracao: boolean
  modoTurma: boolean
}

const PERFIL_VAZIO: Perfil = { nome: '', ano: null }
const PREFERENCIAS_PADRAO: Preferencias = { som: true, narracao: true, modoTurma: false }

interface EstadoPerfil {
  perfil: Perfil
  preferencias: Preferencias
  /** atividadeId -> conclusão. Guarda sempre o melhor resultado. */
  progresso: Record<string, RegistroDeConclusao>
  carregado: boolean

  carregar: () => Promise<void>
  definirNome: (nome: string) => void
  definirAno: (ano: Ano) => void
  alternarPreferencia: (chave: keyof Preferencias) => void
  registrarConclusao: (registro: RegistroDeConclusao) => void
  reiniciarSessao: () => void
}

export const usarPerfil = create<EstadoPerfil>((set, get) => ({
  perfil: PERFIL_VAZIO,
  preferencias: PREFERENCIAS_PADRAO,
  progresso: {},
  carregado: false,

  carregar: async () => {
    const [perfil, preferencias, progresso] = await Promise.all([
      ler<Perfil>(CHAVES.perfil, PERFIL_VAZIO),
      ler<Preferencias>(CHAVES.preferencias, PREFERENCIAS_PADRAO),
      ler<Record<string, RegistroDeConclusao>>(CHAVES.progresso, {}),
    ])
    aplicarModoTurma(preferencias.modoTurma)
    set({ perfil, preferencias, progresso, carregado: true })
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

  reiniciarSessao: () => {
    set({ perfil: PERFIL_VAZIO })
    void gravar(CHAVES.perfil, PERFIL_VAZIO)
  },
}))

function aplicarModoTurma(ativo: boolean) {
  if (typeof document === 'undefined') return
  if (ativo) document.documentElement.dataset.modo = 'turma'
  else delete document.documentElement.dataset.modo
}

/** Total de estrelas conquistadas — cabeçalho de "Minhas Conquistas". */
export function totalDeEstrelas(progresso: Record<string, RegistroDeConclusao>): number {
  return Object.values(progresso).reduce((soma, r) => soma + r.estrelas, 0)
}
