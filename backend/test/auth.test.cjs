require('reflect-metadata');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { ValidationPipe } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { ConfigService } = require('@nestjs/config');
const argon2 = require('argon2');
const { AuthService } = require('../dist/src/auth.service');
const { AuthGuard } = require('../dist/src/auth.guard');
const { LoginDto, RegisterDto } = require('../dist/src/auth.dto');
const { validateEnv } = require('../dist/src/config');
const { Prisma } = require('../dist/src/generated/prisma/client');

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });
const validate = (data, metatype) => pipe.transform(data, { type: 'body', metatype });

test('normaliza email, exige senha longa e rejeita campos extras', async () => {
  const dto = await validate({ name: ' Ana ', email: ' ANA@example.com ', password: 'senha longa de teste' }, RegisterDto);
  assert.equal(dto.email, 'ana@example.com');
  assert.equal(dto.name, 'Ana');
  await assert.rejects(validate({ name: 'Ana', email: 'ana@example.com', password: 'curta' }, RegisterDto));
  await assert.rejects(validate({ email: 'ana@example.com', password: 'senha', role: 'admin' }, LoginDto));
});

test('configuracao vazia falha sem expor a URL', () => {
  assert.throws(() => validateEnv({}), /DATABASE_URL/);
  assert.throws(() => validateEnv({ DATABASE_URL: 'mysql://user@localhost/db', JWT_SECRET: '' }), /JWT_SECRET/);
});

test('aceita MySQL e rejeita outros provedores', () => {
  const env = { DATABASE_URL: 'mysql://user@localhost/db', JWT_SECRET: randomBytes(48).toString('hex') };
  assert.equal(validateEnv(env).DATABASE_URL, env.DATABASE_URL);
  assert.throws(() => validateEnv({ ...env, DATABASE_URL: 'postgresql://user@localhost/db' }), /DATABASE_URL/);
});

test('cadastro gera hash e trata duplicidade concorrente', async () => {
  let data;
  const prisma = { user: { create: async (args) => { data = args.data; return { id: 'id', name: data.name, email: data.email }; } } };
  const service = new AuthService(prisma, {}, {});
  const password = 'senha longa de teste';
  const result = await service.register({ name: 'Ana', email: 'ana@example.com', password });
  assert.equal(await argon2.verify(data.passwordHash, password), true);
  assert.notEqual(data.passwordHash, password);
  assert.equal(result.passwordHash, undefined);
  prisma.user.create = async () => { throw new Prisma.PrismaClientKnownRequestError('duplicate', { code: 'P2002', clientVersion: '7' }); };
  await assert.rejects(service.register({ name: 'Ana', email: 'ana@example.com', password }), e => e.getStatus() === 409);
});

test('login invalido, expiracao e protecao JWT', async () => {
  const jwt = new JwtService({ secret: randomBytes(48).toString('hex'), signOptions: { algorithm: 'HS256', expiresIn: 900, issuer: 'drainmaster-api', audience: 'drainmaster-web' } });
  let user = null;
  const service = new AuthService({ user: { findUnique: async () => user } }, jwt, new ConfigService({ JWT_TTL_SECONDS: 900 }));
  await service.onModuleInit();
  const password = 'senha longa de teste';
  await assert.rejects(service.login({ email: 'ana@example.com', password }), e => e.getStatus() === 401);
  user = { id: 'test-id', passwordHash: await argon2.hash(password) };
  await assert.rejects(service.login({ email: 'ana@example.com', password: 'incorreta' }), e => e.getStatus() === 401);
  const response = await service.login({ email: 'ana@example.com', password });
  const guard = new AuthGuard(jwt);
  const request = { headers: {} };
  const context = { switchToHttp: () => ({ getRequest: () => request }) };
  await assert.rejects(guard.canActivate(context), e => e.getStatus() === 401);
  request.headers.authorization = `Bearer ${response.access_token}`;
  assert.equal(await guard.canActivate(context), true);
  assert.equal(request.userId, 'test-id');
  request.headers.authorization = `Bearer ${await jwt.signAsync({ sub: 'test-id' }, { expiresIn: -1 })}`;
  await assert.rejects(guard.canActivate(context), e => e.getStatus() === 401);
  request.headers.authorization = 'Bearer adulterado';
  await assert.rejects(guard.canActivate(context), e => e.getStatus() === 401);
});
