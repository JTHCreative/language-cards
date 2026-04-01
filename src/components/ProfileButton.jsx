import { useState, useRef, useEffect } from 'react';
import SettingsModal from './SettingsModal';
import '../styles/ProfileButton.css';

export default function ProfileButton({ user, onLogout }) {
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  const initials = getInitials(user);
  const displayName = user?.firstName || user?.username || '';

  // Close on click outside
  useEffect(() => {
    if (!showSettings) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showSettings]);

  // Close on Escape
  useEffect(() => {
    if (!showSettings) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setShowSettings(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showSettings]);

  return (
    <div className="profile-container" ref={containerRef}>
      <button className="profile-btn" onClick={() => setShowSettings(!showSettings)}>
        <div className="profile-avatar">{initials}</div>
        <span className="profile-name">{displayName}</span>
      </button>

      {showSettings && (
        <SettingsModal
          user={user}
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}
    </div>
  );
}

function getInitials(user) {
  if (user?.firstName) {
    const first = user.firstName[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase();
  }
  return (user?.username?.[0] || '?').toUpperCase();
}
