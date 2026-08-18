# SAÚDE EM JOGO!

> Jogo que ensina, saúde que transforma!

**📖 Toda a documentação está em [`docs/`](docs/README.md).**
Para usar em aula: [manual da professora](docs/manual-da-professora.md).
Para retomar o desenvolvimento: [estado atual](docs/estado-atual.md).

PWA de letramento corporal e promoção da saúde para os anos iniciais do Ensino
Fundamental. Produto educacional do Mestrado Profissional em Educação Física em
Rede Nacional (PROEF/Unimontes) — Profa. Luciana Pereira Miranda Paccelli,
orientação Prof. Dr. Renato Sobral Monteiro Junior e Prof. Dr. Saulo Daniel
Mendes Cunha.

## O princípio: motor é código, jogo é JSON

As 20 atividades da intervenção (5 anos × 4 semanas) não são 20 programas. Elas
usam **cinco motores** — o de arrastar-alvo sozinho atende oito jogos. Cada
motor é escrito e testado uma vez; cada jogo é um arquivo JSON validado por
schema.

Consequência prática: **trocar uma atividade não exige programador**. Basta
editar o JSON em `src/content/anoN/`. É exatamente o que o documento da autora
prevê no P.S. final ("se não for possível a realização de alguma atividade,
substituímos por outra com o mesmo tema").

| Motor | Jogos que atende |
|---|---|
| `quiz` | Jogo de escolhas, Movimente-se, Equilibrista mirim, Água em jogo, Trilha saudável do sono, Missão corpo e movimento, Corpos do mundo |
| `arrastar-alvo` | Monte o corpo humano, Como me sinto?, Classificação corporal, Prato colorido, Super lanche, Dia ativo saudável, Digital saúde, Missão ambiente saudável |
| `associacao` | Corpo que fala, Jogo da memória dos esportes |
| `roleta` | Roleta giratória de alongamentos |
| `corpo-ativo` | Corpo que dança, Corpo em ação |

O plano original previa dez motores. Cinco nunca precisaram existir:

| Motor previsto | Como foi resolvido |
|---|---|
| `classificar`, `montagem` | `arrastar-alvo` com `layout: "colunas"` — caixas grandes recebendo várias peças |
| `rotina` | `arrastar-alvo` com `layout: "linha-do-tempo"` — as mesmas caixas, numeradas |
| `trilha` | `quiz` com `feedback: "trilha"` — cada acerto anda uma casa até a cama |
| `runner` | `corpo-ativo` — em vez de clicar num boneco que pula, a criança pula |

São 45h de motor que viraram 10h de extensão. O raciocínio completo está em
[`docs/plano-remodelacao.md`](docs/plano-remodelacao.md).

## Comandos

Instalar:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Validar todo o conteúdo contra os schemas:

```bash
npm run validate:content
```

Build de produção (valida conteúdo, checa tipos e empacota):

```bash
npm run build
```

## Como adicionar ou trocar um jogo

1. Escolha o motor em `src/content/schemas.ts`.
2. Crie `src/content/anoN/<id-da-atividade>.json` seguindo o schema desse motor.
3. Marque `disponivel: true` na entrada correspondente de `src/dominio/catalogo.ts`.
4. Rode `npm run validate:content`.

O validador recusa: id que não bate com o nome do arquivo, motor divergente do
catálogo, peça apontando para alvo inexistente, pergunta sem resposta correta e
atividade marcada como disponível sem arquivo.

## Decisões que não são negociáveis

**Movimento real, não só clique.** O componente `<CorpoAtivo>` fecha as
atividades com prática corporal cronometrada e auto-relato de emoção. É o
coração do letramento corporal e o documento da autora pede isso
explicitamente. Sem câmera, de propósito: são crianças, e a cartilha já coloca
o professor como mediador presencial.

**Narração em tudo.** No 1º ano boa parte da turma ainda não lê com fluência —
sem narração o jogo vira adivinhação. Ver a seção **Voz** abaixo.

**O erro nunca pune.** Sem "game over", sem vidas, sem perder estrela. Resposta
errada mostra a certa e segue. Concluir a atividade já vale uma estrela.

**Nada sai do dispositivo.** Sem backend, sem telemetria, sem nuvem. Quando a
Área do Professor entrar, ela vai registrar peso, altura e IMC de crianças —
dado pessoal sensível sob a LGPD. A única saída será a exportação CSV, sempre
manual.

**IMC infantil não usa faixa de adulto.** Quando a Área do Professor for
implementada: calcular e registrar o valor, exibir percentil por idade
(referência OMS) **apenas** no painel do professor, e **nunca** mostrar
classificação corporal na tela do aluno. O 5º ano trabalha justamente respeito
à diversidade corporal e autoestima.

**Toque duplo não pode quebrar nada.** Criança de 6 anos toca duas vezes em
tudo. As guardas contra isso ficam em `useRef`, não em `useState` — dois
cliques no mesmo tick enxergam o mesmo state do closure, e um guard baseado em
state deixa passar. Todo motor novo precisa da mesma proteção.

**Correção não depende de animação.** Com `prefers-reduced-motion: reduce` o
Motion pula animações de transform, e `onAnimationComplete` nunca chega. A
roleta revela o resultado por temporizador, não por callback. Motores novos que
dependam de uma animação terminar precisam do mesmo tratamento — ver
`src/lib/movimento.ts`.

## Voz

A narração tem duas camadas. O app sempre tenta a primeira e só cai para a
segunda quando ela falta:

1. **Clipe pré-gerado** em `public/falas/<chave>.mp3` — voz neural ou a voz da
   própria professora. É o caminho normal, e é o que soa humano.
2. **Web Speech API** (voz do sistema) — só para texto que não tem clipe.

Por que não usar só a voz do sistema: num Windows típico de laboratório as
únicas vozes pt-BR instaladas são a **Microsoft Maria** e o **Daniel**, SAPI5 de
2010, com prosódia de robô. Para uma criança de 6 anos que depende da narração
para entender o enunciado, isso não é detalhe estético.

Gerar o áudio fora do app resolve os três problemas de uma vez: soa humano,
funciona offline (os MP3 entram no precache do service worker) e não custa nada
por reprodução.

### Fluxo

```bash
npm run falas:extrair
```

Varre todo o conteúdo e gera `public/falas/falas.json` (o que precisa de áudio) e
`public/falas/roteiro.md` (lista legível para gravação humana). Com os cinco anos
escolares no ar são **343 falas, ~3300 palavras** — cerca de 90 minutos de
estúdio. Dá para gravar por ano escolar.

Cada fala carrega uma **intenção** (`instrucao`, `pergunta`, `comemoracao`,
`consolo`, `convite-movimento`, `curiosidade`, `acalmar`), deduzida de onde ela
mora no conteúdo. É o que faz "Isso mesmo!" não sair com a mesma energia de
"Tente outro lugar.". O roteiro traz a direção de atuação em português na coluna
**"Como dizer"**; o gerador manda estilo e prosódia correspondentes para o
provedor. O vocabulário está em `src/content/intencoes.ts`.

```bash
npm run falas:revisar
```

Extrai e passa cada fala pela **régua da voz**: nada de travessão nem
dois-pontos (o TTS não os transforma em pausa), no máximo 12 palavras entre
duas pausas e 30 por fala. Falha o comando quando alguma escapa. É o que
impede o roteiro de voltar a ter parágrafo empilhado numa string só — ver
[`docs/plano-da-voz.md`](docs/plano-da-voz.md).

Fala com mais de uma ideia não vira uma string comprida: vira **uma sequência
de falas curtas** com pausa real entre elas, via `narrarSequencia()`. É assim
que as Dicas de Saúde funcionam.

Gera também `public/falas/elevenlabs.md`, o roteiro para gerar as falas no
ElevenLabs — falas agrupadas por intenção, com os controles de `stability` e
`style` de cada grupo e o **nome exato** que cada arquivo precisa ter. É o
documento para quem vai gerar pelo site em vez da API.

```bash
npm run falas:gerar:edge
```

**É o comando que gerou os clipes que estão no repositório.** Usa a voz neural
`pt-BR-FranciscaNeural` pelo `edge-tts`, sem chave e sem custo. Gera só o que
falta e nunca sobrescreve.

Procedência, dita por inteiro: esse é o endpoint por trás do "Ler em voz alta"
do Edge, **não uma API contratada da Microsoft**. Foi escolha consciente,
depois de comparar com a alternativa de licença limpa (Kokoro `pf_dora`,
Apache 2.0, que roda offline e cuja qualidade ficava abaixo). Pode parar de
funcionar sem aviso — mas os MP3 já gerados continuam tocando, porque estão
versionados.

```bash
PROVEDOR=azure AZURE_TTS_KEY=... npm run falas:gerar
```

O caminho por API paga, se um dia quiser regerar tudo com procedência
contratada. Provedores suportados: `openai`, `elevenlabs`, `azure`. Os
parâmetros de tom de cada um estão em `scripts/vozes.ts` — fonte única, para o
áudio gerado pela API bater com o gerado à mão no site. O equivalente do
`edge-tts` está em `scripts/gerar-audio-edge.py`, porque aquele motor não é
REST e só tem cliente em Python.

**Os MP3 são versionados de propósito.** O deploy é `checkout` + `build` no CI,
que não regera áudio; ignorá-los publicaria o site mudo, caindo na voz robótica
sem nenhum erro na tela.

**Arquivo que já existe nunca é sobrescrito.** É assim que a voz gravada convive
com a sintética: a professora grava as falas que quiser, o script preenche o
resto. Se ela gravar à mão sem rodar o gerador:

```bash
npm run falas:manifesto
```

### Escolha do provedor

| Provedor | Voz pt-BR | Quando usar |
|---|---|---|
| `azure` | `pt-BR-FranciscaNeural`, `AntonioNeural`, `ThalitaNeural` | Padrão. Free tier generoso, estilo `friendly`, região `brazilsouth` |
| `openai` | voz multilíngue + campo `instructions` | Mais simples de configurar; a instrução de tom faz mais diferença que a voz |
| `elevenlabs` | `eleven_multilingual_v2` | Melhor qualidade, e **permite clonar a voz da autora** a partir de poucos minutos de amostra — com consentimento explícito dela |

O caminho mais forte para um produto de mestrado é a **voz da própria Luciana**:
é o produto dela, e as crianças da escola conhecem essa voz. Ela pode gravar só
as falas de maior impacto (boas-vindas, comemorações, instruções dos blocos de
movimento) e deixar o resto para a voz neural — a arquitetura já suporta a
mistura sem nenhuma mudança de código.

### Ao acrescentar narração nova

`narrar()` com texto fixo numa tela só ganha clipe se o mesmo texto estiver em
`src/content/interface.ts`. Textos vindos do conteúdo dos jogos são extraídos
automaticamente. Texto dinâmico (com o nome da criança, por exemplo) nunca terá
clipe — prefira frases estáticas.

**Texto montado a partir de um conjunto fechado é exceção:** a roleta de
recompensa diz `Você ganhou ${figurinha}!`, e as doze figurinhas estão
enumeradas no extrator. Se o texto for dinâmico mas as possibilidades forem
contáveis, enumere — senão aquela fala fica robótica para sempre, sem ninguém
perceber.

Depois de escrever, rode `npm run falas:revisar`.

## Arte

Os assets ficam em `src/assets/library/`, numa biblioteca compartilhada entre
jogos (alimentos, esportes e alongamentos reaparecem em várias atividades). São
~250 imagens únicas na intervenção completa.

Enquanto a arte definitiva não existe, o campo `emoji` do JSON segura os jogos.
Trocar por `imagem` depois não toca em nenhum motor.

**Os prompts prontos e o fluxo de recorte estão em
[`docs/prompts-de-arte.md`](docs/prompts-de-arte.md).** Um prompt gera uma folha
com 6 a 12 figuras; `scripts/fatiar_sprites.py` acha cada figura pelos pixels
(não por grade fixa, que gerador nenhum respeita) e salva PNG com alpha.

A coerência entre folhas vem de gerar **primeiro a folha do personagem** e
anexá-la como referência em todas as outras.

Os 12 personagens de "Corpos do mundo" (5º ano) exigem curadoria individual —
o conteúdo daquela semana é diversidade corporal, e geradores de imagem
enviesam forte contra corpos gordos e pessoas com deficiência.

## Estado atual

Jogável de ponta a ponta: shell completo (as 8 telas do mockup), Jogos de
Movimento, Desafios da Saúde, Dicas de Saúde, Minhas Conquistas, Área do
Professor, e as **20 atividades dos cinco anos escolares**.

As 343 falas já estão escritas para o ouvido, dentro da régua e com direção de
atuação. A fazer: gravar ou gerar os clipes — ver
[`docs/estado-atual.md`](docs/estado-atual.md).
