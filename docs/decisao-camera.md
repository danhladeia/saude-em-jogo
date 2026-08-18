# Câmera nos blocos de movimento — o que precisa ser verdade

> Documento para decidir, não para implementar. Escrito em 17/08/2026, a
> pedido do Danilo, depois da ideia de usar a câmera para conferir se o
> aluno executou o alongamento antes de o cronômetro começar.

## A ideia

Na Roleta de alongamentos (e nos outros blocos de movimento), o app
mostraria um modelo de corpo na pose do alongamento, ligaria a câmera, e o
cronômetro só começaria quando o corpo do aluno encaixasse na pose do
modelo.

O objetivo por trás dela é legítimo e é o mesmo do projeto desde o começo:
**garantir que a criança faz o movimento, em vez de clicar em "próximo"**.

## A regra que isso contraria

Está escrita no `README.md` e no código de `src/engines/comuns/CorpoAtivo.tsx`:

> Sem câmera, de propósito: são crianças, e a cartilha já coloca o professor
> como mediador presencial. O app cronometra e guia; quem observa é a
> professora.

Mudar é possível. Mas é mudar uma decisão registrada, e as consequências
não são de código.

---

## Os quatro bloqueios, do mais difícil ao mais fácil

A detecção de pose em si é a parte fácil. Existe biblioteca madura que roda
no navegador. Não é por aí que o problema vem.

### 1. Comitê de Ética em Pesquisa

A dissertação tem protocolo aprovado. **Ligar câmera em criança muda o
perfil de risco da pesquisa mesmo que nenhuma imagem seja gravada.** Isso
normalmente exige emenda ao CEP, com prazo de análise.

*O que precisa ser verdade:* a orientação confirmar se o protocolo aprovado
comporta captura de imagem, e, se não, se há prazo para emenda antes da
aplicação.

### 2. Consentimento dos responsáveis

Imagem corporal de menor é dado pessoal; leitura de pose é, na prática,
dado biométrico. O TCLE assinado pelos pais provavelmente não menciona
câmera.

*O que precisa ser verdade:* o TCLE cobrir explicitamente o uso da câmera,
com linguagem que diga que nada é gravado nem sai do aparelho — e a escola
aceitar isso.

### 3. O hardware que existe na escola

O app foi desenhado para laboratório de escola pública: máquina velha,
internet ruim ou nenhuma, cerca de 25 alunos revezando poucos computadores.
**Esses computadores em geral não têm webcam.**

A alternativa levantada foi o celular. Mas em escola pública nem toda
criança tem um, e usar o aparelho pessoal do aluno traz outra camada de
consentimento e de desigualdade dentro da mesma turma — quem não tem,
não joga.

*O que precisa ser verdade:* saber, escola por escola, se há webcam ou
celular disponível para todos — e ter um caminho para quem não tiver, sob
pena de a atividade excluir justamente quem tem menos.

### 4. O pedagógico — o que mais preocupa

Travar o cronômetro até a pose bater significa que a criança que não
consegue encaixar **não avança**. Criança gorda, criança com deficiência,
criança em espaço apertado, com luz ruim, com uniforme largo, com o corpo
simplesmente diferente do modelo desenhado.

Isso colide com duas coisas do próprio projeto:

- **"O erro nunca pune"** é regra dura. Sem game over, sem vidas, sem
  perder estrela.
- **A semana do 5º ano é sobre diversidade corporal e autoestima.** Um app
  que diz "seu corpo não está na posição certa" ensina o oposto do que
  aquele conteúdo ensina.

*O que precisa ser verdade:* a câmera ser **assistiva e opcional**, nunca
condição para avançar. Ou seja: ela pode dar um retorno animado a quem
quiser, mas o botão "já fiz" continua funcionando sempre, para todo mundo.

---

## O custo técnico, se os quatro forem resolvidos

| Item | Peso |
|---|---|
| Modelo de detecção de pose no pacote offline | vários MB somados aos 12 MB atuais |
| Desempenho em máquina velha | detecção em tempo real é o gargalo, não a rede |
| Arte: pose-alvo por alongamento | 12 poses novas, além das 12 figuras que já existem |
| Motor novo, com câmera, permissão, calibração e degradação | o maior item do projeto até hoje |

Para comparação: os cinco motores atuais somados cobriram 20 atividades.
Este seria um sexto motor, usado por duas.

---

## O que entrega o mesmo objetivo sem nada disso

O objetivo é a criança fazer o movimento de verdade. Três caminhos, em
ordem de custo:

1. **Contagem guiada por voz.** O cronômetro fala: "segura... mais cinco...
   quatro...". A narração humana já existe. Para quem tem 6 anos e não lê,
   muda mais a experiência do que qualquer detecção de pose.
2. **Troca de lado anunciada.** Metade dos alongamentos precisa dos dois
   lados; hoje isso está só no texto escrito.
3. **Demonstração animada.** Dois ou três quadros por alongamento,
   alternando entre posição inicial e final. Vira "faça este movimento" em
   vez de "olhe esta figura". É só arte; nenhum motor muda.
4. **A professora confere.** Um passo explícito de validação por quem está
   na sala — que é a mediação que a cartilha já prevê.

---

## Recomendação

**Não construir a câmera para o piloto.** Não pelo mérito da ideia, que é
boa, mas porque ela depende de CEP, de TCLE e de hardware que ninguém
controla — e porque a versão que trava o avanço machuca exatamente as
crianças que o 5º ano tenta acolher.

Fazer os quatro itens da lista acima custa uma fração e ataca o mesmo
problema. **Depois de quatro semanas de uso real**, você vai saber se as
crianças estão de fato fazendo os movimentos ou clicando em "já fiz" — e aí
a pergunta sobre câmera deixa de ser hipótese e passa a ter evidência.

Se ainda assim for para frente, o desenho seguro é: câmera **opcional**,
como espelho que dá retorno animado, e o botão de avançar sempre disponível
para quem não tem câmera, não quer usar, ou não consegue encaixar.

---

## Nota de lado: o app em celular

A decisão de que o app precisa rodar **nos dois** ambientes vale
independentemente da câmera. Uma verificação em tela de 375 px feita hoje
mostrou o app em bom estado:

- Roleta de alongamentos, Monte o corpo, Prato colorido e Corpo em ação:
  sem rolagem horizontal, nenhum alvo de toque abaixo de 44 px.
- **Trilha do sono (3º/S2): transborda 6 px na horizontal.** Defeito
  pequeno e isolado, mas é rolagem lateral na tela do aluno.

Nada disso está corrigido — está registrado.
