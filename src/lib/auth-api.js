const API_BASE = (import.meta.env?.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, { token, body, method = 'GET' } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}/auth/${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
      cache: 'no-store',
      credentials: 'omit',
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente novamente em instantes.');
  }
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const messages = {
      400: 'Confira os dados informados. A senha do cadastro deve ter entre 12 e 128 caracteres.',
      401: 'E-mail ou senha incorretos. Confira seus dados e tente novamente.',
      409: 'Não foi possível criar a conta com esses dados. Se você já tem uma conta, faça login.',
      429: 'Muitas tentativas. Aguarde um minuto e tente novamente.',
    };
    throw new Error(messages[response.status] || 'O servidor está indisponível. Tente novamente em instantes.');
  }
  if (!data) throw new Error('O servidor retornou uma resposta inesperada. Tente novamente.');
  return data;
}

export const authApi = {
  register: ({ name, email, password }) => request('register', { method: 'POST', body: { name, email, password } }),
  login: ({ email, password }) => request('login', { method: 'POST', body: { email, password } }),
  me: (token) => request('me', { token }),
};
