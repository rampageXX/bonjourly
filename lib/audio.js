let _voices = [];
let _voicesLoaded = false;

function loadVoices() {
  _voices = speechSynthesis.getVoices();
  _voicesLoaded = _voices.length > 0;
}

if (typeof speechSynthesis !== 'undefined') {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

function getFrenchVoice() {
  // Prefer fr-FR, fall back to any French voice
  return _voices.find(v => v.lang === 'fr-FR')
      || _voices.find(v => v.lang.startsWith('fr'))
      || null;
}

function speak(text, onEnd) {
  if (typeof speechSynthesis === 'undefined') {
    if (onEnd) onEnd();
    return;
  }
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'fr-FR';
  utter.rate = 0.88;
  utter.pitch = 1;
  const voice = getFrenchVoice();
  if (voice) utter.voice = voice;
  if (onEnd) utter.onend = onEnd;
  speechSynthesis.speak(utter);
}

function hasFrenchVoice() {
  return getFrenchVoice() !== null;
}
