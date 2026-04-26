# Bonjourly

A two-player async French learning game for mom and me — played in the browser, no app store needed.

## Setup

### 1. JSONBin.io (one-time)

1. Create a free account at [jsonbin.io](https://jsonbin.io)
2. Create a new bin with this initial content:

```json
{
  "players": {
    "player1": { "name": "Player 1", "total_points": 0, "current_streak": 0, "longest_streak": 0, "last_played_date": null, "freeze_used_this_month": false, "avatar_config": { "items_equipped": {} } },
    "player2": { "name": "Player 2", "total_points": 0, "current_streak": 0, "longest_streak": 0, "last_played_date": null, "freeze_used_this_month": false, "avatar_config": { "items_equipped": {} } }
  },
  "daily_results": {},
  "unlocked_items": { "player1": [], "player2": [] }
}
```

3. Copy your **Bin ID** and **Access Key**
4. Paste them into `config.js`:

```js
const JSONBIN_BIN_ID     = 'your_bin_id_here';
const JSONBIN_ACCESS_KEY = 'your_access_key_here';
```

### 2. GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Branch: main → Save**
3. Your game will be live at `https://rampageXX.github.io/bonjourly/`

### 3. Playing

- Open the URL on your iPhone and your mom's iPhone
- Each person picks their player slot on first launch (stored permanently on that device)
- Play the daily duel — scores are hidden until both players finish

## How to Play

1. Tap **Play Today's Duel** — 10 French questions, ~5 minutes
2. Mix of Match Pairs, Listen & Pick, and Type Translation games
3. See your score — opponent's score revealed after they play
4. Whoever scores higher **wins the day**
5. Play every day to build your streak and unlock avatar items

## Tech Stack

Vanilla HTML/CSS/JS · JSONBin.io · GitHub Pages · Web Speech API
