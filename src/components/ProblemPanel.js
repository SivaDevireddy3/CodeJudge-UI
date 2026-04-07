// src/components/ProblemPanel.jsx
import React, { useState } from 'react';
import { DiffBadge, TopicTag, VerdictBadge } from './UI';
import { PROBLEM_DETAIL, SUBMISSIONS } from '../data/mockData';

export default function ProblemPanel({ problem }) {
  const [tab, setTab] = useState('desc');

  const tabs = [
    { id: 'desc', label: 'Description', icon: 'bi-file-text' },
    { id: 'edit', label: 'Editorial', icon: 'bi-lightbulb' },
    { id: 'subs', label: 'Submissions', icon: 'bi-clock-history' },
  ];

  return (
    <div className="prob-panel">
      {/* Tabs */}
      <div className="prob-panel-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`prob-panel-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <i className={`bi ${t.icon} me-1`} style={{ fontSize: 12 }}></i>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="prob-panel-body">

        {/* Description */}
        {tab === 'desc' && (
          <div>
            <h5 className="fw-bold mb-2" style={{ letterSpacing: '-0.3px' }}>
              {problem.num}. {problem.title}
            </h5>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
              <DiffBadge diff={problem.diff} />
              <TopicTag tag={problem.tag} />
              <span style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
                <i className="bi bi-bar-chart me-1"></i>{problem.acc}
              </span>
            </div>

            <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#c9d1d9' }}>
              {PROBLEM_DETAIL.description.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-3" />
              ))}
            </div>

            {/* Examples */}
            {PROBLEM_DETAIL.examples.map((ex, i) => (
              <div key={i} className="mb-3 rounded-2 overflow-hidden"
                style={{ border: '1px solid var(--cj-border)' }}>
                <div className="px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--cj-border)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--cj-muted)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                  Example {i + 1}
                </div>
                <div className="px-3 py-2">
                  {[['Input', ex.input], ['Output', ex.output], ex.explanation ? ['Explanation', ex.explanation] : null]
                    .filter(Boolean)
                    .map(([k, v]) => (
                      <div key={k} className="d-flex gap-2 mb-1" style={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.8 }}>
                        <span style={{ color: 'var(--cj-muted)', flexShrink: 0 }}>{k}:</span>
                        <span style={{ color: 'var(--cj-text)' }}>{v}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {/* Constraints */}
            <div className="rounded-2 p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--cj-border)' }}>
              <div className="cj-label mb-2">Constraints</div>
              <ul className="list-unstyled mb-0" style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#c9d1d9' }}>
                {PROBLEM_DETAIL.constraints.map((c, i) => (
                  <li key={i} className="d-flex align-items-center gap-2 mb-1">
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--cj-muted)', flexShrink: 0, display: 'inline-block' }}></span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Editorial */}
        {tab === 'edit' && (
          <div>
            <h6 className="fw-bold mb-3">{PROBLEM_DETAIL.editorial.approach}</h6>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#c9d1d9' }}>
              {PROBLEM_DETAIL.editorial.body.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} className="mb-3" />
              ))}
            </div>
            <div className="rounded-2 overflow-hidden" style={{ border: '1px solid var(--cj-border)' }}>
              <div className="px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--cj-border)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--cj-muted)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                Complexity
              </div>
              <div className="px-3 py-2">
                {[['Time', PROBLEM_DETAIL.editorial.complexity.time], ['Space', PROBLEM_DETAIL.editorial.complexity.space]].map(([k, v]) => (
                  <div key={k} className="d-flex gap-2 mb-1" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--cj-muted)' }}>{k}:</span>
                    <span style={{ color: 'var(--cj-text)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submissions */}
        {tab === 'subs' && (
          <div>
            {SUBMISSIONS.slice(0, 6).map(s => (
              <div key={s.id} className="d-flex align-items-center justify-content-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--cj-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
                  {s.problem}
                </span>
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <VerdictBadge verdict={s.verdict} />
                  <span style={{ color: 'var(--cj-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{s.lang}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}