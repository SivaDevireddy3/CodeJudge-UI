// src/components/ProblemPanel.js
import React, { useState, useEffect } from 'react';
import { DiffBadge, TopicTag, VerdictBadge, Spinner } from './UI';
import { problemAPI, submissionAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProblemPanel({ problem }) {
  const { isLoggedIn } = useAuth();
  const [tab, setTab] = useState('desc');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // My submissions for this problem
  const [mySubs, setMySubs] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  // Fetch problem detail on mount / problem change
  useEffect(() => {
    if (!problem?.id) return;
    setLoading(true);
    setError(null);
    setDetail(null);

    problemAPI.getById(problem.id)
      .then((res) => setDetail(res.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [problem?.id]);

  // Fetch submissions when switching to the subs tab
  useEffect(() => {
    if (tab !== 'subs' || !isLoggedIn) return;
    setSubsLoading(true);
    submissionAPI.getMine(0, 20)
      .then((res) => {
        // Filter to this problem only
        const all = res.data.content || res.data || [];
        setMySubs(all.filter((s) => s.problemId === problem?.id));
      })
      .catch(() => setMySubs([]))
      .finally(() => setSubsLoading(false));
  }, [tab, problem?.id, isLoggedIn]);

  const tabs = [
    { id: 'desc', label: 'Description', icon: 'bi-file-text' },
    { id: 'subs', label: 'Submissions', icon: 'bi-clock-history' },
  ];

  const p = detail || problem;
  const diff = (p?.difficulty || p?.diff || '').toLowerCase();
  const tag = (p?.topic || p?.tag || '').toLowerCase();
  const acc = p?.acceptanceRate || p?.acc || '—';

  return (
    <div className="prob-panel">
      {/* Tabs */}
      <div className="prob-panel-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`prob-panel-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <i className={`bi ${t.icon}`} style={{ fontSize: 12 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="prob-panel-body">

        {/* ── Description tab ── */}
        {tab === 'desc' && (
          <>
            {loading && (
              <div className="d-flex align-items-center gap-2 py-3" style={{ color: 'var(--cj-muted)' }}>
                <Spinner /><span style={{ fontSize: '0.85rem' }}>Loading problem…</span>
              </div>
            )}
            {error && (
              <div className="py-3" style={{ color: 'var(--cj-red)', fontSize: '0.875rem' }}>
                <i className="bi bi-exclamation-triangle me-2" />{error}
              </div>
            )}
            {!loading && !error && p && (
              <>
                <h5 className="fw-bold mb-2" style={{ letterSpacing: '-0.3px' }}>
                  {p.id}. {p.title}
                </h5>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                  <DiffBadge diff={diff} />
                  {tag && <TopicTag tag={tag} />}
                  <span style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
                    <i className="bi bi-bar-chart me-1" />{acc}
                  </span>
                  {p.timeLimitMs && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
                      <i className="bi bi-clock me-1" />{p.timeLimitMs}ms
                    </span>
                  )}
                  {p.memoryLimitMb && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
                      <i className="bi bi-memory me-1" />{p.memoryLimitMb}MB
                    </span>
                  )}
                </div>

                {/* Description */}
                <div
                  style={{ fontSize: '0.875rem', lineHeight: 1.85, color: 'var(--cj-text-dim)' }}
                  dangerouslySetInnerHTML={{ __html: (p.description || '').replace(/\n/g, '<br/>') }}
                />

                {/* Sample test cases */}
                {(p.sampleTestCases || []).map((tc, i) => (
                  <div
                    key={i}
                    className="my-3 rounded-2 overflow-hidden"
                    style={{ border: '1px solid var(--cj-border)' }}
                  >
                    <div
                      className="px-3 py-2"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderBottom: '1px solid var(--cj-border)',
                        fontSize: '0.72rem', fontWeight: 700,
                        color: 'var(--cj-muted)', textTransform: 'uppercase', letterSpacing: '0.7px',
                      }}
                    >
                      Example {i + 1}
                    </div>
                    <div className="px-3 py-2">
                      {[['Input', tc.input], ['Output', tc.expectedOutput]].map(([k, v]) => (
                        <div
                          key={k}
                          className="d-flex gap-2 mb-1"
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', lineHeight: 1.8 }}
                        >
                          <span style={{ color: 'var(--cj-muted)', flexShrink: 0 }}>{k}:</span>
                          <span style={{ color: 'var(--cj-text)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {p.constraints && (
                  <div
                    className="rounded-2 p-3 mt-3"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--cj-border)' }}
                  >
                    <div className="cj-label mb-2">Constraints</div>
                    <div
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: 'var(--cj-text-dim)', lineHeight: 1.9 }}
                      dangerouslySetInnerHTML={{ __html: p.constraints.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Submissions tab ── */}
        {tab === 'subs' && (
          <div>
            {!isLoggedIn && (
              <p style={{ fontSize: '0.875rem', color: 'var(--cj-muted)' }}>
                <i className="bi bi-lock me-2" />Sign in to view your submissions.
              </p>
            )}
            {isLoggedIn && subsLoading && (
              <div className="d-flex align-items-center gap-2 py-3" style={{ color: 'var(--cj-muted)' }}>
                <Spinner /><span style={{ fontSize: '0.85rem' }}>Loading submissions…</span>
              </div>
            )}
            {isLoggedIn && !subsLoading && mySubs.length === 0 && (
              <p style={{ fontSize: '0.875rem', color: 'var(--cj-muted)' }}>No submissions yet for this problem.</p>
            )}
            {isLoggedIn && !subsLoading && mySubs.map((s) => (
              <div
                key={s.id}
                className="d-flex align-items-center justify-content-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem', gap: 10 }}
              >
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <VerdictBadge verdict={s.verdict} />
                  <span style={{ color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                    {s.language}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', flexShrink: 0 }}>
                  {s.executionTimeMs != null && <span>{s.executionTimeMs}ms</span>}
                  {s.submittedAt && (
                    <span>{new Date(s.submittedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}