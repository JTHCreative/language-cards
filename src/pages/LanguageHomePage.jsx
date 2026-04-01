import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flag from '../components/Flag';
import { getLanguageById } from '../data/languages';
import { getCurrentUser } from '../utils/auth';
import { createChallenge, joinChallenge } from '../utils/challenge';
import '../styles/LanguageHomePage.css';

const difficultyIcons = {
  Novice: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
  Beginner: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Advanced: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Expert: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
};

const difficultyColors = {
  Novice: '#10b981',
  Beginner: '#3b82f6',
  Advanced: '#f59e0b',
  Expert: '#ef4444',
};

export default function LanguageHomePage() {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const language = getLanguageById(languageId);
  const user = getCurrentUser();

  const [joinCode, setJoinCode] = useState('');
  const [faceOffError, setFaceOffError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  if (!language || !language.available) {
    return (
      <div className="lang-home">
        <div className="lang-home-error">
          <h2>Language not available yet</h2>
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Globe
          </button>
        </div>
      </div>
    );
  }

  const data = language.data;
  const flagCode = language.flagCode;
  const theme = language.theme;

  const themeVars = {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
    '--theme-bg1': theme.bg1,
    '--theme-bg2': theme.bg2,
  };

  const totalWords = data.categories.reduce((sum, c) => sum + c.words.length, 0);

  const handleCreateChallenge = async () => {
    if (!user) return;
    setFaceOffError('');
    setCreating(true);
    try {
      const code = await createChallenge(user, languageId, data.categories);
      navigate(`/challenge/${code}`);
    } catch (err) {
      setFaceOffError('Failed to create challenge. Try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinChallenge = async () => {
    if (!user || !joinCode.trim()) return;
    setFaceOffError('');
    setJoining(true);
    try {
      const result = await joinChallenge(joinCode.trim(), user);
      if (result.success) {
        navigate(`/challenge/${joinCode.trim()}`);
      } else {
        setFaceOffError(result.error);
      }
    } catch (err) {
      setFaceOffError('Failed to join challenge. Try again.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="lang-home" style={themeVars}>
      <header className="lang-home-header">
        <div className="lang-home-header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Globe
          </button>
        </div>
        <div className="lang-home-title">
          <Flag code={flagCode} size="2rem" />
          <h1>{data.languageName}</h1>
        </div>
        <div className="lang-home-header-right">
          <div className="word-count-badge">{totalWords} words</div>
        </div>
      </header>

      <div className="lang-home-content">
        {/* Language Introduction */}
        <section className="lang-intro">
          <div className="lang-intro-text">
            <h2>
              <span className="lang-native">{data.nativeName}</span>
              <span className="lang-english">{data.languageName}</span>
            </h2>
            <p className="lang-meta">{data.country} &middot; {totalWords} vocabulary words &middot; {data.categories.length} categories</p>
            <p className="lang-description">{data.description}</p>
          </div>
        </section>

        {/* Difficulty Cards */}
        <section className="difficulty-section">
          <h2 className="section-heading">Practice</h2>
          <p className="section-subheading">Choose Your Level</p>
          <div className="difficulty-grid">
            {data.difficulties.map((diff) => {
              const wordCount = diff.categories.reduce((sum, catName) => {
                const cat = data.categories.find(c => c.name === catName);
                return sum + (cat ? cat.words.length : 0);
              }, 0);
              const color = difficultyColors[diff.level];

              return (
                <button
                  key={diff.level}
                  className="difficulty-card"
                  style={{ '--diff-color': color }}
                  onClick={() => navigate(`/practice/${languageId}?difficulty=${diff.level}`)}
                >
                  <div className="diff-icon" style={{ color }}>
                    {difficultyIcons[diff.level]}
                  </div>
                  <h3 className="diff-level">{diff.level}</h3>
                  <p className="diff-description">{diff.description}</p>
                  <span className="diff-meta">{diff.categories.length} categories &middot; {wordCount} words</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Face Off */}
        <section className="faceoff-section">
          <h2 className="section-heading">Face Off</h2>
          <p className="faceoff-subtitle">Challenge a friend to a 10-word vocab showdown!</p>

          {faceOffError && <div className="faceoff-error">{faceOffError}</div>}

          <div className="faceoff-grid">
            <div className="faceoff-card">
              <div className="faceoff-card-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h3>Create Challenge</h3>
              <p>Generate a code and share it with your opponent</p>
              <button
                className="faceoff-btn faceoff-create"
                onClick={handleCreateChallenge}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Game'}
              </button>
            </div>

            <div className="faceoff-card">
              <div className="faceoff-card-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h3>Join Challenge</h3>
              <p>Enter a 6-digit code from your opponent</p>
              <div className="faceoff-join-row">
                <input
                  type="text"
                  className="faceoff-input"
                  placeholder="Enter code"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  disabled={joining}
                />
                <button
                  className="faceoff-btn faceoff-join"
                  onClick={handleJoinChallenge}
                  disabled={joining || joinCode.length < 6}
                >
                  {joining ? 'Joining...' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
