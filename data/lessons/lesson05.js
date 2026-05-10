/*
 * Lesson 5 — Present-Tense -ER Verbs & Pronouns
 * Source session: 5 August 2025
 * Grammar concept: full je/tu/il/elle/nous/vous/ils/elles conjugation of -ER verbs;
 *                  questions without "do"; en vs à for country/city
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-05',
  order: 5,
  title: { en: '-ER Verbs & Pronouns', fr: 'Les verbes en -ER et les pronoms' },
  theme: 'grammar',
  intro: 'Regular -ER verbs all follow one pattern. Once you know it you can conjugate hundreds of verbs.',

  vocab: [
    { id: 'L5-w01', french: 'habiter',      english: 'to live (in a place)',   type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'habiter' },
    { id: 'L5-w02', french: 'visiter',      english: 'to visit',               type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'visiter' },
    { id: 'L5-w03', french: 'trouver',      english: 'to find',                type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'trouver' },
    { id: 'L5-w04', french: 'aimer',        english: 'to love / to like',      type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'aimer' },
    { id: 'L5-w05', french: 'aimer bien',   english: 'to like (less intense)', type: 'phrase', gender: null, category: 'verbs',     difficulty: 1, audio_text: 'aimer bien' },
    { id: 'L5-w06', french: 'anglais',      english: 'English',                type: 'word',   gender: null, category: 'countries', difficulty: 1, audio_text: 'anglais' },
    { id: 'L5-w07', french: "l'Angleterre", english: 'England',                type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: "l'Angleterre" },
    { id: 'L5-w08', french: 'Londres',      english: 'London',                 type: 'word',   gender: null, category: 'countries', difficulty: 1, audio_text: 'Londres' },
    { id: 'L5-w09', french: 'très',         english: 'very',                   type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'très' },
    { id: 'L5-w10', french: 'aussi',        english: 'also / too',             type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'aussi' },
    { id: 'L5-w11', french: 'bien',         english: 'well / good',            type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'bien' },
    { id: 'L5-w12', french: 'près de',      english: 'near / close to',        type: 'phrase', gender: null, category: 'grammar',   difficulty: 1, audio_text: 'près de' },
  ],

  grammar: [
    { id: 'L5-g01', kind: 'conjugation',
      prompt: { lemma: 'habiter', person: 'je', english_hint: 'I live' },
      answer: "j'habite", accept: ['j habite', 'je habite'],
      explanation: "-er stem + -e for je. Use j' before a vowel." },
    { id: 'L5-g02', kind: 'conjugation',
      prompt: { lemma: 'habiter', person: 'nous', english_hint: 'we live' },
      answer: 'nous habitons', accept: ['habitons'],
      explanation: '-er stem + -ons for nous.' },
    { id: 'L5-g03', kind: 'conjugation',
      prompt: { lemma: 'aimer', person: 'ils', english_hint: 'they like/love' },
      answer: 'ils aiment', accept: ['aiment'],
      explanation: '-er stem + -ent for ils/elles. The -ent ending is always silent.' },
    { id: 'L5-g04', kind: 'translation',
      prompt: { english: 'She lives near London.' },
      answer: 'Elle habite près de Londres.', accept: ['elle habite pres de Londres', 'elle habite pres de londre'],
      explanation: 'habiter + près de + city name. No preposition change — just add the city.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
