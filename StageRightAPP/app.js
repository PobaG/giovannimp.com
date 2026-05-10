const laneMeta = window.StageRightData.LANE_META;
const lessons = window.StageRightData.LESSONS;
const stageItems = window.StageRightData.STAGE_ITEMS;

const MAX_LIVES = 4;
const XP_PER_CORRECT = 10;
const QUESTION_TYPES = ["image", "scenario", "purpose"];

const IMAGE_PROMPTS = [
  "What is shown below?",
  "Name the gear shown below.",
  "Which piece of stage gear is this?"
];

const SCENARIO_PROMPTS = [
  "Which item fits this call?",
  "What piece of gear matches this use?",
  "What would you grab for this situation?"
];

const PURPOSE_PROMPTS = [
  "What is this item mainly used for?",
  "Which description best matches this gear?",
  "Pick the best use for this item."
];

const state = {
  selectedLessonId: "mixed",
  sessionLabel: "",
  activeScreen: "welcome",
  lives: MAX_LIVES,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  correct: 0,
  answered: 0,
  totalQuestions: 0,
  queue: [],
  currentQuestion: null,
  sourceItems: [],
  locked: false,
  missedCounts: new Map(),
  retryCounts: new Map(),
  lastMissedIds: [],
  libraryFilter: "all"
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindEvents();
  renderLessons();
  renderLibraryFilters();
  selectLesson(state.selectedLessonId);
  showScreen("welcome");
  renderLibrary();
}

function cacheElements() {
  elements.lessonList = document.getElementById("lessonList");
  elements.statusLesson = document.getElementById("statusLesson");
  elements.statusLives = document.getElementById("statusLives");
  elements.statusStreak = document.getElementById("statusStreak");
  elements.statusXp = document.getElementById("statusXp");
  elements.courseLessonHeading = document.getElementById("courseLessonHeading");
  elements.courseLessonMeta = document.getElementById("courseLessonMeta");
  elements.courseProgressFill = document.getElementById("courseProgressFill");
  elements.courseProgressValue = document.getElementById("courseProgressValue");
  elements.courseProgressMeta = document.getElementById("courseProgressMeta");
  elements.courseProgressPill = document.getElementById("courseProgressPill");

  elements.welcomeScreen = document.getElementById("welcomeScreen");
  elements.welcomeTitle = document.getElementById("welcomeTitle");
  elements.welcomeBlurb = document.getElementById("welcomeBlurb");
  elements.welcomeItems = document.getElementById("welcomeItems");
  elements.welcomeQuestions = document.getElementById("welcomeQuestions");
  elements.startLessonButton = document.getElementById("startLessonButton");
  elements.welcomeReviewButton = document.getElementById("welcomeReviewButton");

  elements.quizScreen = document.getElementById("quizScreen");
  elements.progressFill = document.getElementById("progressFill");
  elements.progressIndex = document.getElementById("progressIndex");
  elements.progressTotal = document.getElementById("progressTotal");
  elements.questionLane = document.getElementById("questionLane");
  elements.questionType = document.getElementById("questionType");
  elements.questionPrompt = document.getElementById("questionPrompt");
  elements.questionStage = document.getElementById("questionStage");
  elements.choiceList = document.getElementById("choiceList");
  elements.feedbackBox = document.getElementById("feedbackBox");
  elements.feedbackTitle = document.getElementById("feedbackTitle");
  elements.feedbackBody = document.getElementById("feedbackBody");
  elements.continueButton = document.getElementById("continueButton");

  elements.summaryScreen = document.getElementById("summaryScreen");
  elements.summaryTitle = document.getElementById("summaryTitle");
  elements.summaryCopy = document.getElementById("summaryCopy");
  elements.summaryAccuracy = document.getElementById("summaryAccuracy");
  elements.summaryCorrect = document.getElementById("summaryCorrect");
  elements.summaryBestStreak = document.getElementById("summaryBestStreak");
  elements.summaryXp = document.getElementById("summaryXp");
  elements.summaryReplayButton = document.getElementById("summaryReplayButton");
  elements.summaryMissesButton = document.getElementById("summaryMissesButton");
  elements.missesList = document.getElementById("missesList");

  elements.libraryFilters = document.getElementById("libraryFilters");
  elements.libraryGrid = document.getElementById("libraryGrid");
}

function bindEvents() {
  elements.startLessonButton.addEventListener("click", () => {
    startSession(getLessonItems(state.selectedLessonId), false);
  });

  elements.welcomeReviewButton.addEventListener("click", () => {
    startReviewSession();
  });

  elements.continueButton.addEventListener("click", advanceAfterFeedback);

  elements.summaryReplayButton.addEventListener("click", () => {
    startSession(getLessonItems(state.selectedLessonId), false);
  });

  elements.summaryMissesButton.addEventListener("click", () => {
    startReviewSession();
  });
}

