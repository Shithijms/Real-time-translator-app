# --- translation/utils/translator.py ---
from googletrans import Translator as GoogleTranslator

translator = GoogleTranslator()

def translate_text(text, dest_lang):
    result = translator.translate(text, dest=dest_lang)
    return result.text