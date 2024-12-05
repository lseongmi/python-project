const emotions = document.getElementsByClassName("feeling-emoji");
let selectedEmotion = ""; // 선택된 감정을 저장할 변수

// 각 이모지에 클릭 이벤트 리스너 추가
Array.from(emotions).forEach(element => {
    element.addEventListener('click', function() {
        // 모든 이모지에서 'click-event' 클래스 제거
        Array.from(emotions).forEach(el => el.classList.remove("click-event"));
        
        // 선택된 이모지에 'click-event' 클래스 추가
        element.classList.add("click-event");
        
        // 선택된 감정을 selectedEmotion에 저장 (이모지의 data-feeling 값을 사용)
        selectedEmotion = element.getAttribute("data-feeling");
    });
});

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}년 ${month}월 ${day}일`;
}

function getLoggedInUser() {
    return fetch("http://127.0.0.1:5001/get_logged_in_user")
        .then(response => response.json())
        .then(data => data.user)
        .catch(error => console.error("Error fetching logged-in user:", error));
}

function submitDiary() {
    const diaryText = document.querySelector(".write").innerText.trim(); // 작성된 일기 내용 가져오기 (공백 제거)
    const date = getCurrentDate();

    // 감정이 선택되지 않은 경우 경고
    if (!selectedEmotion) {
        alert("감정을 선택해주세요!");
        return;
    }

    // 일기 내용이 비어 있는 경우 경고
    if (!diaryText) {
        alert("일기 내용을 작성해주세요!");
        return;
    }

    // 로그인한 사용자 정보를 가져와서 서버에 일기 저장 요청
    getLoggedInUser().then(username => {
        fetch("http://127.0.0.1:5001/save_diary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: username,
                date: date,
                emotion: selectedEmotion, // 감정을 selectedEmotion에서 가져옴
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

// 일기 저장 버튼 클릭 시 submitDiary 호출
document.querySelector("button").addEventListener("click", submitDiary);
