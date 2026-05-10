/*
 * Lesson 6 — Time, Frequency & Lunch
 * Source session: 12 August 2025
 * Grammar concept: frequency-adverb placement (after verb); déjeuner conjugation
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-06',
  order: 6,
  title: { en: 'Time, Frequency & Lunch', fr: 'Le temps, la fréquence et le déjeuner' },
  theme: 'grammar',
  intro: "Say when things happen and how often. Frequency adverbs go after the verb — not at the start.",

  vocab: [
    { id: 'L6-w01', french: 'voyager',        english: 'to travel',             type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'voyager' },
    { id: 'L6-w02', french: 'arriver',        english: 'to arrive',             type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'arriver' },
    { id: 'L6-w03', french: 'déjeuner',       english: 'to have lunch / lunch', type: 'word',   gender: null, category: 'food',      difficulty: 1, audio_text: 'déjeuner' },
    { id: 'L6-w04', french: 'mais',           english: 'but',                   type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'mais' },
    { id: 'L6-w05', french: "aujourd'hui",    english: 'today',                 type: 'word',   gender: null, category: 'time',      difficulty: 1, audio_text: "aujourd'hui" },
    { id: 'L6-w06', french: 'demain',         english: 'tomorrow',              type: 'word',   gender: null, category: 'time',      difficulty: 1, audio_text: 'demain' },
    { id: 'L6-w07', french: 'après',          english: 'after / afterwards',    type: 'word',   gender: null, category: 'time',      difficulty: 1, audio_text: 'après' },
    { id: 'L6-w08', french: 'midi',           english: 'noon / midday',         type: 'word',   gender: null, category: 'time',      difficulty: 1, audio_text: 'midi' },
    { id: 'L6-w09', french: 'le matin',       english: 'the morning / in the morning', type: 'phrase', gender: null, category: 'time', difficulty: 1, audio_text: 'le matin' },
    { id: 'L6-w10', french: "l'après-midi",   english: 'the afternoon',         type: 'word',   gender: null, category: 'time',      difficulty: 1, audio_text: "l'après-midi" },
    { id: 'L6-w11', french: 'le soir',        english: 'the evening',           type: 'phrase', gender: null, category: 'time',      difficulty: 1, audio_text: 'le soir' },
    { id: 'L6-w12', french: 'souvent',        english: 'often',                 type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'souvent' },
    { id: 'L6-w13', french: 'parfois',        english: 'sometimes',             type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'parfois' },
    { id: 'L6-w14', french: 'toujours',       english: 'always',                type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'toujours' },
  ],

  grammar: [
    { id: 'L6-g01', kind: 'translation',
      prompt: { english: 'I often have lunch at noon.' },
      answer: 'Je déjeune souvent à midi.', accept: ['je dejeune souvent a midi'],
      explanation: 'Frequency adverbs go after the conjugated verb, not at the start of the sentence.' },
    { id: 'L6-g02', kind: 'transform',
      prompt: { source: 'Elle voyage.', instruction: 'Add "sometimes" (parfois)' },
      answer: 'Elle voyage parfois.', accept: ['elle voyage parfois'],
      explanation: 'parfois follows the conjugated verb directly.' },
    { id: 'L6-g03', kind: 'translation',
      prompt: { english: 'She always arrives in the morning.' },
      answer: 'Elle arrive toujours le matin.', accept: ['elle arrive toujours le matin'],
      explanation: 'toujours = always, placed after the conjugated verb.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
