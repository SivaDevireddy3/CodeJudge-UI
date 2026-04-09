import React, { useRef } from 'react';
import { Spinner } from './UI';
import Console from './Console';
import { STARTER_CODE } from '../data/mockData';

export default function CodePanel({
  lang, onLangChange, code, onCodeChange,
  onRun, onSubmit, running, submitting, results,
}) {
  const ref = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '    ';
      const newVal = code.slice(0, start) + spaces + code.slice(end);
      onCodeChange(newVal);
      setTimeout(() => {
        if (ref.current) {
          ref.current.selectionStart = start + 4;
          ref.current.selectionEnd = start + 4;
        }
      }, 0);
    }

    // Ctrl/Cmd + Enter → Submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!running && !submitting) onSubmit();
    }

    // Ctrl/Cmd + R → Run
    if ((e.ctrlKey || e.metaKey) && e.key === "'") {
      e.preventDefault();
      if (!running && !submitting) onRun();
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => { });
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="code-panel">
      <div className="code-toolbar">
        <select
          className="lang-select"
          value={lang}
          onChange={(e) => onLangChange(e.target.value)}
          aria-label="Language"
        >
          <option value="java">Java 17</option>
          <option value="python">Python 3</option>
          <option value="cpp">C++ 17</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div className="cj-divider" />

        <button
          className="btn btn-outline-cj btn-sm hide-xs"
          onClick={() => { onCodeChange(STARTER_CODE[lang] || ''); }}
          title="Reset to starter code"
        >
          <i className="bi bi-arrow-counterclockwise me-1" />
          Reset
        </button>

        <button
          className="btn btn-outline-cj btn-sm hide-xs"
          onClick={handleCopy}
          title="Copy code"
        >
          <i className="bi bi-clipboard me-1" />
          Copy
        </button>

        <div className="ms-auto" style={{ fontSize: '0.72rem', color: 'var(--cj-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {lineCount}L
        </div>
      </div>

      <div className="code-area-wrap">
        <textarea
          ref={ref}
          className="cj-code-area"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Code editor"
        />
      </div>

      <Console results={results} running={running} submitting={submitting} />

      <div className="submit-bar">
        <button
          className="btn btn-outline-cj btn-sm d-flex align-items-center gap-2"
          onClick={onRun}
          disabled={running || submitting}
          title="Run against sample test cases"
        >
          {running ? <Spinner /> : <i className="bi bi-play-fill" />}
          <span>{running ? 'Running…' : 'Run'}</span>
        </button>

        <button
          className="btn btn-brand btn-sm d-flex align-items-center gap-2"
          onClick={onSubmit}
          disabled={running || submitting}
          title="Submit against all test cases (Ctrl+Enter)"
        >
          {submitting && <Spinner />}
          <span>{submitting ? 'Judging…' : 'Submit'}</span>
        </button>

        <div className="ms-auto d-none d-md-flex align-items-center gap-1">
          <span className="kbd-hint">Ctrl+Enter</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--cj-muted)' }}>to submit</span>
        </div>
      </div>
    </div>
  );
}