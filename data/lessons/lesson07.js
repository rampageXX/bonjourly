/*
 * Lesson 7 — "On" — informal "we"
 * Source session: 19 August 2025
 * Grammar concept: on as informal nous; on regarde = nous regardons
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-07',
  order: 7,
  title: { en: '"On" — informal "we"', fr: '"On" — le nous informel' },
  theme: 'grammar',
  intro: 'In everyday French, "on" does the job of "we". On regarde la télé means we\'re watching TV.',

  vocab: [
    { id: 'L7-w01', french: 'on',              english: 'we (informal) / one',  type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'on' },
    { id: 'L7-w02', french: 'tout le monde',   english: 'everyone / everybody', type: 'phrase', gender: null, category: 'grammar',   difficulty: 1, audio_text: 'tout le monde' },
    { id: 'L7-w03', french: 'ce soir',         english: 'tonight / this evening',type: 'phrase', gender: null, category: 'time',     difficulty: 1, audio_text: 'ce soir' },
    { id: 'L7-w04', french: 'ce matin',        english: 'this morning',          type: 'phrase', gender: null, category: 'time',     difficulty: 1, audio_text: 'ce matin' },
    { id: 'L7-w05', french: 'la télévision',   english: 'the television',        type: 'word',   gender: 'f',  category: 'house',    difficulty: 1, audio_text: 'la télévision' },
    { id: 'L7-w06', french: "j'arrive",        english: "I'm coming / I'm on my way", type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: "j'arrive" },
  ],

  grammar: [
    { id: 'L7-g01', kind: 'translation',
      prompt: { english: "We're watching TV tonight. (use on)" },
      answer: 'On regarde la télévision ce soir.', accept: ['on regarde la television ce soir', 'on regarde la tele ce soir'],
      explanation: 'on uses the il/elle verb form — on regarde, not on regardons.' },
    { id: 'L7-g02', kind: 'transform',
      prompt: { source: 'Nous regardons la télévision.', instruction: 'Rewrite using on' },
      answer: 'On regarde la télévision.', accept: ['on regarde la television'],
      explanation: 'Swap "nous + -ons form" for "on + -e/-identical il form".' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
