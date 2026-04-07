// src/pages/ProfilePage.jsx
import React from 'react';
import { VerdictBadge, StatCard, PageHeader } from '../components/UI';
import { PROBLEMS, SUBMISSIONS } from '../data/mockData';

export default function ProfilePage() {
  const solved = PROBLEMS.filter(p => p.solved).length;
  const total = PROBLEMS.length;
  const ac = SUBMISSIONS.filter(s => s.verdict === 'AC').length;
  const accRate = Math.round((ac / SUBMISSIONS.length) * 100);

  const easyS = PROBLEMS.filter(p => p.diff === 'easy' && p.solved).length;
  const easyT = PROBLEMS.filter(p => p.diff === 'easy').length;
  const medS = PROBLEMS.filter(p => p.diff === 'medium' && p.solved).length;
  const medT = PROBLEMS.filter(p => p.diff === 'medium').length;
  const hardS = PROBLEMS.filter(p => p.diff === 'hard' && p.solved).length;
  const hardT = PROBLEMS.filter(p => p.diff === 'hard').length;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader title="Profile" subtitle="Your coding journey" />

      {/* Profile header card */}
      <div className="profile-header-card mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap gap-y-2">
          <div className="profile-avatar">A</div>
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.3px' }}>Siva Devireddy</h5>
            <div style={{ fontSize: '0.82rem', color: 'var(--cj-muted)', marginTop: 2 }}>
              @siva_devireddy · Member since Jan 2024
            </div>
            <div className="d-flex gap-2 mt-2 flex-wrap">
              <span className="cj-badge badge-ac">
                <i className="bi bi-patch-check-fill me-1"></i>Top Coder
              </span>
              <span className="cj-badge" style={{ background: 'rgba(210,153,34,.15)', color: 'var(--cj-amber)', border: '1px solid rgba(210,153,34,.3)' }}>
                <i className="bi bi-fire me-1"></i>42 Day Streak
              </span>
            </div>
          </div>
          <div className="d-flex gap-4 flex-wrap">
            {[
              { val: solved, lbl: 'Solved', color: 'var(--cj-brand)' },
              { val: 42, lbl: 'Streak', color: 'var(--cj-amber)' },
              { val: '#1', lbl: 'Rank', color: 'var(--cj-green)' },
            ].map(s => (
              <div key={s.lbl} className="text-center">
                <div style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-1px', color: s.color, lineHeight: 1 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cj-muted)', marginTop: 3 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Problems Solved', value: solved, sub: `of ${total} total`, color: 'var(--cj-brand)', icon: 'bi-check2-circle' },
          { label: 'Acceptance Rate', value: `${accRate}%`, sub: `${ac} accepted`, color: 'var(--cj-green)', icon: 'bi-bar-chart-fill' },
          { label: 'Submissions', value: SUBMISSIONS.length, sub: 'all time', color: 'var(--cj-blue)', icon: 'bi-send-fill' },
          { label: 'Day Streak', value: 42, sub: 'days in a row', color: 'var(--cj-amber)', icon: 'bi-fire' },
        ].map(s => (
          <div key={s.label} className="col-6 col-lg-3">
            <StatCard {...s} />
          </div>
        ))}
      </div>

      {/* Difficulty breakdown */}
      <div className="cj-card p-3 mb-4">
        <h6 className="fw-semibold mb-3">Difficulty Breakdown</h6>
        {[
          { label: 'Easy', s: easyS, t: easyT, color: 'var(--cj-green)' },
          { label: 'Medium', s: medS, t: medT, color: 'var(--cj-amber)' },
          { label: 'Hard', s: hardS, t: hardT, color: 'var(--cj-red)' },
        ].map(r => (
          <div key={r.label} className="mb-3">
            <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.82rem' }}>
              <span style={{ color: r.color, fontWeight: 600 }}>{r.label}</span>
              <span style={{ color: 'var(--cj-muted)', fontFamily: 'monospace' }}>{r.s}/{r.t}</span>
            </div>
            <div className="cj-progress">
              <div className="cj-progress-fill" style={{ width: `${Math.round((r.s / r.t) * 100)}%`, background: r.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent submissions */}
      <h6 className="fw-semibold mb-3">Recent Submissions</h6>
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
              {SUBMISSIONS.slice(0, 6).map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 500 }}>{s.problem}</td>
                  <td><VerdictBadge verdict={s.verdict} /></td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--cj-muted)' }}>{s.lang}</span>
                  </td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{s.time}</span>
                  </td>
                  <td className="hide-md">
                    <span style={{ fontSize: '0.8rem', color: 'var(--cj-muted)' }}>{s.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}