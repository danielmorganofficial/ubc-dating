import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDp4wRTrcxEvDMjKUfx6DMcWWjWbOqgt8w",
  authDomain: "ubc-dating-hackathon.firebaseapp.com",
  projectId: "ubc-dating-hackathon",
  storageBucket: "ubc-dating-hackathon.firebasestorage.app",
  messagingSenderId: "567997777305",
  appId: "1:567997777305:web:bb19ef2bd7cc32e4477f08",
  measurementId: "G-1EJLGRFKJ6"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)