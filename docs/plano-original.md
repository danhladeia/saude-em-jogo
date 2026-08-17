# SAÚDE EM JOGO! — Plano de construção do PWA

> Plano de arquitetura escrito antes de existir codigo, a partir dos tres documentos da autora. Guardado como registro da decisao inicial — parte dele foi superada pela remodelacao, ver plano-remodelacao.md.

## Contexto

Os três documentos da pasta descrevem um **produto educacional de mestrado** (PROEF/Unimontes — Profa. Luciana Pereira Miranda Paccelli, orientação Prof. Dr. Renato Sobral Monteiro Junior e Prof. Dr. Saulo Daniel Mendes Cunha), hoje existindo apenas como *pseudo-software*: especificação no papel, sem código.

O que cada documento entrega:

| Documento | Papel |
|---|---|
| `Cartilha Luciana_Proef.pdf` (19p) | Metodologia de aplicação: aula de 50 min no laboratório, IMC medido **antes** de iniciar, questionário pré e pós, 10 "etapas do jogo", grupos cooperativos e inclusivos, roda de conversa final |
| `APP Luciana.pdf` (8p) | Identidade visual (**"SAÚDE EM JOGO! — Jogo que ensina, saúde que transforma!"**, cartoon 3D azul/verde) e o mapa de navegação completo |
| `CONTEÚDOS...docx` | **20 jogos especificados** (5 anos × 4 semanas), cada um com foco, objetivo, conteúdo e mecânica descrita |

As imagens anexadas ao `.docx` revelam a referência mental da autora: **templates do Wordwall** (roleta aleatória, caça-palavras, classificação em grupos) e um modelo de quiz ilustrado. O objetivo do app é ser isso, mas nativo, offline, em português e com conteúdo curricular próprio alinhado à BNCC.

**Resultado pretendido:** um PWA instalável que roda offline no laboratório da escola, que crianças de 6 a 11 anos usam sozinhas, e que devolve à professora os dados que a dissertação precisa.

---

## A descoberta que define a estratégia

Os 20 jogos parecem 20 projetos. Não são. Lidos lado a lado, colapsam em **9 motores reutilizáveis** — o motor de quiz sozinho cobre 5 jogos:

| # | Motor | Jogos que atende | Qtd |
|---|---|---|---|
| 1 | **Quiz ilustrado** | Jogo de escolhas (1º/S2), Movimente-se (2º/S2), Equilibrista mirim (2º/S3), Água em jogo (3º/S1), Corpos do mundo (5º/S1) | 5 |
| 2 | **Arrastar-para-alvo** | Monte o corpo humano (1º/S1), Como me sinto? (1º/S3) | 2 |
| 3 | **Classificação em grupos** | Classificação corporal AF×EF (3º/S4), Missão ambiente saudável (5º/S3) | 2 |
| 4 | **Planejador de rotina** | Dia ativo saudável (4º/S4), Digital saúde (5º/S2) | 2 |
| 5 | **Montagem com pontuação nutricional** | Prato colorido (4º/S1), Super lanche (4º/S2) | 2 |
| 6 | **Associação / memória** | Corpo que fala (2º/S1), Jogo da memória de esportes (3º/S3) | 2 |
| 7 | **Trilha / tabuleiro** | Trilha saudável do sono (3º/S2) | 1 |
| 8 | **Roleta giratória** | Roleta de alongamentos (2º/S4) | 1 |
| 9 | **Arcade lateral (runner)** | Missão corpo e movimento (4º/S3) | 1 |
| + | **Corpo Ativo** (transversal, ver abaixo) | Corpo que dança (1º/S4), Corpo em ação (5º/S4) | 2 |

**A regra de ouro do projeto: motor é código, jogo é JSON.** Cada motor é escrito uma vez, testado uma vez, e cada um dos 20 jogos vira um arquivo de conteúdo validado por schema. Consequências diretas:

- Trocar uma atividade não exige programador — atende literalmente o P.S. do `.docx` ("se não for possível a realização de alguma atividade, substituímos por outra com o mesmo tema").
- Os 20 arquivos de conteúdo podem ser **gerados a partir do próprio `.docx`** e depois revisados pela professora — isso é o acelerador real do projeto.
- Um bug de acessibilidade corrigido no motor de quiz conserta 5 jogos.

