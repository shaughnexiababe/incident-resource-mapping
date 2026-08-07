import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSPnOZAx-1lJNEANNb8XzIZlNt13uV5CU",
  authDomain: "geotactical-command.firebaseapp.com",
  projectId: "geotactical-command",
  storageBucket: "geotactical-command.firebasestorage.app",
  messagingSenderId: "290233847774",
  appId: "1:290233847774:web:03ad0472b7f6c8ff79d74f",
  measurementId: "G-T74E12RK5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
