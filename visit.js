// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ✅ 방문할 유저 ID 가져오기
const visitedUser = getQueryParam("user");

// ✅ 유저 미니홈피 불러오기
function loadMiniHome() {
    if (!visitedUser) {
        alert("❌ 방문할 유저 정보가 없습니다.");
        window.location.href = "ranking.html";
        return;
    }

    db.ref(`users/${visitedUser}/profile`).once("value", snapshot => {
        if (!snapshot.exists()) {
            alert("❌ 유저 정보를 찾을 수 없습니다.");
            window.location.href = "ranking.html";
            return;
        }

        let profile = snapshot.val();
        document.getElementById("nickname").innerText = profile.nickname || "미니홈피 주인";
        document.getElementById("statusMessage").innerText = profile.statusMessage || "방문을 환영합니다!";
        document.getElementById("profileImage").src = profile.profileImage || "default_profile.png";
    });

    db.ref(`users/${visitedUser}/room`).once("value", snapshot => {
        if (!snapshot.exists()) return;

        let room = snapshot.val();
        document.getElementById("room").style.backgroundImage = `url(${room.background || 'default_bg.png'})`;

        let roomContainer = document.getElementById("room-items");
        roomContainer.innerHTML = ""; // 기존 아이템 초기화

        if (room.items) {
            Object.values(room.items).forEach(item => {
                let itemDiv = document.createElement("div");
                itemDiv.classList.add("room-item");
                itemDiv.style.left = item.x + "px";
                itemDiv.style.top = item.y + "px";
                itemDiv.innerHTML = `<img src="${item.src}" alt="${item.name}">`;
                roomContainer.appendChild(itemDiv);
            });
        }
    });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadMiniHome);
