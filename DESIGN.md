---
name: DrainMaster — autenticação
description: Sistema visual restrito às telas de login e cadastro.
colors:
  primary: "#193e49"
  primary-hover: "#102f39"
  page: "#f3f0eb"
  surface: "#fff"
  ink: "#16232d"
  muted: "#68757d"
  border: "#e3e8eb"
  focus: "#35829a"
  error: "#a0212c"
  success: "#226247"
typography:
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  incumbent-display:
    fontFamily: "Paytone One, sans-serif"
  incumbent-serif:
    fontFamily: "Playfair Display, serif"
rounded:
  container: "36px"
  photo: "30px"
  input: "13px"
  action: "12px"
  social: "9px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.action}"
    height: "60px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---

# Design System: DrainMaster — autenticação

## Overview

Este documento descreve somente `/login` e `/cadastro`, implementados em `src/components/auth/AuthScreen.jsx` e `auth.css`. Não redefine a identidade da landing page nem do jogo; os tokens globais em `src/index.css` continuam independentes desta superfície.

A referência fornecida pelo usuário está em `.impeccable/review/reference.png`: fotografia de Caraguatatuba à esquerda, formulário branco à direita, fundo creme, Outfit e ação em azul petróleo. O cadastro prolonga essa composição com nome de usuário e confirmação de senha. A comunicação deve ser acessível, direta e coerente com a iniciativa educativa local descrita em `PRODUCT.md`.

Esta documentação foi extraída do código. A fidelidade visual permanece sem verificação em navegador: o ambiente não permitiu capturar telas renderizadas de desktop e celular. Não interpretar a documentação como confirmação de correspondência pixel a pixel.

## Colors

O petróleo identifica a ação principal e os links; branco e creme separam formulário e página. O texto principal usa `ink`, os textos auxiliares e placeholders usam `muted`, e os campos e divisórias usam `border`. Erros e sucesso têm cores distintas e sempre incluem texto. O foco usa contorno de 3px em `focus`, deslocado 3px.

## Typography

As fontes globais preexistentes Paytone One (display) e Playfair Display (serif) continuam carregadas em `index.html` para outras paginas. Sao registradas acima para documentar o sistema existente; nao pertencem aos formularios e nao foram alteradas por esta entrega.

Outfit é a única família desta superfície, com fallback sans-serif e carregamento em `src/index.css`. O título usa o token `headline`, reduzido para 29px entre 681 e 1050px e 28px até 680px. Os campos usam 15px no desktop e 16px no celular; a ação usa 16px e peso 500. Mensagens e links de troca de tela usam 14px, e a dica de senha usa 12px.

O nome da cidade sobre a foto usa peso 800, entre 32 e 64px no desktop, entre 27 e 48px no celular, com entrelinha 1.12. O título da tela tem entrelinha 1.2; o restante da superfície herda 1.4, com mensagens em 1.5.

## Layout

Separacao entre titulo e santo: a foto morro.jpg foi deslocada para baixo com `--photo-offset: clamp(80px, 9vw, 120px)`, mantendo Caraguatatuba no topo. O fundo azul prolonga visualmente o ceu e uma mascara de 28px suaviza a uniao; a fotografia original nao foi editada. A parte inferior excedente permanece recortada pelo painel.

