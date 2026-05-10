/*
 * Lesson 8 — Numbers 0–100+
 * Source sessions: 30 August, 2 September, 8 September 2025
 * Grammar concept: irregular soixante-dix / quatre-vingts / quatre-vingt-dix patterns
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-08',
  order: 8,
  title: { en: 'Numbers 0–1000', fr: 'Les chiffres 0–1000' },
  theme: 'grammar',
  intro: 'French counts differently at 70, 80, 90. Master these and you can say any number.',

  vocab: [
    { id: 'L8-w01', french: 'zéro',               english: 'zero',               type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'zéro' },
    { id: 'L8-w02', french: 'onze',               english: 'eleven',             type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'onze' },
    { id: 'L8-w03', french: 'douze',              english: 'twelve',             type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'douze' },
    { id: 'L8-w04', french: 'quinze',             english: 'fifteen',            type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'quinze' },
    { id: 'L8-w05', french: 'vingt',              english: 'twenty',             type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'vingt' },
    { id: 'L8-w06', french: 'trente',             english: 'thirty',             type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'trente' },
    { id: 'L8-w07', french: 'quarante',           english: 'forty',              type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'quarante' },
    { id: 'L8-w08', french: 'cinquante',          english: 'fifty',              type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'cinquante' },
    { id: 'L8-w09', french: 'soixante',           english: 'sixty',              type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'soixante' },
    { id: 'L8-w10', french: 'soixante-dix',       english: 'seventy (lit. sixty-ten)',    type: 'word', gender: null, category: 'numbers', difficulty: 2, audio_text: 'soixante-dix' },
    { id: 'L8-w11', french: 'quatre-vingts',      english: 'eighty (lit. four-twenties)', type: 'word', gender: null, category: 'numbers', difficulty: 2, audio_text: 'quatre-vingts' },
    { id: 'L8-w12', french: 'quatre-vingt-dix',   english: 'ninety (lit. four-twenty-ten)',type: 'word',gender: null, category: 'numbers', difficulty: 2, audio_text: 'quatre-vingt-dix' },
    { id: 'L8-w13', french: 'cent',               english: 'one hundred',        type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'cent' },
    { id: 'L8-w14', french: 'mille',              english: 'one thousand',       type: 'word',   gender: null, category: 'numbers', difficulty: 1, audio_text: 'mille' },
    { id: 'L8-w15', french: 'je voudrais',        english: 'I would like',       type: 'phrase', gender: null, category: 'food',    difficulty: 1, audio_text: 'je voudrais' },
    { id: 'L8-w16', french: "j'ai besoin de",     english: 'I need',             type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: "j'ai besoin de" },
    { id: 'L8-w17', french: 'quelque chose',      english: 'something',          type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'quelque chose' },
    // Reuse base-vocab id for 'manger' (already in Lesson 0 as w045)
    { id: 'w045',   french: 'manger',             english: 'to eat',             type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'manger' },
  ],

  grammar: [
    { id: 'L8-g01', kind: 'translation',
      prompt: { english: '75' },
      answer: 'soixante-quinze', accept: ['soixante quinze'],
      explanation: '70 = soixante-dix. 75 = soixante + 15 (quinze) = soixante-quinze.' },
    { id: 'L8-g02', kind: 'translation',
      prompt: { english: '83' },
      answer: 'quatre-vingt-trois', accept: ['quatre vingt trois'],
      explanation: '80 = quatre-vingts. Drop the -s when followed by a number: quatre-vingt-trois.' },
    { id: 'L8-g03', kind: 'translation',
      prompt: { english: '91' },
      answer: 'quatre-vingt-onze', accept: ['quatre vingt onze'],
      explanation: '90 = quatre-vingt-dix. 91 = quatre-vingt-onze.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
