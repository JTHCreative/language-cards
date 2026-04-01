import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from './firebase';

// Convert username to a fake email for Firebase Auth (which requires email)
const toEmail = (username) => `${username.toLowerCase().replace(/\s/g, '')}@languagecards.app`;

export const signup = async (username, password, firstName, lastName, email) => {
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters.' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }
  if (!firstName || !firstName.trim()) {
    return { success: false, error: 'First name is required.' };
  }

  try {
    const authEmail = toEmail(username);
    const cred = await createUserWithEmailAndPassword(auth, authEmail, password);
    await updateProfile(cred.user, { displayName: username });

    // Store profile in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      username,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      email: (email || '').trim(),
      createdAt: Date.now(),
    });

    return {
      success: true,
      user: {
        username,
        uid: cred.user.uid,
        firstName: firstName.trim(),
        lastName: (lastName || '').trim(),
        email: (email || '').trim(),
      },
    };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return { success: false, error: 'Username already taken.' };
    }
    return { success: false, error: err.message };
  }
};

export const login = async (username, password) => {
  try {
    const authEmail = toEmail(username);
    const cred = await signInWithEmailAndPassword(auth, authEmail, password);

    // Fetch profile from Firestore
    const profile = await getUserProfile(cred.user.uid);
    const displayName = profile?.username || cred.user.displayName || username;

    return {
      success: true,
      user: {
        username: displayName,
        uid: cred.user.uid,
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
      },
    };
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

// Get full profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

// Update profile in Firestore (creates doc if it doesn't exist)
export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(doc(db, 'users', uid), updates, { merge: true });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Update password
export const updateUserPassword = async (newPassword) => {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    await updatePassword(auth.currentUser, newPassword);
    return { success: true };
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      return { success: false, error: 'Please log out and log back in before changing your password.' };
    }
    return { success: false, error: err.message };
  }
};

// Listen for auth state changes (returns unsubscribe function)
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback({
        username: profile?.username || user.displayName || user.email,
        uid: user.uid,
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
      });
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

// Challenge stats stored in users/{uid} under challengeStats field
export const recordChallengeResult = async (uid, correctCount, totalCount, won) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      challengeStats: {
        played: increment(1),
        won: increment(won === true ? 1 : 0),
        lost: increment(won === false ? 1 : 0),
        tied: increment(won === null ? 1 : 0),
        wordsCorrect: increment(correctCount),
        wordsTotal: increment(totalCount),
      },
    }, { merge: true });
  } catch (err) {
    console.error('Failed to record challenge result:', err);
  }
};

export const getChallengeStats = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists() && snap.data().challengeStats) {
      return snap.data().challengeStats;
    }
    return { played: 0, won: 0, lost: 0, tied: 0, wordsCorrect: 0, wordsTotal: 0 };
  } catch {
    return { played: 0, won: 0, lost: 0, tied: 0, wordsCorrect: 0, wordsTotal: 0 };
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
