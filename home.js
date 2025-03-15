import { db, ref, get, set } from "./firebase.js";

// ✅ 현재 로그인한 사용자 가져오기
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 미니홈피 불러오기 (구매한 아이템만 사용 가능)
function loadMiniroom() {
    const user = getCurrentUser();
    if (!user) {
        alert("❌ 로그인 후 이용하세요!");
        window.location.href = "auth.html";
        return;
    }

    get(ref(db, `users/${user}`)).then(snapshot => {
        if (!snapshot.exists()) return;
        const userData = snapshot.val();
        const purchased = userData.purchased || { backgrounds: [], characters: [], items: [] };

        const room = document.getElementById("room");
        const character = document.getElementById("character");

        // ✅ 기본 배경 / 캐릭터 적용
        room.style.backgroundImage = `url(${purchased.backgrounds[0] || 'default-bg.jpg'})`;
        character.src = purchased.characters[0] || 'default-character.png';
    });
}

window.loadMiniroom = loadMiniroom;
document.addEventListener("DOMContentLoaded", loadMiniroom);

