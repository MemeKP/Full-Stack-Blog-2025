// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC1xfUDwSGcWrDD8w7fmJy5oKCrjLjQrk",
  authDomain: "blog-login-auth.firebaseapp.com",
  projectId: "blog-login-auth",
  storageBucket: "blog-login-auth.firebasestorage.app",
  messagingSenderId: "72527956705",
  appId: "1:72527956705:web:d4033f68266f9037ed85a0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };