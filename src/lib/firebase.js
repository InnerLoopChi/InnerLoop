import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAgOQz8ny8qrSLs3lLbF3X7P0SzuxzYnAU",
  authDomain: "innerloppa.firebaseapp.com",
  projectId: "innerloppa",
  storageBucket: "innerloppa.firebasestorage.app",
  messagingSenderId: "450759372586",
  appId: "1:450759372586:web:7e178d710190ed0e02b853",
  measurementId: "G-1KN5RX83MM",
};

export const isFirebaseConfigured = true;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