function renderLessons() {
  elements.lessonList.innerHTML = "";

  lessons.forEach((lesson) => {
    const lessonItems = getLessonItems(lesson.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `lesson-button${lesson.id === state.selectedLessonId ? " active" : ""}`;
    button.innerHTML = `
      <div class="lesson-button-head">
        <span class="lesson-button-title">${lesson.title}</span>
        <span class="lesson-button-count">${lessonItems.length}</span>
      </div>
      <p>${lesson.blurb}</p>
    `;
    button.addEventListener("click", () => selectLesson(lesson.id));
    elements.lessonList.append(button);
  });
}

function renderLibraryFilters() {
  const filters = [
    { id: "all", label: "All gear" },
    { id: "power", label: "Power" },
    { id: "signal", label: "Signal" },
    { id: "lighting", label: "Lighting" },
    { id: "rigging", label: "Rigging" },
    { id: "audio", label: "Audio" }
  ];

  elements.libraryFilters.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `library-chip${filter.id === state.libraryFilter ? " active" : ""}`;
    button.textContent = filter.label;
    button.addEventListener("click", () => {
      state.libraryFilter = filter.id;
      renderLibraryFilters();
      renderLibrary();
    });
    elements.libraryFilters.append(button);
  });
}

function renderLibrary() {
  const items = stageItems
    .filter((item) => state.libraryFilter === "all" || item.lane === state.libraryFilter)
    .slice()
    .sort((left, right) => {
      if (left.lane === right.lane) {
        return left.name.localeCompare(right.name);
      }
      return left.lane.localeCompare(right.lane);
    });

  elements.libraryGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "library-card-item";

    const artShell = document.createElement("div");
    artShell.className = "library-art-shell";
    mountVisual(artShell, item);

    const body = document.createElement("div");
    body.className = "library-body";
    body.innerHTML = `
      <div class="library-meta">
        <span class="library-lane">${laneMeta[item.lane].label}</span>
        <strong>${item.group}</strong>
      </div>
      <h3>${item.name}</h3>
      <p>${item.useLine}</p>
    `;

    card.append(artShell, body);
    elements.libraryGrid.append(card);
  });
}

function selectLesson(lessonId) {
  state.selectedLessonId = lessonId;
  state.sessionLabel = "";
  renderLessons();
  renderWelcome();
  updateStatus();
}

function renderWelcome() {
  const lesson = getLesson(state.selectedLessonId);
  const lessonItems = getLessonItems(lesson.id);

  elements.welcomeTitle.textContent = lesson.title;
  elements.welcomeBlurb.textContent = lesson.blurb;
  elements.welcomeItems.textContent = `${lessonItems.length} items`;
  elements.welcomeQuestions.textContent = `${lesson.questionCount} questions`;
  elements.welcomeReviewButton.disabled = state.lastMissedIds.length === 0;
  elements.welcomeReviewButton.textContent = state.lastMissedIds.length === 0 ? "Review Misses" : `Review Misses (${state.lastMissedIds.length})`;
  updateCourseHeader();
}

function startSession(sourceItems, reviewOnly) {
  if (!sourceItems.length) {
    return;
  }

  const lesson = getLesson(state.selectedLessonId);
  const targetCount = reviewOnly ? Math.min(8, Math.max(sourceItems.length, 4)) : lesson.questionCount;

  state.sessionLabel = reviewOnly ? "Misses Review" : lesson.title;
  state.sourceItems = sourceItems.slice();
  state.lives = MAX_LIVES;
  state.streak = 0;
  state.bestStreak = 0;
  state.correct = 0;
  state.answered = 0;
  state.xp = 0;
  state.locked = false;
  state.missedCounts = new Map();
  state.retryCounts = new Map();
  state.queue = buildQuestionQueue(sourceItems, targetCount);
  state.totalQuestions = state.queue.length;
  state.currentQuestion = null;

  updateStatus();
  showScreen("quiz");
  loadNextQuestion();
}

function startReviewSession() {
  const reviewItems = stageItems.filter((item) => state.lastMissedIds.includes(item.id));
  if (!reviewItems.length) {
    return;
  }
  startSession(reviewItems, true);
}

function buildQuestionQueue(sourceItems, count) {
  const queue = [];
  const items = shuffle(sourceItems.slice());
  const typeTracker = new Map();
  let pointer = 0;

  while (queue.length < count) {
    const item = items[pointer % items.length];
    const usedTypes = typeTracker.get(item.id) || [];
    let availableTypes = QUESTION_TYPES.filter((type) => !usedTypes.includes(type));

    if (!availableTypes.length) {
      availableTypes = QUESTION_TYPES.slice();
    }

    const type = randomItem(availableTypes);
    const question = buildQuestion(item, type, sourceItems);
    queue.push(question);
    typeTracker.set(item.id, usedTypes.concat(type));
    pointer += 1;
  }

  return shuffle(queue);
}

function buildQuestion(item, type, sourceItems) {
  const choicePool = sourceItems.length >= 3 ? sourceItems : getBroaderChoicePool(item);
  const distractors = pickDistractors(item, choicePool, 2);

  if (type === "image") {
    return {
      type,
      typeLabel: "Picture ID",
      prompt: randomItem(IMAGE_PROMPTS),
      item,
      answerId: item.id,
      choices: shuffle([item, ...distractors]).map((choiceItem) => ({
        id: choiceItem.id,
        label: choiceItem.name
      })),
      panel: {
        kind: "visual",
        item
      }
    };
  }

  if (type === "scenario") {
    return {
      type,
      typeLabel: "Crew Call",
      prompt: randomItem(SCENARIO_PROMPTS),
      item,
      answerId: item.id,
      choices: shuffle([item, ...distractors]).map((choiceItem) => ({
        id: choiceItem.id,
        label: choiceItem.name
      })),
      panel: {
        kind: "scenario",
        title: "On site",
        body: item.scenario
      }
    };
  }

  return {
    type,
    typeLabel: "Definition",
    prompt: randomItem(PURPOSE_PROMPTS),
    item,
    answerId: item.id,
    choices: shuffle([item, ...distractors]).map((choiceItem) => ({
      id: choiceItem.id,
      label: choiceItem.useLine
    })),
    panel: {
      kind: "name",
      title: item.name,
      body: item.aliases.length ? `Also called: ${item.aliases.join(", ")}` : item.group
    }
  };
}

