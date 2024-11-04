from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# NLTK 데이터 다운로드 (필요한 경우 이 부분은 주석 처리)
# nltk.download('vader_lexicon')

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

    # 일기 요약 (첫 문장 요약)
    summary = diary_text.split('.')[0] if diary_text else "내용이 부족하여 요약할 수 없습니다."

    # 결과 응답
    result = {
        "summary": summary,
        "emotion": primary_emotion,
        "emotion_score": sentiment['compound']
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
