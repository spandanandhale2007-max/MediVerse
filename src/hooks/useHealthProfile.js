import { useCallback, useMemo, useState } from 'react'

const LEGACY_KEY = 'mediverse-health-profile' // single global record (pre-fix)
const STORAGE_KEY = 'mediverse-health-profiles' // { [identity]: record }

function readMap() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const map = raw ? JSON.parse(raw) : null
    if (map && typeof map === 'object') return map
  } catch {
    // fall through to migration
  }
  return {}
}

function write(map) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

// Medication tracker's health history — sensitive clinical data (see the
// intake form's privacy note), kept separate from the basic account profile
// (name/age/location).
//
// KEYED BY PHONE so it's scoped to the account. It used to be one global
// record, so on a shared identity the next sign-in saw the previous person's
// conditions, allergies and meds. Never store clinical data unscoped.
export function useHealthProfile(identity) {
  const [map, setMap] = useState(() => {
    const current = readMap()
    // One-time migration: move the old global record onto the current user
    // so an existing intake isn't lost.
    if (typeof window !== 'undefined' && identity && !current[identity]) {
      try {
        const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
        if (legacyRaw) {
          const migrated = { ...current, [identity]: JSON.parse(legacyRaw) }
          write(migrated)
          window.localStorage.removeItem(LEGACY_KEY)
          return migrated
        }
      } catch {
        // Corrupt legacy value — drop it rather than crash the page.
        window.localStorage.removeItem(LEGACY_KEY)
      }
    }
    return current
  })

  const healthProfile = useMemo(() => (identity ? (map[identity] ?? null) : null), [map, identity])

  const saveHealthProfile = useCallback(
    (data) => {
      if (!identity) return
      const record = { ...data, updatedAt: new Date().toISOString() }
      setMap((prev) => {
        const next = { ...prev, [identity]: record }
        write(next)
        return next
      })
    },
    [identity],
  )

  const clearHealthProfile = useCallback(() => {
    if (!identity) return
    setMap((prev) => {
      const next = { ...prev }
      delete next[identity]
      write(next)
      return next
    })
  }, [identity])

  return { healthProfile, hasHealthProfile: !!healthProfile, saveHealthProfile, clearHealthProfile }
}
