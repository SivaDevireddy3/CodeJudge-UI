// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { PageHeader, Spinner } from '../components/UI';
import { problemAPI, getErrorMessage } from '../services/api';

const BLANK = {
  title: '', difficulty: 'EASY', topic: 'array', description: '', constraints: '',
  timeLimitMs: 2000, memoryLimitMb: 256, points: 100,
  // test cases built separately
  sampleInput: '', sampleOutput: '',
  hiddenInput: '', hiddenOutput: '',
};

export default function AdminPage({ toast }) {
  const [form, setForm] = useState(BLANK);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load problem stats from backend
  useEffect(() => {
    problemAPI.getAll({ page: 0, size: 1 })
      .then((res) => {
        setStats({ total: res.data.totalElements || 0 });
      })
      .catch(() => setStats({ total: '—' }))
      .finally(() => setStatsLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    if (!form.description.trim()) { toast.error('Description is required.'); return; }
    if (!form.sampleInput.trim() || !form.sampleOutput.trim()) {
      toast.error('At least one sample test case (input + output) is required.');
      return;
    }

    // Build the CreateProblemRequest the backend expects
    const testCases = [];

    // Sample test case(s) — visible to users
    form.sampleInput.split('---').forEach((inp, i) => {
      const out = (form.sampleOutput.split('---')[i] || '').trim();
      if (inp.trim()) {
        testCases.push({ input: inp.trim(), expectedOutput: out, hidden: false, orderIndex: i });
      }
    });

    // Hidden test case(s)
    if (form.hiddenInput.trim()) {
      form.hiddenInput.split('---').forEach((inp, i) => {
        const out = (form.hiddenOutput.split('---')[i] || '').trim();
        if (inp.trim()) {
          testCases.push({ input: inp.trim(), expectedOutput: out, hidden: true, orderIndex: testCases.length });
        }
      });
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      constraints: form.constraints.trim() || null,
      difficulty: form.difficulty,
      topic: form.topic,
      timeLimitMs: parseInt(form.timeLimitMs, 10),
      memoryLimitMb: parseInt(form.memoryLimitMb, 10),
      points: parseInt(form.points, 10),
      testCases,
    };

    setSubmitting(true);
    try {
      await problemAPI.create(payload);
      toast.success(`✓ Problem "${form.title}" created successfully!`);
      setForm(BLANK);
      // Refresh stats
      problemAPI.getAll({ page: 0, size: 1 }).then((res) =>
        setStats({ total: res.data.totalElements || 0 })
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="Admin Panel"
        subtitle="Create and manage problems"
        action={
          <span className="cj-badge" style={{ background: 'rgba(240,80,96,.15)', color: 'var(--cj-red)', border: '1px solid rgba(240,80,96,.3)', fontSize: '0.75rem', padding: '6px 12px' }}>
            <i className="bi bi-shield-lock-fill me-1" />ADMIN
          </span>
        }
      />

      <div className="row g-4">
        {/* ── Create Problem Form ── */}
        <div className="col-12 col-lg-8">
          <div className="cj-card overflow-hidden">
            <div className="cj-card-header">
              <i className="bi bi-plus-circle" style={{ color: 'var(--cj-brand)' }} />
              <span className="fw-semibold">New Problem</span>
            </div>
            <form onSubmit={handleSubmit} className="p-3 p-md-4" noValidate>
              <div className="row g-3">

                {/* Title */}
                <div className="col-12">
                  <label className="cj-label">Problem Title *</label>
                  <input className="cj-input form-control" placeholder="e.g. Two Sum" value={form.title} onChange={set('title')} />
                </div>

                {/* Difficulty + Topic */}
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Difficulty</label>
                  <select className="cj-input form-select" value={form.difficulty} onChange={set('difficulty')}>
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Topic</label>
                  <select className="cj-input form-select" value={form.topic} onChange={set('topic')}>
                    {['array', 'dp', 'string', 'tree', 'graph', 'hash', 'math'].map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="cj-label">Problem Description *</label>
                  <textarea
                    className="cj-input form-control"
                    rows={5}
                    placeholder="Full problem statement. HTML tags are supported (e.g. <strong>, <code>)."
                    value={form.description}
                    onChange={set('description')}
                    style={{ fontFamily: 'inherit', lineHeight: 1.7 }}
                  />
                </div>

                {/* Constraints */}
                <div className="col-12">
                  <label className="cj-label">Constraints</label>
                  <textarea
                    className="cj-input form-control"
                    rows={2}
                    placeholder="e.g. 2 ≤ nums.length ≤ 10⁴&#10;-10⁹ ≤ nums[i] ≤ 10⁹"
                    value={form.constraints}
                    onChange={set('constraints')}
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Sample Test Cases */}
                <div className="col-12">
                  <div
                    className="rounded-2 p-3"
                    style={{ background: 'rgba(79,110,247,0.04)', border: '1px solid rgba(79,110,247,0.15)' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-eye" style={{ color: 'var(--cj-brand)' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cj-brand-light)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                        Sample Test Cases
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>— visible to users · separate multiple cases with ---</span>
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Sample Input *</label>
                        <textarea
                          className="cj-input form-control"
                          rows={3}
                          placeholder={"[2,7,11,15]\n9"}
                          value={form.sampleInput}
                          onChange={set('sampleInput')}
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Sample Output *</label>
                        <textarea
                          className="cj-input form-control"
                          rows={3}
                          placeholder="[0,1]"
                          value={form.sampleOutput}
                          onChange={set('sampleOutput')}
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden Test Cases */}
                <div className="col-12">
                  <div className="hidden-section">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-lock-fill" style={{ color: 'var(--cj-red)' }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cj-red)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                        Hidden Test Cases
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>— not visible to users · separate with ---</span>
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Hidden Input</label>
                        <textarea
                          className="cj-input form-control"
                          rows={3}
                          placeholder="Edge case inputs…"
                          value={form.hiddenInput}
                          onChange={set('hiddenInput')}
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Expected Output</label>
                        <textarea
                          className="cj-input form-control"
                          rows={3}
                          placeholder="Expected outputs…"
                          value={form.hiddenOutput}
                          onChange={set('hiddenOutput')}
                          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits + Points */}
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Time Limit (ms)</label>
                  <input className="cj-input form-control" type="number" value={form.timeLimitMs} onChange={set('timeLimitMs')} min={100} max={10000} />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Memory Limit (MB)</label>
                  <input className="cj-input form-control" type="number" value={form.memoryLimitMb} onChange={set('memoryLimitMb')} min={32} max={1024} />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Points</label>
                  <input className="cj-input form-control" type="number" value={form.points} onChange={set('points')} min={10} max={1000} />
                </div>

                {/* Actions */}
                <div className="col-12 d-flex gap-2 pt-1 flex-wrap">
                  <button type="submit" className="btn btn-brand d-flex align-items-center gap-2" disabled={submitting}>
                    {submitting ? <><Spinner />Creating…</> : <><i className="bi bi-plus-circle" />Create Problem</>}
                  </button>
                  <button type="button" className="btn btn-outline-cj" onClick={() => setForm(BLANK)} disabled={submitting}>
                    <i className="bi bi-arrow-counterclockwise me-1" />Reset
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-3">

            {/* Live stats */}
            <div className="cj-card overflow-hidden">
              <div className="cj-card-header">
                <i className="bi bi-bar-chart" style={{ color: 'var(--cj-brand)' }} />
                <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>Problem Stats</span>
              </div>
              <div className="p-3">
                {statsLoading ? (
                  <div className="d-flex align-items-center gap-2 py-2" style={{ color: 'var(--cj-muted)' }}><Spinner /><span style={{ fontSize: '0.82rem' }}>Loading…</span></div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center py-2" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--cj-muted)' }}>Total Problems</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cj-text)' }}>{stats?.total}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Docker config info */}
            <div className="cj-card overflow-hidden">
              <div className="cj-card-header">
                <i className="bi bi-box" style={{ color: 'var(--cj-blue)' }} />
                <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>Docker Sandbox Config</span>
              </div>
              <div className="p-3">
                {[
                  { l: 'CPU Limit', v: '0.5 cores', c: 'var(--cj-blue)' },
                  { l: 'RAM Limit', v: '256 MB', c: 'var(--cj-blue)' },
                  { l: 'Network', v: 'Disabled', c: 'var(--cj-red)' },
                  { l: 'Filesystem', v: 'Sandboxed', c: 'var(--cj-amber)' },
                  { l: 'Default TL', v: '2000 ms', c: 'var(--cj-muted)' },
                ].map((r) => (
                  <div key={r.l} className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--cj-muted)' }}>{r.l}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="cj-card p-3" style={{ border: '1px solid rgba(79,110,247,.2)', background: 'rgba(79,110,247,.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--cj-text-dim)', margin: 0, lineHeight: 1.7 }}>
                <i className="bi bi-info-circle me-2" style={{ color: 'var(--cj-brand)' }} />
                Separate multiple test cases with <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,.06)', padding: '1px 6px', borderRadius: 4 }}>---</code> on its own line.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}