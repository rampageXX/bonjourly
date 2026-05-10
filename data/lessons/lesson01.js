/*
 * Lesson 1 — Classroom Phrases
 * Source sessions: 3 June 2025, 10 June 2025
 * Grammar concept: un/une (gender) and mon/ma/mes (possessives)
 * Grammar drills: added in Phase 4; grammar[] left empty until then
 */
registerLesson({
  id:    'lesson-01',
  order: 1,
  title: { en: 'Classroom Phrases', fr: 'Phrases de classe' },
  theme: 'classroom',
  intro: 'The phrases you hear and use every lesson — greetings, asking for help, and your stuff.',

  vocab: [
    { id: 'L1-w01', french: 'Comment ça va ?',          english: 'how are you?',          type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'comment ça va' },
    { id: 'L1-w02', french: 'Ça va bien.',               english: "I'm well.",              type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'ça va bien' },
    { id: 'L1-w03', french: 'Je ne comprends pas.',      english: "I don't understand.",    type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'je ne comprends pas' },
    { id: 'L1-w04', french: 'Je comprends.',             english: 'I understand.',           type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'je comprends' },
    { id: 'L1-w05', french: 'Je ne sais pas.',           english: "I don't know.",          type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'je ne sais pas' },
    { id: 'L1-w06', french: "J'ai un problème.",         english: 'I have a problem.',      type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: "j'ai un problème" },
    { id: 'L1-w07', french: "J'ai une question.",        english: 'I have a question.',     type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: "j'ai une question" },
    { id: 'L1-w08', french: 'un stylo',                  english: 'a pen',                  type: 'word',   gender: 'm',  category: 'classroom', difficulty: 1, audio_text: 'un stylo' },
    { id: 'L1-w09', french: 'une montre',                english: 'a watch',                type: 'word',   gender: 'f',  category: 'classroom', difficulty: 1, audio_text: 'une montre' },
    { id: 'L1-w10', french: 'mes devoirs',               english: 'my homework',            type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'mes devoirs' },
    { id: 'L1-w11', french: 'enchantée',                 english: 'nice to meet you',       type: 'word',   gender: null, category: 'classroom', difficulty: 1, audio_text: 'enchantée' },
    { id: 'L1-w12', french: 'De rien.',                  english: "you're welcome",         type: 'phrase', gender: null, category: 'classroom', difficulty: 1, audio_text: 'de rien' },
  ],

  grammar: [],   // Phase 4: add translation drills for mon/ma/mes

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
