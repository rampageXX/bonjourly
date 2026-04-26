const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

function incrementStreak() {
  const today = getTodayString();
  const data  = getLocal('streak') || { current: 0, longest: 0, last_played: null, penaltyDaysLeft: 0, freeze_used_this_month: false };

  if (data.last_played === today) return;   // already counted today

  const yesterday = offsetDate(today, -1);
  const playedYesterday = data.last_played === yesterday;
  const missedADay = data.last_played && data.last_played < yesterday;

  if (missedADay) {
    if (!data.freeze_used_this_month) {
      // Auto-apply monthly freeze — streak is preserved silently
      data.freeze_used_this_month = true;
      showToast('❄️ Streak freeze used! Streak preserved.');
    } else {
      data.penaltyDaysLeft = 3;
      data.current = 0;
    }
  }

  data.current++;
  data.longest       = Math.max(data.longest, data.current);
  data.last_played   = today;

  setLocal('streak', data);
  return data;
}

function resetMonthlyFreeze() {
  const today = new Date();
  const data  = getLocal('streak') || {};
  const lastReset = getLocal('freeze_reset_month');
  const thisMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

  if (lastReset !== thisMonth) {
    data.freeze_used_this_month = false;
    setLocal('streak', data);
    setLocal('freeze_reset_month', thisMonth);
  }
}

function getStreakMilestoneHit(oldStreak, newStreak) {
  return STREAK_MILESTONES.find(m => m > oldStreak && m <= newStreak) || null;
}

function offsetDate(dateStr, days) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return toDateString(d);
}
