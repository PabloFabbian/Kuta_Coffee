import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = { 
    // Hola
}

const app = initializeApp (firebaseConfig)
export const db = getFirestore(app)