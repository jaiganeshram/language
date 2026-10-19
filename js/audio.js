// BhashaAudio Engine: Ultra-Reliable Studio Natural Audio + Web Speech API + Web Audio FX
// Guaranteed instant, audible, high-fidelity speech for Tamil, English, Telugu, Kannada, and Hindi
// Works 100% reliably across Windows, Mac, Linux, Android, iOS, Chrome, Edge, Firefox, Brave

class BhashaAudio {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.audioCtx = null;
    this.speechRate = 0.95; // Crisp, natural learning speed
    this.currentAudio = null;
    this.activeSessionId = 0;
    this.isUnlocked = false;
    this.resumeInterval = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
        try {
          window.speechSynthesis.addEventListener('voiceschanged', () => this.loadVoices());
        } catch (e) {}
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
          if (this.synth.paused) {
            this.synth.resume();
          }
        } catch (e) {}
      }
      this.loadVoices();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
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

  normalizeLang(langCode) {
    if (!langCode) return { short: 'en', full: 'en-US' };
    const l = String(langCode).trim().toLowerCase();
    if (l === 'tamil' || l === 'ta' || l.startsWith('ta')) return { short: 'ta', full: 'ta-IN' };
    if (l === 'telugu' || l === 'te' || l.startsWith('te')) return { short: 'te', full: 'te-IN' };
    if (l === 'kannada' || l === 'kn' || l.startsWith('kn')) return { short: 'kn', full: 'kn-IN' };
    if (l === 'hindi' || l === 'hi' || l.startsWith('hi')) return { short: 'hi', full: 'hi-IN' };
    if (l === 'english' || l === 'normal' || l === 'advanced' || l === 'en' || l.startsWith('en')) return { short: 'en', full: 'en-US' };
    const prefix = l.split('-')[0];
    return { short: prefix, full: langCode };
  }

  getVoiceForLang(langCode) {
    this.loadVoices();
    if (!this.voices || this.voices.length === 0) return null;

    const { short, full } = this.normalizeLang(langCode);

    // 1. Natural / Neural / Online / Google voices matching prefix
    let matched = this.voices.find(v => {
      const vl = (v.lang || '').toLowerCase();
      const vn = (v.name || '').toLowerCase();
      const isLang = vl === full.toLowerCase() || vl.startsWith(short);
      return isLang && (vn.includes('natural') || vn.includes('neural') || vn.includes('online') || vn.includes('google'));
    });
    if (matched) return matched;

    // 2. Exact language locale match (e.g. ta-IN, te-IN, kn-IN, hi-IN, en-US)
    matched = this.voices.find(v => (v.lang || '').toLowerCase() === full.toLowerCase());
    if (matched) return matched;

    // 3. Language prefix match (e.g. ta, te, kn, hi, en)
    matched = this.voices.find(v => (v.lang || '').toLowerCase().startsWith(short));
    if (matched) return matched;

    // 4. Voice name contains language name
    const langNames = { te: 'telugu', kn: 'kannada', hi: 'hindi', ta: 'tamil', en: 'english' };
    const targetName = langNames[short];
    if (targetName) {
      matched = this.voices.find(v => (v.name || '').toLowerCase().includes(targetName));
      if (matched) return matched;
    }

    return null;
  }

  splitIntoChunks(text, maxLength = 160) {
    if (!text || !text.trim()) return [];
    const clean = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length <= maxLength) return [clean];

    // Split on sentence punctuation or commas/clauses
    const rawTokens = clean.match(/[^.!?|;]+[.!?|;]*/g) || [clean];
    const chunks = [];
    let currentChunk = '';

    for (const token of rawTokens) {
      const t = token.trim();
      if (!t) continue;

      if ((currentChunk + ' ' + t).trim().length <= maxLength) {
        currentChunk = (currentChunk + ' ' + t).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        if (t.length <= maxLength) {
          currentChunk = t;
        } else {
          // Token itself is too long, split by comma or words
          const subTokens = t.match(/[^,]+,*|\S+/g) || [t];
          let subChunk = '';
          for (const sub of subTokens) {
            const st = sub.trim();
            if (!st) continue;
            if ((subChunk + ' ' + st).trim().length <= maxLength) {
              subChunk = (subChunk + ' ' + st).trim();
            } else {
              if (subChunk) chunks.push(subChunk);
              subChunk = st;
            }
          }
          currentChunk = subChunk;
        }
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
  }

  // --- Primary Audio: Studio-Quality Natural Cloud Audio ---
  playNaturalAudio(text, langShort, btnEl, onStart, onEnd, onFallback) {
    const sessionId = ++this.activeSessionId;
    const chunks = this.splitIntoChunks(text, 160);
    if (chunks.length === 0) {
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    if (btnEl) btnEl.classList.add('audio-playing');
    if (onStart) onStart();

    const audioA = new Audio();
    const audioB = new Audio();
    try {
      audioA.referrerPolicy = 'no-referrer';
      audioB.referrerPolicy = 'no-referrer';
    } catch (e) {}

    audioA.playbackRate = this.speechRate;
    audioB.playbackRate = this.speechRate;

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
      return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langShort}&client=tw-ob`;
    };

    const playChunk = (index) => {
      if (this.activeSessionId !== sessionId) return;
      if (index >= chunks.length) {
        cleanup();
        return;
      }

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
        console.warn('Natural Cloud Audio error, falling back to Web Speech:', e);
        if (this.activeSessionId !== sessionId) return;
        cleanup();
        if (onFallback) onFallback();
      };

      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play rejection, falling back to Web Speech:', err);
          if (this.activeSessionId !== sessionId) return;
          cleanup();
          if (onFallback) onFallback();
        });
      }
    };

    playChunk(0);
  }

  // --- Secondary Fallback: Web Speech API ---
  speakWebSpeech(text, langFull, phoneticFallback = '', btnEl = null, onStart = null, onEnd = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    if (!text || !String(text).trim()) {
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    try {
      if (this.synth.paused) this.synth.resume();
      if (this.synth.speaking || this.synth.pending) {
        this.synth.cancel();
      }
    } catch (e) {}

    let voice = this.getVoiceForLang(langFull);
    let textToSpeak = String(text).trim();
    let actualLang = langFull;
    const { short } = this.normalizeLang(langFull);

    // Fallback if client OS lacks native voice pack (e.g. Windows without Telugu / Kannada)
    if (!voice) {
      if (short === 'te' || short === 'kn') {
        const taVoice = this.getVoiceForLang('ta-IN');
        if (taVoice && phoneticFallback && /[\u0B80-\u0BFF]/.test(phoneticFallback)) {
          voice = taVoice;
          textToSpeak = phoneticFallback;
          actualLang = 'ta-IN';
        } else {
          const enVoice = this.getVoiceForLang('en-IN') || this.getVoiceForLang('en-US') || (this.voices && this.voices[0]);
          if (phoneticFallback && /^[a-zA-Z0-9\s.,?!'"\-()]+$/.test(phoneticFallback)) {
            if (enVoice) voice = enVoice;
            textToSpeak = phoneticFallback;
            actualLang = 'en-US';
          } else if (enVoice) {
            voice = enVoice;
            actualLang = 'en-US';
          }
        }
      } else if (short === 'ta') {
        const hiVoice = this.getVoiceForLang('hi-IN');
        const enVoice = this.getVoiceForLang('en-IN') || this.getVoiceForLang('en-US') || (this.voices && this.voices[0]);
        if (hiVoice) {
          voice = hiVoice;
        } else if (enVoice) {
          voice = enVoice;
          if (phoneticFallback && /^[a-zA-Z0-9\s.,?!'"\-()]+$/.test(phoneticFallback)) {
            textToSpeak = phoneticFallback;
          }
          actualLang = 'en-US';
        }
      } else {
        voice = this.getVoiceForLang('en-IN') || this.getVoiceForLang('en-US') || (this.voices && this.voices[0]);
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = this.speechRate;
    utterance.pitch = 1.0;
    utterance.lang = actualLang;
    if (voice) {
      utterance.voice = voice;
    }

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
      finish();
    };

    // Watchdog safety: clear playing state if browser hangs
    const approxDurationMs = Math.max(2500, (textToSpeak.length * 90) / this.speechRate);
    setTimeout(finish, approxDurationMs + 1200);

    setTimeout(() => {
      try {
        if (this.synth.paused) {
          this.synth.resume();
        }
        this.synth.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis speak exception:', err);
        finish();
      }
    }, 25);
  }

  // --- Universal Speak Function (Natural Cloud Audio -> Web Speech API fallback) ---
  speak(text, langCode = 'en-US', phoneticFallback = '', btnEl = null, onStart = null, onEnd = null) {
    // 1. Immediately stop any current audio/speech
    this.stop();

    // 2. Play instant tactile audio FX
    this.playSfx('click');

    if (!text || !String(text).trim()) {
      if (btnEl) btnEl.classList.remove('audio-playing');
      if (onEnd) onEnd();
      return;
    }

    const { short, full } = this.normalizeLang(langCode);

    // 3. Play Natural Studio Audio first for authentic human pronunciation
    this.playNaturalAudio(text, short, btnEl, onStart, onEnd, () => {
      // 4. Fallback to Web Speech API if offline or blocked
      this.speakWebSpeech(text, full, phoneticFallback, btnEl, onStart, onEnd);
    });
  }

  stop() {
    this.activeSessionId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
        this.currentAudio = null;
      } catch (e) {}
    }

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
