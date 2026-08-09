# Prompts de arte — SAÚDE EM JOGO!

Como gerar as ilustrações em lote, num estilo só, e recortá-las automaticamente.

---

## Como o lote funciona

Um prompt gera **uma folha** com 6 a 12 figuras. Todas as figuras da mesma
folha saem coerentes entre si porque vieram da mesma geração. A coerência
**entre folhas** vem de outra coisa: o **bloco de estilo** abaixo, copiado
palavra por palavra em todo prompt.

Ordem obrigatória:

1. Gere a **Folha 0** (o personagem) e aprove.
2. Em toda folha seguinte que mostre uma criança, **anexe a Folha 0 no
   ChatGPT** e escreva `Use the exact same character from the attached image.`
   Sem isso, cada folha traz uma criança diferente.
3. Recorte com `scripts/fatiar_sprites.py`.

---

## As cinco regras que fazem o recorte funcionar

Gerador de imagem **não respeita grade matemática** — as células saem tortas,
com tamanhos diferentes. Por isso o script não corta em coordenadas fixas: ele
acha cada figura pelos pixels. Para isso funcionar, o prompt precisa garantir:

1. **Fundo branco chapado, não transparente.** Parece contraintuitivo, mas
   quando você pede transparência o ChatGPT costuma *desenhar* o xadrez
   cinza-e-branco dentro da imagem. Branco chapado é confiável.
2. **Contorno escuro em toda figura.** É estilo e é técnica ao mesmo tempo: o
   script remove o fundo por preenchimento a partir das bordas, e o contorno é
   o que faz o preenchimento parar. Sem ele, um dente branco ou uma nuvem
   branca viram buraco transparente.
3. **Nada encostando.** Figura que toca a vizinha vira uma figura só no
   recorte.
4. **Nada cortado na borda da tela.** Figura cortada gruda no fundo e some.
5. **Zero texto.** Gerador embaralha letra, e o app já tem o rótulo em HTML.

> **Nem tudo precisa de ilustração.** Cerca de 20 opções de resposta do MVP são
> abstratas — "1 vez", "3 vezes", "Nunca", "Pelo menos 1 hora". Essas ficam
> melhores em tipografia grande do que em desenho. Não gere arte para elas.

---

## Bloco de estilo

Cole isto em **todo** prompt, sem alterar. Trocar `{COLS}`, `{ROWS}` e `{N}`.

> **Este bloco descreve o estilo que a Folha 0 realmente produziu**, não o que
> foi pedido na primeira tentativa. O pedido original era "3D suave e brilhante";
> o gerador entregou vetorial chapado com contorno grosso — e ficou melhor para
> este app, porque lê com clareza nos cards de ~150 px do quiz e combina com os
> botões de borda grossa da interface. Estilo chapado também deriva muito menos
> ao longo de 10 folhas do que sombreado 3D.
>
> **Não reescreva este bloco.** Ele é o contrato de coerência entre as folhas.

```
=== STYLE — keep this block identical in every sheet ===
Flat 2D vector cartoon illustration for a children's educational app, ages 6-11.
Clean solid colour fills with soft simple shading, no gradients, no gloss,
no 3D rendering. A bold dark brown outline of even weight around every shape,
and thinner interior lines for details. Rounded friendly forms, warm and simple.
Use ONLY this palette, plus white:
  #4FC3F7 sky blue, #66BB6A leaf green, #FFCA28 sun yellow,
  #FF7043 coral, #A175F2 purple, #1F2933 near-black.
Front view or slight three-quarter view, centred, no perspective distortion.
No background scenery. No drop shadow falling on the background.
NO text, NO letters, NO numbers, NO labels anywhere in the image.

=== LAYOUT — required for automated slicing ===
Flat pure white #FFFFFF background, perfectly uniform: no gradient, no texture,
no vignette, no transparency checkerboard pattern.
Arrange the items in a grid of {COLS} columns by {ROWS} rows, exactly {N} items.
Wide empty margin around the whole grid, generous empty gap between items.
No item touches another item or the edge of the canvas. Nothing is cropped.
All items at roughly the same visual size.
Square canvas, 1024 x 1024.
```

