import json
from flask import Flask, render_template, request, redirect, url_for, session
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'
login_manager = LoginManager()
login_manager.init_app(app)

USER_DATA_FILE = 'user_data.json'


# 사용자 데이터를 JSON 파일에서 로드하는 함수
def load_user_data():
    if os.path.exists(USER_DATA_FILE):
        with open(USER_DATA_FILE, 'r') as file:
            return json.load(file)
    return {}


# 사용자 데이터를 JSON 파일에 저장하는 함수
def save_user_data(data):
    with open(USER_DATA_FILE, 'w') as file:
        json.dump(data, file)


# User 클래스를 UserMixin과 함께 정의합니다.
class User(UserMixin):
    def __init__(self, userid, userpassword, userlist=None, userdinary=None):
        self.id = userid
        self.password_hash = userpassword
        self.userlist = userlist if userlist else []
        self.userdinary = userdinary if userdinary else {}

    @classmethod
    def get(cls, userid):
        users = load_user_data()
        user_data = users.get(userid)
        if user_data:
            return cls(userid, user_data['userpassword'], user_data['userlist'], user_data['userdinary'])
        return None

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)


# 로그인 시 필요한 사용자 로드 함수
@login_manager.user_loader
def load_user(userid):
    return User.get(userid)


# 로그인 페이지 렌더링
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        userid = request.form['userid']
        password = request.form['password']
        user = User.get(userid)

        if user and user.verify_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            return "Invalid credentials", 401
    return render_template('login.html')


# 회원가입 처리
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        userid = request.form['userid']
        password = request.form['password']
        users = load_user_data()

        if userid in users:
            return "User already exists", 400

        users[userid] = {
            "userpassword": generate_password_hash(password),
            "userlist": [],
            "userdinary": {}
        }
        save_user_data(users)
        return redirect(url_for('login'))
    return render_template('register.html')


# 대시보드 페이지
@app.route('/dashboard')
@login_required
def dashboard():
    return f"Welcome, {current_user.id}! This is your dashboard."


# 로그아웃
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
