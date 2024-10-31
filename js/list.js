const listpluscontainer = document.getElementById("list-plus-container");
const popup = document.getElementById("pop-up");
const body = document.body; // body 요소 선택

listpluscontainer.addEventListener('click', function() {
    if (popup.style.display === "flex") {
        popup.style.display = "none";
        body.style.backgroundColor = ""; // 배경색 제거
    } else {
        popup.style.display = "flex";
        body.style.backgroundColor = "rgba(0, 0, 0, 0.2)"; // 배경색 추가
    }
});
