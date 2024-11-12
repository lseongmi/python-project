from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_cors import CORS
import json
import os

app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.secret_key = 'your_secret_key'  # 비밀 키 설정
login_manager = LoginManager(app)
login_manager.login_view = 'login'

CORS(app)  # CORS 설정

USER_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', 'userinfo.json')

@app.route('/')
@login_required
def index():
    return render_template('index.html', username=current_user.username)

@app.route('/main')
@login_required
def main():
    return render_template('main.html', username=current_user.username)

# 사용자 정보 로딩 함수
def load_users():
    if os.path.exists(USER_FILE_PATH):
        with open(USER_FILE_PATH, 'r') as file:
            return json.load(file)
    return {"users": []}

# 사용자 정보 저장 함수
def save_users(users):
    with open(USER_FILE_PATH, 'w') as file:
        json.dump(users, file)

# 사용자 클래스 정의
class User(UserMixin):
    def __init__(self, user_id, username):
        self.id = user_id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    for user in users["users"]:
        if user['user'] == user_id:
            return User(user_id=user_id, username=user['user'])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['id']
        password = request.form['password']

        users = load_users()
        for user in users["users"]:
            if user['user'] == username and user['password'] == password:
                user_obj = User(user_id=username, username=username)
                login_user(user_obj)
                return redirect(url_for('main'))

        flash('Invalid username or password', 'error')

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['id']
        password = request.form['password']

        users = load_users()
        for user in users["users"]:
            if user['user'] == username:
                flash('Username already exists', 'error')
                return redirect(url_for('signup'))

        users["users"].append({'user': username, 'password': password})
        save_users(users)

        flash('Signup successful! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/get_logged_in_user')
def get_logged_in_user():
    user = current_user.username  # 예시로 로그인된 사용자 정보 가져오기
    return jsonify({'user': user})


# /list 경로 설정 (스케줄 페이지)
@app.route('/list')
@login_required
def list_schedules():
    return render_template('list.html', username=current_user.username)

# 스케줄 추가
@app.route('/add_schedule', methods=['POST'])
@login_required
def add_schedule():
    data = request.json
    username = data.get("user")
    schedule_text = data.get("schedule")
    time_text = data.get("time")
    completed = data.get("completed", False)

    users = load_users()

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
        users["users"].append({
            "user": username,
            "schedules": [{"schedule": schedule_text, "time": time_text, "completed": completed}]
        })

    save_users(users)

    return jsonify({"schedule": schedule_text, "time": time_text, "completed": completed})

# 스케줄 조회
@app.route('/get_schedules', methods=['GET'])
@login_required
def get_schedules():
    username = request.args.get("user")
    users = load_users()
    for user in users["users"]:
        if user["user"] == username:
            return jsonify(user.get("schedules", []))
    return jsonify({"error": "User not found!"}), 404

# 스케줄 완료 처리
@app.route('/complete_schedule', methods=['POST'])
@login_required
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

    save_users(users)

    return jsonify({"message": f"Schedule '{schedule_text}' completion status updated to {completed}."})

# 모든 스케줄 삭제
@app.route('/clear_schedules', methods=['POST'])
@login_required
def clear_schedules():
    data = request.json
    username = data.get("user")

    users = load_users()
    user_found = False
    for user in users["users"]:
        if user["user"] == username:
            user_found = True
            user["schedules"] = []
            break

    if not user_found:
        return jsonify({"error": "User not found!"}), 404

    save_users(users)

    return jsonify({"message": f"All schedules for user '{username}' have been cleared."})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
