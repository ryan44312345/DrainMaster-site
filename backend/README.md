# DrainMaster API

Backend NestJS 11, Prisma 7 e MySQL. Requer Node 22.12+ (ou Node 24) e MySQL 8. O frontend React esta conectado pelas telas /login e /cadastro; em desenvolvimento o Vite encaminha /api para localhost:3000.

## Configurar

Execute nesta pasta (`C:/Users/cg3037568/Documents/DrainMaster/backend`):

```powershell
npm install
```

O `.env` local ja foi criado com valores sensiveis vazios. Em uma nova copia, execute `Copy-Item .env.example .env`. Preencha:

- `DATABASE_URL`: formato `mysql://USUARIO:SENHA@HOST:3306/NOME_DO_BANCO`. Crie antes o banco vazio. Use percent-encoding na senha e no usuario quando houver caracteres especiais.
- `JWT_SECRET`: gere localmente com `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"` e cole o resultado somente no `.env`.
- `FRONTEND_ORIGIN`: origem exata do frontend, sem barra final.

Nao coloque segredos em variaveis `VITE_*`: elas sao publicas. O `.gitignore` exclui os arquivos `.env`, dependencias e cliente gerado.

```powershell
npm run prisma:validate
npm run prisma:generate
npm run db:deploy
npm run dev
```

`db:deploy` aplica a migracao versionada que cria `users`. Para futuras alteracoes no schema, use `npm run db:migrate -- --name nome_da_alteracao` em desenvolvimento e versione a migracao criada. `npm run dev` compila e inicia; reinicie depois de editar TypeScript. Para producao: `npm run build` e `npm start`.

Para criar o banco vazio, execute no MySQL Workbench ou terminal MySQL:

```sql
CREATE DATABASE drainmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

A migracao inicial usa MySQL. Se voce criou um banco PostgreSQL, esta alteracao nao transfere os dados. Atualize DATABASE_URL no `.env` para o MySQL.

## Rotas

API local: `http://localhost:3000/api`. Envie JSON com `Content-Type: application/json`.

| Metodo | Rota | Dados / resultado |
| --- | --- | --- |
| POST | /auth/register | `{ "name": "Ana", "email": "ana@example.com", "password": "uma senha longa escolhida" }`; retorna usuario sem hash (201) |
| POST | /auth/login | `{ "email": "ana@example.com", "password": "uma senha longa escolhida" }`; retorna `access_token`, `token_type`, `expires_in` (200) |
| GET | /auth/me | Header `Authorization: Bearer SEU_TOKEN`; retorna usuario sem hash |

Senhas de cadastro: 12 a 128 caracteres. E-mails sao normalizados para minusculas. Campos desconhecidos sao rejeitados. Erros: 400 dados invalidos; 401 credenciais/token invalidos; 409 cadastro conflitante; 429 excesso de requisicoes. Cadastro nao autentica automaticamente: realize login em seguida.

O token expira em 15 minutos por padrao. O frontend mantem a sessao apenas em memoria, sem localStorage ou URLs; recarregar a pagina exige novo login. Logout local consiste em descartar o token; um token ja emitido permanece valido ate expirar. Nao ha refresh token, recuperacao de senha nem verificacao de email nesta entrega.

## Seguranca e operacao

- Argon2id com salt automatico; senha e hash nao aparecem nas respostas.
- JWT HS256 com validade, emissor e audiencia verificados; segredo obrigatorio no ambiente.
- Limite de 5 requisicoes/minuto/IP em cada rota de login e cadastro; demais rotas 60/minuto/IP. Armazenamento do limite em memoria: com multiplas instancias, adote armazenamento compartilhado.
- Helmet, JSON limitado a 16 KB, CORS com origem explicita, respostas de autenticacao com `Cache-Control: no-store`.
- Em producao, use HTTPS no proxy e `NODE_ENV=production`; o driver exige TLS com certificado valido no MySQL. Para certificado privado, configure a CA confiavel no ambiente do Node (`NODE_EXTRA_CA_CERTS`). A conexao em producao habilita TLS com rejectUnauthorized: true no driver MariaDB. Parametros de query da URL nao configuram o driver; use os campos de conexao documentados.
- Use usuario MySQL com privilegios minimos; separe a conta de migracao da conta de execucao. Nao habilite `trust proxy` sem definir os proxies confiaveis da sua infraestrutura.
- A unicidade de email pode ser inferida pelo resultado do cadastro. Para um portal que exija ocultar existencia de contas, adicione um fluxo de confirmacao por email com resposta uniforme.

## Verificacao

`npm test` compila e executa testes de validacao, hash, duplicidade e JWT, alem do contrato HTTP entre o cliente frontend e um servidor NestJS real, usando persistencia simulada. Esses testes nao substituem teste de integracao com MySQL. A tabela users existente e a conexao foram conferidas. Uma conta temporaria confirmou cadastro, login e perfil protegido no MySQL real, sendo removida ao final; a migracao nao foi reaplicada.

## Documentacao oficial consultada

- [NestJS: autenticacao](https://docs.nestjs.com/security/authentication)
- [NestJS: validacao](https://docs.nestjs.com/techniques/validation)
- [NestJS: limite de requisicoes](https://docs.nestjs.com/security/rate-limiting)
- [Prisma 7: MySQL e driver adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/mysql)

Validacao nesta entrega: backend compilado e seis testes aprovados. Neste ambiente Windows o isolamento por subprocesso foi bloqueado; os testes foram executados com `node --test --test-isolation=none test/*.test.cjs`. Os seis testes usam persistencia simulada. Uma verificacao adicional confirmou cadastro, login e perfil protegido no MySQL real; a conta temporaria foi removida. A migracao nao foi reaplicada.
