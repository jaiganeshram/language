// Master Spoken Table Application Controller
// 100% Pure Tamil Phonetic Guide for Telugu, Kannada, and Hindi
// Includes Two-Table System: To-Learn Table & Read Table (படித்தவை அட்டவணை)

class BhashaApp {
  constructor() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.audioSpeed = 0.85;
    this.theme = localStorage.getItem('bhasha_theme') || 'dark';
    this.mode = 'to-learn'; // 'to-learn' | 'read'

    // Load persisted read items from localStorage
    try {
      const saved = localStorage.getItem('bhasha_read_items');
      this.readItems = new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      this.readItems = new Set();
    }

    this.categories = [
      { id: 'all', label: '📌 அனைத்தும்' },
      { id: 'greetings', label: '🌟 முகமன் & உரையாடல்' },
      { id: 'daily', label: '🗣️ அன்றாட பேச்சு' },
      { id: 'travel', label: '🚗 பயணம், ஆட்டோ & வழி' },
      { id: 'shopping', label: '🛍️ கடை & பேரம்' },
      { id: 'food', label: '🍽️ உணவகம் & சாப்பாடு' },
      { id: 'questions', label: '❓ முக்கிய கேள்விகள்' },
      { id: 'emergency', label: '🏥 மருத்துவம் & உதவி' },
      { id: 'pronouns', label: '👥 மனிதர்கள் & உறவுகள்' },
      { id: 'numbers', label: '🔢 எண்கள் & நேரம்' },
      { id: 'cognates', label: '⚡ பொதுவான சொற்கள்' }
    ];
  }

  init() {
    // Assign stable IDs to dataset items
    MASTER_TABLE_DATA.forEach((item, idx) => {
      item._id = idx;
    });

    this.applyTheme(this.theme);
    this.setupEventListeners();
    this.renderCategoryBar();
    this.updateCounts();
    this.renderTable();
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
    // Search Box
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });
    }

    // Audio Speed
    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        this.audioSpeed = parseFloat(e.target.value);
        window.bhashaAudio.setSpeed(this.audioSpeed);
      });
    }
  }

  renderCategoryBar() {
    const container = document.getElementById('category-filter-bar');
    if (!container) return;

    container.innerHTML = this.categories.map(cat => `
      <button class="cat-filter-btn ${this.selectedCategory === cat.id ? 'active' : ''}" 
              onclick="window.bhashaApp.filterCategory('${cat.id}')">
        ${cat.label}
      </button>
    `).join('');
  }

  filterCategory(catId) {
    this.selectedCategory = catId;
    window.bhashaAudio.playSfx('click');
    this.renderCategoryBar();
    this.renderTable();
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

    this.renderTable();
  }

  updateCounts() {
    const unreadEl = document.getElementById('unread-count');
    const readEl = document.getElementById('read-count');
    const totalUnread = MASTER_TABLE_DATA.length - this.readItems.size;
    const totalRead = this.readItems.size;

    if (unreadEl) unreadEl.textContent = totalUnread;
    if (readEl) readEl.textContent = totalRead;
  }

  markAsRead(id, btnEl) {
    const rowData = MASTER_TABLE_DATA[id];
    if (!rowData) return;

    // Visual animation
    if (btnEl) {
      const tr = btnEl.closest('.table-row');
      if (tr) tr.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('success');
    this.readItems.add(id);
    this.persistReadItems();
    this.showToast(`✅ "${rowData.tamil}" -> Read!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderTable();
    }, 220);
  }

  markAsUnread(id, btnEl) {
    const rowData = MASTER_TABLE_DATA[id];
    if (!rowData) return;

    // Visual animation
    if (btnEl) {
      const tr = btnEl.closest('.table-row');
      if (tr) tr.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('click');
    this.readItems.delete(id);
    this.persistReadItems();
    this.showToast(`↩️ "${rowData.tamil}" -> To Learn!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderTable();
    }, 220);
  }

  resetAllRead() {
    if (this.readItems.size === 0) {
      this.showToast('படித்தவை அட்டவணை ஏற்கனவே காலியாக உள்ளது.');
      return;
    }
    if (confirm('படித்த அனைத்துச் சொற்களையும் மீண்டும் படிக்க வேண்டிய அட்டவணைக்கு மாற்ற விரும்புகிறீர்களா?')) {
      this.readItems.clear();
      this.persistReadItems();
      window.bhashaAudio.playSfx('click');
      this.showToast('🔄 அனைத்துச் சொற்களும் மீண்டும் சேர்க்கப்பட்டன!');
      this.updateCounts();
      this.renderTable();
    }
  }

  persistReadItems() {
    try {
      localStorage.setItem('bhasha_read_items', JSON.stringify(Array.from(this.readItems)));
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

  renderTable() {
    const tbody = document.getElementById('table-body');
    const countBadge = document.getElementById('total-count-badge');
    if (!tbody) return;

    this.updateCounts();

    let filtered = MASTER_TABLE_DATA.filter(item => {
      const isRead = this.readItems.has(item._id);

      // Mode filter (to-learn vs read)
      if (this.mode === 'to-learn' && isRead) return false;
      if (this.mode === 'read' && !isRead) return false;

      // Category filter
      if (this.selectedCategory !== 'all' && item.cat !== this.selectedCategory) {
        return false;
      }

      // Search query filter
      if (this.searchQuery) {
        const q = this.searchQuery;
        return (
          item.tamil.toLowerCase().includes(q) ||
          item.teluguSpeak.toLowerCase().includes(q) ||
          item.teluguSub.toLowerCase().includes(q) ||
          item.kannadaSpeak.toLowerCase().includes(q) ||
          item.kannadaSub.toLowerCase().includes(q) ||
          item.hindiSpeak.toLowerCase().includes(q) ||
          item.hindiSub.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (countBadge) {
      if (this.mode === 'to-learn') {
        countBadge.innerHTML = `படிக்க வேண்டியவை: <strong>${filtered.length}</strong> / ${MASTER_TABLE_DATA.length - this.readItems.size}`;
      } else {
        countBadge.innerHTML = `படித்தவை: <strong>${filtered.length}</strong> / ${this.readItems.size}`;
      }
    }

    // Empty state handling
    if (filtered.length === 0) {
      if (this.mode === 'to-learn') {
        const allCompleted = this.readItems.size === MASTER_TABLE_DATA.length;
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="empty-table-state">
              <div class="empty-text">
                ${allCompleted 
                  ? '🎉 வாழ்த்துகள்! அனைத்துச் சொற்களையும் படித்து முடித்துவிட்டீர்கள்!' 
                  : '🔍 தேடலுக்குப் பொருத்தமான சொற்கள் எதுவும் கிடைக்கவில்லை.'}
              </div>
              ${allCompleted 
                ? `<button class="btn btn-sm btn-outline mt-2" onclick="window.bhashaApp.switchMode('read')">
                     ✅ படித்தவை அட்டவணையைக் காண்க
                   </button>`
                : `<button class="btn btn-sm btn-outline mt-2" onclick="window.bhashaApp.filterCategory('all'); document.getElementById('global-search').value=''; window.bhashaApp.searchQuery=''; window.bhashaApp.renderTable();">
                     அனைத்துச் சொற்களையும் காட்டு
                   </button>`
              }
            </td>
          </tr>
        `;
      } else {
        // Read mode empty
        const noReadYet = this.readItems.size === 0;
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="empty-table-state">
              <div class="empty-text">
                ${noReadYet 
                  ? '📖 படித்தவை அட்டவணை காலியாக உள்ளது.' 
                  : '🔍 தேடலுக்குப் பொருத்தமான படித்த சொற்கள் இல்லை.'}
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
                ${noReadYet 
                  ? "'படிக்க வேண்டியவை' அட்டவணையில் உள்ள 'Read' பொத்தானை அழுத்தினால், அந்த வரிசை இங்கு வந்து சேரும்." 
                  : 'தேடல் சொல்லை மாற்றிப் பார்க்கவும்.'}
              </p>
              ${noReadYet ? `
                <button class="btn btn-sm btn-outline" onclick="window.bhashaApp.switchMode('to-learn')">
                  👈 படிக்க வேண்டியவை அட்டவணைக்குச் செல்
                </button>
              ` : `
                <button class="btn btn-sm btn-outline" onclick="document.getElementById('global-search').value=''; window.bhashaApp.searchQuery=''; window.bhashaApp.renderTable();">
                  அனைத்துப் படித்த சொற்களையும் காட்டு
                </button>
              `}
            </td>
          </tr>
        `;
      }
      return;
    }

    const isReadMode = this.mode === 'read';

    tbody.innerHTML = filtered.map((row, idx) => {
      const esc = (str) => (str ? str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;') : '');
      const safeTa = esc(row.tamil);
      const safeTe = esc(row.teluguScript);
      const safeTeSub = esc(row.teluguSub);
      const safeKn = esc(row.kannadaScript);
      const safeKnSub = esc(row.kannadaSub);
      const safeHi = esc(row.hindiScript);
      const safeHiSub = esc(row.hindiSub);

      return `
      <tr class="table-row" id="row-${row._id}">
        <td class="cell-num">${idx + 1}</td>
        
        <!-- TAMIL -->
        <td class="cell-tamil">
          <div class="tamil-cell-inner">
            <span class="mobile-num-badge">#${idx + 1}</span>
            <div class="tamil-main-phrase">${row.tamil}</div>
            
            <button class="table-audio-btn btn-ta" onclick="window.bhashaApp.speak('${safeTa}', 'ta-IN', '${safeTa}', this)" title="தமிழ் ஒலி" style="margin-left: 0.5rem;">
              🔊
            </button>

            <!-- Mobile Action Button -->
            <div class="mobile-card-action">
              ${isReadMode ? `
                <button class="btn-read-action btn-unmark-read" onclick="window.bhashaApp.markAsUnread(${row._id}, this)" title="Undo">
                  Undo
                </button>
              ` : `
                <button class="btn-read-action btn-mark-read" onclick="window.bhashaApp.markAsRead(${row._id}, this)" title="Mark as read">
                  Read
                </button>
              `}
            </div>
          </div>
        </td>

        <!-- TELUGU (தெலுங்கு) -->
        <td class="cell-lang cell-te" data-label="தெலுங்கு">
          <div class="speak-cell-wrap">
            <span class="mobile-lang-tag tag-te">தெலுங்கு:</span>
            <div class="speak-text-box">
              <span class="speak-tamil-bold">${row.teluguSpeak}</span>
              <span class="phonetic-sub">(${row.teluguSub})</span>
            </div>
            <button class="table-audio-btn btn-te" onclick="window.bhashaApp.speak('${safeTe}', 'te-IN', '${safeTeSub}', this)" title="தெலுங்கு ஒலி">
              🔊
            </button>
          </div>
        </td>

        <!-- KANNADA (கன்னடம்) -->
        <td class="cell-lang cell-kn" data-label="கன்னடம்">
          <div class="speak-cell-wrap">
            <span class="mobile-lang-tag tag-kn">கன்னடம்:</span>
            <div class="speak-text-box">
              <span class="speak-tamil-bold">${row.kannadaSpeak}</span>
              <span class="phonetic-sub">(${row.kannadaSub})</span>
            </div>
            <button class="table-audio-btn btn-kn" onclick="window.bhashaApp.speak('${safeKn}', 'kn-IN', '${safeKnSub}', this)" title="கன்னட ஒலி">
              🔊
            </button>
          </div>
        </td>

        <!-- HINDI (இந்தி) -->
        <td class="cell-lang cell-hi" data-label="இந்தி">
          <div class="speak-cell-wrap">
            <span class="mobile-lang-tag tag-hi">இந்தி:</span>
            <div class="speak-text-box">
              <span class="speak-tamil-bold">${row.hindiSpeak}</span>
              <span class="phonetic-sub">(${row.hindiSub})</span>
            </div>
            <button class="table-audio-btn btn-hi" onclick="window.bhashaApp.speak('${safeHi}', 'hi-IN', '${safeHiSub}', this)" title="இந்தி ஒலி">
              🔊
            </button>
          </div>
        </td>

        <!-- ACTION (Read / Undo) -->
        <td class="cell-action">
          ${isReadMode ? `
            <button class="btn-read-action btn-unmark-read" onclick="window.bhashaApp.markAsUnread(${row._id}, this)" title="Undo">
              Undo
            </button>
          ` : `
            <button class="btn-read-action btn-mark-read" onclick="window.bhashaApp.markAsRead(${row._id}, this)" title="Mark as read">
              Read
            </button>
          `}
        </td>
      </tr>
      `;
    }).join('');
  }
}

// Global initialization
window.bhashaApp = new BhashaApp();
document.addEventListener('DOMContentLoaded', () => {
  window.bhashaApp.init();
});
