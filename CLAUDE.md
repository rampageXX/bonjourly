# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bonjourly** (working title: *Mummy & Me — French*) is a two-player async French learning game for a mom and adult child. They compete daily through 5-minute game sessions on iPad and iPhone, played in the browser — no App Store, no install required. Full design spec is in `french_app_design.md`.

## Tech Stack

- **Frontend:** Vanilla HTML5 + CSS3 + JavaScript (ES6+) — no build step, no npm, no framework
- **Shared game data:** JSONBin.io REST API (one JSON blob for competitive/shared state)
- **Personal data:** `localStorage` (word strength, avatar config, onboarding state)
- **Audio:** Web Speech API (`SpeechSynthesisUtterance`, `lang: 'fr-FR'`) + pre-recorded MP3 fallback files in `/audio/`
- **Hosting:** GitHub Pages (`https://github.com/rampageXX/bonjourly`) — free, auto-deploys from `main`

No build commands — edit files and push. GitHub Pages serves them directly.

## Architecture

### Data Split

All state is split into two layers:

**Shared via JSONBin.io** (competitive data both players need to see):
```json
{
  "players": {
    "player1": { "name": "...", "total_points": 0, "current_streak": 0, "longest_streak": 0, "freeze_used_this_month": false },
    "player2": { "name": "...", "total_points": 0, "current_streak": 0, "longest_streak": 0, "freeze_used_this_month": false }
  },
  "daily_results": {
    "2026-04-26": {
      "player1": { "score": 1200, "correct": 8, "played_at": "2026-04-26T10:30:00Z" },
      "player2": null
    }
  }
}
```

**Local via `localStorage`** (personal, per-device, no sync needed):
- Word strength per word (spaced repetition state)
- Avatar config and unlocked items
- Player identity (which player this device is)
- Sound/music preferences

### Core Data Flow

```
App open:
  → read localStorage to identify player + word strengths
  → fetch JSONBin.io blob to get shared state (streaks, scores, opponent result)

Daily word selection (runs locally, deterministic by date string):
  → 60% review words weighted by weakness (fading/forgotten first)
  → 40% new words not yet seen
  → same 10 words for both players each day (seeded by date)

Game session (entirely local):
  → 10 questions across 3 game types (~3-4 each, randomized order)
  → score + speed bonus + streak bonus computed locally
  → word strengths updated in localStorage after each answer

Session complete:
  → write result to JSONBin.io blob (read → merge → write)
  → opponent's score revealed only if they've also played OR day has ended
```

### JSONBin.io Write Pattern

JSONBin.io is a full-replace API — to update any field, read the blob, mutate in memory, write back. Always use `async/await` with a try/catch; show "offline" gracefully if the fetch fails. Race conditions between two players writing simultaneously are acceptable given async gameplay (they virtually never overlap).

### Key Algorithms

**Word strength (spaced repetition):**
- Correct answer: `strength + 15` (cap 100)
- Wrong answer: `strength - 20`
- Daily decay (unseen words): `strength - 5`
- After streak break: decay rate doubles for 3 days
- Visual states: Strong 80-100, Learning 40-79, Fading 10-39, Forgotten 0-9

**Scoring:**
- Base: 100 pts per correct answer
- Speed bonus: up to +50 pts (faster = more)
- Streak bonus: 3 correct in a row = +25
- Max per day: ~1,500 pts

**Type Translation matching:** Levenshtein distance ≤ 1 — forgiving for accents, capitalization, minor typos.

**Streak freeze:** One per player per month, applied automatically on first missed day, resets on the 1st of each month. Word strength decay does not apply during a freeze day.

**Daily word selection:** Seeded by today's date string (e.g. `"2026-04-26"`) so both players get identical word sets regardless of when they open the app.

### File Structure

```
index.html          # Entry point — all screens as hidden divs (same pattern as BlockBlast)
app.js              # Main game logic
data/
  vocab.js          # 60 starter words as a JS array (no DB seed needed)
games/
  matchPairs.js     # Match Pairs game logic
  listenAndPick.js  # Listen & Pick game logic
  typeTranslation.js # Type Translation + Levenshtein matching
  dailyDuel.js      # Orchestrates 10-question session across 3 games
lib/
  jsonbin.js        # JSONBin.io read/write wrapper
  wordStrength.js   # Spaced repetition logic (localStorage)
  dailySelection.js # Deterministic daily word picker
  scoring.js        # Score + speed + streak bonus calculation
  streaks.js        # Streak increment, freeze logic
  audio.js          # Web Speech API + MP3 fallback
styles.css          # All styles — French café aesthetic, CSS animations
audio/              # Pre-recorded MP3s for the 60 vocab words (fallback for iOS TTS)
```

### Screen Navigation

Single-page app — screens toggled with `.hidden` class (no router):
1. `#start-screen` — player selection on first launch
2. `#home-screen` — Today's Duel button, streak, weekly summary
3. `#game-screen` — active duel (Match Pairs / Listen & Pick / Type Translation)
4. `#result-screen` — your score; opponent's revealed if available
5. `#avatar-screen` — avatar customizer
6. `#stats-screen` — scoreboard, word collection with strength visualization

## Build Order

Follow this sequence — get each step working before moving to the next:

1. Skeleton (`index.html` + `styles.css` + screen navigation + player identity in localStorage)
2. Vocab data (`data/vocab.js` — 60 words as a hardcoded JS array)
3. Match Pairs game (local only, no backend)
4. Listen & Pick game (Web Speech API + MP3 fallback)
5. Type Translation game (Levenshtein matching)
6. Daily duel orchestration (deterministic word selection, 3-game sequence, score calculation)
7. JSONBin.io integration (read/write shared state, offline fallback)
8. Score persistence (write daily result to JSONBin.io after session)
9. Score reveal logic (show opponent score only after both played or day ends)
10. Scoreboard screen (weekly + all-time from JSONBin.io data)
11. Word strength tracking (update localStorage after each answer)
12. Spaced repetition (daily selection uses strength scores from localStorage)
13. Avatar system (equipment slots, mix-and-match)
14. Unlock system (items at point milestones from total_points in JSONBin.io)
15. Streak logic (with monthly freeze)
16. Visual polish (animations, French café aesthetic — this is a priority, not an afterthought)
17. Deploy (GitHub Pages — enable in repo settings, push to `main`)

## v1 Scope Notes

- Two players only; player identity is set once at first launch (localStorage) and never changes on that device
- France Journey map is optional for v1
- No push notifications; no pronunciation recording; no sentence builder
- Visual style: French café aesthetic — warm cream/navy/gold palette, card-flip animations, smooth screen transitions
- Daily duel uses the same 10 words for both players but in different randomized order per player
