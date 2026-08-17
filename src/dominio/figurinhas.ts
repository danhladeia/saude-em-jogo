/**
 * As figurinhas do álbum.
 *
 * Cada atividade concluída dá direito a um giro, e o giro dá uma figurinha.
 * É a mecânica que faz a criança voltar amanhã — recompensa variável, que é o
 * que mais prende nessa idade — e custa quase nada porque o motor da roleta já
 * existia e a arte veio numa folha só.
 *
 * O tema de cada figurinha é um hábito do próprio conteúdo. Colecionar aqui é
 * colecionar as ideias da intervenção, não adesivo genérico.
 */
export interface Figurinha {
  id: string
  rotulo: string
  /** Chave no registro de sprites. */
  imagem: string
  cor: string
}

export const FIGURINHAS: Figurinha[] = [
  { id: 'estrela', rotulo: 'Estrela', imagem: 'figurinhas/estrela', cor: '#FFCA28' },
  { id: 'coracao', rotulo: 'Coração', imagem: 'figurinhas/coracao', cor: '#FF7043' },
  { id: 'gota', rotulo: 'Gota de água', imagem: 'figurinhas/gota', cor: '#4FC3F7' },
  { id: 'maca', rotulo: 'Maçã', imagem: 'figurinhas/maca', cor: '#66BB6A' },
  { id: 'escova', rotulo: 'Escova de dentes', imagem: 'figurinhas/escova', cor: '#4FC3F7' },
  { id: 'lua', rotulo: 'Lua do bom sono', imagem: 'figurinhas/lua', cor: '#A175F2' },
  { id: 'tenis', rotulo: 'Tênis', imagem: 'figurinhas/tenis', cor: '#FF7043' },
  { id: 'corda', rotulo: 'Corda de pular', imagem: 'figurinhas/corda', cor: '#66BB6A' },
  { id: 'musculo', rotulo: 'Força', imagem: 'figurinhas/musculo', cor: '#FFCA28' },
  { id: 'sol', rotulo: 'Sol', imagem: 'figurinhas/sol', cor: '#FFCA28' },
  { id: 'arco-iris', rotulo: 'Arco-íris', imagem: 'figurinhas/arco-iris', cor: '#A175F2' },
  { id: 'trofeu', rotulo: 'Troféu', imagem: 'figurinhas/trofeu', cor: '#FFCA28' },
]

export function acharFigurinha(id: string): Figurinha | undefined {
  return FIGURINHAS.find((f) => f.id === id)
}

/**
 * Sorteia a próxima figurinha.
 *
 * Dá preferência forte às que ainda faltam. Sorteio uniforme puro faria a
 * criança tirar repetida cedo demais e o álbum pararia de avançar bem antes
 * das doze — o que mata exatamente o motivo de existir do álbum. Quando já
 * tem todas, volta a sortear entre todas: repetida ainda é comemoração.
 */
export function sortearFigurinha(coletadas: readonly string[]): Figurinha {
  const faltando = FIGURINHAS.filter((f) => !coletadas.includes(f.id))
  const pote = faltando.length > 0 ? faltando : FIGURINHAS
  return pote[Math.floor(Math.random() * pote.length)]
}
