// import firebase from 'firebase';
import { initializeApp } from 'firebase/app';
const config = {
  apiKey: 'AIzaSyADHkKXnXaY_zz519UpRgaX7vfn1EVDWZ4',
  authDomain: 'ainhoa-employees.firebaseapp.com',
  projectId: 'ainhoa-employees',
  storageBucket: 'ainhoa-employees.appspot.com',
  messagingSenderId: '574090730663',
  appId: '1:574090730663:web:60434152ce4ce654e50f82'
};

const firebase = initializeApp(config);

// const db = getFirestore(firebase);

export default firebase;
