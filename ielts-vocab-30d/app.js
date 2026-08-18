(function () {
  "use strict";

  const STORAGE_KEY = "shiwu-ielts-v1";
  const REVIEW_INTERVALS = [1, 3, 7, 14, 30];
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");

  const DAYS = window.VOCAB_DAYS_RAW.map(([topic, text], dayIndex) => ({
    day: dayIndex + 1,
    topic,
    words: text.trim().split(/\n+/).map((line, wordIndex) => {
      const [word, pos, meaning, collocation] = line.split("|");
      return { id: `d${dayIndex + 1}w${wordIndex + 1}`, day: dayIndex + 1, topic, word, pos, meaning, collocation };
    })
  }));
  const ALL_WORDS = DAYS.flatMap(day => day.words);
  const WORD_BY_ID = Object.fromEntries(ALL_WORDS.map(word => [word.id, word]));

  function defaultState() {
    return {
      version: 1,
      courseDay: 1,
      completedDays: [],
      startedAt: null,
      lastCompletionDate: null,
      streak: 0,
      session: null,
      words: {},
      totals: {
        meaning: { correct: 0, total: 0 },
        spelling: { correct: 0, total: 0 },
        context: { correct: 0, total: 0 },
        reviews: 0
      },
      dailyResults: []
    };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && parsed.version === 1 ? { ...defaultState(), ...parsed } : defaultState();
    } catch (_) {
      return defaultState();
    }
  }

  let state = loadState();
  let currentView = "today";
  let feedback = null;
  let spellingAttempts = 0;
  let selectedTopic = null;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function localDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(dateString, amount) {
    const date = new Date(`${dateString}T12:00:00`);
    date.setDate(date.getDate() + amount);
    return localDate(date);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sample(items, count, excluded = []) {
    const excludedSet = new Set(excluded);
    return shuffle(items.filter(item => !excludedSet.has(item.id))).slice(0, count);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      showToast("当前浏览器不支持语音播放");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.82;
    const voices = speechSynthesis.getVoices();
    const britishVoice = voices.find(voice => /^en-GB/i.test(voice.lang));
    if (britishVoice) utterance.voice = britishVoice;
    speechSynthesis.speak(utterance);
  }

  function dueWords() {
    const today = localDate();
    return Object.entries(state.words)
      .filter(([, record]) => record.dueDate && record.dueDate <= today)
      .map(([id]) => WORD_BY_ID[id])
      .filter(Boolean);
  }

  function getAccuracy(type) {
    const metric = state.totals[type];
    return metric.total ? Math.round(metric.correct / metric.total * 100) : 0;
  }

  function updateNav() {
    document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.view === currentView));
  }

  function render() {
    updateNav();
    if (currentView === "training") renderTraining();
    else if (currentView === "words") renderWords();
    else if (currentView === "report") renderReport();
    else renderToday();
    app.focus({ preventScroll: true });
  }

  function renderToday() {
    currentView = "today";
    updateNav();
    const completed = state.completedDays.length;
    const courseComplete = completed >= 30;
    const doneToday = state.lastCompletionDate === localDate();
    const reviewCount = dueWords().length;
    const day = DAYS[Math.min(state.courseDay - 1, 29)];
    const progress = Math.round(completed / 30 * 100);
    const learned = Object.keys(state.words).length;
    const latest = state.dailyResults[state.dailyResults.length - 1];

    let headline = `今天15分钟，<br>把15个词真正学会`;
    let copy = `先完成${reviewCount}个到期复习，再进入第${state.courseDay}天“${day.topic}”。系统会安排词义、拼写和语境练习。`;
    let button = `<button class="primary-btn" data-action="start">${state.session ? "继续今天的训练" : "开始今天的训练"} <span aria-hidden="true">→</span></button>`;

    if (doneToday && !courseComplete) {
      headline = `今天完成了，<br>记忆需要一点时间`;
      copy = `第${state.courseDay - 1}天训练已完成${latest ? `，小测${latest.score}分` : ""}。明天回来，系统会先安排需要复习的词。`;
      button = `<button class="primary-btn" disabled>明天继续第${state.courseDay}天</button>`;
    }
    if (courseComplete) {
      headline = `30天完成，<br>现在看真实结果`;
      copy = `你已经走完450词训练。报告会分别呈现认词、拼写和语境表现，方便决定下个月如何调整。`;
      button = `<button class="primary-btn" data-view="report">查看30天评估报告 <span aria-hidden="true">→</span></button>`;
    }

    app.innerHTML = `
      <section class="hero">
        <div class="panel hero-main">
          <span class="eyebrow">课程第 ${Math.min(state.courseDay, 30)} 天 · ${escapeHtml(day.topic)}</span>
          <h1>${headline}</h1>
          <p class="hero-copy">${copy}</p>
          ${button}
        </div>
        <aside class="panel hero-side" aria-label="课程进度">
          <div class="day-ring" style="--progress:${progress}%"><span>${completed}<small>/ 30 天</small></span></div>
          <div class="mini-stats">
            <div class="mini-stat"><strong>${state.streak}</strong><span>连续天数</span></div>
            <div class="mini-stat"><strong>${learned}</strong><span>已学词汇</span></div>
            <div class="mini-stat"><strong>${reviewCount}</strong><span>到期复习</span></div>
          </div>
        </aside>
      </section>

      <section class="section">
        <div class="section-head"><div><h2>今天怎么学</h2><p>顺序已经安排好，只需跟着完成。</p></div></div>
        <div class="task-grid">
          <article class="panel task-card"><div class="task-icon">↻</div><h3>先复习</h3><p><strong>${reviewCount}个到期词</strong><br>答错的词会在稍后再次出现。</p></article>
          <article class="panel task-card"><div class="task-icon">15</div><h3>再学新词</h3><p><strong>15个主题词</strong><br>每词练词义、听音拼写和搭配。</p></article>
          <article class="panel task-card"><div class="task-icon">✓</div><h3>最后小测</h3><p><strong>10道混合题</strong><br>80分达标，错题会继续强化。</p></article>
        </div>
      </section>
      <section class="panel course-note">
        <p><strong>一个重要提醒：</strong>本课程训练雅思常用词汇能力，不把打卡天数或正确率直接换算成雅思分数。</p>
        <button class="text-btn" data-view="report">查看学习数据</button>
      </section>`;
  }

  function makeStep(word, type, phase, extra = {}) {
    const pool = DAYS[word.day - 1].words;
    const distractors = sample(pool, 3, [word.id]);
    const options = type === "meaning"
      ? shuffle([word, ...distractors]).map(item => ({ value: item.id, label: item.meaning }))
      : type === "context"
        ? shuffle([word, ...distractors]).map(item => ({ value: item.id, label: item.word }))
        : [];
    return { wordId: word.id, type, phase, options, answered: false, firstCorrect: null, ...extra };
  }

  function weakestSkill(record) {
    const skills = ["meaning", "spelling", "context"];
    if (!record || !record.skills) return skills[Math.floor(Math.random() * skills.length)];
    return skills.sort((a, b) => {
      const aa = record.skills[a].total ? record.skills[a].correct / record.skills[a].total : 0;
      const bb = record.skills[b].total ? record.skills[b].correct / record.skills[b].total : 0;
      return aa - bb;
    })[0];
  }

  function buildSession() {
    const day = DAYS[state.courseDay - 1];
    const steps = [];
    dueWords().forEach(word => steps.push(makeStep(word, weakestSkill(state.words[word.id]), "review")));
    day.words.forEach(word => {
      steps.push({ wordId: word.id, type: "learn", phase: "learn", answered: false });
      steps.push(makeStep(word, "meaning", "practice"));
      steps.push(makeStep(word, "spelling", "practice"));
      steps.push(makeStep(word, "context", "practice"));
    });
    state.session = {
      day: state.courseDay,
      startedDate: localDate(),
      stage: "training",
      cursor: 0,
      steps,
      testScore: 0,
      testAnswered: 0,
      testMisses: [],
      testRound: 1
    };
    if (!state.startedAt) state.startedAt = localDate();
    saveState();
  }

  function startTraining() {
    if (state.lastCompletionDate === localDate() || state.completedDays.length >= 30) return;
    if (!state.session || state.session.day !== state.courseDay) buildSession();
    feedback = null;
    spellingAttempts = 0;
    currentView = "training";
    render();
  }

  function currentStep() {
    return state.session && state.session.steps[state.session.cursor];
  }

  function renderTraining() {
    if (!state.session) return renderToday();
    const session = state.session;
    const step = currentStep();
    if (!step) {
      if (session.stage === "training") return beginTest();
      return finishDay();
    }
    const word = WORD_BY_ID[step.wordId];
    const pct = Math.round(session.cursor / session.steps.length * 100);
    const labels = { learn: "认识新词", meaning: "词义辨认", spelling: "听音拼写", context: "语境搭配" };
    const phaseLabel = step.phase === "review" ? "到期复习" : step.phase === "test" ? `今日小测 · 第${session.testRound}轮` : step.phase === "reinforce" ? "错题强化" : labels[step.type];

    app.innerHTML = `
      <section class="training-wrap">
        <div class="training-head">
          <button class="back-btn" data-action="pause" aria-label="暂停并返回首页">←</button>
          <div class="training-progress">
            <div class="progress-meta"><span>${phaseLabel}</span><span>${session.cursor + 1} / ${session.steps.length}</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          </div>
        </div>
        <article class="panel training-card">${renderStep(step, word)}</article>
      </section>`;

    if (step.type === "spelling") {
      setTimeout(() => {
        speak(word.word);
        const input = document.getElementById("spell-input");
        if (input) input.focus();
      }, 180);
    }
  }

  function renderStep(step, word) {
    if (step.type === "learn") {
      return `
        <span class="step-label">第 ${word.day} 天 · ${escapeHtml(word.topic)}</span>
        <div class="word-line"><h1>${escapeHtml(word.word)}</h1><button class="sound-btn" data-speak="${escapeHtml(word.word)}" aria-label="播放${escapeHtml(word.word)}的发音">🔊</button></div>
        <div><span class="word-pos">${escapeHtml(word.pos)}</span></div>
        <p class="word-meaning">${escapeHtml(word.meaning)}</p>
        <div class="usage-box"><small>先记住这个常用搭配</small><strong>${escapeHtml(word.collocation)}</strong></div>
        <button class="primary-btn" data-action="next" style="align-self:flex-start;margin-top:28px">我看好了，开始练习</button>`;
    }
    if (step.type === "spelling") return renderSpelling(step, word);

    const isMeaning = step.type === "meaning";
    const prompt = isMeaning ? escapeHtml(word.word) : escapeHtml(blankCollocation(word));
    const help = isMeaning ? "请选择最准确的核心含义。" : "请选择能组成自然搭配的单词。";
    return `
      <span class="step-label">${step.phase === "review" ? "到期复习" : step.phase === "test" ? "今日小测" : "快速练习"}</span>
      <h2 class="question-title">${prompt}</h2>
      <p class="question-help">${help}</p>
      <div class="answers">
        ${step.options.map((option, index) => {
          const chosen = feedback && feedback.chosen === option.value;
          const correct = option.value === word.id;
          const cls = feedback ? (correct ? "correct" : chosen ? "wrong" : "") : "";
          return `<button class="answer-btn ${cls}" data-answer="${escapeHtml(option.value)}" ${feedback ? "disabled" : ""}><span>${String.fromCharCode(65 + index)}.</span> ${escapeHtml(option.label)}</button>`;
        }).join("")}
      </div>
      ${feedback ? `<div class="feedback ${feedback.correct ? "good" : "bad"}">${feedback.correct ? "回答正确。" : `正确答案是“${escapeHtml(isMeaning ? word.meaning : word.word)}”。这个词稍后还会再出现。`}</div><button class="primary-btn" data-action="next">继续</button>` : ""}`;
  }

  function blankCollocation(word) {
    const pattern = new RegExp(word.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    return pattern.test(word.collocation) ? word.collocation.replace(pattern, "______") : `______ · ${word.meaning}`;
  }

  function renderSpelling(step, word) {
    const first = word.word.charAt(0);
    const masked = word.word.split("").map((char, index) => index === 0 || char === " " || char === "-" ? char : "_").join(" ");
    let hint = "";
    if (spellingAttempts === 1) hint = `提示：首字母是 ${first.toUpperCase()}，共 ${word.word.replace(/[^a-z]/gi, "").length} 个字母。`;
    if (spellingAttempts >= 2) hint = `再看一眼：${masked}`;
    return `
      <span class="step-label">${step.phase === "review" ? "到期复习" : step.phase === "test" ? "今日小测" : "听音拼写"}</span>
      <div class="word-line"><h2 class="question-title">听发音，写出单词</h2><button class="sound-btn" data-speak="${escapeHtml(word.word)}" aria-label="再次播放发音">🔊</button></div>
      <p class="question-help">根据英式发音输入完整拼写，按回车提交。</p>
      <div class="spell-area">
        <label class="sr-only" for="spell-input">输入听到的英文单词</label>
        <input id="spell-input" class="spell-input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" ${feedback && feedback.correct ? "disabled" : ""}>
        <div class="hint">${hint}</div>
        ${feedback ? `<div class="feedback ${feedback.correct ? "good" : "bad"}">${feedback.message}</div>` : ""}
        ${feedback && feedback.correct ? `<button class="primary-btn" data-action="next">继续</button>` : `<button class="primary-btn" data-action="check-spelling">提交答案</button>`}
      </div>`;
  }

  function ensureWordRecord(word) {
    if (!state.words[word.id]) {
      state.words[word.id] = {
        learnedDay: word.day,
        dueDate: null,
        intervalIndex: 0,
        skills: {
          meaning: { correct: 0, total: 0 },
          spelling: { correct: 0, total: 0 },
          context: { correct: 0, total: 0 }
        }
      };
    }
    return state.words[word.id];
  }

  function recordAnswer(step, correct) {
    if (step.firstCorrect !== null) return;
    step.firstCorrect = correct;
    const record = ensureWordRecord(WORD_BY_ID[step.wordId]);
    record.skills[step.type].total += 1;
    state.totals[step.type].total += 1;
    if (correct) {
      record.skills[step.type].correct += 1;
      state.totals[step.type].correct += 1;
    }
    if (step.phase === "review") {
      state.totals.reviews += 1;
      if (correct) {
        record.intervalIndex = Math.min(record.intervalIndex + 1, REVIEW_INTERVALS.length - 1);
        record.dueDate = addDays(localDate(), REVIEW_INTERVALS[record.intervalIndex]);
      } else {
        record.intervalIndex = 0;
        record.dueDate = addDays(localDate(), 1);
      }
    }
    if (step.phase === "test") {
      state.session.testAnswered += 1;
      if (correct) state.session.testScore += 1;
      else state.session.testMisses.push(step.wordId);
    }
    saveState();
  }

  function answerChoice(value) {
    if (feedback) return;
    const step = currentStep();
    const correct = value === step.wordId;
    step.answered = true;
    recordAnswer(step, correct);
    feedback = { correct, chosen: value };
    if (!correct && step.phase !== "test") scheduleRetry(step);
    renderTraining();
  }

  function checkSpelling() {
    const input = document.getElementById("spell-input");
    if (!input || !input.value.trim()) return showToast("请先输入听到的单词");
    const step = currentStep();
    const word = WORD_BY_ID[step.wordId];
    const correct = input.value.trim().toLowerCase() === word.word.toLowerCase();
    if (step.firstCorrect === null) recordAnswer(step, correct);
    if (correct) {
      step.answered = true;
      feedback = { correct: true, message: spellingAttempts ? "拼写正确。刚才出错的地方已经重新记住了。" : "拼写完全正确。" };
      renderTraining();
      return;
    }
    spellingAttempts += 1;
    if (spellingAttempts === 1 && step.phase !== "test") scheduleRetry(step);
    feedback = { correct: false, message: spellingAttempts >= 3 ? `正确拼写是 ${escapeHtml(word.word)}。请看清后重新输入一遍。` : "还差一点。听一遍，再试一次。" };
    renderTraining();
    setTimeout(() => {
      const nextInput = document.getElementById("spell-input");
      if (nextInput) nextInput.focus();
      speak(word.word);
    }, 100);
  }

  function scheduleRetry(step) {
    if (step.retryScheduled || step.phase === "reinforce") return;
    step.retryScheduled = true;
    const retry = makeStep(WORD_BY_ID[step.wordId], step.type, "reinforce", { isRetry: true });
    const insertAt = Math.min(state.session.cursor + 5, state.session.steps.length);
    state.session.steps.splice(insertAt, 0, retry);
    saveState();
  }

  function nextStep() {
    const step = currentStep();
    if (!step) return;
    if (step.type !== "learn" && !step.answered && !(feedback && feedback.correct)) return;
    feedback = null;
    spellingAttempts = 0;
    state.session.cursor += 1;
    saveState();
    renderTraining();
  }

  function beginTest() {
    const session = state.session;
    const dayWords = DAYS[session.day - 1].words;
    const types = shuffle(["meaning", "meaning", "meaning", "meaning", "spelling", "spelling", "spelling", "context", "context", "context"]);
    const selected = sample(dayWords, 10);
    session.stage = "test";
    session.cursor = 0;
    session.steps = selected.map((word, index) => makeStep(word, types[index], "test"));
    session.testScore = 0;
    session.testAnswered = 0;
    session.testMisses = [];
    saveState();
    renderTraining();
  }

  function finishDay() {
    const session = state.session;
    if (session.stage === "test" && session.testRound === 1 && session.testScore < 8) {
      const missed = [...new Set(session.testMisses)].map(id => WORD_BY_ID[id]).filter(Boolean);
      const pool = missed.length ? missed : DAYS[session.day - 1].words;
      const selected = Array.from({ length: 5 }, (_, index) => pool[index % pool.length]);
      session.stage = "retest";
      session.testRound = 2;
      session.cursor = 0;
      session.steps = selected.map((word, index) => makeStep(word, ["meaning", "spelling", "context", "spelling", "context"][index], "test"));
      session.firstTestScore = session.testScore * 10;
      session.testScore = 0;
      session.testAnswered = 0;
      session.testMisses = [];
      feedback = null;
      saveState();
      showToast("未到80分，先用5道题强化错词");
      return renderTraining();
    }

    const today = localDate();
    const courseDay = session.day;
    const dayWords = DAYS[courseDay - 1].words;
    dayWords.forEach(word => {
      const record = ensureWordRecord(word);
      if (!record.dueDate) record.dueDate = addDays(today, 1);
    });
    const yesterday = addDays(today, -1);
    state.streak = state.lastCompletionDate === yesterday ? state.streak + 1 : state.lastCompletionDate === today ? state.streak : 1;
    state.lastCompletionDate = today;
    state.completedDays = [...new Set([...state.completedDays, courseDay])];
    const score = session.firstTestScore !== undefined ? session.firstTestScore : session.testScore * 10;
    state.dailyResults.push({ day: courseDay, date: today, score, retestScore: session.testRound === 2 ? session.testScore * 20 : null });
    state.courseDay = Math.min(courseDay + 1, 31);
    state.session = null;
    saveState();

    app.innerHTML = `
      <section class="training-wrap"><article class="panel training-card completion">
        <div class="completion-mark">✓</div>
        <span class="eyebrow">第 ${courseDay} 天完成</span>
        <h1>${score >= 80 ? "今天过关了" : "错题已经强化"}</h1>
        <div class="score">${score}<small style="font-size:18px"> 分</small></div>
        <p class="question-help">今天的15个词已进入复习计划。真正的记忆发生在下一次想起来的时候。</p>
        <button class="primary-btn" data-action="go-home" style="align-self:center">返回今日首页</button>
      </article></section>`;
  }

  function renderWords() {
    if (selectedTopic) return renderTopic();
    app.innerHTML = `
      <section class="section" style="margin-top:30px">
        <div class="section-head"><div><span class="eyebrow">30天 · 450词</span><h1 style="font-size:clamp(32px,5vw,48px)">主题词库</h1><p>完成当天训练后解锁词表。提前不展示答案，减少“看过就是会了”的错觉。</p></div></div>
        <div class="topic-list">
          ${DAYS.map(day => {
            const done = state.completedDays.includes(day.day);
            const current = day.day === state.courseDay;
            return `<button class="panel topic-card ${!done ? "locked" : ""}" ${done ? `data-topic="${day.day}"` : "disabled"}>
              <span class="topic-number">${String(day.day).padStart(2, "0")}</span>
              <span style="text-align:left"><h3>${escapeHtml(day.topic)}</h3><p>${done ? "已完成 · 查看15词" : current ? "今日学习内容" : "尚未解锁"}</p></span>
            </button>`;
          }).join("")}
        </div>
      </section>`;
  }

  function renderTopic() {
    const day = DAYS[selectedTopic - 1];
    if (!day || !state.completedDays.includes(day.day)) { selectedTopic = null; return renderWords(); }
    app.innerHTML = `
      <section class="section" style="margin-top:30px">
        <button class="text-btn" data-action="back-topics">← 返回主题词库</button>
        <div class="section-head"><div><span class="eyebrow">第 ${day.day} 天</span><h1 style="font-size:clamp(32px,5vw,48px)">${escapeHtml(day.topic)}</h1></div></div>
        <div class="topic-list">
          ${day.words.map(word => `<article class="panel topic-card"><span class="topic-number">${escapeHtml(word.pos)}</span><span><h3>${escapeHtml(word.word)}</h3><p>${escapeHtml(word.meaning)} · ${escapeHtml(word.collocation)}</p></span><button class="sound-btn" data-speak="${escapeHtml(word.word)}" aria-label="播放发音">🔊</button></article>`).join("")}
        </div>
      </section>`;
  }

  function renderReport() {
    const completed = state.completedDays.length;
    const learned = Object.keys(state.words).length;
    const avgScore = state.dailyResults.length ? Math.round(state.dailyResults.reduce((sum, item) => sum + item.score, 0) / state.dailyResults.length) : 0;
    const skills = [
      ["认词", getAccuracy("meaning")],
      ["拼写", getAccuracy("spelling")],
      ["语境", getAccuracy("context")]
    ];
    const weakest = [...skills].sort((a, b) => a[1] - b[1])[0];
    let conclusion = completed === 0 ? "完成第一天后，这里会出现真实学习数据。" : `目前相对薄弱的是“${weakest[0]}”（${weakest[1]}%）。下阶段应优先增加这一类复习。`;
    if (completed >= 30) conclusion = `30天训练已完成。${weakest[0]}是当前最需要继续加强的环节；建议结合一次正规的雅思模考，再决定下月词量和训练重点。`;

    app.innerHTML = `
      <section class="section" style="margin-top:30px">
        <div class="section-head"><div><span class="eyebrow">学习报告</span><h1 style="font-size:clamp(32px,5vw,48px)">${completed >= 30 ? "30天评估结果" : "进步要看得见"}</h1><p>${conclusion}</p></div>${completed ? `<button class="secondary-btn" data-action="print">打印报告</button>` : ""}</div>
        <div class="report-grid">
          <article class="panel report-stat"><strong>${completed}</strong><span>完成天数 / 30</span></article>
          <article class="panel report-stat"><strong>${learned}</strong><span>进入复习计划</span></article>
          <article class="panel report-stat"><strong>${state.totals.reviews}</strong><span>到期复习题</span></article>
          <article class="panel report-stat"><strong>${avgScore}</strong><span>每日小测均分</span></article>
        </div>
        <article class="panel chart-card">
          <h2>三项词汇能力</h2>
          <p class="question-help">正确率来自实际答题，不由主观点击“认识”计算。</p>
          ${skills.map(([name, pct]) => `<div class="skill-row"><strong>${name}</strong><div class="skill-bar"><span style="width:${pct}%"></span></div><b>${pct}%</b></div>`).join("")}
        </article>
        <article class="panel chart-card">
          <h2>30天足迹</h2>
          <div class="days-grid">${DAYS.map(day => `<div class="day-cell ${state.completedDays.includes(day.day) ? "done" : day.day === state.courseDay ? "current" : ""}" title="第${day.day}天 ${escapeHtml(day.topic)}">${day.day}</div>`).join("")}</div>
        </article>
        <article class="panel course-note">
          <p><strong>评估边界：</strong>本报告只能说明这450个词的认读、拼写和搭配表现，不能换算为雅思总分。完成30天后，建议再用一次正规模考检查听、说、读、写。</p>
          ${completed ? `<button class="text-btn" data-action="reset">重新开始课程</button>` : ""}
        </article>
      </section>`;
  }

  document.addEventListener("click", event => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      const view = viewButton.dataset.view;
      if (view === "today" || view === "words" || view === "report") {
        currentView = view;
        selectedTopic = null;
        render();
      }
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === "start") startTraining();
      if (action === "next") nextStep();
      if (action === "check-spelling") checkSpelling();
      if (action === "pause" || action === "go-home") { currentView = "today"; render(); }
      if (action === "back-topics") { selectedTopic = null; renderWords(); }
      if (action === "print") window.print();
      if (action === "reset" && confirm("确定重新开始吗？当前设备上的全部学习记录将被清除，且无法恢复。")) {
        localStorage.removeItem(STORAGE_KEY);
        state = defaultState();
        currentView = "today";
        render();
      }
      return;
    }
    const answer = event.target.closest("[data-answer]");
    if (answer) return answerChoice(answer.dataset.answer);
    const speaker = event.target.closest("[data-speak]");
    if (speaker) return speak(speaker.dataset.speak);
    const topic = event.target.closest("[data-topic]");
    if (topic) { selectedTopic = Number(topic.dataset.topic); return renderWords(); }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Enter" && document.activeElement && document.activeElement.id === "spell-input") {
      event.preventDefault();
      checkSpelling();
    }
    if (!feedback && /^[1-4]$/.test(event.key)) {
      const buttons = [...document.querySelectorAll("[data-answer]")];
      const button = buttons[Number(event.key) - 1];
      if (button) answerChoice(button.dataset.answer);
    }
  });

  if (DAYS.length !== 30 || ALL_WORDS.length !== 450) {
    app.innerHTML = `<div class="panel empty-state">词库数据校验未通过，请联系维护者。</div>`;
  } else {
    render();
  }
})();
