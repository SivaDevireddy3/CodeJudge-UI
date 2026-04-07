// src/App.js
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/UI';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import EditorPage from './pages/EditorPage';
import SubmissionsPage from './pages/SubmissionsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

function AppInner() {
  const [page, setPage] = useState('home');
  const [activeProblem, setActiveProblem] = useState(null);
  const { toast, toasts, dismiss } = useToast();
  const { isAdmin } = useAuth();

  const navigate = p => {
    setPage(p);
    if (p !== 'editor') setActiveProblem(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProblem = problem => {
    setActiveProblem(problem);
    setPage('editor');
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <Navbar
        page={page === 'editor' ? 'problems' : page}
        onNavigate={navigate}
      />
      <main style={{ flex: 1 }}>
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'problems' && <ProblemsPage onOpenProblem={openProblem} />}
        {page === 'editor' && <EditorPage problem={activeProblem} onBack={() => navigate('problems')} toast={toast} />}
        {page === 'submissions' && <SubmissionsPage />}
        {page === 'leaderboard' && <LeaderboardPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'admin' && isAdmin && <AdminPage toast={toast} />}
        {page === 'admin' && !isAdmin && (
          <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <div className="text-center p-4">
              <i className="bi bi-shield-x" style={{ fontSize: 48, color: 'var(--cj-red)' }}></i>
              <h5 className="mt-3 fw-bold">Access Denied</h5>
              <p style={{ color: 'var(--cj-muted)' }}>Admin role required.</p>
              <button className="btn btn-outline-cj" onClick={() => navigate('login')}>Sign In as Admin</button>
            </div>
          </div>
        )}
        {page === 'login' && <LoginPage onNavigate={navigate} toast={toast} />}
        {page === 'register' && <RegisterPage onNavigate={navigate} toast={toast} />}
      </main>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}