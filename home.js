// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 미니홈피 데이터 불러오기
function loadMiniroom() {
    const user = getCurrentUser();
    if (!user) {
        alert("❌ 로그인 후 이용하세요!");
        window.location.href = "auth.html";
        return;
    }

    db.ref(`miniroom/${user}`).once("value", snapshot => {
        if (!snapshot.exists()) {
            console.log("🚀 새 미니홈피 생성!");
            return;
        }

        const data = snapshot.val();
        document.getElementById("room").style.backgroundImage = `url(${data.background || 'default-bg.jpg'})`;
        document.getElementById("character").src = data.character || "default-character.png";
        document.getElementById("items").innerHTML = data.items || "";
    });
}

// ✅ 미니홈피 데이터 저장
function saveMiniroom() {
    const user = getCurrentUser();
    if (!user) return;

    const background = document.getElementById("bgInput").value || "";
    const character = document.getElementById("charInput").value || "";
    const items = document.getElementById("items").innerHTML;

    db.ref(`miniroom/${user}`).set({ background, character, items });

    alert("✅ 저장 완료!");
}

// ✅ 배경 변경
function changeBackground() {
    const newBg = prompt("변경할 배경 이미지 URL을 입력하세요:");
    if (newBg) {
        document.getElementById("room").style.backgroundImage = `url(${newBg})`;
        document.getElementById("bgInput").value = newBg;
    }
}

// ✅ 캐릭터 변경
function changeCharacter() {
    const newChar = prompt("변경할 캐릭터 이미지 URL을 입력하세요:");
    if (newChar) {
        document.getElementById("character").src = newChar;
        document.getElementById("charInput").value = newChar;
    }
}

// ✅ 아이템 추가
function addItem() {
    const newItem = prompt("아이템 이미지 URL을 입력하세요:");
    if (newItem) {
        const img = document.createElement("img");
        img.src = newItem;
        img.className = "draggable";
        img.style.left = "50px";
        img.style.top = "50px";
        document.getElementById("items").appendChild(img);
    }
}

// ✅ 드래그 기능 추가
document.addEventListener("DOMContentLoaded", () => {
    loadMiniroom();

    document.getElementById("items").addEventListener("mousedown", function (event) {
        if (!event.target.classList.contains("draggable")) return;

        let draggedItem = event.target;
        let offsetX = event.clientX - draggedItem.getBoundingClientRect().left;
        let offsetY = event.clientY - draggedItem.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            draggedItem.style.left = pageX - offsetX + "px";
            draggedItem.style.top = pageY - offsetY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", onMouseMove);
        }, { once: true });
    });
});
