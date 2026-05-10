/*
 * Lesson 15 — Days, Errands & Family
 * Source sessions: 10 Jan, 17 Jan, 24 Jan, 31 Jan, 12 Feb 2026
 * Grammar concept: à l' before vowel/h; day names without "on"; plural-already-S nouns
 */
registerLesson({
  id:    'lesson-15',
  order: 15,
  title: { en: 'Days, Errands & Family', fr: 'Les jours, les courses et la famille' },
  theme: 'grammar',
  intro: 'Days of the week, errands, and family life. Note: in French you say "I go Monday" — no word for "on".',

  vocab: [
    // Days of the week (all new)
    { id: 'L15-w01', french: 'lundi',            english: 'Monday',              type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'lundi' },
    { id: 'L15-w02', french: 'mardi',            english: 'Tuesday',             type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'mardi' },
    { id: 'L15-w03', french: 'mercredi',         english: 'Wednesday',           type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'mercredi' },
    { id: 'L15-w04', french: 'jeudi',            english: 'Thursday',            type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'jeudi' },
    { id: 'L15-w05', french: 'vendredi',         english: 'Friday',              type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'vendredi' },
    { id: 'L15-w16', french: 'samedi',           english: 'Saturday',            type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'samedi' },
    { id: 'L15-w06', french: 'dimanche',         english: 'Sunday',              type: 'word',   gender: 'm',  category: 'time',    difficulty: 1, audio_text: 'dimanche' },
    // Errands and life
    { id: 'L15-w07', french: 'le supermarché',   english: 'the supermarket',     type: 'word',   gender: 'm',  category: 'places',  difficulty: 1, audio_text: 'le supermarché' },
    { id: 'L15-w08', french: 'faire les courses',english: 'to do the shopping',  type: 'phrase', gender: null, category: 'verbs',   difficulty: 1, audio_text: 'faire les courses' },
    { id: 'L15-w09', french: 'faire la cuisine', english: 'to cook / do the cooking', type: 'phrase', gender: null, category: 'verbs', difficulty: 1, audio_text: 'faire la cuisine' },
    { id: 'L15-w10', french: 'partir',           english: 'to leave / to go',    type: 'word',   gender: null, category: 'verbs',   difficulty: 1, audio_text: 'partir' },
    { id: 'L15-w11', french: 'mon mari',         english: 'my husband',          type: 'phrase', gender: null, category: 'family',  difficulty: 1, audio_text: 'mon mari' },
    { id: 'L15-w12', french: 'mes enfants',      english: 'my children',         type: 'phrase', gender: null, category: 'family',  difficulty: 1, audio_text: 'mes enfants' },
    { id: 'L15-w13', french: "un étudiant",      english: 'a student (male)',     type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: "un étudiant" },
    { id: 'L15-w14', french: 'un examen',        english: 'an exam',             type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un examen' },
    { id: 'L15-w15', french: 'un livre',         english: 'a book',              type: 'word',   gender: 'm',  category: 'grammar', difficulty: 1, audio_text: 'un livre' },
    // à l' rule — reuse maison (w055)
    { id: 'w055',    french: 'la maison',        english: 'the house',           type: 'word',   gender: 'f',  category: 'house',   difficulty: 1, audio_text: 'la maison' },
  ],

  grammar: [
    { id: 'L15-g01', kind: 'translation',
      prompt: { english: 'I go to the supermarket on Monday.' },
      answer: 'Je vais au supermarché lundi.', accept: ['je vais au supermarche lundi'],
      explanation: 'No word for "on" before days in French. Just say the day directly.' },
    { id: 'L15-g02', kind: 'translation',
      prompt: { english: 'She does the shopping on Saturday.' },
      answer: 'Elle fait les courses samedi.', accept: ['elle fait les courses samedi'],
      explanation: 'Same rule — no "on": elle fait les courses samedi.' },
    { id: 'L15-g03', kind: 'translation',
      prompt: { english: "He goes to school. (use à l')" },
      answer: "Il va à l'école.", accept: ["il va a l'ecole", "il va à l ecole"],
      explanation: "à l' is used before a vowel or silent h: à l'école, à l'hôpital." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
