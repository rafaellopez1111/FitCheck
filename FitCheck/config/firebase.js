import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJgRxDwTNGVPF11obLs6duJOBY7sNq8uI",
  authDomain: "projeto-1-54f65.firebaseapp.com",
  databaseURL: "https://projeto-1-54f65-default-rtdb.firebaseio.com",
  projectId: "projeto-1-54f65",
  storageBucket: "projeto-1-54f65.firebasestorage.app",
  messagingSenderId: "598600841738",
  appId: "1:598600841738:web:0a7e4b26f4fa649ce33df3",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});