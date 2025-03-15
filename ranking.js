// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 랭킹 데이터 불러오기
function loadRanking() {
    db.ref("users").once("value", snapshot => {
        const rankingContainer = document.getElementById("ranking-list");
        rankingContainer.innerHTML = "<p>📡 로딩 중...</p>";

        if (!snapshot.exists()) {
            rankingContainer.innerHTML = "<p>🏆 랭킹 데이터가 없습니다.</p>";
            return;
        }

        let rankings = [];
        snapshot.forEach(child => {
            const userId = child.key;
            const data = child.val();
            rankings.push({ userId, points: data.points || 0 });
        });

        // ✅ 포인트 순으로 내림차순 정렬
        rankings.sort((a, b) => b.points - a.points);

        rankingContainer.innerHTML = "";
        rankings.forEach((entry, index) => {
            let rankDiv = document.createElement("div");
            rankDiv.classList.add("rank-entry");
            rankDiv.innerHTML = `<p>🏅 <strong>#${index + 1}</strong> ${entry.userId} - <strong>${entry.points}P</strong></p>`;
            rankingContainer.appendChild(rankDiv);
        });
    });
}

// ✅ 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", loadRanking);
