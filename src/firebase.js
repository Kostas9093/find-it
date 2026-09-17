// -----------------------------------------------------------------------------
// FIREBASE — USED FOR LOGIN ONLY (email, password, password reset).
// -----------------------------------------------------------------------------
// IMPORTANT: This app does NOT use any online database. Your saved items
// (names, descriptions, locations) are stored ONLY on the device and are never
// uploaded anywhere. Firebase here only checks your email + password so you can
// log in and reset a forgotten password by email.
//
// Setup:
// 1. Go to https://console.firebase.google.com and create a project.
// 2. Add a "Web app" (the </> icon) and copy the config it gives you.
// 3. Paste your values below, replacing the "YOUR_..." placeholders.
// 4. In the console, enable: Authentication -> Sign-in method -> Email/Password.
//    (You do NOT need to create a Firestore/Realtime database.)
//
// These web config values are not secret; they only identify your project.
// -----------------------------------------------------------------------------

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCnkZO1Sdy90O-mbBk5uCFmT77GfVAGJOE',
  authDomain: 'find-it-57d97.firebaseapp.com',
  projectId: 'find-it-57d97',
  storageBucket: 'find-it-57d97.firebasestorage.app',
  messagingSenderId: '472112135759',
  appId: '1:472112135759:web:5301aceb6506dffc7b343a',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
