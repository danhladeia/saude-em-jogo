#!/usr/bin/env node
/**
 * Testes das regras de verificacao de pose.
 *
 * Sao funcoes puras de geometria, e sao exatamente o tipo de codigo que
 * "parece certo" e esta invertido: y cresce para BAIXO na imagem, entao
 * "acima" e y menor, e trocar isso faz a regra aceitar o contrario do
 * movimento pedido. Testar clicando exigiria uma crianca na frente da
 * camera fazendo cada exercicio errado de proposito.
 *
 * O corpo sintetico abaixo esta em coordenadas normalizadas 0..1, como o
 * MediaPipe entrega.
 *
 * Uso: node --experimental-strip-types scripts/testar-poses.mjs
 */

import { PONTO, REGRA_POR_ID, pontosVisiveis } from '../src/content/poses.ts'

let falhas = 0

function conferir(nome, real, esperado) {
  const ok = real === esperado
  if (!ok) falhas++
  console.log(`  ${ok ? 'ok  ' : 'FALHOU'} ${nome}${ok ? '' : `  (esperado ${esperado}, veio ${real})`}`)
}

/** Pessoa de pe, de frente, bracos ao longo do corpo. */
function corpoEmPe() {
  const p = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, visibility: 0.9 }))
  const por = (i, x, y) => { p[i] = { x, y, visibility: 0.9 } }

  por(PONTO.nariz, 0.50, 0.12)
  por(PONTO.orelhaEsq, 0.46, 0.13)
  por(PONTO.orelhaDir, 0.54, 0.13)
  por(PONTO.ombroEsq, 0.42, 0.25)
  por(PONTO.ombroDir, 0.58, 0.25)
  por(PONTO.cotoveloEsq, 0.40, 0.38)
  por(PONTO.cotoveloDir, 0.60, 0.38)
  por(PONTO.punhoEsq, 0.39, 0.50)
  por(PONTO.punhoDir, 0.61, 0.50)
  por(PONTO.quadrilEsq, 0.45, 0.55)
  por(PONTO.quadrilDir, 0.55, 0.55)
  por(PONTO.joelhoEsq, 0.45, 0.75)
  por(PONTO.joelhoDir, 0.55, 0.75)
  por(PONTO.tornozeloEsq, 0.45, 0.95)
  por(PONTO.tornozeloDir, 0.55, 0.95)
  return p
}

const regra = (id) => REGRA_POR_ID.get(id)

console.log('\nbracos acima da cabeca')
{
  const parado = corpoEmPe()
  conferir('bracos abaixados nao passam', regra('bracos-acima-da-cabeca').conferir(parado), false)

  const levantado = corpoEmPe()
  levantado[PONTO.punhoEsq] = { x: 0.42, y: 0.04, visibility: 0.9 }
  levantado[PONTO.punhoDir] = { x: 0.58, y: 0.04, visibility: 0.9 }
  conferir('dois bracos acima do nariz passam', regra('bracos-acima-da-cabeca').conferir(levantado), true)

  const meio = corpoEmPe()
  meio[PONTO.punhoEsq] = { x: 0.42, y: 0.04, visibility: 0.9 }
  conferir('so um braco nao passa', regra('bracos-acima-da-cabeca').conferir(meio), false)
  conferir('mas passa na regra de um braco', regra('um-braco-acima-da-cabeca').conferir(meio), true)
}

console.log('\ncabeca inclinada')
{
  conferir('cabeca reta nao passa', regra('cabeca-inclinada').conferir(corpoEmPe()), false)

  const inclinada = corpoEmPe()
  // Orelha esquerda desce em direcao ao ombro esquerdo.
  inclinada[PONTO.orelhaEsq] = { x: 0.44, y: 0.20, visibility: 0.9 }
  conferir('cabeca no ombro passa', regra('cabeca-inclinada').conferir(inclinada), true)
}

