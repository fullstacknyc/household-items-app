// src/firebaseConfig.js

// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "A]zaSyBjV05ExFc50dj_CE8aH3_cfZocumKi28U",
  authDomain: "household-items-app.firebaseapp.com",
projectId: "household-items-app",
storageBucket: "household-items-app.appspot.com",
messagingSenderId: "171173367576",
appId: "1:171173367576:web:375ad563903a8e0b02586d" ,
measurementId: "G-BQFWL73PM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };