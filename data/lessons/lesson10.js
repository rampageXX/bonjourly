/*
 * Lesson 10 — Months & Verb ALLER
 * Source session: 27 September 2025
 * Grammar concept: full aller conjugation (je vais / tu vas / il va / nous allons / vous allez / ils vont)
 */
registerLesson({
  id:    'lesson-10',
  order: 10,
  title: { en: 'Months & Verb ALLER', fr: 'Les mois et le verbe ALLER' },
  theme: 'grammar',
  intro: 'Learn the months of the year and master aller — the most-used irregular verb in French.',

  vocab: [
    // Months (all new — not in Lesson 0)
    { id: 'L10-w01', french: 'janvier',    english: 'January',         type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'janvier' },
    { id: 'L10-w02', french: 'février',    english: 'February',        type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'février' },
    { id: 'L10-w03', french: 'mars',       english: 'March',           type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'mars' },
    { id: 'L10-w04', french: 'avril',      english: 'April',           type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'avril' },
    { id: 'L10-w05', french: 'mai',        english: 'May',             type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'mai' },
    { id: 'L10-w06', french: 'juin',       english: 'June',            type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'juin' },
    { id: 'L10-w07', french: 'juillet',    english: 'July',            type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'juillet' },
    { id: 'L10-w08', french: 'août',       english: 'August',          type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'août' },
    { id: 'L10-w09', french: 'septembre',  english: 'September',       type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'septembre' },
    { id: 'L10-w10', french: 'octobre',    english: 'October',         type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'octobre' },
    { id: 'L10-w11', french: 'novembre',   english: 'November',        type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'novembre' },
    { id: 'L10-w12', french: 'décembre',   english: 'December',        type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'décembre' },
    // Key adverbs and verbs from this session
    { id: 'L10-w13', french: 'travailler', english: 'to work',         type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'travailler' },
    { id: 'L10-w14', french: 'trop',       english: 'too much / too',  type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'trop' },
    { id: 'L10-w15', french: 'vite',       english: 'quickly / fast',  type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'vite' },
    { id: 'L10-w16', french: 'loin',       english: 'far away',        type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'loin' },
    { id: 'L10-w17', french: 'puis',       english: 'then / next',     type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'puis' },
    // Reuse base-vocab id for aller (w043)
    { id: 'w043',    french: 'aller',      english: 'to go',           type: 'word',   gender: null, category: 'verbs',   difficulty: 2, audio_text: 'aller' },
  ],

  grammar: [
    { id: 'L10-g01', kind: 'conjugation',
      prompt: { lemma: 'aller', person: 'je', english_hint: 'I go' },
      answer: 'je vais', accept: ['vais'],
      explanation: 'aller is fully irregular: je vais (not je alle).' },
    { id: 'L10-g02', kind: 'conjugation',
      prompt: { lemma: 'aller', person: 'ils', english_hint: 'they go' },
      answer: 'ils vont', accept: ['vont'],
      explanation: 'ils vont — the most irregular form of aller.' },
    { id: 'L10-g03', kind: 'translation',
      prompt: { english: 'He goes to work in July.' },
      answer: 'Il va au travail en juillet.', accept: ['il va au travail en juillet'],
      explanation: 'il va (not il aller). Month names use en, no capital in French.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
