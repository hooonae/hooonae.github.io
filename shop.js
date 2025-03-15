// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 아이템 목록 불러오기
function loadShop() {
    const shopContainer = document.getElementById("shop-items");
    db.ref("shop").once("value", snapshot => {
        if (!snapshot.exists()) return;
        
        shopContainer.innerHTML = ""; // 초기화

        snapshot.forEach(child => {
            const item = child.val();
            const itemId = child.key;

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");
            itemDiv.innerHTML = `
                <img src="${item.src}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>💰 ${item.price}P</p>
                <button onclick="buyItem('${itemId}', ${item.price}, '${item.name}', '${item.src}')">🛒 구매</button>
            `;

            shopContainer.appendChild(itemDiv);
        });
    });
}

// ✅ 아이템 구매 기능
function buyItem(itemId, price, name, src) {
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

        if (currentPoints < price) {
            alert("❌ 포인트가 부족합니다!");
            return;
        }

        // ✅ 포인트 차감 및 아이템 추가
        let newPoints = currentPoints - price;
        db.ref(`users/${user}`).update({ points: newPoints });

        // ✅ 유저 인벤토리에 아이템 추가
        db.ref(`users/${user}/inventory/${itemId}`).set({ name, src });

        alert(`✅ ${name}을(를) 구매했습니다!`);
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
    loadShop();
    updatePointsDisplay();
});
