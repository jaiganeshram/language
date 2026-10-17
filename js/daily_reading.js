// Daily Reading Application Controller
// Unified Single Panel View per Story / Passage ("Don't Split - Oru Panela yae")
// Full Story Paragraphs in English, Tamil, Telugu, Kannada, and Hindi with Web Speech Audio

class DailyReadingApp {
  constructor() {
    this.selectedStory = 'all';
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.mode = 'to-learn'; // 'to-learn' | 'read'
    this.audioSpeed = 0.85;
    this.theme = localStorage.getItem('bhasha_theme') || 'dark';
    this.langView = 'all'; // 'all' | 'ta_en' | 'spoken'

    // Auto audio playback state
    this.isPlayingStory = false;
    this.currentPlayItem = null;

    // Load persisted read items from localStorage
    try {
      const saved = localStorage.getItem('bhasha_read_daily_reading');
      this.readItems = new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      this.readItems = new Set();
    }

    // Lightbox modal state
    this.isLightboxOpen = false;
    this.currentLightboxStoryId = null;
    this.currentLightboxLang = 'english';
    this.isLightboxFooterCollapsed = true; // default collapsed to maximize vertical reading space

    this.categories = [
      { id: 'all', label: '📌 அனைத்தும் (All Stories)' },
      { id: 'daily', label: '🚗 தினசரி நிகழ்வுகள் (Daily Life)' },
      { id: 'family', label: '👨‍👩‍👧‍👦 குடும்பம் & அன்பு (Family & Friends)' },
      { id: 'picture', label: '🖼️ படங்கள் விவரித்தல் (Picture Description)' },
      { id: 'wisdom', label: '💡 தன்னம்பிக்கை & நற்பண்புகள் (Wisdom & Habits)' }
    ];
  }

