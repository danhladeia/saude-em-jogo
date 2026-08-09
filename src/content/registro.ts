import { validarConteudo, type ConteudoDeJogo } from './schemas'

/**
 * Um módulo JSON por atividade, carregado sob demanda.
 *
 * `import.meta.glob` mantém cada jogo num chunk próprio: abrir o 1º ano
 * não baixa o conteúdo dos outros quatro. Adicionar um jogo é colocar o
 * arquivo na pasta — nada aqui muda.
 */
const ARQUIVOS = import.meta.glob<{ default: unknown }>('./ano*/*.json')

function caminhoDe(atividadeId: string): string | undefined {
  const ano = atividadeId.slice(0, 4) // 'ano1'
  return Object.keys(ARQUIVOS).find((c) => c === `./${ano}/${atividadeId}.json`)
}

export function temConteudo(atividadeId: string): boolean {
  return caminhoDe(atividadeId) !== undefined
}

export async function carregarConteudo(atividadeId: string): Promise<ConteudoDeJogo> {
  const caminho = caminhoDe(atividadeId)
  if (!caminho) throw new Error(`Sem arquivo de conteúdo para "${atividadeId}".`)

  const modulo = await ARQUIVOS[caminho]()
  return validarConteudo(modulo.default, caminho)
}
