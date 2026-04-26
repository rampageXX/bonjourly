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
  if (screenId === 'home-screen')    renderHome();
  if (screenId === 'words-screen')   renderWords();
  if (screenId === 'journey-screen') renderJourney();
  if (screenId === 'avatar-screen')  renderAvatar();
  if (screenId === 'stats-screen')   renderStats();
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

/* ── Words Screen ─────────────────────────────────────────────────────────── */
function renderWords() {
  // Default to Today tab
  switchWordsTab('today', document.getElementById('words-tab-today'));
}

function switchWordsTab(tab, btn) {
  document.getElementById('words-today-list').classList.toggle('hidden', tab !== 'today');
  document.getElementById('words-week-list').classList.toggle('hidden', tab !== 'week');
  document.querySelectorAll('#words-screen .stats-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (tab === 'today') renderTodayWords();
  else                 renderWeekWords();
}

function getTodayWordList() {
  const today = getTodayString();
  const cached = getLocal('words_' + today);
  if (cached) return cached.map(id => VOCABULARY.find(w => w.id === id)).filter(Boolean);
  // Compute and cache if not yet saved
  const strengths = getLocal('strengths') || {};
  const words = pickTodaysWords(today, strengths);
  setLocal('words_' + today, words.map(w => w.id));
  return words;
}

function renderTodayWords() {
  const list = document.getElementById('words-today-list');
  clearEl(list);

  const words = getTodayWordList();
  const today = getTodayString();
  const played = !!getLocal('result_' + today);

  const banner = document.createElement('p');
  banner.style.cssText = 'font-size:0.78rem; color:var(--text-mid); margin-bottom:14px; text-align:center;';
  banner.textContent = played
    ? "Today's 10 words — you've already played!"
    : "Study these 10 words before your duel today";
  list.appendChild(banner);

  const strengths = getLocal('strengths') || {};
  words.forEach(w => list.appendChild(buildWordCard(w, strengths)));
}

function renderWeekWords() {
  const list = document.getElementById('words-week-list');
  clearEl(list);

  // Collect unique word IDs from the past 7 days
  const seenIds = new Set();
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = toDateString(d);
    const saved = getLocal('words_' + ds);
    if (saved) saved.forEach(id => seenIds.add(id));
  }

  const strengths = getLocal('strengths') || {};
  const words = VOCABULARY.filter(w => seenIds.has(w.id));

  if (words.length === 0) {
    const msg = document.createElement('p');
    msg.style.cssText = 'color:var(--text-light); font-size:0.85rem; text-align:center; padding:32px 0;';
    msg.textContent = 'No words yet — play your first duel to start tracking!';
    list.appendChild(msg);
    return;
  }

  const banner = document.createElement('p');
  banner.style.cssText = 'font-size:0.78rem; color:var(--text-mid); margin-bottom:14px; text-align:center;';
  banner.textContent = words.length + ' words from the past 7 days';
  list.appendChild(banner);

  words.forEach(w => list.appendChild(buildWordCard(w, strengths)));
}

