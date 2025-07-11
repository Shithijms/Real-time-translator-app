# --- translation/utils/tts.py ---
from gtts import gTTS
import uuid
import os

def text_to_speech(text, lang):
    filename = f"{uuid.uuid4()}.mp3"
    path = os.path.join("media", filename)
    tts = gTTS(text, lang=lang)
    tts.save(path)
    return filename