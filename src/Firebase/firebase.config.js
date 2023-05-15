import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_SECRET_API_KEY,
  authDomain: import.meta.env.VITE_APP_SECRET_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_SECRET_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_SECRET_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_SECRET_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_SECRET_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
