import { useState } from 'react';
import SettingsModal from './SettingsModal';
import '../styles/ProfileButton.css';

export default function ProfileButton({ user, onLogout }) {
  const [showSettings, setShowSettings] = useState(false);

  const initials = getInitials(user);
  const displayName = user?.firstName || user?.username || '';

  return (
    <>
      <button className="profile-btn" onClick={() => setShowSettings(true)}>
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
    </>
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
