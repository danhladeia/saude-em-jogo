# Dados e privacidade

O aplicativo registra **nome, respostas e desempenho de crianças** — dado pessoal
sensível sob a LGPD. Este documento diz exatamente o que é guardado, onde, e como
apagar.

---

## O princípio

**Não existe servidor.** O aplicativo não envia nada pela internet, não tem
banco de dados remoto, não usa telemetria nem serviço de análise.

Tudo fica no **IndexedDB do navegador**, no computador em que a criança jogou. A
única saída de dados é a **exportação CSV**, disparada manualmente pela
professora na Área do Professor.

Isso não é escolha de conveniência: é o que torna o produto compatível com
pesquisa envolvendo crianças em escola pública, sem depender de termo de
transferência de dados a terceiros.

---

## O que é guardado

Todas as chaves ficam sob o prefixo `sej:` no IndexedDB (`keyval-store`).

| Chave | Conteúdo | Contém dado pessoal? |
|---|---|---|
| `sej:perfil` | Nome, ano escolar e personagem da sessão atual | **Sim** — nome |
| `sej:alunos` | Arquivo de todos os alunos que usaram a máquina | **Sim** — nome, respostas |
| `sej:questionario` | Respostas pré e pós da sessão atual | **Sim** |
| `sej:progresso` | Atividades concluídas, estrelas, tempo | Indiretamente |
| `sej:figurinhas` | Figurinhas coletadas | Não |
| `sej:sequencia` | Dias seguidos de uso | Não |
| `sej:desafios` | Desafios diários e semanais marcados | Não |
| `sej:preferencias` | Som, narração, modo turma | Não |

### O que **não** é guardado

Data de nascimento, endereço, foto, áudio, vídeo, geolocalização, contato dos
responsáveis, identificador de dispositivo. Nada disso é pedido nem inferido.

O aplicativo **não usa câmera nem microfone** — decisão deliberada num produto
para crianças.

### Sobre peso e altura

A cartilha prevê medir IMC antes da intervenção, mas **o aplicativo não coleta
esse dado**. Ele fica na planilha da professora, fora do sistema.

Se vier a ser incluído: o valor deve ser registrado e exibido **apenas na Área
do Professor**, com percentil por idade (referência OMS), e **nunca** mostrar
classificação corporal na tela do aluno. IMC infantil não usa faixa de adulto, e
rotular uma criança de "sobrepeso" contradiria frontalmente o conteúdo do 5º ano,
que trabalha respeito à diversidade corporal e autoestima.

---

## Separação por aluno

O laboratório tem poucos computadores e cerca de 25 alunos por turma. O botão
**"Não sou eu — trocar de aluno"**, na tela inicial, arquiva a sessão sob o nome
da criança e começa uma limpa.

O arquivo é sincronizado **a cada mudança**, não apenas na troca: criança que sai
sem avisar é a regra, e perder o dado dela seria perder um sujeito da pesquisa.

A chave de arquivamento normaliza caixa e acento — "Ana", "ANA" e "Ána" são a
mesma criança. Homônimos reais precisam de sobrenome.

---

## Exportação

Área do Professor → **Exportar CSV para análise**.

Uma linha por aluno: nome, ano, pontuação pré e pós, diferença, cada resposta
individual, estrelas por atividade e data.

Formato UTF-8 com BOM e separador ponto e vírgula, para abrir no Excel em
português sem corromper acento.

**O arquivo exportado é o ponto de maior exposição do projeto.** Depois de sair
do aplicativo, a proteção depende inteiramente de onde ele for guardado.

---

## Como apagar

**Um aluno específico:** não há interface para isso hoje. Seria preciso limpar o
IndexedDB inteiro daquela máquina.

**Tudo, num computador:** desinstalar o aplicativo remove o armazenamento. Ou,
no Chrome: Configurações → Privacidade → Dados de sites → localizar o endereço do
aplicativo → Excluir.

**Os arquivos exportados:** apagar manualmente. São a única cópia que sobrevive
fora do dispositivo.

---

## Responsabilidades

**Do desenvolvimento:** garantir que o aplicativo não envie dados para lugar
nenhum e que a exportação dependa de ação explícita.

**Da pesquisadora:** guarda dos arquivos exportados, uso restrito à finalidade
aprovada pelo comitê de ética, e descarte ao final da pesquisa. Também o termo de
consentimento dos responsáveis, conforme exigido pelo protocolo.

---

## Pendências

- **Apagar um aluno específico** pela Área do Professor
- **Aviso na exportação** lembrando a responsabilidade sobre o arquivo
- **PIN configurável** — hoje é fixo (`2024`) e não guarda segredo real: os dados
  já estão em texto claro no IndexedDB da máquina. Ele existe para uma criança
  não apagar a turma por acidente, não como controle de acesso.
