import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/auth-api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => setSession(null), Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(timer);
  }, [session]);

  async function login(credentials) {
    const result = await authApi.login(credentials);
    if (typeof result.access_token !== 'string' || !Number.isFinite(result.expires_in) || result.expires_in <= 0) {
      throw new Error('O servidor retornou uma sessão inválida. Tente novamente.');
    }
    const user = await authApi.me(result.access_token);
    setSession({ user, token: result.access_token, expiresAt: Date.now() + result.expires_in * 1000 });
  }

  return <AuthContext.Provider value={{ user: session?.user ?? null, login, logout: () => setSession(null) }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth deve estar dentro de AuthProvider.');
  return value;
}
