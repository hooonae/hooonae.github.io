// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

const userId = getCurrentUser();

// ✅ 상점 아이템 불러오기
function loadShopItems() {
    const shopContainer = document.getElementById("shop");

    db.ref("shop").once("value", snapshot => {
        shopContainer.innerHTML = "";

        if (!snapshot.exists()) {
            shopContainer.innerHTML = "<p>🛒 판매 중인 아이템이 없습니다.</p>";
            return;
        }

        snapshot.forEach(child => {
            let item = child.val();
            let itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");
            itemDiv.innerHTML = `
                <img src="${item.src}" alt="${item.name}">
                <p>${item.name}</p>
                <p>💰 ${item.price} 포인트</p>
                <button onclick="buyItem('${child.key}', ${item.price})">🛍 구매</button>
            `;
            shopContainer.appendChild(itemDiv);
        });
    });
}

// ✅ 아이템 구매 함수
function buyItem(itemId, price) {
    db.ref(`users/${userId}/points`).once("value", snapshot => {
        let currentPoints = snapshot.val() || 0;

        if (currentPoints < price) {
            alert("❌ 포인트가 부족합니다!");
            return;
        }

        // ✅ 아이템 정보 가져오기
        db.ref(`shop/${itemId}`).once("value", itemSnapshot => {
            if (!itemSnapshot.exists()) return;

            let item = itemSnapshot.val();

            // ✅ 포인트 차감 및 인벤토리에 추가
            db.ref(`users/${userId}/points`).set(currentPoints - price);
            db.ref(`users/${userId}/inventory/${itemId}`).set(item);

            alert("✅ 아이템을 구매했습니다!");
            loadUserPoints();
        });
    });
}

// ✅ 유저의 포인트 불러오기
function loadUserPoints() {
    db.ref(`users/${userId}/points`).once("value", snapshot => {
        document.getElementById("userPoints").innerText = snapshot.val() || 0;
    });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", () => {
    loadShopItems();
    loadUserPoints();
});

