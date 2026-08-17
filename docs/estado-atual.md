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

- **Em quais anos escolares a intervenção será aplicada?** É a variável que mais
  move o escopo. Se for 1º e 2º, **o produto já está pronto**.
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

- **8 atividades** de 1º e 2º ano, as quatro semanas de cada
- **195 sprites** integrados, com dois personagens e escolha pelo aluno
- **Laço diário:** roleta de recompensa, sequência de dias, álbum de figurinhas
- **Coleta da pesquisa:** questionário pré/pós, arquivo por aluno, exportação CSV
- **Área do Professor** por toque longo no logo, PIN `2024`
- Funcionamento offline, narração pt-BR, acessível por toque, mouse e teclado

Verificação: `npm run build`, `npm run test:laco`, `npx tsc -b`, `oxlint` — todos
passando. Hooks de projeto validam conteúdo e lint a cada edição.

---

## O que falta

### Fecha o núcleo (poucas horas)

- **Manual de uma página** para a professora: instalar, trocar de aluno, abrir a
  Área do Professor, exportar o CSV
- **Reescrever as 139 falas para o ouvido** — maior ganho de qualidade por hora
  do projeto; ver `~/.claude/plans/voz-natural-saude-em-jogo.md`
- **Gerar os clipes de narração** — zero gravados; o app usa a voz do sistema.
  Depende de escolher provedor e chave: `npm run falas:gerar`
- **Uma lata de refrigerante genérica**, para repor a que veio com marca da Fanta

### Amplia a cobertura (opcional)

12 atividades de 3º a 5º ano. **Nenhum motor novo é necessário** — ver o
mapeamento de substituições em `~/.claude/plans/remodelacao-saude-em-jogo.md`.
São 2 extensões pequenas (10h) mais conteúdo, cerca de 10h por ano escolar.

**71 sprites já cortados** aguardam esses jogos: alimentos (23), esportes (16),
ambiente (16), rotina (16).

---

## Onde as coisas estão

| O quê | Onde |
|---|---|
| Arquitetura e regras duras | `README.md` |
| Prompts de arte e fluxo de recorte | `docs/prompts-de-arte.md`, `docs/prompts-a3.md` |
| Proposta comercial (R$ 1.500) | `docs/proposta-comercial.md` |
| Plano original do app | `~/.claude/plans/analise-os-domumentos-*.md` |
| Remodelação (poucos jogos, laço) | `~/.claude/plans/remodelacao-saude-em-jogo.md` |
| Plano da voz natural | `~/.claude/plans/voz-natural-saude-em-jogo.md` |
| Folhas de arte originais | `arte-fonte/` |

---

## Recomendação

Não construir mais nada antes do piloto. O que existe cobre uma intervenção
completa de quatro semanas em duas turmas, com coleta funcionando. Quatro
semanas de uso real dizem mais sobre o que vale construir do que qualquer
plano — inclusive se as três mecânicas de engajamento funcionam com aquelas
crianças.

O caminho mais curto: decidir a visibilidade, publicar, escrever o manual. Em um
dia a professora está aplicando.
