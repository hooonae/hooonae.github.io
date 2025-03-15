// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 상점 아이템 로드
function loadShopItems() {
    db.ref("shop").once("value", snapshot => {
        const shopContainer = document.getElementById("shop-items");
        shopContainer.innerHTML = "";

        snapshot.forEach(child => {
            const item = child.val();
            const itemId = child.key;

            let itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name} - ${item.price}P</p>
                <button onclick="buyItem('${itemId}', ${item.price})">구매</button>
            `;
            shopContainer.appendChild(itemDiv);
        });
    });
}

// ✅ 아이템 구매 로직
function buyItem(itemId, price) {
    const user = getCurrentUser();
    if (!user) {
        alert("❌ 로그인 후 이용하세요!");
        window.location.href = "auth.html";
        return;
    }

    db.ref(`users/${user}`).once("value", snapshot => {
        if (!snapshot.exists()) {
            alert("⚠️ 유저 정보를 찾을 수 없습니다.");
            return;
        }

        let userData = snapshot.val();
        let currentPoints = userData.points || 0;
        let inventory = userData.inventory || {};

        if (currentPoints < price) {
            alert("⛔ 포인트가 부족합니다!");
            return;
        }

        // ✅ 포인트 차감 & 아이템 추가
        inventory[itemId] = true;
        db.ref(`users/${user}`).update({
            points: currentPoints - price,
            inventory
        });

        alert("✅ 아이템 구매 완료!");
        updatePointsDisplay();
    });
}

// ✅ 유저 포인트 표시
function updatePointsDisplay() {
    const user = getCurrentUser();
    if (!user) return;

    db.ref(`users/${user}/points`).on("value", snapshot => {
        document.getElementById("user-points").innerText = snapshot.val() || 0;
    });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    loadShopItems();
    updatePointsDisplay();
});
