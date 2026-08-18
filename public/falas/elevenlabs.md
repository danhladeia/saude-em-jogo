# Gerar as falas no ElevenLabs — SAÚDE EM JOGO!

> Gerado junto com `npm run falas:extrair`. **Não edite à mão:** o conteúdo
> é o único dono dos textos, e uma cópia editada aqui vira nome de arquivo
> errado, que é clipe que nunca toca.

São **343 falas**, **17.636 caracteres**.

## Antes de começar

**Uma voz só, do início ao fim.** A narração não é um leitor de tela, é um
personagem: se a voz mudar no meio, a criança percebe na hora. Escolha uma
voz na Voice Library filtrando por **Portuguese (Brazil)**, prefira timbre
feminino e caloroso, e teste com três falas de intenções diferentes antes de
gerar as outras trezentas.

| Configuração | Valor |
| --- | --- |
| Modelo | `eleven_multilingual_v2` |
| Formato de saída | `mp3_22050_32` (MP3 32 kbps, 22 kHz) |
| Similarity boost | 0.8 |
| Speaker boost | ligado |

O formato é pequeno de propósito: os MP3 entram no precache do service
worker e o app precisa abrir numa máquina de laboratório, offline.

## Dois caminhos

### Pela API (recomendado)

Faz os 343 arquivos com o nome certo, sem renomear nada:

```bash
PROVEDOR=elevenlabs ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run falas:gerar
```

Os controles de cada intenção já vão no pedido — é a mesma tabela deste
documento. **Arquivo que já existe nunca é sobrescrito**, então dá para
gerar em partes, e para misturar com falas gravadas por gente.

### Pelo site

Para cada fala, em Speech Synthesis:

1. Ajuste **Stability** e **Style** conforme o grupo (uma vez por grupo).
2. Cole o texto e gere.
3. Baixe e **renomeie para o nome da coluna Arquivo**.
4. Salve em `public/falas/`.

No fim de tudo, para o app enxergar os clipes novos:

```bash
npm run falas:manifesto
```

São 343 downloads e 343 renomeações à mão. Vale para gravar um punhado de
falas escolhidas, ou para testar vozes antes de decidir — para o lote
inteiro, o caminho da API é uma tarde a menos.

## A voz da Luciana

O ElevenLabs clona voz a partir de poucos minutos de amostra. Para um
produto de mestrado é a opção mais forte: é o produto dela, e as crianças
da escola conhecem essa voz. **Exige consentimento explícito dela**, por
escrito, e a amostra é dado pessoal — não suba nada sem essa conversa.

Feito o clone, o `ELEVENLABS_VOICE_ID` passa a ser o da voz dela e as 343
falas saem sem nova sessão de gravação.

## As falas, por intenção

Ajuste os controles no começo de cada grupo. Só muda de grupo para grupo —
é o que faz "Isso mesmo!" não sair com a mesma energia de "Tente outro
lugar.".

### `instrucao` — 53 falas, 2.277 caracteres

**Clara e calma, como quem explica a tarefa. Sem pressa.**

| Stability | Style |
| --- | --- |
| **0.55** | **0.25** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `0hhhfw5.mp3` | Arraste cada parte do corpo para o lugar certo. | ano1-s1-monte-o-corpo |
| `03on40v.mp3` | Escolha a atitude certa para cuidar do seu corpo. | ano1-s2-jogo-de-escolhas |
| `0ow2noe.mp3` | Arraste cada rostinho para o sentimento certo. | ano1-s3-como-me-sinto |
| `11mz6oj.mp3` | Copie os movimentos do personagem com o seu corpo! | ano1-s4-corpo-que-danca |
| `1g1jl8p.mp3` | Ligue cada gesto ao que o corpo está dizendo. | ano2-s1-corpo-que-fala |
| `01bafjx.mp3` | Bater palmas | ano2-s1-corpo-que-fala/aplauso |
| `0co0i6z.mp3` | Polegar para cima | ano2-s1-corpo-que-fala/bem |
| `1ahlzaq.mp3` | Polegar para baixo | ano2-s1-corpo-que-fala/mal |
| `0b1iq6i.mp3` | Balançar a cabeça para os lados | ano2-s1-corpo-que-fala/nao |
| `087h3y6.mp3` | Mão aberta na frente | ano2-s1-corpo-que-fala/pare |
| `1nqtdd7.mp3` | Dedo na boca | ano2-s1-corpo-que-fala/silencio |
| `1lacx5p.mp3` | Balançar a cabeça para cima e para baixo | ano2-s1-corpo-que-fala/sim |
| `04ggpit.mp3` | Mão balançando | ano2-s1-corpo-que-fala/tchau |
| `14ahf2t.mp3` | Marque as atividades que fazem o corpo se movimentar. Cada acerto dá energia ao personagem! | ano2-s2-movimente-se |
| `1a4stxo.mp3` | Qual dessas ações exige equilíbrio? Cada acerto mantém o personagem de pé na prancha! | ano2-s3-equilibrista-mirim |
| `1e07krq.mp3` | Clique em GIRAR. Onde a roleta parar, é o alongamento que você vai fazer! | ano2-s4-roleta-alongamentos |
| `1xu8uwy.mp3` | Responda o que a água faz dentro do seu corpo. | ano3-s1-agua-em-jogo |
| `0oau1qn.mp3` | Cada resposta certa anda uma casa na trilha até a cama. | ano3-s2-trilha-do-sono |
| `11h008t.mp3` | Vire duas cartas e ache o esporte junto com o gesto dele. | ano3-s3-tipos-de-esporte |
| `1mum30d.mp3` | Atletismo | ano3-s3-tipos-de-esporte/atletismo |
| `1h27cpx.mp3` | Basquete | ano3-s3-tipos-de-esporte/basquete |
| `0m7e6p2.mp3` | Ciclismo | ano3-s3-tipos-de-esporte/ciclismo |
| `0inbuq4.mp3` | Futebol | ano3-s3-tipos-de-esporte/futebol |
| `1im7kc2.mp3` | Natação | ano3-s3-tipos-de-esporte/natacao |
| `0vujmwf.mp3` | Vôlei | ano3-s3-tipos-de-esporte/volei |
| `0ar2zdf.mp3` | Arraste cada movimento para a caixa certa. Os dois fazem bem. O que muda é o combinado. | ano3-s4-classificacao-corporal |
| `1d8828p.mp3` | Monte o prato. Arraste cada alimento para o grupo dele. | ano4-s1-prato-colorido |
| `1u30toq.mp3` | Separe os lanches em dois grupos. O de todo dia e o de vez em quando. | ano4-s2-super-lanche |
| `06xlk3o.mp3` | Cinco perguntas para encher a barra de energia. Depois a missão é com o seu corpo. | ano4-s3-missao-corpo-e-movimento |
| `05wja5y.mp3` | Monte o seu dia. Arraste cada coisa para a hora certa. | ano4-s4-dia-ativo-saudavel |
| `0pl58sa.mp3` | Cinco perguntas sobre corpos diferentes. Não existe um corpo certo. | ano5-s1-corpos-do-mundo |
| `1aupiw0.mp3` | Organize o fim do dia. A tela tem hora certa. A última hora antes de dormir não é dela. | ano5-s2-digital-saude |
| `0sf9xwt.mp3` | O quarto está bagunçado. Arraste cada coisa para o lugar dela. | ano5-s3-missao-ambiente-saudavel |
| `12iqbdy.mp3` | Uma sessão inteira de movimento. Do aquecimento até a volta à calma. | ano5-s4-corpo-em-acao |
| `0phoqrn.mp3` | Quanto mais cores no prato, melhor para o corpo. | dicas/alimentacao |
| `0s1yiji.mp3` | Fruta e verdura dão energia de verdade. | dicas/alimentacao |
| `0oimizq.mp3` | Beba água durante o dia todo, mesmo sem sede. | dicas/alimentacao |
| `1dakc6f.mp3` | Ultraprocessado é de vez em quando, não todo dia. | dicas/alimentacao |
| `0g4bczp.mp3` | Movimente-se todos os dias. Brincar também é se exercitar. | dicas/atividade-fisica |
| `045ia2q.mp3` | Alongue o corpo antes e depois de se mexer. | dicas/atividade-fisica |
| `02wa86s.mp3` | Brincar ao ar livre faz bem para o corpo. | dicas/atividade-fisica |
| `0tay83f.mp3` | E faz bem para a cabeça também. | dicas/atividade-fisica |
| `0ccdb02.mp3` | Quem se movimenta, se cuida! | dicas/atividade-fisica |
| `1sn3rlc.mp3` | Tome banho todos os dias. O corpo agradece. | dicas/higiene |
| `1ue9901.mp3` | Lave as mãos antes de comer. | dicas/higiene |
| `0w7417p.mp3` | E depois de usar o banheiro também. | dicas/higiene |
| `0g4febm.mp3` | Escove os dentes três vezes por dia. | dicas/higiene |
| `1hmuvvc.mp3` | Corte as unhas e lave o cabelo com frequência. | dicas/higiene |
| `0teqe58.mp3` | Dormir bem ajuda a crescer e a aprender. | dicas/sono |
| `0y2bnvr.mp3` | Desligue as telas antes de deitar. Elas atrapalham o sono. | dicas/sono |
| `1662fux.mp3` | Tenha uma hora para dormir e uma para acordar. | dicas/sono |
| `167qp4f.mp3` | O corpo avisa quando está cansado. Escute ele! | dicas/sono |
| `0bz2taj.mp3` | Seja bem-vindo! Digite o seu nome. | interface |

