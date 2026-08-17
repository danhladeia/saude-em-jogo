#!/usr/bin/env node
/**
 * Testes da logica que nao da para verificar clicando: virada de dia da
 * sequencia e sorteio das figurinhas.
 *
 * A sequencia so quebra amanha, e o sorteio so mostra o vies depois de muitas
 * repeticoes. Os dois sao exatamente o tipo de bug que passa despercebido no
 * navegador e aparece em sala.
 *
 * Uso: node --experimental-strip-types scripts/testar-laco.mjs
 */

import { avancarSequencia, comoDia, sequenciaVisivel } from '../src/lib/dias.ts'
import { FIGURINHAS, sortearFigurinha } from '../src/dominio/figurinhas.ts'

let falhas = 0

function conferir(nome, real, esperado) {
  const ok = JSON.stringify(real) === JSON.stringify(esperado)
  if (!ok) falhas++
  console.log(`  ${ok ? 'ok  ' : 'FALHOU'} ${nome}${ok ? '' : `\n         esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(real)}`}`)
}

function diasAtras(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return comoDia(d)
}

const HOJE = diasAtras(0)
const ONTEM = diasAtras(1)

console.log('sequencia de dias')
conferir(
  'jogar de novo no mesmo dia nao soma',
  avancarSequencia({ dias: 3, ultimoDia: HOJE }),
  { dias: 3, ultimoDia: HOJE },
)
conferir(
  'jogar no dia seguinte soma um',
  avancarSequencia({ dias: 3, ultimoDia: ONTEM }),
  { dias: 4, ultimoDia: HOJE },
)
conferir(
  'pular um dia recomeca em 1',
  avancarSequencia({ dias: 7, ultimoDia: diasAtras(2) }),
  { dias: 1, ultimoDia: HOJE },
)
conferir(
  'primeira vez comeca em 1',
  avancarSequencia({ dias: 0, ultimoDia: '' }),
  { dias: 1, ultimoDia: HOJE },
)

console.log('\nsequencia visivel')
conferir('marcou hoje, mostra o numero', sequenciaVisivel({ dias: 5, ultimoDia: HOJE }), 5)
conferir('marcou ontem, corrente viva', sequenciaVisivel({ dias: 5, ultimoDia: ONTEM }), 5)
conferir('sumiu por 3 dias, mostra zero', sequenciaVisivel({ dias: 5, ultimoDia: diasAtras(3) }), 0)
conferir('nunca marcou, mostra zero', sequenciaVisivel({ dias: 0, ultimoDia: '' }), 0)

console.log('\nsorteio de figurinhas')
{
  // Com onze coletadas, o sorteio tem que cair na que falta, sempre.
  const faltaUma = FIGURINHAS.slice(0, 11).map((f) => f.id)
  const alvo = FIGURINHAS[11].id
  const sempre = Array.from({ length: 200 }, () => sortearFigurinha(faltaUma).id)
  conferir('so sorteia a que falta', [...new Set(sempre)], [alvo])
}
{
  // Album cheio: volta a sortear entre todas, sem travar.
  const todas = FIGURINHAS.map((f) => f.id)
  const variedade = new Set(Array.from({ length: 400 }, () => sortearFigurinha(todas).id))
  conferir('album cheio ainda sorteia', variedade.size > 6, true)
}
{
  // Album vazio: as doze precisam sair em numero razoavel de giros.
  const vistas = new Set()
  for (let i = 0; i < 400; i++) vistas.add(sortearFigurinha([...vistas]).id)
  conferir('album vazio fecha as doze', vistas.size, FIGURINHAS.length)
}

console.log(falhas === 0 ? '\n✓ tudo certo' : `\n✗ ${falhas} falha(s)`)
process.exit(falhas === 0 ? 0 : 1)
