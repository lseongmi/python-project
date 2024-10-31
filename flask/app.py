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
    primary_emotion = 'neutral'  # 기본 감정
    if sentiment['compound'] >= 0.05:
        primary_emotion = 'joy'
    elif sentiment['compound'] <= -0.05:
        primary_emotion = 'sadness'

    # 요약 (간단한 예시)
    summary = diary_text[:50] + '...'  # 첫 50자 요약

    # 결과 응답
    result = {
        "summary": summary,
        "emotion": primary_emotion,
        "emotion_score": sentiment['compound']
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)  