### `pergunta` — 43 falas, 1.661 caracteres

**Curiosa, subindo no fim. Deixe a criança querer responder.**

| Stability | Style |
| --- | --- |
| **0.45** | **0.35** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `14gyjvn.mp3` | O que usamos para tomar banho? | ano1-s2-jogo-de-escolhas/banho |
| `1r0nc7k.mp3` | De quanto em quanto tempo devemos tomar banho? | ano1-s2-jogo-de-escolhas/banho-quando |
| `020b7ph.mp3` | O que usamos para lavar o cabelo? | ano1-s2-jogo-de-escolhas/cabelo |
| `0x35aa8.mp3` | Quais destes cuidados deixam o corpo saudável? | ano1-s2-jogo-de-escolhas/cuidados |
| `0ocu1of.mp3` | A escova de dentes pode ser dividida com o amigo? | ano1-s2-jogo-de-escolhas/escova-de-quem |
| `01uue0e.mp3` | Quantas vezes por dia devemos escovar os dentes? | ano1-s2-jogo-de-escolhas/escovar-quantas |
| `0wixa7w.mp3` | Quando precisamos lavar as mãos? | ano1-s2-jogo-de-escolhas/lavar-maos |
| `1lm4it1.mp3` | O que fazemos com as unhas para cuidar do corpo? | ano1-s2-jogo-de-escolhas/unhas |
| `1lxlu2k.mp3` | O que acontece com o coração quando a gente se movimenta? | ano2-s2-movimente-se/beneficio-coracao |
| `1ogf3xx.mp3` | O que a atividade física faz pelo nosso corpo? | ano2-s2-movimente-se/beneficios |
| `17ih8vh.mp3` | Quais brincadeiras são atividade física? | ano2-s2-movimente-se/brincadeiras |
| `14cruu4.mp3` | O que fica mais forte quando nos movimentamos? | ano2-s2-movimente-se/musculos |
| `0q4c0cu.mp3` | Quais destas atividades fazem o corpo se movimentar? | ano2-s2-movimente-se/quais-movimentam |
| `124ugg1.mp3` | Quanto tempo por dia uma criança precisa se movimentar? | ano2-s2-movimente-se/quanto-tempo |
| `1mb5av0.mp3` | E andar de bicicleta? | ano2-s3-equilibrista-mirim/bicicleta |
| `0oh1yrl.mp3` | E ficar deitado na cama? | ano2-s3-equilibrista-mirim/deitado |
| `0etnips.mp3` | E subir uma escada? | ano2-s3-equilibrista-mirim/escada |
| `16pbwzy.mp3` | E descer no escorregador sentado? | ano2-s3-equilibrista-mirim/escorregar |
| `1b6rj0t.mp3` | Andar em cima de uma linha exige equilíbrio? | ano2-s3-equilibrista-mirim/linha |
| `091pcvo.mp3` | E andar na ponta dos pés? | ano2-s3-equilibrista-mirim/na-ponta |
| `1m2bbi2.mp3` | E ficar sentado na cadeira? | ano2-s3-equilibrista-mirim/sentado |
| `0tsoq0n.mp3` | E ficar em um pé só? | ano2-s3-equilibrista-mirim/um-pe |
| `1uaucl1.mp3` | Qual bebida mata a sede sem nenhum açúcar? | ano3-s1-agua-em-jogo/melhor-bebida |
| `1f8aas9.mp3` | O que a água faz dentro de você? | ano3-s1-agua-em-jogo/o-que-faz |
| `1scilom.mp3` | Quando o corpo perde mais água? | ano3-s1-agua-em-jogo/quando-perde |
| `1wtrusa.mp3` | Quanto do seu corpo é feito de água? | ano3-s1-agua-em-jogo/quanto-de-agua |
| `1grigeu.mp3` | Quantos copos de água uma criança precisa por dia? | ano3-s1-agua-em-jogo/quantos-copos |
| `141gig3.mp3` | O que ajuda a pegar no sono? | ano3-s2-trilha-do-sono/antes-de-dormir |
| `1czejo9.mp3` | O que acontece quando você dorme pouco? | ano3-s2-trilha-do-sono/dormir-pouco |
| `19glael.mp3` | O que fazer antes de deitar? | ano3-s2-trilha-do-sono/escovar |
| `0xepz4u.mp3` | Quantas horas uma criança precisa dormir? | ano3-s2-trilha-do-sono/quantas-horas |
| `0vrypd3.mp3` | Como o quarto ajuda a dormir melhor? | ano3-s2-trilha-do-sono/quarto |
| `0z9pdxj.mp3` | Qual é o sinal de que o corpo está pedindo sono? | ano3-s2-trilha-do-sono/sinal-de-sono |
| `0elxsn9.mp3` | O que fazer antes de uma corrida? | ano4-s3-missao-corpo-e-movimento/antes-de-correr |
| `06tas3g.mp3` | O que conta como se mexer? | ano4-s3-missao-corpo-e-movimento/conta-como-movimento |
| `0530n6z.mp3` | O que acontece com o coração quando você corre? | ano4-s3-missao-corpo-e-movimento/coracao |
| `1dm3930.mp3` | Quanto tempo por dia uma criança precisa se mexer? | ano4-s3-missao-corpo-e-movimento/quanto-por-dia |
| `0yy5z3m.mp3` | O que o corpo sente quando fica sentado tempo demais? | ano4-s3-missao-corpo-e-movimento/sentado-demais |
| `0qbbxga.mp3` | Um colega faz piada com o corpo de outro. O que fazer? | ano5-s1-corpos-do-mundo/apelido |
| `1bxwowt.mp3` | Existe um tipo de corpo certo? | ano5-s1-corpos-do-mundo/corpo-certo |
| `0rqjq8b.mp3` | O que mostra que alguém cuida do próprio corpo? | ano5-s1-corpos-do-mundo/cuidar |
| `0vctie8.mp3` | O que faz um corpo ser diferente do outro? | ano5-s1-corpos-do-mundo/o-que-muda |
| `1ppl0oe.mp3` | Quem pode praticar esporte? | ano5-s1-corpos-do-mundo/todos-podem |

