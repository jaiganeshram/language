// Short Descriptions & Visual Scenes Application Controller
// Unified Single Panel View per Description / Visual Scene ("Don't Split - Single Unified Slate")
// Full Paragraphs in Tamil, English, spoken Telugu, spoken Kannada, and spoken Hindi with Web Speech Audio

class ShortDescriptionsApp {
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
      const saved = localStorage.getItem('bhasha_read_short_descriptions');
      this.readItems = new Set(saved ? JSON.parse(saved) : []);
    } catch (e) {
      this.readItems = new Set();
    }

    // Lightbox modal state
    this.isLightboxOpen = false;
    this.currentLightboxStoryId = null;
    this.currentLightboxLang = 'english';
    this.isLightboxFooterCollapsed = true; // default collapsed to maximize vertical reading space

    // Custom dropdown state
    this.isCustomDropdownOpen = false;

    this.categories = [
      { id: 'all', label: '📌 அனைத்தும் (All Descriptions)' },
      { id: 'nature', label: '🌿 இயற்கை காட்சிகள் (Nature)' },
      { id: 'places', label: '🏛️ இடங்கள் & நகரங்கள் (Places)' },
      { id: 'people', label: '👷‍♂️ மனிதர்கள் & தொழில்கள் (People)' },
      { id: 'animals', label: '🐾 பிராணிகள் & பறவைகள் (Animals)' },
      { id: 'objects', label: '⚙️ அன்றாட பொருட்கள் (Everyday Objects)' },
      { id: 'habits', label: '🌱 நற்பழக்கங்கள் (Good Habits)' },
      { id: 'festivals', label: '🎉 பண்டிகைகள் & விழாக்கள் (Festivals)' },
      { id: 'food', label: '🍲 பாரம்பரிய உணவுகள் (Food & Wellness)' }
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

    // Custom Story Dropdown Trigger Click
    const customTrigger = document.getElementById('story-custom-trigger');
    if (customTrigger) {
      customTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCustomStoryDropdown();
      });
    }

    // Custom Dropdown Search Input
    const customSearchInput = document.getElementById('story-custom-search-input');
    if (customSearchInput) {
      customSearchInput.addEventListener('input', (e) => {
        this.filterCustomStorySearch(e.target.value);
      });
      customSearchInput.addEventListener('click', (e) => e.stopPropagation());
      customSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeCustomStoryDropdown();
        }
      });
    }

    // Custom Dropdown Clear Button
    const customSearchClear = document.getElementById('story-custom-search-clear');
    if (customSearchClear) {
      customSearchClear.addEventListener('click', (e) => {
        e.stopPropagation();
        if (customSearchInput) {
          customSearchInput.value = '';
          this.filterCustomStorySearch('');
          customSearchInput.focus();
        }
      });
    }

    // Prevent clicks inside menu from bubbling to document
    const customMenu = document.getElementById('story-custom-menu');
    if (customMenu) {
      customMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    // Close Custom Dropdown on Outside Click
    document.addEventListener('click', () => {
      this.closeCustomStoryDropdown();
    });

    // Keyboard Escape key to close lightbox & custom dropdown
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isCustomDropdownOpen) {
          this.closeCustomStoryDropdown();
        } else if (this.isLightboxOpen) {
          this.closeLightbox();
        }
      }
    });
  }

  renderCategoryFilter() {
    const container = document.getElementById('category-filter-bar');
    if (!container) return;

    container.innerHTML = this.categories.map(c => `
      <button class="cat-filter-btn ${this.selectedCategory === c.id ? 'active' : ''}" 
              onclick="window.shortDescApp.filterCategory('${c.id}')">
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
    let availableStories = SHORT_DESCRIPTIONS_DATA;
    if (this.selectedCategory !== 'all') {
      availableStories = availableStories.filter(s => s.category === this.selectedCategory);
    }

    // 1. Update native <select> for backward compatibility
    if (selectEl) {
      const options = [
        `<option value="all" ${this.selectedStory === 'all' ? 'selected' : ''}>📌 எல்லா விவரிப்புகளையும் தொடர்ச்சியாகக் காட்டு (All ${availableStories.length} Items)</option>`,
        ...availableStories.map((s, idx) => {
          const isSelected = this.selectedStory === s.id ? 'selected' : '';
          const titleTa = s.titleTamil || s.title;
          const titleEn = s.titleEnglish || s.titleEn;
          return `<option value="${s.id}" ${isSelected}>${idx + 1}. ${s.icon || '📝'} ${titleTa} (${titleEn})</option>`;
        })
      ];
      selectEl.innerHTML = options.join('');
      selectEl.value = this.selectedStory;
    }

    // 2. Update Custom Dropdown Label & Icon
    const customLabel = document.getElementById('story-custom-label');
    if (customLabel) {
      if (this.selectedStory === 'all') {
        customLabel.textContent = `📌 அனைத்து விவரிப்புகளையும் தொடர்ச்சியாகக் காட்டு (All ${availableStories.length} Items)`;
      } else {
        const selStory = availableStories.find(s => s.id === this.selectedStory) || SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.selectedStory);
        if (selStory) {
          const titleTa = selStory.titleTamil || selStory.title;
          const titleEn = selStory.titleEnglish || selStory.titleEn;
          const storyIndex = availableStories.findIndex(s => s.id === this.selectedStory);
          const numPrefix = storyIndex >= 0 ? `${storyIndex + 1}. ` : '';
          customLabel.textContent = `${numPrefix}${selStory.icon || '📝'} ${titleTa} (${titleEn})`;
        } else {
          customLabel.textContent = `📌 அனைத்து விவரிப்புகளையும் தொடர்ச்சியாகக் காட்டு (All ${availableStories.length} Items)`;
        }
      }
    }

    // 3. Render Custom Dropdown Items (with ALWAYS visible prominent scrollbar)
    const listEl = document.getElementById('story-custom-list');
    if (listEl) {
      const isAllActive = this.selectedStory === 'all';
      const allItemHtml = `
        <div class="custom-menu-item ${isAllActive ? 'active' : ''}" data-value="all" data-search="all அனைத்தும் எல்லா" onclick="window.shortDescApp.selectCustomStory('all')">
          <span class="item-badge-all">📌</span>
          <div class="item-text-group">
            <div class="item-title-ta">அனைத்து விவரிப்புகளையும் தொடர்ச்சியாகக் காட்டு</div>
            <div class="item-title-en">Show all ${availableStories.length} items continuously</div>
          </div>
          ${isAllActive ? '<span class="item-check">✓</span>' : ''}
        </div>
      `;

      const storyItemsHtml = availableStories.map((s, idx) => {
        const isActive = this.selectedStory === s.id;
        const titleTa = s.titleTamil || s.title;
        const titleEn = s.titleEnglish || s.titleEn;
        const searchText = `${idx + 1} ${(titleTa || '').toLowerCase()} ${(titleEn || '').toLowerCase()}`;
        return `
          <div class="custom-menu-item ${isActive ? 'active' : ''}" data-value="${s.id}" data-search="${searchText}" onclick="window.shortDescApp.selectCustomStory(${s.id})">
            <span class="item-num-badge">${idx + 1}</span>
            <span class="item-icon">${s.icon || '📝'}</span>
            <div class="item-text-group">
              <div class="item-title-ta">${titleTa}</div>
              <div class="item-title-en">${titleEn || ''}</div>
            </div>
            ${isActive ? '<span class="item-check">✓</span>' : ''}
          </div>
        `;
      }).join('');

      listEl.innerHTML = allItemHtml + storyItemsHtml;
    }

    // 4. Update Footer Count Badge
    const countBadge = document.getElementById('story-custom-count-badge');
    if (countBadge) {
      countBadge.textContent = `மொத்தம் ${availableStories.length} விவரிப்புகள்`;
    }

    const btnAll = document.getElementById('btn-all-stories');
    if (btnAll) {
      btnAll.classList.toggle('active', this.selectedStory === 'all');
    }

    const btnViewNav = document.getElementById('btn-view-story-nav');
    if (btnViewNav) {
      if (this.selectedStory !== 'all') {
        const selStory = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.selectedStory);
        const titleTa = selStory ? (selStory.titleTamil || selStory.title) : 'ஒப்பீடு';
        btnViewNav.innerHTML = `👁️ View (${titleTa})`;
        btnViewNav.title = `தேர்வு செய்த விவரிப்பை ஒப்பிட்டுப் பார்க்க (Side-by-Side Lightbox View)`;
      } else {
        btnViewNav.innerHTML = '👁️ View (ஒப்பீடு)';
        btnViewNav.title = 'முதல் விவரிப்பை ஒப்பிட்டுப் பார்க்க (Side-by-Side Lightbox View)';
      }
    }
  }

  toggleCustomStoryDropdown() {
    if (this.isCustomDropdownOpen) {
      this.closeCustomStoryDropdown();
    } else {
      this.openCustomStoryDropdown();
    }
  }

  openCustomStoryDropdown() {
    const menu = document.getElementById('story-custom-menu');
    const arrow = document.getElementById('story-custom-arrow');
    const trigger = document.getElementById('story-custom-trigger');
    const searchInput = document.getElementById('story-custom-search-input');
    const searchClear = document.getElementById('story-custom-search-clear');
    if (!menu) return;

    this.isCustomDropdownOpen = true;
    menu.style.display = 'flex';
    if (arrow) arrow.classList.add('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    // Reset search
    if (searchInput) {
      searchInput.value = '';
      if (searchClear) searchClear.style.display = 'none';
      this.filterCustomStorySearch('');
      setTimeout(() => searchInput.focus(), 50);
    }

    // Automatically scroll to active item so user sees current position immediately
    setTimeout(() => {
      const activeItem = menu.querySelector('.custom-menu-item.active');
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    }, 60);

    window.bhashaAudio.playSfx('click');
  }

  closeCustomStoryDropdown() {
    const menu = document.getElementById('story-custom-menu');
    const arrow = document.getElementById('story-custom-arrow');
    const trigger = document.getElementById('story-custom-trigger');
    if (!menu) return;

    this.isCustomDropdownOpen = false;
    menu.style.display = 'none';
    if (arrow) arrow.classList.remove('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  selectCustomStory(storyId) {
    this.closeCustomStoryDropdown();
    this.filterStory(storyId);
  }

  filterCustomStorySearch(query) {
    const q = (query || '').toLowerCase().trim();
    const listEl = document.getElementById('story-custom-list');
    const searchClear = document.getElementById('story-custom-search-clear');
    const countBadge = document.getElementById('story-custom-count-badge');
    if (!listEl) return;

    if (searchClear) {
      searchClear.style.display = q ? 'flex' : 'none';
    }

    const items = listEl.querySelectorAll('.custom-menu-item');
    let matchCount = 0;
    items.forEach(item => {
      const searchData = item.getAttribute('data-search') || '';
      const isAll = item.getAttribute('data-value') === 'all';
      if (!q || isAll || searchData.includes(q)) {
        item.style.display = 'flex';
        if (!isAll) matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (countBadge) {
      if (q) {
        countBadge.textContent = `${matchCount} விவரிப்புகள் பொருந்துகின்றன`;
      } else {
        let availableStories = SHORT_DESCRIPTIONS_DATA;
        if (this.selectedCategory !== 'all') {
          availableStories = availableStories.filter(s => s.category === this.selectedCategory);
        }
        countBadge.textContent = `மொத்தம் ${availableStories.length} விவரிப்புகள்`;
      }
    }
  }

  filterStory(storyId) {
    if (storyId === 'all') {
      this.selectedStory = 'all';
    } else {
      this.selectedStory = parseInt(storyId, 10);
      // Clear search query so old search doesn't hide the selected story
      const searchInput = document.getElementById('story-search');
      if (searchInput && this.searchQuery) {
        searchInput.value = '';
        this.searchQuery = '';
      }
      // If the selected story belongs to another category, adjust category to 'all'
      const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.selectedStory);
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
        ? (SHORT_DESCRIPTIONS_DATA.find(s => s.category === this.selectedCategory) || SHORT_DESCRIPTIONS_DATA[0])
        : SHORT_DESCRIPTIONS_DATA[0];
      targetId = first ? first.id : null;
    }
    if (targetId) {
      this.openLightbox(targetId);
    }
  }

  navigateStory(direction) {
    let availableStories = SHORT_DESCRIPTIONS_DATA;
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
    const totalStories = SHORT_DESCRIPTIONS_DATA.length;
    const totalRead = this.readItems.size;
    const totalUnread = totalStories - totalRead;

    if (unreadEl) unreadEl.textContent = totalUnread;
    if (readEl) readEl.textContent = totalRead;
    if (totalBadgeEl) {
      totalBadgeEl.textContent = `${totalStories} விவரிப்புகள் & காட்சிகள் (முழுப் பத்திகள்)`;
    }
  }

  markStoryRead(storyId, btnEl) {
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.unified-story-card');
      if (card) card.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('success');
    this.readItems.add(storyId);
    this.persistReadItems();
    this.showToast(`✅ "${story.titleTamil || story.title}" -> Read!`);

    setTimeout(() => {
      this.updateCounts();
      this.renderStories();
    }, 220);
  }

  markStoryUnread(storyId, btnEl) {
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === storyId);
    if (!story) return;

    if (btnEl) {
      const card = btnEl.closest('.unified-story-card');
      if (card) card.classList.add('row-fade-out');
    }

    window.bhashaAudio.playSfx('click');
    this.readItems.delete(storyId);
    this.persistReadItems();
    this.showToast(`↩️ "${story.titleTamil || story.title}" -> To Learn!`);

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
      localStorage.setItem('bhasha_read_short_descriptions', JSON.stringify(Array.from(this.readItems)));
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

    const totalStories = SHORT_DESCRIPTIONS_DATA.length;
    const isReadMode = this.mode === 'read';

    let filteredStories;
    if (this.selectedStory !== 'all') {
      // When a specific story is chosen from the combobox, ALWAYS show that exact story
      const targetStory = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.selectedStory);
      filteredStories = targetStory ? [targetStory] : [];
    } else {
      filteredStories = SHORT_DESCRIPTIONS_DATA.filter(story => {
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
        const titleTa = (s.titleTamil || s.title || '').toLowerCase();
        const titleEn = (s.titleEnglish || s.titleEn || '').toLowerCase();
        const tagline = (s.tagline || s.summary || '').toLowerCase();
        const vocabStr = s.vocabulary ? s.vocabulary.map(v => `${v.tamil} ${v.english} ${v.telugu} ${v.kannada} ${v.hindi}`).join(' ').toLowerCase() : '';

        return (
          titleTa.includes(q) ||
          titleEn.includes(q) ||
          tagline.includes(q) ||
          vocabStr.includes(q) ||
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
        ? `படித்தவை: <strong>${filteredStories.length}</strong> / ${totalInMode} விவரிப்புகள் & காட்சிகள்`
        : `படிக்க வேண்டியவை: <strong>${filteredStories.length}</strong> / ${totalInMode} விவரிப்புகள் & காட்சிகள்`;
    }

    if (filteredStories.length === 0) {
      if (!isReadMode) {
        const allCompleted = this.readItems.size === totalStories;
        wrapper.innerHTML = `
          <div class="empty-table-state" style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 3rem 1.5rem; text-align: center; border: 1px solid var(--border-color);">
            <div class="empty-text">
              ${allCompleted 
                ? '🎉 வாழ்த்துகள்! அனைத்து விவரிப்புகளையும் படித்து முடித்துவிட்டீர்கள்!' 
                : '🔍 தேடலுக்குப் பொருத்தமான பகுதிகள் எதுவும் கிடைக்கவில்லை.'}
            </div>
            ${allCompleted 
              ? `<button class="btn btn-sm btn-outline mt-2" onclick="window.shortDescApp.switchMode('read')">
                   ✅ படித்தவை அட்டவணையைக் காண்க
                 </button>`
              : `<button class="btn btn-sm btn-outline mt-2" onclick="window.shortDescApp.filterCategory('all'); window.shortDescApp.filterStory('all'); document.getElementById('story-search').value=''; window.shortDescApp.searchQuery=''; window.shortDescApp.renderStories();">
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
                : '🔍 தேடலுக்குப் பொருத்தமான படித்த விவரிப்புகள் இல்லை.'}
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0;">
              ${noReadYet 
                ? "'படிக்க வேண்டியவை' அட்டவணையில் உள்ள தலைப்பில் உள்ள 'Read' பொத்தானை அழுத்தினால், அது இங்கு வந்து சேரும்." 
                : 'தேடல் சொல்லை மாற்றிப் பார்க்கவும்.'}
            </p>
            ${noReadYet ? `
              <button class="btn btn-sm btn-outline" onclick="window.shortDescApp.switchMode('to-learn')">
                👈 படிக்க வேண்டியவை பகுதிக்குச் செல்
              </button>
            ` : `
              <button class="btn btn-sm btn-outline" onclick="document.getElementById('story-search').value=''; window.shortDescApp.searchQuery=''; window.shortDescApp.renderStories();">
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

    // Render Unified Single Slate Panel per Description
    wrapper.innerHTML = filteredStories.map(story => {
      const safeEn = esc(story.fullEnglish);
      const safeTa = esc(story.fullTamil);
      const safeTe = esc(story.fullTeluguScript);
      const safeTeSub = esc(story.fullTeluguSub);
      const safeKn = esc(story.fullKannadaScript);
      const safeKnSub = esc(story.fullKannadaSub);
      const safeHi = esc(story.fullHindiScript);
      const safeHiSub = esc(story.fullHindiSub);

      const titleTa = story.titleTamil || story.title;
      const titleEn = story.titleEnglish || story.titleEn;

      return `
        <article class="unified-story-card" id="story-${story.id}">
          <!-- Unified Card Header -->
          <div class="unified-card-header">
            <div class="card-title-group">
              <span class="card-icon">${story.icon || '📝'}</span>
              <div>
                <h2 class="card-title-ta">${titleTa}</h2>
                <span class="card-title-en">${titleEn}</span>
              </div>
              <span class="vocab-tag" style="background: rgba(6, 182, 212, 0.15); color: #22d3ee; border-color: rgba(6, 182, 212, 0.3);">
                ${story.categoryTamil || 'விவரிப்பு'}
              </span>
            </div>

            <!-- Read / View Action Buttons -->
            <div class="card-action-group">
              <button class="btn-view-action convo-btn-action" onclick="window.shortDescApp.openLightbox(${story.id})" title="ஒப்பீட்டு வாசிப்பு முறை (Side-by-Side Lightbox View)">
                👁️ View
              </button>
              ${isReadMode ? `
                <button class="btn-read-action btn-unmark-read convo-btn-action" onclick="window.shortDescApp.markStoryUnread(${story.id}, this)" title="மீண்டும் படிக்க வேண்டிய பட்டியலுக்கு மாற்று">
                  Undo
                </button>
              ` : `
                <button class="btn-read-action btn-mark-read convo-btn-action" onclick="window.shortDescApp.markStoryRead(${story.id}, this)" title="இப்பகுதியைப் படித்ததாகக் குறி">
                  Read
                </button>
              `}
            </div>
          </div>

          <!-- Tagline & Vocab Details -->
          <div class="unified-meta-row">
            <div class="unified-summary">${story.tagline || ''}</div>
            ${story.vocabulary && story.vocabulary.length ? `
              <div class="unified-vocab-wrap">
                <span style="font-weight: 700; color: #f59e0b;">✨ கலைச்சொற்கள்:</span>
                ${story.vocabulary.map(v => {
                  const en = v.english && v.english !== v.tamil ? ` (${v.english})` : '';
                  return `<span class="vocab-tag">${v.tamil || v}${en}</span>`;
                }).join(' ')}
              </div>
            ` : ''}
          </div>

          <!-- SINGLE UNIFIED READING SLATE (Don't Split - Single Unified Slate) -->
          <div class="single-slate-panel">
            
            <!-- 1. Tamil Full Passage -->
            ${showTa ? `
              <div class="slate-lang-section slate-ta">
                <div class="slate-section-header">
                  <span class="slate-lang-badge badge-ta">🇮🇳 தமிழ் (Tamil)</span>
                  <button class="slate-audio-btn btn-ta" onclick="window.shortDescApp.speak('${safeTa}', 'ta-IN', '${safeTa}', this)" title="தமிழில் முழுப் பத்தியையும் கேட்க">
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
                  <button class="slate-audio-btn btn-en" onclick="window.shortDescApp.speak('${safeEn}', 'en-US', '${safeEn}', this)" title="ஆங்கிலத்தில் முழுப் பத்தியையும் கேட்க">
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
                  <button class="slate-audio-btn btn-te" onclick="window.shortDescApp.speak('${safeTe}', 'te-IN', '${safeTeSub}', this)" title="தெலுங்கில் முழுப் பத்தியையும் கேட்க">
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
                  <button class="slate-audio-btn btn-kn" onclick="window.shortDescApp.speak('${safeKn}', 'kn-IN', '${safeKnSub}', this)" title="கன்னடத்தில் முழுப் பத்தியையும் கேட்க">
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
                  <button class="slate-audio-btn btn-hi" onclick="window.shortDescApp.speak('${safeHi}', 'hi-IN', '${safeHiSub}', this)" title="இந்தியில் முழுப் பத்தியையும் கேட்க">
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
    const sId = typeof storyId === 'number' ? storyId : parseInt(storyId, 10);
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === sId);
    if (!story) return;

    this.currentLightboxStoryId = sId;
    this.isLightboxOpen = true;

    const titleTa = story.titleTamil || story.title;
    const titleEn = story.titleEnglish || story.titleEn;

    this.currentLightboxStoryId = storyId;
    this.isLightboxOpen = true;
    this.stopSequentialLightboxAudio();

    // Header info
    const iconEl = document.getElementById('lb-icon');
    const titleTaEl = document.getElementById('lb-title-ta');
    const titleEnEl = document.getElementById('lb-title-en');
    const badgeEl = document.getElementById('lb-badge');
    if (iconEl) iconEl.innerText = story.icon || '📝';
    if (titleTaEl) titleTaEl.innerText = titleTa;
    if (titleEnEl) titleEnEl.innerText = titleEn;
    if (badgeEl) badgeEl.innerText = story.categoryTamil || 'விவரிப்பு';

    // Populate Topic Selector in Lightbox Header
    const jumpSelect = document.getElementById('lb-story-jump-select');
    if (jumpSelect) {
      jumpSelect.innerHTML = SHORT_DESCRIPTIONS_DATA.map((s, idx) => {
        const tTa = s.titleTamil || s.title;
        return `<option value="${s.id}" ${s.id === storyId ? 'selected' : ''}>${idx + 1}. ${s.icon || '📝'} ${tTa}</option>`;
      }).join('');
      jumpSelect.value = storyId;
    }

    // Left Column: Line-by-Line Tamil Content
    const tamilBox = document.getElementById('lb-content-tamil');
    const taLines = this.splitSentences(story.fullTamil);
    if (tamilBox) {
      tamilBox.innerHTML = `
        <div class="text-tamil-body">
          ${taLines.map((line, idx) => `
            <div class="lb-sentence sentence-ta" data-line-index="${idx}" title="Click to listen line in Tamil">
              <div style="display: flex; align-items: baseline;">
                <span class="line-num-badge">${idx + 1}</span>
                <span class="sentence-ta-text">${this.escapeHtml(line)}</span>
              </div>
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

    // Populate Vocab & Tagline Footer Drawer
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

  splitSentences(text) {
    if (!text) return [];
    return text.split(/(?<=[.?!])\s+/).map(s => s.trim()).filter(Boolean);
  }

  changeLightboxLang(lang) {
    this.currentLightboxLang = lang;
    this.stopSequentialLightboxAudio();
    this.updateLightboxOtherContent();
    window.bhashaAudio.playSfx('click');
  }

  updateLightboxOtherContent() {
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    const contentBox = document.getElementById('lb-content-other');
    const audioBtn = document.getElementById('lb-btn-audio-other');
    if (!contentBox || !audioBtn) return;

    audioBtn.className = 'slate-audio-btn';
    let targetLangCode = 'en-US';

    if (this.currentLightboxLang === 'english') {
      const enLines = this.splitSentences(story.fullEnglish);
      contentBox.innerHTML = `
        <div class="text-english-body">
          ${enLines.map((line, idx) => `
            <div class="lb-sentence sentence-en" data-line-index="${idx}" title="Click to listen line in English">
              <div style="display: flex; align-items: baseline;">
                <span class="line-num-badge">${idx + 1}</span>
                <div class="english-line-text">${this.escapeHtml(line)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-en');
      audioBtn.innerHTML = '🔊 Listen English';
      targetLangCode = 'en-US';
    } else if (this.currentLightboxLang === 'telugu') {
      const teSpeak = this.splitSentences(story.fullTeluguSpeak);
      const teSub = this.splitSentences(story.fullTeluguSub);
      contentBox.innerHTML = `
        <div class="text-telugu-body">
          ${teSpeak.map((speak, idx) => {
            const sub = teSub[idx] || '';
            return `
              <div class="lb-sentence sentence-te" data-line-index="${idx}" title="Click to listen line in Telugu">
                <div style="display: flex; align-items: baseline;">
                  <span class="line-num-badge">${idx + 1}</span>
                  <div class="speak-tamil-bold">${this.escapeHtml(speak)}</div>
                </div>
                ${sub ? `<div class="speak-en-sub phonetic-sub" style="margin-left: 28px !important;">(${this.escapeHtml(sub)})</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-te');
      audioBtn.innerHTML = '🔊 தெலுங்கு ஒலி (Listen Telugu)';
      targetLangCode = 'te-IN';
    } else if (this.currentLightboxLang === 'kannada') {
      const knSpeak = this.splitSentences(story.fullKannadaSpeak);
      const knSub = this.splitSentences(story.fullKannadaSub);
      contentBox.innerHTML = `
        <div class="text-kannada-body">
          ${knSpeak.map((speak, idx) => {
            const sub = knSub[idx] || '';
            return `
              <div class="lb-sentence sentence-kn" data-line-index="${idx}" title="Click to listen line in Kannada">
                <div style="display: flex; align-items: baseline;">
                  <span class="line-num-badge">${idx + 1}</span>
                  <div class="speak-tamil-bold">${this.escapeHtml(speak)}</div>
                </div>
                ${sub ? `<div class="speak-en-sub phonetic-sub" style="margin-left: 28px !important;">(${this.escapeHtml(sub)})</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      audioBtn.classList.add('btn-kn');
      audioBtn.innerHTML = '🔊 கன்னட ஒலி (Listen Kannada)';
      targetLangCode = 'kn-IN';
    } else if (this.currentLightboxLang === 'hindi') {
      const hiSpeak = this.splitSentences(story.fullHindiSpeak);
      const hiSub = this.splitSentences(story.fullHindiSub);
      contentBox.innerHTML = `
        <div class="text-hindi-body">
          ${hiSpeak.map((speak, idx) => {
            const sub = hiSub[idx] || '';
            return `
              <div class="lb-sentence sentence-hi" data-line-index="${idx}" title="Click to listen line in Hindi">
                <div style="display: flex; align-items: baseline;">
                  <span class="line-num-badge">${idx + 1}</span>
                  <div class="speak-tamil-bold">${this.escapeHtml(speak)}</div>
                </div>
                ${sub ? `<div class="speak-en-sub phonetic-sub" style="margin-left: 28px !important;">(${this.escapeHtml(sub)})</div>` : ''}
              </div>
            `;
          }).join('')}
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
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    this.stopSequentialLightboxAudio();

    const modal = document.getElementById('story-lightbox');
    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
      modal.querySelectorAll(`.lb-sentence[data-line-index="${lineIdx}"]`).forEach(s => s.classList.add('synced-active-speaking'));
    }

    let text = '';
    let langCode = 'ta-IN';
    let subFallback = '';

    if (lang === 'tamil') {
      const lines = this.splitSentences(story.fullTamil);
      text = lines[lineIdx] || '';
      langCode = 'ta-IN';
      subFallback = text;
    } else if (lang === 'english') {
      const lines = this.splitSentences(story.fullEnglish);
      text = lines[lineIdx] || '';
      langCode = 'en-US';
      subFallback = text;
    } else if (lang === 'telugu') {
      const scripts = this.splitSentences(story.fullTeluguScript);
      const speaks = this.splitSentences(story.fullTeluguSpeak);
      const subs = this.splitSentences(story.fullTeluguSub);
      text = scripts[lineIdx] || speaks[lineIdx] || '';
      subFallback = subs[lineIdx] || speaks[lineIdx] || '';
      langCode = 'te-IN';
    } else if (lang === 'kannada') {
      const scripts = this.splitSentences(story.fullKannadaScript);
      const speaks = this.splitSentences(story.fullKannadaSpeak);
      const subs = this.splitSentences(story.fullKannadaSub);
      text = scripts[lineIdx] || speaks[lineIdx] || '';
      subFallback = subs[lineIdx] || speaks[lineIdx] || '';
      langCode = 'kn-IN';
    } else if (lang === 'hindi') {
      const scripts = this.splitSentences(story.fullHindiScript);
      const speaks = this.splitSentences(story.fullHindiSpeak);
      const subs = this.splitSentences(story.fullHindiSub);
      text = scripts[lineIdx] || speaks[lineIdx] || '';
      subFallback = subs[lineIdx] || speaks[lineIdx] || '';
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
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.currentLightboxStoryId);
    if (!story) return;

    this.stopSequentialLightboxAudio();
    this.isLightboxPlaying = true;
    this.lightboxPlayLang = targetLang;
    this.lightboxPlayIndex = 0;

    let lines = [];
    let subs = [];

    if (targetLang === 'ta-IN') {
      lines = this.splitSentences(story.fullTamil);
      subs = lines;
    } else if (targetLang === 'en-US') {
      lines = this.splitSentences(story.fullEnglish);
      subs = lines;
    } else if (targetLang === 'te-IN') {
      lines = this.splitSentences(story.fullTeluguScript || story.fullTeluguSpeak);
      subs = this.splitSentences(story.fullTeluguSub || story.fullTeluguSpeak);
    } else if (targetLang === 'kn-IN') {
      lines = this.splitSentences(story.fullKannadaScript || story.fullKannadaSpeak);
      subs = this.splitSentences(story.fullKannadaSub || story.fullKannadaSpeak);
    } else if (targetLang === 'hi-IN') {
      lines = this.splitSentences(story.fullHindiScript || story.fullHindiSpeak);
      subs = this.splitSentences(story.fullHindiSub || story.fullHindiSpeak);
    }

    this.lightboxPlayLines = lines;
    this.lightboxPlaySubs = subs;

    // Toggle button state
    const btn = targetLang === 'ta-IN' ? document.getElementById('lb-btn-audio-ta') : document.getElementById('lb-btn-audio-other');
    if (btn) {
      btn.classList.add('active-speaking');
      btn.dataset.prevHtml = btn.innerHTML;
      btn.innerHTML = '⏹️ நிறுத்து (Stop)';
    }

    this.playNextLightboxLine();
  }

  playNextLightboxLine() {
    if (!this.isLightboxPlaying || this.lightboxPlayIndex >= this.lightboxPlayLines.length) {
      this.stopSequentialLightboxAudio();
      this.showToast('🎉 வாசிப்பு ஒலி நிறைவடைந்தது!');
      return;
    }

    const idx = this.lightboxPlayIndex;
    const text = this.lightboxPlayLines[idx];
    const sub = this.lightboxPlaySubs[idx] || text;
    const modal = document.getElementById('story-lightbox');

    if (modal) {
      modal.querySelectorAll('.lb-sentence').forEach(s => s.classList.remove('synced-active-speaking'));
      const activeCards = modal.querySelectorAll(`.lb-sentence[data-line-index="${idx}"]`);
      activeCards.forEach(s => s.classList.add('synced-active-speaking'));
      if (activeCards[0]) {
        activeCards[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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
    const story = SHORT_DESCRIPTIONS_DATA.find(s => s.id === this.currentLightboxStoryId);
    const vocabBox = document.getElementById('lb-vocab-summary');
    if (!story || !vocabBox) return;

    const rawVocab = story.vocab || story.vocabulary || [];
    const items = window.getVocabComparison 
      ? window.getVocabComparison(rawVocab, story.id)
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
                      <button class="btn-vocab-speak" onclick="window.shortDescApp.speak('${this.escapeAudio(audioText)}', '${audioLang}', '${this.escapeAudio(spokenVal)}')" title="🔊 உச்சரிப்பைக் கேட்க">🔊</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    const summaryText = story.tagline || story.summary || '';
    vocabBox.innerHTML = `
      ${summaryText ? `<div class="lb-summary-text"><strong>💡 சுருக்கம் / விவரம்:</strong> ${this.escapeHtml(summaryText)}</div>` : ''}
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
    let availableStories = SHORT_DESCRIPTIONS_DATA;
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
  window.shortDescApp = new ShortDescriptionsApp();
  window.shortDescApp.init();
});
