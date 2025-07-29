// Import the functions you need from the SDKs you need
import { getFirestore, collection } from "firebase/firestore";
import dotenv from "dotenv";
import { credential } from "firebase-admin";
import { applicationDefault, cert } from "firebase-admin/app";
dotenv.config();
export const admin = require("firebase-admin");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECY_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGE_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID,
  databaseURL: process.env.FB_DATABASEURL
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

if(process.env.HOST){
  const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS!);
  admin.initializeApp({
  credential: cert(serviceAccount)
});
} else admin.initializeApp(firebaseConfig);

console.log(admin.firestore());
export const auth = admin.auth();     // for 인증
export const db = admin.firestore();    // for 데이터베이스
export const USER_COLLECTION = db.collection("users");