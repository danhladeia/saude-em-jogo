/**
 * Datas no fuso local do aluno.
 *
 * De propósito sem UTC: o dia da criança vira à meia-noite dela, não em
 * Greenwich. Usar toISOString() aqui faria a sequência quebrar sozinha para
 * quem joga de noite no Brasil — o pior jeito possível de perder uma sequência.
 */

/** 'AAAA-MM-DD' de hoje, no fuso local. */
export function hoje(): string {
  return comoDia(new Date())
}

export function comoDia(data: Date): string {
  const m = String(data.getMonth() + 1).padStart(2, '0')
  const d = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${m}-${d}`
}

export function ontem(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return comoDia(d)
}

/** Semana do ano, para os desafios semanais. */
export function semanaAtual(): string {
  const d = new Date()
  const inicio = new Date(d.getFullYear(), 0, 1)
  const dias = Math.floor((d.getTime() - inicio.getTime()) / 86_400_000)
  return `${d.getFullYear()}-S${Math.ceil((dias + inicio.getDay() + 1) / 7)}`
}

export interface Sequencia {
  /** Dias seguidos com pelo menos um desafio cumprido. */
  dias: number
  /** Último dia contado, em 'AAAA-MM-DD'. */
  ultimoDia: string
}

export const SEQUENCIA_ZERADA: Sequencia = { dias: 0, ultimoDia: '' }

/**
 * Avança a sequência para hoje.
 *
 * Mesmo dia: nada muda — marcar cinco desafios não vale cinco dias.
 * Ontem: soma um.
 * Qualquer outro caso: recomeça em 1, porque a corrente quebrou.
 */
export function avancarSequencia(atual: Sequencia): Sequencia {
  const dia = hoje()
  if (atual.ultimoDia === dia) return atual
  if (atual.ultimoDia === ontem()) return { dias: atual.dias + 1, ultimoDia: dia }
  return { dias: 1, ultimoDia: dia }
}

/**
 * A sequência como ela deve APARECER hoje.
 *
 * Guardar o número cru mostraria "7 dias" para quem não abre o app há duas
 * semanas. Se o último dia não é hoje nem ontem, a corrente já quebrou e a
 * tela precisa dizer isso.
 */
export function sequenciaVisivel(atual: Sequencia): number {
  if (atual.ultimoDia === hoje() || atual.ultimoDia === ontem()) return atual.dias
  return 0
}
