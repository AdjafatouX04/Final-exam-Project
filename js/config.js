import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCjUyv6Sqize2dCfo8OZd-Hs4pEGiYfS9Y",
    authDomain: "african-heroes.firebaseapp.com",
    projectId: "african-heroes",
    storageBucket: "african-heroes.firebasestorage.app",
    messagingSenderId: "164765519860",
    appId: "1:164765519860:web:421af147d4bb050c51f3a1",
    measurementId: "G-PW55RVYSZY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
