# Folhas A3 — a arte que ainda falta

Continuação de [prompts-de-arte.md](prompts-de-arte.md), que traz o bloco de
estilo, o bloco de regras e o fluxo de recorte. **Leia aquele primeiro** — o
bloco de estilo é o contrato de coerência entre todas as folhas e não deve ser
reescrito.

As folhas anteriores eram quadradas. Daqui em diante, **A3 retrato**: a
proporção 1:1,414 dá mais linhas na mesma largura, e cabem 24 figuras por folha
com cerca de 500 px cada.

> **A resolução por sprite depende da quantidade de itens, não do tamanho da
> folha.** Nunca passe de 24 por folha. Se o gerador não honrar as dimensões
> exatas, tudo bem — o que importa é a proporção e a contagem.

## Bloco de layout A3

Substitui o bloco `=== LAYOUT ===` das folhas quadradas.

```
=== LAYOUT — A3 portrait, required for automated slicing ===
Flat pure white #FFFFFF background, perfectly uniform: no gradient, no texture,
no vignette, no transparency checkerboard pattern.
A3 portrait proportions, aspect ratio 1:1.414, 2480 x 3508 pixels.
Arrange the items in a grid of {COLS} columns by {ROWS} rows, exactly {N} items.
Wide empty margin around the whole grid, generous empty gap between items.
No item touches another item or the edge of the canvas. Nothing is cropped.
All items at roughly the same visual size.
```

Use sempre junto do `=== STYLE ===` e do `=== RULES ===` do outro documento.

---

## Folha F1 — Personagem feminina

**A mais importante da leva.** Sem ela as alunas não têm quem escolher.

Anexe a Folha 0 apenas como referência de traço, e escreva
`Same drawing style as the attached image, but a different child.` — esta é uma
criança **diferente**, no **mesmo estilo**.

> **Sugestão que custa zero e dobra a representatividade:** dê a ela um tom de
> pele diferente do menino. O 5º ano trabalha diversidade corporal e respeito às
> diferenças — ter dois personagens iguais em tudo menos o cabelo desperdiça a
> chance de o próprio app praticar o que ensina.

```
A character sheet of ONE single cartoon girl, around 8 years old, medium-brown
skin, dark curly hair in two puffs, bright blue t-shirt, dark blue shorts,
white sneakers, big friendly eyes, warm smile.
Same drawing style as the attached image, but a different child.
The SAME girl in every drawing: identical clothes, identical face, identical
proportions and identical skin tone across all twenty items.

ROWS 1 and 2 — six full-body poses, head to feet:
1. standing still, facing front, relaxed, small smile
2. waving hello with one hand raised
3. both arms up in the air, celebrating, big open smile
4. one hand on the chin, thinking, eyes looking up
5. giving a thumbs up, encouraging, reassuring smile
6. mid-jump, both feet off the ground, arms out, joyful

ROWS 3 and 4 — eight faces, head and neck only, no body.
The SAME face in all eight; only the expression changes:
7.  joy, big open smile, happy eyes
8.  sadness, downturned mouth, drooping eyes
9.  fear, wide eyes, small worried mouth, raised eyebrows
10. anger, frowning eyebrows, tight mouth
11. crying, closed eyes, open mouth, visible tears
12. surprise, round open mouth, raised eyebrows
13. serious, straight neutral mouth, calm eyes
14. astonishment, both hands on the cheeks, huge round eyes and mouth

ROWS 5 and 6 — six SEPARATE body pieces. These rows do NOT show a girl.
Do NOT assemble them. Do NOT arrange them in the shape or position of a body.
Each piece sits alone with empty white space around it, like puzzle pieces
waiting in a box, each with a clean flat cut edge where it separates from the
rest of the body:
15. the head alone, flat straight cut across the bottom of the neck.
    No shoulders, no body.
16. the torso alone: t-shirt and shorts, with a flat cut at the neck, a flat cut
    at each shoulder and a flat cut at each hip. No head, no arms, no legs.
17. the right arm alone, shoulder to fingertips, flat cut at the shoulder
18. the left arm alone, shoulder to fingertips, flat cut at the shoulder
19. the right leg alone, hip down to the white sneaker, flat cut at the hip
20. the left leg alone, hip down to the white sneaker, flat cut at the hip

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=5 {N}=20]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

Recorte em três regiões, uma por bloco:

```bash
python scripts/fatiar_sprites.py arte-fonte/f1.png --conferir
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f1.png --regiao X0,Y0,X1,Y1 --saida src/assets/library/menina --nomes parado,acenando,comemorando,pensando,apoiando,pulando --tamanho 512
```

As emoções e as partes do corpo saem com as mesmas listas de nomes usadas em
`emocoes/` e `corpo/`, em `menina-emocoes/` e `menina-corpo/`.

### O que muda no código

A escolha entra na tela **"Digite o seu nome"**, ao lado do campo — dois cards
grandes com os dois personagens parados, e a escolha vai para o perfil
(`usarPerfil`). O `<Mascote>` passa a ler o personagem do perfil em vez de
importar direto. É a única mudança estrutural: cerca de 4 horas.

---

## Folha F2 — Alimentos

Para **Prato colorido** e **Super lanche** (4º ano). Categorias tiradas do
documento da autora: frutas, verduras, proteínas, arroz e feijão, bebidas e
ultraprocessados.

```
Twenty-four separate food items, each drawn on its own. No character, no plate,
no table, no background.

