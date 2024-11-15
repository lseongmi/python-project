const emotions = document.getElementsByClassName("feeling-emoji");
let selectedEmotion = ""; // 선택된 이모지를 저장할 변수

// 이모지를 클릭했을 때 처리
Array.from(emotions).forEach(element => {
    element.addEventListener('click', function() {
        // 모든 요소에서 active 클래스를 제거
        Array.from(emotions).forEach(el => el.classList.remove("click-event"));
        
        // 현재 클릭한 요소에만 active 클래스 추가
        element.classList.add("click-event");
        
        // 선택된 이모지의 src 경로를 저장
        selectedEmotion = element.src;
    });
});

// 현재 날짜를 yyyy년 mm월 dd일 형식으로 가져오기
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}년 ${month}월 ${day}일`;
}

// 로그인된 사용자 정보를 서버에서 가져오는 함수
function getLoggedInUser() {
    return fetch("http://127.0.0.1:5001/get_logged_in_user")
        .then(response => response.json())
        .then(data => data.user)
        .catch(error => console.error("Error fetching logged-in user:", error));
}

// 다이어리를 서버에 저장하는 함수
function submitDiary() {
    const diaryText = document.querySelector(".write").innerText; // 작성된 일기 내용 가져오기
    const date = getCurrentDate();

    if (!selectedEmotion) {
        alert("감정을 선택해주세요!"); // 감정 선택이 안된 경우 경고 메시지
        return;
    }

    // 현재 로그인한 사용자 이름 가져오기
    getLoggedInUser().then(username => {
        fetch("http://127.0.0.1:5001/save_diary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: username,
                date: date,
                emotion: selectedEmotion,
                diary: diaryText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Diary saved successfully") {
                alert("일기가 성공적으로 저장되었습니다!");
            }
        })
        .catch(error => console.error("Diary save error:", error));
    });
}

// "완료" 버튼 클릭 이벤트에 다이어리 제출 연결
document.querySelector("button").addEventListener("click", submitDiary);
