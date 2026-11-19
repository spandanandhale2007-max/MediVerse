import { useCallback, useMemo, useState } from 'react'
import { initialMedications } from '../data/mock'

const STORAGE_KEY = 'mediverse-medications' // { [identity]: Medication[] }

function readMap() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const map = raw ? JSON.parse(raw) : null
    return map && typeof map === 'object' ? map : {}
  } catch {
    return {}
  }
}

// Persists the med list so added meds survive reload.
// Keyed by identity: on a shared device one patient must not see another's meds.
// New accounts start from the sample list so the page isn't empty.
// Returns a [value, setValue] pair, like useState.
export function useMedications(identity) {
  const [map, setMap] = useState(readMap)

  const meds = useMemo(() => {
    if (!identity) return initialMedications
    return map[identity] ?? initialMedications
  }, [map, identity])

  const setMeds = useCallback(
    (updater) => {
      if (!identity) return
      setMap((prev) => {
        const current = prev[identity] ?? initialMedications
        const nextList = typeof updater === 'function' ? updater(current) : updater
        const next = { ...prev, [identity]: nextList }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [identity],
  )

  return [meds, setMeds]
}
