# SAÚDE EM JOGO!

> Jogo que ensina, saúde que transforma!

PWA de letramento corporal e promoção da saúde para os anos iniciais do Ensino
Fundamental. Produto educacional do Mestrado Profissional em Educação Física em
Rede Nacional (PROEF/Unimontes) — Profa. Luciana Pereira Miranda Paccelli,
orientação Prof. Dr. Renato Sobral Monteiro Junior e Prof. Dr. Saulo Daniel
Mendes Cunha.

## O princípio: motor é código, jogo é JSON

As 20 atividades da intervenção (5 anos × 4 semanas) não são 20 programas. Elas
usam **nove motores** — o de quiz sozinho atende cinco jogos. Cada motor é
escrito e testado uma vez; cada jogo é um arquivo JSON validado por schema.

Consequência prática: **trocar uma atividade não exige programador**. Basta
editar o JSON em `src/content/anoN/`. É exatamente o que o documento da autora
prevê no P.S. final ("se não for possível a realização de alguma atividade,
substituímos por outra com o mesmo tema").

| Motor | Jogos que atende |
|---|---|
| `quiz` | Jogo de escolhas, Movimente-se, Equilibrista mirim, Água em jogo, Corpos do mundo |
| `arrastar-alvo` | Monte o corpo humano, Como me sinto? |
| `associacao` | Corpo que fala, Jogo da memória |
| `roleta` | Roleta giratória de alongamentos |
| `corpo-ativo` | Corpo que dança, Corpo em ação |
| `classificar` | Classificação corporal, Missão ambiente saudável *(a fazer)* |
| `rotina` | Dia ativo saudável, Digital saúde *(a fazer)* |
| `montagem` | Prato colorido, Super lanche *(a fazer)* |
| `trilha` | Trilha saudável do sono *(a fazer)* |
| `runner` | Missão corpo e movimento *(a fazer)* |

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
`public/falas/roteiro.md` (lista legível para gravação humana). Hoje são **139
falas, ~1400 palavras** — cerca de 40 minutos de estúdio.

```bash
PROVEDOR=azure AZURE_TTS_KEY=... npm run falas:gerar
```

Gera os MP3 que faltam. Provedores suportados: `openai`, `elevenlabs`, `azure`.

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
Movimento, Desafios da Saúde, Dicas de Saúde, Minhas Conquistas, e os **8 jogos
de 1º e 2º ano**.

A fazer: Área do Professor, os 5 motores restantes e os 12 jogos de 3º a 5º ano.
