/*
 * Listen & Pick game
 * initListenAndPick(word, allWords, onComplete)
 *   word       — the target vocab object
 *   allWords   — full vocab pool (for building distractors)
 *   onComplete — called with { correct: bool, timeMs }
 */

function initListenAndPick(word, allWords, onComplete) {
  const area = document.getElementById('game-area');
  clearEl(area);

  const startTime = Date.now();
  let answered = false;

  // Build 4 options: correct + 3 random distractors from same category or random
  const distractors = shuffle(
    allWords.filter(w => w.id !== word.id)
  ).slice(0, 3);
  const options = shuffle([word, ...distractors]);

  // Header
  const header = document.createElement('div');
  header.style.cssText = 'text-align:center; margin-bottom:28px;';

  const title = document.createElement('h3');
  title.className = 'serif';
  title.style.cssText = 'color:var(--navy); font-size:1.2rem; margin-bottom:4px;';
  title.textContent = 'Listen & pick';

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:0.8rem; color:var(--text-light); margin-bottom:20px;';
  hint.textContent = 'What does the French word mean?';

  // Speaker button
  const speakerBtn = document.createElement('button');
  speakerBtn.style.cssText = `
    width:80px; height:80px; border-radius:50%; border:3px solid var(--navy);
    background:var(--navy); color:white; font-size:2rem; cursor:pointer;
    transition:all 0.18s; box-shadow:var(--shadow-md); display:inline-flex;
    align-items:center; justify-content:center;
  `;
  speakerBtn.textContent = '🔊';
  speakerBtn.setAttribute('aria-label', 'Play French word');
  speakerBtn.addEventListener('click', playWord);

  const replayHint = document.createElement('p');
  replayHint.style.cssText = 'font-size:0.72rem; color:var(--text-light); margin-top:8px;';
  replayHint.textContent = 'Tap to replay';

  header.appendChild(title);
  header.appendChild(hint);
  header.appendChild(speakerBtn);
  header.appendChild(replayHint);
  area.appendChild(header);

  // Options
  const optList = document.createElement('div');
  optList.style.cssText = 'display:flex; flex-direction:column; gap:10px;';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.style.cssText = `
      padding:16px 20px; border:2px solid var(--cream-dark); border-radius:var(--radius);
      background:white; font-family:'Inter',sans-serif; font-size:0.95rem; font-weight:600;
      color:var(--navy); cursor:pointer; transition:all 0.18s; text-align:left;
      box-shadow:var(--shadow-sm);
    `;
    btn.textContent = opt.english;
    btn.addEventListener('click', () => handlePick(btn, opt));
    optList.appendChild(btn);
  });

  area.appendChild(optList);

  // Auto-play on load
  setTimeout(playWord, 300);

  function playWord() {
    speakerBtn.style.transform = 'scale(0.92)';
    speak(word.audio_text, () => {
      speakerBtn.style.transform = 'scale(1)';
    });
  }

  function handlePick(btn, chosen) {
    if (answered) return;
    answered = true;

    const isCorrect = chosen.id === word.id;
    const timeMs = Date.now() - startTime;

    // Highlight all buttons
    optList.querySelectorAll('button').forEach(b => {
      const isThis = b === btn;
      const isCorrectBtn = b.textContent === word.english;
      if (isCorrectBtn) {
        b.style.borderColor = '#2D7A3A';
        b.style.background  = '#D4EDDA';
        b.style.color       = '#2D7A3A';
      } else if (isThis && !isCorrect) {
        b.style.borderColor = 'var(--burgundy)';
        b.style.background  = '#F8D7DA';
        b.style.color       = 'var(--burgundy)';
      }
      b.disabled = true;
    });

    if (!isCorrect) {
      // Show correct answer label
      const correctLabel = document.createElement('p');
      correctLabel.style.cssText = 'text-align:center; color:var(--navy); font-size:0.85rem; margin-top:12px; font-weight:600;';
      correctLabel.textContent = 'The correct answer: ' + word.english;
      optList.after(correctLabel);
      speak(word.audio_text);
    }

    setTimeout(() => onComplete({ correct: isCorrect, timeMs }), 1200);
  }
}
