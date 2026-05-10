/*
 * Lesson 19 — Verb AVOIR + Travel
 * Source session: 25 April 2026
 * Grammar concept: full avoir conjugation (j'ai / tu as / il a / nous avons / vous avez / ils ont)
 */
registerLesson({
  id:    'lesson-19',
  order: 19,
  title: { en: 'AVOIR + Travel', fr: 'Le verbe AVOIR et les voyages' },
  theme: 'grammar',
  intro: 'AVOIR (to have) is the second most essential verb. Master it alongside travel vocabulary.',

  vocab: [
    // Travel prepositions
    { id: 'L19-w01', french: 'en avion',         english: 'by plane',              type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'en avion' },
    { id: 'L19-w02', french: 'en train',         english: 'by train',              type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'en train' },
    { id: 'L19-w03', french: 'en voiture',       english: 'by car',                type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'en voiture' },
    { id: 'L19-w04', french: 'à pied',           english: 'on foot',               type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'à pied' },
    { id: 'L19-w05', french: 'à vélo',           english: 'by bike',               type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'à vélo' },
    // Holiday vocab
    { id: 'L19-w06', french: 'des vacances',     english: 'a holiday / vacation',  type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'des vacances' },
    { id: 'L19-w07', french: 'une valise',       english: 'a suitcase',            type: 'word',   gender: 'f',  category: 'grammar', difficulty: 1, audio_text: 'une valise' },
    { id: 'L19-w08', french: 'un sac',           english: 'a bag',                 type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un sac' },
    { id: 'L19-w09', french: 'un hôtel',         english: 'a hotel',               type: 'word',   gender: 'm',  category: 'places',  difficulty: 1, audio_text: 'un hôtel' },
    { id: 'L19-w10', french: 'une semaine',      english: 'a week',                type: 'word',   gender: 'f',  category: 'time',    difficulty: 1, audio_text: 'une semaine' },
    { id: 'L19-w11', french: 'intéressant',      english: 'interesting',           type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'intéressant' },
    { id: 'L19-w12', french: 'un métier',        english: 'a job / profession',    type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un métier' },
    // Reuse base-vocab ids for avoir (w042), fils (w016), fille (w017)
    { id: 'w042',    french: 'avoir',            english: 'to have',               type: 'word',   gender: null, category: 'verbs',   difficulty: 2, audio_text: 'avoir' },
    { id: 'w016',    french: 'le fils',          english: 'the son',               type: 'word',   gender: 'm',  category: 'family',  difficulty: 1, audio_text: 'le fils' },
    { id: 'w017',    french: 'la fille',         english: 'the daughter',          type: 'word',   gender: 'f',  category: 'family',  difficulty: 1, audio_text: 'la fille' },
  ],

  grammar: [
    { id: 'L19-g01', kind: 'conjugation',
      prompt: { lemma: 'avoir', person: 'je', english_hint: 'I have' },
      answer: "j'ai", accept: ['j ai', 'je ai'],
      explanation: "avoir is irregular: j'ai (j' before vowel), tu as, il/elle a, nous avons, vous avez, ils ont." },
    { id: 'L19-g02', kind: 'conjugation',
      prompt: { lemma: 'avoir', person: 'ils', english_hint: 'they have' },
      answer: 'ils ont', accept: ['ont'],
      explanation: 'ils ont — note: ils ont (they have) vs ils sont (they are).' },
    { id: 'L19-g03', kind: 'translation',
      prompt: { english: 'I have a suitcase. We go by train.' },
      answer: "J'ai une valise. On va en train.", accept: ["j'ai une valise on va en train", "j ai une valise on va en train"],
      explanation: "j'ai + noun. en train = by train (transport by vehicle uses en)." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
