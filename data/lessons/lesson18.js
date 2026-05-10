/*
 * Lesson 18 — Plurals — DES → DE, EAU → EAUX
 * Source sessions: 6 April, 11 April 2026
 * Grammar concept: des → de when adjective precedes noun; eau → eaux plural; il y a
 */
registerLesson({
  id:    'lesson-18',
  order: 18,
  title: { en: 'Plurals & Articles', fr: 'Les pluriels et les articles' },
  theme: 'grammar',
  intro: 'Two plural traps: des changes to de before an adjective, and words ending in -eau become -eaux.',

  vocab: [
    { id: 'L18-w01', french: 'une voiture',        english: 'a car',                    type: 'word',   gender: 'f',  category: 'grammar', difficulty: 1, audio_text: 'une voiture' },
    { id: 'L18-w02', french: 'la fête',            english: 'the party / festival',     type: 'word',   gender: 'f',  category: 'grammar', difficulty: 1, audio_text: 'la fête' },
    { id: 'L18-w03', french: 'un anniversaire',    english: 'a birthday / anniversary', type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un anniversaire' },
    { id: 'L18-w04', french: 'il y a',             english: 'there is / there are',     type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'il y a' },
    { id: 'L18-w05', french: 'beaucoup de',        english: 'a lot of / many',          type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'beaucoup de' },
    { id: 'L18-w06', french: 'une bibliothèque',   english: 'a library',                type: 'word',   gender: 'f',  category: 'places',  difficulty: 1, audio_text: 'une bibliothèque' },
    { id: 'L18-w07', french: 'un musée',           english: 'a museum',                 type: 'word',   gender: 'm',  category: 'places',  difficulty: 1, audio_text: 'un musée' },
    { id: 'L18-w08', french: 'un film',            english: 'a film / movie',           type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un film' },
    { id: 'L18-w09', french: 'un pays',            english: 'a country',                type: 'word',   gender: 'm',  category: 'countries',difficulty: 1, audio_text: 'un pays' },
    { id: 'L18-w10', french: 'prochain / prochaine',english: 'next',                   type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'prochain' },
    { id: 'L18-w11', french: 'la semaine prochaine',english: 'next week',              type: 'phrase', gender: null, category: 'time',    difficulty: 1, audio_text: 'la semaine prochaine' },
    { id: 'L18-w12', french: 'en bus',             english: 'by bus',                   type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'en bus' },
  ],

  grammar: [
    { id: 'L18-g01', kind: 'transform',
      prompt: { source: 'des amis', instruction: 'Add "good" (bons) before the noun' },
      answer: 'de bons amis', accept: ['de bons amis'],
      explanation: 'des → de when a BAGS adjective comes before the noun (de bons amis, not des bons amis).' },
    { id: 'L18-g02', kind: 'transform',
      prompt: { source: 'un rideau', instruction: 'Make plural' },
      answer: 'des rideaux', accept: ['des rideaux'],
      explanation: 'Words ending in -eau form their plural with -eaux: rideau → rideaux.' },
    { id: 'L18-g03', kind: 'translation',
      prompt: { english: 'There are a lot of museums in Paris.' },
      answer: "Il y a beaucoup de musées à Paris.", accept: ['il y a beaucoup de musees a paris'],
      explanation: "il y a = there is / there are. beaucoup de (not beaucoup des)." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
