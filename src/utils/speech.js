// Text-to-speech utility using Web Speech API

// Cache voices once loaded
let cachedVoices = [];
let voicesLoaded = false;

// Preload voices (must be called early — some browsers load async)
export const loadVoices = () => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    const load = () => {
      cachedVoices = window.speechSynthesis.getVoices();
      if (cachedVoices.length > 0) {
        voicesLoaded = true;
        resolve(cachedVoices);
      }
    };

    load();

    if (!voicesLoaded) {
      window.speechSynthesis.onvoiceschanged = () => {
        load();
        resolve(cachedVoices);
      };

      // iOS Safari fallback: poll a few times since onvoiceschanged
      // doesn't always fire reliably
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        load();
        if (voicesLoaded || attempts > 10) {
          clearInterval(poll);
          resolve(cachedVoices);
        }
      }, 200);
    }
  });
};

export const speak = async (text, langCode = 'zh-HK') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Ensure voices are loaded before speaking
  if (!voicesLoaded) {
    await loadVoices();
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.8;
  utterance.pitch = 1;

  // Find the best matching voice
  const voices = cachedVoices.length > 0
    ? cachedVoices
    : window.speechSynthesis.getVoices();
  const voice = findBestVoice(voices, langCode);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  // iOS Safari requires a user gesture to start speech.
  // Calling .speak() directly from a click handler satisfies this.
  window.speechSynthesis.speak(utterance);

  // iOS Safari bug: speech can pause after ~15s. Resume workaround.
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const resumeInterval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(resumeInterval);
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  }
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
      /cantonese|hong\s*kong|\bhk\b|sinji/i.test(v.name) ||
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
