// Simple localStorage wrapper with JSON handling and namespacing
const NS = 'shapts:';

export function save(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export function remove(key) {
  try { localStorage.removeItem(NS + key); } catch {}
}

export function clearAll() {
  // only remove our namespace
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(k => { if (k.startsWith(NS)) localStorage.removeItem(k); });
  } catch {}
}
