/** Fisher-Yates. Não muda o array recebido. */
export function embaralhar<T>(itens: readonly T[]): T[] {
  const copia = [...itens]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function sortear<T>(itens: readonly T[]): T {
  return itens[Math.floor(Math.random() * itens.length)]
}
