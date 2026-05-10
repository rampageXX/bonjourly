function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function normalizeAnswer(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // strip diacritics
    .replace(/[^a-z0-9\s']/g, '')
    .trim();
}

function isAnswerAccepted(userInput, correct) {
  const a = normalizeAnswer(userInput);
  const b = normalizeAnswer(correct);
  return a === b || levenshtein(a, b) <= 1;
}

/* Grammar drill matcher — checks answer and each alt in accept[], using given threshold */
function isSentenceAccepted(input, correct, alts, threshold) {
  const norm = normalizeAnswer(input);
  if (levenshtein(norm, normalizeAnswer(correct)) <= threshold) return true;
  if (Array.isArray(alts)) {
    for (var i = 0; i < alts.length; i++) {
      if (levenshtein(norm, normalizeAnswer(alts[i])) <= threshold) return true;
    }
  }
  return false;
}
