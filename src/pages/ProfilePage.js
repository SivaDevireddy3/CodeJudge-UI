// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { VerdictBadge, StatCard, PageHeader, Spinner } from '../components/UI';
import { submissionAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString();
}

function ProgressBar({ pct, color }) {
  return (
    <div className="cj-progress">
      <div className="cj-progress-fill" style={{ width: `${Math.min(100, pct)}%`, background: color }} />
    </div>
  );
}

export default function ProfilePage({ onNavigate }) {
  const { user, isLoggedIn, logout } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    submissionAPI.getMine(0, 100)
      .then((res) => {
        const data = res.data;
        setSubmissions(data.content || data || []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 58px)' }}>
        <div className="text-center p-4">
          <i className="bi bi-person-circle d-block mb-3" style={{ fontSize: 52, color: 'var(--cj-muted)' }} />
          <h5 className="fw-bold">Not signed in</h5>
          <p style={{ color: 'var(--cj-muted)' }}>Please sign in to view your profile.</p>
          <button className="btn btn-brand px-4 mt-2" onClick={() => onNavigate('login')}>Sign In</button>
        </div>
      </div>
    );
  }

  const ac = submissions.filter((s) => s.verdict === 'AC').length;
  const accRate = submissions.length > 0 ? Math.round((ac / submissions.length) * 100) : 0;

  // Count unique solved problems
  const solvedIds = new Set(submissions.filter((s) => s.verdict === 'AC').map((s) => s.problemId));
  const solved = solvedIds.size;

  // Difficulty breakdown from submissions (approximate — we know verdict + problem)
  // We can't know exact difficulty unless stored in submission. Show by language instead.
  const byLang = submissions.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1;
    return acc;
  }, {});

  const avatarLetter = (user.displayName || user.username || '?')[0].toUpperCase();

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader title="Profile" subtitle="Your coding journey" />

      {/* Profile header card */}
      <div className="profile-header-card mb-4">
        <div className="d-flex align-items-start gap-3 flex-wrap">
          <div className="profile-avatar">{avatarLetter}</div>
          <div className="flex-grow-1 min-width-0">
            <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.3px' }}>
              {user.displayName || user.username}
            </h5>
            <div style={{ fontSize: '0.82rem', color: 'var(--cj-muted)', marginTop: 2 }}>
              @{user.username} · {user.email}
            </div>
            <div className="d-flex gap-2 mt-2 flex-wrap">
              <span
                className="cj-badge"
                style={{ background: 'rgba(79,110,247,.1)', color: 'var(--cj-brand-light)', border: '1px solid rgba(79,110,247,.25)' }}
              >
                <i className="bi bi-person-badge me-1" />{user.role}
              </span>
            </div>
          </div>
          <button className="btn btn-outline-cj btn-sm flex-shrink-0" onClick={logout}>
            <i className="bi bi-box-arrow-right me-1" />Logout
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Problems Solved', value: solved, sub: 'unique problems', color: 'var(--cj-brand)', icon: 'bi-check2-circle' },
          { label: 'Acceptance Rate', value: `${accRate}%`, sub: `${ac} accepted`, color: 'var(--cj-green)', icon: 'bi-bar-chart-fill' },
          { label: 'Total Submissions', value: submissions.length, sub: 'all time', color: 'var(--cj-blue)', icon: 'bi-send-fill' },
          { label: 'Total Score', value: (user.totalScore || 0).toLocaleString(), sub: 'points earned', color: 'var(--cj-amber)', icon: 'bi-star-fill' },
        ].map((s) => (
          <div key={s.label} className="col-6 col-lg-3">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Language breakdown */}
      {Object.keys(byLang).length > 0 && (
        <div className="cj-card p-3 mb-4">
          <h6 className="fw-semibold mb-3">Submissions by Language</h6>
          {Object.entries(byLang).sort((a, b) => b[1] - a[1]).map(([lang, count]) => (
            <div key={lang} className="mb-3">
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--cj-text-dim)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{lang}</span>
                <span style={{ color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span>
              </div>
              <ProgressBar pct={Math.round((count / submissions.length) * 100)} color="var(--cj-brand)" />
            </div>
          ))}
        </div>
      )}

      {/* Recent submissions */}
      <h6 className="fw-semibold mb-3">Recent Submissions</h6>

      {loading && (
        <div className="d-flex align-items-center gap-2 py-3" style={{ color: 'var(--cj-muted)' }}>
          <Spinner /><span style={{ fontSize: '0.875rem' }}>Loading submissions…</span>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--cj-red)', fontSize: '0.875rem' }}>
          <i className="bi bi-exclamation-triangle me-2" />{error}
        </div>
      )}

      {!loading && !error && (
        <div className="cj-card overflow-hidden">
          <div className="table-responsive">
            <table className="cj-table">
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Verdict</th>
                  <th className="hide-sm">Language</th>
                  <th className="hide-sm">Time</th>
                  <th className="hide-md">Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="text-center py-5">
                        <i className="bi bi-code-slash d-block mb-3" style={{ fontSize: 40, color: 'var(--cj-muted)' }} />
                        <p style={{ color: 'var(--cj-muted)', marginBottom: 12, fontSize: '0.9rem' }}>No submissions yet. Start solving!</p>
                        <button className="btn btn-brand btn-sm px-4" onClick={() => onNavigate('problems')}>
                          Browse Problems
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.slice(0, 20).map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500, color: 'var(--cj-brand)' }}>{s.problemTitle}</td>
                      <td><VerdictBadge verdict={s.verdict} /></td>
                      <td className="hide-sm">
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
                          {s.language}
                        </span>
                      </td>
                      <td className="hide-sm">
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
                          {s.executionTimeMs != null ? `${s.executionTimeMs}ms` : '—'}
                        </span>
                      </td>
                      <td className="hide-md">
                        <span style={{ fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
                          {fmtDate(s.submittedAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}