1. an apple                 2. a banana              3. a bunch of grapes
4. an orange                5. a strawberry          6. a slice of watermelon
7. a lettuce leaf           8. a carrot              9. a tomato
10. a broccoli floret      11. a cucumber           12. a bell pepper
13. a piece of grilled chicken   14. a boiled egg    15. a fillet of fish
16. a bowl of brown beans  17. a bowl of white rice 18. a slice of bread
19. a glass of milk        20. a glass of water     21. a glass of orange juice
22. a can of fizzy drink   23. a chocolate bar      24. a bag of crisps

Draw items 22, 23 and 24 exactly as appetising and as well made as the others.
They are choices in a game, not villains.

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=6 {N}=24]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f2.png --saida src/assets/library/alimentos --nomes maca,banana,uva,laranja,morango,melancia,alface,cenoura,tomate,brocolis,pepino,pimentao,frango,ovo,peixe,feijao,arroz,pao,leite,agua,suco-laranja,refrigerante,chocolate,salgadinho --tamanho 256 --area-minima 3000
```

---

## Folha F3 — Esportes

Para o **Jogo da memória** (3º ano). As 16 modalidades exatamente como listadas
no documento.

```
Sixteen pictures, each showing ONE sport. Use the exact same child from the
attached image in every picture. Full body, mid-action, instantly recognisable.
Include only the equipment the sport needs — no court, no field, no crowd,
no background scenery.

1. volleyball          2. basketball        3. futsal
4. football            5. handball          6. swimming
7. tennis              8. golf              9. rugby
10. athletics sprinting 11. surfing         12. skateboarding
13. capoeira           14. cycling         15. fencing
16. climbing

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=4 {N}=16]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f3.png --saida src/assets/library/esportes --nomes volei,basquete,futsal,futebol,handebol,natacao,tenis,golfe,rugby,atletismo,surfe,skate,capoeira,ciclismo,esgrima,escalada --tamanho 256 --area-minima 3000
```

---

## Folha F4 — Água, sono e rotina

Para **Água em jogo**, **Trilha do sono** (3º ano) e **Dia ativo saudável**
(4º ano).

```
Eighteen pictures. Items 1 to 6 are objects on their own, with no character.
Items 7 to 18 use the exact same child from the attached image.

1. a glass of water                 2. a water bottle
3. a tap with one drop falling      4. a cloud with rain
5. an alarm clock                   6. a crescent moon with small stars

