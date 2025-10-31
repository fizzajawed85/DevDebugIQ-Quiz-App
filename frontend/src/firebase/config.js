// frontend -> src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS LINE

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC6oZg1F2hTI2RhNuMvSR5wV12s1wHdmW0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "devdebugiq-quiz.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://devdebugiq-quiz-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "devdebugiq-quiz",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "devdebugiq-quiz.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "250458197177",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:250458197177:web:270776ce8b0345db699f68"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const storage = getStorage(app); // ✅ ADD THIS EXPORT
export default app;
