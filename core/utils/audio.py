import speech_recognition as sr
import soundfile as sf
import numpy as np
import logging
from config import config
from pydub import AudioSegment

logger = logging.getLogger(__name__)

RISK_KEYWORDS = config.RISK_KEYWORDS

def detect_risk_level_from_audio(audio_path: str) -> str:
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio).lower()

            for word in RISK_KEYWORDS["high"]:
                if word in text:
                    return "HIGH"

            for word in RISK_KEYWORDS["medium"]:
                if word in text:
                    return "MEDIUM"

    except Exception as e:
        logger.warning(f"Risk detection skipped: {e}")

    return "LOW"


# def detect_scream(audio_path: str):
#     try:
#         data, sr_rate = sf.read(audio_path)

#         if len(data.shape) > 1:
#             data = np.mean(data, axis=1)

#         energy = np.sum(data ** 2) / len(data)
#         return energy > 0.02
#     except Exception:
#         return False
    
def detect_scream(audio_path: str) -> bool:
    try:
        data, sr_rate = sf.read(audio_path)

        if len(data.shape) > 1:
            data = np.mean(data, axis=1)

        energy = np.sum(data ** 2) / len(data)
        return bool(energy > 0.02)  # 👈 IMPORTANT
    except Exception:
        return False


def calculate_final_risk(audio_path: str) -> str:
    risk = detect_risk_level_from_audio(audio_path)

    try:
        if detect_scream(audio_path):
            return "HIGH"
    except:
        pass

    return risk




