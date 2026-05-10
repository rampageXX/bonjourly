/*
 * Lesson 14 — Articles & Food
 * Source sessions: 7 December, 13 December 2025; restaurant reading page
 * Grammar concept: partitive articles du / de la / des; food ordering phrases
 */
registerLesson({
  id:    'lesson-14',
  order: 14,
  title: { en: 'Articles & Food', fr: 'Les articles et la nourriture' },
  theme: 'food',
  intro: 'Use du, de la, or des to say "some". This is the partitive article — French uses it where English often drops the word entirely.',

  vocab: [
    { id: 'L14-w01', french: 'un repas',           english: 'a meal',             type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'un repas' },
    { id: 'L14-w02', french: 'une bouteille',       english: 'a bottle',           type: 'word',   gender: 'f',  category: 'food',    difficulty: 1, audio_text: 'une bouteille' },
    { id: 'L14-w03', french: 'un verre',            english: 'a glass',            type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'un verre' },
    { id: 'L14-w04', french: 'un croissant',        english: 'a croissant',        type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'un croissant' },
    { id: 'L14-w05', french: 'une baguette',        english: 'a baguette',         type: 'word',   gender: 'f',  category: 'food',    difficulty: 1, audio_text: 'une baguette' },
    { id: 'L14-w06', french: "l'entrée",            english: 'the starter',        type: 'word',   gender: 'f',  category: 'food',    difficulty: 1, audio_text: "l'entrée" },
    { id: 'L14-w07', french: 'le plat',             english: 'the main course',    type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'le plat' },
    { id: 'L14-w08', french: 'le dessert',          english: 'the dessert',        type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'le dessert' },
    { id: 'L14-w09', french: 'préparer',            english: 'to prepare',         type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'préparer' },
    { id: 'L14-w10', french: 'acheter',             english: 'to buy',             type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'acheter' },
    { id: 'L14-w11', french: 'du',                  english: 'some (masc.)',        type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'du' },
    { id: 'L14-w12', french: 'de la',               english: 'some (fem.)',         type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'de la' },
    // Reuse base-vocab ids for vin (w024), pain (w021), manger (w045)
    { id: 'w024',    french: 'le vin',              english: 'the wine',           type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'le vin' },
    { id: 'w021',    french: 'le pain',             english: 'the bread',          type: 'word',   gender: 'm',  category: 'food',    difficulty: 1, audio_text: 'le pain' },
    { id: 'w045',    french: 'manger',              english: 'to eat',             type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'manger' },
  ],

  grammar: [
    { id: 'L14-g01', kind: 'translation',
      prompt: { english: "I'd like some bread." },
      answer: 'Je voudrais du pain.', accept: ['je voudrais du pain'],
      explanation: 'du = de + le (partitive for masculine nouns). Use it for "some" with uncountable things.' },
    { id: 'L14-g02', kind: 'translation',
      prompt: { english: 'She drinks some wine.' },
      answer: 'Elle boit du vin.', accept: ['elle boit du vin'],
      explanation: 'du vin — wine is masculine, so du (not de la).' },
    { id: 'L14-g03', kind: 'translation',
      prompt: { english: 'I eat some bread and some cheese.' },
      answer: 'Je mange du pain et du fromage.', accept: ['je mange du pain et du fromage'],
      explanation: 'Each noun gets its own partitive article.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
