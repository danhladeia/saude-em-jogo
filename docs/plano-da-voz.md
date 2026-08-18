# Voz natural e por faixa etária — SAÚDE EM JOGO!

> Plano para a narração soar humana.
>
> **Fases 1, 3 e 6 feitas** (17/08/2026). As 343 falas estão geradas na voz
> `pt-BR-FranciscaNeural` e versionadas em `public/falas/`. Faltam a 2
> (faixas etárias), a 4 (SSML) e a 5 (voz do mascote, que depende do nome).
> A voz do sistema virou o que sempre devia ter sido: a rede de segurança.

## Contexto

A narração continua soando mecânica. Antes de trocar de motor de voz — que é o
reflexo natural — vale separar as causas, porque só uma delas é sobre o motor.

**E uma resposta direta primeiro: eu não consigo gravar as falas.** Não tenho
saída de áudio; sou um modelo de texto. Não posso ser a voz do app.

O que eu posso ser é o **roteirista e o diretor de voz** — e o diagnóstico
abaixo mostra que é exatamente aí que está a maior parte do problema.

---

## Diagnóstico: quatro causas, em ordem de impacto

### 1. O roteiro foi escrito para o olho, não para o ouvido

Esta é a maior causa, de longe. Evidência tirada do `falas.json` atual:

> "Higiene. Tome banho todos os dias — o corpo agradece. Lave as mãos antes de
> comer e depois de usar o banheiro. Escove os dentes três vezes por dia, sempre
> depois das refeições. Corte as unhas e lave os cabelos com frequência."

42 palavras, quatro ordens em fila, **uma única fala sem respiro**. Travessões e
dois-pontos que nenhum TTS transforma em pausa. Um locutor humano profissional
lendo esse parágrafo como está soaria igualmente a manual.

As quatro falas de "Dicas de Saúde" têm esse formato. E ele contamina a
percepção do app inteiro, porque são as falas mais longas que o aluno ouve.

### 2. Zero direção de prosódia

Hoje entregamos uma string nua ao motor. Sem pausa, sem ênfase, sem mudança de
ritmo, sem estilo. Motores neurais aceitam tudo isso via SSML — nós
simplesmente não estamos pedindo.

### 3. Um único registro para idades de 6 a 11 anos

As falas compartilhadas (interface, Dicas de Saúde, Jogos de Movimento) são
idênticas para uma criança de 6 e uma de 11. As duas pontas saem perdendo: a de
6 não acompanha o vocabulário, e a de 11 **rejeita tom infantilizado** — nessa
idade "vamos mexer o corpinho" mata o engajamento na hora.

Também não há distinção de intenção: comemoração, instrução e consolo são lidos
com exatamente a mesma energia.

### 4. O motor de voz

É a quarta causa, não a primeira. As vozes desta máquina (Microsoft Daniel e
Maria, SAPI5 de 2010) são de fato o teto, e trocar por neural é necessário — mas
resolver só isso, mantendo o roteiro atual, ainda soaria a leitura de bula.

---

## O plano

### Fase 1 — Reescrever as falas para o ouvido ✅

Maior ganho, custo zero, não depende de escolher provedor. Regras:

- **Uma ideia por fala.** Nada de quatro ordens numa string só.
- **Máximo ~12 palavras por grupo respiratório.**
- **Zero travessão e zero dois-pontos.** Viram ponto final.
- Segunda pessoa, voz ativa, verbo concreto.
- Conectivos de fala, não de texto: "Olha só", "Agora", "Pronto", "E não esquece".
- Ler em voz alta é o teste: fala que você não diz naturalmente numa respiração
  está longa demais.

Falas com várias ordens viram **sequência de falas curtas** com pausa real entre
elas.

**O que foi feito:**

- `narrarSequencia()` em `src/lib/narracao.ts` toca falas curtas em fila, com
  meio segundo de silêncio entre elas, e é cancelada por qualquer `calar()`.
  O avanço tem temporizador de segurança: `ended` do `<audio>` e `onend` da Web
  Speech não chegam com a aba em segundo plano nem quando não há voz pt-BR
  instalada, e a sequência não pode ficar parada esperando um evento que talvez
  não venha. Mesmo princípio do resultado por temporizador nos motores.
