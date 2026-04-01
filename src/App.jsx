import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './utils/auth';
import LoginPage from './pages/LoginPage';
import GlobePage from './pages/GlobePage';
import LanguageHomePage from './pages/LanguageHomePage';
import PracticePage from './pages/PracticePage';
import './App.css';

function App() {
  const [user, setUser] = useState(() => getCurrentUser());

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
