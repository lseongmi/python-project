const calendarDates = document.getElementById("calendarDates");
const currentMonthElement = document.getElementById("currentMonth");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const today = document.getElementById("today");
const listnocomplate = document.getElementsByClassName("listnocomplate")[0];

const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

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
function handleDateClick(date) {
  const selectedDate = `${currentMonth + 1}월 ${date}일`;
  today.textContent = selectedDate;
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
renderCalendar();

const diaryContainer = document.querySelector(".diary-container"); // 다이어리 컨테이너 선택

function handleDateClick(date) {
  const selectedDate = `${currentMonth + 1}월 ${date}일`;
  today.textContent = selectedDate;
  diaryContainer.style.display = "block"; // 날짜 클릭 시 다이어리 컨테이너 표시
}

// async function sendDataToServer(data) {
//   const url = '/main'; // 서버의 엔드포인트 URL

//   try {
//     const response = await fetch(url, {
//       method: 'POST', // HTTP 메서드
//       headers: {
//         'Content-Type': 'application/json', // 전송하는 데이터의 타입
//       },
//       body: JSON.stringify(data) // JavaScript 객체를 JSON 문자열로 변환
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
//     console.log('서버 응답:', result);
//     return result;
//   } catch (error) {
//     console.error('오류 발생:', error);
//   }
// }

// // 사용 예시
// const dataToSend = {
//   username: 'example_user',
//   email: 'user@example.com'
// };

// sendDataToServer(dataToSend);
