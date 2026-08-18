/**
 * Como cada fala deve ser dita.
 *
 * Hoje o app entrega uma string nua ao motor de voz, e "Isso mesmo!" sai
 * com exatamente a mesma energia de "Tente outro lugar." — que é o sinal
 * mais óbvio de máquina falando. A intenção é a informação que faltava.
 *
 * Ela não muda nada em tempo de execução: vive no roteiro de gravação
 * (como direção de atuação para quem grava) e nos parâmetros que
 * scripts/gerar-audio.ts manda para o provedor. Ver docs/plano-da-voz.md,
 * Fase 3.
 *
 * Quase toda fala tem a intenção deduzida de onde ela mora — enunciado de
 * quiz é pergunta, passo de bloco de movimento é convite. Só onde o lugar
 * não basta é que o JSON declara (`intencao` no passo e no item da
 * roleta), porque "Respire fundo" e "Pule com os dois pés" moram no mesmo
 * lugar e não se dizem do mesmo jeito.
 */
export const INTENCOES = [
  'instrucao',
  'pergunta',
  'comemoracao',
  'consolo',
  'convite-movimento',
  'curiosidade',
  'acalmar',
] as const

export type Intencao = (typeof INTENCOES)[number]

/**
 * A direção de atuação, em português, para a coluna do roteiro de
 * gravação. Quem grava é a professora ou um locutor — não adianta
 * escrever `style="cheerful"` na folha de papel.
 */
export const DIRECAO: Record<Intencao, string> = {
  instrucao: 'Clara e calma, como quem explica a tarefa. Sem pressa.',
  pergunta: 'Curiosa, subindo no fim. Deixe a criança querer responder.',
  comemoracao: 'Animada de verdade, sorrindo. Esta é a hora de vibrar.',
  consolo: 'Acolhedora e leve, nunca de pena. Erro aqui não é problema.',
  'convite-movimento': 'Energia para cima, chamando para o movimento.',
  curiosidade: 'Tom de quem conta uma descoberta boa. Um pouco mais devagar.',
  acalmar: 'Baixa, lenta e suave. O corpo precisa desacelerar junto.',
}
