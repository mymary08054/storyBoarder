import * as firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyBeR3gHwQWqXGa_bPDLjrt3xtwOVhyplYA",
    authDomain: "storyboarder-f3844.firebaseapp.com",
    databaseURL: "https://storyboarder-f3844.firebaseio.com",
    projectId: "storyboarder-f3844",
    storageBucket: "storyboarder-f3844.appspot.com",
    messagingSenderId: "964038204070"
};
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp;