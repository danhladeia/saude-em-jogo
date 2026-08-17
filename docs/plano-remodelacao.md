# Remodelação do Saúde em Jogo — poucos jogos, laço viciante

> Plano vigente. Troca variedade de mecanica por um laco que faz voltar, e mapeia como os 5 motores existentes cobrem os 20 jogos sem motor novo.

## Contexto

O plano original tinha **20 jogos e nenhum jogo**: vinte atividades numa lista,
cada uma jogada uma vez e abandonada. Nenhum motivo para a criança abrir o app
de novo amanhã. E as sessões eram longas demais para a realidade — 50 minutos de
aula, ~25 alunos, poucas máquinas, então cada criança pega 10 a 15 minutos.

Esta remodelação troca variedade de mecânica por **um laço que faz voltar**, e
corta o custo em 60%.

## A restrição que define o desenho

O 5º ano ensina **equilíbrio no tempo de tela**. Um app que maximiza minutos de
tela contradiz o próprio conteúdo.

O laço não pode viciar em *ficar*. Tem que viciar em **voltar todo dia e sair
para mexer o corpo**. A sessão é curta e termina mandando a criança levantar da
cadeira. Nenhum outro app infantil faz isso — é o diferencial, não a limitação.

## O laço diário, 6 a 8 minutos

> abre → vê a sequência de dias que não quebrou → faz a parada da semana →
> **mexe o corpo de verdade** → gira a roleta e ganha uma figurinha →
> cola no álbum → o app se despede

## Os 4 formatos, todos já construídos

| Formato | Duração | Cobre |
|---|---|---|
| Quiz ilustrado (5 perguntas) | ~3 min | higiene, água, esportes, diversidade corporal |
| Arrastar para o lugar certo | ~3 min | corpo, emoções, classificação, prato, ambiente, rotina |
| Ligar / memória | ~3 min | gestos, esportes |
| **Corpo Ativo** | ~4 min | fecha **toda** parada |

## Os 5 motores existentes cobrem os 20 jogos

Descoberta que derruba o custo: 8 dos 12 jogos restantes cabem em motores já
prontos e testados.

| Jogo restante | Motor planejado | O que usar | Código novo |
|---|---|---|:--:|
| Água em jogo (3º) | quiz | quiz | — |
| Trilha do sono (3º) | **trilha** | quiz com pele de trilha | 5h |
| Memória dos esportes (3º) | associação | associação | — |
| Classificação AF×EF (3º) | **classificar** | **arrastar-alvo** com 2 alvos grandes | — |
| Prato colorido (4º) | **montagem** | arrastar-alvo + pontuação por categoria | 5h |
| Super lanche (4º) | **montagem** | mesmo motor acima | — |
| Missão corpo e movimento (4º) | **runner** | **corpo-ativo** + quiz | — |
| Dia ativo saudável (4º) | **rotina** | **arrastar-alvo** com linha do tempo | — |
| Corpos do mundo (5º) | quiz | quiz | — |
| Digital saúde (5º) | **rotina** | arrastar-alvo com linha do tempo | — |
| Missão ambiente saudável (5º) | **classificar** | **arrastar-alvo** — é literalmente isso | — |
| Corpo em ação (5º) | corpo-ativo | corpo-ativo | — |

**45h de motores novos viram 10h de extensão.**

Duas substituições são melhorias, não concessões:

- **Missão ambiente saudável** já era arrastar-alvo: cenário bagunçado, arrasta o
  lixo para a lixeira, fecha a torneira, apaga a luz. O motor "classificar" foi
  inventado para algo que já existia.
- **Missão corpo e movimento**, que seria o jogo mais caro (um platformer), vira
  Corpo Ativo. Em vez de a criança clicar num boneco que pula, **ela pula**. Mais
  fiel ao letramento corporal que o original.

O P.S. do documento da autora autoriza literalmente: *"se não for possível a
realização de alguma atividade, substituímos por outra com o mesmo tema"*.

## As 3 mecânicas que fazem voltar

**Roleta de recompensa** · 4h — o motor da roleta já existe. Reaproveitado como
recompensa, vira recompensa variável, a mecânica mais viciante conhecida.

**Sequência de dias** · 4h — a tela de Desafios da Saúde já tem os itens diários
marcáveis. Falta o contador de dias seguidos. É o núcleo do Duolingo, e aqui
recompensa beber água, dormir cedo e caminhar com a família — hábito real, não
tempo de tela.

**Álbum de figurinhas** · 8h — cada parada dá uma figurinha. Custo de arte
próximo de zero: reaproveita os sprites já cortados, mais a folha F6.

## O que sai do plano

| Removido | Economia | Por quê |
|---|---:|---|
| 5 motores novos | 45h | Substituições acima |
| Quiz de 8 → 5 perguntas | 12h | Não cabe em 50 min de aula |
| Mapa de jornada elaborado | 15h | A lista de atividades já cumpre |
| Mascote vestível | 8h | O álbum entrega o mesmo por menos |
| Narração gravada | 26h | Voz do sistema + textos reescritos resolve |

## Horas

**Núcleo — 1º e 2º ano** (os 8 jogos que já existem)

| Frente | Horas |
|---|---:|
| As 3 mecânicas de engajamento | 16h |
| Encurtar as 8 paradas | 3h |
| Ligar os 89 sprites | 8h |
| Questionário pré/pós + exportação CSV | 12h |
| Deploy e instalação no laboratório | 4h |
| **Total** | **43h** |

**Cada ano escolar adicional** · 10h (4 paradas + uma folha de arte).
Se a autora escrever o conteúdo: 6h.

**Escolha de personagem** (menino/menina) · 4h — ver `docs/prompts-a3.md`,
folha F1.

## Verificação

- Levar o núcleo para as turmas antes de construir o resto. Quatro semanas de uso
  real dizem mais sobre o que vale construir do que qualquer plano.
- O que medir no piloto: quantas crianças voltam no segundo dia sem ser mandadas,
  e se a sequência de dias sobrevive ao fim de semana.
- Teste da respiração em toda fala nova: se não sai numa respiração natural, está
  longa demais.
- `npm run validate:content` e o hook de tipos fecham o resto.

## Aberto

- **Em quais anos escolares a intervenção será aplicada?** É a variável que mais
  move o escopo. Se for 1º e 2º, o produto está praticamente pronto.
- Nome do mascote (pendente desde o começo).
- Se o produto sai em acesso aberto — mestrado profissional normalmente exige, e
  isso muda quem pode bancar o desenvolvimento.
