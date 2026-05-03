const NS = 'bonjourly_';

function getLocal(key) {
  try {
    const val = localStorage.getItem(NS + key);
    return val !== null ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(val));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

function removeLocal(key) {
  localStorage.removeItem(NS + key);
}

function normalizeName(s) {
  return String(s || '').trim().toLowerCase();
}
