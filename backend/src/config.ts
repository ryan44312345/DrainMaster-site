export function validateEnv(env: Record<string, unknown>) {
  const databaseUrl = String(env.DATABASE_URL ?? '');
  try {
    const url = new URL(databaseUrl);
    if (url.protocol !== 'mysql:' || !url.hostname || !url.username || url.pathname.length < 2) throw new Error();
  } catch {
    throw new Error('Preencha DATABASE_URL no .env com uma URL MySQL valida.');
  }
  const secret = String(env.JWT_SECRET ?? '');
  if (Buffer.byteLength(secret) < 32 || secret.trim() !== secret) {
    throw new Error('JWT_SECRET deve conter pelo menos 32 bytes aleatorios, sem espacos nas extremidades.');
  }
  const port = Number(env.PORT ?? 3000);
  const ttl = Number(env.JWT_TTL_SECONDS ?? 900);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT invalida.');
  if (!Number.isInteger(ttl) || ttl < 60 || ttl > 3600) throw new Error('JWT_TTL_SECONDS deve estar entre 60 e 3600.');
  const mode = String(env.NODE_ENV ?? 'development');
  if (!['development', 'test', 'production'].includes(mode)) throw new Error('NODE_ENV invalido.');
  const origin = String(env.FRONTEND_ORIGIN ?? 'http://localhost:5173');
  try {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin || url.username || url.password) throw new Error();
    if (mode === 'production' && url.protocol !== 'https:') throw new Error();
  } catch { throw new Error('FRONTEND_ORIGIN deve ser uma origem exata; em producao, use HTTPS.'); }
  return { ...env, DATABASE_URL: databaseUrl, JWT_SECRET: secret, PORT: port, JWT_TTL_SECONDS: ttl, FRONTEND_ORIGIN: origin, NODE_ENV: mode };
}
