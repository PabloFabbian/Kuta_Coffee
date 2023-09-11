import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC0U6pHK19dgefLfkvBIJQOEE-wgTsTKnM",
    authDomain: "kuta-project-9e2e3.firebaseapp.com",
    projectId: "kuta-project-9e2e3",
    storageBucket: "kuta-project-9e2e3.appspot.com",
    messagingSenderId: "953382480123",
    appId: "1:953382480123:web:e62d79e2cc6b90e439685e",
    measurementId: "G-KGJGR4ZS42"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);