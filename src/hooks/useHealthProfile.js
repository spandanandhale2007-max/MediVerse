import { useCallback, useMemo, useState } from 'react'

const LEGACY_KEY = 'mediverse-health-profile' // single global record (pre-fix)
const STORAGE_KEY = 'mediverse-health-profiles' // { [phone]: record }

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

// The medication tracker's health history. Kept separate from the basic
// account profile (name/age/location) because this is sensitive clinical
// data — see the privacy note shown on the intake form.
//
// KEYED BY PHONE NUMBER, and that matters: this used to be one global record,
// which meant that on a shared phone the next person to sign in saw the
// previous person's chronic conditions, allergies and medication list. Never
// store clinical data under a key that isn't scoped to the account.
export function useHealthProfile(phone) {
  const [map, setMap] = useState(() => {
    const current = readMap()
    // One-time migration of the old global record onto whoever is signed in
    // now, so an existing user doesn't lose an intake they already completed.
    if (typeof window !== 'undefined' && phone && !current[phone]) {
      try {
        const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
        if (legacyRaw) {
          const migrated = { ...current, [phone]: JSON.parse(legacyRaw) }
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

  const healthProfile = useMemo(() => (phone ? (map[phone] ?? null) : null), [map, phone])

  const saveHealthProfile = useCallback(
    (data) => {
      if (!phone) return
      const record = { ...data, updatedAt: new Date().toISOString() }
      setMap((prev) => {
        const next = { ...prev, [phone]: record }
        write(next)
        return next
      })
    },
    [phone],
  )

  const clearHealthProfile = useCallback(() => {
    if (!phone) return
    setMap((prev) => {
      const next = { ...prev }
      delete next[phone]
      write(next)
      return next
    })
  }, [phone])

  return { healthProfile, hasHealthProfile: !!healthProfile, saveHealthProfile, clearHealthProfile }
}
