// src/components/Console.js
import React, { useState } from 'react';
import { VerdictBadge, Spinner } from './UI';

export default function Console({ results, running, submitting }) {
  const [collapsed, setCollapsed] = useState(false);

  const hasContent = results || running || submitting;

  return (
    <div className={`cj-console${collapsed ? ' collapsed' : ''}`}>
      <div className="console-bar">
        <span className="console-label">
          <i className="bi bi-terminal me-2" />Console
        </span>

        {/* Status indicator */}
        {(running || submitting) && (
          <span
            style={{ fontSize: '0.75rem', color: 'var(--cj-muted)', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Spinner />
            {submitting ? 'Judging…' : 'Running…'}
          </span>
        )}

        {/* Result summary badge */}
        {results && !running && !submitting && (
          <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>
            {results.filter((r) => r.verdict === 'AC').length}/{results.length} passed
          </span>
        )}

        <button
          className="btn btn-outline-cj btn-sm py-0 px-2 ms-auto"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand console' : 'Collapse console'}
          style={{ fontSize: '0.72rem', minWidth: 28 }}
        >
          <i className={`bi bi-chevron-${collapsed ? 'up' : 'down'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="console-body">
          {!hasContent && (
            <span style={{ fontSize: '0.8rem', color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Run or Submit your code to see results…
            </span>
          )}

          {(running || submitting) && !results && (
            <div
              className="d-flex align-items-center gap-2"
              style={{ fontSize: '0.85rem', color: 'var(--cj-muted)' }}
            >
              <span>
                {submitting
                  ? 'Running against all test cases including hidden ones…'
                  : 'Running on sample inputs…'}
              </span>
            </div>
          )}

          {results && results.map((r, i) => (
            <div key={i} className="console-result-row">
              <span className="console-tc">{r.tc}</span>
              <VerdictBadge verdict={r.verdict} />
              <span className="console-timing">{r.time} · {r.mem}</span>
            </div>
          ))}

          {/* Show error message if present in results */}
          {results && results.some((r) => r.errorMessage) && (
            <div
              className="mt-1 p-2 rounded-2"
              style={{
                background: 'rgba(240,80,96,0.06)',
                border: '1px solid rgba(240,80,96,0.2)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                color: 'var(--cj-red)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {results.find((r) => r.errorMessage)?.errorMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}