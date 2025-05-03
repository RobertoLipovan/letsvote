// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBq_k4oiNcMADocTBK2oeThpio1pMBbZSE",
  authDomain: "let-s-vote-ce408.firebaseapp.com",
  projectId: "let-s-vote-ce408",
  storageBucket: "let-s-vote-ce408.firebasestorage.app",
  messagingSenderId: "447042962372",
  appId: "1:447042962372:web:f5baf86c50b0f00f615a91",
  measurementId: "G-446F69Q30Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);