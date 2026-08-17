import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
// Extensões explícitas: este arquivo roda no Node direto, sem bundler.
import { ConteudoDeJogo } from '../src/content/schemas.ts'
import { CATALOGO } from '../src/dominio/catalogo.ts'
import { z } from 'zod'

/**
 * Roda no build (`npm run validate:content`). Conteúdo fora do contrato
 * quebra aqui, na máquina de quem editou — não no laboratório, no meio da aula.
 */

const raiz = fileURLToPath(new URL('../src/content', import.meta.url))
const biblioteca = fileURLToPath(new URL('../src/assets/library', import.meta.url))
const problemas: string[] = []
let validados = 0

/**
 * Todo valor sob uma chave `imagem`, em qualquer profundidade.
 *
 * Os campos de imagem estão espalhados pelos schemas — opção de quiz, peça de
 * arrastar, passo do corpo ativo, cenário, item de roleta. Varrer é mais
 * seguro que listar cada caminho e esquecer um quando o schema crescer.
 */
function chavesDeImagem(valor: unknown, achadas: string[] = []): string[] {
  if (Array.isArray(valor)) {
    for (const item of valor) chavesDeImagem(item, achadas)
  } else if (valor && typeof valor === 'object') {
    for (const [chave, dentro] of Object.entries(valor)) {
      if (chave === 'imagem' && typeof dentro === 'string') achadas.push(dentro)
      else chavesDeImagem(dentro, achadas)
    }
  }
  return achadas
}

for (const pasta of readdirSync(raiz, { withFileTypes: true })) {
  if (!pasta.isDirectory() || !pasta.name.startsWith('ano')) continue

  for (const arquivo of readdirSync(join(raiz, pasta.name))) {
    if (!arquivo.endsWith('.json')) continue
    const caminho = join(pasta.name, arquivo)

    let bruto: unknown
    try {
      bruto = JSON.parse(readFileSync(join(raiz, caminho), 'utf8'))
    } catch (e) {
      problemas.push(`${caminho}: JSON malformado — ${(e as Error).message}`)
      continue
    }

    const resultado = ConteudoDeJogo.safeParse(bruto)
    if (!resultado.success) {
      problemas.push(`${caminho}:\n${z.prettifyError(resultado.error)}`)
      continue
    }

    const conteudo = resultado.data
    const esperado = arquivo.replace('.json', '')

    if (conteudo.id !== esperado) {
      problemas.push(`${caminho}: o campo "id" é "${conteudo.id}" mas o arquivo se chama "${esperado}".`)
    }

    const atividade = CATALOGO.find((a) => a.id === conteudo.id)
    if (!atividade) {
      problemas.push(`${caminho}: "${conteudo.id}" não existe no catálogo.`)
    } else if (atividade.motor !== conteudo.motor) {
      problemas.push(
        `${caminho}: o catálogo diz motor "${atividade.motor}", o arquivo diz "${conteudo.motor}".`,
      )
    }

    // Chave de sprite que não existe vira imagem quebrada só na aula.
    // Aqui ela quebra o build, que é onde custa menos.
    for (const chave of chavesDeImagem(conteudo)) {
      if (!existsSync(join(biblioteca, `${chave}.webp`))) {
        problemas.push(
          `${caminho}: a imagem "${chave}" não existe em src/assets/library/${chave}.webp`,
        )
      }
    }

    // Toda peça precisa de um alvo real, senão o jogo fica impossível.
    if (conteudo.motor === 'arrastar-alvo') {
      const alvos = new Set(conteudo.alvos.map((a) => a.id))
      for (const peca of conteudo.pecas) {
        if (!alvos.has(peca.alvoId)) {
          problemas.push(`${caminho}: a peça "${peca.id}" aponta para o alvo inexistente "${peca.alvoId}".`)
        }
      }
    }

    // Quiz sem resposta certa trava a criança na tela.
    if (conteudo.motor === 'quiz') {
      for (const pergunta of conteudo.perguntas) {
        const certas = pergunta.opcoes.filter((o) => o.correta).length
        if (certas === 0) {
          problemas.push(`${caminho}: a pergunta "${pergunta.id}" não tem nenhuma opção correta.`)
        }
        if (pergunta.tipo === 'unica' && certas > 1) {
          problemas.push(
            `${caminho}: a pergunta "${pergunta.id}" é de resposta única mas tem ${certas} corretas.`,
          )
        }
      }
    }

    validados++
  }
}

// Atividade marcada como disponível sem arquivo vira botão que não abre.
const arquivos = new Set(
  readdirSync(raiz, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith('ano'))
    .flatMap((d) => readdirSync(join(raiz, d.name)).map((f) => f.replace('.json', ''))),
)

for (const atividade of CATALOGO) {
  if (atividade.disponivel && !arquivos.has(atividade.id)) {
    problemas.push(
      `catálogo: "${atividade.id}" está marcada como disponível mas não tem arquivo de conteúdo.`,
    )
  }
}

if (problemas.length > 0) {
  console.error(`\n✗ ${problemas.length} problema(s) de conteúdo:\n`)
  for (const p of problemas) console.error(`  ${p}\n`)
  process.exit(1)
}

console.log(`✓ ${validados} arquivo(s) de conteúdo válidos.`)
