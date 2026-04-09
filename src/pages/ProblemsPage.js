import React, { useState, useEffect, useCallback } from 'react';
import { DiffBadge, TopicTag, EmptyState, PageHeader, ProgressBar, Spinner } from '../components/UI';
import { problemAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DIFF_OPTS = ['all', 'easy', 'medium', 'hard'];
const TAG_OPTS = ['all', 'array', 'dp', 'string', 'tree', 'graph', 'hash', 'math'];

export default function ProblemsPage({ onOpenProblem }) {
  const { isLoggedIn } = useAuth();

  const [problems, setProblems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const [search, setSearch] = useState('');
  const [diff, setDiff] = useState('all');
  const [tag, setTag] = useState('all');

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(0); }, [debouncedSearch, diff, tag]);

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        ...(diff !== 'all' && { difficulty: diff.toUpperCase() }),
        ...(tag !== 'all' && { topic: tag }),
        ...(debouncedSearch && { search: debouncedSearch }),
      };
      const res = await problemAPI.getAll(params);
      const data = res.data;
      setProblems(data.content || []);
      setTotal(data.totalElements || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, diff, tag, debouncedSearch]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  const solved = problems.filter((p) => p.solvedByCurrentUser).length;
  const pct = total > 0 ? Math.round((solved / Math.max(problems.length, 1)) * 100) : 0;

  const easyT = problems.filter((p) => p.difficulty === 'EASY').length;
  const easyS = problems.filter((p) => p.difficulty === 'EASY' && p.solvedByCurrentUser).length;
  const medT = problems.filter((p) => p.difficulty === 'MEDIUM').length;
  const medS = problems.filter((p) => p.difficulty === 'MEDIUM' && p.solvedByCurrentUser).length;
  const hardT = problems.filter((p) => p.difficulty === 'HARD').length;
  const hardS = problems.filter((p) => p.difficulty === 'HARD' && p.solvedByCurrentUser).length;

  const adapt = (p) => ({
    ...p,
    diff: (p.difficulty || '').toLowerCase(),
    tag: (p.topic || '').toLowerCase(),
    acc: p.acceptanceRate || '—',
    num: p.id,
  });

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader title="Problems" subtitle={`${total} problems · ${isLoggedIn ? `${solved} solved on this page` : 'sign in to track progress'}`} />

      {isLoggedIn && problems.length > 0 && (
        <div className="cj-card p-3 mb-3">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-5">
              <ProgressBar pct={pct} />
              <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
                <span><b style={{ color: 'var(--cj-text)' }}>{solved}</b> / {problems.length} solved</span>
                <span>{pct}%</span>
              </div>
            </div>
            <div className="col-12 col-md-7">
              <div className="d-flex gap-3 flex-wrap">
                {[
                  { label: 'Easy', s: easyS, t: easyT, color: 'var(--cj-green)' },
                  { label: 'Medium', s: medS, t: medT, color: 'var(--cj-amber)' },
                  { label: 'Hard', s: hardS, t: hardT, color: 'var(--cj-red)' },
                ].map((r) => (
                  <div key={r.label} className="d-flex align-items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
                      <b style={{ color: r.color }}>{r.s}</b>/{r.t} {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex align-items-start gap-2 mb-3 flex-wrap">
        <div className="position-relative" style={{ flex: '1 1 200px', maxWidth: 340 }}>
          <i className="bi bi-search position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--cj-muted)', fontSize: 13, pointerEvents: 'none' }} />
          <input
            className="cj-input form-control ps-4"
            placeholder="Search problems…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ height: 36 }}
          />
        </div>

        <div className="d-flex gap-1 flex-wrap">
          {DIFF_OPTS.map((d) => (
            <button
              key={d}
              className={`btn btn-sm rounded-pill px-3 ${diff === d ? 'btn-brand' : 'btn-outline-cj'}`}
              onClick={() => setDiff(d)}
              style={{ fontSize: '0.78rem' }}
            >
              {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        <div className="d-flex gap-1 flex-wrap">
          {TAG_OPTS.map((t) => (
            <button
              key={t}
              className={`btn btn-sm rounded-pill px-3 ${tag === t ? 'btn-brand' : 'btn-outline-cj'}`}
              onClick={() => setTag(t)}
              style={{ fontSize: '0.78rem' }}
            >
              {t === 'all' ? 'All Topics' : t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="cj-card p-3 mb-3 d-flex align-items-center gap-2" style={{ border: '1px solid rgba(240,80,96,.3)' }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ color: 'var(--cj-red)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--cj-red)' }}>{error}</span>
          <button className="btn btn-outline-cj btn-sm ms-auto" onClick={fetchProblems}>Retry</button>
        </div>
      )}

      <div className="cj-card overflow-hidden">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center gap-3 py-5" style={{ color: 'var(--cj-muted)' }}>
            <Spinner />
            <span style={{ fontSize: '0.875rem' }}>Loading problems…</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="cj-table">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>#</th>
                  <th>Title</th>
                  <th className="hide-sm">Topic</th>
                  <th>Difficulty</th>
                  <th className="hide-md">Acceptance</th>
                  <th className="hide-md">Points</th>
                  {isLoggedIn && <th style={{ width: 54 }} className="hide-sm">✓</th>}
                </tr>
              </thead>
              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState icon="bi-search" message="No problems match your filters." />
                    </td>
                  </tr>
                ) : (
                  problems.map((p) => {
                    const a = adapt(p);
                    return (
                      <tr key={a.id} onClick={() => onOpenProblem(a)}>
                        <td>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
                            {a.id}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{a.title}</span>
                        </td>
                        <td className="hide-sm">
                          {a.tag && <TopicTag tag={a.tag} />}
                        </td>
                        <td>
                          <DiffBadge diff={a.diff} />
                        </td>
                        <td className="hide-md">
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                            {a.acc}
                          </span>
                        </td>
                        <td className="hide-md">
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--cj-brand)' }}>
                            {a.points}
                          </span>
                        </td>
                        {isLoggedIn && (
                          <td className="hide-sm">
                            {a.solvedByCurrentUser && (
                              <i className="bi bi-check-circle-fill" style={{ color: 'var(--cj-green)', fontSize: 15 }} />
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && total > PAGE_SIZE && (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <button
            className="btn btn-outline-cj btn-sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
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
    </div>
  );
}