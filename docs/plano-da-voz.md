# Voz natural e por faixa etária — SAÚDE EM JOGO!

> Plano para a narracao soar humana. Ainda nao executado: o app usa a voz do sistema.

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

### Fase 1 — Reescrever as 139 falas para o ouvido

Maior ganho, custo zero, não depende de escolher provedor. Regras:

- **Uma ideia por fala.** Nada de quatro ordens numa string só.
- **Máximo ~12 palavras por grupo respiratório.**
- **Zero travessão e zero dois-pontos.** Viram ponto final.
- Segunda pessoa, voz ativa, verbo concreto.
- Conectivos de fala, não de texto: "Olha só", "Agora", "Pronto", "E não esquece".
- Ler em voz alta é o teste: fala que você não diz naturalmente numa respiração
  está longa demais.

Falas com várias ordens viram **sequência de falas curtas** com pausa real entre
elas — o que exige uma pequena mudança no schema (`dicas` passa de uma string
para uma lista de falas).

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

### Fase 3 — Marcar a intenção de cada fala

Cada fala ganha uma etiqueta de entrega:

`instrucao` · `pergunta` · `comemoracao` · `consolo` · `convite-movimento` ·
`curiosidade` · `acalmar`

Uma tabela mapeia **intenção × faixa → parâmetros do motor**: estilo e prosódia
no Azure, `instructions` no OpenAI, `stability`/`style` no ElevenLabs.

É isto que faz "Isso mesmo!" soar diferente de "Tente outro lugar." — hoje as
duas saem com a mesma energia, o que é o sinal mais óbvio de máquina falando.

### Fase 4 — Gerar SSML, não string crua

O gerador passa a produzir SSML por fala: `<break>` entre orações, `<emphasis>`
na palavra-chave, `<prosody rate>` por faixa etária, `<say-as>` para números.
Provedor sem SSML recebe texto limpo mais as instruções de tom.

### Fase 5 — Dar uma voz ao mascote

Hoje a narração é um leitor de tela. Deveria ser **um personagem**: mesma voz,
mesma personalidade, do início ao fim. Isso exige decidir o nome e o caráter do
mascote (já era pendência da autora) e travar uma única voz para ele.

É a diferença entre "o app está lendo para mim" e "alguém está jogando comigo".

### Fase 6 — O caminho humano

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

- `src/content/dicas.ts` — dica vira lista de falas curtas com intenção
- `src/content/interface.ts` — variantes por faixa
- `src/content/movimento.ts` — revisar descrições dos passos para o ouvido
- `src/content/ano1/*.json`, `ano2/*.json` — passar cada `instrucao`,
  `enunciado`, `explicacao` e `descricao` pela régua da faixa
- `src/content/schemas.ts` — campos `intencao` e variantes por faixa
- `src/lib/falas.ts` — chave passa a considerar a faixa etária
- `scripts/extrair-falas.ts` — emitir SSML e parâmetros de tom por fala
- `scripts/gerar-audio.ts` — enviar SSML e estilo em vez de texto cru
- `public/falas/roteiro.md` — ganha coluna de intenção e direção de atuação

---

## Verificação

- **Teste da respiração:** ler cada fala em voz alta. Se não sai numa
  respiração natural, está longa demais. Aplicar às 139.
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
