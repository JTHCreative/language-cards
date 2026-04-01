import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthChange, logout } from './utils/auth';
import LoginPage from './pages/LoginPage';
import GlobePage from './pages/GlobePage';
import LanguageHomePage from './pages/LanguageHomePage';
import PracticePage from './pages/PracticePage';
import ChallengePage from './pages/ChallengePage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a1a',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '1rem',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {!user ? (
          <>
            <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<GlobePage onLogout={handleLogout} />} />
            <Route path="/language/:languageId" element={<LanguageHomePage />} />
            <Route path="/practice/:languageId" element={<PracticePage />} />
            <Route path="/challenge/:code" element={<ChallengePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </HashRouter>
  );
}

export default App;
