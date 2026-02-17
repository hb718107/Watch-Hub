import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCSTD3qSdhHVLz5u7rE2ChT2ko8WZLP7z4",
    authDomain: "watchhub0900.firebaseapp.com",
    projectId: "watchhub0900",
    storageBucket: "watchhub0900.firebasestorage.app",
    messagingSenderId: "594550833743",
    appId: "1:594550833743:web:cf51579eddaa09f70c603a",
    measurementId: "G-Z8EJX6K85C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
