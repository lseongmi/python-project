from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

schedules = []  # 일정을 저장할 리스트

@app.route('/add_schedule', methods=['POST'])
def add_schedule():
    data = request.json
    schedule_text = data.get("schedule")
    time_text = data.get("time")
    completed = data.get("completed", False)
    schedules.append({"schedule": schedule_text, "time": time_text, "completed": completed})

    return jsonify({
        "schedule": schedule_text,
        "time": time_text,
        "completed": completed
    })

@app.route('/get_schedules', methods=['GET'])
def get_schedules():
    return jsonify(schedules)  # 저장된 일정 리스트 반환

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
    schedules.clear()  # 리스트 초기화
    return jsonify({"message": "All schedules have been cleared."})

if __name__ == '__main__':
    app.run(debug=True)
