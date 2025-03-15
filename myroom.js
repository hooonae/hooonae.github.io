// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 아이템 불러오기 (Firebase에서 가져옴)
function loadItems() {
    const user = getCurrentUser();
    if (!user) return;

    db.ref(`users/${user}/items`).once("value", snapshot => {
        if (!snapshot.exists()) return;

        const room = document.getElementById("my-room");
        snapshot.forEach(child => {
            const item = child.val();
            addItemToRoom(child.key, item.x, item.y, item.src);
        });
    });
}

// ✅ 아이템을 화면에 추가하는 함수
function addItemToRoom(id, x, y, src) {
    const room = document.getElementById("my-room");
    const item = document.createElement("img");

    item.src = src;
    item.classList.add("room-item");
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.dataset.id = id;

    makeDraggable(item); // ✅ 드래그 기능 추가
    room.appendChild(item);
}

// ✅ 아이템을 드래그 가능하게 만드는 함수
function makeDraggable(item) {
    let offsetX, offsetY, isDragging = false;

    item.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - item.offsetLeft;
        offsetY = e.clientY - item.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        item.style.left = `${e.clientX - offsetX}px`;
        item.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        saveItemPosition(item); // ✅ 이동 후 위치 저장
    });
}

// ✅ 아이템 위치 저장 (Firebase 업데이트)
function saveItemPosition(item) {
    const user = getCurrentUser();
    if (!user) return;

    const itemId = item.dataset.id;
    const x = parseInt(item.style.left);
    const y = parseInt(item.style.top);

    db.ref(`users/${user}/items/${itemId}`).update({ x, y });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadItems);
