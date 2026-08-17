#!/usr/bin/env node
/**
 * Hook Stop: checagem de tipos completa ao fim do turno.
 *
 * Roda com asyncRewake no settings.json: sai em segundo plano, nao segura
 * a resposta, e so acorda o modelo se falhar (saida 2). E o arranjo certo
 * para um comando lento -- `tsc -b` leva ~9,5 s medido neste projeto, e
 * pagar isso a cada edicao seria insuportavel, mas uma vez por turno em
 * background e de graca.
 *
 * O oxlint e a validacao de conteudo ficam no hook por edicao
 * (hook-pos-edicao.mjs) porque sao rapidos o bastante para bloquear na
 * hora, que e quando o erro custa menos para consertar.
 */

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TSC = join(RAIZ, 'node_modules', 'typescript', 'bin', 'tsc')

try {
  execFileSync(process.execPath, [TSC, '-b'], { cwd: RAIZ, stdio: 'inherit' })
} catch {
  console.error('\nA checagem de tipos falhou. Corrija antes de seguir.')
  process.exit(2)
}
