from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)  # Flask 애플리케이션 인스턴스 생성
CORS(app)  # CORS 활성화, 다른 출처의 요청 허용

schedules = []  # 일정을 저장할 리스트

@app.route('/add_schedule', methods=['POST'])  # '/add_schedule' 경로에 POST 요청 처리
def add_schedule():
    data = request.json  # 요청의 JSON 데이터 가져오기
    schedule_text = data.get("schedule")  # 일정 텍스트 가져오기
    time_text = data.get("time")  # 시간 텍스트 가져오기
    completed = data.get("completed", False)  # 완료 상태 가져오기, 기본값은 False
    schedules.append({"schedule": schedule_text, "time": time_text, "completed": completed})  # 일정 추가

    return jsonify({  # 추가된 일정 정보를 JSON으로 반환
        "schedule": schedule_text,
        "time": time_text,
        "completed": completed
    })

@app.route('/get_schedules', methods=['GET'])  # '/get_schedules' 경로에 GET 요청 처리
def get_schedules():
    return jsonify(schedules)  # 저장된 일정 리스트를 JSON으로 반환

@app.route('/complete_schedule', methods=['POST'])  # '/complete_schedule' 경로에 POST 요청 처리
def complete_schedule():
    data = request.json  # 요청의 JSON 데이터 가져오기
    schedule_text = data.get("schedule")  # 일정 텍스트 가져오기
    completed = data.get("completed")  # 완료 상태 가져오기

    for item in schedules:  # 저장된 일정 리스트를 순회
        if item["schedule"] == schedule_text:  # 일정 텍스트가 일치하는 경우
            item["completed"] = completed  # 완료 상태 업데이트
            break  # 루프 종료

    return jsonify({"message": f"Schedule '{schedule_text}' completion status updated to {completed}."})  # 업데이트 메시지 반환

@app.route('/clear_schedules', methods=['POST'])  # '/clear_schedules' 경로에 POST 요청 처리
def clear_schedules():
    schedules.clear()  # 리스트 초기화 (모든 일정 삭제)
    return jsonify({"message": "All schedules have been cleared."})  # 초기화 완료 메시지 반환

if __name__ == '__main__':
    app.run(debug=True)  # 디버그 모드에서 Flask 서버 실행
