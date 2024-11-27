const calendarDates = document.getElementById("calendarDates");
const currentMonthElement = document.getElementById("currentMonth");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const today = document.getElementById("today");
const listnocomplete = document.querySelector(".list-nocomplete");
const diaryContainer = document.querySelector(".diary-container");

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// 로그인된 사용자 정보를 가져오는 함수
function getLoggedInUser() {
  return fetch('http://127.0.0.1:5001/get_logged_in_user')  // 로그인된 사용자 정보 요청
      .then(response => response.json())
      .then(data => {
          if (data && data.user) {
              return data.user;  // 정상적으로 로그인된 사용자 반환
          } else {
              console.log('No user logged in.');
              return null;  // 로그인된 사용자가 없으면 null 반환
          }
      })
      .catch(error => {
          console.error('Error fetching logged-in user:', error);
          return null;  // 오류 발생 시 null 반환
      });
}

// 완료되지 않은 일정을 가져오는 함수
function fetchIncompleteSchedules(date) {
  getLoggedInUser().then(username => {
      if (username) {
          const formattedDate = `${currentYear}년 ${currentMonth + 1}월 ${date}일`; // 날짜 형식 맞추기
          fetch(`http://127.0.0.1:5001/get_schedules?user=${username}&date=${encodeURIComponent(formattedDate)}`)
              .then(response => response.json())
              .then(data => {
                  if (Array.isArray(data)) {
                      listnocomplete.innerHTML = '';  // 기존 목록 비우기
                      if (data.length > 0) {
                          data.forEach(item => {
                              addScheduleToDOM(item.schedule, item.time, item.completed);
                          });
                      } else {
                          // 완료되지 않은 일정이 없으면 메시지 표시
                          listnocomplete.innerHTML = '완료되지 않은 일정이 없습니다.';  // 데이터가 없을 경우 표시
                      }
                  } else {
                      console.error('No schedules found or fetch error');
                  }
              })
              .catch(error => console.error('Fetch Error:', error));
      } else {
          console.log('No logged-in user found');
      }
  });
}

// 클릭된 날짜의 일기 데이터를 가져오는 함수
function fetchDiaryForDate(date) {
  const emotionImageMap = {
    "😊": "../static/image/행복한 표정.png",
    "😲": "../static/image/놀라운 표정.png",
    "😐": "../static/image/soso표정.png",
    "🫤": "../static/image/기분 조금 안좋은 표정.png",
    "😞": "../static/image/기분 드러운 표정.png"
  };

  getLoggedInUser().then(username => {
    if (username) {
      const formattedDate = `${currentYear}년 ${currentMonth + 1}월 ${date}일`; // 날짜 형식 맞추기
      fetch(`http://127.0.0.1:5001/get_diary?user=${username}&date=${encodeURIComponent(formattedDate)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const emotionImg = document.getElementById("emotion").querySelector("img");

          if (data.diary) {
            const emotionKey = data.emotion || "";
            // 감정에 따른 이미지 설정
            emotionImg.src = emotionImageMap[emotionKey] || "";  
            emotionImg.alt = emotionKey; // 이미지 대체 텍스트 설정

            document.querySelector(".today-text").textContent =
              data.diary.length > 10 ? data.diary.substring(0, 10) + "..." : data.diary; // 요약 표시
          } else {
            document.querySelector(".today-text").textContent = "일기가 없습니다.";
            emotionImg.src = ""; // 감정 이미지 제거
            emotionImg.alt = ""; // 대체 텍스트 제거
          }
        })
        .catch(error => console.error('Error fetching diary:', error));
    } else {
      console.log('No logged-in user found');
    }
  });
}


// 스케줄을 DOM에 추가하는 함수
function addScheduleToDOM(schedule, time, completed) {
  // 완료된 일정은 화면에 표시하지 않음
  const scheduleElement = document.createElement('div');
  scheduleElement.classList.add('schedule-item');
  scheduleElement.innerHTML = `
      <span class="schedule-time">${time}</span>
      <span class="schedule-text">${schedule}</span>
      <span class="schedule-status">${completed ? '완료' : '미완료'}</span>
  `;
  listnocomplete.appendChild(scheduleElement);
}


// 달력을 렌더링하는 함수
function renderCalendar() {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  currentMonthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;
  calendarDates.innerHTML = "";

  // 빈 날짜 (이전 달)
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyDate = document.createElement("div");
    emptyDate.classList.add("date", "empty");
    calendarDates.appendChild(emptyDate);
  }

  // 현재 달의 날짜
  for (let i = 1; i <= daysInMonth; i++) {
    const dateElement = document.createElement("div");
    dateElement.classList.add("date");
    dateElement.textContent = i;

    // 날짜 클릭 시 today에 날짜 표시
    dateElement.addEventListener("click", () => handleDateClick(i));

    calendarDates.appendChild(dateElement);
  }
}

// 클릭된 날짜를 today 요소에 표시하는 함수
// 날짜 클릭 시 오늘 날짜에 맞는 일정 불러오기
// handleDateClick 함수 수정
function handleDateClick(date) {
  const selectedDate = `${currentMonth + 1}월 ${date}일`;
  today.textContent = selectedDate;
  diaryContainer.style.display = "block";
  listnocomplete.style.display = "flex";

  fetchIncompleteSchedules(date);  // 일정 가져오기
  fetchDiaryForDate(date);  // 선택된 날짜의 일기 가져오기
}

// 이전 달 버튼 클릭 이벤트
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

// 다음 달 버튼 클릭 이벤트
nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// 초기 실행
renderCalendar();
