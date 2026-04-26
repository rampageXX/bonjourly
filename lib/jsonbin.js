/*
 * JSONBin.io wrapper
 *
 * Requires config.js to be loaded first with:
 *   const JSONBIN_BIN_ID     = '...';
 *   const JSONBIN_ACCESS_KEY = '...';
 */

const JSONBIN_URL = () => `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const INITIAL_BLOB = {
  players: {
    player1: { name: 'Player 1', total_points: 0, current_streak: 0, longest_streak: 0, last_played_date: null, freeze_used_this_month: false, avatar_config: { items_equipped: {} } },
    player2: { name: 'Player 2', total_points: 0, current_streak: 0, longest_streak: 0, last_played_date: null, freeze_used_this_month: false, avatar_config: { items_equipped: {} } },
  },
  daily_results: {},
  unlocked_items:   { player1: [], player2: [] },
  unlocked_regions: { player1: ['paris'], player2: ['paris'] },
};

async function readBlob() {
  try {
    const res = await fetch(JSONBIN_URL() + '/latest', {
      headers: { 'X-Access-Key': JSONBIN_ACCESS_KEY },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    // Merge with INITIAL_BLOB so missing keys are always present
    return mergeWithDefaults(json.record || {});
  } catch (e) {
    console.warn('JSONBin read failed (offline?):', e.message);
    return null;
  }
}

function mergeWithDefaults(record) {
  const def = INITIAL_BLOB;
  return {
    players: {
      player1: Object.assign({}, def.players.player1, record.players?.player1 || {}),
      player2: Object.assign({}, def.players.player2, record.players?.player2 || {}),
    },
    daily_results:  record.daily_results  || {},
    unlocked_items: {
      player1: record.unlocked_items?.player1  || [],
      player2: record.unlocked_items?.player2  || [],
    },
    unlocked_regions: {
      player1: record.unlocked_regions?.player1 || ['paris'],
      player2: record.unlocked_regions?.player2 || ['paris'],
    },
  };
}

async function writeBlob(data) {
  try {
    const res = await fetch(JSONBIN_URL(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': JSONBIN_ACCESS_KEY,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return true;
  } catch (e) {
    console.warn('JSONBin write failed (offline?):', e.message);
    return false;
  }
}

/*
 * High-level helpers used by app.js
 */

// Save this player's daily result and update their totals
async function syncDuelResult(playerId, result) {
  const blob = await readBlob();
  if (!blob) return false;

  const today = getTodayString();
  if (!blob.daily_results[today]) blob.daily_results[today] = {};
  blob.daily_results[today][playerId] = {
    score: result.score,
    correct: result.correct,
    played_at: new Date().toISOString(),
  };

  // Update player totals
  const player = blob.players[playerId];
  if (player) {
    player.total_points  = (player.total_points || 0) + result.score;
    player.last_played_date = today;
    const streakData = getLocal('streak') || {};
    player.current_streak  = streakData.current || 0;
    player.longest_streak  = Math.max(player.longest_streak || 0, streakData.longest || 0);
  }

  return writeBlob(blob);
}

// Fetch today's opponent result (null if not played yet)
async function getOpponentResult(opponentId) {
  const blob = await readBlob();
  if (!blob) return null;
  const today = getTodayString();
  return blob.daily_results?.[today]?.[opponentId] || null;
}

// Get both players' shared data
async function getSharedData() {
  return readBlob();
}

// Update player name in the blob
async function syncPlayerName(playerId, name) {
  const blob = await readBlob();
  if (!blob) return false;
  if (blob.players[playerId]) blob.players[playerId].name = name;
  return writeBlob(blob);
}
