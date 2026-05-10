/*
 * LESSON AUTHORING TEMPLATE
 * ─────────────────────────
 * Copy this file to lesson02.js, fill in, then add a <script src="..."> in index.html
 * (after _registry.js, before app.js).
 *
 * ID namespacing:
 *   Vocab:   L<lesson-number>-w<two-digit-index>  e.g. 'L2-w01'
 *   Grammar: L<lesson-number>-g<two-digit-index>  e.g. 'L2-g01'
 *
 *   Exception: if a word already exists in data/vocab.js (w001-w060), reuse
 *   that id instead of making a lesson-namespaced one. The vocab item is then
 *   NOT included in the lesson's vocab[] — it's already in the global pool.
 *
 * Grammar kinds:
 *   'conjugation' — prompt.lemma + prompt.person + prompt.english_hint → answer
 *   'translation' — prompt.english → answer (full sentence translation)
 *   'transform'   — prompt.source + prompt.instruction → answer
 *
 * Acceptance:
 *   answer  — exact correct answer
 *   accept  — array of acceptable alternatives (case+accent insensitive after normalize)
 *   explanation — shown after a wrong answer
 */

registerLesson({
  id:    'lesson-02',           // must be unique; keep 'lesson-NN' pattern
  order: 2,                     // sequential unlock index (1 = first unlocked)
  title: { en: 'English title', fr: 'Titre en français' },
  theme: 'classroom',           // freeform tag; drives icon in lessons list
  intro: 'One or two sentence description shown on the detail screen.',

  vocab: [
    // { id, french, english, type ('word'|'phrase'), gender ('m'|'f'|null),
    //   category, difficulty (1|2), audio_text }
    { id: 'L2-w01', french: 'ici', english: 'here', type: 'word', gender: null,
      category: 'location', difficulty: 1, audio_text: 'ici' },
    // …more vocab items…
  ],

  grammar: [
    // { id, kind, prompt, answer, accept (optional), explanation (optional) }
    { id: 'L2-g01', kind: 'conjugation',
      prompt: { lemma: 'regarder', person: 'tu', english_hint: 'you look' },
      answer: 'tu regardes', accept: ['regardes'],
      explanation: '-er stem + es for tu' },

    { id: 'L2-g02', kind: 'translation',
      prompt: { english: 'Look at Notre-Dame, over there!' },
      answer: 'Regarde Notre-Dame, là-bas !', accept: ['regarde notre-dame là-bas'],
      explanation: 'Imperative singular drops the subject pronoun' },

    { id: 'L2-g03', kind: 'transform',
      prompt: { source: 'Vous regardez.', instruction: "Make it 'Let's'" },
      answer: 'Regardons !', accept: ['regardons'],
      explanation: 'Replace -er with -ons for the "let\'s" form' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
