// ✅ Firebase 초기화 (firebase.js를 로드해야 함)
function getCurrentUser() {
    return localStorage.getItem("user");
}

// ✅ 채광 가능 여부 확인 & 포인트 지급
function minePoints() {
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
        let lastMineTime = userData.lastMineTime ? new Date(userData.lastMineTime) : new Date(0);
        let now = new Date();
        let timeDiff = (now - lastMineTime) / (1000 * 60 * 60); // 시간 차이 (시간 단위)

        if (timeDiff < 1) {
            let remainingTime = Math.ceil((1 - timeDiff) * 60);
            alert(`⏳ 아직 채광할 수 없습니다! (${remainingTime}분 후 가능)`);
            return;
        }

        // ✅ 랜덤 포인트 지급 (10~50 포인트)
        let earnedPoints = Math.floor(Math.random() * 41) + 10;
        let newPoints = (userData.points || 0) + earnedPoints;

        // ✅ Firebase 업데이트 (포인트 & 마지막 채광 시간 저장)
        db.ref(`users/${user}`).update({
            points: newPoints,
            lastMineTime: now.toISOString()
        });

        alert(`✅ ${earnedPoints} 포인트를 획득했습니다!`);
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
document.addEventListener("DOMContentLoaded", updatePointsDisplay);
