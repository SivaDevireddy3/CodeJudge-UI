// src/pages/LeaderboardPage.js
import React, { useState, useEffect } from 'react';
import { PageHeader, Spinner, EmptyState } from '../components/UI';
import { leaderboardAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const RANK_COLORS = ['#4f6ef7', '#22d3a0', '#f59e0b', '#38bdf8', '#f05060', '#c084fc', '#4ade80', '#fb7185', '#a3e635', '#fdba74'];

function RankDisplay({ rank }) {
  if (rank === 1) return <span style={{ fontSize: '1.3rem' }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: '1.3rem' }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: '1.3rem' }}>🥉</span>;
  return <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--cj-muted)' }}>#{rank}</span>;
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    leaderboardAPI.getGlobal()
      .then((res) => setEntries(res.data || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const myRank = user ? entries.findIndex((e) => e.username === user.username) + 1 : 0;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="Leaderboard"
        subtitle="Global rankings · updated hourly"
        action={
          myRank > 0 && (
            <span
              className="cj-badge"
              style={{ background: 'var(--cj-brand-dim)', color: 'var(--cj-brand-light)', border: '1px solid rgba(79,110,247,.3)', fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <i className="bi bi-trophy me-2" />Your rank: #{myRank}
            </span>
          )
        }
      />

      {loading && (
        <div className="cj-card p-5 d-flex align-items-center justify-content-center gap-3" style={{ color: 'var(--cj-muted)' }}>
          <Spinner /><span>Loading leaderboard…</span>
        </div>
      )}

      {error && (
        <div className="cj-card p-3 mb-3 d-flex align-items-center gap-2" style={{ border: '1px solid rgba(240,80,96,.3)' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ color: 'var(--cj-red)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--cj-red)' }}>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="cj-card overflow-hidden">
          <div className="table-responsive">
            <table className="cj-table">
              <thead>
                <tr>
                  <th style={{ width: 64, textAlign: 'center' }}>Rank</th>
                  <th>User</th>
                  <th className="hide-sm">Solved</th>
                  <th>Score</th>
                  <th className="hide-sm">Streak</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState icon="bi-trophy" message="No entries yet — be the first to solve a problem!" />
                    </td>
                  </tr>
                ) : (
                  entries.map((u, idx) => {
                    const color = RANK_COLORS[idx % RANK_COLORS.length];
                    const isMe = user?.username === u.username;
                    const rowClass = u.rank === 1 ? 'lb-row-1' : u.rank === 2 ? 'lb-row-2' : u.rank === 3 ? 'lb-row-3' : '';
                    return (
                      <tr key={u.userId || u.username} className={rowClass} style={{ background: isMe ? 'rgba(79,110,247,0.09)' : undefined }}>
                        <td style={{ textAlign: 'center' }}>
                          <RankDisplay rank={u.rank} />
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              style={{
                                width: 34, height: 34, borderRadius: 9,
                                background: color + '22', color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                              }}
                            >
                              {initials(u.displayName || u.username)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {u.displayName || u.username}
                                {isMe && (
                                  <span className="cj-badge" style={{ background: 'var(--cj-brand-dim)', color: 'var(--cj-brand-light)', border: '1px solid rgba(79,110,247,.3)', fontSize: '0.6rem', padding: '1px 6px' }}>
                                    you
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--cj-muted)' }}>@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hide-sm">
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--cj-muted)' }}>
                            {u.problemsSolved}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', fontWeight: 700, color: 'var(--cj-brand)' }}>
                            {(u.totalScore || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="hide-sm">
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--cj-amber)' }}>
                            {u.streakDays || 0} 🔥
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}