import React, { useState } from 'react';
import { DiffBadge, TopicTag } from '../components/UI';
import ProblemPanel from '../components/ProblemPanel';
import CodePanel from '../components/CodePanel';
import { PROBLEMS, STARTER_CODE } from '../data/mockData';

export default function EditorPage({ problem, onBack, toast }) {
  const p = problem || PROBLEMS[0];

  const [lang, setLang] = useState('java');
  const [code, setCode] = useState(STARTER_CODE.java);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const changeLang = l => {
    setLang(l);
    setCode(STARTER_CODE[l] || '');
    setResults(null);
  };

  const simulate = async isSubmit => {
    if (isSubmit) setSubmitting(true); else setRunning(true);
    setResults(null);

    // Simulate network + judge delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 900));

    const pool = isSubmit ? ['AC', 'AC', 'AC', 'WA', 'TLE', 'RE'] : ['AC', 'AC', 'WA'];
    const verdict = pool[Math.floor(Math.random() * pool.length)];
    const ms = `${Math.floor(20 + Math.random() * 100)}ms`;
    const mb = `${(38 + Math.random() * 14).toFixed(1)} MB`;

    setResults([
      { tc: 'Test Case 1', verdict, time: ms, mem: mb },
      ...(isSubmit ? [
        { tc: 'Test Case 2', verdict: verdict === 'AC' ? 'AC' : 'WA', time: ms, mem: mb },
        { tc: 'Test Case 3 (hidden)', verdict: verdict === 'AC' ? 'AC' : 'TLE', time: ms, mem: mb },
      ] : []),
    ]);

    if (isSubmit) {
      setSubmitting(false);
      if (verdict === 'AC') toast.success('✓ Accepted! All test cases passed.');
      else if (verdict === 'WA') toast.error('✗ Wrong Answer on some test cases.');
      else if (verdict === 'TLE') toast.warning('⏱ Time Limit Exceeded.');
      else toast.error('⚠ Runtime Error.');
    } else {
      setRunning(false);
    }
  };

  return (
    <div className="editor-root">
      {/* Top bar */}
      <div className="editor-topbar">
        <button className="btn btn-outline-cj btn-sm py-0" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i>Problems
        </button>
        <span style={{ color: 'var(--cj-muted)', fontSize: 13 }}>/</span>
        <span className="hide-sm" style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.num}. {p.title}
        </span>
        <div className="ms-auto d-flex gap-2">
          <DiffBadge diff={p.diff} />
          <TopicTag tag={p.tag} />
        </div>
      </div>

      {/* Split layout */}
      <div className="editor-split">
        <ProblemPanel problem={p} />
        <CodePanel
          lang={lang}
          onLangChange={changeLang}
          code={code}
          onCodeChange={setCode}
          onRun={() => simulate(false)}
          onSubmit={() => simulate(true)}
          running={running}
          submitting={submitting}
          results={results}
        />
      </div>
    </div>
  );
}