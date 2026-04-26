const STRENGTH_CORRECT   =  15;
const STRENGTH_WRONG     = -20;
const DECAY_NORMAL       =  -5;
const DECAY_POST_BREAK   = -10;  // doubles for 3 days after streak break

function updateStrength(wordId, correct) {
  const strengths = getLocal('strengths') || {};
  const entry = strengths[wordId] || { strength: 50, last_seen: null };
  const delta = correct ? STRENGTH_CORRECT : STRENGTH_WRONG;
  entry.strength = Math.max(0, Math.min(100, entry.strength + delta));
  entry.last_seen = getTodayString();
  strengths[wordId] = entry;
  setLocal('strengths', strengths);
}

function getStrength(wordId) {
  const strengths = getLocal('strengths') || {};
  return strengths[wordId]?.strength ?? null;
}

function applyDailyDecay() {
  const strengths = getLocal('strengths') || {};
  const today = getTodayString();
  const streakData = getLocal('streak') || {};
  const inPenaltyWindow = streakData.penaltyDaysLeft > 0;
  const decayAmount = inPenaltyWindow ? DECAY_POST_BREAK : DECAY_NORMAL;

  let changed = false;
  Object.entries(strengths).forEach(([id, entry]) => {
    if (entry.last_seen && entry.last_seen < today) {
      entry.strength = Math.max(0, entry.strength + decayAmount);
      changed = true;
    }
  });

  if (changed) setLocal('strengths', strengths);
  if (inPenaltyWindow) {
    streakData.penaltyDaysLeft--;
    setLocal('streak', streakData);
  }
}

function getStrengthLabel(strength) {
  if (strength >= 80) return 'strong';
  if (strength >= 40) return 'learning';
  if (strength >= 10) return 'fading';
  return 'forgotten';
}