### `comemoracao` — 47 falas, 933 caracteres

**Animada de verdade, sorrindo. Esta é a hora de vibrar.**

| Stability | Style |
| --- | --- |
| **0.3** | **0.6** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `0nnylc0.mp3` | Cabeça | ano1-s1-monte-o-corpo/peça |
| `0cnu72w.mp3` | Tronco | ano1-s1-monte-o-corpo/peça |
| `034u7me.mp3` | Braço direito | ano1-s1-monte-o-corpo/peça |
| `0lot7ia.mp3` | Braço esquerdo | ano1-s1-monte-o-corpo/peça |
| `1xa6s1z.mp3` | Perna direita | ano1-s1-monte-o-corpo/peça |
| `1kmcqyl.mp3` | Perna esquerda | ano1-s1-monte-o-corpo/peça |
| `0b1o7fw.mp3` | Alegria | ano1-s3-como-me-sinto/peça |
| `0xpfgb5.mp3` | Tristeza | ano1-s3-como-me-sinto/peça |
| `01v2ngi.mp3` | Medo | ano1-s3-como-me-sinto/peça |
| `05qlbn2.mp3` | Raiva | ano1-s3-como-me-sinto/peça |
| `05vxot0.mp3` | Choro | ano1-s3-como-me-sinto/peça |
| `0fwfqlm.mp3` | Surpresa | ano1-s3-como-me-sinto/peça |
| `10x5kdp.mp3` | Sério | ano1-s3-como-me-sinto/peça |
| `15y7wqx.mp3` | Espanto | ano1-s3-como-me-sinto/peça |
| `1fbvx9i.mp3` | Vamos falar de comida! | dicas/alimentacao |
| `03g8sq1.mp3` | Vamos falar de movimento! | dicas/atividade-fisica |
| `07hg00y.mp3` | Vamos falar de higiene! | dicas/higiene |
| `1cm2iko.mp3` | Vamos falar de sono! | dicas/sono |
| `1fcgf9c.mp3` | Saúde em jogo! | interface |
| `0je24vz.mp3` | Isso mesmo! | interface |
| `15jivpn.mp3` | Muito bem! Você ganhou 1 estrela. | interface |
| `0the2pb.mp3` | Muito bem! Você ganhou 2 estrelas. | interface |
| `030oxqw.mp3` | Muito bem! Você ganhou 3 estrelas. | interface |
| `04jxfs3.mp3` | Você ganhou Arco-íris! | recompensa/arco-iris |
| `1fdlw5h.mp3` | Você tirou Arco-íris de novo! | recompensa/arco-iris/repetida |
| `10qyoug.mp3` | Você ganhou Coração! | recompensa/coracao |
| `0pyu17q.mp3` | Você tirou Coração de novo! | recompensa/coracao/repetida |
| `09qkp5k.mp3` | Você ganhou Corda de pular! | recompensa/corda |
| `0c6injs.mp3` | Você tirou Corda de pular de novo! | recompensa/corda/repetida |
| `01khvn5.mp3` | Você ganhou Escova de dentes! | recompensa/escova |
| `1d6e9jt.mp3` | Você tirou Escova de dentes de novo! | recompensa/escova/repetida |
| `1bznyvg.mp3` | Você ganhou Estrela! | recompensa/estrela |
| `17cj482.mp3` | Você tirou Estrela de novo! | recompensa/estrela/repetida |
| `0d00bzm.mp3` | Você ganhou Gota de água! | recompensa/gota |
| `0k096rm.mp3` | Você tirou Gota de água de novo! | recompensa/gota/repetida |
| `0022jyg.mp3` | Você ganhou Lua do bom sono! | recompensa/lua |
| `1pvvpuq.mp3` | Você tirou Lua do bom sono de novo! | recompensa/lua/repetida |
| `0iscdvw.mp3` | Você ganhou Maçã! | recompensa/maca |
| `1of5stk.mp3` | Você tirou Maçã de novo! | recompensa/maca/repetida |
| `19hru8n.mp3` | Você ganhou Força! | recompensa/musculo |
| `13u0p9p.mp3` | Você tirou Força de novo! | recompensa/musculo/repetida |
| `1lg1828.mp3` | Você ganhou Sol! | recompensa/sol |
| `0a8wole.mp3` | Você tirou Sol de novo! | recompensa/sol/repetida |
| `0dmbfx2.mp3` | Você ganhou Tênis! | recompensa/tenis |
| `0whrb68.mp3` | Você tirou Tênis de novo! | recompensa/tenis/repetida |
| `0xkz2wb.mp3` | Você ganhou Troféu! | recompensa/trofeu |
| `0mi9yt3.mp3` | Você tirou Troféu de novo! | recompensa/trofeu/repetida |

