// Interactive 3D Flashcards Engine for BhashaTamil
// 100% Pure Tamil Script Display - No foreign script reading required!

class FlashcardsEngine {
  constructor() {
    this.deck = [];
    this.currentIndex = 0;
    this.isFlipped = false;
    this.masteredCount = 0;
    this.currentLang = 'all';

    this.container = document.getElementById('flashcards-container');
  }

  init(deckData, lang = 'all') {
    this.deck = [...deckData];
    this.currentLang = lang;
    this.currentIndex = 0;
    this.isFlipped = false;
    this.render();
  }

  shuffle() {
    window.bhashaAudio.playSfx('flip');
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    this.currentIndex = 0;
    this.isFlipped = false;
    this.render();
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    window.bhashaAudio.playSfx('flip');
    const cardInner = document.getElementById('fc-card-inner');
    if (cardInner) {
      if (this.isFlipped) {
        cardInner.classList.add('is-flipped');
      } else {
        cardInner.classList.remove('is-flipped');
      }
    }
  }

  next() {
    if (this.deck.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.deck.length;
    this.isFlipped = false;
    window.bhashaAudio.playSfx('click');
    this.render();
  }

  prev() {
    if (this.deck.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.deck.length) % this.deck.length;
    this.isFlipped = false;
    window.bhashaAudio.playSfx('click');
    this.render();
  }

  markMastered() {
    window.bhashaAudio.playSfx('correct');
    window.bhashaApp.incrementMastered();
    this.next();
  }

  speakCurrent(lang, text) {
    const speechCodes = {
      telugu: 'te-IN',
      kannada: 'kn-IN',
      hindi: 'hi-IN',
      tamil: 'ta-IN'
    };
    const code = speechCodes[lang] || 'hi-IN';
    window.bhashaAudio.speak(text, code);
  }

  render() {
    if (!this.container) return;
    if (this.deck.length === 0) {
      this.container.innerHTML = `<div class="empty-state">அட்டைகள் எதுவும் இல்லை.</div>`;
      return;
    }

    const item = this.deck[this.currentIndex];
    const total = this.deck.length;
    const current = this.currentIndex + 1;

    let frontHtml = '';
    let backHtml = '';

    if (item.telugu && item.kannada && item.hindi) {
      // Comparative card: Front has Tamil meaning, Back has how to speak in 3 languages in Tamil letters!
      frontHtml = `
        <div class="fc-badge">தமிழ் வாக்கியம்</div>
        <div class="fc-primary-word">${item.tamil}</div>
        <div class="fc-sub-word">${item.tamilPhonetic}</div>
        <div class="fc-meaning-en">"${item.english}"</div>
        <div class="fc-flip-hint">👆 கிளிக் செய்து 3 மொழிகளிலும் பேசும் முறையைப் பார்க்கவும்</div>
      `;

      backHtml = `
        <div class="fc-badge-back">3 மொழிகளிலும் தமிழில் பேசும் முறை</div>

        <div class="fc-lang-row fc-lang-te">
          <div class="fc-lang-label">தெலுங்கு:</div>
          <div class="fc-lang-content">
            <span class="fc-tamil-speak">${item.telugu.tamilTranslit}</span>
            <span class="fc-translit-sub">(${item.telugu.phonetic})</span>
            <button class="fc-speak-btn" onclick="event.stopPropagation(); window.flashcardsEngine.speakCurrent('telugu', '${item.telugu.script}')" title="உச்சரிப்பைக் கேள்">🔊</button>
          </div>
        </div>

        <div class="fc-lang-row fc-lang-kn">
          <div class="fc-lang-label">கன்னடம்:</div>
          <div class="fc-lang-content">
            <span class="fc-tamil-speak">${item.kannada.tamilTranslit}</span>
            <span class="fc-translit-sub">(${item.kannada.phonetic})</span>
            <button class="fc-speak-btn" onclick="event.stopPropagation(); window.flashcardsEngine.speakCurrent('kannada', '${item.kannada.script}')" title="உச்சரிப்பைக் கேள்">🔊</button>
          </div>
        </div>

        <div class="fc-lang-row fc-lang-hi">
          <div class="fc-lang-label">இந்தி:</div>
          <div class="fc-lang-content">
            <span class="fc-tamil-speak">${item.hindi.tamilTranslit}</span>
            <span class="fc-translit-sub">(${item.hindi.phonetic})</span>
            <button class="fc-speak-btn" onclick="event.stopPropagation(); window.flashcardsEngine.speakCurrent('hindi', '${item.hindi.script}')" title="உச்சரிப்பைக் கேள்">🔊</button>
          </div>
        </div>
      `;
    } else {
      // Single language course card
      const langName = item.langName || 'Target Language';
      frontHtml = `
        <div class="fc-badge">தமிழ் அர்த்தம்</div>
        <div class="fc-primary-word">${item.tamil}</div>
        <div class="fc-flip-hint">👆 கிளிக் செய்து ${langName}வில் எப்படிப் பேசுவது என்று பார்க்கவும்</div>
      `;

      backHtml = `
        <div class="fc-badge-back">${langName}வில் பேச:</div>
        <div class="fc-primary-word fc-speak-bold">${item.speakInTamil || item.tamilTranslit}</div>
        <div class="fc-phonetic-en">(${item.phonetic})</div>
        <button class="btn btn-audio-card" onclick="event.stopPropagation(); window.flashcardsEngine.speakCurrent('${item.langKey}', '${item.script}')">
          🔊 உச்சரிப்பைக் கேள்
        </button>
        ${item.tip ? `<div class="fc-tip-box mt-3">💡 ${item.tip}</div>` : ''}
      `;
    }

    this.container.innerHTML = `
      <div class="fc-header">
        <div class="fc-counter">கார்டு ${current} / ${total}</div>
        <div class="fc-progress-bar">
          <div class="fc-progress-fill" style="width: ${(current / total) * 100}%"></div>
        </div>
        <button class="btn btn-sm btn-ghost" onclick="window.flashcardsEngine.shuffle()">🔀 கலைத்துப் போடு</button>
      </div>

      <div class="fc-stage" onclick="window.flashcardsEngine.flip()">
        <div class="fc-card ${this.isFlipped ? 'is-flipped' : ''}" id="fc-card-inner">
          <div class="fc-face fc-front">
            ${frontHtml}
          </div>
          <div class="fc-face fc-back">
            ${backHtml}
          </div>
        </div>
      </div>

      <div class="fc-controls">
        <button class="btn btn-outline" onclick="window.flashcardsEngine.prev()" title="முந்தைய சொல்">
          ◀ முந்தையது
        </button>
        <button class="btn btn-primary" onclick="window.flashcardsEngine.flip()">
          🔄 திரும்பு
        </button>
        <button class="btn btn-success" onclick="window.flashcardsEngine.markMastered()" title="நன்கு பழகியது!">
          ✓ கற்றுக்கொண்டேன்
        </button>
        <button class="btn btn-outline" onclick="window.flashcardsEngine.next()" title="அடுத்த சொல்">
          அடுத்தது ▶
        </button>
      </div>
    `;
  }
}

window.flashcardsEngine = new FlashcardsEngine();
