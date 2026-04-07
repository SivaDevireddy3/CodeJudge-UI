// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ page, onNavigate }) {
  const { user, logout, isAdmin, isLoggedIn } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  const links = [
    { id: 'home', label: 'Home', icon: 'bi-house' },
    { id: 'problems', label: 'Problems', icon: 'bi-code-square' },
    { id: 'submissions', label: 'Submissions', icon: 'bi-clock-history' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'bi-trophy' },
    { id: 'profile', label: 'Profile', icon: 'bi-person-circle' },
  ];

  if (isAdmin) links.push({ id: 'admin', label: 'Admin', icon: 'bi-shield-lock' });

  const go = id => { onNavigate(id); setCollapsed(true); };

  return (
    <nav className="navbar navbar-expand-lg cj-navbar sticky-top">
      <div className="container-fluid px-3">
        {/* Brand */}
        <button className="navbar-brand btn p-0 border-0 d-flex align-items-center gap-2" onClick={() => go('home')}>
          <div className="cj-brand-icon">⚡</div>
          <span>CodeJudge</span>
        </button>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0 shadow-none p-1"
          type="button"
          onClick={() => setCollapsed(c => !c)}
          style={{ color: 'var(--cj-muted)', background: 'none', fontSize: 20 }}
        >
          <i className={`bi ${collapsed ? 'bi-list' : 'bi-x-lg'}`}></i>
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 mt-2 mt-lg-0">
            {links.map(l => (
              <li key={l.id} className="nav-item">
                <button
                  className={`nav-link btn border-0 p-0 d-flex align-items-center gap-1${page === l.id ? ' active' : ''}`}
                  onClick={() => go(l.id)}
                >
                  <i className={`bi ${l.icon}`} style={{ fontSize: 13 }}></i>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2 mb-2 mb-lg-0">
            {isLoggedIn ? (
              <>
                <div
                  className="d-flex align-items-center gap-2 px-2 py-1 rounded-2"
                  style={{ background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => go('profile')}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: 28, height: 28, background: 'var(--cj-brand)', fontSize: 12, color: '#fff' }}
                  >
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: '0.83rem', color: 'var(--cj-text)' }} className="hide-xs">
                    {user?.username}
                  </span>
                </div>
                <button className="btn btn-outline-cj btn-sm" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-outline-cj btn-sm" onClick={() => go('login')}>
                  Sign In
                </button>
                <button className="btn btn-brand btn-sm" onClick={() => go('register')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}