const listpluscontainer = document.getElementById("list-plus-container");
const listcontainer = document.getElementsByClassName("list-container")[0];

listpluscontainer.addEventListener('click', function() {
    let newDiv = document.createElement("div");
    newDiv.classList.add("list-item");

    newDiv.innerHTML = `
        <div><img src="../image/plus (2).png" alt=""></div>
        <div class="listtext-container">
            <input type="text" class="list-text-input" placeholder="일정 내용을 입력하세요">
            <input type="time" class="list-time-input">
            <button class="submit-button">완료</button>
        </div>
    `;

    listcontainer.appendChild(newDiv);
});
