const emotions = document.getElementsByClassName("feeling-emoji");

Array.from(emotions).forEach(element => {
    element.addEventListener('click', function() {
        // 모든 요소에서 active 클래스를 제거
        Array.from(emotions).forEach(el => el.classList.remove("click-event"));
        
        // 현재 클릭한 요소에만 active 클래스 추가
        element.classList.add("click-event");
    });
});
