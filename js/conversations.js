// Conversations Controller
// Displays Situational Dialogues in Tamil, English, Telugu, Kannada, and Hindi
// Includes Two-Table System: To-Learn Table & Read Table (Read button per Conversation)

class ConversationsApp {
  constructor() {
    this.selectedTopic = 'all';
    this.searchQuery = '';
    this.audioSpeed = 0.85;
    this.theme = localStorage.getItem('bhasha_theme') || 'dark';
    this.mode = 'to-learn'; // 'to-learn' | 'read'

    // Load persisted read conversations from localStorage
    try {
      const saved = localStorage.getItem('bhasha_read_convos');
      this.readItems = new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      this.readItems = new Set();
    }

    this.topics = [
      { id: 'all', label: '📌 அனைத்தும் (All Topics)' },
      { id: 'auto', label: '🚖 ஆட்டோ பயணம் (Auto Ride)' },
      { id: 'restaurant', label: '🍽️ உணவகம் (Restaurant)' },
      { id: 'shopping', label: '🛍️ கடை & பேரம் (Shopping)' },
      { id: 'meeting', label: '🤝 புதிய அறிமுகம் (Colleague / Friend)' },
      { id: 'directions', label: '🗺️ வழி விசாரித்தல் (Directions)' },
      { id: 'hotel', label: '🏨 ஹோட்டல் அறை (Hotel Check-in)' },
      { id: 'clinic', label: '🏥 மருத்துவமனை (Doctor & Clinic)' },
      { id: 'emergency', label: '🚨 அவசர உதவி (Emergency)' }
    ];

    // Lightbox / Split Screen Reader State
    this.currentLightboxConvoId = null;
    this.currentLightboxLang = 'kannada'; // 'kannada' | 'telugu' | 'hindi' | 'english'
    this.isLightboxOpen = false;
    this.isLightboxPlaying = false;
    this.lightboxPlayLang = null;
    this.lightboxPlayTimeout = null;
    this.lightboxPlayIndex = 0;
    this.lightboxPlayLines = [];
    this.isLightboxFooterCollapsed = true;
  }

