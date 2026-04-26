/* ── State ────────────────────────────────────────────────────────────────── */
let currentScreen = null;
let selectedPlayerSlot = null;
let currentPlayer = null;   // { id: 'player1'|'player2', name: string }

/* ── Boot ─────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  resetMonthlyFreeze();
  applyDailyDecay();
  const saved = getLocal('player');
  if (saved) {
    currentPlayer = saved;
    enterApp();
  } else {
    showScreen('start-screen', false);
  }
});

/* ── Screen Navigation ────────────────────────────────────────────────────── */
function showScreen(id, animate = true) {
  if (currentScreen) {
    document.getElementById(currentScreen).classList.add('hidden');
  }
  currentScreen = id;
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  if (animate) {
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.22s ease';
      el.style.opacity = '1';
    });
  }
  const content = el.querySelector('.screen-content');
  if (content) content.scrollTop = 0;
}

function navTo(screenId, btn) {
  showScreen(screenId);
  setActiveNav(btn);
  if (screenId === 'home-screen')   renderHome();
  if (screenId === 'avatar-screen') renderAvatar();
  if (screenId === 'stats-screen')  renderStats();
}

function setActiveNav(activeBtn) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');
}

/* ── Security: escape user-derived strings placed in innerHTML ────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ── Start / Onboarding ───────────────────────────────────────────────────── */
function selectPlayer(btn) {
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedPlayerSlot = btn.dataset.player;
}

function handleStart() {
  const nameInput = document.getElementById('name-input');
  const name = nameInput.value.trim();
  if (!name) {
    showToast('Please enter your name 😊');
    nameInput.classList.add('animate-shake');
    setTimeout(() => nameInput.classList.remove('animate-shake'), 500);
    return;
  }
  if (!selectedPlayerSlot) {
    showToast('Choose Player 1 or Player 2');
    return;
  }
  currentPlayer = { id: selectedPlayerSlot, name };
  setLocal('player', currentPlayer);
  enterApp();
}

function enterApp() {
  document.getElementById('bottom-nav').classList.remove('hidden');
  showScreen('home-screen');
  renderHome();
  // Sync name to JSONBin in the background
  syncPlayerName(currentPlayer.id, currentPlayer.name).catch(() => {});
}

/* ── Home Screen ──────────────────────────────────────────────────────────── */
async function renderHome() {
  if (!currentPlayer) return;
  const { id, name } = currentPlayer;
  const opId = id === 'player1' ? 'player2' : 'player1';

  document.getElementById('home-player-name').textContent = name;
  document.getElementById('home-date').textContent = formatDateDisplay(getTodayString());

  const streak = (getLocal('streak') || {}).current || 0;
  document.getElementById('home-streak-display').textContent = streak + (streak === 1 ? ' day' : ' days');
  const badge = document.getElementById('home-streak-badge');
  if (streak > 0) {
    badge.classList.remove('hidden');
    document.getElementById('home-streak-count').textContent = streak;
  } else {
    badge.classList.add('hidden');
  }

  // Fetch shared data for opponent name and scores
  const blob = await getSharedData();
  const today = getTodayString();
  const opName = blob?.players?.[opId]?.name || (opId === 'player1' ? 'Player 1' : 'Player 2');
  const opResult = blob?.daily_results?.[today]?.[opId];

  document.getElementById('home-p1-name').textContent = id === 'player1' ? name : opName;
  document.getElementById('home-p2-name').textContent = id === 'player2' ? name : opName;

  const today2 = today;
  const todayResult = getLocal('result_' + today2);
  const playBtn = document.getElementById('play-btn');
  const alreadyMsg = document.getElementById('already-played-msg');

  if (todayResult) {
    playBtn.classList.add('hidden');
    alreadyMsg.classList.remove('hidden');
    const myScoreEl = document.getElementById(id === 'player1' ? 'home-p1-score' : 'home-p2-score');
    const opScoreEl = document.getElementById(id === 'player1' ? 'home-p2-score' : 'home-p1-score');
    myScoreEl.textContent = todayResult.score.toLocaleString();
    opScoreEl.textContent = opResult ? opResult.score.toLocaleString() : '—';
  } else {
    playBtn.classList.remove('hidden');
    alreadyMsg.classList.add('hidden');
    document.getElementById('home-p1-score').textContent = '—';
    document.getElementById('home-p2-score').textContent = '—';
  }

  renderWeekGrid(blob);
}

