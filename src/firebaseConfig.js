// src/firebaseConfig.js

// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjV05ExFc50dj_CE8H3_cfZocumKi28U" , // Ensure you use environment variables for security
  authDomain: "household-items-app.firebaseapp.com" ,
  projectId: "household-items-app" ,
  storageBucket: "household-items-app.appspot.com" ,
  messagingSenderId: "1:171173367576:web:375ad563903a8e0b02586d" ,
  appId: "G-BQFWL73PM7" ,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };