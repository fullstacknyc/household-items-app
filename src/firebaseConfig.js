// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration (replace these with your own from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBjVO5ExFc50dj_CE8aH3_cfZocumKi28U",
  authDomain: "household-items-app.firebaseapp.com",
  projectId: "household-items-app",
  storageBucket: "household-items-app.appspot.com",
  messagingSenderId: "171173367576",
  appId: "1:171173367576:web:375ad563903a8e0b02586d",
  measurementId: "G-BQFWL73PM7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export default app;
export { db };
