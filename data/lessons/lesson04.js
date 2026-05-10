/*
 * Lesson 4 — Negation & "Let's"
 * Source session: 24 July 2025
 * Grammar concept: ne…pas / n'…pas negation; -ons ending for "Let's"; accents
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-04',
  order: 4,
  title: { en: "Negation & \"Let's\"", fr: 'La négation et « on y va »' },
  theme: 'grammar',
  intro: "Learn to say what you don't do (ne…pas) and suggest things together with the -ons ending.",

  vocab: [
    { id: 'L4-w01', french: 'moi',          english: 'me / I (emphatic)',  type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'moi' },
    { id: 'L4-w02', french: 'français',     english: 'French',             type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'français' },
    { id: 'L4-w03', french: 'chanter',      english: 'to sing',            type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'chanter' },
    { id: 'L4-w04', french: 'écouter',      english: 'to listen',          type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'écouter' },
    { id: 'L4-w05', french: 'alors',        english: 'so / then / well',   type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'alors' },
    { id: 'L4-w06', french: 'ou',           english: 'or',                 type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'ou' },
    { id: 'L4-w07', french: 'avec',         english: 'with',               type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'avec' },
    { id: 'L4-w08', french: 'pas encore',   english: 'not yet',            type: 'phrase', gender: null, category: 'grammar',   difficulty: 1, audio_text: 'pas encore' },
    { id: 'L4-w09', french: 'ensemble',     english: 'together',           type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'ensemble' },
    { id: 'L4-w10', french: 'maintenant',   english: 'now',                type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'maintenant' },
    { id: 'L4-w11', french: 'ne … pas',     english: 'not (negation wrap)',type: 'phrase', gender: null, category: 'grammar',   difficulty: 2, audio_text: 'ne pas' },
    // Reuse base-vocab id for 'parler' (already in Lesson 0 as w047)
    { id: 'w047',   french: 'parler',       english: 'to speak',           type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'parler' },
  ],

  grammar: [
    { id: 'L4-g01', kind: 'transform',
      prompt: { source: 'Je parle français.', instruction: 'Make negative' },
      answer: 'Je ne parle pas français.', accept: ['je ne parle pas francais'],
      explanation: 'ne … pas wraps the conjugated verb: je ne parle pas.' },
    { id: 'L4-g02', kind: 'translation',
      prompt: { english: "Let's sing together!" },
      answer: 'Chantons ensemble !', accept: ['chantons ensemble'],
      explanation: "Add -ons to the verb stem for 'let's' (chanter → chant- → chantons)." },
    { id: 'L4-g03', kind: 'transform',
      prompt: { source: 'Tu écoutes.', instruction: 'Make negative' },
      answer: "Tu n'écoutes pas.", accept: ["tu n ecoutes pas", "tu n'ecoutes pas"],
      explanation: "ne becomes n' before a vowel or silent h." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