---

## Folha 0 — O personagem ✅ pronta

Gerada, recortada e já em uso no app. O original está em
`arte-fonte/folha-0-personagem.png`.

**Anexe esse arquivo no ChatGPT em toda folha seguinte** que mostre uma criança,
com a frase `Use the exact same character from the attached image.` É isso que
mantém o mesmo menino nas dez folhas.

Os seis sprites recortados estão em `src/assets/library/personagem/`.

> Decisão pendente da autora: tom de pele, gênero e nome do mascote. O 5º ano
> trabalha diversidade corporal, então essa escolha tem peso pedagógico — vale
> conversar com a Luciana antes de travar.

```
A character sheet of ONE single cartoon child, the mascot of a children's
health and movement app. Around 8 years old, short brown hair, bright blue
t-shirt, dark blue shorts, white sneakers, big friendly eyes, warm smile.
The SAME child in all six poses, identical clothes, identical face, identical
proportions. Full body, head to feet.

Six poses, reading order:
1. standing still, facing front, relaxed, small smile
2. waving hello with one hand raised
3. both arms up in the air, celebrating, big open smile
4. one hand on the chin, thinking, eyes looking up
5. giving a thumbs up, encouraging, reassuring smile
6. mid-jump, both feet off the ground, arms out, joyful

[BLOCO DE ESTILO com {COLS}=3 {ROWS}=2 {N}=6]
```

```bash
python scripts/fatiar_sprites.py folha-0.png --saida src/assets/library/personagem --nomes parado,acenando,comemorando,pensando,apoiando,pulando --tamanho 512
```

---

## Folha A — Corpo desmontado

Para **"Monte o corpo humano"** (1º ano, semana 1). Caso especial: as peças
precisam **encaixar entre si**, então peça uma vista explodida de um corpo só.

```
An exploded view of ONE cartoon child's body, taken apart into six separate
pieces laid out on a grid. Same child as the attached reference image.
Each piece is a clean, complete, self-contained shape that would fit back
together into a whole body. Flat cut edges where the pieces separate.

Six pieces, reading order:
1. the head with the face and hair
2. the torso wearing the blue t-shirt, no arms, no head
3. the right arm with the hand, seen from the front
4. the left arm with the hand, seen from the front
5. the right leg with the shoe
6. the left leg with the shoe

[BLOCO DE ESTILO com {COLS}=3 {ROWS}=2 {N}=6]
```

```bash
python scripts/fatiar_sprites.py folha-a.png --saida src/assets/library/corpo --nomes cabeca,tronco,braco-direito,braco-esquerdo,perna-direita,perna-esquerda
```

---

## Folha B — Emoções

Para **"Como me sinto?"** (1º ano, semana 3).

```
Eight cartoon faces showing eight different emotions. The SAME face in all
eight: same head shape, same hair, same skin tone, same eye style. Only the
expression changes. Head and neck only, no body. Same child as the attached
reference image.

Eight expressions, reading order:
1. joy, big open smile, happy eyes
2. sadness, downturned mouth, drooping eyes
3. fear, wide eyes, small worried mouth, raised eyebrows
4. anger, frowning eyebrows, tight mouth
5. crying, closed eyes, open mouth, visible tears
6. surprise, round open mouth, raised eyebrows
7. serious, straight neutral mouth, calm eyes
8. astonishment, both hands on the cheeks, huge round eyes and mouth

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=2 {N}=8]
```

```bash
python scripts/fatiar_sprites.py folha-b.png --saida src/assets/library/emocoes --nomes alegria,tristeza,medo,raiva,choro,surpresa,serio,espanto
```

---

## Folha C — Objetos de higiene

Para **"Jogo de escolhas"** (1º ano, semana 2). Inclui os distratores do quiz.

```
Twelve separate objects, each drawn on its own, no character.

Reading order:
1. a bar of soap with foam bubbles
2. a bottle of shampoo
3. a toothbrush with toothpaste on it
4. a tube of toothpaste
5. a shower head with water falling
6. a folded towel
7. a nail clipper
8. a bathroom sink tap with running water
9. a teddy bear
10. a single shoe
11. a small pile of sand
12. a glass of orange juice

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=3 {N}=12]
```

