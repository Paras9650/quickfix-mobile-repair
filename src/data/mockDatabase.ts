import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Aapki screen se nikala hua asali production data yahan set ho gaya hai
const firebaseConfig = {
  apiKey: "AIzaSyDM6Gj2T9_KSsXEx6N743KR1cf-TZImL90",
  authDomain: "quickfix-production-e545b.firebaseapp.com",
  projectId: "quickfix-production-e545b",
  storageBucket: "quickfix-production-e545b.firebasestorage.app",
  messagingSenderId: "464054995263",
  appId: "1:464054995263:web:9ba58c41eed4f48c0e2b8a",
  measurementId: "G-XFCFPH6S9K"
};

// Connect to Real Live Cloud Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
