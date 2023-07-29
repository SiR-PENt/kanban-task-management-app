// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoFACG7hanIc7yJgdnfXjP7P51NBn3B8I",
  authDomain: "kanban-app-392709.firebaseapp.com",
  projectId: "kanban-app-392709",
  storageBucket: "kanban-app-392709.appspot.com",
  messagingSenderId: "916399855238",
  appId: "1:916399855238:web:5799cfba77ceca228f2307",
  measurementId: "G-VV4PBPH5QC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

