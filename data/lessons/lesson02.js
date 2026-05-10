/*
 * Lesson 2 — Location & "Look! Stay! Close!"
 * Source session: 29 June 2025
 * Grammar concept: imperative (regarde!/regardez!), infinitive vs. conjugated, -ER pattern intro
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-02',
  order: 2,
  title: { en: 'Location & Commands', fr: 'La localisation et les commandes' },
  theme: 'classroom',
  intro: 'Point things out, say where they are, and give simple commands like "Look!" and "Stay!".',

  vocab: [
    { id: 'L2-w01', french: 'ici',              english: 'here',              type: 'word',   gender: null, category: 'classroom', difficulty: 1, audio_text: 'ici' },
    { id: 'L2-w02', french: 'là',               english: 'there',             type: 'word',   gender: null, category: 'classroom', difficulty: 1, audio_text: 'là' },
    { id: 'L2-w03', french: 'là-bas',           english: 'over there',        type: 'word',   gender: null, category: 'classroom', difficulty: 1, audio_text: 'là-bas' },
    { id: 'L2-w04', french: 'où',               english: 'where',             type: 'word',   gender: null, category: 'classroom', difficulty: 1, audio_text: 'où' },
    { id: 'L2-w05', french: 'et',               english: 'and',               type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'et' },
    { id: 'L2-w06', french: 'à côté de',        english: 'next to',           type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'à côté de' },
    { id: 'L2-w07', french: 'regarder',         english: 'to look / to watch',type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'regarder' },
    { id: 'L2-w08', french: 'fermer',           english: 'to close',          type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'fermer' },
    { id: 'L2-w09', french: 'rester',           english: 'to stay',           type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'rester' },
    { id: 'L2-w10', french: "s'il te plaît",    english: 'please (informal)', type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: "s'il te plaît" },
    { id: 'L2-w11', french: 'Regarde !',        english: 'Look! (to one person)',  type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'regarde' },
    { id: 'L2-w12', french: 'Regardez !',       english: 'Look! (to a group)',     type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'regardez' },
    // Reuse base-vocab ids for words already in Lesson 0
    { id: 'w004',   french: "s'il vous plaît",  english: 'please',            type: 'phrase', gender: null, category: 'greetings', difficulty: 1, audio_text: "s'il vous plaît" },
    { id: 'w053',   french: 'la porte',         english: 'the door',          type: 'word',   gender: 'f',  category: 'house',     difficulty: 1, audio_text: 'la porte' },
  ],

  grammar: [
    { id: 'L2-g01', kind: 'translation',
      prompt: { english: 'Look! (to one person)' },
      answer: 'Regarde !', accept: ['Regarde', 'regarde'],
      explanation: 'Imperative of -er verbs: remove -er, keep the stem. No -s for tu imperative.' },
    { id: 'L2-g02', kind: 'translation',
      prompt: { english: 'Look! (to a group or formally)' },
      answer: 'Regardez !', accept: ['Regardez', 'regardez'],
      explanation: 'Plural/formal imperative = the vous form without "vous".' },
    { id: 'L2-g03', kind: 'translation',
      prompt: { english: 'Close the door, please.' },
      answer: "Fermez la porte, s'il vous plaît.", accept: ['fermez la porte s il vous plait'],
      explanation: "Fermez = imperative of fermer (formal). Pair with s'il vous plaît." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
