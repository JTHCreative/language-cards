import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBuvU2LrEoab7SI6bLkJSNwEb57mirSnWQ',
  authDomain: 'language-cards-830ec.firebaseapp.com',
  projectId: 'language-cards-830ec',
  storageBucket: 'language-cards-830ec.firebasestorage.app',
  messagingSenderId: '235262114485',
  appId: '1:235262114485:web:507357aca0d1672307dcfc',
  measurementId: 'G-46WE2JC1QZ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
