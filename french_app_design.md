# French Learning App — Design Document

**Working title:** *Mummy & Me — French*
**Built for:** Two players (you on iPad, your mom on iPhone), both total beginners
**Built with:** Claude Code

---

## 1. Vision

A French learning app where you and your mom compete daily through short, fun games — built around the rhythm of a 5-minute daily session, with progress that feels personal (avatars, a journey across France) and social (you vs. mom, every day, async).

---

## 2. Core Daily Loop

1. Open app → see **"Today's Duel"** — same 10 questions for both players
2. Play through (~3-5 mins): mix of 2-3 game types drawn from the day's vocab
3. See your score after submitting — opponent's score reveals only after they've also played
4. Streak ticks up. Avatar earns XP. Maybe unlock something.
5. Weekly scoreboard updates.

**Key principles:**
- Same 10 questions for both players each day → fair competition
- Fixed length → predictable time commitment
- Mixed game types in one session → variety prevents boredom
- **Async by design** — play on your own schedule, scores compared after both finish
- One session per day per player (no grinding)

---

## 3. The Three Games (v1)

The 10 daily questions are distributed across these three game types — roughly 3-4 of each, randomized order.

### Game 1: Match Pairs
- Grid of 8 cards: 4 French words + 4 English meanings
- Tap pairs to match
- Scoring: speed bonus, fewer mistakes = more points
- **Per round:** 1 grid = 1 question, 4 pairs matched

### Game 2: Listen & Pick
- Audio plays a French word (browser Web Speech API, French voice)
- 4 options shown (mix of pictures + text, or just text for v1)
- Tap the right one
- Replay audio button available (no penalty)
- **Per round:** 1 audio + 1 answer = 1 question

### Game 3: Type the Translation
- English word/phrase shown ("the cat")
- Type the French ("le chat")
- **Forgiving spelling:** accept variations in capitalization, accents, minor typos (use Levenshtein distance ≤ 1)
- Show correct answer if wrong, with audio playback
- **Per round:** 1 prompt + 1 typed answer = 1 question

### Scoring rules (across all games)
- Base: 100 points per correct answer
- Speed bonus: up to +50 points (faster = more)
- Streak bonus within session: 3 correct in a row = +25 bonus
- Wrong answer: 0 points, no penalty
- Max possible per day: ~1500 points

---

## 4. Vocabulary System

### Data model for each word/phrase

```
{
  id: string,
  french: string,           // "le chat" (with article for nouns)
  english: string,          // "the cat"
  type: "word" | "phrase",
  gender: "m" | "f" | null, // null for non-nouns
  category: string,         // "animals", "food", etc.
  difficulty: 1 | 2 | 3,
  audio_text: string,       // text passed to TTS (e.g. "le chat")
  example_sentence: string, // optional, for v2
  image_url: string         // optional, for v2
}
```

### Starter content: 60 words across 6 themes (10 each)

1. **Greetings & politeness** — bonjour, bonsoir, merci, s'il vous plaît, au revoir, oui, non, pardon, salut, ça va
2. **Family** — la mère, le père, le frère, la sœur, la famille, le fils, la fille, le grand-père, la grand-mère, l'enfant
3. **Food basics** — le pain, le fromage, l'eau, le vin, le café, le lait, la pomme, le poulet, le riz, le sel
4. **Numbers 1-10** — un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix
5. **Common verbs (infinitive)** — être, avoir, aller, faire, manger, boire, parler, voir, vouloir, pouvoir
6. **Around the house** — la table, la chaise, la porte, la fenêtre, la maison, le lit, la cuisine, la salle de bain, la chambre, le salon

### Daily vocab selection logic

Each day's 10 questions pull from:
- 60% **review words** — words the player has seen before, weighted by how "weak" they are (spaced repetition)
- 40% **new words** — words the player hasn't yet encountered

