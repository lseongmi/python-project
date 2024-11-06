const listpluscontainer = document.getElementById("list-plus-container");
const popup = document.getElementById("pop-up");
const body = document.body;
const listsubmit = document.getElementById('list-submit');
const listContainer = document.querySelector('.list-container');

function loadSchedules() {
    fetch('http://127.0.0.1:5000/get_schedules')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                addScheduleToDOM(item.schedule, item.time, item.completed);
            });
        })
        .catch(error => console.error('Fetch Error:', error));
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
    const isCompleted = imgElement.src.includes('completed.png');
    imgElement.src = isCompleted ? '../static/image/Ellipse 15.png' : '../static/image/Frame 8.png';

    fetch('http://127.0.0.1:5000/complete_schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            schedule: schedule,
            completed: !isCompleted
        })
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch(error => console.error('Fetch Error:', error));
}

listsubmit.addEventListener('click', function() {
    const scheduleText = document.querySelector('#list-write input').value; 
    const timeText = document.querySelector('#time-write input').value; 

    if (scheduleText && timeText) {
        fetch('http://127.0.0.1:5000/add_schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
    } else {
        alert("일정과 시간을 모두 입력해주세요.");
    }
});

listpluscontainer.addEventListener('click', function() {
    popup.style.display = popup.style.display === "flex" ? "none" : "flex";
    body.style.backgroundColor = popup.style.display === "flex" ? "rgba(0, 0, 0, 0.2)" : "";
});

window.onload = loadSchedules;