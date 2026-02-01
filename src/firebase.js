import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCBkgMxamYaXenY3drabt3dE-Dn00g7-dE",
  authDomain: "financy-ed289.firebaseapp.com",
  projectId: "financy-ed289",
  storageBucket: "financy-ed289.firebasestorage.app",
  messagingSenderId: "1056980551616",
  appId: "1:1056980551616:web:2182efdbb32681099a2a25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