### `consolo` — 1 fala, 18 caracteres

**Acolhedora e leve, nunca de pena. Erro aqui não é problema.**

| Stability | Style |
| --- | --- |
| **0.6** | **0.3** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `0qycl0j.mp3` | Tente outro lugar. | interface |

### `convite-movimento` — 80 falas, 5.205 caracteres

**Energia para cima, chamando para o movimento.**

| Stability | Style |
| --- | --- |
| **0.35** | **0.55** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `1kwgea5.mp3` | Toque a cabeça. Coloque as duas mãos na sua cabeça. | ano1-s1-monte-o-corpo/movimento |
| `1ow3hw6.mp3` | Abrace o tronco. Cruze os braços e abrace o seu tronco. | ano1-s1-monte-o-corpo/movimento |
| `1b4t7gh.mp3` | Mexa os braços. Estique os dois braços para os lados e balance. | ano1-s1-monte-o-corpo/movimento |
| `1cztwsd.mp3` | Mexa as pernas. Marche no lugar levantando bem os joelhos. | ano1-s1-monte-o-corpo/movimento |
| `0w271f4.mp3` | Faça alegria. Sorria bem grande e levante os braços. | ano1-s3-como-me-sinto/movimento |
| `0lmmbms.mp3` | Faça surpresa. Abra bem a boca e arregale os olhos. | ano1-s3-como-me-sinto/movimento |
| `15k9akp.mp3` | Faça tristeza. Abaixe os ombros e faça um bico. | ano1-s3-como-me-sinto/movimento |
| `0dn2ln7.mp3` | Volte à calma. Respire fundo três vezes e solte o corpo. | ano1-s3-como-me-sinto/movimento |
| `1t5441e.mp3` | Pular. Pule no lugar com os dois pés juntos. | ano1-s4-corpo-que-danca/movimento |
| `0uojfrj.mp3` | Girar. Dê uma voltinha devagar, de braços abertos. | ano1-s4-corpo-que-danca/movimento |
| `18yk1jm.mp3` | Esticar os braços. Estique os dois braços bem alto, como se fosse tocar o céu. | ano1-s4-corpo-que-danca/movimento |
| `1tyw60n.mp3` | Levantar. Fique na ponta dos pés e cresça bem alto. | ano1-s4-corpo-que-danca/movimento |
| `1jbeuo8.mp3` | Abaixar. Agache devagar e fique pequenininho. | ano1-s4-corpo-que-danca/movimento |
| `02tmtyo.mp3` | Peça silêncio. Faça o gesto de silêncio para um colega. | ano2-s1-corpo-que-fala/movimento |
| `0rhzyr7.mp3` | Diga sim e não. Use só a cabeça. Primeiro sim, depois não. | ano2-s1-corpo-que-fala/movimento |
| `03e0faz.mp3` | Comemore. Bata palmas e levante os braços! | ano2-s1-corpo-que-fala/movimento |
| `17k5qev.mp3` | Um pé só. Fique em um pé só. Segure o máximo que conseguir! | ano2-s3-equilibrista-mirim/movimento |
| `1g25uan.mp3` | Careta em um pé só. Continue em um pé só. Faça a careta mais engraçada que souber. | ano2-s3-equilibrista-mirim/movimento |
| `0x7auuu.mp3` | Palmas em um pé só. Ainda em um pé só, bata palmas sem cair. | ano2-s3-equilibrista-mirim/movimento |
| `1f0rbjo.mp3` | Rodadinha em um pé só. Dê uma voltinha devagar apoiado em um pé só. | ano2-s3-equilibrista-mirim/movimento |
| `0cu4cmf.mp3` | Troque o pé!. Agora repita tudo apoiado no outro pé. | ano2-s3-equilibrista-mirim/movimento |
| `0bvmlav.mp3` | Borboleta. Sente com as solas dos pés juntas e balance os joelhos devagar. | ano2-s4-roleta-alongamentos/borboleta |
| `1fa3hjh.mp3` | Braços para o alto. Estique os dois braços bem alto e cresça o máximo que conseguir. | ano2-s4-roleta-alongamentos/bracos-alto |
| `0l6bhco.mp3` | Frente da coxa. Em pé, dobre uma perna para trás e segure o pé. Troque de perna. | ano2-s4-roleta-alongamentos/coxa |
| `0t8458j.mp3` | Gatinho. De quatro apoios, arredonde as costas para cima e depois abaixe devagar. | ano2-s4-roleta-alongamentos/gato |
| `09rhuz9.mp3` | Lateral do corpo. Levante um braço e incline o corpo para o lado contrário. Troque. | ano2-s4-roleta-alongamentos/lateral |
| `1pxpn79.mp3` | Mãos e punhos. Abra e feche as mãos. Depois gire os punhos para os dois lados. | ano2-s4-roleta-alongamentos/maos |
| `1fsmu3j.mp3` | Ombro. Passe um braço na frente do peito e puxe com o outro. Troque o lado. | ano2-s4-roleta-alongamentos/ombro |
| `19c7djl.mp3` | Panturrilha. Apoie as mãos na parede. Estique uma perna para trás. Deixe o calcanhar no chão. | ano2-s4-roleta-alongamentos/panturrilha |
| `1edlqah.mp3` | Atrás da perna. Sente no chão com as pernas esticadas. Tente alcançar a ponta dos pés sem forçar. | ano2-s4-roleta-alongamentos/perna-tras |
| `14tny9w.mp3` | Pescoço. Incline a cabeça para o ombro direito, depois para o esquerdo. Bem devagar. | ano2-s4-roleta-alongamentos/pescoco |
| `0j9fv7p.mp3` | Tronco. Fixe os pés no chão. Gire o tronco devagar para os dois lados. | ano2-s4-roleta-alongamentos/tronco, movimento/alongamentos/movimento |
| `1vk5xca.mp3` | Corra no lugar. Corra parado levantando bem os joelhos. | ano3-s1-agua-em-jogo/movimento |
| `0n1me5m.mp3` | Polichinelo. Abra e feche as pernas batendo palma em cima. | ano3-s1-agua-em-jogo/movimento |
| `0v78szh.mp3` | Beba água. Pegue sua garrafa e beba alguns goles devagar. | ano3-s1-agua-em-jogo/movimento |
| `1cm9zu8.mp3` | Solte o pescoço. Incline a cabeça para um ombro, depois para o outro. Bem devagar. | ano3-s2-trilha-do-sono/movimento |
| `10zbbhm.mp3` | Estique o corpo. Estique os braços para cima e depois solte tudo, mole. | ano3-s2-trilha-do-sono/movimento |
| `1ffkclu.mp3` | Chute no ar. Chute devagar com uma perna, depois com a outra. | ano3-s3-tipos-de-esporte/movimento |
| `0mdix8g.mp3` | Arremesse no ar. Levante os dois braços. Faça o gesto de jogar a bola na cesta. | ano3-s3-tipos-de-esporte/movimento |
| `0p0ns25.mp3` | Nade parado. Gire os braços para a frente como quem nada crawl. | ano3-s3-tipos-de-esporte/movimento |
| `1kgar01.mp3` | Corra no lugar. Corra parado por um pouquinho, bem rápido no fim. | ano3-s3-tipos-de-esporte/movimento |
| `18wnxrx.mp3` | Ande pela sala. Levante e dê uma volta andando, sem pressa nenhuma. | ano3-s4-classificacao-corporal/movimento |
| `12zdbqe.mp3` | Dez agachamentos. Agache e levante dez vezes, contando alto. | ano3-s4-classificacao-corporal/movimento |
| `1ozgha9.mp3` | Marche. Marche no lugar levantando bem os joelhos. | ano4-s1-prato-colorido/movimento |
| `1od0prx.mp3` | Pule. Dez pulinhos com os dois pés juntos. | ano4-s1-prato-colorido/movimento |
| `15us8oz.mp3` | Estique. Estique os braços para cima e cresça bem alto. | ano4-s1-prato-colorido/movimento |
| `0av2exo.mp3` | Ande. Dê uma volta andando pela sala, sem correr. | ano4-s2-super-lanche/movimento |
| `1b0xqtk.mp3` | Gire o tronco. Com os pés firmes, gire o tronco para os dois lados. | ano4-s2-super-lanche/movimento |
| `151x85s.mp3` | Aqueça. Marche no lugar e gire os braços para a frente. | ano4-s3-missao-corpo-e-movimento/movimento |
| `1bxhlyj.mp3` | Corrida parada. Corra no lugar levantando bem os joelhos. | ano4-s3-missao-corpo-e-movimento/movimento |
| `1c5ecud.mp3` | Salto. Dez pulos com os dois pés juntos, como se pulasse corda. | ano4-s3-missao-corpo-e-movimento/movimento |
| `14r06hu.mp3` | Equilíbrio. Fique num pé só. Troque de pé na metade. | ano4-s3-missao-corpo-e-movimento/movimento |
| `1c6uvrk.mp3` | Volte à calma. Ande devagar e respire fundo três vezes. | ano4-s3-missao-corpo-e-movimento/movimento |
| `07zu4ur.mp3` | Corra no lugar. Corra parado por um tempinho. | ano4-s4-dia-ativo-saudavel/movimento |
| `0sm4w2d.mp3` | Pule como na amarelinha. Pule num pé só, depois nos dois. Repita. | ano4-s4-dia-ativo-saudavel/movimento |
| `16n3srn.mp3` | Alongue as pernas. Estique uma perna para trás e segure. Troque o lado. | ano4-s4-dia-ativo-saudavel/movimento |
| `0e4vfz2.mp3` | Estique o lado. Levante um braço e incline o corpo para o lado. Troque. | ano5-s1-corpos-do-mundo/movimento |
| `077ojq5.mp3` | Fique num pé. Fique num pé só o tempo que conseguir. Pode se apoiar. | ano5-s1-corpos-do-mundo/movimento |
| `09eonfr.mp3` | Olhe longe. Procure a coisa mais distante da sala e olhe para ela. | ano5-s2-digital-saude/movimento |
| `1meha3n.mp3` | Solte o pescoço. Incline a cabeça para um ombro e depois para o outro. | ano5-s2-digital-saude/movimento |
| `1x9h9dx.mp3` | Levante e ande. Levante da cadeira e dê uma volta pela sala. | ano5-s2-digital-saude/movimento |
| `1si00c3.mp3` | Agache para pegar. Agache dobrando os joelhos, como quem pega algo do chão. Dez vezes. | ano5-s3-missao-ambiente-saudavel/movimento |
| `1iv7ow0.mp3` | Guarde no alto. Estique os braços para cima como quem guarda na prateleira. | ano5-s3-missao-ambiente-saudavel/movimento |
| `0e5hiol.mp3` | Ande carregando. Ande pela sala com os braços para a frente. Faça de conta que leva uma caixa. | ano5-s3-missao-ambiente-saudavel/movimento |
| `0t9gpp5.mp3` | Aquecimento. Marche no lugar. Gire os braços para a frente e para trás. | ano5-s4-corpo-em-acao/movimento |
| `1nrwev8.mp3` | Corrida parada. Corra no lugar levantando os joelhos até a altura da cintura. | ano5-s4-corpo-em-acao/movimento |
| `19d2twa.mp3` | Polichinelo. Abra e feche as pernas batendo as mãos acima da cabeça. | ano5-s4-corpo-em-acao/movimento |
| `1wuu1cz.mp3` | Agachamento. Agache até onde der e volte. Costas retas, joelho na direção do pé. | ano5-s4-corpo-em-acao/movimento |
| `1vvv8dm.mp3` | Equilíbrio. Fique num pé só, braços abertos. Troque de pé na metade. | ano5-s4-corpo-em-acao/movimento |
| `1mpoiun.mp3` | Alongamento. Estique uma perna para trás e segure. Depois a outra. | ano5-s4-corpo-em-acao/movimento |
| `0can80d.mp3` | Volta à calma. Ande devagar e respire fundo. Sinta o coração ir desacelerando. | ano5-s4-corpo-em-acao/movimento |
| `1x8afrs.mp3` | Pescoço. Incline a cabeça para um lado e depois para o outro. | movimento/alongamentos/movimento |
| `1o9yjr2.mp3` | Braços para cima. Estique os dois braços bem alto, como se fosse pegar o teto. | movimento/alongamentos/movimento |
| `0qc3e3p.mp3` | Ombros. Puxe um braço na frente do peito com a ajuda do outro. Troque o lado. | movimento/alongamentos/movimento |
| `1ixy2zp.mp3` | Atrás da perna. Tente encostar as mãos na ponta dos pés. Nada de forçar. | movimento/alongamentos/movimento |
| `0gdxmat.mp3` | Marchar no lugar. Levante bem os joelhos, um de cada vez. | movimento/movimentos/movimento |
| `0m1er0c.mp3` | Pular. Pule com os dois pés juntos, sem sair do lugar. | movimento/movimentos/movimento |
| `0zl2msi.mp3` | Equilibrar. Fique em um pé só. Depois troque o pé. | movimento/movimentos/movimento |
| `0sfl0et.mp3` | Girar. Dê uma volta devagar para um lado e outra para o outro. | movimento/movimentos/movimento |
| `05joa5n.mp3` | Agachar e levantar. Agache como se fosse sentar numa cadeira e volte devagar. | movimento/movimentos/movimento |