function getBroaderChoicePool(item) {
  const laneItems = stageItems.filter((candidate) => candidate.lane === item.lane);
  return laneItems.length >= 3 ? laneItems : stageItems;
}

function pickDistractors(item, pool, count) {
  const primary = shuffle(
    pool.filter((candidate) => candidate.id !== item.id && (candidate.lane === item.lane || candidate.group === item.group))
  );
  const secondary = shuffle(pool.filter((candidate) => candidate.id !== item.id && !primary.includes(candidate)));
  return primary.concat(secondary).slice(0, count);
}

function loadNextQuestion() {
  if (!state.queue.length || state.lives <= 0) {
    finishSession();
    return;
  }

  state.currentQuestion = state.queue.shift();
  state.locked = false;
  elements.feedbackBox.className = "feedback is-hidden";
  renderQuestion();
}

function renderQuestion() {
  const question = state.currentQuestion;
  const questionNumber = state.answered + 1;
  const progressRatio = state.totalQuestions ? state.answered / state.totalQuestions : 0;

  elements.progressFill.style.width = `${Math.max(progressRatio * 100, 4)}%`;
  elements.progressIndex.textContent = questionNumber;
  elements.progressTotal.textContent = state.totalQuestions;
  elements.questionLane.textContent = laneMeta[question.item.lane].studyLabel;
  elements.questionType.textContent = question.typeLabel;
  elements.questionPrompt.textContent = question.prompt;

  renderQuestionPanel(question.panel);

  elements.choiceList.innerHTML = "";
  question.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.dataset.choiceId = choice.id;
    button.innerHTML = `
      <span class="choice-index">${index + 1}</span>
      <span>${choice.label}</span>
    `;
    button.addEventListener("click", () => answerQuestion(choice.id));
    elements.choiceList.append(button);
  });

  updateStatus();
}

function renderQuestionPanel(panel) {
  elements.questionStage.innerHTML = "";

  if (panel.kind === "visual") {
    const shell = document.createElement("div");
    shell.className = "stage-panel";
    mountVisual(shell, panel.item);
    elements.questionStage.append(shell);
    return;
  }

  const textPanel = document.createElement("div");
  textPanel.className = `text-stage${panel.kind === "scenario" ? " scenario" : ""}`;
  textPanel.innerHTML = `
    <span class="text-stage-label">${panel.kind === "scenario" ? "Crew call" : "Gear name"}</span>
    <h3>${panel.title}</h3>
    <p>${panel.body}</p>
  `;
  elements.questionStage.append(textPanel);
}

