import { useState } from 'react';
import { speak } from '../utils/speech';
import '../styles/Flashcard.css';

export default function Flashcard({ word, languageCode }) {
  const [flipped, setFlipped] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    speak(word.target, languageCode);
  };

  return (
    <div
      className={`flashcard ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        {/* Front - English */}
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-label">English</span>
          <p className="flashcard-text">{word.english}</p>
          <span className="flashcard-hint">Click to flip</span>
        </div>

        {/* Back - Target Language */}
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-label">
            {word.category || 'Target Language'}
          </span>
          <p className="flashcard-text flashcard-target">{word.target}</p>
          <p className="flashcard-pronunciation">{word.pronunciation}</p>
          <button
            className="speak-btn"
            onClick={handleSpeak}
            title="Listen to pronunciation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
          <span className="flashcard-hint">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}
