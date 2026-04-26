/*
 * Type Translation game
 * initTypeTranslation(word, onComplete)
 *   word       — vocab object
 *   onComplete — called with { correct: bool, timeMs }
 */

function initTypeTranslation(word, onComplete) {
  const area = document.getElementById('game-area');
  clearEl(area);

  const startTime = Date.now();
  let answered = false;

  // Prompt
  const header = document.createElement('div');
  header.style.cssText = 'text-align:center; margin-bottom:28px;';

  const title = document.createElement('h3');
  title.className = 'serif';
  title.style.cssText = 'color:var(--navy); font-size:1.2rem; margin-bottom:4px;';
  title.textContent = 'Type the French';

  const hint = document.createElement('p');
  hint.style.cssText = 'font-size:0.8rem; color:var(--text-light); margin-bottom:20px;';
  hint.textContent = 'Translate this English word into French';

  const promptCard = document.createElement('div');
  promptCard.className = 'poster-card';
  promptCard.style.cssText = 'text-align:center; padding:24px 20px; margin-bottom:24px;';

  const englishLabel = document.createElement('div');
  englishLabel.style.cssText = 'font-size:0.7rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-light); margin-bottom:8px;';
  englishLabel.textContent = 'English';

  const englishWord = document.createElement('div');
  englishWord.className = 'serif';
  englishWord.style.cssText = 'font-size:1.8rem; font-weight:700; color:var(--navy);';
  englishWord.textContent = word.english;

  promptCard.appendChild(englishLabel);
  promptCard.appendChild(englishWord);

  // Input area
  const inputWrap = document.createElement('div');
  inputWrap.style.cssText = 'display:flex; gap:10px; margin-bottom:16px;';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input';
  input.placeholder = 'French translation…';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'none');
  input.setAttribute('spellcheck', 'false');
  input.style.flex = '1';
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitAnswer();
  });

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = '→';
  submitBtn.style.padding = '13px 20px';
  submitBtn.addEventListener('click', submitAnswer);

  inputWrap.appendChild(input);
  inputWrap.appendChild(submitBtn);

  // Feedback area
  const feedback = document.createElement('div');
  feedback.style.cssText = 'text-align:center; min-height:48px;';

  header.appendChild(title);
  header.appendChild(hint);
  area.appendChild(header);
  area.appendChild(promptCard);
  area.appendChild(inputWrap);
  area.appendChild(feedback);

  // Focus input after a short delay (prevents keyboard glitch on iOS)
  setTimeout(() => input.focus(), 300);

  function submitAnswer() {
    if (answered) return;
    const userVal = input.value.trim();
    if (!userVal) return;

    answered = true;
    input.disabled = true;
    submitBtn.disabled = true;

    const isCorrect = isAnswerAccepted(userVal, word.french);
    const timeMs = Date.now() - startTime;

    if (isCorrect) {
      input.style.borderColor = '#2D7A3A';
      input.style.background = '#D4EDDA';
      showFeedback(feedback, true, word.french);
    } else {
      input.style.borderColor = 'var(--burgundy)';
      input.style.background = '#F8D7DA';
      showFeedback(feedback, false, word.french);
      speak(word.audio_text);
    }

    setTimeout(() => onComplete({ correct: isCorrect, timeMs }), 1400);
  }

  function showFeedback(container, correct, correctAnswer) {
    clearEl(container);

    const icon = document.createElement('span');
    icon.style.cssText = 'font-size:1.4rem; margin-right:8px;';
    icon.textContent = correct ? '✅' : '❌';

    const text = document.createElement('span');
    text.style.cssText = 'font-size:0.9rem; font-weight:600; color:' + (correct ? '#2D7A3A' : 'var(--burgundy)') + ';';
    text.textContent = correct ? 'Correct!' : 'The answer is: ' + correctAnswer;

    container.appendChild(icon);
    container.appendChild(text);
  }
}