Both players get the **same 10 words each day** to keep competition fair. Word selection is deterministic per date (e.g. seeded by date string) so both players naturally see the same set.

---

## 5. Competition Layer

### Daily Duel
- Same 10 questions, both players
- 24-hour window (resets at midnight, player's local time)
- Whoever scores higher "wins the day"
- **Async:** you don't see mom's score until after you've both played, OR until the day ends

### What if only one player plays?
- Their score still counts toward weekly totals
- Absent player effectively gets 0 for that day → encourages consistency
- BUT: an "off day" doesn't break the active player's streak

### Scoreboard views

**Weekly view (default home screen):**
- Days won this week by each player (e.g. "You: 4, Mom: 2, Tied: 1")
- Each player's total weekly points
- Each player's current streak

**All-time view:**
- Total days won by each player
- Total points all-time
- Longest streak each
- Head-to-head record

---

## 6. Avatar & Progression System

### Avatar concept
- **Start:** Each player picks a basic person avatar (a few skin tones, hair colors, basic outfit)
- **Customize:** Earn points → unlock accessories and outfits
- **Slots:** hat, top, bottom, shoes, accessory (e.g. glasses, scarf, bag)
- Player can mix and match unlocked items freely

### Unlock structure
Items unlock at point milestones:

| Milestone | Item Type | Example |
|-----------|-----------|---------|
| 500 pts | Common hat | Beret |
| 1,000 pts | Common top | Striped shirt |
| 2,000 pts | Common accessory | Sunglasses |
| 5,000 pts | Rare item | Baguette to hold |
| 10,000 pts | Rare outfit | Café waiter outfit |
| 25,000 pts | Legendary | Eiffel Tower hat |

### v1 unlock count
- **15 items total** for v1: 5 common, 5 rare, 5 legendary
- All items have a French theme (berets, baguettes, café aprons, etc.) — reinforces the journey

### Bonus unlocks
- **Streak rewards:** 7-day streak = exclusive item, 30-day = rare item, 100-day = legendary
- **Mom-and-me bundle:** unlocked when *both* players hit a milestone together (e.g. both reach 30-day streak = matching outfits)

---

## 7. France Journey (Optional v1, nice-to-have)

A simple map view showing regions of France. Each region unlocks at a vocab milestone:

| Region | Unlock condition | Themed vocab focus |
|--------|------------------|---------------------|
| Paris (start) | Default unlocked | Greetings, basics |
| Provence | 30 words mastered | Food, markets |
| Normandy | 60 words mastered | Weather, sea |
| Brittany | 100 words mastered | Family, traditions |
| Alps | 150 words mastered | Sports, body |

**v1 scope:** Ship with **just Paris and Provence**. Add more regions in later updates.

"Mastered" = word strength ≥ 80 (see forgetting mechanic).

---

## 8. Forgetting Mechanic (Spaced Repetition)

Every word a player has seen has a **strength score (0-100)**:

- Get it right → strength + 15 (capped at 100)
- Get it wrong → strength - 20
- Each day passes without seeing → strength - 5 (decay)
- **If streak breaks:** decay rate doubles for 3 days ("character forgets faster")

### Visual states
- **Strong (80-100):** Full color, "mastered"
- **Learning (40-79):** Normal display
- **Fading (10-39):** Greyed out in word collection
- **Forgotten (0-9):** Marked with a fading icon, prioritized for review

### How this drives daily content
The 60% "review" portion of daily questions is heavily weighted toward fading/forgotten words. So the system naturally pulls struggling words back into rotation.

---

## 9. Streak System

- Play at least one daily duel = streak +1
- Miss a day = streak resets to 0
- **One "freeze" per month:** automatic, applied silently — skip a day without losing streak. Resets on the 1st of each month.

### Streak milestones (unlocks rare avatar items)
- 3 days
- 7 days
- 14 days
- 30 days
- 60 days
- 100 days

---

## 10. Screens / Navigation

### Bottom tab navigation (4 tabs)

1. **Home** — Today's Duel button, current streak, quick weekly score summary
2. **Play** — The game itself (only accessible when there's a duel to play)
3. **Avatar** — View/customize your avatar, see unlocked items, see locked items with point requirements
4. **Stats** — Weekly scoreboard, all-time stats, word collection (with strength visualization)

### Auth/onboarding flow
1. First launch → "Are you Player 1 or Player 2?" (or pick name)
2. Pick starting avatar
3. Quick tutorial (1 example of each game type)
4. → Today's Duel

---

## 11. Tech Stack

- **Frontend:** Vanilla HTML5 + CSS3 + JavaScript (ES6+) — no build step, no npm, no framework
- **Shared game data:** JSONBin.io REST API (one JSON blob for scores, streaks, daily results)
- **Personal data:** `localStorage` (word strength per word, avatar config, player identity)
- **Audio:** Browser Web Speech API (`SpeechSynthesisUtterance`, `lang: 'fr-FR'`) + pre-recorded MP3 fallback in `/audio/`
- **Hosting:** GitHub Pages (`https://github.com/rampageXX/bonjourly`) — free, auto-deploys from `main` branch

### Why this stack
- $0/month — no Supabase subscription, no Vercel account, no Apple Developer fee
- No build step — edit files, push to GitHub, live in seconds
- Works in Safari on iPhone and iPad with no install required (browser bookmark)
- Same proven pattern as the BlockBlast project — JSONBin.io for shared state, localStorage for personal data
- 2 players generating ~120 JSONBin.io operations/month — well within the free tier (10K/month)
- Visual quality comes from CSS craft, not framework choice

---

## 12. Data Schema

Data is split across two stores.

### JSONBin.io blob (shared competitive state)

One JSON object, read on app open and written after each session:

```json
{
  "players": {
    "player1": {
      "name": "string",
      "total_points": 0,
      "current_streak": 0,
      "longest_streak": 0,
      "last_played_date": "2026-04-26",
      "freeze_used_this_month": false,
      "avatar_config": { "skin": "medium", "hair": "brown", "items_equipped": [] }
    },
    "player2": { ... }
  },
  "daily_results": {
    "2026-04-26": {
      "player1": { "score": 1200, "correct": 8, "played_at": "2026-04-26T10:30:00Z" },
      "player2": null
    }
  },
  "unlocked_items": {
    "player1": ["beret", "striped_shirt"],
    "player2": []
  }
}
```

Write pattern: always read → mutate in memory → write back (JSONBin.io is full-replace).

### localStorage (personal per-device state)

```js
// Player identity — set once at first launch, never changes on this device
localStorage.setItem('bonjourly_player', 'player1')

// Word strength — keyed by word ID
localStorage.setItem('bonjourly_strength', JSON.stringify({
  'w001': { strength: 85, last_seen: '2026-04-25' },
  'w002': { strength: 40, last_seen: '2026-04-20' }
}))

// Preferences
localStorage.setItem('bonjourly_sound', 'on')
localStorage.setItem('bonjourly_music', 'on')
```

### Vocabulary data (hardcoded in `data/vocab.js`)

60 words as a plain JS array — no database seed required:

```js
const VOCABULARY = [
  { id: 'w001', french: 'bonjour', english: 'hello', type: 'word', gender: null, category: 'greetings', difficulty: 1, audio_text: 'bonjour' },
  // ... 59 more
]
```

---

## 13. v1 Build Order (Suggested for Claude Code)

Build in this order, get each working before moving to the next:

1. **Skeleton** — `index.html` + `styles.css` + screen navigation (hidden divs toggled with `.hidden`), player identity stored in localStorage
2. **Vocab data** — `data/vocab.js` hardcoded JS array of 60 words (no seeding script needed)
3. **Game 1: Match Pairs** — pure local, no backend
4. **Game 2: Listen & Pick** — local, Web Speech API + MP3 fallback
5. **Game 3: Type the Translation** — local, Levenshtein matching
6. **Daily duel orchestration** — deterministic word selection by date, 3-game sequence, score calculation
7. **Player identity** — first-launch screen ("Are you Player 1 or Player 2?"), stored in localStorage permanently
8. **JSONBin.io integration** — `lib/jsonbin.js` wrapper, read on app open, offline fallback
9. **Score persistence** — write daily result to JSONBin.io after session completes
10. **Score reveal logic** — show opponent score only after both have played or day has ended
11. **Scoreboard screen** — weekly + all-time views from JSONBin.io data
12. **Word strength tracking** — update localStorage after each answer
13. **Spaced repetition** — daily selection weighted by strength scores
14. **Avatar system** — equipment slots, mix-and-match unlocked items
15. **Unlock system** — items unlock at total_points milestones (from JSONBin.io)
16. **Streak logic** — monthly freeze, decay rate doubling after break
17. **Visual polish** — French café aesthetic, animations, transitions (treat as a feature, not cleanup)
18. **Deploy** — enable GitHub Pages on `main` branch, test on iPhone and iPad

---

## 14. Out of Scope for v1 (Future Versions)

- Karaoke mode with French songs
- Pronunciation recording
- Real-world challenges / mystery solving
- Home screen widget (iOS PWA limitation)
- Push notifications (use habit + a daily reminder email if needed)
- Multiple difficulty levels per word
- More than 2 players
- Word search game
- Sentence builder
- Co-op missions
- Custom challenge cards between players

---

## 15. Open Questions to Resolve During Build

- Should the daily duel be **strictly the same 10 words** for both, or **same 10 words but in different order**? (Suggest: same words, different order — feels less synchronized in a good way)
- How to handle **timezone differences** if one of you travels? (Suggest: use the device's local midnight as day boundary; edge cases rare)
- Should the **forgetting decay** apply during streak freezes? (Suggest: no — freeze is a full pause)
- What's the **visual style**? Cute and cartoony? Clean and minimal? French café aesthetic with warm colors? *(Worth deciding before building UI)*

---

## Appendix: Sample vocab seed (first 10 words to verify the data model)

```json
[
  {"id": "w001", "french": "bonjour", "english": "hello", "type": "word", "gender": null, "category": "greetings", "difficulty": 1, "audio_text": "bonjour"},
  {"id": "w002", "french": "merci", "english": "thank you", "type": "word", "gender": null, "category": "greetings", "difficulty": 1, "audio_text": "merci"},
  {"id": "w003", "french": "le chat", "english": "the cat", "type": "word", "gender": "m", "category": "animals", "difficulty": 1, "audio_text": "le chat"},
  {"id": "w004", "french": "la maison", "english": "the house", "type": "word", "gender": "f", "category": "house", "difficulty": 1, "audio_text": "la maison"},
  {"id": "w005", "french": "le pain", "english": "the bread", "type": "word", "gender": "m", "category": "food", "difficulty": 1, "audio_text": "le pain"},
  {"id": "w006", "french": "l'eau", "english": "the water", "type": "word", "gender": "f", "category": "food", "difficulty": 1, "audio_text": "l'eau"},
  {"id": "w007", "french": "la mère", "english": "the mother", "type": "word", "gender": "f", "category": "family", "difficulty": 1, "audio_text": "la mère"},
  {"id": "w008", "french": "le père", "english": "the father", "type": "word", "gender": "m", "category": "family", "difficulty": 1, "audio_text": "le père"},
  {"id": "w009", "french": "un", "english": "one", "type": "word", "gender": null, "category": "numbers", "difficulty": 1, "audio_text": "un"},
  {"id": "w010", "french": "deux", "english": "two", "type": "word", "gender": null, "category": "numbers", "difficulty": 1, "audio_text": "deux"}
]
```
