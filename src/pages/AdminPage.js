// src/pages/AdminPage.jsx
import React, { useState } from 'react';
import { PageHeader } from '../components/UI';
import { PROBLEMS } from '../data/mockData';

const BLANK = {
  title: '', diff: 'easy', tag: 'array', desc: '',
  sampleIn: '', sampleOut: '', hiddenIn: '', hiddenOut: '',
  timeLimit: '2000', memLimit: '256', points: '100',
};

export default function AdminPage({ toast }) {
  const [form, setForm] = useState(BLANK);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.desc.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    toast.success(`Problem "${form.title}" created successfully!`);
    setForm(BLANK);
  };

  const counts = {
    total: PROBLEMS.length,
    easy: PROBLEMS.filter(p => p.diff === 'easy').length,
    medium: PROBLEMS.filter(p => p.diff === 'medium').length,
    hard: PROBLEMS.filter(p => p.diff === 'hard').length,
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <PageHeader
        title="Admin Panel"
        subtitle="Create and manage problems — ADMIN role required"
        action={
          <span className="cj-badge" style={{ background: 'rgba(248,81,73,.15)', color: 'var(--cj-red)', border: '1px solid rgba(248,81,73,.3)', fontSize: '0.75rem' }}>
            <i className="bi bi-shield-lock-fill me-1"></i>ADMIN
          </span>
        }
      />

      <div className="row g-4">
        {/* Form */}
        <div className="col-12 col-lg-8">
          <div className="cj-card overflow-hidden">
            <div className="cj-card-header d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle" style={{ color: 'var(--cj-brand)' }}></i>
              <span className="fw-semibold">New Problem</span>
            </div>
            <form onSubmit={handleSubmit} className="p-3 p-md-4">
              <div className="row g-3">

                {/* Title */}
                <div className="col-12">
                  <label className="cj-label">Problem Title *</label>
                  <input className="cj-input form-control" placeholder="e.g. Two Sum"
                    value={form.title} onChange={set('title')} />
                </div>

                {/* Difficulty + Tag */}
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Difficulty</label>
                  <select className="cj-input form-select" value={form.diff} onChange={set('diff')}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Topic</label>
                  <select className="cj-input form-select" value={form.tag} onChange={set('tag')}>
                    {['array', 'dp', 'string', 'tree', 'graph', 'hash', 'math'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="col-12">
                  <label className="cj-label">Problem Description *</label>
                  <textarea className="cj-input form-control" rows={5}
                    placeholder="Full problem statement with examples…"
                    value={form.desc} onChange={set('desc')}
                    style={{ fontFamily: 'inherit', lineHeight: 1.7 }} />
                </div>

                {/* Sample IO */}
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Sample Input</label>
                  <textarea className="cj-input form-control" rows={3}
                    placeholder="[2,7,11,15]&#10;9"
                    value={form.sampleIn} onChange={set('sampleIn')}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="cj-label">Sample Output</label>
                  <textarea className="cj-input form-control" rows={3}
                    placeholder="[0,1]"
                    value={form.sampleOut} onChange={set('sampleOut')}
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                </div>

                {/* Hidden test cases */}
                <div className="col-12">
                  <div className="hidden-section">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-lock-fill" style={{ color: 'var(--cj-red)' }}></i>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cj-red)', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                        Hidden Test Cases
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>— not visible to users</span>
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Hidden Input</label>
                        <textarea className="cj-input form-control" rows={3}
                          placeholder="Edge case inputs…"
                          value={form.hiddenIn} onChange={set('hiddenIn')}
                          style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                      </div>
                      <div className="col-12 col-sm-6">
                        <label className="cj-label">Expected Output</label>
                        <textarea className="cj-input form-control" rows={3}
                          placeholder="Expected outputs…"
                          value={form.hiddenOut} onChange={set('hiddenOut')}
                          style={{ fontFamily: 'monospace', fontSize: '0.85rem' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limits + Points */}
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Time Limit (ms)</label>
                  <input className="cj-input form-control" type="number"
                    value={form.timeLimit} onChange={set('timeLimit')} min={100} max={10000} />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Memory Limit (MB)</label>
                  <input className="cj-input form-control" type="number"
                    value={form.memLimit} onChange={set('memLimit')} min={32} max={1024} />
                </div>
                <div className="col-12 col-sm-4">
                  <label className="cj-label">Points</label>
                  <input className="cj-input form-control" type="number"
                    value={form.points} onChange={set('points')} min={10} max={1000} />
                </div>

                {/* Actions */}
                <div className="col-12 d-flex gap-2 pt-1">
                  <button type="submit" className="btn btn-brand">
                    <i className="bi bi-plus-circle me-2"></i>Create Problem
                  </button>
                  <button type="button" className="btn btn-outline-cj" onClick={() => setForm(BLANK)}>
                    <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-3">

            {/* Problem stats */}
            <div className="cj-card overflow-hidden">
              <div className="cj-card-header">
                <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                  <i className="bi bi-bar-chart me-2" style={{ color: 'var(--cj-brand)' }}></i>
                  Problem Stats
                </span>
              </div>
              <div className="p-3">
                {[
                  { l: 'Total Problems', v: counts.total, c: 'var(--cj-text)' },
                  { l: 'Easy', v: counts.easy, c: 'var(--cj-green)' },
                  { l: 'Medium', v: counts.medium, c: 'var(--cj-amber)' },
                  { l: 'Hard', v: counts.hard, c: 'var(--cj-red)' },
                ].map(r => (
                  <div key={r.l} className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--cj-muted)' }}>{r.l}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Docker config */}
            <div className="cj-card overflow-hidden">
              <div className="cj-card-header">
                <span className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                  <i className="bi bi-box me-2" style={{ color: 'var(--cj-blue)' }}></i>
                  Docker Sandbox
                </span>
              </div>
              <div className="p-3">
                {[
                  { l: 'CPU Limit', v: '0.5 cores', c: 'var(--cj-blue)' },
                  { l: 'RAM Limit', v: '256 MB', c: 'var(--cj-blue)' },
                  { l: 'Network', v: 'Disabled', c: 'var(--cj-red)' },
                  { l: 'Filesystem', v: 'Read-only', c: 'var(--cj-amber)' },
                  { l: 'Default TL', v: '2000 ms', c: 'var(--cj-muted)' },
                ].map(r => (
                  <div key={r.l} className="d-flex justify-content-between align-items-center py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--cj-muted)' }}>{r.l}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: r.c }}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}