```bash
python scripts/fatiar_sprites.py folha-c.png --saida src/assets/library/higiene --nomes sabonete,xampu,escova-de-dentes,pasta-de-dente,chuveiro,toalha,cortador-de-unha,torneira,urso-de-pelucia,sapato,areia,suco
```

---

## Folha D — Ações de higiene

```
Six pictures of the same cartoon child doing a different daily-care action.
Same child as the attached reference image. Full body or half body, whichever
reads more clearly for each action.

Reading order:
1. taking a shower, happy, foam on the hair
2. brushing the teeth, toothbrush in hand
3. washing the hands under a tap, foam on the hands
4. sleeping peacefully in a bed, calm face
5. showing both hands, visibly dirty with mud, embarrassed face
6. cutting the fingernails with a nail clipper

[BLOCO DE ESTILO com {COLS}=3 {ROWS}=2 {N}=6]
```

```bash
python scripts/fatiar_sprites.py folha-d.png --saida src/assets/library/higiene --nomes tomar-banho,escovar-dentes,lavar-maos,dormir-bem,maos-sujas,cortar-unhas
```

---

## Folha E — Gestos que falam

Para **"Corpo que fala"** (2º ano, semana 1).

```
Eight pictures of the same cartoon child making a different silent gesture.
Same child as the attached reference image. Head and torso, arms visible.
The gesture must be unmistakable on its own, with no text and no symbols.

Reading order:
1. one finger in front of the lips, asking for silence
2. one hand raised, waving goodbye
3. thumbs up with one hand, confident smile
4. thumbs down with one hand, disappointed face
5. nodding yes, head tilted slightly down, eyes closed, small smile
6. shaking the head no, head turned to one side, eyebrows raised
7. one open palm held forward, asking to stop, serious face
8. clapping both hands together, cheerful face

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=2 {N}=8]
```

```bash
python scripts/fatiar_sprites.py folha-e.png --saida src/assets/library/gestos --nomes silencio-gesto,tchau-gesto,polegar-cima,polegar-baixo,cabeca-sim,cabeca-nao,mao-pare,palmas
```

---

## Folha F — Símbolos de significado

A coluna direita do "Corpo que fala": ícones abstratos, sem personagem.

```
Eight simple flat icons, each drawn on its own, no character, no text.

Reading order:
1. a speaker with a crossed-out line, meaning silence
2. an open door with a small waving hand beside it, meaning goodbye
3. a green check mark inside a rounded square
4. a red cross mark inside a rounded square
5. a green check mark inside a circle, thicker and bolder
6. a red prohibition sign, a circle with a diagonal bar
7. an octagonal stop sign, blank, no letters
8. a party popper with confetti coming out, meaning congratulations

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=2 {N}=8]
```

```bash
python scripts/fatiar_sprites.py folha-f.png --saida src/assets/library/simbolos --nomes silencio,tchau,esta-bem,nao-esta-bem,sim,nao,pare,parabens
```

---

## Folha G — Atividades e sedentarismo

Para **"Movimente-se"** (2º ano, semana 2). Os quatro últimos são as opções
sedentárias — desenhe-as **sem julgamento**, apenas de baixa energia.

```
Ten pictures of the same cartoon child doing a different activity.
Same child as the attached reference image. Full body.

Reading order:
1. running fast, arms swinging, energetic
2. swimming in water, arms stretched forward
3. skipping rope, mid-jump
4. riding a bicycle
5. playing tag, running and laughing, reaching forward
6. playing hopscotch, hopping on one foot
7. stretching the arms high above the head
8. lying on a sofa watching a television, relaxed and still
9. sitting on the floor looking down at a phone, still
10. sleeping in a bed, calm

[BLOCO DE ESTILO com {COLS}=5 {ROWS}=2 {N}=10]
```

```bash
python scripts/fatiar_sprites.py folha-g.png --saida src/assets/library/atividades --nomes correr,nadar,pular-corda,bicicleta,pique-pega,amarelinha,alongar,tv-deitado,celular-sentado,dormir
```

---

## Folha H — Alongamentos