Atualizacao solicitada: o nome Caraguatatuba agora usa `CurvedText` com SVG/textPath, arco superior e gradiente vertical branco (#ffffff) para azul-claro (#8ec5df). Fica no topo da foto (8px desktop, 2px celular); esta regra substitui a posicao anterior sobre as montanhas. O componente usa useId para caminhos e gradientes independentes e herda currentColor quando nao recebe gradiente.

Ajuste solicitado pelo usuario: foto ancorada em `left center` no desktop para mostrar mais do santo, deslocando o conteudo da imagem para a direita. Nome da cidade centralizado horizontalmente, com centro vertical em 18% da foto, sobre as montanhas. No celular, imagem em `left top` para manter as montanhas visiveis e centro do texto em 30% da altura.

O contêiner central tem largura máxima de 1320px, colunas de 45,3% para a foto e 54,7% para o formulário, padding de 20px 22px e altura mínima `min(850px, calc(100svh - 24px))`. A foto tem altura mínima de 680px. O formulário recebe padding de 40px 36px 22px 58px.

No login, o formulário começa 90px abaixo do título, os campos sucessivos se separam por 30px e a ação tem margem superior de 90px. No cadastro esses valores são 35px, 18px e 30px, acomodando os campos adicionais. A faixa entre 681 e 1050px reduz espaçamentos, campos e ação para 52px e a foto para mínimo de 620px.

Até 680px, as colunas viram uma pilha com foto acima do formulário. A página tem padding de 10px; a foto tem altura de 220px; o conteúdo recebe 28px 14px 18px. Formulário e ação usam margem superior de 32px, com campos e ação de 54px. A página pode crescer verticalmente conforme conteúdo, mensagens e teclado.

## Elevation & Depth

O sistema usa principalmente separação por cor e borda. A ação principal é o único elemento com sombra: `0 5px 10px #193e4926`. Campos e botões sociais permanecem sem sombra. Transições de borda e fundo duram 150ms; `prefers-reduced-motion: reduce` as remove.

## Shapes

O contêiner e a fotografia têm cantos amplos; campos e ações usam raios menores conforme os tokens. Entre 681 e 1050px, os raios do contêiner e da foto são 26px e 22px. No celular passam a 24px e 17px. Campos e botões sociais usam borda de 1px.

## Components

Correcao localizada na barbatana proxima dos campos de login (direita no vetor original, esquerda na tela espelhada): a animacao recorta apenas a extremidade abaixo de y=356, com pivo na nova raiz e amplitude de 3 graus. A cabeca e a parte superior da juncao permanecem na camada fixa original. Remendos antigos deste lado foram removidos; uma sobreposicao curta na raiz mantem a conexao sem pintar o rosto.

Correcao apos evidencia visual do usuario: descartadas as amostras deslocadas de pele, os gradientes de remendo e o prolongamento osseo inventado. As camadas de suporte e cobertura agora reutilizam somente a arte original nas mesmas coordenadas, sem transformacoes; regioes transparentes permanecem transparentes e cada lado conserva sua propria pintura. Esta regra substitui as tentativas anteriores de preenchimento das juncoes.

Pintura das duas juncoes superiores: preenchimentos lisos foram substituidos por recortes da propria arte vetorial da pele, mantendo suas sombras, variacoes de vermelho e detalhes. As amostras sao limitadas a cada juncao por clipPath, nas camadas de fundo e de cobertura do rosto; nao alteram olhos, recortes ou movimentos das barbatanas.

Correcao dos contornos soltos: corpo e barbatanas agora usam mascaras complementares com a mesma margem de 6 unidades, para que as linhas externas acompanhem integralmente cada parte movel. As antigas restauracoes fixas das raizes foram removidas. Preenchimentos internos nao possuem contorno; duas pequenas tampas de pele acima das barbatanas cobrem a interferencia nas laterais do rosto.

Correcao das juncoes na natacao: a mascara preserva agora as raizes fixas das duas barbatanas e da cauda. Uma camada vetorial abaixo do corpo completa o volume vermelho anteriormente encoberto nas laterais e prolonga a conexao ossea da cauda. As partes animadas sobrepoem as bases, evitando revelar o fundo nas articulacoes durante a oscilacao.

Refinamento da natacao: pupila principal circular (22x22) e secundaria arredondada (10x11). Alcance aumentado para a direita da tela, compensando o espelhamento (28 e 12 unidades locais negativas), com limites individuais. Duas barbatanas e cauda usam recortes da arte original e oscilam suavemente em ciclos de 2.6, 2.9 e 3.4 segundos, com amplitudes entre 3 e 4 graus. Movimento reduzido pausa as animacoes SVG no repouso e desativa acompanhamento e flutuacao.

Peixe atualizado com os dois olhos acompanhando o ponteiro, cada pupila com amplitude proporcional a sua perspectiva e recorte independente. Flutuacao vertical continua de 5 segundos, amplitude responsiva de 4 a 10px. O acompanhamento considera a matriz animada do peixe mesmo com o ponteiro parado. Movimento reduzido desativa tanto a flutuacao como os olhos.

Interacao do peixe: `FishMascot` exibe uma derivacao vetorial com pupila independente e clipPath dentro do olho. O peixe foi espelhado para olhar a esquerda. O ponteiro e convertido pela matriz do grupo espelhado; a pupila segue com RAF e refs, sem atualizar estado React, limitada a 15 unidades horizontais e 11 verticais. Ao sair da janela, cancelar o ponteiro ou perder foco, retorna ao repouso. Movimento reduzido desativa o acompanhamento. SVG original preservado.

Mascote solicitado: `src/assets/auth/peixe-esqueleto.svg`, extraido diretamente dos caminhos do peixe principal da ficha fornecida pelo usuario. Fundo, legendas, amostras e demais vistas foram removidos; os caminhos e gradientes selecionados permanecem vetoriais. No desktop e tablet, ocupa uma terceira coluna a direita e fica centralizado verticalmente, sem cobrir o formulario. Em celular, aparece pequeno a direita do titulo, com espaco reservado. A ilustracao e decorativa e nao entra na ordem de foco.

Foto atual das telas de autenticacao: `src/assets/auth/morro.jpg`, adicionada pelo usuario e selecionada a seu pedido. Substitui a versao melhorada por IA; mantem o recorte CSS e o texto curvado existentes.

Curvatura refinada a partir da referencia enviada novamente: Caraguatatuba usa raio 2200 e arco de apenas 16 graus, formando uma elevacao suave no centro, com fonte 84 e espacamento 1.5 em unidades SVG. O viewBox acompanha a corda e a flecha do arco para manter o nome largo no topo da foto, sem o espaco vazio de um semicirculo completo. Substitui os parametros anteriores do titulo; o gradiente vertical foi mantido.

`CurvedText` suporta `spacing` (textPath com espacamento), `styled` (tspan por caractere visual) e `animated` (textos independentes posicionados por trigonometria). O modo animado separa rotacao, entrada escalonada e hover em elementos distintos e respeita movimento reduzido. `spacing` e expresso em unidades SVG; no modo animado, converte-se em separacao angular aproximada, limitada a 180 graus. Login e cadastro mantem o modo spacing, raio 250, fonte 40 e espacamento 6 escolhidos no codigo existente.

Atualizacao da fotografia: login e cadastro utilizam `src/assets/auth/caraguatatuba-melhorada.png`, ultima versao ampliada por IA aprovada para substituicao pelo usuario. A original `caraguatatuba.jpg` foi preservada; a versao gerada pode conter diferencas em detalhes e na marca d'agua. O recorte e a composicao CSS permanecem iguais.

- **Fotografia:** `src/assets/auth/caraguatatuba.jpg`, fornecida pelo usuário com metadados de procedência incorporados e marca de autoria preservada. Não substituir a origem por uma atribuição inventada. A imagem tem texto alternativo descrevendo a vista da cidade e da baía a partir do Morro Santo Antônio. Usa `object-fit: cover`, com posição `left center` no desktop e `left top` no celular. O nome da cidade é um link para `/`.
- **Campos:** rótulos associados, preenchimento automático apropriado e validação nativa. O botão de visibilidade usa SVG, rótulo acessível e `aria-pressed`; mantém largura de 44px. O cadastro exige nome de 2 a 100 caracteres, e-mail, senha de 12 a 128 caracteres e confirmação correspondente. O nome de usuário é enviado como `name` à API, sem promessa de identificador único.
- **Envio:** login e cadastro usam a API real por e-mail e senha. Durante a requisição, controles ficam desabilitados com opacidade 0,65 e o formulário usa `aria-busy`; a ação mostra “Entrando…” ou “Criando conta…”. Erros usam `role="alert"` e recebem foco. Após cadastro, a navegação retorna ao login com confirmação e e-mail preenchido.
- **Acesso social:** Google e Facebook permanecem visíveis em botões contornados, com ícones SVG. Cada clique informa em `role="status"` que o provedor ainda não está configurado e orienta usar e-mail e senha; não simula autenticação.
- **Conta conectada:** o login passa a mostrar nome, e-mail, acesso ao jogo e saída da conta. A sessão fica apenas em memória, é validada por `me`, expira automaticamente e permite logout local. A interface não promete persistência após recarregar a página.
- **Navegação:** links alternam login/cadastro; todos os links, botões e campos recebem foco visível. Mensagens longas e e-mail da conta permitem quebra de linha.

## Do's and Don'ts

- **Do:** preservar a composição aprovada e a procedência da foto; conferir seu recorte em desktop e celular quando houver navegador disponível.
- **Do:** manter mensagens de validação próximas ao formulário e estados de carregamento honestos.
- **Do:** manter mudanças futuras desta superfície limitadas ao escopo de autenticação.
- **Don't:** aplicar estes tokens automaticamente à landing page ou ao jogo.
- **Don't:** apresentar Google ou Facebook como integrações funcionais antes de configurar OAuth.
- **Don't:** declarar fidelidade visual comprovada sem inspeção das telas renderizadas.
