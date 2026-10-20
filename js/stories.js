// Stories Application Controller
// Simple multilingual stories in Tamil, English, Telugu, Kannada, and Hindi
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

    // Lightbox Split Reader state
    this.currentLightboxStoryId = null;
    this.currentLightboxLang = 'english';
    this.isLightboxOpen = false;
    this.isLightboxFooterCollapsed = true;
    this.isLightboxPlaying = false;
    this.lightboxPlayLang = 'en-US';
    this.lightboxPlayIndex = 0;
    this.lightboxPlayTimeout = null;

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
            <div class="convo-title-wrap" style="cursor: pointer;" onclick="window.storyApp.openLightbox('${story.id}')" title="ஒப்பீட்டு திரையில் கதையைப் படிக்க (Click to open Split Reader)">
              <span class="convo-icon-pill">${story.icon}</span>
              <div>
                <h2 class="convo-title-ta">${story.title}</h2>
                <span class="convo-title-en">${story.titleEn} (${story.lines.length} Lines)</span>
              </div>
            </div>

            <!-- Header Actions -->
            <div class="convo-header-actions">
              <button class="btn-view-action convo-btn-action" onclick="window.storyApp.openLightbox('${story.id}')" title="ஒப்பீட்டு வாசிப்பு முறை (Side-by-Side Lightbox View)">
                👁️ View (ஒப்பீடு)
              </button>
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
          const safeTeSpeak = esc(line.teluguSpeak);
          const safeKn = esc(line.kannadaScript);
          const safeKnSub = esc(line.kannadaSub);
          const safeKnSpeak = esc(line.kannadaSpeak);
          const safeHi = esc(line.hindiScript);
          const safeHiSub = esc(line.hindiSub);
          const safeHiSpeak = esc(line.hindiSpeak);

          return `
          <div class="story-line-card" id="line-card-${line.lineNum}">
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
                  <button class="table-audio-btn btn-te" onclick="window.storyApp.speak('${safeTe}', 'te-IN', '${safeTeSpeak}', this)" title="தெலுங்கு ஒலி">
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
                  <button class="table-audio-btn btn-kn" onclick="window.storyApp.speak('${safeKn}', 'kn-IN', '${safeKnSpeak}', this)" title="கன்னட ஒலி">
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
                  <button class="table-audio-btn btn-hi" onclick="window.storyApp.speak('${safeHi}', 'hi-IN', '${safeHiSpeak}', this)" title="இந்தி ஒலி">
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

  // ==========================================
  // Lightbox Modal Comparison & Line-by-Line Viewer Methods
  // ==========================================
  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  escapeAudio(str) {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

  openSelectedLightbox() {
    let targetId = this.selectedStory !== 'all' ? this.selectedStory : null;
    if (!targetId) {
      const available = this.mode === 'read'
        ? STORIES_DATA.filter(s => this.readItems.has(s.id))
        : STORIES_DATA.filter(s => !this.readItems.has(s.id));
      targetId = (available[0] || STORIES_DATA[0]).id;
    }
    this.openLightbox(targetId);
  }

  openLightbox(storyId) {
    const story = STORIES_DATA.find(s => s.id === storyId);
    if (!story) return;

    this.currentLightboxStoryId = storyId;
    this.isLightboxOpen = true;
    this.stopSequentialLightboxAudio();

    // Header info
    const iconEl = document.getElementById('lb-icon');
    const titleTaEl = document.getElementById('lb-title-ta');
    const titleEnEl = document.getElementById('lb-title-en');
    const badgeEl = document.getElementById('lb-badge');
    if (iconEl) iconEl.innerText = story.icon || '📚';
    if (titleTaEl) titleTaEl.innerText = story.title;
    if (titleEnEl) titleEnEl.innerText = story.titleEn;
    if (badgeEl) badgeEl.innerText = `${story.lines.length} வரிகள்`;

    // Populate Topic Selector in Lightbox Header
    const jumpSelect = document.getElementById('lb-story-jump-select');
    if (jumpSelect) {
      jumpSelect.innerHTML = STORIES_DATA.map((s, idx) => {
        return `<option value="${s.id}" ${s.id === storyId ? 'selected' : ''}>${idx + 1}. ${s.icon || '📖'} ${s.title}</option>`;
      }).join('');
      jumpSelect.value = storyId;
    }

    // Left Column: Line-by-Line Tamil Content
    const tamilBox = document.getElementById('lb-content-tamil');
    if (tamilBox) {
      tamilBox.innerHTML = `
        <div class="text-tamil-body">
          ${story.lines.map((line, idx) => `
            <div class="lb-sentence sentence-ta" data-line-index="${idx}" title="Click to listen line in Tamil">
              <div class="sentence-ta-text">${this.escapeHtml(line.tamil)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Left Tamil Audio Button (Sequential Story Audio)
    const btnTa = document.getElementById('lb-btn-audio-ta');
    if (btnTa) {
      btnTa.classList.remove('active-speaking');
      btnTa.innerHTML = '🔊 தமிழில் கேட்க';
      btnTa.onclick = () => {
        if (this.isLightboxPlaying && this.lightboxPlayLang === 'ta-IN') {
          this.stopSequentialLightboxAudio();
        } else {
          this.playSequentialLightboxAudio('ta-IN');
        }
      };
    }

    // Set combo box to current selection
    const combo = document.getElementById('lb-lang-combo');
    if (combo) combo.value = this.currentLightboxLang;

    // Update Right Column Content (Line-by-Line with phonetics)
    this.updateLightboxOtherContent();

    // Populate Vocab & Summary Footer
    this.updateLightboxFooterContent();

    // Sync Footer Collapse state
    this.updateLightboxFooterState();

    // Show modal & prevent background scrolling
    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    window.bhashaAudio.playSfx('click');
  }

  changeLightboxLang(lang) {
    this.currentLightboxLang = lang;
    this.stopSequentialLightboxAudio();
    this.updateLightboxOtherContent();
    window.bhashaAudio.playSfx('click');
  }

  updateLightboxOtherContent() {
    const story = STORIES_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    const contentBox = document.getElementById('lb-content-other');
    const audioBtn = document.getElementById('lb-btn-audio-other');
    if (!contentBox || !audioBtn) return;

    audioBtn.className = 'slate-audio-btn';
    let targetLangCode = 'en-US';

    if (this.currentLightboxLang === 'english') {
      contentBox.innerHTML = `
        <div class="text-english-body">
          ${story.lines.map((line, idx) => `
            <div class="lb-sentence sentence-en" data-line-index="${idx}" title="Click to listen line in English">
              <div class="english-line-text">${this.escapeHtml(line.english)}</div>
            </div>
          `).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-en');
      audioBtn.innerHTML = '🔊 Listen English';
      targetLangCode = 'en-US';
    } else if (this.currentLightboxLang === 'telugu') {
      contentBox.innerHTML = `
        <div class="text-telugu-body">
          ${story.lines.map((line, idx) => `
            <div class="lb-sentence sentence-te" data-line-index="${idx}" title="Click to listen line in Telugu">
              <div class="speak-tamil-bold">${this.escapeHtml(line.teluguSpeak)}</div>
              ${line.teluguSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(line.teluguSub)})</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-te');
      audioBtn.innerHTML = '🔊 தெலுங்கு ஒலி (Listen Telugu)';
      targetLangCode = 'te-IN';
    } else if (this.currentLightboxLang === 'kannada') {
      contentBox.innerHTML = `
        <div class="text-kannada-body">
          ${story.lines.map((line, idx) => `
            <div class="lb-sentence sentence-kn" data-line-index="${idx}" title="Click to listen line in Kannada">
              <div class="speak-tamil-bold">${this.escapeHtml(line.kannadaSpeak)}</div>
              ${line.kannadaSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(line.kannadaSub)})</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-kn');
      audioBtn.innerHTML = '🔊 கன்னட ஒலி (Listen Kannada)';
      targetLangCode = 'kn-IN';
    } else if (this.currentLightboxLang === 'hindi') {
      contentBox.innerHTML = `
        <div class="text-hindi-body">
          ${story.lines.map((line, idx) => `
            <div class="lb-sentence sentence-hi" data-line-index="${idx}" title="Click to listen line in Hindi">
              <div class="speak-tamil-bold">${this.escapeHtml(line.hindiSpeak)}</div>
              ${line.hindiSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(line.hindiSub)})</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-hi');
      audioBtn.innerHTML = '🔊 இந்தி ஒலி (Listen Hindi)';
      targetLangCode = 'hi-IN';
    }

    audioBtn.onclick = () => {
      if (this.isLightboxPlaying && this.lightboxPlayLang === targetLangCode) {
        this.stopSequentialLightboxAudio();
      } else {
        this.playSequentialLightboxAudio(targetLangCode);
      }
    };

    // Attach sentence click & hover sync
    this.attachLightboxSentenceInteractions();

    // Re-render vocab drawer to match target language
    this.updateLightboxFooterContent();
  }

  attachLightboxSentenceInteractions() {
    const modal = document.getElementById('story-lightbox');
    if (!modal) return;

    const sentences = modal.querySelectorAll('.lb-sentence');
    sentences.forEach((span) => {
      const idx = span.getAttribute('data-line-index');

      span.onmouseenter = () => {
        modal.querySelectorAll(`.lb-sentence[data-line-index="${idx}"]`).forEach((s) => {
          s.classList.add('synced-highlight');
        });
      };

      span.onmouseleave = () => {
        modal.querySelectorAll(`.lb-sentence[data-line-index="${idx}"]`).forEach((s) => {
          s.classList.remove('synced-highlight');
        });
      };

      span.onclick = (e) => {
        e.stopPropagation();
        const lineIdx = parseInt(idx, 10);
        const isLeft = span.closest('.lightbox-col-left') !== null;
        if (isLeft) {
          this.speakSingleLightboxLine(lineIdx, 'tamil');
        } else {
          this.speakSingleLightboxLine(lineIdx, this.currentLightboxLang);
        }
      };
    });
  }

  speakSingleLightboxLine(lineIdx, lang) {
    const story = STORIES_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story || !story.lines[lineIdx]) return;

    this.stopSequentialLightboxAudio();

    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
      modal.querySelectorAll(`.lb-sentence[data-line-index="${lineIdx}"]`).forEach(s => s.classList.add('synced-active-speaking'));
    }

    const line = story.lines[lineIdx];
    let text = '';
    let langCode = 'ta-IN';
    let subFallback = '';

    if (lang === 'tamil') {
      text = line.tamil;
      langCode = 'ta-IN';
      subFallback = text;
    } else if (lang === 'english') {
      text = line.english;
      langCode = 'en-US';
      subFallback = text;
    } else if (lang === 'telugu') {
      text = line.teluguScript || line.teluguSpeak;
      subFallback = line.teluguSpeak || line.teluguSub;
      langCode = 'te-IN';
    } else if (lang === 'kannada') {
      text = line.kannadaScript || line.kannadaSpeak;
      subFallback = line.kannadaSpeak || line.kannadaSub;
      langCode = 'kn-IN';
    } else if (lang === 'hindi') {
      text = line.hindiScript || line.hindiSpeak;
      subFallback = line.hindiSpeak || line.hindiSub;
      langCode = 'hi-IN';
    }

    if (text) {
      this.speak(text, langCode, subFallback);
      const durationMs = Math.max(2200, (text.length * 80) / this.audioSpeed);
      setTimeout(() => {
        if (modal) {
          modal.querySelectorAll(`.lb-sentence[data-line-index="${lineIdx}"]`).forEach(s => s.classList.remove('synced-active-speaking'));
        }
      }, durationMs);
    }
  }

  playSequentialLightboxAudio(targetLang) {
    const story = STORIES_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    this.stopSequentialLightboxAudio();
    this.isLightboxPlaying = true;
    this.lightboxPlayLang = targetLang;
    this.lightboxPlayIndex = 0;
    this.lightboxPlayLines = story.lines;

    // Toggle button state
    const btn = targetLang === 'ta-IN' ? document.getElementById('lb-btn-audio-ta') : document.getElementById('lb-btn-audio-other');
    if (btn) {
      btn.classList.add('active-speaking');
      btn.innerHTML = '⏹️ நிறுத்து (Stop)';
    }

    this.playNextLightboxLine();
  }

  playNextLightboxLine() {
    if (!this.isLightboxPlaying || this.lightboxPlayIndex >= this.lightboxPlayLines.length) {
      this.stopSequentialLightboxAudio();
      this.showToast('🎉 கதை வாசிப்பு நிறைவடைந்தது!');
      return;
    }

    const idx = this.lightboxPlayIndex;
    const line = this.lightboxPlayLines[idx];
    const modal = document.getElementById('story-lightbox');

    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
      const activeCards = modal.querySelectorAll(`.lb-sentence[data-line-index="${idx}"]`);
      activeCards.forEach(s => s.classList.add('synced-active-speaking'));
      if (activeCards[0]) {
        activeCards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    let text = '';
    let sub = '';
    if (this.lightboxPlayLang === 'ta-IN') {
      text = line.tamil;
      sub = line.tamil;
    } else if (this.lightboxPlayLang === 'en-US') {
      text = line.english;
      sub = line.english;
    } else if (this.lightboxPlayLang === 'te-IN') {
      text = line.teluguScript || line.teluguSpeak;
      sub = line.teluguSpeak || line.teluguSub;
    } else if (this.lightboxPlayLang === 'kn-IN') {
      text = line.kannadaScript || line.kannadaSpeak;
      sub = line.kannadaSpeak || line.kannadaSub;
    } else if (this.lightboxPlayLang === 'hi-IN') {
      text = line.hindiScript || line.hindiSpeak;
      sub = line.hindiSpeak || line.hindiSub;
    }

    this.speak(text, this.lightboxPlayLang, sub);

    const durationMs = Math.max(2600, (text.length * 85) / this.audioSpeed);
    this.lightboxPlayTimeout = setTimeout(() => {
      this.lightboxPlayIndex++;
      this.playNextLightboxLine();
    }, durationMs);
  }

  stopSequentialLightboxAudio() {
    this.isLightboxPlaying = false;
    if (this.lightboxPlayTimeout) {
      clearTimeout(this.lightboxPlayTimeout);
      this.lightboxPlayTimeout = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
    }

    const btnTa = document.getElementById('lb-btn-audio-ta');
    if (btnTa) {
      btnTa.classList.remove('active-speaking');
      btnTa.innerHTML = '🔊 தமிழில் கேட்க';
    }

    const btnOther = document.getElementById('lb-btn-audio-other');
    if (btnOther) {
      btnOther.classList.remove('active-speaking');
      if (this.currentLightboxLang === 'english') btnOther.innerHTML = '🔊 Listen English';
      else if (this.currentLightboxLang === 'telugu') btnOther.innerHTML = '🔊 தெலுங்கு ஒலி (Listen Telugu)';
      else if (this.currentLightboxLang === 'kannada') btnOther.innerHTML = '🔊 கன்னட ஒலி (Listen Kannada)';
      else if (this.currentLightboxLang === 'hindi') btnOther.innerHTML = '🔊 இந்தி ஒலி (Listen Hindi)';
    }
  }

  updateLightboxFooterContent() {
    const story = STORIES_DATA.find(s => s.id === this.currentLightboxStoryId);
    const vocabBox = document.getElementById('lb-vocab-summary');
    if (!story || !vocabBox) return;

    const items = window.getVocabComparison 
      ? window.getVocabComparison([], story.id)
      : [];

    let langHeaderTitle = 'ஆங்கில சொல்லகராதி (English Vocab)';
    let langColHeader = 'ஆங்கிலம்';
    let langSpeakKey = 'english';
    let langColor = '#38bdf8';

    if (this.currentLightboxLang === 'telugu') {
      langHeaderTitle = 'தெலுங்கு சொல்லகராதி (Telugu Vocab in Tamil)';
      langColHeader = '🗣️ தெலுங்கு (தமிழில் உச்சரிப்பு)';
      langSpeakKey = 'teluguSpeak';
      langColor = '#38bdf8';
    } else if (this.currentLightboxLang === 'kannada') {
      langHeaderTitle = 'கன்னட சொல்லகராதி (Kannada Vocab in Tamil)';
      langColHeader = '🗣️ கன்னடம் (தமிழில் உச்சரிப்பு)';
      langSpeakKey = 'kannadaSpeak';
      langColor = '#fb923c';
    } else if (this.currentLightboxLang === 'hindi') {
      langHeaderTitle = 'இந்தி சொல்லகராதி (Hindi Vocab in Tamil)';
      langColHeader = '🗣️ இந்தி (தமிழில் உச்சரிப்பு)';
      langSpeakKey = 'hindiSpeak';
      langColor = '#c084fc';
    }

    let vocabTableHtml = '';
    if (items.length > 0) {
      vocabTableHtml = `
        <div class="lb-vocab-table-wrap">
          <div style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0.5rem 0;">
            <span>✨ ${langHeaderTitle}:</span>
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 500;">கலைச்சொற்கள் & பல மொழி உச்சரிப்பு</span>
          </div>
          <table class="lb-vocab-mini-table">
            <thead>
              <tr>
                <th style="min-width: 130px;">ஆங்கில சொல் (English)</th>
                <th style="min-width: 140px;">தமிழ் அர்த்தம் (Meaning)</th>
                ${this.currentLightboxLang !== 'english' ? `<th style="min-width: 160px;">${langColHeader}</th>` : ''}
                <th style="width: 48px; text-align: center;">ஒலி</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(v => {
                const spokenVal = v[langSpeakKey] || v[this.currentLightboxLang] || v.english || '';
                const audioText = v[this.currentLightboxLang] || v[langSpeakKey] || v.english;
                const audioLang = this.currentLightboxLang === 'telugu' ? 'te-IN' : (this.currentLightboxLang === 'kannada' ? 'kn-IN' : (this.currentLightboxLang === 'hindi' ? 'hi-IN' : 'en-US'));
                return `
                  <tr>
                    <td><strong style="color: #f8fafc; font-size: 0.9rem;">${this.escapeHtml(v.english)}</strong></td>
                    <td style="color: #6ee7b7; font-weight: 600;">${this.escapeHtml(v.tamil)}</td>
                    ${this.currentLightboxLang !== 'english' ? `
                      <td>
                        <span class="speak-tamil-bold" style="color: ${langColor}; font-size: 0.98rem; margin: 0; display: inline-block;">
                          ${this.escapeHtml(spokenVal)}
                        </span>
                      </td>
                    ` : ''}
                    <td style="text-align: center;">
                      <button class="btn-vocab-speak" onclick="window.storyApp.speak('${this.escapeAudio(audioText)}', '${audioLang}', '${this.escapeAudio(spokenVal)}')" title="🔊 உச்சரிப்பைக் கேட்க">🔊</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    vocabBox.innerHTML = `
      <div class="lb-summary-text"><strong>💡 கதை நீதி (Moral):</strong> ${this.escapeHtml(story.moralTa)} <em>(${this.escapeHtml(story.moralEn)})</em></div>
      ${vocabTableHtml}
    `;
  }

  toggleLightboxFooter() {
    this.isLightboxFooterCollapsed = !this.isLightboxFooterCollapsed;
    this.updateLightboxFooterState();
    if (window.bhashaAudio) {
      window.bhashaAudio.playSfx('click');
    }
  }

  updateLightboxFooterState() {
    const drawer = document.getElementById('lb-footer-drawer');
    const toggleBtn = document.getElementById('lb-collapse-toggle-btn');
    const iconEl = document.getElementById('lb-collapse-icon');
    const textEl = document.getElementById('lb-collapse-text');

    if (!drawer || !toggleBtn) return;

    if (this.isLightboxFooterCollapsed) {
      drawer.classList.remove('is-expanded');
      toggleBtn.classList.remove('active');
      if (iconEl) iconEl.textContent = '✨';
      if (textEl) textEl.textContent = 'கலைச்சொற்கள் & குறிப்பு (Vocab) ▲';
      toggleBtn.title = 'கலைச்சொற்கள் & குறிப்புகளை விரித்து காட்டுக (Expand)';
    } else {
      drawer.classList.add('is-expanded');
      toggleBtn.classList.add('active');
      if (iconEl) iconEl.textContent = '▼';
      if (textEl) textEl.textContent = 'சுருக்கு (Collapse)';
      toggleBtn.title = 'கலைச்சொற்கள் & குறிப்புகளை சுருக்குக (Collapse)';
    }
  }

  closeLightbox(event) {
    if (event && event.target && event.target.id !== 'story-lightbox') {
      return;
    }
    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.style.display = 'none';
    }
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
    this.stopSequentialLightboxAudio();
  }

  navigateLightbox(direction) {
    let availableStories = STORIES_DATA;
    if (this.selectedStory !== 'all') {
      availableStories = availableStories.filter(s => s.id === this.selectedStory);
    }
    if (availableStories.length === 0) availableStories = STORIES_DATA;

    const currentIdx = availableStories.findIndex(s => s.id === this.currentLightboxStoryId);
    if (currentIdx === -1) {
      this.openLightbox(availableStories[0].id);
      return;
    }

    let nextIdx = currentIdx + direction;
    if (nextIdx < 0) nextIdx = availableStories.length - 1;
    if (nextIdx >= availableStories.length) nextIdx = 0;

    this.openLightbox(availableStories[nextIdx].id);
  }
}

// Global initialization
window.storyApp = new StoriesApp();
document.addEventListener('DOMContentLoaded', () => {
  window.storyApp.init();
});
