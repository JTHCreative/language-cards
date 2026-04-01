import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Convert username to a fake email for Firebase Auth (which requires email)
const toEmail = (username) => `${username.toLowerCase().replace(/\s/g, '')}@languagecards.app`;

export const signup = async (username, password) => {
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  try {
    const email = toEmail(username);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: username });
    return { success: true, user: { username, uid: cred.user.uid } };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Username already taken.' };
    }
    return { success: false, error: err.message };
  }
};

export const login = async (username, password) => {
  try {
    const email = toEmail(username);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const displayName = cred.user.displayName || username;
    return { success: true, user: { username: displayName, uid: cred.user.uid } };
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      return { success: false, error: 'Invalid username or password.' };
    }
    return { success: false, error: err.message };
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (!user) return null;
  return { username: user.displayName || user.email, uid: user.uid };
};

// Listen for auth state changes (returns unsubscribe function)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({ username: user.displayName || user.email, uid: user.uid });
    } else {
      callback(null);
    }
  });
};

// Progress stored in Firestore: users/{uid}/progress/{languageId}
export const getProgress = async (uid, languageId) => {
  try {
    const ref = doc(db, 'users', uid, 'progress', languageId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : {};
  } catch {
    return {};
  }
};

export const saveProgress = async (uid, languageId, wordKey, known) => {
  try {
    const ref = doc(db, 'users', uid, 'progress', languageId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        [wordKey]: { known, lastReviewed: Date.now() },
      });
    } else {
      await setDoc(ref, {
        [wordKey]: { known, lastReviewed: Date.now() },
      });
    }
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
};
