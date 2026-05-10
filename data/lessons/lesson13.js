/*
 * Lesson 13 — Adjective Number Agreement + Faire / Boire / Lire
 * Source sessions: 9 November, 26 November 2025
 * Grammar concept: adjectives agree in number (allemands / allemandes); irregular faire / boire / lire
 */
registerLesson({
  id:    'lesson-13',
  order: 13,
  title: { en: 'Adjective Number & Irregular Verbs', fr: "L'accord en nombre et les verbes irréguliers" },
  theme: 'grammar',
  intro: 'Add -s to adjectives when the noun is plural. And learn three important irregular verbs: faire, boire, lire.',

  vocab: [
    { id: 'L13-w01', french: 'lire',           english: 'to read',            type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'lire' },
    { id: 'L13-w02', french: "qu'est-ce que",   english: 'what (is it that)…',  type: 'phrase', gender: null, category: 'grammar',   difficulty: 1, audio_text: "qu'est-ce que" },
    { id: 'L13-w03', french: 'samedi',          english: 'Saturday',           type: 'word',   gender: 'm',  category: 'time',      difficulty: 1, audio_text: 'samedi' },
    { id: 'L13-w04', french: 'le weekend',      english: 'the weekend',        type: 'word',   gender: 'm',  category: 'time',      difficulty: 1, audio_text: 'le weekend' },
    { id: 'L13-w05', french: 'le journal',      english: 'the newspaper',      type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'le journal' },
    { id: 'L13-w06', french: 'un roman',        english: 'a novel',            type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'un roman' },
    { id: 'L13-w07', french: 'je fais',         english: 'I do / I make',      type: 'phrase', gender: null, category: 'verbs',     difficulty: 1, audio_text: 'je fais' },
    { id: 'L13-w08', french: 'ils font',        english: 'they do / they make',type: 'phrase', gender: null, category: 'verbs',     difficulty: 2, audio_text: 'ils font' },
    // Reuse base-vocab ids for faire (w044) and boire (w046)
    { id: 'w044',    french: 'faire',           english: 'to do / to make',    type: 'word',   gender: null, category: 'verbs',     difficulty: 2, audio_text: 'faire' },
    { id: 'w046',    french: 'boire',           english: 'to drink',           type: 'word',   gender: null, category: 'verbs',     difficulty: 1, audio_text: 'boire' },
  ],

  grammar: [
    { id: 'L13-g01', kind: 'conjugation',
      prompt: { lemma: 'faire', person: 'je', english_hint: 'I do / make' },
      answer: 'je fais', accept: ['fais'],
      explanation: 'faire is irregular: je fais, tu fais, il fait, nous faisons, vous faites, ils font.' },
    { id: 'L13-g02', kind: 'conjugation',
      prompt: { lemma: 'boire', person: 'il', english_hint: 'he drinks' },
      answer: 'il boit', accept: ['boit'],
      explanation: 'boire is irregular: je bois, tu bois, il boit, nous buvons, vous buvez, ils boivent.' },
    { id: 'L13-g03', kind: 'transform',
      prompt: { source: 'Il est allemand.', instruction: 'Make plural (ils)' },
      answer: 'Ils sont allemands.', accept: ['ils sont allemands'],
      explanation: 'Add -s to the adjective when the subject is plural masculine.' },
    { id: 'L13-g04', kind: 'translation',
      prompt: { english: 'What are you doing?' },
      answer: "Qu'est-ce que tu fais ?", accept: ["qu'est-ce que tu fais", "qu est-ce que tu fais"],
      explanation: "Qu'est-ce que + subject + verb — the standard question structure." },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
