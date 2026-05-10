/*
 * Lesson 3 — Borrowing & Going Places
 * Source sessions: 20 July 2025, 12 August 2025
 * Grammar concept: à + place — au (masc) / à la (fem) / aux (plural)
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-03',
  order: 3,
  title: { en: 'Borrowing & Going Places', fr: 'Emprunter et aller quelque part' },
  theme: 'grammar',
  intro: 'Ask if you can borrow something, say where people are going, and use au / à la / aux correctly.',

  vocab: [
    { id: 'L3-w01', french: 'Je peux…',       english: 'I can… / May I…',              type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'je peux' },
    { id: 'L3-w02', french: 'emprunter',       english: 'to borrow',                    type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'emprunter' },
    { id: 'L3-w03', french: 'au travail',      english: 'to/at work',                   type: 'phrase', gender: null, category: 'places',    difficulty: 1, audio_text: 'au travail' },
    { id: 'L3-w04', french: 'à la piscine',    english: 'to/at the pool',               type: 'phrase', gender: null, category: 'places',    difficulty: 1, audio_text: 'à la piscine' },
    { id: 'L3-w05', french: 'aux toilettes',   english: 'to/at the toilets',            type: 'phrase', gender: null, category: 'places',    difficulty: 1, audio_text: 'aux toilettes' },
    { id: 'L3-w06', french: 'il fait chaud',   english: "it's hot",                     type: 'phrase', gender: null, category: 'weather',   difficulty: 1, audio_text: 'il fait chaud' },
    { id: 'L3-w07', french: 'il fait froid',   english: "it's cold",                    type: 'phrase', gender: null, category: 'weather',   difficulty: 1, audio_text: 'il fait froid' },
    { id: 'L3-w08', french: 'au',              english: 'to the / at the (masc. place)',type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'au' },
    { id: 'L3-w09', french: 'à la',            english: 'to the / at the (fem. place)', type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'à la' },
    { id: 'L3-w10', french: 'aux',             english: 'to the / at the (plural)',     type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'aux' },
    // Reuse base-vocab id for 'aller' (already in Lesson 0 as w043)
    { id: 'w043',   french: 'aller',           english: 'to go',                        type: 'word',   gender: null, category: 'verbs',     difficulty: 2, audio_text: 'aller' },
  ],

  grammar: [
    { id: 'L3-g01', kind: 'translation',
      prompt: { english: 'I go to work.' },
      answer: 'Je vais au travail.', accept: ['je vais au travail'],
      explanation: 'au = à + le. Use au before masculine places.' },
    { id: 'L3-g02', kind: 'translation',
      prompt: { english: 'She goes to the pool.' },
      answer: 'Elle va à la piscine.', accept: ['elle va a la piscine'],
      explanation: 'à la before feminine places.' },
    { id: 'L3-g03', kind: 'translation',
      prompt: { english: 'May I go to the toilets?' },
      answer: 'Je peux aller aux toilettes ?', accept: ['je peux aller aux toilettes'],
      explanation: 'aux = à + les (plural places). Je peux = I can / may I.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