function renderWeekGrid(blob) {
  const grid = document.getElementById('week-grid');
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
  const myId = currentPlayer?.id;
  const opId = myId === 'player1' ? 'player2' : 'player1';

  grid.innerHTML = '';
  DAY_LABELS.forEach((label, i) => {
    const diff = i - dayOfWeek;
    const d = new Date(now);
    d.setDate(d.getDate() + diff);
    const dateStr = toDateString(d);
    const myResult = getLocal('result_' + dateStr);
    const opResult = blob?.daily_results?.[dateStr]?.[opId];
    const isToday  = i === dayOfWeek;
    const isFuture = diff > 0;

    const cell = document.createElement('div');
    cell.className = 'week-day';

    const lbl = document.createElement('span');
    lbl.className = 'week-day-label';
    lbl.textContent = label;

    const dot = document.createElement('div');
    dot.className = 'week-day-dot';
    if (isFuture) {
      dot.classList.add('pending');
    } else if (myResult && opResult) {
      const won = myResult.score > opResult.score;
      const tied = myResult.score === opResult.score;
      dot.classList.add(won ? 'win' : tied ? 'tie' : 'loss');
      dot.textContent = won ? '🏆' : tied ? '=' : '✗';
    } else if (myResult) {
      dot.classList.add('win'); dot.textContent = '✓';
    }
    if (isToday) dot.classList.add('today');

    cell.appendChild(lbl);
    cell.appendChild(dot);
    grid.appendChild(cell);
  });
}

/* ── Duel Entry Point ─────────────────────────────────────────────────────── */
function startDuel() {
  const today = getTodayString();
  if (getLocal('result_' + today)) {
    showToast("You've already played today!");
    navTo('home-screen', document.querySelector('[data-screen="home-screen"]'));
    return;
  }
  showScreen('game-screen');

  const strengths = getLocal('strengths') || {};
  const words = pickTodaysWords(today, strengths);

  document.getElementById('game-progress-fill').style.width = '0%';
  document.getElementById('game-progress-label').textContent = '1 / 10';
  document.getElementById('game-score-live').textContent = '0 pts';

  clearEl(document.getElementById('game-area'));

  runDailyDuel(words, result => {
    incrementStreak();
    showResult(result);
  });
}

/* ── Result Screen ────────────────────────────────────────────────────────── */
async function showResult(result) {
  const today = getTodayString();
  const myId  = currentPlayer.id;
  setLocal('result_' + today, {
    score: result.score, correct: result.correct, played_at: new Date().toISOString()
  });

  document.getElementById('result-score').textContent = result.score.toLocaleString();
  document.getElementById('result-correct').textContent = result.correct + ' / ' + result.total + ' correct';

  const outcomeEl = document.getElementById('result-outcome');
  outcomeEl.textContent = 'Waiting for opponent…';
  outcomeEl.className = 'result-outcome outcome-wait';
  document.getElementById('result-waiting-msg').classList.remove('hidden');
  document.getElementById('result-opponent-score-wrap').classList.add('hidden');
  document.getElementById('result-unlock-wrap').classList.add('hidden');

  showScreen('result-screen');
  setActiveNav(null);

  // Sync to JSONBin
  const opId = myId === 'player1' ? 'player2' : 'player1';
  const synced = await syncDuelResult(myId, result);

  // Check opponent result
  const blob = synced ? await getSharedData() : null;
  const opResult = blob?.daily_results?.[today]?.[opId];
  const opName   = blob?.players?.[opId]?.name || (opId === 'player1' ? 'Player 1' : 'Player 2');

  document.getElementById('result-opponent-name').textContent = opName;

  if (opResult) {
    showOpponentResult(result.score, opResult.score, opName);
  }

  // Check unlocks
  if (blob) {
    const myData   = blob.players[myId] || {};
    const unlocked = blob.unlocked_items?.[myId] || [];
    const newItems = getUnlockableItems(myData.total_points || 0, (getLocal('streak') || {}).current || 0, unlocked);
    if (newItems.length > 0) {
      showUnlockToast(newItems[0]);
      // Persist unlocks
      newItems.forEach(item => { if (!unlocked.includes(item.id)) unlocked.push(item.id); });
      blob.unlocked_items[myId] = unlocked;
      writeBlob(blob);
    }
  }
}

