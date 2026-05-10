/*
 * Lesson progress: mastery evaluation, grammar attempt recording, and unlock logic.
 * Depends on: _registry.js (getLessonState, saveLessonState, getLessonById)
 *             wordStrength.js (strengths have .strength and .attempts fields)
 */

/*
 * Returns true when a lesson should be marked mastered:
 *   ≥ 90% of vocab items answered ≥ minVocabAttempts times
 *   AND ≥ 80% of vocab items have strength ≥ 80
 *   AND ≥ 80% of grammar items have ≥ 2 of last 3 attempts correct
 */
function isLessonMastered(lesson, strengths, grammarState) {
  const threshold = lesson.mastery?.threshold || 0.8;
  const minAttempts = lesson.mastery?.minVocabAttempts || 2;

  const vIds = lesson.vocab.map(v => v.id);

  if (vIds.length > 0) {
    const seenEnough = vIds.filter(id => (strengths[id]?.attempts || 0) >= minAttempts).length;
    if (seenEnough < vIds.length * 0.9) return false;

    const strongCount = vIds.filter(id => (strengths[id]?.strength || 0) >= 80).length;
    if (strongCount / vIds.length < threshold) return false;
  }

  const gIds = lesson.grammar ? lesson.grammar.map(g => g.id) : [];
  if (gIds.length > 0) {
    const grammarPassed = gIds.filter(id => {
      const last3 = ((grammarState || {})[id]?.attempts || []).slice(-3);
      return last3.length === 3 && last3.filter(Boolean).length >= 2;
    }).length;
    if (grammarPassed / gIds.length < threshold) return false;
  }

  return true;
}

/*
 * Record a grammar item attempt (correct/wrong) in lesson state.
 * Called by the Grammar Drill game after each answer.
 */
function recordGrammarAttempt(itemId, correct) {
  const state = getLessonState();
  if (!state.grammar) state.grammar = {};
  const entry = state.grammar[itemId] || { attempts: [], lastSeen: null };
  entry.attempts.push(correct);
  if (entry.attempts.length > 10) entry.attempts = entry.attempts.slice(-10);
  entry.lastSeen = getTodayString();
  state.grammar[itemId] = entry;
  saveLessonState(state);
}

/*
 * Called after each duel completes.
 * Checks if the current lesson is now mastered; if so, marks it and unlocks the next.
 * Returns the newly-mastered lesson object, or null if no change.
 */
function checkLessonMastery() {
  const state = getLessonState();
  if (!state.currentLessonId) return null;

  const lesson = getLessonById(state.currentLessonId);
  if (!lesson) return null;

  const mastered = state.masteredLessons || [];
  if (mastered.includes(lesson.id)) return null;   // already marked

  const strengths = getLocal('strengths') || {};
  if (!isLessonMastered(lesson, strengths, state.grammar || {})) return null;

  state.masteredLessons = [...mastered, lesson.id];
  saveLessonState(state);
  return lesson;
}