---

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build | **Vite + React + TypeScript** | Ecossistema maduro para drag-and-drop e animação; HMR rápido |
| PWA | **vite-plugin-pwa** (Workbox) | Service worker com precache do shell + runtime cache dos pacotes de assets por ano |
| Estilo | **Tailwind CSS** | Tokens de design centralizados; alvos de toque grandes por padrão |
| Drag & drop | **@dnd-kit/core** | Único que funciona bem em **toque, mouse e teclado** ao mesmo tempo — HTML5 DnD quebra em tablet |
| Animação | **Framer Motion** | Feedback e celebrações; `prefers-reduced-motion` nativo |
| Estado | **Zustand** + **idb-keyval** | Perfil, estrelas e dados da turma persistidos em IndexedDB |
| Validação | **Zod** | Schema de cada motor; conteúdo inválido falha no build, não na aula |
| Áudio/voz | **Web Speech API** (`SpeechSynthesis`, pt-BR) + Howler para SFX | Narração offline e gratuita — essencial para 1º ano, onde muita criança ainda não lê |
| Celebração | **canvas-confetti** | 3 KB |

**Não usar Phaser.** O único jogo que pediria um game engine é o runner do 4º ano — um auto-runner de um botão, ~200 linhas de `requestAnimationFrame` em `<canvas>`. Phaser custaria ~1 MB de bundle por um jogo só, num laboratório de máquinas velhas.

**Orçamento de performance (não negociável):** shell inicial < 300 KB JS gzipado; cada pacote de ano carregado sob demanda; funcionar em 1366×768 e em Chrome de máquina com 4 GB de RAM.

---

## A camada criativa

Três decisões que separam "20 exercícios clicáveis" de um app que a criança quer abrir de novo:

### 1. Mascote-guia único

O mockup já tem um menino de camiseta azul saltando na trilha. Ele vira o **narrador do app inteiro**: apresenta a atividade, comemora acerto, consola erro, guia o alongamento. Um personagem em ~20 poses dá mais coesão visual do que 300 ilustrações avulsas — e é o ativo de arte de maior retorno. *Nome a definir pela autora.*

### 2. Momento Corpo Ativo — o diferencial pedagógico

O `.docx` insiste em movimento **real**, não em clique: o Equilibrista mirim tem um "segundo momento" prático, a roleta manda a criança executar o alongamento, o Corpo que dança pede repetir os passos. Isso é o coração do letramento corporal e não pode virar nota de rodapé.

Solução: um componente transversal `<CorpoAtivo>` que **qualquer** jogo invoca ao terminar — animação-guia do mascote + cronômetro grande + auto-relato de emoção ("como você se sentiu?"). Sem câmera: privacidade de criança não se negocia, e o professor é o mediador previsto na cartilha.

### 3. Modo Turma

A cartilha dedica a ETAPA 8 a "grupos cooperativos e participação inclusiva", e laboratório público raramente tem uma máquina por aluno. Um toggle **Modo Turma** amplia fontes e alvos para projeção, e transforma o jogo em rodada coletiva. Custo baixo (uma classe CSS e um estado global), ganho pedagógico alto.

---

## Pipeline de arte gerada por IA

São **~330 imagens**, mas com reúso entre jogos (alimentos, esportes e alongamentos reaparecem) a biblioteca única cai para **~250 assets**. Do MVP (1º e 2º ano), ~110.

Assets ficam numa **biblioteca central compartilhada**, não por jogo:

```
src/assets/library/
  personagem/     mascote em poses (~20)
  corpo/          partes do corpo, silhuetas (~12)
  emocoes/        expressões faciais + rostos-base (~20)
  higiene/        objetos e ações (~25)
  alimentos/      por categoria: frutas, verduras, proteínas, ultraprocessados (~55)
  esportes/       os 16 listados no .docx
  movimentos/     alongamentos e ações corporais (~30)
  cenarios/       quarto, sala de aula, pátio, praça (~4 + ~40 objetos)
```

**O passo que evita deriva de estilo:** gerar **primeiro uma folha de referência** — 1 imagem aprovada no estilo do logo — e usá-la como *style reference* (image-to-image) para todo o resto. Gerar 250 imagens com prompt de texto puro produz 250 estilos.

