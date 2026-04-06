import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCu7icfjSRZJFopZMCDLmNuiPVOv3VJi-4",
    authDomain: "software-helper.firebaseapp.com",
    projectId: "software-helper",
    storageBucket: "software-helper.firebasestorage.app",
    messagingSenderId: "706222883724",
    appId: "1:706222883724:web:bedc26fa2b5cf0deb20ca9",
    measurementId: "G-DMFVKY1YM0"
};

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
