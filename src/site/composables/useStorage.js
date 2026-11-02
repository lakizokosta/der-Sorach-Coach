/**
 * @fileoverview Thin, defensive wrapper around `window.localStorage`.
 *
 * All read/write operations are wrapped in try/catch so the app does not
 * break in private-browsing mode or when storage is full. Functions are
 * intentionally tiny — KISS over reactive abstractions.
 */

/**
 * Reads and parses a JSON value from localStorage.
 *
 * @param {string} key             The storage key.
 * @param {*}      fallback        Returned when the key is missing/invalid.
 * @return {*} The parsed value or `fallback`.
 */
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Serializes `value` to JSON and stores it under `key`.
 *
 * @param {string} key    The storage key.
 * @param {*}      value  The value to persist (JSON-serializable).
 */
export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage disabled — ignored */
  }
}

/**
 * Reads a primitive string value from localStorage.
 *
 * @param {string} key       The storage key.
 * @param {string} fallback  Default when not set.
 * @return {string}
 */
export function loadString(key, fallback = '') {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persists a primitive string value to localStorage.
 *
 * @param {string} key    The storage key.
 * @param {string} value  Value to store.
 */
export function saveString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignored */
  }
}

/**
 * Removes a key from localStorage. Safe to call when the key does not exist.
 *
 * @param {string} key  The storage key to remove.
 */
export function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignored */
  }
}
