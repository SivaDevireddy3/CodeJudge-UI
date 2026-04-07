// src/components/CodePanel.jsx
import React, { useRef } from 'react';
import { Spinner } from './UI';
import Console from './Console';
import { STARTER_CODE } from '../data/mockData';

export default function CodePanel({ lang, onLangChange, code, onCodeChange, onRun, onSubmit, running, submitting, results }) {
  const ref = useRef(null);

  const handleKeyDown = e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart;
      const val = code.slice(0, s) + '    ' + code.slice(e.target.selectionEnd);
      onCodeChange(val);
      setTimeout(() => { if (ref.current) ref.current.selectionStart = ref.current.selectionEnd = s + 4; }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); if (!running && !submitting) onSubmit(); }
  };

  return (
    <div className="code-panel">
      {/* Toolbar */}
      <div className="code-toolbar">
        <select className="lang-select" value={lang} onChange={e => onLangChange(e.target.value)}>
          <option value="java">Java</option>
          <option value="python">Python 3</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div style={{ width: 1, height: 16, background: 'var(--cj-border)' }} />

        <button className="btn btn-outline-cj btn-sm hide-xs" onClick={() => onCodeChange(STARTER_CODE[lang] || '')}>
          <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
        </button>
        <button className="btn btn-outline-cj btn-sm hide-xs"
          onClick={() => navigator.clipboard && navigator.clipboard.writeText(code)}>
          <i className="bi bi-clipboard me-1"></i>Copy
        </button>

        <div className="ms-auto" style={{ fontSize: '0.72rem', color: 'var(--cj-muted)', fontFamily: 'monospace' }}>
          {code.split('\n').length}L
        </div>
      </div>

      {/* Code textarea */}
      <div className="code-area-wrap">
        <textarea
          ref={ref}
          className="cj-code-area p-3"
          value={code}
          onChange={e => onCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          style={{ height: '100%' }}
        />
      </div>

      {/* Console */}
      <Console results={results} running={running} submitting={submitting} />

      {/* Submit bar */}
      <div className="submit-bar">
        <button className="btn btn-outline-cj btn-sm" onClick={onRun} disabled={running || submitting}>
          {running ? <Spinner /> : <i className="bi bi-play-fill me-1"></i>}
          {running ? 'Running…' : 'Run'}
        </button>
        <button className="btn btn-brand btn-sm" onClick={onSubmit} disabled={running || submitting}>
          {submitting && <Spinner className="me-1" />}
          {submitting ? 'Judging…' : 'Submit'}
        </button>
        <span className="ms-auto hide-sm" style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>
          <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', border: '1px solid var(--cj-border)' }}>Ctrl+Enter</kbd> to submit
        </span>
      </div>
    </div>
  );
}