function showOpponentResult(myScore, opScore, opName) {
  document.getElementById('result-waiting-msg').classList.add('hidden');
  document.getElementById('result-opponent-name-label').textContent = opName;
  document.getElementById('result-opponent-score').textContent = opScore.toLocaleString();
  document.getElementById('result-opponent-score-wrap').classList.remove('hidden');

  const outcomeEl = document.getElementById('result-outcome');
  if (myScore > opScore) {
    outcomeEl.textContent = '🏆 You win today!';
    outcomeEl.className = 'result-outcome outcome-win';
  } else if (opScore > myScore) {
    outcomeEl.textContent = 'Better luck tomorrow!';
    outcomeEl.className = 'result-outcome outcome-loss';
  } else {
    outcomeEl.textContent = "It's a tie!";
    outcomeEl.className = 'result-outcome outcome-tie';
  }
}

function showUnlockToast(item) {
  document.getElementById('result-unlock-item').textContent = item.emoji;
  document.getElementById('result-unlock-name').textContent = item.name + ' unlocked!';
  document.getElementById('result-unlock-wrap').classList.remove('hidden');
  showToast('🎉 New item unlocked: ' + item.name, 3500);
}

/* ── Avatar Screen ────────────────────────────────────────────────────────── */
async function renderAvatar() {
  if (!currentPlayer) return;
  const myId = currentPlayer.id;
  document.getElementById('avatar-player-name').textContent = currentPlayer.name;

  const blob = await getSharedData();
  const myData   = blob?.players?.[myId] || {};
  const totalPts = myData.total_points || 0;
  const equipped = myData.avatar_config?.items_equipped || {};
  const unlockedIds = blob?.unlocked_items?.[myId] || [];

  document.getElementById('avatar-points').textContent = totalPts.toLocaleString() + ' pts total';

  // Update slot icons
  ['hat', 'top', 'bottom', 'shoes', 'accessory'].forEach(slot => {
    const equippedId = equipped[slot];
    const item = equippedId ? getItemById(equippedId) : null;
    const defaults = { hat:'🎩', top:'👔', bottom:'👖', shoes:'👟', accessory:'🕶️' };
    const el = document.getElementById('slot-' + (slot === 'accessory' ? 'acc' : slot));
    if (el) el.textContent = item ? item.emoji : defaults[slot];
  });

  // Render items grid
  const grid = document.getElementById('items-grid');
  clearEl(grid);

  const streak = (getLocal('streak') || {}).current || 0;

  AVATAR_ITEMS.forEach(item => {
    const isUnlocked = unlockedIds.includes(item.id);
    const isEquipped = equipped[item.slot] === item.id;
    const costLabel  = item.costPts ? item.costPts.toLocaleString() + ' pts' : (item.streakReq + '-day streak');

    const card = document.createElement('div');
    card.className = 'item-card' + (isEquipped ? ' equipped' : '') + (isUnlocked ? '' : ' locked');

    const emojiEl = document.createElement('span');
    emojiEl.className = 'item-emoji';
    emojiEl.textContent = item.emoji;

    const nameEl = document.createElement('div');
    nameEl.className = 'item-name';
    nameEl.textContent = item.name;

    const costEl = document.createElement('div');
    costEl.className = 'item-cost';
    costEl.textContent = isUnlocked ? (isEquipped ? '✓ Equipped' : 'Tap to equip') : costLabel;

    card.appendChild(emojiEl);
    card.appendChild(nameEl);
    card.appendChild(costEl);

    if (isUnlocked && !isEquipped) {
      card.addEventListener('click', () => equipItem(item, equipped, blob, myId));
    }
    grid.appendChild(card);
  });
}

async function equipItem(item, currentEquipped, blob, myId) {
  if (!blob) return;
  currentEquipped[item.slot] = item.id;
  blob.players[myId].avatar_config = blob.players[myId].avatar_config || {};
  blob.players[myId].avatar_config.items_equipped = currentEquipped;
  await writeBlob(blob);
  showToast('Equipped ' + item.emoji + ' ' + item.name);
  renderAvatar();
}

