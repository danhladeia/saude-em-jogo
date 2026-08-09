/** Tela 7 do mockup: Higiene, Alimentação, Sono e Atividade Física. */
export interface TemaDeDica {
  id: string
  rotulo: string
  emoji: string
  cor: string
  dicas: string[]
}

export const TEMAS_DE_DICA: TemaDeDica[] = [
  {
    id: 'higiene',
    rotulo: 'Higiene',
    emoji: '🧼',
    cor: 'bg-ceu-400 border-ceu-600',
    dicas: [
      'Tome banho todos os dias — o corpo agradece.',
      'Lave as mãos antes de comer e depois de usar o banheiro.',
      'Escove os dentes três vezes por dia, sempre depois das refeições.',
      'Corte as unhas e lave os cabelos com frequência.',
    ],
  },
  {
    id: 'alimentacao',
    rotulo: 'Alimentação',
    emoji: '🥗',
    cor: 'bg-folha-400 border-folha-600',
    dicas: [
      'Quanto mais cores no prato, mais nutrientes para o corpo.',
      'Frutas e verduras dão energia de verdade.',
      'Beba água ao longo do dia, mesmo sem sentir sede.',
      'Alimentos ultraprocessados são para de vez em quando, não todo dia.',
    ],
  },
  {
    id: 'sono',
    rotulo: 'Sono',
    emoji: '😴',
    cor: 'bg-uva-400 border-uva-600',
    dicas: [
      'Dormir bem ajuda a crescer e a aprender.',
      'Desligue as telas antes de deitar — elas atrapalham o sono.',
      'Tenha um horário para dormir e acordar.',
      'O corpo fala quando está cansado. Escute ele!',
    ],
  },
  {
    id: 'atividade-fisica',
    rotulo: 'Atividade Física',
    emoji: '🤸',
    cor: 'bg-coral-400 border-coral-600',
    dicas: [
      'Movimente-se todos os dias: brincar também é se exercitar.',
      'Alongue o corpo antes e depois de se mexer.',
      'Brincar ao ar livre faz bem para o corpo e para a cabeça.',
      'Quem se movimenta, se cuida!',
    ],
  },
]

/** Exatamente o texto que a tela manda narrar. */
export function falaDoTema(tema: TemaDeDica): string {
  return `${tema.rotulo}. ${tema.dicas.join(' ')}`
}
