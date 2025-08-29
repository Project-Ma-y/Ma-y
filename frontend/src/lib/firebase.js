// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyALislKfX7MQeh1IteqWiiaxYGJ_KrNZN4",
    authDomain: "ma-y-b1fa6.firebaseapp.com",
    databaseURL: "https://ma-y-b1fa6-default-rtdb.firebaseio.com",
    projectId: "ma-y-b1fa6",
    storageBucket: "ma-y-b1fa6.firebasestorage.app",
    messagingSenderId: "48645617538",
    appId: "1:48645617538:web:23d556cdd2c5b223b2019b",
    measurementId: "G-8CPE7B7PLN",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
