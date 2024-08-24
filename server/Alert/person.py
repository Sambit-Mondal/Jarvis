import cv2
import numpy as np
import time
import pyttsx3

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

def eye_aspect_ratio(eye):
    A = np.linalg.norm(np.array(eye[1]) - np.array(eye[3]))
    B = np.linalg.norm(np.array(eye[2]) - np.array(eye[0]))
    C = np.linalg.norm(np.array(eye[3]) - np.array(eye[0]))
    ear = (A + B) / (2.0 * C)
    return ear

EYE_AR_THRESH = 0.3
EYE_AR_CONSEC_FRAMES = 3
DISTRACTION_THRESH = 5

COUNTER = 0
TOTAL = 0
DISTRACTION_COUNTER = 0

def speak_distracted():
    engine = pyttsx3.init()
    engine.say("Distracted")
    engine.runAndWait()

def detect_distraction():
    global COUNTER, TOTAL, DISTRACTION_COUNTER
    
    # Start video capture
    cap = cv2.VideoCapture(0)

    start_time = time.time()
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            current_time = time.time()
            elapsed_time = current_time - start_time

            if elapsed_time >= 3:
                start_time = current_time

                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

                if len(faces) == 0:
                    DISTRACTION_COUNTER += 1
                    if DISTRACTION_COUNTER >= DISTRACTION_THRESH:
                        speak_distracted()
                else:
                    DISTRACTION_COUNTER = 0
                    for (x, y, w, h) in faces:
                        roi_gray = gray[y:y+h, x:x+w]
                        roi_color = frame[y:y+h, x:x+w]

                        eyes = eye_cascade.detectMultiScale(roi_gray)
                        if len(eyes) >= 2:
                            leftEye = eyes[0]
                            rightEye = eyes[1]

                            leftEye = [(leftEye[0], leftEye[1]), (leftEye[0] + leftEye[2], leftEye[1]),
                                       (leftEye[0], leftEye[1] + leftEye[3]), (leftEye[0] + leftEye[2], leftEye[1] + leftEye[3])]
                            rightEye = [(rightEye[0], rightEye[1]), (rightEye[0] + rightEye[2], rightEye[1]),
                                        (rightEye[0], rightEye[1] + rightEye[3]), (rightEye[0] + rightEye[2], rightEye[1] + rightEye[3])]

                            if len(leftEye) == 4 and len(rightEye) == 4:
                                leftEAR = eye_aspect_ratio(leftEye)
                                rightEAR = eye_aspect_ratio(rightEye)

                                ear = (leftEAR + rightEAR) / 2.0

                                if ear < EYE_AR_THRESH:
                                    COUNTER += 1
                                    DISTRACTION_COUNTER += 1
                                else:
                                    if COUNTER >= EYE_AR_CONSEC_FRAMES:
                                        TOTAL += 1
                                    COUNTER = 0
                                    DISTRACTION_COUNTER = 0

                                if DISTRACTION_COUNTER >= DISTRACTION_THRESH:
                                    speak_distracted()

            # Comment out or remove the following line
            # cv2.imshow("Frame", frame)
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     break
    finally:
        cap.release()
        # Only call cv2.destroyAllWindows() if available
        if hasattr(cv2, 'destroyAllWindows'):
            cv2.destroyAllWindows()

    return DISTRACTION_COUNTER >= DISTRACTION_THRESH