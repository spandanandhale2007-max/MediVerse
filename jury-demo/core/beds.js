// Ward bed count.
// Extracted from src/hooks/useBedAvailability.js. The hook persists to
// localStorage keyed per hospital; this uses a Map, so you can see the keying
// without a browser. Browser-local in the real app: a count set on the ward
// desk is saved on that device, not shared across users. Default 100.

export const DEFAULT_BEDS = 100

const ledger = new Map()

function keyFor(hospitalId) {
  return `mediverse-beds:${hospitalId ?? 'network'}`
}

export function getBeds(hospitalId) {
  const value = ledger.get(keyFor(hospitalId))
  return Number.isFinite(value) && value >= 0 ? value : DEFAULT_BEDS
}

// Clamp to a non-negative whole number, save it, return it. Guards the ward
// desk typing "-5", "12.7" or "abc" into the box.
export function setBeds(hospitalId, next) {
  const value = Math.max(0, Math.round(Number(next) || 0))
  ledger.set(keyFor(hospitalId), value)
  return value
}

export function resetBeds(hospitalId) {
  return setBeds(hospitalId, DEFAULT_BEDS)
}

export function keysInUse() {
  return [...ledger.keys()]
}
