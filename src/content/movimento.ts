import type { BlocoCorpoAtivo } from './schemas'

/** Tela 5 do mockup: ALONGAMENTOS e MOVIMENTOS CORPORAIS. */
export interface SessaoDeMovimento {
  id: string
  rotulo: string
  emoji: string
  cor: string
  bloco: BlocoCorpoAtivo
}

export const SESSOES_DE_MOVIMENTO: SessaoDeMovimento[] = [
  {
    id: 'alongamentos',
    rotulo: 'Alongamentos',
    emoji: '🧘',
    cor: 'bg-folha-400 border-folha-600',
    bloco: {
      titulo: 'Vamos alongar!',
      instrucao: 'Faça cada movimento devagar. Se doer, pare — alongar não é forçar.',
      passos: [
        { id: 'pescoco', rotulo: 'Pescoço', descricao: 'Incline a cabeça para um lado e depois para o outro.', emoji: '🙂', segundos: 20 },
        { id: 'bracos', rotulo: 'Braços para cima', descricao: 'Estique os dois braços bem alto, como se fosse pegar o teto.', emoji: '🙌', segundos: 20 },
        { id: 'ombros', rotulo: 'Ombros', descricao: 'Puxe um braço na frente do peito com a ajuda do outro. Troque o lado.', emoji: '💪', segundos: 25 },
        { id: 'tronco', rotulo: 'Tronco', descricao: 'Com os pés firmes, gire o tronco devagar para um lado e para o outro.', emoji: '🔄', segundos: 25 },
        { id: 'pernas', rotulo: 'Atrás da perna', descricao: 'Sentado ou em pé, tente encostar as mãos na ponta dos pés sem forçar.', emoji: '🦵', segundos: 25 },
        { id: 'respirar', rotulo: 'Respirar fundo', descricao: 'Puxe o ar pelo nariz contando até 4 e solte pela boca contando até 4.', emoji: '🌬️', segundos: 20 },
      ],
      perguntaEmocao: {
        enunciado: 'Como o seu corpo está agora?',
        opcoes: [
          { id: 'leve', rotulo: 'Leve', emoji: '🌤️' },
          { id: 'relaxado', rotulo: 'Relaxado', emoji: '😌' },
          { id: 'com-energia', rotulo: 'Com energia', emoji: '⚡' },
          { id: 'cansado', rotulo: 'Cansado', emoji: '😮‍💨' },
        ],
      },
    },
  },
  {
    id: 'movimentos',
    rotulo: 'Movimentos corporais',
    emoji: '🏃',
    cor: 'bg-coral-400 border-coral-600',
    bloco: {
      titulo: 'Corpo em movimento!',
      instrucao: 'Deixe espaço ao seu redor e acompanhe cada desafio.',
      passos: [
        { id: 'marchar', rotulo: 'Marchar no lugar', descricao: 'Levante bem os joelhos, um de cada vez.', emoji: '🚶', segundos: 30 },
        { id: 'pular', rotulo: 'Pular', descricao: 'Pule com os dois pés juntos, sem sair do lugar.', emoji: '🦘', segundos: 20 },
        { id: 'equilibrar', rotulo: 'Equilibrar', descricao: 'Fique em um pé só. Depois troque o pé.', emoji: '🦩', segundos: 30 },
        { id: 'girar', rotulo: 'Girar', descricao: 'Dê uma volta devagar para um lado e outra para o outro.', emoji: '🌀', segundos: 20 },
        { id: 'agachar', rotulo: 'Agachar e levantar', descricao: 'Agache como se fosse sentar numa cadeira e volte devagar.', emoji: '⬇️', segundos: 25 },
        { id: 'respirar', rotulo: 'Acalmar', descricao: 'Pare, respire fundo e sinta o coração batendo.', emoji: '❤️', segundos: 20 },
      ],
      perguntaEmocao: {
        enunciado: 'Como você se sentiu?',
        opcoes: [
          { id: 'feliz', rotulo: 'Feliz', emoji: '😄' },
          { id: 'animado', rotulo: 'Animado', emoji: '🤩' },
          { id: 'cansado', rotulo: 'Cansado', emoji: '😮‍💨' },
          { id: 'com-energia', rotulo: 'Com energia', emoji: '⚡' },
        ],
      },
    },
  },
]
