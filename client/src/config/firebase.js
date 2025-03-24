import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "792757160936",
  appId: "1:792757160936:web:3e6556cd0f4bf11ac5b25d",
  measurementId: "G-GYE1RJNERG"
};

console.log("Firebase Config:", firebaseConfig);
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);