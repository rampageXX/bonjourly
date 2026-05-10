/*
 * Lesson 17 — C'est vs Il / Elle est
 * Source sessions: 18 March, 28 March 2026
 * Grammar concept: c'est for things/people; il/elle est for adjectives only; ce sont (plural)
 */
registerLesson({
  id:    'lesson-17',
  order: 17,
  title: { en: "C'est vs Il / Elle est", fr: "C'est vs Il / Elle est" },
  theme: 'grammar',
  intro: "C'est introduces a noun or name. Il/elle est is followed by an adjective alone — no article.",

  vocab: [
    { id: 'L17-w01', french: "c'est",            english: "it is / this is / he is / she is", type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: "c'est" },
    { id: 'L17-w02', french: 'ce sont',          english: 'they are / these are',             type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'ce sont' },
    { id: 'L17-w03', french: 'parce que',        english: 'because',                          type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: 'parce que' },
    { id: 'L17-w04', french: 'dans',             english: 'in / inside',                      type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'dans' },
    { id: 'L17-w05', french: 'court / courte',   english: 'short (length)',                   type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'court' },
    { id: 'L17-w06', french: 'une ville',        english: 'a town / city',                    type: 'word',   gender: 'f',  category: 'places',  difficulty: 1, audio_text: 'une ville' },
    { id: 'L17-w07', french: "j'ai un rhume",    english: 'I have a cold',                    type: 'phrase', gender: null, category: 'grammar', difficulty: 1, audio_text: "j'ai un rhume" },
    { id: 'L17-w08', french: 'devant',           english: 'in front of',                      type: 'word',   gender: null, category: 'grammar', difficulty: 1, audio_text: 'devant' },
  ],

  grammar: [
    { id: 'L17-g01', kind: 'translation',
      prompt: { english: "It's a French film." },
      answer: "C'est un film français.", accept: ["c'est un film francais"],
      explanation: "c'est + article + noun (+ adjective). Use c'est when a noun follows." },
    { id: 'L17-g02', kind: 'translation',
      prompt: { english: 'He is tall. (adjective only)' },
      answer: 'Il est grand.', accept: ['il est grand'],
      explanation: 'il/elle est + adjective alone (no article). If you add a noun, switch to c\'est.' },
    { id: 'L17-g03', kind: 'transform',
      prompt: { source: "C'est une belle ville.", instruction: 'Make plural (ce sont)' },
      answer: 'Ce sont de belles villes.', accept: ['ce sont de belles villes'],
      explanation: "Plural of c'est = ce sont. Also: des → de before an adjective (de belles villes)." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
