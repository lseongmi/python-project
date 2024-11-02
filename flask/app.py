from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# NLTK 데이터 다운로드
nltk.download('vader_lexicon')

app = Flask(__name__)
CORS(app)  # CORS 설정

# 감정 분석 초기화
sia = SentimentIntensityAnalyzer()

@app.route('/process_diary', methods=['POST'])
def process_diary():
    data = request.json
    diary_text = data.get("diary")

    # 감정 분석
    sentiment = sia.polarity_scores(diary_text)
    primary_emotion = 'neutral'  # 기본 감정 설정
    if sentiment['compound'] >= 0.05:
        primary_emotion = 'joy'
    elif sentiment['compound'] <= -0.05:
        primary_emotion = 'sadness'

    # 일기 요약 (한 줄 요약 예시: 가장 긴 문장을 요약으로 사용)
    sentences = nltk.sent_tokenize(diary_text)
    summary = max(sentences, key=len) if sentences else "내용이 부족하여 요약할 수 없습니다."

    # 결과 응답
    result = {
        "summary": summary,
        "emotion": primary_emotion,
        "emotion_score": sentiment['compound']
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
