// Client-side Firebase initialization and auth helpers (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlJGO4YqRL2CtMq9hpYOWMuesnpDRbyR4",
  authDomain: "signup-6c531.firebaseapp.com",
  projectId: "signup-6c531",
  storageBucket: "signup-6c531.firebasestorage.app",
  messagingSenderId: "1075553175213",
  appId: "1:1075553175213:web:257c58be44959c48b7e824",
  measurementId: "G-L47L95383V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export async function signInWithGoogle(redirectPath = null) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (redirectPath) {
      // small timeout to allow UI to update before navigating
      setTimeout(() => { window.location.href = redirectPath; }, 50);
    }
    return user;
  } catch (err) {
    console.error('Sign-in error', err);
    throw err;
  }
}

export async function signOutUser() {
  await signOut(auth);
}

// Expose a listener to update UI from page script
export function onAuthChange(cb) {
  return onAuthStateChanged(auth, cb);
}

// Helper for protected pages: if not authed, redirect to `redirectTo`
export function requireAuth({ redirectTo = '/', onAuthenticated = null } = {}) {
  return onAuthStateChanged(auth, user => {
    if (user) {
      if (typeof onAuthenticated === 'function') onAuthenticated(user);
    } else {
      window.location.href = redirectTo;
    }
  });
}
