// ✅ Firebase SDK 추가
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// ✅ Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAwXlQewHZxYLbZMkoKhm9HYsj6R8oPEpA",
    authDomain: "museum-web-370cd.firebaseapp.com",
    databaseURL: "https://museum-web-370cd-default-rtdb.firebaseio.com",
    projectId: "museum-web-370cd",
    storageBucket: "museum-web-370cd.appspot.com",
    messagingSenderId: "154810876093",
    appId: "1:154810876093:web:d9cc427254abfb609e37d4"
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Cloudinary 기본 이미지 URL 설정
const DEFAULT_BG_URL = "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-bg.jpg";
const DEFAULT_CHAR_URL = "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-character.png";

// ✅ 외부에서 사용 가능하도록 내보내기
export { db, ref, set, get, update, remove, onValue, DEFAULT_BG_URL, DEFAULT_CHAR_URL };
