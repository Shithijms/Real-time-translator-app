
// script.js
let audioUrl = '';

const languageList = {
  'af': 'Afrikaans', 'sq': 'Albanian', 'ar': 'Arabic', 'hy': 'Armenian',
  'bn': 'Bengali', 'bg': 'Bulgarian', 'ca': 'Catalan', 'zh-cn': 'Chinese (Simplified)',
  'zh-tw': 'Chinese (Traditional)', 'hr': 'Croatian', 'cs': 'Czech', 'da': 'Danish',
  'nl': 'Dutch', 'en': 'English', 'et': 'Estonian', 'fi': 'Finnish', 'fr': 'French',
  'de': 'German', 'el': 'Greek', 'gu': 'Gujarati', 'hi': 'Hindi', 'hu': 'Hungarian',
  'is': 'Icelandic', 'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese', 'kn': 'Kannada',
  'ko': 'Korean', 'la': 'Latin', 'lv': 'Latvian', 'lt': 'Lithuanian', 'ms': 'Malay',
  'ml': 'Malayalam', 'mr': 'Marathi', 'ne': 'Nepali', 'no': 'Norwegian', 'fa': 'Persian',
  'pl': 'Polish', 'pt': 'Portuguese', 'pa': 'Punjabi', 'ro': 'Romanian', 'ru': 'Russian',
  'sr': 'Serbian', 'si': 'Sinhala', 'sk': 'Slovak', 'sl': 'Slovenian', 'es': 'Spanish',
  'sw': 'Swahili', 'sv': 'Swedish', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai',
  'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu', 'vi': 'Vietnamese', 'cy': 'Welsh'
};

window.onload = function () {
  const langSelect = document.getElementById('langSelect');
  for (const [code, name] of Object.entries(languageList)) {
    let opt = document.createElement('option');
    opt.value = code;
    opt.textContent = name;
    langSelect.appendChild(opt);
  }
};

function translateText() {
  const text = document.getElementById('inputText').value;
  const lang = document.getElementById('langSelect').value;

  const formData = new FormData();
  formData.append('text', text);
  formData.append('dest', lang);

  fetch('http://127.0.0.1:8000/api/translate/', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('translatedOutput').textContent = data.translated_text;
      audioUrl = `http://127.0.0.1:8000${data.audio_url}`;
      document.getElementById('playBtn').disabled = false;
    })
    .catch(() => alert('Error translating text.'));
}

function playAudio() {
  const audio = new Audio(audioUrl);
  audio.play();
}

function uploadAudio() {
  const audioInput = document.getElementById('audioFile');
  const file = audioInput.files[0];

  if (!file) {
    alert('Please select an audio file first.');
    return;
  }

  const formData = new FormData();
  formData.append('audio', file);

  fetch('http://127.0.0.1:8000/api/speech-to-text/', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('sttOutput').textContent = `You said: ${data.text}`;
    })
    .catch(() => alert('Speech-to-text failed.'));
}

function startRecording() {
  const micOutput = document.getElementById('micOutput');

  if (!navigator.mediaDevices || !window.MediaRecorder) {
    micOutput.textContent = 'Microphone not supported in your browser.';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = e => chunks.push(e.data);

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', blob, 'recording.wav');

        fetch('http://127.0.0.1:8000/api/speech-to-text/', {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(data => {
            micOutput.textContent = `You said: ${data.text}`;
          })
          .catch(() => micOutput.textContent = 'Recording upload failed.');
      };

      recorder.start();
      micOutput.textContent = 'Recording... Speak now.';

      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach(track => track.stop());
        micOutput.textContent = 'Processing...';
      }, 4000); // 4-second recording
    })
    .catch(() => {
      micOutput.textContent = 'Microphone permission denied or error.';
    });
}
