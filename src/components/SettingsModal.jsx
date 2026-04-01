import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, updateUserPassword } from '../utils/auth';
import '../styles/SettingsModal.css';

export default function SettingsModal({ user, onClose, onLogout }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          setFirstName(profile.firstName || '');
          setLastName(profile.lastName || '');
          setEmail(profile.email || '');
        }
        setLoading(false);
      });
    }
  }, [user?.uid]);

  const handleSave = async () => {
    setError('');
    setMessage('');
    setSaving(true);

    try {
      // Update profile fields
      const result = await updateUserProfile(user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });

      if (!result.success) {
        setError(result.error);
        setSaving(false);
        return;
      }

      // Update password if provided
      if (newPassword) {
        const pwResult = await updateUserPassword(newPassword);
        if (!pwResult.success) {
          setError(pwResult.error);
          setSaving(false);
          return;
        }
      }

      setMessage('Settings saved!');
      setNewPassword('');
    } catch (err) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="settings-overlay" onClick={handleOverlayClick}>
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Account Settings</h2>
          <button className="settings-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="settings-loading">Loading...</div>
        ) : (
          <div className="settings-body">
            {error && <div className="settings-error">{error}</div>}
            {message && <div className="settings-success">{message}</div>}

            <div className="settings-field">
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
              <span className="settings-hint">Username cannot be changed</span>
            </div>

            <div className="settings-row">
              <div className="settings-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="settings-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="settings-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={saving}
              />
            </div>

            <div className="settings-field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                disabled={saving}
                autoComplete="new-password"
              />
            </div>

            <div className="settings-actions">
              <button className="settings-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="settings-logout" onClick={onLogout}>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