- As quatro dicas de saúde deixaram de ser um parágrafo de ~40 palavras cada.
  Cada dica virou uma fala própria, precedida de um convite ("Vamos falar de
  higiene!"), narradas em sequência. `dicas` passou de string única para lista;
  `falaDoTema()` virou `falasDoTema()`.
- 28 falas de conteúdo reescritas: travessão e dois-pontos viraram ponto final,
  orações de 13 a 16 palavras foram partidas em duas.
- **Bug de produção corrigido no caminho:** `src/lib/falas.ts` procurava os
  clipes em `/falas/…`, ignorando a base `/saude-em-jogo/` do Vite. O manifesto
  dava 404, `temClipe()` respondia sempre `false` e **todo clipe gravado seria
  ignorado em silêncio.** Passou despercebido porque ainda não há áudio gerado —
  a Fase 6 teria sido entregue e "não teria funcionado", sem nenhum erro na
  tela. Mesma classe do logo que já quebrou no Pages.

**A régua virou comando:** `npm run falas:revisar` extrai as falas e reprova
travessão, dois-pontos, grupo respiratório acima de 12 palavras e fala acima de
30. As 343 passam. Rodar depois de escrever qualquer conteúdo novo.

### Fase 2 — Três faixas etárias, não cinco

Cinco variantes é trabalho demais para ganho marginal. Três bandas cobrem o
essencial:

| Faixa | Idade | Registro | Ritmo |
|---|---|---|---|
| `pequenos` | 1º–2º ano, 6–8 | frases curtíssimas, vocabulário concreto, brincalhão | mais lento |
| `medios` | 3º ano, 8–9 | frases médias, começa a explicar o porquê | neutro |
| `grandes` | 4º–5º ano, 9–11 | pode abstrair, **sem diminutivo, sem tom de bebê** | ligeiramente mais rápido |

**Só as falas compartilhadas precisam de variante.** O conteúdo dos jogos já é
por ano — o que exige apenas revisar cada JSON contra a régua da sua faixa.

O app já sabe o ano do aluno (`perfil.ano`), então a seleção da variante é
trivial.

### Fase 3 — Marcar a intenção de cada fala ✅

Cada fala ganha uma etiqueta de entrega:

`instrucao` · `pergunta` · `comemoracao` · `consolo` · `convite-movimento` ·
`curiosidade` · `acalmar`

É isto que faz "Isso mesmo!" soar diferente de "Tente outro lugar." — antes as
duas saíam com a mesma energia, o sinal mais óbvio de máquina falando.

**Como foi feito:** a intenção é **deduzida de onde a fala mora**, não escrita
uma a uma. Enunciado de quiz é `pergunta`, explicação é `curiosidade`, passo de
bloco de movimento é `convite-movimento`, e assim por diante — zero conteúdo
reescrito, e conteúdo novo já nasce etiquetado. Só onde o lugar não basta é que
se declara:

- `src/content/interface.ts` — "Isso mesmo!" e "Tente outro lugar." vêm do mesmo
  ponto do código, então a lista virou `{ texto, intencao }`.
- `intencao` opcional no passo do bloco de movimento e no item da roleta —
  "Pule com os dois pés" e "Respire fundo" moram no mesmo lugar. Os oito passos
  de respiração declaram `acalmar`.

**O vocabulário e a direção de atuação** vivem em `src/content/intencoes.ts`.
`DIRECAO` é escrita em português para gente, não para API: o roteiro de gravação
ganhou a coluna **"Como dizer"**, porque quem grava é a professora ou um locutor,
e `style="cheerful"` numa folha de papel não ajuda ninguém.

**Os três provedores** passaram a receber a intenção em vez de um tom único:
estilo `mstts:express-as` e `prosody rate` no Azure, `instructions` no OpenAI,
`stability`/`style` no ElevenLabs. A tabela está em `scripts/gerar-audio.ts`.

Falta a outra metade do cruzamento previsto no plano — **intenção × faixa
etária** —, que depende da Fase 2.

**De quebra, 24 falas que nunca entrariam no roteiro:** a roleta de recompensa
monta a fala com o rótulo da figurinha sorteada (`Você ganhou Estrela!`). Texto
dinâmico, mas conjunto fechado — doze figurinhas, duas formas cada. Sem isso o
momento mais comemorativo do app seria o único garantidamente robótico, para
sempre. Agora saem no roteiro como `comemoracao`.

### Fase 4 — Gerar SSML, não string crua

O gerador passa a produzir SSML por fala: `<break>` entre orações, `<emphasis>`
na palavra-chave, `<prosody rate>` por faixa etária, `<say-as>` para números.
Provedor sem SSML recebe texto limpo mais as instruções de tom.

### Fase 5 — Dar uma voz ao mascote

Hoje a narração é um leitor de tela. Deveria ser **um personagem**: mesma voz,
mesma personalidade, do início ao fim. Isso exige decidir o nome e o caráter do
mascote (já era pendência da autora) e travar uma única voz para ele.

É a diferença entre "o app está lendo para mim" e "alguém está jogando comigo".

### Fase 6 — Gerar os clipes ✅

**Feito com `edge-tts`, voz `pt-BR-FranciscaNeural`**, por
`npm run falas:gerar:edge` (`scripts/gerar-audio-edge.py`).

O caminho até aqui foi por eliminação, e vale registrar para ninguém
refazer:

| Tentativa | Por que não |
|---|---|
| ElevenLabs | Conta no plano gratuito. A API recusa vozes da biblioteca, e a cota mensal é menor que o trabalho. |
| OpenAI | Chave válida, conta sem crédito. |
| Piper (Hugging Face) | As quatro vozes pt-BR são masculinas. |
| Kokoro `pf_dora` (Hugging Face) | Funcionou, licença Apache 2.0, roda offline. Perdeu na comparação de ouvido. |

**A procedência, dita por inteiro:** o `edge-tts` usa o endpoint por trás do
"Ler em voz alta" do Edge. Não é uma API contratada da Microsoft, pode parar
de funcionar sem aviso, e o uso programático é área cinzenta nos termos dela.
Foi escolha consciente do Danilo, depois de ouvir as duas opções lado a lado.
Os MP3 gerados são do projeto e continuam tocando se o endpoint cair.

Se um dia for preciso trocar por procedência contratada, `npm run falas:gerar`
com Azure regera tudo — e o Azure usa a mesma família de voz.

**As intenções sobreviveram à troca de motor.** O `edge-tts` não aceita
instrução de estilo em texto livre como o OpenAI, mas aceita ritmo e tom, que
é o que mais carrega a intenção. A tabela está em `scripts/gerar-audio-edge.py`.

**Os MP3 são versionados**, ao contrário do que o `.gitignore` dizia antes. O
deploy é `checkout` + `build` no CI, que não regera áudio: ignorá-los
publicaria o site mudo, sem erro nenhum na tela.

### Fase 6b — O caminho humano, que continua valendo

Como eu não gravo, as opções reais são:

1. **A própria Luciana grava.** Melhor opção para um produto de mestrado: é o
   produto dela, e as crianças da escola conhecem essa voz. O `roteiro.md` já
   sai pronto com nome de arquivo, texto e onde cada fala aparece.
2. **Locutor infantil contratado.** Sessão de ~40 min para as 139 falas.
3. **Clone de voz** (ElevenLabs) a partir de poucos minutos de amostra da
   Luciana, com consentimento explícito dela. Gera as 139 e escala para as ~600
   da intervenção completa sem nova sessão.

O mecanismo de mistura **já existe e está implementado**: arquivo que já existe
nunca é sobrescrito. Ela grava as falas de maior impacto, o gerador preenche o
resto, sem mudança de código.

---

## Exemplo concreto do que muda

**Hoje** — uma fala, 42 palavras, todas as idades:

> Higiene. Tome banho todos os dias — o corpo agradece. Lave as mãos antes de
> comer e depois de usar o banheiro. Escove os dentes três vezes por dia, sempre
> depois das refeições. Corte as unhas e lave os cabelos com frequência.

**Depois, faixa `pequenos`** — cinco falas curtas, com pausa entre elas:

> Vamos falar de higiene! *(comemoracao)*
> Banho todo dia. O corpo fica limpinho. *(instrucao)*
> Lava a mão antes de comer. E depois do banheiro também! *(instrucao)*
> Escova os dentes três vezes por dia. *(instrucao)*
> E não esquece de cortar a unha. *(instrucao)*

**Depois, faixa `grandes`** — mesmo conteúdo, sem infantilizar:

> Higiene é cuidar do corpo por fora. *(curiosidade)*
> Banho todo dia tira o suor e a sujeira que a pele junta. *(instrucao)*
> Lavar as mãos evita que germe entre pela boca. *(instrucao)*
> Escovar os dentes depois de comer protege o esmalte. *(instrucao)*
> E unha curta é unha limpa. *(instrucao)*

Nenhuma das duas versões precisa de motor melhor para soar melhor que a atual.

---

## Arquivos afetados

Já tocados nas Fases 1 e 3:

- `src/content/dicas.ts` — dica virou lista de falas curtas ✅
- `src/content/movimento.ts` e `src/content/ano*/*.json` — descrições,
  instruções e explicações passadas pela régua; passos de respirar marcados
  como `acalmar` ✅
- `src/content/intencoes.ts` — vocabulário de intenção e direção de atuação ✅
- `src/content/interface.ts` — lista virou `{ texto, intencao }` ✅
- `src/content/schemas.ts` — campo `intencao` no passo e no item da roleta ✅
- `src/lib/narracao.ts` — `narrarSequencia()` ✅
- `src/lib/falas.ts` — fim do clipe encadeável, e o caminho com a base ✅
- `scripts/extrair-falas.ts` — intenção por fala, e as falas da recompensa ✅
- `scripts/gerar-audio.ts` — parâmetros por intenção nos três provedores ✅
- `scripts/revisar-falas.ts` — a régua como comando ✅
- `public/falas/roteiro.md` — coluna "Como dizer" ✅

Pendentes, das fases seguintes:

- `src/content/interface.ts` — variantes por faixa etária
- `src/content/schemas.ts` — variantes por faixa
- `src/lib/falas.ts` — chave passa a considerar a faixa etária
- `scripts/extrair-falas.ts` — emitir SSML por fala
- `scripts/gerar-audio.ts` — enviar SSML em vez de texto cru

---

## Verificação

- **Teste da respiração:** ler cada fala em voz alta. Se não sai numa
  respiração natural, está longa demais. O que dá para medir sem ouvido humano
  já está em `npm run falas:revisar`; ler em voz alta continua sendo o teste
  que decide, e nenhum script substitui.
- **Teste A/B:** gerar as 10 piores falas atuais nas versões antiga e nova, e
  deixar a Luciana escolher no cego.
- **Teste de faixa:** tocar a variante `pequenos` para um aluno de 5º ano. Se
  ele revirar os olhos, a variante `grandes` está justificada.
- **Teste com crianças de verdade**, que é o único que decide.
- Rodar `npm run falas:extrair` e conferir que a contagem bate com o esperado
  após o desdobramento das falas longas.

---

## O que depende de você

1. **Provedor e chave** (`azure`, `openai` ou `elevenlabs`) — sem isso não gero
   nenhum áudio.
2. **Nome e caráter do mascote** — trava a voz do personagem.
3. **Decisão sobre a voz da Luciana:** ela grava, contratamos locutor, ou
   clonamos a voz dela com consentimento.

As Fases 1 a 4 não dependem de nada disso e podem começar já.
