// src/components/Console.jsx
import React, { useState } from 'react';
import { VerdictBadge, Spinner } from './UI';

export default function Console({ results, running, submitting }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`cj-console${collapsed ? ' collapsed' : ''}`}>
      <div className="console-bar">
        <span className="console-label">
          <i className="bi bi-terminal me-1"></i> Console
        </span>
        {(running || submitting) && <Spinner />}
        <button
          className="btn btn-outline-cj btn-sm py-0 px-2"
          onClick={() => setCollapsed(c => !c)}
          style={{ fontSize: '0.72rem' }}
        >
          <i className={`bi bi-chevron-${collapsed ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {!collapsed && (
        <div className="console-body">
          {!results && !running && !submitting && (
            <span style={{ fontSize: '0.8rem', color: 'var(--cj-muted)', fontFamily: 'monospace' }}>
              Run your code to see output here…
            </span>
          )}

          {(running || submitting) && (
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--cj-muted)' }}>
              <Spinner />
              {submitting ? 'Judging against hidden test cases…' : 'Running on sample inputs…'}
            </div>
          )}

          {results && results.map((r, i) => (
            <div key={i} className="console-result-row">
              <span className="console-tc">{r.tc}</span>
              <VerdictBadge verdict={r.verdict} />
              <span className="console-timing">{r.time} · {r.mem}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}