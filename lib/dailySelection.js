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

  return shuffle10(reviewWords.concat(newWords), rng);
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
