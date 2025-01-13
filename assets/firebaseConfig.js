import React from 'react';
import { View, Text } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-WAlZV74Raeyp2Vfowwd966tKA9NTq9g",
  authDomain: "neuroconnect-zone.firebaseapp.com",
  databaseURL: "https://neuroconnect-zone-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "neuroconnect-zone",
  storageBucket: "neuroconnect-zone.firebasestorage.app",
  messagingSenderId: "517730280310",
  appId: "1:517730280310:web:5c48296e6e138fa6ac1057",
  measurementId: "G-VW7LYGQBFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Export the app and the database to use them in other files
export { database, auth };
