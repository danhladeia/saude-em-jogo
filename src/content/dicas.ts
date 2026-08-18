/**
 * Tela 7 do mockup: Higiene, Alimentação, Sono e Atividade Física.
 *
 * Cada dica é uma fala inteira, e só uma ideia. Antes as quatro dicas de
 * um tema eram emendadas numa string de quarenta palavras entregue de uma
 * vez ao motor de voz — a fala mais longa do app e a que mais soava a
 * manual. Agora a tela narra a lista em sequência, com pausa de verdade
 * entre uma e outra. Ver docs/plano-da-voz.md.
 */
export interface TemaDeDica {
  id: string
  rotulo: string
  /** Abre a narração. O rótulo sozinho soa a título de slide. */
  convite: string
  emoji: string
  cor: string
  dicas: string[]
}

export const TEMAS_DE_DICA: TemaDeDica[] = [
  {
    id: 'higiene',
    rotulo: 'Higiene',
    convite: 'Vamos falar de higiene!',
    emoji: '🧼',
    cor: 'bg-ceu-400 border-ceu-600',
    dicas: [
      'Tome banho todos os dias. O corpo agradece.',
      'Lave as mãos antes de comer.',
      'E depois de usar o banheiro também.',
      'Escove os dentes três vezes por dia.',
      'Corte as unhas e lave o cabelo com frequência.',
    ],
  },
  {
    id: 'alimentacao',
    rotulo: 'Alimentação',
    convite: 'Vamos falar de comida!',
    emoji: '🥗',
    cor: 'bg-folha-400 border-folha-600',
    dicas: [
      'Quanto mais cores no prato, melhor para o corpo.',
      'Fruta e verdura dão energia de verdade.',
      'Beba água durante o dia todo, mesmo sem sede.',
      'Ultraprocessado é de vez em quando, não todo dia.',
    ],
  },
  {
    id: 'sono',
    rotulo: 'Sono',
    convite: 'Vamos falar de sono!',
    emoji: '😴',
    cor: 'bg-uva-400 border-uva-600',
    dicas: [
      'Dormir bem ajuda a crescer e a aprender.',
      'Desligue as telas antes de deitar. Elas atrapalham o sono.',
      'Tenha uma hora para dormir e uma para acordar.',
      'O corpo avisa quando está cansado. Escute ele!',
    ],
  },
  {
    id: 'atividade-fisica',
    rotulo: 'Atividade Física',
    convite: 'Vamos falar de movimento!',
    emoji: '🤸',
    cor: 'bg-coral-400 border-coral-600',
    dicas: [
      'Movimente-se todos os dias. Brincar também é se exercitar.',
      'Alongue o corpo antes e depois de se mexer.',
      'Brincar ao ar livre faz bem para o corpo.',
      'E faz bem para a cabeça também.',
      'Quem se movimenta, se cuida!',
    ],
  },
]

/**
 * A sequência exata que a tela manda narrar, uma fala por vez.
 *
 * Cada item vira um clipe separado no roteiro de gravação, então o texto
 * daqui precisa bater byte a byte com o que chega em `narrarSequencia`.
 */
export function falasDoTema(tema: TemaDeDica): string[] {
  return [tema.convite, ...tema.dicas]
}
