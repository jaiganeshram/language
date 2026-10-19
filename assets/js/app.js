// ==========================================================================
// Tri-Lingual Story Reader Application Logic
// Tamil • Normal English • Advanced English (Max 15 Lines Per Story)
// ==========================================================================

let currentStory = STORIES_DATA[0];
let currentSentenceIndex = 0; // 0-indexed
let activeSpeechIndex = -1;
let isPlayingAll = false;
let currentViewMode = "parallel"; // "parallel" | "sentence"
let activeMobileTab = "tamil";
let currentFontSize = "md"; // "sm" | "md" | "lg"
let currentSpeechRate = 1.0;
let selectedSpeechLang = "en-US";
let currentQuizPairIndex = 0; // 2 questions at a time
let currentLightboxPanel = null; // "tamil" | "normal" | "advanced"
let currentVocabLang = "english"; // "english" | "telugu" | "kannada" | "hindi" | "all"
let currentQuizLang = "english";  // "english" | "telugu" | "kannada" | "hindi"

// Speech Synthesis Setup
const synth = window.speechSynthesis;
let speechUtterance = null;
let speechNextTimer = null;

const READ_STORIES_STORAGE_KEY = "trilingual_read_story_ids";
const CUSTOM_STORIES_STORAGE_KEY = "trilingual_custom_stories";
const AI_MARKED_STORIES_STORAGE_KEY = "trilingual_ai_marked_stories_v1";
const GEMINI_API_KEY_STORAGE = "trilingual_gemini_api_key";

let currentStoryTab = "active"; // "active" (To Read) | "hidden" (Read / Hidden)
let currentCategoryFilter = "all"; // "all" or specific category name
let currentSearchQuery = ""; // Search filter string

// DOM Elements Cache
const elements = {
  storyScrollContainer: document.getElementById("storyPillCards"),
  storyPlaceTitle: document.getElementById("storyPlaceTitle"),
  storyPlaceSubtitle: document.getElementById("storyPlaceSubtitle"),
  tabPlaceToRead: document.getElementById("tabPlaceToRead"),
  tabPlaceHidden: document.getElementById("tabPlaceHidden"),
  badgeToReadCount: document.getElementById("badgeToReadCount"),
  badgeHiddenCount: document.getElementById("badgeHiddenCount"),
  btnToggleRead: document.getElementById("btnToggleRead"),
  readMarkerText: document.getElementById("readMarkerText"),
  heroReadStatusBadge: document.getElementById("heroReadStatusBadge"),

  // AI Story Marker elements
  heroAiBadge: document.getElementById("heroAiBadge"),
  btnToggleAiMarker: document.getElementById("btnToggleAiMarker"),
  chipAiOnly: document.getElementById("chipAiOnly"),
  lightboxAiTag: document.getElementById("lightboxAiTag"),

  // Grid view & Topic Shelf controls
  btnToggleGridView: document.getElementById("btnToggleGridView"),
  toggleGridIcon: document.getElementById("toggleGridIcon"),
  toggleGridText: document.getElementById("toggleGridText"),
  btnJumpToTopics: document.getElementById("btnJumpToTopics"),
  btnPrevStory: document.getElementById("btnPrevStory"),
  btnNextStory: document.getElementById("btnNextStory"),
  quickStorySelect: document.getElementById("quickStorySelect"),
  floatingJumpToTopicsBtn: document.getElementById("floatingJumpToTopicsBtn"),

  // Search & Category Filters
  storySearchInput: document.getElementById("storySearchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  categoryFilterChips: document.getElementById("categoryFilterChips"),
  totalStoriesBadge: document.getElementById("totalStoriesBadge"),

  // AI Story Generator Elements
  btnOpenAiGenerator: document.getElementById("btnOpenAiGenerator"),
  aiModalOverlay: document.getElementById("aiModalOverlay"),
  aiModalCloseBtn: document.getElementById("aiModalCloseBtn"),
  aiTopicInput: document.getElementById("aiTopicInput"),
  aiCategorySelect: document.getElementById("aiCategorySelect"),
  aiIconSelect: document.getElementById("aiIconSelect"),
  btnGenerateStoryProcedural: document.getElementById("btnGenerateStoryProcedural"),
  btnGenerateStoryText: document.getElementById("btnGenerateStoryText"),
  btnGenerateStorySubtext: document.getElementById("btnGenerateStorySubtext"),
  aiGeneratingStatus: document.getElementById("aiGeneratingStatus"),
  aiStatusStep: document.getElementById("aiStatusStep"),
  aiStatusDesc: document.getElementById("aiStatusDesc"),
  btnCopyLlmPrompt: document.getElementById("btnCopyLlmPrompt"),
  aiPromptCopiedNotice: document.getElementById("aiPromptCopiedNotice"),
  geminiApiKeyInput: document.getElementById("geminiApiKeyInput"),
  btnSaveGeminiKey: document.getElementById("btnSaveGeminiKey"),
  btnClearGeminiKey: document.getElementById("btnClearGeminiKey"),
  geminiKeyStatus: document.getElementById("geminiKeyStatus"),
  aiJsonImportTextarea: document.getElementById("aiJsonImportTextarea"),
  btnImportJsonStory: document.getElementById("btnImportJsonStory"),

  heroCategory: document.getElementById("heroCategory"),
  heroLineCount: document.getElementById("heroLineCount"),
  heroReadTime: document.getElementById("heroReadTime"),
  heroNormalTitle: document.getElementById("heroNormalTitle"),
  heroTamilTitle: document.getElementById("heroTamilTitle"),
  heroTeluguTitle: document.getElementById("heroTeluguTitle"),
  heroKannadaTitle: document.getElementById("heroKannadaTitle"),
  heroHindiTitle: document.getElementById("heroHindiTitle"),
  heroAdvTitle: document.getElementById("heroAdvTitle"),
  heroSummaryNormal: document.getElementById("heroSummaryNormal"),
  heroSummaryTamil: document.getElementById("heroSummaryTamil"),
  heroSummaryTelugu: document.getElementById("heroSummaryTelugu"),
  heroSummaryKannada: document.getElementById("heroSummaryKannada"),
  heroSummaryHindi: document.getElementById("heroSummaryHindi"),

  // Panels
  panelTamilBody: document.getElementById("panelTamilBody"),
  panelNormalBody: document.getElementById("panelNormalBody"),
  panelTeluguBody: document.getElementById("panelTeluguBody"),
  panelKannadaBody: document.getElementById("panelKannadaBody"),
  panelHindiBody: document.getElementById("panelHindiBody"),
  panelAdvBody: document.getElementById("panelAdvBody"),

  // Panels root
  panelsGrid: document.getElementById("panelsGrid"),
  panelTamil: document.getElementById("panelTamil"),
  panelNormal: document.getElementById("panelNormal"),
  panelTelugu: document.getElementById("panelTelugu"),
  panelKannada: document.getElementById("panelKannada"),
  panelHindi: document.getElementById("panelHindi"),
  panelAdv: document.getElementById("panelAdv"),

  // Sentence Mode
  sentenceModeContainer: document.getElementById("sentenceModeContainer"),
  sentenceStepNum: document.getElementById("sentenceStepNum"),
  sentenceStepTotal: document.getElementById("sentenceStepTotal"),
  stepBlockTamil: document.getElementById("stepBlockTamil"),
  stepBlockNormal: document.getElementById("stepBlockNormal"),
  stepBlockTelugu: document.getElementById("stepBlockTelugu"),
  stepBlockKannada: document.getElementById("stepBlockKannada"),
  stepBlockHindi: document.getElementById("stepBlockHindi"),
  stepBlockAdv: document.getElementById("stepBlockAdv"),
  btnPrevSentence: document.getElementById("btnPrevSentence"),
  btnNextSentence: document.getElementById("btnNextSentence"),

  // Vocab Table & Quiz
  vocabTableBody: document.getElementById("vocabTableBody"),
  quizContainer: document.getElementById("quizContainer"),

  // Controls
  btnPlayStory: document.getElementById("btnPlayStory"),
  playBtnIcon: document.getElementById("playBtnIcon"),
  playBtnText: document.getElementById("playBtnText"),
  selectTtsVoice: document.getElementById("selectTtsVoice"),
  speechRateSelect: document.getElementById("speechRateSelect"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),

  // Split-Panel Lightbox Modal (Side-by-Side Reading Concept)
  storyLightbox: document.getElementById("story-lightbox"),
  panelLightbox: document.getElementById("story-lightbox"), // backward-compatibility
  storyLightboxContainer: document.getElementById("storyLightboxContainer"),
  lbIcon: document.getElementById("lb-icon"),
  lbTitleTa: document.getElementById("lb-title-ta"),
  lbTitleEn: document.getElementById("lb-title-en"),
  lbBadge: document.getElementById("lb-badge"),
  lbStoryJumpSelect: document.getElementById("lb-story-jump-select"),
  lbBtnAudioTa: document.getElementById("lb-btn-audio-ta"),
  lbContentTamil: document.getElementById("lb-content-tamil"),
  lbLangCombo: document.getElementById("lb-lang-combo"),
  lbBtnAudioOther: document.getElementById("lb-btn-audio-other"),
  lbContentOther: document.getElementById("lb-content-other"),
  lbFooterWrapper: document.getElementById("lb-footer-wrapper"),
  lbFooterDrawer: document.getElementById("lb-footer-drawer"),
  lbVocabSummary: document.getElementById("lb-vocab-summary"),
  lbCollapseToggleBtn: document.getElementById("lb-collapse-toggle-btn"),
  lbCollapseIcon: document.getElementById("lb-collapse-icon"),
  lbCollapseText: document.getElementById("lb-collapse-text"),
  lbPrevBtn: document.getElementById("lb-prev-btn"),
  lbNextBtn: document.getElementById("lb-next-btn"),
  lbFooterCloseBtn: document.getElementById("lb-footer-close-btn"),
  lightboxCloseBtn: document.getElementById("lightboxCloseBtn"),
  btnHeroOpenLightbox: document.getElementById("btnHeroOpenLightbox"),
  btnViewStaticHtml: document.getElementById("btnViewStaticHtml")
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Load saved custom stories from localStorage
  const customStories = loadCustomStories();
  if (customStories.length > 0) {
    customStories.forEach((cs) => {
      cs.isAi = true;
      if (!STORIES_DATA.some((s) => s.id === cs.id)) {
        STORIES_DATA.unshift(cs);
      }
    });
  }

  const readIds = getReadStoryIds();
  const unreadStory = STORIES_DATA.find((s) => !readIds.includes(s.id));
  const initialStory = unreadStory || STORIES_DATA[0];

  renderStoryPillList();
  loadStory(initialStory.id, false);
  populateQuickStorySelect();
  updateAiStoriesCountBadge();

  // Restore saved Gemini API key if present
  try {
    const savedKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);
    if (savedKey && elements.geminiApiKeyInput) {
      elements.geminiApiKeyInput.value = savedKey;
      if (elements.geminiKeyStatus) {
        elements.geminiKeyStatus.textContent = "✅ Gemini API key active!";
        elements.geminiKeyStatus.style.display = "block";
      }
    }
  } catch (e) {}

  setupEventListeners();
  setLangView("ta_en");
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
});

// ==========================================================================
// LOCALSTORAGE READ / UNREAD MARKER LOGIC
// ==========================================================================
function getReadStoryIds() {
  try {
    const raw = localStorage.getItem(READ_STORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Could not read from localStorage", err);
    return [];
  }
}

function saveReadStoryIds(ids) {
  try {
    localStorage.setItem(READ_STORIES_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn("Could not write to localStorage", err);
  }
}

function isStoryRead(storyId) {
  return getReadStoryIds().includes(storyId);
}

function markStoryAsRead(storyId) {
  const ids = getReadStoryIds();
  if (!ids.includes(storyId)) {
    ids.push(storyId);
    saveReadStoryIds(ids);
  }
  onReadStatusChanged(storyId, true);
}

function markStoryAsUnread(storyId) {
  let ids = getReadStoryIds();
  ids = ids.filter((id) => id !== storyId);
  saveReadStoryIds(ids);
  onReadStatusChanged(storyId, false);
}

function toggleStoryReadStatus(storyId) {
  if (isStoryRead(storyId)) {
    markStoryAsUnread(storyId);
  } else {
    markStoryAsRead(storyId);
  }
}

function onReadStatusChanged(storyId, isNowRead) {
  updatePlaceCountBadges();
  updateReadMarkerButtons(storyId);
  renderStoryPillList();
  populateQuickStorySelect();

  if (isNowRead && currentStoryTab === "active") {
    // If the currently displayed story was marked as read while on "To Read" tab,
    // automatically transition to the next unread story
    const unreadStories = STORIES_DATA.filter((s) => !isStoryRead(s.id));
    if (unreadStories.length > 0) {
      loadStory(unreadStories[0].id);
    }
  } else if (!isNowRead && currentStoryTab === "hidden") {
    // If unmarked as unread while in Hidden place, check if any hidden stories remain
    const remainingHidden = STORIES_DATA.filter((s) => isStoryRead(s.id));
    if (remainingHidden.length > 0) {
      loadStory(remainingHidden[0].id);
    }
  }
}

function updatePlaceCountBadges() {
  const readIds = getReadStoryIds();
  const toReadCount = STORIES_DATA.filter((s) => !readIds.includes(s.id)).length;
  const hiddenCount = STORIES_DATA.filter((s) => readIds.includes(s.id)).length;

  if (elements.badgeToReadCount) elements.badgeToReadCount.textContent = toReadCount;
  if (elements.badgeHiddenCount) elements.badgeHiddenCount.textContent = hiddenCount;
  if (elements.totalStoriesBadge) elements.totalStoriesBadge.textContent = STORIES_DATA.length;
}

function updateReadMarkerButtons(storyId) {
  const isRead = isStoryRead(storyId);

  // Hero Banner Button
  if (elements.btnToggleRead) {
    elements.btnToggleRead.classList.toggle("is-read", isRead);
    if (elements.readMarkerText) {
      elements.readMarkerText.textContent = isRead ? "↩️ Mark as Unread" : "✓ Mark as Read";
    }
  }

  // Hero Status Badge
  if (elements.heroReadStatusBadge) {
    elements.heroReadStatusBadge.style.display = isRead ? "inline-block" : "none";
  }

  // Lightbox Button
  if (elements.lightboxReadMarkerBtn) {
    elements.lightboxReadMarkerBtn.classList.toggle("active-speaking", isRead);
    if (elements.lightboxReadMarkerText) {
      elements.lightboxReadMarkerText.textContent = isRead ? "↩️ Mark Unread" : "✓ Mark Read";
    }
  }
}

// ==========================================================================
// AI STORY MARKER LOGIC & HELPERS
// ==========================================================================
function getAiMarkedStoryIds() {
  try {
    const raw = localStorage.getItem(AI_MARKED_STORIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveAiMarkedStoryIds(ids) {
  try {
    localStorage.setItem(AI_MARKED_STORIES_STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {}
}

function isAiStory(story) {
  if (!story) return false;
  const markedIds = getAiMarkedStoryIds();
  if (markedIds.includes(story.id)) return true;
  if (story.isAi || story.source === "ai") return true;
  if (typeof story.id === "string" && (story.id.startsWith("ai-") || story.id.startsWith("custom-"))) return true;
  return false;
}

function toggleAiMarker(storyId) {
  let ids = getAiMarkedStoryIds();
  const story = STORIES_DATA.find((s) => s.id === storyId);
  const currentlyAi = isAiStory(story);

  if (currentlyAi) {
    ids = ids.filter((id) => id !== storyId);
    if (story) story.isAi = false;
  } else {
    if (!ids.includes(storyId)) ids.push(storyId);
    if (story) story.isAi = true;
  }
  saveAiMarkedStoryIds(ids);
  updateAiMarkerUI(storyId);
  renderStoryPillList();
  populateQuickStorySelect();
}

function updateAiMarkerUI(storyId) {
  const story = STORIES_DATA.find((s) => s.id === storyId);
  const isAi = isAiStory(story);

  // Hero Badge
  if (elements.heroAiBadge) {
    elements.heroAiBadge.style.display = isAi ? "inline-flex" : "none";
  }

  // Hero Button
  if (elements.btnToggleAiMarker) {
    elements.btnToggleAiMarker.classList.toggle("is-ai", isAi);
    const textEl = document.getElementById("aiMarkerText");
    if (textEl) {
      textEl.textContent = isAi ? "✨ AI Story" : "+ Mark as AI";
    }
  }

  // Lightbox Tag
  if (elements.lightboxAiTag) {
    elements.lightboxAiTag.style.display = isAi ? "inline-flex" : "none";
  }

  updateAiStoriesCountBadge();
}

function updateAiStoriesCountBadge() {
  const aiStoriesCount = STORIES_DATA.filter((s) => isAiStory(s)).length;
  const badge = document.getElementById("aiStoriesBadge");
  if (badge) {
    badge.textContent = aiStoriesCount;
  }
}

function switchStoryPlaceTab(tab) {
  currentStoryTab = tab;

  if (elements.tabPlaceToRead) {
    elements.tabPlaceToRead.classList.toggle("active", tab === "active");
    elements.tabPlaceToRead.setAttribute("aria-selected", tab === "active" ? "true" : "false");
  }
  if (elements.tabPlaceHidden) {
    elements.tabPlaceHidden.classList.toggle("active", tab === "hidden");
    elements.tabPlaceHidden.setAttribute("aria-selected", tab === "hidden" ? "true" : "false");
  }

  if (elements.storyPlaceTitle) {
    elements.storyPlaceTitle.textContent = tab === "active" ? "📚 Stories To Read" : "📁 Hidden / Read Stories";
  }
  if (elements.storyPlaceSubtitle) {
    elements.storyPlaceSubtitle.textContent = tab === "active"
      ? "⚡ Active reading list • Mark as read to move to hidden"
      : "✅ Stories marked as read • Click 'Mark Unread' to restore";
  }

  renderStoryPillList();

  // If currently active story isn't in this tab, select first story in this tab
  const readIds = getReadStoryIds();
  const storiesInTab = tab === "active"
    ? STORIES_DATA.filter((s) => !readIds.includes(s.id))
    : STORIES_DATA.filter((s) => readIds.includes(s.id));

  if (storiesInTab.length > 0 && !storiesInTab.some((s) => s.id === currentStory.id)) {
    loadStory(storiesInTab[0].id);
  }
}

// ==========================================================================
// STORY NAVIGATION, AUTO-SCROLL & SHELF CONTROLS
// ==========================================================================

// Smooth-scroll down to Story Hero Banner reader
function scrollToStoryReader() {
  const banner = document.getElementById("storyHeroSection") || document.querySelector(".story-hero-banner");
  if (banner) {
    const yOffset = -72;
    const y = banner.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    banner.classList.remove("loaded-pulse");
    void banner.offsetWidth; // Force reflow
    banner.classList.add("loaded-pulse");
  }
}

// Smooth-scroll up to Topic cards shelf
function scrollToTopicsShelf() {
  const shelf = document.querySelector(".story-selection-bar");
  if (shelf) {
    const yOffset = -72;
    const y = shelf.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }
}

// Ensure active card is visible within the scrollable topic shelf
function scrollActiveCardIntoShelfView(storyId) {
  if (!elements.storyScrollContainer) return;
  const activeCard = elements.storyScrollContainer.querySelector(`.story-pill-card[data-story-id="${storyId}"]`);
  if (activeCard) {
    activeCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
}

// Toggle grid view between compact shelf and full expanded
let isGridExpanded = false;
function toggleGridView() {
  isGridExpanded = !isGridExpanded;
  if (elements.storyScrollContainer) {
    elements.storyScrollContainer.classList.toggle("expanded-grid", isGridExpanded);
  }
  if (elements.toggleGridIcon) {
    elements.toggleGridIcon.textContent = isGridExpanded ? "⊟" : "⊞";
  }
  if (elements.toggleGridText) {
    elements.toggleGridText.textContent = isGridExpanded ? "Compact Shelf" : `Expand All (${STORIES_DATA.length})`;
  }
}

// Populate the quick story select dropdown with all stories
function populateQuickStorySelect() {
  if (!elements.quickStorySelect) return;
  const readIds = getReadStoryIds();
  elements.quickStorySelect.innerHTML = STORIES_DATA.map((s, idx) => {
    const isRead = readIds.includes(s.id);
    const isAi = isAiStory(s);
    const readPrefix = isRead ? "✅ " : "";
    const aiPrefix = isAi ? "✨ [AI] " : "";
    return `<option value="${s.id}">#${idx + 1}: ${readPrefix}${aiPrefix}${s.title.normal} (${s.title.tamil})</option>`;
  }).join("");

  if (currentStory) {
    elements.quickStorySelect.value = currentStory.id;
  }
}

// Update Next/Previous Story button enabled/disabled states
function updateStoryNavButtons() {
  if (!elements.btnPrevStory || !elements.btnNextStory || !currentStory) return;
  let list = getFilteredStories();
  if (list.length === 0) list = STORIES_DATA;
  let curIdx = list.findIndex((s) => s.id === currentStory.id);

  if (curIdx === -1) {
    const allIdx = STORIES_DATA.findIndex((s) => s.id === currentStory.id);
    elements.btnPrevStory.disabled = allIdx <= 0;
    elements.btnNextStory.disabled = allIdx >= STORIES_DATA.length - 1;
  } else {
    elements.btnPrevStory.disabled = curIdx <= 0;
    elements.btnNextStory.disabled = curIdx >= list.length - 1;
  }

  if (elements.quickStorySelect) {
    elements.quickStorySelect.value = currentStory.id;
  }
}

// Navigate to adjacent story
function navigateStory(direction) {
  let list = getFilteredStories();
  if (list.length === 0) list = STORIES_DATA;
  let idx = list.findIndex((s) => s.id === currentStory.id);
  if (idx === -1) {
    list = STORIES_DATA;
    idx = list.findIndex((s) => s.id === currentStory.id);
  }
  const nextIdx = idx + direction;
  if (nextIdx >= 0 && nextIdx < list.length) {
    loadStory(list[nextIdx].id, false);
    scrollActiveCardIntoShelfView(list[nextIdx].id);
  }
}

// Helper to get currently filtered stories list
function getFilteredStories() {
  const readIds = getReadStoryIds();
  let list = currentStoryTab === "active"
    ? STORIES_DATA.filter((s) => !readIds.includes(s.id))
    : STORIES_DATA.filter((s) => readIds.includes(s.id));

  if (currentCategoryFilter === "ai_only") {
    list = list.filter((s) => isAiStory(s));
  } else if (currentCategoryFilter !== "all") {
    list = list.filter((s) => s.category === currentCategoryFilter);
  }

  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.trim().toLowerCase();
    list = list.filter((s) => {
      const matchEn = s.title && s.title.normal && s.title.normal.toLowerCase().includes(q);
      const matchTa = s.title && s.title.tamil && s.title.tamil.toLowerCase().includes(q);
      const matchAdv = s.title && s.title.advanced && s.title.advanced.toLowerCase().includes(q);
      const matchCat = s.category && s.category.toLowerCase().includes(q);
      const matchAi = isAiStory(s) && (q === "ai" || "ai generated".includes(q) || "ai story".includes(q));
      return matchEn || matchTa || matchAdv || matchCat || matchAi;
    });
  }

  return list;
}

// Render the top story selector cards (Filtered by current place tab, category, and search)
function renderStoryPillList() {
  if (!elements.storyScrollContainer) return;

  updatePlaceCountBadges();
  const storiesToDisplay = getFilteredStories();
  const readIds = getReadStoryIds();
  updateStoryNavButtons();

  // If empty state
  if (storiesToDisplay.length === 0) {
    if (currentSearchQuery.trim() || currentCategoryFilter !== "all") {
      elements.storyScrollContainer.innerHTML = `
        <div class="empty-stories-state" style="padding: 1.5rem 1rem;">
          <span class="empty-icon">🔍</span>
          <h4>No matching stories found</h4>
          <p>No stories matched "<strong>${escapeHtml(currentSearchQuery || currentCategoryFilter)}</strong>".</p>
          <button class="btn-switch-place" id="btnResetFilterEmpty">Clear Filter & Show All</button>
        </div>
      `;
      const btnReset = document.getElementById("btnResetFilterEmpty");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          currentSearchQuery = "";
          currentCategoryFilter = "all";
          if (elements.storySearchInput) elements.storySearchInput.value = "";
          if (elements.clearSearchBtn) elements.clearSearchBtn.style.display = "none";
          document.querySelectorAll(".cat-chip").forEach((c) => c.classList.toggle("active", c.getAttribute("data-category") === "all"));
          renderStoryPillList();
        });
      }
      return;
    }

    if (currentStoryTab === "active") {
      elements.storyScrollContainer.innerHTML = `
        <div class="empty-stories-state">
          <span class="empty-icon">🎉</span>
          <h4>All Stories Completed!</h4>
          <p>You have finished reading all active stories. They are securely saved in your <strong>Hidden / Read</strong> place.</p>
          <button class="btn-switch-place" id="btnGoToHiddenEmpty">View Hidden / Read Stories 📁</button>
        </div>
      `;
      const btnGo = document.getElementById("btnGoToHiddenEmpty");
      if (btnGo) btnGo.addEventListener("click", () => switchStoryPlaceTab("hidden"));
    } else {
      elements.storyScrollContainer.innerHTML = `
        <div class="empty-stories-state">
          <span class="empty-icon">📭</span>
          <h4>No Hidden Stories Yet</h4>
          <p>When you finish reading a story, click <strong>"Mark as Read"</strong> to move it into this hidden place.</p>
          <button class="btn-switch-place" id="btnGoToActiveEmpty">Back to Stories To Read 📖</button>
        </div>
      `;
      const btnBack = document.getElementById("btnGoToActiveEmpty");
      if (btnBack) btnBack.addEventListener("click", () => switchStoryPlaceTab("active"));
    }
    return;
  }

  elements.storyScrollContainer.innerHTML = storiesToDisplay.map((story) => {
    const isActive = story.id === currentStory.id;
    const isRead = readIds.includes(story.id);
    const isAi = isAiStory(story);

    return `
      <div class="story-pill-card ${isActive ? 'active' : ''} ${isAi ? 'ai-story-card' : ''}" data-story-id="${story.id}">
        <div class="pill-card-top">
          <span class="pill-category">${story.category}</span>
          ${isRead ? `
            <div style="display:flex; align-items:center; gap:0.35rem;">
              ${isAi ? `<span class="pill-card-ai-badge mini">✨ AI</span>` : ''}
              <span class="pill-card-read-badge">✅ Read</span>
              <button class="pill-card-unread-btn" data-unread-id="${story.id}" title="Move back to reading list">↩️ Unread</button>
            </div>
          ` : isAi ? `
            <span class="pill-card-ai-badge">✨ AI Story</span>
          ` : `
            <span class="pill-lines-count">📖 Lightbox</span>
          `}
        </div>
        <div>
          <div class="pill-card-title-en">${story.title.normal}</div>
          <div class="pill-card-title-ta">${story.title.tamil}</div>
        </div>
        <div class="pill-card-footer" style="margin-top: 0.5rem; display: flex; justify-content: flex-end;">
          <span class="pill-card-lb-trigger" style="font-size: 0.72rem; color: #22d3ee; font-weight: 700; display: inline-flex; align-items: center; gap: 0.25rem;">
            📖 வாசிப்பு Lightbox &rarr;
          </span>
        </div>
      </div>
    `;
  }).join("");

  // Add click handlers: Clicking any card opens the Split Lightbox directly!
  elements.storyScrollContainer.querySelectorAll(".story-pill-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".pill-card-unread-btn")) return;
      const id = card.getAttribute("data-story-id");
      loadStory(id, false);
      openSplitLightbox(id); // Immediate Lightbox presentation as user reads everything in lightbox only
    });
  });

  // Add unread button handlers
  elements.storyScrollContainer.querySelectorAll(".pill-card-unread-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-unread-id");
      markStoryAsUnread(id);
    });
  });
}

// Load a Story by ID (shouldScroll: true smooth-scrolls window down to reader)
function loadStory(storyId, shouldScroll = false) {
  stopSpeech();
  const story = STORIES_DATA.find((s) => s.id === storyId);
  if (!story) return;
  currentStory = story;
  currentSentenceIndex = 0;
  currentQuizPairIndex = 0;

  // Update pills active state
  document.querySelectorAll(".story-pill-card").forEach((card) => {
    if (card.getAttribute("data-story-id") === storyId) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  // Update Hero Section
  const storyIndex = STORIES_DATA.findIndex((s) => s.id === storyId);
  const storyNumber = storyIndex !== -1 ? storyIndex + 1 : 1;

  elements.heroCategory.textContent = story.category;
  elements.heroLineCount.textContent = `📖 Story #${storyNumber} of ${STORIES_DATA.length}`;
  elements.heroReadTime.textContent = `⏱️ ${story.readTime}`;
  elements.heroNormalTitle.textContent = story.title.normal;
  elements.heroTamilTitle.textContent = story.title.tamil;
  if (elements.heroTeluguTitle) elements.heroTeluguTitle.textContent = story.title.telugu || "";
  if (elements.heroKannadaTitle) elements.heroKannadaTitle.textContent = story.title.kannada || "";
  if (elements.heroHindiTitle) elements.heroHindiTitle.textContent = story.title.hindi || "";
  if (elements.heroAdvTitle) {
    elements.heroAdvTitle.textContent = `Advanced English: "${story.title.advanced}"`;
  }
  elements.heroSummaryNormal.textContent = story.summary.normal;
  elements.heroSummaryTamil.textContent = story.summary.tamil;
  if (elements.heroSummaryTelugu) elements.heroSummaryTelugu.textContent = story.summary.telugu ? `తెలుగు: ${story.summary.telugu}` : "";
  if (elements.heroSummaryKannada) elements.heroSummaryKannada.textContent = story.summary.kannada ? `ಕನ್ನಡ: ${story.summary.kannada}` : "";
  if (elements.heroSummaryHindi) elements.heroSummaryHindi.textContent = story.summary.hindi ? `हिन्दी: ${story.summary.hindi}` : "";

  if (elements.btnViewStaticHtml) {
    elements.btnViewStaticHtml.href = `htmls/story-${String(storyNumber).padStart(3, '0')}.html`;
  }

  // Update Read / Unread Marker UI
  updateReadMarkerButtons(story.id);

  // Update AI Story Marker UI
  updateAiMarkerUI(story.id);

  // Update Navigation buttons and quick select
  updateStoryNavButtons();

  // Render Panels
  renderPanels(story);

  // Render Step Sentence Mode
  updateSentenceMode();

  // Render Vocab Comparison Table
  renderVocabTable(story, currentVocabLang);

  // Render Quiz
  currentQuizPairIndex = 0;
  renderQuiz(story, currentQuizLang);

  // Refresh Lightbox if currently open
  if (elements.panelLightbox && elements.panelLightbox.classList.contains("active") && currentLightboxPanel) {
    openPanelLightbox(currentLightboxPanel);
  }

  // Auto-scroll to story reader if triggered by user interaction
  if (shouldScroll) {
    scrollToStoryReader();
  }
}

// Render the 5 Synchronized Panels as Natural Continuous Flowing Paragraphs
function renderPanels(story) {
  // Panel 1: Tamil
  if (elements.panelTamilBody) {
    elements.panelTamilBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-ta">
          ${story.lines.map((item, idx) => `
            <span class="story-sentence sentence-ta" data-line-index="${idx}" title="Click to listen in Tamil / highlight">
              <span class="sentence-main-text">${escapeHtml(item.tamil)}</span>
            </span>
          `).join(" ")}
        </p>
      </div>
    `;
  }

  // Panel 2: Normal English
  if (elements.panelNormalBody) {
    elements.panelNormalBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-normal">
          ${story.lines.map((item, idx) => `
            <span class="story-sentence sentence-normal" data-line-index="${idx}" title="Click to listen in English / highlight">
              <span class="sentence-main-text">${highlightVocab(item.normal, item.vocab, 'normal')}</span>
            </span>
          `).join(" ")}
        </p>
      </div>
    `;
  }

  // Panel 3: Telugu (In Tamil letters for speaking Telugu + English phonetic sub)
  if (elements.panelTeluguBody) {
    elements.panelTeluguBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-te">
          ${story.lines.map((item, idx) => {
            const teSpeak = item.teluguSpeak || '';
            const teSub = item.teluguSub || '';
            return `
              <span class="story-sentence sentence-te" data-line-index="${idx}" title="Click to listen in Telugu / highlight">
                ${teSpeak ? `<span class="sentence-speak-tamil speak-tamil-bold">${escapeHtml(teSpeak)}</span>` : ''}
                ${teSub ? `<span class="sentence-phonetic-sub speak-en-sub">(${escapeHtml(teSub)})</span>` : ''}
              </span>
            `;
          }).join(" ")}
        </p>
      </div>
    `;
  }

  // Panel 4: Kannada (In Tamil letters for speaking Kannada + English phonetic sub)
  if (elements.panelKannadaBody) {
    elements.panelKannadaBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-kn">
          ${story.lines.map((item, idx) => {
            const knSpeak = item.kannadaSpeak || '';
            const knSub = item.kannadaSub || '';
            return `
              <span class="story-sentence sentence-kn" data-line-index="${idx}" title="Click to listen in Kannada / highlight">
                ${knSpeak ? `<span class="sentence-speak-tamil speak-tamil-bold">${escapeHtml(knSpeak)}</span>` : ''}
                ${knSub ? `<span class="sentence-phonetic-sub speak-en-sub">(${escapeHtml(knSub)})</span>` : ''}
              </span>
            `;
          }).join(" ")}
        </p>
      </div>
    `;
  }

  // Panel 5: Hindi (In Tamil letters for speaking Hindi + English phonetic sub)
  if (elements.panelHindiBody) {
    elements.panelHindiBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-hi">
          ${story.lines.map((item, idx) => {
            const hiSpeak = item.hindiSpeak || '';
            const hiSub = item.hindiSub || '';
            return `
              <span class="story-sentence sentence-hi" data-line-index="${idx}" title="Click to listen in Hindi / highlight">
                ${hiSpeak ? `<span class="sentence-speak-tamil speak-tamil-bold">${escapeHtml(hiSpeak)}</span>` : ''}
                ${hiSub ? `<span class="sentence-phonetic-sub speak-en-sub">(${escapeHtml(hiSub)})</span>` : ''}
              </span>
            `;
          }).join(" ")}
        </p>
      </div>
    `;
  }

  // Panel: Advanced English (if element exists for backwards compatibility)
  if (elements.panelAdvBody) {
    elements.panelAdvBody.innerHTML = `
      <div class="story-paragraph-wrapper">
        <p class="story-paragraph story-paragraph-adv">
          ${story.lines.map((item, idx) => `
            <span class="story-sentence sentence-adv" data-line-index="${idx}" title="Click to listen / highlight">${highlightVocab(item.advanced || item.normal, item.vocab, 'advanced')}</span>
          `).join(" ")}
        </p>
      </div>
    `;
  }

  attachLineInteractivity();
}

// Highlight Vocabulary chips in the sentence
function highlightVocab(sentence, vocabList, type) {
  if (!vocabList || !vocabList.length) return escapeHtml(sentence);

  let result = escapeHtml(sentence);
  vocabList.forEach((v) => {
    const targetWord = type === 'normal' ? v.normal : v.advanced;
    if (!targetWord) return;

    const regex = new RegExp(`(${escapeRegex(targetWord)})`, 'gi');
    result = result.replace(regex, `<span class="vocab-chip" data-tamil="${escapeHtml(v.tamil || '')}" data-normal="${escapeHtml(v.normal || '')}" data-advanced="${escapeHtml(v.advanced || '')}">$1</span>`);
  });

  return result;
}

// Attach hover & click synchronization across all 5 paragraphs
function attachLineInteractivity() {
  if (!elements.panelsGrid) return;
  const allSentences = elements.panelsGrid.querySelectorAll(".story-sentence");

  allSentences.forEach((sentence) => {
    const lineIndex = sentence.getAttribute("data-line-index");

    // Mouse enter / hover: smoothly highlight all 5 paragraphs at this sentence
    sentence.addEventListener("mouseenter", () => {
      highlightSyncedLines(lineIndex);
    });

    // Mouse leave: remove highlight (unless actively speaking)
    sentence.addEventListener("mouseleave", () => {
      if (activeSpeechIndex !== parseInt(lineIndex)) {
        clearSyncedHighlights();
      }
    });

    // Click: activate this sentence, highlight across all panels and speak in clicked language
    sentence.addEventListener("click", (e) => {
      if (e.target.closest(".vocab-chip")) return; // Let vocab popup handle its click
      currentSentenceIndex = parseInt(lineIndex);
      highlightSyncedLines(lineIndex, true);
      updateSentenceMode();

      // Read this sentence aloud in the language corresponding to clicked panel
      let speakMode = "normal";
      if (sentence.classList.contains("sentence-ta")) speakMode = "tamil";
      else if (sentence.classList.contains("sentence-te")) speakMode = "telugu";
      else if (sentence.classList.contains("sentence-kn")) speakMode = "kannada";
      else if (sentence.classList.contains("sentence-hi")) speakMode = "hindi";
      else if (sentence.classList.contains("sentence-adv")) speakMode = "advanced";

      speakSingleLine(parseInt(lineIndex), speakMode);
    });
  });

  // Vocab chip click to show quick tooltip or alert
  document.querySelectorAll(".vocab-chip").forEach((chip) => {
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      const ta = chip.getAttribute("data-tamil");
      const norm = chip.getAttribute("data-normal");
      const adv = chip.getAttribute("data-advanced");
      showVocabPopup(chip, { ta, norm, adv });
    });
  });
}

// Synced highlight helper
function highlightSyncedLines(lineIndex, doScroll = false) {
  clearSyncedHighlights();

  const matchingSentences = document.querySelectorAll(`.story-sentence[data-line-index="${lineIndex}"]`);
  matchingSentences.forEach((el) => {
    el.classList.add("synced-highlight");
  });

  if (doScroll && matchingSentences.length > 0) {
    const targetEl = matchingSentences[0];
    const rect = targetEl.getBoundingClientRect();
    const safeTopBuffer = 120; // safe margin below sticky navigation
    if (rect.top < safeTopBuffer || rect.bottom > window.innerHeight) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function clearSyncedHighlights() {
  document.querySelectorAll(".story-sentence.synced-highlight").forEach((el) => {
    el.classList.remove("synced-highlight");
  });
}

// Vocab Quick Info Popup
let activePopup = null;
function showVocabPopup(element, data) {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }

  const popup = document.createElement("div");
  popup.className = "vocab-popup show";
  popup.innerHTML = `
    <div style="font-weight: 700; color: #38bdf8; margin-bottom: 2px;">English: ${data.norm}</div>
    <div style="font-family: var(--font-ta); color: #10b981; font-size: 0.95rem;">தமிழ்: ${data.ta}</div>
  `;

  document.body.appendChild(popup);
  const rect = element.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 6}px`;
  popup.style.left = `${Math.min(rect.left + window.scrollX, window.innerWidth - 290)}px`;
  activePopup = popup;

  setTimeout(() => {
    const handleOutsideClick = (e) => {
      if (!popup.contains(e.target)) {
        popup.remove();
        activePopup = null;
        document.removeEventListener("click", handleOutsideClick);
      }
    };
    document.addEventListener("click", handleOutsideClick);
  }, 100);
}

// Step-by-Step Sentence Mode
function updateSentenceMode() {
  if (!currentStory.lines[currentSentenceIndex]) return;

  const item = currentStory.lines[currentSentenceIndex];
  elements.sentenceStepNum.textContent = item.num;
  elements.sentenceStepTotal.textContent = currentStory.lines.length;

  if (elements.stepBlockTamil) elements.stepBlockTamil.textContent = item.tamil;
  if (elements.stepBlockNormal) elements.stepBlockNormal.textContent = item.normal;
  if (elements.stepBlockTelugu) {
    const teSpeak = item.teluguSpeak || '';
    const teSub = item.teluguSub ? `\n(${item.teluguSub})` : '';
    elements.stepBlockTelugu.textContent = teSpeak + teSub;
  }
  if (elements.stepBlockKannada) {
    const knSpeak = item.kannadaSpeak || '';
    const knSub = item.kannadaSub ? `\n(${item.kannadaSub})` : '';
    elements.stepBlockKannada.textContent = knSpeak + knSub;
  }
  if (elements.stepBlockHindi) {
    const hiSpeak = item.hindiSpeak || '';
    const hiSub = item.hindiSub ? `\n(${item.hindiSub})` : '';
    elements.stepBlockHindi.textContent = hiSpeak + hiSub;
  }
  if (elements.stepBlockAdv) {
    elements.stepBlockAdv.textContent = item.advanced || item.normal;
  }

  elements.btnPrevSentence.disabled = currentSentenceIndex === 0;
  elements.btnNextSentence.disabled = currentSentenceIndex === currentStory.lines.length - 1;
}

// Speech Synthesis for Custom Vocab Words
function speakCustomWord(text, lang) {
  stopSpeech();
  if (!text) return;
  if (window.bhashaAudio) {
    window.bhashaAudio.speak(text, lang);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentSpeechRate;
  const voices = synth.getVoices();

  if (lang === "telugu") {
    utterance.lang = "te-IN";
    utterance.voice = voices.find((v) => v.lang.startsWith("te")) || null;
  } else if (lang === "kannada") {
    utterance.lang = "kn-IN";
    utterance.voice = voices.find((v) => v.lang.startsWith("kn")) || null;
  } else if (lang === "hindi") {
    utterance.lang = "hi-IN";
    utterance.voice = voices.find((v) => v.lang.startsWith("hi")) || null;
  } else if (lang === "tamil") {
    utterance.lang = "ta-IN";
    utterance.voice = voices.find((v) => v.lang.startsWith("ta")) || null;
  } else {
    utterance.lang = "en-US";
    utterance.voice = voices.find((v) => v.lang.startsWith("en")) || null;
  }

  synth.speak(utterance);
}

// Render Multilingual Vocab Comparison Table (English, Telugu, Kannada, Hindi, All)
function renderVocabTable(story, lang = currentVocabLang) {
  if (!elements.vocabTableBody) return;
  currentVocabLang = lang;

  // Sync active pill state
  document.querySelectorAll(".vocab-pill-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-vlang") === lang);
  });

  const thead = document.getElementById("vocabTableHead");
  let items = story.vocabComparison;
  if (!items || !items.length) {
    items = [];
    if (story.lines && story.lines.length) {
      story.lines.forEach((l) => {
        if (l.vocab && l.vocab.length) {
          l.vocab.forEach((v) => {
            items.push({
              normal: v.normal,
              advanced: v.advanced,
              tamil: v.tamil,
              example: l.normal,
              telugu: l.telugu,
              teluguSpeak: l.teluguSpeak,
              kannada: l.kannada,
              kannadaSpeak: l.kannadaSpeak,
              hindi: l.hindi,
              hindiSpeak: l.hindiSpeak
            });
          });
        }
      });
    }
  }

  if (!items || !items.length) {
    if (thead) thead.innerHTML = `<tr><th>வார்த்தை (Word)</th><th>பொருள் (Meaning)</th></tr>`;
    elements.vocabTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">சொல்லகராதி இல்லை (No vocabulary available).</td></tr>`;
    return;
  }

  if (lang === "telugu") {
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th style="min-width: 140px;">🗣️ தெலுங்கு சொல் (தமிழில்)</th>
          <th style="min-width: 140px;">🇮🇳 தமிழ் அர்த்தம் (Meaning)</th>
          <th style="min-width: 120px;">🇬🇧 English Word</th>
          <th>சூழல் வாக்கியம் (Context Example)</th>
          <th style="width: 50px; text-align: center;">ஒலி</th>
        </tr>
      `;
    }
    elements.vocabTableBody.innerHTML = items.map((item) => `
      <tr class="vocab-row">
        <td>
          <span class="speak-tamil-bold" style="color: #38bdf8; font-size: 1.05rem;">${escapeHtml(item.teluguSpeak || item.telugu || item.normal)}</span>
        </td>
        <td style="font-family: var(--font-ta); color: #10b981; font-weight: 600;">${escapeHtml(item.tamil)}</td>
        <td style="color: var(--normal-color); font-weight: 600;">${escapeHtml(item.normal)}</td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">"${escapeHtml(item.example || '')}"</td>
        <td style="text-align: center;">
          <button class="btn-vocab-speak" data-lang="telugu" data-text="${escapeHtml(item.telugu || item.teluguSpeak || item.normal)}" title="🔊 தெலுங்கு உச்சரிப்பைக் கேட்க">🔊</button>
        </td>
      </tr>
    `).join("");
  } else if (lang === "kannada") {
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th style="min-width: 140px;">🗣️ கன்னட சொல் (தமிழில்)</th>
          <th style="min-width: 140px;">🇮🇳 தமிழ் அர்த்தம் (Meaning)</th>
          <th style="min-width: 120px;">🇬🇧 English Word</th>
          <th>சூழல் வாக்கியம் (Context Example)</th>
          <th style="width: 50px; text-align: center;">ஒலி</th>
        </tr>
      `;
    }
    elements.vocabTableBody.innerHTML = items.map((item) => `
      <tr class="vocab-row">
        <td>
          <span class="speak-tamil-bold" style="color: #fb923c; font-size: 1.05rem;">${escapeHtml(item.kannadaSpeak || item.kannada || item.normal)}</span>
        </td>
        <td style="font-family: var(--font-ta); color: #10b981; font-weight: 600;">${escapeHtml(item.tamil)}</td>
        <td style="color: var(--normal-color); font-weight: 600;">${escapeHtml(item.normal)}</td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">"${escapeHtml(item.example || '')}"</td>
        <td style="text-align: center;">
          <button class="btn-vocab-speak" data-lang="kannada" data-text="${escapeHtml(item.kannada || item.kannadaSpeak || item.normal)}" title="🔊 கன்னட உச்சரிப்பைக் கேட்க">🔊</button>
        </td>
      </tr>
    `).join("");
  } else if (lang === "hindi") {
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th style="min-width: 140px;">🗣️ இந்தி சொல் (தமிழில்)</th>
          <th style="min-width: 140px;">🇮🇳 தமிழ் அர்த்தம் (Meaning)</th>
          <th style="min-width: 120px;">🇬🇧 English Word</th>
          <th>சூழல் வாக்கியம் (Context Example)</th>
          <th style="width: 50px; text-align: center;">ஒலி</th>
        </tr>
      `;
    }
    elements.vocabTableBody.innerHTML = items.map((item) => `
      <tr class="vocab-row">
        <td>
          <span class="speak-tamil-bold" style="color: #c084fc; font-size: 1.05rem;">${escapeHtml(item.hindiSpeak || item.hindi || item.normal)}</span>
        </td>
        <td style="font-family: var(--font-ta); color: #10b981; font-weight: 600;">${escapeHtml(item.tamil)}</td>
        <td style="color: var(--normal-color); font-weight: 600;">${escapeHtml(item.normal)}</td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">"${escapeHtml(item.example || '')}"</td>
        <td style="text-align: center;">
          <button class="btn-vocab-speak" data-lang="hindi" data-text="${escapeHtml(item.hindi || item.hindiSpeak || item.normal)}" title="🔊 இந்தி உச்சரிப்பைக் கேட்க">🔊</button>
        </td>
      </tr>
    `).join("");
  } else if (lang === "all") {
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th>🇬🇧 English</th>
          <th>🇮🇳 தமிழ்</th>
          <th>🗣️ தெலுங்கு (தமிழில்)</th>
          <th>🗣️ கன்னடம் (தமிழில்)</th>
          <th>🗣️ இந்தி (தமிழில்)</th>
          <th>சூழல் வாக்கியம் (Context Example)</th>
        </tr>
      `;
    }
    elements.vocabTableBody.innerHTML = items.map((item) => `
      <tr class="vocab-row">
        <td><strong style="color: var(--normal-color);">${escapeHtml(item.normal)}</strong></td>
        <td style="font-family: var(--font-ta); color: #10b981; font-weight: 600;">${escapeHtml(item.tamil)}</td>
        <td><span class="speak-tamil-bold" style="color: #38bdf8;">${escapeHtml(item.teluguSpeak || item.telugu || '-')}</span></td>
        <td><span class="speak-tamil-bold" style="color: #fb923c;">${escapeHtml(item.kannadaSpeak || item.kannada || '-')}</span></td>
        <td><span class="speak-tamil-bold" style="color: #c084fc;">${escapeHtml(item.hindiSpeak || item.hindi || '-')}</span></td>
        <td style="color: var(--text-secondary); font-size: 0.85rem;">"${escapeHtml(item.example || '')}"</td>
      </tr>
    `).join("");
  } else {
    // English default
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th style="min-width: 140px;">English Word</th>
          <th style="min-width: 160px;">தமிழ் அர்த்தம் (Tamil Meaning)</th>
          <th>Context Example</th>
          <th style="width: 50px; text-align: center;">ஒலி</th>
        </tr>
      `;
    }
    elements.vocabTableBody.innerHTML = items.map((item) => `
      <tr class="vocab-row">
        <td>
          <strong style="color: var(--normal-color); font-size: 1.05rem;">${escapeHtml(item.normal)}</strong>
          ${item.advanced && item.advanced !== item.normal ? `<div style="font-size: 0.78rem; color: #a78bfa; margin-top: 0.15rem;">Adv: ${escapeHtml(item.advanced)}</div>` : ''}
        </td>
        <td style="font-family: var(--font-ta); color: #10b981; font-weight: 600; font-size: 0.98rem;">${escapeHtml(item.tamil)}</td>
        <td style="color: var(--text-secondary); font-size: 0.88rem;">"${escapeHtml(item.example || '')}"</td>
        <td style="text-align: center;">
          <button class="btn-vocab-speak" data-lang="english" data-text="${escapeHtml(item.normal)}" title="🔊 Listen English Word">🔊</button>
        </td>
      </tr>
    `).join("");
  }

  // Attach speech listeners for all vocab audio buttons
  document.querySelectorAll(".btn-vocab-speak").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const speakText = btn.getAttribute("data-text");
      const speakLang = btn.getAttribute("data-lang");
      speakCustomWord(speakText, speakLang);
    };
  });
}

// Generate Language-Specific Micro-Quiz Questions
function getQuizForLanguage(story, lang) {
  if (lang === "english") {
    return story.quiz || story.quizPool || [];
  }

  const items = story.vocabComparison;
  if (!items || !items.length) {
    return story.quiz || story.quizPool || [];
  }

  const generated = [];
  const langKey = lang === "telugu" ? "teluguSpeak" : lang === "kannada" ? "kannadaSpeak" : "hindiSpeak";
  const langNameTa = lang === "telugu" ? "தெலுங்கில்" : lang === "kannada" ? "கன்னடத்தில்" : "இந்தியில்";
  const langTitleTa = lang === "telugu" ? "தெலுங்கு" : lang === "kannada" ? "கன்னட" : "இந்தி";

  // Question Type 1: Tamil meaning / English word -> Target Spoken Word (in Tamil letters)
  items.forEach((item, idx) => {
    if (!item[langKey]) return;

    const otherOptions = items
      .filter((_, i) => i !== idx && _[langKey])
      .map((_) => _[langKey]);
    
    const options = [item[langKey], ...otherOptions.slice(0, 3)];
    // Deterministic shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = (i + idx) % (i + 1);
      [options[i], options[j]] = [options[j], options[i]];
    }
    const correctIndex = options.indexOf(item[langKey]);

    generated.push({
      question: `'${item.tamil}' (${item.normal}) என்பதற்கு ${langNameTa} பேசும் சரியான சொல் எது?`,
      options: options,
      correct: correctIndex,
      explanation: `'${item.normal}' (${item.tamil}) என்பதற்கு ${langNameTa} பேச்சு வழக்கில் '${item[langKey]}' என்று கூறுவார்கள்.`
    });
  });

  // Question Type 2: Target Spoken Word -> Tamil meaning
  items.forEach((item, idx) => {
    if (!item[langKey]) return;

    const otherTamil = items
      .filter((_, i) => i !== idx && _.tamil)
      .map((_) => _.tamil);
    
    const options = [item.tamil, ...otherTamil.slice(0, 3)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = (i + idx + 1) % (i + 1);
      [options[i], options[j]] = [options[j], options[i]];
    }
    const correctIndex = options.indexOf(item.tamil);

    generated.push({
      question: `${langTitleTa}ச் சொல்லான '${item[langKey]}' என்பதன் தமிழ்ப் பொருள் (Meaning) என்ன?`,
      options: options,
      correct: correctIndex,
      explanation: `'${item[langKey]}' என்றால் தமிழில் '${item.tamil}' (English: ${item.normal}) ஆகும்.`
    });
  });

  return generated.length > 0 ? generated : (story.quiz || story.quizPool || []);
}

// Render Micro Quiz (2 questions at a time with dynamic Next 2 Questions button)
function renderQuiz(story, lang = currentQuizLang) {
  if (!elements.quizContainer) return;
  currentQuizLang = lang;

  // Sync active pill state
  document.querySelectorAll(".quiz-pill-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-qlang") === lang);
  });

  const quizList = getQuizForLanguage(story, lang);
  if (!quizList || !quizList.length) {
    elements.quizContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1rem;">வினாடி வினா இல்லை (No quiz available for this language).</p>`;
    return;
  }

  const totalQuestions = quizList.length;
  const questionsPerSet = 2;
  const totalSets = Math.ceil(totalQuestions / questionsPerSet);

  if (currentQuizPairIndex >= totalSets) {
    currentQuizPairIndex = 0;
  }

  const startIdx = currentQuizPairIndex * questionsPerSet;
  const currentPair = quizList.slice(startIdx, startIdx + questionsPerSet);

  // Update header badge if present
  const badgeEl = document.getElementById("quizBadgeIndicator");
  if (badgeEl) {
    badgeEl.textContent = `Set ${currentQuizPairIndex + 1} of ${totalSets} (2 Questions)`;
  }

  // Render the current 2 questions
  const questionsHtml = currentPair.map((q, pairOffset) => {
    const qIndex = startIdx + pairOffset;
    return `
      <div class="quiz-question-item fade-in-quiz" data-quiz-index="${qIndex}">
        <div class="quiz-q-title">Q${qIndex + 1}: ${escapeHtml(q.question)}</div>
        <div class="quiz-options-list">
          ${q.options.map((opt, optIndex) => `
            <button class="quiz-opt-btn" data-opt-index="${optIndex}">
              ${escapeHtml(opt)}
            </button>
          `).join("")}
        </div>
        <div class="quiz-feedback" id="quizFeedback-${qIndex}"></div>
      </div>
    `;
  }).join("");

  // Navigation Footer to cycle to the next 2 questions
  const footerHtml = `
    <div class="quiz-controls-footer">
      <span class="quiz-progress-hint">
        Showing Q${startIdx + 1} &amp; Q${startIdx + currentPair.length} of ${totalQuestions} Questions (Set ${currentQuizPairIndex + 1} of ${totalSets})
      </span>
      <button id="btnNextQuizPair" class="btn-quiz-next" title="Load next 2 questions">
        <span>${currentQuizPairIndex + 1 === totalSets ? '🔄 Restart from Set 1' : 'Next 2 Questions ➡️'}</span>
      </button>
    </div>
  `;

  elements.quizContainer.innerHTML = questionsHtml + footerHtml;

  // Next 2 Questions button click handler
  const nextBtn = document.getElementById("btnNextQuizPair");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentQuizPairIndex = (currentQuizPairIndex + 1) % totalSets;
      renderQuiz(currentStory, currentQuizLang);
    });
  }

  // Quiz Click Handlers for the active 2 questions
  document.querySelectorAll(".quiz-question-item").forEach((qItem) => {
    const qIndex = parseInt(qItem.getAttribute("data-quiz-index"));
    const quizData = quizList[qIndex];
    const feedbackBox = document.getElementById(`quizFeedback-${qIndex}`);

    qItem.querySelectorAll(".quiz-opt-btn").forEach((optBtn) => {
      optBtn.addEventListener("click", () => {
        const selectedIndex = parseInt(optBtn.getAttribute("data-opt-index"));
        const allBtns = qItem.querySelectorAll(".quiz-opt-btn");

        allBtns.forEach((btn) => (btn.disabled = true));

        if (selectedIndex === quizData.correct) {
          optBtn.classList.add("correct");
          feedbackBox.className = "quiz-feedback show correct-fb";
          feedbackBox.innerHTML = `🎉 <strong>Correct!</strong> ${escapeHtml(quizData.explanation)}`;
        } else {
          optBtn.classList.add("wrong");
          allBtns[quizData.correct].classList.add("correct");
          feedbackBox.className = "quiz-feedback show wrong-fb";
          feedbackBox.innerHTML = `❌ <strong>Not quite!</strong> ${escapeHtml(quizData.explanation)}`;
        }
      });
    });
  });
}

// Helper to resolve text, BCP-47 language tag, and matching voice for SpeechSynthesis
function resolveVoiceAndText(lineItem, mode) {
  const voices = synth.getVoices();
  let text = lineItem.normal;
  let lang = "en-US";
  let voice = null;

  if (mode === "tamil" || mode === "ta") {
    text = lineItem.tamil || "";
    lang = "ta-IN";
    voice = voices.find((v) => v.lang.startsWith("ta"));
  } else if (mode === "telugu" || mode === "te") {
    text = lineItem.teluguScript || lineItem.telugu || lineItem.teluguSpeak || "";
    lang = "te-IN";
    voice = voices.find((v) => v.lang.startsWith("te"));
  } else if (mode === "kannada" || mode === "kn") {
    text = lineItem.kannadaScript || lineItem.kannada || lineItem.kannadaSpeak || "";
    lang = "kn-IN";
    voice = voices.find((v) => v.lang.startsWith("kn"));
  } else if (mode === "hindi" || mode === "hi") {
    text = lineItem.hindiScript || lineItem.hindi || lineItem.hindiSpeak || "";
    lang = "hi-IN";
    voice = voices.find((v) => v.lang.startsWith("hi"));
  } else if (mode === "advanced") {
    text = lineItem.advanced || lineItem.normal || "";
    lang = "en-US";
    voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Online"))) || voices.find((v) => v.lang.startsWith("en"));
  } else {
    // English normal
    text = lineItem.normal || "";
    lang = "en-US";
    voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Online"))) || voices.find((v) => v.lang.startsWith("en"));
  }

  return { text, lang, voice };
}

function speakSingleLine(lineIndex, speakType) {
  stopSpeech();
  const lineItem = currentStory.lines[lineIndex];
  if (!lineItem) return;

  const mode = speakType || (elements.selectTtsVoice ? elements.selectTtsVoice.value : "normal");
  const { text, lang, voice } = resolveVoiceAndText(lineItem, mode);

  activeSpeechIndex = lineIndex;
  highlightSpeakingLine(lineIndex);

  if (window.bhashaAudio) {
    const phoneticFallback = (mode === 'telugu' ? (lineItem.teluguSpeak || lineItem.teluguSub) :
                              (mode === 'kannada' ? (lineItem.kannadaSpeak || lineItem.kannadaSub) :
                              (mode === 'hindi' ? (lineItem.hindiSpeak || lineItem.hindiSub) : ''))) || '';
    window.bhashaAudio.speak(text, lang, phoneticFallback, null, null, () => {
      clearSpeakingLine();
      activeSpeechIndex = -1;
    });
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentSpeechRate;
  utterance.lang = lang;
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    clearSpeakingLine();
    activeSpeechIndex = -1;
  };
  utterance.onerror = () => {
    clearSpeakingLine();
    activeSpeechIndex = -1;
  };

  synth.speak(utterance);
}

function speakFullStoryFromIndex(startIndex, forceMode) {
  if (startIndex >= currentStory.lines.length) {
    stopSpeech();
    return;
  }

  isPlayingAll = true;
  updatePlayButtonUI(true);

  activeSpeechIndex = startIndex;
  currentSentenceIndex = startIndex;
  highlightSpeakingLine(startIndex);
  highlightSyncedLines(startIndex, true);
  updateSentenceMode();

  const lineItem = currentStory.lines[startIndex];
  let targetMode = forceMode;
  if (!targetMode) {
    targetMode = elements.selectTtsVoice ? elements.selectTtsVoice.value : "normal";
  }

  const { text, lang, voice } = resolveVoiceAndText(lineItem, targetMode);

  if (window.bhashaAudio) {
    const phoneticFallback = (targetMode === 'telugu' ? (lineItem.teluguSpeak || lineItem.teluguSub) :
                              (targetMode === 'kannada' ? (lineItem.kannadaSpeak || lineItem.kannadaSub) :
                              (targetMode === 'hindi' ? (lineItem.hindiSpeak || lineItem.hindiSub) : ''))) || '';
    window.bhashaAudio.speak(text, lang, phoneticFallback, null, null, () => {
      if (isPlayingAll) {
        speechNextTimer = setTimeout(() => {
          speakFullStoryFromIndex(startIndex + 1, forceMode);
        }, 350);
      }
    });
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = currentSpeechRate;
  utterance.lang = lang;
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (isPlayingAll) {
      speechNextTimer = setTimeout(() => {
        speakFullStoryFromIndex(startIndex + 1, forceMode);
      }, 350);
    }
  };

  utterance.onerror = () => {
    stopSpeech();
  };

  if (synth.paused) {
    synth.resume();
  }
  synth.speak(utterance);
}

function stopSpeech() {
  if (speechNextTimer) {
    clearTimeout(speechNextTimer);
    speechNextTimer = null;
  }
  if (window.bhashaAudio) {
    window.bhashaAudio.stop();
  }
  if (synth && (synth.speaking || synth.pending)) {
    synth.cancel();
  }
  isPlayingAll = false;
  activeSpeechIndex = -1;
  clearSpeakingLine();
  updatePlayButtonUI(false);
}

function highlightSpeakingLine(lineIndex) {
  clearSpeakingLine();
  document.querySelectorAll(`.story-sentence[data-line-index="${lineIndex}"], .lb-sentence[data-line-index="${lineIndex}"]`).forEach((el) => {
    el.classList.add("synced-active-speaking");
  });
}

function clearSpeakingLine() {
  document.querySelectorAll(".story-sentence.synced-active-speaking, .lb-sentence.synced-active-speaking").forEach((el) => {
    el.classList.remove("synced-active-speaking");
  });
}

function updatePlayButtonUI(isPlaying) {
  if (elements.btnPlayStory) {
    if (isPlaying) {
      elements.playBtnText.textContent = "Pause Narration";
      elements.playBtnIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
    } else {
      elements.playBtnText.textContent = "Listen Story (Aloud)";
      elements.playBtnIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    }
  }
  const btnTa = document.getElementById("lb-btn-audio-ta");
  const btnOther = document.getElementById("lb-btn-audio-other");
  if (btnTa) btnTa.classList.toggle("active-speaking", isPlaying && activeSpeechIndex >= 0);
  if (btnOther) btnOther.classList.toggle("active-speaking", isPlaying && activeSpeechIndex >= 0);
}

// Event Listeners
function setupEventListeners() {
  // Play / Pause All Button
  if (elements.btnPlayStory) {
    elements.btnPlayStory.addEventListener("click", () => {
      if (isPlayingAll) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0);
      }
    });
  }

  // Voice Rate Change
  if (elements.speechRateSelect) {
    elements.speechRateSelect.addEventListener("change", (e) => {
      currentSpeechRate = parseFloat(e.target.value);
    });
  }

  // View Mode Toggles (Parallel vs Step-by-Step Sentence Mode)
  document.querySelectorAll(".view-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".view-mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.getAttribute("data-mode");
      setViewMode(mode);
    });
  });

  // Language View Filter Toolbar Buttons (All 5, Tamil+English, Spoken)
  document.querySelectorAll(".lang-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".lang-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const view = btn.getAttribute("data-view") || "all";
      setLangView(view);
    });
  });

  // Vocabulary Table Language Filter Pills
  document.querySelectorAll(".vocab-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const vlang = btn.getAttribute("data-vlang") || "english";
      renderVocabTable(currentStory, vlang);
    });
  });

  // Micro Quiz Language Filter Pills
  document.querySelectorAll(".quiz-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const qlang = btn.getAttribute("data-qlang") || "english";
      currentQuizPairIndex = 0;
      renderQuiz(currentStory, qlang);
    });
  });

  // Mobile Tabs (Tamil, Normal, Telugu, Kannada, Hindi)
  document.querySelectorAll(".mobile-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mobile-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.getAttribute("data-target");
      activeMobileTab = target;

      if (elements.panelTamil) elements.panelTamil.classList.toggle("active-tab-panel", target === "tamil");
      if (elements.panelNormal) elements.panelNormal.classList.toggle("active-tab-panel", target === "normal");
      if (elements.panelTelugu) elements.panelTelugu.classList.toggle("active-tab-panel", target === "telugu");
      if (elements.panelKannada) elements.panelKannada.classList.toggle("active-tab-panel", target === "kannada");
      if (elements.panelHindi) elements.panelHindi.classList.toggle("active-tab-panel", target === "hindi");
      if (elements.panelAdv) {
        elements.panelAdv.classList.toggle("active-tab-panel", target === "advanced");
      }
    });
  });

  // Sentence Mode Navigation Buttons
  if (elements.btnPrevSentence) {
    elements.btnPrevSentence.addEventListener("click", () => {
      if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        updateSentenceMode();
        highlightSyncedLines(currentSentenceIndex, true);
      }
    });
  }

  if (elements.btnNextSentence) {
    elements.btnNextSentence.addEventListener("click", () => {
      if (currentSentenceIndex < currentStory.lines.length - 1) {
        currentSentenceIndex++;
        updateSentenceMode();
        highlightSyncedLines(currentSentenceIndex, true);
      }
    });
  }

  // Theme Toggle
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const nextTheme = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      elements.themeToggleBtn.innerHTML = nextTheme === "light" 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    });
  }

  // Font Size Buttons
  document.querySelectorAll(".font-size-group button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".font-size-group button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const size = btn.getAttribute("data-size");
      if (size === "sm") document.documentElement.style.setProperty("--text-base-size", "0.95rem");
      if (size === "md") document.documentElement.style.setProperty("--text-base-size", "1.05rem");
      if (size === "lg") document.documentElement.style.setProperty("--text-base-size", "1.2rem");
    });
  });

  // Panel View Buttons (Lightbox Triggers)
  document.querySelectorAll(".btn-panel-view").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.getAttribute("data-panel");
      openPanelLightbox(panel);
    });
  });

  // Panel Audio Buttons (Play full story in that panel's language)
  document.querySelectorAll(".btn-panel-audio").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, lang);
      }
    });
  });

  // Hero Lightbox Launch Button
  if (elements.btnHeroOpenLightbox) {
    elements.btnHeroOpenLightbox.addEventListener("click", () => {
      openSplitLightbox(currentStory ? currentStory.id : null);
    });
  }

  // Lightbox Close buttons
  if (elements.lightboxCloseBtn) {
    elements.lightboxCloseBtn.addEventListener("click", () => closeSplitLightbox());
  }
  if (elements.lbFooterCloseBtn) {
    elements.lbFooterCloseBtn.addEventListener("click", () => closeSplitLightbox());
  }
  if (elements.storyLightbox) {
    elements.storyLightbox.addEventListener("click", (e) => {
      if (e.target === elements.storyLightbox) {
        closeSplitLightbox();
      }
    });
  }

  // Lightbox Story Jump Select
  if (elements.lbStoryJumpSelect) {
    elements.lbStoryJumpSelect.addEventListener("change", (e) => {
      openSplitLightbox(e.target.value, currentLightboxLang);
    });
  }

  // Lightbox Right Language Combo Box
  if (elements.lbLangCombo) {
    elements.lbLangCombo.addEventListener("change", (e) => {
      changeLightboxLang(e.target.value);
    });
  }

  // Lightbox Footer Vocab & Summary Collapse Toggle Button
  if (elements.lbCollapseToggleBtn) {
    elements.lbCollapseToggleBtn.addEventListener("click", () => {
      toggleLightboxFooter();
    });
  }

  // Lightbox Prev / Next Story Buttons
  if (elements.lbPrevBtn) {
    elements.lbPrevBtn.addEventListener("click", () => {
      navigateLightbox(-1);
    });
  }
  if (elements.lbNextBtn) {
    elements.lbNextBtn.addEventListener("click", () => {
      navigateLightbox(1);
    });
  }

  // Story Place Tabs (To Read vs Hidden / Read)
  if (elements.tabPlaceToRead) {
    elements.tabPlaceToRead.addEventListener("click", () => {
      switchStoryPlaceTab("active");
    });
  }
  if (elements.tabPlaceHidden) {
    elements.tabPlaceHidden.addEventListener("click", () => {
      switchStoryPlaceTab("hidden");
    });
  }

  // Read / Unread Marker Button in Hero Controls Bar
  if (elements.btnToggleRead) {
    elements.btnToggleRead.addEventListener("click", () => {
      if (currentStory) {
        toggleStoryReadStatus(currentStory.id);
      }
    });
  }

  // AI Story Marker Button in Hero Controls Bar
  if (elements.btnToggleAiMarker) {
    elements.btnToggleAiMarker.addEventListener("click", () => {
      if (currentStory) {
        toggleAiMarker(currentStory.id);
      }
    });
  }

  // Read / Unread Marker Button in Lightbox
  if (elements.lightboxReadMarkerBtn) {
    elements.lightboxReadMarkerBtn.addEventListener("click", () => {
      if (currentStory) {
        toggleStoryReadStatus(currentStory.id);
      }
    });
  }

  // Search input event
  if (elements.storySearchInput) {
    elements.storySearchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value;
      if (elements.clearSearchBtn) {
        elements.clearSearchBtn.style.display = currentSearchQuery ? "block" : "none";
      }
      renderStoryPillList();
    });
  }

  // Clear search button
  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener("click", () => {
      currentSearchQuery = "";
      if (elements.storySearchInput) elements.storySearchInput.value = "";
      elements.clearSearchBtn.style.display = "none";
      renderStoryPillList();
    });
  }

  // Category filter chips
  document.querySelectorAll(".cat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".cat-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentCategoryFilter = chip.getAttribute("data-category") || "all";
      renderStoryPillList();
    });
  });

  // Open AI Generator Modal
  if (elements.btnOpenAiGenerator) {
    elements.btnOpenAiGenerator.addEventListener("click", openAiGeneratorModal);
  }

  // Close AI Generator Modal
  if (elements.aiModalCloseBtn) {
    elements.aiModalCloseBtn.addEventListener("click", closeAiGeneratorModal);
  }

  if (elements.aiModalOverlay) {
    elements.aiModalOverlay.addEventListener("click", (e) => {
      if (e.target === elements.aiModalOverlay) {
        closeAiGeneratorModal();
      }
    });
  }

  // Topic Preset Chips in AI Modal
  document.querySelectorAll(".btn-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.getAttribute("data-topic");
      if (elements.aiTopicInput && topic) {
        elements.aiTopicInput.value = topic;
      }
    });
  });

  // AI Story Generator Trigger
  if (elements.btnGenerateStoryProcedural) {
    elements.btnGenerateStoryProcedural.addEventListener("click", handleGenerateAiStory);
  }

  // Gemini API Key Save / Clear
  if (elements.btnSaveGeminiKey) {
    elements.btnSaveGeminiKey.addEventListener("click", () => {
      const key = elements.geminiApiKeyInput ? elements.geminiApiKeyInput.value.trim() : "";
      if (!key) {
        alert("Please enter a valid Google Gemini API key!");
        return;
      }
      try {
        localStorage.setItem(GEMINI_API_KEY_STORAGE, key);
        if (elements.geminiKeyStatus) {
          elements.geminiKeyStatus.textContent = "✅ Gemini API key saved in local browser!";
          elements.geminiKeyStatus.style.display = "block";
        }
        alert("✅ Google Gemini API key saved successfully!");
      } catch (e) {
        alert("Could not save to localStorage: " + e.message);
      }
    });
  }

  if (elements.btnClearGeminiKey) {
    elements.btnClearGeminiKey.addEventListener("click", () => {
      try {
        localStorage.removeItem(GEMINI_API_KEY_STORAGE);
        if (elements.geminiApiKeyInput) elements.geminiApiKeyInput.value = "";
        if (elements.geminiKeyStatus) elements.geminiKeyStatus.style.display = "none";
        alert("Gemini API key removed. Using default free AI storyteller.");
      } catch (e) {}
    });
  }

  // Copy LLM Prompt for External Generation
  if (elements.btnCopyLlmPrompt) {
    elements.btnCopyLlmPrompt.addEventListener("click", () => {
      const topic = elements.aiTopicInput && elements.aiTopicInput.value.trim() ? elements.aiTopicInput.value.trim() : "Any engaging life scenario";
      const cat = elements.aiCategorySelect ? elements.aiCategorySelect.value : "Daily Life & Practical Conversations";
      const promptText = `Please generate a trilingual short story in the following exact JSON format for: "${topic}" in category: "${cat}".

The JSON must follow this exact structure:
{
  "id": "custom-${Date.now()}",
  "title": { "tamil": "தமிழ் தலைப்பு", "normal": "Normal English Title", "advanced": "Advanced English Title" },
  "category": "${cat}",
  "icon": "sparkles",
  "readTime": "1.5 min read",
  "summary": { "tamil": "கதை சுருக்கம்", "normal": "Normal English summary", "advanced": "Advanced English summary" },
  "lines": [
    {
      "num": 1,
      "tamil": "முதல் வாக்கியம் தமிழில்...",
      "normal": "First sentence in normal conversation English...",
      "advanced": "First sentence in sophisticated advanced C1/C2 English...",
      "vocab": [{ "normal": "key word", "advanced": "sophisticated synonym", "tamil": "அர்த்தம்" }]
    }
  ],
  "vocabComparison": [
    { "normal": "word", "advanced": "elevated synonym", "tamil": "தமிழ் பொருள்", "example": "Context sentence." }
  ],
  "quiz": [
    { "question": "Question text?", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "correct": 0, "explanation": "Why correct" }
  ]
}
Strictly return ONLY the raw JSON object with 8 lines, 4 vocab comparisons, and 6 quiz questions.`;

      const copySuccess = () => {
        if (elements.aiPromptCopiedNotice) {
          elements.aiPromptCopiedNotice.style.display = "block";
          setTimeout(() => {
            elements.aiPromptCopiedNotice.style.display = "none";
          }, 6000);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promptText).then(copySuccess).catch(() => fallbackCopy(promptText, copySuccess));
      } else {
        fallbackCopy(promptText, copySuccess);
      }
    });
  }

  // Import Custom JSON Story
  if (elements.btnImportJsonStory) {
    elements.btnImportJsonStory.addEventListener("click", () => {
      const rawJson = elements.aiJsonImportTextarea ? elements.aiJsonImportTextarea.value.trim() : "";
      if (!rawJson) {
        alert("Please paste valid JSON story data!");
        return;
      }
      try {
        const parsed = JSON.parse(rawJson);
        if (!parsed.id || !parsed.title || !parsed.lines) {
          throw new Error("Invalid structure: missing id, title, or lines.");
        }
        STORIES_DATA.unshift(parsed);
        saveCustomStory(parsed);

        currentCategoryFilter = "all";
        currentSearchQuery = "";
        if (elements.storySearchInput) elements.storySearchInput.value = "";
        document.querySelectorAll(".cat-chip").forEach((c) => c.classList.toggle("active", c.getAttribute("data-category") === "all"));

        renderStoryPillList();
        populateQuickStorySelect();
        updateAiStoriesCountBadge();
        loadStory(parsed.id, true);
        closeAiGeneratorModal();
        if (elements.aiJsonImportTextarea) elements.aiJsonImportTextarea.value = "";
        alert(`🎉 Custom story "${parsed.title.normal || parsed.title.tamil}" successfully imported!`);
      } catch (err) {
        alert("Failed to parse JSON story: " + err.message);
      }
    });
  }

  // Toggle Grid View (Compact shelf vs full expanded grid)
  if (elements.btnToggleGridView) {
    elements.btnToggleGridView.addEventListener("click", toggleGridView);
  }

  // Jump up to topics shelf
  if (elements.btnJumpToTopics) {
    elements.btnJumpToTopics.addEventListener("click", scrollToTopicsShelf);
  }
  if (elements.floatingJumpToTopicsBtn) {
    elements.floatingJumpToTopicsBtn.addEventListener("click", scrollToTopicsShelf);
  }

  // Previous Story Button
  if (elements.btnPrevStory) {
    elements.btnPrevStory.addEventListener("click", () => navigateStory(-1));
  }

  // Next Story Button
  if (elements.btnNextStory) {
    elements.btnNextStory.addEventListener("click", () => navigateStory(1));
  }

  // Quick Story Dropdown Select
  if (elements.quickStorySelect) {
    elements.quickStorySelect.addEventListener("change", (e) => {
      const selectedId = e.target.value;
      if (selectedId) {
        loadStory(selectedId, true);
        scrollActiveCardIntoShelfView(selectedId);
      }
    });
  }

  // Toggle floating jump button on page scroll
  window.addEventListener("scroll", () => {
    if (elements.floatingJumpToTopicsBtn) {
      elements.floatingJumpToTopicsBtn.classList.toggle("visible", window.scrollY > 350);
    }
  }, { passive: true });

  // Story Navigation Keyboard Shortcuts (Alt+Left, Alt+Right, Alt+Up)
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;

    if (e.altKey && e.key === "ArrowLeft") {
      e.preventDefault();
      navigateStory(-1);
    } else if (e.altKey && e.key === "ArrowRight") {
      e.preventDefault();
      navigateStory(1);
    } else if (e.altKey && e.key === "ArrowUp") {
      e.preventDefault();
      scrollToTopicsShelf();
    }
  });

  // Keyboard navigation for Lightbox and Modals (Esc, ArrowLeft, ArrowRight)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (isLightboxOpen) {
        closeSplitLightbox();
      }
      if (elements.aiModalOverlay && elements.aiModalOverlay.classList.contains("open")) {
        closeAiGeneratorModal();
      }
    } else if (isLightboxOpen) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateLightbox(1);
      }
    }
  });
}

// ==========================================================================
// CUSTOM STORIES & PROCEDURAL AI STORY GENERATOR FUNCTIONS
// ==========================================================================

function loadCustomStories() {
  try {
    const raw = localStorage.getItem(CUSTOM_STORIES_STORAGE_KEY);
    if (!raw) return [];
    let parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    let updated = false;

    // Filter out old robotic templates & auto-repair missing multilingual content
    const cleaned = [];
    for (let s of parsed) {
      if (!s || !s.lines || !s.lines.length) continue;
      const firstLineTa = s.lines[0].tamil || "";
      if (firstLineTa.includes("ஒரு முக்கியமான நாளில்") && firstLineTa.includes("எதிர்பாராத சவால் எழுந்தது")) {
        updated = true;
        continue;
      }
      
      // Auto-repair missing Telugu, Kannada, or Hindi fields or vocab so they NEVER fall back to English or remain empty
      const isMissingLangs = s.lines.some(l => !l.telugu || !l.kannada || !l.hindi || l.telugu === l.normal || l.kannada === l.normal) ||
        !s.vocabComparison ||
        !s.vocabComparison.length ||
        s.vocabComparison.some(v => !v.teluguSpeak || !v.kannadaSpeak || !v.hindiSpeak);
      if (isMissingLangs) {
        // If it is the young boy story ("சுட்டி சிறுவனின் கருணை" / Anbu)
        if (firstLineTa.includes("அன்பு") || firstLineTa.includes("சுட்டி சிறுவன்")) {
          const repaired = buildSmartContextualStory("boy", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else if (firstLineTa.includes("சீதாதேவி") || firstLineTa.includes("வானர")) {
          const repaired = buildSmartContextualStory("ramayana", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else if (firstLineTa.includes("அர்ஜுன") || firstLineTa.includes("துரோணாச்சாரியார்")) {
          const repaired = buildSmartContextualStory("mahabharatham", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else if (firstLineTa.includes("அருண்") || firstLineTa.includes("ஊதிய")) {
          const repaired = buildSmartContextualStory("salary", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else if (firstLineTa.includes("விமான")) {
          const repaired = buildSmartContextualStory("flight", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else if (firstLineTa.includes("கவின்") || firstLineTa.includes("தள்ளிப்போடும்")) {
          const repaired = buildSmartContextualStory("habit", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        } else {
          // General synthesize fallback
          const repaired = buildSmartContextualStory(s.title && s.title.normal ? s.title.normal : "Inspiring Story", s.category, s.icon);
          repaired.id = s.id || repaired.id;
          cleaned.push(repaired);
          updated = true;
          continue;
        }
      }
      cleaned.push(s);
    }

    if (updated || cleaned.length !== parsed.length) {
      localStorage.setItem(CUSTOM_STORIES_STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.warn("Failed to load custom stories", e);
    return [];
  }
}

function saveCustomStory(story) {
  try {
    const list = loadCustomStories();
    list.unshift(story);
    localStorage.setItem(CUSTOM_STORIES_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed to save custom story", e);
  }
}

function openAiGeneratorModal() {
  if (elements.aiModalOverlay) {
    elements.aiModalOverlay.classList.add("open");
    elements.aiModalOverlay.setAttribute("aria-hidden", "false");
    setAiLoadingState(false);
    if (elements.aiTopicInput) elements.aiTopicInput.focus();
  }
}

function closeAiGeneratorModal() {
  if (elements.aiModalOverlay) {
    elements.aiModalOverlay.classList.remove("open");
    elements.aiModalOverlay.setAttribute("aria-hidden", "true");
    setAiLoadingState(false);
  }
}

function setAiLoadingState(isLoading, stepText, descText) {
  if (elements.aiGeneratingStatus) {
    elements.aiGeneratingStatus.style.display = isLoading ? "flex" : "none";
  }
  if (elements.aiStatusStep && stepText) {
    elements.aiStatusStep.textContent = stepText;
  }
  if (elements.aiStatusDesc && descText) {
    elements.aiStatusDesc.textContent = descText;
  }
  if (elements.btnGenerateStoryProcedural) {
    elements.btnGenerateStoryProcedural.disabled = isLoading;
    elements.btnGenerateStoryProcedural.style.opacity = isLoading ? "0.7" : "1";
    elements.btnGenerateStoryProcedural.style.cursor = isLoading ? "wait" : "pointer";
  }
  if (elements.btnGenerateStoryText) {
    elements.btnGenerateStoryText.textContent = isLoading
      ? "⏳ Generating Trilingual Story..."
      : "✨ Generate Trilingual Story with AI";
  }
}

// Main AI Generation Handler
async function handleGenerateAiStory() {
  const topic = elements.aiTopicInput ? elements.aiTopicInput.value.trim() : "";
  const cat = elements.aiCategorySelect ? elements.aiCategorySelect.value : "Inspiration & Wisdom";
  const icon = elements.aiIconSelect ? elements.aiIconSelect.value : "sparkles";

  if (!topic) {
    alert("Please enter a story topic or select one from quick ideas above!");
    if (elements.aiTopicInput) elements.aiTopicInput.focus();
    return;
  }

  setAiLoadingState(true, "Connecting to AI Story Engine...", "Initiating trilingual narrative generator...");

  try {
    const newStory = await generateTrilingualStory(topic, cat, icon);

    STORIES_DATA.unshift(newStory);
    saveCustomStory(newStory);

    // Reset filters so the new story is visible immediately
    currentCategoryFilter = "all";
    currentSearchQuery = "";
    if (elements.storySearchInput) elements.storySearchInput.value = "";
    document.querySelectorAll(".cat-chip").forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-category") === "all");
    });

    if (currentStoryTab !== "active") {
      switchStoryPlaceTab("active");
    } else {
      renderStoryPillList();
    }

    populateQuickStorySelect();
    updateAiStoriesCountBadge();
    loadStory(newStory.id, true);
    closeAiGeneratorModal();

    if (elements.aiTopicInput) elements.aiTopicInput.value = "";
    alert(`🎉 New AI Story created and loaded: "${newStory.title.normal}"!`);
  } catch (err) {
    console.error("AI Generation error:", err);
    alert("Could not generate story: " + err.message);
  } finally {
    setAiLoadingState(false);
  }
}

// Master Story Generator Orchestrator
async function generateTrilingualStory(rawTopic, category, icon) {
  const topic = (rawTopic || "New Perspective").trim();
  const lower = topic.toLowerCase();

  // Instant Epic Priority Matching for Ramayana & Mahabharata
  const isEpic = lower.includes("ramayana") || lower.includes("ramayanam") || lower.includes("rama") ||
                 lower.includes("இராமாயண") || lower.includes("ராமர்") ||
                 lower.includes("mahabharat") || lower.includes("mahabharatha") || lower.includes("mahabharatham") ||
                 lower.includes("arjun") || lower.includes("arjuna") || lower.includes("மகாபாரத") || lower.includes("அர்ஜுன");

  const savedGeminiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE);

  // Strategy 1: Try Google Gemini API if user configured an API key
  if (savedGeminiKey && savedGeminiKey.trim()) {
    setAiLoadingState(true, "Google Gemini 2.0 Flash is Thinking...", `Crafting customized story for "${topic}"...`);
    try {
      const geminiStory = await generateWithGemini(topic, category, icon, savedGeminiKey.trim());
      if (geminiStory) {
        return repairAndValidateStory(geminiStory, topic, category, icon);
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to smart engine:", e.message);
    }
  }

  // If topic is Ramayana or Mahabharata, deliver the authentic epic chapter instantly without flaky network latency
  if (isEpic) {
    setAiLoadingState(true, "Opening Epic Archives...", `Retrieving authentic chapter for "${topic}"...`);
    return buildSmartContextualStory(topic, category, icon);
  }

  // Strategy 2: Try Free Live AI Engine (Pollinations text API with openai-fast)
  setAiLoadingState(true, "AI Storyteller is Writing...", `Weaving authentic Tamil & English lines for "${topic}"...`);
  try {
    const liveAiStory = await generateWithPollinations(topic, category, icon);
    if (liveAiStory) {
      return repairAndValidateStory(liveAiStory, topic, category, icon);
    }
  } catch (e) {
    console.warn("Live online AI fetch failed, falling back to smart contextual engine:", e.message);
  }

  // Strategy 3: Intelligent Contextual Storyteller Engine (Instant, Offline, Rich Narrative)
  setAiLoadingState(true, "Crafting Contextual Story...", `Synthesizing authentic narrative for "${topic}"...`);
  return buildSmartContextualStory(topic, category, icon);
}

// Strategy 1 Implementation: Google Gemini API
async function generateWithGemini(topic, category, icon, apiKey) {
  const prompt = createAiStoryPrompt(topic, category, icon);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    }),
    signal: controller.signal
  });
  clearTimeout(timeoutId);

  if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Empty response from Gemini API");

  return parseJsonStory(rawText);
}

// Strategy 2 Implementation: Free Live AI Engine (Pollinations POST with openai-fast & 30s timeout)
async function generateWithPollinations(topic, category, icon) {
  const prompt = createAiStoryPrompt(topic, category, icon);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  const res = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }],
      model: "openai-fast"
    }),
    signal: controller.signal
  });
  clearTimeout(timeoutId);

  if (!res.ok) throw new Error(`AI API error ${res.status}`);
  const rawText = await res.text();
  return parseJsonStory(rawText);
}

// Structured Prompt Constructor
function createAiStoryPrompt(topic, category, icon) {
  return `You are a master bilingual writer and language teacher specializing in Tamil and English education.
Write a rich, authentic short story about the topic: "${topic}" in category: "${category}".

STRICT GUIDELINES:
1. NEVER use generic template statements like "ஒரு முக்கியமான நாளில்... எதிர்பாராத சவால் எழுந்தது" or "confronted a momentous juncture".
2. If the topic is an epic, myth, or historical legend (such as Ramayana, Mahabharata, Alexander, Buddha, Ponniyin Selvan), tell a genuine dramatic chapter/episode from that epic with authentic characters and events, NOT a modern student learning.
3. Tell a REAL narrative with named characters, natural setting, engaging challenge, dialogue or internal thoughts, and an inspiring resolution.
4. Language specifications:
   - "tamil": Natural, grammatically flawless, fluent Tamil (தூய இயல்பான தமிழ்).
   - "normal": Conversational everyday English (A2-B1 level).
   - "advanced": Sophisticated, literary, elevated English with C1-C2 vocabulary.
5. Exactly 8 sequential story lines.
6. In each line, include 1-2 key vocab mappings (normal word, advanced word, Tamil meaning).
7. Provide 4 vocabulary comparisons with example sentences.
8. Provide 4 multiple-choice quiz questions with correct index and explanation.

Output STRICTLY valid JSON ONLY (no markdown backtick fences, no preambles, no commentary) matching this exact schema:
{
  "id": "ai-${Date.now()}",
  "title": { "tamil": "தமிழ் தலைப்பு", "normal": "Normal English Title", "advanced": "Advanced English Title" },
  "category": "${category}",
  "icon": "${icon || "sparkles"}",
  "readTime": "1.5 min read",
  "summary": { "tamil": "கதை சுருக்கம்...", "normal": "Normal summary...", "advanced": "Advanced summary..." },
  "lines": [
    {
      "num": 1,
      "tamil": "முதல் வாக்கியம் தமிழில்...",
      "normal": "First sentence in normal English...",
      "advanced": "First sentence in advanced English...",
      "vocab": [ { "normal": "word", "advanced": "synonym", "tamil": "பொருள்" } ]
    }
  ],
  "vocabComparison": [
    { "normal": "word", "advanced": "synonym", "tamil": "பொருள்", "example": "Context sentence." }
  ],
  "quiz": [
    { "question": "Question text?", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "Why correct" }
  ]
}`;
}

// Robust Multi-Stage JSON Cleaner and Parser
function parseJsonStory(rawText) {
  if (!rawText) return null;

  function tryParse(str) {
    if (!str || typeof str !== "string") return null;
    let text = str.trim();

    // Strip markdown code fences if present
    text = text.replace(/^```json\s*/i, "")
               .replace(/^```\s*/i, "")
               .replace(/```\s*$/i, "")
               .trim();

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

    const candidate = text.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch (e1) {
      try {
        const sanitized = candidate
          .replace(/,\s*([}\]])/g, "$1")
          .replace(/[\u201C\u201D]/g, '"');
        return JSON.parse(sanitized);
      } catch (e2) {
        return null;
      }
    }
  }

  // 1. Try parsing raw text directly
  let parsed = tryParse(rawText);

  // 2. If wrapped in OpenAI/Pollinations wrapper object
  if (parsed && typeof parsed === "object") {
    if (Array.isArray(parsed.lines)) return parsed;

    const candidates = [
      parsed.content,
      parsed.message?.content,
      parsed.text,
      parsed.choices?.[0]?.message?.content,
      parsed.candidates?.[0]?.content?.parts?.[0]?.text
    ];

    for (const item of candidates) {
      if (typeof item === "string") {
        const nested = tryParse(item);
        if (nested && Array.isArray(nested.lines)) return nested;
      } else if (item && typeof item === "object" && Array.isArray(item.lines)) {
        return item;
      }
    }
  }

  // 3. Fallback: Search directly for {"lines" or "lines": [ in the raw string
  const linesIdx = rawText.indexOf('"lines"');
  if (linesIdx !== -1) {
    const startBrace = rawText.lastIndexOf("{", linesIdx);
    const endBrace = rawText.lastIndexOf("}");
    if (startBrace !== -1 && endBrace > startBrace) {
      const candidate = rawText.slice(startBrace, endBrace + 1);
      const parsedCandidate = tryParse(candidate);
      if (parsedCandidate && Array.isArray(parsedCandidate.lines)) {
        return parsedCandidate;
      }
    }
  }

  return parsed;
}

// Story Schema Validator and Completer
function repairAndValidateStory(story, topic, category, icon) {
  const safeId = "ai-" + topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) + "-" + Date.now().toString().slice(-4);

  if (!story || typeof story !== "object") {
    return buildSmartContextualStory(topic, category, icon);
  }

  story.id = safeId;
  story.isAi = true;
  story.source = "ai";
  story.category = story.category || category || "Inspiration & Wisdom";
  story.icon = story.icon || icon || "sparkles";
  story.readTime = story.readTime || "1.5 min read";

  if (!story.title || typeof story.title !== "object") {
    story.title = {
      tamil: `${topic} - ஒரு பார்வை`,
      normal: `The Tale of ${topic}`,
      advanced: `The Art of ${topic}`
    };
  }

  if (!story.summary || typeof story.summary !== "object") {
    story.summary = {
      tamil: `${topic} குறித்த சிந்தனைகளை பகிரும் சிறுகதை.`,
      normal: `An engaging trilingual short story exploring ${topic}.`,
      advanced: `A nuanced trilingual discourse navigating ${topic}.`
    };
  }

  if (!Array.isArray(story.lines) || story.lines.length < 4) {
    return buildSmartContextualStory(topic, category, icon);
  }

  // Normalize each line
  story.lines = story.lines.map((line, idx) => ({
    num: idx + 1,
    tamil: line.tamil || line.ta || "...",
    normal: line.normal || line.en || "...",
    advanced: line.advanced || line.adv || line.normal || "...",
    vocab: Array.isArray(line.vocab) && line.vocab.length > 0 ? line.vocab : [
      { normal: "important step", advanced: "pivotal milestone", tamil: "முக்கிய தருணம்" }
    ]
  }));

  // Ensure vocabComparison exists
  if (!Array.isArray(story.vocabComparison) || story.vocabComparison.length === 0) {
    story.vocabComparison = [
      {
          normal: "Courage / Bravery",
          advanced: "Fortitude / Intrepidity",
          tamil: "துணிச்சல் / வீரம்",
          telugu: "ధైర్యం / ధైర్యం",
          teluguSpeak: "தைர்யம் / தைர்யம்",
          kannada: "ಧೈರ್ಯ / ಶೌರ್ಯ",
          kannadaSpeak: "தைர்ய / ஶௌர்ய",
          hindi: "साहस/बहादुरी",
          hindiSpeak: "ஸாஹஸ/பஹாதுரீ",
          example: "He exhibited remarkable fortitude in times of uncertainty."
        },
      {
          normal: "Calmness / Composure",
          advanced: "Equilibrium / Poise",
          tamil: "நிதானம் / அமைதி",
          telugu: "ప్రశాంతత / ప్రశాంతత",
          teluguSpeak: "ப்ரஶாம்தத / ப்ரஶாம்தத",
          kannada: "ಶಾಂತತೆ / ಸಂಯಮ",
          kannadaSpeak: "ஶாம்ததெ / ஸம்யம",
          hindi: "शांति/संयम",
          hindiSpeak: "ஶாம்தி/ஸம்யம",
          example: "She maintained her equilibrium amidst chaos."
        },
      {
          normal: "Clear speech",
          advanced: "Lucid articulation",
          tamil: "தெளிவான பேச்சு",
          telugu: "స్పష్టమైన ప్రసంగం",
          teluguSpeak: "ஸ்பஷ்டமைந ப்ரஸம்கம்",
          kannada: "ಸ್ಪಷ್ಟ ಮಾತು",
          kannadaSpeak: "ஸ்பஷ்ட மாது",
          hindi: "स्पष्ट भाषण",
          hindiSpeak: "ஸ்பஷ்ட பாஷண",
          example: "Her lucid articulation moved everyone in the audience."
        },
      {
          normal: "Great milestone",
          advanced: "Pivotal triumph",
          tamil: "மகத்தான வெற்றி",
          telugu: "గొప్ప మైలురాయి",
          teluguSpeak: "கொப்ப மைலுராயி",
          kannada: "ದೊಡ್ಡ ಮೈಲಿಗಲ್ಲು",
          kannadaSpeak: "தொட்ட மைலிகல்லு",
          hindi: "महान मील का पत्थर",
          hindiSpeak: "மஹாந மீல கா பத்தர",
          example: "Completing the challenge proved to be a pivotal triumph."
        }
    ];
  }

  // Ensure quiz exists
  if (!Array.isArray(story.quiz) || story.quiz.length === 0) {
    story.quiz = [
      { question: `What was the central theme of this story about ${topic}?`, options: ["Giving up quickly", "Demonstrating patience, courage, and thoughtful action", "Ignoring advice", "Panicking in crisis"], correct: 1, explanation: "The story highlights the virtue of thoughtful, composed perseverance." },
      { question: "What does 'fortitude' mean in Tamil?", options: ["பயம்", "மன உறுதி / தைரியம்", "சோம்பல்", "வெறுப்பு"], correct: 1, explanation: "'Fortitude' refers to courageous resilience and mental strength (மன உறுதி)." },
      { question: "What is the meaning of 'equilibrium' under pressure?", options: ["Emotional chaos", "Steady calm and balanced composure", "Angry shouting", "Carelessness"], correct: 1, explanation: "'Equilibrium' refers to a balanced state of calm composure under pressure." },
      { question: "Which advanced word signifies expressing thoughts clearly?", options: ["Lucid articulation", "Muffled murmur", "Obscure silence", "Vague stutter"], correct: 0, explanation: "'Lucid articulation' means expressing ideas with clear, coherent eloquence." }
    ];
  }

  return story;
}

// Strategy 3 Implementation: Intelligent Contextual Storyteller Engine

function make_universal_line(num, cleanTitle) {
  const ta_lines = [
    `வரலாற்றின் பக்கங்களிலும் மக்களின் நினைவுகளிலும் ${cleanTitle} எப்போதும் ஒரு தனித்துவமான சிறப்பைப் பெற்று விளங்குகிறது.`,
    `ஒரு முக்கியமான திருப்புமுனையில், ${cleanTitle} தொடர்பான ஒரு பெரிய சவாலை எதிர்கொள்ள வேண்டிய சூழ்நிலை உருவானது.`,
    `சூழ்நிலையின் கனத்தை உணர்ந்த நாயகன், தயக்கமோ அச்சமோ இன்றி முதல் அடியை நம்பிக்கையுடன் எடுத்து வைத்தார்.`,
    `வழியில் பல எதிர்பாராத தடைகள் வந்தபோதிலும், அவற்றை தோல்வியாகக் கருதாமல் புதிய அனுபவங்களாக மாற்றினார்.`,
    `கூர்மையான திட்டமிடலும், தளராத உழைப்பும் இணைந்தபோது ஒவ்வொரு நாளும் முன்னேற்றம் தெளிவாகத் தெரியத் தொடங்கியது.`,
    `நெருக்கடி மிகுந்த அந்தத் தருணத்தில், அவரது நிதானமும் நுட்பமான அறிவும் மிகப்பெரிய திருப்புமுனையை ஏற்படுத்தியது.`,
    `அவரது உறுதியையும் செயல்திறனையும் கண்ட அனைவரும் வியந்து, அவரது தலைமைத்துவத்தைப் பாராட்டினர்.`,
    `துணிச்சலான முடிவுகளும் தளராத உழைப்புமே எந்தவொரு இலக்கையும் வெல்வதற்கான உண்மையான திறவுகோல் என்பது உறுதியானது.`
  ];
  const en_lines = [
    `In the annals of history and human memory, ${cleanTitle} has always occupied a position of unique distinction.`,
    `At a pivotal turning point, a challenging situation arose regarding ${cleanTitle} that called for deep courage and swift action.`,
    `Recognizing the gravity of the moment, the protagonist took the initial step forward with unwavering confidence.`,
    `Despite encountering unexpected obstacles along the path, he viewed them not as failures, but as invaluable learning experiences.`,
    `When thoughtful planning met relentless perseverance, noticeable progress began to flourish every single day.`,
    `During the most demanding hour, his calm composure and astute wisdom generated an extraordinary breakthrough.`,
    `Witnessing his clarity and steadfast resolve, all who observed were inspired and commended his leadership.`,
    `It became clear that courageous decisions backed by persistent action remain the ultimate key to conquering any ambition.`
  ];
  const te_lines = [
    `చరిత్ర పుటలలో మరియు మానవ స్మృతిలో, ${cleanTitle} ఎల్లప్పుడూ ఒక విశిష్ట స్థానాన్ని ఆక్రమించింది.`,
    `ఒక కీలకమైన మలుపులో, ${cleanTitle} కు సంబంధించి అపారమైన ధైర్యం మరియు త్వరిత చర్యను కోరే సవాలు ఎదురైంది.`,
    `సమయ ప్రాధాన్యతను గుర్తించి, నాయకుడు ఎలాంటి సంకోచం లేకుండా ఆత్మవిశ్వాసంతో మొదటి అడుగు వేశాడు.`,
    `దారిలో ఎన్నో ఊహించని అడ్డంకులు ఎదురైనప్పటికీ, వాటిని ఓటములుగా భావించక విలువైన అనుభవాలుగా మార్చుకున్నాడు.`,
    `సరైన ప్రణాళిక మరియు అలుపెరుగని కృషి తోడైనప్పుడు ప్రతిరోజూ స్పష్టమైన పురోగతి కనిపించడం మొదలైంది.`,
    `అత్యంత కీలకమైన ఆ సమయంలో, అతని శాంతచిత్తం మరియు సూక్ష్మబుద్ధి ఒక అద్భుతమైన మలుపును తీసుకువచ్చాయి.`,
    `అతని స్పష్టత మరియు నిశ్చల సంకల్పాన్ని చూసి ప్రతి ఒక్కరూ ప్రేరణ పొంది అతని నాయకత్వాన్ని ప్రశంసించారు.`,
    `ధైర్యంతో కూడిన నిర్ణయాలు మరియు నిరంతర శ్రమే ఏ ఆశయానైనా సాధించడానికి అసలైన తాళంచెవి అని స్పష్టమైంది.`
  ];
  const kn_lines = [
    `ಇತಿಹಾಸದ ಪುಟಗಳಲ್ಲಿ ಮತ್ತು ಜನರ ಸ್ಮೃತಿಯಲ್ಲಿ, ${cleanTitle} ಯಾವಾಗಲೂ ಒಂದು ವಿಶಿಷ್ಟ ಸ್ಥಾನವನ್ನು ಪಡೆದಿದೆ.`,
    `ಒಂದು ಪ್ರಮುಖ ತಿರುವಿನಲ್ಲಿ, ${cleanTitle} ಕುರಿತಾಗಿ ಅಪಾರ ಧೈರ್ಯ ಮತ್ತು ತ್ವರಿತ ಕ್ರಮವನ್ನು ಬಯಸುವ ಸವಾಲು ಎದುರಾಯಿತು.`,
    `ಪರಿಸ್ಥಿತಿಯ ಗಂಭೀರತೆಯನ್ನು ಅರಿತು, ನಾಯಕನು ಯಾವುದೇ ಅಂಜಿಕೆಯಿಲ್ಲದೆ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮೊದಲ ಹೆಜ್ಜೆಯನ್ನು ಇಟ್ಟನು.`,
    `ಹಾದಿಯಲ್ಲಿ ಹಲವು ಅನಿರೀಕ್ಷಿತ ಅಡೆತಡೆಗಳು ಎದುರಾದರೂ, ಅವುಗಳನ್ನು ಸೋಲೆನ್ನದೆ ಮೌಲ್ಯಯುತ ಕಲಿಕೆಯ ಮೈಲಿಗಲ್ಲುಗಳನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿದನು.`,
    `ಸರಿಯಾದ ಯೋಜನೆ ಮತ್ತು ಅವಿಶ್ರಾಂತ ಪರಿಶ್ರಮ ಒಂದಾದಾಗ ಪ್ರತಿದಿನ ಸ್ಪಷ್ಟ ಪ್ರಗತಿ ಕಾಣಲಾರಂಭಿಸಿತು.`,
    `ಅತ್ಯಂತ ಕಠಿಣವಾದ ಆ ಕ್ಷಣದಲ್ಲಿ, ಅವನ ಪ್ರಶಾಂತ ಸಂಯಮ ಮತ್ತು ಬುದ್ಧಿವಂತಿಕೆಯು ಒಂದು ಅದ್ಭುತ ತಿರುವನ್ನು ನೀಡಿತು.`,
    `ಅವನ ಸ್ಪಷ್ಟತೆ ಮತ್ತು ದೃಢ ಸಂಕಲ್ಪವನ್ನು ಕಂಡು ಎಲ್ಲರೂ ಪ್ರೇರಿತರಾಗಿ ಅವನ ನಾಯಕತ್ವವನ್ನು ಶ್ಲಾಘಿಸಿದರು.`,
    `ಧೈರ್ಯಶಾಲಿ ನಿರ್ಧಾರಗಳು ಮತ್ತು ನಿರಂತರ ಪರಿಶ್ರಮವೇ ಯಾವುದೇ ಗುರಿಯನ್ನು ತಲುಪಲು ಮೂಲ ಕೀಲಿ ಎಂಬುದು ಸ್ಪಷ್ಟವಾಯಿತು.`
  ];
  const hi_lines = [
    `इतिहास के पन्नों और जनमानस की स्मृति में, ${cleanTitle} ने सदैव एक विशिष्ट स्थान प्राप्त किया है।`,
    `एक महत्वपूर्ण मोड़ पर, ${cleanTitle} से जुड़ी एक बड़ी चुनौती सामने आई जिसने साहस और त्वरित निर्णय की माँग की।`,
    `समय की गंभीरता को पहचानकर, नायक ने बिना किसी हिचकिचाहट के आत्मविश्वास के साथ पहला कदम बढ़ाया।`,
    `मार्ग में कई अप्रत्याशित बाधाएँ आने पर भी, उसने उन्हें पराजय न मानकर सीखने का बहुमूल्य अवसर बनाया।`,
    `जब सुविचारित योजना और अथक परिश्रम मिले, तो प्रतिदिन स्पष्ट प्रगति दिखाई देने लगी।`,
    `उस अत्यंत कठिन घड़ी में, उसके शांत धैर्य और कुशाग्र बुद्धि ने एक अभूतपूर्व सफलता का मार्ग प्रशस्त किया।`,
    `उसकी स्पष्टता और दृढ़ संकल्प को देखकर सभी लोग अत्यंत प्रेरित हुए और उसके नेतृत्व की सराहना की।`,
    `यह सिद्ध हो गया कि साहसपूर्ण निर्णय और निरंतर कर्म ही किसी भी महत्वाकांक्षा को फलीभूत करने की अंतिम कुंजी है।`
  ];
  const idx = num - 1;
  return {
    num: num,
    tamil: ta_lines[idx],
    normal: en_lines[idx],
    advanced: en_lines[idx],
    vocab: [{ normal: "key turning point", advanced: "momentous juncture", tamil: "முக்கிய திருப்புமுனை" }],
    telugu: te_lines[idx],
    teluguScript: te_lines[idx],
    kannada: kn_lines[idx],
    kannadaScript: kn_lines[idx],
    hindi: hi_lines[idx],
    hindiScript: hi_lines[idx]
  };
}

function buildSmartContextualStory(rawTopic, category, icon) {
  const topic = (rawTopic || "Inspiring Journey").trim();
  const lower = topic.toLowerCase();
  const safeId = "ai-" + topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) + "-" + Date.now().toString().slice(-4);

  // 1. RAMAYANA (இராமாயணம்: சேது பாலமும் அணிலின் பக்தியும்)
  if (
    lower.includes("ramayana") ||
    lower.includes("ramayanam") ||
    lower.includes("rama") ||
    lower.includes("sita") ||
    lower.includes("hanuman") ||
    lower.includes("ravana") ||
    lower.includes("setu") ||
    lower.includes("இராமாயண") ||
    lower.includes("ராமர்")
  ) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "இராமாயணம்: சேது பாலமும் அணிலின் பக்தியும்",
        normal: "The Ramayana: The Floating Bridge and the Devoted Squirrel",
        advanced: "The Ramayana: The Oceanic Causeway and the Squirrel's Steadfast Devotion",
        telugu: "రామాయణం: సేతు వంతెన మరియు ఉడుత భక్తి",
        kannada: "ರಾಮಾಯಣ: ಸೇತು ಸೇತುವೆ ಮತ್ತು ಅಳಿಲಿನ ಭಕ್ತಿ",
        hindi: "रामायण: सेतु पुल और गिलहरी की भक्ति"
      },
      category: category || "Inspiration & Wisdom",
      icon: icon || "compass",
      readTime: "2 min read",
      summary: {
        tamil: "சீதையை மீட்க பாலம் அமைத்த வானரப் படைகளுக்கு நடுவே, தன் உடலால் மணல் தூவி உதவிய சிறு அணிலின் தூய பக்தியையும், ஸ்ரீராமரின் பேரன்பையும் போற்றும் அழியா காவிய அத்தியாயம்.",
        normal: "A beloved chapter from the epic Ramayana where a tiny squirrel selflessly carried sand to aid the great ocean bridge, receiving Sri Rama's eternal blessing.",
        advanced: "A venerated episode from the epic Ramayana extolling the consecrated endeavor of a minuscule squirrel assisting the Vanara legions in constructing the oceanic causeway.",
        telugu: "సీతను రక్షించడానికి సముద్రంపై వంతెన నిర్మిస్తున్న వానర సైన్యానికి ఇసుక మోసి సహాయం చేసిన చిన్న ఉడుత నిస్వార్థ భక్తిని మరియు శ్రీరాముడి ప్రేమను తెలిపే కథ.",
        kannada: "ಸೀತೆಯನ್ನು ರಕ್ಷಿಸಲು ಸಮುದ್ರದ ಮೇಲೆ ಸೇತುವೆ ನಿರ್ಮಿಸುತ್ತಿದ್ದ ವಾನರ ಸೈನ್ಯಕ್ಕೆ ಮರಳನ್ನು ಹೊತ್ತು ಸಹಾಯ ಮಾಡಿದ ಸಣ್ಣ ಅಳಿಲಿನ ನಿಷ್ಠಾವಂತ ಭಕ್ತಿ ಮತ್ತು ಶ್ರೀರಾಮನ ಪ್ರೀತಿಯನ್ನು ವಿವರಿಸುವ ಕಥೆ.",
        hindi: "माता सीता को छुड़ाने के लिए समुद्र पर पुल बना रही वानर सेना की मदद करने वाली एक छोटी गिलहरी की निस्वार्थ भक्ति और भगवान श्री राम के असीम प्रेम की पावन कथा।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "சீதாதேவியை மீட்க கடலைக் கடக்க வேண்டிய தருணத்தில், வானர சேனை மாபெரும் பாறைகளை கடலில் உருட்டி பாலம் அமைத்துக்கொண்டிருந்தது.",
            "normal": "To cross the vast ocean and rescue Sita Devi, the mighty Vanara army was rolling massive boulders into the roaring sea.",
            "advanced": "Mobilized to traverse the ocean and liberate Sita Devi, the formidable Vanara legions dislodged colossal boulders into the tumultuous waves.",
            "vocab": [
                  {
                        "normal": "mighty army",
                        "advanced": "formidable legions",
                        "tamil": "வீரம்மிக்க படை"
                  },
                  {
                        "normal": "massive boulders",
                        "advanced": "colossal boulders",
                        "tamil": "பிரம்மாண்ட பாறைகள்"
                  }
            ],
            "telugu": "సీతాదేవిని రక్షించడానికి విశాలమైన సముద్రం దాటవలసి వచ్చినప్పుడు, శక్తివంతమైన వానర సైన్యం పెద్ద బండరాళ్లను సముద్రంలోకి దొర్లిస్తూ వంతెనను నిర్మిస్తోంది.",
            "teluguSpeak": "ஸீதாதேவிநி ரக்ஷிம்சடாநிகி விஶாலமைந ஸமுத்ரம் தாடவலஸி வச்சிநப்புடு, ஶக்திவம்தமைந வாநர ஸைந்யம் பெத்த பம்டராள்லநு ஸமுத்ரம்லோகி தொர்லிஸ்தூ வம்தெநநு நிர்மிஸ்தோம்தி.",
            "teluguSub": "seethaadevini rakshimchadaaniki vishaalamaina samudram daatavalasi vachchinappudu, shakthivamthamaina vaanara sainyam pedda bamdaraallanu samudramloki dorlisthoo vamthenanu nirmisthomdi.",
            "teluguScript": "సీతాదేవిని రక్షించడానికి విశాలమైన సముద్రం దాటవలసి వచ్చినప్పుడు, శక్తివంతమైన వానర సైన్యం పెద్ద బండరాళ్లను సముద్రంలోకి దొర్లిస్తూ వంతెనను నిర్మిస్తోంది.",
            "kannada": "ಸೀತಾದೇವಿಯನ್ನು ರಕ್ಷಿಸಲು ವಿಶಾಲ ಸಮುದ್ರವನ್ನು ದಾಟಲು, ಬಲಿಷ್ಠ ವಾನರ ಸೈನ್ಯವು ಬೃಹತ್ ಬಂಡೆಗಳನ್ನು ಘರ್ಜಿಸುವ ಸಮುದ್ರಕ್ಕೆ ಉರುಳಿಸಿ ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸುತ್ತಿತ್ತು.",
            "kannadaSpeak": "ஸீதாதேவியந்நு ரக்ஷிஸலு விஶால ஸமுத்ரவந்நு தாடலு, பலிஷ்ட வாநர ஸைந்யவு ப்ருஹத் பம்டெகளந்நு கர்ஜிஸுவ ஸமுத்ரக்கெ உருளிஸி ஸேதுவெயந்நு நிர்மிஸுத்தித்து.",
            "kannadaSub": "seethaadeviyannu rakshisalu vishaala samudravannu daatalu, balishtha vaanara sainyavu bruhath bamdegalannu gharjisuva samudrakke urulisi sethuveyannu nirmisuththiththu.",
            "kannadaScript": "ಸೀತಾದೇವಿಯನ್ನು ರಕ್ಷಿಸಲು ವಿಶಾಲ ಸಮುದ್ರವನ್ನು ದಾಟಲು, ಬಲಿಷ್ಠ ವಾನರ ಸೈನ್ಯವು ಬೃಹತ್ ಬಂಡೆಗಳನ್ನು ಘರ್ಜಿಸುವ ಸಮುದ್ರಕ್ಕೆ ಉರುಳಿಸಿ ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸುತ್ತಿತ್ತು.",
            "hindi": "माता सीता को छुड़ाने के लिए विशाल समुद्र पार करने हेतु, पराक्रमी वानर सेना समुद्र में विशाल शिलाएँ डालकर सेतु का निर्माण कर रही थी।",
            "hindiSpeak": "மாதா ஸீதா கோ சுட़ாநே கே லிஏ விஶால ஸமுத்ர பார கரநே ஹேது, பராக்ரமீ வாநர ஸேநா ஸமுத்ர மேம் விஶால ஶிலாஏँ டாலகர ஸேது கா நிர்மாண கர ரஹீ தீ।",
            "hindiSub": "maathaa seethaa ko chhuda़aane ke lie vishaala samudra paara karane hethu, paraakramee vaanara senaa samudra mem vishaala shilaaeँ daalakara sethu kaa nirmaana kara rahee thee।",
            "hindiScript": "माता सीता को छुड़ाने के लिए विशाल समुद्र पार करने हेतु, पराक्रमी वानर सेना समुद्र में विशाल शिलाएँ डालकर सेतु का निर्माण कर रही थी।"
      },
      {
            "num": 2,
            "tamil": "நலன் மற்றும் நீலன் தலைமையில் வானர வீரர்கள் \"ஸ்ரீராமா\" என்று பொறிக்கப்பட்ட மிதக்கும் கற்களைக் கொண்டு சேது பாலத்தை தீவிரமாக கட்டினர்.",
            "normal": "Under the leadership of Nala and Neela, the valiant warriors engraved the sacred name of Rama upon buoyant rocks and assembled the great bridge.",
            "advanced": "Guided by the craftsmanship of Nala and Nila, the valiant warriors inscribed the hallowed name upon buoyant rocks, assembling the grand causeway.",
            "vocab": [
                  {
                        "normal": "sacred name",
                        "advanced": "hallowed inscription",
                        "tamil": "புனிதப் பெயர்"
                  },
                  {
                        "normal": "floating rocks",
                        "advanced": "buoyant rocks",
                        "tamil": "மிதக்கும் கற்கள்"
                  }
            ],
            "telugu": "నలుడు మరియు నీలుడి నాయకత్వంలో, వానర వీరులు రాళ్లపై \"శ్రీరామ\" అని చెక్కి తేలియాడే రాళ్లతో సేతు వంతెనను ఉత్సాహంగా నిర్మించారు.",
            "teluguSpeak": "நலுடு மரியு நீலுடி நாயகத்வம்லோ, வாநர வீருலு ராள்லபை \"ஶ்ரீராம\" அநி செக்கி தேலியாடே ராள்லதோ ஸேது வம்தெநநு உத்ஸாஹம்கா நிர்மிம்சாரு.",
            "teluguSub": "naludu mariyu neeludi naayakathvamlo, vaanara veerulu raallapai \"shreeraama\" ani chekki theliyaade raallatho sethu vamthenanu uthsaahamgaa nirmimchaaru.",
            "teluguScript": "నలుడు మరియు నీలుడి నాయకత్వంలో, వానర వీరులు రాళ్లపై \"శ్రీరామ\" అని చెక్కి తేలియాడే రాళ్లతో సేతు వంతెనను ఉత్సాహంగా నిర్మించారు.",
            "kannada": "ನಳ ಮತ್ತು ನೀಲರ ನೇತೃತ್ವದಲ್ಲಿ, ಶೂರ ಯೋಧರು ತೇಲುವ ಬಂಡೆಗಳ ಮೇಲೆ \"ಶ್ರೀರಾಮ\" ಎಂದು ಕೆತ್ತಿ ಮಹಾನ್ ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸಿದರು.",
            "kannadaSpeak": "நள மத்து நீலர நேத்ருத்வதல்லி, ஶூர யோதரு தேலுவ பம்டெகள மேலெ \"ஶ்ரீராம\" எம்து கெத்தி மஹாந் ஸேதுவெயந்நு நிர்மிஸிதரு.",
            "kannadaSub": "nala maththu neelara nethruthvadalli, shoora yodharu theluva bamdegala mele \"shreeraama\" emdu keththi mahaan sethuveyannu nirmisidaru.",
            "kannadaScript": "ನಳ ಮತ್ತು ನೀಲರ ನೇತೃತ್ವದಲ್ಲಿ, ಶೂರ ಯೋಧರು ತೇಲುವ ಬಂಡೆಗಳ ಮೇಲೆ \"ಶ್ರೀರಾಮ\" ಎಂದು ಕೆತ್ತಿ ಮಹಾನ್ ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸಿದರು.",
            "hindi": "नल और नील के नेतृत्व में, वीर योद्धाओं ने तैरते पत्थरों पर \"श्रीराम\" नाम लिखकर सेतु का निर्माण तीव्रता से किया।",
            "hindiSpeak": "நல ஔர நீல கே நேத்ருத்வ மேம், வீர யோத்தாஓம் நே தைரதே பத்தரோம் பர \"ஶ்ரீராம\" நாம லிககர ஸேது கா நிர்மாண தீவ்ரதா ஸே கியா।",
            "hindiSub": "nala aura neela ke nethruthva mem, veera yoddhaaom ne thairathe paththarom para \"shreeraama\" naama likhakara sethu kaa nirmaana theevrathaa se kiyaa।",
            "hindiScript": "नल और नील के नेतृत्व में, वीर योद्धाओं ने तैरते पत्थरों पर \"श्रीराम\" नाम लिखकर सेतु का निर्माण तीव्रता से किया।"
      },
      {
            "num": 3,
            "tamil": "அப்போது ஒரு சிறிய அணில், கடலில் மூழ்கி தன் நனைந்த உடலை மணலில் புரட்டி, அந்த மணல் துகள்களை பாறைகளின் இடுக்குகளில் கொண்டு போய் உதிர்த்தது.",
            "normal": "Just then, a tiny squirrel dipped into the waves, rolled its wet fur in beach sand, and shook the grains into the crevices of the boulders.",
            "advanced": "At that juncture, a minuscule squirrel plunged into the brine, blanketed its damp pelt with shore sand, and dislodged the granules into stone crevices.",
            "vocab": [
                  {
                        "normal": "tiny squirrel",
                        "advanced": "minuscule squirrel",
                        "tamil": "சிறிய அணில்"
                  },
                  {
                        "normal": "rock crevices",
                        "advanced": "stone crevices / fissures",
                        "tamil": "பாறை இடுக்குகள்"
                  }
            ],
            "telugu": "అప్పుడు ఒక చిన్న ఉడుత, సముద్రపు నీటిలో మునిగి, ఇసుకలో పొర్లి, తన ఒంటికి అంటిన ఇసుక రేణువులను రాళ్ల సందులలో రాల్చసాగింది.",
            "teluguSpeak": "அப்புடு ஒக சிந்ந உடுத, ஸமுத்ரபு நீடிலோ முநிகி, இஸுகலோ பொர்லி, தந ஒம்டிகி அம்டிந இஸுக ரேணுவுலநு ராள்ல ஸம்துலலோ ரால்சஸாகிம்தி.",
            "teluguSub": "appudu oka chinna udutha, samudrapu neetilo munigi, isukalo porli, thana omtiki amtina isuka renuvulanu raalla samdulalo raalchasaagimdi.",
            "teluguScript": "అప్పుడు ఒక చిన్న ఉడుత, సముద్రపు నీటిలో మునిగి, ఇసుకలో పొర్లి, తన ఒంటికి అంటిన ఇసుక రేణువులను రాళ్ల సందులలో రాల్చసాగింది.",
            "kannada": "ಆಗ ಒಂದು ಪುಟ್ಟ ಅಳಿಲು ಸಮುದ್ರದ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿ, ಮರಳಿನಲ್ಲಿ ಉರುಳಾಡಿ, ತನ್ನ ದೇಹದ ಮರಳನ್ನು ಬಂಡೆಗಳ ಸಂದಿಗಳಲ್ಲಿ ಉದುರಿಸಿತು.",
            "kannadaSpeak": "ஆக ஒம்து புட்ட அளிலு ஸமுத்ரத நீரிநல்லி முளுகி, மரளிநல்லி உருளாடி, தந்ந தேஹத மரளந்நு பம்டெகள ஸம்திகளல்லி உதுரிஸிது.",
            "kannadaSub": "aaga omdu putta alilu samudrada neerinalli mulugi, maralinalli urulaadi, thanna dehada maralannu bamdegala samdigalalli udurisithu.",
            "kannadaScript": "ಆಗ ಒಂದು ಪುಟ್ಟ ಅಳಿಲು ಸಮುದ್ರದ ನೀರಿನಲ್ಲಿ ಮುಳುಗಿ, ಮರಳಿನಲ್ಲಿ ಉರುಳಾಡಿ, ತನ್ನ ದೇಹದ ಮರಳನ್ನು ಬಂಡೆಗಳ ಸಂದಿಗಳಲ್ಲಿ ಉದುರಿಸಿತು.",
            "hindi": "तभी एक छोटी गिलहरी ने समुद्र में डुबकी लगाई, रेत में लोट लगाई और अपनी देह की बालू को पत्थरों की दरारों में झाड़ दिया।",
            "hindiSpeak": "தபீ ஏக சோடீ கிலஹரீ நே ஸமுத்ர மேம் டுபகீ லகாஈ, ரேத மேம் லோட லகாஈ ஔர அபநீ தேஹ கீ பாலூ கோ பத்தரோம் கீ தராரோம் மேம் ஜாட़ தியா।",
            "hindiSub": "thabhee eka chhotee gilaharee ne samudra mem dubakee lagaaee, retha mem lota lagaaee aura apanee deha kee baaloo ko paththarom kee daraarom mem jhaada़ diyaa।",
            "hindiScript": "तभी एक छोटी गिलहरी ने समुद्र में डुबकी लगाई, रेत में लोट लगाई और अपनी देह की बालू को पत्थरों की दरारों में झाड़ दिया।"
      },
      {
            "num": 4,
            "tamil": "பெரிய பாறைகளை சுமந்த வானரங்கள் சிலர் அதை ஏளனமாகப் பார்த்து, \"விலகிப் போ, எங்கள் காலடியில் நசுங்கி விடுவாய்!\" என்று கேலி செய்தனர்.",
            "normal": "Some giant monkeys carrying heavy stones mocked it dismissively, shouting, \"Step aside, little creature, or you will be crushed beneath our feet!\"",
            "advanced": "Several colossal apes bearing ponderous rocks scoffed derisively, bellowing, \"Depart immediately, frail creature, lest you be trampled beneath our stride!\"",
            "vocab": [
                  {
                        "normal": "mocked dismissively",
                        "advanced": "scoffed derisively",
                        "tamil": "ஏளனம் செய்தனர்"
                  },
                  {
                        "normal": "crushed / trampled",
                        "advanced": "trampled beneath",
                        "tamil": "நசுங்கி விடுவாய்"
                  }
            ],
            "telugu": "భారీ రాళ్లను మోస్తున్న కొందరు పెద్ద వానరులు దానిని చూసి ఎగతాళి చేస్తూ, \"పక్కకు తప్పుకో, మా పాదాల కింద నలిగిపోతావు!\" అని అరిచారు.",
            "teluguSpeak": "பாரீ ராள்லநு மோஸ்துந்ந கொம்தரு பெத்த வாநருலு தாநிநி சூஸி எகதாளி சேஸ்தூ, \"பக்ககு தப்புகோ, மா பாதால கிம்த நலிகிபோதாவு!\" அநி அரிசாரு.",
            "teluguSub": "bhaaree raallanu mosthunna komdaru pedda vaanarulu daanini choosi egathaali chesthoo, \"pakkaku thappuko, maa paadaala kimda naligipothaavu!\" ani arichaaru.",
            "teluguScript": "భారీ రాళ్లను మోస్తున్న కొందరు పెద్ద వానరులు దానిని చూసి ఎగతాళి చేస్తూ, \"పక్కకు తప్పుకో, మా పాదాల కింద నలిగిపోతావు!\" అని అరిచారు.",
            "kannada": "ಭಾರವಾದ ಕಲ್ಲುಗಳನ್ನು ಹೊತ್ತ ಕೆಲವು ದೊಡ್ಡ ವಾನರರು ಅದನ್ನು ಗೇಲಿ ಮಾಡುತ್ತಾ, \"ದೂರ ಹೋಗು, ನಮ್ಮ ಪಾದಗಳ ಕೆಳಗೆ ಸಿಲುಕಿ ಸಾಯುವೆ!\" ಎಂದರು.",
            "kannadaSpeak": "பாரவாத கல்லுகளந்நு ஹொத்த கெலவு தொட்ட வாநரரு அதந்நு கேலி மாடுத்தா, \"தூர ஹோகு, நம்ம பாதகள கெளகெ ஸிலுகி ஸாயுவெ!\" எம்தரு.",
            "kannadaSub": "bhaaravaada kallugalannu hoththa kelavu dodda vaanararu adannu geli maaduththaa, \"doora hogu, namma paadagala kelage siluki saayuve!\" emdaru.",
            "kannadaScript": "ಭಾರವಾದ ಕಲ್ಲುಗಳನ್ನು ಹೊತ್ತ ಕೆಲವು ದೊಡ್ಡ ವಾನರರು ಅದನ್ನು ಗೇಲಿ ಮಾಡುತ್ತಾ, \"ದೂರ ಹೋಗು, ನಮ್ಮ ಪಾದಗಳ ಕೆಳಗೆ ಸಿಲುಕಿ ಸಾಯುವೆ!\" ಎಂದರು.",
            "hindi": "विशाल शिलाएँ उठाने वाले कुछ वानरों ने उसका उपहास करते हुए कहा, \"हट जाओ छोटी जीव, कहीं हमारे पैरों तले न दब जाओ!\"",
            "hindiSpeak": "விஶால ஶிலாஏँ உடாநே வாலே குச வாநரோம் நே உஸகா உபஹாஸ கரதே ஹுஏ கஹா, \"ஹட ஜாஓ சோடீ ஜீவ, கஹீம் ஹமாரே பைரோம் தலே ந தப ஜாஓ!\"",
            "hindiSub": "vishaala shilaaeँ uthaane vaale kuchha vaanarom ne usakaa upahaasa karathe hue kahaa, \"hata jaao chhotee jeeva, kaheem hamaare pairom thale na daba jaao!\"",
            "hindiScript": "विशाल शिलाएँ उठाने वाले कुछ वानरों ने उसका उपहास करते हुए कहा, \"हट जाओ छोटी जीव, कहीं हमारे पैरों तले न दब जाओ!\""
      },
      {
            "num": 5,
            "tamil": "ஆனால் அந்த அணில் சற்றும் தளராமல், \"என் உடலில் உள்ள சிறு சக்தியைக் கொண்டு என் இறைவனுக்கு உதவ விரும்புகிறேன்\" என்று தொடர்ந்து தன் பணியைச் செய்தது.",
            "normal": "Unfazed by their mockery, the squirrel continued faithfully, stating it was merely offering every ounce of its modest strength in service of the Lord.",
            "advanced": "Undaunted by disparagement, the squirrel persisted, affirming its steadfast desire to dedicate every atom of its fragile energy in sacred service.",
            "vocab": [
                  {
                        "normal": "unfazed / undaunted",
                        "advanced": "undaunted by disparagement",
                        "tamil": "சற்றும் தளராமல்"
                  },
                  {
                        "normal": "modest strength",
                        "advanced": "fragile energy",
                        "tamil": "சிறு சக்தி"
                  }
            ],
            "telugu": "కానీ ఆ ఉడుత ఏమాత్రం వెనుకడుగు వేయక, \"నా శరీరంలో ఉన్న శక్తినంతటినీ నా ప్రభువు సేవకే సమర్పిస్తాను\" అని నిరంతరం తన పనిని కొనసాగించింది.",
            "teluguSpeak": "காநீ ஆ உடுத ஏமாத்ரம் வெநுகடுகு வேயக, \"நா ஶரீரம்லோ உந்ந ஶக்திநம்தடிநீ நா ப்ரபுவு ஸேவகே ஸமர்பிஸ்தாநு\" அநி நிரம்தரம் தந பநிநி கொநஸாகிம்சிம்தி.",
            "teluguSub": "kaanee aa udutha emaathram venukadugu veyaka, \"naa shareeramlo unna shakthinamthatinee naa prabhuvu sevake samarpisthaanu\" ani niramtharam thana panini konasaagimchimdi.",
            "teluguScript": "కానీ ఆ ఉడుత ఏమాత్రం వెనుకడుగు వేయక, \"నా శరీరంలో ఉన్న శక్తినంతటినీ నా ప్రభువు సేవకే సమర్పిస్తాను\" అని నిరంతరం తన పనిని కొనసాగించింది.",
            "kannada": "ಆದರೆ ಆ ಅಳಿಲು ಅಂಜದೆ, \"ನನ್ನಲ್ಲಿರುವ ಅಲ್ಪ ಶಕ್ತಿಯಿಂದಲೇ ಭಗವಂತನ ಸೇವೆ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ\" ಎಂದು ನಿಷ್ಠೆಯಿಂದ ಕೆಲಸ ಮುಂದುವರಿಸಿತು.",
            "kannadaSpeak": "ஆதரெ ஆ அளிலு அம்ஜதெ, \"நந்நல்லிருவ அல்ப ஶக்தியிம்தலே பகவம்தந ஸேவெ மாடலு பயஸுத்தேநெ\" எம்து நிஷ்டெயிம்த கெலஸ மும்துவரிஸிது.",
            "kannadaSub": "aadare aa alilu amjade, \"nannalliruva alpa shakthiyimdale bhagavamthana seve maadalu bayasuththene\" emdu nishtheyimda kelasa mumduvarisithu.",
            "kannadaScript": "ಆದರೆ ಆ ಅಳಿಲು ಅಂಜದೆ, \"ನನ್ನಲ್ಲಿರುವ ಅಲ್ಪ ಶಕ್ತಿಯಿಂದಲೇ ಭಗವಂತನ ಸೇವೆ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ\" ಎಂದು ನಿಷ್ಠೆಯಿಂದ ಕೆಲಸ ಮುಂದುವರಿಸಿತು.",
            "hindi": "परंतु गिलहरी तनिक भी विचलित नहीं हुई और बोली, \"मैं अपनी अल्प शक्ति से प्रभु के कार्य में गिलहरी प्रयास कर रही हूँ।\"",
            "hindiSpeak": "பரம்து கிலஹரீ தநிக பீ விசலித நஹீம் ஹுஈ ஔர போலீ, \"மைம் அபநீ அல்ப ஶக்தி ஸே ப்ரபு கே கார்ய மேம் கிலஹரீ ப்ரயாஸ கர ரஹீ ஹூँ।\"",
            "hindiSub": "paramthu gilaharee thanika bhee vichalitha naheem huee aura bolee, \"maim apanee alpa shakthi se prabhu ke kaarya mem gilaharee prayaasa kara rahee hooँ।\"",
            "hindiScript": "परंतु गिलहरी तनिक भी विचलित नहीं हुई और बोली, \"मैं अपनी अल्प शक्ति से प्रभु के कार्य में गिलहरी प्रयास कर रही हूँ।\""
      },
      {
            "num": 6,
            "tamil": "இதை கனிவோடு கவனித்த ஸ்ரீராமர், தனது வானர வீரர்களை அமைதிப்படுத்தி, அந்த சிறிய அணிலை தனது தாமரை போன்ற கரங்களில் மென்மையாக ஏந்தினார்.",
            "normal": "Watching this pure devotion with moist eyes, Sri Rama silenced the proud monkeys and gently lifted the little creature into His lotus hands.",
            "advanced": "Observing this pristine piety with profound reverence, Sri Rama quieted the haughty legions and tenderly elevated the delicate creature upon His palms.",
            "vocab": [
                  {
                        "normal": "pure devotion",
                        "advanced": "pristine piety",
                        "tamil": "தூய பக்தி"
                  },
                  {
                        "normal": "lotus hands",
                        "advanced": "compassionate palms",
                        "tamil": "தாமரை மலர்க்கரங்கள்"
                  }
            ],
            "telugu": "దీనిని కరుణతో గమనించిన శ్రీరాముడు, గర్వపడిన వానరులను శాంతింపజేసి, ఆ చిన్న ఉడుతను తన కమలముల వంటి చేతుల్లోకి సున్నితంగా తీసుకున్నారు.",
            "teluguSpeak": "தீநிநி கருணதோ கமநிம்சிந ஶ்ரீராமுடு, கர்வபடிந வாநருலநு ஶாம்திம்பஜேஸி, ஆ சிந்ந உடுதநு தந கமலமுல வம்டி சேதுல்லோகி ஸுந்நிதம்கா தீஸுகுந்நாரு.",
            "teluguSub": "deenini karunatho gamanimchina shreeraamudu, garvapadina vaanarulanu shaamthimpajesi, aa chinna uduthanu thana kamalamula vamti chethulloki sunnithamgaa theesukunnaaru.",
            "teluguScript": "దీనిని కరుణతో గమనించిన శ్రీరాముడు, గర్వపడిన వానరులను శాంతింపజేసి, ఆ చిన్న ఉడుతను తన కమలముల వంటి చేతుల్లోకి సున్నితంగా తీసుకున్నారు.",
            "kannada": "ಈ ಶುದ್ಧ ಭಕ್ತಿಯನ್ನು ಕಣ್ಣೀರ ಹನಿಯೊಂದಿಗೆ ನೋಡಿದ ಶ್ರೀರಾಮನು, ವಾನರರನ್ನು ಶಾಂತಗೊಳಿಸಿ, ಆ ಪುಟ್ಟ ಅಳಿಲನ್ನು ತನ್ನ ತಾವರೆ ಕೈಗಳಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ ಎತ್ತಿಕೊಂಡನು.",
            "kannadaSpeak": "ஈ ஶுத்த பக்தியந்நு கண்ணீர ஹநியொம்திகெ நோடித ஶ்ரீராமநு, வாநரரந்நு ஶாம்தகொளிஸி, ஆ புட்ட அளிலந்நு தந்ந தாவரெ கைகளல்லி ப்ரீதியிம்த எத்திகொம்டநு.",
            "kannadaSub": "ee shuddha bhakthiyannu kanneera haniyomdige nodida shreeraamanu, vaanararannu shaamthagolisi, aa putta alilannu thanna thaavare kaigalalli preethiyimda eththikomdanu.",
            "kannadaScript": "ಈ ಶುದ್ಧ ಭಕ್ತಿಯನ್ನು ಕಣ್ಣೀರ ಹನಿಯೊಂದಿಗೆ ನೋಡಿದ ಶ್ರೀರಾಮನು, ವಾನರರನ್ನು ಶಾಂತಗೊಳಿಸಿ, ಆ ಪುಟ್ಟ ಅಳಿಲನ್ನು ತನ್ನ ತಾವರೆ ಕೈಗಳಲ್ಲಿ ಪ್ರೀತಿಯಿಂದ ಎತ್ತಿಕೊಂಡನು.",
            "hindi": "यह निर्मल भक्ति देखकर भावविभोर हुए श्रीराम ने वानरों को शांत किया और उस नन्ही गिलहरी को अपने कर-कमलों में उठा लिया।",
            "hindiSpeak": "யஹ நிர்மல பக்தி தேககர பாவவிபோர ஹுஏ ஶ்ரீராம நே வாநரோம் கோ ஶாம்த கியா ஔர உஸ நந்ஹீ கிலஹரீ கோ அபநே கர-கமலோம் மேம் உடா லியா।",
            "hindiSub": "yaha nirmala bhakthi dekhakara bhaavavibhora hue shreeraama ne vaanarom ko shaamtha kiyaa aura usa nanhee gilaharee ko apane kara-kamalom mem uthaa liyaa।",
            "hindiScript": "यह निर्मल भक्ति देखकर भावविभोर हुए श्रीराम ने वानरों को शांत किया और उस नन्ही गिलहरी को अपने कर-कमलों में उठा लिया।"
      },
      {
            "num": 7,
            "tamil": "\"செயலின் அளவை விட, அதில் உள்ள தூய பக்தியும் உளமார்ந்த அர்ப்பணிப்புமே மிக உயர்வானது\" என்று ராமர் வானரர்களுக்கு அறிவுறுத்தினார்.",
            "normal": "\"The greatness of service is judged not by sheer size or strength, but by the purity of devotion and sincerity of heart,\" proclaimed Sri Rama.",
            "advanced": "\"The nobility of an offering is evaluated not by ostentatious magnitude, but by unvarnished fidelity and immaculate intent,\" Sri Rama proclaimed.",
            "vocab": [
                  {
                        "normal": "greatness of service",
                        "advanced": "nobility of offering",
                        "tamil": "பணியின் மேன்மை"
                  },
                  {
                        "normal": "purity of devotion",
                        "advanced": "unvarnished fidelity",
                        "tamil": "உளமார்ந்த பக்தி"
                  }
            ],
            "telugu": "\"సేవ యొక్క గొప్పతనం భౌతిక పరిమాణం లేదా బలంలో లేదు; అది చూపే భక్తి మరియు హృదయ స్వచ్ఛతలోనే ఉంది\" అని శ్రీరాముడు బోధించారు.",
            "teluguSpeak": "\"ஸேவ யொக்க கொப்பதநம் பௌதிக பரிமாணம் லேதா பலம்லோ லேது; அதி சூபே பக்தி மரியு ஹ்ருதய ஸ்வச்சதலோநே உம்தி\" அநி ஶ்ரீராமுடு போதிம்சாரு.",
            "teluguSub": "\"seva yokka goppathanam bhauthika parimaanam ledaa balamlo ledu; adi choope bhakthi mariyu hrudaya svachchhathalone umdi\" ani shreeraamudu bodhimchaaru.",
            "teluguScript": "\"సేవ యొక్క గొప్పతనం భౌతిక పరిమాణం లేదా బలంలో లేదు; అది చూపే భక్తి మరియు హృదయ స్వచ్ఛతలోనే ఉంది\" అని శ్రీరాముడు బోధించారు.",
            "kannada": "\"ಸೇವೆಯ ಶ್ರೇಷ್ಠತೆಯು ದೈಹಿಕ ಬಲದಲ್ಲಿಲ್ಲ; ಅದು ಹೃದಯದ ಪರಿಶುದ್ಧ ಭಕ್ತಿ ಮತ್ತು ನಿಷ್ಠೆಯಲ್ಲಿದೆ\" ಎಂದು ಶ್ರೀರಾಮನು ಸಾರಿದನು.",
            "kannadaSpeak": "\"ஸேவெய ஶ்ரேஷ்டதெயு தைஹிக பலதல்லில்ல; அது ஹ்ருதயத பரிஶுத்த பக்தி மத்து நிஷ்டெயல்லிதெ\" எம்து ஶ்ரீராமநு ஸாரிதநு.",
            "kannadaSub": "\"seveya shreshthatheyu daihika baladallilla; adu hrudayada parishuddha bhakthi maththu nishtheyallide\" emdu shreeraamanu saaridanu.",
            "kannadaScript": "\"ಸೇವೆಯ ಶ್ರೇಷ್ಠತೆಯು ದೈಹಿಕ ಬಲದಲ್ಲಿಲ್ಲ; ಅದು ಹೃದಯದ ಪರಿಶುದ್ಧ ಭಕ್ತಿ ಮತ್ತು ನಿಷ್ಠೆಯಲ್ಲಿದೆ\" ಎಂದು ಶ್ರೀರಾಮನು ಸಾರಿದನು.",
            "hindi": "\"सेवा का महत्व आकार या शक्ति से नहीं, बल्कि समर्पण और भक्ति की पवित्रता से आँका जाता है,\" श्रीराम ने उद्घोष किया।",
            "hindiSpeak": "\"ஸேவா கா மஹத்வ ஆகார யா ஶக்தி ஸே நஹீம், பல்கி ஸமர்பண ஔர பக்தி கீ பவித்ரதா ஸே ஆँகா ஜாதா ஹை,\" ஶ்ரீராம நே உத்கோஷ கியா।",
            "hindiSub": "\"sevaa kaa mahathva aakaara yaa shakthi se naheem, balki samarpana aura bhakthi kee pavithrathaa se aaँkaa jaathaa hai,\" shreeraama ne udghosha kiyaa।",
            "hindiScript": "\"सेवा का महत्व आकार या शक्ति से नहीं, बल्कि समर्पण और भक्ति की पवित्रता से आँका जाता है,\" श्रीराम ने उद्घोष किया।"
      },
      {
            "num": 8,
            "tamil": "அன்போடு அதன் முதுகில் தனது மூன்று விரல்களால் தடவிக் கொடுத்தார்; இன்றும் அணிலின் முதுகில் உள்ள மூன்று கோடுகள் ராமரின் திருக்கரங்களின் அடையாளமாக போற்றப்படுகின்றன.",
            "normal": "He gently stroked the squirrel's back with His three fingers, leaving the sacred stripes that squirrels carry to this day as a symbol of divine love.",
            "advanced": "With infinite grace, He caressed its spine with three fingers, indelibly bequeathing the three celestial stripes that commemorate divine benediction across ages.",
            "vocab": [
                  {
                        "normal": "divine love",
                        "advanced": "celestial benediction",
                        "tamil": "தெய்வீக அருள்"
                  },
                  {
                        "normal": "sacred stripes",
                        "advanced": "indelible stripes",
                        "tamil": "அழியா அடையாளக் கோடுகள்"
                  }
            ],
            "telugu": "ఆయన ప్రేమతో ఉడుత వీపుపై తన మూడు వేళ్లతో నిమిరారు; నేటికీ ఉడుతల వీపుపై ఉన్న మూడు చారలు శ్రీరాముడి ప్రేమకు దివ్య చిహ్నంగా నిలిచాయి.",
            "teluguSpeak": "ஆயந ப்ரேமதோ உடுத வீபுபை தந மூடு வேள்லதோ நிமிராரு; நேடிகீ உடுதல வீபுபை உந்ந மூடு சாரலு ஶ்ரீராமுடி ப்ரேமகு திவ்ய சிஹ்நம்கா நிலிசாயி.",
            "teluguSub": "aayana prematho udutha veepupai thana moodu vellatho nimiraaru; netikee uduthala veepupai unna moodu chaaralu shreeraamudi premaku divya chihnamgaa nilichaayi.",
            "teluguScript": "ఆయన ప్రేమతో ఉడుత వీపుపై తన మూడు వేళ్లతో నిమిరారు; నేటికీ ఉడుతల వీపుపై ఉన్న మూడు చారలు శ్రీరాముడి ప్రేమకు దివ్య చిహ్నంగా నిలిచాయి.",
            "kannada": "ಅವರು ಪ್ರೀತಿಯಿಂದ ಅಳಿಲಿನ ಬೆನ್ನಿನ ಮೇಲೆ ತಮ್ಮ ಮೂರು ಬೆರಳುಗಳಿಂದ ನೇವರಿಸಿದರು; ಇಂದಿಗೂ ಆ ಮೂರು ಗೆರೆಗಳು ದೈವಿಕ ಆಶೀರ್ವಾದದ ಸಂಕೇತವಾಗಿವೆ.",
            "kannadaSpeak": "அவரு ப்ரீதியிம்த அளிலிந பெந்நிந மேலெ தம்ம மூரு பெரளுகளிம்த நேவரிஸிதரு; இம்திகூ ஆ மூரு கெரெகளு தைவிக ஆஶீர்வாதத ஸம்கேதவாகிவெ.",
            "kannadaSub": "avaru preethiyimda alilina bennina mele thamma mooru beralugalimda nevarisidaru; imdigoo aa mooru geregalu daivika aasheervaadada samkethavaagive.",
            "kannadaScript": "ಅವರು ಪ್ರೀತಿಯಿಂದ ಅಳಿಲಿನ ಬೆನ್ನಿನ ಮೇಲೆ ತಮ್ಮ ಮೂರು ಬೆರಳುಗಳಿಂದ ನೇವರಿಸಿದರು; ಇಂದಿಗೂ ಆ ಮೂರು ಗೆರೆಗಳು ದೈವಿಕ ಆಶೀರ್ವಾದದ ಸಂಕೇತವಾಗಿವೆ.",
            "hindi": "श्रीराम ने अपनी तीन उँगलियों से उसकी पीठ सहलाई; वही तीन रेखाएँ आज भी प्रभु के अलौकिक प्रेम और वरदान का प्रतीक बनकर सुशोभित हैं।",
            "hindiSpeak": "ஶ்ரீராம நே அபநீ தீந உँகலியோம் ஸே உஸகீ பீட ஸஹலாஈ; வஹீ தீந ரேகாஏँ ஆஜ பீ ப்ரபு கே அலௌகிக ப்ரேம ஔர வரதாந கா ப்ரதீக பநகர ஸுஶோபித ஹைம்।",
            "hindiSub": "shreeraama ne apanee theena uँgaliyom se usakee peetha sahalaaee; vahee theena rekhaaeँ aaja bhee prabhu ke alaukika prema aura varadaana kaa pratheeka banakara sushobhitha haim।",
            "hindiScript": "श्रीराम ने अपनी तीन उँगलियों से उसकी पीठ सहलाई; वही तीन रेखाएँ आज भी प्रभु के अलौकिक प्रेम और वरदान का प्रतीक बनकर सुशोभित हैं।"
      }
],
      vocabComparison: [
        {
          normal: "Pure devotion",
          advanced: "Pristine piety",
          tamil: "தூய பக்தி",
          telugu: "స్వచ్ఛమైన భక్తి",
          teluguSpeak: "ஸ்வச்சமைந பக்தி",
          kannada: "ಶುದ್ಧ ಭಕ್ತಿ",
          kannadaSpeak: "ஶுத்த பக்தி",
          hindi: "निस्वार्थ भक्ति",
          hindiSpeak: "நிஸ்வார்த பக்தி",
          example: "The squirrel's pristine piety moved Sri Rama to tears."
        },
        {
          normal: "Mighty army",
          advanced: "Formidable legions",
          tamil: "வீரம்மிக்க சேனை",
          telugu: "శక్తివంతమైన సైన్యం",
          teluguSpeak: "ஶக்திவம்தமைந ஸைந்யம்",
          kannada: "ಬಲಿಷ್ಠ ಸೈನ್ಯ",
          kannadaSpeak: "பலிஷ்ட ஸைந்ய",
          hindi: "विशाल शक्तिशाली सेना",
          hindiSpeak: "விஶால ஶக்திஶாலீ ஸேநா",
          example: "The formidable legions advanced across the ocean causeway."
        },
        {
          normal: "Mock dismissively",
          advanced: "Scoff derisively",
          tamil: "ஏளனமாகப் பேசுதல்",
          telugu: "హేళన చేయడం",
          teluguSpeak: "ஹேளந சேயடம்",
          kannada: "ಅಣಕಿಸುವುದು / ಗೇಲಿ ಮಾಡುವುದು",
          kannadaSpeak: "அணகிஸுவுது / கேலி மாடுவுது",
          hindi: "उपहास उड़ाना",
          hindiSpeak: "உபஹாஸ உடா़நா",
          example: "They scoffed derisively at the humble offering."
        },
        {
          normal: "Eternal blessing",
          advanced: "Celestial benediction",
          tamil: "தெய்வீக ஆசீர்வாதம்",
          telugu: "శాశ్వత ఆశీర్వాదం",
          teluguSpeak: "ஶாஶ்வத ஆஶீர்வாதம்",
          kannada: "ಶಾಶ್ವತ ಆಶೀರ್ವಾದ",
          kannadaSpeak: "ஶாஶ்வத ஆஶீர்வாத",
          hindi: "सदाबहार आशीर्वाद",
          hindiSpeak: "ஸதாபஹார ஆஶீர்வாத",
          example: "Sri Rama bestowed celestial benediction upon the devoted creature."
        }
      ],
      quiz: [
        { question: "What is the meaning of 'pristine piety' in Tamil?", options: ["பயந்த குணம்", "தூய மாசற்ற பக்தி", "கோபம்", "சுயநலம்"], correct: 1, explanation: "'Pristine piety' refers to pure, uncorrupted, and heartfelt devotion (தூய பக்தி)." },
        { question: "How did the little squirrel contribute to the building of the Ram Setu bridge?", options: ["Cut down giant trees", "Rolled its wet body in sand and shook the grains into rock crevices", "Carried heavy iron anchors", "Swam across alone"], correct: 1, explanation: "The squirrel dipped in seawater and rolled in sand to fill tiny crevices between boulders." },
        { question: "What moral lesson did Sri Rama teach the proud monkeys?", options: ["Only big efforts count", "True service is measured by purity of devotion, not physical size", "Small creatures should stay away", "Do not help anyone"], correct: 1, explanation: "Rama declared that sincere love and humble effort are far nobler than pride in physical strength." },
        { question: "According to the legend, what do the three stripes on a squirrel's back signify?", options: ["Accidental scratches", "The gentle touch of Sri Rama's divine fingers", "Marks from the sea waves", "Sunlight reflections"], correct: 1, explanation: "The three stripes represent the eternal caress of Sri Rama's fingers acknowledging the squirrel's devotion." }
      ]
    };
  }

  // 2. MAHABHARATA (மகாபாரதம்: அர்ஜுனனின் வில்வித்தை சோதனை - பறவையின் கண்)
  if (
    lower.includes("mahabharat") ||
    lower.includes("mahabharatha") ||
    lower.includes("mahabharatham") ||
    lower.includes("arjun") ||
    lower.includes("arjuna") ||
    lower.includes("krishna") ||
    lower.includes("karna") ||
    lower.includes("drona") ||
    lower.includes("pandava") ||
    lower.includes("kaurava") ||
    lower.includes("kurukshetra") ||
    lower.includes("மகாபாரத") ||
    lower.includes("அர்ஜுன") ||
    lower.includes("கர்ணன்") ||
    lower.includes("கிருஷ்ணர்")
  ) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "மகாபாரதம்: அர்ஜுனனின் வில்வித்தை சோதனை - பறவையின் கண்",
        normal: "The Mahabharata: Arjuna and the Bird's Eye Focus",
        advanced: "The Mahabharata: Arjuna's Unwavering Target and the Master's Trial",
        telugu: "మహాభారతం: అర్జునుడి విలువిద్య పరీక్ష - పక్షి కన్ను",
        kannada: "ಮಹಾಭಾರತ: ಅರ್ಜುನನ ಬಿಲ್ಲುಗಾರಿಕೆ ಪರೀಕ್ಷೆ - ಹಕ್ಕಿಯ ಕಣ್ಣು",
        hindi: "महाभारत: अर्जुन की धनुर्विद्या परीक्षा - पक्षी की आँख"
      },
      category: category || "Inspiration & Wisdom",
      icon: icon || "compass",
      readTime: "2 min read",
      summary: {
        tamil: "மரத்தின் உச்சியில் வைக்கப்பட்ட மரப்பறவையின் கண்ணை மட்டுமே பார்த்து, பிற உலகங்களை மறந்து வில்லெய்த அர்ஜுனனின் நிகரற்ற கவனக் குவிப்பை விளக்கும் மகாபாரதத்தின் புகழ்மிக்க அத்தியாயம்.",
        normal: "A legendary chapter from the Mahabharata where Guru Dronacharya tests the princes, demonstrating Arjuna's peerless, single-pointed concentration on the bird's eye.",
        advanced: "A renowned episode from the epic Mahabharata wherein preceptor Dronacharya tests the royal princes, revealing Arjuna's transcendental archery concentration.",
        telugu: "చెట్టు కొమ్మపై ఉంచిన పక్షి కన్నును మాత్రమే చూస్తూ, చుట్టూ ఉన్న ప్రపంచాన్ని మరచి బాణం వేసిన అర్జునుడి అద్భుత ఏకాగ్రతను వివరించే కథ.",
        kannada: "ಮರದ ಕೊಂಬೆಯ ಮೇಲಿನ ಹಕ್ಕಿಯ ಕಣ್ಣನ್ನು ಮಾತ್ರ ನೋಡುತ್ತಾ, ಪ್ರಪಂಚವನ್ನೇ ಮರೆತು ಗುರಿ ಹೊಡೆದ ಅರ್ಜುನನ ಅಪ್ರತಿಮ ಏಕಾಗ್ರತೆಯನ್ನು ವಿವರಿಸುವ ಕಥೆ.",
        hindi: "वृक्ष पर रखी चिड़िया की केवल आँख को लक्ष्य बनाकर गुरु द्रोण की परीक्षा में सफल होने वाले अर्जुन की अद्वितीय एकाग्रता की अमर गाथा।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "குருகுலக் காட்டில், துரோணாச்சாரியார் தனது பாண்டவ மற்றும் கௌரவ சீடர்களுக்கு வில்வித்தையின் இறுதி பரீட்சை வைக்கத் தீர்மானித்தார்.",
            "normal": "In the ancient gurukul forest, Guru Dronacharya decided to test the archery prowess and mental concentration of the young princes.",
            "advanced": "Within the serene environs of the forest hermitage, preceptor Dronacharya resolved to subject his royal pupils to an ultimate examination of marksmanship.",
            "vocab": [
                  {
                        "normal": "archery prowess",
                        "advanced": "supreme marksmanship",
                        "tamil": "வில்வித்தை ஆற்றல்"
                  },
                  {
                        "normal": "young princes",
                        "advanced": "royal pupils",
                        "tamil": "இளவரச மாணவர்கள்"
                  }
            ],
            "telugu": "గురుకుల అడవిలో, ద్రోణాచార్యుడు తన పాండవ మరియు కౌరవ శిష్యులకు విలువిద్య యొక్క తుది పరీక్షను నిర్వహించాలని నిర్ణయించుకున్నాడు.",
            "teluguSpeak": "குருகுல அடவிலோ, த்ரோணாசார்யுடு தந பாம்டவ மரியு கௌரவ ஶிஷ்யுலகு விலுவித்ய யொக்க துதி பரீக்ஷநு நிர்வஹிம்சாலநி நிர்ணயிம்சுகுந்நாடு.",
            "teluguSub": "gurukula adavilo, dronaachaaryudu thana paamdava mariyu kaurava shishyulaku viluvidya yokka thudi pareekshanu nirvahimchaalani nirnayimchukunnaadu.",
            "teluguScript": "గురుకుల అడవిలో, ద్రోణాచార్యుడు తన పాండవ మరియు కౌరవ శిష్యులకు విలువిద్య యొక్క తుది పరీక్షను నిర్వహించాలని నిర్ణయించుకున్నాడు.",
            "kannada": "ಗುರುಕುಲದ ಕಾಡಿನಲ್ಲಿ, ದ್ರೋಣಾಚಾರ್ಯರು ತಮ್ಮ ಪಾಂಡವ ಮತ್ತು ಕೌರವ ಶಿಷ್ಯರಿಗೆ ಬಿಲ್ಲುಗಾರಿಕೆಯ ಅಂತಿಮ ಪರೀಕ್ಷೆಯನ್ನು ನಡೆಸಲು ನಿರ್ಧರಿಸಿದರು.",
            "kannadaSpeak": "குருகுலத காடிநல்லி, த்ரோணாசார்யரு தம்ம பாம்டவ மத்து கௌரவ ஶிஷ்யரிகெ பில்லுகாரிகெய அம்திம பரீக்ஷெயந்நு நடெஸலு நிர்தரிஸிதரு.",
            "kannadaSub": "gurukulada kaadinalli, dronaachaaryaru thamma paamdava maththu kaurava shishyarige billugaarikeya amthima pareeksheyannu nadesalu nirdharisidaru.",
            "kannadaScript": "ಗುರುಕುಲದ ಕಾಡಿನಲ್ಲಿ, ದ್ರೋಣಾಚಾರ್ಯರು ತಮ್ಮ ಪಾಂಡವ ಮತ್ತು ಕೌರವ ಶಿಷ್ಯರಿಗೆ ಬಿಲ್ಲುಗಾರಿಕೆಯ ಅಂತಿಮ ಪರೀಕ್ಷೆಯನ್ನು ನಡೆಸಲು ನಿರ್ಧರಿಸಿದರು.",
            "hindi": "गुरुकुल के वन में, गुरु द्रोणाचार्य ने अपने पांडव और कौरव शिष्यों की धनुर्विद्या और एकाग्रता की अंतिम परीक्षा लेने का निश्चय किया।",
            "hindiSpeak": "குருகுல கே வந மேம், குரு த்ரோணாசார்ய நே அபநே பாம்டவ ஔர கௌரவ ஶிஷ்யோம் கீ தநுர்வித்யா ஔர ஏகாக்ரதா கீ அம்திம பரீக்ஷா லேநே கா நிஶ்சய கியா।",
            "hindiSub": "gurukula ke vana mem, guru dronaachaarya ne apane paamdava aura kaurava shishyom kee dhanurvidyaa aura ekaagrathaa kee amthima pareekshaa lene kaa nishchaya kiyaa।",
            "hindiScript": "गुरुकुल के वन में, गुरु द्रोणाचार्य ने अपने पांडव और कौरव शिष्यों की धनुर्विद्या और एकाग्रता की अंतिम परीक्षा लेने का निश्चय किया।"
      },
      {
            "num": 2,
            "tamil": "அவர் ஒரு உயர்ந்த மரத்தின் நுனிக்கிளையில் ஒரு மரப்பறவையை வைத்து, \"அதன் வலது கண்ணை மட்டுமே நீங்கள் குறிபார்த்து வீழ்த்த வேண்டும்\" என்றார்.",
            "normal": "He perched a wooden bird high upon a distant tree branch and commanded them to aim exclusively at its right eye.",
            "advanced": "He positioned an artificial wooden avian upon a distant bough and instructed the princes to sever exclusively its right ocular pupil.",
            "vocab": [
                  {
                        "normal": "wooden bird",
                        "advanced": "artificial wooden avian",
                        "tamil": "மரப்பறவை"
                  },
                  {
                        "normal": "distant branch",
                        "advanced": "distant bough",
                        "tamil": "தொலைதூரக் கிளை"
                  }
            ],
            "telugu": "అతను ఒక ఎత్తైన చెట్టు కొమ్మపై చెక్క పక్షిని ఉంచి, \"దాని కుడి కన్నును మాత్రమే మీరు లక్ష్యంగా చేసుకుని కొట్టాలి\" అని ఆదేశించాడు.",
            "teluguSpeak": "அதநு ஒக எத்தைந செட்டு கொம்மபை செக்க பக்ஷிநி உம்சி, \"தாநி குடி கந்நுநு மாத்ரமே மீரு லக்ஷ்யம்கா சேஸுகுநி கொட்டாலி\" அநி ஆதேஶிம்சாடு.",
            "teluguSub": "athanu oka eththaina chettu kommapai chekka pakshini umchi, \"daani kudi kannunu maathrame meeru lakshyamgaa chesukuni kottaali\" ani aadeshimchaadu.",
            "teluguScript": "అతను ఒక ఎత్తైన చెట్టు కొమ్మపై చెక్క పక్షిని ఉంచి, \"దాని కుడి కన్నును మాత్రమే మీరు లక్ష్యంగా చేసుకుని కొట్టాలి\" అని ఆదేశించాడు.",
            "kannada": "ಅವರು ಎತ್ತರದ ಮರದ ಕೊಂಬೆಯ ಮೇಲೆ ಮರದ ಹಕ್ಕಿಯನ್ನು ಇರಿಸಿ, \"ನೀವು ಅದರ ಬಲಗಣ್ಣನ್ನು ಮಾತ್ರ ಗುರಿಯಾಗಿಸಿಕೊಂಡು ಹೊಡೆಯಬೇಕು\" ಎಂದರು.",
            "kannadaSpeak": "அவரு எத்தரத மரத கொம்பெய மேலெ மரத ஹக்கியந்நு இரிஸி, \"நீவு அதர பலகண்ணந்நு மாத்ர குரியாகிஸிகொம்டு ஹொடெயபேகு\" எம்தரு.",
            "kannadaSub": "avaru eththarada marada kombeya mele marada hakkiyannu irisi, \"neevu adara balagannannu maathra guriyaagisikomdu hodeyabeku\" emdaru.",
            "kannadaScript": "ಅವರು ಎತ್ತರದ ಮರದ ಕೊಂಬೆಯ ಮೇಲೆ ಮರದ ಹಕ್ಕಿಯನ್ನು ಇರಿಸಿ, \"ನೀವು ಅದರ ಬಲಗಣ್ಣನ್ನು ಮಾತ್ರ ಗುರಿಯಾಗಿಸಿಕೊಂಡು ಹೊಡೆಯಬೇಕು\" ಎಂದರು.",
            "hindi": "उन्होंने एक ऊँचे वृक्ष की शाखा पर लकड़ी की चिड़िया रखी और आदेश दिया, \"तुम्हें केवल उसकी दाहिनी आँख को ही भेदना है।\"",
            "hindiSpeak": "உந்ஹோம்நே ஏக ஊँசே வ்ருக்ஷ கீ ஶாகா பர லகட़ீ கீ சிட़ியா ரகீ ஔர ஆதேஶ தியா, \"தும்ஹேம் கேவல உஸகீ தாஹிநீ ஆँக கோ ஹீ பேதநா ஹை।\"",
            "hindiSub": "unhomne eka ooँche vruksha kee shaakhaa para lakada़ee kee chida़iyaa rakhee aura aadesha diyaa, \"thumhem kevala usakee daahinee aaँkha ko hee bhedanaa hai।\"",
            "hindiScript": "उन्होंने एक ऊँचे वृक्ष की शाखा पर लकड़ी की चिड़िया रखी और आदेश दिया, \"तुम्हें केवल उसकी दाहिनी आँख को ही भेदना है।\""
      },
      {
            "num": 3,
            "tamil": "முதலில் யுதிஷ்டிரன் வில்லை வளைத்தபோது, துரோணர் \"மரத்தையும், கிளையையும், என்னையும் உன்னால் பார்க்க முடிகிறதா?\" என்று கேட்டார்.",
            "normal": "When Yudhishthira stepped forward first, Drona asked, \"Do you see the grand tree, the green leaves, and do you see me standing here?\"",
            "advanced": "As Yudhishthira stepped forward, Drona inquired, \"Dost thou perceive the sprawling banyan, the emerald foliage, and mine own countenance?\"",
            "vocab": [
                  {
                        "normal": "stepped forward",
                        "advanced": "advanced to the fore",
                        "tamil": "முன்னே வந்தார்"
                  },
                  {
                        "normal": "green leaves",
                        "advanced": "emerald foliage",
                        "tamil": "பச்சை இலைகள்"
                  }
            ],
            "telugu": "మొదట యుధిష్ఠిరుడు ముందుకు వచ్చినప్పుడు, ద్రోణుడు \"చెట్టును, ఆకులను, నన్ను నువ్వు చూడగలుగుతున్నావా?\" అని అడిగాడు.",
            "teluguSpeak": "மொதட யுதிஷ்டிருடு மும்துகு வச்சிநப்புடு, த்ரோணுடு \"செட்டுநு, ஆகுலநு, நந்நு நுவ்வு சூடகலுகுதுந்நாவா?\" அநி அடிகாடு.",
            "teluguSub": "modata yudhishthirudu mumduku vachchinappudu, dronudu \"chettunu, aakulanu, nannu nuvvu choodagaluguthunnaavaa?\" ani adigaadu.",
            "teluguScript": "మొదట యుధిష్ఠిరుడు ముందుకు వచ్చినప్పుడు, ద్రోణుడు \"చెట్టును, ఆకులను, నన్ను నువ్వు చూడగలుగుతున్నావా?\" అని అడిగాడు.",
            "kannada": "ಮೊದಲು ಯುಧಿಷ್ಠಿರನು ಮುಂದೆ ಬಂದಾಗ, ದ್ರೋಣರು \"ಮರವನ್ನು, ಎಲೆಗಳನ್ನು ಮತ್ತು ನನ್ನನ್ನು ನೀನು ನೋಡುತ್ತಿದ್ದೀಯಾ?\" ಎಂದು ಕೇಳಿದರು.",
            "kannadaSpeak": "மொதலு யுதிஷ்டிரநு மும்தெ பம்தாக, த்ரோணரு \"மரவந்நு, எலெகளந்நு மத்து நந்நந்நு நீநு நோடுத்தித்தீயா?\" எம்து கேளிதரு.",
            "kannadaSub": "modalu yudhishthiranu mumde bamdaaga, dronaru \"maravannu, elegalannu maththu nannannu neenu noduththiddeeyaa?\" emdu kelidaru.",
            "kannadaScript": "ಮೊದಲು ಯುಧಿಷ್ಠಿರನು ಮುಂದೆ ಬಂದಾಗ, ದ್ರೋಣರು \"ಮರವನ್ನು, ಎಲೆಗಳನ್ನು ಮತ್ತು ನನ್ನನ್ನು ನೀನು ನೋಡುತ್ತಿದ್ದೀಯಾ?\" ಎಂದು ಕೇಳಿದರು.",
            "hindi": "जब पहले युधिष्ठिर आगे आए, तो द्रोणाचार्य ने पूछा, \"क्या तुम्हें यह विशाल वृक्ष, हरी पत्तियाँ और मैं दिखाई दे रहे हैं?\"",
            "hindiSpeak": "ஜப பஹலே யுதிஷ்டிர ஆகே ஆஏ, தோ த்ரோணாசார்ய நே பூசா, \"க்யா தும்ஹேம் யஹ விஶால வ்ருக்ஷ, ஹரீ பத்தியாँ ஔர மைம் திகாஈ தே ரஹே ஹைம்?\"",
            "hindiSub": "jaba pahale yudhishthira aage aae, tho dronaachaarya ne poochhaa, \"kyaa thumhem yaha vishaala vruksha, haree paththiyaaँ aura maim dikhaaee de rahe haim?\"",
            "hindiScript": "जब पहले युधिष्ठिर आगे आए, तो द्रोणाचार्य ने पूछा, \"क्या तुम्हें यह विशाल वृक्ष, हरी पत्तियाँ और मैं दिखाई दे रहे हैं?\""
      },
      {
            "num": 4,
            "tamil": "\"ஆம் குருவே, மரம், இலைகள், வானம் அனைத்தையும் காண்கிறேன்\" என்று யுதிஷ்டிரன் பதிலளிக்கவே, துரோணர் \"வில்லை இறக்கு, உன்னால் குறி வைக்க முடியாது\" என்றார்.",
            "normal": "\"Yes master, I see the sky, the foliage, and the entire tree,\" Yudhishthira replied, upon which Drona told him to lower his bow.",
            "advanced": "\"Indeed master, I behold the expansive firmament, the boughs, and thyself,\" Yudhishthira replied, whereupon Drona ordered him to relinquish his bow.",
            "vocab": [
                  {
                        "normal": "expansive sky",
                        "advanced": "expansive firmament",
                        "tamil": "விரிந்த வானம்"
                  },
                  {
                        "normal": "lower the bow",
                        "advanced": "relinquish the bow",
                        "tamil": "வில்லை இறக்குதல்"
                  }
            ],
            "telugu": "\"అవును గురువర్యా, చెట్టును, ఆకాశాన్ని, సమస్తాన్ని చూస్తున్నాను\" అని యుధిష్ఠిరుడు చెప్పగా, ద్రోణుడు \"విల్లు దించు, నువ్వు బాణం వేయలేవు\" అన్నారు.",
            "teluguSpeak": "\"அவுநு குருவர்யா, செட்டுநு, ஆகாஶாந்நி, ஸமஸ்தாந்நி சூஸ்துந்நாநு\" அநி யுதிஷ்டிருடு செப்பகா, த்ரோணுடு \"வில்லு திம்சு, நுவ்வு பாணம் வேயலேவு\" அந்நாரு.",
            "teluguSub": "\"avunu guruvaryaa, chettunu, aakaashaanni, samasthaanni choosthunnaanu\" ani yudhishthirudu cheppagaa, dronudu \"villu dimchu, nuvvu baanam veyalevu\" annaaru.",
            "teluguScript": "\"అవును గురువర్యా, చెట్టును, ఆకాశాన్ని, సమస్తాన్ని చూస్తున్నాను\" అని యుధిష్ఠిరుడు చెప్పగా, ద్రోణుడు \"విల్లు దించు, నువ్వు బాణం వేయలేవు\" అన్నారు.",
            "kannada": "\"ಹೌದು ಗುರುವೇ, ಮರ, ಆಕಾಶ, ಎಲ್ಲವನ್ನೂ ಕಾಣುತ್ತಿದ್ದೇನೆ\" ಎಂದು ಯುಧಿಷ್ಠಿರನು ಹೇಳಲು, ದ್ರೋಣರು \"ಬಿಲ್ಲನ್ನು ಕೆಳಗಿಳಿಸು, ನಿನಗೆ ಗುರಿ ಹೊಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ\" ಎಂದರು.",
            "kannadaSpeak": "\"ஹௌது குருவே, மர, ஆகாஶ, எல்லவந்நூ காணுத்தித்தேநெ\" எம்து யுதிஷ்டிரநு ஹேளலு, த்ரோணரு \"பில்லந்நு கெளகிளிஸு, நிநகெ குரி ஹொடெயலு ஸாத்யவில்ல\" எம்தரு.",
            "kannadaSub": "\"haudu guruve, mara, aakaasha, ellavannoo kaanuththiddene\" emdu yudhishthiranu helalu, dronaru \"billannu kelagilisu, ninage guri hodeyalu saadhyavilla\" emdaru.",
            "kannadaScript": "\"ಹೌದು ಗುರುವೇ, ಮರ, ಆಕಾಶ, ಎಲ್ಲವನ್ನೂ ಕಾಣುತ್ತಿದ್ದೇನೆ\" ಎಂದು ಯುಧಿಷ್ಠಿರನು ಹೇಳಲು, ದ್ರೋಣರು \"ಬಿಲ್ಲನ್ನು ಕೆಳಗಿಳಿಸು, ನಿನಗೆ ಗುರಿ ಹೊಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ\" ಎಂದರು.",
            "hindi": "\"हाँ गुरुदेव, मुझे वृक्ष, आकाश और सब कुछ दिखाई दे रहा है,\" युधिष्ठिर ने कहा, तो द्रोण बोले, \"धनुष नीचे रखो, तुम लक्ष्य नहीं भेद सकते।\"",
            "hindiSpeak": "\"ஹாँ குருதேவ, முஜே வ்ருக்ஷ, ஆகாஶ ஔர ஸப குச திகாஈ தே ரஹா ஹை,\" யுதிஷ்டிர நே கஹா, தோ த்ரோண போலே, \"தநுஷ நீசே ரகோ, தும லக்ஷ்ய நஹீம் பேத ஸகதே।\"",
            "hindiSub": "\"haaँ gurudeva, mujhe vruksha, aakaasha aura saba kuchha dikhaaee de rahaa hai,\" yudhishthira ne kahaa, tho drona bole, \"dhanusha neeche rakho, thuma lakshya naheem bheda sakathe।\"",
            "hindiScript": "\"हाँ गुरुदेव, मुझे वृक्ष, आकाश और सब कुछ दिखाई दे रहा है,\" युधिष्ठिर ने कहा, तो द्रोण बोले, \"धनुष नीचे रखो, तुम लक्ष्य नहीं भेद सकते।\""
      },
      {
            "num": 5,
            "tamil": "துரியోధனன் உள்ளிட்ட பிற இளவரசர்களும் மரத்தையும் சுற்றுப்புறத்தையும் கண்டதால் அவர்களையும் வில்லெய்ய துரோணர் அனுமதிக்கவில்லை.",
            "normal": "Duryodhana and the other princes similarly confessed to seeing the branches, the masters, and the surroundings, and were dismissed.",
            "advanced": "Duryodhana and the remaining royal kin similarly acknowledged perceiving the arboreal landscape, prompting immediate dismissal.",
            "vocab": [
                  {
                        "normal": "other princes",
                        "advanced": "remaining royal kin",
                        "tamil": "பிற இளவரசர்கள்"
                  },
                  {
                        "normal": "surroundings",
                        "advanced": "arboreal landscape",
                        "tamil": "சுற்றுப்புறச் சூழல்"
                  }
            ],
            "telugu": "దుర్యోధనుడు మొదలైన ఇతర యువరాజులు కూడా చెట్టును, చుట్టుపక్కల పరిసరాలను చూస్తున్నామని చెప్పడంతో వారిని కూడా బాణం వేయడానికి అనుమతించలేదు.",
            "teluguSpeak": "துர்யோதநுடு மொதலைந இதர யுவராஜுலு கூடா செட்டுநு, சுட்டுபக்கல பரிஸராலநு சூஸ்துந்நாமநி செப்படம்தோ வாரிநி கூடா பாணம் வேயடாநிகி அநுமதிம்சலேது.",
            "teluguSub": "duryodhanudu modalaina ithara yuvaraajulu koodaa chettunu, chuttupakkala parisaraalanu choosthunnaamani cheppadamtho vaarini koodaa baanam veyadaaniki anumathimchaledu.",
            "teluguScript": "దుర్యోధనుడు మొదలైన ఇతర యువరాజులు కూడా చెట్టును, చుట్టుపక్కల పరిసరాలను చూస్తున్నామని చెప్పడంతో వారిని కూడా బాణం వేయడానికి అనుమతించలేదు.",
            "kannada": "ದುರ್ಯೋಧನ ಸೇರಿದಂತೆ ಇತರ ರಾಜಕುಮಾರರು ಸಹ ಮರವನ್ನು, ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸರವನ್ನು ಕಾಣುತ್ತಿರುವುದಾಗಿ ಹೇಳಿದ್ದರಿಂದ ಅವರನ್ನು ಬಾಣ ಬಿಡಲು ಅನುಮತಿಸಲಿಲ್ಲ.",
            "kannadaSpeak": "துர்யோதந ஸேரிதம்தெ இதர ராஜகுமாரரு ஸஹ மரவந்நு, ஸுத்தமுத்தலிந பரிஸரவந்நு காணுத்திருவுதாகி ஹேளித்தரிம்த அவரந்நு பாண பிடலு அநுமதிஸலில்ல.",
            "kannadaSub": "duryodhana seridamthe ithara raajakumaararu saha maravannu, suththamuththalina parisaravannu kaanuththiruvudaagi heliddarimda avarannu baana bidalu anumathisalilla.",
            "kannadaScript": "ದುರ್ಯೋಧನ ಸೇರಿದಂತೆ ಇತರ ರಾಜಕುಮಾರರು ಸಹ ಮರವನ್ನು, ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸರವನ್ನು ಕಾಣುತ್ತಿರುವುದಾಗಿ ಹೇಳಿದ್ದರಿಂದ ಅವರನ್ನು ಬಾಣ ಬಿಡಲು ಅನುಮತಿಸಲಿಲ್ಲ.",
            "hindi": "दुर्योधन सहित अन्य राजकुमारों ने भी पेड़ और परिवेश देखने की बात कही, तो उन्हें भी बाण चलाने की अनुमति नहीं दी गई।",
            "hindiSpeak": "துர்யோதந ஸஹித அந்ய ராஜகுமாரோம் நே பீ பேட़ ஔர பரிவேஶ தேகநே கீ பாத கஹீ, தோ உந்ஹேம் பீ பாண சலாநே கீ அநுமதி நஹீம் தீ கஈ।",
            "hindiSub": "duryodhana sahitha anya raajakumaarom ne bhee peda़ aura parivesha dekhane kee baatha kahee, tho unhem bhee baana chalaane kee anumathi naheem dee gaee।",
            "hindiScript": "दुर्योधन सहित अन्य राजकुमारों ने भी पेड़ और परिवेश देखने की बात कही, तो उन्हें भी बाण चलाने की अनुमति नहीं दी गई।"
      },
      {
            "num": 6,
            "tamil": "இறுதியாக அர்ஜுனன் வில்லுடன் நின்றபோது, \"அர்ஜுனா, உனக்கு என்ன தெரிகிறது?\" என்று துரோணர் கேட்டார்.",
            "normal": "Finally, when Arjuna stepped forward and drew his bowstring taut, Drona posed the identical inquiry: \"What dost thou perceive, Arjuna?\"",
            "advanced": "Ultimately, when Arjuna advanced and tensioned the sinew, Drona interrogated: \"What ocular phenomenon reveals itself unto thee, Arjuna?\"",
            "vocab": [
                  {
                        "normal": "stepped forward",
                        "advanced": "advanced",
                        "tamil": "முன்னே வந்தார்"
                  },
                  {
                        "normal": "bowstring",
                        "advanced": "tensioned sinew",
                        "tamil": "வில்லின் நாண்"
                  }
            ],
            "telugu": "చివరగా అర్జునుడు విల్లు ఎక్కుపెట్టి నిలబడినప్పుడు, \"అర్జునా, నీకు ఏమి కనిపిస్తోంది?\" అని ద్రోణుడు అడిగాడు.",
            "teluguSpeak": "சிவரகா அர்ஜுநுடு வில்லு எக்குபெட்டி நிலபடிநப்புடு, \"அர்ஜுநா, நீகு ஏமி கநிபிஸ்தோம்தி?\" அநி த்ரோணுடு அடிகாடு.",
            "teluguSub": "chivaragaa arjunudu villu ekkupetti nilabadinappudu, \"arjunaa, neeku emi kanipisthomdi?\" ani dronudu adigaadu.",
            "teluguScript": "చివరగా అర్జునుడు విల్లు ఎక్కుపెట్టి నిలబడినప్పుడు, \"అర్జునా, నీకు ఏమి కనిపిస్తోంది?\" అని ద్రోణుడు అడిగాడు.",
            "kannada": "ಕೊನೆಯದಾಗಿ ಅರ್ಜುನನು ಬಿಲ್ಲನ್ನು ಹಿಡಿದು ನಿಂತಾಗ, \"ಅರ್ಜುನ, ನಿನಗೆ ಏನು ಕಾಣಿಸುತ್ತಿದೆ?\" ಎಂದು ದ್ರೋಣರು ಕೇಳಿದರು.",
            "kannadaSpeak": "கொநெயதாகி அர்ஜுநநு பில்லந்நு ஹிடிது நிம்தாக, \"அர்ஜுந, நிநகெ ஏநு காணிஸுத்திதெ?\" எம்து த்ரோணரு கேளிதரு.",
            "kannadaSub": "koneyadaagi arjunanu billannu hididu nimthaaga, \"arjuna, ninage enu kaanisuththide?\" emdu dronaru kelidaru.",
            "kannadaScript": "ಕೊನೆಯದಾಗಿ ಅರ್ಜುನನು ಬಿಲ್ಲನ್ನು ಹಿಡಿದು ನಿಂತಾಗ, \"ಅರ್ಜುನ, ನಿನಗೆ ಏನು ಕಾಣಿಸುತ್ತಿದೆ?\" ಎಂದು ದ್ರೋಣರು ಕೇಳಿದರು.",
            "hindi": "अंत में जब अर्जुन ने धनुष पर प्रत्यंचा चढ़ाई, तो द्रोणाचार्य ने पूछा, \"अर्जुन, तुम्हें क्या दिखाई दे रहा है?\"",
            "hindiSpeak": "அம்த மேம் ஜப அர்ஜுந நே தநுஷ பர ப்ரத்யம்சா சட़ாஈ, தோ த்ரோணாசார்ய நே பூசா, \"அர்ஜுந, தும்ஹேம் க்யா திகாஈ தே ரஹா ஹை?\"",
            "hindiSub": "amtha mem jaba arjuna ne dhanusha para prathyamchaa chadha़aaee, tho dronaachaarya ne poochhaa, \"arjuna, thumhem kyaa dikhaaee de rahaa hai?\"",
            "hindiScript": "अंत में जब अर्जुन ने धनुष पर प्रत्यंचा चढ़ाई, तो द्रोणाचार्य ने पूछा, \"अर्जुन, तुम्हें क्या दिखाई दे रहा है?\""
      },
      {
            "num": 7,
            "tamil": "\"குருவே, எனக்கு மரமும் தெரியவில்லை, வானமும் தெரியவில்லை; அந்தப் பறவையின் வலது கண் மட்டுமே எனக்குத் தெரிகிறது!\" என்றான் அர்ஜுனன் உறுதியாக.",
            "normal": "\"Master, I perceive neither the tree nor the sky; I see exclusively the glistening right eye of that bird!\" declared Arjuna with unwavering focus.",
            "advanced": "\"Preceptor, I behold neither foliage nor firmament; solely the gleaming ocular target of the bird reveals itself!\" Arjuna articulated with absolute singularity.",
            "vocab": [
                  {
                        "normal": "unwavering focus",
                        "advanced": "absolute singularity",
                        "tamil": "விலகாத கவனம்"
                  },
                  {
                        "normal": "exclusively the eye",
                        "advanced": "solely the ocular target",
                        "tamil": "கண் மட்டுமே"
                  }
            ],
            "telugu": "\"గురుదేవా, నాకు చెట్టు కనిపించడం లేదు, ఆకాశం కనిపించడం లేదు; ఆ పక్షి యొక్క కుడి కన్ను మాత్రమే నాకు కనిపిస్తోంది!\" అని అర్జునుడు స్థిరంగా చెప్పాడు.",
            "teluguSpeak": "\"குருதேவா, நாகு செட்டு கநிபிம்சடம் லேது, ஆகாஶம் கநிபிம்சடம் லேது; ஆ பக்ஷி யொக்க குடி கந்நு மாத்ரமே நாகு கநிபிஸ்தோம்தி!\" அநி அர்ஜுநுடு ஸ்திரம்கா செப்பாடு.",
            "teluguSub": "\"gurudevaa, naaku chettu kanipimchadam ledu, aakaasham kanipimchadam ledu; aa pakshi yokka kudi kannu maathrame naaku kanipisthomdi!\" ani arjunudu sthiramgaa cheppaadu.",
            "teluguScript": "\"గురుదేవా, నాకు చెట్టు కనిపించడం లేదు, ఆకాశం కనిపించడం లేదు; ఆ పక్షి యొక్క కుడి కన్ను మాత్రమే నాకు కనిపిస్తోంది!\" అని అర్జునుడు స్థిరంగా చెప్పాడు.",
            "kannada": "\"ಗುರುದೇವ, ನನಗೆ ಮರವೂ ಕಾಣುತ್ತಿಲ್ಲ, ಆಕಾಶವೂ ಕಾಣುತ್ತಿಲ್ಲ; ಆ ಹಕ್ಕಿಯ ಬಲಗಣ್ಣು ಮಾತ್ರ ನನಗೆ ಕಾಣಿಸುತ್ತಿದೆ!\" ಎಂದು ಅರ್ಜುನನು ದೃಢವಾಗಿ ನುಡಿದನು.",
            "kannadaSpeak": "\"குருதேவ, நநகெ மரவூ காணுத்தில்ல, ஆகாஶவூ காணுத்தில்ல; ஆ ஹக்கிய பலகண்ணு மாத்ர நநகெ காணிஸுத்திதெ!\" எம்து அர்ஜுநநு த்ருடவாகி நுடிதநு.",
            "kannadaSub": "\"gurudeva, nanage maravoo kaanuththilla, aakaashavoo kaanuththilla; aa hakkiya balagannu maathra nanage kaanisuththide!\" emdu arjunanu drudhavaagi nudidanu.",
            "kannadaScript": "\"ಗುರುದೇವ, ನನಗೆ ಮರವೂ ಕಾಣುತ್ತಿಲ್ಲ, ಆಕಾಶವೂ ಕಾಣುತ್ತಿಲ್ಲ; ಆ ಹಕ್ಕಿಯ ಬಲಗಣ್ಣು ಮಾತ್ರ ನನಗೆ ಕಾಣಿಸುತ್ತಿದೆ!\" ಎಂದು ಅರ್ಜುನನು ದೃಢವಾಗಿ ನುಡಿದನು.",
            "hindi": "\"गुरुदेव, मुझे न वृक्ष दिख रहा है न आकाश; मुझे केवल उस पक्षी की दाहिनी आँख दिखाई दे रही है!\" अर्जुन ने दृढ़ता से उत्तर दिया।",
            "hindiSpeak": "\"குருதேவ, முஜே ந வ்ருக்ஷ திக ரஹா ஹை ந ஆகாஶ; முஜே கேவல உஸ பக்ஷீ கீ தாஹிநீ ஆँக திகாஈ தே ரஹீ ஹை!\" அர்ஜுந நே த்ருட़தா ஸே உத்தர தியா।",
            "hindiSub": "\"gurudeva, mujhe na vruksha dikha rahaa hai na aakaasha; mujhe kevala usa pakshee kee daahinee aaँkha dikhaaee de rahee hai!\" arjuna ne drudha़thaa se uththara diyaa।",
            "hindiScript": "\"गुरुदेव, मुझे न वृक्ष दिख रहा है न आकाश; मुझे केवल उस पक्षी की दाहिनी आँख दिखाई दे रही है!\" अर्जुन ने दृढ़ता से उत्तर दिया।"
      },
      {
            "num": 8,
            "tamil": "மகிழ்ச்சியில் பூரித்த துரோணர், \"வில்லெய்து வெற்றி கொள்!\" என்று வாழ்த்தினார்; அர்ஜுனனின் அம்பு அடுத்த கணமே பறவையின் கண்ணைத் துளைத்தது.",
            "normal": "Overjoyed, Drona commanded him to release the arrow, and within a heartbeat, Arjuna's shaft pierced the bird's eye with flawless precision.",
            "advanced": "Exultant, Drona commanded release, whereupon Arjuna's missile pierced the ocular aperture with consummate precision.",
            "vocab": [
                  {
                        "normal": "overjoyed",
                        "advanced": "exultant",
                        "tamil": "மகிழ்ச்சி அடைந்தார்"
                  },
                  {
                        "normal": "flawless precision",
                        "advanced": "consummate precision",
                        "tamil": "துல்லியமான வெற்றி"
                  }
            ],
            "telugu": "ఆనందంతో పొంగిపోయిన ద్రోణుడు \"బాణం విడువు!\" అని ఆశీర్వదించగా, మరుక్షణంలోనే అర్జునుడి బాణం ఆ పక్షి కన్నును సూటిగా ఛేదించింది.",
            "teluguSpeak": "ஆநம்தம்தோ பொம்கிபோயிந த்ரோணுடு \"பாணம் விடுவு!\" அநி ஆஶீர்வதிம்சகா, மருக்ஷணம்லோநே அர்ஜுநுடி பாணம் ஆ பக்ஷி கந்நுநு ஸூடிகா சேதிம்சிம்தி.",
            "teluguSub": "aanamdamtho pomgipoyina dronudu \"baanam viduvu!\" ani aasheervadimchagaa, marukshanamlone arjunudi baanam aa pakshi kannunu sootigaa chhedimchimdi.",
            "teluguScript": "ఆనందంతో పొంగిపోయిన ద్రోణుడు \"బాణం విడువు!\" అని ఆశీర్వదించగా, మరుక్షణంలోనే అర్జునుడి బాణం ఆ పక్షి కన్నును సూటిగా ఛేదించింది.",
            "kannada": "ಸಂತೋಷಗೊಂಡ ದ್ರೋಣರು \"ಬಾಣ ಬಿಡು!\" ಎಂದು ಆಶೀರ್ವದಿಸಿದರು; ಮರುಕ್ಷಣದಲ್ಲೇ ಅರ್ಜುನನ ಬಾಣವು ಆ ಹಕ್ಕಿಯ ಕಣ್ಣನ್ನು ನೇರವಾಗಿ ಹೊಡೆಯಿತು.",
            "kannadaSpeak": "ஸம்தோஷகொம்ட த்ரோணரு \"பாண பிடு!\" எம்து ஆஶீர்வதிஸிதரு; மருக்ஷணதல்லே அர்ஜுநந பாணவு ஆ ஹக்கிய கண்ணந்நு நேரவாகி ஹொடெயிது.",
            "kannadaSub": "samthoshagomda dronaru \"baana bidu!\" emdu aasheervadisidaru; marukshanadalle arjunana baanavu aa hakkiya kannannu neravaagi hodeyithu.",
            "kannadaScript": "ಸಂತೋಷಗೊಂಡ ದ್ರೋಣರು \"ಬಾಣ ಬಿಡು!\" ಎಂದು ಆಶೀರ್ವದಿಸಿದರು; ಮರುಕ್ಷಣದಲ್ಲೇ ಅರ್ಜುನನ ಬಾಣವು ಆ ಹಕ್ಕಿಯ ಕಣ್ಣನ್ನು ನೇರವಾಗಿ ಹೊಡೆಯಿತು.",
            "hindi": "अत्यंत प्रसन्न होकर द्रोणाचार्य ने कहा, \"बाण चलाओ!\"; अगले ही क्षण अर्जुन का तीर सीधे चिड़िया की आँख को भेद गया।",
            "hindiSpeak": "அத்யம்த ப்ரஸந்ந ஹோகர த்ரோணாசார்ய நே கஹா, \"பாண சலாஓ!\"; அகலே ஹீ க்ஷண அர்ஜுந கா தீர ஸீதே சிட़ியா கீ ஆँக கோ பேத கயா।",
            "hindiSub": "athyamtha prasanna hokara dronaachaarya ne kahaa, \"baana chalaao!\"; agale hee kshana arjuna kaa theera seedhe chida़iyaa kee aaँkha ko bheda gayaa।",
            "hindiScript": "अत्यंत प्रसन्न होकर द्रोणाचार्य ने कहा, \"बाण चलाओ!\"; अगले ही क्षण अर्जुन का तीर सीधे चिड़िया की आँख को भेद गया।"
      }
],
      vocabComparison: [
        {
          normal: "Unwavering focus",
          advanced: "Single-pointed concentration",
          tamil: "விலகாத கவனம்",
          telugu: "తిరుగులేని దృష్టి",
          teluguSpeak: "திருகுலேநி த்ருஷ்டி",
          kannada: "ಅಚಲ ಗಮನ",
          kannadaSpeak: "அசல கமந",
          hindi: "अटूट फोकस",
          hindiSpeak: "அடூட போகஸ",
          example: "Arjuna demonstrated single-pointed concentration."
        },
        {
          normal: "Archery skill",
          advanced: "Supreme marksmanship",
          tamil: "வில்வித்தை ஆற்றல்",
          telugu: "విలువిద్య నైపుణ్యం",
          teluguSpeak: "விலுவித்ய நைபுண்யம்",
          kannada: "ಬಿಲ್ಲುಗಾರಿಕೆ ಕೌಶಲ್ಯ",
          kannadaSpeak: "பில்லுகாரிகெ கௌஶல்ய",
          hindi: "तीरंदाजी कौशल",
          hindiSpeak: "தீரம்தாஜீ கௌஶல",
          example: "His supreme marksmanship impressed Dronacharya."
        },
        {
          normal: "Master / Teacher",
          advanced: "Revered preceptor",
          tamil: "மதிப்புமிக்க குரு",
          telugu: "మాస్టర్ / టీచర్",
          teluguSpeak: "மாஸ்டர் / டீசர்",
          kannada: "ಮಾಸ್ಟರ್ / ಶಿಕ್ಷಕ",
          kannadaSpeak: "மாஸ்டர் / ஶிக்ஷக",
          hindi: "प्रमुख शिक्षक",
          hindiSpeak: "ப்ரமுக ஶிக்ஷக",
          example: "The royal princes revered their preceptor Dronacharya."
        },
        {
          normal: "Only the target",
          advanced: "Solitary focal point",
          tamil: "குறிக்கோள் புள்ளி",
          telugu: "లక్ష్యం మాత్రమే",
          teluguSpeak: "லக்ஷ்யம் மாத்ரமே",
          kannada: "ಗುರಿ ಮಾತ್ರ",
          kannadaSpeak: "குரி மாத்ர",
          hindi: "केवल लक्ष्य",
          hindiSpeak: "கேவல லக்ஷ்ய",
          example: "He saw only the solitary focal point of the target."
        }
      ],
      quiz: [
        { question: "What does 'solitary focal point' mean in Tamil?", options: ["பல திசைகள்", "ஒரே மையக் குறிக்கோள் புள்ளி", "அச்சம்", "இருள்"], correct: 1, explanation: "'Solitary focal point' means a single, exclusive point of concentrated attention (ஒரே மையப்புள்ளி)." },
        { question: "What target did Guru Dronacharya set on the tree?", options: ["A golden fruit", "The right eye of a wooden bird", "A flying eagle", "A lotus flower"], correct: 1, explanation: "He placed a wooden bird and asked the princes to hit only its right eye." },
        { question: "Why were Yudhishthira and Duryodhana told to lower their bows?", options: ["They were too slow", "They saw the tree, branches, and surroundings instead of just the target", "Their bows were broken", "They refused to shoot"], correct: 1, explanation: "Their attention was scattered by the tree and environment, lacking single-pointed focus." },
        { question: "What did Arjuna see when he aimed his bow?", options: ["The master and the sky", "Only the eye of the bird", "The forest and clouds", "His brothers"], correct: 1, explanation: "Arjuna saw exclusively the bird's eye; all surrounding distractions had vanished from his vision." }
      ]
    };
  }

  // 3. YOUTH / SMALL BOY / CHILDREN / STUDENTS ("சுட்டி சிறுவனின் கருணை")
  if (lower.includes("boy") || lower.includes("small boy") || lower.includes("child") || lower.includes("kid") || lower.includes("student") || lower.includes("son") || lower.includes("daughter") || lower.includes("school") || lower.includes("சிறுவன்") || lower.includes("பையன்") || lower.includes("குழந்தை")) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "சுட்டி சிறுவனின் கருணை",
        normal: "The Young Boy's Compassion",
        advanced: "The Intrepid Lad's Benevolence",
        telugu: "చిన్న బాలుడి దయ",
        kannada: "ಪುಟ್ಟ ಹುಡುಗನ ಕರುಣೆ",
        hindi: "छोटे बालक की दया"
      },
      category: category || "Inspiration & Wisdom",
      icon: icon || "heart",
      readTime: "1.5 min read",
      summary: {
        tamil: "முட்புதரில் சிக்கிய நாய் குட்டியை தைரியமாக மீட்டெடுத்து அன்பை வெளிப்படுத்திய ஒரு சிறுவனின் நெகிழ்ச்சியான கதை.",
        normal: "A touching narrative of a young boy who fearlessly rescued a trapped puppy and learned the true meaning of courage.",
        advanced: "A poignant discourse depicting a young lad whose instinctive empathy liberated an ensnared hound, illuminating moral fortitude.",
        telugu: "ముళ్లపొదలో చిక్కుకున్న కుక్కపిల్లను ధైర్యంగా రక్షించి, నిజమైన ధైర్యానికి అర్థం తెలుసుకున్న ఒక చిన్న బాలుడి హృదయపూర్వక కథ.",
        kannada: "ಮುಳ್ಳಿನ ಪೊದೆಯಲ್ಲಿ ಸಿಲುಕಿದ್ದ ನಾಯಿಮರಿಯನ್ನು ಧೈರ್ಯದಿಂದ ರಕ್ಷಿಸಿ, ನಿಜವಾದ ಧೈರ್ಯದ ಅರ್ಥವನ್ನು ಕಲಿತ ಪುಟ್ಟ ಹುಡುಗನ ಹೃದಯಸ್ಪರ್ಶಿ ಕಥೆ.",
        hindi: "कांटेदार झाड़ी में फंसे एक छोटे पिल्ले को निडरता से बचाकर सच्ची दया और साहस का पाठ सीखने वाले बालक की प्रेरक कहानी।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "ஒரு பசுமையான கிராமத்தில் அன்பு என்ற சுட்டி சிறுவன் தன் பள்ளி நேரம் முடிந்ததும் இயற்கையை ரசித்து விளையாடி வந்தான்.",
            "normal": "In a peaceful green village, a curious young boy named Anbu loved playing in nature after school.",
            "advanced": "Within a verdant hamlet, an inquisitive young lad christened Anbu revelled in exploring pastoral surroundings after his classes.",
            "vocab": [
                  {
                        "normal": "curious young boy",
                        "advanced": "inquisitive young lad",
                        "tamil": "ஆர்வமிக்க சிறுவன்"
                  },
                  {
                        "normal": "peaceful village",
                        "advanced": "verdant hamlet",
                        "tamil": "பசுமையான சிற்றூர்"
                  }
            ],
            "telugu": "ఒక పచ్చని ప్రశాంత గ్రామంలో, అన్బు అనే ఆసక్తిగల చిన్న బాలుడు పాఠశాల తర్వాత ప్రకృతిలో ఆడుకోవడానికి ఇష్టపడేవాడు.",
            "teluguSpeak": "ஒக பச்சநி ப்ரஶாம்த க்ராமம்லோ, அந்பு அநே ஆஸக்திகல சிந்ந பாலுடு பாடஶால தர்வாத ப்ரக்ருதிலோ ஆடுகோவடாநிகி இஷ்டபடேவாடு.",
            "teluguSub": "oka pachchani prashaamtha graamamlo, anbu ane aasakthigala chinna baaludu paathashaala tharvaatha prakruthilo aadukovadaaniki ishtapadevaadu.",
            "teluguScript": "ఒక పచ్చని ప్రశాంత గ్రామంలో, అన్బు అనే ఆసక్తిగల చిన్న బాలుడు పాఠశాల తర్వాత ప్రకృతిలో ఆడుకోవడానికి ఇష్టపడేవాడు.",
            "kannada": "ಒಂದು ಹಸಿರು ಪ್ರಶಾಂತ ಹಳ್ಳಿಯಲ್ಲಿ, ಅನ್ಬು ಎಂಬ ಕುತೂಹಲಕಾರಿ ಸಣ್ಣ ಹುಡುಗ ಶಾಲೆಯ ನಂತರ ಪ್ರಕೃತಿಯಲ್ಲಿ ಆಟವಾಡಲು ಇಷ್ಟಪಡುತ್ತಿದ್ದನು.",
            "kannadaSpeak": "ஒம்து ஹஸிரு ப்ரஶாம்த ஹள்ளியல்லி, அந்பு எம்ப குதூஹலகாரி ஸண்ண ஹுடுக ஶாலெய நம்தர ப்ரக்ருதியல்லி ஆடவாடலு இஷ்டபடுத்தித்தநு.",
            "kannadaSub": "omdu hasiru prashaamtha halliyalli, anbu emba kuthoohalakaari sanna huduga shaaleya namthara prakruthiyalli aatavaadalu ishtapaduththiddanu.",
            "kannadaScript": "ಒಂದು ಹಸಿರು ಪ್ರಶಾಂತ ಹಳ್ಳಿಯಲ್ಲಿ, ಅನ್ಬು ಎಂಬ ಕುತೂಹಲಕಾರಿ ಸಣ್ಣ ಹುಡುಗ ಶಾಲೆಯ ನಂತರ ಪ್ರಕೃತಿಯಲ್ಲಿ ಆಟವಾಡಲು ಇಷ್ಟಪಡುತ್ತಿದ್ದನು.",
            "hindi": "एक शांत हरे-भरे गाँव में, अन्बु नाम का एक जिज्ञासु छोटा लड़का स्कूल के बाद प्रकृति में खेलना बहुत पसंद करता था।",
            "hindiSpeak": "ஏக ஶாம்த ஹரே-பரே காँவ மேம், அந்பு நாம கா ஏக ஜிஜ்ஞாஸு சோடா லட़கா ஸ்கூல கே பாத ப்ரக்ருதி மேம் கேலநா பஹுத பஸம்த கரதா தா।",
            "hindiSub": "eka shaamtha hare-bhare gaaँva mem, anbu naama kaa eka jijnyaasu chhotaa lada़kaa skoola ke baada prakruthi mem khelanaa bahutha pasamda karathaa thaa।",
            "hindiScript": "एक शांत हरे-भरे गाँव में, अन्बु नाम का एक जिज्ञासु छोटा लड़का स्कूल के बाद प्रकृति में खेलना बहुत पसंद करता था।"
      },
      {
            "num": 2,
            "tamil": "ஒரு மாலை வேளையில், பழைய ஆலமரத்தின் அருகே நடந்து சென்றபோது, முட்புதரிலிருந்து ஒரு மெல்லிய முனகல் சத்தம் கேட்டது.",
            "normal": "One pleasant evening, as he walked near the old banyan tree, he heard a faint whimper from a thorny bush.",
            "advanced": "At dusk, whilst strolling near an antiquated banyan tree, he discerned a feeble, plaintive whimper emanating from dense briars.",
            "vocab": [
                  {
                        "normal": "faint whimper",
                        "advanced": "plaintive whimper",
                        "tamil": "மெல்லிய முனகல் ஒலி"
                  },
                  {
                        "normal": "thorny bush",
                        "advanced": "dense briars",
                        "tamil": "அடர்ந்த முட்புதர்"
                  }
            ],
            "telugu": "ఒక ఆహ్లాదకరమైన సాయంత్రం, పాత మర్రిచెట్టు దగ్గర నడుస్తున్నప్పుడు, ముళ్ల పొద నుండి ఒక చిన్న మూలుగు శబ్దం వినిపించింది.",
            "teluguSpeak": "ஒக ஆஹ்லாதகரமைந ஸாயம்த்ரம், பாத மர்ரிசெட்டு தக்கர நடுஸ்துந்நப்புடு, முள்ல பொத நும்டி ஒக சிந்ந மூலுகு ஶப்தம் விநிபிம்சிம்தி.",
            "teluguSub": "oka aahlaadakaramaina saayamthram, paatha marrichettu daggara nadusthunnappudu, mulla poda numdi oka chinna moolugu shabdam vinipimchimdi.",
            "teluguScript": "ఒక ఆహ్లాదకరమైన సాయంత్రం, పాత మర్రిచెట్టు దగ్గర నడుస్తున్నప్పుడు, ముళ్ల పొద నుండి ఒక చిన్న మూలుగు శబ్దం వినిపించింది.",
            "kannada": "ಒಂದು ಸುಂದರ ಸಂಜೆ, ಹಳೆಯ ಆಲದ ಮರದ ಬಳಿ ನಡೆಯುತ್ತಿರುವಾಗ, ಮುಳ್ಳಿನ ಪೊದೆಯಿಂದ ಸಣ್ಣ ನರಳುವ ಶಬ್ದ ಕೇಳಿಸಿತು.",
            "kannadaSpeak": "ஒம்து ஸும்தர ஸம்ஜெ, ஹளெய ஆலத மரத பளி நடெயுத்திருவாக, முள்ளிந பொதெயிம்த ஸண்ண நரளுவ ஶப்த கேளிஸிது.",
            "kannadaSub": "omdu sumdara samje, haleya aalada marada bali nadeyuththiruvaaga, mullina podeyimda sanna naraluva shabda kelisithu.",
            "kannadaScript": "ಒಂದು ಸುಂದರ ಸಂಜೆ, ಹಳೆಯ ಆಲದ ಮರದ ಬಳಿ ನಡೆಯುತ್ತಿರುವಾಗ, ಮುಳ್ಳಿನ ಪೊದೆಯಿಂದ ಸಣ್ಣ ನರಳುವ ಶಬ್ದ ಕೇಳಿಸಿತು.",
            "hindi": "एक सुहावनी शाम, जब वह पुराने बरगद के पेड़ के पास टहल रहा था, उसे काँटेदार झाड़ी से एक धीमी कराहने की आवाज़ सुनाई दी।",
            "hindiSpeak": "ஏக ஸுஹாவநீ ஶாம, ஜப வஹ புராநே பரகத கே பேட़ கே பாஸ டஹல ரஹா தா, உஸே காँடேதார ஜாட़ீ ஸே ஏக தீமீ கராஹநே கீ ஆவாஜ़ ஸுநாஈ தீ।",
            "hindiSub": "eka suhaavanee shaama, jaba vaha puraane baragada ke peda़ ke paasa tahala rahaa thaa, use kaaँtedaara jhaada़ee se eka dheemee karaahane kee aavaaja़ sunaaee dee।",
            "hindiScript": "एक सुहावनी शाम, जब वह पुराने बरगद के पेड़ के पास टहल रहा था, उसे काँटेदार झाड़ी से एक धीमी कराहने की आवाज़ सुनाई दी।"
      },
      {
            "num": 3,
            "tamil": "உற்று நோக்கியபோது, ஒரு சிறிய நாய் குட்டி முட்களுக்குள் மாட்டிக்கொண்டு நடுக்கத்துடன் அழுதுகொண்டிருப்பதை கண்டான்.",
            "normal": "Looking closely, he saw a tiny puppy shivering and trapped helplessly inside the sharp thorns.",
            "advanced": "Peering intently, he discovered a fragile canine pup shivering uncontrollably, ensnared within the menacing thorns.",
            "vocab": [
                  {
                        "normal": "looking closely",
                        "advanced": "peering intently",
                        "tamil": "உற்று நோக்குதல்"
                  },
                  {
                        "normal": "trapped helplessly",
                        "advanced": "ensnared within",
                        "tamil": "சிக்கிக்கொண்டது"
                  }
            ],
            "telugu": "దగ్గరగా పరిశీలించగా, ఒక చిన్న కుక్కపిల్ల వణుకుతూ ముళ్ల మధ్య నిస్సహాయంగా చిక్కుకుపోయి ఏడవడం చూశాడు.",
            "teluguSpeak": "தக்கரகா பரிஶீலிம்சகா, ஒக சிந்ந குக்கபில்ல வணுகுதூ முள்ல மத்ய நிஸ்ஸஹாயம்கா சிக்குகுபோயி ஏடவடம் சூஶாடு.",
            "teluguSub": "daggaragaa parisheelimchagaa, oka chinna kukkapilla vanukuthoo mulla madhya nissahaayamgaa chikkukupoyi edavadam chooshaadu.",
            "teluguScript": "దగ్గరగా పరిశీలించగా, ఒక చిన్న కుక్కపిల్ల వణుకుతూ ముళ్ల మధ్య నిస్సహాయంగా చిక్కుకుపోయి ఏడవడం చూశాడు.",
            "kannada": "ಹತ್ತಿರದಿಂದ ನೋಡಿದಾಗ, ಒಂದು ಸಣ್ಣ ನಾಯಿಮರಿ ನಡುಗುತ್ತಾ ಮುಳ್ಳುಗಳ ನಡುವೆ ಅಸಹಾಯಕವಾಗಿ ಸಿಲುಕಿ ಅಳುತ್ತಿರುವುದನ್ನು ಕಂಡನು.",
            "kannadaSpeak": "ஹத்திரதிம்த நோடிதாக, ஒம்து ஸண்ண நாயிமரி நடுகுத்தா முள்ளுகள நடுவெ அஸஹாயகவாகி ஸிலுகி அளுத்திருவுதந்நு கம்டநு.",
            "kannadaSub": "haththiradimda nodidaaga, omdu sanna naayimari naduguththaa mullugala naduve asahaayakavaagi siluki aluththiruvudannu kamdanu.",
            "kannadaScript": "ಹತ್ತಿರದಿಂದ ನೋಡಿದಾಗ, ಒಂದು ಸಣ್ಣ ನಾಯಿಮರಿ ನಡುಗುತ್ತಾ ಮುಳ್ಳುಗಳ ನಡುವೆ ಅಸಹಾಯಕವಾಗಿ ಸಿಲುಕಿ ಅಳುತ್ತಿರುವುದನ್ನು ಕಂಡನು.",
            "hindi": "पास जाकर देखने पर, उसने देखा कि एक नन्हा पिल्ला काँटों में बेबस फँसकर ठंड से काँप रहा था और रो रहा था।",
            "hindiSpeak": "பாஸ ஜாகர தேகநே பர, உஸநே தேகா கி ஏக நந்ஹா பில்லா காँடோம் மேம் பேபஸ பँஸகர டம்ட ஸே காँப ரஹா தா ஔர ரோ ரஹா தா।",
            "hindiSub": "paasa jaakara dekhane para, usane dekhaa ki eka nanhaa pillaa kaaँtom mem bebasa phaँsakara thamda se kaaँpa rahaa thaa aura ro rahaa thaa।",
            "hindiScript": "पास जाकर देखने पर, उसने देखा कि एक नन्हा पिल्ला काँटों में बेबस फँसकर ठंड से काँप रहा था और रो रहा था।"
      },
      {
            "num": 4,
            "tamil": "ஒரு கணம் கூட தயங்காமல், தன் கைகளில் முள் குத்துவதையும் பொருட்படுத்தாமல், முட்களை விலக்கி உதவத் தொடங்கினான்.",
            "normal": "Without a moment's hesitation, ignoring the sharp pricks on his hands, he parted the branches to rescue it.",
            "advanced": "Dispensing with hesitation and undeterred by stinging lacerations upon his hands, he parted the brambles to effect a rescue.",
            "vocab": [
                  {
                        "normal": "without hesitation",
                        "advanced": "dispensing with hesitation",
                        "tamil": "தயக்கமின்றி"
                  },
                  {
                        "normal": "ignoring the pricks",
                        "advanced": "undeterred by lacerations",
                        "tamil": "வலியை பொருட்படுத்தாமல்"
                  }
            ],
            "telugu": "ఒక్క క్షణం కూడా ఆలోచించకుండా, చేతులకు ముళ్లు గుచ్చుకుంటున్నా లెక్కచేయకుండా, కొమ్మలను పక్కకు జరిపి దానిని రక్షించడం ప్రారంభించాడు.",
            "teluguSpeak": "ஒக்க க்ஷணம் கூடா ஆலோசிம்சகும்டா, சேதுலகு முள்லு குச்சுகும்டுந்நா லெக்கசேயகும்டா, கொம்மலநு பக்ககு ஜரிபி தாநிநி ரக்ஷிம்சடம் ப்ராரம்பிம்சாடு.",
            "teluguSub": "okka kshanam koodaa aalochimchakumdaa, chethulaku mullu guchchukumtunnaa lekkacheyakumdaa, kommalanu pakkaku jaripi daanini rakshimchadam praarambhimchaadu.",
            "teluguScript": "ఒక్క క్షణం కూడా ఆలోచించకుండా, చేతులకు ముళ్లు గుచ్చుకుంటున్నా లెక్కచేయకుండా, కొమ్మలను పక్కకు జరిపి దానిని రక్షించడం ప్రారంభించాడు.",
            "kannada": "ಒಂದು ಕ್ಷಣವೂ ಯೋಚಿಸದೆ, ಕೈಗಳಿಗೆ ಮುಳ್ಳು ಚುಚ್ಚುವುದನ್ನು ಲೆಕ್ಕಿಸದೆ, ಕೊಂಬೆಗಳನ್ನು ಪಕ್ಕಕ್ಕೆ ಸರಿಸಿ ಅದನ್ನು ರಕ್ಷಿಸಲು ಪ್ರಾರಂಭಿಸಿದನು.",
            "kannadaSpeak": "ஒம்து க்ஷணவூ யோசிஸதெ, கைகளிகெ முள்ளு சுச்சுவுதந்நு லெக்கிஸதெ, கொம்பெகளந்நு பக்கக்கெ ஸரிஸி அதந்நு ரக்ஷிஸலு ப்ராரம்பிஸிதநு.",
            "kannadaSub": "omdu kshanavoo yochisade, kaigalige mullu chuchchuvudannu lekkisade, kombegalannu pakkakke sarisi adannu rakshisalu praarambhisidanu.",
            "kannadaScript": "ಒಂದು ಕ್ಷಣವೂ ಯೋಚಿಸದೆ, ಕೈಗಳಿಗೆ ಮುಳ್ಳು ಚುಚ್ಚುವುದನ್ನು ಲೆಕ್ಕಿಸದೆ, ಕೊಂಬೆಗಳನ್ನು ಪಕ್ಕಕ್ಕೆ ಸರಿಸಿ ಅದನ್ನು ರಕ್ಷಿಸಲು ಪ್ರಾರಂಭಿಸಿದನು.",
            "hindi": "बिना एक पल भी सोचे, हाथों में काँटे चुभने की परवाह किए बिना, उसने झाड़ियों को हटाकर उसे बचाना शुरू कर दिया।",
            "hindiSpeak": "பிநா ஏக பல பீ ஸோசே, ஹாதோம் மேம் காँடே சுபநே கீ பரவாஹ கிஏ பிநா, உஸநே ஜாட़ியோம் கோ ஹடாகர உஸே பசாநா ஶுரூ கர தியா।",
            "hindiSub": "binaa eka pala bhee soche, haathom mem kaaँte chubhane kee paravaaha kie binaa, usane jhaada़iyom ko hataakara use bachaanaa shuroo kara diyaa।",
            "hindiScript": "बिना एक पल भी सोचे, हाथों में काँटे चुभने की परवाह किए बिना, उसने झाड़ियों को हटाकर उसे बचाना शुरू कर दिया।"
      },
      {
            "num": 5,
            "tamil": "பயந்திருந்த அந்த வாயில்லா ஜீவனை மெதுவாக தன் கைகளில் அணைத்து, கனிவான குரலில் பேசி அதன் நடுக்கத்தை போக்கினான்.",
            "normal": "He gently scooped up the frightened little creature, whispering soothing words to calm its racing heart.",
            "advanced": "He tenderly embraced the petrified creature, murmuring reassuring cadences to alleviate its palpable distress.",
            "vocab": [
                  {
                        "normal": "soothing words",
                        "advanced": "reassuring cadences",
                        "tamil": "ஆறுதல் தரும் சொற்கள்"
                  },
                  {
                        "normal": "calm its racing heart",
                        "advanced": "alleviate distress",
                        "tamil": "பயத்தைப் போக்குதல்"
                  }
            ],
            "telugu": "భయపడిన ఆ చిన్న ప్రాణిని నెమ్మదిగా చేతుల్లోకి తీసుకుని, దాని భయాన్ని పోగొట్టడానికి ఆప్యాయంగా మాట్లాడాడు.",
            "teluguSpeak": "பயபடிந ஆ சிந்ந ப்ராணிநி நெம்மதிகா சேதுல்லோகி தீஸுகுநி, தாநி பயாந்நி போகொட்டடாநிகி ஆப்யாயம்கா மாட்லாடாடு.",
            "teluguSub": "bhayapadina aa chinna praanini nemmadigaa chethulloki theesukuni, daani bhayaanni pogottadaaniki aapyaayamgaa maatlaadaadu.",
            "teluguScript": "భయపడిన ఆ చిన్న ప్రాణిని నెమ్మదిగా చేతుల్లోకి తీసుకుని, దాని భయాన్ని పోగొట్టడానికి ఆప్యాయంగా మాట్లాడాడు.",
            "kannada": "ಹೆದರಿದ್ದ ಆ ಪುಟ್ಟ ಜೀವವನ್ನು ನಿಧಾನವಾಗಿ ಕೈಗಳಲ್ಲಿ ಎತ್ತಿಕೊಂಡು, ಅದರ ಹೆದರಿಕೆಯನ್ನು ಹೋಗಲಾಡಿಸಲು ಮೃದುವಾಗಿ ಮಾತನಾಡಿದನು.",
            "kannadaSpeak": "ஹெதரித்த ஆ புட்ட ஜீவவந்நு நிதாநவாகி கைகளல்லி எத்திகொம்டு, அதர ஹெதரிகெயந்நு ஹோகலாடிஸலு ம்ருதுவாகி மாதநாடிதநு.",
            "kannadaSub": "hedaridda aa putta jeevavannu nidhaanavaagi kaigalalli eththikomdu, adara hedarikeyannu hogalaadisalu mruduvaagi maathanaadidanu.",
            "kannadaScript": "ಹೆದರಿದ್ದ ಆ ಪುಟ್ಟ ಜೀವವನ್ನು ನಿಧಾನವಾಗಿ ಕೈಗಳಲ್ಲಿ ಎತ್ತಿಕೊಂಡು, ಅದರ ಹೆದರಿಕೆಯನ್ನು ಹೋಗಲಾಡಿಸಲು ಮೃದುವಾಗಿ ಮಾತನಾಡಿದನು.",
            "hindi": "उस डरे हुए बेज़ुबान जीव को उसने प्यार से गोद में उठाया और धीमी, दिलासा देने वाली आवाज़ में बात कर उसका डर दूर किया।",
            "hindiSpeak": "உஸ டரே ஹுஏ பேஜ़ுபாந ஜீவ கோ உஸநே ப்யார ஸே கோத மேம் உடாயா ஔர தீமீ, திலாஸா தேநே வாலீ ஆவாஜ़ மேம் பாத கர உஸகா டர தூர கியா।",
            "hindiSub": "usa dare hue beja़ubaana jeeva ko usane pyaara se goda mem uthaayaa aura dheemee, dilaasaa dene vaalee aavaaja़ mem baatha kara usakaa dara doora kiyaa।",
            "hindiScript": "उस डरे हुए बेज़ुबान जीव को उसने प्यार से गोद में उठाया और धीमी, दिलासा देने वाली आवाज़ में बात कर उसका डर दूर किया।"
      },
      {
            "num": 6,
            "tamil": "அதை வீட்டுக்கு கொண்டு வந்து, வெதுவெதுப்பான நீரால் அதன் காயத்தைத் துடைத்து, தனக்கு வைத்திருந்த பாலை ஊட்டி வளர்த்தான்.",
            "normal": "Carrying it home, he cleaned its scratches with warm water and fed it a warm bowl of fresh milk.",
            "advanced": "Transporting it to his dwelling, he cleansed its abrasions with tepid water and nourished it with wholesome milk.",
            "vocab": [
                  {
                        "normal": "cleaned scratches",
                        "advanced": "cleansed abrasions",
                        "tamil": "காயங்களை கழுவுதல்"
                  },
                  {
                        "normal": "fresh milk",
                        "advanced": "wholesome milk",
                        "tamil": "நல்ல தூய பால்"
                  }
            ],
            "telugu": "దానిని ఇంటికి తీసుకెళ్లి, గోరువెచ్చని నీటితో గాయాలను తుడిచి, తన కోసం ఉంచిన స్వచ్ఛమైన పాలను పోసి ఆదరించాడు.",
            "teluguSpeak": "தாநிநி இம்டிகி தீஸுகெள்லி, கோருவெச்சநி நீடிதோ காயாலநு துடிசி, தந கோஸம் உம்சிந ஸ்வச்சமைந பாலநு போஸி ஆதரிம்சாடு.",
            "teluguSub": "daanini imtiki theesukelli, goruvechchani neetitho gaayaalanu thudichi, thana kosam umchina svachchhamaina paalanu posi aadarimchaadu.",
            "teluguScript": "దానిని ఇంటికి తీసుకెళ్లి, గోరువెచ్చని నీటితో గాయాలను తుడిచి, తన కోసం ఉంచిన స్వచ్ఛమైన పాలను పోసి ఆదరించాడు.",
            "kannada": "ಅದನ್ನು ಮನೆಗೆ ತಂದು, ಬೆಚ್ಚಗಿನ ನೀರಿನಿಂದ ಗಾಯಗಳನ್ನು ಒರೆಸಿ, ತನಗಾಗಿ ಇಟ್ಟಿದ್ದ ತಾಜಾ ಹಾಲನ್ನು ಕುಡಿಸಿ ಪೋಷಿಸಿದನು.",
            "kannadaSpeak": "அதந்நு மநெகெ தம்து, பெச்சகிந நீரிநிம்த காயகளந்நு ஒரெஸி, தநகாகி இட்டித்த தாஜா ஹாலந்நு குடிஸி போஷிஸிதநு.",
            "kannadaSub": "adannu manege thamdu, bechchagina neerinimda gaayagalannu oresi, thanagaagi ittidda thaajaa haalannu kudisi poshisidanu.",
            "kannadaScript": "ಅದನ್ನು ಮನೆಗೆ ತಂದು, ಬೆಚ್ಚಗಿನ ನೀರಿನಿಂದ ಗಾಯಗಳನ್ನು ಒರೆಸಿ, ತನಗಾಗಿ ಇಟ್ಟಿದ್ದ ತಾಜಾ ಹಾಲನ್ನು ಕುಡಿಸಿ ಪೋಷಿಸಿದನು.",
            "hindi": "उसे घर लाकर, गुनगुने पानी से उसके घाव साफ किए और अपने हिस्से का ताज़ा दूध पिलाकर उसे सहारा दिया।",
            "hindiSpeak": "உஸே கர லாகர, குநகுநே பாநீ ஸே உஸகே காவ ஸாப கிஏ ஔர அபநே ஹிஸ்ஸே கா தாஜ़ா தூத பிலாகர உஸே ஸஹாரா தியா।",
            "hindiSub": "use ghara laakara, gunagune paanee se usake ghaava saapha kie aura apane hisse kaa thaaja़aa doodha pilaakara use sahaaraa diyaa।",
            "hindiScript": "उसे घर लाकर, गुनगुने पानी से उसके घाव साफ किए और अपने हिस्से का ताज़ा दूध पिलाकर उसे सहारा दिया।"
      },
      {
            "num": 7,
            "tamil": "நன்றி உணர்வோடு அந்த நாய் குட்டி அவன் கையை நக்கி வாலை ஆட்டிய தருணம், அவனுக்கு அளவில்லாத ஆனந்தத்தைத் தந்தது.",
            "normal": "With deep gratitude, the puppy licked his fingers and wagged its tail, filling Anbu with boundless joy.",
            "advanced": "Brimming with heartfelt gratitude, the restored pup affectionately nuzzled his fingers, suffusing Anbu with profound euphoria.",
            "vocab": [
                  {
                        "normal": "deep gratitude",
                        "advanced": "heartfelt gratitude",
                        "tamil": "உளமார்ந்த நன்றி"
                  },
                  {
                        "normal": "boundless joy",
                        "advanced": "profound euphoria",
                        "tamil": "அளவில்லாத மகிழ்ச்சி"
                  }
            ],
            "telugu": "కృతజ్ఞతతో ఆ కుక్కపిల్ల అతని చేతులను నాకి తోక ఊపిన క్షణం, అన్బు హృదయం అపరిమితమైన ఆనందంతో నిండిపోయింది.",
            "teluguSpeak": "க்ருதஜ்ஞததோ ஆ குக்கபில்ல அதநி சேதுலநு நாகி தோக ஊபிந க்ஷணம், அந்பு ஹ்ருதயம் அபரிமிதமைந ஆநம்தம்தோ நிம்டிபோயிம்தி.",
            "teluguSub": "kruthajnyathatho aa kukkapilla athani chethulanu naaki thoka oopina kshanam, anbu hrudayam aparimithamaina aanamdamtho nimdipoyimdi.",
            "teluguScript": "కృతజ్ఞతతో ఆ కుక్కపిల్ల అతని చేతులను నాకి తోక ఊపిన క్షణం, అన్బు హృదయం అపరిమితమైన ఆనందంతో నిండిపోయింది.",
            "kannada": "ಕೃತಜ್ಞತೆಯಿಂದ ಆ ನಾಯಿಮರಿ ಅವನ ಬೆರಳುಗಳನ್ನು ನೆಕ್ಕಿ ಬಾಲ ಅಲ್ಲಾಡಿಸಿದಾಗ, ಅನ್ಬು ಅಪಾರವಾದ ಸಂತೋಷವನ್ನು ಅನುಭವಿಸಿದನು.",
            "kannadaSpeak": "க்ருதஜ்ஞதெயிம்த ஆ நாயிமரி அவந பெரளுகளந்நு நெக்கி பால அல்லாடிஸிதாக, அந்பு அபாரவாத ஸம்தோஷவந்நு அநுபவிஸிதநு.",
            "kannadaSub": "kruthajnyatheyimda aa naayimari avana beralugalannu nekki baala allaadisidaaga, anbu apaaravaada samthoshavannu anubhavisidanu.",
            "kannadaScript": "ಕೃತಜ್ಞತೆಯಿಂದ ಆ ನಾಯಿಮರಿ ಅವನ ಬೆರಳುಗಳನ್ನು ನೆಕ್ಕಿ ಬಾಲ ಅಲ್ಲಾಡಿಸಿದಾಗ, ಅನ್ಬು ಅಪಾರವಾದ ಸಂತೋಷವನ್ನು ಅನುಭವಿಸಿದನು.",
            "hindi": "कृतज्ञता से भरे उस पिल्ले ने जब उसकी उँगलियों को चाटा और पूँछ हिलाई, तो अन्बु का दिल असीम आनंद से भर गया।",
            "hindiSpeak": "க்ருதஜ்ஞதா ஸே பரே உஸ பில்லே நே ஜப உஸகீ உँகலியோம் கோ சாடா ஔர பூँச ஹிலாஈ, தோ அந்பு கா தில அஸீம ஆநம்த ஸே பர கயா।",
            "hindiSub": "kruthajnyathaa se bhare usa pille ne jaba usakee uँgaliyom ko chaataa aura pooँchha hilaaee, tho anbu kaa dila aseema aanamda se bhara gayaa।",
            "hindiScript": "कृतज्ञता से भरे उस पिल्ले ने जब उसकी उँगलियों को चाटा और पूँछ हिलाई, तो अन्बु का दिल असीम आनंद से भर गया।"
      },
      {
            "num": 8,
            "tamil": "அவனது செயலைக் கண்ட தாத்தா, \"உண்மையான வீரம் என்பது பலத்தை காட்டுவதில் இல்லை; எளிய உயிர்களுக்கு கருணை காட்டுவதிலேயே உள்ளது\" என்றார்.",
            "normal": "Seeing his action, his grandfather smiled and said, \"True strength lies not in showing power, but in showing kindness to the weak.\"",
            "advanced": "Observing this, his patriarch smiled warmly, remarking, \"Authentic fortitude is evidenced not by exerting dominance, but by extending tender compassion toward vulnerable souls.\"",
            "vocab": [
                  {
                        "normal": "true strength",
                        "advanced": "authentic fortitude",
                        "tamil": "உண்மையான மனவலிமை"
                  },
                  {
                        "normal": "showing kindness",
                        "advanced": "extending compassion",
                        "tamil": "கருணை காட்டுதல்"
                  }
            ],
            "telugu": "అతని పనిని చూసిన తాతయ్య చిరునవ్వుతో, \"నిజమైన బలం ఇతరులపై అధికారం చూపడంలో లేదు; నిస్సహాయ ప్రాణులపై దయ చూపడంలోనే ఉంది\" అని చెప్పారు.",
            "teluguSpeak": "அதநி பநிநி சூஸிந தாதய்ய சிருநவ்வுதோ, \"நிஜமைந பலம் இதருலபை அதிகாரம் சூபடம்லோ லேது; நிஸ்ஸஹாய ப்ராணுலபை தய சூபடம்லோநே உம்தி\" அநி செப்பாரு.",
            "teluguSub": "athani panini choosina thaathayya chirunavvutho, \"nijamaina balam itharulapai adhikaaram choopadamlo ledu; nissahaaya praanulapai daya choopadamlone umdi\" ani cheppaaru.",
            "teluguScript": "అతని పనిని చూసిన తాతయ్య చిరునవ్వుతో, \"నిజమైన బలం ఇతరులపై అధికారం చూపడంలో లేదు; నిస్సహాయ ప్రాణులపై దయ చూపడంలోనే ఉంది\" అని చెప్పారు.",
            "kannada": "ಅವನ ಕೃತ್ಯವನ್ನು ನೋಡಿದ ಅಜ್ಜ ಮುಗುಳುನಗುತ್ತಾ, \"ನಿಜವಾದ ಶಕ್ತಿ ಇತರರ ಮೇಲೆ ಅಧಿಕಾರ ತೋರಿಸುವುದರಲ್ಲಿ ಇಲ್ಲ; ದುರ್ಬಲ ಜೀವಿಗಳ ಮೇಲೆ ಕರುಣೆ ತೋರಿಸುವುದರಲ್ಲಿದೆ\" ಎಂದರು.",
            "kannadaSpeak": "அவந க்ருத்யவந்நு நோடித அஜ்ஜ முகுளுநகுத்தா, \"நிஜவாத ஶக்தி இதரர மேலெ அதிகார தோரிஸுவுதரல்லி இல்ல; துர்பல ஜீவிகள மேலெ கருணெ தோரிஸுவுதரல்லிதெ\" எம்தரு.",
            "kannadaSub": "avana kruthyavannu nodida ajja mugulunaguththaa, \"nijavaada shakthi itharara mele adhikaara thorisuvudaralli illa; durbala jeevigala mele karune thorisuvudarallide\" emdaru.",
            "kannadaScript": "ಅವನ ಕೃತ್ಯವನ್ನು ನೋಡಿದ ಅಜ್ಜ ಮುಗುಳುನಗುತ್ತಾ, \"ನಿಜವಾದ ಶಕ್ತಿ ಇತರರ ಮೇಲೆ ಅಧಿಕಾರ ತೋರಿಸುವುದರಲ್ಲಿ ಇಲ್ಲ; ದುರ್ಬಲ ಜೀವಿಗಳ ಮೇಲೆ ಕರುಣೆ ತೋರಿಸುವುದರಲ್ಲಿದೆ\" ಎಂದರು.",
            "hindi": "यह देखकर दादाजी मुस्कुराए और बोले, \"सच्ची ताक़त दूसरों पर हुक़ूमत जताने में नहीं, बल्कि बेसहारा जीवों पर दया दिखाने में होती है।\"",
            "hindiSpeak": "யஹ தேககர தாதாஜீ முஸ்குராஏ ஔர போலே, \"ஸச்சீ தாக़த தூஸரோம் பர ஹுக़ூமத ஜதாநே மேம் நஹீம், பல்கி பேஸஹாரா ஜீவோம் பர தயா திகாநே மேம் ஹோதீ ஹை।\"",
            "hindiSub": "yaha dekhakara daadaajee muskuraae aura bole, \"sachchee thaaka़tha doosarom para huka़oomatha jathaane mem naheem, balki besahaaraa jeevom para dayaa dikhaane mem hothee hai।\"",
            "hindiScript": "यह देखकर दादाजी मुस्कुराए और बोले, \"सच्ची ताक़त दूसरों पर हुक़ूमत जताने में नहीं, बल्कि बेसहारा जीवों पर दया दिखाने में होती है।\""
      }
],
      vocabComparison: [
        {
          normal: "Kindness / Compassion",
          advanced: "Benevolence / Empathy",
          tamil: "கருணை / இரக்கம்",
          telugu: "దయ / కరుణ",
          teluguSpeak: "தய / கருண",
          kannada: "ದಯೆ / ಕರುಣೆ",
          kannadaSpeak: "தயெ / கருணெ",
          hindi: "दया / करुणा",
          hindiSpeak: "தயா / கருணா",
          example: "His benevolence touched everyone in the village."
        },
        {
          normal: "Trapped / Stuck",
          advanced: "Ensnared / Entangled",
          tamil: "சிக்கிய / மாட்டிக்கொண்ட",
          telugu: "చిక్కుకున్న / ఇరుక్కున్న",
          teluguSpeak: "சிக்குகுந்ந / இருக்குகுந்ந",
          kannada: "ಸಿಲುಕಿಕೊಂಡ / ಸಿಕ್ಕಿಬಿದ್ದ",
          kannadaSpeak: "ஸிலுகிகொம்ட / ஸிக்கிபித்த",
          hindi: "फँसा हुआ / अटका हुआ",
          hindiSpeak: "பँஸா ஹுஆ / அடகா ஹுஆ",
          example: "The bird was ensnared in the fisherman's net."
        },
        {
          normal: "Fear / Frightened",
          advanced: "Petrified / Trepidation",
          tamil: "அச்சம் / நடுக்கம்",
          telugu: "భయం / వణుకు",
          teluguSpeak: "பயம் / வணுகு",
          kannada: "ಭಯ / ನಡುಕ",
          kannadaSpeak: "பய / நடுக",
          hindi: "भय / घबराहट",
          hindiSpeak: "பய / கபராஹட",
          example: "She overcame her initial trepidation."
        },
        {
          normal: "True bravery",
          advanced: "Authentic fortitude",
          tamil: "உண்மையான வீரம்",
          telugu: "నిజమైన ధైర్యం",
          teluguSpeak: "நிஜமைந தைர்யம்",
          kannada: "ನಿಜವಾದ ಶೌರ್ಯ",
          kannadaSpeak: "நிஜவாத ஶௌர்ய",
          hindi: "सच्ची वीरता / साहस",
          hindiSpeak: "ஸச்சீ வீரதா / ஸாஹஸ",
          example: "Authentic fortitude shines brightest during crisis."
        }
      ],
      quiz: [
        { question: "What is the meaning of 'benevolence' in Tamil?", options: ["கோபம்", "கருணை / தயாள குணம்", "அச்சம்", "ஏமாற்றுதல்"], correct: 1, explanation: "'Benevolence' means the quality of being well-meaning, kind, and charitable (கருணை)." },
        { question: "Which advanced word means 'trapped or caught inside'?", options: ["Ensnared", "Liberated", "Scattered", "Elevated"], correct: 0, explanation: "'Ensnared' means caught in or as in a trap." },
        { question: "What did the grandfather identify as 'authentic fortitude'?", options: ["Fighting with others", "Accumulating wealth", "Showing compassionate protection to vulnerable beings", "Running away quickly"], correct: 2, explanation: "He taught that true strength is revealed through compassion toward the vulnerable." },
        { question: "What did Anbu do when he heard the puppy's whimper?", options: ["Ignored it completely", "Dispensed with hesitation and rescued it despite thorn pricks", "Ran home in fear", "Threw stones into the bush"], correct: 1, explanation: "Anbu acted immediately and fearlessly helped the trapped puppy." }
      ]
    };
  }

  // 4. SALARY / CAREER / PROMOTION / INTERVIEW / WORKPLACE
  if (lower.includes("salary") || lower.includes("promotion") || lower.includes("career") || lower.includes("interview") || lower.includes("job") || lower.includes("work") || lower.includes("office")) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "ஊதிய உயர்வு பேச்சுவார்த்தை",
        normal: "The Salary Negotiation Breakthrough",
        advanced: "The Remuneration Discourse",
        telugu: "జీతాల పెంపు చర్చలు",
        kannada: "ವೇತನ ಹೆಚ್ಚಳ ಸಂಭಾಷಣೆ",
        hindi: "वेतन वृद्धि वार्ता"
      },
      category: "Workplace & Career Mastery",
      icon: "briefcase",
      readTime: "1.5 min read",
      summary: {
        tamil: "தனது உழைப்பையும் சாதனைகளையும் ஆதாரங்களுடன் விளக்கி நியாயமான ஊதிய உயர்வை வென்ற ஒரு மென்பொருள் பொறியாளரின் கதை.",
        normal: "A practical workplace story about a software professional who prepared metrics, spoke with composure, and secured a well-deserved promotion.",
        advanced: "An astute professional chronicle demonstrating empirical metric presentation, diplomatic negotiation, and consummate career elevation.",
        telugu: "తన కృషి మరియు విజయాలను ఆధారాలతో వివరించి న్యాయమైన జీతాల పెంపును సాధించిన ఒక సాఫ్ట్‌వేర్ ఇంజనీర్ కథ.",
        kannada: "ತನ್ನ ಪರಿಶ್ರಮ ಮತ್ತು ಸಾಧನೆಗಳನ್ನು ಸಾಕ್ಷ್ಯಗಳೊಂದಿಗೆ ವಿವರಿಸಿ ನ್ಯಾಯಯುತ ವೇತನ ಹೆಚ್ಚಳವನ್ನು ಪಡೆದ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್ ಕಥೆ.",
        hindi: "अपने परिश्रम और उपलब्धियों को प्रमाणों के साथ प्रस्तुत कर न्यायोचित वेतन वृद्धि पाने वाले एक सॉफ्टवेयर इंजीनियर की प्रेरक कहानी।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "அருண் கடந்த இரண்டு ஆண்டுகளாக தனது நிறுவனத்தின் முக்கியமான மென்பொருள் திட்டத்தை வெற்றிகரமாக வழிநடத்தி வந்தான்.",
            "normal": "For the past two years, Arun had successfully led a mission-critical software project for his company.",
            "advanced": "Over the antecedent two years, Arun had adroitly spearheaded an indispensable enterprise software initiative.",
            "vocab": [
                  {
                        "normal": "led successfully",
                        "advanced": "adroitly spearheaded",
                        "tamil": "திறம்பட வழிநடத்தினார்"
                  },
                  {
                        "normal": "important project",
                        "advanced": "indispensable initiative",
                        "tamil": "முக்கியமான பணி"
                  }
            ],
            "telugu": "అరుణ్ గత రెండేళ్లుగా తన కంపెనీకి చెందిన ఒక కీలకమైన సాఫ్ట్‌వేర్ ప్రాజెక్టును విజయవంతంగా నడిపించాడు.",
            "teluguSpeak": "அருண் கத ரெம்டேள்லுகா தந கம்பெநீகி செம்திந ஒக கீலகமைந ஸாப்ட்‌வேர் ப்ராஜெக்டுநு விஜயவம்தம்கா நடிபிம்சாடு.",
            "teluguSub": "arun gatha remdellugaa thana kampeneeki chemdina oka keelakamaina saapht‌ver praajektunu vijayavamthamgaa nadipimchaadu.",
            "teluguScript": "అరుణ్ గత రెండేళ్లుగా తన కంపెనీకి చెందిన ఒక కీలకమైన సాఫ్ట్‌వేర్ ప్రాజెక్టును విజయవంతంగా నడిపించాడు.",
            "kannada": "ಅರುಣ್ ಕಳೆದ ಎರಡು ವರ್ಷಗಳಿಂದ ತನ್ನ ಕಂಪನಿಯ ಪ್ರಮುಖ ಸಾಫ್ಟ್‌ವೇರ್ ಯೋಜನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುನ್ನಡೆಸುತ್ತಿದ್ದನು.",
            "kannadaSpeak": "அருண் களெத எரடு வர்ஷகளிம்த தந்ந கம்பநிய ப்ரமுக ஸாப்ட்‌வேர் யோஜநெயந்நு யஶஸ்வியாகி முந்நடெஸுத்தித்தநு.",
            "kannadaSub": "arun kaleda eradu varshagalimda thanna kampaniya pramukha saapht‌ver yojaneyannu yashasviyaagi munnadesuththiddanu.",
            "kannadaScript": "ಅರುಣ್ ಕಳೆದ ಎರಡು ವರ್ಷಗಳಿಂದ ತನ್ನ ಕಂಪನಿಯ ಪ್ರಮುಖ ಸಾಫ್ಟ್‌ವೇರ್ ಯೋಜನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮುನ್ನಡೆಸುತ್ತಿದ್ದನು.",
            "hindi": "अरुण पिछले दो वर्षों से अपनी कंपनी के एक अत्यंत महत्वपूर्ण सॉफ्टवेयर प्रोजेक्ट का सफलतापूर्वक नेतृत्व कर रहा था।",
            "hindiSpeak": "அருண பிசலே தோ வர்ஷோம் ஸே அபநீ கம்பநீ கே ஏக அத்யம்த மஹத்வபூர்ண ஸॉப்டவேயர ப்ரோஜேக்ட கா ஸபலதாபூர்வக நேத்ருத்வ கர ரஹா தா।",
            "hindiSub": "aruna pichhale do varshom se apanee kampanee ke eka athyamtha mahathvapoorna saॉphtaveyara projekta kaa saphalathaapoorvaka nethruthva kara rahaa thaa।",
            "hindiScript": "अरुण पिछले दो वर्षों से अपनी कंपनी के एक अत्यंत महत्वपूर्ण सॉफ्टवेयर प्रोजेक्ट का सफलतापूर्वक नेतृत्व कर रहा था।"
      },
      {
            "num": 2,
            "tamil": "ஆண்டு மறுஆய்வு கூட்டம் நெருங்கியபோது, தனது பங்களிப்புக்கு ஏற்ப ஊதிய உயர்வு கேட்க வேண்டும் என்று அவன் தீர்மானித்தான்.",
            "normal": "As the annual review meeting approached, he decided to ask for a salary raise commensurate with his contributions.",
            "advanced": "As the annual appraisal symposium loomed, he resolved to negotiate remuneration commensurate with his stellar contributions.",
            "vocab": [
                  {
                        "normal": "salary raise",
                        "advanced": "remuneration adjustment",
                        "tamil": "ஊதிய உயர்வு"
                  },
                  {
                        "normal": "matching contributions",
                        "advanced": "commensurate with contributions",
                        "tamil": "பங்களிப்புக்கு ஏற்றவாறு"
                  }
            ],
            "telugu": "వార్షిక సమీక్ష సమావేశం దగ్గరపడుతుండగా, తన కృషికి తగిన జీతం పెంపును కోరాలని అతను నిర్ణయించుకున్నాడు.",
            "teluguSpeak": "வார்ஷிக ஸமீக்ஷ ஸமாவேஶம் தக்கரபடுதும்டகா, தந க்ருஷிகி தகிந ஜீதம் பெம்புநு கோராலநி அதநு நிர்ணயிம்சுகுந்நாடு.",
            "teluguSub": "vaarshika sameeksha samaavesham daggarapaduthumdagaa, thana krushiki thagina jeetham pempunu koraalani athanu nirnayimchukunnaadu.",
            "teluguScript": "వార్షిక సమీక్ష సమావేశం దగ్గరపడుతుండగా, తన కృషికి తగిన జీతం పెంపును కోరాలని అతను నిర్ణయించుకున్నాడు.",
            "kannada": "ವಾರ್ಷಿಕ ಪರಿಶೀಲನಾ ಸಭೆ ಸಮೀಪಿಸಿದಾಗ, ತನ್ನ ಶ್ರಮಕ್ಕೆ ತಕ್ಕಂತೆ ವೇತನ ಹೆಚ್ಚಳವನ್ನು ಕೇಳಲು ಅವನು ನಿರ್ಧರಿಸಿದನು.",
            "kannadaSpeak": "வார்ஷிக பரிஶீலநா ஸபெ ஸமீபிஸிதாக, தந்ந ஶ்ரமக்கெ தக்கம்தெ வேதந ஹெச்சளவந்நு கேளலு அவநு நிர்தரிஸிதநு.",
            "kannadaSub": "vaarshika parisheelanaa sabhe sameepisidaaga, thanna shramakke thakkamthe vethana hechchalavannu kelalu avanu nirdharisidanu.",
            "kannadaScript": "ವಾರ್ಷಿಕ ಪರಿಶೀಲನಾ ಸಭೆ ಸಮೀಪಿಸಿದಾಗ, ತನ್ನ ಶ್ರಮಕ್ಕೆ ತಕ್ಕಂತೆ ವೇತನ ಹೆಚ್ಚಳವನ್ನು ಕೇಳಲು ಅವನು ನಿರ್ಧರಿಸಿದನು.",
            "hindi": "वार्षिक मूल्यांकन बैठक निकट आते ही उसने अपने योगदान के अनुरूप वेतन वृद्धि मांगने का निर्णय लिया।",
            "hindiSpeak": "வார்ஷிக மூல்யாம்கந பைடக நிகட ஆதே ஹீ உஸநே அபநே யோகதாந கே அநுரூப வேதந வ்ருத்தி மாம்கநே கா நிர்ணய லியா।",
            "hindiSub": "vaarshika moolyaamkana baithaka nikata aathe hee usane apane yogadaana ke anuroopa vethana vruddhi maamgane kaa nirnaya liyaa।",
            "hindiScript": "वार्षिक मूल्यांकन बैठक निकट आते ही उसने अपने योगदान के अनुरूप वेतन वृद्धि मांगने का निर्णय लिया।"
      },
      {
            "num": 3,
            "tamil": "வெறும் வாய்வார்த்தையாக பேசாமல், குழு சேமித்த செலவுகளையும் வாடிக்கையாளர் திருப்தியையும் புள்ளிவிவரங்களாக ஆவணப்படுத்தினான்.",
            "normal": "Rather than speaking vaguely, he documented team cost savings and customer satisfaction with tangible data.",
            "advanced": "Eschewing vague rhetoric, he methodically documented fiscal optimizations and client gratification through empirical data.",
            "vocab": [
                  {
                        "normal": "tangible data",
                        "advanced": "empirical data",
                        "tamil": "ஆதாரப் புள்ளிவிவரங்கள்"
                  },
                  {
                        "normal": "cost savings",
                        "advanced": "fiscal optimizations",
                        "tamil": "நிதிச் சேமிப்புகள்"
                  }
            ],
            "telugu": "కేవలం మాటలకే పరిమితం కాకుండా, బృందం ఆదా చేసిన ఖర్చులు మరియు కస్టమర్ల సంతృప్తిని స్పష్టమైన ఆధారాలతో నమోదు చేశాడు.",
            "teluguSpeak": "கேவலம் மாடலகே பரிமிதம் காகும்டா, ப்ரும்தம் ஆதா சேஸிந கர்சுலு மரியு கஸ்டமர்ல ஸம்த்ருப்திநி ஸ்பஷ்டமைந ஆதாராலதோ நமோது சேஶாடு.",
            "teluguSub": "kevalam maatalake parimitham kaakumdaa, brumdam aadaa chesina kharchulu mariyu kastamarla samthrupthini spashtamaina aadhaaraalatho namodu cheshaadu.",
            "teluguScript": "కేవలం మాటలకే పరిమితం కాకుండా, బృందం ఆదా చేసిన ఖర్చులు మరియు కస్టమర్ల సంతృప్తిని స్పష్టమైన ఆధారాలతో నమోదు చేశాడు.",
            "kannada": "ಕೇವಲ ಬಾಯಿಮಾತಿನಲ್ಲಿ ಮಾತನಾಡದೆ, ತಂಡವು ಉಳಿಸಿದ ವೆಚ್ಚಗಳು ಮತ್ತು ಗ್ರಾಹಕರ ತೃಪ್ತಿಯನ್ನು ಅಂಕಿಅಂಶಗಳೊಂದಿಗೆ ದಾಖಲಿಸಿದನು.",
            "kannadaSpeak": "கேவல பாயிமாதிநல்லி மாதநாடதெ, தம்டவு உளிஸித வெச்சகளு மத்து க்ராஹகர த்ருப்தியந்நு அம்கிஅம்ஶகளொம்திகெ தாகலிஸிதநு.",
            "kannadaSub": "kevala baayimaathinalli maathanaadade, thamdavu ulisida vechchagalu maththu graahakara thrupthiyannu amkiamshagalomdige daakhalisidanu.",
            "kannadaScript": "ಕೇವಲ ಬಾಯಿಮಾತಿನಲ್ಲಿ ಮಾತನಾಡದೆ, ತಂಡವು ಉಳಿಸಿದ ವೆಚ್ಚಗಳು ಮತ್ತು ಗ್ರಾಹಕರ ತೃಪ್ತಿಯನ್ನು ಅಂಕಿಅಂಶಗಳೊಂದಿಗೆ ದಾಖಲಿಸಿದನು.",
            "hindi": "केवल मौखिक बातें करने के बजाय, उसने टीम द्वारा की गई लागत बचत और ग्राहकों की संतुष्टि को ठोस आँकड़ों में प्रलेखित किया।",
            "hindiSpeak": "கேவல மௌகிக பாதேம் கரநே கே பஜாய, உஸநே டீம த்வாரா கீ கஈ லாகத பசத ஔர க்ராஹகோம் கீ ஸம்துஷ்டி கோ டோஸ ஆँகட़ோம் மேம் ப்ரலேகித கியா।",
            "hindiSub": "kevala maukhika baathem karane ke bajaaya, usane teema dvaaraa kee gaee laagatha bachatha aura graahakom kee samthushti ko thosa aaँkada़om mem pralekhitha kiyaa।",
            "hindiScript": "केवल मौखिक बातें करने के बजाय, उसने टीम द्वारा की गई लागत बचत और ग्राहकों की संतुष्टि को ठोस आँकड़ों में प्रलेखित किया।"
      },
      {
            "num": 4,
            "tamil": "கூட்டத்தின் போது, எந்தவித பதற்றமும் இன்றி தனது சாதனைகளை மேலாளரிடம் கண்ணியமாக எடுத்துரைத்தான்.",
            "normal": "During the meeting, without any nervousness, he presented his achievements to the manager with professional poise.",
            "advanced": "Throughout the discourse, devoid of apprehension, he articulated his accomplishments with consummate professional poise.",
            "vocab": [
                  {
                        "normal": "without nervousness",
                        "advanced": "devoid of apprehension",
                        "tamil": "பதற்றமின்றி"
                  },
                  {
                        "normal": "professional poise",
                        "advanced": "consummate poise",
                        "tamil": "நிறைவான நிதானம்"
                  }
            ],
            "telugu": "సమావేశంలో ఎలాంటి ఆందోళన లేకుండా, తన విజయాలను మేనేజర్‌కు హుందాగా వివరించాడు.",
            "teluguSpeak": "ஸமாவேஶம்லோ எலாம்டி ஆம்தோளந லேகும்டா, தந விஜயாலநு மேநேஜர்‌கு ஹும்தாகா விவரிம்சாடு.",
            "teluguSub": "samaaveshamlo elaamti aamdolana lekumdaa, thana vijayaalanu menejar‌ku humdaagaa vivarimchaadu.",
            "teluguScript": "సమావేశంలో ఎలాంటి ఆందోళన లేకుండా, తన విజయాలను మేనేజర్‌కు హుందాగా వివరించాడు.",
            "kannada": "ಸಭೆಯಲ್ಲಿ ಯಾವುದೇ ಅಳುಕಿಲ್ಲದೆ, ತನ್ನ ಸಾಧನೆಗಳನ್ನು ಮ್ಯಾನೇಜರ್‌ಗೆ ವೃತ್ತಿಪರ ಸಂಯಮದಿಂದ ವಿವರಿಸಿದನು.",
            "kannadaSpeak": "ஸபெயல்லி யாவுதே அளுகில்லதெ, தந்ந ஸாதநெகளந்நு ம்யாநேஜர்‌கெ வ்ருத்திபர ஸம்யமதிம்த விவரிஸிதநு.",
            "kannadaSub": "sabheyalli yaavude alukillade, thanna saadhanegalannu myaanejar‌ge vruththipara samyamadimda vivarisidanu.",
            "kannadaScript": "ಸಭೆಯಲ್ಲಿ ಯಾವುದೇ ಅಳುಕಿಲ್ಲದೆ, ತನ್ನ ಸಾಧನೆಗಳನ್ನು ಮ್ಯಾನೇಜರ್‌ಗೆ ವೃತ್ತಿಪರ ಸಂಯಮದಿಂದ ವಿವರಿಸಿದನು.",
            "hindi": "बैठक के दौरान बिना किसी घबराहट के उसने अपनी उपलब्धियों को प्रबंधक के समक्ष गरिमापूर्ण आत्मविश्वास के साथ प्रस्तुत किया।",
            "hindiSpeak": "பைடக கே தௌராந பிநா கிஸீ கபராஹட கே உஸநே அபநீ உபலப்தியோம் கோ ப்ரபம்தக கே ஸமக்ஷ கரிமாபூர்ண ஆத்மவிஶ்வாஸ கே ஸாத ப்ரஸ்துத கியா।",
            "hindiSub": "baithaka ke dauraana binaa kisee ghabaraahata ke usane apanee upalabdhiyom ko prabamdhaka ke samaksha garimaapoorna aathmavishvaasa ke saatha prasthutha kiyaa।",
            "hindiScript": "बैठक के दौरान बिना किसी घबराहट के उसने अपनी उपलब्धियों को प्रबंधक के समक्ष गरिमापूर्ण आत्मविश्वास के साथ प्रस्तुत किया।"
      },
      {
            "num": 5,
            "tamil": "\"நிறுவனத்தின் வளர்ச்சிக்கு எனது உழைப்பு பெரும் துணையாக இருந்துள்ளது என்பதை இந்த தரவுகள் காட்டுகின்றன\" என்று அமைதியாகக் கூறினான்.",
            "normal": "\"These metrics demonstrate that my dedication has substantially fueled the company's growth,\" he stated calmly.",
            "advanced": "\"These metrics substantiate that my continuous fidelity has substantially propelled enterprise growth,\" he maintained serenely.",
            "vocab": [
                  {
                        "normal": "substantially fueled",
                        "advanced": "substantially propelled",
                        "tamil": "பெரிதும் முன்னெடுத்தது"
                  },
                  {
                        "normal": "stated calmly",
                        "advanced": "maintained serenely",
                        "tamil": "அமைதியாக கூறினார்"
                  }
            ],
            "telugu": "\"ఈ గణాంకాలు నా అంకితభావం కంపెనీ వృద్ధికి ఎంతగానో దోహదపడిందో నిరూపిస్తున్నాయి\" అని శాంతంగా చెప్పాడు.",
            "teluguSpeak": "\"ஈ கணாம்காலு நா அம்கிதபாவம் கம்பெநீ வ்ருத்திகி எம்தகாநோ தோஹதபடிம்தோ நிரூபிஸ்துந்நாயி\" அநி ஶாம்தம்கா செப்பாடு.",
            "teluguSub": "\"ee ganaamkaalu naa amkithabhaavam kampenee vruddhiki emthagaano dohadapadimdo niroopisthunnaayi\" ani shaamthamgaa cheppaadu.",
            "teluguScript": "\"ఈ గణాంకాలు నా అంకితభావం కంపెనీ వృద్ధికి ఎంతగానో దోహదపడిందో నిరూపిస్తున్నాయి\" అని శాంతంగా చెప్పాడు.",
            "kannada": "\"ಈ ಅಂಕಿಅಂಶಗಳು ನನ್ನ ಪರಿಶ್ರಮವು ಕಂಪನಿಯ ಬೆಳವಣಿಗೆಗೆ ಗಣನೀಯ ಕೊಡುಗೆ ನೀಡಿದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತವೆ\" ಎಂದು ಶಾಂತವಾಗಿ ಹೇಳಿದನು.",
            "kannadaSpeak": "\"ஈ அம்கிஅம்ஶகளு நந்ந பரிஶ்ரமவு கம்பநிய பெளவணிகெகெ கணநீய கொடுகெ நீடிதெ எம்புதந்நு தோரிஸுத்தவெ\" எம்து ஶாம்தவாகி ஹேளிதநு.",
            "kannadaSub": "\"ee amkiamshagalu nanna parishramavu kampaniya belavanigege gananeeya koduge needide embudannu thorisuththave\" emdu shaamthavaagi helidanu.",
            "kannadaScript": "\"ಈ ಅಂಕಿಅಂಶಗಳು ನನ್ನ ಪರಿಶ್ರಮವು ಕಂಪನಿಯ ಬೆಳವಣಿಗೆಗೆ ಗಣನೀಯ ಕೊಡುಗೆ ನೀಡಿದೆ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತವೆ\" ಎಂದು ಶಾಂತವಾಗಿ ಹೇಳಿದನು.",
            "hindi": "\"ये आँकड़े दर्शाते हैं कि मेरे समर्पण ने कंपनी के विकास को गति देने में महत्वपूर्ण भूमिका निभाई है,\" उसने शांत भाव से कहा।",
            "hindiSpeak": "\"யே ஆँகட़ே தர்ஶாதே ஹைம் கி மேரே ஸமர்பண நே கம்பநீ கே விகாஸ கோ கதி தேநே மேம் மஹத்வபூர்ண பூமிகா நிபாஈ ஹை,\" உஸநே ஶாம்த பாவ ஸே கஹா।",
            "hindiSub": "\"ye aaँkada़e darshaathe haim ki mere samarpana ne kampanee ke vikaasa ko gathi dene mem mahathvapoorna bhoomikaa nibhaaee hai,\" usane shaamtha bhaava se kahaa।",
            "hindiScript": "\"ये आँकड़े दर्शाते हैं कि मेरे समर्पण ने कंपनी के विकास को गति देने में महत्वपूर्ण भूमिका निभाई है,\" उसने शांत भाव से कहा।"
      },
      {
            "num": 6,
            "tamil": "அவனது தயாரிப்பையும் வெளிப்படையான ஆதாரங்களையும் கண்ட மேலாளர் மிகவும் ஈர்க்கப்பட்டார்.",
            "normal": "Impressed by his meticulous preparation and objective evidence, the manager nodded in deep agreement.",
            "advanced": "Captivated by his meticulous groundwork and incontrovertible substantiation, the executive nodded with profound approval.",
            "vocab": [
                  {
                        "normal": "meticulous preparation",
                        "advanced": "meticulous groundwork",
                        "tamil": "நுணுக்கமான தயாரிப்பு"
                  },
                  {
                        "normal": "clear evidence",
                        "advanced": "incontrovertible substantiation",
                        "tamil": "மறுக்க முடியாத சான்றுகள்"
                  }
            ],
            "telugu": "అతని ముందస్తు సన్నద్ధత మరియు తిరుగులేని ఆధారాలను చూసి మేనేజర్ ఎంతగానో ముగ్ధుడయ్యాడు.",
            "teluguSpeak": "அதநி மும்தஸ்து ஸந்நத்தத மரியு திருகுலேநி ஆதாராலநு சூஸி மேநேஜர் எம்தகாநோ முக்துடய்யாடு.",
            "teluguSub": "athani mumdasthu sannaddhatha mariyu thiruguleni aadhaaraalanu choosi menejar emthagaano mugdhudayyaadu.",
            "teluguScript": "అతని ముందస్తు సన్నద్ధత మరియు తిరుగులేని ఆధారాలను చూసి మేనేజర్ ఎంతగానో ముగ్ధుడయ్యాడు.",
            "kannada": "ಅವನ ಸಿದ್ಧತೆ ಮತ್ತು ಸ್ಪಷ್ಟ ಪುರಾವೆಗಳನ್ನು ನೋಡಿ ಮ್ಯಾನೇಜರ್ ಸಂಪೂರ್ಣವಾಗಿ ಒಪ್ಪಿಕೊಂಡರು.",
            "kannadaSpeak": "அவந ஸித்ததெ மத்து ஸ்பஷ்ட புராவெகளந்நு நோடி ம்யாநேஜர் ஸம்பூர்ணவாகி ஒப்பிகொம்டரு.",
            "kannadaSub": "avana siddhathe maththu spashta puraavegalannu nodi myaanejar sampoornavaagi oppikomdaru.",
            "kannadaScript": "ಅವನ ಸಿದ್ಧತೆ ಮತ್ತು ಸ್ಪಷ್ಟ ಪುರಾವೆಗಳನ್ನು ನೋಡಿ ಮ್ಯಾನೇಜರ್ ಸಂಪೂರ್ಣವಾಗಿ ಒಪ್ಪಿಕೊಂಡರು.",
            "hindi": "उसकी सूक्ष्म तैयारी और अकाट्य साक्ष्यों से प्रभावित होकर प्रबंधक ने गहरी सहमति में सिर हिलाया।",
            "hindiSpeak": "உஸகீ ஸூக்ஷ்ம தையாரீ ஔர அகாட்ய ஸாக்ஷ்யோம் ஸே ப்ரபாவித ஹோகர ப்ரபம்தக நே கஹரீ ஸஹமதி மேம் ஸிர ஹிலாயா।",
            "hindiSub": "usakee sookshma thaiyaaree aura akaatya saakshyom se prabhaavitha hokara prabamdhaka ne gaharee sahamathi mem sira hilaayaa।",
            "hindiScript": "उसकी सूक्ष्म तैयारी और अकाट्य साक्ष्यों से प्रभावित होकर प्रबंधक ने गहरी सहमति में सिर हिलाया।"
      },
      {
            "num": 7,
            "tamil": "கூட்டத்தின் முடிவில், அவன் கேட்ட ஊதிய உயர்வும் சீனியர் லீட் என்ற பதவி உயர்வும் உடனடியாக அங்கீகரிக்கப்பட்டது.",
            "normal": "By the close of the meeting, his requested raise along with a promotion to Senior Lead was promptly granted.",
            "advanced": "At the conclusion of negotiations, both his requested compensation and a prestigious elevation to Senior Lead were ratified.",
            "vocab": [
                  {
                        "normal": "promptly granted",
                        "advanced": "unconditionally ratified",
                        "tamil": "உடனடியாக அங்கீகரிக்கப்பட்டது"
                  },
                  {
                        "normal": "promotion",
                        "advanced": "prestigious elevation",
                        "tamil": "பதவி உயர்வு"
                  }
            ],
            "telugu": "సమావేశం ముగిసే సమయానికి, అతను కోరిన జీతాల పెంపుతో పాటు సీనియర్ లీడ్ ప్రమోషన్ కూడా వెంటనే మంజూరైంది.",
            "teluguSpeak": "ஸமாவேஶம் முகிஸே ஸமயாநிகி, அதநு கோரிந ஜீதால பெம்புதோ பாடு ஸீநியர் லீட் ப்ரமோஷந் கூடா வெம்டநே மம்ஜூரைம்தி.",
            "teluguSub": "samaavesham mugise samayaaniki, athanu korina jeethaala pemputho paatu seeniyar leed pramoshan koodaa vemtane mamjooraimdi.",
            "teluguScript": "సమావేశం ముగిసే సమయానికి, అతను కోరిన జీతాల పెంపుతో పాటు సీనియర్ లీడ్ ప్రమోషన్ కూడా వెంటనే మంజూరైంది.",
            "kannada": "ಸಭೆಯ ಕೊನೆಯಲ್ಲಿ, ಅವನು ಕೇಳಿದ ವೇತನ ಹೆಚ್ಚಳ ಮತ್ತು ಸೀನಿಯರ್ ಲೀಡ್ ಹುದ್ದೆಯ ಬಡ್ತಿಯನ್ನು ತಕ್ಷಣವೇ ನೀಡಲಾಯಿತು.",
            "kannadaSpeak": "ஸபெய கொநெயல்லி, அவநு கேளித வேதந ஹெச்சள மத்து ஸீநியர் லீட் ஹுத்தெய பட்தியந்நு தக்ஷணவே நீடலாயிது.",
            "kannadaSub": "sabheya koneyalli, avanu kelida vethana hechchala maththu seeniyar leed huddeya badthiyannu thakshanave needalaayithu.",
            "kannadaScript": "ಸಭೆಯ ಕೊನೆಯಲ್ಲಿ, ಅವನು ಕೇಳಿದ ವೇತನ ಹೆಚ್ಚಳ ಮತ್ತು ಸೀನಿಯರ್ ಲೀಡ್ ಹುದ್ದೆಯ ಬಡ್ತಿಯನ್ನು ತಕ್ಷಣವೇ ನೀಡಲಾಯಿತು.",
            "hindi": "बैठक की समाप्ति पर उसकी माँगी गई वेतन वृद्धि और सीनियर लीड के पद पर पदोन्नति को तत्काल स्वीकृति मिल गई।",
            "hindiSpeak": "பைடக கீ ஸமாப்தி பர உஸகீ மாँகீ கஈ வேதந வ்ருத்தி ஔர ஸீநியர லீட கே பத பர பதோந்நதி கோ தத்கால ஸ்வீக்ருதி மில கஈ।",
            "hindiSub": "baithaka kee samaapthi para usakee maaँgee gaee vethana vruddhi aura seeniyara leeda ke pada para padonnathi ko thathkaala sveekruthi mila gaee।",
            "hindiScript": "बैठक की समाप्ति पर उसकी माँगी गई वेतन वृद्धि और सीनियर लीड के पद पर पदोन्नति को तत्काल स्वीकृति मिल गई।"
      },
      {
            "num": 8,
            "tamil": "மதிப்புமிக்க வேலைக்கு சரியான முறையில் குரல் கொடுப்பதே முன்னேற்றத்தின் திறவுகோல் என்பதை அருண் நிரூபித்தான்.",
            "normal": "Arun proved that advocating for one's true value with clarity and proof is the master key to career advancement.",
            "advanced": "Arun substantiated that championing one's intrinsic worth with articulate substantiation constitutes the quintessential catalyst for ascension.",
            "vocab": [
                  {
                        "normal": "master key",
                        "advanced": "quintessential catalyst",
                        "tamil": "முக்கிய திறவுகோல்"
                  },
                  {
                        "normal": "advocating value",
                        "advanced": "championing intrinsic worth",
                        "tamil": "மதிப்பை நிலைநாட்டுதல்"
                  }
            ],
            "telugu": "నిజమైన విలువైన పనికి సరైన ఆధారాలతో గొంతు విప్పడమే కెరీర్ ఎదుగుదలకు అసలైన రాజమార్గమని అరుణ్ నిరూపించాడు.",
            "teluguSpeak": "நிஜமைந விலுவைந பநிகி ஸரைந ஆதாராலதோ கொம்து விப்படமே கெரீர் எதுகுதலகு அஸலைந ராஜமார்கமநி அருண் நிரூபிம்சாடு.",
            "teluguSub": "nijamaina viluvaina paniki saraina aadhaaraalatho gomthu vippadame kereer edugudalaku asalaina raajamaargamani arun niroopimchaadu.",
            "teluguScript": "నిజమైన విలువైన పనికి సరైన ఆధారాలతో గొంతు విప్పడమే కెరీర్ ఎదుగుదలకు అసలైన రాజమార్గమని అరుణ్ నిరూపించాడు.",
            "kannada": "ಸಾಕ್ಷ್ಯಾಧಾರಗಳೊಂದಿಗೆ ತನ್ನ ನೈಜ ಮೌಲ್ಯವನ್ನು ಪ್ರತಿಪಾದಿಸುವುದೇ ವೃತ್ತಿಜೀವನದ ಮುನ್ನಡೆಗೆ ಮೂಲ ಕೀಲಿ ಎಂಬುದನ್ನು ಅರುಣ್ ಸಾಬೀತುಪಡಿಸಿದನು.",
            "kannadaSpeak": "ஸாக்ஷ்யாதாரகளொம்திகெ தந்ந நைஜ மௌல்யவந்நு ப்ரதிபாதிஸுவுதே வ்ருத்திஜீவநத முந்நடெகெ மூல கீலி எம்புதந்நு அருண் ஸாபீதுபடிஸிதநு.",
            "kannadaSub": "saakshyaadhaaragalomdige thanna naija maulyavannu prathipaadisuvude vruththijeevanada munnadege moola keeli embudannu arun saabeethupadisidanu.",
            "kannadaScript": "ಸಾಕ್ಷ್ಯಾಧಾರಗಳೊಂದಿಗೆ ತನ್ನ ನೈಜ ಮೌಲ್ಯವನ್ನು ಪ್ರತಿಪಾದಿಸುವುದೇ ವೃತ್ತಿಜೀವನದ ಮುನ್ನಡೆಗೆ ಮೂಲ ಕೀಲಿ ಎಂಬುದನ್ನು ಅರುಣ್ ಸಾಬೀತುಪಡಿಸಿದನು.",
            "hindi": "अरुण ने सिद्ध कर दिया कि स्पष्टता और प्रमाणों के साथ अपने वास्तविक मूल्य को प्रस्तुत करना ही करियर की उन्नति की कुंजी है।",
            "hindiSpeak": "அருண நே ஸித்த கர தியா கி ஸ்பஷ்டதா ஔர ப்ரமாணோம் கே ஸாத அபநே வாஸ்தவிக மூல்ய கோ ப்ரஸ்துத கரநா ஹீ கரியர கீ உந்நதி கீ கும்ஜீ ஹை।",
            "hindiSub": "aruna ne siddha kara diyaa ki spashtathaa aura pramaanom ke saatha apane vaasthavika moolya ko prasthutha karanaa hee kariyara kee unnathi kee kumjee hai।",
            "hindiScript": "अरुण ने सिद्ध कर दिया कि स्पष्टता और प्रमाणों के साथ अपने वास्तविक मूल्य को प्रस्तुत करना ही करियर की उन्नति की कुंजी है।"
      }
],
      vocabComparison: [
        {
          normal: "Salary / Compensation",
          advanced: "Remuneration / Emolument",
          tamil: "ஊதியம் / ஊதியத்தொகை",
          telugu: "జీతం / వేతనం",
          teluguSpeak: "ஜீதம் / வேதநம்",
          kannada: "ವೇತನ / ಸಂಬಳ",
          kannadaSpeak: "வேதந / ஸம்பள",
          hindi: "वेतन / पारिश्रमिक",
          hindiSpeak: "வேதந / பாரிஶ்ரமிக",
          example: "Her remuneration reflected her senior expertise."
        },
        {
          normal: "Data-driven / Concrete",
          advanced: "Empirical / Incontrovertible",
          tamil: "நிரூபிக்கப்பட்ட / ஆதாரப்பூர்வ",
          telugu: "ఆధారాలతో కూడిన",
          teluguSpeak: "ஆதாராலதோ கூடிந",
          kannada: "ಸಾಕ್ಷ್ಯಾಧಾರಿತ",
          kannadaSpeak: "ஸாக்ஷ்யாதாரித",
          hindi: "तथ्यात्मक / ठोस",
          hindiSpeak: "தத்யாத்மக / டோஸ",
          example: "He supplied empirical evidence of project gains."
        },
        {
          normal: "Calm confidence",
          advanced: "Consummate poise",
          tamil: "நிறைவான நிதானம்",
          telugu: "ప్రశాంతమైన ఆత్మవిశ్వాసం",
          teluguSpeak: "ப்ரஶாம்தமைந ஆத்மவிஶ்வாஸம்",
          kannada: "ಶಾಂತ ಆತ್ಮವಿಶ್ವಾಸ",
          kannadaSpeak: "ஶாம்த ஆத்மவிஶ்வாஸ",
          hindi: "शांत आत्मविश्वास",
          hindiSpeak: "ஶாம்த ஆத்மவிஶ்வாஸ",
          example: "She handled the salary review with consummate poise."
        },
        {
          normal: "Approved / Confirmed",
          advanced: "Ratified / Sanctioned",
          tamil: "அங்கீகரிக்கப்பட்டது",
          telugu: "ఆమోదించబడింది",
          teluguSpeak: "ஆமோதிம்சபடிம்தி",
          kannada: "ಅಂಗೀಕರಿಸಲ್ಪಟ್ಟಿದೆ",
          kannadaSpeak: "அம்கீகரிஸல்பட்டிதெ",
          hindi: "स्वीकृत / अनुमोदित",
          hindiSpeak: "ஸ்வீக்ருத / அநுதோதித",
          example: "The board ratified the executive compensation package."
        }
      ],
      quiz: [
        { question: "What does 'remuneration' mean in Tamil?", options: ["பயணம்", "ஊதியம் / ஊதியத்தொகை", "பயிற்சி", "நிறுவனம்"], correct: 1, explanation: "'Remuneration' refers to money paid for work or a service (ஊதியம்)." },
        { question: "Which advanced adjective means 'based on observation or real data'?", options: ["Empirical", "Fictional", "Hazardous", "Trivial"], correct: 0, explanation: "'Empirical' means verifiable by observation, experience, or experiment rather than pure theory." },
        { question: "Why was the manager impressed during Arun's review?", options: ["Arun demanded anger", "Arun presented tangible cost savings and empirical metrics calmly", "Arun arrived late", "Arun spoke vaguely"], correct: 1, explanation: "Arun brought tangible data, documented achievements, and spoke with calm professionalism." },
        { question: "What does 'championing intrinsic worth' signify?", options: ["Underestimating oneself", "Advocating and proving one's genuine inherent value", "Complaining constantly", "Avoiding responsibility"], correct: 1, explanation: "It means confidently standing up for and proving the true value of your contributions." }
      ]
    };
  }

  // 5. FLIGHT / TRAVEL / AIRPORT / JOURNEY
  if (lower.includes("flight") || lower.includes("travel") || lower.includes("airport") || lower.includes("plane") || lower.includes("journey") || lower.includes("trip")) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "முதல் விமானப் பயணம்",
        normal: "The First Flight Milestone",
        advanced: "The Maiden Aerial Odyssey",
        telugu: "మొదటి విమాన ప్రయాణం",
        kannada: "ಮೊದಲ ವಿಮಾನ ಪ್ರಯಾಣ",
        hindi: "पहली हवाई यात्रा"
      },
      category: "Travel & Global Adventures",
      icon: "compass",
      readTime: "1.5 min read",
      summary: {
        tamil: "விமான நிலைய குழப்பங்களையும் அச்சங்களையும் தாண்டி, வானில் பறந்து புதிய பார்வையைப் பெற்ற ஒரு பயணியின் அனுபவம்.",
        normal: "An inspiring travel story about navigating airport anxieties on a first international flight and seeing the world from new heights.",
        advanced: "A vivid narrative chronicling the transcendence of airport trepidation and the sublime awakening of an inaugural aerial voyage.",
        telugu: "విమానాశ్రయ ఆందోళనలను అధిగమించి, ఆకాశంలో విహరిస్తూ ప్రపంచాన్ని సరికొత్త ఎత్తుల నుండి వీక్షించిన ఒక ప్రయాణికురాలి అనుభవం.",
        kannada: "ವಿಮಾನ ನಿಲ್ದಾಣದ ಅಳುಕನ್ನು ಮೀರಿ, ಆಕಾಶದಲ್ಲಿ ಹಾರುತ್ತಾ ಪ್ರಪಂಚವನ್ನು ಹೊಸ ಎತ್ತರದಿಂದ ವೀಕ್ಷಿಸಿದ ಪ್ರಯಾಣಿಕಳ ಅನುಭವ.",
        hindi: "हवाई अड्डे की घबराहट को पार कर आकाश की ऊँचाइयों से संसार को एक नई दृष्टि से देखने वाली यात्री का सुंदर अनुभव।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "பன்னாட்டு விமான நிலையத்தின் பிரம்மாண்டமான முனையத்தில் நின்றபோது நிலாவுக்குள் ஒரு மெல்லிய நடுக்கம் ஏற்பட்டது.",
            "normal": "Standing in the magnificent terminal of the international airport, Nila felt a slight flutter of nervousness.",
            "advanced": "Positioned amidst the cavernous international terminal, Nila experienced an ephemeral flutter of visceral apprehension.",
            "vocab": [
                  {
                        "normal": "magnificent terminal",
                        "advanced": "cavernous terminal",
                        "tamil": "பிரம்மாண்ட முனையம்"
                  },
                  {
                        "normal": "slight nervousness",
                        "advanced": "visceral apprehension",
                        "tamil": "உள்மன நடுக்கம்"
                  }
            ],
            "telugu": "అంతర్జాతీయ విమానాశ్రయం యొక్క భారీ టెర్మినల్‌లో నిలబడినప్పుడు నిలాలో ఒక చిన్నపాటి ఆందోళన మొదలైంది.",
            "teluguSpeak": "அம்தர்ஜாதீய விமாநாஶ்ரயம் யொக்க பாரீ டெர்மிநல்‌லோ நிலபடிநப்புடு நிலாலோ ஒக சிந்நபாடி ஆம்தோளந மொதலைம்தி.",
            "teluguSub": "amtharjaatheeya vimaanaashrayam yokka bhaaree terminal‌lo nilabadinappudu nilaalo oka chinnapaati aamdolana modalaimdi.",
            "teluguScript": "అంతర్జాతీయ విమానాశ్రయం యొక్క భారీ టెర్మినల్‌లో నిలబడినప్పుడు నిలాలో ఒక చిన్నపాటి ఆందోళన మొదలైంది.",
            "kannada": "ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣದ ಬೃಹತ್ ಟರ್ಮಿನಲ್‌ನಲ್ಲಿ ನಿಂತಾಗ ನೀಲಾಳಿಗೆ ಸಣ್ಣ ಅಳುಕು ಉಂಟಾಯಿತು.",
            "kannadaSpeak": "அம்தரராஷ்ட்ரீய விமாந நில்தாணத ப்ருஹத் டர்மிநல்‌நல்லி நிம்தாக நீலாளிகெ ஸண்ண அளுகு உம்டாயிது.",
            "kannadaSub": "amthararaashtreeya vimaana nildaanada bruhath tarminal‌nalli nimthaaga neelaalige sanna aluku umtaayithu.",
            "kannadaScript": "ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿಮಾನ ನಿಲ್ದಾಣದ ಬೃಹತ್ ಟರ್ಮಿನಲ್‌ನಲ್ಲಿ ನಿಂತಾಗ ನೀಲಾಳಿಗೆ ಸಣ್ಣ ಅಳುಕು ಉಂಟಾಯಿತು.",
            "hindi": "अंतर्राष्ट्रीय हवाई अड्डे के विशाल टर्मिनल में खड़े होकर नीला के मन में एक हल्की सी घबराहट हुई।",
            "hindiSpeak": "அம்தர்ராஷ்ட்ரீய ஹவாஈ அட்டே கே விஶால டர்மிநல மேம் கட़ே ஹோகர நீலா கே மந மேம் ஏக ஹல்கீ ஸீ கபராஹட ஹுஈ।",
            "hindiSub": "amtharraashtreeya havaaee adde ke vishaala tarminala mem khada़e hokara neelaa ke mana mem eka halkee see ghabaraahata huee।",
            "hindiScript": "अंतर्राष्ट्रीय हवाई अड्डे के विशाल टर्मिनल में खड़े होकर नीला के मन में एक हल्की सी घबराहट हुई।"
      },
      {
            "num": 2,
            "tamil": "இது அவளது வாழ்க்கையின் முதல் விமானப் பயணம் என்பதால், போர்டிங் பாஸ் மற்றும் பாதுகாப்பு சோதனைகள் புதியதாக இருந்தன.",
            "normal": "Because this was her first flight ever, the boarding pass procedures and security checkpoints felt foreign.",
            "advanced": "As this inaugurated her maiden aerial expedition, boarding protocols and security screening appeared alien.",
            "vocab": [
                  {
                        "normal": "first flight",
                        "advanced": "maiden aerial expedition",
                        "tamil": "முதல் விமானப் பயணம்"
                  },
                  {
                        "normal": "security checkpoints",
                        "advanced": "security screening protocols",
                        "tamil": "பாதுகாப்பு சோதனைகள்"
                  }
            ],
            "telugu": "ఇది ఆమె జీవితంలో మొట్టమొదటి విమాన ప్రయాణం కావడంతో, బోర్డింగ్ పాస్ మరియు భద్రతా తనిఖీలు కొత్తగా అనిపించాయి.",
            "teluguSpeak": "இதி ஆமெ ஜீவிதம்லோ மொட்டமொதடி விமாந ப்ரயாணம் காவடம்தோ, போர்டிம்க் பாஸ் மரியு பத்ரதா தநிகீலு கொத்தகா அநிபிம்சாயி.",
            "teluguSub": "idi aame jeevithamlo mottamodati vimaana prayaanam kaavadamtho, bordimg paas mariyu bhadrathaa thanikheelu koththagaa anipimchaayi.",
            "teluguScript": "ఇది ఆమె జీవితంలో మొట్టమొదటి విమాన ప్రయాణం కావడంతో, బోర్డింగ్ పాస్ మరియు భద్రతా తనిఖీలు కొత్తగా అనిపించాయి.",
            "kannada": "ಇದು ಅವಳ ಜೀವನದ ಮೊದಲ ವಿಮಾನ ಪ್ರಯಾಣವಾಗಿದ್ದರಿಂದ, ಬೋರ್ಡಿಂಗ್ ಪಾಸ್ ಮತ್ತು ಭದ್ರತಾ ತಪಾಸಣೆಗಳು ಹೊಸದಾಗಿದ್ದವು.",
            "kannadaSpeak": "இது அவள ஜீவநத மொதல விமாந ப்ரயாணவாகித்தரிம்த, போர்டிம்க் பாஸ் மத்து பத்ரதா தபாஸணெகளு ஹொஸதாகித்தவு.",
            "kannadaSub": "idu avala jeevanada modala vimaana prayaanavaagiddarimda, bordimg paas maththu bhadrathaa thapaasanegalu hosadaagiddavu.",
            "kannadaScript": "ಇದು ಅವಳ ಜೀವನದ ಮೊದಲ ವಿಮಾನ ಪ್ರಯಾಣವಾಗಿದ್ದರಿಂದ, ಬೋರ್ಡಿಂಗ್ ಪಾಸ್ ಮತ್ತು ಭದ್ರತಾ ತಪಾಸಣೆಗಳು ಹೊಸದಾಗಿದ್ದವು.",
            "hindi": "क्योंकि यह उसके जीवन की पहली हवाई यात्रा थी, बोर्डिंग पास की प्रक्रिया और सुरक्षा जाँच उसके लिए बिल्कुल नई थी।",
            "hindiSpeak": "க்யோம்கி யஹ உஸகே ஜீவந கீ பஹலீ ஹவாஈ யாத்ரா தீ, போர்டிம்க பாஸ கீ ப்ரக்ரியா ஔர ஸுரக்ஷா ஜாँச உஸகே லிஏ பில்குல நஈ தீ।",
            "hindiSub": "kyomki yaha usake jeevana kee pahalee havaaee yaathraa thee, bordimga paasa kee prakriyaa aura surakshaa jaaँcha usake lie bilkula naee thee।",
            "hindiScript": "क्योंकि यह उसके जीवन की पहली हवाई यात्रा थी, बोर्डिंग पास की प्रक्रिया और सुरक्षा जाँच उसके लिए बिल्कुल नई थी।"
      },
      {
            "num": 3,
            "tamil": "ஆனால் பதற்றமடையாமல், தகவல் பலகைகளை கவனமாக கவனித்து தனது கேட்டை நோக்கி நிதானமாக நடந்தாள்.",
            "normal": "However, refusing to panic, she observed the digital flight monitors attentively and walked calmly toward her gate.",
            "advanced": "Resisting agitation, she scrutinized the flight monitors attentively and progressed purposefully toward her departure gate.",
            "vocab": [
                  {
                        "normal": "walked calmly",
                        "advanced": "progressed purposefully",
                        "tamil": "நிதானமாக நடந்தார்"
                  },
                  {
                        "normal": "observed attentively",
                        "advanced": "scrutinized attentively",
                        "tamil": "கவனமாக கவனித்தார்"
                  }
            ],
            "telugu": "కానీ ఆందోళన చెందకుండా, డిజిటల్ ఫ్లైట్ మానిటర్లను శ్రద్ధగా గమనిస్తూ తన గేట్ వైపు ప్రశాంతంగా నడిచింది.",
            "teluguSpeak": "காநீ ஆம்தோளந செம்தகும்டா, டிஜிடல் ப்லைட் மாநிடர்லநு ஶ்ரத்தகா கமநிஸ்தூ தந கேட் வைபு ப்ரஶாம்தம்கா நடிசிம்தி.",
            "teluguSub": "kaanee aamdolana chemdakumdaa, dijital phlait maanitarlanu shraddhagaa gamanisthoo thana get vaipu prashaamthamgaa nadichimdi.",
            "teluguScript": "కానీ ఆందోళన చెందకుండా, డిజిటల్ ఫ్లైట్ మానిటర్లను శ్రద్ధగా గమనిస్తూ తన గేట్ వైపు ప్రశాంతంగా నడిచింది.",
            "kannada": "ಆದರೆ ಗಾಬರಿಯಾಗದೆ, ಡಿಜಿಟಲ್ ಫ್ಲೈಟ್ ಪರದೆಗಳನ್ನು ಗಮನಿಸುತ್ತಾ ತನ್ನ ಗೇಟ್‌ನತ್ತ ಶಾಂತವಾಗಿ ಸಾಗಿದಳು.",
            "kannadaSpeak": "ஆதரெ காபரியாகதெ, டிஜிடல் ப்லைட் பரதெகளந்நு கமநிஸுத்தா தந்ந கேட்‌நத்த ஶாம்தவாகி ஸாகிதளு.",
            "kannadaSub": "aadare gaabariyaagade, dijital phlait paradegalannu gamanisuththaa thanna get‌naththa shaamthavaagi saagidalu.",
            "kannadaScript": "ಆದರೆ ಗಾಬರಿಯಾಗದೆ, ಡಿಜಿಟಲ್ ಫ್ಲೈಟ್ ಪರದೆಗಳನ್ನು ಗಮನಿಸುತ್ತಾ ತನ್ನ ಗೇಟ್‌ನತ್ತ ಶಾಂತವಾಗಿ ಸಾಗಿದಳು.",
            "hindi": "किंतु घबराने के बजाय उसने डिजिटल सूचना पट्टों को ध्यान से देखा और शांत भाव से अपने प्रस्थान द्वार की ओर बढ़ी।",
            "hindiSpeak": "கிம்து கபராநே கே பஜாய உஸநே டிஜிடல ஸூசநா பட்டோம் கோ த்யாந ஸே தேகா ஔர ஶாம்த பாவ ஸே அபநே ப்ரஸ்தாந த்வார கீ ஓர பட़ீ।",
            "hindiSub": "kimthu ghabaraane ke bajaaya usane dijitala soochanaa pattom ko dhyaana se dekhaa aura shaamtha bhaava se apane prasthaana dvaara kee ora badha़ee।",
            "hindiScript": "किंतु घबराने के बजाय उसने डिजिटल सूचना पट्टों को ध्यान से देखा और शांत भाव से अपने प्रस्थान द्वार की ओर बढ़ी।"
      },
      {
            "num": 4,
            "tamil": "விமானத்தின் ஜன்னல் இருக்கையில் அமர்ந்தபோது, என்ஜின்களின் கர்ஜனை அவளது இதயத் துடிப்பை எகிற வைத்தது.",
            "normal": "Sitting in her window seat, the powerful roar of the jet engines made her heart pound rapidly.",
            "advanced": "Settling into her fenestral seat, the sonorous crescendo of the turbine engines accelerated her pulse.",
            "vocab": [
                  {
                        "normal": "window seat",
                        "advanced": "fenestral seat",
                        "tamil": "ஜன்னலோர இருக்கை"
                  },
                  {
                        "normal": "powerful roar",
                        "advanced": "sonorous crescendo",
                        "tamil": "முழங்கும் இரைச்சல்"
                  }
            ],
            "telugu": "విమానంలో కిటికీ పక్కన సీట్లో కూర్చున్నప్పుడు, జెట్ ఇంజిన్ల గర్జన ఆమె గుండె వేగాన్ని పెంచింది.",
            "teluguSpeak": "விமாநம்லோ கிடிகீ பக்கந ஸீட்லோ கூர்சுந்நப்புடு, ஜெட் இம்ஜிந்ல கர்ஜந ஆமெ கும்டெ வேகாந்நி பெம்சிம்தி.",
            "teluguSub": "vimaanamlo kitikee pakkana seetlo koorchunnappudu, jet imjinla garjana aame gumde vegaanni pemchimdi.",
            "teluguScript": "విమానంలో కిటికీ పక్కన సీట్లో కూర్చున్నప్పుడు, జెట్ ఇంజిన్ల గర్జన ఆమె గుండె వేగాన్ని పెంచింది.",
            "kannada": "ವಿಮಾನದ ಕಿಟಕಿಯ ಸೀಟಿನಲ್ಲಿ ಕುಳಿತಾಗ, ಜೆಟ್ ಎಂಜಿನ್‌ಗಳ ಘರ್ಜನೆ ಅವಳ ಹೃದಯ ಬಡಿತವನ್ನು ಹೆಚ್ಚಿಸಿತು.",
            "kannadaSpeak": "விமாநத கிடகிய ஸீடிநல்லி குளிதாக, ஜெட் எம்ஜிந்‌கள கர்ஜநெ அவள ஹ்ருதய படிதவந்நு ஹெச்சிஸிது.",
            "kannadaSub": "vimaanada kitakiya seetinalli kulithaaga, jet emjin‌gala gharjane avala hrudaya badithavannu hechchisithu.",
            "kannadaScript": "ವಿಮಾನದ ಕಿಟಕಿಯ ಸೀಟಿನಲ್ಲಿ ಕುಳಿತಾಗ, ಜೆಟ್ ಎಂಜಿನ್‌ಗಳ ಘರ್ಜನೆ ಅವಳ ಹೃದಯ ಬಡಿತವನ್ನು ಹೆಚ್ಚಿಸಿತು.",
            "hindi": "खिड़की वाली सीट पर बैठते ही जेट इंजनों की गड़गड़ाहट ने उसके दिल की धड़कनें तेज कर दीं।",
            "hindiSpeak": "கிட़கீ வாலீ ஸீட பர பைடதே ஹீ ஜேட இம்ஜநோம் கீ கட़கட़ாஹட நே உஸகே தில கீ தட़கநேம் தேஜ கர தீம்।",
            "hindiSub": "khida़kee vaalee seeta para baithathe hee jeta imjanom kee gada़gada़aahata ne usake dila kee dhada़kanem theja kara deem।",
            "hindiScript": "खिड़की वाली सीट पर बैठते ही जेट इंजनों की गड़गड़ाहट ने उसके दिल की धड़कनें तेज कर दीं।"
      },
      {
            "num": 5,
            "tamil": "விமானம் ஓடுபாதையிலிருந்து வானத்தை நோக்கி பாய்ந்த தருணம், அவளது பயம் அனைத்தும் வியப்பாக மாறியது.",
            "normal": "The moment the aircraft ascended swiftly off the runway into the sky, all her fear dissolved into pure wonder.",
            "advanced": "The juncture the aircraft severed terrestrial ties and surged skyward, her trepidation dissolved into unadulterated awe.",
            "vocab": [
                  {
                        "normal": "ascended swiftly",
                        "advanced": "surged skyward",
                        "tamil": "வானோக்கி பாய்ந்தது"
                  },
                  {
                        "normal": "pure wonder",
                        "advanced": "unadulterated awe",
                        "tamil": "தூய வியப்பு"
                  }
            ],
            "telugu": "విమానం రన్‌వే పైనుంచి ఆకాశంలోకి దూసుకెళ్లిన క్షణంలో, ఆమె భయమంతా అద్భుతమైన ఆశ్చర్యంగా మారిపోయింది.",
            "teluguSpeak": "விமாநம் ரந்‌வே பைநும்சி ஆகாஶம்லோகி தூஸுகெள்லிந க்ஷணம்லோ, ஆமெ பயமம்தா அத்புதமைந ஆஶ்சர்யம்கா மாரிபோயிம்தி.",
            "teluguSub": "vimaanam ran‌ve painumchi aakaashamloki doosukellina kshanamlo, aame bhayamamthaa adbhuthamaina aashcharyamgaa maaripoyimdi.",
            "teluguScript": "విమానం రన్‌వే పైనుంచి ఆకాశంలోకి దూసుకెళ్లిన క్షణంలో, ఆమె భయమంతా అద్భుతమైన ఆశ్చర్యంగా మారిపోయింది.",
            "kannada": "ವಿಮಾನವು ರನ್‌ವೇಯಿಂದ ಆಕಾಶಕ್ಕೆ ಹಾರಿದ ಕ್ಷಣ, ಅವಳ ಭಯವೆಲ್ಲಾ ಶುದ್ಧ ವಿಸ್ಮಯವಾಗಿ ಮಾರ್ಪಟ್ಟಿತು.",
            "kannadaSpeak": "விமாநவு ரந்‌வேயிம்த ஆகாஶக்கெ ஹாரித க்ஷண, அவள பயவெல்லா ஶுத்த விஸ்மயவாகி மார்பட்டிது.",
            "kannadaSub": "vimaanavu ran‌veyimda aakaashakke haarida kshana, avala bhayavellaa shuddha vismayavaagi maarpattithu.",
            "kannadaScript": "ವಿಮಾನವು ರನ್‌ವೇಯಿಂದ ಆಕಾಶಕ್ಕೆ ಹಾರಿದ ಕ್ಷಣ, ಅವಳ ಭಯವೆಲ್ಲಾ ಶುದ್ಧ ವಿಸ್ಮಯವಾಗಿ ಮಾರ್ಪಟ್ಟಿತು.",
            "hindi": "जिस क्षण विमान ने रनवे छोड़कर आकाश की ओर उड़ान भरी, उसका सारा डर एक अलौकिक विस्मय में बदल गया।",
            "hindiSpeak": "ஜிஸ க்ஷண விமாந நே ரநவே சோட़கர ஆகாஶ கீ ஓர உட़ாந பரீ, உஸகா ஸாரா டர ஏக அலௌகிக விஸ்மய மேம் பதல கயா।",
            "hindiSub": "jisa kshana vimaana ne ranave chhoda़kara aakaasha kee ora uda़aana bharee, usakaa saaraa dara eka alaukika vismaya mem badala gayaa।",
            "hindiScript": "जिस क्षण विमान ने रनवे छोड़कर आकाश की ओर उड़ान भरी, उसका सारा डर एक अलौकिक विस्मय में बदल गया।"
      },
      {
            "num": 6,
            "tamil": "மேகங்களுக்கு மேலே பொன்னிற சூரிய ஒளி பரவியிருந்த காட்சி, பூமியின் எந்த ஓவியத்தையும் விட பேரழகாகத் தெரிந்தது.",
            "normal": "Gliding above the fluffy clouds, the golden sunlight looked far more breathtaking than any painting on earth.",
            "advanced": "Suspended above cotton-textured stratus clouds, the radiant sunlight surpassed any terrestrial masterpiece.",
            "vocab": [
                  {
                        "normal": "breathtaking",
                        "advanced": "surpassed terrestrial masterpieces",
                        "tamil": "வியக்கத்தக்க அழகு"
                  },
                  {
                        "normal": "fluffy clouds",
                        "advanced": "stratus cloudscape",
                        "tamil": "வெண் மேகக் கூட்டம்"
                  }
            ],
            "telugu": "దూదిలాంటి మేఘాల పైనుంచి ప్రసరిస్తున్న బంగారు సూర్యకాంతి భూమిపై ఏ చిత్రకళ కంటే కూడా అత్యద్భుతంగా కనిపించింది.",
            "teluguSpeak": "தூதிலாம்டி மேகால பைநும்சி ப்ரஸரிஸ்துந்ந பம்காரு ஸூர்யகாம்தி பூமிபை ஏ சித்ரகள கம்டே கூடா அத்யத்புதம்கா கநிபிம்சிம்தி.",
            "teluguSub": "doodilaamti meghaala painumchi prasaristhunna bamgaaru sooryakaamthi bhoomipai e chithrakala kamte koodaa athyadbhuthamgaa kanipimchimdi.",
            "teluguScript": "దూదిలాంటి మేఘాల పైనుంచి ప్రసరిస్తున్న బంగారు సూర్యకాంతి భూమిపై ఏ చిత్రకళ కంటే కూడా అత్యద్భుతంగా కనిపించింది.",
            "kannada": "ಹತ್ತಿಯಂಥ ಮೋಡಗಳ ಮೇಲೆ ತೇಲುವಾಗ ಹೊಂಬಣ್ಣದ ಸೂರ್ಯನ ಬೆಳಕು ಭೂಮಿಯ ಯಾವುದೇ ವರ್ಣಚಿತ್ರಕ್ಕಿಂತ ಸುಂದರವಾಗಿತ್ತು.",
            "kannadaSpeak": "ஹத்தியம்த மோடகள மேலெ தேலுவாக ஹொம்பண்ணத ஸூர்யந பெளகு பூமிய யாவுதே வர்ணசித்ரக்கிம்த ஸும்தரவாகித்து.",
            "kannadaSub": "haththiyamtha modagala mele theluvaaga hombannada sooryana belaku bhoomiya yaavude varnachithrakkimtha sumdaravaagiththu.",
            "kannadaScript": "ಹತ್ತಿಯಂಥ ಮೋಡಗಳ ಮೇಲೆ ತೇಲುವಾಗ ಹೊಂಬಣ್ಣದ ಸೂರ್ಯನ ಬೆಳಕು ಭೂಮಿಯ ಯಾವುದೇ ವರ್ಣಚಿತ್ರಕ್ಕಿಂತ ಸುಂದರವಾಗಿತ್ತು.",
            "hindi": "रुई जैसे बादलों के ऊपर तैरते हुए सुनहरी धूप का दृश्य धरती के किसी भी चित्र से कहीं अधिक मनमोहक था।",
            "hindiSpeak": "ருஈ ஜைஸே பாதலோம் கே ஊபர தைரதே ஹுஏ ஸுநஹரீ தூப கா த்ருஶ்ய தரதீ கே கிஸீ பீ சித்ர ஸே கஹீம் அதிக மநமோஹக தா।",
            "hindiSub": "ruee jaise baadalom ke oopara thairathe hue sunaharee dhoopa kaa drushya dharathee ke kisee bhee chithra se kaheem adhika manamohaka thaa।",
            "hindiScript": "रुई जैसे बादलों के ऊपर तैरते हुए सुनहरी धूप का दृश्य धरती के किसी भी चित्र से कहीं अधिक मनमोहक था।"
      },
      {
            "num": 7,
            "tamil": "கீழே தெரிந்த வீடுகளும் மலைகளும் மிகச் சிறிய புள்ளிகளாகத் தோன்றின, அது அவளுக்கு வாழ்க்கையின் புதிய பரிமாணத்தை உணர்த்தியது.",
            "normal": "Looking at the tiny towns below, she realized that our worldly worries are remarkably small from a higher altitude.",
            "advanced": "Surveying the diminutive hamlets far below, she perceived that human anxieties dwindle into insignificance from lofty altitudes.",
            "vocab": [
                  {
                        "normal": "higher altitude",
                        "advanced": "lofty altitudes",
                        "tamil": "உயர்ந்த உச்சி"
                  },
                  {
                        "normal": "worries become small",
                        "advanced": "anxieties dwindle",
                        "tamil": "கவலைகள் குறைதல்"
                  }
            ],
            "telugu": "క్రింద కనిపిస్తున్న చిన్న ఊళ్లను చూస్తూ, ఎత్తైన స్థానం నుండి చూసినప్పుడు మన లౌకిక చింతలు ఎంత చిన్నవిగా ఉంటాయో ఆమె గ్రహించింది.",
            "teluguSpeak": "க்ரிம்த கநிபிஸ்துந்ந சிந்ந ஊள்லநு சூஸ்தூ, எத்தைந ஸ்தாநம் நும்டி சூஸிநப்புடு மந லௌகிக சிம்தலு எம்த சிந்நவிகா உம்டாயோ ஆமெ க்ரஹிம்சிம்தி.",
            "teluguSub": "krimda kanipisthunna chinna oollanu choosthoo, eththaina sthaanam numdi choosinappudu mana laukika chimthalu emtha chinnavigaa umtaayo aame grahimchimdi.",
            "teluguScript": "క్రింద కనిపిస్తున్న చిన్న ఊళ్లను చూస్తూ, ఎత్తైన స్థానం నుండి చూసినప్పుడు మన లౌకిక చింతలు ఎంత చిన్నవిగా ఉంటాయో ఆమె గ్రహించింది.",
            "kannada": "ಕೆಳಗಿನ ಸಣ್ಣ ಪಟ್ಟಣಗಳನ್ನು ನೋಡಿದಾಗ, ಎತ್ತರದಿಂದ ನೋಡಿದಾಗ ನಮ್ಮ ಲೌಕಿಕ ಚಿಂತೆಗಳು ಎಷ್ಟು ಸಣ್ಣವೆಂದು ಅವಳಿಗೆ ತಿಳಿಯಿತು.",
            "kannadaSpeak": "கெளகிந ஸண்ண பட்டணகளந்நு நோடிதாக, எத்தரதிம்த நோடிதாக நம்ம லௌகிக சிம்தெகளு எஷ்டு ஸண்ணவெம்து அவளிகெ திளியிது.",
            "kannadaSub": "kelagina sanna pattanagalannu nodidaaga, eththaradimda nodidaaga namma laukika chimthegalu eshtu sannavemdu avalige thiliyithu.",
            "kannadaScript": "ಕೆಳಗಿನ ಸಣ್ಣ ಪಟ್ಟಣಗಳನ್ನು ನೋಡಿದಾಗ, ಎತ್ತರದಿಂದ ನೋಡಿದಾಗ ನಮ್ಮ ಲೌಕಿಕ ಚಿಂತೆಗಳು ಎಷ್ಟು ಸಣ್ಣವೆಂದು ಅವಳಿಗೆ ತಿಳಿಯಿತು.",
            "hindi": "नीचे के छोटे-छोटे शहरों को देखकर उसे आभास हुआ कि ऊँचाई से देखने पर हमारी सांसारिक चिंताएँ कितनी तुच्छ हो जाती हैं।",
            "hindiSpeak": "நீசே கே சோடே-சோடே ஶஹரோம் கோ தேககர உஸே ஆபாஸ ஹுஆ கி ஊँசாஈ ஸே தேகநே பர ஹமாரீ ஸாம்ஸாரிக சிம்தாஏँ கிதநீ துச்ச ஹோ ஜாதீ ஹைம்।",
            "hindiSub": "neeche ke chhote-chhote shaharom ko dekhakara use aabhaasa huaa ki ooँchaaee se dekhane para hamaaree saamsaarika chimthaaeँ kithanee thuchchha ho jaathee haim।",
            "hindiScript": "नीचे के छोटे-छोटे शहरों को देखकर उसे आभास हुआ कि ऊँचाई से देखने पर हमारी सांसारिक चिंताएँ कितनी तुच्छ हो जाती हैं।"
      },
      {
            "num": 8,
            "tamil": "பயங்களை கடந்து எல்லைகளை விரிவுபடுத்துவதே மனித ஆன்மாவின் உண்மையான சுதந்திரம் என்று அவள் மனதார உணர்ந்தாள்.",
            "normal": "She understood that confronting our fears and expanding our horizons is the true essence of human freedom.",
            "advanced": "She discerned that conquering internal anxieties and broadening horizons constitutes the quintessential essence of liberation.",
            "vocab": [
                  {
                        "normal": "true essence",
                        "advanced": "quintessential essence",
                        "tamil": "உண்மையான சாராம்சம்"
                  },
                  {
                        "normal": "expanding horizons",
                        "advanced": "broadening horizons",
                        "tamil": "எல்லைகளை விரிவுபடுத்துதல்"
                  }
            ],
            "telugu": "భయాలను అధిగమించి సరిహద్దులను విస్తరించడమే మానవ స్వేచ్ఛ యొక్క నిజమైన అంతఃసారం అని ఆమె గ్రహించింది.",
            "teluguSpeak": "பயாலநு அதிகமிம்சி ஸரிஹத்துலநு விஸ்தரிம்சடமே மாநவ ஸ்வேச்ச யொக்க நிஜமைந அம்தஹ்ஸாரம் அநி ஆமெ க்ரஹிம்சிம்தி.",
            "teluguSub": "bhayaalanu adhigamimchi sarihaddulanu vistharimchadame maanava svechchha yokka nijamaina amthahsaaram ani aame grahimchimdi.",
            "teluguScript": "భయాలను అధిగమించి సరిహద్దులను విస్తరించడమే మానవ స్వేచ్ఛ యొక్క నిజమైన అంతఃసారం అని ఆమె గ్రహించింది.",
            "kannada": "ಭಯಗಳನ್ನು ಎದುರಿಸಿ ನಮ್ಮ ಪರಿಧಿಯನ್ನು ವಿಸ್ತರಿಸುವುದೇ ನಿಜವಾದ ಸ್ವಾತಂತ್ರ್ಯದ ತಿರುಳು ಎಂದು ಅವಳು ಅರಿತಳು.",
            "kannadaSpeak": "பயகளந்நு எதுரிஸி நம்ம பரிதியந்நு விஸ்தரிஸுவுதே நிஜவாத ஸ்வாதம்த்ர்யத திருளு எம்து அவளு அரிதளு.",
            "kannadaSub": "bhayagalannu edurisi namma paridhiyannu vistharisuvude nijavaada svaathamthryada thirulu emdu avalu arithalu.",
            "kannadaScript": "ಭಯಗಳನ್ನು ಎದುರಿಸಿ ನಮ್ಮ ಪರಿಧಿಯನ್ನು ವಿಸ್ತರಿಸುವುದೇ ನಿಜವಾದ ಸ್ವಾತಂತ್ರ್ಯದ ತಿರುಳು ಎಂದು ಅವಳು ಅರಿತಳು.",
            "hindi": "उसने जाना कि अपने भयों का सामना कर सीमाओं का विस्तार करना ही मानवीय स्वतंत्रता का वास्तविक सार है।",
            "hindiSpeak": "உஸநே ஜாநா கி அபநே பயோம் கா ஸாமநா கர ஸீமாஓம் கா விஸ்தார கரநா ஹீ மாநவீய ஸ்வதம்த்ரதா கா வாஸ்தவிக ஸார ஹை।",
            "hindiSub": "usane jaanaa ki apane bhayom kaa saamanaa kara seemaaom kaa visthaara karanaa hee maanaveeya svathamthrathaa kaa vaasthavika saara hai।",
            "hindiScript": "उसने जाना कि अपने भयों का सामना कर सीमाओं का विस्तार करना ही मानवीय स्वतंत्रता का वास्तविक सार है।"
      }
],
      vocabComparison: [
        {
          normal: "First flight",
          advanced: "Maiden aerial voyage",
          tamil: "முதல் விமானப் பயணம்",
          telugu: "మొదటి విమానం",
          teluguSpeak: "மொதடி விமாநம்",
          kannada: "ಮೊದಲ ವಿಮಾನ",
          kannadaSpeak: "மொதல விமாந",
          hindi: "पहली उड़ान",
          hindiSpeak: "பஹலீ உட़ாந",
          example: "Her maiden aerial voyage broadened her world view."
        },
        {
          normal: "Pure wonder",
          advanced: "Unadulterated awe",
          tamil: "தூய வியப்பு",
          telugu: "స్వచ్ఛమైన అద్భుతం",
          teluguSpeak: "ஸ்வச்சமைந அத்புதம்",
          kannada: "ಶುದ್ಧ ವಿಸ್ಮಯ",
          kannadaSpeak: "ஶுத்த விஸ்மய",
          hindi: "शुद्ध आश्चर्य",
          hindiSpeak: "ஶுத்த ஆஶ்சர்ய",
          example: "The sunrise filled the travelers with unadulterated awe."
        },
        {
          normal: "Become small / Shrink",
          advanced: "Dwindle into insignificance",
          tamil: "சிறிதாகுதல்",
          telugu: "చిన్నగా / కుదించు",
          teluguSpeak: "சிந்நகா / குதிம்சு",
          kannada: "ಚಿಕ್ಕದಾಗು / ಕುಗ್ಗಿಸು",
          kannadaSpeak: "சிக்கதாகு / குக்கிஸு",
          hindi: "छोटा हो जाना / सिकुड़ जाना",
          hindiSpeak: "சோடா ஹோ ஜாநா / ஸிகுட़ ஜாநா",
          example: "Petty disagreements dwindled into insignificance."
        },
        {
          normal: "Freedom / Liberation",
          advanced: "Quintessential liberation",
          tamil: "மெய்யான விடுதலை",
          telugu: "స్వేచ్ఛ / విముక్తి",
          teluguSpeak: "ஸ்வேச்ச / விமுக்தி",
          kannada: "ಸ್ವಾತಂತ್ರ್ಯ / ವಿಮೋಚನೆ",
          kannadaSpeak: "ஸ்வாதம்த்ர்ய / விமோசநெ",
          hindi: "आज़ादी/मुक्ति",
          hindiSpeak: "ஆஜ़ாதீ/முக்தி",
          example: "Facing fear is the path to quintessential liberation."
        }
      ],
      quiz: [
        { question: "What is the meaning of 'unadulterated awe' in Tamil?", options: ["பயங்கரமான வலி", "கலப்பற்ற தூய வியப்பு / பிரம்மிப்பு", "சலிப்பு", "தூக்கம்"], correct: 1, explanation: "'Unadulterated awe' means pure, complete, and unmixed wonder or admiration (கலப்பற்ற வியப்பு)." },
        { question: "Which advanced phrase refers to a first flight?", options: ["Subsequent commute", "Maiden aerial expedition", "Terrestrial descent", "Pedestrian stroll"], correct: 1, explanation: "'Maiden aerial expedition' denotes an inaugural or first flight journey." },
        { question: "How did Nila respond to the complex airport terminals?", options: ["Cried loudly", "Scrutinized the monitors and walked calmly toward her gate", "Left the airport", "Cancelled the ticket"], correct: 1, explanation: "She remained composed, checked monitors attentively, and walked purposefully." },
        { question: "What philosophical lesson did Nila realize high above the clouds?", options: ["Flying is boring", "Anxieties dwindle when viewed from a broader, higher perspective", "Stay at home always", "Clouds are dangerous"], correct: 1, explanation: "She realized earthly problems seem smaller when viewed from higher, broader horizons." }
      ]
    };
  }

  // 6. PROCRASTINATION / HABIT / FOCUS / MORNING / DISCIPLINE
  if (lower.includes("procrastination") || lower.includes("habit") || lower.includes("focus") || lower.includes("morning") || lower.includes("discipline") || lower.includes("lazy")) {
    return {
      id: safeId,
      isAi: true,
      source: "ai",
      title: {
        tamil: "தள்ளிப்போடும் பழக்கத்தை வெல்லுதல்",
        normal: "Overcoming Procrastination",
        advanced: "Conquering Habitual Procrastination",
        telugu: "వాయిదా వేసే అలవాటును జయించడం",
        kannada: "ಮುಂದೂಡುವ ಅಭ್ಯಾಸವನ್ನು ಜಯಿಸುವುದು",
        hindi: "टालमटोल की आदत पर विजय"
      },
      category: "Inspiration & Wisdom",
      icon: "sparkles",
      readTime: "1.5 min read",
      summary: {
        tamil: "முக்கியமான வேலைகளை தள்ளிப்போடும் பழக்கத்திலிருந்து விடுபட்டு, ஐந்து நிமிட விதியால் வெற்றிகண்ட ஒரு இளைஞனின் கதை.",
        normal: "A transformative story about breaking free from endless delay by using the 5-minute rule and rediscovering productive momentum.",
        advanced: "A pragmatic discourse elucidating how micro-commitments and focused discipline dismantle chronic procrastination.",
        telugu: "ముఖ్యమైన పనులను వాయిదా వేసే అలవాటు నుండి బయటపడి, ఐదు నిమిషాల నియమంతో విజయం సాధించిన ఒక యువకుడి కథ.",
        kannada: "ಮುಖ್ಯವಾದ ಕೆಲಸಗಳನ್ನು ಮುಂದೂಡುವ ಚಾಳಿಯಿಂದ ಮುಕ್ತವಾಗಿ, ಐದು ನಿಮಿಷಗಳ ನಿಯಮದಿಂದ ಗೆಲುವು ಸಾಧಿಸಿದ ಯುವಕನ ಕಥೆ.",
        hindi: "महत्वपूर्ण कार्यों को टालने की आदत से छुटकारा पाकर पाँच मिनट के नियम से सफलता पाने वाले एक युवक की प्रेरक कथा।"
      },
      lines: [
      {
            "num": 1,
            "tamil": "கவின் பல வாரங்களாக தனது முக்கியமான புத்தகத்தை எழுதத் தொடங்காமல் ஒவ்வொரு நாளும் தள்ளிப்போட்டு வந்தான்.",
            "normal": "For many weeks, Kavin kept postponing his dream book project, never actually writing the first page.",
            "advanced": "For protracted weeks, Kavin chronically deferred his aspirations of authoring a manuscript, failing to pen a solitary page.",
            "vocab": [
                  {
                        "normal": "kept postponing",
                        "advanced": "chronically deferred",
                        "tamil": "தொடர்ந்து தள்ளிப்போட்டார்"
                  },
                  {
                        "normal": "dream project",
                        "advanced": "cherished aspiration",
                        "tamil": "நெடுநாள் ஆசை"
                  }
            ],
            "telugu": "కవిన్ చాలా వారాలుగా తన కలల పుస్తకాన్ని రాయడం మొదలుపెట్టకుండా ప్రతిరోజూ వాయిదా వేస్తూ వచ్చాడు.",
            "teluguSpeak": "கவிந் சாலா வாராலுகா தந கலல புஸ்தகாந்நி ராயடம் மொதலுபெட்டகும்டா ப்ரதிரோஜூ வாயிதா வேஸ்தூ வச்சாடு.",
            "teluguSub": "kavin chaalaa vaaraalugaa thana kalala pusthakaanni raayadam modalupettakumdaa prathirojoo vaayidaa vesthoo vachchaadu.",
            "teluguScript": "కవిన్ చాలా వారాలుగా తన కలల పుస్తకాన్ని రాయడం మొదలుపెట్టకుండా ప్రతిరోజూ వాయిదా వేస్తూ వచ్చాడు.",
            "kannada": "ಕವಿನ್ ಹಲವು ವಾರಗಳಿಂದ ತನ್ನ ಕನಸಿನ ಪುಸ್ತಕವನ್ನು ಬರೆಯಲು ಪ್ರಾರಂಭಿಸದೆ ಪ್ರತಿದಿನ ಮುಂದೂಡುತ್ತಿದ್ದನು.",
            "kannadaSpeak": "கவிந் ஹலவு வாரகளிம்த தந்ந கநஸிந புஸ்தகவந்நு பரெயலு ப்ராரம்பிஸதெ ப்ரதிதிந மும்தூடுத்தித்தநு.",
            "kannadaSub": "kavin halavu vaaragalimda thanna kanasina pusthakavannu bareyalu praarambhisade prathidina mumdooduththiddanu.",
            "kannadaScript": "ಕವಿನ್ ಹಲವು ವಾರಗಳಿಂದ ತನ್ನ ಕನಸಿನ ಪುಸ್ತಕವನ್ನು ಬರೆಯಲು ಪ್ರಾರಂಭಿಸದೆ ಪ್ರತಿದಿನ ಮುಂದೂಡುತ್ತಿದ್ದನು.",
            "hindi": "कविन कई हफ़्तों से अपनी मनपसंद पुस्तक लिखना शुरू नहीं कर रहा था और प्रतिदिन टालता जा रहा था।",
            "hindiSpeak": "கவிந கஈ ஹப़्தோம் ஸே அபநீ மநபஸம்த புஸ்தக லிகநா ஶுரூ நஹீம் கர ரஹா தா ஔர ப்ரதிதிந டாலதா ஜா ரஹா தா।",
            "hindiSub": "kavina kaee hapha़्thom se apanee manapasamda pusthaka likhanaa shuroo naheem kara rahaa thaa aura prathidina taalathaa jaa rahaa thaa।",
            "hindiScript": "कविन कई हफ़्तों से अपनी मनपसंद पुस्तक लिखना शुरू नहीं कर रहा था और प्रतिदिन टालता जा रहा था।"
      },
      {
            "num": 2,
            "tamil": "\"நாளை தொடங்கலாம், இன்று எனக்கு சரியான நேரம் அமையவில்லை\" என்ற எண்ணமே அவனது மிகப்பெரிய தடையாக இருந்தது.",
            "normal": "\"I will start tomorrow; today isn't the perfect time,\" was the insidious excuse constantly holding him back.",
            "advanced": "\"I shall commence tomorrow; conditions remain imperfect today,\" represented the insidious rationalization paralyzing his momentum.",
            "vocab": [
                  {
                        "normal": "holding him back",
                        "advanced": "paralyzing momentum",
                        "tamil": "முன்னேற்றத்தை தடுத்தல்"
                  },
                  {
                        "normal": "insidious excuse",
                        "advanced": "insidious rationalization",
                        "tamil": "வஞ்சகமான சாக்குப்போக்கு"
                  }
            ],
            "telugu": "\"రేపు మొదలుపెడదాం, ఈ రోజు సరైన సమయం కాదు\" అనే సాకే అతన్ని నిరంతరం వెనక్కి నెట్టింది.",
            "teluguSpeak": "\"ரேபு மொதலுபெடதாம், ஈ ரோஜு ஸரைந ஸமயம் காது\" அநே ஸாகே அதந்நி நிரம்தரம் வெநக்கி நெட்டிம்தி.",
            "teluguSub": "\"repu modalupedadaam, ee roju saraina samayam kaadu\" ane saake athanni niramtharam venakki nettimdi.",
            "teluguScript": "\"రేపు మొదలుపెడదాం, ఈ రోజు సరైన సమయం కాదు\" అనే సాకే అతన్ని నిరంతరం వెనక్కి నెట్టింది.",
            "kannada": "\"ನಾಳೆ ಪ್ರಾರಂಭಿಸುವೆ, ಇಂದು ಸರಿಯಾದ ಸಮಯವಿಲ್ಲ\" ಎಂಬ ನೆಪವೇ ಅವನನ್ನು ನಿರಂತರವಾಗಿ ತಡೆಯುತ್ತಿತ್ತು.",
            "kannadaSpeak": "\"நாளெ ப்ராரம்பிஸுவெ, இம்து ஸரியாத ஸமயவில்ல\" எம்ப நெபவே அவநந்நு நிரம்தரவாகி தடெயுத்தித்து.",
            "kannadaSub": "\"naale praarambhisuve, imdu sariyaada samayavilla\" emba nepave avanannu niramtharavaagi thadeyuththiththu.",
            "kannadaScript": "\"ನಾಳೆ ಪ್ರಾರಂಭಿಸುವೆ, ಇಂದು ಸರಿಯಾದ ಸಮಯವಿಲ್ಲ\" ಎಂಬ ನೆಪವೇ ಅವನನ್ನು ನಿರಂತರವಾಗಿ ತಡೆಯುತ್ತಿತ್ತು.",
            "hindi": "\"कल से शुरू करूँगा, आज सही समय नहीं है\"—यह कपटपूर्ण बहाना उसे निरंतर पीछे खींच रहा था।",
            "hindiSpeak": "\"கல ஸே ஶுரூ கரூँகா, ஆஜ ஸஹீ ஸமய நஹீம் ஹை\"—யஹ கபடபூர்ண பஹாநா உஸே நிரம்தர பீசே கீம்ச ரஹா தா।",
            "hindiSub": "\"kala se shuroo karooँgaa, aaja sahee samaya naheem hai\"—yaha kapatapoorna bahaanaa use niramthara peechhe kheemcha rahaa thaa।",
            "hindiScript": "\"कल से शुरू करूँगा, आज सही समय नहीं है\"—यह कपटपूर्ण बहाना उसे निरंतर पीछे खींच रहा था।"
      },
      {
            "num": 3,
            "tamil": "ஒரு நாள், தனது நேர விரயத்தை உணர்ந்து, 'ஐந்து நிமிட விதி' என்ற எளிய உத்தியை பரிசோதிக்க முடிவு செய்தான்.",
            "normal": "One afternoon, realizing how much time he was wasting, he resolved to experiment with the 'five-minute rule.'",
            "advanced": "One afternoon, cognizant of squandered temporal capital, he resolved to implement the elementary 'five-minute protocol.'",
            "vocab": [
                  {
                        "normal": "wasted time",
                        "advanced": "squandered temporal capital",
                        "tamil": "வீணடித்த நேரம்"
                  },
                  {
                        "normal": "resolved to implement",
                        "advanced": "resolved to implement",
                        "tamil": "செயல்படுத்த முடிவெடுத்தார்"
                  }
            ],
            "telugu": "ఒక మధ్యాహ్నం, తాను ఎంత సమయం వృధా చేస్తున్నాడో గ్రహించి, 'ఐదు నిమిషాల నియమం' పాటించాలని నిర్ణయించుకున్నాడు.",
            "teluguSpeak": "ஒக மத்யாஹ்நம், தாநு எம்த ஸமயம் வ்ருதா சேஸ்துந்நாடோ க்ரஹிம்சி, 'ஐது நிமிஷால நியமம்' பாடிம்சாலநி நிர்ணயிம்சுகுந்நாடு.",
            "teluguSub": "oka madhyaahnam, thaanu emtha samayam vrudhaa chesthunnaado grahimchi, 'aidu nimishaala niyamam' paatimchaalani nirnayimchukunnaadu.",
            "teluguScript": "ఒక మధ్యాహ్నం, తాను ఎంత సమయం వృధా చేస్తున్నాడో గ్రహించి, 'ఐదు నిమిషాల నియమం' పాటించాలని నిర్ణయించుకున్నాడు.",
            "kannada": "ಒಂದು ಮಧ್ಯಾಹ್ನ, ತಾನು ಎಷ್ಟು ಸಮಯ ವ್ಯರ್ಥ ಮಾಡುತ್ತಿದ್ದೇನೆಂದು ಅರಿತು, 'ಐದು ನಿಮಿಷಗಳ ನಿಯಮ' ಪಾಲಿಸಲು ನಿರ್ಧರಿಸಿದನು.",
            "kannadaSpeak": "ஒம்து மத்யாஹ்ந, தாநு எஷ்டு ஸமய வ்யர்த மாடுத்தித்தேநெம்து அரிது, 'ஐது நிமிஷகள நியம' பாலிஸலு நிர்தரிஸிதநு.",
            "kannadaSub": "omdu madhyaahna, thaanu eshtu samaya vyartha maaduththiddenemdu arithu, 'aidu nimishagala niyama' paalisalu nirdharisidanu.",
            "kannadaScript": "ಒಂದು ಮಧ್ಯಾಹ್ನ, ತಾನು ಎಷ್ಟು ಸಮಯ ವ್ಯರ್ಥ ಮಾಡುತ್ತಿದ್ದೇನೆಂದು ಅರಿತು, 'ಐದು ನಿಮಿಷಗಳ ನಿಯಮ' ಪಾಲಿಸಲು ನಿರ್ಧರಿಸಿದನು.",
            "hindi": "एक दोपहर, अपने व्यर्थ होते समय को पहचानकर उसने 'पाँच मिनट के नियम' को आजमाने का संकल्प लिया।",
            "hindiSpeak": "ஏக தோபஹர, அபநே வ்யர்த ஹோதே ஸமய கோ பஹசாநகர உஸநே 'பாँச மிநட கே நியம' கோ ஆஜமாநே கா ஸம்கல்ப லியா।",
            "hindiSub": "eka dopahara, apane vyartha hothe samaya ko pahachaanakara usane 'paaँcha minata ke niyama' ko aajamaane kaa samkalpa liyaa।",
            "hindiScript": "एक दोपहर, अपने व्यर्थ होते समय को पहचानकर उसने 'पाँच मिनट के नियम' को आजमाने का संकल्प लिया।"
      },
      {
            "num": 4,
            "tamil": "\"முழு புத்தகத்தையும் எழுத வேண்டாம்; அடுத்த ஐந்து நிமிடங்கள் மட்டும் ஒரு பத்தியை எழுதுவேன்\" என்று தனக்குத்தானே சொன்னான்.",
            "normal": "\"I don't need to finish the whole book; I will only write for five short minutes,\" he told himself.",
            "advanced": "\"I need not consummate the entire tome; I shall solely engage for five transient minutes,\" he pledged internally.",
            "vocab": [
                  {
                        "normal": "whole book",
                        "advanced": "entire tome",
                        "tamil": "முழு புத்தகம்"
                  },
                  {
                        "normal": "five short minutes",
                        "advanced": "five transient minutes",
                        "tamil": "ஐந்து நிமிட சொற்ப நேரம்"
                  }
            ],
            "telugu": "\"మొత్తం పుస్తకాన్ని ఒకేసారి రాయనవసరం లేదు; కేవలం ఐదు నిమిషాలు మాత్రమే ఒక పేరా రాస్తాను\" అని తనకు తాను చెప్పుకున్నాడు.",
            "teluguSpeak": "\"மொத்தம் புஸ்தகாந்நி ஒகேஸாரி ராயநவஸரம் லேது; கேவலம் ஐது நிமிஷாலு மாத்ரமே ஒக பேரா ராஸ்தாநு\" அநி தநகு தாநு செப்புகுந்நாடு.",
            "teluguSub": "\"moththam pusthakaanni okesaari raayanavasaram ledu; kevalam aidu nimishaalu maathrame oka peraa raasthaanu\" ani thanaku thaanu cheppukunnaadu.",
            "teluguScript": "\"మొత్తం పుస్తకాన్ని ఒకేసారి రాయనవసరం లేదు; కేవలం ఐదు నిమిషాలు మాత్రమే ఒక పేరా రాస్తాను\" అని తనకు తాను చెప్పుకున్నాడు.",
            "kannada": "\"ಇಡೀ ಪುಸ್ತಕವನ್ನು ಒಮ್ಮೆಲೇ ಮುಗಿಸಬೇಕಿಲ್ಲ; ಕೇವಲ ಐದು ನಿಮಿಷಗಳ ಕಾಲ ಒಂದು ಪ್ಯಾರಾ ಬರೆಯುವೆ\" ಎಂದು ತನಗೆ ತಾನೇ ಹೇಳಿಕೊಂಡನು.",
            "kannadaSpeak": "\"இடீ புஸ்தகவந்நு ஒம்மெலே முகிஸபேகில்ல; கேவல ஐது நிமிஷகள கால ஒம்து ப்யாரா பரெயுவெ\" எம்து தநகெ தாநே ஹேளிகொம்டநு.",
            "kannadaSub": "\"idee pusthakavannu ommele mugisabekilla; kevala aidu nimishagala kaala omdu pyaaraa bareyuve\" emdu thanage thaane helikomdanu.",
            "kannadaScript": "\"ಇಡೀ ಪುಸ್ತಕವನ್ನು ಒಮ್ಮೆಲೇ ಮುಗಿಸಬೇಕಿಲ್ಲ; ಕೇವಲ ಐದು ನಿಮಿಷಗಳ ಕಾಲ ಒಂದು ಪ್ಯಾರಾ ಬರೆಯುವೆ\" ಎಂದು ತನಗೆ ತಾನೇ ಹೇಳಿಕೊಂಡನು.",
            "hindi": "\"मुझे पूरी किताब अभी समाप्त नहीं करनी है, मैं केवल पाँच मिनट एक अनुच्छेद लिखूँगा,\" उसने स्वयं से कहा।",
            "hindiSpeak": "\"முஜே பூரீ கிதாப அபீ ஸமாப்த நஹீம் கரநீ ஹை, மைம் கேவல பாँச மிநட ஏக அநுச்சேத லிகூँகா,\" உஸநே ஸ்வயம் ஸே கஹா।",
            "hindiSub": "\"mujhe pooree kithaaba abhee samaaptha naheem karanee hai, maim kevala paaँcha minata eka anuchchheda likhooँgaa,\" usane svayam se kahaa।",
            "hindiScript": "\"मुझे पूरी किताब अभी समाप्त नहीं करनी है, मैं केवल पाँच मिनट एक अनुच्छेद लिखूँगा,\" उसने स्वयं से कहा।"
      },
      {
            "num": 5,
            "tamil": "தன் மடிக்கணினியைத் திறந்து தட்டச்சு செய்யத் தொடங்கியதும், தொடக்கத் தயக்கம் மெல்ல கரைந்து சிந்தனை ஓட்டம் பிறந்தது.",
            "normal": "Once he opened his laptop and started typing, initial resistance dissolved and a state of creative flow emerged.",
            "advanced": "Upon unlatching his computer and initiating keystrokes, initial friction dissolved, welcoming an exhilarating state of creative flow.",
            "vocab": [
                  {
                        "normal": "initial resistance",
                        "advanced": "initial friction",
                        "tamil": "தொடக்கத் தயக்கம்"
                  },
                  {
                        "normal": "creative flow",
                        "advanced": "exhilarating flow",
                        "tamil": "சிந்தனைப் பாய்ச்சல்"
                  }
            ],
            "telugu": "ల్యాప్‌టాప్ తెరిచి టైప్ చేయడం ప్రారంభించగానే, ప్రారంభంలో ఉన్న జంకు మాయమై సృజనాత్మక ఆలోచనలు వెల్లువెత్తాయి.",
            "teluguSpeak": "ல்யாப்‌டாப் தெரிசி டைப் சேயடம் ப்ராரம்பிம்சகாநே, ப்ராரம்பம்லோ உந்ந ஜம்கு மாயமை ஸ்ருஜநாத்மக ஆலோசநலு வெல்லுவெத்தாயி.",
            "teluguSub": "lyaap‌taap therichi taip cheyadam praarambhimchagaane, praarambhamlo unna jamku maayamai srujanaathmaka aalochanalu velluveththaayi.",
            "teluguScript": "ల్యాప్‌టాప్ తెరిచి టైప్ చేయడం ప్రారంభించగానే, ప్రారంభంలో ఉన్న జంకు మాయమై సృజనాత్మక ఆలోచనలు వెల్లువెత్తాయి.",
            "kannada": "ಲ್ಯಾಪ್‌ಟಾಪ್ ತೆರೆದು ಟೈಪ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿದ ಕೂಡಲೇ, ಆರಂಭಿಕ ಹಿಂಜರಿಕೆ ಕರಗಿ ಸೃಜನಶೀಲ ಹರಿವು ಹುಟ್ಟಿಕೊಂಡಿತು.",
            "kannadaSpeak": "ல்யாப்‌டாப் தெரெது டைப் மாடலு ப்ராரம்பிஸித கூடலே, ஆரம்பிக ஹிம்ஜரிகெ கரகி ஸ்ருஜநஶீல ஹரிவு ஹுட்டிகொம்டிது.",
            "kannadaSub": "lyaap‌taap theredu taip maadalu praarambhisida koodale, aarambhika himjarike karagi srujanasheela harivu huttikomdithu.",
            "kannadaScript": "ಲ್ಯಾಪ್‌ಟಾಪ್ ತೆರೆದು ಟೈಪ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿದ ಕೂಡಲೇ, ಆರಂಭಿಕ ಹಿಂಜರಿಕೆ ಕರಗಿ ಸೃಜನಶೀಲ ಹರಿವು ಹುಟ್ಟಿಕೊಂಡಿತು.",
            "hindi": "जैसे ही उसने लैपटॉप खोलकर लिखना प्रारंभ किया, प्रारंभिक हिचकिचाहट विलीन हो गई और रचनात्मक प्रवाह उमड़ पड़ा।",
            "hindiSpeak": "ஜைஸே ஹீ உஸநே லைபடॉப கோலகர லிகநா ப்ராரம்ப கியா, ப்ராரம்பிக ஹிசகிசாஹட விலீந ஹோ கஈ ஔர ரசநாத்மக ப்ரவாஹ உமட़ பட़ா।",
            "hindiSub": "jaise hee usane laipataॉpa kholakara likhanaa praarambha kiyaa, praarambhika hichakichaahata vileena ho gaee aura rachanaathmaka pravaaha umada़ pada़aa।",
            "hindiScript": "जैसे ही उसने लैपटॉप खोलकर लिखना प्रारंभ किया, प्रारंभिक हिचकिचाहट विलीन हो गई और रचनात्मक प्रवाह उमड़ पड़ा।"
      },
      {
            "num": 6,
            "tamil": "ஐந்து நிமிடங்கள் என்பது ஒரு மணி நேரமாக மாறியது; அவனது விரல்கள் உற்சாகத்துடன் பக்கங்களை நிரப்பின.",
            "normal": "Five minutes naturally expanded into a full hour; his fingers effortlessly filled three whole pages.",
            "advanced": "The modest five minutes naturally blossomed into an hour; his fingers effortlessly populated multiple pages.",
            "vocab": [
                  {
                        "normal": "effortlessly filled",
                        "advanced": "effortlessly populated",
                        "tamil": "எளிதாக நிரப்பினார்"
                  },
                  {
                        "normal": "blossomed into an hour",
                        "advanced": "blossomed into an hour",
                        "tamil": "மணிநேரமாக விரிவடைந்தது"
                  }
            ],
            "telugu": "ఐదు నిమిషాలు కాస్తా సహజంగానే ఒక గంట సమయంగా మారింది; అతని వేళ్లు అలవోకగా పేజీలను నింపేశాయి.",
            "teluguSpeak": "ஐது நிமிஷாலு காஸ்தா ஸஹஜம்காநே ஒக கம்ட ஸமயம்கா மாரிம்தி; அதநி வேள்லு அலவோககா பேஜீலநு நிம்பேஶாயி.",
            "teluguSub": "aidu nimishaalu kaasthaa sahajamgaane oka gamta samayamgaa maarimdi; athani vellu alavokagaa pejeelanu nimpeshaayi.",
            "teluguScript": "ఐదు నిమిషాలు కాస్తా సహజంగానే ఒక గంట సమయంగా మారింది; అతని వేళ్లు అలవోకగా పేజీలను నింపేశాయి.",
            "kannada": "ಐದು ನಿಮಿಷಗಳು ಸ್ವಾಭಾವಿಕವಾಗಿ ಒಂದು ಪೂರ್ಣ ಗಂಟೆಯಾಗಿ ಬೆಳೆಯಿತು; ಅವನ ಬೆರಳುಗಳು ಅನಾಯಾಸವಾಗಿ ಪುಟಗಳನ್ನು ತುಂಬಿದವು.",
            "kannadaSpeak": "ஐது நிமிஷகளு ஸ்வாபாவிகவாகி ஒம்து பூர்ண கம்டெயாகி பெளெயிது; அவந பெரளுகளு அநாயாஸவாகி புடகளந்நு தும்பிதவு.",
            "kannadaSub": "aidu nimishagalu svaabhaavikavaagi omdu poorna gamteyaagi beleyithu; avana beralugalu anaayaasavaagi putagalannu thumbidavu.",
            "kannadaScript": "ಐದು ನಿಮಿಷಗಳು ಸ್ವಾಭಾವಿಕವಾಗಿ ಒಂದು ಪೂರ್ಣ ಗಂಟೆಯಾಗಿ ಬೆಳೆಯಿತು; ಅವನ ಬೆರಳುಗಳು ಅನಾಯಾಸವಾಗಿ ಪುಟಗಳನ್ನು ತುಂಬಿದವು.",
            "hindi": "पाँच मिनट सहज ही पूरे एक घंटे में बदल गए; उसकी उँगलियों ने सरलता से कई पृष्ठ भर दिए।",
            "hindiSpeak": "பாँச மிநட ஸஹஜ ஹீ பூரே ஏக கம்டே மேம் பதல கஏ; உஸகீ உँகலியோம் நே ஸரலதா ஸே கஈ ப்ருஷ்ட பர திஏ।",
            "hindiSub": "paaँcha minata sahaja hee poore eka ghamte mem badala gae; usakee uँgaliyom ne saralathaa se kaee prushtha bhara die।",
            "hindiScript": "पाँच मिनट सहज ही पूरे एक घंटे में बदल गए; उसकी उँगलियों ने सरलता से कई पृष्ठ भर दिए।"
      },
      {
            "num": 7,
            "tamil": "தொடங்குவதே மிகப்பெரிய கடினம்; தொடங்கிய பிறகு உந்துசக்தி தானாகவே வழிகாட்டும் என்பதை அவன் புரிந்துகொண்டான்.",
            "normal": "He understood that initiating action is the hardest hurdle; once begun, momentum takes over naturally.",
            "advanced": "He discerned that inaugurating action constitutes the supreme impediment; once initiated, momentum catalyzes effortless continuation.",
            "vocab": [
                  {
                        "normal": "hardest hurdle",
                        "advanced": "supreme impediment",
                        "tamil": "பெரிய தடை"
                  },
                  {
                        "normal": "momentum takes over",
                        "advanced": "momentum catalyzes",
                        "tamil": "உந்துசக்தி வழிநடத்துதல்"
                  }
            ],
            "telugu": "పని ప్రారంభించడమే అతిపెద్ద అవరోధమని, ఒక్కసారి మొదలుపెడితే ప్రేరణే మనల్ని ముందుకు నడిపిస్తుందని అతను తెలుసుకున్నాడు.",
            "teluguSpeak": "பநி ப்ராரம்பிம்சடமே அதிபெத்த அவரோதமநி, ஒக்கஸாரி மொதலுபெடிதே ப்ரேரணே மநல்நி மும்துகு நடிபிஸ்தும்தநி அதநு தெலுஸுகுந்நாடு.",
            "teluguSub": "pani praarambhimchadame athipedda avarodhamani, okkasaari modalupedithe prerane manalni mumduku nadipisthumdani athanu thelusukunnaadu.",
            "teluguScript": "పని ప్రారంభించడమే అతిపెద్ద అవరోధమని, ఒక్కసారి మొదలుపెడితే ప్రేరణే మనల్ని ముందుకు నడిపిస్తుందని అతను తెలుసుకున్నాడు.",
            "kannada": "ಪ್ರಾರಂಭಿಸುವುದೇ ಅತಿ ದೊಡ್ಡ ಅಡಚಣೆ; ಒಮ್ಮೆ ಶುರುಮಾಡಿದರೆ ವೇಗವೇ ಸಹಜವಾಗಿ ಮುನ್ನಡೆಸುತ್ತದೆ ಎಂಬುದನ್ನು ಅವನು ಅರ್ಥಮಾಡಿಕೊಂಡನು.",
            "kannadaSpeak": "ப்ராரம்பிஸுவுதே அதி தொட்ட அடசணெ; ஒம்மெ ஶுருமாடிதரெ வேகவே ஸஹஜவாகி முந்நடெஸுத்ததெ எம்புதந்நு அவநு அர்தமாடிகொம்டநு.",
            "kannadaSub": "praarambhisuvude athi dodda adachane; omme shurumaadidare vegave sahajavaagi munnadesuththade embudannu avanu arthamaadikomdanu.",
            "kannadaScript": "ಪ್ರಾರಂಭಿಸುವುದೇ ಅತಿ ದೊಡ್ಡ ಅಡಚಣೆ; ಒಮ್ಮೆ ಶುರುಮಾಡಿದರೆ ವೇಗವೇ ಸಹಜವಾಗಿ ಮುನ್ನಡೆಸುತ್ತದೆ ಎಂಬುದನ್ನು ಅವನು ಅರ್ಥಮಾಡಿಕೊಂಡನು.",
            "hindi": "उसने समझ लिया कि शुरुआत करना ही सबसे बड़ी बाधा है; एक बार गति मिल जाए तो कर्म स्वयं मार्ग प्रशस्त कर देता है।",
            "hindiSpeak": "உஸநே ஸமஜ லியா கி ஶுருஆத கரநா ஹீ ஸபஸே பட़ீ பாதா ஹை; ஏக பார கதி மில ஜாஏ தோ கர்ம ஸ்வயம் மார்க ப்ரஶஸ்த கர தேதா ஹை।",
            "hindiSub": "usane samajha liyaa ki shuruaatha karanaa hee sabase bada़ee baadhaa hai; eka baara gathi mila jaae tho karma svayam maarga prashastha kara dethaa hai।",
            "hindiScript": "उसने समझ लिया कि शुरुआत करना ही सबसे बड़ी बाधा है; एक बार गति मिल जाए तो कर्म स्वयं मार्ग प्रशस्त कर देता है।"
      },
      {
            "num": 8,
            "tamil": "சிறிய தொடக்கங்களே பெரிய சாதனைகளை உருவாக்கும் விதையாகும் என்ற நம்பிக்கை அவனது வாழ்வை மாற்றியது.",
            "normal": "The conviction that microscopic beginnings contain the seeds of monumental achievements transformed his life.",
            "advanced": "The unwavering conviction that microscopic beginnings harbor the genesis of monumental triumphs revolutionized his life.",
            "vocab": [
                  {
                        "normal": "microscopic beginnings",
                        "advanced": "microscopic beginnings",
                        "tamil": "மிகச்சிறிய தொடக்கங்கள்"
                  },
                  {
                        "normal": "monumental achievements",
                        "advanced": "monumental triumphs",
                        "tamil": "மகத்தான வெற்றிகள்"
                  }
            ],
            "telugu": "చిన్న ప్రారంభాలే గొప్ప విజయాలకు పునాది అనే దృఢమైన నమ్మకం అతని జీవితాన్ని సమూలంగా మార్చింది.",
            "teluguSpeak": "சிந்ந ப்ராரம்பாலே கொப்ப விஜயாலகு புநாதி அநே த்ருடமைந நம்மகம் அதநி ஜீவிதாந்நி ஸமூலம்கா மார்சிம்தி.",
            "teluguSub": "chinna praarambhaale goppa vijayaalaku punaadi ane drudhamaina nammakam athani jeevithaanni samoolamgaa maarchimdi.",
            "teluguScript": "చిన్న ప్రారంభాలే గొప్ప విజయాలకు పునాది అనే దృఢమైన నమ్మకం అతని జీవితాన్ని సమూలంగా మార్చింది.",
            "kannada": "ಸಣ್ಣ ಆರಂಭಗಳೇ ಮಹಾನ್ ಸಾಧನೆಗಳ ಬೀಜಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತವೆ ಎಂಬ ನಂಬಿಕೆಯು ಅವನ ಜೀವನವನ್ನು ಬದಲಾಯಿಸಿತು.",
            "kannadaSpeak": "ஸண்ண ஆரம்பகளே மஹாந் ஸாதநெகள பீஜகளந்நு ஒளகொம்டிருத்தவெ எம்ப நம்பிகெயு அவந ஜீவநவந்நு பதலாயிஸிது.",
            "kannadaSub": "sanna aarambhagale mahaan saadhanegala beejagalannu olagomdiruththave emba nambikeyu avana jeevanavannu badalaayisithu.",
            "kannadaScript": "ಸಣ್ಣ ಆರಂಭಗಳೇ ಮಹಾನ್ ಸಾಧನೆಗಳ ಬೀಜಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತವೆ ಎಂಬ ನಂಬಿಕೆಯು ಅವನ ಜೀವನವನ್ನು ಬದಲಾಯಿಸಿತು.",
            "hindi": "यह अटूट विश्वास कि छोटी शुरुआत में ही विशाल उपलब्धियों के बीज समाए होते हैं, उसके जीवन को रूपांतरित कर गया।",
            "hindiSpeak": "யஹ அடூட விஶ்வாஸ கி சோடீ ஶுருஆத மேம் ஹீ விஶால உபலப்தியோம் கே பீஜ ஸமாஏ ஹோதே ஹைம், உஸகே ஜீவந கோ ரூபாம்தரித கர கயா।",
            "hindiSub": "yaha atoota vishvaasa ki chhotee shuruaatha mem hee vishaala upalabdhiyom ke beeja samaae hothe haim, usake jeevana ko roopaamtharitha kara gayaa।",
            "hindiScript": "यह अटूट विश्वास कि छोटी शुरुआत में ही विशाल उपलब्धियों के बीज समाए होते हैं, उसके जीवन को रूपांतरित कर गया।"
      }
],
      vocabComparison: [
        {
          normal: "Postpone continuously",
          advanced: "Chronically defer",
          tamil: "தொடர்ந்து தள்ளிப்போடுதல்",
          telugu: "నిరంతరం వాయిదా వేయండి",
          teluguSpeak: "நிரம்தரம் வாயிதா வேயம்டி",
          kannada: "ನಿರಂತರವಾಗಿ ಮುಂದೂಡಿ",
          kannadaSpeak: "நிரம்தரவாகி மும்தூடி",
          hindi: "लगातार स्थगित करें",
          hindiSpeak: "லகாதார ஸ்தகித கரேம்",
          example: "He chronically deferred filing his taxes."
        },
        {
          normal: "Initial hurdle / Friction",
          advanced: "Supreme impediment",
          tamil: "தொடக்கத் தடை",
          telugu: "ప్రారంభ అడ్డంకి / రాపిడి",
          teluguSpeak: "ப்ராரம்ப அட்டம்கி / ராபிடி",
          kannada: "ಆರಂಭಿಕ ಅಡಚಣೆ / ಘರ್ಷಣೆ",
          kannadaSpeak: "ஆரம்பிக அடசணெ / கர்ஷணெ",
          hindi: "प्रारंभिक बाधा/घर्षण",
          hindiSpeak: "ப்ராரம்பிக பாதா/கர்ஷண",
          example: "Starting was the supreme impediment to fitness."
        },
        {
          normal: "Creative flow",
          advanced: "Cognitive flow",
          tamil: "சிந்தனை ஓட்டம்",
          telugu: "సృజనాత్మక ప్రవాహం",
          teluguSpeak: "ஸ்ருஜநாத்மக ப்ரவாஹம்",
          kannada: "ಸೃಜನಾತ್ಮಕ ಹರಿವು",
          kannadaSpeak: "ஸ்ருஜநாத்மக ஹரிவு",
          hindi: "रचनात्मक प्रवाह",
          hindiSpeak: "ரசநாத்மக ப்ரவாஹ",
          example: "She entered cognitive flow while painting."
        },
        {
          normal: "Huge success",
          advanced: "Monumental triumph",
          tamil: "மகத்தான வெற்றி",
          telugu: "భారీ విజయం సాధించింది",
          teluguSpeak: "பாரீ விஜயம் ஸாதிம்சிம்தி",
          kannada: "ದೊಡ್ಡ ಯಶಸ್ಸು",
          kannadaSpeak: "தொட்ட யஶஸ்ஸு",
          hindi: "बहुत बड़ी सफलता",
          hindiSpeak: "பஹுத பட़ீ ஸபலதா",
          example: "The product launch was a monumental triumph."
        }
      ],
      quiz: [
        { question: "What does 'chronically defer' mean in Tamil?", options: ["முன்கூட்டியே முடித்தல்", "தொடர்ந்து தள்ளிப்போடுதல்", "கவனமாக படித்தல்", "மகிழ்ச்சியுடன் இருத்தல்"], correct: 1, explanation: "'Chronically defer' means habitually postponing or delaying important tasks (தொடர்ந்து தள்ளிப்போடுதல்)." },
        { question: "What was the 'five-minute protocol' that Kavin used?", options: ["Sleeping for 5 minutes", "Committing to work for just 5 minutes to overcome initial friction", "Scrolling on phone", "Walking outside"], correct: 1, explanation: "He committed to just 5 minutes of focused work, which dissolved starting friction." },
        { question: "What did Kavin discover about starting a task?", options: ["It is impossible", "Starting is the hardest hurdle; once begun, momentum carries you forward", "Never start anything", "Wait for mood"], correct: 1, explanation: "Action generates momentum, breaking the cycle of inertia." },
        { question: "What is the meaning of 'monumental triumphs'?", options: ["Little accidents", "Monumental / historic victories and breakthroughs", "Daily routines", "Temporary breaks"], correct: 1, explanation: "'Monumental triumphs' refers to immense, lasting, and significant achievements." }
      ]
    };
  }

  // 7. UNIVERSAL DYNAMIC CONTEXTUAL SYNTHESIZER (For any custom topic)
  const cleanTitle = topic.charAt(0).toUpperCase() + topic.slice(1);
  const universalLines = [
    make_universal_line(1, cleanTitle),
    make_universal_line(2, cleanTitle),
    make_universal_line(3, cleanTitle),
    make_universal_line(4, cleanTitle),
    make_universal_line(5, cleanTitle),
    make_universal_line(6, cleanTitle),
    make_universal_line(7, cleanTitle),
    make_universal_line(8, cleanTitle)
  ];

  return {
    id: safeId,
    isAi: true,
    source: "ai",
    title: {
      tamil: `${cleanTitle} - ஓர் உன்னதப் பயணம்`,
      normal: `The Inspiring Journey of ${cleanTitle}`,
      advanced: `The Grand Odyssey of ${cleanTitle}`,
      telugu: `${cleanTitle} - ఒక స్ఫూర్తిదాయక ప్రయాణం`,
      kannada: `${cleanTitle} - ಒಂದು ಸ್ಪೂರ್ತಿದಾಯಕ ಪ್ರಯಾಣ`,
      hindi: `${cleanTitle} - एक प्रेरक यात्रा`
    },
    category: category || "Daily Life & Practical Conversations",
    icon: icon || "sparkles",
    readTime: "1.5 min read",
    summary: {
      tamil: `${cleanTitle} குறித்த ஆழமான அனுபவமும், விடாமுயற்சியும் ஒரு மனிதரின் வாழ்வில் எவ்வாறு புதிய வெற்றியைத் தேடித்தந்தது என்பதைக் கூறும் உன்னதமான கதை.`,
      normal: `An engaging and inspiring narrative illustrating how persistent dedication and vision surrounding ${cleanTitle} unlock unprecedented triumph.`,
      advanced: `A nuanced exposition chronicling how steadfast immersion and strategic resolve in ${cleanTitle} cultivate intellectual elevation and lasting triumph.`,
      telugu: `${cleanTitle} పట్ల నిరంతర అంకితభావం మరియు స్పష్టమైన లక్ష్యం జీవితంలో అపూర్వ విజయాన్ని ఎలా అందిస్తుందో తెలిపే కథ.`,
      kannada: `${cleanTitle} ಕುರಿತಾದ ನಿರಂತರ ಪರಿಶ್ರಮ ಮತ್ತು ಸ್ಪಷ್ಟ ದೃಷ್ಟಿಕೋನವು ಅಭೂತಪೂರ್ವ ಯಶಸ್ಸನ್ನು ಹೇಗೆ ನೀಡುತ್ತದೆ ಎಂಬುದನ್ನು ವಿವರಿಸುವ ಕಥೆ.`,
      hindi: `${cleanTitle} के प्रति निरंतर समर्पण और दृढ़ संकल्प किस प्रकार जीवन में अभूतपूर्व सफलता का द्वार खोलते हैं, यह दर्शाती कथा।`
    },
    lines: universalLines,
    vocabComparison: [
      {
          normal: "Great distinction",
          advanced: "Consummate distinction",
          tamil: "தனித்துவமான சிறப்பு",
          telugu: "గొప్ప వ్యత్యాసం",
          teluguSpeak: "கொப்ப வ்யத்யாஸம்",
          kannada: "ದೊಡ್ಡ ವ್ಯತ್ಯಾಸ",
          kannadaSpeak: "தொட்ட வ்யத்யாஸ",
          hindi: "महान भेद",
          hindiSpeak: "மஹாந பேத",
          example: "Her achievements earned consummate distinction in the field."
        },
      {
          normal: "Demanding crisis",
          advanced: "Momentous juncture",
          tamil: "முக்கிய திருப்புமுனை",
          telugu: "డిమాండ్ సంక్షోభం",
          teluguSpeak: "டிமாம்ட் ஸம்க்ஷோபம்",
          kannada: "ಬೇಡಿಕೆ ಬಿಕ್ಕಟ್ಟು",
          kannadaSpeak: "பேடிகெ பிக்கட்டு",
          hindi: "मांग संकट",
          hindiSpeak: "மாம்க ஸம்கட",
          example: "He faced the momentous juncture with steady resolve."
        },
      {
          normal: "Stepping stone",
          advanced: "Pedagogical milestone",
          tamil: "கற்பிக்கும் மைல்கல்",
          telugu: "మెట్ల రాయి",
          teluguSpeak: "மெட்ல ராயி",
          kannada: "ಮೆಟ್ಟಿಲು",
          kannadaSpeak: "மெட்டிலு",
          hindi: "प्रारंभिक प्रयास",
          hindiSpeak: "ப்ராரம்பிக ப்ரயாஸ",
          example: "Every challenge proved to be an invaluable pedagogical milestone."
        },
      {
          normal: "Master key",
          advanced: "Sovereign key",
          tamil: "தலையாய திறவுகோல்",
          telugu: "మాస్టర్ కీ",
          teluguSpeak: "மாஸ்டர் கீ",
          kannada: "ಮಾಸ್ಟರ್ ಕೀ",
          kannadaSpeak: "மாஸ்டர் கீ",
          hindi: "सर्व - कुंची",
          hindiSpeak: "ஸர்வ - கும்சீ",
          example: "Courageous persistence is the sovereign key to conquering goals."
        }
    ],
    quiz: [
      { question: "What was the primary virtue demonstrated when confronting obstacles?", options: ["Giving up immediately", "Maintaining calm composure and persistent dedication", "Blaming others", "Ignoring reality"], correct: 1, explanation: "The narrative emphasizes maintaining composed resolve and steady persistence through trials." },
      { question: "What does 'pedagogical milestones' mean in Tamil?", options: ["வெறும் தோல்விகள்", "கற்கும் வழிகாட்டி மைல்கற்கள்", "அச்சம்", "தடைக்கற்கள்"], correct: 1, explanation: "'Pedagogical milestones' denotes experiences or trials that yield deep, instructive learning (கற்கும் மைல்கற்கள்)." },
      { question: "How were demanding trials transformed according to the narrative?", options: ["They were avoided", "They were turned into opportunities for breakthrough and growth", "They caused total defeat", "They were forgotten"], correct: 1, explanation: "Demanding trials were viewed as learning milestones and converted into fruitful opportunities." },
      { question: "What is described as the 'sovereign key' to unlocking aspirations?", options: ["Pure luck", "Intrepid decisions reinforced by relentless vigor", "Waiting endlessly", "Depending on shortcuts"], correct: 1, explanation: "Courageous decisions backed by persistent, unwavering vigor unlock the door to great achievements." }
    ]
  };
}

// ==========================================================================
// SPLIT-PANEL LIGHTBOX MODAL IMPLEMENTATION (Side-by-Side Reading Concept)
// ==========================================================================
let currentLightboxStoryId = null;
let currentLightboxLang = "english"; // "english" | "telugu" | "kannada" | "hindi"
let isLightboxOpen = false;
let isLightboxFooterCollapsed = true;

// Open Split-Panel Lightbox Modal
function openSplitLightbox(storyId, focusLang) {
  const targetId = storyId || (currentStory ? currentStory.id : STORIES_DATA[0].id);
  const story = STORIES_DATA.find((s) => s.id === targetId);
  if (!story) return;

  stopSpeech(); // Immediately stop running speech synthesis

  currentLightboxStoryId = targetId;
  if (focusLang) {
    currentLightboxLang = focusLang;
  }
  isLightboxOpen = true;

  // Make sure page currentStory aligns with lightbox
  if (!currentStory || currentStory.id !== targetId) {
    loadStory(targetId, false);
  }

  const modal = document.getElementById("story-lightbox");
  if (!modal) return;

  // Header information
  const iconEl = document.getElementById("lb-icon");
  const titleTaEl = document.getElementById("lb-title-ta");
  const titleEnEl = document.getElementById("lb-title-en");
  const badgeEl = document.getElementById("lb-badge");
  if (iconEl) iconEl.innerText = story.icon && story.icon.length <= 4 ? story.icon : "📖";
  if (titleTaEl) titleTaEl.innerText = story.title.tamil;
  if (titleEnEl) titleEnEl.innerText = story.title.normal;
  if (badgeEl) badgeEl.innerText = story.category || "Story";

  // Populate Story Jump Dropdown with all 100 stories
  const jumpSelect = document.getElementById("lb-story-jump-select");
  if (jumpSelect) {
    jumpSelect.innerHTML = STORIES_DATA.map((s, idx) => {
      const isSelected = s.id === targetId;
      return `<option value="${s.id}" ${isSelected ? "selected" : ""}>${idx + 1}. ${s.icon || "📖"} ${s.title.tamil} • ${s.title.normal}</option>`;
    }).join("");
    jumpSelect.value = targetId;
  }

  // Left Column: Fixed Tamil Content with sentence blocks
  const tamilBox = document.getElementById("lb-content-tamil");
  if (tamilBox) {
    tamilBox.innerHTML = `
      <div class="text-tamil-body">
        ${story.lines.map((item, idx) => `
          <div class="lb-sentence sentence-ta" data-line-index="${idx}" title="Click to listen line in Tamil">${escapeHtml(item.tamil)}</div>
        `).join("")}
      </div>
    `;
  }

  // Left Tamil Audio Button
  const btnTa = document.getElementById("lb-btn-audio-ta");
  if (btnTa) {
    btnTa.classList.remove("active-speaking");
    btnTa.onclick = () => {
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, "tamil");
      }
    };
  }

  // Set Right Column Combo Box
  const combo = document.getElementById("lb-lang-combo");
  if (combo) {
    combo.value = currentLightboxLang;
  }

  // Populate Right Column Content
  updateLightboxOtherContent();

  // Populate Vocab & Summary Footer
  updateLightboxFooterContent();

  // Sync Footer Collapse state
  updateLightboxFooterState();

  // Attach hover & click synchronization
  attachLightboxSentenceInteractions();

  // Show modal & prevent background scrolling
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Close Split Lightbox Modal
function closeSplitLightbox(e) {
  if (e && e.target && e.target.id !== "story-lightbox") {
    return;
  }
  const modal = document.getElementById("story-lightbox");
  if (modal) {
    modal.style.display = "none";
  }
  isLightboxOpen = false;
  document.body.style.overflow = "";
  stopSpeech();
}

// Change language for right column
function changeLightboxLang(lang) {
  currentLightboxLang = lang;
  updateLightboxOtherContent();
  updateLightboxFooterContent();
  attachLightboxSentenceInteractions();
}

// Update Right Column Content based on selected language
function updateLightboxOtherContent() {
  const story = STORIES_DATA.find((s) => s.id === currentLightboxStoryId);
  if (!story) return;

  const contentBox = document.getElementById("lb-content-other");
  const audioBtn = document.getElementById("lb-btn-audio-other");
  if (!contentBox || !audioBtn) return;

  audioBtn.className = "slate-audio-btn";

  if (currentLightboxLang === "english" || currentLightboxLang === "normal") {
    contentBox.innerHTML = `
      <div class="text-english-body">
        ${story.lines.map((item, idx) => `
          <div class="lb-sentence sentence-normal" data-line-index="${idx}" title="Click to listen line in English">${highlightVocab(item.normal, item.vocab, "normal")}</div>
        `).join("")}
      </div>
    `;
    audioBtn.classList.add("btn-en");
    audioBtn.innerHTML = "🔊 Listen English";
    audioBtn.onclick = () => {
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, "normal");
      }
    };
  } else if (currentLightboxLang === "telugu") {
    contentBox.innerHTML = `
      <div class="text-telugu-body">
        ${story.lines.map((item, idx) => {
          const speak = item.teluguSpeak || '';
          const sub = item.teluguSub || '';
          return `
            <div class="lb-sentence sentence-te" data-line-index="${idx}" title="Click to listen line in Telugu">
              ${speak ? `<div class="speak-tamil-bold">${escapeHtml(speak)}</div>` : ''}
              ${sub ? `<div class="speak-en-sub phonetic-sub">(${escapeHtml(sub)})</div>` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;
    audioBtn.classList.add("btn-te");
    audioBtn.innerHTML = "🔊 தெலுங்கு ஒலி (Listen Telugu)";
    audioBtn.onclick = () => {
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, "telugu");
      }
    };
  } else if (currentLightboxLang === "kannada") {
    contentBox.innerHTML = `
      <div class="text-kannada-body">
        ${story.lines.map((item, idx) => {
          const speak = item.kannadaSpeak || '';
          const sub = item.kannadaSub || '';
          return `
            <div class="lb-sentence sentence-kn" data-line-index="${idx}" title="Click to listen line in Kannada">
              ${speak ? `<div class="speak-tamil-bold">${escapeHtml(speak)}</div>` : ''}
              ${sub ? `<div class="speak-en-sub phonetic-sub">(${escapeHtml(sub)})</div>` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;
    audioBtn.classList.add("btn-kn");
    audioBtn.innerHTML = "🔊 கன்னட ஒலி (Listen Kannada)";
    audioBtn.onclick = () => {
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, "kannada");
      }
    };
  } else if (currentLightboxLang === "hindi") {
    contentBox.innerHTML = `
      <div class="text-hindi-body">
        ${story.lines.map((item, idx) => {
          const speak = item.hindiSpeak || '';
          const sub = item.hindiSub || '';
          return `
            <div class="lb-sentence sentence-hi" data-line-index="${idx}" title="Click to listen line in Hindi">
              ${speak ? `<div class="speak-tamil-bold">${escapeHtml(speak)}</div>` : ''}
              ${sub ? `<div class="speak-en-sub phonetic-sub">(${escapeHtml(sub)})</div>` : ''}
            </div>
          `;
        }).join("")}
      </div>
    `;
    audioBtn.classList.add("btn-hi");
    audioBtn.innerHTML = "🔊 இந்தி ஒலி (Listen Hindi)";
    audioBtn.onclick = () => {
      if (isPlayingAll && activeSpeechIndex >= 0) {
        stopSpeech();
      } else {
        speakFullStoryFromIndex(0, "hindi");
      }
    };
  }
}

// Update Vocab & Summary Footer Content
function updateLightboxFooterContent() {
  const story = STORIES_DATA.find((s) => s.id === currentLightboxStoryId);
  const vocabBox = document.getElementById("lb-vocab-summary");
  if (!story || !vocabBox) return;

  const items = story.vocabComparison && story.vocabComparison.length ? story.vocabComparison : [];
  const summaryOther = story.summary ? (story.summary.normal || "") : "";
  const summaryTamil = story.summary ? (story.summary.tamil || "") : "";

  // Target language specifics
  let langHeaderTitle = "ஆங்கில சொல்லகராதி (English Vocab)";
  let langColHeader = "ஆங்கிலம்";
  let langSpeakKey = "normal";
  let langColor = "#38bdf8";

  if (currentLightboxLang === "telugu") {
    langHeaderTitle = "தெலுங்கு சொல்லகராதி (Telugu Vocab in Tamil)";
    langColHeader = "🗣️ தெலுங்கு (தமிழில் உச்சரிப்பு)";
    langSpeakKey = "teluguSpeak";
    langColor = "#38bdf8";
  } else if (currentLightboxLang === "kannada") {
    langHeaderTitle = "கன்னட சொல்லகராதி (Kannada Vocab in Tamil)";
    langColHeader = "🗣️ கன்னடம் (தமிழில் உச்சரிப்பு)";
    langSpeakKey = "kannadaSpeak";
    langColor = "#fb923c";
  } else if (currentLightboxLang === "hindi") {
    langHeaderTitle = "இந்தி சொல்லகராதி (Hindi Vocab in Tamil)";
    langColHeader = "🗣️ இந்தி (தமிழில் உச்சரிப்பு)";
    langSpeakKey = "hindiSpeak";
    langColor = "#c084fc";
  }

  let vocabTableHtml = "";
  if (items.length > 0) {
    vocabTableHtml = `
      <div class="lb-vocab-table-wrap">
        <div style="font-size: 0.82rem; font-weight: 700; color: #fbbf24; margin-bottom: 0.45rem; display: flex; align-items: center; justify-content: space-between; padding: 0.25rem 0.5rem 0;">
          <span>💎 ${langHeaderTitle}:</span>
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 500;">பட்டியல் முறை (Structured List)</span>
        </div>
        <table class="lb-vocab-mini-table">
          <thead>
            <tr>
              <th style="min-width: 140px;">ஆங்கில சொல் (English)</th>
              <th style="min-width: 150px;">தமிழ் அர்த்தம் (Meaning)</th>
              ${currentLightboxLang !== 'english' ? `<th style="min-width: 160px;">${langColHeader}</th>` : ''}
              <th style="width: 50px; text-align: center;">ஒலி</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((v) => {
              const spokenVal = v[langSpeakKey] || v[currentLightboxLang] || v.normal || "";
              const audioText = v[currentLightboxLang] || v[langSpeakKey] || v.normal;
              return `
                <tr>
                  <td><strong style="color: #f8fafc; font-size: 0.92rem;">${escapeHtml(v.normal)}</strong></td>
                  <td style="color: #6ee7b7; font-weight: 600; font-family: var(--font-ta);">${escapeHtml(v.tamil)}</td>
                  ${currentLightboxLang !== 'english' ? `
                    <td>
                      <span class="speak-tamil-bold" style="color: ${langColor}; font-size: 1rem; margin: 0; display: inline-block;">
                        ${escapeHtml(spokenVal)}
                      </span>
                    </td>
                  ` : ''}
                  <td style="text-align: center;">
                    <button class="btn-vocab-speak" data-lang="${currentLightboxLang}" data-text="${escapeHtml(audioText)}" title="🔊 உச்சரிப்பைக் கேட்க">🔊</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  vocabBox.innerHTML = `
    <div class="lb-summary-text">
      <strong>கதை சுருக்கம் (Summary):</strong> ${escapeHtml(summaryTamil)} &bull; <em>${escapeHtml(summaryOther)}</em>
    </div>
    ${vocabTableHtml}
  `;

  // Attach speech listeners for Lightbox vocab buttons
  vocabBox.querySelectorAll(".btn-vocab-speak").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const speakText = btn.getAttribute("data-text");
      const speakLang = btn.getAttribute("data-lang");
      speakCustomWord(speakText, speakLang);
    };
  });
}

// Toggle Lightbox Footer Drawer (Vocab & Summary)
function toggleLightboxFooter() {
  isLightboxFooterCollapsed = !isLightboxFooterCollapsed;
  updateLightboxFooterState();
}

function updateLightboxFooterState() {
  const drawer = document.getElementById("lb-footer-drawer");
  const toggleBtn = document.getElementById("lb-collapse-toggle-btn");
  const iconEl = document.getElementById("lb-collapse-icon");
  const textEl = document.getElementById("lb-collapse-text");

  if (!drawer || !toggleBtn) return;

  if (isLightboxFooterCollapsed) {
    drawer.classList.remove("is-expanded");
    toggleBtn.classList.remove("active");
    if (iconEl) iconEl.textContent = "✨";
    if (textEl) textEl.textContent = "கலைச்சொற்கள் & குறிப்பு (Vocab) ▲";
    toggleBtn.title = "கலைச்சொற்கள் & குறிப்புகளை விரிக்க (Expand)";
  } else {
    drawer.classList.add("is-expanded");
    toggleBtn.classList.add("active");
    if (iconEl) iconEl.textContent = "▼";
    if (textEl) textEl.textContent = "சுருக்கு (Collapse)";
    toggleBtn.title = "சுருக்குக (Collapse)";
  }
}

// Navigate Lightbox to Next or Previous Story
function navigateLightbox(direction) {
  const availableStories = getFilteredStories();
  const list = availableStories.length > 0 ? availableStories : STORIES_DATA;
  if (list.length === 0) return;

  const currentIdx = list.findIndex((s) => s.id === currentLightboxStoryId);
  let nextIdx = currentIdx + direction;
  if (nextIdx < 0) nextIdx = list.length - 1;
  if (nextIdx >= list.length) nextIdx = 0;

  openSplitLightbox(list[nextIdx].id, currentLightboxLang);
}

// Attach hover sync & line click to sentences in both columns
function attachLightboxSentenceInteractions() {
  const sentences = document.querySelectorAll("#storyLightboxContainer .lb-sentence");
  sentences.forEach((span) => {
    const idx = span.getAttribute("data-line-index");

    span.onmouseenter = () => {
      document.querySelectorAll(`#storyLightboxContainer .lb-sentence[data-line-index="${idx}"]`).forEach((s) => {
        s.classList.add("synced-highlight");
      });
    };

    span.onmouseleave = () => {
      document.querySelectorAll(`#storyLightboxContainer .lb-sentence[data-line-index="${idx}"]`).forEach((s) => {
        s.classList.remove("synced-highlight");
      });
    };

    span.onclick = (e) => {
      e.stopPropagation();
      const lineIdx = parseInt(idx, 10);
      const isLeft = span.closest(".lightbox-col-left") !== null;
      if (isLeft) {
        speakSingleLine(lineIdx, "tamil");
      } else {
        const mode = currentLightboxLang === "english" ? "normal" : currentLightboxLang;
        speakSingleLine(lineIdx, mode);
      }
    };
  });
}

// Backward-compatibility aliases
function openPanelLightbox(panelType) {
  const langMap = {
    tamil: "english",
    normal: "english",
    telugu: "telugu",
    kannada: "kannada",
    hindi: "hindi",
    advanced: "english"
  };
  openSplitLightbox(currentStory ? currentStory.id : null, langMap[panelType] || "english");
}

function closePanelLightbox() {
  closeSplitLightbox();
}

function copyCurrentLightboxText() {
  if (!currentLightboxStoryId) return;
  const story = STORIES_DATA.find((s) => s.id === currentLightboxStoryId);
  if (!story) return;

  let textToCopy = "";
  if (currentLightboxLang === "tamil") {
    textToCopy = story.lines.map((l) => l.tamil || "").join(" ");
  } else if (currentLightboxLang === "telugu") {
    textToCopy = story.lines.map((l) => l.teluguScript || l.telugu || l.teluguSpeak || "").join(" ");
  } else if (currentLightboxLang === "kannada") {
    textToCopy = story.lines.map((l) => l.kannadaScript || l.kannada || l.kannadaSpeak || "").join(" ");
  } else if (currentLightboxLang === "hindi") {
    textToCopy = story.lines.map((l) => l.hindiScript || l.hindi || l.hindiSpeak || "").join(" ");
  } else {
    textToCopy = story.lines.map((l) => l.normal || "").join(" ");
  }

  const onCopied = () => {
    if (elements.lightboxCopyText) elements.lightboxCopyText.textContent = "✓ Copied!";
    setTimeout(() => {
      if (elements.lightboxCopyText) elements.lightboxCopyText.textContent = "Copy";
    }, 2000);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => {
      fallbackCopy(textToCopy, onCopied);
    });
  } else {
    fallbackCopy(textToCopy, onCopied);
  }
}

function fallbackCopy(text, callback) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (callback) callback();
  } catch (err) {
    console.error("Copy failed", err);
  }
  document.body.removeChild(ta);
}

// Global window exposure for frictionless accessibility
window.englishApp = {
  openLightbox: openSplitLightbox,
  closeLightbox: closeSplitLightbox,
  changeLightboxLang: changeLightboxLang,
  toggleLightboxFooter: toggleLightboxFooter,
  navigateLightbox: navigateLightbox
};
window.openLightbox = openSplitLightbox;
window.closeLightbox = closeSplitLightbox;

// Set View Mode
function setViewMode(mode) {
  currentViewMode = mode;
  if (mode === "sentence") {
    elements.panelsGrid.style.display = "none";
    elements.sentenceModeContainer.classList.add("active");
    updateSentenceMode();
  } else {
    elements.panelsGrid.style.display = "grid";
    elements.sentenceModeContainer.classList.remove("active");
    highlightSyncedLines(currentSentenceIndex, true);
  }
}

// Set Language Panel Visibility (All 5 vs Tamil+English vs Spoken Practice)
function setLangView(view) {
  if (!elements.panelsGrid) return;
  elements.panelsGrid.classList.remove("view-all-5", "view-ta-en", "view-spoken");

  // Sync button states
  document.querySelectorAll(".lang-filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-view") === view);
  });

  if (view === "ta_en") {
    elements.panelsGrid.classList.add("view-ta-en");
    if (elements.panelTamil) elements.panelTamil.classList.remove("panel-hidden-by-filter");
    if (elements.panelNormal) elements.panelNormal.classList.remove("panel-hidden-by-filter");
    if (elements.panelTelugu) elements.panelTelugu.classList.add("panel-hidden-by-filter");
    if (elements.panelKannada) elements.panelKannada.classList.add("panel-hidden-by-filter");
    if (elements.panelHindi) elements.panelHindi.classList.add("panel-hidden-by-filter");
  } else if (view === "spoken") {
    elements.panelsGrid.classList.add("view-spoken");
    if (elements.panelTamil) elements.panelTamil.classList.add("panel-hidden-by-filter");
    if (elements.panelNormal) elements.panelNormal.classList.add("panel-hidden-by-filter");
    if (elements.panelTelugu) elements.panelTelugu.classList.remove("panel-hidden-by-filter");
    if (elements.panelKannada) elements.panelKannada.classList.remove("panel-hidden-by-filter");
    if (elements.panelHindi) elements.panelHindi.classList.remove("panel-hidden-by-filter");
  } else {
    // all
    elements.panelsGrid.classList.add("view-all-5");
    if (elements.panelTamil) elements.panelTamil.classList.remove("panel-hidden-by-filter");
    if (elements.panelNormal) elements.panelNormal.classList.remove("panel-hidden-by-filter");
    if (elements.panelTelugu) elements.panelTelugu.classList.remove("panel-hidden-by-filter");
    if (elements.panelKannada) elements.panelKannada.classList.remove("panel-hidden-by-filter");
    if (elements.panelHindi) elements.panelHindi.classList.remove("panel-hidden-by-filter");
  }
}

// Utility: Escape HTML
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