Para a **roleta** (2º ano, semana 4). Os 12 itens, na ordem exata do JSON.

```
Twelve pictures of the same cartoon child performing a different stretch.
Same child as the attached reference image. Full body, side or three-quarter
view, whichever shows the stretch most clearly. Calm, focused, comfortable —
never straining. The pose must be readable well enough for a child to copy it.

Reading order:
1. tilting the head sideways towards one shoulder, stretching the neck
2. both arms stretched straight up above the head
3. one arm pulled across the chest, held by the other arm
4. torso twisted to one side, feet planted, arms following the twist
5. one arm raised, body bent sideways, stretching the side of the body
6. sitting on the floor, legs straight, reaching for the toes
7. standing, one knee bent backwards, holding the foot behind
8. hands against a wall, one leg stretched back, heel on the ground
9. sitting with the soles of the feet together, knees out, butterfly stretch
10. on hands and knees, back arched upwards like a cat
11. hands open in front, rotating the wrists
12. standing calm, eyes closed, one hand on the belly, breathing deeply

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=3 {N}=12]
```

```bash
python scripts/fatiar_sprites.py folha-h.png --saida src/assets/library/alongamentos --nomes pescoco,bracos-alto,ombro,tronco,lateral,perna-tras,coxa,panturrilha,borboleta,gato,maos,respirar
```

---

## Folha I — Situações de equilíbrio

Para **"Equilibrista mirim"** (2º ano, semana 3).

```
Eight pictures of the same cartoon child in a different body situation.
Same child as the attached reference image. Full body, side view where it helps.
Four of them clearly require balance, four clearly do not.

Reading order:
1. walking along a narrow line on the floor, arms out for balance
2. standing on one foot, the other knee lifted, arms out
3. lying flat on a bed, relaxed
4. climbing a ladder, one foot on a rung
5. sitting on a chair, feet on the floor, relaxed
6. riding a bicycle, concentrating
7. sliding down a playground slide, sitting, laughing
8. walking on tiptoes, arms slightly out

[BLOCO DE ESTILO com {COLS}=4 {ROWS}=2 {N}=8]
```

```bash
python scripts/fatiar_sprites.py folha-i.png --saida src/assets/library/equilibrio --nomes linha,um-pe,deitado,escada,sentado,bicicleta,escorregador,ponta-dos-pes
```

---

## Reforços aprendidos na prática

A primeira leva de folhas errou de formas específicas. Cada regra abaixo existe
por causa de um erro observado — **acrescente todas ao bloco de estilo**:

```
=== RULES — add to every prompt ===
Do NOT write any title, heading, section name, caption, number or label anywhere
in the image. The image must contain only the drawings themselves.
Draw exactly the items in the numbered list below: no more, no fewer.
Do not add any item that is not on the list.
All items must be visibly different from each other. Never draw the same idea twice.
```

| Erro observado | Regra que corrige |
|---|---|
| Gerador escreveu "SECTION A — CHARACTER POSES" mesmo com "NO text" | proibir explicitamente *title, heading, caption, label* |
| Frascos de higiene apareceram dentro do bloco de emoções | **uma seção por folha** — o vazamento só acontece em folha misturada |
| Duas poses de natação diferentes na mesma seção | "all items must be visibly different, never draw the same idea twice" |
| Seção pediu 8 gestos e vieram 6 | lista numerada + "exactly N, no more, no fewer" |
| Giro de tronco e balançar a cabeça simplesmente não vieram | **ver a regra do movimento congelado, abaixo** |
| "Vista explodida" virou um corpo montado com membros flutuando | **nunca escrever "exploded view"** |

### A regra do movimento congelado

Gerador de imagem não desenha movimento — desenha pose. Item que é uma **ação**
("girar o tronco", "balançar a cabeça") costuma sair errado ou simplesmente não
sair.

A correção é descrever o **quadro congelado** mais uma seta de movimento:

> ❌ `nodding the head yes`
> ✅ `head tilted forward and down, eyes closed, small smile, with a short curved
> motion arrow beside the head`

Quando usar setas, libere-as no prompt: `simple curved motion arrows in #1F2933
are allowed; they are not text.`

