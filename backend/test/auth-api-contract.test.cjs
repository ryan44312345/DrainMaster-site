require('reflect-metadata');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes, randomUUID } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const { Module, ValidationPipe } = require('@nestjs/common');
const { NestFactory, APP_GUARD } = require('@nestjs/core');
const { ConfigService } = require('@nestjs/config');
const { JwtModule } = require('@nestjs/jwt');
const { ThrottlerGuard, ThrottlerModule } = require('@nestjs/throttler');
const { PrismaService } = require('../dist/src/prisma.service');
const { AuthService } = require('../dist/src/auth.service');
const { AuthGuard } = require('../dist/src/auth.guard');
const { AuthController } = require('../dist/src/auth.controller');
const { Prisma } = require('../dist/src/generated/prisma/client');

test('cliente frontend conversa por HTTP com controller NestJS, validacao, JWT e limite de tentativas', async () => {
  // Somente a persistencia e simulada. Nenhuma conta e criada no MySQL real.
  const rows = [];
  const select = (row, fields) => !row ? null : fields ? Object.fromEntries(Object.keys(fields).map(key => [key, row[key]])) : row;
  const database = { user: {
    create: async ({ data, select: fields }) => {
      if (rows.some(row => row.email === data.email)) throw new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '7' });
      const row = { ...data, id: randomUUID(), createdAt: new Date() };
      rows.push(row);
      return select(row, fields);
    },
    findUnique: async ({ where, select: fields }) => select(rows.find(row => Object.entries(where).every(([key, value]) => row[key] === value)), fields),
  } };
  class ContractModule {}
  Module({
    imports: [
      JwtModule.register({ secret: randomBytes(48).toString('hex'), signOptions: { algorithm: 'HS256', expiresIn: 900, issuer: 'drainmaster-api', audience: 'drainmaster-web' } }),
      ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ],
    controllers: [AuthController],
    providers: [
      AuthService, AuthGuard,
      { provide: PrismaService, useValue: database },
      { provide: ConfigService, useValue: new ConfigService({ JWT_TTL_SECONDS: 900 }) },
      { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
  })(ContractModule);
  const app = await NestFactory.create(ContractModule, { logger: false });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  const originalFetch = global.fetch;
  try {
    await app.listen(0, '127.0.0.1');
    const origin = await app.getUrl();
    const requests = [];
    global.fetch = (url, options) => {
      requests.push({ url, options });
      return originalFetch(new URL(url, origin), options);
    };
    const { authApi } = await import(pathToFileURL(path.resolve(__dirname, '../../src/lib/auth-api.js')).href);
    const credentials = { email: 'ana@example.com', password: 'uma senha longa para teste' };
    const user = await authApi.register({ ...credentials, name: 'Ana', confirmPassword: 'nao deve ser enviado' });
    assert.equal(user.name, 'Ana');
    assert.equal(user.passwordHash, undefined);
    assert.deepEqual(Object.keys(JSON.parse(requests[0].options.body)).sort(), ['email', 'name', 'password']);
    assert.notEqual(rows[0].passwordHash, credentials.password);
    await assert.rejects(authApi.register({ ...credentials, name: 'Ana' }), /já tem uma conta/);
    await assert.rejects(authApi.login({ ...credentials, password: 'errada' }), /incorretos/);
    const token = await authApi.login(credentials);
    const profile = await authApi.me(token.access_token);
    assert.equal(profile.id, user.id);
    assert.equal(profile.passwordHash, undefined);
    assert.equal(requests.at(-1).options.headers.Authorization, `Bearer ${token.access_token}`);
    await assert.rejects(authApi.me('token-invalido'), /incorretos/);
    await assert.rejects(authApi.register({ name: 'Ana', email: 'invalido', password: 'curta' }), /Confira os dados/);
    await authApi.login(credentials);
    await authApi.login(credentials);
    await authApi.login(credentials);
    await assert.rejects(authApi.login(credentials), /Aguarde um minuto/);
  } finally {
    global.fetch = originalFetch;
    await app.close();
  }
});