/* ── Stats Screen ─────────────────────────────────────────────────────────── */
async function renderStats() {
  const streak = getLocal('streak') || { current: 0, longest: 0 };
  document.getElementById('stats-streak').textContent = streak.current + ' days';
  document.getElementById('stats-longest-streak').textContent = streak.longest + ' days';

  const blob = await getSharedData();
  const myId = currentPlayer?.id;
  const opId = myId === 'player1' ? 'player2' : 'player1';

  if (blob) {
    const myData = blob.players[myId] || {};
    document.getElementById('stats-total-pts').textContent = (myData.total_points || 0).toLocaleString();

    // Weekly stats: last 7 days
    const now = new Date();
    let weekWins = 0, weekPts = 0, totalDays = 0, myWins = 0, opWins = 0, ties = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = toDateString(d);
      const myR = blob.daily_results?.[ds]?.[myId];
      const opR = blob.daily_results?.[ds]?.[opId];
      if (myR) {
        weekPts += myR.score;
        totalDays++;
        if (opR) {
          if (myR.score > opR.score) { weekWins++; myWins++; }
          else if (opR.score > myR.score) opWins++;
          else ties++;
        }
      }
    }

    // All-time H2H
    Object.values(blob.daily_results || {}).forEach(day => {
      const myR = day[myId], opR = day[opId];
      if (myR && opR) {
        if (myR.score > opR.score) myWins++;
        else if (opR.score > myR.score) opWins++;
        else ties++;
      }
    });

    document.getElementById('stats-days-won').textContent = weekWins + ' / 7';
    document.getElementById('stats-weekly-pts').textContent = weekPts.toLocaleString();
    document.getElementById('stats-total-days').textContent = totalDays;
    document.getElementById('stats-h2h').textContent = myWins + ' W – ' + opWins + ' L – ' + ties + ' T';
  } else {
    ['stats-days-won','stats-weekly-pts','stats-total-days','stats-total-pts','stats-h2h']
      .forEach(id => { document.getElementById(id).textContent = 'Offline'; });
  }

  renderWordCollection();
}

function switchStatTab(tab, btn) {
  ['weekly', 'alltime', 'words'].forEach(t => {
    document.getElementById('stats-' + t).classList.add('hidden');
  });
  document.getElementById('stats-' + tab).classList.remove('hidden');
  document.querySelectorAll('.stats-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function renderWordCollection() {
  const strengths = getLocal('strengths') || {};
  const list = document.getElementById('word-collection-list');
  list.innerHTML = '';

  const seen = VOCABULARY.filter(w => strengths[w.id] !== undefined);
  if (seen.length === 0) {
    const msg = document.createElement('p');
    msg.style.cssText = 'color:var(--text-light); font-size:0.85rem; text-align:center; padding:20px 0;';
    msg.textContent = 'Play your first duel to start tracking words!';
    list.appendChild(msg);
    return;
  }

  seen.forEach(w => {
    const s = strengths[w.id]?.strength ?? 0;
    const pillClass = s >= 80 ? 'strength-strong' : s >= 40 ? 'strength-learning' : s >= 10 ? 'strength-fading' : 'strength-forgotten';
    const pillLabel = s >= 80 ? 'Strong' : s >= 40 ? 'Learning' : s >= 10 ? 'Fading' : 'Forgotten';

    const card = document.createElement('div');
    card.className = 'poster-card';
    card.style.cssText = 'margin-bottom:10px; display:flex; align-items:center; justify-content:space-between; padding:14px 16px;';

    const info = document.createElement('div');
    const frEl = document.createElement('div');
    frEl.style.cssText = 'font-weight:600; color:var(--navy);';
    frEl.textContent = w.french;   // vocab data is hardcoded, but textContent is still safest
    const enEl = document.createElement('div');
    enEl.style.cssText = 'font-size:0.82rem; color:var(--text-mid);';
    enEl.textContent = w.english;
    info.appendChild(frEl);
    info.appendChild(enEl);

    const pill = document.createElement('span');
    pill.className = 'word-strength-pill ' + pillClass;
    pill.textContent = pillLabel;

    card.appendChild(info);
    card.appendChild(pill);
    list.appendChild(card);
  });
}

/* ── Toast ────────────────────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(msg, duration = 2400) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ── Date Helpers ─────────────────────────────────────────────────────────── */
function getTodayString() {
  return toDateString(new Date());
}

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