function answerQuestion(choiceId) {
  if (state.locked) {
    return;
  }

  state.locked = true;
  state.answered += 1;

  const question = state.currentQuestion;
  const isCorrect = choiceId === question.answerId;
  const buttons = Array.from(elements.choiceList.querySelectorAll(".choice-button"));

  buttons.forEach((button) => {
    button.classList.add("locked");
    const buttonChoiceId = button.dataset.choiceId;
    if (buttonChoiceId === question.answerId) {
      button.classList.add("correct");
    } else if (buttonChoiceId === choiceId && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.xp += XP_PER_CORRECT;
    showFeedback(true, `${question.item.name} locked in.`, question.item.useLine);
  } else {
    state.lives -= 1;
    state.streak = 0;
    state.missedCounts.set(question.item.id, (state.missedCounts.get(question.item.id) || 0) + 1);
    queueRetry(question);
    showFeedback(false, `That one was ${question.item.name}.`, question.item.useLine);
  }

  updateStatus();
}

function showFeedback(isCorrect, title, body) {
  elements.feedbackBox.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  elements.feedbackTitle.textContent = title;
  elements.feedbackBody.textContent = body;
  elements.continueButton.textContent = state.lives <= 0 || !state.queue.length ? "See Results" : "Continue";
}

function queueRetry(question) {
  const currentRetries = state.retryCounts.get(question.item.id) || 0;
  if (currentRetries >= 2) {
    return;
  }

  const retryType = QUESTION_TYPES.find((type) => type !== question.type) || "image";
  const retryQuestion = buildQuestion(question.item, retryType, state.sourceItems);
  const insertAt = Math.min(2, state.queue.length);
  state.queue.splice(insertAt, 0, retryQuestion);
  state.retryCounts.set(question.item.id, currentRetries + 1);
  state.totalQuestions += 1;
}

function advanceAfterFeedback() {
  if (!state.locked) {
    return;
  }
  loadNextQuestion();
}

function finishSession() {
  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  const missedIds = Array.from(state.missedCounts.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([itemId]) => itemId);

  state.lastMissedIds = missedIds;
  state.sessionLabel = "";

  elements.summaryAccuracy.textContent = `${accuracy}%`;
  elements.summaryCorrect.textContent = `${state.correct} / ${state.answered}`;
  elements.summaryBestStreak.textContent = String(state.bestStreak);
  elements.summaryXp.textContent = String(state.xp);

  if (accuracy >= 85) {
    elements.summaryTitle.textContent = "Solid crew-call recall";
    elements.summaryCopy.textContent = "You are moving through the names quickly. Run another lane or switch to misses-only review to tighten the last few weak spots.";
  } else if (accuracy >= 60) {
    elements.summaryTitle.textContent = "Good base, keep drilling";
    elements.summaryCopy.textContent = "The names are starting to stick, but a few items still need extra reps. The review button below pulls those misses into a shorter round.";
  } else {
    elements.summaryTitle.textContent = "Prime it again";
    elements.summaryCopy.textContent = "This round exposed the weak spots clearly, which is useful. Run the misses-only review and let the recycled questions do the work.";
  }

  renderMissesList(missedIds);
  elements.summaryMissesButton.disabled = missedIds.length === 0;
  showScreen("summary");
  updateStatus();
  renderWelcome();
}

function renderMissesList(missedIds) {
  elements.missesList.innerHTML = "";

  if (!missedIds.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No misses this round. Switch lessons or rerun the same lane for more reps.";
    elements.missesList.append(empty);
    return;
  }

  missedIds.forEach((itemId) => {
    const item = findItem(itemId);
    const card = document.createElement("div");
    card.className = "miss-item";
    card.innerHTML = `
      <strong>${item.name}</strong>
      <p>${item.useLine}</p>
    `;
    elements.missesList.append(card);
  });
}

function showScreen(screenName) {
  state.activeScreen = screenName;
  elements.welcomeScreen.classList.toggle("is-hidden", screenName !== "welcome");
  elements.quizScreen.classList.toggle("is-hidden", screenName !== "quiz");
  elements.summaryScreen.classList.toggle("is-hidden", screenName !== "summary");
  updateCourseHeader();
}

function updateStatus() {
  const lesson = getLesson(state.selectedLessonId);
  elements.statusLesson.textContent = state.sessionLabel || lesson.title;
  elements.statusLives.textContent = String(Math.max(state.lives, 0));
  elements.statusStreak.textContent = String(state.streak);
  elements.statusXp.textContent = String(state.xp);
  updateCourseHeader();
}

function updateCourseHeader() {
  const lesson = getLesson(state.selectedLessonId);
  const lessonItems = getLessonItems(lesson.id);
  const currentTitle = state.sessionLabel || lesson.title;
  let progressPercent = 100;
  let progressValue = "READY TO DRILL";
  let progressMeta = `${lessonItems.length} items in active lesson`;
  let progressPill = "READY";
  let lessonMeta = lesson.blurb;

  if (state.sessionLabel === "Misses Review") {
    lessonMeta = "A shorter rep cycle built from the items you missed in the last run.";
  }

  if (state.activeScreen === "quiz" && state.totalQuestions) {
    const completed = Math.min(state.answered, state.totalQuestions);
    progressPercent = Math.max((completed / state.totalQuestions) * 100, 8);
    progressValue = `${Math.round((completed / state.totalQuestions) * 100)}% COMPLETE`;
    progressMeta = `Question ${Math.min(completed + 1, state.totalQuestions)} of ${state.totalQuestions}`;
    progressPill = "LIVE";
  } else if (state.activeScreen === "summary" && state.answered) {
    const accuracy = Math.round((state.correct / state.answered) * 100);
    progressPercent = 100;
    progressValue = `${accuracy}% ACCURACY`;
    progressMeta = `${state.correct} correct out of ${state.answered} attempts`;
    progressPill = "COMPLETE";
  }

  elements.courseLessonHeading.textContent = currentTitle;
  elements.courseLessonMeta.textContent = lessonMeta;
  elements.courseProgressFill.style.width = `${progressPercent}%`;
  elements.courseProgressValue.textContent = progressValue;
  elements.courseProgressMeta.textContent = progressMeta;
  elements.courseProgressPill.textContent = progressPill;
}

function getLesson(lessonId) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

function getLessonItems(lessonId) {
  const lesson = getLesson(lessonId);
  return stageItems.filter((item) => lesson.lanes.includes(item.lane));
}

function findItem(itemId) {
  return stageItems.find((item) => item.id === itemId);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  const array = items.slice();
  for (let index = array.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]];
  }
  return array;
}

function mountVisual(container, item) {
  if (item.photo) {
    const image = new Image();
    image.className = "gear-photo";
    image.alt = item.name;
    image.src = item.photo;
    image.addEventListener("error", () => {
      container.innerHTML = renderArt(item);
    });
    image.addEventListener("load", () => {
      container.innerHTML = "";
      container.append(image);
    });
    container.append(image);
    return;
  }

  container.innerHTML = renderArt(item);
}

function renderArt(item) {
  switch (item.art.kind) {
    case "power_bundle":
      return frameSvg(item, renderPowerBundle(item.art.accent));
    case "multipin":
      return frameSvg(item, renderMultipin(item.art.accent));
    case "fanout":
      return frameSvg(item, renderFanout(item.art.accent));
    case "connector_coil":
      return frameSvg(item, renderConnectorCoil(item.art.variant, item.art.accent));
    case "fixture_cyl":
      return frameSvg(item, renderFixtureCylinder(item.art.variant, item.art.accent));
    case "fixture_panel":
      return frameSvg(item, renderFixturePanel(item.art.variant, item.art.accent));
    case "moving_head":
      return frameSvg(item, renderMovingHead(item.art.accent));
    case "hoist":
      return frameSvg(item, renderHoist(item.art.accent));
    case "chain_bag":
      return frameSvg(item, renderChainBag(item.art.accent));
    case "rigging_soft":
      return frameSvg(item, renderRiggingSoft(item.art.variant, item.art.accent));
    case "distro_box":
      return frameSvg(item, renderDistroBox(item.art.accent));
    case "truss":
      return frameSvg(item, renderTruss(item.art.accent));
    case "speaker":
      return frameSvg(item, renderSpeaker(item.art.variant, item.art.accent));
    default:
      return frameSvg(item, `<rect x="110" y="80" width="240" height="120" rx="24" fill="#1f2937" />`);
  }
}