  init() {
    this.applyTheme(this.theme);
    this.setupEventListeners();
    this.renderCategoryFilter();
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

    // Keyboard Escape key to close lightbox
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isLightboxOpen) {
        this.closeLightbox();
      }
    });
  }

  renderCategoryFilter() {
    const container = document.getElementById('category-filter-bar');
    if (!container) return;

    container.innerHTML = this.categories.map(c => `
      <button class="cat-filter-btn ${this.selectedCategory === c.id ? 'active' : ''}" 
              onclick="window.dailyApp.filterCategory('${c.id}')">
        ${c.label}
      </button>
    `).join('');
  }

  filterCategory(catId) {
    this.selectedCategory = catId;
    this.selectedStory = 'all';
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');
    this.renderCategoryFilter();
    this.renderStorySelector();
    this.renderStories();
  }

  renderStorySelector() {
    const selectEl = document.getElementById('story-select-dropdown');
    if (!selectEl) return;

    let availableStories = DAILY_READING_DATA;
    if (this.selectedCategory !== 'all') {
      availableStories = availableStories.filter(s => s.category === this.selectedCategory);
    }

    const options = [
      `<option value="all" ${this.selectedStory === 'all' ? 'selected' : ''}>📌 எல்லாக் கதைகளையும் தொடர்ச்சியாகக் காட்டு (All ${availableStories.length} Stories)</option>`,
      ...availableStories.map((s, idx) => {
        const isSelected = this.selectedStory === s.id ? 'selected' : '';
        return `<option value="${s.id}" ${isSelected}>${idx + 1}. ${s.icon || '📖'} ${s.title} (${s.titleEn})</option>`;
      })
    ];

    selectEl.innerHTML = options.join('');
    selectEl.value = this.selectedStory;

    const btnAll = document.getElementById('btn-all-stories');
    if (btnAll) {
      btnAll.classList.toggle('active', this.selectedStory === 'all');
    }

    const btnViewNav = document.getElementById('btn-view-story-nav');
    if (btnViewNav) {
      if (this.selectedStory !== 'all') {
        const selStory = DAILY_READING_DATA.find(s => s.id === this.selectedStory);
        btnViewNav.innerHTML = `👁️ View (${selStory ? selStory.title : 'ஒப்பீடு'})`;
        btnViewNav.title = `தேர்வு செய்த கதையை ஒப்பிட்டுப் பார்க்க (Side-by-Side Lightbox View)`;
      } else {
        btnViewNav.innerHTML = '👁️ View (ஒப்பீடு)';
        btnViewNav.title = 'முதல் கதையை ஒப்பிட்டுப் பார்க்க (Side-by-Side Lightbox View)';
      }
    }
  }

  filterStory(storyId) {
    if (storyId === 'all') {
      this.selectedStory = 'all';
    } else {
      this.selectedStory = storyId;
      // Clear search query so old search doesn't hide the selected story
      const searchInput = document.getElementById('story-search');
      if (searchInput && this.searchQuery) {
        searchInput.value = '';
        this.searchQuery = '';
      }
      // If the selected story belongs to another category, adjust category to 'all'
      const story = DAILY_READING_DATA.find(s => s.id === storyId);
      if (story && this.selectedCategory !== 'all' && story.category !== this.selectedCategory) {
        this.selectedCategory = 'all';
        this.renderCategories();
      }
    }
    this.stopStoryAudio();
    window.bhashaAudio.playSfx('click');
    this.renderStorySelector();
    this.renderStories();

    // If a specific story is chosen, smoothly scroll to it
    if (storyId !== 'all') {
      setTimeout(() => {
        const card = document.getElementById(`story-${storyId}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  openSelectedLightbox() {
    let targetId = this.selectedStory;
    if (!targetId || targetId === 'all') {
      const first = (this.selectedCategory !== 'all')
        ? (DAILY_READING_DATA.find(s => s.category === this.selectedCategory) || DAILY_READING_DATA[0])
        : DAILY_READING_DATA[0];
      targetId = first ? first.id : null;
    }
    if (targetId) {
      this.openLightbox(targetId);
    }
  }

  navigateStory(direction) {
    let availableStories = DAILY_READING_DATA;
    if (this.selectedCategory !== 'all') {
      availableStories = availableStories.filter(s => s.category === this.selectedCategory);
    }
    if (availableStories.length === 0) return;

    if (this.selectedStory === 'all') {
      const target = direction > 0 ? availableStories[0].id : availableStories[availableStories.length - 1].id;
      this.filterStory(target);
      return;
    }

    const currentIndex = availableStories.findIndex(s => s.id === this.selectedStory);
    if (currentIndex === -1) {
      this.filterStory(availableStories[0].id);
      return;
    }

    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = availableStories.length - 1;
    if (newIndex >= availableStories.length) newIndex = 0;

    this.filterStory(availableStories[newIndex].id);
  }

  speak(text, langCode, phoneticFallback = '', btnEl = null) {
    window.bhashaAudio.speak(text, langCode, phoneticFallback, btnEl);
  }

  setLangView(view) {
    this.langView = view;
    window.bhashaAudio.playSfx('click');

    const btnAll = document.getElementById('filter-lang-all');
    const btnTaEn = document.getElementById('filter-lang-ta-en');
    const btnSpoken = document.getElementById('filter-lang-spoken');

    if (btnAll) btnAll.classList.toggle('active', view === 'all');
    if (btnTaEn) btnTaEn.classList.toggle('active', view === 'ta_en');
    if (btnSpoken) btnSpoken.classList.toggle('active', view === 'spoken');

    this.renderStories();
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

  updateCounts() {
    const unreadEl = document.getElementById('unread-count');
    const readEl = document.getElementById('read-count');
    const totalBadgeEl = document.getElementById('total-story-badge');
    const totalStories = DAILY_READING_DATA.length;
    const totalRead = this.readItems.size;
    const totalUnread = totalStories - totalRead;

    if (unreadEl) unreadEl.textContent = totalUnread;
    if (readEl) readEl.textContent = totalRead;
    if (totalBadgeEl) {
      totalBadgeEl.textContent = `${totalStories} வாசிப்புப் பகுதிகள் (முழுப் பத்திகள்)`;
    }
  }

  markStoryRead(storyId, btnEl) {
    const story = DAILY_READING_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.unified-story-card');
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
    const story = DAILY_READING_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.unified-story-card');
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
    if (confirm('படித்த அனைத்துப் பகுதிகளையும் மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்ற விரும்புகிறீர்களா?')) {
      this.readItems.clear();
      this.persistReadItems();
      window.bhashaAudio.playSfx('click');
      this.showToast('🔄 அனைத்துப் பகுதிகளும் மீண்டும் சேர்க்கப்பட்டன!');
      this.updateCounts();
      this.renderStories();
    }
  }

  persistReadItems() {
    try {
      localStorage.setItem('bhasha_read_daily_reading', JSON.stringify(Array.from(this.readItems)));
    } catch (e) {
      console.warn('Could not save read items to localStorage', e);
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

  stopStoryAudio() {
    this.isPlayingStory = false;
    window.bhashaAudio.stop();
  }

  renderStories() {
    const wrapper = document.getElementById('stories-list-container');
    const badge = document.getElementById('filtered-story-count-badge');
    if (!wrapper) return;

    const totalStories = DAILY_READING_DATA.length;
    const isReadMode = this.mode === 'read';

    let filteredStories;
    if (this.selectedStory !== 'all') {
      // When a specific story is chosen from the combobox, ALWAYS show that exact story
      const targetStory = DAILY_READING_DATA.find(s => s.id === this.selectedStory);
      filteredStories = targetStory ? [targetStory] : [];
    } else {
      filteredStories = DAILY_READING_DATA.filter(story => {
        const isRead = this.readItems.has(story.id);
        return isReadMode ? isRead : !isRead;
      });

      // Filter by Category
      if (this.selectedCategory !== 'all') {
        filteredStories = filteredStories.filter(s => s.category === this.selectedCategory);
      }
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filteredStories = filteredStories.filter(s => {
        return (
          s.title.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          (s.vocab && s.vocab.toLowerCase().includes(q)) ||
          (s.summary && s.summary.toLowerCase().includes(q)) ||
          s.fullEnglish.toLowerCase().includes(q) ||
          s.fullTamil.toLowerCase().includes(q) ||
          s.fullTeluguSpeak.toLowerCase().includes(q) ||
          s.fullKannadaSpeak.toLowerCase().includes(q) ||
          s.fullHindiSpeak.toLowerCase().includes(q)
        );
      });
    }

    if (badge) {
      const totalInMode = isReadMode ? this.readItems.size : (totalStories - this.readItems.size);
      badge.innerHTML = isReadMode
        ? `படித்தவை: <strong>${filteredStories.length}</strong> / ${totalInMode} கதைகள் & பகுதிகள்`
        : `படிக்க வேண்டியவை: <strong>${filteredStories.length}</strong> / ${totalInMode} கதைகள் & பகுதிகள்`;
    }

    if (filteredStories.length === 0) {
      if (!isReadMode) {
        const allCompleted = this.readItems.size === totalStories;
        wrapper.innerHTML = `
          <div class="empty-table-state" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 3rem 1.5rem; text-align: center; border: 1px solid var(--border-color);">
            <div class="empty-text">
              ${allCompleted 
                ? '🎉 வாழ்த்துகள்! அனைத்துப் பகுதிகளையும் படித்து முடித்துவிட்டீர்கள்!' 
                : '🔍 தேடலுக்குப் பொருத்தமான பகுதிகள் எதுவும் கிடைக்கவில்லை.'}
            </div>
            ${allCompleted 
              ? `<button class="btn btn-sm btn-outline mt-2" onclick="window.dailyApp.switchMode('read')">
                   ✅ படித்தவை அட்டவணையைக் காண்க
                 </button>`
              : `<button class="btn btn-sm btn-outline mt-2" onclick="window.dailyApp.filterCategory('all'); window.dailyApp.filterStory('all'); document.getElementById('story-search').value=''; window.dailyApp.searchQuery=''; window.dailyApp.renderStories();">
                   அனைத்துப் பகுதிகளையும் காட்டு
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
                ? "'படிக்க வேண்டியவை' அட்டவணையில் உள்ள கதைத் தலைப்பில் உள்ள 'Read' பொத்தானை அழுத்தினால், அது இங்கு வந்து சேரும்." 
                : 'தேடல் சொல்லை மாற்றிப் பார்க்கவும்.'}
            </p>
            ${noReadYet ? `
              <button class="btn btn-sm btn-outline" onclick="window.dailyApp.switchMode('to-learn')">
                👈 படிக்க வேண்டியவை பகுதிக்குச் செல்
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="document.getElementById('story-search').value=''; window.dailyApp.searchQuery=''; window.dailyApp.renderStories();">
                அனைத்துப் படித்த பகுதிகளையும் காட்டு
              </button>
            `}
          </div>
        `;
      }
      return;
    }

    // Helper to safely escape quotes for inline HTML onclick attributes
    const esc = (str) => (str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '');

    const showTa = this.langView === 'all' || this.langView === 'ta_en';
    const showEn = this.langView === 'all' || this.langView === 'ta_en';
    const showSpoken = this.langView === 'all' || this.langView === 'spoken';

    // Render Unified Single Slate Panel per Story (Don't Split - Oru Panela yae!)
    wrapper.innerHTML = filteredStories.map(story => {
      const safeEn = esc(story.fullEnglish);
      const safeTa = esc(story.fullTamil);
      const safeTe = esc(story.fullTeluguScript);
      const safeTeSub = esc(story.fullTeluguSub);
      const safeKn = esc(story.fullKannadaScript);
      const safeKnSub = esc(story.fullKannadaSub);
      const safeHi = esc(story.fullHindiScript);
      const safeHiSub = esc(story.fullHindiSub);

      return `
        <article class="unified-story-card" id="story-${story.id}">
          <!-- Unified Card Header -->
          <div class="unified-card-header">
            <div class="card-title-group">
              <span class="card-icon">${story.icon || '📖'}</span>
              <div>
                <h2 class="card-title-ta">${story.title}</h2>
                <span class="card-title-en">${story.titleEn}</span>
              </div>
              <span class="vocab-tag" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee; border-color: rgba(6, 182, 212, 0.3);">
                ${story.badge || 'Story'}
              </span>
            </div>

            <!-- Read / View Action Buttons -->
            <div class="card-action-group">
              <button class="btn-view-action convo-btn-action" onclick="window.dailyApp.openLightbox('${story.id}')" title="ஒப்பீட்டு வாசிப்பு முறை (Side-by-Side Lightbox View)">
                👁️ View
              </button>
              ${isReadMode ? `
                <button class="btn-read-action btn-unmark-read convo-btn-action" onclick="window.dailyApp.markStoryUnread('${story.id}', this)" title="மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்று">
                  Undo
                </button>
              ` : `
                <button class="btn-read-action btn-mark-read convo-btn-action" onclick="window.dailyApp.markStoryRead('${story.id}', this)" title="இப்பகுதியைப் படித்ததாகக் குறி">
                  Read
                </button>
              `}
            </div>
          </div>

          <!-- Summary & Vocab Details -->
          <div class="unified-meta-row">
            <div class="unified-summary">${story.summary}</div>
            ${story.vocab ? `
              <div class="unified-vocab-wrap">
                <span style="font-weight: 700; color: #f59e0b;">✨ புதிய சொற்கள் (New Vocab):</span>
                <span class="vocab-tag">${story.vocab}</span>
              </div>
            ` : ''}
          </div>

          <!-- SINGLE UNIFIED READING SLATE (Don't Split - Oru Panela yae!) -->
          <div class="single-slate-panel">
            
            <!-- 1. Tamil Full Passage -->
            ${showTa ? `
              <div class="slate-lang-section slate-ta">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-ta">🇮🇳 தமிழ் (Tamil)</span>
                  <button class="slate-audio-btn btn-ta" onclick="window.dailyApp.speak('${safeTa}', 'ta-IN', '${safeTa}', this)" title="தமிழில் முழுப் பத்தியையும் கேட்க">
                    🔊 தமிழில் கேட்க
                  </button>
                </div>
                <div class="slate-passage-text text-tamil">
                  ${story.fullTamil}
                </div>
              </div>
            ` : ''}

            <!-- 2. English Full Passage -->
            ${showEn ? `
              <div class="slate-lang-section slate-en">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-en">🇬🇧 English</span>
                  <button class="slate-audio-btn btn-en" onclick="window.dailyApp.speak('${safeEn}', 'en-US', '${safeEn}', this)" title="ஆங்கிலத்தில் முழுப் பத்தியையும் கேட்க">
                    🔊 Listen English
                  </button>
                </div>
                <div class="slate-passage-text text-english">
                  ${story.fullEnglish}
                </div>
              </div>
            ` : ''}

            <!-- 3. Telugu Spoken Full Passage -->
            ${showSpoken ? `
              <div class="slate-lang-section slate-te">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-te">தெலுங்கில் பேச (Telugu)</span>
                  <button class="slate-audio-btn btn-te" onclick="window.dailyApp.speak('${safeTe}', 'te-IN', '${safeTeSub}', this)" title="தெலுங்கில் முழுப் பத்தியையும் கேட்க">
                    🔊 தெலுங்கு ஒலி
                  </button>
                </div>
                <div class="slate-passage-text">
                  <div class="speak-tamil-bold">${story.fullTeluguSpeak}</div>
                  ${story.fullTeluguSub ? `<div class="speak-en-sub">${story.fullTeluguSub}</div>` : ''}
                </div>
              </div>

              <!-- 4. Kannada Spoken Full Passage -->
              <div class="slate-lang-section slate-kn">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-kn">கன்னடத்தில் பேச (Kannada)</span>
                  <button class="slate-audio-btn btn-kn" onclick="window.dailyApp.speak('${safeKn}', 'kn-IN', '${safeKnSub}', this)" title="கன்னடத்தில் முழுப் பத்தியையும் கேட்க">
                    🔊 கன்னட ஒலி
                  </button>
                </div>
                <div class="slate-passage-text">
                  <div class="speak-tamil-bold">${story.fullKannadaSpeak}</div>
                  ${story.fullKannadaSub ? `<div class="speak-en-sub">${story.fullKannadaSub}</div>` : ''}
                </div>
              </div>

              <!-- 5. Hindi Spoken Full Passage -->
              <div class="slate-lang-section slate-hi">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-hi">இந்தியில் பேச (Hindi)</span>
                  <button class="slate-audio-btn btn-hi" onclick="window.dailyApp.speak('${safeHi}', 'hi-IN', '${safeHiSub}', this)" title="இந்தியில் முழுப் பத்தியையும் கேட்க">
                    🔊 இந்தி ஒலி
                  </button>
                </div>
                <div class="slate-passage-text">
                  <div class="speak-tamil-bold">${story.fullHindiSpeak}</div>
                  ${story.fullHindiSub ? `<div class="speak-en-sub">${story.fullHindiSub}</div>` : ''}
                </div>
              </div>
            ` : ''}

          </div>
        </article>
      `;
    }).join('');
  }

  // ==========================================
  // Lightbox Modal Comparison & Viewer Methods
  // ==========================================
  openLightbox(storyId) {
    const story = DAILY_READING_DATA.find(s => s.id === storyId);
    if (!story) return;

    this.currentLightboxStoryId = storyId;
    this.isLightboxOpen = true;

    // Header info
    const iconEl = document.getElementById('lb-icon');
    const titleTaEl = document.getElementById('lb-title-ta');
    const titleEnEl = document.getElementById('lb-title-en');
    const badgeEl = document.getElementById('lb-badge');
    if (iconEl) iconEl.innerText = story.icon || '📖';
    if (titleTaEl) titleTaEl.innerText = story.title;
    if (titleEnEl) titleEnEl.innerText = story.titleEn;
    if (badgeEl) badgeEl.innerText = story.badge || 'Story';

    // Populate Topic Selector in Lightbox Header
    const jumpSelect = document.getElementById('lb-story-jump-select');
    if (jumpSelect) {
      jumpSelect.innerHTML = DAILY_READING_DATA.map((s, idx) => {
        return `<option value="${s.id}" ${s.id === storyId ? 'selected' : ''}>${idx + 1}. ${s.icon || '📖'} ${s.title}</option>`;
      }).join('');
      jumpSelect.value = storyId;
    }

    // Left Column: Tamil Content
    const tamilBox = document.getElementById('lb-content-tamil');
    if (tamilBox) tamilBox.innerHTML = `<div class="text-tamil-body">${(story.fullTamil || '').trim()}</div>`;

    // Left Tamil Audio Button
    const btnTa = document.getElementById('lb-btn-audio-ta');
    if (btnTa) {
      btnTa.onclick = () => {
        this.speak(story.fullTamil, 'ta-IN', story.fullTamil, btnTa);
      };
    }

    // Vocab & Summary Footer
    const vocabBox = document.getElementById('lb-vocab-summary');
    if (vocabBox) {
      vocabBox.innerHTML = `
        ${story.summary ? `<div class="lb-summary-text">${story.summary}</div>` : ''}
        ${story.vocab ? `<div class="lb-vocab-text">✨ <strong style="color: #f59e0b;">புதிய சொற்கள் (Vocab):</strong> <span class="vocab-tag">${story.vocab}</span></div>` : ''}
      `;
    }

    // Sync Footer Collapse state
    this.updateLightboxFooterState();

    // Set combo box to current selection
    const combo = document.getElementById('lb-lang-combo');
    if (combo) combo.value = this.currentLightboxLang;

    // Update Right Column Content
    this.updateLightboxOtherContent();

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
    this.updateLightboxOtherContent();
    window.bhashaAudio.playSfx('click');
  }

  updateLightboxOtherContent() {
    const story = DAILY_READING_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    const contentBox = document.getElementById('lb-content-other');
    const audioBtn = document.getElementById('lb-btn-audio-other');
    if (!contentBox || !audioBtn) return;

    audioBtn.className = 'slate-audio-btn';

    if (this.currentLightboxLang === 'english') {
      contentBox.innerHTML = `<div class="text-english-body">${(story.fullEnglish || '').trim()}</div>`;
      audioBtn.classList.add('btn-en');
      audioBtn.innerHTML = '🔊 Listen English';
      audioBtn.onclick = () => {
        this.speak(story.fullEnglish, 'en-US', story.fullEnglish, audioBtn);
      };
    } else if (this.currentLightboxLang === 'telugu') {
      contentBox.innerHTML = `<div class="speak-tamil-bold">${(story.fullTeluguSpeak || '').trim()}</div>` +
        (story.fullTeluguSub ? `<div class="speak-en-sub">${(story.fullTeluguSub || '').trim()}</div>` : '');
      audioBtn.classList.add('btn-te');
      audioBtn.innerHTML = '🔊 தெலுங்கு ஒலி';
      audioBtn.onclick = () => {
        this.speak(story.fullTeluguScript || story.fullTeluguSpeak, 'te-IN', story.fullTeluguSub || story.fullTeluguSpeak, audioBtn);
      };
    } else if (this.currentLightboxLang === 'kannada') {
      contentBox.innerHTML = `<div class="speak-tamil-bold">${(story.fullKannadaSpeak || '').trim()}</div>` +
        (story.fullKannadaSub ? `<div class="speak-en-sub">${(story.fullKannadaSub || '').trim()}</div>` : '');
      audioBtn.classList.add('btn-kn');
      audioBtn.innerHTML = '🔊 கன்னட ஒலி';
      audioBtn.onclick = () => {
        this.speak(story.fullKannadaScript || story.fullKannadaSpeak, 'kn-IN', story.fullKannadaSub || story.fullKannadaSpeak, audioBtn);
      };
    } else if (this.currentLightboxLang === 'hindi') {
      contentBox.innerHTML = `<div class="speak-tamil-bold">${(story.fullHindiSpeak || '').trim()}</div>` +
        (story.fullHindiSub ? `<div class="speak-en-sub">${(story.fullHindiSub || '').trim()}</div>` : '');
      audioBtn.classList.add('btn-hi');
      audioBtn.innerHTML = '🔊 இந்தி ஒலி';
      audioBtn.onclick = () => {
        this.speak(story.fullHindiScript || story.fullHindiSpeak, 'hi-IN', story.fullHindiSub || story.fullHindiSpeak, audioBtn);
      };
    }
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
      if (textEl) textEl.textContent = 'புதிய சொற்கள் & குறிப்பு (Vocab) ▲';
      toggleBtn.title = 'புதிய சொற்கள் & குறிப்புகளை விரித்து காட்டுக (Expand)';
    } else {
      drawer.classList.add('is-expanded');
      toggleBtn.classList.add('active');
      if (iconEl) iconEl.textContent = '▼';
      if (textEl) textEl.textContent = 'சுருக்கு (Collapse)';
      toggleBtn.title = 'புதிய சொற்கள் & குறிப்புகளை சுருக்குக (Collapse)';
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
    this.stopStoryAudio();
  }

  navigateLightbox(direction) {
    let availableStories = DAILY_READING_DATA;
    if (this.selectedCategory !== 'all') {
      availableStories = availableStories.filter(s => s.category === this.selectedCategory);
    }
    if (availableStories.length === 0) return;

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
document.addEventListener('DOMContentLoaded', () => {
  window.dailyApp = new DailyReadingApp();
  window.dailyApp.init();
});
