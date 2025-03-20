import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqgF6_tAfYDs9moBOv-zDYDUL_LpHm1Ik",
  authDomain: "mundo-pastel04.firebaseapp.com",
  projectId: "mundo-pastel04",
  storageBucket: "mundo-pastel04.firebasestorage.app",
  messagingSenderId: "774780087056",
  appId: "1:774780087056:web:7b1f01d89dd4b643029395",
  measurementId: "G-7YRL2W003R"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
