import React, { useState, useEffect, useCallback } from 'react';
import { VerdictBadge, PageHeader, EmptyState, Spinner } from '../components/UI';
import { submissionAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VERDICT_OPTS = ['all', 'AC', 'WA', 'TLE', 'RE', 'CE'];

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60_000) return 'just now';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  if (diff < 604800_000) return `${Math.floor(diff / 86400_000)}d ago`;
  return d.toLocaleDateString();
}

export default function SubmissionsPage({ onOpenProblem }) {
  const { isLoggedIn } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 30;

  const fetchSubs = useCallback(async () => {
    if (!isLoggedIn) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await submissionAPI.getMine(page, PAGE_SIZE);
      const data = res.data;
      setSubmissions(data.content || data || []);
      setTotal(data.totalElements || (data.content || data || []).length);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, page]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const filtered = filter === 'all'
    ? submissions
    : submissions.filter((s) => s.verdict === filter);

  const ac = submissions.filter((s) => s.verdict === 'AC').length;
  const total_subs = submissions.length;

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="My Submissions"
        subtitle={total_subs > 0 ? `${ac} accepted · ${total_subs} loaded` : 'Your submission history'}
      />

      {!isLoggedIn ? (
        <div className="cj-card p-5 text-center">
          <i className="bi bi-lock d-block mb-3" style={{ fontSize: 40, color: 'var(--cj-muted)' }} />
          <p style={{ color: 'var(--cj-muted)', marginBottom: 16 }}>Sign in to view your submissions.</p>
          <button className="btn btn-brand px-4" onClick={() => window.dispatchEvent(new CustomEvent('cj:unauthorized'))}>
            Sign In
          </button>
        </div>
      ) : (
        <>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {VERDICT_OPTS.map((v) => (
              <button
                key={v}
                className={`btn btn-sm rounded-pill px-3 ${filter === v ? 'btn-brand' : 'btn-outline-cj'}`}
                onClick={() => setFilter(v)}
                style={{ fontSize: '0.78rem' }}
              >
                {v === 'all' ? 'All' : v}
              </button>
            ))}
            <button className="btn btn-sm btn-outline-cj ms-auto" onClick={fetchSubs} disabled={loading} title="Refresh">
              <i className={`bi bi-arrow-clockwise${loading ? ' spin' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="cj-card p-3 mb-3 d-flex align-items-center gap-2" style={{ border: '1px solid rgba(240,80,96,.3)' }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ color: 'var(--cj-red)' }} />
              <span style={{ fontSize: '0.875rem', color: 'var(--cj-red)' }}>{error}</span>
              <button className="btn btn-outline-cj btn-sm ms-auto" onClick={fetchSubs}>Retry</button>
            </div>
          )}

          <div className="cj-card overflow-hidden">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center gap-3 py-5" style={{ color: 'var(--cj-muted)' }}>
                <Spinner /><span style={{ fontSize: '0.875rem' }}>Loading submissions…</span>
              </div>
            ) : (
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
                          <EmptyState
                            icon="bi-inbox"
                            message={submissions.length === 0 ? "No submissions yet. Start solving!" : "No submissions match this filter."}
                          />
                        </td>
                      </tr>
                    ) : (
                      filtered.map((s) => (
                        <tr
                          key={s.id}
                          onClick={() => onOpenProblem && onOpenProblem({ id: s.problemId, title: s.problemTitle })}
                          style={{ cursor: onOpenProblem ? 'pointer' : 'default' }}
                        >
                          <td>
                            <span style={{ fontWeight: 500, color: 'var(--cj-brand)' }}>
                              {s.problemTitle}
                            </span>
                          </td>
                          <td><VerdictBadge verdict={s.verdict} /></td>
                          <td className="hide-sm">
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                              {s.language}
                            </span>
                          </td>
                          <td className="hide-sm">
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>
                              {s.executionTimeMs != null ? `${s.executionTimeMs}ms` : '—'}
                            </span>
                          </td>
                          <td className="hide-md">
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                              {s.memoryUsedMb != null ? `${s.memoryUsedMb} MB` : '—'}
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
            )}
          </div>

          {!loading && total > PAGE_SIZE && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
              <button className="btn btn-outline-cj btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
              <span style={{ fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
              </span>
              <button
                className="btn btn-outline-cj btn-sm"
                disabled={(page + 1) * PAGE_SIZE >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}