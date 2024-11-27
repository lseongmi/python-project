document.addEventListener('DOMContentLoaded', async () => {
    const emotionSummaryContainer = document.querySelector('.emotion-summary');
    const summaryContainer = document.querySelector('.diary-summary');

    // 현재 로그인된 사용자 정보 가져오기
    async function fetchCurrentUser() {
        try {
            const response = await fetch('http://127.0.0.1:5001/get_logged_in_user');
            if (!response.ok) throw new Error('Failed to fetch user data');
            const result = await response.json();
            return result.user;
        } catch (error) {
            console.error('Error fetching logged-in user:', error);
            return null;
        }
    }

    // 해당 사용자의 최신 일기 가져오기
    async function fetchLatestDiary(username) {
        try {
            const response = await fetch('http://127.0.0.1:5001/get_user_diaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: username }),
            });
            if (!response.ok) throw new Error('Failed to fetch diary data');
            const result = await response.json();
            const diaries = result.diaries || [];

            // 최신 일기 데이터 반환 (없으면 null)
            return diaries.length > 0 ? diaries[diaries.length - 1] : null;
        } catch (error) {
            console.error('Error fetching diaries:', error);
            return null;
        }
    }

    // 감정에 따른 메시지
    function getEmotionMessage(emotion) {
        const messages = {
            "😊": "오늘 하루는 정말 행복한 날이었군요!",
            "😲": "오늘 하루는 놀라운 일이 있었네요!",
            "😐": "오늘은 무난한 하루였군요. 평온한 하루를 보내셨길 바라요.",
            "😞": "오늘 하루는 좋지 않은 하루였군요! 힘든 하루였겠어요.",
            "😡": "오늘은 최악의 날이었군요. 진정할 시간이 필요하겠어요.",
        };

        return messages[emotion] || "오늘 하루의 감정을 파악할 수 없어요.";
    }

    // 초기화 함수
    async function initializeSummary() {
        const username = await fetchCurrentUser();
        if (!username) {
            summaryContainer.textContent = '로그인 정보를 확인할 수 없습니다.';
            emotionSummaryContainer.textContent = '감정 요약을 표시할 수 없습니다.';
            return;
        }

        const latestDiary = await fetchLatestDiary(username);
        if (latestDiary) {
            const { diary, emotion } = latestDiary;

            // 최신 일기와 감정 요약 표시
            summaryContainer.textContent = diary || '일기 데이터가 없습니다.';
            emotionSummaryContainer.textContent = getEmotionMessage(emotion);
        } else {
            summaryContainer.textContent = '저장된 일기가 없습니다.';
            emotionSummaryContainer.textContent = '감정 데이터가 없습니다.';
        }
    }

    // 실행
    initializeSummary();
});
