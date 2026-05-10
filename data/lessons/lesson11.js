/*
 * Lesson 11 — Near Future — "I'm going to…"
 * Source session: 4 October 2025
 * Grammar concept: aller + infinitive; negation je ne vais pas + infinitive
 */
registerLesson({
  id:    'lesson-11',
  order: 11,
  title: { en: 'Near Future', fr: 'Le futur proche' },
  theme: 'grammar',
  intro: 'Use aller + infinitive to say what you\'re going to do. It\'s the most natural way to talk about the near future.',

  vocab: [
    { id: 'L11-w01', french: 'dormir',           english: 'to sleep',              type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'dormir' },
    { id: 'L11-w02', french: 'sortir',            english: 'to go out',             type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'sortir' },
    { id: 'L11-w03', french: 'rentrer',           english: 'to go home / return',   type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'rentrer' },
    { id: 'L11-w04', french: 'ce week-end',       english: 'this weekend',          type: 'phrase', gender: null, category: 'time',    difficulty: 1, audio_text: 'ce week-end' },
    { id: 'L11-w05', french: "l'année prochaine", english: 'next year',             type: 'phrase', gender: null, category: 'time',    difficulty: 1, audio_text: "l'année prochaine" },
    { id: 'L11-w06', french: 'bientôt',           english: 'soon',                  type: 'word',   gender: null, category: 'time',    difficulty: 1, audio_text: 'bientôt' },
    // Reuse base-vocab id for manger (w045)
    { id: 'w045',    french: 'manger',            english: 'to eat',                type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'manger' },
  ],

  grammar: [
    { id: 'L11-g01', kind: 'translation',
      prompt: { english: "I'm going to sleep." },
      answer: 'Je vais dormir.', accept: ['je vais dormir'],
      explanation: 'Near future = aller (conjugated) + infinitive.' },
    { id: 'L11-g02', kind: 'translation',
      prompt: { english: "We're going to eat tonight. (use on)" },
      answer: 'On va manger ce soir.', accept: ['on va manger ce soir'],
      explanation: 'on va manger — on uses the il/elle form of aller: va.' },
    { id: 'L11-g03', kind: 'transform',
      prompt: { source: 'Je vais sortir.', instruction: 'Make negative' },
      answer: 'Je ne vais pas sortir.', accept: ['je ne vais pas sortir'],
      explanation: 'ne … pas wraps aller, not the infinitive: je ne vais pas sortir.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