function frameSvg(item, content) {
  return `
    <svg class="gear-art" viewBox="0 0 460 280" role="img" aria-label="${item.name}" xmlns="http://www.w3.org/2000/svg">
      <rect width="460" height="280" rx="28" fill="#dce8e5" />
      <circle cx="380" cy="58" r="56" fill="rgba(255,255,255,0.5)" />
      <rect x="0" y="216" width="460" height="64" fill="#b9c9c2" />
      <path d="M0 216H460" stroke="rgba(17,24,39,0.15)" stroke-width="2" />
      ${content}
    </svg>
  `;
}

function renderPowerBundle(accent) {
  return `
    <path d="M112 198 C142 146, 170 132, 216 148" stroke="#1f2937" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M148 204 C176 148, 210 130, 262 140" stroke="#1f2937" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M186 208 C220 152, 254 136, 306 148" stroke="#1f2937" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M224 212 C256 154, 298 142, 340 154" stroke="#1f2937" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M262 214 C300 164, 334 156, 372 170" stroke="#1f2937" stroke-width="18" fill="none" stroke-linecap="round"/>
    <circle cx="98" cy="202" r="16" fill="#ef4444"/>
    <circle cx="136" cy="208" r="16" fill="#2563eb"/>
    <circle cx="176" cy="212" r="16" fill="#22c55e"/>
    <circle cx="216" cy="216" r="16" fill="#0f172a"/>
    <circle cx="256" cy="220" r="16" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
    <circle cx="386" cy="174" r="18" fill="${accent}"/>
    <circle cx="344" cy="156" r="18" fill="#22c55e"/>
    <circle cx="304" cy="148" r="18" fill="#2563eb"/>
    <circle cx="264" cy="140" r="18" fill="#0f172a"/>
    <circle cx="224" cy="148" r="18" fill="#ffffff" stroke="#94a3b8" stroke-width="4"/>
  `;
}

function renderMultipin(accent) {
  return `
    <path d="M120 188 C132 120, 202 102, 296 126 C344 138, 372 154, 378 174" stroke="#1f2937" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path d="M104 206 C130 220, 174 226, 236 220" stroke="rgba(31,41,55,0.22)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <ellipse cx="142" cy="188" rx="28" ry="28" fill="#111827"/>
    <ellipse cx="142" cy="188" rx="18" ry="18" fill="${accent}"/>
    <circle cx="318" cy="138" r="34" fill="#111827"/>
    <circle cx="318" cy="138" r="22" fill="#f8fafc"/>
    <circle cx="308" cy="130" r="3.5" fill="#111827"/>
    <circle cx="320" cy="130" r="3.5" fill="#111827"/>
    <circle cx="332" cy="130" r="3.5" fill="#111827"/>
    <circle cx="302" cy="144" r="3.5" fill="#111827"/>
    <circle cx="314" cy="144" r="3.5" fill="#111827"/>
    <circle cx="326" cy="144" r="3.5" fill="#111827"/>
    <circle cx="338" cy="144" r="3.5" fill="#111827"/>
    <circle cx="308" cy="158" r="3.5" fill="#111827"/>
    <circle cx="320" cy="158" r="3.5" fill="#111827"/>
    <circle cx="332" cy="158" r="3.5" fill="#111827"/>
  `;
}

function renderFanout(accent) {
  return `
    <path d="M118 188 C176 170, 214 152, 256 114" stroke="#1f2937" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M260 116 C284 110, 312 110, 338 120" stroke="#1f2937" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M256 116 C302 122, 322 136, 350 158" stroke="#1f2937" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M256 116 C304 130, 326 152, 350 184" stroke="#1f2937" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M256 116 C296 112, 322 108, 352 102" stroke="#1f2937" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M256 116 C290 98, 314 88, 350 76" stroke="#1f2937" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="104" cy="192" r="22" fill="${accent}"/>
    <rect x="338" y="64" width="24" height="16" rx="7" fill="#f59e0b"/>
    <rect x="340" y="94" width="24" height="16" rx="7" fill="#ef4444"/>
    <rect x="340" y="120" width="24" height="16" rx="7" fill="#2563eb"/>
    <rect x="338" y="152" width="24" height="16" rx="7" fill="#22c55e"/>
    <rect x="336" y="178" width="24" height="16" rx="7" fill="#0f172a"/>
  `;
}

function renderConnectorCoil(variant, accent) {
  const connectorMarkup = renderConnectorHeads(variant, accent);
  return `
    <ellipse cx="208" cy="148" rx="112" ry="70" fill="none" stroke="#1f2937" stroke-width="18" />
    <ellipse cx="224" cy="148" rx="74" ry="46" fill="none" stroke="#111827" stroke-width="14" />
    <path d="M306 142 C332 132, 356 128, 384 126" stroke="#1f2937" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M108 162 C90 166, 74 176, 56 194" stroke="#1f2937" stroke-width="14" fill="none" stroke-linecap="round"/>
    ${connectorMarkup}
  `;
}

