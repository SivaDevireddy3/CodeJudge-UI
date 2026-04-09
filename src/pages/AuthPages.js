import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/UI';
import { authAPI, getErrorMessage } from '../services/api';

export function LoginPage({ onNavigate, toast }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login({ username: form.username.trim(), password: form.password });
      const data = res.data;
      login(data.token, {
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        displayName: data.displayName,
      });
      toast.success(`Welcome back, ${data.username}!`);
      onNavigate('problems');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 58px)', background: 'var(--cj-bg)', padding: '2rem 1rem' }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div className="cj-brand-icon mx-auto mb-3" style={{ width: 52, height: 52, fontSize: 24 }}>⚡</div>
          <h4 className="fw-bold mb-1">Welcome back</h4>
          <p style={{ color: 'var(--cj-muted)', fontSize: '0.875rem' }}>Sign in to your CodeJudge account</p>
        </div>

        <div className="cj-card p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="cj-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person" /></span>
                <input
                  className="cj-input form-control"
                  style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                  placeholder="Enter username"
                  value={form.username}
                  onChange={set('username')}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="cj-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock" /></span>
                <input
                  className="cj-input form-control"
                  style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-brand w-100 mb-3" disabled={loading}>
              {loading
                ? <><Spinner className="me-2" />Signing in…</>
                : <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>}
            </button>

            <div className="text-center" style={{ fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                className="btn p-0 border-0"
                style={{ color: 'var(--cj-brand)', fontSize: '0.82rem' }}
                onClick={() => onNavigate('register')}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage({ onNavigate, toast }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirm } = form;
    if (!username.trim() || !email.trim() || !password) {
      toast.error('All fields are required.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        username: username.trim(),
        email: email.trim(),
        password,
        displayName: username.trim(),
      });
      const data = res.data;
      login(data.token, {
        id: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
        displayName: data.displayName,
      });
      toast.success(`Account created! Welcome, ${data.username}!`);
      onNavigate('problems');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { k: 'username', label: 'Username', type: 'text', icon: 'bi-person', placeholder: 'Choose a username', autoComplete: 'username' },
    { k: 'email', label: 'Email Address', type: 'email', icon: 'bi-envelope', placeholder: 'you@example.com', autoComplete: 'email' },
    { k: 'password', label: 'Password', type: 'password', icon: 'bi-lock', placeholder: 'Min 6 characters', autoComplete: 'new-password' },
    { k: 'confirm', label: 'Confirm Password', type: 'password', icon: 'bi-lock-fill', placeholder: 'Repeat your password', autoComplete: 'new-password' },
  ];

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 58px)', background: 'var(--cj-bg)', padding: '2rem 1rem' }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-4">
          <div className="cj-brand-icon mx-auto mb-3" style={{ width: 52, height: 52, fontSize: 24 }}>⚡</div>
          <h4 className="fw-bold mb-1">Create account</h4>
          <p style={{ color: 'var(--cj-muted)', fontSize: '0.875rem' }}>Join CodeJudge and start solving</p>
        </div>

        <div className="cj-card p-4">
          <form onSubmit={handleSubmit} noValidate>
            {fields.map((f) => (
              <div key={f.k} className="mb-3">
                <label className="cj-label">{f.label}</label>
                <div className="input-group">
                  <span className="input-group-text"><i className={`bi ${f.icon}`} /></span>
                  <input
                    className="cj-input form-control"
                    style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }}
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.k]}
                    onChange={set(f.k)}
                    autoComplete={f.autoComplete}
                  />
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-brand w-100 mb-3 mt-1" disabled={loading}>
              {loading
                ? <><Spinner className="me-2" />Creating account…</>
                : <><i className="bi bi-person-plus me-2" />Create Account</>}
            </button>

            <div className="text-center" style={{ fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                className="btn p-0 border-0"
                style={{ color: 'var(--cj-brand)', fontSize: '0.82rem' }}
                onClick={() => onNavigate('login')}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}