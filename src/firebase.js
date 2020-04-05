// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
import "firebase/firestore"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB4nN4kEkJenuCuHafSjXcj-21LbKb6Nxc",
    authDomain: "eyereddit-67c3c.firebaseapp.com",
    databaseURL: "https://eyereddit-67c3c.firebaseio.com",
    projectId: "eyereddit-67c3c",
    storageBucket: "eyereddit-67c3c.appspot.com",
    messagingSenderId: "256007020225",
    appId: "1:256007020225:web:b48e5f0c756c4410a97e40"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export default firebase.firestore();