function renderConnectorHeads(variant, accent) {
  if (variant === "edison") {
    return `
      <rect x="30" y="180" width="44" height="28" rx="10" fill="#111827"/>
      <rect x="42" y="168" width="4" height="14" rx="2" fill="#f8fafc"/>
      <rect x="54" y="168" width="4" height="14" rx="2" fill="#f8fafc"/>
      <rect x="386" y="112" width="50" height="34" rx="14" fill="#e2e8f0" stroke="#111827" stroke-width="3"/>
      <rect x="378" y="120" width="12" height="18" rx="5" fill="#111827"/>
    `;
  }

  if (variant === "stagepin") {
    return `
      <rect x="30" y="180" width="48" height="28" rx="12" fill="#111827"/>
      <rect x="38" y="165" width="5" height="18" rx="2" fill="#f8fafc"/>
      <rect x="52" y="165" width="5" height="18" rx="2" fill="#f8fafc"/>
      <rect x="65" y="170" width="5" height="14" rx="2" fill="#f8fafc"/>
      <rect x="384" y="108" width="48" height="40" rx="14" fill="#d1d5db"/>
      <circle cx="412" cy="128" r="8" fill="#111827"/>
    `;
  }

  if (variant === "l620") {
    return `
      <circle cx="54" cy="194" r="22" fill="#111827"/>
      <circle cx="54" cy="194" r="12" fill="#fbbf24"/>
      <rect x="392" y="106" width="44" height="44" rx="18" fill="#dbeafe" stroke="#111827" stroke-width="3"/>
      <circle cx="414" cy="128" r="10" fill="#111827"/>
    `;
  }

  if (variant === "powercon") {
    return `
      <rect x="28" y="180" width="56" height="28" rx="14" fill="#2563eb"/>
      <rect x="76" y="184" width="18" height="20" rx="8" fill="#e2e8f0" stroke="#111827" stroke-width="3"/>
      <rect x="380" y="110" width="28" height="36" rx="12" fill="#2563eb"/>
      <rect x="404" y="110" width="34" height="36" rx="12" fill="#e2e8f0" stroke="#111827" stroke-width="3"/>
    `;
  }

  if (variant === "true1") {
    return `
      <rect x="26" y="178" width="62" height="30" rx="15" fill="#111827"/>
      <rect x="52" y="172" width="22" height="10" rx="5" fill="#eab308"/>
      <rect x="388" y="108" width="52" height="38" rx="14" fill="#111827"/>
      <rect x="404" y="102" width="20" height="10" rx="5" fill="#eab308"/>
    `;
  }

  if (variant === "jumper") {
    return `
      <rect x="26" y="184" width="42" height="20" rx="10" fill="#111827"/>
      <rect x="390" y="116" width="42" height="24" rx="12" fill="#334155"/>
      <rect x="384" y="120" width="8" height="16" rx="3" fill="#94a3b8"/>
    `;
  }

  if (variant === "xlr") {
    return `
      <rect x="24" y="178" width="50" height="30" rx="14" fill="#111827"/>
      <circle cx="44" cy="193" r="3" fill="#e5e7eb"/>
      <circle cx="54" cy="193" r="3" fill="#e5e7eb"/>
      <circle cx="64" cy="193" r="3" fill="#e5e7eb"/>
      <rect x="386" y="108" width="46" height="40" rx="14" fill="#d1d5db" stroke="#111827" stroke-width="3"/>
      <circle cx="408" cy="128" r="9" fill="#111827"/>
    `;
  }

  if (variant === "dmx") {
    return `
      <rect x="22" y="176" width="54" height="34" rx="16" fill="#111827"/>
      <circle cx="40" cy="193" r="2.6" fill="${accent}"/>
      <circle cx="48" cy="188" r="2.6" fill="${accent}"/>
      <circle cx="56" cy="193" r="2.6" fill="${accent}"/>
      <circle cx="48" cy="198" r="2.6" fill="${accent}"/>
      <circle cx="64" cy="193" r="2.6" fill="${accent}"/>
      <rect x="384" y="108" width="50" height="40" rx="14" fill="#111827"/>
      <circle cx="408" cy="128" r="11" fill="#f8fafc"/>
    `;
  }

  if (variant === "ethercon") {
    return `
      <rect x="26" y="178" width="60" height="30" rx="15" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
      <rect x="44" y="182" width="22" height="22" rx="5" fill="#0f172a"/>
      <rect x="390" y="108" width="48" height="40" rx="14" fill="#cbd5e1" stroke="#0f172a" stroke-width="3"/>
      <rect x="402" y="118" width="18" height="12" rx="4" fill="#0f766e"/>
    `;
  }

  if (variant === "sdi") {
    return `
      <circle cx="48" cy="194" r="18" fill="#e5e7eb" stroke="#334155" stroke-width="4"/>
      <circle cx="48" cy="194" r="6" fill="#ef4444"/>
      <circle cx="412" cy="126" r="18" fill="#e5e7eb" stroke="#334155" stroke-width="4"/>
      <circle cx="412" cy="126" r="6" fill="#ef4444"/>
    `;
  }

  if (variant === "opticalcon") {
    return `
      <rect x="24" y="176" width="56" height="34" rx="16" fill="#d1d5db" stroke="#0f172a" stroke-width="3"/>
      <rect x="42" y="184" width="20" height="16" rx="6" fill="#84cc16"/>
      <rect x="386" y="106" width="52" height="42" rx="14" fill="#d1d5db" stroke="#0f172a" stroke-width="3"/>
      <rect x="404" y="116" width="16" height="12" rx="5" fill="#84cc16"/>
    `;
  }

  if (variant === "speakon") {
    return `
      <rect x="24" y="178" width="58" height="30" rx="15" fill="#2563eb"/>
      <rect x="70" y="182" width="22" height="22" rx="11" fill="#0f172a"/>
      <rect x="388" y="108" width="54" height="40" rx="18" fill="#0f172a"/>
      <circle cx="414" cy="128" r="10" fill="#2563eb"/>
    `;
  }

  return `
    <rect x="30" y="180" width="50" height="28" rx="14" fill="${accent}"/>
    <rect x="388" y="112" width="50" height="32" rx="14" fill="${accent}"/>
  `;
}

