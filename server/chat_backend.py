import os
from dotenv import load_dotenv
import pyttsx3
from groq import Groq
import pvporcupine
import struct
import pyaudio
import threading
import json
from flask import Flask, request, jsonify

load_dotenv()

key = os.getenv('API_KEY')
porcupine_access_key = os.getenv('PORCUPINE_ACCESS_KEY')

shutdown_flag = False
app = Flask(__name__)

def detect_wake_word(callback):
    porcupine = pvporcupine.create(
        access_key=porcupine_access_key,
        keywords=["jarvis"]
    )
    pa = pyaudio.PyAudio()
    audio_stream = pa.open(
        rate=porcupine.sample_rate,
        channels=1,
        format=pyaudio.paInt16,
        input=True,
        frames_per_buffer=porcupine.frame_length
    )

    print("Listening for wake word 'Jarvis'...")

    buffer = []
    while not shutdown_flag:
        pcm = audio_stream.read(porcupine.frame_length)
        pcm_unpacked = struct.unpack_from("h" * porcupine.frame_length, pcm)
        buffer.extend(pcm_unpacked)

        if len(buffer) >= porcupine.frame_length:
            frame = buffer[:porcupine.frame_length]
            buffer = buffer[porcupine.frame_length:]

            if porcupine.process(frame) >= 0:
                print("Wake word detected!")
                callback()
                break

    audio_stream.close()
    porcupine.delete()

def get_response_from_model(question):
    modified_question = f"{question}. Please limit the answer to 50 words."

    client = Groq(api_key='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')
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": modified_question}],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    response = []
    for chunk in completion:
        content = chunk.choices[0].delta.content or ""
        response.append(content)

    full_text = ''.join(response)
    return full_text

def speak_response(response_text):
    engine = pyttsx3.init()

    voices = engine.getProperty('voices')
    for voice in voices:
        if "male" in voice.name.lower():
            engine.setProperty('voice', voice.id)
            break

    engine.setProperty('rate', 180)
    engine.setProperty('volume', 1.0)
    engine.setProperty('pitch', 90)

    engine.say(response_text)
    engine.runAndWait()

def process_voice_input(transcript):
    global shutdown_flag
    if "jarvis shutdown" in transcript.lower():
        shutdown_flag = True
        return "Jarvis is shutting down."

    if transcript:
        response_text = get_response_from_model(transcript)
        speak_response(response_text)
        return response_text
    else:
        return "Sorry, I didn't catch that. Please try again."

@app.route('/voice_input', methods=['POST'])
def voice_input():
    data = request.get_json()
    transcript = data.get('transcript', '')
    response_text = process_voice_input(transcript)
    return jsonify({'response': response_text})

def start_system():
    # Start wake word detection in a separate thread
    wake_word_thread = threading.Thread(target=detect_wake_word, args=(lambda: None,))
    wake_word_thread.start()

start_system()

# if __name__ == '__main__':
#     app.run(port=5000)