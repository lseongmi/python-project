from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os

app = Flask(__name__,
            template_folder=os.path.join(os.pardir, 'templates'),  # 최상위 폴더의 'templates' 폴더 경로
            static_folder=os.path.join(os.pardir, 'static'))      # 최상위 폴더의 'static' 폴더 경로
CORS(app)

schedules = []

@app.route('/')
def index():
    return render_template('list.html')

@app.route('/add_schedule', methods=['POST'])
def add_schedule():
    data = request.json
    schedule_text = data.get("schedule")
    time_text = data.get("time")
    completed = data.get("completed", False)
    schedules.append({"schedule": schedule_text, "time": time_text, "completed": completed})
    return jsonify({"schedule": schedule_text, "time": time_text, "completed": completed})

@app.route('/get_schedules', methods=['GET'])
def get_schedules():
    return jsonify(schedules)

@app.route('/complete_schedule', methods=['POST'])
def complete_schedule():
    data = request.json
    schedule_text = data.get("schedule")
    completed = data.get("completed")
    for item in schedules:
        if item["schedule"] == schedule_text:
            item["completed"] = completed
            break
    return jsonify({"message": f"Schedule '{schedule_text}' completion status updated to {completed}."})

@app.route('/clear_schedules', methods=['POST'])
def clear_schedules():
    schedules.clear()
    return jsonify({"message": "All schedules have been cleared."})

if __name__ == '__main__':
    app.run(debug=True)