function buildWordCard(word, strengths) {
  const s = strengths[word.id]?.strength;
  const pillClass  = s === undefined ? '' : s >= 80 ? 'strength-strong' : s >= 40 ? 'strength-learning' : s >= 10 ? 'strength-fading' : 'strength-forgotten';
  const pillLabel  = s === undefined ? 'New' : s >= 80 ? 'Strong' : s >= 40 ? 'Learning' : s >= 10 ? 'Fading' : 'Forgotten';

  const card = document.createElement('div');
  card.className = 'word-card';

  // Speak button
  const speakBtn = document.createElement('button');
  speakBtn.className = 'word-speak-btn';
  speakBtn.setAttribute('aria-label', 'Pronounce ' + word.french);
  speakBtn.textContent = '🔊';
  speakBtn.addEventListener('click', () => {
    speakBtn.classList.add('speaking');
    speak(word.audio_text, () => speakBtn.classList.remove('speaking'));
  });

  // Text content
  const textEl = document.createElement('div');
  textEl.className = 'word-card-text';

  const frEl = document.createElement('div');
  frEl.className = 'word-french';
  frEl.textContent = word.french;

  const enEl = document.createElement('div');
  enEl.className = 'word-english';
  enEl.textContent = word.english;

  const metaEl = document.createElement('div');
  metaEl.className = 'word-meta';

  const catEl = document.createElement('span');
  catEl.className = 'word-category';
  catEl.textContent = word.category;

  if (pillClass) {
    const pill = document.createElement('span');
    pill.className = 'word-strength-pill ' + pillClass;
    pill.textContent = pillLabel;
    metaEl.appendChild(catEl);
    metaEl.appendChild(pill);
  } else {
    const newPill = document.createElement('span');
    newPill.className = 'word-strength-pill';
    newPill.style.cssText = 'background:var(--cream-dark); color:var(--text-light);';
    newPill.textContent = 'New';
    metaEl.appendChild(catEl);
    metaEl.appendChild(newPill);
  }

  textEl.appendChild(frEl);
  textEl.appendChild(enEl);
  textEl.appendChild(metaEl);

  card.appendChild(speakBtn);
  card.appendChild(textEl);
  return card;
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

  const words = getTodayWordList();  // computes + caches word list for this day

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

  // Check avatar item unlocks
  if (blob) {
    const myData   = blob.players[myId] || {};
    const unlocked = blob.unlocked_items?.[myId] || [];
    const newItems = getUnlockableItems(myData.total_points || 0, (getLocal('streak') || {}).current || 0, unlocked);
    if (newItems.length > 0) {
      showUnlockToast(newItems[0]);
      newItems.forEach(item => { if (!unlocked.includes(item.id)) unlocked.push(item.id); });
      blob.unlocked_items[myId] = unlocked;
      writeBlob(blob);
    }
  }

  // Check region unlocks
  if (blob) await checkRegionUnlocks(blob);
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

/* ── Journey Screen ───────────────────────────────────────────────────────── */
async function renderJourney() {
  if (!currentPlayer) return;
  const myId = currentPlayer.id;
  const blob = await getSharedData();
  const unlockedIds = blob?.unlocked_regions?.[myId] || ['paris'];
  const mastered    = getMasteredCount();

  document.getElementById('journey-mastered-count').textContent = mastered;

  // Always return to map view when tab is tapped
  document.getElementById('journey-map-view').classList.remove('hidden');
  document.getElementById('journey-region-detail').classList.add('hidden');

  // ── SVG map pins ─────────────────────────────────────────────────────────
  const pinsG = document.getElementById('journey-pins');
  while (pinsG.firstChild) pinsG.removeChild(pinsG.firstChild);

  REGIONS.forEach(r => {
    const isUnlocked = unlockedIds.includes(r.id);

    // Outer glow ring for unlocked pins
    if (isUnlocked) {
      pinsG.appendChild(svgEl('circle', {
        cx: r.mapX, cy: r.mapY, r: 6.5,
        fill: 'rgba(200,16,46,0.18)',
      }));
    }
    // Pin circle
    pinsG.appendChild(svgEl('circle', {
      cx: r.mapX, cy: r.mapY, r: 4.5,
      fill: isUnlocked ? 'var(--burgundy)' : '#C0C0C0',
      stroke: 'white', 'stroke-width': '1',
    }));
    // Flag emoji label
    const lbl = svgEl('text', {
      x: r.mapX, y: r.mapY - 7,
      'text-anchor': 'middle', 'font-size': '6', fill: 'var(--navy)',
      'font-family': 'Inter, sans-serif', 'font-weight': '600',
    });
    lbl.textContent = r.name;
    pinsG.appendChild(lbl);
  });

  // ── Region list cards ─────────────────────────────────────────────────────
  const list = document.getElementById('journey-region-list');
  clearEl(list);

  REGIONS.forEach(r => {
    const isUnlocked = unlockedIds.includes(r.id);

    const card = document.createElement('div');
    card.className = 'region-card' + (isUnlocked ? '' : ' locked');

    const flagEl = document.createElement('span');
    flagEl.className = 'region-card-flag';
    flagEl.textContent = r.flag;

    const infoEl = document.createElement('div');
    infoEl.className = 'region-card-info';

    const nameEl = document.createElement('div');
    nameEl.className = 'serif region-card-name';
    nameEl.textContent = r.name;

    const subEl = document.createElement('div');
    subEl.className = 'region-card-sub';
    subEl.textContent = r.subtitle;

    infoEl.appendChild(nameEl);
    infoEl.appendChild(subEl);

    const statusEl = document.createElement('div');
    statusEl.className = 'region-card-status';

    if (isUnlocked) {
      statusEl.className += ' status-unlocked';
      statusEl.textContent = 'Unlocked ✓';
    } else {
      const remaining = Math.max(0, r.masteryReq - mastered);
      statusEl.textContent = remaining + ' more to unlock';
    }

    card.appendChild(flagEl);
    card.appendChild(infoEl);
    card.appendChild(statusEl);

    if (isUnlocked) {
      card.addEventListener('click', () => showRegionWords(r.id));
    }

    list.appendChild(card);
  });
}

function showRegionWords(regionId) {
  document.getElementById('journey-map-view').classList.add('hidden');
  document.getElementById('journey-region-detail').classList.remove('hidden');

  const region = REGIONS.find(r => r.id === regionId);
  document.getElementById('region-detail-flag').textContent = region.flag;
  document.getElementById('region-detail-name').textContent = region.name;
  document.getElementById('region-detail-subtitle').textContent = region.subtitle;

  const words     = getRegionWords(regionId);
  const strengths = getLocal('strengths') || {};
  const wordsEl   = document.getElementById('region-detail-words');
  clearEl(wordsEl);
  words.forEach(w => wordsEl.appendChild(buildWordCard(w, strengths)));
}

function backToJourneyMap() {
  document.getElementById('journey-region-detail').classList.add('hidden');
  document.getElementById('journey-map-view').classList.remove('hidden');
}

async function checkRegionUnlocks(blob) {
  if (!blob || !currentPlayer) return;
  const myId   = currentPlayer.id;
  const alreadyUnlocked = (blob.unlocked_regions?.[myId] || ['paris']).slice();
  const newRegions = getUnlockableRegions(getMasteredCount(), alreadyUnlocked);
  if (newRegions.length === 0) return;

  newRegions.forEach(r => alreadyUnlocked.push(r.id));
  if (!blob.unlocked_regions) {
    blob.unlocked_regions = { player1: ['paris'], player2: ['paris'] };
  }
  blob.unlocked_regions[myId] = alreadyUnlocked;
  await writeBlob(blob);
  showToast('🗺️ ' + newRegions[0].name + ' unlocked! Bon voyage!', 3500);
}

/* ── SVG Avatar Drawing System ────────────────────────────────────────────── */
function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const AVATAR_DEFAULTS = {
  body: '#1B3A5B', armL: '#1B3A5B', armR: '#1B3A5B',
  legL: '#254E7A', legR: '#254E7A', shoeL: '#2C1810', shoeR: '#2C1810',
};

function resetAvatarBody() {
  document.getElementById('av-body').setAttribute('fill',   AVATAR_DEFAULTS.body);
  document.getElementById('av-arm-l').setAttribute('fill',  AVATAR_DEFAULTS.armL);
  document.getElementById('av-arm-r').setAttribute('fill',  AVATAR_DEFAULTS.armR);
  document.getElementById('av-leg-l').setAttribute('fill',  AVATAR_DEFAULTS.legL);
  document.getElementById('av-leg-r').setAttribute('fill',  AVATAR_DEFAULTS.legR);
  document.getElementById('av-shoe-l').setAttribute('fill', AVATAR_DEFAULTS.shoeL);
  document.getElementById('av-shoe-r').setAttribute('fill', AVATAR_DEFAULTS.shoeR);
}

const AVATAR_VISUAL = {
  /* ── HATS ─────────────────────────────────────────────────────────────── */
  beret(svg, g) {
    // Navy beret: band at crown, dome offset right for drape effect
    g.appendChild(svgEl('rect',    { x: 29, y: 2,  width: 42, height: 5, rx: 2.5, fill: '#0F2238' }));
    g.appendChild(svgEl('ellipse', { cx: 57, cy: -4, rx: 20, ry: 9, fill: '#1B3A5B' }));
    g.appendChild(svgEl('ellipse', { cx: 62, cy: -6, rx:  7, ry: 4, fill: '#0F2238' }));
  },
  beret_red(svg, g) {
    g.appendChild(svgEl('rect',    { x: 29, y: 2,  width: 42, height: 5, rx: 2.5, fill: '#8B0A1A' }));
    g.appendChild(svgEl('ellipse', { cx: 57, cy: -4, rx: 20, ry: 9, fill: '#C8102E' }));
    g.appendChild(svgEl('ellipse', { cx: 62, cy: -6, rx:  7, ry: 4, fill: '#8B0A1A' }));
  },
  beret_gold(svg, g) {
    g.appendChild(svgEl('rect',    { x: 29, y: 2,  width: 42, height: 5, rx: 2.5, fill: '#B8941F' }));
    g.appendChild(svgEl('ellipse', { cx: 57, cy: -4, rx: 20, ry: 9, fill: '#D4AF37' }));
    g.appendChild(svgEl('ellipse', { cx: 62, cy: -6, rx:  7, ry: 4, fill: '#B8941F' }));
  },
  eiffel_hat(svg, g) {
    g.appendChild(svgEl('rect', { x: 26, y: 3,  width: 48, height: 5,  rx: 2,   fill: '#111' }));
    g.appendChild(svgEl('rect', { x: 36, y: -22, width: 28, height: 26, rx: 3,  fill: '#1A1A1A' }));
    // Eiffel tower silhouette inside hat
    g.appendChild(svgEl('path', { d: 'M50,-29 L47,-23 L53,-23 Z M46,-23 L43,-17 L57,-17 L54,-23 Z M42,-17 L40,-12 L60,-12 L58,-17 Z', fill: '#D4AF37' }));
  },
  streak30(svg, g) {
    g.appendChild(svgEl('path', { d: 'M29,3 L29,-8 L37,1 L50,-14 L63,1 L71,-8 L71,3 Z', fill: '#D4AF37' }));
    g.appendChild(svgEl('rect', { x: 29, y: 3, width: 42, height: 7, rx: 2, fill: '#D4AF37' }));
    g.appendChild(svgEl('circle', { cx: 37, cy:  0,  r: 3,   fill: '#C8102E' }));
    g.appendChild(svgEl('circle', { cx: 50, cy: -7,  r: 3.5, fill: '#E8C84A' }));
    g.appendChild(svgEl('circle', { cx: 63, cy:  0,  r: 3,   fill: '#C8102E' }));
  },

  /* ── TOPS ─────────────────────────────────────────────────────────────── */
  striped_top(svg, g) {
    // Breton stripes: set body/arms to white, overlay clipped navy stripes
    document.getElementById('av-body').setAttribute('fill',  'white');
    document.getElementById('av-arm-l').setAttribute('fill', 'white');
    document.getElementById('av-arm-r').setAttribute('fill', 'white');
    const NAVY = '#1B3A5B';
    const H = 8;   // stripe height

    // Body stripes clipped to rounded body rect
    const bodyG = svgEl('g', { 'clip-path': 'url(#body-clip)' });
    for (let i = 1; i < 9; i += 2) {   // odd rows = navy
      bodyG.appendChild(svgEl('rect', { x: 0, y: 51 + i * H, width: 100, height: H, fill: NAVY }));
    }
    // Left arm stripes
    const armLG = svgEl('g', { 'clip-path': 'url(#arm-l-clip)' });
    for (let i = 1; i < 4; i += 2) {
      armLG.appendChild(svgEl('rect', { x: 0, y: 54 + i * 3, width: 30, height: 3, fill: NAVY }));
    }
    // Right arm stripes
    const armRG = svgEl('g', { 'clip-path': 'url(#arm-r-clip)' });
    for (let i = 1; i < 4; i += 2) {
      armRG.appendChild(svgEl('rect', { x: 70, y: 54 + i * 3, width: 30, height: 3, fill: NAVY }));
    }
    g.appendChild(bodyG);
    g.appendChild(armLG);
    g.appendChild(armRG);
  },
  waiter_top(svg, g) {
    // White apron bib + waist band + bow over navy body
    g.appendChild(svgEl('rect',    { x: 37, y: 53,  width: 26, height: 32, rx: 4, fill: 'white', opacity: '0.92' }));
    g.appendChild(svgEl('rect',    { x: 26, y: 83,  width: 48, height: 6,  rx: 3, fill: 'white', opacity: '0.85' }));
    g.appendChild(svgEl('ellipse', { cx: 45, cy: 89, rx: 5,   ry: 3,  fill: 'white' }));
    g.appendChild(svgEl('ellipse', { cx: 55, cy: 89, rx: 5,   ry: 3,  fill: 'white' }));
    g.appendChild(svgEl('circle',  { cx: 50, cy: 89, r: 3,           fill: '#DDD' }));
  },
  french_coat(svg, g) {
    document.getElementById('av-body').setAttribute('fill',  '#C4A05A');
    document.getElementById('av-arm-l').setAttribute('fill', '#C4A05A');
    document.getElementById('av-arm-r').setAttribute('fill', '#C4A05A');
    g.appendChild(svgEl('path', { d: 'M26,52 L38,57 L36,76 L28,68 Z', fill: '#8B6A25', opacity: '0.9' }));
    g.appendChild(svgEl('path', { d: 'M74,52 L62,57 L64,76 L72,68 Z', fill: '#8B6A25', opacity: '0.9' }));
    g.appendChild(svgEl('rect', { x: 25, y: 100, width: 50, height: 6, rx: 3, fill: '#5C3D0A' }));
    g.appendChild(svgEl('rect', { x: 45, y: 101, width: 10, height: 4, rx: 1, fill: '#D4AF37' }));
  },
  mime_outfit(svg, g) {
    document.getElementById('av-body').setAttribute('fill',  'white');
    document.getElementById('av-arm-l').setAttribute('fill', 'white');
    document.getElementById('av-arm-r').setAttribute('fill', 'white');
    const BLACK = '#1A1A1A';
    const H = 8;
    const bodyG = svgEl('g', { 'clip-path': 'url(#body-clip)' });
    for (let i = 1; i < 9; i += 2) {
      bodyG.appendChild(svgEl('rect', { x: 0, y: 51 + i * H, width: 100, height: H, fill: BLACK }));
    }
    const armLG = svgEl('g', { 'clip-path': 'url(#arm-l-clip)' });
    for (let i = 1; i < 4; i += 2) {
      armLG.appendChild(svgEl('rect', { x: 0, y: 54 + i * 3, width: 30, height: 3, fill: BLACK }));
    }
    const armRG = svgEl('g', { 'clip-path': 'url(#arm-r-clip)' });
    for (let i = 1; i < 4; i += 2) {
      armRG.appendChild(svgEl('rect', { x: 70, y: 54 + i * 3, width: 30, height: 3, fill: BLACK }));
    }
    [bodyG, armLG, armRG].forEach(el => g.appendChild(el));
  },

  /* ── ACCESSORIES ──────────────────────────────────────────────────────── */
  baguette(svg, g) {
    // Long baguette tucked at right side, tilted 10 degrees outward
    const grp = svgEl('g', { transform: 'translate(74, 50) rotate(10)' });
    grp.appendChild(svgEl('rect', { x: 0, y: 0, width: 9, height: 88, rx: 4.5, fill: '#D4A56A' }));
    [15, 30, 45, 60, 75].forEach(y => {
      grp.appendChild(svgEl('line', { x1: -1, y1: y, x2: 10, y2: y + 4, stroke: '#A07440', 'stroke-width': '1.5' }));
    });
    g.appendChild(grp);
  },
  scarf(svg, g) {
    // Red silk scarf wound at neck with flowing tail
    g.appendChild(svgEl('rect',   { x: 37, y: 41, width: 26, height: 15, rx: 4, fill: '#C8102E', opacity: '0.93' }));
    g.appendChild(svgEl('circle', { cx: 50, cy: 51, r: 5, fill: '#A00D25' }));
    g.appendChild(svgEl('path',   { d: 'M46,54 L41,77 L49,79 L51,57 Z', fill: '#C8102E', opacity: '0.82' }));
  },
  croissant_bag(svg, g) {
    // Small shoulder bag with gold clasp
    g.appendChild(svgEl('line',    { x1: 67, y1: 58, x2: 74, y2: 97, stroke: '#8B6A25', 'stroke-width': '2.5' }));
    g.appendChild(svgEl('ellipse', { cx: 77, cy: 102, rx: 11, ry: 9, fill: '#D4A56A' }));
    g.appendChild(svgEl('rect',    { x: 72, y: 95, width: 9, height: 5, rx: 2, fill: '#D4AF37' }));
    g.appendChild(svgEl('path',    { d: 'M73,105 Q77,100 81,105 Q79,110 73,105 Z', fill: '#B8873A' }));
  },
  champagne(svg, g) {
    // Champagne flute held in right hand area
    g.appendChild(svgEl('path',    { d: 'M85,53 L88,68 L94,68 L97,53 Z', fill: 'rgba(180,220,255,0.55)', stroke: 'rgba(200,200,255,0.8)', 'stroke-width': '1' }));
    g.appendChild(svgEl('line',    { x1: 91, y1: 68, x2: 91, y2: 86, stroke: '#C0C0C0', 'stroke-width': '1.5' }));
    g.appendChild(svgEl('ellipse', { cx: 91, cy: 86, rx: 6, ry: 2, fill: '#C0C0C0' }));
    g.appendChild(svgEl('circle',  { cx: 91, cy: 59, r: 1.5, fill: 'white', opacity: '0.7' }));
    g.appendChild(svgEl('circle',  { cx: 89, cy: 63, r: 1,   fill: 'white', opacity: '0.6' }));
  },
  streak7(svg, g) {
    // Bronze medal on red ribbon at chest
    g.appendChild(svgEl('rect',   { x: 47, y: 47, width: 6,  height: 13, rx: 1.5, fill: '#C8102E' }));
    g.appendChild(svgEl('circle', { cx: 50, cy: 65, r: 9, fill: '#D4AF37' }));
    g.appendChild(svgEl('circle', { cx: 50, cy: 65, r: 6, fill: '#E8C84A' }));
    const star = svgEl('text', { x: 50, y: 69, 'text-anchor': 'middle', 'font-size': '8', fill: '#8B6914', 'font-family': 'Arial' });
    star.textContent = '★';
    g.appendChild(star);
  },

  /* ── SHOES ─────────────────────────────────────────────────────────────── */
  espadrilles(svg, g) {
    // Tan canvas espadrilles with rope-texture stitching lines
    document.getElementById('av-shoe-l').setAttribute('fill', '#C4A46B');
    document.getElementById('av-shoe-r').setAttribute('fill', '#C4A46B');
    g.appendChild(svgEl('line', { x1: 23, y1: 163, x2: 50, y2: 163, stroke: '#8B7355', 'stroke-width': '1.5', opacity: '0.6' }));
    g.appendChild(svgEl('line', { x1: 51, y1: 163, x2: 78, y2: 163, stroke: '#8B7355', 'stroke-width': '1.5', opacity: '0.6' }));
    g.appendChild(svgEl('line', { x1: 24, y1: 167, x2: 49, y2: 167, stroke: '#8B7355', 'stroke-width': '1',   opacity: '0.4' }));
    g.appendChild(svgEl('line', { x1: 52, y1: 167, x2: 77, y2: 167, stroke: '#8B7355', 'stroke-width': '1',   opacity: '0.4' }));
  },
};

function applyAvatarItems(equipped) {
  resetAvatarBody();
  const g = document.getElementById('av-overlays');
  while (g.firstChild) g.removeChild(g.firstChild);
  const svg = document.getElementById('avatar-svg');
  // Draw bottom → top so hats render last (on top in SVG stack)
  ['shoes', 'bottom', 'top', 'accessory', 'hat'].forEach(slot => {
    const id = equipped[slot];
    if (id && AVATAR_VISUAL[id]) AVATAR_VISUAL[id](svg, g);
  });
}

/* ── Avatar Screen ────────────────────────────────────────────────────────── */
async function renderAvatar() {
  if (!currentPlayer) return;
  const myId = currentPlayer.id;
  document.getElementById('avatar-player-name').textContent = currentPlayer.name;

  const blob = await getSharedData();
  const myData      = blob?.players?.[myId] || {};
  const totalPts    = myData.total_points || 0;
  const equipped    = myData.avatar_config?.items_equipped || {};
  const unlockedIds = blob?.unlocked_items?.[myId] || [];
  const streak      = (getLocal('streak') || {}).current || 0;

  document.getElementById('avatar-points').textContent = totalPts.toLocaleString();

  applyAvatarItems(equipped);

  // Render wardrobe grid
  const grid = document.getElementById('items-grid');
  clearEl(grid);

  AVATAR_ITEMS.forEach(item => {
    const isUnlocked = unlockedIds.includes(item.id);
    const isEquipped = equipped[item.slot] === item.id;

    const card = document.createElement('div');
    card.className = [
      'item-card-v2',
      'rarity-' + item.rarity,
      isEquipped ? 'equipped' : '',
      isUnlocked ? ''         : 'locked',
    ].filter(Boolean).join(' ');

    // Rarity badge (top-left)
    const rarityBadge = document.createElement('span');
    rarityBadge.className = 'item-rarity-badge badge-' + item.rarity;
    rarityBadge.textContent = item.rarity;
    card.appendChild(rarityBadge);

    // Equipped badge (top-right)
    if (isEquipped) {
      const eqBadge = document.createElement('span');
      eqBadge.className = 'item-equipped-badge';
      eqBadge.textContent = 'On';
      card.appendChild(eqBadge);
    }

    // Emoji
    const emojiEl = document.createElement('span');
    emojiEl.className = 'item-v2-emoji';
    emojiEl.textContent = item.emoji;
    card.appendChild(emojiEl);

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = 'item-v2-name';
    nameEl.textContent = item.name;
    card.appendChild(nameEl);

    // Slot label
    const slotEl = document.createElement('div');
    slotEl.className = 'item-v2-slot';
    slotEl.textContent = item.slot;
    card.appendChild(slotEl);

    if (isUnlocked) {
      const statusEl = document.createElement('div');
      statusEl.className = 'item-v2-status';
      statusEl.textContent = isEquipped ? '✓ Wearing' : 'Tap to wear';
      card.appendChild(statusEl);
      if (!isEquipped) {
        card.addEventListener('click', () => equipItem(item, equipped, blob, myId));
      }
    } else {
      // Progress toward unlock
      const target    = item.costPts || (item.streakReq * 500); // rough pts equiv for display
      const current   = item.costPts ? totalPts : streak;
      const goal      = item.costPts ? item.costPts : item.streakReq;
      const pct       = Math.min(100, Math.round((current / goal) * 100));
      const costLabel = item.costPts
        ? totalPts.toLocaleString() + ' / ' + item.costPts.toLocaleString() + ' pts'
        : streak + ' / ' + item.streakReq + ' day streak';

      const statusEl = document.createElement('div');
      statusEl.className = 'item-v2-status';
      statusEl.textContent = costLabel;
      card.appendChild(statusEl);

      const bar = document.createElement('div');
      bar.className = 'item-progress';
      const fill = document.createElement('div');
      fill.className = 'item-progress-fill';
      fill.style.width = pct + '%';
      bar.appendChild(fill);
      card.appendChild(bar);
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
  showToast(item.emoji + ' ' + item.name + ' equipped!');
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

}

function switchStatTab(tab, btn) {
  ['weekly', 'alltime'].forEach(t => {
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