console.log('\ntronco girado')
{
  conferir('de frente nao passa', regra('tronco-girado').conferir(corpoEmPe()), false)

  const girado = corpoEmPe()
  // Ao girar, os ombros encurtam na horizontal; os quadris ficam.
  girado[PONTO.ombroEsq] = { x: 0.47, y: 0.25, visibility: 0.9 }
  girado[PONTO.ombroDir] = { x: 0.53, y: 0.25, visibility: 0.9 }
  conferir('ombros encurtados passam', regra('tronco-girado').conferir(girado), true)
}

console.log('\ntronco inclinado para o lado')
{
  conferir('em pe reto nao passa', regra('tronco-inclinado-lateral').conferir(corpoEmPe()), false)

  const torto = corpoEmPe()
  torto[PONTO.ombroEsq] = { x: 0.42, y: 0.31, visibility: 0.9 }
  torto[PONTO.ombroDir] = { x: 0.58, y: 0.21, visibility: 0.9 }
  conferir('ombros tortos passam', regra('tronco-inclinado-lateral').conferir(torto), true)
}

console.log('\nem um pe so')
{
  conferir('dois pes no chao nao passa', regra('em-um-pe-so').conferir(corpoEmPe()), false)

  const umPe = corpoEmPe()
  umPe[PONTO.tornozeloEsq] = { x: 0.47, y: 0.78, visibility: 0.9 }
  conferir('um tornozelo levantado passa', regra('em-um-pe-so').conferir(umPe), true)
}

console.log('\njoelho levantado')
{
  conferir('em pe parado nao passa', regra('joelho-levantado').conferir(corpoEmPe()), false)

  const marcha = corpoEmPe()
  marcha[PONTO.joelhoEsq] = { x: 0.45, y: 0.50, visibility: 0.9 }
  conferir('joelho acima do quadril passa', regra('joelho-levantado').conferir(marcha), true)
}

console.log('\nagachado')
{
  conferir('em pe nao passa', regra('agachado').conferir(corpoEmPe()), false)

  const agachado = corpoEmPe()
  agachado[PONTO.quadrilEsq] = { x: 0.45, y: 0.72, visibility: 0.9 }
  agachado[PONTO.quadrilDir] = { x: 0.55, y: 0.72, visibility: 0.9 }
  conferir('quadril na altura do joelho passa', regra('agachado').conferir(agachado), true)
}

console.log('\nenquadramento')
{
  const soTronco = corpoEmPe()
  for (const i of [PONTO.joelhoEsq, PONTO.joelhoDir, PONTO.tornozeloEsq, PONTO.tornozeloDir, PONTO.quadrilEsq, PONTO.quadrilDir]) {
    soTronco[i] = { ...soTronco[i], visibility: 0.1 }
  }
  conferir(
    'regra de tronco funciona com so o tronco visivel',
    pontosVisiveis(soTronco, regra('bracos-acima-da-cabeca').exige),
    true,
  )
  conferir(
    'regra de perna nao tenta conferir sem as pernas',
    pontosVisiveis(soTronco, regra('em-um-pe-so').exige),
    false,
  )
}

console.log('\nescala')
{
  // Mesma pose, crianca mais longe da camera: tudo encolhe em torno do centro.
  const longe = corpoEmPe().map((p) => ({ ...p, x: 0.5 + (p.x - 0.5) * 0.4, y: 0.5 + (p.y - 0.5) * 0.4 }))
  const longeInclinada = longe.map((p, i) =>
    i === PONTO.orelhaEsq ? { x: 0.5 + (0.44 - 0.5) * 0.4, y: 0.5 + (0.20 - 0.5) * 0.4, visibility: 0.9 } : p,
  )
  conferir('longe e reto continua reprovando', regra('cabeca-inclinada').conferir(longe), false)
  conferir('longe e inclinado continua passando', regra('cabeca-inclinada').conferir(longeInclinada), true)
}

console.log(falhas === 0 ? '\n✓ tudo certo\n' : `\n✗ ${falhas} falha(s)\n`)
process.exit(falhas === 0 ? 0 : 1)
