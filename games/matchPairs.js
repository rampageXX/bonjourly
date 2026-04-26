/*
 * Match Pairs game
 * initMatchPairs(words, onComplete)
 *   words      — array of 4 vocab objects
 *   onComplete — called with { correct: 4, timeMs, pairs }
 */

function initMatchPairs(words, onComplete) {
  const area = document.getElementById('game-area');
  clearEl(area);

  const startTime = Date.now();
  let matched = 0;
  let selectedCard = null;
  let locked = false;

  // 8 cards: 4 French + 4 English, shuffled
  const items = shuffle([
    ...words.map((w, i) => ({ pairId: i, side: 'fr', text: w.french })),
    ...words.map((w, i) => ({ pairId: i, side: 'en', text: w.english })),
  ]);

  const header = document.createElement('div');
  header.style.cssText = 'text-align:center; margin-bottom:18px;';

  const title = document.createElement('h3');
  title.className = 'serif';
  title.style.cssText = 'color:var(--navy); font-size:1.2rem; margin-bottom:4px;';
  title.textContent = 'Match the pairs';

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:0.8rem; color:var(--text-light);';
  hint.textContent = 'Tap a French word, then its English meaning';

  header.appendChild(title);
  header.appendChild(hint);
  area.appendChild(header);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:10px;';

  const cardEls = items.map((item, idx) => {
    const btn = document.createElement('button');
    btn.dataset.pairId = item.pairId;
    btn.dataset.side = item.side;
    btn.style.cssText = `
      padding:16px 10px; border:2px solid var(--cream-dark);
      border-radius:var(--radius); background:white;
      font-family:${item.side === 'fr' ? "'Playfair Display',serif" : "'Inter',sans-serif"};
      font-size:${item.side === 'fr' ? '1rem' : '0.88rem'};
      font-weight:600; color:var(--navy); cursor:pointer;
      transition:all 0.18s; min-height:64px; box-shadow:var(--shadow-sm); line-height:1.3;
    `;
    btn.textContent = item.text;
    btn.addEventListener('click', () => handleTap(btn, item));
    grid.appendChild(btn);
    return btn;
  });

  area.appendChild(grid);

  function handleTap(btn, item) {
    if (locked || btn.dataset.matched === 'true' || btn === selectedCard) return;

    setCardState(btn, 'selected');

    if (!selectedCard) {
      selectedCard = btn;
      return;
    }

    const prevItem = items[cardEls.indexOf(selectedCard)];

    if (prevItem.pairId === item.pairId && prevItem.side !== item.side) {
      setCardState(selectedCard, 'match');
      setCardState(btn, 'match');
      selectedCard.dataset.matched = 'true';
      btn.dataset.matched = 'true';
      selectedCard.classList.add('animate-pop');
      btn.classList.add('animate-pop');
      matched++;
      selectedCard = null;
      if (matched === 4) {
        setTimeout(() => onComplete({ correct: 4, timeMs: Date.now() - startTime }), 500);
      }
    } else {
      locked = true;
      setCardState(selectedCard, 'wrong');
      setCardState(btn, 'wrong');
      setTimeout(() => {
        setCardState(selectedCard, 'idle');
        setCardState(btn, 'idle');
        selectedCard = null;
        locked = false;
      }, 700);
    }
  }

  function setCardState(btn, state) {
    const styles = {
      idle:     { border: 'var(--cream-dark)', bg: 'white',    color: 'var(--navy)' },
      selected: { border: 'var(--navy)',        bg: 'var(--cream-dark)', color: 'var(--navy)' },
      match:    { border: '#2D7A3A',            bg: '#D4EDDA', color: '#2D7A3A' },
      wrong:    { border: 'var(--burgundy)',    bg: '#F8D7DA', color: 'var(--burgundy)' },
    };
    const s = styles[state] || styles.idle;
    btn.style.borderColor = s.border;
    btn.style.background  = s.bg;
    btn.style.color       = s.color;
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clearEl(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}
