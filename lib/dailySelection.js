/*
 * Deterministic daily word selection.
 * Both players always get the same 10 words for a given date.
 *
 * pickTodaysWords(dateString, strengths)
 *   dateString — 'YYYY-MM-DD'
 *   strengths  — { [wordId]: { strength, last_seen } } from localStorage
 * Returns array of 10 vocab objects.
 */
function pickTodaysWords(dateString, strengths) {
  const rng = seededRng(dateString);

  const seen   = VOCABULARY.filter(w => strengths[w.id] !== undefined);
  const unseen = VOCABULARY.filter(w => strengths[w.id] === undefined);

  // 60% review, 40% new — rounded to integers summing to 10
  const reviewCount = Math.min(6, seen.length);
  const newCount    = 10 - reviewCount;

  const reviewWords = weightedSample(seen, strengths, reviewCount, rng);
  const newWords    = seededSample(unseen, newCount, rng);

  // When vocabulary is nearly exhausted, fill shortfall with extra review words
  const shortfall = 10 - reviewWords.length - newWords.length;
  if (shortfall > 0) {
    const usedIds   = new Set([...reviewWords, ...newWords].map(w => w.id));
    const extraPool = seen.filter(w => !usedIds.has(w.id));
    const extras    = weightedSample(extraPool, strengths, shortfall, rng);
    return shuffle10([...reviewWords, ...newWords, ...extras], rng);
  }

  return shuffle10(reviewWords.concat(newWords), rng);
}

/*
 * Lesson-aware daily word picker.
 * 60% current-lesson words (uniform sample) + 40% past-lesson / Lesson-0 review (weighted by weakness).
 * Falls back to pickTodaysWords when no lesson is active (preserves current behaviour).
 */
function pickTodaysLessonWords(dateString, strengths, lessonState) {
  const rng     = seededRng(dateString);
  const current = lessonState && lessonState.currentLessonId
    ? getLessonById(lessonState.currentLessonId) : null;
  if (!current) return pickTodaysWords(dateString, strengths);

  const currentVocab = current.vocab || [];

  // Past vocab: all previous lessons + Lesson-0 base pool, deduplicated by id
  const seenIds  = new Set();
  const pastVocab = [];
  LESSONS.filter(function(l) { return l.order < current.order; })
    .forEach(function(l) {
      l.vocab.forEach(function(v) {
        if (!seenIds.has(v.id)) { seenIds.add(v.id); pastVocab.push(v); }
      });
    });
  VOCABULARY.forEach(function(v) {
    if (!seenIds.has(v.id)) { seenIds.add(v.id); pastVocab.push(v); }
  });

  let currentCount = 6, reviewCount = 4;
  if (currentVocab.length < currentCount) {
    reviewCount  += currentCount - currentVocab.length;
    currentCount  = currentVocab.length;
  }

  const currentPick = seededSample(currentVocab, currentCount, rng);
  const usedIds     = new Set(currentPick.map(function(w) { return w.id; }));
  const reviewPool  = pastVocab.filter(function(w) { return !usedIds.has(w.id); });
  const reviewPick  = weightedSample(reviewPool, strengths, reviewCount, rng);

  const total = currentPick.length + reviewPick.length;
  if (total < 10) {
    const allUsed = new Set(currentPick.concat(reviewPick).map(function(w) { return w.id; }));
    const filler  = currentVocab.concat(pastVocab).filter(function(w) { return !allUsed.has(w.id); });
    const extras  = weightedSample(filler, strengths, 10 - total, rng);
    return shuffle10(currentPick.concat(reviewPick).concat(extras), rng);
  }
  return shuffle10(currentPick.concat(reviewPick), rng);
}

/* Weighted sample: words with lower strength have higher probability */
function weightedSample(words, strengths, n, rng) {
  if (words.length <= n) return [...words];
  const weights = words.map(w => Math.max(1, 100 - (strengths[w.id]?.strength ?? 50)));
  const total   = weights.reduce((s, w) => s + w, 0);
  const result  = [];
  const pool    = [...words];
  const poolW   = [...weights];

  for (let i = 0; i < n && pool.length > 0; i++) {
    let r = rng() * poolW.reduce((s, w) => s + w, 0);
    let idx = 0;
    while (r > poolW[idx] && idx < pool.length - 1) { r -= poolW[idx]; idx++; }
    result.push(pool[idx]);
    pool.splice(idx, 1);
    poolW.splice(idx, 1);
  }
  return result;
}

/* Seeded uniform sample (no replacement) */
function seededSample(arr, n, rng) {
  const pool = [...arr];
  const result = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

function shuffle10(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Simple seeded PRNG (mulberry32) */
function seededRng(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  let state = h >>> 0;
  return function () {
    state += 0x6D2B79F5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = t ^ (t + Math.imul(t ^ (t >>> 7), 61 | t));
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
