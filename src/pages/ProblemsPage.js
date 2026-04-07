import React, { useState } from 'react';
import { DiffBadge, TopicTag, EmptyState, PageHeader, ProgressBar } from '../components/UI';
import { PROBLEMS } from '../data/mockData';

const DIFF_OPTS = ['all', 'easy', 'medium', 'hard'];
const TAG_OPTS = ['all', 'array', 'dp', 'string', 'tree', 'graph', 'hash', 'math'];

export default function ProblemsPage({ onOpenProblem }) {
  const [search, setSearch] = useState('');
  const [diff, setDiff] = useState('all');
  const [tag, setTag] = useState('all');

  const solved = PROBLEMS.filter(p => p.solved).length;
  const total = PROBLEMS.length;
  const pct = Math.round((solved / total) * 100);

  const easyS = PROBLEMS.filter(p => p.diff === 'easy' && p.solved).length;
  const easyT = PROBLEMS.filter(p => p.diff === 'easy').length;
  const medS = PROBLEMS.filter(p => p.diff === 'medium' && p.solved).length;
  const medT = PROBLEMS.filter(p => p.diff === 'medium').length;
  const hardS = PROBLEMS.filter(p => p.diff === 'hard' && p.solved).length;
  const hardT = PROBLEMS.filter(p => p.diff === 'hard').length;

  const filtered = PROBLEMS.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (diff !== 'all' && p.diff !== diff) return false;
    if (tag !== 'all' && p.tag !== tag) return false;
    return true;
  });

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="Problems"
        subtitle={`${solved} / ${total} solved`}
      />

      {/* Progress card */}
      <div className="cj-card p-3 mb-3">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-5">
            <ProgressBar pct={pct} />
            <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
              <span><b style={{ color: 'var(--cj-text)' }}>{solved}</b> / {total} solved</span>
              <span>{pct}%</span>
            </div>
          </div>
          <div className="col-12 col-md-7">
            <div className="d-flex gap-3 flex-wrap">
              {[
                { label: 'Easy', s: easyS, t: easyT, color: 'var(--cj-green)' },
                { label: 'Medium', s: medS, t: medT, color: 'var(--cj-amber)' },
                { label: 'Hard', s: hardS, t: hardT, color: 'var(--cj-red)' },
              ].map(r => (
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

      {/* Toolbar */}
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        {/* Search */}
        <div className="position-relative" style={{ flex: '1 1 180px', maxWidth: 320 }}>
          <i className="bi bi-search position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--cj-muted)', fontSize: 13 }}></i>
          <input
            className="cj-input form-control ps-4"
            placeholder="Search problems…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ height: 36 }}
          />
        </div>

        {/* Difficulty chips */}
        <div className="d-flex gap-1 flex-wrap">
          {DIFF_OPTS.map(d => (
            <button
              key={d}
              className={`btn btn-sm rounded-pill px-3 ${diff === d ? 'btn-brand' : 'btn-outline-cj'}`}
              onClick={() => setDiff(d)}
              style={{ fontSize: '0.78rem' }}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Tag chips */}
        <div className="d-flex gap-1 flex-wrap">
          {TAG_OPTS.map(t => (
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

      {/* Table */}
      <div className="cj-card overflow-hidden">
        <div className="table-responsive">
          <table className="cj-table">
            <thead>
              <tr>
                <th style={{ width: 56 }}>#</th>
                <th>Title</th>
                <th className="hide-sm">Topic</th>
                <th>Difficulty</th>
                <th className="hide-md">Acceptance</th>
                <th style={{ width: 60 }} className="hide-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon="bi-search" message="No problems match your filters." />
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} onClick={() => onOpenProblem(p)}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--cj-muted)' }}>
                      {p.num}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{p.title}</span>
                  </td>
                  <td className="hide-sm">
                    <TopicTag tag={p.tag} />
                  </td>
                  <td>
                    <DiffBadge diff={p.diff} />
                  </td>
                  <td className="hide-md">
                    <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                      {p.acc}
                    </span>
                  </td>
                  <td className="hide-sm">
                    {p.solved && (
                      <i className="bi bi-check-circle-fill" style={{ color: 'var(--cj-green)', fontSize: 15 }}></i>
                    )}
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