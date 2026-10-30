# DrainMaster

Site React/Vite com telas de login e cadastro conectadas ao backend NestJS, Prisma e MySQL.

## Executar

Requer Node 22.12+ ou Node 24 e MySQL iniciado. Configure `backend/.env` conforme o [guia da API](backend/README.md). As credenciais e o JWT_SECRET ficam somente nesse arquivo, ignorado pelo Git.

Primeiro terminal:

```powershell
cd C:\Users\cg3037568\Documents\DrainMaster\backend
npm install
npm run db:deploy
npm run dev
```

Segundo terminal:

```powershell
cd C:\Users\cg3037568\Documents\DrainMaster
npm install
npm run dev
```

Abra a URL mostrada pelo Vite, normalmente `http://localhost:5173/login` ou `http://localhost:5173/cadastro`.

O Vite encaminha `/api` para `http://localhost:3000`. Se mudar a porta da API, ajuste o proxy em `vite.config.js`. Para hospedar, configure um proxy `/api` para o backend ou defina `VITE_API_URL` antes do build. Essa variavel e publica; nunca coloque credenciais nela. A API deve liberar a origem exata do frontend em `FRONTEND_ORIGIN`.

## Autenticacao

- Cadastro envia nome de usuario, e-mail e senha; a confirmacao e validada no frontend e nao e enviada. O nome corresponde ao campo `name` da API, sem exigencia de unicidade. O login usa e-mail.
- Senhas de cadastro tem entre 12 e 128 caracteres. O cadastro concluido leva ao login, com confirmacao e e-mail preenchido.
- Login confirma a sessao pela rota protegida `/api/auth/me`. A tela mostra o usuario, acesso ao jogo e opcao de sair. O cabecalho passa a mostrar Minha conta.
- JWT mantido apenas em memoria, com expiracao automatica. Recarregar a pagina exige novo login. Sair descarta a sessao local; tokens emitidos permanecem validos ate expirar.
- Google e Facebook seguem a referencia visual, mas OAuth ainda nao foi configurado: os botoes informam isso ao serem acionados. Use e-mail e senha.

## Design e fotografia

O peixe decorativo a direita foi extraido do SVG `Ficha de Personagem Peixe Esqueleto.svg` fornecido pelo usuario. O arquivo `src/assets/auth/peixe-esqueleto.svg` contem apenas o peixe principal, sem o restante da ficha, com fundo transparente. A origem esta registrada no arquivo JSON ao lado do SVG.

O peixe atual usa `FishMascot`: virado para a esquerda, com pupila acompanhando o ponteiro em toda a pagina. A derivacao `peixe-esqueleto-interativo.svg` separa a pupila e limita seu movimento ao olho. O SVG estatico original permanece preservado. A animacao respeita a preferencia por movimento reduzido.

Os dois olhos agora acompanham o ponteiro e o peixe flutua suavemente para cima e para baixo. Cada pupila possui seu proprio limite; a flutuacao tambem respeita movimento reduzido.

Pupilas arredondadas com maior alcance para a direita da tela. Barbatanas laterais e cauda se movem suavemente com animacao SVG, preservando as formas originais por recortes. Todas as animacoes param com a preferencia por movimento reduzido.

As articulacoes possuem bases fixas e preenchimento vetorial por tras das barbatanas e da cauda, para nao abrir recortes transparentes no corpo durante o movimento.

Correcao visual das bases: as camadas de suporte restauram a arte original na mesma posicao, sem copiar pintura de outra regiao nem aplicar cores solidas sobre o fundo transparente.

A foto atual de login e cadastro e `src/assets/auth/morro.jpg`, fornecida e selecionada pelo usuario. As versoes anteriores permanecem preservadas.

As duas telas seguem a captura fornecida pelo usuario: fotografia de Caraguatatuba a esquerda, formulario branco a direita e acao azul petroleo. No cadastro foram acrescentados nome de usuario e confirmar senha. Em celular, a fotografia fica acima do formulario.

Foto original enviada pelo usuario: `3aaaba4c-87b2-4a2e-9bf4-5247ccb4fe6d.jpg`, copiada para `src/assets/auth/caraguatatuba.jpg`, com marca de autoria preservada e origem registrada nos metadados. Nao e uma fotografia de autoria do projeto. A referencia fornecida esta em `.impeccable/review/reference.png`.

Login e cadastro agora exibem `src/assets/auth/caraguatatuba-melhorada.png`, a ultima versao ampliada por IA solicitada pelo usuario. A original continua preservada. A versao gerada pode apresentar pequenas diferencas nos detalhes e na marca d'agua.

## Verificacao

Componente reutilizavel adicional: `src/components/CurvedTextInteractive.jsx` com CSS ao lado. Possui modos `proximity`, `rotate` e `follow`, coordenadas convertidas para o viewBox, animacao por refs/RAF e suporte a movimento reduzido. Exemplo: `<CurvedTextInteractive text="Caraguatatuba" mode="proximity" />`. O componente foi entregue separadamente; o titulo das telas existentes continua usando CurvedText.

```powershell
npm run build
```

No backend:

```powershell
npm test
```

Builds frontend/backend e seis testes de autenticacao/contrato HTTP passaram. O teste HTTP automatizado usa cliente frontend e controller NestJS reais, com persistencia simulada. Uma verificacao adicional no MySQL real confirmou cadastro (201), login (200), perfil autenticado (200) e bloqueio sem token (401); a conta temporaria foi removida ao final. O detector Impeccable nao encontrou alertas nos novos componentes e o registro de origem da fotografia foi conferido.

A abertura de navegador foi bloqueada pelas permissoes do ambiente: desktop, celular, controles renderizados e fidelidade pixel a pixel ainda precisam de verificacao visual. A revisao de fonte nao substitui esses testes. O build aponta um aviso de tamanho no bundle geral existente.
