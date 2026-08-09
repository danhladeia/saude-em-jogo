import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ConteudoDeJogo, type BlocoCorpoAtivo } from '../src/content/schemas.ts'
import { FALAS_DA_INTERFACE } from '../src/content/interface.ts'
import { SESSOES_DE_MOVIMENTO } from '../src/content/movimento.ts'
import { TEMAS_DE_DICA, falaDoTema } from '../src/content/dicas.ts'

/**
 * Levanta TODA fala do app e gera dois arquivos:
 *
 *   public/falas/falas.json          — o que gerar/gravar (texto + onde aparece)
 *   public/falas/roteiro.md          — lista legível para gravação humana
 *
 * Os textos precisam ser byte a byte o que `narrar()` recebe em tempo de
 * execução, senão a chave não bate e o app cai na voz do sistema.
 */

/** Idêntico a src/lib/falas.ts. Se um mudar, o outro tem que mudar junto. */
function chaveDaFala(texto: string): string {
  const normalizado = texto.trim().replace(/\s+/g, ' ')
  let h = 0x811c9dc5
  for (let i = 0; i < normalizado.length; i++) {
    h ^= normalizado.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(36).padStart(7, '0')
}

interface Fala {
  chave: string
  texto: string
  onde: string[]
}

const falas = new Map<string, Fala>()

function registrar(texto: string | undefined, onde: string) {
  if (!texto?.trim()) return
  const chave = chaveDaFala(texto)
  const existente = falas.get(chave)

  if (existente) {
    if (existente.texto !== texto.trim().replace(/\s+/g, ' ')) {
      console.error(`✗ colisão de chave "${chave}":\n  "${existente.texto}"\n  "${texto}"`)
      process.exit(1)
    }
    if (!existente.onde.includes(onde)) existente.onde.push(onde)
    return
  }

  falas.set(chave, { chave, texto: texto.trim().replace(/\s+/g, ' '), onde: [onde] })
}

function registrarCorpoAtivo(bloco: BlocoCorpoAtivo, onde: string) {
  // CorpoAtivo.tsx narra `${rotulo}. ${descricao}` por passo.
  for (const passo of bloco.passos) {
    registrar(`${passo.rotulo}. ${passo.descricao}`, `${onde}/movimento`)
  }
}

// ------------------------------------------------------------------ jogos
const raiz = fileURLToPath(new URL('../src/content', import.meta.url))

for (const pasta of readdirSync(raiz, { withFileTypes: true })) {
  if (!pasta.isDirectory() || !pasta.name.startsWith('ano')) continue

  for (const arquivo of readdirSync(join(raiz, pasta.name))) {
    if (!arquivo.endsWith('.json')) continue

    const bruto = JSON.parse(readFileSync(join(raiz, pasta.name, arquivo), 'utf8'))
    const c = ConteudoDeJogo.parse(bruto)
    const onde = c.id

    // Enunciado.tsx narra a instrução em todo motor menos o quiz.
    if (c.motor !== 'quiz') registrar(c.instrucao, onde)

    switch (c.motor) {
      case 'quiz':
        registrar(c.instrucao, onde)
        for (const p of c.perguntas) {
          registrar(p.enunciado, `${onde}/${p.id}`)
          registrar(p.explicacao, `${onde}/${p.id}/explicação`)
        }
        break

      case 'arrastar-alvo':
        // Narra o rótulo da peça ao encaixar certo.
        for (const peca of c.pecas) registrar(peca.rotulo, `${onde}/peça`)
        break

      case 'associacao':
        for (const par of c.pares) {
          registrar(par.esquerda.rotulo, `${onde}/${par.id}`)
          registrar(par.explicacao ?? `${par.esquerda.rotulo}: ${par.direita.rotulo}`, `${onde}/${par.id}/par`)
        }
        break

      case 'roleta':
        for (const item of c.itens) {
          registrar(`${item.rotulo}. ${item.instrucao}`, `${onde}/${item.id}`)
        }
        break

      case 'corpo-ativo':
        registrarCorpoAtivo(c.bloco, onde)
        break
    }

    if (c.corpoAtivo) registrarCorpoAtivo(c.corpoAtivo, onde)
  }
}

// ------------------------------------------------ seções fora dos jogos
for (const s of SESSOES_DE_MOVIMENTO) registrarCorpoAtivo(s.bloco, `movimento/${s.id}`)
for (const t of TEMAS_DE_DICA) registrar(falaDoTema(t), `dicas/${t.id}`)
for (const f of FALAS_DA_INTERFACE) registrar(f, 'interface')

// ------------------------------------------------------------------ saída
const destino = fileURLToPath(new URL('../public/falas', import.meta.url))
mkdirSync(destino, { recursive: true })

const lista = [...falas.values()].sort((a, b) => a.onde[0].localeCompare(b.onde[0]))

writeFileSync(join(destino, 'falas.json'), JSON.stringify(lista, null, 2) + '\n', 'utf8')

const roteiro = [
  '# Roteiro de gravação — SAÚDE EM JOGO!',
  '',
  `${lista.length} falas. Grave cada uma num arquivo separado, com o nome indicado.`,
  '',
  '## Como gravar',
  '',
  '- Formato final: **MP3 mono, 32 kbps, 24 kHz**. Grave em WAV e converta no fim.',
  '- Ambiente silencioso, microfone a um palmo da boca, sem estourar.',
  '- Fale devagar e com entonação de quem conta história — o público tem 6 a 11 anos.',
  '- Deixe meio segundo de silêncio no começo e no fim de cada arquivo.',
  '- Salve tudo em `public/falas/`.',
  '',
  '## Falas',
  '',
  '| Arquivo | Texto | Onde aparece |',
  '| --- | --- | --- |',
  ...lista.map((f) => `| \`${f.chave}.mp3\` | ${f.texto.replace(/\|/g, '\\|')} | ${f.onde.join(', ')} |`),
  '',
].join('\n')

writeFileSync(join(destino, 'roteiro.md'), roteiro, 'utf8')

const palavras = lista.reduce((n, f) => n + f.texto.split(/\s+/).length, 0)
console.log(`✓ ${lista.length} falas (${palavras} palavras) em public/falas/falas.json`)
console.log('  roteiro de gravação em public/falas/roteiro.md')
