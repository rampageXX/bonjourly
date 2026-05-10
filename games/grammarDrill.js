/*
 * Grammar Drill game
 * initGrammarDrill(item, onComplete)
 *   item       — grammar item object with kind, prompt, answer, accept[], explanation
 *   onComplete — called with { correct: bool, timeMs }
 *
 * Three sub-modes:
 *   conjugation — lemma + person → conjugated form  (Levenshtein ≤ 1)
 *   translation — English sentence → French          (Levenshtein ≤ 2)
 *   transform   — source sentence + instruction       (Levenshtein ≤ 2)
 */

function initGrammarDrill(item, onComplete) {
  var area = document.getElementById('game-area');
  clearEl(area);

  var startTime = Date.now();
  var answered  = false;
  var threshold = item.kind === 'conjugation' ? 1 : 2;

  // --- Header ---
  var header = document.createElement('div');
  header.style.cssText = 'text-align:center; margin-bottom:20px;';

  var title = document.createElement('h3');
  title.className = 'serif';
  title.style.cssText = 'color:var(--navy); font-size:1.2rem; margin-bottom:4px;';

  var hint = document.createElement('p');
  hint.style.cssText = 'font-size:0.8rem; color:var(--text-light); margin-bottom:0;';

  // --- Prompt card ---
  var promptCard = document.createElement('div');
  promptCard.className = 'poster-card';
  promptCard.style.cssText = 'text-align:center; padding:24px 20px; margin-bottom:24px;';

  if (item.kind === 'conjugation') {
    title.textContent = 'Conjugate';
    hint.textContent  = 'Type the conjugated form';

    var lemmaEl = document.createElement('div');
    lemmaEl.className = 'serif';
    lemmaEl.style.cssText = 'font-size:2rem; font-weight:700; color:var(--navy); margin-bottom:8px;';
    lemmaEl.textContent = item.prompt.lemma;

    var personEl = document.createElement('div');
    personEl.style.cssText = 'font-size:1rem; color:var(--text-light); margin-bottom:6px;';
    personEl.textContent = 'for ' + item.prompt.person;

    var hintEl = document.createElement('div');
    hintEl.style.cssText = 'font-size:0.9rem; color:var(--gold); font-style:italic;';
    hintEl.textContent = '(' + item.prompt.english_hint + ')';

    promptCard.appendChild(lemmaEl);
    promptCard.appendChild(personEl);
    promptCard.appendChild(hintEl);

  } else if (item.kind === 'translation') {
    title.textContent = 'Translate into French';
    hint.textContent  = 'Type the French translation';

    var engLabel = document.createElement('div');
    engLabel.style.cssText = 'font-size:0.7rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-light); margin-bottom:8px;';
    engLabel.textContent = 'English';

    var engText = document.createElement('div');
    engText.className = 'serif';
    engText.style.cssText = 'font-size:1.4rem; font-weight:700; color:var(--navy);';
    engText.textContent = item.prompt.english;

    promptCard.appendChild(engLabel);
    promptCard.appendChild(engText);

  } else {
    // transform
    title.textContent = 'Transform';
    hint.textContent  = item.prompt.instruction;

    var instrLabel = document.createElement('div');
    instrLabel.style.cssText = 'font-size:0.75rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--burgundy); margin-bottom:10px;';
    instrLabel.textContent = item.prompt.instruction;

    var srcText = document.createElement('div');
    srcText.className = 'serif';
    srcText.style.cssText = 'font-size:1.4rem; font-weight:700; color:var(--navy);';
    srcText.textContent = item.prompt.source;

    promptCard.appendChild(instrLabel);
    promptCard.appendChild(srcText);
  }

  // --- Input row ---
  var inputWrap = document.createElement('div');
  inputWrap.style.cssText = 'display:flex; gap:10px; margin-bottom:16px;';

  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input';
  input.placeholder = 'Type in French…';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'none');
  input.setAttribute('spellcheck', 'false');
  input.style.flex = '1';
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitAnswer();
  });

  var submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn-primary';
  submitBtn.textContent = '→';
  submitBtn.style.padding = '13px 20px';
  submitBtn.addEventListener('click', submitAnswer);

  inputWrap.appendChild(input);
  inputWrap.appendChild(submitBtn);

  // --- Feedback area ---
  var feedback = document.createElement('div');
  feedback.style.cssText = 'text-align:center; min-height:48px;';

  header.appendChild(title);
  header.appendChild(hint);
  area.appendChild(header);
  area.appendChild(promptCard);
  area.appendChild(inputWrap);
  area.appendChild(feedback);

  setTimeout(function() { input.focus(); }, 300);

  function submitAnswer() {
    if (answered) return;
    var userVal = input.value.trim();
    if (!userVal) return;
    answered = true;
    input.disabled    = true;
    submitBtn.disabled = true;

    var correct = isSentenceAccepted(userVal, item.answer, item.accept, threshold);
    var timeMs  = Date.now() - startTime;

    if (correct) {
      input.style.borderColor = '#2D7A3A';
      input.style.background  = '#D4EDDA';
      showFeedback(true);
    } else {
      input.style.borderColor = 'var(--burgundy)';
      input.style.background  = '#F8D7DA';
      showFeedback(false);
      speak(item.answer);
    }

    setTimeout(function() { onComplete({ correct: correct, timeMs: timeMs }); }, 1600);
  }

  function showFeedback(correct) {
    clearEl(feedback);

    var row = document.createElement('div');
    row.style.marginBottom = '6px';

    var icon = document.createElement('span');
    icon.style.cssText = 'font-size:1.4rem; margin-right:8px;';
    icon.textContent = correct ? '✅' : '❌';

    var text = document.createElement('span');
    text.style.cssText = 'font-size:0.9rem; font-weight:600; color:' +
      (correct ? '#2D7A3A' : 'var(--burgundy)') + ';';
    text.textContent = correct ? 'Correct!' : item.answer;

    row.appendChild(icon);
    row.appendChild(text);
    feedback.appendChild(row);

    if (!correct && item.explanation) {
      var expEl = document.createElement('div');
      expEl.style.cssText = 'font-size:0.8rem; color:var(--text-light); font-style:italic; ' +
        'margin-top:6px; padding:8px 12px; background:var(--cream); border-radius:6px; text-align:left;';
      expEl.textContent = item.explanation;
      feedback.appendChild(expEl);
    }
  }
}
