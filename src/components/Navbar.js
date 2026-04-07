// src/components/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, onNavigate }) {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  const links = [
    { id: 'home', label: 'Home', icon: 'bi-house-fill' },
    { id: 'problems', label: 'Problems', icon: 'bi-code-square' },
    { id: 'submissions', label: 'Submissions', icon: 'bi-clock-history' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'bi-trophy-fill' },
    { id: 'profile', label: 'Profile', icon: 'bi-person-circle' },
  ];
  if (isAdmin) links.push({ id: 'admin', label: 'Admin', icon: 'bi-shield-lock-fill' });

  const go = (id) => { onNavigate(id); setOpen(false); };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg cj-navbar" ref={navRef}>
      <div className="container-fluid px-3 px-md-4 d-flex align-items-center">
        {/* Brand */}
        <button
          className="navbar-brand btn p-0 border-0 d-flex align-items-center gap-2"
          onClick={() => go('home')}
          aria-label="CodeJudge Home"
        >
          <div className="cj-brand-icon">⚡</div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
            CodeJudge
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="d-none d-lg-flex align-items-center gap-1 ms-4">
          {links.map((l) => (
            <button
              key={l.id}
              className={`nav-link btn border-0 d-flex align-items-center gap-2${page === l.id ? ' active' : ''}`}
              onClick={() => go(l.id)}
            >
              <i className={`bi ${l.icon}`} style={{ fontSize: 13 }} />
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side — desktop */}
        <div className="d-none d-lg-flex align-items-center gap-2 ms-auto">
          {isLoggedIn ? (
            <>
              <div className="cj-nav-user" onClick={() => go('profile')}>
                <div className="cj-nav-avatar">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--cj-text)', fontWeight: 500 }}>
                  {user?.username}
                </span>
                {isAdmin && (
                  <span
                    className="cj-badge"
                    style={{
                      background: 'rgba(240,80,96,.12)',
                      color: 'var(--cj-red)',
                      border: '1px solid rgba(240,80,96,.25)',
                      fontSize: '0.65rem',
                      padding: '1px 7px',
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <button className="btn btn-outline-cj btn-sm" onClick={logout}>
                <i className="bi bi-box-arrow-right me-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-cj btn-sm" onClick={() => go('login')}>
                Sign In
              </button>
              <button className="btn btn-brand btn-sm px-3" onClick={() => go('register')}>
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile: right side compact + toggler */}
        <div className="d-flex d-lg-none align-items-center gap-2 ms-auto">
          {isLoggedIn && (
            <div className="cj-nav-avatar" onClick={() => go('profile')} style={{ cursor: 'pointer' }}>
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="d-lg-none">
          <div
            className="navbar-collapse show"
            style={{ padding: '0 12px 12px' }}
          >
            <ul className="navbar-nav" style={{ gap: 2 }}>
              {links.map((l) => (
                <li key={l.id} className="nav-item">
                  <button
                    className={`nav-link btn border-0 w-100 text-start d-flex align-items-center gap-2${page === l.id ? ' active' : ''}`}
                    onClick={() => go(l.id)}
                  >
                    <i className={`bi ${l.icon}`} style={{ fontSize: 14, width: 18 }} />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>

            <div
              className="mt-2 pt-2"
              style={{ borderTop: '1px solid var(--cj-border)', display: 'flex', gap: 8 }}
            >
              {isLoggedIn ? (
                <>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--cj-muted)',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <i className="bi bi-person-fill" style={{ color: 'var(--cj-brand)' }} />
                    {user?.username}
                    {isAdmin && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--cj-red)', fontWeight: 700 }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                  <button className="btn btn-outline-cj btn-sm" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-outline-cj btn-sm flex-1 w-50" onClick={() => go('login')}>
                    Sign In
                  </button>
                  <button className="btn btn-brand btn-sm flex-1 w-50" onClick={() => go('register')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}