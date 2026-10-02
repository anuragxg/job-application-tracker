import { useState } from 'react';
import axios from 'axios';

const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// `mode` drives which form is shown. This is a small state machine instead of
// separate pages, since all these screens share the same card/layout.
// login -> register -> forgot-request -> forgot-reset -> otp-request -> otp-verify
function Auth({ onLogin, theme, onToggleTheme }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const resetMessages = () => { setError(''); setInfoMsg(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    try {
      if (mode === 'register') {
        await axios.post(`${AUTH_URL}/register`, { username, email, password });
        setInfoMsg('Account created — now log in.');
        setMode('login');
      } else if (mode === 'login') {
        const res = await axios.post(`${AUTH_URL}/login`, { username, password });
        onLogin(res.data.token, res.data.username);
      } else if (mode === 'forgot-request') {
        const res = await axios.post(`${AUTH_URL}/forgot-password`, { email });
        setInfoMsg(res.data.message);
        setMode('forgot-reset');
      } else if (mode === 'forgot-reset') {
        const res = await axios.post(`${AUTH_URL}/reset-password`, { email, otp, newPassword });
        setInfoMsg(res.data.message);
        setMode('login');
      } else if (mode === 'otp-request') {
        const res = await axios.post(`${AUTH_URL}/send-login-otp`, { email });
        setInfoMsg(res.data.message);
        setMode('otp-verify');
      } else if (mode === 'otp-verify') {
        const res = await axios.post(`${AUTH_URL}/verify-login-otp`, { email, otp });
        onLogin(res.data.token, res.data.username);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const titles = {
    login: 'Log in',
    register: 'Create an account',
    'forgot-request': 'Reset your password',
    'forgot-reset': 'Enter the code we sent',
    'otp-request': 'Log in with email',
    'otp-verify': 'Enter the code we sent',
  };

  return (
    <div className="auth-wrapper">
      <button className="auth-theme-toggle" onClick={onToggleTheme}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{titles[mode]}</h2>
        {error && <p className="error-message">{error}</p>}
        {infoMsg && <p className="info-message">{infoMsg}</p>}

        {/* Username — only for password login/register */}
        {(mode === 'login' || mode === 'register') && (
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        )}

        {/* Email — for register, and every email-based flow */}
        {(mode === 'register' || mode === 'forgot-request' || mode === 'forgot-reset' || mode === 'otp-request' || mode === 'otp-verify') && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={mode === 'forgot-reset' || mode === 'otp-verify'}
          />
        )}

        {/* Password — login/register only, with show/hide */}
        {(mode === 'login' || mode === 'register') && (
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="password-toggle-btn" onClick={() => setShowPassword((p) => !p)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        )}

        {/* OTP code — forgot-reset and otp-verify */}
        {(mode === 'forgot-reset' || mode === 'otp-verify') && (
          <input placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
        )}

        {/* New password — only when resetting */}
        {mode === 'forgot-reset' && (
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        )}

        <button type="submit">
          {mode === 'login' && 'Log In'}
          {mode === 'register' && 'Sign Up'}
          {mode === 'forgot-request' && 'Send reset code'}
          {mode === 'forgot-reset' && 'Reset password'}
          {mode === 'otp-request' && 'Send login code'}
          {mode === 'otp-verify' && 'Verify & log in'}
        </button>

        {/* Links under the form, different per mode */}
        {mode === 'login' && (
          <p className="auth-toggle">
            <span onClick={() => { setMode('forgot-request'); resetMessages(); }}>Forgot password?</span>
            {' · '}
            <span onClick={() => { setMode('otp-request'); resetMessages(); }}>Log in with email instead</span>
          </p>
        )}
        {mode === 'login' && (
          <p className="auth-toggle">
            Don't have an account?{' '}
            <span onClick={() => { setMode('register'); resetMessages(); }}>Sign up</span>
          </p>
        )}
        {mode === 'register' && (
          <p className="auth-toggle">
            Already have an account?{' '}
            <span onClick={() => { setMode('login'); resetMessages(); }}>Log in</span>
          </p>
        )}
        {(mode === 'forgot-request' || mode === 'forgot-reset' || mode === 'otp-request' || mode === 'otp-verify') && (
          <p className="auth-toggle">
            <span onClick={() => { setMode('login'); resetMessages(); }}>Back to log in</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default Auth;