---

## Folha única com várias seções

Dá para pedir tudo numa folha só, e funciona — mas aí **fatie seção por seção**
com `--regiao`, nunca a folha inteira de uma vez:

```bash
python scripts/fatiar_sprites.py folha-mega.png --regiao 1040,485,2030,835 --saida ... --nomes ...
```

Dois motivos: o gerador escreve título de seção (mesmo com "NO text" no prompt) e
o título vira sprite; e conferir uma lista de 100 nomes na ordem certa é
impraticável. Descubra as coordenadas rodando `--conferir` na folha inteira uma
vez e lendo a imagem numerada.

Cuidado ao escolher `y0`: se cortar em cima da linha do título, sobra uma fatia
dele que é detectada como figura. Desça uns 20 px.

**A resolução por sprite é decidida pela quantidade de itens, não pelo tamanho
da folha.** Numa folha 2048 com 100 figuras cada uma sai com ~200 px — suficiente
para os ícones de resposta, que o app desenha a 96 px, mas apertado para o
mascote, que aparece a 144 px. Personagem principal merece folha própria.

---

## Sempre confira a ordem antes de gravar

A ordem é o único ponto onde este fluxo erra feio e **em silêncio**: se a
numeração não bater com a sua lista de nomes, os arquivos saem trocados e o jogo
mostra a figura errada para cada resposta.

```bash
python scripts/fatiar_sprites.py folha-c.png --conferir
```

Isso grava `folha-c-conferencia.png` com cada figura numerada na ordem em que
seria salva. Olhe, confira contra a lista, só então rode com `--saida`.

Se o script achar figuras a mais ou a menos, ajuste:

| Sintoma | Ajuste |
|---|---|
| duas figuras viraram uma | `--raio 3` (menos dilatação) ou gere de novo com mais espaço |
| uma figura virou duas | `--raio 10` (mais dilatação) |
| sobrou sujeira minúscula | `--area-minima 3000` |
| o fundo não saiu todo | `--tolerancia 45` |
| sumiu parte do desenho | fundo não era branco chapado — gere de novo |

---

## Animação

**Não use GIF.** GIF tem 256 cores e transparência de 1 bit. Neste app os
sprites ficam sobre cards coloridos, então a transparência de 1 bit entrega
serrilhado duro na borda, e o degradê do estilo 3D vira faixas de cor. E o
arquivo ainda sai maior que as alternativas.

Em ordem de qualidade e de esforço:

### 1. Movimento em CSS sobre sprite estático — comece por aqui

Flutuar, pulsar, balançar, esmagar-e-esticar, entrar com "pop". Roda a 60 fps,
custa **zero byte** e é mais fluido que qualquer animação de 8 quadros. O
`<Mascote>` já faz isso hoje com Framer Motion.

A maior parte da "vida" de um app infantil vem daqui, não de quadro a quadro.

### 2. Tira de quadros + CSS `steps()` — para mudança real de pose

Quando o personagem precisa de fato mudar de pose (acenar, pular), aí sim
quadros. Uma tira PNG horizontal, animada por `background-position`. Alpha de 8
bits, sem JS, e o navegador controla tudo.

```bash
python scripts/montar_animacao.py quadros/*.png --saida src/assets/library/personagem/acenar --fps 8
```

O script imprime o CSS pronto, já com a regra de `prefers-reduced-motion`.

### 3. WebP animado ou APNG

O mesmo script também gera os dois. Alpha completo, degradê limpo, cerca de um
quinto do tamanho de um GIF equivalente. Use quando a animação for complexa
demais para uma tira.

### Sobre gerar animação por IA

Ferramentas de imagem-para-vídeo produzem **vídeo**, não sprite com fundo
transparente. Tirar um laço limpo dali exige recorte quadro a quadro e quase
sempre fica pior que 6 poses escolhidas a dedo. Para este app, a melhor relação
qualidade/esforço é: sprites estáticos da folha + movimento em CSS.

Para gerar os quadros de uma pose, o caminho é a própria folha de sprites — peça
6 estágios de um mesmo movimento numa grade, exatamente como a Folha 0.
