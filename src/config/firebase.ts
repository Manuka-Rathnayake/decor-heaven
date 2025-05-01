
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
 
const firebaseConfig = {
  apiKey: "AIzaSyAp38xUdrqAcEGqVHjMlgw4OjkiD-Cx4d4",
  authDomain: "decor-haven.firebaseapp.com",
  projectId: "decor-haven",
  storageBucket: "decor-haven.firebasestorage.app",
  messagingSenderId: "551302333143",
  appId: "1:551302333143:web:ebe68151a1d19f099be692"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore: Firestore = getFirestore(app);

export const auth = getAuth(app);
export { app };
