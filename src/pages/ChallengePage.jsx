import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { onChallengeUpdate, confirmParticipation, submitScore, deleteChallenge } from '../utils/challenge';
import { getLanguageById } from '../data/languages';
import { speak, cancelSpeech, loadVoices } from '../utils/speech';
import Flag from '../components/Flag';
import '../styles/ChallengePage.css';

const ROUND_TIME = 30; // seconds per word
const TOTAL_WORDS = 10;

// Normalize a string for comparison: lowercase, strip punctuation/articles, trim
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // strip punctuation
    .replace(/\b(to|a|an|the)\b/g, '') // strip common prefixes
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein distance between two strings
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = a[i - 1] === b[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
    }
  }
  return matrix[a.length][b.length];
}

// Check if userAnswer is close enough to the correct answer
function isCloseEnough(userAnswer, correctAnswer) {
  if (!userAnswer) return false;

  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(correctAnswer);

  // Exact match after normalization
  if (userNorm === correctNorm) return true;

  // Handle answers with slashes or " / " (multiple accepted answers)
  const alternatives = correctAnswer.split(/\s*\/\s*/).map(normalize);
  if (alternatives.some(alt => alt === userNorm)) return true;

  // Handle parenthetical clarifiers: "Chef (Cook)" accepts "chef" or "cook"
  const withoutParens = correctAnswer.replace(/\(.*?\)/g, '').trim();
  const insideParens = (correctAnswer.match(/\((.*?)\)/g) || []).map(p => p.slice(1, -1));
  const allForms = [withoutParens, ...insideParens].map(normalize);
  if (allForms.some(form => form === userNorm)) return true;

  // Levenshtein distance: allow 1 typo for words <= 5 chars, 2 for longer
  const maxDist = correctNorm.length <= 5 ? 1 : 2;
  if (levenshtein(userNorm, correctNorm) <= maxDist) return true;

  // Also check distance against each alternative/paren form
  if (alternatives.concat(allForms).some(alt =>
    levenshtein(userNorm, alt) <= (alt.length <= 5 ? 1 : 2)
  )) return true;

  return false;
}

