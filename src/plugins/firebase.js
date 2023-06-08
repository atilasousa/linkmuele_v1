// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_rCM5FIJN3RTbJm2gyiMNybB9GMSC6sU",
  authDomain: "linkmuele.firebaseapp.com",
  projectId: "linkmuele",
  storageBucket: "linkmuele.appspot.com",
  messagingSenderId: "616132209673",
  appId: "1:616132209673:web:39d197a3835dc7fb919cd8",
  measurementId: "G-Y1YRLQ7E2R",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
