#!/usr/bin/env node
/**
 * Hook PostToolUse: valida o arquivo que acabou de ser escrito.
 *
 *   .json em src/content/anoN/  ->  valida contra o schema Zod
 *   .ts / .tsx                  ->  oxlint no arquivo
 *   qualquer outra coisa        ->  sai na hora
 *
 * Por que um script e nao um comando inline no settings.json: o caminho
 * chega dentro de um JSON, com barras invertidas escapadas no Windows.
 * Extrair isso com sed exige escapar em tres camadas (JSON -> shell ->
 * sed) e quebra em silencio quando uma delas muda. Aqui o JSON.parse
 * resolve, e o script da para testar sozinho.
 *
 * Por que chamar os binarios direto em vez de `npm run`: medido neste
 * projeto, `npm run validate:content` leva 3,8 s e o mesmo script via
 * node leva 0,43 s. Num hook que roda a cada edicao, essa diferenca e a
 * unica coisa que importa.
 *
 * Por que readFileSync(0) e nao process.stdin.on('end'): num modulo ESM
 * com imports, o corpo do modulo so roda depois de resolver o grafo de
 * modulos, e ate la o stdin ja terminou -- o handler de 'end' nunca
 * dispara e o hook vira um no-op silencioso. Leitura sincrona nao tem
 * essa corrida.
 *
 * Saida 2 = erro bloqueante: o Claude Code devolve a mensagem ao modelo.
 */

import { execFileSync, } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// O entry JS, nao o shim de node_modules/.bin: no Windows o shim e um
// .cmd, que execFileSync nao consegue spawnar sem shell -- e com shell o
// caminho deste projeto (que tem espacos e ponto) quebra o quoting.
const OXLINT = join(RAIZ, 'node_modules', 'oxlint', 'bin', 'oxlint')

function lerEntrada() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'))
  } catch {
    // Hook nunca deve derrubar a sessao por entrada vazia ou malformada.
    return null
  }
}

function rodar(comando, args) {
  execFileSync(comando, args, { cwd: RAIZ, stdio: 'inherit' })
}

const entrada = lerEntrada()
const caminho = entrada?.tool_input?.file_path ?? entrada?.tool_response?.filePath ?? ''
if (!caminho) process.exit(0)

const f = caminho.replace(/\\/g, '/')

try {
  if (/\/src\/content\/ano\d+\/[^/]+\.json$/.test(f)) {
    rodar(process.execPath, ['--experimental-strip-types', 'scripts/validate-content.ts'])
  } else if (/\.(ts|tsx)$/.test(f) && !f.includes('/node_modules/')) {
    // --deny-warnings: sem isso o oxlint reporta e sai 0, e o hook nunca
    // bloqueia. A base do projeto passa limpa, entao nao gera ruido.
    rodar(process.execPath, [OXLINT, '--deny-warnings', f])
  }
} catch {
  // O comando ja imprimiu o proprio erro em stdio: 'inherit'.
  process.exit(2)
}
