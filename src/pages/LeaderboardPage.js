import React from 'react';
import { PageHeader } from '../components/UI';
import { LEADERBOARD } from '../data/mockData';

function RankDisplay({ rank }) {
  if (rank === 1) return <span style={{ fontSize: '1.3rem' }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: '1.3rem' }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: '1.3rem' }}>🥉</span>;
  return (
    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--cj-muted)' }}>
      #{rank}
    </span>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="Leaderboard"
        subtitle="Global rankings · updated hourly"
      />

      <div className="cj-card overflow-hidden">
        <div className="table-responsive">
          <table className="cj-table">
            <thead>
              <tr>
                <th style={{ width: 64 }}>Rank</th>
                <th>User</th>
                <th className="hide-sm">Solved</th>
                <th>Score</th>
                <th className="hide-sm">Streak</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map(u => (
                <tr key={u.rank} className={u.rank === 1 ? 'lb-row-1' : ''}>
                  <td style={{ textAlign: 'center' }}>
                    <RankDisplay rank={u.rank} />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{
                          width: 33, height: 33,
                          background: u.color + '22',
                          color: u.color,
                          fontSize: '0.78rem',
                        }}
                      >
                        {u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cj-muted)' }}>@{u.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--cj-muted)' }}>
                      {u.solved}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700, color: 'var(--cj-brand)' }}>
                      {u.score.toLocaleString()}
                    </span>
                  </td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--cj-amber)' }}>
                      {u.streak} 🔥
                    </span>
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