import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCJgRxDwTNGVPF11obLs6duJOBY7sNq8uI",
  authDomain: "projeto-1-54f65.firebaseapp.com",
  databaseURL: "https://projeto-1-54f65-default-rtdb.firebaseio.com",
  projectId: "projeto-1-54f65",
  storageBucket: "projeto-1-54f65.firebasestorage.app",
  messagingSenderId: "598600841738",
  appId: "1:598600841738:web:0a7e4b26f4fa649ce33df3",
  measurementId: "G-WVWRYZKZYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

