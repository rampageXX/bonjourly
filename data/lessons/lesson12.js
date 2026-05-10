/*
 * Lesson 12 — Verb ÊTRE + Nationalities & Adjectives
 * Source sessions: 11 October, 19 October 2025
 * Grammar concept: être conjugation; adjective gender agreement (add -e); exceptions (jeune, gentil → gentille)
 */
registerLesson({
  id:    'lesson-12',
  order: 12,
  title: { en: 'ÊTRE + Nationalities', fr: 'Le verbe ÊTRE et les nationalités' },
  theme: 'grammar',
  intro: 'ÊTRE is irregular but essential. Adjectives must agree in gender — usually just add -e for feminine.',

  vocab: [
    // Nationalities (showing masc / fem forms)
    { id: 'L12-w01', french: 'français / française',     english: 'French',              type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'français' },
    { id: 'L12-w02', french: 'anglais / anglaise',       english: 'English',             type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'anglais' },
    { id: 'L12-w03', french: 'chinois / chinoise',       english: 'Chinese',             type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'chinois' },
    { id: 'L12-w04', french: 'allemand / allemande',     english: 'German',              type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'allemand' },
    { id: 'L12-w05', french: 'irlandais / irlandaise',   english: 'Irish',               type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'irlandais' },
    { id: 'L12-w06', french: 'italien / italienne',      english: 'Italian',             type: 'word',   gender: 'm',  category: 'countries', difficulty: 1, audio_text: 'italien' },
    // Description adjectives
    { id: 'L12-w07', french: 'grand / grande',           english: 'tall / big',          type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'grand' },
    { id: 'L12-w08', french: 'petit / petite',           english: 'small / short',       type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'petit' },
    { id: 'L12-w09', french: 'joli / jolie',             english: 'pretty / nice',       type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'joli' },
    { id: 'L12-w10', french: 'intelligent / intelligente', english: 'intelligent / clever', type: 'word', gender: 'm', category: 'grammar',   difficulty: 1, audio_text: 'intelligent' },
    { id: 'L12-w11', french: 'content / contente',       english: 'happy / pleased',     type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'content' },
    { id: 'L12-w12', french: 'sympathique',              english: 'nice / friendly',     type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'sympathique' },
    { id: 'L12-w13', french: 'jeune',                    english: 'young',               type: 'word',   gender: null, category: 'grammar',   difficulty: 1, audio_text: 'jeune' },
    { id: 'L12-w14', french: 'gentil / gentille',        english: 'kind / nice',         type: 'word',   gender: 'm',  category: 'grammar',   difficulty: 1, audio_text: 'gentil' },
    // Reuse base-vocab id for être (w041)
    { id: 'w041',    french: 'être',                     english: 'to be',               type: 'word',   gender: null, category: 'verbs',     difficulty: 2, audio_text: 'être' },
  ],

  grammar: [
    { id: 'L12-g01', kind: 'conjugation',
      prompt: { lemma: 'être', person: 'je', english_hint: 'I am' },
      answer: 'je suis', accept: ['suis'],
      explanation: 'être is fully irregular: je suis (not je être).' },
    { id: 'L12-g02', kind: 'conjugation',
      prompt: { lemma: 'être', person: 'ils', english_hint: 'they are' },
      answer: 'ils sont', accept: ['sont'],
      explanation: 'ils/elles sont — remember aussi "nous sommes", "vous êtes".' },
    { id: 'L12-g03', kind: 'translation',
      prompt: { english: 'She is French.' },
      answer: 'Elle est française.', accept: ['elle est francaise'],
      explanation: 'Adjective agrees with subject: français (masc.) → française (fem.).' },
    { id: 'L12-g04', kind: 'translation',
      prompt: { english: 'He is tall.' },
      answer: 'Il est grand.', accept: ['il est grand'],
      explanation: 'grand stays masculine because the subject is il.' },
  ],

  mastery: { threshold: 0.8, minVocabAttempts: 2 }
});
