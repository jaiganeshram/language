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
            <div class="convo-title-wrap">
              <span class="convo-icon-pill">${convo.icon}</span>
              <div>
                <h2 class="convo-title-ta">${convo.title}</h2>
                <span class="convo-title-en">${convo.titleEn}</span>
              </div>
            </div>
            
            <!-- Read Button for Entire Conversation -->
            <div class="convo-header-actions">
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
}

// Global initialization
window.convoApp = new ConversationsApp();
document.addEventListener('DOMContentLoaded', () => {
  window.convoApp.init();
});
