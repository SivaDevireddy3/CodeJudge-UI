import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
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
    const { isAdmin, loading, registerNavigate } = useAuth();

    const navigate = (p) => {
        setPage(p);
        if (p !== 'editor') setActiveProblem(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    useEffect(() => {
        registerNavigate(navigate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openProblem = (problem) => {
        setActiveProblem(problem);
        setPage('editor');
        window.scrollTo({ top: 0 });
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--cj-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="cj-brand-icon mx-auto mb-3" style={{ width: 48, height: 48, fontSize: 22 }}>⚡</div>
                    <div className="cj-spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar page={page === 'editor' ? 'problems' : page} onNavigate={navigate} />
            <main style={{ flex: 1 }}>
                {page === 'home' && <HomePage onNavigate={navigate} />}
                {page === 'problems' && <ProblemsPage onOpenProblem={openProblem} />}
                {page === 'editor' && <EditorPage problem={activeProblem} onBack={() => navigate('problems')} toast={toast} onNavigate={navigate} />}
                {page === 'submissions' && <SubmissionsPage onOpenProblem={openProblem} />}
                {page === 'leaderboard' && <LeaderboardPage />}
                {page === 'profile' && <ProfilePage onNavigate={navigate} />}
                {page === 'admin' && isAdmin && <AdminPage toast={toast} />}
                {page === 'admin' && !isAdmin && (
                    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 58px)' }}>
                        <div className="text-center p-4">
                            <i className="bi bi-shield-x" style={{ fontSize: 52, color: 'var(--cj-red)' }} />
                            <h5 className="mt-3 fw-bold">Access Denied</h5>
                            <p style={{ color: 'var(--cj-muted)' }}>Admin role required to view this page.</p>
                            <button className="btn btn-outline-cj mt-2" onClick={() => navigate('login')}>Sign In as Admin</button>
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