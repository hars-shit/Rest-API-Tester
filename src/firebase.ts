// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmyhb1bd35meNf8rMYwxEO9NqDSVCVb8Q",
  authDomain: "uber-421610.firebaseapp.com",
  databaseURL: "https://uber-421610-default-rtdb.firebaseio.com",
  projectId: "uber-421610",
  storageBucket: "uber-421610.firebasestorage.app",
  messagingSenderId: "841317408084",
  appId: "1:841317408084:web:3c699cf5ed74e907b07cc1",
  measurementId: "G-LDZ0TNPL28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth=getAuth(app)
const googleProvider=new GoogleAuthProvider()

export {auth,googleProvider}