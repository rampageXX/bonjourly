/*
 * Lesson registry — loaded before all lesson files.
 * Each lesson file calls registerLesson(LESSON_XX) to add itself.
 *
 * Exports (globals):
 *   LESSONS           — ordered array of lesson objects
 *   registerLesson()  — called by each lesson file
 *   getLessonById()   — returns lesson object or undefined
 *   getVocabById()    — looks up any vocab item (Lesson-0 or lesson-namespaced)
 *   getAllVocab()      — VOCABULARY + all lesson vocab (for lookups by cached id)
 *   getLessonState()  — shorthand for localStorage lessons_state
 */

const LESSONS = [];
const LESSON_VOCAB_BY_ID = {};

function registerLesson(lesson) {
  lesson.vocab.forEach(v => {
    // Only register lesson-namespaced ids (L<n>-w<nn>).
    // Vocab items that reuse a Lesson-0 id (w001-w060) stay in VOCABULARY.
    if (v.id.startsWith('L')) {
      v.lesson = lesson.id;
      LESSON_VOCAB_BY_ID[v.id] = v;
    }
  });
  LESSONS.push(lesson);
  LESSONS.sort((a, b) => a.order - b.order);
}

function getLessonById(id)  { return LESSONS.find(l => l.id === id); }
function getVocabById(id)   { return LESSON_VOCAB_BY_ID[id] || VOCABULARY.find(w => w.id === id); }
function getAllVocab()      { return VOCABULARY.concat(Object.values(LESSON_VOCAB_BY_ID)); }

function getLessonState() {
  return getLocal('lessons_state') || {
    currentLessonId: null,
    startedAt: {},
    masteredLessons: [],
    grammar: {}
  };
}

function saveLessonState(state) {
  setLocal('lessons_state', state);
}
