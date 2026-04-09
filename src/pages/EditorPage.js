import React, { useState } from 'react';
import { DiffBadge, TopicTag } from '../components/UI';
import ProblemPanel from '../components/ProblemPanel';
import CodePanel from '../components/CodePanel';
import { submissionAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { STARTER_CODE } from '../data/mockData';

const LANG_MAP = {
  java: 'JAVA',
  python: 'PYTHON',
  cpp: 'CPP',
  javascript: 'JAVASCRIPT',
};

export default function EditorPage({ problem, onBack, toast, onNavigate }) {
  const { isLoggedIn } = useAuth();

  const p = problem || {};

  const [lang, setLang] = useState('java');
  const [code, setCode] = useState(STARTER_CODE.java || '');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const diff = (p.difficulty || p.diff || '').toLowerCase();
  const tag = (p.topic || p.tag || '').toLowerCase();

  const changeLang = (l) => {
    setLang(l);
    setCode(STARTER_CODE[l] || '');
    setResults(null);
  };

  const handleRun = async () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to run code.');
      onNavigate('login');
      return;
    }
    if (!p.id) {
      toast.error('No problem loaded.');
      return;
    }

    setRunning(true);
    setResults(null);

    try {
      const res = await submissionAPI.submit({
        problemId: p.id,
        code,
        language: LANG_MAP[lang] || lang.toUpperCase(),
      });

      const s = res.data;
      setResults([
        {
          tc: 'Run result',
          verdict: s.verdict,
          time: s.executionTimeMs != null ? `${s.executionTimeMs}ms` : '—',
          mem: s.memoryUsedMb != null ? `${s.memoryUsedMb} MB` : '—',
        },
      ]);

      if (s.verdict === 'AC') toast.success('✓ Correct! All test cases passed.');
      else if (s.verdict === 'WA') toast.error(`✗ Wrong Answer${s.failedTestCase ? ` on test case ${s.failedTestCase}` : ''}.`);
      else if (s.verdict === 'TLE') toast.warning('⏱ Time Limit Exceeded.');
      else if (s.verdict === 'CE') toast.error('⚠ Compile Error — check your code.');
      else if (s.verdict === 'RE') toast.error(`⚠ Runtime Error${s.errorMessage ? ': ' + s.errorMessage.slice(0, 80) : ''}.`);
      else toast.info(`Result: ${s.verdict}`);

    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      toast.error('Please sign in to submit.');
      onNavigate('login');
      return;
    }
    if (!p.id) {
      toast.error('No problem loaded.');
      return;
    }

    setSubmitting(true);
    setResults(null);

    try {
      const res = await submissionAPI.submit({
        problemId: p.id,
        code,
        language: LANG_MAP[lang] || lang.toUpperCase(),
      });

      const s = res.data;

      const rows = [];
      const total = s.failedTestCase || 1;
      for (let i = 1; i <= (s.failedTestCase || 1); i++) {
        rows.push({
          tc: `Test Case ${i}${i === s.failedTestCase && s.verdict !== 'AC' ? ' ✗' : ''}`,
          verdict: i < total ? 'AC' : s.verdict,
          time: s.executionTimeMs != null ? `${s.executionTimeMs}ms` : '—',
          mem: s.memoryUsedMb != null ? `${s.memoryUsedMb} MB` : '—',
        });
      }
      if (s.verdict === 'AC') {
        rows.length = 0;
        rows.push({ tc: 'All test cases', verdict: 'AC', time: `${s.executionTimeMs || 0}ms`, mem: `${s.memoryUsedMb || 0} MB` });
      }
      setResults(rows);

      if (s.verdict === 'AC') toast.success('🎉 Accepted! All test cases passed.');
      else if (s.verdict === 'WA') toast.error(`✗ Wrong Answer on test case ${s.failedTestCase || '?'}.`);
      else if (s.verdict === 'TLE') toast.warning('⏱ Time Limit Exceeded.');
      else if (s.verdict === 'CE') toast.error('⚠ Compile Error.');
      else if (s.verdict === 'RE') toast.error(`⚠ Runtime Error${s.errorMessage ? ': ' + s.errorMessage.slice(0, 80) : ''}.`);
      else toast.info(`Verdict: ${s.verdict}`);

    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="editor-root">
      <div className="editor-topbar">
        <button className="btn btn-outline-cj btn-sm py-0" onClick={onBack}>
          <i className="bi bi-arrow-left me-1" />Problems
        </button>
        <span style={{ color: 'var(--cj-muted)', fontSize: 13 }}>/</span>
        <span
          className="hide-sm"
          style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}
        >
          {p.id}. {p.title}
        </span>
        <div className="ms-auto d-flex gap-2 flex-shrink-0">
          {diff && <DiffBadge diff={diff} />}
          {tag && <TopicTag tag={tag} />}
        </div>
      </div>

      <div className="editor-split">
        <ProblemPanel problem={p} />
        <CodePanel
          lang={lang}
          onLangChange={changeLang}
          code={code}
          onCodeChange={setCode}
          onRun={handleRun}
          onSubmit={handleSubmit}
          running={running}
          submitting={submitting}
          results={results}
        />
      </div>
    </div>
  );
}