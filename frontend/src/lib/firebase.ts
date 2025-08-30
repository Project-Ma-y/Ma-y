// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAaHhbv_xlkIwgp8BDI4ekkmRBl9bLI_pw",
  authDomain: "projectmay-358b7.firebaseapp.com",
  projectId: "projectmay-358b7",
  storageBucket: "projectmay-358b7.firebasestorage.app",
  messagingSenderId: "527237934658",
  appId: "1:527237934658:web:a6351a12ea9f9de13007db",
  measurementId: "G-VQWRV48PQF"
  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
