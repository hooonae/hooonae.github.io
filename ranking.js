// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 포인트 랭킹 불러오기
function loadRanking() {
    const rankingContainer = document.getElementById("ranking-list");

    db.ref("users").orderByChild("points").once("value", snapshot => {
        if (!snapshot.exists()) {
            rankingContainer.innerHTML = "<p>🚀 아직 랭킹 데이터가 없습니다.</p>";
            return;
        }

        let rankingArray = [];
        snapshot.forEach(child => {
            rankingArray.push({
                username: child.key,
                points: child.val().points || 0
            });
        });

        // ✅ 높은 점수순으로 정렬
        rankingArray.sort((a, b) => b.points - a.points);

        rankingContainer.innerHTML = ""; // 기존 데이터 초기화
        rankingArray.forEach((user, index) => {
            let userDiv = document.createElement("div");
            userDiv.classList.add("ranking-item");
            userDiv.innerHTML = `
                <span class="rank">🏆 ${index + 1}위</span>
                <span class="username">${user.username}</span>
                <span class="points">💰 ${user.points}P</span>
            `;
            rankingContainer.appendChild(userDiv);
        });
    });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadRanking);
