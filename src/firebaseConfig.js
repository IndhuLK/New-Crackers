// src/Config/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // 🆕 Import Firestore functions
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // 🆕 Import Storage functions

const firebaseConfig = {
    apiKey: "AIzaSyAN6g5QwCCfHOL7i9IlvOv5YcFhlS4bNJ8",
    authDomain: "dheeran-crackers.firebaseapp.com",
    projectId: "dheeran-crackers",
    storageBucket: "dheeran-crackers.firebasestorage.app", // Note: The correct format is usually bucket-name.appspot.com, please double check your bucket name in Firebase Console. I'm keeping your provided value for now.
    messagingSenderId: "1046734008674",
    appId: "1:1046734008674:web:a17acd4429c58ae5753c3b",
    measurementId: "G-S5DBVDNCF3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export services
export const db = getFirestore(app);
export const storage = getStorage(app); // Note: You imported getStorage in AddProduct.jsx, but only db was used in the uploadFile function via db.app. This export is safer.

// 🆕 Export all necessary Firestore utilities
export { collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL };