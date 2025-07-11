# --- translation/urls.py ---
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # homepage
    path('translate/', views.translate_text, name='translate'),
    path('speech-to-text/', views.speech_to_text, name='speech_to_text'),
    path('text-to-speech/', views.text_to_speech, name='text_to_speech'),
]