export default function ChallengePage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // Game state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Load speech voices and cancel on unmount
  useEffect(() => {
    loadVoices();
    return () => cancelSpeech();
  }, []);

  // Listen to challenge updates
  useEffect(() => {
    if (!code) return;
    const unsubscribe = onChallengeUpdate(code, (data) => {
      setChallenge(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [code]);

  // Timer for gameplay
  useEffect(() => {
    if (!challenge || challenge.status !== 'playing' || submitted) return;

    setTimeLeft(ROUND_TIME);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up for this word
          handleSubmitAnswer(true);
          return ROUND_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [challenge?.status, currentWordIndex, submitted]);

  // Focus input when playing
  useEffect(() => {
    if (challenge?.status === 'playing' && inputRef.current && !submitted) {
      inputRef.current.focus();
    }
  }, [challenge?.status, currentWordIndex, submitted]);

  if (loading) {
    return (
      <div className="challenge-page">
        <div className="challenge-center">
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="challenge-page">
        <div className="challenge-center">
          <h2>Challenge not found</h2>
          <button className="ch-btn ch-btn-primary" onClick={() => navigate('/')}>
            Back to Globe
          </button>
        </div>
      </div>
    );
  }

  const isHost = user?.uid === challenge.host.uid;
  const isGuest = user?.uid === challenge.guest?.uid;
  const myData = isHost ? challenge.host : challenge.guest;
  const opponentData = isHost ? challenge.guest : challenge.host;
  const language = getLanguageById(challenge.languageId);
  const flagCode = language?.flagCode;
  const speechLangCode = language?.speechLangCode || language?.data?.languageCode || 'zh-HK';
  const theme = language?.theme || {};

  const themeVars = {
    '--theme-primary': theme.primary || '#6366f1',
    '--theme-secondary': theme.secondary || '#3b82f6',
    '--theme-accent': theme.accent || '#a78bfa',
    '--theme-bg1': theme.bg1 || '#0a0a1a',
    '--theme-bg2': theme.bg2 || '#0f0c29',
  };

  const handleConfirm = () => {
    confirmParticipation(code, user.uid);
  };

  const handleSubmitAnswer = (timedOut = false) => {
    const currentWord = challenge.words[currentWordIndex];
    if (!currentWord) return;

    const userAnswer = answer.trim().toLowerCase();
    const correct = isCloseEnough(userAnswer, currentWord.english);
    const newScore = correct ? score + 1 : score;
    const newAnswers = [...answers, {
      word: currentWord.target,
      correctAnswer: currentWord.english,
      userAnswer: timedOut ? '(timed out)' : answer.trim(),
      correct,
    }];

    setScore(newScore);
    setAnswers(newAnswers);
    setAnswer('');

    if (currentWordIndex + 1 >= TOTAL_WORDS || currentWordIndex + 1 >= challenge.words.length) {
      // Game over
      if (timerRef.current) clearInterval(timerRef.current);
      setSubmitted(true);
      submitScore(code, user.uid, newScore, newAnswers);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
      setTimeLeft(ROUND_TIME);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitAnswer(false);
    }
  };

  // ============================
  // WAITING: Host waiting for guest
  // ============================
  if (challenge.status === 'waiting') {
    return (
      <div className="challenge-page" style={themeVars}>
        <div className="challenge-center">
          <div className="lobby-card">
            {flagCode && <Flag code={flagCode} size="2.5rem" />}
            <h2>Waiting for Opponent</h2>
            <p className="lobby-subtitle">Share this code with your friend:</p>
            <div className="challenge-code">{code}</div>
            <p className="lobby-hint">They can enter this code on the Language Home page to join</p>
            <div className="lobby-players">
              <div className="lobby-player ready">
                <span className="player-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                <span>{challenge.host.username}</span>
                <span className="player-status">Host</span>
              </div>
              <div className="lobby-vs">VS</div>
              <div className="lobby-player waiting-player">
                <span className="player-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                <span>Waiting...</span>
              </div>
            </div>
            <button className="ch-btn ch-btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // READY: Both joined, confirm
  // ============================
  if (challenge.status === 'ready') {
    return (
      <div className="challenge-page" style={themeVars}>
        <div className="challenge-center">
          <div className="lobby-card">
            {flagCode && <Flag code={flagCode} size="2.5rem" />}
            <h2>Challenge Ready!</h2>
            <p className="lobby-subtitle">{TOTAL_WORDS} words &middot; {ROUND_TIME}s per word</p>
            <div className="lobby-players">
              <div className={`lobby-player ${challenge.host.confirmed ? 'confirmed' : ''}`}>
                <span className="player-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                <span>{challenge.host.username}</span>
                <span className="player-status">
                  {challenge.host.confirmed ? 'Ready!' : 'Not ready'}
                </span>
              </div>
              <div className="lobby-vs">VS</div>
              <div className={`lobby-player ${challenge.guest?.confirmed ? 'confirmed' : ''}`}>
                <span className="player-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                <span>{challenge.guest?.username}</span>
                <span className="player-status">
                  {challenge.guest?.confirmed ? 'Ready!' : 'Not ready'}
                </span>
              </div>
            </div>
            {!myData?.confirmed ? (
              <button className="ch-btn ch-btn-primary ch-btn-large" onClick={handleConfirm}>
                I'm Ready!
              </button>
            ) : (
              <p className="lobby-waiting-text">Waiting for opponent to confirm...</p>
            )}
            <button className="ch-btn ch-btn-ghost" onClick={() => navigate(-1)}>Leave</button>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // PLAYING: Active gameplay
  // ============================
  if (challenge.status === 'playing' && !submitted) {
    const currentWord = challenge.words[currentWordIndex];
    const timerPercent = (timeLeft / ROUND_TIME) * 100;
    const timerColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : 'var(--theme-accent, #60a5fa)';

    return (
      <div className="challenge-page" style={themeVars}>
        <div className="game-header">
          <div className="game-progress">
            {currentWordIndex + 1} / {Math.min(TOTAL_WORDS, challenge.words.length)}
          </div>
          <div className="game-score">Score: {score}</div>
        </div>

        <div className="game-timer-bar">
          <div
            className="game-timer-fill"
            style={{ width: `${timerPercent}%`, background: timerColor }}
          />
        </div>

        <div className="game-content">
          <div className="game-timer-number" style={{ color: timerColor }}>
            {timeLeft}s
          </div>

          <div className="game-word-card">
            <span className="game-word-label">What does this mean?</span>
            <p className="game-word">{currentWord?.target}</p>
            <p className="game-word-pronunciation">{currentWord?.pronunciation}</p>
            <button
              className="game-speak-btn"
              onClick={() => speak(currentWord?.target, speechLangCode)}
              aria-label="Listen to pronunciation"
              title="Listen to pronunciation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>

          <div className="game-input-area">
            <input
              ref={inputRef}
              type="text"
              className="game-input"
              placeholder="Type the English meaning..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button className="ch-btn ch-btn-primary" onClick={() => handleSubmitAnswer(false)}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================
  // SUBMITTED / FINISHED: Results
  // ============================
  const bothFinished = challenge.status === 'finished';

  // Show waiting screen until both players have submitted
  if (!bothFinished) {
    return (
      <div className="challenge-page" style={themeVars}>
        <div className="challenge-center">
          <div className="lobby-card">
            {flagCode && <Flag code={flagCode} size="2.5rem" />}
            <h2>You're Done!</h2>
            <p className="lobby-subtitle">Waiting for your opponent to finish...</p>
            <div className="waiting-spinner" />
            <p className="lobby-hint">Results will appear when both players are done</p>
            <button className="ch-btn ch-btn-ghost" onClick={() => navigate(`/language/${challenge.languageId}`)}>
              Leave Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myScore = myData?.score ?? score;
  const opScore = opponentData?.score;

  let resultMessage = "It's a Tie!";
  let resultClass = 'result-tie';
  if (myScore > opScore) {
    resultMessage = 'You Win!';
    resultClass = 'result-win';
  } else if (myScore < opScore) {
    resultMessage = 'You Lose';
    resultClass = 'result-lose';
  }

  return (
    <div className="challenge-page" style={themeVars}>
      <div className="challenge-center">
        <div className="results-panel">
          {flagCode && <Flag code={flagCode} size="2.5rem" />}
          <h2 className={`result-heading ${resultClass}`}>{resultMessage}</h2>

          <div className="results-scoreboard">
            <div className={`results-player ${myScore >= opScore ? 'winner' : ''}`}>
              <span className="results-player-name">{myData?.username || 'You'}</span>
              <span className="results-player-score">{myScore}</span>
            </div>
            <div className="results-divider">—</div>
            <div className={`results-player ${opScore > myScore ? 'winner' : ''}`}>
              <span className="results-player-name">{opponentData?.username || 'Opponent'}</span>
              <span className="results-player-score">{opScore}</span>
            </div>
          </div>

          {/* Answer breakdown */}
          {answers.length > 0 && (
            <div className="results-breakdown">
              <h3>Your Answers</h3>
              {answers.map((a, i) => (
                <div key={i} className={`breakdown-row ${a.correct ? 'correct' : 'incorrect'}`}>
                  <span className="breakdown-word">{a.word}</span>
                  <span className="breakdown-answer">
                    {a.correct ? a.correctAnswer : (
                      <>
                        <span className="wrong-answer">{a.userAnswer}</span>
                        <span className="correct-answer">{a.correctAnswer}</span>
                      </>
                    )}
                  </span>
                  <span className="breakdown-icon">{a.correct ? '✓' : '✗'}</span>
                </div>
              ))}
            </div>
          )}

          <button className="ch-btn ch-btn-primary" onClick={() => {
            deleteChallenge(code).catch(() => {});
            navigate(`/language/${challenge.languageId}`);
          }}>
            Back to Language
          </button>
        </div>
      </div>
    </div>
  );
}
