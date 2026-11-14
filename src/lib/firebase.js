import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCwjcNBEnQ4yUjhjz5UDdlF0dqkoUlaXX8',
  authDomain: 'respect-community-73770.firebaseapp.com',
  projectId: 'respect-community-73770',
  storageBucket: 'respect-community-73770.firebasestorage.app',
  messagingSenderId: '924669096170',
  appId: '1:924669096170:web:9f74700c3d1ce2cb1ca793',
  measurementId: 'G-8GE54X2J90',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