### `curiosidade` — 111 falas, 7.031 caracteres

**Tom de quem conta uma descoberta boa. Um pouco mais devagar.**

| Stability | Style |
| --- | --- |
| **0.5** | **0.35** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `1hu6sh4.mp3` | Banho todo dia tira o suor e a sujeira do corpo. | ano1-s2-jogo-de-escolhas/banho-quando/explicação |
| `1340vdi.mp3` | Sabonete e água limpam o corpo e tiram os germes. | ano1-s2-jogo-de-escolhas/banho/explicação |
| `1cobo4e.mp3` | O xampu limpa o cabelo e o couro cabeludo. | ano1-s2-jogo-de-escolhas/cabelo/explicação |
| `1k43776.mp3` | Cuidar do corpo é um hábito de todo dia. | ano1-s2-jogo-de-escolhas/cuidados/explicação |
| `0w7sibj.mp3` | Cada pessoa tem a sua escova. Dividir passa germes de uma boca para a outra. | ano1-s2-jogo-de-escolhas/escova-de-quem/explicação |
| `0svtf66.mp3` | Escove depois de cada refeição. São pelo menos 3 vezes por dia. | ano1-s2-jogo-de-escolhas/escovar-quantas/explicação |
| `1o0nsow.mp3` | Mãos limpas evitam que os germes entrem no nosso corpo. | ano1-s2-jogo-de-escolhas/lavar-maos/explicação |
| `0y1udgt.mp3` | Unhas grandes guardam sujeira embaixo. Cortadas e limpas é melhor. | ano1-s2-jogo-de-escolhas/unhas/explicação |
| `0wuie9x.mp3` | Palmas comemoram e elogiam alguém. | ano2-s1-corpo-que-fala/aplauso/par |
| `19sqbte.mp3` | O polegar para cima diz que está tudo certo. | ano2-s1-corpo-que-fala/bem/par |
| `1tghfgr.mp3` | O polegar para baixo mostra que algo não está legal. | ano2-s1-corpo-que-fala/mal/par |
| `1v61mho.mp3` | Para os lados, a cabeça está dizendo não. | ano2-s1-corpo-que-fala/nao/par |
| `1fgul2f.mp3` | A mão aberta na frente do corpo pede para parar. | ano2-s1-corpo-que-fala/pare/par |
| `0i6g8m8.mp3` | O dedo na boca pede silêncio sem usar nenhuma palavra. | ano2-s1-corpo-que-fala/silencio/par |
| `0b19a2r.mp3` | A cabeça também responde. Para cima e para baixo é sim. | ano2-s1-corpo-que-fala/sim/par |
| `0pcfviu.mp3` | Acenar com a mão é dizer oi ou tchau. | ano2-s1-corpo-que-fala/tchau/par |
| `0saif9j.mp3` | O coração é um músculo. Quanto mais você se movimenta, mais forte ele fica. | ano2-s2-movimente-se/beneficio-coracao/explicação |
| `1ejrkgp.mp3` | Movimento dá energia e melhora o sono. E ainda deixa a gente mais feliz. | ano2-s2-movimente-se/beneficios/explicação |
| `15yeklc.mp3` | Brincar correndo, pulando ou pedalando também é atividade física. | ano2-s2-movimente-se/brincadeiras/explicação |
| `1thae9b.mp3` | Movimento deixa músculos e ossos mais fortes. Por isso criança precisa se mexer. | ano2-s2-movimente-se/musculos/explicação |
| `0dxe3wm.mp3` | Correr, nadar e pular corda colocam o corpo inteiro em movimento. | ano2-s2-movimente-se/quais-movimentam/explicação |
| `1aq95gy.mp3` | O certo é pelo menos 1 hora de movimento por dia. E brincar já conta! | ano2-s2-movimente-se/quanto-tempo/explicação |
| `1s6j5c5.mp3` | Muito! Foi por isso que aprender a pedalar deu tanto trabalho no começo. | ano2-s3-equilibrista-mirim/bicicleta/explicação |
| `0nzkyli.mp3` | Deitado o corpo está todo apoiado. Não precisa de equilíbrio. | ano2-s3-equilibrista-mirim/deitado/explicação |
| `0v3r0en.mp3` | Sim! A cada degrau o corpo fica um instante em um pé só. | ano2-s3-equilibrista-mirim/escada/explicação |
| `1w6mr83.mp3` | Sentado no escorregador o corpo está apoiado e só desliza. | ano2-s3-equilibrista-mirim/escorregar/explicação |
| `1cd022g.mp3` | Sim! O corpo se ajusta o tempo todo para não cair. | ano2-s3-equilibrista-mirim/linha/explicação |
| `0g0cyi9.mp3` | Sim! Quanto menor o apoio no chão, mais equilíbrio o corpo precisa. | ano2-s3-equilibrista-mirim/na-ponta/explicação |
| `03p6vn5.mp3` | Sentado a cadeira segura o corpo, então o equilíbrio descansa. | ano2-s3-equilibrista-mirim/sentado/explicação |
| `0f250uq.mp3` | Muito! Com um apoio só, o corpo trabalha mais para ficar firme. | ano2-s3-equilibrista-mirim/um-pe/explicação |
| `14h9fee.mp3` | Água pura mata a sede na hora. As outras bebidas alimentam, mas não substituem a água. | ano3-s1-agua-em-jogo/melhor-bebida/explicação |
| `0gla4o4.mp3` | A água refresca, ajuda a digestão e limpa o corpo por dentro. | ano3-s1-agua-em-jogo/o-que-faz/explicação |
| `0zblfmi.mp3` | O suor é água saindo para refrescar você. Depois de correr, o corpo pede água de volta. | ano3-s1-agua-em-jogo/quando-perde/explicação |
| `055t1ke.mp3` | Mais da metade do seu corpo é água. Por isso ela faz tanta falta. | ano3-s1-agua-em-jogo/quanto-de-agua/explicação |
| `0jz3s6i.mp3` | Seis a oito copos por dia. E mais ainda nos dias de calor ou de muito movimento. | ano3-s1-agua-em-jogo/quantos-copos/explicação |
| `0v07djv.mp3` | A luz da tela engana o cérebro e atrasa o sono. Um livro faz o contrário. | ano3-s2-trilha-do-sono/antes-de-dormir/explicação |
| `087rbls.mp3` | Noite curta cobra o preço no outro dia inteiro. | ano3-s2-trilha-do-sono/dormir-pouco/explicação |
| `1g33u6c.mp3` | A escovação da noite é a mais importante. A boca fica muitas horas fechada até de manhã. | ano3-s2-trilha-do-sono/escovar/explicação |
| `1oc2s2u.mp3` | De nove a onze horas por noite. É dormindo que o corpo cresce e guarda o que você aprendeu. | ano3-s2-trilha-do-sono/quantas-horas/explicação |
| `12m98sx.mp3` | Escuro, quieto e arrumado. O corpo entende que chegou a hora. | ano3-s2-trilha-do-sono/quarto/explicação |
| `1y9qk7k.mp3` | O bocejo é o corpo avisando. Quando ele avisa, vale ir para a cama. | ano3-s2-trilha-do-sono/sinal-de-sono/explicação |
| `0r3bzoi.mp3` | O atletismo é correr, saltar e lançar. É o esporte mais antigo que existe. | ano3-s3-tipos-de-esporte/atletismo/par |
| `111gw56.mp3` | No basquete o gesto é arremessar. Os braços empurram a bola para o alto. | ano3-s3-tipos-de-esporte/basquete/par |
| `0kbgmbe.mp3` | No ciclismo as pernas giram sem parar. É a perna que faz a bicicleta andar. | ano3-s3-tipos-de-esporte/ciclismo/par |
| `1g61chd.mp3` | No futebol o gesto principal é chutar. A perna manda na bola. | ano3-s3-tipos-de-esporte/futebol/par |
| `1khnnsr.mp3` | Na natação braços e pernas trabalham juntos para empurrar a água. | ano3-s3-tipos-de-esporte/natacao/par |
| `1rqky86.mp3` | No vôlei o saque começa o ponto. A mão bate na bola com força. | ano3-s3-tipos-de-esporte/volei/par |
| `0obxjq6.mp3` | Subir escada é atividade física. Acontece no meio do dia, sem ninguém marcar. | ano3-s4-classificacao-corporal/peça |
| `1olpm25.mp3` | Brincadeira é atividade física. Você corre muito sem estar treinando. | ano3-s4-classificacao-corporal/peça |
| `0ja0z11.mp3` | Ir a pé é atividade física. O corpo se mexe porque a vida pede. | ano3-s4-classificacao-corporal/peça |
| `0qi0osi.mp3` | Até arrumar a cama é atividade física. Toda tarefa da casa move o corpo. | ano3-s4-classificacao-corporal/peça |
| `0fy04wb.mp3` | Treino de natação é exercício físico. Tem hora, tem professor e tem repetição. | ano3-s4-classificacao-corporal/peça |
| `12ddfvk.mp3` | A aula de futsal é exercício físico. Alguém planejou o que fazer e por quanto tempo. | ano3-s4-classificacao-corporal/peça |
| `0z66gw9.mp3` | Contando séries vira exercício físico. O objetivo é melhorar, não só brincar. | ano3-s4-classificacao-corporal/peça |
| `1709btp.mp3` | Treino de ciclismo é exercício físico. Tem distância combinada e tem repetição. | ano3-s4-classificacao-corporal/peça |
| `1jsct93.mp3` | Folha verde no prato todo dia. É fibra e vitamina. | ano4-s1-prato-colorido/peça |
| `1gk0dt0.mp3` | Cenoura é do grupo das verduras. A cor laranja avisa que tem vitamina A. | ano4-s1-prato-colorido/peça |
| `0h9zbfz.mp3` | Brócolis tem fibra e ferro. Quanto mais cor no prato, melhor. | ano4-s1-prato-colorido/peça |
| `04kz0nt.mp3` | Fruta entra no mesmo grupo das verduras. Vale como sobremesa também. | ano4-s1-prato-colorido/peça |
| `1qiqbxc.mp3` | Arroz é energia. É o combustível para brincar e prestar atenção na aula. | ano4-s1-prato-colorido/peça |
| `0box6o8.mp3` | Pão também é energia. Integral dura mais tempo no corpo. | ano4-s1-prato-colorido/peça |
| `04w2k9q.mp3` | Feijão constrói o corpo. Com arroz, forma uma dupla completa. | ano4-s1-prato-colorido/peça |
| `1o0tcnb.mp3` | Ovo é proteína pura. Constrói músculo, cabelo e pele. | ano4-s1-prato-colorido/peça |
| `1k0pbkw.mp3` | Carne é do grupo da construção. Ajuda o corpo a crescer. | ano4-s1-prato-colorido/peça |
| `0zb0s2s.mp3` | Leite constrói osso forte. Tem cálcio. | ano4-s1-prato-colorido/peça |
| `0dgrwxn.mp3` | Chocolate é para de vez em quando. Dá energia rápida e passa rápido. | ano4-s1-prato-colorido/peça |
| `0tirqtk.mp3` | Salgadinho tem muito sal e pouca coisa boa. Fica fora do dia a dia. | ano4-s1-prato-colorido/peça |
| `0s3fqfb.mp3` | Fruta inteira tem fibra. A fibra segura a fome por mais tempo. | ano4-s2-super-lanche/peça |
| `1aa4w7e.mp3` | Banana é lanche de bolso. Energia e potássio para o recreio. | ano4-s2-super-lanche/peça |
| `1kuaba7.mp3` | Pão sustenta até a próxima refeição. Melhor ainda com ovo ou queijo. | ano4-s2-super-lanche/peça |
| `0hkylaj.mp3` | Leite tem cálcio e proteína. Acompanha bem qualquer lanche. | ano4-s2-super-lanche/peça |
| `1e7dw5v.mp3` | Água é a bebida do dia a dia. Mata a sede sem nenhum açúcar. | ano4-s2-super-lanche/peça |
| `139wx3g.mp3` | Uva é doce de verdade, do jeito que veio da planta. | ano4-s2-super-lanche/peça |
| `06dr8ag.mp3` | Chocolate é de vez em quando. O açúcar dá um pique curto e depois some. | ano4-s2-super-lanche/peça |
| `1m1tctw.mp3` | Salgadinho é sal e gordura. Enche a boca e não alimenta. | ano4-s2-super-lanche/peça |
| `1uvn7qy.mp3` | Suco de caixinha tem açúcar de sobra. A fruta inteira é melhor. | ano4-s2-super-lanche/peça |
| `1020vp4.mp3` | Aquecer avisa o músculo que o movimento vem. Assim ele não se machuca. | ano4-s3-missao-corpo-e-movimento/antes-de-correr/explicação |
| `12rqdh0.mp3` | Vale tudo que tira você da cadeira. Assistir não conta. Quem se mexe é o jogador. | ano4-s3-missao-corpo-e-movimento/conta-como-movimento/explicação |
| `04hom2q.mp3` | O coração é um músculo. Quanto mais você corre, mais forte ele fica. | ano4-s3-missao-corpo-e-movimento/coracao/explicação |
| `09d4p21.mp3` | Uma hora por dia, somando tudo. Recreio, brincadeira e caminho da escola contam. | ano4-s3-missao-corpo-e-movimento/quanto-por-dia/explicação |
| `182sq2y.mp3` | Corpo parado enferruja. De hora em hora vale levantar e dar uma volta. | ano4-s3-missao-corpo-e-movimento/sentado-demais/explicação |
| `0ecac9k.mp3` | Acordar sempre na mesma hora deixa o corpo com o relógio certo. | ano4-s4-dia-ativo-saudavel/peça |
| `160hljt.mp3` | Café da manhã liga o corpo. Sem ele a aula fica mais difícil. | ano4-s4-dia-ativo-saudavel/peça |
| `0bxwqxd.mp3` | Se der para ir a pé, melhor ainda. Já conta como movimento. | ano4-s4-dia-ativo-saudavel/peça |
| `1mvbc18.mp3` | Almoço com arroz, feijão, carne e verdura sustenta a tarde inteira. | ano4-s4-dia-ativo-saudavel/peça |
| `08oydyo.mp3` | Água ao longo do dia, sem esperar a sede chegar. | ano4-s4-dia-ativo-saudavel/peça |
| `03jqxja.mp3` | A tarde é a melhor hora de se mexer. Uma hora por dia, somando tudo. | ano4-s4-dia-ativo-saudavel/peça |
| `1wbuatu.mp3` | Ler também descansa. Descanso não é só ficar deitado. | ano4-s4-dia-ativo-saudavel/peça |
| `1i5hc84.mp3` | A escovação da noite é a mais importante do dia. | ano4-s4-dia-ativo-saudavel/peça |
| `0yhv3c0.mp3` | Dormir cedo fecha o dia. É de noite que o corpo cresce. | ano4-s4-dia-ativo-saudavel/peça |
| `1ir52wj.mp3` | Piada sobre o corpo do outro machuca por dentro. Quem vê e fala ajuda a parar. | ano5-s1-corpos-do-mundo/apelido/explicação |
| `0950xa7.mp3` | Não existe corpo certo. Existe corpo cuidado, e cada um cuida do que tem. | ano5-s1-corpos-do-mundo/corpo-certo/explicação |
| `0ul4c3j.mp3` | Cuidado se vê no hábito, não no número da balança. | ano5-s1-corpos-do-mundo/cuidar/explicação |
| `0w291rz.mp3` | Herança, idade e história moldam o corpo. Não é só questão de esforço. | ano5-s1-corpos-do-mundo/o-que-muda/explicação |
| `140j6qb.mp3` | Todo corpo se movimenta. O que muda é o ritmo, não o direito. | ano5-s1-corpos-do-mundo/todos-podem/explicação |
| `1nnumv4.mp3` | Movimento no fim da tarde ajuda a dormir melhor à noite. | ano5-s2-digital-saude/peça |
| `19yochl.mp3` | Tela mais cedo, sem problema. Perto de dormir é que atrapalha. | ano5-s2-digital-saude/peça |
| `0mxgg4f.mp3` | Luz do dia e movimento acertam o relógio do corpo. | ano5-s2-digital-saude/peça |
| `1unco2r.mp3` | O banho morno baixa a temperatura do corpo depois. Isso dá sono. | ano5-s2-digital-saude/peça |
| `006k0w2.mp3` | Escovar à noite protege o dente pelas horas de boca fechada. | ano5-s2-digital-saude/peça |
| `1eqefet.mp3` | Livro no lugar da tela. O cérebro entende que o dia acabou. | ano5-s2-digital-saude/peça |
| `0uvt0tf.mp3` | Respiração lenta acalma o corpo. Funciona melhor que rolar o feed. | ano5-s2-digital-saude/peça |
| `026s4lw.mp3` | No escuro o corpo produz a substância que traz o sono. | ano5-s2-digital-saude/peça |
| `0u2rkkz.mp3` | Nove a onze horas. É de noite que o corpo cresce e organiza a memória. | ano5-s2-digital-saude/peça |
| `1qwybs8.mp3` | Plástico é reciclável. Vira garrafa nova em vez de virar lixo no rio. | ano5-s3-missao-ambiente-saudavel/peça |
| `1w7c2ag.mp3` | Papel é reciclável. Cada quilo reciclado poupa árvore e água. | ano5-s3-missao-ambiente-saudavel/peça |
| `0k2897h.mp3` | Casca é orgânico. Vira adubo em vez de mau cheiro no quarto. | ano5-s3-missao-ambiente-saudavel/peça |
| `0c2hrb2.mp3` | Roupa suja no cesto. No chão vira mofo e ácaro, que fazem mal para respirar. | ano5-s3-missao-ambiente-saudavel/peça |
| `1a5jnd4.mp3` | Brinquedo guardado é brinquedo que ninguém pisa nem tropeça. | ano5-s3-missao-ambiente-saudavel/peça |
| `1ayq7ke.mp3` | Luz acesa à toa gasta energia sem servir para nada. | ano5-s3-missao-ambiente-saudavel/peça |
| `0501ew0.mp3` | Torneira pingando desperdiça litros por dia. Fechar é o gesto mais barato que existe. | ano5-s3-missao-ambiente-saudavel/peça |

