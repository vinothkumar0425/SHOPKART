// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyD2qicVJBj2hj3oeBCCo3v8huRnGXwICOU",
  authDomain: "shopkart1-aa494.firebaseapp.com",
  projectId: "shopkart1-aa494",
  storageBucket: "shopkart1-aa494.appspot.com", // ✅ FIXED
  messagingSenderId: "547640466424",
  appId: "1:547640466424:web:f90dc4ce6e35d0f2f9d40d",
  measurementId: "G-RNPX2JH9KP",
};

/* 🔥 INITIALIZE FIREBASE */
const app = initializeApp(firebaseConfig);

/* 🔥 AUTH */
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/* 🔥 DATABASE */
export const db = getFirestore(app);

/* 🔥 STORAGE (VERY IMPORTANT) */
export const storage = getStorage(app);
