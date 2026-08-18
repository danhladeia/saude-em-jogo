import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { INTENCOES, type Intencao } from '../src/content/intencoes.ts'

/**
 * A régua da voz — Fase 1 de docs/plano-da-voz.md, automatizada.
 *
 * "Ler em voz alta" é o teste real, mas não escala para 300 falas nem
 * sobrevive a uma atividade nova escrita às pressas. O que dá para medir
 * sem ouvido humano são os defeitos que já apareceram no roteiro:
 * parágrafo empilhado numa string só, travessão e dois-pontos que nenhum
 * TTS transforma em pausa, e oração comprida demais para uma respiração.
 *
 * Roda sobre public/falas/falas.json, que é exatamente o que o motor de
 * voz recebe. Rodar `npm run falas:extrair` antes.
 */

/** Uma respiração. Além disso o locutor emenda e a criança perde o fio. */
const MAX_PALAVRAS_POR_GRUPO = 12
/** Fala inteira. Acima disso vira leitura de bula, mesmo bem pontuada. */
const MAX_PALAVRAS_POR_FALA = 30

interface Fala {
  chave: string
  texto: string
  intencao: Intencao
  onde: string[]
}

/**
 * Pausa de verdade só vem de ponto final, exclamação, interrogação e
 * ponto e vírgula. Vírgula é respiro curto e não conta como corte — é
 * justamente com vírgula que se escreve a frase que não acaba nunca.
 */
function gruposRespiratorios(texto: string): string[] {
  return texto
    .split(/(?<=[.!?;])\s+/)
    .map((g) => g.trim())
    .filter(Boolean)
}

function contarPalavras(trecho: string): number {
  return trecho.split(/\s+/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length
}

function problemas(fala: Fala): string[] {
  const { texto } = fala
  const achados: string[] = []

  // Fala sem intenção sai com a mesma energia de todas as outras, que é
  // exatamente o que a Fase 3 existe para acabar.
  if (!INTENCOES.includes(fala.intencao)) {
    achados.push(`intenção ausente ou desconhecida: ${JSON.stringify(fala.intencao)}`)
  }

  if (/[—–]/.test(texto)) {
    achados.push('travessão (vira ponto final ou vírgula; o TTS o lê como nada)')
  }
  if (/:/.test(texto)) {
    achados.push('dois-pontos (vira ponto final; o TTS não faz a pausa)')
  }

  const total = contarPalavras(texto)
  if (total > MAX_PALAVRAS_POR_FALA) {
    achados.push(`${total} palavras numa fala só (máximo ${MAX_PALAVRAS_POR_FALA})`)
  }

  for (const grupo of gruposRespiratorios(texto)) {
    const n = contarPalavras(grupo)
    if (n > MAX_PALAVRAS_POR_GRUPO) {
      achados.push(`${n} palavras sem pausa (máximo ${MAX_PALAVRAS_POR_GRUPO}): "${grupo}"`)
    }
  }

  return achados
}

const arquivo = fileURLToPath(new URL('../public/falas/falas.json', import.meta.url))
const falas: Fala[] = JSON.parse(readFileSync(arquivo, 'utf8'))

let reprovadas = 0

for (const fala of falas) {
  const achados = problemas(fala)
  if (achados.length === 0) continue

  reprovadas++
  console.error(`\n✗ ${fala.onde.join(', ')}`)
  console.error(`  "${fala.texto}"`)
  for (const achado of achados) console.error(`  → ${achado}`)
}

if (reprovadas > 0) {
  console.error(`\n${reprovadas} de ${falas.length} falas fora da régua da voz.`)
  console.error('Ver docs/plano-da-voz.md, Fase 1.')
  process.exit(1)
}

console.log(`✓ ${falas.length} falas dentro da régua da voz`)
