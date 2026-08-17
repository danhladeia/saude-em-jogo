import { get, set, del, keys } from 'idb-keyval'

/**
 * Persistência local em IndexedDB.
 *
 * TUDO fica no dispositivo. Não há backend, telemetria ou sincronização —
 * o app registra peso, altura e IMC de crianças, que são dados pessoais
 * sensíveis sob a LGPD. A única saída de dados é a exportação CSV, sempre
 * disparada manualmente pela professora na Área do Professor.
 */

export const CHAVES = {
  perfil: 'sej:perfil',
  progresso: 'sej:progresso',
  desafios: 'sej:desafios',
  figurinhas: 'sej:figurinhas',
  sequencia: 'sej:sequencia',
  turma: 'sej:turma',
  alunos: 'sej:alunos',
  questionario: 'sej:questionario',
  preferencias: 'sej:preferencias',
} as const

export async function ler<T>(chave: string, padrao: T): Promise<T> {
  try {
    const valor = await get<T>(chave)
    return valor ?? padrao
  } catch {
    return padrao
  }
}

export async function gravar<T>(chave: string, valor: T): Promise<void> {
  try {
    await set(chave, valor)
  } catch {
    // Modo anônimo ou cota estourada. O jogo continua na memória.
  }
}

export async function apagar(chave: string): Promise<void> {
  try {
    await del(chave)
  } catch {
    /* idem */
  }
}

/** Usado pelo botão "apagar todos os dados" da Área do Professor. */
export async function apagarTudo(): Promise<void> {
  const todas = await keys()
  await Promise.all(
    todas
      .filter((k): k is string => typeof k === 'string' && k.startsWith('sej:'))
      .map((k) => apagar(k)),
  )
}
