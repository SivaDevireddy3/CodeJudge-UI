import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader, Spinner } from '../components/UI';
import { problemAPI, getErrorMessage } from '../services/api';

const BLANK = {
  title: '', difficulty: 'EASY', topic: 'array', description: '', constraints: '',
  timeLimitMs: 2000, memoryLimitMb: 256, points: 100,
  sampleInput: '', sampleOutput: '',
  hiddenInput: '', hiddenOutput: '',
};

const DIFFICULTY_COLORS = {
  EASY: { bg: 'rgba(34,197,94,.12)', color: '#22c55e' },
  MEDIUM: { bg: 'rgba(251,191,36,.12)', color: '#f59e0b' },
  HARD: { bg: 'rgba(240,80,96,.12)', color: 'var(--cj-red)' },
};

export default function AdminPage({ toast }) {
  const [tab, setTab] = useState('create');
  const [form, setForm] = useState(BLANK);
  const [submitting, setSubmitting] = useState(false);
  const [problems, setProblems] = useState([]);
  const [totalProblems, setTotalProblems] = useState(0);
  const [manageLoading, setManageLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [managePage, setManagePage] = useState(0);
  const PAGE_SIZE = 20;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadProblems = useCallback(async (page = 0) => {
    setManageLoading(true);
    try {
      const res = await problemAPI.getAll({ page, size: PAGE_SIZE });
      setProblems(res.data.content || []);
      setTotalProblems(res.data.totalElements || 0);
      setManagePage(page);
    } catch {
      toast.error('Failed to load problems.');
    } finally {
      setManageLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    problemAPI.getAll({ page: 0, size: 1 })
      .then((res) => setTotalProblems(res.data.totalElements || 0))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (tab === 'manage') loadProblems(0);
  }, [tab, loadProblems]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required.'); return; }
    if (!form.description.trim()) { toast.error('Description is required.'); return; }
    if (!form.sampleInput.trim() || !form.sampleOutput.trim()) {
      toast.error('At least one sample test case (input + output) is required.');
      return;
    }
    const testCases = [];
    form.sampleInput.split('---').forEach((inp, i) => {
      const out = (form.sampleOutput.split('---')[i] || '').trim();
      if (inp.trim()) testCases.push({ input: inp.trim(), expectedOutput: out, hidden: false, orderIndex: i });
    });
    if (form.hiddenInput.trim()) {
      form.hiddenInput.split('---').forEach((inp, i) => {
        const out = (form.hiddenOutput.split('---')[i] || '').trim();
        if (inp.trim()) testCases.push({ input: inp.trim(), expectedOutput: out, hidden: true, orderIndex: testCases.length });
      });
    }
    const payload = {
      title: form.title.trim(), description: form.description.trim(),
      constraints: form.constraints.trim() || null,
      difficulty: form.difficulty, topic: form.topic,
      timeLimitMs: parseInt(form.timeLimitMs, 10),
      memoryLimitMb: parseInt(form.memoryLimitMb, 10),
      points: parseInt(form.points, 10), testCases,
    };
    setSubmitting(true);
    try {
      await problemAPI.create(payload);
      toast.success(`✓ Problem "${form.title}" created successfully!`);
      setForm(BLANK);
      setTotalProblems((n) => n + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await problemAPI.delete(id);
      toast.success(`Problem "${title}" deleted.`);
      loadProblems(managePage);
      setTotalProblems((n) => Math.max(0, n - 1));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(totalProblems / PAGE_SIZE);

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

      <div className="d-flex gap-1 mb-4" style={{ borderBottom: '1px solid var(--cj-border)' }}>
        {[
          { id: 'create', icon: 'bi-plus-circle', label: 'Create Problem' },
          { id: 'manage', icon: 'bi-list-ul', label: `Manage (${totalProblems})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="btn border-0 d-flex align-items-center gap-2"
            style={{
              borderRadius: '8px 8px 0 0', padding: '8px 18px', fontSize: '0.875rem',
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--cj-brand)' : 'var(--cj-muted)',
              background: tab === t.id ? 'rgba(79,110,247,.08)' : 'transparent',
              borderBottom: tab === t.id ? '2px solid var(--cj-brand)' : '2px solid transparent',
            }}
          >
            <i className={`bi ${t.icon}`} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'create' && (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="cj-card overflow-hidden">
              <div className="cj-card-header">
                <i className="bi bi-plus-circle" style={{ color: 'var(--cj-brand)' }} />
                <span className="fw-semibold">New Problem</span>
              </div>
              <form onSubmit={handleSubmit} className="p-3 p-md-4" noValidate>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="cj-label">Problem Title *</label>
                    <input className="cj-input form-control" placeholder="e.g. Two Sum" value={form.title} onChange={set('title')} />
                  </div>
                  <div className="col-12 col-sm-6">
                    <label className="cj-label">Difficulty</label>
                    <select className="cj-input form-select" value={form.difficulty} onChange={set('difficulty')}>
                      <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option>
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
                  <div className="col-12">
                    <label className="cj-label">Problem Description *</label>
                    <textarea className="cj-input form-control" rows={5} placeholder="Full problem statement. HTML tags supported." value={form.description} onChange={set('description')} style={{ fontFamily: 'inherit', lineHeight: 1.7 }} />
                  </div>
                  <div className="col-12">
                    <label className="cj-label">Constraints</label>
                    <textarea className="cj-input form-control" rows={2} placeholder={"e.g. 2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹"} value={form.constraints} onChange={set('constraints')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} />
                  </div>
                  <div className="col-12">
                    <div className="rounded-2 p-3" style={{ background: 'rgba(79,110,247,0.04)', border: '1px solid rgba(79,110,247,0.15)' }}>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-eye" style={{ color: 'var(--cj-brand)' }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cj-brand-light)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Sample Test Cases</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>— visible · separate with ---</span>
                      </div>
                      <div className="row g-3">
                        <div className="col-12 col-sm-6">
                          <label className="cj-label">Sample Input *</label>
                          <textarea className="cj-input form-control" rows={3} placeholder={"[2,7,11,15]\n9"} value={form.sampleInput} onChange={set('sampleInput')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="cj-label">Sample Output *</label>
                          <textarea className="cj-input form-control" rows={3} placeholder="[0,1]" value={form.sampleOutput} onChange={set('sampleOutput')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="hidden-section">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-lock-fill" style={{ color: 'var(--cj-red)' }} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cj-red)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Hidden Test Cases</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>— not visible · separate with ---</span>
                      </div>
                      <div className="row g-3">
                        <div className="col-12 col-sm-6">
                          <label className="cj-label">Hidden Input</label>
                          <textarea className="cj-input form-control" rows={3} placeholder="Edge case inputs…" value={form.hiddenInput} onChange={set('hiddenInput')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="cj-label">Expected Output</label>
                          <textarea className="cj-input form-control" rows={3} placeholder="Expected outputs…" value={form.hiddenOutput} onChange={set('hiddenOutput')} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }} />
                        </div>
                      </div>
                    </div>
                  </div>
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
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-3">
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
                    <div key={r.l} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--cj-muted)' }}>{r.l}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: r.c }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="cj-card p-3" style={{ border: '1px solid rgba(79,110,247,.2)', background: 'rgba(79,110,247,.05)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--cj-text-dim)', margin: 0, lineHeight: 1.7 }}>
                  <i className="bi bi-info-circle me-2" style={{ color: 'var(--cj-brand)' }} />
                  Separate multiple test cases with <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(255,255,255,.06)', padding: '1px 6px', borderRadius: 4 }}>---</code> on its own line.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'manage' && (
        <div className="cj-card overflow-hidden">
          <div className="cj-card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-list-ul" style={{ color: 'var(--cj-brand)' }} />
              <span className="fw-semibold">All Problems</span>
              <span className="cj-badge" style={{ background: 'rgba(79,110,247,.12)', color: 'var(--cj-brand)', border: '1px solid rgba(79,110,247,.2)', fontSize: '0.72rem' }}>{totalProblems}</span>
            </div>
            <button className="btn btn-outline-cj btn-sm d-flex align-items-center gap-1" onClick={() => loadProblems(managePage)} disabled={manageLoading}>
              <i className="bi bi-arrow-clockwise" />Refresh
            </button>
          </div>
          {manageLoading ? (
            <div className="d-flex align-items-center justify-content-center py-5 gap-2" style={{ color: 'var(--cj-muted)' }}>
              <Spinner /><span style={{ fontSize: '0.85rem' }}>Loading…</span>
            </div>
          ) : problems.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--cj-muted)', fontSize: '0.875rem' }}>
              <i className="bi bi-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 8 }} />
              No problems yet.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table mb-0" style={{ fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--cj-border)' }}>
                      {['#', 'Title', 'Difficulty', 'Topic', 'Points', 'Action'].map((h, i) => (
                        <th key={h} style={{ padding: '10px 16px', color: 'var(--cj-muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', background: 'rgba(255,255,255,.02)', textAlign: i >= 4 ? 'center' : 'left', width: i === 0 ? 48 : 'auto' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((p) => {
                      const dc = DIFFICULTY_COLORS[p.difficulty] || {};
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                          <td style={{ padding: '12px 16px', color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{p.id}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--cj-text)', fontWeight: 500 }}>{p.title}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span className="cj-badge" style={{ background: dc.bg, color: dc.color, border: `1px solid ${dc.color}33`, fontSize: '0.72rem' }}>{p.difficulty}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: 'var(--cj-muted)', fontSize: '0.82rem', textTransform: 'capitalize' }}>{p.topic}</td>
                          <td style={{ padding: '12px 16px', color: 'var(--cj-text)', fontFamily: 'JetBrains Mono, monospace', textAlign: 'center' }}>{p.points}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <button
                              className="btn btn-sm d-inline-flex align-items-center gap-1"
                              style={{ fontSize: '0.78rem', color: 'var(--cj-red)', border: '1px solid rgba(240,80,96,.3)', background: 'rgba(240,80,96,.06)', padding: '3px 10px', borderRadius: 6 }}
                              onClick={() => handleDelete(p.id, p.title)}
                              disabled={deletingId === p.id}
                            >
                              {deletingId === p.id ? <Spinner /> : <i className="bi bi-trash3" />}
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-between px-4 py-3" style={{ borderTop: '1px solid var(--cj-border)', fontSize: '0.82rem', color: 'var(--cj-muted)' }}>
                  <span>Page {managePage + 1} of {totalPages} · {totalProblems} total</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-cj btn-sm" disabled={managePage === 0} onClick={() => loadProblems(managePage - 1)}><i className="bi bi-chevron-left" /></button>
                    <button className="btn btn-outline-cj btn-sm" disabled={managePage >= totalPages - 1} onClick={() => loadProblems(managePage + 1)}><i className="bi bi-chevron-right" /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}