// Interactive Smart Quiz Engine with Streaks, Sound FX & Confetti

class QuizEngine {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.highestStreak = 0;
    this.answered = false;
    this.container = document.getElementById('quiz-container');
  }

  start(questionsList, langName = 'Quiz') {
    this.questions = [...questionsList];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.highestStreak = 0;
    this.answered = false;
    this.langName = langName;
    this.render();
  }

  selectOption(index) {
    if (this.answered) return;
    this.answered = true;

    const q = this.questions[this.currentIndex];
    const isCorrect = (index === q.correctIndex);

    const optionBtns = document.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) {
        btn.classList.add('correct');
      } else if (i === index) {
        btn.classList.add('wrong');
      }
    });

    if (isCorrect) {
      this.score += 10;
      this.streak += 1;
      if (this.streak > this.highestStreak) {
        this.highestStreak = this.streak;
      }
      window.bhashaAudio.playSfx('correct');
      window.bhashaApp.incrementQuizzes();
    } else {
      this.streak = 0;
      window.bhashaAudio.playSfx('wrong');
    }

    const feedbackEl = document.getElementById('quiz-feedback');
    if (feedbackEl) {
      feedbackEl.classList.remove('hidden');
      feedbackEl.innerHTML = `
        <div class="feedback-badge ${isCorrect ? 'fb-correct' : 'fb-wrong'}">
          ${isCorrect ? '🎉 மிகச் சரி! (Correct)' : '❌ தவறான பதில் (Incorrect)'}
        </div>
        <div class="feedback-expl">${q.explanation}</div>
        <button class="btn btn-primary btn-next-q" onclick="window.quizEngine.nextQuestion()">
          ${this.currentIndex < this.questions.length - 1 ? 'அடுத்த கேள்வி ▶' : 'முடிவுகளைப் பார் 🏆'}
        </button>
      `;
    }

    // Update streak display
    this.updateStatsBar();
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.answered = false;
      window.bhashaAudio.playSfx('click');
      this.render();
    } else {
      this.showResults();
    }
  }

  updateStatsBar() {
    const streakEl = document.getElementById('quiz-streak');
    const scoreEl = document.getElementById('quiz-score');
    if (streakEl) {
      streakEl.innerHTML = `🔥 ${this.streak} தொடர் வெற்றி`;
    }
    if (scoreEl) {
      scoreEl.innerHTML = `⭐ ${this.score} புள்ளிகள்`;
    }
  }

  showResults() {
    window.bhashaAudio.playSfx('celebrate');
    this.launchConfetti();

    const totalPossible = this.questions.length * 10;
    const percentage = Math.round((this.score / totalPossible) * 100);

    let message = '';
    let medal = '🥉';
    if (percentage >= 80) {
      medal = '🥇';
      message = 'அற்புதம்! நீங்கள் மிகச் சிறப்பாகக் கற்றுக்கொண்டு வருகிறீர்கள்!';
    } else if (percentage >= 50) {
      medal = '🥈';
      message = 'நல்ல முயற்சி! மீண்டும் ஒருமுறை பயிற்சி செய்தால் மேலும் நன்றாக நினைவிருக்கும்.';
    } else {
      medal = '🥉';
      message = 'கவலை வேண்டாம்! தொடர் பயிற்சியே மொழியைக் கற்றுக்கொடுக்கும்.';
    }

    this.container.innerHTML = `
      <div class="quiz-results-card">
        <div class="results-medal">${medal}</div>
        <h2 class="results-title">வினாடி வினா நிறைவடைந்தது!</h2>
        <p class="results-desc">${message}</p>

        <div class="results-stats-grid">
          <div class="res-stat-item">
            <div class="res-stat-val">${this.score} / ${totalPossible}</div>
            <div class="res-stat-label">மொத்த மதிப்பெண்</div>
          </div>
          <div class="res-stat-item">
            <div class="res-stat-val">${percentage}%</div>
            <div class="res-stat-label">வெற்றி விகிதம்</div>
          </div>
          <div class="res-stat-item">
            <div class="res-stat-val">${this.highestStreak} 🔥</div>
            <div class="res-stat-label">அதிகபட்ச தொடர் வெற்றி</div>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn btn-primary" onclick="window.quizEngine.start(window.quizEngine.questions, window.quizEngine.langName)">
            🔄 மீண்டும் பயிற்சி செய்
          </button>
          <button class="btn btn-outline" onclick="window.bhashaApp.switchTab('matrix')">
            📚 மொழி ஒப்பீட்டு அட்டவணைக்குச் செல்
          </button>
        </div>
      </div>
    `;
  }

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 50,
        r: Math.random() * 6 + 4,
        d: Math.random() * 90,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        tiltAngle: 0
      });
    }

    let animationFrame;
    let duration = 0;

    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      duration++;

      particles.forEach(p => {
        p.tiltAngle += p.tiltAngleInc;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) * 1.2;
        p.x += Math.sin(p.d) * 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });

      if (duration < 180) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    };

    renderConfetti();
  }

  render() {
    if (!this.container) return;
    if (this.questions.length === 0) {
      this.container.innerHTML = `<div class="empty-state">கேள்விகள் எதுவும் இல்லை.</div>`;
      return;
    }

    const q = this.questions[this.currentIndex];
    const total = this.questions.length;
    const current = this.currentIndex + 1;

    let optionsHtml = q.options.map((opt, idx) => `
      <button class="quiz-option-btn" onclick="window.quizEngine.selectOption(${idx})">
        <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
        <span class="opt-text">${opt}</span>
      </button>
    `).join('');

    this.container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-meta-bar">
          <span class="quiz-lang-tag">${this.langName}</span>
          <div class="quiz-progress-label">கேள்வி ${current} / ${total}</div>
          <div class="quiz-stats-group">
            <span class="stat-pill" id="quiz-streak">🔥 ${this.streak} தொடர்</span>
            <span class="stat-pill" id="quiz-score">⭐ ${this.score} புள்ளி</span>
          </div>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-fill" style="width: ${(current / total) * 100}%"></div>
        </div>

        <div class="quiz-question-box">
          <h3 class="quiz-q-text">${q.question}</h3>
        </div>

        <div class="quiz-options-list">
          ${optionsHtml}
        </div>

        <div id="quiz-feedback" class="quiz-feedback-box hidden"></div>
      </div>
    `;
  }
}

window.quizEngine = new QuizEngine();
