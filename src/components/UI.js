// src/components/UI.js
import React from 'react';

// ── Difficulty Badge ──────────────────────────────────────────
export function DiffBadge({ diff }) {
  const map = {
    easy: { cls: 'easy', label: 'Easy', dot: 'var(--cj-green)' },
    medium: { cls: 'medium', label: 'Medium', dot: 'var(--cj-amber)' },
    hard: { cls: 'hard', label: 'Hard', dot: 'var(--cj-red)' },
  };
  const v = map[diff] || map.easy;
  return (
    <span className={`cj-badge badge-${v.cls}`}>
      <span
        style={{
          width: 5, height: 5, borderRadius: '50%',
          background: v.dot, display: 'inline-block', flexShrink: 0,
        }}
      />
      {v.label}
    </span>
  );
}

// ── Verdict Badge ─────────────────────────────────────────────
export function VerdictBadge({ verdict }) {
  const map = {
    AC: { cls: 'ac', icon: 'bi-check-circle-fill', label: 'Accepted' },
    WA: { cls: 'wa', icon: 'bi-x-circle-fill', label: 'Wrong Answer' },
    TLE: { cls: 'tle', icon: 'bi-clock-fill', label: 'Time Limit' },
    RE: { cls: 're', icon: 'bi-exclamation-triangle-fill', label: 'Runtime Error' },
    PENDING: { cls: 'pending', icon: 'bi-hourglass-split', label: 'Pending' },
    CE: { cls: 're', icon: 'bi-bug-fill', label: 'Compile Error' },
  };
  const v = map[verdict] || { cls: 'wa', icon: 'bi-question-circle', label: verdict };
  return (
    <span className={`cj-badge badge-${v.cls}`}>
      <i className={`bi ${v.icon}`} style={{ fontSize: 11 }} />
      {v.label}
    </span>
  );
}

// ── Topic Tag ─────────────────────────────────────────────────
export function TopicTag({ tag }) {
  if (!tag) return null;
  return (
    <span className={`cj-badge tag-pill tag-${tag}`}>
      {tag.charAt(0).toUpperCase() + tag.slice(1)}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ className = '' }) {
  return <span className={`cj-spinner ${className}`} role="status" aria-label="Loading" />;
}

// ── Empty State ───────────────────────────────────────────────
export function EmptyState({ icon = 'bi-inbox', message = 'Nothing here yet.', action }) {
  return (
    <div className="text-center py-5">
      <i className={`bi ${icon} d-block mb-3`} style={{ fontSize: 40, color: 'var(--cj-muted)' }} />
      <p style={{ color: 'var(--cj-muted)', marginBottom: action ? 16 : 0, fontSize: '0.9rem' }}>
        {message}
      </p>
      {action}
    </div>
  );
}

// ── Toast Container ───────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  const iconMap = {
    success: { icon: 'bi-check-circle-fill', color: 'var(--cj-green)' },
    error: { icon: 'bi-x-circle-fill', color: 'var(--cj-red)' },
    warning: { icon: 'bi-exclamation-triangle-fill', color: 'var(--cj-amber)' },
    info: { icon: 'bi-info-circle-fill', color: 'var(--cj-blue)' },
  };
  return (
    <div className="cj-toast-container">
      {toasts.map((t) => {
        const { icon, color } = iconMap[t.type] || iconMap.info;
        return (
          <div key={t.id} className="cj-toast" onClick={() => onDismiss(t.id)} role="alert">
            <i className={`bi ${icon}`} style={{ color, fontSize: 16, flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{t.msg}</span>
            <i className="bi bi-x" style={{ color: 'var(--cj-muted)', fontSize: 13 }} />
          </div>
        );
      })}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'var(--cj-brand)', icon }) {
  return (
    <div className="cj-card p-3 h-100">
      <div className="d-flex align-items-center gap-2 mb-2">
        {icon && (
          <div
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className={`bi ${icon}`} style={{ color, fontSize: 15 }} />
          </div>
        )}
        <span className="cj-label mb-0">{label}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1.5px', color, lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && (
        <div className="mt-1" style={{ fontSize: '0.78rem', color: 'var(--cj-muted)' }}>{sub}</div>
      )}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-2">
      <div>
        <h4 className="page-header-title mb-0">{title}</h4>
        {subtitle && (
          <p className="mb-0 mt-1" style={{ fontSize: '0.85rem', color: 'var(--cj-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────
export function ProgressBar({ pct, color }) {
  return (
    <div className="cj-progress">
      <div
        className="cj-progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }}
      />
    </div>
  );
}

// ── Section Divider ───────────────────────────────────────────
export function SectionDivider({ label }) {
  return (
    <div
      className="d-flex align-items-center gap-3 my-4"
      style={{
        color: 'var(--cj-muted)', fontSize: '0.72rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.8px'
      }}
    >
      <div style={{ flex: 1, height: 1, background: 'var(--cj-border)' }} />
      {label}
      <div style={{ flex: 1, height: 1, background: 'var(--cj-border)' }} />
    </div>
  );
}