  init() {
    this.applyTheme(this.theme);
    this.setupEventListeners();
    this.renderTopicBar();
    this.updateCounts();
    this.renderConversations();
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
    const searchInput = document.getElementById('convo-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderConversations();
      });
    }

    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        this.audioSpeed = parseFloat(e.target.value);
        window.bhashaAudio.setSpeed(this.audioSpeed);
      });
    }

    // Keyboard navigation (Esc to close Lightbox)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isLightboxOpen) {
        this.closeLightbox();
      }
    });
  }

  renderTopicBar() {
    const container = document.getElementById('convo-topic-bar');
    if (!container) return;

    container.innerHTML = this.topics.map(t => `
      <button class="cat-filter-btn ${this.selectedTopic === t.id ? 'active' : ''}" 
              onclick="window.convoApp.filterTopic('${t.id}')">
        ${t.label}
      </button>
    `).join('');
  }

  filterTopic(topicId) {
    this.selectedTopic = topicId;
    window.bhashaAudio.playSfx('click');
    this.renderTopicBar();
    this.renderConversations();
  }

  speak(text, langCode, phoneticFallback = '', btnEl = null) {
    window.bhashaAudio.speak(text, langCode, phoneticFallback, btnEl);
  }

  switchMode(mode) {
    this.mode = mode;
    window.bhashaAudio.playSfx('click');

    const toLearnTab = document.getElementById('tab-to-learn');
    const readTab = document.getElementById('tab-read');
    const readActions = document.getElementById('read-mode-actions');

    if (toLearnTab) toLearnTab.classList.toggle('active', mode === 'to-learn');
    if (readTab) readTab.classList.toggle('active', mode === 'read');
    if (readActions) readActions.style.display = mode === 'read' ? 'block' : 'none';

    this.renderConversations();
  }

  updateCounts() {
    const unreadEl = document.getElementById('unread-count');
    const readEl = document.getElementById('read-count');
    const totalConvos = CONVERSATIONS_DATA.length;
    const totalRead = this.readItems.size;
    const totalUnread = totalConvos - totalRead;

    if (unreadEl) unreadEl.textContent = totalUnread;
    if (readEl) readEl.textContent = totalRead;
  }

  markConvoRead(convoId, btnEl) {
    const convo = CONVERSATIONS_DATA.find(c => c.id === convoId);
    if (!convo) return;

    if (btnEl) {
      const section = btnEl.closest('.convo-section-block');
      if (section) section.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('success');
    this.readItems.add(convoId);
    this.persistReadItems();
    this.showToast(`✅ "${convo.title}" -> Read!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderConversations();
    }, 220);
  }

  markConvoUnread(convoId, btnEl) {
    const convo = CONVERSATIONS_DATA.find(c => c.id === convoId);
    if (!convo) return;

    if (btnEl) {
      const section = btnEl.closest('.convo-section-block');
      if (section) section.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('click');
    this.readItems.delete(convoId);
    this.persistReadItems();
    this.showToast(`↩️ "${convo.title}" -> To Learn!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderConversations();
    }, 220);
  }

  resetAllRead() {
    if (this.readItems.size === 0) {
      this.showToast('படித்தவை பட்டியல் ஏற்கனவே காலியாக உள்ளது.');
      return;
    }
    if (confirm('படித்த அனைத்து உரையாடல்களையும் மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்ற விரும்புகிறீர்களா?')) {
      this.readItems.clear();
      this.persistReadItems();
      window.bhashaAudio.playSfx('click');
      this.showToast('🔄 அனைத்து உரையாடல்களும் மீண்டும் சேர்க்கப்பட்டன!');
      this.updateCounts();
      this.renderConversations();
    }
  }

  persistReadItems() {
    try {
      localStorage.setItem('bhasha_read_convos', JSON.stringify(Array.from(this.readItems)));
    } catch (e) {
      console.warn('Could not save read convos to localStorage', e);
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

  renderConversations() {
    const wrapper = document.getElementById('conversations-wrapper');
    const badge = document.getElementById('total-convo-badge');
    if (!wrapper) return;

    this.updateCounts();
    const isReadMode = this.mode === 'read';
    const totalConvos = CONVERSATIONS_DATA.length;

    // Filter conversations by Read vs To-Learn mode
    let filteredConvos = CONVERSATIONS_DATA.filter(convo => {
      const isRead = this.readItems.has(convo.id);
      return isReadMode ? isRead : !isRead;
    });

    // Filter by topic selector
    if (this.selectedTopic !== 'all') {
      filteredConvos = filteredConvos.filter(convo => convo.id === this.selectedTopic);
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery;
      filteredConvos = filteredConvos.map(convo => {
        const matchedDialogues = convo.dialogues.filter(d => 
          d.tamil.toLowerCase().includes(q) ||
          d.english.toLowerCase().includes(q) ||
          d.teluguSpeak.toLowerCase().includes(q) ||
          d.teluguSub.toLowerCase().includes(q) ||
          d.kannadaSpeak.toLowerCase().includes(q) ||
          d.kannadaSub.toLowerCase().includes(q) ||
          d.hindiSpeak.toLowerCase().includes(q) ||
          d.hindiSub.toLowerCase().includes(q)
        );
        return {
          ...convo,
          dialogues: matchedDialogues
        };
      }).filter(convo => convo.dialogues.length > 0);
    }

    let totalDialogues = 0;
    filteredConvos.forEach(c => totalDialogues += c.dialogues.length);

    if (badge) {
      const totalInMode = isReadMode ? this.readItems.size : (totalConvos - this.readItems.size);
      badge.innerHTML = isReadMode 
        ? `படித்தவை: <strong>${filteredConvos.length}</strong> / ${totalInMode} உரையாடல்கள் (${totalDialogues} வாக்கியங்கள்)`
        : `படிக்க வேண்டியவை: <strong>${filteredConvos.length}</strong> / ${totalInMode} உரையாடல்கள் (${totalDialogues} வாக்கியங்கள்)`;
    }

    if (filteredConvos.length === 0) {
      if (!isReadMode) {
        const allCompleted = this.readItems.size === totalConvos;
        wrapper.innerHTML = `
          <div class="empty-table-state" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 3rem 1.5rem; text-align: center; border: 1px solid var(--border-color);">
            <div class="empty-text">
              ${allCompleted 
                ? '🎉 வாழ்த்துகள்! அனைத்து உரையாடல்களையும் படித்து முடித்துவிட்டீர்கள்!' 
                : '🔍 தேடலுக்குப் பொருத்தமான உரையாடல் எதுவும் கிடைக்கவில்லை.'}
            </div>
            ${allCompleted 
              ? `<button class="btn btn-sm btn-outline mt-2" onclick="window.convoApp.switchMode('read')">
                   ✅ படித்தவை அட்டவணையைக் காண்க
                 </button>`
              : `<button class="btn btn-sm btn-outline mt-2" onclick="window.convoApp.filterTopic('all'); document.getElementById('convo-search').value=''; window.convoApp.searchQuery=''; window.convoApp.renderConversations();">
                   அனைத்து உரையாடல்களையும் காட்டு
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
                ? '📖 படித்தவை அட்டவணை காலியாக உள்ளது.' 
                : '🔍 தேடலுக்குப் பொருத்தமான படித்த உரையாடல்கள் இல்லை.'}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
              ${noReadYet 
                ? "'படிக்க வேண்டியவை' அட்டவணையில் உள்ள உரையாடல் தலைப்பில் உள்ள 'Read' பொத்தானை அழுத்தினால், அந்த முழு உரையாடலும் இங்கு வந்து சேரும்." 
                : 'தேடல் சொல்லை மாற்றிப் பார்க்கவும்.'}
            </p>
            ${noReadYet ? `
              <button class="btn btn-sm btn-outline" onclick="window.convoApp.switchMode('to-learn')">
                👈 படிக்க வேண்டியவை அட்டவணைக்குச் செல்
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="document.getElementById('convo-search').value=''; window.convoApp.searchQuery=''; window.convoApp.renderConversations();">
                அனைத்துப் படித்த உரையாடல்களையும் காட்டு
              </button>
            `}
          </div>
        `;
      }
      return;
    }

    wrapper.innerHTML = filteredConvos.map(convo => `
      <section class="convo-section-block" id="convo-${convo.id}">
        <!-- Section Header Card with Read Button for Entire Conversation -->
        <div class="convo-header-card">
          <div class="convo-header-top-row">
            <div class="convo-title-wrap" style="cursor: pointer;" onclick="window.convoApp.openLightbox('${convo.id}')" title="ஒப்பீட்டு திரையில் உரையாடலைப் படிக்க (Click to open Split Reader)">
              <span class="convo-icon-pill">${convo.icon}</span>
              <div>
                <h2 class="convo-title-ta">${convo.title}</h2>
                <span class="convo-title-en">${convo.titleEn}</span>
              </div>
            </div>
            
            <!-- Header Actions -->
            <div class="convo-header-actions">
              <button class="btn-read-action convo-btn-action" style="background: rgba(6, 182, 212, 0.15); border-color: rgba(6, 182, 212, 0.45); color: #22d3ee;" onclick="window.convoApp.openLightbox('${convo.id}')" title="ஒப்பீட்டு திரையில் படிக்க (Open Split Reader)">
                👁️ View (ஒப்பீடு)
              </button>
              ${isReadMode ? `
                <button class="btn-read-action btn-unmark-read convo-btn-action" onclick="window.convoApp.markConvoUnread('${convo.id}', this)" title="மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்று">
                  Undo
                </button>
              ` : `
                <button class="btn-read-action btn-mark-read convo-btn-action" onclick="window.convoApp.markConvoRead('${convo.id}', this)" title="இந்த முழு உரையாடலையும் படித்ததாகக் குறி">
                  Read
                </button>
              `}
            </div>
          </div>
          <p class="convo-desc-text">${convo.desc}</p>
        </div>

        <!-- Dialogues Table Card (Clean 6 Columns, No Row-level Read Button) -->
        <div class="table-container-card">
          <div class="table-responsive">
            <table class="master-spoken-table convo-dialogue-table">
              <thead>
                <tr class="table-head-row">
                  <th class="th-speaker">Speaker</th>
                  <th class="th-tamil">தமிழ்</th>
                  <th class="th-english">English</th>
                  <th class="th-te">தெலுங்கில் பேச</th>
                  <th class="th-kn">கன்னடத்தில் பேச</th>
                  <th class="th-hi">இந்தியில் பேச</th>
                </tr>
              </thead>
              <tbody>
                ${convo.dialogues.map(d => {
                  const esc = (str) => (str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '');
                  const safeTa = esc(d.tamil);
                  const safeEn = esc(d.english);
                  const safeTe = esc(d.teluguScript);
                  const safeTeSub = esc(d.teluguSub);
                  const safeKn = esc(d.kannadaScript);
                  const safeKnSub = esc(d.kannadaSub);
                  const safeHi = esc(d.hindiScript);
                  const safeHiSub = esc(d.hindiSub);

                  return `
                  <tr class="table-row convo-row ${d.speakerRole === 'user' ? 'row-user-role' : 'row-other-role'}">
                    <!-- Speaker Column -->
                    <td class="cell-speaker">
                      <span class="speaker-badge ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">
                        ${d.speaker}
                      </span>
                    </td>

                    <!-- Tamil -->
                    <td class="cell-tamil">
                      <div class="speak-cell-wrap">
                        <div class="tamil-main-phrase">${d.tamil}</div>
                        <button class="table-audio-btn btn-ta" onclick="window.convoApp.speak('${safeTa}', 'ta-IN', '${safeTa}', this)" title="தமிழ் ஒலி">
                          🔊
                        </button>
                      </div>
                    </td>

                    <!-- English -->
                    <td class="cell-english">
                      <div class="speak-cell-wrap">
                        <div class="english-phrase">${d.english}</div>
                        <button class="table-audio-btn btn-en" onclick="window.convoApp.speak('${safeEn}', 'en-US', '${safeEn}', this)" title="English Audio">
                          🔊
                        </button>
                      </div>
                    </td>

                    <!-- Telugu -->
                    <td class="cell-lang cell-te" data-label="தெலுங்கு">
                      <div class="speak-cell-wrap">
                        <span class="mobile-lang-tag tag-te">தெலுங்கு:</span>
                        <div class="speak-text-box">
                          <span class="speak-tamil-bold">${d.teluguSpeak}</span>
                          <span class="phonetic-sub">(${d.teluguSub})</span>
                        </div>
                        <button class="table-audio-btn btn-te" onclick="window.convoApp.speak('${safeTe}', 'te-IN', '${safeTeSub}', this)" title="தெலுங்கு ஒலி">
                          🔊
                        </button>
                      </div>
                    </td>

                    <!-- Kannada -->
                    <td class="cell-lang cell-kn" data-label="கன்னடம்">
                      <div class="speak-cell-wrap">
                        <span class="mobile-lang-tag tag-kn">கன்னடம்:</span>
                        <div class="speak-text-box">
                          <span class="speak-tamil-bold">${d.kannadaSpeak}</span>
                          <span class="phonetic-sub">(${d.kannadaSub})</span>
                        </div>
                        <button class="table-audio-btn btn-kn" onclick="window.convoApp.speak('${safeKn}', 'kn-IN', '${safeKnSub}', this)" title="கன்னட ஒலி">
                          🔊
                        </button>
                      </div>
                    </td>

                    <!-- Hindi -->
                    <td class="cell-lang cell-hi" data-label="இந்தி">
                      <div class="speak-cell-wrap">
                        <span class="mobile-lang-tag tag-hi">இந்தி:</span>
                        <div class="speak-text-box">
                          <span class="speak-tamil-bold">${d.hindiSpeak}</span>
                          <span class="phonetic-sub">(${d.hindiSub})</span>
                        </div>
                        <button class="table-audio-btn btn-hi" onclick="window.convoApp.speak('${safeHi}', 'hi-IN', '${safeHiSub}', this)" title="இந்தி ஒலி">
                          🔊
                        </button>
                      </div>
                    </td>
                  </tr>
                `;}).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `).join('');
  }

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
    const convoId = (this.selectedTopic && this.selectedTopic !== 'all')
      ? this.selectedTopic
      : (this.currentLightboxConvoId || CONVERSATIONS_DATA[0].id);
    this.openLightbox(convoId);
  }

  openLightbox(convoId) {
    const convo = CONVERSATIONS_DATA.find(c => c.id === convoId);
    if (!convo) return;

    this.currentLightboxConvoId = convoId;
    this.isLightboxOpen = true;
    this.stopSequentialLightboxAudio();

    // Header info
    const iconEl = document.getElementById('lb-icon');
    const titleTaEl = document.getElementById('lb-title-ta');
    const titleEnEl = document.getElementById('lb-title-en');
    const badgeEl = document.getElementById('lb-badge');
    if (iconEl) iconEl.innerText = convo.icon || '💬';
    if (titleTaEl) titleTaEl.innerText = convo.title;
    if (titleEnEl) titleEnEl.innerText = convo.titleEn;
    if (badgeEl) badgeEl.innerText = `${convo.dialogues.length} வரிகள்`;

    // Populate Jump Selector in Lightbox Header
    const jumpSelect = document.getElementById('lb-story-jump-select');
    if (jumpSelect) {
      jumpSelect.innerHTML = CONVERSATIONS_DATA.map((c, idx) => {
        return `<option value="${c.id}" ${c.id === convoId ? 'selected' : ''}>${idx + 1}. ${c.icon || '💬'} ${c.title}</option>`;
      }).join('');
      jumpSelect.value = convoId;
    }

    // Left Column: Line-by-Line Tamil Content
    const tamilBox = document.getElementById('lb-content-tamil');
    if (tamilBox) {
      tamilBox.innerHTML = `
        <div class="text-tamil-body">
          ${convo.dialogues.map((d, idx) => `
            <div class="lb-sentence sentence-ta" data-line-index="${idx}" title="Click to listen line in Tamil">
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="convo-speaker-tag ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">${this.escapeHtml(d.speaker)}</span>
              </div>
              <div class="sentence-ta-text">${this.escapeHtml(d.tamil)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Left Tamil Audio Button
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

    // Update Right Column Content
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

    if (window.bhashaAudio) window.bhashaAudio.playSfx('click');
  }

  changeLightboxLang(lang) {
    this.currentLightboxLang = lang;
    this.stopSequentialLightboxAudio();
    this.updateLightboxOtherContent();
    if (window.bhashaAudio) window.bhashaAudio.playSfx('click');
  }

  updateLightboxOtherContent() {
    const convo = CONVERSATIONS_DATA.find(c => c.id === this.currentLightboxConvoId);
    if (!convo) return;

    const contentBox = document.getElementById('lb-content-other');
    const audioBtn = document.getElementById('lb-btn-audio-other');
    if (!contentBox || !audioBtn) return;

    audioBtn.className = 'slate-audio-btn';
    let targetLangCode = 'kn-IN';

    if (this.currentLightboxLang === 'english') {
      contentBox.innerHTML = `
        <div class="text-english-body">
          ${convo.dialogues.map((d, idx) => `
            <div class="lb-sentence sentence-en" data-line-index="${idx}" title="Click to listen line in English">
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="convo-speaker-tag ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">${this.escapeHtml(d.speaker)}</span>
              </div>
              <div class="english-line-text">${this.escapeHtml(d.english)}</div>
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
          ${convo.dialogues.map((d, idx) => `
            <div class="lb-sentence sentence-te" data-line-index="${idx}" title="Click to listen line in Telugu">
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="convo-speaker-tag ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">${this.escapeHtml(d.speaker)}</span>
              </div>
              <div class="speak-tamil-bold">${this.escapeHtml(d.teluguSpeak)}</div>
              ${d.teluguSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(d.teluguSub)})</div>` : ''}
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
          ${convo.dialogues.map((d, idx) => `
            <div class="lb-sentence sentence-kn" data-line-index="${idx}" title="Click to listen line in Kannada">
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="convo-speaker-tag ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">${this.escapeHtml(d.speaker)}</span>
              </div>
              <div class="speak-tamil-bold">${this.escapeHtml(d.kannadaSpeak)}</div>
              ${d.kannadaSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(d.kannadaSub)})</div>` : ''}
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
          ${convo.dialogues.map((d, idx) => `
            <div class="lb-sentence sentence-hi" data-line-index="${idx}" title="Click to listen line in Hindi">
              <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.3rem;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="convo-speaker-tag ${d.speakerRole === 'user' ? 'speaker-user' : 'speaker-other'}">${this.escapeHtml(d.speaker)}</span>
              </div>
              <div class="speak-tamil-bold">${this.escapeHtml(d.hindiSpeak)}</div>
              ${d.hindiSub ? `<div class="speak-en-sub phonetic-sub">(${this.escapeHtml(d.hindiSub)})</div>` : ''}
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
    const convo = CONVERSATIONS_DATA.find(c => c.id === this.currentLightboxConvoId);
    if (!convo || !convo.dialogues[lineIdx]) return;

    this.stopSequentialLightboxAudio();

    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
      modal.querySelectorAll(`.lb-sentence[data-line-index="${lineIdx}"]`).forEach(s => s.classList.add('synced-active-speaking'));
    }

    const d = convo.dialogues[lineIdx];
    let text = '';
    let langCode = 'ta-IN';
    let subFallback = '';

    if (lang === 'tamil') {
      text = d.tamil;
      langCode = 'ta-IN';
      subFallback = text;
    } else if (lang === 'english') {
      text = d.english;
      langCode = 'en-US';
      subFallback = text;
    } else if (lang === 'telugu') {
      text = d.teluguScript || d.teluguSpeak;
      subFallback = d.teluguSub || d.teluguSpeak;
      langCode = 'te-IN';
    } else if (lang === 'kannada') {
      text = d.kannadaScript || d.kannadaSpeak;
      subFallback = d.kannadaSub || d.kannadaSpeak;
      langCode = 'kn-IN';
    } else if (lang === 'hindi') {
      text = d.hindiScript || d.hindiSpeak;
      subFallback = d.hindiSub || d.hindiSpeak;
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
    const convo = CONVERSATIONS_DATA.find(c => c.id === this.currentLightboxConvoId);
    if (!convo) return;

    this.stopSequentialLightboxAudio();
    this.isLightboxPlaying = true;
    this.lightboxPlayLang = targetLang;
    this.lightboxPlayIndex = 0;
    this.lightboxPlayLines = convo.dialogues;

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
      this.showToast('🎉 உரையாடல் வாசிப்பு நிறைவடைந்தது!');
      return;
    }

    const idx = this.lightboxPlayIndex;
    const d = this.lightboxPlayLines[idx];
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
      text = d.tamil;
      sub = d.tamil;
    } else if (this.lightboxPlayLang === 'en-US') {
      text = d.english;
      sub = d.english;
    } else if (this.lightboxPlayLang === 'te-IN') {
      text = d.teluguScript || d.teluguSpeak;
      sub = d.teluguSub || d.teluguSpeak;
    } else if (this.lightboxPlayLang === 'kn-IN') {
      text = d.kannadaScript || d.kannadaSpeak;
      sub = d.kannadaSub || d.kannadaSpeak;
    } else if (this.lightboxPlayLang === 'hi-IN') {
      text = d.hindiScript || d.hindiSpeak;
      sub = d.hindiSub || d.hindiSpeak;
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
    const convo = CONVERSATIONS_DATA.find(c => c.id === this.currentLightboxConvoId);
    const vocabBox = document.getElementById('lb-vocab-summary');
    if (!convo || !vocabBox) return;

    const items = window.getVocabComparison 
      ? window.getVocabComparison([], convo.id)
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
            <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 500;">சூழல் கலைச்சொற்கள் & பல மொழி உச்சரிப்பு</span>
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
                      <button class="btn-vocab-speak" onclick="window.convoApp.speak('${this.escapeAudio(audioText)}', '${audioLang}', '${this.escapeAudio(spokenVal)}')" title="🔊 உச்சரிப்பைக் கேட்க">🔊</button>
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
      <div class="lb-summary-text"><strong>📌 சூழல் விளக்கம் (Situation):</strong> ${this.escapeHtml(convo.desc)}</div>
      ${vocabTableHtml}
    `;
  }

  toggleLightboxFooter() {
    this.isLightboxFooterCollapsed = !this.isLightboxFooterCollapsed;
    this.updateLightboxFooterState();
    if (window.bhashaAudio) window.bhashaAudio.playSfx('click');
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
    let availableConvos = CONVERSATIONS_DATA;
    if (this.selectedTopic !== 'all') {
      availableConvos = availableConvos.filter(c => c.id === this.selectedTopic);
    }
    if (availableConvos.length === 0) availableConvos = CONVERSATIONS_DATA;

    const currentIdx = availableConvos.findIndex(c => c.id === this.currentLightboxConvoId);
    if (currentIdx === -1) {
      this.openLightbox(availableConvos[0].id);
      return;
    }

    let nextIdx = currentIdx + direction;
    if (nextIdx < 0) nextIdx = availableConvos.length - 1;
    if (nextIdx >= availableConvos.length) nextIdx = 0;

    this.openLightbox(availableConvos[nextIdx].id);
  }
}

// Global initialization
window.convoApp = new ConversationsApp();
document.addEventListener('DOMContentLoaded', () => {
  window.convoApp.init();
});
