from flask import Flask, request, jsonify
from pymongo import MongoClient
from marshmallow import Schema, fields, ValidationError
from datetime import datetime
from flask_cors import CORS
import threading
from flask_socketio import SocketIO, emit
from chat_backend import start_system, process_voice_input
from Alert.person import detect_distraction
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173")

client = MongoClient(os.getenv('mongodb+srv://jarvis:jarvis123@jarvis-cluster.7afrxiy.mongodb.net/?retryWrites=true&w=majority&appName=Jarvis-Cluster'))
db = client['statusCode']
session_collection = db['session']

class SessionSchema(Schema):
    startTime = fields.String(required=True)
    endTime = fields.String(required=True)
    totalTime = fields.String(required=False)
    date = fields.String(required=False)
    userId = fields.String(required=True)

session_schema = SessionSchema()

@app.route('/session', methods=['POST'])
def create_session():
    data = request.json
    try:
        validated_data = session_schema.load(data)
        if not validated_data.get('date'):
            validated_data['date'] = datetime.today().strftime('%Y-%m-%d')
        start_time = datetime.strptime(validated_data['startTime'], '%H:%M:%S')
        end_time = datetime.strptime(validated_data['endTime'], '%H:%M:%S')
        total_duration = end_time - start_time
        validated_data['totalTime'] = str(total_duration)
        session_collection.insert_one(validated_data)
        return jsonify({"message": "Session created successfully!"}), 201
    except ValidationError as err:
        return jsonify(err.messages), 400

@app.route('/session', methods=['GET'])
def get_sessions():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'error': 'userId parameter is required'}), 400
    
    sessions = list(session_collection.find({'userId': user_id}))
    for session in sessions:
        session['_id'] = str(session['_id'])
    return jsonify(sessions), 200

@app.route('/detect_distraction', methods=['GET'])
def detect_distraction_route():
    try:
        is_distracted = detect_distraction()  # Call your detection function here
        print("Distraction Status:", is_distracted)
        return jsonify({"distracted": is_distracted})
    except Exception as e:
        print(f"Error in detecting distraction: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return 'Flask app is running'

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('user_voice_input')
def handle_user_voice_input(json):
    transcript = json['transcript']
    response_text = process_voice_input(transcript)
    emit('python_response', {'text': response_text})

def start_person_detection():
    try:
        detect_distraction()
    except Exception as e:
        print(f"Error in person detection: {e}")

def start_chat_backend():
    try:
        start_system()
    except Exception as e:
        print(f"Error in chat backend: {e}")

if __name__ == '__main__':
    # Start the chat_backend and person detection in separate threads
    chat_backend_thread = threading.Thread(target=start_chat_backend)
    person_detection_thread = threading.Thread(target=start_person_detection)

    chat_backend_thread.start()
    person_detection_thread.start()

    # Run the Flask server using socketio
    socketio.run(app, '0.0.0.0', debug=True)