### `acalmar` — 8 falas, 511 caracteres

**Baixa, lenta e suave. O corpo precisa desacelerar junto.**

| Stability | Style |
| --- | --- |
| **0.75** | **0.15** |

| Arquivo | Texto | Onde aparece |
| --- | --- | --- |
| `1eg4xau.mp3` | Respirar. Puxe o ar pelo nariz e solte devagar pela boca. | ano1-s4-corpo-que-danca/movimento |
| `0pr8lh6.mp3` | Respiração. Puxe o ar pelo nariz contando até 4. Solte pela boca contando até 4. | ano2-s4-roleta-alongamentos/respirar |
| `128fss9.mp3` | Respire fundo. Puxe o ar pelo nariz contando até quatro. Solte devagar pela boca. | ano3-s2-trilha-do-sono/movimento |
| `171zq82.mp3` | Respire. Puxe o ar pelo nariz e solte pela boca, três vezes. | ano3-s4-classificacao-corporal/movimento |
| `0ivi4vy.mp3` | Respire. Puxe o ar pelo nariz e solte pela boca. | ano4-s2-super-lanche/movimento |
| `0v2uq6r.mp3` | Respire. Puxe o ar pelo nariz e solte devagar. | ano5-s1-corpos-do-mundo/movimento |
| `18ln3en.mp3` | Respirar fundo. Puxe o ar pelo nariz contando até 4. Solte pela boca contando até 4. | movimento/alongamentos/movimento |
| `0hweex6.mp3` | Acalmar. Pare, respire fundo e sinta o coração batendo. | movimento/movimentos/movimento |
