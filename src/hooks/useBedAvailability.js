import { useCallback, useEffect, useState } from 'react'

// A single "beds free" count the ward desk can adjust from the console.
// Browser-local (no backend yet): saved on that device, not shared across
// users. Keyed per hospital so each demo hospital keeps its own count.
// Default is 100.

export const DEFAULT_BEDS = 100
const KEY_PREFIX = 'mediverse-beds'

function keyFor(hospitalId) {
  return `${KEY_PREFIX}:${hospitalId ?? 'network'}`
}

function read(hospitalId) {
  if (typeof window === 'undefined') return DEFAULT_BEDS
  try {
    const raw = window.localStorage.getItem(keyFor(hospitalId))
    if (raw == null) return DEFAULT_BEDS
    const n = parseInt(raw, 10)
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_BEDS
  } catch {
    return DEFAULT_BEDS
  }
}

export function useBedAvailability(hospitalId) {
  const [beds, setBedsState] = useState(() => read(hospitalId))

  // Switching hospital re-reads that hospital's saved count.
  useEffect(() => {
    setBedsState(read(hospitalId))
  }, [hospitalId])

  // Clamp to a non-negative whole number, save it, and return it.
  const setBeds = useCallback(
    (next) => {
      const value = Math.max(0, Math.round(Number(next) || 0))
      setBedsState(value)
      try {
        window.localStorage.setItem(keyFor(hospitalId), String(value))
      } catch {
        /* storage disabled (e.g. private mode) — keep in-memory value */
      }
      return value
    },
    [hospitalId],
  )

  const reset = useCallback(() => setBeds(DEFAULT_BEDS), [setBeds])

  return { beds, setBeds, reset, isDefault: beds === DEFAULT_BEDS }
}
