// Audio Engine: High-Performance Web Speech API TTS + Web Audio FX
// Guaranteed instant, synchronous playback for Tamil, English, Telugu, Kannada, and Hindi
// Eliminates network dependencies and third-party CORS blocks for 100% reliable sound

class BhashaAudio {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.audioCtx = null;
    this.speechRate = 0.85; // Natural learning speed
    this.isUnlocked = false;
    this.resumeInterval = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      this.setupAutoUnlock();
    }
  }

  setupAutoUnlock() {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    const unlock = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      this.initAudioContext();
      if (this.synth) {
        try {
          if (this.synth.paused) this.synth.resume();
          // Prime Web Speech with a silent utterance on first gesture
          const dummy = new SpeechSynthesisUtterance(' ');
          dummy.volume = 0.01;
          this.synth.speak(dummy);
        } catch (e) {}
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true, passive: true });
  }

  initAudioContext() {
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      const v = this.synth.getVoices();
      if (v && v.length > 0) {
        this.voices = v;
      }
    } catch (e) {
      this.voices = [];
    }
  }

  normalizeLangCode(langCode) {
    if (!langCode) return 'en-US';
    const l = String(langCode).trim().toLowerCase();
    if (l === 'tamil' || l === 'ta' || l.startsWith('ta')) return 'ta-IN';
    if (l === 'telugu' || l === 'te' || l.startsWith('te')) return 'te-IN';
    if (l === 'kannada' || l === 'kn' || l.startsWith('kn')) return 'kn-IN';
    if (l === 'hindi' || l === 'hi' || l.startsWith('hi')) return 'hi-IN';
    if (l === 'english' || l === 'en' || l.startsWith('en')) return 'en-US';
    return langCode;
  }

  getVoiceForLang(langCode) {
    this.loadVoices();
    if (!this.voices || this.voices.length === 0) return null;

    const code = this.normalizeLangCode(langCode);
    const prefix = code.split('-')[0].toLowerCase();

    // 1. Natural / Neural / Online / Google voices matching language prefix
    let matched = this.voices.find(v => {
      const vl = v.lang.toLowerCase();
      const vn = v.name.toLowerCase();
      const isLang = vl === code.toLowerCase() || vl.startsWith(prefix);
      return isLang && (vn.includes('natural') || vn.includes('neural') || vn.includes('online') || vn.includes('google'));
    });
    if (matched) return matched;

    // 2. Exact language locale match (e.g. ta-IN, te-IN, kn-IN, hi-IN, en-US)
    matched = this.voices.find(v => v.lang.toLowerCase() === code.toLowerCase());
    if (matched) return matched;

    // 3. Language prefix match (e.g. ta, te, kn, hi, en)
    matched = this.voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (matched) return matched;

    // 4. Voice name contains language name
    const langNames = { te: 'telugu', kn: 'kannada', hi: 'hindi', ta: 'tamil', en: 'english' };
    const targetName = langNames[prefix];
    if (targetName) {
      matched = this.voices.find(v => v.name.toLowerCase().includes(targetName));
      if (matched) return matched;
    }

    return null;
  }

  speak(text, langCode = 'en-US', phoneticFallback = '', btnEl = null, onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    // 1. Cancel previous speech cleanly
    this.stop();

    if (!text || !String(text).trim()) {
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    const cleanLang = this.normalizeLangCode(langCode);
    const voice = this.getVoiceForLang(cleanLang);
    const textToSpeak = String(text).trim();

    // 2. Resume synthesizer if paused
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
    } catch (e) {}

    // 3. Build speech utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;
    utterance.lang = cleanLang;
    if (voice) {
      utterance.voice = voice;
    }

    // Keep global reference to avoid Chromium garbage collection bug
    window._bhashaActiveUtterance = utterance;

    let isDone = false;
    const finish = () => {
      if (isDone) return;
      isDone = true;
      window._bhashaActiveUtterance = null;
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      if (btnEl) btnEl.classList.add('audio-playing');
      if (onStart) onStart();
    };

    utterance.onend = finish;

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e.error || e);
      // If native language is not installed on system and phonetic fallback is available
      if ((e.error === 'language-unavailable' || e.error === 'voice-unavailable') && phoneticFallback && phoneticFallback !== textToSpeak) {
        isDone = true;
        window._bhashaActiveUtterance = null;
        if (btnEl) btnEl.classList.remove('audio-playing');
        this.speak(phoneticFallback, 'ta-IN', '', btnEl, onStart, onEnd);
        return;
      }
      finish();
    };

    // Chromium fix: keep alive during long narrations
    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }
    this.resumeInterval = setInterval(() => {
      if (!this.synth.speaking) {
        clearInterval(this.resumeInterval);
        this.resumeInterval = null;
      } else if (this.synth.paused) {
        this.synth.resume();
      }
    }, 4000);

    // 4. Speak directly and synchronously within the user interaction
    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis speak exception:', err);
      finish();
    }
  }

  stop() {
    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }
    if (this.synth) {
      try {
        if (this.synth.speaking || this.synth.pending) {
          this.synth.cancel();
        }
      } catch (e) {}
    }
    window._bhashaActiveUtterance = null;
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.audio-playing, .active-speaking').forEach(b => {
        b.classList.remove('audio-playing');
      });
    }
  }

  setSpeed(rate) {
    this.speechRate = Math.max(0.5, Math.min(1.5, rate));
  }

  // --- Web Audio FX Synthesizer (Instant audible click feedback) ---
  playSfx(type) {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.35);
      }
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }
}

// Global Singleton Instance
if (typeof window !== 'undefined') {
  window.bhashaAudio = new BhashaAudio();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BhashaAudio;
}
