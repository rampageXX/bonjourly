/*
 * Lesson 16 — House & BAGS Adjectives
 * Source sessions: 19 February, 28 February 2026
 * Grammar concept: adjectives go after the noun EXCEPT BAGS (Beauty/Age/Goodness/Size) which go before
 */
registerLesson({
  id:    'lesson-16',
  order: 16,
  title: { en: 'House & BAGS Adjectives', fr: 'La maison et les adjectifs BAGS' },
  theme: 'grammar',
  intro: 'Most French adjectives follow the noun. But BAGS adjectives — Beauty, Age, Goodness, Size — come before.',

  vocab: [
    { id: 'L16-w01', french: 'un appartement',   english: 'a flat / apartment',  type: 'word',   gender: 'm',  category: 'house',   difficulty: 1, audio_text: 'un appartement' },
    { id: 'L16-w02', french: 'un immeuble',       english: 'a block of flats',    type: 'word',   gender: 'm',  category: 'house',   difficulty: 1, audio_text: 'un immeuble' },
    { id: 'L16-w03', french: 'un voisin',         english: 'a neighbour (male)',   type: 'word',   gender: 'm',  category: 'house',   difficulty: 1, audio_text: 'un voisin' },
    { id: 'L16-w04', french: 'à louer',           english: 'to rent / for rent',  type: 'phrase', gender: null, category: 'house',   difficulty: 1, audio_text: 'à louer' },
    { id: 'L16-w05', french: 'une pièce',         english: 'a room',              type: 'word',   gender: 'f',  category: 'house',   difficulty: 1, audio_text: 'une pièce' },
    { id: 'L16-w06', french: 'un rideau',         english: 'a curtain',           type: 'word',   gender: 'm',  category: 'house',   difficulty: 1, audio_text: 'un rideau' },
    { id: 'L16-w07', french: 'un tapis',          english: 'a rug / carpet',      type: 'word',   gender: 'm',  category: 'house',   difficulty: 1, audio_text: 'un tapis' },
    { id: 'L16-w08', french: 'confortable',       english: 'comfortable',         type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'confortable' },
    { id: 'L16-w09', french: 'moderne',           english: 'modern',              type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'moderne' },
    { id: 'L16-w10', french: 'cher / chère',      english: 'expensive',           type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'cher' },
    { id: 'L16-w11', french: 'pas cher',          english: 'cheap / not expensive',type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'pas cher' },
    { id: 'L16-w12', french: 'beau / belle',      english: 'beautiful / handsome',type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'beau' },
    { id: 'L16-w13', french: 'sombre',            english: 'dark / gloomy',       type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'sombre' },
    // Reuse base-vocab ids for house words already in Lesson 0
    { id: 'w052',    french: 'la chaise',         english: 'the chair',           type: 'word',   gender: 'f',  category: 'house',   difficulty: 1, audio_text: 'la chaise' },
    { id: 'w054',    french: 'la fenêtre',        english: 'the window',          type: 'word',   gender: 'f',  category: 'house',   difficulty: 1, audio_text: 'la fenêtre' },
    { id: 'w059',    french: 'la chambre',        english: 'the bedroom',         type: 'word',   gender: 'f',  category: 'house',   difficulty: 1, audio_text: 'la chambre' },
  ],

  grammar: [
    { id: 'L16-g01', kind: 'transform',
      prompt: { source: "C'est un appartement grand.", instruction: 'Fix the adjective position (BAGS rule)' },
      answer: "C'est un grand appartement.", accept: ["c'est un grand appartement"],
      explanation: 'grand is a Size adjective — BAGS adjectives go BEFORE the noun.' },
    { id: 'L16-g02', kind: 'translation',
      prompt: { english: "It's a beautiful house." },
      answer: "C'est une belle maison.", accept: ["c'est une belle maison"],
      explanation: 'beau → belle (fem). Beauty = BAGS → before the noun: belle maison.' },
    { id: 'L16-g03', kind: 'translation',
      prompt: { english: "It's a comfortable apartment." },
      answer: "C'est un appartement confortable.", accept: ["c'est un appartement confortable"],
      explanation: 'confortable is not a BAGS adjective → it goes AFTER the noun.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
