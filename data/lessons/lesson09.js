/*
 * Lesson 9 — Countries — à / en / au / aux
 * Source session: 20 September 2025
 * Grammar concept: à + city, en + fem country, au + masc country, aux + plural country
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-09',
  order: 9,
  title: { en: 'Countries & Prepositions', fr: 'Les pays et les prépositions' },
  theme: 'grammar',
  intro: 'Each country takes a different preposition — en, au, or aux — depending on its gender.',

  vocab: [
    { id: 'L9-w01', french: 'la France',       english: 'France',            type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: 'la France' },
    { id: 'L9-w02', french: "l'Espagne",       english: 'Spain',             type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: "l'Espagne" },
    { id: 'L9-w03', french: "l'Australie",     english: 'Australia',         type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: "l'Australie" },
    { id: 'L9-w04', french: 'le Japon',        english: 'Japan',             type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'le Japon' },
    { id: 'L9-w05', french: 'le Portugal',     english: 'Portugal',          type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'le Portugal' },
    { id: 'L9-w06', french: "les États-Unis",  english: 'the United States', type: 'word',   gender: null, category: 'countries', difficulty: 1, audio_text: "les États-Unis" },
    { id: 'L9-w07', french: "l'Italie",        english: 'Italy',             type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: "l'Italie" },
    { id: 'L9-w08', french: "l'Allemagne",     english: 'Germany',           type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: "l'Allemagne" },
    { id: 'L9-w09', french: 'le Canada',       english: 'Canada',            type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'le Canada' },
    { id: 'L9-w10', french: 'la Chine',        english: 'China',             type: 'word',   gender: 'f',  category: 'countries', difficulty: 1, audio_text: 'la Chine' },
    { id: 'L9-w11', french: 'en France',       english: 'in/to France (fem.)',type: 'phrase', gender: null, category: 'grammar',  difficulty: 1, audio_text: 'en France' },
    { id: 'L9-w12', french: 'au Japon',        english: 'in/to Japan (masc.)',type: 'phrase', gender: null, category: 'grammar',  difficulty: 1, audio_text: 'au Japon' },
    { id: 'L9-w13', french: 'aux États-Unis',  english: 'in/to the US (pl.)', type: 'phrase', gender: null, category: 'grammar',  difficulty: 1, audio_text: 'aux États-Unis' },
  ],

  grammar: [
    { id: 'L9-g01', kind: 'translation',
      prompt: { english: 'I live in France.' },
      answer: "J'habite en France.", accept: ["j'habite en france", 'j habite en france'],
      explanation: 'en + feminine country (la France → en France).' },
    { id: 'L9-g02', kind: 'translation',
      prompt: { english: 'She lives in Japan.' },
      answer: 'Elle habite au Japon.', accept: ['elle habite au japon'],
      explanation: 'au + masculine country (le Japon → au Japon).' },
    { id: 'L9-g03', kind: 'translation',
      prompt: { english: 'They live in the United States.' },
      answer: 'Ils habitent aux États-Unis.', accept: ['ils habitent aux etats-unis', 'ils habitent aux etats unis'],
      explanation: 'aux + plural country name (les États-Unis → aux États-Unis).' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