Prompt-base travado:
> 3D cartoon illustration, soft rounded shapes, glossy toy-like finish, bright saturated palette (#4FC3F7 blue, #66BB6A green, #FFCA28 yellow, #FF7043 coral), soft drop shadow, centered subject, plain white background, no text, children's educational app style

Pós-processamento em lote (script `scripts/process-assets.ts`): remover fundo → recortar → redimensionar (256 e 512) → converter para **WebP** → gerar `manifest.json` tipado que o TypeScript consome (asset faltando = erro de compilação, não imagem quebrada na aula).

**Curadoria obrigatória, não opcional:** o jogo "Corpos do mundo" (5º ano) exige explicitamente personagens altos, baixos, magros, gordos, com diferentes tons de pele e **com deficiências**. Geradores de imagem enviesam forte para o padrão magro-branco-sem-deficiência. Esses 12 personagens precisam de prompts individuais e revisão humana. Personagens estilizados, nunca fotorrealistas.

---

## Estrutura do projeto

```
saude-em-jogo/
  src/
    app/            rotas, shell, providers
    design/         tokens, tipografia, Botao, Card, Estrela, Confete
    engines/        os 9 motores + <CorpoAtivo>
      quiz/  arrastar-alvo/  classificar/  rotina/  montagem/
      associacao/  trilha/  roleta/  runner/
    content/
      schemas.ts    Zod: um schema por motor
      ano1/ ... ano5/   20 arquivos JSON
      dicas/        higiene, alimentação, sono, atividade física
      desafios/     diários e semanais
      questionario/ pré e pós
    features/
      perfil/  conquistas/  desafios/  dicas/  professor/
    assets/library/
    lib/            audio.ts, narracao.ts, storage.ts, export.ts
  scripts/          process-assets.ts, validate-content.ts
```

Navegação espelhando exatamente as 8 telas do `APP Luciana.pdf`:

`Iniciar` → `Digite seu nome` → **Menu**: Atividades · Jogos de Movimento · Desafios da Saúde · Dicas de Saúde · Minhas Conquistas.

---

## Área do Professor

Painel protegido por PIN, acessível por toque longo no logo (invisível para a criança).

- **Turma e alunos** — cadastro, avatar, nome
- **IMC** — peso e altura por aluno, com data
- **Questionário pré e pós** — aplicado no app, resposta por aluno, comparação lado a lado
- **Progresso** — jogos concluídos, estrelas, tempo por atividade, desafios cumpridos (atende a ETAPA 9 "Replay — registro das aulas")
- **Exportação CSV** — uma linha por aluno, pronta para análise estatística da dissertação

**Dois cuidados que precisam estar no código desde o início:**

1. **LGPD.** Peso, altura e IMC de criança são dado pessoal sensível. Ficam **exclusivamente em IndexedDB no dispositivo**, sem backend, sem telemetria, sem nuvem. A exportação é uma ação manual e explícita da professora.
2. **IMC infantil não usa faixa de adulto.** Classificar criança de 7 anos como "sobrepeso" com corte de adulto é erro metodológico e, pior, aparece na tela para a criança. O app **calcula e registra o valor**, exibe percentil por idade/sexo (referência OMS) **apenas na área do professor**, e **nunca** mostra classificação corporal na interface do aluno — isso contradiria frontalmente o 5º ano, que trabalha justamente respeito à diversidade corporal e autoestima.

---

## PWA e funcionamento offline

- `vite-plugin-pwa` com `registerType: 'autoUpdate'`; precache do shell + fontes + assets do mascote.
- **Pacotes de assets por ano**, cacheados sob demanda: a professora do 2º ano não baixa as ilustrações do 5º.
- Manifest completo: ícones 192/512/maskable, `display: standalone`, `orientation: any`, `lang: pt-BR`.
- Tela de "conteúdo pronto para uso offline" com barra de progresso — a professora precisa **saber** que pode desconectar antes da aula.
- Deploy em Vercel ou Netlify (gratuito). Fluxo real: professora abre uma vez com internet, clica em "Instalar", e o laboratório funciona offline daí em diante.

---

## Acessibilidade e inclusão

Não é polimento final — é requisito da cartilha (ETAPA 8) e do conteúdo do 5º ano.

- Alvos de toque ≥ 64 px (criança de 6 anos, mouse de laboratório).
- **Narração em toda instrução e opção de resposta** — 1º ano ainda não lê fluentemente.
- Navegação completa por teclado (o `@dnd-kit` entrega isso de graça se usado corretamente).
- Contraste AA mínimo; nunca cor como único portador de informação.
- Sem pressão de tempo por padrão; cronômetro é opcional e visível.
- Erro nunca pune: sem "game over", sem vidas. Feedback do mascote é sempre reorientador.
- Respeitar `prefers-reduced-motion`.

---

## Fases

**Fase 0 — Fundação**
Scaffold Vite+React+TS+Tailwind+PWA. Design system extraído do mockup (paleta, tipografia arredondada, Botao/Card/Estrela). Shell de navegação com as 8 telas. Perfil local + narração + sistema de estrelas. Folha de referência de estilo aprovada.

**Fase 1 — Motores do MVP**
`quiz`, `arrastar-alvo`, `associacao`, `roleta` + `<CorpoAtivo>`. Cada um com schema Zod e uma tela de preview alimentada por JSON de teste.

**Fase 2 — Conteúdo 1º e 2º ano**
Os 8 jogos como JSON, gerados a partir do `.docx` e revisados pela autora. Geração e processamento dos ~110 assets. **Aqui o MVP fica jogável em sala.**

**Fase 3 — Módulos transversais**
Jogos de Movimento (alongamentos, movimentos corporais), Desafios da Saúde (5 diários + 2 semanais com sequência de dias), Dicas de Saúde (4 temas), Minhas Conquistas.

**Fase 4 — Área do Professor**
Turma, IMC, questionário pré/pós, progresso, exportação CSV.

**Fase 5 — 3º, 4º e 5º ano**
Motores restantes (`classificar`, `rotina`, `montagem`, `trilha`, `runner`) + os 12 jogos + ~140 assets.

**Fase 6 — Piloto e polimento**
Teste com crianças reais, ajuste de usabilidade, auditoria de acessibilidade, deploy e instalação no laboratório.

---

## Verificação

- `npm run dev` — percorrer as 8 telas do mockup e confirmar correspondência com `APP Luciana.pdf`.
- `npm run validate:content` — todo JSON de conteúdo valida contra o schema Zod do seu motor; build falha se não.
- **Teste em toque real:** abrir via rede local num tablet e completar um jogo de arrastar sem mouse. É onde 90% dos bugs de drag-and-drop aparecem.
- **Teste offline:** carregar, ativar "Offline" no DevTools, recarregar, jogar um jogo inteiro. Repetir depois de instalar como PWA.
- **Teste de teclado:** completar um quiz e um arrastar usando só Tab/setas/Enter.
- **Teste de narração:** confirmar voz pt-BR presente; ter fallback visual quando o SO não tiver.
- Lighthouse: PWA instalável, Acessibilidade ≥ 95, Performance ≥ 90 em throttling de rede lenta.
- Exportar CSV da área do professor com 2 alunos fictícios e abrir no Excel — encoding UTF-8 e acentos corretos.
- Verificar em 1366×768, a resolução mais comum de laboratório escolar.

---

## Pontos que precisam da autora

Não bloqueiam o início — a Fase 0 e 1 seguem independentemente — mas precisam de resposta antes das fases indicadas.

1. **Contradição no jogo do 3º ano / semana 3.** O título diz "Jogo da memória", a descrição diz tabuleiro com casas de modalidades esportivas. São mecânicas diferentes. *Assunção até haver resposta:* memória com 16 esportes, e ao formar cada par a criança classifica em individual ou coletivo — preserva as duas intenções. **Necessário antes da Fase 5.**
2. **Nome do mascote.** Necessário na Fase 0.
3. **Vídeos citados no `.docx`** (higiene pessoal no 1º/S2, atividade física × exercício físico no 3º/S4): produzir, licenciar ou substituir por animação do mascote? Vídeo embutido pesa no cache offline. **Necessário antes da Fase 2.**
4. **Conteúdo do questionário pré/pós** — a cartilha o exige mas não o transcreve. **Necessário antes da Fase 4.**
5. **Músicas do "Corpo que dança"** (1º/S4) — precisam ser livres de direitos autorais para um produto de mestrado publicado. **Necessário antes da Fase 2.**
