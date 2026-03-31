import { useState } from 'react';
import { login, signup } from '../utils/auth';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = isSignup
      ? signup(username, password)
      : login(username, password);

    if (result.success) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-header">
          <h1>Language Cards</h1>
          <p>Explore the world, one word at a time</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
            />
          </div>

          <button type="submit" className="login-btn">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>

          <p className="toggle-mode">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
