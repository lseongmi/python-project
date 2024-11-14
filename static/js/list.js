const listpluscontainer = document.getElementById("list-plus-container");
const popup = document.getElementById("pop-up");
const body = document.body;
const listsubmit = document.getElementById('list-submit');
const listContainer = document.querySelector('.list-container');
const currentDay = document.getElementById("currentday");

let currentDate;

const displayCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;  // 월은 0부터 시작하므로 +1 필요
    const date = today.getDate();

    currentDate = `${year}년 ${month}월 ${date}일`;  // 현재 날짜를 변수에 저장
    currentDay.innerText = currentDate;  // 화면에 표시
}


// 로그인된 사용자 이름을 가져오는 함수 (예시로 current_user.username을 서버로부터 가져오는 방법)
function getLoggedInUser() {
    return fetch('http://127.0.0.1:5001/get_logged_in_user')
        .then(response => response.json())
        .then(data => {
            if (data && data.user) {
                return data.user;  // 정상적인 사용자 반환
            } else {
                console.log('No user logged in.');
                return null;  // 로그인된 사용자가 없을 때
            }
        })
        .catch(error => {
            console.error('Error fetching logged-in user:', error);
            return null;
        });
}


function loadSchedules(date = currentDate) {  // 기본값으로 현재 날짜를 설정
    getLoggedInUser().then(username => {
        if (username) {
            fetch(`http://127.0.0.1:5001/get_schedules?user=${username}&date=${encodeURIComponent(date)}`)
                .then(response => response.json())
                .then(data => {
                    listContainer.innerHTML = ''; // 기존 일정 제거 후 새 일정 로드
                    data.forEach(item => {
                        addScheduleToDOM(item.schedule, item.time, item.completed);
                    });
                })
                .catch(error => console.error('Fetch Error:', error));
        } else {
            console.log('No logged-in user found');
        }
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
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`; // 현재 날짜 포맷

        getLoggedInUser().then(username => {
            fetch('http://127.0.0.1:5001/add_schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: username,
                    schedule: scheduleText,
                    time: timeText,
                    completed: false,
                    date: formattedDate  // 날짜도 함께 전송
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

// 페이지 로드 시 스케줄 로딩 및 현재 날짜 표시
window.onload = function() {
    displayCurrentDate();
    loadSchedules();
};

