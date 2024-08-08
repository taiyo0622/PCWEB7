// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqmhlCNAgn8bdOq4JY28fzG82hPMJ-BHc",
  authDomain: "pcweb7-e795d.firebaseapp.com",
  projectId: "pcweb7-e795d",
  storageBucket: "pcweb7-e795d.appspot.com",
  messagingSenderId: "179578883769",
  appId: "1:179578883769:web:1e6dfdfef638b20bd65568"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);