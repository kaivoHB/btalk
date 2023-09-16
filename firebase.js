import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage }  from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAvBzF7whONy7kag_kGmgpYC6-jAP6e5tc",
    authDomain: "btalk-be914.firebaseapp.com",
    projectId: "btalk-be914",
    storageBucket: "btalk-be914.appspot.com",
    messagingSenderId: "330458551660",
    appId: "1:330458551660:web:adbe5392cf7dbe8604cf49"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()