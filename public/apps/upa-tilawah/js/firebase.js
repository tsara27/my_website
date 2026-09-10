// Firebase configuration & shared Firestore instance for the Tilawah Tracker app.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzU25dZ3jNWbja1-qPiu-14ATen2mvcRk",
  authDomain: "tilawah-tracker-b8046.firebaseapp.com",
  projectId: "tilawah-tracker-b8046",
  storageBucket: "tilawah-tracker-b8046.firebasestorage.app",
  messagingSenderId: "1014052685006",
  appId: "1:1014052685006:web:d9c6e0913ed903188e3c9f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
