/*
 * Daily Duel orchestrator
 * Runs 10 questions across 3 game types and calls back with final result.
 *
 * runDailyDuel(words, onDuelComplete)
 *   words           — 10 vocab objects from pickTodaysWords()
 *   onDuelComplete  — called with { score, correct, total, perQuestion }
 */

function runDailyDuel(words, onDuelComplete) {
  const TOTAL = 10;
  let questionIdx  = 0;
  let totalScore   = 0;
  let totalCorrect = 0;
  let sessionStreak = 0;
  const perQuestion = [];

  // Distribute words across game types: 4 matchPairs (1 round = 4 words), 3 listenAndPick, 3 typeTranslation
  // matchPairs takes 4 words at once (1 question slot), so we treat it as Q1.
  const SCHEDULE = buildSchedule(words);

  updateProgress();
  runNext();

  function runNext() {
    if (questionIdx >= SCHEDULE.length) {
      onDuelComplete({ score: totalScore, correct: totalCorrect, total: TOTAL, perQuestion });
      return;
    }
    const q = SCHEDULE[questionIdx];
    renderGameType(q.type);

    if (q.type === 'matchPairs') {
      initMatchPairs(q.words, result => {
        const sc = calculateScore({ correct: true, timeMs: result.timeMs, sessionStreak });
        sessionStreak++;
        totalScore   += sc.total;
        totalCorrect += 4;
        perQuestion.push({ type: 'matchPairs', correct: true, score: sc.total });
        advance(4);
      });
    } else if (q.type === 'listenAndPick') {
      initListenAndPick(q.word, VOCABULARY, result => {
        handleSingleResult(result, q.type);
      });
    } else {
      initTypeTranslation(q.word, result => {
        handleSingleResult(result, q.type);
      });
    }
  }

  function handleSingleResult(result, type) {
    const sc = calculateScore({ correct: result.correct, timeMs: result.timeMs, sessionStreak });
    if (result.correct) sessionStreak++; else sessionStreak = 0;
    totalScore   += sc.total;
    totalCorrect += result.correct ? 1 : 0;
    perQuestion.push({ type, correct: result.correct, score: sc.total });
    advance(1);
  }

  function advance(count) {
    questionIdx++;
    // Update word strengths after each answer
    const q = SCHEDULE[questionIdx - 1];
    if (q.type === 'matchPairs') {
      q.words.forEach(w => updateStrength(w.id, true));
    } else {
      const lastQ = perQuestion[perQuestion.length - 1];
      updateStrength(q.word.id, lastQ.correct);
    }
    updateProgress();
    updateScoreLive();
    setTimeout(runNext, 400);
  }

  function updateProgress() {
    const answered = perQuestion.reduce((s, q) => s + (q.type === 'matchPairs' ? 4 : 1), 0);
    const pct = (answered / TOTAL) * 100;
    const fill = document.getElementById('game-progress-fill');
    const label = document.getElementById('game-progress-label');
    if (fill)  fill.style.width = pct + '%';
    if (label) label.textContent = answered + ' / ' + TOTAL;
  }

  function updateScoreLive() {
    const el = document.getElementById('game-score-live');
    if (el) el.textContent = totalScore.toLocaleString() + ' pts';
  }

  function renderGameType(type) {
    const labels = { matchPairs: '🃏 Match Pairs', listenAndPick: '🔊 Listen & Pick', typeTranslation: '✍️ Type It' };
    const el = document.getElementById('game-progress-label');
    // Brief flash of game type name
    if (el) {
      el.textContent = labels[type] || '';
      setTimeout(updateProgress, 800);
    }
  }
}

/*
 * Distribute 10 words into schedule:
 * 1 × matchPairs (4 words) + 3 × listenAndPick + 3 × typeTranslation = 10 questions
 * Total card = 4 + 3 + 3 = 10 word-slots.
 */
function buildSchedule(words) {
  const rng = seededRng(getTodayString() + '_schedule');
  const shuffled = shuffle10([...words], rng);

  return [
    { type: 'matchPairs',      words: shuffled.slice(0, 4) },
    { type: 'listenAndPick',   word:  shuffled[4] },
    { type: 'typeTranslation', word:  shuffled[5] },
    { type: 'listenAndPick',   word:  shuffled[6] },
    { type: 'typeTranslation', word:  shuffled[7] },
    { type: 'listenAndPick',   word:  shuffled[8] },
    { type: 'typeTranslation', word:  shuffled[9] },
  ];
}
