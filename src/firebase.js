// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app"
import "firebase/database"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAqNRAoPb0we-j9fnagw7aoU590OmciTOc",
    authDomain: "bananagrams-94781.firebaseapp.com",
    databaseURL: "https://bananagrams-94781.firebaseio.com",
    projectId: "bananagrams-94781",
    storageBucket: "bananagrams-94781.appspot.com",
    messagingSenderId: "416975591116",
    appId: "1:416975591116:web:2809fd87854ee1143c5469"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.database();