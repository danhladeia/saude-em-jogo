import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Gera os clipes de narração a partir de public/falas/falas.json.
 *
 * Roda UMA vez, fora do app. Os MP3 viram assets estáticos: a criança
 * ouve uma voz neural mesmo sem internet, e não há custo por reprodução
 * nem chave de API dentro do app.
 *
 * REGRA IMPORTANTE: arquivo que já existe nunca é sobrescrito. É assim
 * que a voz gravada da professora convive com a voz sintética — ela grava
 * as falas que quiser, o script preenche o resto.
 *
 * Uso:
 *   PROVEDOR=openai      OPENAI_API_KEY=...     npm run falas:gerar
 *   PROVEDOR=elevenlabs  ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run falas:gerar
 *   PROVEDOR=azure       AZURE_TTS_KEY=...      AZURE_TTS_REGION=brazilsouth npm run falas:gerar
 */

import type { Intencao } from '../src/content/intencoes.ts'
import { AZURE, BASE_OPENAI, ELEVENLABS, ELEVENLABS_FIXO, OPENAI } from './vozes.ts'

interface Fala {
  chave: string
  texto: string
  intencao: Intencao
  onde: string[]
}

type Provedor = (fala: Fala) => Promise<Buffer>

const destino = fileURLToPath(new URL('../public/falas', import.meta.url))

/* ------------------------------------------------------------------ *
 * Provedores
 *
 * Os parâmetros de tom por intenção vivem em ./vozes.ts, porque o roteiro
 * do ElevenLabs precisa exatamente dos mesmos números.
 * ------------------------------------------------------------------ */

function openai(): Provedor {
  const chave = exigir('OPENAI_API_KEY')
  const voz = process.env.OPENAI_VOICE ?? 'nova'
  const modelo = process.env.OPENAI_TTS_MODEL ?? 'gpt-4o-mini-tts'

  return async (fala) => {
    const r = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelo,
        voice: voz,
        input: fala.texto,
        response_format: 'mp3',
        // A instrução importa mais que a escolha da voz: sem ela a
        // leitura sai em ritmo de locutor adulto.
        instructions: BASE_OPENAI + OPENAI[fala.intencao],
      }),
    })
    if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`)
    return Buffer.from(await r.arrayBuffer())
  }
}

function elevenlabs(): Provedor {
  const chave = exigir('ELEVENLABS_API_KEY')
  const voz = exigir('ELEVENLABS_VOICE_ID')
  const modelo = process.env.ELEVENLABS_MODEL ?? ELEVENLABS_FIXO.modelo

  return async (fala) => {
    const { stability, style } = ELEVENLABS[fala.intencao]
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}?output_format=${ELEVENLABS_FIXO.formato}`, {
      method: 'POST',
      headers: { 'xi-api-key': chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: fala.texto,
        model_id: modelo,
        voice_settings: { stability, similarity_boost: ELEVENLABS_FIXO.similarity_boost, style },
      }),
    })
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`)
    return Buffer.from(await r.arrayBuffer())
  }
}

function azure(): Provedor {
  const chave = exigir('AZURE_TTS_KEY')
  const regiao = process.env.AZURE_TTS_REGION ?? 'brazilsouth'
  const voz = process.env.AZURE_TTS_VOICE ?? 'pt-BR-FranciscaNeural'

  return async (fala) => {
    const { estilo, ritmo } = AZURE[fala.intencao]
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="pt-BR"><voice name="${voz}"><mstts:express-as style="${estilo}"><prosody rate="${ritmo}">${escapar(fala.texto)}</prosody></mstts:express-as></voice></speak>`

    const r = await fetch(`https://${regiao}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': chave,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    })
    if (!r.ok) throw new Error(`Azure ${r.status}: ${await r.text()}`)
    return Buffer.from(await r.arrayBuffer())
  }
}

const PROVEDORES: Record<string, () => Provedor> = { openai, elevenlabs, azure }

/* ------------------------------------------------------------------ */

function exigir(nome: string): string {
  const v = process.env[nome]
  if (!v) {
    console.error(`✗ falta a variável de ambiente ${nome}.`)
    process.exit(1)
  }
  return v
}

function escapar(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Reescreve manifesto.json com o que realmente existe em disco. */
function escreverManifesto() {
  const chaves = readdirSync(destino)
    .filter((f) => f.endsWith('.mp3'))
    .map((f) => f.replace('.mp3', ''))
    .sort()

  writeFileSync(join(destino, 'manifesto.json'), JSON.stringify(chaves) + '\n', 'utf8')
  return chaves.length
}

async function main() {
  if (process.argv.includes('--somente-manifesto')) {
    console.log(`✓ manifesto com ${escreverManifesto()} clipe(s).`)
    return
  }

  const nome = process.env.PROVEDOR ?? 'openai'
  const criar = PROVEDORES[nome]
  if (!criar) {
    console.error(`✗ provedor "${nome}" desconhecido. Use: ${Object.keys(PROVEDORES).join(', ')}`)
    process.exit(1)
  }

  const arquivoFalas = join(destino, 'falas.json')
  if (!existsSync(arquivoFalas)) {
    console.error('✗ public/falas/falas.json não existe. Rode `npm run falas:extrair` antes.')
    process.exit(1)
  }

  const falas: Fala[] = JSON.parse(readFileSync(arquivoFalas, 'utf8'))
  const gerar = criar()

  let feitas = 0
  let puladas = 0

  for (const fala of falas) {
    const caminho = join(destino, `${fala.chave}.mp3`)

    // Nunca sobrescreve: é o que preserva as gravações humanas.
    if (existsSync(caminho)) {
      puladas++
      continue
    }

    try {
      writeFileSync(caminho, await gerar(fala))
      feitas++
      console.log(`  ${fala.chave}  [${fala.intencao}] ${fala.texto.slice(0, 50)}`)
    } catch (e) {
      console.error(`✗ falhou em "${fala.texto.slice(0, 40)}": ${(e as Error).message}`)
      process.exit(1)
    }

    // Folga para não estourar limite de taxa.
    await new Promise((r) => setTimeout(r, 120))
  }

  console.log(`\n✓ ${feitas} gerada(s), ${puladas} já existiam.`)
  console.log(`✓ manifesto com ${escreverManifesto()} clipe(s).`)
}

await main()
