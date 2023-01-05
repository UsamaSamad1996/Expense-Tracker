import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "practice-firebase-9bed7.firebaseapp.com",
  projectId: "practice-firebase-9bed7",
  storageBucket: "practice-firebase-9bed7.appspot.com",
  messagingSenderId: "264267884058",
  appId: "1:264267884058:web:2312c78754435ece9b93a3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
