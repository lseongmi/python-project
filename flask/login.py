from flask import Flask, render_template, redirect, url_for, request, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import json
import os

# Flask 애플리케이션 생성 (템플릿 폴더와 정적 파일 폴더 경로 지정)
app = Flask(__name__, template_folder='../templates', static_folder='../static')
app.secret_key = 'your_secret_key'  # 비밀 키 설정 (세션을 위해 필요)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# 사용자 정보 로딩
def load_users():
    with open('../userinfo.json', 'r') as file:  # 경로 수정
        data = json.load(file)
    return data["users"]

# 사용자 클래스를 정의
class User(UserMixin):
    def __init__(self, user_id, username):
        self.id = user_id
        self.username = username

@login_manager.user_loader
def load_user(user_id):
    users = load_users()
    for user in users:
        if user['user'] == user_id:
            return User(user_id=user_id, username=user['user'])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['id']
        password = request.form['password']

        users = load_users()
        for user in users:
            if user['user'] == username and user['password'] == password:
                user_obj = User(user_id=username, username=username)
                login_user(user_obj)
                return redirect(url_for('index'))
        
        flash('Invalid username or password', 'error')

    return render_template('login.html')  # 템플릿 경로는 기본값인 templates 폴더

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['id']
        password = request.form['password']

        users = load_users()
        for user in users:
            if user['user'] == username:
                flash('Username already exists', 'error')
                return redirect(url_for('signup'))

        # 새 사용자 정보 저장
        users.append({'user': username, 'password': password})
        with open('../userinfo.json', 'w') as file:  # 경로 수정
            json.dump({"users": users}, file)

        flash('Signup successful! Please log in.', 'success')
        return redirect(url_for('login'))  # 로그인 페이지로 리다이렉트

    return render_template('signup.html')  # 템플릿 경로는 기본값인 templates 폴더

@app.route('/index')
@login_required
def index():
    return render_template('index.html', username=current_user.username)  # 템플릿 경로는 기본값인 templates 폴더

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