function renderFixtureCylinder(variant, accent) {
  if (variant === "leko") {
    return `
      <rect x="156" y="102" width="132" height="74" rx="24" fill="#111827"/>
      <rect x="98" y="114" width="74" height="50" rx="18" fill="#0f172a"/>
      <circle cx="104" cy="139" r="28" fill="#dbeafe" stroke="${accent}" stroke-width="8"/>
      <rect x="140" y="82" width="10" height="116" rx="5" fill="#334155"/>
      <rect x="290" y="118" width="52" height="42" rx="18" fill="#1f2937"/>
      <path d="M218 176 L198 214 L212 214 L232 176" fill="#334155"/>
    `;
  }

  if (variant === "parcan") {
    return `
      <ellipse cx="150" cy="142" rx="46" ry="44" fill="#111827"/>
      <ellipse cx="150" cy="142" rx="28" ry="28" fill="#fee2a8"/>
      <rect x="150" y="104" width="120" height="76" rx="30" fill="#1f2937"/>
      <path d="M214 180 L190 218 L206 218 L232 180" fill="#334155"/>
      <rect x="196" y="74" width="12" height="116" rx="6" fill="#334155"/>
    `;
  }

  if (variant === "fresnel") {
    return `
      <circle cx="152" cy="144" r="44" fill="#111827"/>
      <circle cx="152" cy="144" r="28" fill="#fef3c7"/>
      <path d="M152 100 L286 114 L286 176 L152 188 Z" fill="#1f2937"/>
      <rect x="192" y="74" width="12" height="120" rx="6" fill="#334155"/>
      <path d="M222 178 L204 218 L220 218 L238 178" fill="#334155"/>
    `;
  }

  if (variant === "followspot") {
    return `
      <rect x="96" y="112" width="174" height="56" rx="28" fill="#111827"/>
      <circle cx="98" cy="140" r="34" fill="#e0f2fe" stroke="${accent}" stroke-width="8"/>
      <rect x="266" y="122" width="72" height="36" rx="16" fill="#1f2937"/>
      <path d="M212 170 L196 218 L212 218 L228 170" fill="#334155"/>
      <rect x="186" y="82" width="12" height="104" rx="6" fill="#334155"/>
    `;
  }

  return `
    <rect x="120" y="104" width="188" height="72" rx="26" fill="#111827"/>
    <circle cx="124" cy="140" r="32" fill="#fef3c7"/>
  `;
}

function renderFixturePanel(variant, accent) {
  if (variant === "blinder") {
    return `
      <rect x="134" y="66" width="192" height="152" rx="24" fill="#111827"/>
      <circle cx="186" cy="114" r="28" fill="#fde68a"/>
      <circle cx="274" cy="114" r="28" fill="#fde68a"/>
      <circle cx="186" cy="176" r="28" fill="#fde68a"/>
      <circle cx="274" cy="176" r="28" fill="#fde68a"/>
      <rect x="154" y="86" width="144" height="118" rx="16" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="6"/>
    `;
  }

  if (variant === "batten") {
    return `
      <rect x="92" y="128" width="272" height="34" rx="17" fill="#111827"/>
      <circle cx="126" cy="145" r="12" fill="${accent}"/>
      <circle cx="162" cy="145" r="12" fill="#38bdf8"/>
      <circle cx="198" cy="145" r="12" fill="#f97316"/>
      <circle cx="234" cy="145" r="12" fill="#eab308"/>
      <circle cx="270" cy="145" r="12" fill="#22c55e"/>
      <circle cx="306" cy="145" r="12" fill="#a855f7"/>
      <circle cx="342" cy="145" r="12" fill="#fb7185"/>
    `;
  }

  if (variant === "strobe") {
    return `
      <rect x="126" y="98" width="208" height="92" rx="24" fill="#111827"/>
      <rect x="146" y="118" width="168" height="52" rx="14" fill="#e2e8f0"/>
      <rect x="166" y="108" width="128" height="10" rx="5" fill="${accent}"/>
      <rect x="166" y="170" width="128" height="10" rx="5" fill="${accent}"/>
    `;
  }

  return `
    <rect x="126" y="98" width="208" height="92" rx="24" fill="#111827"/>
  `;
}

function renderMovingHead(accent) {
  return `
    <rect x="176" y="170" width="108" height="34" rx="14" fill="#111827"/>
    <rect x="194" y="112" width="72" height="76" rx="20" fill="#1f2937"/>
    <path d="M184 118 C164 110, 154 90, 164 74 C184 48, 274 48, 294 74 C304 90, 294 110, 274 118 Z" fill="#111827"/>
    <circle cx="228" cy="88" r="28" fill="#e0f2fe" stroke="${accent}" stroke-width="8"/>
    <rect x="182" y="194" width="96" height="12" rx="6" fill="#334155"/>
  `;
}

