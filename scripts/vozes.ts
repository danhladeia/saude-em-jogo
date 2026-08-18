import type { Intencao } from '../src/content/intencoes.ts'

/**
 * Intenção → como cada provedor deve dizer a fala.
 *
 * Mora aqui, e não em gerar-audio.ts, porque o roteiro do ElevenLabs
 * precisa das mesmas configurações para quem gera à mão no site. Duas
 * cópias divergiriam na primeira vez que alguém ajustasse um número, e o
 * áudio gerado pela API deixaria de bater com o gerado no navegador.
 *
 * Ver docs/plano-da-voz.md, Fase 3.
 */

/** `style` e `rate` do mstts. Estilo que a voz não suporta é ignorado. */
export const AZURE: Record<Intencao, { estilo: string; ritmo: string }> = {
  instrucao: { estilo: 'friendly', ritmo: '-8%' },
  pergunta: { estilo: 'friendly', ritmo: '-5%' },
  comemoracao: { estilo: 'cheerful', ritmo: '0%' },
  consolo: { estilo: 'empathetic', ritmo: '-10%' },
  'convite-movimento': { estilo: 'cheerful', ritmo: '-3%' },
  curiosidade: { estilo: 'friendly', ritmo: '-10%' },
  acalmar: { estilo: 'gentle', ritmo: '-18%' },
}

export const BASE_OPENAI =
  'Fale em português do Brasil como uma professora carinhosa dos anos iniciais, ' +
  'para crianças de 6 a 11 anos. '

export const OPENAI: Record<Intencao, string> = {
  instrucao: 'Tom claro e calmo de quem explica a tarefa. Sem pressa.',
  pergunta: 'Tom curioso, entonação subindo no fim, convidando a responder.',
  comemoracao: 'Tom animado e sorridente. É hora de vibrar com a criança.',
  consolo: 'Tom acolhedor e leve, nunca de pena. Errar aqui não é problema.',
  'convite-movimento': 'Tom energético, chamando a criança para se mexer.',
  curiosidade: 'Tom de quem conta uma descoberta boa. Um pouco mais devagar.',
  acalmar: 'Voz baixa, lenta e suave, para o corpo desacelerar junto.',
}

/**
 * `stability` mais baixa dá mais variação de entonação; `style` mais alto
 * exagera o traço da voz original. Os dois extremos têm custo: estabilidade
 * muito baixa gera leitura errática entre uma geração e outra, e estilo
 * muito alto embola a dicção — o que é justamente o que uma criança de 6
 * anos não perdoa, porque ela depende da narração para entender o enunciado.
 */
export const ELEVENLABS: Record<Intencao, { stability: number; style: number }> = {
  instrucao: { stability: 0.55, style: 0.25 },
  pergunta: { stability: 0.45, style: 0.35 },
  comemoracao: { stability: 0.3, style: 0.6 },
  consolo: { stability: 0.6, style: 0.3 },
  'convite-movimento': { stability: 0.35, style: 0.55 },
  curiosidade: { stability: 0.5, style: 0.35 },
  acalmar: { stability: 0.75, style: 0.15 },
}

/** Igual para toda fala: é a mesma pessoa falando do início ao fim. */
export const ELEVENLABS_FIXO = {
  modelo: 'eleven_multilingual_v2',
  formato: 'mp3_22050_32',
  similarity_boost: 0.8,
}
