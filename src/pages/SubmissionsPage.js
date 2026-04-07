import React, { useState } from 'react';
import { VerdictBadge, PageHeader, EmptyState } from '../components/UI';
import { SUBMISSIONS } from '../data/mockData';

export default function SubmissionsPage() {
  const [filter, setFilter] = useState('all');

  const verdictOpts = ['all', 'AC', 'WA', 'TLE', 'RE'];

  const filtered = SUBMISSIONS.filter(s => filter === 'all' || s.verdict === filter);
  const ac = SUBMISSIONS.filter(s => s.verdict === 'AC').length;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="My Submissions"
        subtitle={`${ac} accepted · ${SUBMISSIONS.length} total`}
      />

      {/* Filter chips */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {verdictOpts.map(v => (
          <button
            key={v}
            className={`btn btn-sm rounded-pill px-3 ${filter === v ? 'btn-brand' : 'btn-outline-cj'}`}
            onClick={() => setFilter(v)}
            style={{ fontSize: '0.78rem' }}
          >
            {v === 'all' ? 'All' : v}
          </button>
        ))}
      </div>

      <div className="cj-card overflow-hidden">
        <div className="table-responsive">
          <table className="cj-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Verdict</th>
                <th className="hide-sm">Language</th>
                <th className="hide-sm">Time</th>
                <th className="hide-md">Memory</th>
                <th className="hide-md">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon="bi-inbox" message="No submissions yet." />
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--cj-blue)', cursor: 'pointer' }}>
                      {s.problem}
                    </span>
                  </td>
                  <td><VerdictBadge verdict={s.verdict} /></td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                      {s.lang}
                    </span>
                  </td>
                  <td className="hide-sm">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{s.time}</span>
                  </td>
                  <td className="hide-md">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                      {s.mem}
                    </span>
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