// ✅ 현재 로그인한 유저 가져오기
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 채광 가능 여부 확인 함수 (1시간 제한)
function canMine(userData) {
    if (!userData.lastMineTime) return true; // 첫 채광 가능

    const lastMineTime = new Date(userData.lastMineTime);
    const now = new Date();
    const timeDiff = (now - lastMineTime) / (1000 * 60 * 60); // 시간 차이 계산

    return timeDiff >= 1; // 1시간 이상이면 채광 가능
}

// ✅ 채광 버튼 클릭 시 실행
function mine() {
    const user = getCurrentUser();
    if (!user) {
        alert("❌ 로그인 후 이용 가능합니다!");
        window.location.href = "auth.html";
        return;
    }

    db.ref(`users/${user}`).once("value", snapshot => {
        if (!snapshot.exists()) {
            alert("⚠️ 유저 정보가 없습니다. 다시 로그인해주세요.");
            return;
        }

        const userData = snapshot.val();

        if (!canMine(userData)) {
            alert("⏳ 아직 채광할 수 없습니다! 1시간 후에 다시 시도하세요.");
            return;
        }

        const randomPoints = Math.floor(Math.random() * 10) + 1; // 1~10 랜덤 포인트
        const newPoints = (userData.points || 0) + randomPoints;
        const now = new Date().toISOString();

        db.ref(`users/${user}`).update({
            points: newPoints,
            lastMineTime: now
        });

        alert(`✅ 채광 성공! ${randomPoints} 포인트 획득! (총 포인트: ${newPoints})`);
        loadRankings(); // 랭킹 갱신
    });
}

// ✅ 랭킹 불러오기 함수
function loadRankings() {
    const rankingList = document.getElementById("ranking-list");
    rankingList.innerHTML = "<p>📡 랭킹 불러오는 중...</p>";

    db.ref("users").orderByChild("points").once("value", snapshot => {
        rankingList.innerHTML = "";
        const users = [];

        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            users.push({ name: childSnapshot.key, points: userData.points || 0 });
        });

        users.sort((a, b) => b.points - a.points); // 포인트 내림차순 정렬

        users.forEach((user, index) => {
            const rankItem = document.createElement("p");
            rankItem.innerHTML = `🥇 ${index + 1}위: <strong>${user.name}</strong> - ${user.points} 포인트`;
            rankingList.appendChild(rankItem);
        });
    });
}

// ✅ 페이지 로드 시 랭킹 불러오기
document.addEventListener("DOMContentLoaded", loadRankings);
