const listpluscontainer = document.getElementById("list-plus-container");
const popup = document.getElementById("pop-up");
const body = document.body;
const listsubmit = document.getElementById('list-submit');
const listContainer = document.querySelector('.list-container');

// 로그인된 사용자 이름을 가져오는 함수 (예시로 current_user.username을 서버로부터 가져오는 방법)
function getLoggedInUser() {
    return fetch('/get_logged_in_user')
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            console.log("Logged in user:", data.user);
        } else {
            console.log("User is not logged in");
        }
    })
    .catch(error => console.error('Error fetching logged-in user:', error));
}

function loadSchedules() {
    getLoggedInUser().then(username => {
        fetch(`http://127.0.0.1:5001/get_schedules?user=${username}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    addScheduleToDOM(item.schedule, item.time, item.completed);
                });
            })
            .catch(error => console.error('Fetch Error:', error));
    });
}

function addScheduleToDOM(schedule, time, completed = false) {
    const newItem = document.createElement('div');
    newItem.className = 'listtext-container';
    newItem.innerHTML = `
        <img src="${completed ? '../static/image/Frame 8.png' : '../static/image/Ellipse 15.png'}" class="list-img" onclick="toggleComplete(this, '${schedule}')">
        <div class="list-text">${schedule}</div>
        <div class="time">${time}</div>
    `;
    listContainer.appendChild(newItem);
}

function toggleComplete(imgElement, schedule) {
    const isCompleted = imgElement.classList.contains('completed');
    if (isCompleted) {
        imgElement.src = '../static/image/Ellipse 15.png';  // 미완료 상태로 변경
    } else {
        imgElement.src = '../static/image/Frame 8.png';  // 완료 상태로 변경
    }

    getLoggedInUser().then(username => {
        fetch('http://127.0.0.1:5001/complete_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: username,
                schedule: schedule,
                completed: !isCompleted
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (!isCompleted) {
                imgElement.classList.add('completed');
            } else {
                imgElement.classList.remove('completed');
            }
        })
        .catch(error => console.error('Fetch Error:', error));
    });
}

listsubmit.addEventListener('click', function() {
    const scheduleText = document.querySelector('#list-write input').value;
    const timeText = document.querySelector('#time-write input').value;

    if (scheduleText && timeText) {
        getLoggedInUser().then(username => {
            fetch('http://127.0.0.1:5001/add_schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: username,  // 로그인된 사용자 이름을 전송
                    schedule: scheduleText,
                    time: timeText,
                    completed: false
                })
            })
            .then(response => response.json())
            .then(data => {
                addScheduleToDOM(data.schedule, data.time, data.completed);
                document.querySelector('#list-write input').value = '';
                document.querySelector('#time-write input').value = '';
            })
            .catch(error => console.log('Fetch Error:', error));
        });
    } else {
        alert("일정과 시간을 모두 입력해주세요.");
    }
});

listpluscontainer.addEventListener('click', function() {
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
    body.style.backgroundColor = popup.style.display === "flex" ? "rgba(0, 0, 0, 0.2)" : "";
});

window.onload = loadSchedules;
