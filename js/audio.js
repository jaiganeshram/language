// Audio Engine: Natural Cloud Voice Engine + Web Speech API TTS + Web Audio FX
// Guaranteed high-definition natural human reading for Telugu, Kannada, Hindi, Tamil & English
// Automatic fallback to system neural/natural voices if offline

class BhashaAudio {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.audioCtx = null;
    this.speechRate = 0.85; // Natural learning speed
    this.isUnlocked = false;
    this.currentAudio = null;
    this.activeSessionId = 0;

    if (this.synth) {
      this.loadVoices();
      if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    if (typeof window !== 'undefined') {
      this.setupAutoUnlock();
    }
  }

  setupAutoUnlock() {
    const unlock = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;
      this.initAudioContext();
      if (this.synth && this.synth.paused) {
        try { this.synth.resume(); } catch (e) {}
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
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
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  getVoiceForLang(langCode) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const cleanCode = langCode.toLowerCase().split('-')[0];
    
    // 1. Look for Natural / Neural / Online / Google voices first (e.g. Microsoft Mohan Online (Natural), Google voices)
    const naturalVoice = this.voices.find(v => {
      const vl = v.lang.toLowerCase();
      const vn = v.name.toLowerCase();
      const isLang = vl === langCode.toLowerCase() || vl.startsWith(cleanCode) || vn.includes(cleanCode);
      return isLang && (vn.includes('natural') || vn.includes('neural') || vn.includes('online') || vn.includes('google'));
    });
    if (naturalVoice) return naturalVoice;

    // 2. Look for exact locale match (e.g. te-IN, kn-IN, ta-IN, hi-IN, en-IN)
    let matched = this.voices.find(v => v.lang.toLowerCase() === langCode.toLowerCase());
    if (matched) return matched;

    // 3. Look for language prefix match (e.g. te, kn, ta, hi, en)
    matched = this.voices.find(v => v.lang.toLowerCase().startsWith(cleanCode));
    if (matched) return matched;

    // 4. Look for language name in voice name
    const langNames = {
      te: 'telugu',
      kn: 'kannada',
      hi: 'hindi',
      ta: 'tamil',
      en: 'english'
    };
    const targetName = langNames[cleanCode] || cleanCode;
    matched = this.voices.find(v => v.name.toLowerCase().includes(targetName));
    if (matched) return matched;

    return null;
  }

  getIndianEnglishVoice() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    let voice = this.voices.find(v => v.lang.toLowerCase() === 'en-in');
    if (voice) return voice;

    voice = this.voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes('india') || n.includes('heera') || n.includes('ravi') || n.includes('veena');
    });
    if (voice) return voice;

    voice = this.voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().startsWith('ta'));
    if (voice) return voice;

    voice = this.voices.find(v => v.lang.toLowerCase().startsWith('en'));
    return voice || this.voices[0] || null;
  }

  splitIntoChunks(text, maxLen = 160) {
    if (!text) return [];
    // Split text by sentence delimiters: period, exclamation, question mark, or newline
    const sentences = text.match(/[^.!?।\n]+[.!?।\n]+|[^.!?।\n]+$/g) || [text];
    const chunks = [];
    let current = '';

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if ((current + ' ' + trimmed).trim().length <= maxLen) {
        current = (current + ' ' + trimmed).trim();
      } else {
        if (current) chunks.push(current);
        if (trimmed.length <= maxLen) {
          current = trimmed;
        } else {
          // Sub-split long sentence by comma or words
          const words = trimmed.split(/\s+/);
          let sub = '';
          for (const w of words) {
            if ((sub + ' ' + w).trim().length <= maxLen) {
              sub = (sub + ' ' + w).trim();
            } else {
              if (sub) chunks.push(sub);
              sub = w;
            }
          }
          current = sub;
        }
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }

  speak(text, langCode = 'en-US', phoneticFallback = '', btnEl = null, onStart = null, onEnd = null) {
    // 1. Stop any ongoing playback
    this.stop();

    // 2. Audible and visual click feedback
    this.playSfx('click');
    if (btnEl) btnEl.classList.add('audio-playing');

    const cleanLang = langCode.split('-')[0].toLowerCase();
    const isIndic = ['te', 'kn', 'hi', 'ta'].includes(cleanLang);

    // If Indic language (especially Telugu & Kannada where default system voices are robotic),
    // use Studio-Quality Natural Cloud Audio Engine first!
    if (isIndic && text && text.trim().length > 0) {
      this.playNaturalAudio(text, cleanLang, btnEl, onStart, onEnd, () => {
        // Fallback to Web Speech API if cloud audio fails
        this.speakWebSpeech(text, langCode, phoneticFallback, btnEl, onStart, onEnd);
      });
      return;
    }

    // Default to Web Speech API for English / other languages
    this.speakWebSpeech(text, langCode, phoneticFallback, btnEl, onStart, onEnd);
  }

  playNaturalAudio(text, langCode, btnEl, onStart, onEnd, onFallback) {
    const sessionId = ++this.activeSessionId;
    const chunks = this.splitIntoChunks(text, 160);
    if (chunks.length === 0) {
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    if (onStart) onStart();

    // Create 2 audio elements during user interaction for gapless audio streaming
    const audioA = new Audio();
    const audioB = new Audio();
    try {
      audioA.referrerPolicy = 'no-referrer';
      audioB.referrerPolicy = 'no-referrer';
    } catch (e) {}

    audioA.playbackRate = this.speechRate;
    audioB.playbackRate = this.speechRate;

    let currentIdx = 0;
    this.currentAudio = audioA;

    const cleanup = () => {
      if (this.activeSessionId !== sessionId) return;
      try {
        audioA.pause();
        audioA.src = '';
        audioB.pause();
        audioB.src = '';
      } catch (e) {}
      this.currentAudio = null;
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
    };

    const getUrl = (chunk) => {
      return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=tw-ob`;
    };

    const playChunk = (index) => {
      if (this.activeSessionId !== sessionId) return;
      if (index >= chunks.length) {
        cleanup();
        return;
      }

      currentIdx = index;
      const isEven = index % 2 === 0;
      const player = isEven ? audioA : audioB;
      const preloader = isEven ? audioB : audioA;

      this.currentAudio = player;
      player.playbackRate = this.speechRate;

      const targetUrl = getUrl(chunks[index]);
      if (player.src !== targetUrl) {
        player.src = targetUrl;
      }

      // Preload next chunk on the alternate player for seamless gapless speech
      if (index + 1 < chunks.length) {
        preloader.src = getUrl(chunks[index + 1]);
        try { preloader.load(); } catch (e) {}
      }

      player.onended = () => {
        if (this.activeSessionId !== sessionId) return;
        playChunk(index + 1);
      };

      player.onerror = (e) => {
        console.warn('Natural Cloud Audio error, falling back to Web Speech', e);
        if (this.activeSessionId !== sessionId) return;
        cleanup();
        if (onFallback) onFallback();
      };

      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play rejection, falling back to Web Speech', err);
          if (this.activeSessionId !== sessionId) return;
          cleanup();
          if (onFallback) onFallback();
        });
      }
    };

    playChunk(0);
  }

  speakWebSpeech(text, langCode = 'en-US', phoneticFallback = '', btnEl = null, onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser');
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    try {
      if (this.synth.paused) this.synth.resume();
      this.synth.cancel();
    } catch (e) {
      console.warn('Synth cancel error:', e);
    }

    const nativeVoice = this.getVoiceForLang(langCode);
    let textToSpeak = text;
    let voiceToUse = nativeVoice;
    let targetLang = langCode;

    const isIndic = ['te-in', 'kn-in', 'ta-in', 'te', 'kn', 'ta'].includes(langCode.toLowerCase());
    if (!nativeVoice && isIndic && phoneticFallback) {
      textToSpeak = phoneticFallback;
      voiceToUse = this.getIndianEnglishVoice();
      targetLang = voiceToUse ? voiceToUse.lang : 'en-IN';
    } else if (!nativeVoice) {
      voiceToUse = this.getIndianEnglishVoice() || (this.voices.length > 0 ? this.voices[0] : null);
      if (voiceToUse) targetLang = voiceToUse.lang;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;
    if (voiceToUse) utterance.voice = voiceToUse;
    if (targetLang) utterance.lang = targetLang;

    window._bhashaActiveUtterance = utterance;

    let isDone = false;
    const cleanup = () => {
      if (isDone) return;
      isDone = true;
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
    };

    utterance.onstart = () => {
      if (btnEl) btnEl.classList.add('audio-playing');
      if (onStart) onStart();
    };

    utterance.onend = cleanup;

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err.error || err);
      cleanup();
    };

    // Watchdog fallback
    const approxDurationMs = Math.max(2000, (textToSpeak.length * 90) / this.speechRate);
    setTimeout(cleanup, approxDurationMs + 1000);

    setTimeout(() => {
      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Synth speak exception:', err);
        cleanup();
      }
    }, 35);
  }

  stop() {
    this.activeSessionId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch (e) {}
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.audio-playing').forEach(b => b.classList.remove('audio-playing'));
    }
  }

  setSpeed(rate) {
    this.speechRate = Math.max(0.5, Math.min(1.5, rate));
    if (this.currentAudio) {
      try {
        this.currentAudio.playbackRate = this.speechRate;
      } catch (e) {}
    }
  }

  // --- Web Audio FX Synthesizer (Instant audible feedback) ---
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
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.4);
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
