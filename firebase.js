// ✅ Firebase 설정 및 초기화
const firebaseConfig = {
    apiKey: "AIzaSyAwXlQewHZxYLbZMkoKhm9HYsj6R8oPEpA",
    authDomain: "museum-web-370cd.firebaseapp.com",
    databaseURL: "https://museum-web-370cd-default-rtdb.firebaseio.com",
    projectId: "museum-web-370cd",
    storageBucket: "museum-web-370cd.appspot.com",
    messagingSenderId: "154810876093",
    appId: "1:154810876093:web:d9cc427254abfb609e37d4"
};

// ✅ Firebase 앱 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

console.log("✅ Firebase 초기화 완료!");
