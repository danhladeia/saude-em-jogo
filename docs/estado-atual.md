# Estado atual — 17 de agosto de 2026

Retrato do projeto para retomar de onde parou. O **README** explica a
arquitetura e as decisões que não se negociam; este arquivo diz o que está
pronto, o que está pendurado e o que espera resposta de alguém.

---

## Pendências travadas em decisão, não em trabalho

### 1. Visibilidade do repositório — bloqueia a publicação

O repositório `danhladeia/saude-em-jogo` **existe, é público**, e o app está no
ar em https://danhladeia.github.io/saude-em-jogo/.

Isso **contraria** a orientação dada: o projeto não deve ser aberto à
comunidade, o foco é apenas as aulas da autora para o mestrado.

Há **8 commits locais não enviados**. Dar `push` publica todo o trabalho —
arte, sprites e o instrumento da pesquisa — antes da defesa.

Restrição técnica que pesa na escolha: **GitHub Pages não funciona em
repositório privado no plano gratuito.** Os caminhos são:

| Caminho | Consequência |
|---|---|
| Privado + Vercel | Código fechado e a professora mantém um link. Exige conectar conta Vercel. |
| Privado, sem link | Máximo fechamento. Exige gerar pacote para pasta local ou pendrive. |
| Manter público | Um `push` e o Pages atualiza em ~1 min. |

### 2. Perguntas para a autora

- **Em quais anos escolares a intervenção será aplicada?** Já não muda o escopo
  do código — os cinco anos estão no ar. Muda o que precisa de revisão de
  conteúdo e quantas falas precisam de gravação.
- **Revisão do questionário** em `src/content/questionario/perguntas.json`. As 10
  perguntas são proposta do desenvolvimento; são o instrumento de medida da
  dissertação e precisam passar pela autora e pela orientação.
- **Nome do mascote** — pendente desde o início.
- **Vídeos** citados no documento (higiene no 1º/S2, atividade física × exercício
  no 3º/S4): produzir, licenciar ou substituir por animação?
- **Músicas** do "Corpo que dança" (1º/S4) precisam ser livres de direitos.
- **Acesso aberto:** mestrado profissional normalmente exige que o produto
  educacional seja publicado. Confirmar com a orientação antes de fechar o
  repositório — pode mudar quem banca o desenvolvimento.

---

## O que está pronto

- **As 20 atividades**, os cinco anos escolares, as quatro semanas de cada
- **Cinco motores** cobrindo os dez do plano original — ver o README
- **195 sprites** integrados, com dois personagens e escolha pelo aluno
- **Laço diário:** roleta de recompensa, sequência de dias, álbum de figurinhas
- **Coleta da pesquisa:** questionário pré/pós, arquivo por aluno, exportação CSV
- **Área do Professor** por toque longo no logo, PIN `2024`
- Funcionamento offline, narração pt-BR, acessível por toque, mouse e teclado

Verificação: `npm run build`, `npm run test:laco`, `npm run falas:revisar`,
`npx tsc -b`, `oxlint` — todos passando. Hooks de projeto validam conteúdo e
lint a cada edição.

### O que entrou de 3º a 5º ano

Nenhum motor novo, como previa `docs/plano-remodelacao.md`. Duas extensões
pequenas destravaram os doze jogos:

| Extensão | Onde | Destrava |
|---|---|---|
| `layout: "colunas"` e `"linha-do-tempo"` no arrastar-alvo, com alvo recebendo várias peças | `src/engines/arrastar-alvo/` | classificar, montagem e rotina — 6 jogos |
| `feedback: "trilha"` no quiz | `src/engines/comuns/PeleDeFeedback.tsx` | Trilha saudável do sono |

Cada peça de arrastar ganhou um campo `explicacao`, narrado no acerto. Sem ele o
jogo de classificar vira tentativa e erro: a criança acerta por eliminação e não
aprende a diferença entre atividade física e exercício físico.

As doze atividades novas usam os sprites que já estavam cortados — alimentos,
esportes, ambiente e rotina. **Nenhuma arte nova foi necessária.**

## O que falta

### Fecha o núcleo (poucas horas)

- **Uma lata de refrigerante genérica**, para repor a que veio com marca da Fanta

### A narração está gravada

As 343 falas saíram na voz neural `pt-BR-FranciscaNeural`, por
`npm run falas:gerar:edge`. A voz do sistema virou o que sempre devia ter
sido: rede de segurança para texto dinâmico.

