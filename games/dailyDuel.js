/*
 * Daily Duel orchestrator
 * Runs 10 questions across 3 game types (+ optional grammar drills) and calls back with final result.
 *
 * runDailyDuel(words, onDuelComplete)
 *   words           — 10 vocab objects from pickTodaysWords / pickTodaysLessonWords
 *   onDuelComplete  — called with { score, correct, total, perQuestion }
 */

function runDailyDuel(words, onDuelComplete) {
  var TOTAL = 10;
  var questionIdx   = 0;
  var totalScore    = 0;
  var totalCorrect  = 0;
  var sessionStreak = 0;
  var perQuestion   = [];

  var SCHEDULE = buildSchedule(words);

  updateProgress();
  runNext();

  function runNext() {
    if (questionIdx >= SCHEDULE.length) {
      onDuelComplete({ score: totalScore, correct: totalCorrect, total: TOTAL, perQuestion: perQuestion });
      return;
    }
    var q = SCHEDULE[questionIdx];
    renderGameType(q.type);

    if (q.type === 'matchPairs') {
      initMatchPairs(q.words, function(result) {
        var sc = calculateScore({ correct: true, timeMs: result.timeMs, sessionStreak: sessionStreak });
        sessionStreak++;
        totalScore   += sc.total;
        totalCorrect += 4;
        perQuestion.push({ type: 'matchPairs', correct: true, score: sc.total });
        advance(4);
      });

    } else if (q.type === 'listenAndPick') {
      var vocabPool = typeof getAllVocab === 'function' ? getAllVocab() : VOCABULARY;
      initListenAndPick(q.word, vocabPool, function(result) {
        handleSingleResult(result, q.type);
      });

    } else if (q.type === 'grammarDrill') {
      initGrammarDrill(q.item, function(result) {
        recordGrammarAttempt(q.item.id, result.correct);
        handleSingleResult(result, q.type);
      });

    } else {
      initTypeTranslation(q.word, function(result) {
        handleSingleResult(result, q.type);
      });
    }
  }

  function handleSingleResult(result, type) {
    var sc = calculateScore({ correct: result.correct, timeMs: result.timeMs, sessionStreak: sessionStreak });
    if (result.correct) sessionStreak++; else sessionStreak = 0;
    totalScore   += sc.total;
    totalCorrect += result.correct ? 1 : 0;
    perQuestion.push({ type: type, correct: result.correct, score: sc.total });
    advance(1);
  }

  function advance(count) {
    questionIdx++;
    var q = SCHEDULE[questionIdx - 1];
    if (q.type === 'matchPairs') {
      q.words.forEach(function(w) { updateStrength(w.id, true); });
    } else if (q.type !== 'grammarDrill') {
      // Grammar attempts are recorded inside runNext callback; vocab strength updated here
      var lastQ = perQuestion[perQuestion.length - 1];
      updateStrength(q.word.id, lastQ.correct);
    }
    updateProgress();
    updateScoreLive();
    setTimeout(runNext, 400);
  }

  function updateProgress() {
    var answered = perQuestion.reduce(function(s, q) { return s + (q.type === 'matchPairs' ? 4 : 1); }, 0);
    var pct  = (answered / TOTAL) * 100;
    var fill  = document.getElementById('game-progress-fill');
    var label = document.getElementById('game-progress-label');
    if (fill)  fill.style.width = pct + '%';
    if (label) label.textContent = answered + ' / ' + TOTAL;
  }

  function updateScoreLive() {
    var el = document.getElementById('game-score-live');
    if (el) el.textContent = totalScore.toLocaleString() + ' pts';
  }

  function renderGameType(type) {
    var labels = {
      matchPairs:      '🃏 Match Pairs',
      listenAndPick:   '🔊 Listen & Pick',
      typeTranslation: '✍️ Type It',
      grammarDrill:    '📝 Grammar'
    };
    var el = document.getElementById('game-progress-label');
    if (el) {
      el.textContent = labels[type] || '';
      setTimeout(updateProgress, 800);
    }
  }
}

/*
 * Distribute 10 word-slots into a schedule of 7 question items:
 *   1 × matchPairs (4 words) + 3 × listenAndPick + 3 × typeTranslation = 10
 * If the current lesson has grammar items, replace the last 1–2 typeTranslation
 * slots with grammarDrill slots (cap 2 per duel).
 */
function buildSchedule(words) {
  var rng      = seededRng(getTodayString() + '_schedule');
  var shuffled = shuffle10([...words], rng);

  var lessonState    = typeof getLessonState === 'function' ? getLessonState() : null;
  var currentLesson  = lessonState && lessonState.currentLessonId
    ? getLessonById(lessonState.currentLessonId) : null;
  var grammarPool    = currentLesson ? (currentLesson.grammar || []) : [];
  var grammarPick    = seededSample(grammarPool, Math.min(2, grammarPool.length), rng);

  var schedule = [
    { type: 'matchPairs',      words: shuffled.slice(0, 4) },
    { type: 'listenAndPick',   word:  shuffled[4] },
    { type: 'typeTranslation', word:  shuffled[5] },
    { type: 'listenAndPick',   word:  shuffled[6] },
    { type: 'typeTranslation', word:  shuffled[7] },
    { type: 'listenAndPick',   word:  shuffled[8] },
    { type: 'typeTranslation', word:  shuffled[9] },
  ];

  // Replace the last K typeTranslation slots with grammar drills
  var ttSlotIndices = [2, 4, 6];
  grammarPick.forEach(function(g, i) {
    schedule[ttSlotIndices[ttSlotIndices.length - 1 - i]] = { type: 'grammarDrill', item: g };
  });

  return schedule;
}
