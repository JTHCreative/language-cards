// Text-to-speech utility using Web Speech API
export const speak = (text, langCode = 'zh-HK') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.8; // Slightly slower for learning
  utterance.pitch = 1;

  // Find the best matching voice, prioritizing exact Cantonese matches
  const voices = window.speechSynthesis.getVoices();
  const voice = findBestVoice(voices, langCode);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang; // Ensure lang matches the selected voice
  }

  window.speechSynthesis.speak(utterance);
};

function findBestVoice(voices, langCode) {
  if (!voices.length) return null;

  // For Cantonese (zh-HK), be very specific to avoid Mandarin voices
  if (langCode === 'zh-HK') {
    // 1. Exact zh-HK match
    const exactHK = voices.find(v => v.lang === 'zh-HK');
    if (exactHK) return exactHK;

    // 2. Match zh_HK (underscore variant used by some browsers)
    const underscoreHK = voices.find(v => v.lang === 'zh_HK');
    if (underscoreHK) return underscoreHK;

    // 3. Look for voices with "Cantonese" or "HK" or "Hong Kong" in the name
    const cantoneseNamed = voices.find(v =>
      /cantonese|hong\s*kong|\bhk\b/i.test(v.name) ||
      /cantonese|hong\s*kong|\bhk\b/i.test(v.lang)
    );
    if (cantoneseNamed) return cantoneseNamed;

    // 4. Try yue (ISO 639-3 for Cantonese, used by some systems)
    const yue = voices.find(v => v.lang.startsWith('yue'));
    if (yue) return yue;

    // 5. zh-Hant-HK (traditional Chinese HK)
    const hantHK = voices.find(v => v.lang.includes('Hant') && v.lang.includes('HK'));
    if (hantHK) return hantHK;

    // 6. Last resort: any zh-HK starting match
    const anyHK = voices.find(v => v.lang.startsWith('zh-HK') || v.lang.startsWith('zh_HK'));
    if (anyHK) return anyHK;

    // Do NOT fall back to generic zh (which is usually Mandarin)
    return null;
  }

  // For other languages, do simple matching
  const exact = voices.find(v => v.lang === langCode);
  if (exact) return exact;

  const prefix = voices.find(v => v.lang.startsWith(langCode));
  if (prefix) return prefix;

  return null;
}

// Preload voices (some browsers need this)
export const loadVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};
