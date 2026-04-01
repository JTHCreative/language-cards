import { useState } from 'react';
import { login, signup } from '../utils/auth';
import '../styles/LoginPage.css';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = isSignup
        ? await signup(username, password, firstName, lastName, email)
        : await login(username, password);

      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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

          {isSignup && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  disabled={submitting}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={submitting}
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={submitting}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignup ? 'Min 6 characters' : 'Enter your password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Log In')}
          </button>

          <p className="toggle-mode">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="link-btn"
              onClick={() => { setIsSignup(!isSignup); setError(''); }}
              disabled={submitting}
            >
              {isSignup ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
