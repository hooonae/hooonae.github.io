import { db, DEFAULT_BG_URL, DEFAULT_CHAR_URL } from "./firebase.js";

// ✅ 현재 로그인된 사용자 가져오기
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 미니홈피 데이터 불러오기
async function loadMiniroom() {
    const user = getCurrentUser();
    if (!user) {
        alert("❌ 로그인 후 이용하세요!");
        window.location.href = "auth.html";
        return;
    }

    const snapshot = await db.ref(`miniroom/${user}`).once("value");
    if (!snapshot.exists()) {
        console.log("🚀 새 미니홈피 생성!");
        document.getElementById("room").style.backgroundImage = `url(${DEFAULT_BG_URL})`;
        document.getElementById("character").src = DEFAULT_CHAR_URL;
        return;
    }

    const data = snapshot.val();
    document.getElementById("room").style.backgroundImage = `url(${data.background || DEFAULT_BG_URL})`;
    document.getElementById("character").src = data.character || DEFAULT_CHAR_URL;
    document.getElementById("items").innerHTML = data.items || "";
}

// ✅ 미니홈피 저장 (Cloudinary 이미지 포함)
async function saveMiniroom() {
    const user = getCurrentUser();
    if (!user) return;

    const background = document.getElementById("bgInput").value || DEFAULT_BG_URL;
    const character = document.getElementById("charInput").value || DEFAULT_CHAR_URL;
    const items = document.getElementById("items").innerHTML;

    await db.ref(`miniroom/${user}`).set({ background, character, items });

    alert("✅ 저장 완료!");
}

// ✅ Cloudinary 이미지 업로드 기능
async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "firebase_uploads");

    try {
        const response = await fetch("https://api.cloudinary.com/v1_1/your-cloud-name/image/upload", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("❌ Cloudinary 이미지 업로드 실패:", error);
        return "";
    }
}

// ✅ 배경 변경
async function changeBackground() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = async function () {
        const file = fileInput.files[0];
        if (file) {
            const imageUrl = await uploadToCloudinary(file);
            document.getElementById("room").style.backgroundImage = `url(${imageUrl})`;
            document.getElementById("bgInput").value = imageUrl;
        }
    };
}

// ✅ 캐릭터 변경
async function changeCharacter() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = async function () {
        const file = fileInput.files[0];
        if (file) {
            const imageUrl = await uploadToCloudinary(file);
            document.getElementById("character").src = imageUrl;
            document.getElementById("charInput").value = imageUrl;
        }
    };
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    loadMiniroom();
});
