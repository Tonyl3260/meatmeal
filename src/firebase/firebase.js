import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
// Set persistence (local by default)
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log("Persistence set properly")
    })
    .catch((e) => {
        console.error("error setting persistence: ", error)
    })


export { app, auth }