// Text-to-speech utility using Web Speech API

// Cache voices once loaded
let cachedVoices = [];
let voicesLoaded = false;
let activeResumeInterval = null;

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
    return;
  }

  // Ensure voices are loaded before speaking
  if (!voicesLoaded) {
    await loadVoices();
  }

  // Cancel any ongoing speech and clear previous interval
  cancelSpeech();

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

  window.speechSynthesis.speak(utterance);

  // iOS Safari bug: speech can pause after ~15s. Resume workaround.
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    activeResumeInterval = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(activeResumeInterval);
        activeResumeInterval = null;
      } else {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);
  }
};

export const cancelSpeech = () => {
  if (activeResumeInterval) {
    clearInterval(activeResumeInterval);
    activeResumeInterval = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

function findBestVoice(voices, langCode) {
  if (!voices.length) return null;

  // For Cantonese (zh-HK), be very specific to avoid Mandarin voices
  if (langCode === 'zh-HK') {
    const exact = voices.find(v => v.lang === 'zh-HK');
    if (exact) return exact;

    const underscore = voices.find(v => v.lang === 'zh_HK');
    if (underscore) return underscore;

    const named = voices.find(v =>
      /cantonese|hong\s*kong|\bhk\b|sinji/i.test(v.name) ||
      /cantonese|hong\s*kong|\bhk\b/i.test(v.lang)
    );
    if (named) return named;

    const yue = voices.find(v => v.lang.startsWith('yue'));
    if (yue) return yue;

    const hantHK = voices.find(v => v.lang.includes('Hant') && v.lang.includes('HK'));
    if (hantHK) return hantHK;

    const anyHK = voices.find(v => v.lang.startsWith('zh-HK') || v.lang.startsWith('zh_HK'));
    if (anyHK) return anyHK;

    // Do NOT fall back to generic zh (usually Mandarin)
    return null;
  }

  const exact = voices.find(v => v.lang === langCode);
  if (exact) return exact;

  return voices.find(v => v.lang.startsWith(langCode)) || null;
}
