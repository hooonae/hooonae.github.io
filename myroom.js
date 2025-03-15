// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

const userId = getCurrentUser();

// ✅ 유저의 아이템 불러오기
function loadInventory() {
    const inventoryContainer = document.getElementById("inventory");

    db.ref(`users/${userId}/inventory`).once("value", snapshot => {
        inventoryContainer.innerHTML = "";

        if (!snapshot.exists()) {
            inventoryContainer.innerHTML = "<p>🎒 보유한 아이템이 없습니다.</p>";
            return;
        }

        snapshot.forEach(child => {
            let item = child.val();
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("inventory-item");
            itemDiv.innerHTML = `<img src="${item.src}" alt="${item.name}" draggable="true" ondragstart="drag(event, '${child.key}')">`;
            inventoryContainer.appendChild(itemDiv);
        });
    });
}

// ✅ 유저의 방 불러오기
function loadRoom() {
    db.ref(`users/${userId}/room`).once("value", snapshot => {
        if (!snapshot.exists()) return;

        let room = snapshot.val();
        document.getElementById("room").style.backgroundImage = `url(${room.background || 'default_bg.png'})`;

        let roomContainer = document.getElementById("room-items");
        roomContainer.innerHTML = ""; // 기존 아이템 초기화

        if (room.items) {
            Object.keys(room.items).forEach(key => {
                let item = room.items[key];
                let itemDiv = document.createElement("div");
                itemDiv.classList.add("room-item");
                itemDiv.style.left = item.x + "px";
                itemDiv.style.top = item.y + "px";
                itemDiv.setAttribute("data-key", key);
                itemDiv.innerHTML = `<img src="${item.src}" alt="아이템">`;
                roomContainer.appendChild(itemDiv);
            });
        }
    });
}

// ✅ 드래그 이벤트
function drag(event, itemId) {
    event.dataTransfer.setData("itemId", itemId);
}

// ✅ 드롭 이벤트 (방에 아이템 배치)
function drop(event) {
    event.preventDefault();
    let itemId = event.dataTransfer.getData("itemId");

    db.ref(`users/${userId}/inventory/${itemId}`).once("value", snapshot => {
        if (!snapshot.exists()) return;

        let item = snapshot.val();
        let x = event.offsetX;
        let y = event.offsetY;

        db.ref(`users/${userId}/room/items/${itemId}`).set({ src: item.src, x, y }).then(() => {
            loadRoom();
        });
    });
}

// ✅ 드래그 앤 드롭 활성화
function allowDrop(event) {
    event.preventDefault();
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    loadInventory();
    loadRoom();
});
