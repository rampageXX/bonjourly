const MAX_SPEED_BONUS = 50;
const SPEED_WINDOW_MS = 12000;   // full bonus if answered within 12s
const STREAK_BONUS    = 25;
const BASE_POINTS     = 100;

/*
 * calculateScore({ correct, timeMs, sessionStreak })
 * Returns { base, speedBonus, streakBonus, total }
 */
function calculateScore({ correct, timeMs, sessionStreak }) {
  if (!correct) return { base: 0, speedBonus: 0, streakBonus: 0, total: 0 };

  const base = BASE_POINTS;
  const clampedMs = Math.min(Math.max(timeMs, 0), SPEED_WINDOW_MS);
  const speedBonus = Math.round(MAX_SPEED_BONUS * (1 - clampedMs / SPEED_WINDOW_MS));
  const streakBonus = sessionStreak >= 3 && sessionStreak % 3 === 0 ? STREAK_BONUS : 0;

  return { base, speedBonus, streakBonus, total: base + speedBonus + streakBonus };
}
