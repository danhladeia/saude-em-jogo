import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DIRECAO, INTENCOES, type Intencao } from '../src/content/intencoes.ts'
import { ELEVENLABS, ELEVENLABS_FIXO } from './vozes.ts'

/**
 * Roteiro de geração no ElevenLabs, em public/falas/elevenlabs.md.
 *
 * Existe porque gerar pelo site é um caminho legítimo — não exige chave de
 * API nem terminal, e permite ouvir cada fala antes de aceitar — mas exige
 * duas coisas que a interface não dá: o **nome exato do arquivo** e os
 * **controles certos para aquela intenção**. Nome errado é clipe que nunca
 * toca, sem nenhum erro na tela.
 *
 * Por isso é gerado, e não escrito à mão: no dia em que uma fala mudar, o
 * texto e a chave mudam juntos.
 *
 * As falas saem agrupadas por intenção porque no site os controles se
 * ajustam uma vez por grupo. Ordenar por jogo obrigaria a mexer nos
 * sliders a cada fala.
 */

interface Fala {
  chave: string
  texto: string
  intencao: Intencao
  onde: string[]
}

const pasta = fileURLToPath(new URL('../public/falas', import.meta.url))
const arquivoFalas = join(pasta, 'falas.json')

if (!existsSync(arquivoFalas)) {
  console.error('✗ public/falas/falas.json não existe. Rode `npm run falas:extrair` antes.')
  process.exit(1)
}

const falas: Fala[] = JSON.parse(readFileSync(arquivoFalas, 'utf8'))

/** O ElevenLabs cobra por caractere, então o total decide o plano. */
function caracteres(lista: Fala[]): number {
  return lista.reduce((n, f) => n + f.texto.length, 0)
}

function contar(lista: Fala[]): string {
  const n = lista.length
  return `${n} fala${n === 1 ? '' : 's'}, ${caracteres(lista).toLocaleString('pt-BR')} caracteres`
}

const porIntencao = new Map<Intencao, Fala[]>()
for (const intencao of INTENCOES) porIntencao.set(intencao, [])
for (const f of falas) porIntencao.get(f.intencao)?.push(f)

const total = caracteres(falas)

const linhas: string[] = [
  '# Gerar as falas no ElevenLabs — SAÚDE EM JOGO!',
  '',
  '> Gerado junto com `npm run falas:extrair`. **Não edite à mão:** o conteúdo',
  '> é o único dono dos textos, e uma cópia editada aqui vira nome de arquivo',
  '> errado, que é clipe que nunca toca.',
  '',
  `São **${falas.length} falas**, **${total.toLocaleString('pt-BR')} caracteres**.`,
  '',
  '## Antes de começar',
  '',
  '**Uma voz só, do início ao fim.** A narração não é um leitor de tela, é um',
  'personagem: se a voz mudar no meio, a criança percebe na hora. Escolha uma',
  'voz na Voice Library filtrando por **Portuguese (Brazil)**, prefira timbre',
  'feminino e caloroso, e teste com três falas de intenções diferentes antes de',
  'gerar as outras trezentas.',
  '',
  '| Configuração | Valor |',
  '| --- | --- |',
  `| Modelo | \`${ELEVENLABS_FIXO.modelo}\` |`,
  `| Formato de saída | \`${ELEVENLABS_FIXO.formato}\` (MP3 32 kbps, 22 kHz) |`,
  `| Similarity boost | ${ELEVENLABS_FIXO.similarity_boost} |`,
  '| Speaker boost | ligado |',
  '',
  'O formato é pequeno de propósito: os MP3 entram no precache do service',
  'worker e o app precisa abrir numa máquina de laboratório, offline.',
  '',
  '## Dois caminhos',
  '',
  '### Pela API (recomendado)',
  '',
  'Faz os 343 arquivos com o nome certo, sem renomear nada:',
  '',
  '```bash',
  'PROVEDOR=elevenlabs ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run falas:gerar',
  '```',
  '',
  'Os controles de cada intenção já vão no pedido — é a mesma tabela deste',
  'documento. **Arquivo que já existe nunca é sobrescrito**, então dá para',
  'gerar em partes, e para misturar com falas gravadas por gente.',
  '',
  '### Pelo site',
  '',
  'Para cada fala, em Speech Synthesis:',
  '',
  '1. Ajuste **Stability** e **Style** conforme o grupo (uma vez por grupo).',
  '2. Cole o texto e gere.',
  '3. Baixe e **renomeie para o nome da coluna Arquivo**.',
  '4. Salve em `public/falas/`.',
  '',
  'No fim de tudo, para o app enxergar os clipes novos:',
  '',
  '```bash',
  'npm run falas:manifesto',
  '```',
  '',
  'São 343 downloads e 343 renomeações à mão. Vale para gravar um punhado de',
  'falas escolhidas, ou para testar vozes antes de decidir — para o lote',
  'inteiro, o caminho da API é uma tarde a menos.',
  '',
  '## A voz da Luciana',
  '',
  'O ElevenLabs clona voz a partir de poucos minutos de amostra. Para um',
  'produto de mestrado é a opção mais forte: é o produto dela, e as crianças',
  'da escola conhecem essa voz. **Exige consentimento explícito dela**, por',
  'escrito, e a amostra é dado pessoal — não suba nada sem essa conversa.',
  '',
  'Feito o clone, o `ELEVENLABS_VOICE_ID` passa a ser o da voz dela e as 343',
  'falas saem sem nova sessão de gravação.',
  '',
  '## As falas, por intenção',
  '',
  'Ajuste os controles no começo de cada grupo. Só muda de grupo para grupo —',
  'é o que faz "Isso mesmo!" não sair com a mesma energia de "Tente outro',
  'lugar.".',
  '',
]

for (const intencao of INTENCOES) {
  const grupo = porIntencao.get(intencao) ?? []
  if (grupo.length === 0) continue

  const { stability, style } = ELEVENLABS[intencao]

  linhas.push(
    `### \`${intencao}\` — ${contar(grupo)}`,
    '',
    `**${DIRECAO[intencao]}**`,
    '',
    `| Stability | Style |`,
    `| --- | --- |`,
    `| **${stability}** | **${style}** |`,
    '',
    '| Arquivo | Texto | Onde aparece |',
    '| --- | --- | --- |',
    ...grupo.map(
      (f) =>
        `| \`${f.chave}.mp3\` | ${f.texto.replace(/\|/g, '\\|')} | ${f.onde.join(', ')} |`,
    ),
    '',
  )
}

const destino = join(pasta, 'elevenlabs.md')
writeFileSync(destino, linhas.join('\n'), 'utf8')

console.log(`✓ ${falas.length} falas (${total} caracteres) em public/falas/elevenlabs.md`)
for (const intencao of INTENCOES) {
  const grupo = porIntencao.get(intencao) ?? []
  if (grupo.length > 0) console.log(`  ${intencao}: ${contar(grupo)}`)
}
