import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/UI';

export function LoginPage({ onNavigate, toast }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      // Mock login — replace with: const res = await authAPI.login(form);
      await new Promise(r => setTimeout(r, 900));
      const mockUser = {
        id: 1, username: form.username,
        role: form.username === 'admin' ? 'ADMIN' : 'USER',
        email: `${form.username}@example.com`,
      };
      login('mock-jwt-token', mockUser);
      toast.success(`Welcome back, ${form.username}!`);
      onNavigate('problems');
    } catch {
      toast.error('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 56px)', background: 'var(--cj-bg)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="cj-brand-icon mx-auto mb-3" style={{ width: 48, height: 48, fontSize: 22 }}>⚡</div>
          <h4 className="fw-bold mb-1">Welcome back</h4>
          <p style={{ color: 'var(--cj-muted)', fontSize: '0.875rem' }}>Sign in to your CodeJudge account</p>
        </div>

        <div className="cj-card p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="cj-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"
                  style={{ background: 'var(--cj-bg-input)', border: '1px solid var(--cj-border)', borderRight: 'none', color: 'var(--cj-muted)' }}>
                  <i className="bi bi-person"></i>
                </span>
                <input className="cj-input form-control" placeholder="Enter username"
                  value={form.username} onChange={set('username')}
                  style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="cj-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"
                  style={{ background: 'var(--cj-bg-input)', border: '1px solid var(--cj-border)', borderRight: 'none', color: 'var(--cj-muted)' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input className="cj-input form-control" type="password" placeholder="Enter password"
                  value={form.password} onChange={set('password')}
                  style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-brand w-100 mb-3" disabled={loading}>
              {loading ? <Spinner /> : <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>}
            </button>
            <div className="text-center" style={{ fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
              Don't have an account?{' '}
              <button type="button" className="btn p-0 border-0" onClick={() => onNavigate('register')}
                style={{ color: 'var(--cj-brand)', fontSize: '0.8rem', textDecoration: 'underline' }}>
                Sign up
              </button>
            </div>
          </form>

          {/* Demo hint */}
          <div className="mt-3 p-2 rounded-2 text-center"
            style={{ background: 'rgba(124,109,250,.08)', border: '1px solid rgba(124,109,250,.2)', fontSize: '0.75rem', color: 'var(--cj-muted)' }}>
            <i className="bi bi-info-circle me-1"></i>
            Demo: use <b style={{ color: 'var(--cj-text)' }}>admin</b> for admin role, any username for user
          </div>
        </div>
      </div>
    </div>
  );
}


// src/pages/RegisterPage.jsx
export function RegisterPage({ onNavigate, toast }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) { toast.error('All fields are required.'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      const mockUser = { id: 2, username: form.username, role: 'USER', email: form.email };
      login('mock-jwt-token', mockUser);
      toast.success(`Account created! Welcome, ${form.username}!`);
      onNavigate('problems');
    } catch {
      toast.error('Registration failed. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { k: 'username', label: 'Username', type: 'text', icon: 'bi-person', placeholder: 'Choose a username' },
    { k: 'email', label: 'Email Address', type: 'email', icon: 'bi-envelope', placeholder: 'you@example.com' },
    { k: 'password', label: 'Password', type: 'password', icon: 'bi-lock', placeholder: 'Min 6 characters' },
    { k: 'confirm', label: 'Confirm Password', type: 'password', icon: 'bi-lock-fill', placeholder: 'Repeat password' },
  ];

  return (
    <div className="d-flex align-items-center justify-content-center"
      style={{ minHeight: 'calc(100vh - 56px)', background: 'var(--cj-bg)', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <div className="text-center mb-4">
          <div className="cj-brand-icon mx-auto mb-3" style={{ width: 48, height: 48, fontSize: 22 }}>⚡</div>
          <h4 className="fw-bold mb-1">Create account</h4>
          <p style={{ color: 'var(--cj-muted)', fontSize: '0.875rem' }}>Join CodeJudge and start solving</p>
        </div>

        <div className="cj-card p-4">
          <form onSubmit={handleSubmit}>
            {fields.map(f => (
              <div key={f.k} className="mb-3">
                <label className="cj-label">{f.label}</label>
                <div className="input-group">
                  <span className="input-group-text"
                    style={{ background: 'var(--cj-bg-input)', border: '1px solid var(--cj-border)', borderRight: 'none', color: 'var(--cj-muted)' }}>
                    <i className={`bi ${f.icon}`}></i>
                  </span>
                  <input className="cj-input form-control" type={f.type} placeholder={f.placeholder}
                    value={form[f.k]} onChange={set(f.k)}
                    style={{ borderLeft: 'none', borderRadius: '0 8px 8px 0' }} />
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-brand w-100 mb-3 mt-1" disabled={loading}>
              {loading ? <Spinner /> : <><i className="bi bi-person-plus me-2"></i>Create Account</>}
            </button>
            <div className="text-center" style={{ fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
              Already have an account?{' '}
              <button type="button" className="btn p-0 border-0" onClick={() => onNavigate('login')}
                style={{ color: 'var(--cj-brand)', fontSize: '0.8rem', textDecoration: 'underline' }}>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}