// ✅ 회원가입 기능
function signup() {
    const nickname = document.getElementById("new-nickname").value.trim();
    const password = document.getElementById("new-password").value.trim();

    if (password.length !== 4) {
        alert("⚠️ 비밀번호는 4자리여야 합니다.");
        return;
    }

    db.ref(`users/${nickname}`).once("value", (snapshot) => {
        if (snapshot.exists()) {
            alert("❌ 이미 존재하는 닉네임입니다!");
        } else {
            db.ref(`users/${nickname}`).set({
                password: password,
                points: 0,
                profilePic: "default.jpg"
            });
            alert("✅ 회원가입 성공! 로그인 해주세요.");
            location.reload();
        }
    });
}

// ✅ 로그인 기능
function login() {
    const nickname = document.getElementById("nickname").value.trim();
    const password = document.getElementById("password").value.trim();

    if (password.length !== 4) {
        alert("⚠️ 비밀번호는 4자리여야 합니다.");
        return;
    }

    db.ref(`users/${nickname}`).once("value", (snapshot) => {
        if (snapshot.exists() && snapshot.val().password === password) {
            localStorage.setItem("user", nickname);
            alert("✅ 로그인 성공!");
            window.location.href = "home.html"; // 미니홈피 메인 페이지로 이동
        } else {
            alert("❌ 로그인 실패! 닉네임 또는 비밀번호 확인하세요.");
        }
    });
}

// ✅ 현재 로그인한 사용자 가져오기
function getCurrentUser() {
    return localStorage.getItem("user");
}
