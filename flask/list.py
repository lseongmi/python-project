from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__,
            template_folder=os.path.join(os.pardir, 'templates'),  # 최상위 폴더의 'templates' 폴더 경로
            static_folder=os.path.join(os.pardir, 'static'))       # 최상위 폴더의 'static' 폴더 경로
CORS(app)

# 사용자 정보가 저장된 JSON 파일 경로
USER_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'userinfo.json')

# 사용자 정보 로딩 함수 (파일에서 사용자와 스케줄 정보 불러오기)
def load_users():
    if os.path.exists(USER_FILE_PATH):
        with open(USER_FILE_PATH, 'r') as file:
            return json.load(file)
    return {"users": []}

# 사용자 정보 저장 함수 (파일에 사용자 및 스케줄 저장)
def save_users(users):
    with open(USER_FILE_PATH, 'w') as file:
        json.dump(users, file)

# '/list' 경로로 메인 페이지 설정
@app.route('/list')
def index():
    return render_template('list.html')

# 스케줄 추가
@app.route('/add_schedule', methods=['POST'])
def add_schedule():
    data = request.json
    username = data.get("user")  # 로그인된 사용자의 이름을 가져옴
    schedule_text = data.get("schedule")
    time_text = data.get("time")
    completed = data.get("completed", False)

    users = load_users()  # 사용자 정보 불러오기

    # 해당 사용자의 스케줄을 찾기
    user_found = False
    for user in users["users"]:
        if user["user"] == username:
            user_found = True
            if "schedules" not in user:
                user["schedules"] = []
            user["schedules"].append({"schedule": schedule_text, "time": time_text, "completed": completed})
            break

    if not user_found:
        # 사용자 정보가 없으면 새로 추가
        users["users"].append({
            "user": username,
            "password": data.get("password"),  # 비밀번호도 받아서 추가
            "schedules": [{"schedule": schedule_text, "time": time_text, "completed": completed}]
        })

    save_users(users)  # 변경된 사용자 정보 저장

    return jsonify({"schedule": schedule_text, "time": time_text, "completed": completed})

# 스케줄 조회 (특정 사용자)
@app.route('/get_schedules', methods=['GET'])
def get_schedules():
    username = request.args.get("user")  # URL 쿼리로 사용자 이름을 받음
    users = load_users()
    for user in users["users"]:
        if user["user"] == username:
            return jsonify(user.get("schedules", []))
    return jsonify({"error": "User not found!"}), 404

# 스케줄 완료 처리
@app.route('/complete_schedule', methods=['POST'])
def complete_schedule():
    data = request.json
    username = data.get("user")
    schedule_text = data.get("schedule")
    completed = data.get("completed")

    users = load_users()
    user_found = False
    for user in users["users"]:
        if user["user"] == username:
            user_found = True
            for item in user.get("schedules", []):
                if item["schedule"] == schedule_text:
                    item["completed"] = completed
                    break
            break

    if not user_found:
        return jsonify({"error": "User not found!"}), 404

    save_users(users)  # 변경된 사용자 정보 저장

    return jsonify({"message": f"Schedule '{schedule_text}' completion status updated to {completed}."})

# 모든 스케줄 삭제 (특정 사용자)
@app.route('/clear_schedules', methods=['POST'])
def clear_schedules():
    data = request.json
    username = data.get("user")

    users = load_users()
    user_found = False
    for user in users["users"]:
        if user["user"] == username:
            user_found = True
            user["schedules"] = []  # 해당 사용자의 모든 스케줄 삭제
            break

    if not user_found:
        return jsonify({"error": "User not found!"}), 404

    save_users(users)  # 변경된 사용자 정보 저장

    return jsonify({"message": f"All schedules for user '{username}' have been cleared."})

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # 5001번 포트로 실행
