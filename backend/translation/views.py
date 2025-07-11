

# --- translation/views.py ---
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .utils import translator, tts, stt
import os
from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

@csrf_exempt
def translate_text(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        dest_lang = request.POST.get('dest')

        if not text or not dest_lang:
            return JsonResponse({"error": "Missing 'text' or 'dest'"}, status=400)

        translated_text = translator.translate_text(text, dest_lang)
        audio_file = tts.text_to_speech(translated_text, dest_lang)

        return JsonResponse({
            'translated_text': translated_text,
            'audio_url': f'/media/{audio_file}'
        })

    # This line handles GET or any other unsupported methods
    return JsonResponse({"error": "Only POST method allowed."}, status=405)

@csrf_exempt
def text_to_speech(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        lang = request.POST.get('lang')
        audio_file = tts.text_to_speech(text, lang)
        return JsonResponse({'audio_url': f'/media/{audio_file}'})

@csrf_exempt
def speech_to_text(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        audio_file = request.FILES['audio']
        text = stt.speech_to_text(audio_file)
        return JsonResponse({'text': text})