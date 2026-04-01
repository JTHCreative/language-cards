import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, updateUserPassword, getChallengeStats } from '../utils/auth';
import '../styles/SettingsModal.css';

function SettingsSection({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`settings-section ${open ? 'open' : ''}`}>
      <button className="settings-section-toggle" onClick={() => setOpen(!open)}>
        <div className="settings-section-left">
          {icon}
          <span>{title}</span>
        </div>
        <svg
          className="settings-section-chevron"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="settings-section-content">{children}</div>}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

export default function SettingsModal({ user, onClose, onLogout }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      Promise.all([
        getUserProfile(user.uid),
        getChallengeStats(user.uid),
      ]).then(([profile, challengeStats]) => {
        if (profile) {
          setFirstName(profile.firstName || '');
          setLastName(profile.lastName || '');
          setEmail(profile.email || '');
        }
        setStats(challengeStats);
        setLoading(false);
      });
    }
  }, [user?.uid]);

  const handleSave = async () => {
    setError('');
    setMessage('');
    setSaving(true);

    try {
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

  const avgScore = stats && stats.wordsTotal > 0
    ? ((stats.wordsCorrect / stats.wordsTotal) * 10).toFixed(1)
    : '0.0';

  return (
    <div className="settings-dropdown">
      <div className="settings-header">
        <h2>Profile</h2>
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

          {/* Challenges Section */}
          <SettingsSection
            title="Challenges"
            defaultOpen={true}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
          >
            {stats && stats.played > 0 ? (
              <>
                <div className="stats-grid">
                  <StatCard label="Played" value={stats.played} />
                  <StatCard label="Won" value={stats.won} />
                  <StatCard label="Lost" value={stats.lost} />
                  <StatCard label="Avg Score" value={`${avgScore}/10`} />
                </div>
                <div className="stats-detail">
                  <div className="stats-detail-row">
                    <span>Record</span>
                    <span>{stats.won}W - {stats.lost}L{stats.tied > 0 ? ` - ${stats.tied}T` : ''}</span>
                  </div>
                  <div className="stats-detail-row">
                    <span>Words Correct</span>
                    <span>{stats.wordsCorrect} / {stats.wordsTotal}</span>
                  </div>
                  <div className="stats-detail-row">
                    <span>Accuracy</span>
                    <span>{stats.wordsTotal > 0 ? Math.round((stats.wordsCorrect / stats.wordsTotal) * 100) : 0}%</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="stats-empty">
                <p>No challenges yet. Start a Face Off to see your stats!</p>
              </div>
            )}
          </SettingsSection>

          {/* Account Settings Section */}
          <SettingsSection
            title="Account Settings"
            defaultOpen={false}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          >
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

            <button className="settings-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </SettingsSection>

          <div className="settings-footer">
            <button className="settings-logout" onClick={onLogout}>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
