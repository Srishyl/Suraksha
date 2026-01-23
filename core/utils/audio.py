import speech_recognition as sr
import soundfile as sf
import numpy as np
import logging
from config import config

logger = logging.getLogger(__name__)

RISK_KEYWORDS = config.RISK_KEYWORDS

def process_audio_for_keywords(audio_path: str):
    recognizer = sr.Recognizer()
    found = []

    try:
        with sr.AudioFile(audio_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio).lower()

            for k in RISK_KEYWORDS:
                if k in text:
                    found.append(k)

        return found
    except Exception as e:
        logger.error(e)
        return []

def detect_scream(audio_path: str):
    try:
        data, sr_rate = sf.read(audio_path)

        if len(data.shape) > 1:
            data = np.mean(data, axis=1)

        energy = np.sum(data ** 2) / len(data)
        return energy > 0.02
    except Exception:
        return False
