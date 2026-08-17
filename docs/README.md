# Documentação — SAÚDE EM JOGO!

Índice dos documentos do projeto. Comece pelo que corresponde ao seu papel.

---

## Sou a professora e vou usar em aula

**→ [manual-da-professora.md](manual-da-professora.md)**

Instalar nos computadores, trocar de aluno, entrar na Área do Professor,
exportar os dados. Sem termo técnico.

---

## Vou retomar o desenvolvimento

**→ [estado-atual.md](estado-atual.md)** — leia primeiro

O que está pronto, o que falta, e as pendências travadas em decisão. Escrito
para sobreviver à troca de sessão.

**→ [../README.md](../README.md)**

Arquitetura, as regras que não se negociam, e como acrescentar ou trocar um
jogo. O princípio central: **motor é código, jogo é JSON**.

**→ [plano-remodelacao.md](plano-remodelacao.md)**

O plano vigente. Contém o mapeamento que mais economiza trabalho: como os 5
motores existentes cobrem os 20 jogos **sem nenhum motor novo**.

---

## Vou produzir arte

**→ [prompts-de-arte.md](prompts-de-arte.md)**

O bloco de estilo — que é o contrato de coerência entre todas as folhas e não
deve ser reescrito —, o fluxo de recorte e a tabela de erro → regra aprendida na
prática.

**→ [prompts-a3.md](prompts-a3.md)**

As folhas A3 mais recentes, com as listas de itens e os comandos de recorte
prontos.

---

## Vou cuidar da narração

**→ [plano-da-voz.md](plano-da-voz.md)**

Por que a voz do sistema soa mecânica, e o que fazer. O diagnóstico é
contraintuitivo: a causa principal é o **roteiro escrito para o olho**, não o
motor de voz.

**→ [../public/falas/roteiro.md](../public/falas/roteiro.md)**

Gerado por `npm run falas:extrair`. Lista cada fala com o nome do arquivo e onde
ela aparece — serve para gravação humana.

---

## Preciso tratar de dados ou privacidade

**→ [dados-e-privacidade.md](dados-e-privacidade.md)**

O que é guardado, onde, o que **não** é coletado, como exportar e como apagar.
Relevante para o comitê de ética e para a LGPD.

---

## Preciso do valor do projeto

**→ [proposta-comercial.md](proposta-comercial.md)**

Escopo entregue, valor de mercado documentado, e a justificativa do valor
acordado. Serve para contrato, fomento ou registro do produto educacional.

---

## Registro histórico

**→ [plano-original.md](plano-original.md)**

O plano de arquitetura escrito antes de existir código, a partir dos três
documentos da autora. Parte dele foi superada pela remodelação; fica como
registro da decisão inicial.

---

## Onde está o resto

| O quê | Onde |
|---|---|
| Conteúdo dos jogos | `src/content/anoN/*.json` |
| Questionário da pesquisa | `src/content/questionario/perguntas.json` |
| Folhas de arte originais | `arte-fonte/` |
| Sprites recortados | `src/assets/library/` |
| Ferramentas de produção | `scripts/` |

## Comandos

```bash
npm run dev              # servidor local
npm run build            # valida conteúdo, checa tipos e empacota
npm run validate:content # valida os JSON contra os schemas
npm run test:laco        # testa datas e sorteio de figurinhas
npm run falas:extrair    # levanta todas as falas do app
```
