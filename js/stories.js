// Stories Application Controller
// 15-Line Simple Stories in Tamil, English, Telugu, Kannada, and Hindi
// Features Separate Language Panels, Full Story Audio Playback & Two-Table System

class StoriesApp {
  constructor() {
    this.selectedStory = 'all';
    this.searchQuery = '';
    this.viewMode = 'parallel'; // 'parallel' | 'single'
    this.readerLang = 'telugu'; // 'tamil' | 'english' | 'telugu' | 'kannada' | 'hindi'
    this.mode = 'to-learn'; // 'to-learn' | 'read'
    this.audioSpeed = 0.85;
    this.theme = localStorage.getItem('bhasha_theme') || 'dark';

    // Auto audio playback state
    this.isPlayingStory = false;
    this.playIndex = 0;
    this.currentPlayLines = [];
    this.playTimeout = null;

    // Load persisted read stories from localStorage
    try {
      const saved = localStorage.getItem('bhasha_read_stories');
      this.readItems = new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      this.readItems = new Set();
    }

    this.storyPills = [
      { id: 'all', label: '📌 அனைத்துக் கதைகளும்' },
      ...STORIES_DATA.map(s => ({ id: s.id, label: `${s.icon} ${s.title}` }))
    ];
  }

  init() {
    this.applyTheme(this.theme);
    this.setupEventListeners();
    this.renderStorySelector();
    this.updateCounts();
    this.renderStories();
  }

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('bhasha_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = theme === 'dark' ? '☀️ பகல் முறை' : '🌙 இரவு முறை';
    }
  }

  toggleTheme() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    window.bhashaAudio.playSfx('click');
  }

  setupEventListeners() {
    const searchInput = document.getElementById('story-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderStories();
      });
    }

    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        this.audioSpeed = parseFloat(e.target.value);
        window.bhashaAudio.setSpeed(this.audioSpeed);
      });
    }
  }

  renderStorySelector() {
    const container = document.getElementById('story-selector-bar');
    if (!container) return;

    container.innerHTML = this.storyPills.map(s => `
      <button class="cat-filter-btn ${this.selectedStory === s.id ? 'active' : ''}" 
              onclick="window.storyApp.filterStory('${s.id}')">
        ${s.label}
      </button>
    `).join('');
  }

  filterStory(storyId) {
    this.selectedStory = storyId;
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');
    this.renderStorySelector();
    this.renderStories();
  }

  speak(text, langCode, phoneticFallback = '', btnEl = null) {
    window.bhashaAudio.speak(text, langCode, phoneticFallback, btnEl);
  }

  switchMode(mode) {
    this.mode = mode;
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');

    const toLearnTab = document.getElementById('tab-to-learn');
    const readTab = document.getElementById('tab-read');
    const readActions = document.getElementById('read-mode-actions');

    if (toLearnTab) toLearnTab.classList.toggle('active', mode === 'to-learn');
    if (readTab) readTab.classList.toggle('active', mode === 'read');
    if (readActions) readActions.style.display = mode === 'read' ? 'block' : 'none';

    this.renderStories();
  }

  switchView(view) {
    this.viewMode = view;
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');

    const parallelBtn = document.getElementById('view-parallel');
    const tabsBtn = document.getElementById('view-tabs');
    const langFilter = document.getElementById('story-lang-filter');

    if (parallelBtn) parallelBtn.classList.toggle('active', view === 'parallel');
    if (tabsBtn) tabsBtn.classList.toggle('active', view === 'single');
    if (langFilter) langFilter.style.display = view === 'single' ? 'flex' : 'none';

    this.renderStories();
  }

  selectReaderLang(lang) {
    this.readerLang = lang;
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');

    const buttons = document.querySelectorAll('.lang-pill-btn');
    buttons.forEach(btn => {
      const isMatch = btn.getAttribute('onclick').includes(`'${lang}'`);
      btn.classList.toggle('active', isMatch);
    });

    this.renderStories();
  }

  updateCounts() {
    const unreadEl = document.getElementById('unread-count');
    const readEl = document.getElementById('read-count');
    const totalBadgeEl = document.getElementById('total-story-badge');
    const totalStories = STORIES_DATA.length;
    const totalLines = STORIES_DATA.reduce((acc, s) => acc + (s.lines ? s.lines.length : 0), 0);
    const totalRead = this.readItems.size;
    const totalUnread = totalStories - totalRead;

    if (unreadEl) unreadEl.textContent = totalUnread;
    if (readEl) readEl.textContent = totalRead;
    if (totalBadgeEl) {
      totalBadgeEl.textContent = `${totalStories} சிறுகதைகள் | ${totalLines} வாக்கியங்கள்`;
    }
  }

  markStoryRead(storyId, btnEl) {
    const story = STORIES_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.story-main-card');
      if (card) card.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('success');
    this.readItems.add(storyId);
    this.persistReadItems();
    this.showToast(`✅ "${story.title}" -> Read!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderStories();
    }, 220);
  }

  markStoryUnread(storyId, btnEl) {
    const story = STORIES_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.story-main-card');
      if (card) card.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('click');
    this.readItems.delete(storyId);
    this.persistReadItems();
    this.showToast(`↩️ "${story.title}" -> To Learn!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderStories();
    }, 220);
  }

  resetAllRead() {
    if (this.readItems.size === 0) {
      this.showToast('படித்தவை பட்டியல் ஏற்கனவே காலியாக உள்ளது.');
      return;
    }
    if (confirm('படித்த அனைத்துக் கதைகளையும் மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்ற விரும்புகிறீர்களா?')) {
      this.readItems.clear();
      this.persistReadItems();
      window.bhashaAudio.playSfx('click');
      this.showToast('🔄 அனைத்துக் கதைகளும் மீண்டும் சேர்க்கப்பட்டன!');
      this.updateCounts();
      this.renderStories();
    }
  }

  persistReadItems() {
    try {
      localStorage.setItem('bhasha_read_stories', JSON.stringify(Array.from(this.readItems)));
    } catch (e) {
      console.warn('Could not save read stories to localStorage', e);
    }
  }

  showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  // Sequential Story Audio Player
  playStoryAudio() {
    const langSelect = document.getElementById('auto-audio-lang');
    const targetLang = langSelect ? langSelect.value : 'te-IN';

    // Find stories to play
    let targetStories = STORIES_DATA.filter(s => {
      const isRead = this.readItems.has(s.id);
      return this.mode === 'read' ? isRead : !isRead;
    });

    if (this.selectedStory !== 'all') {
      targetStories = targetStories.filter(s => s.id === this.selectedStory);
    }

    if (targetStories.length === 0) {
      this.showToast('ஒலி கேட்க கதைகள் எதுவும் கிடைக்கவில்லை.');
      return;
    }

    const currentStory = targetStories[0];
    this.currentPlayLines = currentStory.lines;
    this.isPlayingStory = true;
    this.playIndex = 0;

    const playBtn = document.getElementById('btn-play-story');
    const stopBtn = document.getElementById('btn-stop-story');
    if (playBtn) playBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'inline-flex';

    this.showToast(`🎧 "${currentStory.title}" ஒலி வடிவம் தொடங்குகிறது...`);
    this.playNextLine(targetLang);
  }

  playNextLine(targetLang) {
    if (!this.isPlayingStory || this.playIndex >= this.currentPlayLines.length) {
      this.stopStoryAudio();
      this.showToast('🎉 கதை ஒலி வடிவம் நிறைவடைந்தது!');
      return;
    }

    const line = this.currentPlayLines[this.playIndex];

    // Highlight active playing line card in DOM
    document.querySelectorAll('.story-line-card').forEach(c => c.classList.remove('line-playing-active'));
    const lineCard = document.getElementById(`line-card-${this.playIndex + 1}`);
    if (lineCard) {
      lineCard.classList.add('line-playing-active');
      lineCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    let speechText = '';
    if (targetLang === 'te-IN') speechText = line.teluguScript;
    else if (targetLang === 'kn-IN') speechText = line.kannadaScript;
    else if (targetLang === 'hi-IN') speechText = line.hindiScript;
    else if (targetLang === 'ta-IN') speechText = line.tamil;
    else if (targetLang === 'en-US') speechText = line.english;

    window.bhashaAudio.speak(speechText, targetLang);

    // Estimate line duration based on character count and speed
    const durationMs = Math.max(2500, (speechText.length * 85) / this.audioSpeed);

    this.playTimeout = setTimeout(() => {
      this.playIndex++;
      this.playNextLine(targetLang);
    }, durationMs);
  }

  stopStoryAudio() {
    this.isPlayingStory = false;
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    document.querySelectorAll('.story-line-card').forEach(c => c.classList.remove('line-playing-active'));

    const playBtn = document.getElementById('btn-play-story');
    const stopBtn = document.getElementById('btn-stop-story');
    if (playBtn) playBtn.style.display = 'inline-flex';
    if (stopBtn) stopBtn.style.display = 'none';
  }

  renderStories() {
    const wrapper = document.getElementById('stories-wrapper');
    const badge = document.getElementById('total-story-badge');
    if (!wrapper) return;

    this.updateCounts();
    const isReadMode = this.mode === 'read';
    const totalStories = STORIES_DATA.length;

    // Filter stories by mode (To-Learn vs Read)
    let filteredStories = STORIES_DATA.filter(story => {
      const isRead = this.readItems.has(story.id);
      return isReadMode ? isRead : !isRead;
    });

    // Filter by story pill
    if (this.selectedStory !== 'all') {
      filteredStories = filteredStories.filter(s => s.id === this.selectedStory);
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filteredStories = filteredStories.filter(s => {
        const matchesTitle = s.title.toLowerCase().includes(q) || s.titleEn.toLowerCase().includes(q);
        const matchesMoral = s.moralTa.toLowerCase().includes(q) || s.moralEn.toLowerCase().includes(q);
        const matchesLine = s.lines.some(l => 
          l.tamil.toLowerCase().includes(q) ||
          l.english.toLowerCase().includes(q) ||
          l.teluguSpeak.toLowerCase().includes(q) ||
          l.teluguSub.toLowerCase().includes(q) ||
          l.kannadaSpeak.toLowerCase().includes(q) ||
          l.kannadaSub.toLowerCase().includes(q) ||
          l.hindiSpeak.toLowerCase().includes(q) ||
          l.hindiSub.toLowerCase().includes(q)
        );
        return matchesTitle || matchesMoral || matchesLine;
      });
    }

    let totalLinesCount = 0;
    filteredStories.forEach(s => totalLinesCount += s.lines.length);

    if (badge) {
      const totalInMode = isReadMode ? this.readItems.size : (totalStories - this.readItems.size);
      badge.innerHTML = isReadMode
        ? `படித்தவை: <strong>${filteredStories.length}</strong> / ${totalInMode} கதைகள் (${totalLinesCount} வரிகள்)`
        : `படிக்க வேண்டியவை: <strong>${filteredStories.length}</strong> / ${totalInMode} கதைகள் (${totalLinesCount} வரிகள்)`;
    }

    if (filteredStories.length === 0) {
      if (!isReadMode) {
        const allCompleted = this.readItems.size === totalStories;
        wrapper.innerHTML = `
          <div class="empty-table-state" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 3rem 1.5rem; text-align: center; border: 1px solid var(--border-color);">
            <div class="empty-text">
              ${allCompleted 
                ? '🎉 வாழ்த்துகள்! அனைத்துக் கதைகளையும் படித்து முடித்துவிட்டீர்கள்!' 
                : '🔍 தேடலுக்குப் பொருத்தமான கதைகள் எதுவும் கிடைக்கவில்லை.'}
            </div>
            ${allCompleted 
              ? `<button class="btn btn-sm btn-outline mt-2" onclick="window.storyApp.switchMode('read')">
                   ✅ படித்தவை அட்டவணையைக் காண்க
                 </button>`
              : `<button class="btn btn-sm btn-outline mt-2" onclick="window.storyApp.filterStory('all'); document.getElementById('story-search').value=''; window.storyApp.searchQuery=''; window.storyApp.renderStories();">
                   அனைத்துக் கதைகளையும் காட்டு
                 </button>`
            }
          </div>
        `;
      } else {
        const noReadYet = this.readItems.size === 0;
        wrapper.innerHTML = `
          <div class="empty-table-state" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 3rem 1.5rem; text-align: center; border: 1px solid var(--border-color);">
            <div class="empty-text">
              ${noReadYet 
                ? '📖 படித்தவை பட்டியல் காலியாக உள்ளது.' 
                : '🔍 தேடலுக்குப் பொருத்தமான படித்த கதைகள் இல்லை.'}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
              ${noReadYet 
                ? "'படிக்க வேண்டியவை' அட்டவணையில் உள்ள கதைத் தலைப்பில் உள்ள 'Read' பொத்தானை அழுத்தினால், அந்தக் கதை இங்கு வந்து சேரும்." 
                : 'தேடல் சொல்லை மாற்றிப் பார்க்கவும்.'}
            </p>
            ${noReadYet ? `
              <button class="btn btn-sm btn-outline" onclick="window.storyApp.switchMode('to-learn')">
                👈 படிக்க வேண்டியவை பகுதிக்குச் செல்
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="document.getElementById('story-search').value=''; window.storyApp.searchQuery=''; window.storyApp.renderStories();">
                அனைத்துப் படித்த கதைகளையும் காட்டு
              </button>
            `}
          </div>
        `;
      }
      return;
    }

    wrapper.innerHTML = filteredStories.map(story => `
      <article class="story-main-card" id="story-${story.id}">
        <!-- Story Top Header Card -->
        <div class="convo-header-card story-banner-card">
          <div class="convo-header-top-row">
            <div class="convo-title-wrap">
              <span class="convo-icon-pill">${story.icon}</span>
              <div>
                <h2 class="convo-title-ta">${story.title}</h2>
                <span class="convo-title-en">${story.titleEn} (15 Lines)</span>
              </div>
            </div>

            <!-- Read Button for Entire Story -->
            <div class="convo-header-actions">
              ${isReadMode ? `
                <button class="btn-read-action btn-unmark-read convo-btn-action" onclick="window.storyApp.markStoryUnread('${story.id}', this)" title="மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்று">
                  Undo
                </button>
              ` : `
                <button class="btn-read-action btn-mark-read convo-btn-action" onclick="window.storyApp.markStoryRead('${story.id}', this)" title="இந்தக் கதையைப் படித்ததாகக் குறி">
                  Read
                </button>
              `}
            </div>
          </div>

          <!-- Moral Banner -->
          <div class="story-moral-wrap">
            <span class="moral-tag">💡 கதை நீதி:</span>
            <span class="moral-text-ta">${story.moralTa}</span>
            <span class="moral-text-en">(${story.moralEn})</span>
          </div>
        </div>

        <!-- Story Content (Parallel 5 Panels vs Single Reader) -->
        <div class="story-body-wrap">
          ${this.viewMode === 'parallel' 
            ? this.renderParallelPanels(story) 
            : this.renderSingleLanguageReader(story)}
        </div>
      </article>
    `).join('');
  }

  // Render 5 Separate Panels for each line
  renderParallelPanels(story) {
    const esc = (str) => (str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '');

    return `
      <div class="story-lines-container">
        ${story.lines.map(line => {
          const safeTa = esc(line.tamil);
          const safeEn = esc(line.english);
          const safeTe = esc(line.teluguScript);
          const safeTeSub = esc(line.teluguSub);
          const safeKn = esc(line.kannadaScript);
          const safeKnSub = esc(line.kannadaSub);
          const safeHi = esc(line.hindiScript);
          const safeHiSub = esc(line.hindiSub);

          return `
          <div class="story-line-card" id="line-card-${line.lineNum}">
            <div class="line-header-row">
              <span class="line-num-badge">வரி ${line.lineNum} / 15</span>
            </div>

            <!-- 5 Separate Language Panels Grid -->
            <div class="story-panels-grid">
              <!-- Panel 1: தமிழ் (Tamil) -->
              <div class="story-lang-panel panel-tamil">
                <div class="panel-lang-header">
                  <span class="panel-pill pill-ta">தமிழ்</span>
                  <button class="table-audio-btn btn-ta" onclick="window.storyApp.speak('${safeTa}', 'ta-IN', '${safeTa}', this)" title="தமிழ் ஒலி">
                    🔊
                  </button>
                </div>
                <div class="panel-body-text tamil-font-bold">
                  ${line.tamil}
                </div>
              </div>

              <!-- Panel 2: ஆங்கிலம் (English) -->
              <div class="story-lang-panel panel-english">
                <div class="panel-lang-header">
                  <span class="panel-pill pill-en">English</span>
                  <button class="table-audio-btn btn-en" onclick="window.storyApp.speak('${safeEn}', 'en-US', '${safeEn}', this)" title="English Audio">
                    🔊
                  </button>
                </div>
                <div class="panel-body-text english-font-style">
                  ${line.english}
                </div>
              </div>

              <!-- Panel 3: தெலுங்கு (Telugu) -->
              <div class="story-lang-panel panel-telugu">
                <div class="panel-lang-header">
                  <span class="panel-pill pill-te">தெலுங்கு</span>
                  <button class="table-audio-btn btn-te" onclick="window.storyApp.speak('${safeTe}', 'te-IN', '${safeTeSub}', this)" title="தெலுங்கு ஒலி">
                    🔊
                  </button>
                </div>
                <div class="panel-body-text">
                  <div class="speak-tamil-bold">${line.teluguSpeak}</div>
                  <div class="phonetic-sub">(${line.teluguSub})</div>
                </div>
              </div>

              <!-- Panel 4: கன்னடம் (Kannada) -->
              <div class="story-lang-panel panel-kannada">
                <div class="panel-lang-header">
                  <span class="panel-pill pill-kn">கன்னடம்</span>
                  <button class="table-audio-btn btn-kn" onclick="window.storyApp.speak('${safeKn}', 'kn-IN', '${safeKnSub}', this)" title="கன்னட ஒலி">
                    🔊
                  </button>
                </div>
                <div class="panel-body-text">
                  <div class="speak-tamil-bold">${line.kannadaSpeak}</div>
                  <div class="phonetic-sub">(${line.kannadaSub})</div>
                </div>
              </div>

              <!-- Panel 5: இந்தி (Hindi) -->
              <div class="story-lang-panel panel-hindi">
                <div class="panel-lang-header">
                  <span class="panel-pill pill-hi">இந்தி</span>
                  <button class="table-audio-btn btn-hi" onclick="window.storyApp.speak('${safeHi}', 'hi-IN', '${safeHiSub}', this)" title="இந்தி ஒலி">
                    🔊
                  </button>
                </div>
                <div class="panel-body-text">
                  <div class="speak-tamil-bold">${line.hindiSpeak}</div>
                  <div class="phonetic-sub">(${line.hindiSub})</div>
                </div>
              </div>
            </div>
          </div>
        `;}).join('')}
      </div>
    `;
  }

  // Render Single Language Reader
  renderSingleLanguageReader(story) {
    const esc = (str) => (str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '');
    const lang = this.readerLang;
    const langConfig = {
      tamil: { title: 'தமிழ் வழிக் கதை (Tamil Story)', pill: 'pill-ta', tag: 'தமிழ்' },
      english: { title: 'English Story Reader', pill: 'pill-en', tag: 'English' },
      telugu: { title: 'தெலுங்கில் கதை (Telugu in Tamil Phonetics)', pill: 'pill-te', tag: 'தெலுங்கு' },
      kannada: { title: 'கன்னடத்தில் கதை (Kannada in Tamil Phonetics)', pill: 'pill-kn', tag: 'கன்னடம்' },
      hindi: { title: 'இந்தியில் கதை (Hindi in Tamil Phonetics)', pill: 'pill-hi', tag: 'இந்தி' }
    };

    const config = langConfig[lang] || langConfig.telugu;

    return `
      <div class="single-story-reader-card">
        <div class="single-reader-header">
          <span class="panel-pill ${config.pill}">${config.tag}</span>
          <h3 class="single-reader-title">${config.title}</h3>
        </div>

        <div class="single-reader-lines-list">
          ${story.lines.map(line => {
            let primaryText = '';
            let subText = '';
            let audioAction = null;

            if (lang === 'tamil') {
              primaryText = line.tamil;
              subText = line.english;
              audioAction = `window.storyApp.speak('${esc(line.tamil)}', 'ta-IN', '${esc(line.tamil)}', this)`;
            } else if (lang === 'english') {
              primaryText = line.english;
              subText = line.tamil;
              audioAction = `window.storyApp.speak('${esc(line.english)}', 'en-US', '${esc(line.english)}', this)`;
            } else if (lang === 'telugu') {
              primaryText = line.teluguSpeak;
              subText = `${line.tamil} | (${line.teluguSub})`;
              audioAction = `window.storyApp.speak('${esc(line.teluguScript)}', 'te-IN', '${esc(line.teluguSub)}', this)`;
            } else if (lang === 'kannada') {
              primaryText = line.kannadaSpeak;
              subText = `${line.tamil} | (${line.kannadaSub})`;
              audioAction = `window.storyApp.speak('${esc(line.kannadaScript)}', 'kn-IN', '${esc(line.kannadaSub)}', this)`;
            } else if (lang === 'hindi') {
              primaryText = line.hindiSpeak;
              subText = `${line.tamil} | (${line.hindiSub})`;
              audioAction = `window.storyApp.speak('${esc(line.hindiScript)}', 'hi-IN', '${esc(line.hindiSub)}', this)`;
            }

            return `
              <div class="single-line-item" id="line-card-${line.lineNum}">
                <div class="single-line-index">${line.lineNum}</div>
                <div class="single-line-content">
                  <div class="single-primary-phrase">${primaryText}</div>
                  <div class="single-sub-phrase">${subText}</div>
                </div>
                ${audioAction ? `
                  <button class="table-audio-btn btn-${lang.slice(0, 2)}" onclick="${audioAction}" title="ஒலி">
                    🔊
                  </button>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

// Global initialization
window.storyApp = new StoriesApp();
document.addEventListener('DOMContentLoaded', () => {
  window.storyApp.init();
});
