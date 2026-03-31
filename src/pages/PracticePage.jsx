import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { getLanguageById } from '../data/languages';
import { getCurrentUser, getProgress, saveProgress } from '../utils/auth';
import { loadVoices } from '../utils/speech';
import '../styles/PracticePage.css';

export default function PracticePage() {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const language = getLanguageById(languageId);
  const user = getCurrentUser();

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
  const categories = data.categories;
  const langCode =
    data.languageCode === 'yue' ? 'zh-HK' : data.languageCode;

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
      <div className="practice-page">
        <div className="practice-content">
          <div className="results-card">
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
              <button className="btn btn-ghost" onClick={() => navigate('/')}>
                Back to Globe
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
      <div className="practice-page">
        <header className="practice-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Globe
          </button>
          <div className="practice-title">
            <h1>{data.nativeName}</h1>
            <span className="practice-subtitle">{data.languageName} - {data.country}</span>
          </div>
          <div className="progress-badge">
            {knownCount}/{totalWords} learned
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
          <button
            className="category-card category-all"
            onClick={() => {
              // combine all words into one session
              const allCat = { name: 'All Words', words: categories.flatMap(c => c.words) };
              // Temporarily add to data
              startCategory('__all__');
            }}
            style={{ display: 'none' }} // hidden for now
          >
            <span className="category-icon">🌟</span>
            <span className="category-name">All Words</span>
            <span className="category-count">{totalWords} words</span>
          </button>
        </div>
      </div>
    );
  }

  // Flashcard practice
  return (
    <div className="practice-page">
      <header className="practice-header">
        <button className="back-btn" onClick={resetSession}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Categories
        </button>
        <div className="practice-title">
          <h1>{selectedCategory}</h1>
          <span className="practice-subtitle">{data.languageName}</span>
        </div>
        <div className="progress-badge">
          {currentIndex + 1}/{currentWords.length}
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
            <Flashcard word={currentWord} languageCode={langCode} />

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