**Procedência, para você decidir com o que está na mão:** o `edge-tts` usa o
endpoint por trás do "Ler em voz alta" do Edge, não uma API contratada da
Microsoft. Escolha consciente, feita ouvindo lado a lado a alternativa de
licença limpa (Kokoro `pf_dora`, Apache 2.0). Se a orientação ou a banca
levantar a questão, `npm run falas:gerar` com Azure regera tudo na mesma
família de voz — os arquivos existentes seriam apagados antes, já que o
gerador nunca sobrescreve.

**Os MP3 passaram a ser versionados.** O `.gitignore` os excluía, e o deploy
é `checkout` + `build` no CI, que não regera áudio: do jeito que estava, o
site publicado sairia mudo sem nenhum erro na tela.

### Feito em 17/08

**Fases 1, 3 e 6 da voz** (`docs/plano-da-voz.md`), o maior ganho de qualidade
por hora do projeto.

Fase 1 — escrever para o ouvido:

- As quatro dicas de saúde eram parágrafos de até 42 palavras entregues numa
  string só ao motor de voz — as falas mais longas do app. Cada dica virou uma
  fala própria, narrada em sequência com pausa real entre elas
  (`narrarSequencia()`).
- 28 falas de conteúdo reescritas: travessão e dois-pontos viraram ponto final,
  orações de 13 a 16 palavras foram partidas.
- `npm run falas:revisar` passou a ser a régua automática.

Fase 3 — dizer com a intenção certa:

- Cada fala carrega uma intenção, **deduzida de onde ela mora** no conteúdo.
  Conteúdo novo já nasce etiquetado, sem ninguém precisar lembrar.
- O roteiro de gravação ganhou a coluna "Como dizer", em português, para quem
  vai gravar. O gerador manda estilo e prosódia por intenção nos três
  provedores. Antes, "Isso mesmo!" e "Tente outro lugar." saíam idênticas.
- As 24 falas da roleta de recompensa entraram no roteiro. Eram texto montado
  em tempo de execução e nunca teriam clipe — o momento mais comemorativo do
  app seria o único garantidamente robótico.

São 343 falas, todas dentro da régua e com intenção.

**Um bug que teria estragado a entrega do áudio:** o app procurava os clipes
em `/falas/…`, sem a base `/saude-em-jogo/`. Todo clipe gravado seria ignorado
em silêncio, sem erro na tela. Ninguém tinha visto porque ainda não havia
áudio gerado — teria aparecido só depois de gravar tudo.

**Uma lacuna que ficou anotada, não corrigida:** a tela de convite dos blocos
de movimento mostra a instrução e o aviso "Levante da cadeira" sem narrar
nada. Criança de 6 anos que não lê fica sem instrução ali. Corrigir mexe em
`src/engines/`, que tem regras próprias — fica para uma passada dedicada.

### Revisão de conteúdo — depende da autora

As doze atividades de 3º a 5º ano foram escritas pelo desenvolvimento a partir
dos objetivos do documento da autora. **São proposta, não conteúdo aprovado.**
Duas merecem olhar antes de qualquer piloto:

- **Corpos do mundo (5º/S1).** Diversidade corporal escrita sem nenhuma
  ilustração de corpo, de propósito: gerador de imagem enviesa forte contra
  corpos gordos e pessoas com deficiência, e é justamente aqui que esse viés
  faria mais estrago. As doze figuras do plano original seguem pendentes de
  curadoria individual.
- **Classificação corporal (3º/S4).** A fronteira entre atividade física e
  exercício físico é conceito de área; vale conferir se os oito exemplos batem
  com o que a professora ensina em aula.

## Onde as coisas estão

| O quê | Onde |
|---|---|
| Arquitetura e regras duras | `README.md` |
| Prompts de arte e fluxo de recorte | `docs/prompts-de-arte.md`, `docs/prompts-a3.md` |
| Proposta comercial (R$ 1.500) | `docs/proposta-comercial.md` |
| Plano original do app | `docs/plano-original.md` |
| Remodelação (poucos jogos, laço) | `docs/plano-remodelacao.md` |
| Plano da voz natural | `docs/plano-da-voz.md` |
| Roteiro de gravação das 302 falas | `public/falas/roteiro.md` |
| Folhas de arte originais | `arte-fonte/` |

---

## Recomendação

Não construir mais nada antes do piloto. O que existe cobre a intervenção
inteira — cinco anos escolares, quatro semanas cada, com coleta funcionando.
Quatro semanas de uso real dizem mais sobre o que vale construir do que qualquer
plano — inclusive se as três mecânicas de engajamento funcionam com aquelas
crianças.

O caminho mais curto: a autora revisa o conteúdo de 3º a 5º ano, decide a
visibilidade do repositório e publica. Em um dia a professora está aplicando.
