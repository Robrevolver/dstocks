// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD76JT686TzbGKzCai918Okft6ucZhyfI0",
  authDomain: "dstocks-defichain.firebaseapp.com",
  projectId: "dstocks-defichain",
  storageBucket: "dstocks-defichain.appspot.com",
  messagingSenderId: "724805289740",
  appId: "1:724805289740:web:0beea2f3438617e69deb29",
  measurementId: "G-2TPMF069TH"
};

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 // eslint-disable-next-line no-unused-vars
 const analytics = getAnalytics(app);
