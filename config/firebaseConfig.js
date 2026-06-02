// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAr-kFj_8c0-DnrqnJt569lF8d-I3bZmTE",
  authDomain: "sharma-education-ignou.firebaseapp.com",
  projectId: "sharma-education-ignou",
  storageBucket: "sharma-education-ignou.firebasestorage.app",
  messagingSenderId: "175766506332",
  appId: "1:175766506332:web:918279593dbc016a1d8f99",
  measurementId: "G-SNK2EV728N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);