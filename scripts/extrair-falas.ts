import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ConteudoDeJogo, type BlocoCorpoAtivo } from '../src/content/schemas.ts'
import { FALAS_DA_INTERFACE } from '../src/content/interface.ts'
import { SESSOES_DE_MOVIMENTO } from '../src/content/movimento.ts'
import { TEMAS_DE_DICA, falasDoTema } from '../src/content/dicas.ts'
import { DIRECAO, type Intencao } from '../src/content/intencoes.ts'
import { FIGURINHAS } from '../src/dominio/figurinhas.ts'

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
  /** Como dizer. Ver src/content/intencoes.ts. */
  intencao: Intencao
  onde: string[]
}

const falas = new Map<string, Fala>()

/**
 * Texto igual é sempre o mesmo clipe — de propósito, e é o que mantém o
 * roteiro de gravação curto. Quando o mesmo texto reaparece com outra
 * intenção, vale a primeira: um arquivo de áudio só pode ser dito de um
 * jeito.
 */
function registrar(texto: string | undefined, onde: string, intencao: Intencao) {
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

  falas.set(chave, { chave, texto: texto.trim().replace(/\s+/g, ' '), intencao, onde: [onde] })
}

function registrarCorpoAtivo(bloco: BlocoCorpoAtivo, onde: string) {
  // Só os passos: a tela de convite mostra `bloco.instrucao` mas não a
  // narra, e registrar aqui geraria clipe que ninguém toca.
  // CorpoAtivo.tsx narra `${rotulo}. ${descricao}` por passo.
  for (const passo of bloco.passos) {
    registrar(`${passo.rotulo}. ${passo.descricao}`, `${onde}/movimento`, passo.intencao ?? 'convite-movimento')
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
    if (c.motor !== 'quiz') registrar(c.instrucao, onde, 'instrucao')

    switch (c.motor) {
      case 'quiz':
        registrar(c.instrucao, onde, 'instrucao')
        for (const p of c.perguntas) {
          registrar(p.enunciado, `${onde}/${p.id}`, 'pergunta')
          // A explicação é o momento de ensinar, não de corrigir.
          registrar(p.explicacao, `${onde}/${p.id}/explicação`, 'curiosidade')
        }
        break

      case 'arrastar-alvo':
        // Ao encaixar certo o motor narra a explicação, quando existe, e o
        // rótulo quando não existe — os dois precisam de clipe. Sem
        // explicação sobra o rótulo solto ("Cabeça"), que no momento do
        // acerto é confirmação, não descoberta.
        for (const peca of c.pecas) {
          registrar(
            peca.explicacao ?? peca.rotulo,
            `${onde}/peça`,
            peca.explicacao ? 'curiosidade' : 'comemoracao',
          )
        }
        break

      case 'associacao':
        for (const par of c.pares) {
          // Rótulo do card ao ser tocado: só nomear o que está ali.
          registrar(par.esquerda.rotulo, `${onde}/${par.id}`, 'instrucao')
          registrar(
            par.explicacao ?? `${par.esquerda.rotulo}: ${par.direita.rotulo}`,
            `${onde}/${par.id}/par`,
            par.explicacao ? 'curiosidade' : 'comemoracao',
          )
        }
        break

      case 'roleta':
        for (const item of c.itens) {
          registrar(
            `${item.rotulo}. ${item.instrucao}`,
            `${onde}/${item.id}`,
            item.intencao ?? 'convite-movimento',
          )
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

// Cada dica é uma fala própria, narrada em sequência — um clipe por ideia.
// O convite abre o tema; as dicas em si são instrução.
for (const t of TEMAS_DE_DICA) {
  const [convite, ...dicas] = falasDoTema(t)
  registrar(convite, `dicas/${t.id}`, 'comemoracao')
  for (const dica of dicas) registrar(dica, `dicas/${t.id}`, 'instrucao')
}

for (const f of FALAS_DA_INTERFACE) registrar(f.texto, 'interface', f.intencao)

/*
 * A roleta de recompensa monta a fala com o rótulo da figurinha sorteada.
 * O texto é dinâmico, mas o conjunto é fechado — doze figurinhas, duas
 * formas cada — e sem isto o momento mais comemorativo do app é o único
 * garantidamente robótico, porque nunca entrou no roteiro de gravação.
 * Precisa bater byte a byte com src/design/RoletaDeRecompensa.tsx.
 */
for (const f of FIGURINHAS) {
  registrar(`Você ganhou ${f.rotulo}!`, `recompensa/${f.id}`, 'comemoracao')
  registrar(`Você tirou ${f.rotulo} de novo!`, `recompensa/${f.id}/repetida`, 'comemoracao')
}

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
  '**Siga a coluna "Como dizer".** É o que separa um app que lê para a criança de',
  'alguém que está jogando com ela: comemoração, instrução e consolo lidos com a',
  'mesma energia soam a máquina, por melhor que seja a voz.',
  '',
  '## Direções',
  '',
  '| Intenção | Como dizer |',
  '| --- | --- |',
  ...Object.entries(DIRECAO).map(([i, d]) => `| \`${i}\` | ${d} |`),
  '',
  '## Falas',
  '',
  '| Arquivo | Texto | Como dizer | Onde aparece |',
  '| --- | --- | --- | --- |',
  ...lista.map(
    (f) =>
      `| \`${f.chave}.mp3\` | ${f.texto.replace(/\|/g, '\\|')} | ${DIRECAO[f.intencao]} | ${f.onde.join(', ')} |`,
  ),
  '',
].join('\n')

writeFileSync(join(destino, 'roteiro.md'), roteiro, 'utf8')

const palavras = lista.reduce((n, f) => n + f.texto.split(/\s+/).length, 0)
console.log(`✓ ${lista.length} falas (${palavras} palavras) em public/falas/falas.json`)
console.log('  roteiro de gravação em public/falas/roteiro.md')

const porIntencao = new Map<string, number>()
for (const f of lista) porIntencao.set(f.intencao, (porIntencao.get(f.intencao) ?? 0) + 1)
const resumo = [...porIntencao.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([i, n]) => `${i} ${n}`)
  .join(', ')
console.log(`  intenções: ${resumo}`)
