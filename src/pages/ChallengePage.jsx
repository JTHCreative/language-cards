import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { onChallengeUpdate, confirmParticipation, submitScore } from '../utils/challenge';
import { getLanguageById } from '../data/languages';
import Flag from '../components/Flag';
import '../styles/ChallengePage.css';

const ROUND_TIME = 30; // seconds per word
const TOTAL_WORDS = 10;

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
    const correct = currentWord.english.toLowerCase() === userAnswer;
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
                <span className="player-icon">👤</span>
                <span>{challenge.host.username}</span>
                <span className="player-status">Host</span>
              </div>
              <div className="lobby-vs">VS</div>
              <div className="lobby-player waiting-player">
                <span className="player-icon">❓</span>
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
                <span className="player-icon">👤</span>
                <span>{challenge.host.username}</span>
                <span className="player-status">
                  {challenge.host.confirmed ? 'Ready!' : 'Not ready'}
                </span>
              </div>
              <div className="lobby-vs">VS</div>
              <div className={`lobby-player ${challenge.guest?.confirmed ? 'confirmed' : ''}`}>
                <span className="player-icon">👤</span>
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
  const myScore = myData?.score ?? score;
  const opScore = opponentData?.score;

  let resultMessage = 'Waiting for opponent to finish...';
  let resultClass = '';
  if (bothFinished && opScore !== null) {
    if (myScore > opScore) {
      resultMessage = 'You Win!';
      resultClass = 'result-win';
    } else if (myScore < opScore) {
      resultMessage = 'You Lose';
      resultClass = 'result-lose';
    } else {
      resultMessage = "It's a Tie!";
      resultClass = 'result-tie';
    }
  }

  return (
    <div className="challenge-page" style={themeVars}>
      <div className="challenge-center">
        <div className="results-panel">
          {flagCode && <Flag code={flagCode} size="2.5rem" />}
          <h2 className={`result-heading ${resultClass}`}>{resultMessage}</h2>

          <div className="results-scoreboard">
            <div className={`results-player ${bothFinished && myScore >= opScore ? 'winner' : ''}`}>
              <span className="results-player-name">{myData?.username || 'You'}</span>
              <span className="results-player-score">{myScore}</span>
            </div>
            <div className="results-divider">—</div>
            <div className={`results-player ${bothFinished && opScore > myScore ? 'winner' : ''}`}>
              <span className="results-player-name">{opponentData?.username || 'Opponent'}</span>
              <span className="results-player-score">{opScore !== null && opScore !== undefined ? opScore : '...'}</span>
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

          <button className="ch-btn ch-btn-primary" onClick={() => navigate(`/language/${challenge.languageId}`)}>
            Back to Language
          </button>
        </div>
      </div>
    </div>
  );
}