7.  drinking a glass of water, happy
8.  sweating after exercise, tired but content, one hand on the chest
9.  brushing teeth before bed, wearing pyjamas
10. lying in bed asleep, calm, blanket up to the chest
11. sitting up in bed stretching, just woken up, morning face
12. yawning, one hand covering the mouth, sleepy eyes
13. lying in bed at night, awake, holding a glowing phone, eyes wide open
14. eating breakfast at a table
15. walking while wearing a school backpack
16. reading a book, sitting on the floor
17. playing outdoors with a ball
18. sitting quietly breathing deeply, eyes closed, both hands on the belly

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=5 {N}=18]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f4.png --saida src/assets/library/rotina --nomes copo-agua,garrafa,torneira-pingando,chuva,despertador,lua,beber-agua,suando,escovar-noite,dormindo,acordando,bocejando,celular-de-noite,cafe-da-manha,mochila,lendo,brincar-fora,respirar-calmo --tamanho 256 --area-minima 3000
```

---

## Folha F5 — Ambiente

Para **Missão ambiente saudável** (5º ano). O jogo é arrastar cada item para o
lugar certo, então a folha precisa dos **pares**: o objeto fora do lugar e o
destino dele.

```
Sixteen separate items, each drawn on its own, with no background scenery.

Objects out of place, items 1 to 8:
1. a crumpled paper ball          2. an empty plastic bottle lying on its side
3. a banana peel                  4. a teddy bear lying on the floor
5. a t-shirt crumpled on the floor  6. an unmade bed with tangled sheets
7. a tap running, water being wasted  8. a ceiling lamp switched on and glowing

Where each one belongs, items 9 to 16, in the same order:
9.  an open rubbish bin           10. a blue recycling bin
11. a brown organic waste bin     12. an open toy box
13. a laundry basket              14. a neatly made bed
15. the same tap, closed, no water  16. the same ceiling lamp, switched off

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=4 {N}=16]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f5.png --saida src/assets/library/ambiente --nomes papel,garrafa,casca-banana,urso-chao,camiseta-chao,cama-desarrumada,torneira-aberta,luz-acesa,lixeira,lixeira-reciclavel,lixeira-organico,caixa-brinquedos,cesto-roupa,cama-arrumada,torneira-fechada,luz-apagada --tamanho 256 --area-minima 3000
```

---

## Folha F6 — Figurinhas de recompensa

Para a **camada de engajamento**: cada parada concluída dá uma figurinha, que a
criança cola no álbum. É a mecânica que faz voltar amanhã, e é barata porque o
motor da roleta já existe.

```
Twelve collectible sticker badges. Each is a rounded badge with a thick white
outer border, like a real sticker peeled off a sheet, with one simple symbol
inside. No character, no text, no numbers, no letters.

1. a gold star            2. a red heart          3. a blue water drop
4. a green apple          5. a toothbrush         6. a crescent moon
7. a running shoe         8. a skipping rope      9. a flexed arm muscle
10. a smiling sun        11. a rainbow           12. a gold trophy

Give each badge a different background colour from the palette, so that twelve
stickers are instantly distinguishable side by side in an album page.

[BLOCO DE LAYOUT A3 com {COLS}=4 {ROWS}=3 {N}=12]
[BLOCO DE ESTILO]  [BLOCO DE REGRAS]
```

```bash
python scripts/fatiar_sprites.py arte-fonte/f6.png --saida src/assets/library/figurinhas --nomes estrela,coracao,gota,maca,escova,lua,tenis,corda,musculo,sol,arco-iris,trofeu --tamanho 256 --area-minima 3000
```

---

## Resumo

| Folha | Itens | O que destrava |
|---|---:|---|
| F1 — Personagem feminina | 20 | A escolha de personagem, emoções e corpo da menina |
| F2 — Alimentos | 24 | Prato colorido, Super lanche |
| F3 — Esportes | 16 | Jogo da memória |
| F4 — Água, sono e rotina | 18 | Água em jogo, Trilha do sono, Dia ativo saudável |
| F5 — Ambiente | 16 | Missão ambiente saudável |
| F6 — Figurinhas | 12 | Álbum de recompensas |
| **Total** | **106** | |

Com estas seis folhas, somadas aos 89 sprites já cortados, a arte do jogo
inteiro fecha em **195 sprites**.

**Gere uma folha por vez**, e sempre rode `--conferir` antes de gravar. A ordem
das figuras é o único ponto onde este fluxo erra feio e em silêncio.

Ordem sugerida: **F1 primeiro** — é a que muda a experiência das alunas. Depois
F6, que é pequena e liga a camada de engajamento inteira. Só então F2 a F5,
conforme os jogos daqueles anos entrarem.
