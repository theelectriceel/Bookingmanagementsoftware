// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth}  from "firebase/auth"
import { getFirestore} from 'firebase/firestore'
import { getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVjeb3uYtAjtSGQ9oyoaU95xBauRVBGfI",
  authDomain: "rockydjt.firebaseapp.com",
  projectId: "rockydjt",
  storageBucket: "rockydjt.firebasestorage.app",
  messagingSenderId: "1067282765243",
  appId: "1:1067282765243:web:9c4a8c9914658e66ca209e",
  measurementId: "G-46T4C40JMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app);