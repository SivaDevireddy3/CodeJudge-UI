import React from 'react';

const stats = [
  { n: '2,412', l: 'Problems' },
  { n: '48K', l: 'Users' },
  { n: '1.2M', l: 'Submissions' },
  { n: '99.9%', l: 'Uptime' },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="cj-hero">
      <div className="cj-hero-grid" />
      <div className="container position-relative z-1">
        <div className="row justify-content-center text-center">
          <div className="col-lg-9 col-xl-8">

            <h1 className="hero-h1 mb-4">
              Code. Submit.<br />
              <span>Get Judged.</span>
            </h1>

            <p className="mb-5 mx-auto" style={{ maxWidth: 500, fontSize: '1.05rem', color: 'var(--cj-muted)', lineHeight: 1.7 }}>
              A production-grade online judge with Docker-isolated execution,
              real-time verdicts, and a professional Monaco-style editor.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap mb-5">
              <button className="btn btn-brand btn-lg px-4" onClick={() => onNavigate('problems')}>
                <i className="bi bi-play-fill me-2"></i>Start Solving
              </button>
              <button className="btn btn-outline-secondary btn-lg px-4" onClick={() => onNavigate('leaderboard')}>
                <i className="bi bi-trophy me-2"></i>Leaderboard
              </button>
            </div>

            {/* Stats */}
            <div style={{ borderTop: '1px solid var(--cj-border)', paddingTop: '2.5rem' }}>
              <div className="row g-3">
                {stats.map(s => (
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