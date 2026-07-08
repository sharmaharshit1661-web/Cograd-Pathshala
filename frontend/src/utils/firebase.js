import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGDrRfgkBzDumzuJQ7PWnm8fVoy2js_F4",
  authDomain: "cograd-pathshala-5c8bc.firebaseapp.com",
  projectId: "cograd-pathshala-5c8bc",
  storageBucket: "cograd-pathshala-5c8bc.firebasestorage.app",
  messagingSenderId: "865008878288",
  appId: "1:865008878288:web:10d9ee19d8d454fe7d54d5",
  measurementId: "G-Z67FSJTD7L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
