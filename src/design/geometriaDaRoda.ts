/**
 * Geometria da roda, compartilhada entre a roleta de alongamentos (um jogo) e
 * a roleta de recompensa (o prêmio). São duas telas diferentes com a mesma
 * matemática — duplicar seria pedir para uma divergir da outra.
 *
 * Convenção: ponteiro no topo, fatias crescendo no sentido horário, raio 100
 * num viewBox centrado na origem.
 */

/** Fatia de pizza da fatia `indice`, com `fatia` graus cada. */
export function caminhoDaFatia(indice: number, fatia: number): string {
  const inicio = indice * fatia - 90
  const fim = inicio + fatia
  const r = 100
  const x1 = r * Math.cos((inicio * Math.PI) / 180)
  const y1 = r * Math.sin((inicio * Math.PI) / 180)
  const x2 = r * Math.cos((fim * Math.PI) / 180)
  const y2 = r * Math.sin((fim * Math.PI) / 180)
  const arcoGrande = fatia > 180 ? 1 : 0
  return `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${arcoGrande} 1 ${x2} ${y2} Z`
}

/** Translada para o meio da fatia, onde vai o desenho. */
export function posicaoDoRotulo(indice: number, fatia: number, raio = 64): string {
  const meio = indice * fatia + fatia / 2 - 90
  const x = raio * Math.cos((meio * Math.PI) / 180)
  const y = raio * Math.sin((meio * Math.PI) / 180)
  return `translate(${x} ${y})`
}

/**
 * Ângulo final para a fatia `alvo` parar sob o ponteiro.
 *
 * Gira algumas voltas cheias e desconta o centro da fatia. Parte de
 * `anguloAtual` para a roda nunca voltar para trás entre um giro e outro.
 */
export function anguloParaParar(anguloAtual: number, alvo: number, totalDeFatias: number): number {
  const fatia = 360 / totalDeFatias
  const voltas = 4 + Math.floor(Math.random() * 3)
  return anguloAtual - (anguloAtual % 360) + voltas * 360 + (360 - (alvo * fatia + fatia / 2))
}
