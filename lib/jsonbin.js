/*
 * JSONBin.io wrapper — schema v2 (name-keyed players)
 *
 * Requires config.js to be loaded first with:
 *   const JSONBIN_BIN_ID     = '...';
 *   const JSONBIN_ACCESS_KEY = '...';
 */

const JSONBIN_URL = () => `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

function defaultPlayer(displayName) {
  return {
    displayName: displayName || '',
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    last_played_date: null,
    freeze_used_this_month: false,
    avatar_config: { items_equipped: {} },
  };
}

// One-time in-memory migration from v1 (player1/player2 keys) to v2 (name keys)
function migrateV1toV2(old) {
  const players = {};
  const idMap = {};

  ['player1', 'player2'].forEach(oldKey => {
    const entry = old.players?.[oldKey];
    if (!entry) return;
    const displayName = entry.name || '';
    const newKey = normalizeName(displayName);
    if (!newKey || players[newKey]) {
      console.warn('Migration: skipping empty/duplicate name for', oldKey);
      return;
    }
    idMap[oldKey] = newKey;
    const { name: _n, ...rest } = entry;
    players[newKey] = { displayName, ...rest };
  });

  const daily_results = {};
  Object.entries(old.daily_results || {}).forEach(([date, dayData]) => {
    daily_results[date] = {};
    Object.entries(dayData || {}).forEach(([oldKey, result]) => {
      const newKey = idMap[oldKey];
      if (newKey && result) daily_results[date][newKey] = result;
    });
  });

  const unlocked_items = {};
  Object.entries(old.unlocked_items || {}).forEach(([oldKey, val]) => {
    const newKey = idMap[oldKey];
    if (newKey) unlocked_items[newKey] = val;
  });

  const unlocked_regions = {};
  Object.entries(old.unlocked_regions || {}).forEach(([oldKey, val]) => {
    const newKey = idMap[oldKey];
    if (newKey) unlocked_regions[newKey] = val;
  });

  return { schema_version: 2, players, daily_results, unlocked_items, unlocked_regions };
}

function mergeWithDefaults(record) {
  if (!record.schema_version) {
    record = migrateV1toV2(record);
  }
  // Ensure every player entry has all expected fields
  const players = {};
  Object.entries(record.players || {}).forEach(([id, p]) => {
    players[id] = Object.assign({}, defaultPlayer(p.displayName || id), p);
  });
  return {
    schema_version: 2,
    players,
    daily_results:  record.daily_results  || {},
    unlocked_items: record.unlocked_items  || {},
    unlocked_regions: record.unlocked_regions || {},
  };
}

async function readBlob() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(JSONBIN_URL() + '/latest', {
      headers: { 'X-Access-Key': JSONBIN_ACCESS_KEY },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    return mergeWithDefaults(json.record || {});
  } catch (e) {
    console.warn('JSONBin read failed (offline?):', e.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
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

// Save this player's daily result and update their totals.
// Returns { ok, alreadyPlayed, existing? } — callers must handle alreadyPlayed.
async function syncDuelResult(playerId, result) {
  const blob = await readBlob();
  if (!blob) return { ok: false, reason: 'offline' };

  const today = getTodayString();
  if (!blob.daily_results[today]) blob.daily_results[today] = {};

  const existing = blob.daily_results[today][playerId];
  if (existing) {
    // Already played today on another device — do NOT re-add points or overwrite.
    return { ok: true, alreadyPlayed: true, existing };
  }

  blob.daily_results[today][playerId] = {
    score: result.score,
    correct: result.correct,
    played_at: new Date().toISOString(),
  };

  if (!blob.players[playerId]) {
    blob.players[playerId] = defaultPlayer(playerId);
  }
  const player = blob.players[playerId];
  player.total_points     = (player.total_points || 0) + result.score;
  player.last_played_date = today;
  const s = getLocal('streak') || {};
  player.current_streak   = s.current || 0;
  player.longest_streak   = Math.max(player.longest_streak || 0, s.longest || 0);

  const ok = await writeBlob(blob);
  return { ok, alreadyPlayed: false };
}

// Get both players' shared data
async function getSharedData() {
  return readBlob();
}

// Update or create player entry in the blob
async function syncPlayerName(playerId, displayName) {
  const blob = await readBlob();
  if (!blob) return false;
  if (!blob.players[playerId]) {
    blob.players[playerId] = defaultPlayer(displayName);
  }
  blob.players[playerId].displayName = displayName;
  return writeBlob(blob);
}
