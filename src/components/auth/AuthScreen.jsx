import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../lib/auth-api';
import { CurvedText } from '../CurvedText';
import cityPhoto from '../../assets/auth/morro.jpg';
import { FishMascot } from './FishMascot';
import './auth.css';

function PasswordField({ id, label, confirm = false, onChange, disabled }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-password">
        <input id={id} name={id} type={visible ? 'text' : 'password'} required
          autoComplete={confirm || id === 'new-password' ? 'new-password' : 'current-password'}
          minLength={id === 'password' ? 1 : 12} maxLength={128} placeholder="••••••••"
          aria-describedby={id === 'new-password' ? 'password-hint' : undefined}
          onChange={onChange} disabled={disabled} />
        <button className="auth-visibility" type="button" onClick={() => setVisible(!visible)}
          aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`} aria-pressed={visible} disabled={disabled}>
          {visible ? <EyeOff size={18} strokeWidth={1.6} /> : <Eye size={18} strokeWidth={1.6} />}
        </button>
      </div>
    </div>
  );
}

export default function AuthScreen({ register = false }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const errorRef = useRef(null);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = `${register ? 'Cadastro' : 'Login'} | DrainMaster`;
  }, [register]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (pending) return;
    setError('');
    setNotice('');
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get('email')).trim().toLowerCase();
    const password = String(values.get(register ? 'new-password' : 'password'));
    if (register && String(values.get('name')).trim().length < 2) {
      setError('Informe um nome de usuário com pelo menos 2 caracteres.');
      return;
    }
    if (register && password !== values.get('confirm-password')) {
      setError('As senhas não coincidem. Confira a confirmação de senha.');
      return;
    }
    setPending(true);
    try {
      if (register) {
        await authApi.register({ name: String(values.get('name')).trim(), email, password });
        form.reset();
        navigate('/login', { replace: true, state: { registered: true, email } });
      } else {
        await login({ email, password });
        form.reset();
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page">
      <div className={`auth-layout${register ? ' auth-layout--register' : ''}`}>
        <div className="auth-photo">
          <img src={cityPhoto} alt="Vista da cidade e da baía de Caraguatatuba a partir do Morro Santo Antônio" fetchPriority="high" />
          <Link to="/" className="auth-city" aria-label="Caraguatatuba — voltar ao início">
            <CurvedText text="Caraguatatuba" radius={2200} arcAngle={16} fontSize={84}
              direction="up" mode="spacing" spacing={1.5} gradient={['#ffffff', '#8ec5df']} />
          </Link>
        </div>
        <section className="auth-content" aria-labelledby="auth-heading">
          {user && !register ? (
            <div className="auth-account">
              <h1 id="auth-heading">Você está conectado</h1>
              <p role="status">Bem-vindo, {user.name}.</p>
              <p className="auth-account-email">{user.email}</p>
              <Link to="/jogo" className="auth-submit">Acessar o jogo</Link>
              <button type="button" className="auth-text-button" onClick={logout}>Sair da conta</button>
            </div>
          ) : (
            <>
              <h1 id="auth-heading">{register ? 'Crie sua conta' : 'Entre na sua conta'}</h1>
              <form className="auth-form" onSubmit={handleSubmit} aria-busy={pending}>
                {!register && location.state?.registered && <p className="auth-feedback auth-feedback--success" role="status">Conta criada! Entre com seu e-mail e senha.</p>}
                {register && (
                  <div className="auth-field">
                    <label htmlFor="name">Nome de usuário</label>
                    <input id="name" name="name" autoComplete="nickname" placeholder="Seu nome de usuário" required minLength={2} maxLength={100} disabled={pending} />
                  </div>
                )}
                <div className="auth-field">
                  <label htmlFor="email">Seu e-mail</label>
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@email.com.br"
                    defaultValue={!register ? location.state?.email ?? '' : ''} required maxLength={254} disabled={pending} />
                </div>
                <PasswordField id={register ? 'new-password' : 'password'} label="Senha" disabled={pending} />
                {register && <p className="auth-hint" id="password-hint">Use de 12 a 128 caracteres.</p>}
                {register && <PasswordField id="confirm-password" label="Confirmar senha" confirm disabled={pending}
                  onChange={() => { if (error) setError(''); }} />}
                {error && <p className="auth-feedback auth-feedback--error" role="alert" tabIndex={-1} ref={errorRef}>{error}</p>}
                <button type="submit" className="auth-submit" disabled={pending}>
                  {pending ? (register ? 'Criando conta…' : 'Entrando…') : (register ? 'Começar Agora' : 'Entrar')}
                </button>
              </form>
              <div className="auth-divider"><span>ou continue com</span></div>
              <div className="auth-socials">
                <button type="button" onClick={() => setNotice('O acesso com Google ainda não está configurado. Use seu e-mail e senha.')} disabled={pending}><FaGoogle aria-hidden="true" />Google</button>
                <button type="button" onClick={() => setNotice('O acesso com Facebook ainda não está configurado. Use seu e-mail e senha.')} disabled={pending}><FaFacebookF aria-hidden="true" />Facebook</button>
              </div>
              {notice && <p className="auth-feedback" role="status">{notice}</p>}
              <p className="auth-switch">
                {register ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
                <Link to={register ? '/login' : '/cadastro'}>{register ? 'Fazer login' : 'Cadastre-se'}</Link>
              </p>
            </>
          )}
        </section>
        <FishMascot className="auth-mascot" />
      </div>
    </main>
  );
}
