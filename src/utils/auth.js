// Simple localStorage-based authentication
const AUTH_KEY = 'language_cards_user';

export const login = (username, password) => {
  const users = JSON.parse(localStorage.getItem('language_cards_users') || '{}');
  const user = users[username];

  if (!user) {
    return { success: false, error: 'User not found. Please sign up first.' };
  }

  if (user.password !== password) {
    return { success: false, error: 'Incorrect password.' };
  }

  const session = { username, loggedInAt: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true, user: session };
};

export const signup = (username, password) => {
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const users = JSON.parse(localStorage.getItem('language_cards_users') || '{}');

  if (users[username]) {
    return { success: false, error: 'Username already taken.' };
  }

  users[username] = { password, createdAt: Date.now() };
  localStorage.setItem('language_cards_users', JSON.stringify(users));

  const session = { username, loggedInAt: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true, user: session };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = () => {
  const session = localStorage.getItem(AUTH_KEY);
  return session ? JSON.parse(session) : null;
};

export const getProgress = (username, languageId) => {
  const key = `progress_${username}_${languageId}`;
  return JSON.parse(localStorage.getItem(key) || '{}');
};

export const saveProgress = (username, languageId, wordIndex, known) => {
  const key = `progress_${username}_${languageId}`;
  const progress = JSON.parse(localStorage.getItem(key) || '{}');
  progress[wordIndex] = { known, lastReviewed: Date.now() };
  localStorage.setItem(key, JSON.stringify(progress));
};
