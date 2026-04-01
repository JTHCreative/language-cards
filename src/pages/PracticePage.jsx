import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import Flag from '../components/Flag';
import { getLanguageById } from '../data/languages';
import { getCurrentUser, getProgress, saveProgress } from '../utils/auth';
import { loadVoices } from '../utils/speech';
import '../styles/PracticePage.css';

export default function PracticePage() {
  const { languageId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const language = getLanguageById(languageId);
  const user = getCurrentUser();
  const difficultyLevel = searchParams.get('difficulty');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);

  useEffect(() => {
    loadVoices();
  }, []);

  if (!language || !language.available) {
    return (
      <div className="practice-page">
        <div className="practice-error">
          <h2>Language not available yet</h2>
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Globe
          </button>
        </div>
      </div>
    );
  }

  const data = language.data;
  const difficulty = difficultyLevel && data.difficulties
    ? data.difficulties.find(d => d.level === difficultyLevel)
    : null;
  const categories = difficulty
    ? data.categories.filter(c => difficulty.categories.includes(c.name))
    : data.categories;
  const langCode =
    data.languageCode === 'yue' ? 'zh-HK' : data.languageCode;
  const flagCode = language.flagCode;
  const theme = language.theme;
  const languageHomeUrl = `/language/${languageId}`;

  const themeVars = {
    '--theme-primary': theme.primary,
    '--theme-secondary': theme.secondary,
    '--theme-accent': theme.accent,
    '--theme-bg1': theme.bg1,
    '--theme-bg2': theme.bg2,
  };

  const currentWords = selectedCategory
    ? categories.find((c) => c.name === selectedCategory)?.words || []
    : [];

  const currentWord = currentWords[currentIndex];

  const progress = user ? getProgress(user.username, languageId) : {};
  const totalWords = categories.reduce((sum, c) => sum + c.words.length, 0);
  const knownCount = Object.values(progress).filter((p) => p.known).length;

  const handleKnow = () => {
    if (user) saveProgress(user.username, languageId, `${selectedCategory}_${currentIndex}`, true);
    setSessionResults([...sessionResults, { word: currentWord, known: true }]);
    advance();
  };

  const handleDontKnow = () => {
    if (user) saveProgress(user.username, languageId, `${selectedCategory}_${currentIndex}`, false);
    setSessionResults([...sessionResults, { word: currentWord, known: false }]);
    advance();
  };

  const advance = () => {
    if (currentIndex + 1 < currentWords.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setShowResults(false);
    setSessionResults([]);
    setSelectedCategory(null);
  };

  const startCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setCurrentIndex(0);
    setShowResults(false);
    setSessionResults([]);
  };

  // Results screen
  if (showResults) {
    const correct = sessionResults.filter((r) => r.known).length;
    return (
      <div className="practice-page" style={themeVars}>
        <div className="practice-content">
          <div className="results-card">
            <span className="results-flag"><Flag code={flagCode} size="3rem" /></span>
            <h2>Session Complete!</h2>
            <div className="results-score">
              <span className="score-number">{correct}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{sessionResults.length}</span>
            </div>
            <p className="results-label">words you knew</p>
            <div className="results-actions">
              <button className="btn btn-primary" onClick={() => startCategory(selectedCategory)}>
                Try Again
              </button>
              <button className="btn btn-secondary" onClick={resetSession}>
                Pick Category
              </button>
              <button className="btn btn-ghost" onClick={() => navigate(languageHomeUrl)}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category selection
  if (!selectedCategory) {
    return (
      <div className="practice-page" style={themeVars}>
        <header className="practice-header">
          <div className="practice-header-left">
            <button className="back-btn" onClick={() => navigate(languageHomeUrl)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              {data.languageName}
            </button>
          </div>
          <div className="practice-title">
            <span className="title-flag"><Flag code={flagCode} size="2rem" /></span>
            <h1>{difficultyLevel || data.nativeName}</h1>
            <span className="practice-subtitle">{data.languageName} - {data.country}</span>
          </div>
          <div className="practice-header-right">
            <div className="progress-badge">
              {knownCount}/{totalWords} learned
            </div>
          </div>
        </header>

        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="category-card"
              onClick={() => startCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.words.length} words</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Flashcard practice
  return (
    <div className="practice-page" style={themeVars}>
      <header className="practice-header">
        <div className="practice-header-left">
          <button className="back-btn" onClick={resetSession}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Categories
          </button>
        </div>
        <div className="practice-title">
          <span className="title-flag"><Flag code={flagCode} size="2rem" /></span>
          <h1>{selectedCategory}</h1>
          <span className="practice-subtitle">{data.languageName}</span>
        </div>
        <div className="practice-header-right">
          <div className="progress-badge">
            {currentIndex + 1}/{currentWords.length}
          </div>
        </div>
      </header>

      <div className="practice-content">
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${((currentIndex + 1) / currentWords.length) * 100}%` }}
          />
        </div>

        {currentWord && (
          <>
            <Flashcard word={currentWord} languageCode={langCode} flagCode={flagCode} />

            <div className="practice-actions">
              <button className="btn btn-wrong" onClick={handleDontKnow}>
                Still Learning
              </button>
              <button className="btn btn-correct" onClick={handleKnow}>
                I Know This!
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
