// 로그인 기능
function login() {
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;

    if (password === "9999") {  // 임시 비밀번호
        localStorage.setItem("user", nickname);
        window.location.href = "home.html";
    } else {
        alert("로그인 실패!");
    }
}

// 회원가입 기능
function signup() {
    const nickname = document.getElementById("new-nickname").value;
    const password = document.getElementById("new-password").value;

    if (password.length !== 4) {
        alert("비밀번호는 4자리여야 합니다!");
        return;
    }

    alert("회원가입 완료! 로그인 해주세요.");
    window.location.href = "login.html";
}

// 채광 시스템
function minePoints() {
    const lastMineTime = localStorage.getItem("lastMineTime") || 0;
    const now = Date.now();

    if (now - lastMineTime < 3600000) {  // 1시간 제한
        alert("⏳ 1시간 후 다시 채광 가능!");
        return;
    }

    const earned = Math.floor(Math.random() * 50) + 10;
    let points = Number(localStorage.getItem("points") || 0);
    points += earned;

    localStorage.setItem("lastMineTime", now);
    localStorage.setItem("points", points);
    alert(`🎉 ${earned} 포인트 획득!`);
}

// 아이템 구매
function buyItem(item, price) {
    let points = Number(localStorage.getItem("points") || 0);

    if (points >= price) {
        points -= price;
        localStorage.setItem("points", points);
        alert(`${item} 구매 완료!`);
    } else {
        alert("포인트가 부족합니다!");
    }
}
