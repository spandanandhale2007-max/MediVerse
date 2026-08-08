import { useCallback, useMemo, useState } from 'react'
import { initialMedications } from '../data/mock'

const STORAGE_KEY = 'mediverse-medications' // { [phone]: Medication[] }

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

// The medication list used to be plain component state seeded from mock data,
// so anything a user added disappeared on reload — which is a poor showing for
// a page whose promise is "never miss a dose".
//
// Now persisted, and keyed by phone number for the same reason the health
// profile is: on a shared device one patient must not see another's
// medication list. A new account starts from the sample list so the page
// isn't empty on first visit.
//
// Returns a [value, setValue] pair so it drops straight into the existing
// useState call site.
export function useMedications(phone) {
  const [map, setMap] = useState(readMap)

  const meds = useMemo(() => {
    if (!phone) return initialMedications
    return map[phone] ?? initialMedications
  }, [map, phone])

  const setMeds = useCallback(
    (updater) => {
      if (!phone) return
      setMap((prev) => {
        const current = prev[phone] ?? initialMedications
        const nextList = typeof updater === 'function' ? updater(current) : updater
        const next = { ...prev, [phone]: nextList }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [phone],
  )

  return [meds, setMeds]
}