function renderHoist(accent) {
  return `
    <rect x="152" y="74" width="156" height="82" rx="26" fill="#111827"/>
    <rect x="170" y="94" width="120" height="42" rx="16" fill="#1f2937"/>
    <path d="M230 156 L230 206" stroke="#4b5563" stroke-width="10" stroke-linecap="round"/>
    <path d="M254 156 L254 206" stroke="#4b5563" stroke-width="10" stroke-linecap="round"/>
    <path d="M242 206 C232 218, 230 226, 242 234 C254 226, 252 218, 242 206" fill="${accent}"/>
    <path d="M160 74 L190 44 L268 44 L300 74" fill="none" stroke="#334155" stroke-width="10" stroke-linecap="round"/>
  `;
}

function renderChainBag(accent) {
  return `
    <path d="M214 54 L214 118" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
    <path d="M248 54 L248 118" stroke="#4b5563" stroke-width="8" stroke-linecap="round"/>
    <path d="M198 118 H264 L250 210 H212 Z" fill="#111827"/>
    <path d="M198 118 C206 102, 256 102, 264 118" fill="none" stroke="${accent}" stroke-width="8"/>
    <circle cx="214" cy="68" r="5" fill="#cbd5e1"/>
    <circle cx="214" cy="84" r="5" fill="#cbd5e1"/>
    <circle cx="214" cy="100" r="5" fill="#cbd5e1"/>
    <circle cx="248" cy="68" r="5" fill="#cbd5e1"/>
    <circle cx="248" cy="84" r="5" fill="#cbd5e1"/>
    <circle cx="248" cy="100" r="5" fill="#cbd5e1"/>
  `;
}

function renderRiggingSoft(variant, accent) {
  if (variant === "spanset") {
    return `
      <ellipse cx="230" cy="144" rx="112" ry="56" fill="none" stroke="#111827" stroke-width="22"/>
      <ellipse cx="230" cy="144" rx="78" ry="30" fill="none" stroke="#334155" stroke-width="14"/>
      <rect x="304" y="88" width="58" height="18" rx="9" fill="${accent}"/>
    `;
  }

  return `
    <path d="M170 92 C146 92, 134 108, 134 130 C134 180, 178 204, 230 204 C284 204, 324 180, 324 130 C324 108, 312 92, 288 92" fill="none" stroke="#94a3b8" stroke-width="18"/>
    <rect x="218" y="78" width="24" height="52" rx="10" fill="${accent}"/>
  `;
}

function renderDistroBox(accent) {
  return `
    <rect x="108" y="88" width="244" height="136" rx="28" fill="#111827"/>
    <rect x="128" y="108" width="204" height="96" rx="18" fill="#1f2937"/>
    <circle cx="162" cy="140" r="16" fill="${accent}"/>
    <circle cx="208" cy="140" r="16" fill="#ef4444"/>
    <circle cx="254" cy="140" r="16" fill="#22c55e"/>
    <circle cx="300" cy="140" r="16" fill="#eab308"/>
    <rect x="150" y="174" width="160" height="18" rx="9" fill="#d1d5db"/>
  `;
}

function renderTruss(accent) {
  return `
    <rect x="92" y="108" width="276" height="64" rx="14" fill="#cbd5e1" stroke="${accent}" stroke-width="4"/>
    <path d="M92 108 L150 172 M150 108 L208 172 M208 108 L266 172 M266 108 L324 172 M324 108 L368 156" stroke="#94a3b8" stroke-width="6"/>
    <path d="M92 172 L150 108 M150 172 L208 108 M208 172 L266 108 M266 172 L324 108" stroke="#94a3b8" stroke-width="6"/>
  `;
}

function renderSpeaker(variant, accent) {
  if (variant === "wedge") {
    return `
      <path d="M124 198 L184 110 H320 L352 198 Z" fill="#111827"/>
      <path d="M152 186 L198 126 H300 L326 186 Z" fill="#1f2937"/>
      <circle cx="236" cy="160" r="34" fill="none" stroke="${accent}" stroke-width="10"/>
    `;
  }

  if (variant === "frontfill") {
    return `
      <path d="M118 204 L174 126 H318 L342 204 Z" fill="#111827"/>
      <rect x="174" y="126" width="144" height="78" rx="18" fill="#1f2937"/>
      <circle cx="230" cy="166" r="20" fill="none" stroke="${accent}" stroke-width="8"/>
      <circle cx="286" cy="166" r="14" fill="none" stroke="#cbd5e1" stroke-width="6"/>
    `;
  }

  if (variant === "sub") {
    return `
      <rect x="112" y="94" width="236" height="126" rx="18" fill="#111827"/>
      <rect x="132" y="114" width="196" height="86" rx="14" fill="#1f2937"/>
      <circle cx="230" cy="158" r="42" fill="none" stroke="${accent}" stroke-width="10"/>
    `;
  }

  return `
    <path d="M160 70 L298 70 L318 212 L142 212 Z" fill="#111827"/>
    <rect x="176" y="90" width="106" height="20" rx="8" fill="#1f2937"/>
    <rect x="170" y="120" width="118" height="20" rx="8" fill="#1f2937"/>
    <rect x="164" y="150" width="130" height="20" rx="8" fill="#1f2937"/>
    <rect x="158" y="180" width="142" height="20" rx="8" fill="#1f2937"/>
    <circle cx="308" cy="98" r="8" fill="${accent}"/>
  `;
}
