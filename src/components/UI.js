// src/components/UI.jsx
import React from 'react';

// ── Difficulty Badge ──────────────────────────
export function DiffBadge({ diff }) {
  const labels = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
  return (
    <span className={`cj-badge badge-${diff}`}>
      {diff === 'easy' && <i className="bi bi-circle-fill me-1" style={{ fontSize: 6 }}></i>}
      {diff === 'medium' && <i className="bi bi-circle-fill me-1" style={{ fontSize: 6 }}></i>}
      {diff === 'hard' && <i className="bi bi-circle-fill me-1" style={{ fontSize: 6 }}></i>}
      {labels[diff] || diff}
    </span>
  );
}

// ── Verdict Badge ─────────────────────────────
export function VerdictBadge({ verdict }) {
  const map = {
    AC: { cls: 'ac', icon: 'bi-check-circle-fill', label: 'Accepted' },
    WA: { cls: 'wa', icon: 'bi-x-circle-fill', label: 'Wrong Answer' },
    TLE: { cls: 'tle', icon: 'bi-clock-fill', label: 'Time Limit' },
    RE: { cls: 're', icon: 'bi-exclamation-triangle-fill', label: 'Runtime Error' },
  };
  const v = map[verdict] || { cls: 'wa', icon: 'bi-question-circle', label: verdict };
  return (
    <span className={`cj-badge badge-${v.cls}`}>
      <i className={`bi ${v.icon}`}></i>
      {v.label}
    </span>
  );
}

// ── Topic Tag ─────────────────────────────────
export function TopicTag({ tag }) {
  return <span className={`tag-${tag}`}>{tag}</span>;
}

// ── Spinner ───────────────────────────────────
export function Spinner({ size = 'sm', className = '' }) {
  return (
    <div
      className={`spinner-border text-light spinner-border-${size} ${className}`}
      role="status"
      style={{ width: size === 'sm' ? 14 : 20, height: size === 'sm' ? 14 : 20, borderWidth: 2 }}
    >
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

// ── Empty State ───────────────────────────────
export function EmptyState({ icon = 'bi-inbox', message = 'Nothing here yet.' }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon} fs-1 text-secondary d-block mb-3`}></i>
      <p className="text-secondary mb-0">{message}</p>
    </div>
  );
}

// ── Toast Container ───────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  const iconMap = {
    success: { icon: 'bi-check-circle-fill', color: '#3fb950' },
    error: { icon: 'bi-x-circle-fill', color: '#f85149' },
    warning: { icon: 'bi-exclamation-triangle-fill', color: '#d29922' },
    info: { icon: 'bi-info-circle-fill', color: '#58a6ff' },
  };
  return (
    <div className="cj-toast-container">
      {toasts.map(t => {
        const { icon, color } = iconMap[t.type] || iconMap.info;
        return (
          <div key={t.id} className="cj-toast" onClick={() => onDismiss(t.id)}>
            <i className={`bi ${icon}`} style={{ color, fontSize: 16 }}></i>
            <span>{t.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────
export function StatCard({ label, value, sub, color = 'var(--cj-brand)', icon }) {
  return (
    <div className="cj-card p-3 h-100">
      <div className="d-flex align-items-center gap-2 mb-2">
        {icon && <i className={`bi ${icon}`} style={{ color, fontSize: 18 }}></i>}
        <span className="cj-label">{label}</span>
      </div>
      <div style={{ fontFamily: 'inherit', fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-1px', color, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div className="mt-1" style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>{sub}</div>}
    </div>
  );
}

// ── Page Header ───────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h4 className="fw-bold mb-0" style={{ letterSpacing: '-0.4px' }}>{title}</h4>
        {subtitle && <p className="mb-0 mt-1" style={{ fontSize: '0.85rem', color: 'var(--cj-muted)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────
export function ProgressBar({ pct, label }) {
  return (
    <div>
      {label && <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>
        <span>{label}</span>
        <span>{pct}%</span>
      </div>}
      <div className="cj-progress">
        <div className="cj-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}