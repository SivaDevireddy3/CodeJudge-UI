// src/pages/HomePage.js
import React from 'react';

const features = [
  { icon: 'bi-box', label: 'Docker sandbox', color: 'var(--cj-blue)' },
  { icon: 'bi-code-slash', label: '4 languages', color: 'var(--cj-brand)' },
  { icon: 'bi-shield-check', label: 'JWT auth', color: 'var(--cj-green)' },
  { icon: 'bi-lightning-fill', label: 'Real-time judge', color: 'var(--cj-amber)' },
  { icon: 'bi-eye-slash', label: 'Hidden test cases', color: 'var(--cj-red)' },
];

const stats = [
  { n: 'Fast', l: 'Verdict in <3s' },
  { n: 'Secure', l: 'Docker isolated' },
  { n: 'Fair', l: 'Hidden tests' },
  { n: '99.9%', l: 'Uptime' },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="cj-hero">
      <div className="cj-hero-grid" />
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center text-center">
          <div className="col-lg-9 col-xl-8">

            <div className="hero-pill mb-4 d-inline-flex">
              <div className="hero-dot" />
              Spring Boot · React · PostgreSQL · Docker
            </div>

            <h1 className="hero-h1 mb-4">
              Code. Submit.<br />
              <span>Get Judged.</span>
            </h1>

            <p
              className="mb-5 mx-auto"
              style={{ maxWidth: 500, fontSize: '1.05rem', color: 'var(--cj-muted)', lineHeight: 1.75 }}
            >
              A production-grade online judge with Docker-isolated execution,
              real-time verdicts, and a clean editor experience.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap mb-5">
              <button className="btn btn-brand btn-lg px-5" onClick={() => onNavigate('problems')}>
                <i className="bi bi-play-fill me-2" />Start Solving
              </button>
              <button className="btn btn-outline-cj btn-lg px-4" onClick={() => onNavigate('leaderboard')}>
                <i className="bi bi-trophy me-2" />Leaderboard
              </button>
            </div>

            {/* Feature chips */}
            <div className="d-flex gap-2 justify-content-center flex-wrap mb-5">
              {features.map((f) => (
                <div key={f.label} className="feature-chip">
                  <i className={`bi ${f.icon}`} style={{ color: f.color, fontSize: 14 }} />
                  {f.label}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ borderTop: '1px solid var(--cj-border)', paddingTop: '2.5rem' }}>
              <div className="row g-3">
                {stats.map((s) => (
                  <div key={s.l} className="col-6 col-md-3">
                    <div className="hero-stat-card">
                      <div className="hero-stat-n">{s.n}</div>
                      <div className="hero-stat-l">{s.l}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}