import {
  doc, getDoc, setDoc, updateDoc, onSnapshot, deleteDoc, Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Generate a random 6-digit code
const generateCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// Pick 10 random words from a language's categories
const pickChallengeWords = (categories, count = 10) => {
  const allWords = categories.flatMap(c => c.words);
  const shuffled = [...allWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(w => ({
    target: w.target,
    english: w.english,
    pronunciation: w.pronunciation,
  }));
};

// Create a new challenge
export const createChallenge = async (user, languageId, categories) => {
  const code = generateCode();
  const words = pickChallengeWords(categories);

  const challengeData = {
    code,
    languageId,
    words,
    host: { uid: user.uid, username: user.username, confirmed: false, score: null, answers: [] },
    guest: null,
    status: 'waiting', // waiting -> ready -> playing -> finished
    createdAt: Date.now(),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000)), // TTL: auto-delete after 24h
  };

  await setDoc(doc(db, 'challenges', code), challengeData);
  return code;
};

// Join an existing challenge
export const joinChallenge = async (code, user) => {
  const ref = doc(db, 'challenges', code);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { success: false, error: 'Challenge not found. Check your code.' };
  }

  const data = snap.data();

  if (data.host.uid === user.uid) {
    return { success: false, error: "You can't join your own challenge." };
  }

  if (data.guest) {
    return { success: false, error: 'Challenge is already full.' };
  }

  if (data.status !== 'waiting') {
    return { success: false, error: 'Challenge is no longer available.' };
  }

  await updateDoc(ref, {
    guest: { uid: user.uid, username: user.username, confirmed: false, score: null, answers: [] },
    status: 'ready',
  });

  return { success: true };
};

// Confirm participation
export const confirmParticipation = async (code, uid) => {
  const ref = doc(db, 'challenges', code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  if (data.host.uid === uid) {
    await updateDoc(ref, { 'host.confirmed': true });
    // Check if both confirmed
    if (data.guest?.confirmed) {
      await updateDoc(ref, { status: 'playing', startedAt: Date.now() });
    }
  } else if (data.guest?.uid === uid) {
    await updateDoc(ref, { 'guest.confirmed': true });
    if (data.host.confirmed) {
      await updateDoc(ref, { status: 'playing', startedAt: Date.now() });
    }
  }
};

// Submit answers and score
export const submitScore = async (code, uid, score, answers) => {
  const ref = doc(db, 'challenges', code);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();

  if (data.host.uid === uid) {
    await updateDoc(ref, { 'host.score': score, 'host.answers': answers });
    if (data.guest?.score !== null) {
      await updateDoc(ref, { status: 'finished' });
    }
  } else if (data.guest?.uid === uid) {
    await updateDoc(ref, { 'guest.score': score, 'guest.answers': answers });
    if (data.host.score !== null) {
      await updateDoc(ref, { status: 'finished' });
    }
  }
};

// Listen to challenge updates in real-time
export const onChallengeUpdate = (code, callback) => {
  return onSnapshot(doc(db, 'challenges', code), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    } else {
      callback(null);
    }
  });
};

// Get challenge data once
export const getChallenge = async (code) => {
  const snap = await getDoc(doc(db, 'challenges', code));
  return snap.exists() ? snap.data() : null;
};

// Delete a challenge
export const deleteChallenge = async (code) => {
  await deleteDoc(doc(db, 'challenges', code));
};
