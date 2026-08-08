import { useCallback, useState } from 'react'

const AUTH_KEY = 'mediverse-auth'
const PROFILE_KEY = 'mediverse-profile' // legacy single-profile key, migrated below
const PROFILES_KEY = 'mediverse-profiles' // { [phone]: profile }

function readStored(key) {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStored(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

// Profiles are stored per phone number, so signing back in with a number we
// have seen before restores that person's name/age/location instead of asking
// again. Previously logout() deleted the profile outright, which is why the
// setup form reappeared on every login.
function readProfiles() {
  const map = readStored(PROFILES_KEY)
  if (map && typeof map === 'object') return map

  // One-time migration: an older build kept a single profile with no phone
  // attached. Keep it rather than making an existing user retype everything.
  const legacy = readStored(PROFILE_KEY)
  const auth = readStored(AUTH_KEY)
  if (legacy && auth?.phone) {
    const migrated = { [auth.phone]: legacy }
    writeStored(PROFILES_KEY, migrated)
    window.localStorage.removeItem(PROFILE_KEY)
    return migrated
  }
  return {}
}

// Raw, localStorage-backed auth + profile state. Not exported to components
// directly — AuthContext wraps this once so every component shares the same
// instance (a logout in the navbar has to be visible to the gate that reads it).
export function useAuthState() {
  const [auth, setAuth] = useState(() => readStored(AUTH_KEY))
  const [profiles, setProfiles] = useState(readProfiles)

  // Patient sign-in: phone verified by OTP.
  const login = useCallback((phone) => {
    const record = { role: 'patient', phone, verifiedAt: new Date().toISOString() }
    writeStored(AUTH_KEY, record)
    setAuth(record)
  }, [])

  // Staff / admin sign-in: whatever verifyStaffCredentials() returned.
  const loginAs = useCallback((user) => {
    const record = { ...user, verifiedAt: new Date().toISOString() }
    writeStored(AUTH_KEY, record)
    setAuth(record)
  }, [])

  // Ends the session only. Saved profiles deliberately survive so returning
  // with the same number skips the setup form.
  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY)
    setAuth(null)
  }, [])

  const profile = auth?.phone ? (profiles[auth.phone] ?? null) : null

  const saveProfile = useCallback(
    (data) => {
      if (!auth?.phone) return
      setProfiles((prev) => {
        const next = { ...prev, [auth.phone]: data }
        writeStored(PROFILES_KEY, next)
        return next
      })
    },
    [auth?.phone],
  )

  // Wipes this number's saved details for good — the escape hatch for "that
  // isn't me" on a shared phone.
  const forgetProfile = useCallback(() => {
    if (!auth?.phone) return
    setProfiles((prev) => {
      const next = { ...prev }
      delete next[auth.phone]
      writeStored(PROFILES_KEY, next)
      return next
    })
  }, [auth?.phone])

  const role = auth?.role ?? null

  return {
    auth,
    isAuthenticated: !!auth,
    role,
    isPatient: role === 'patient',
    isStaff: role === 'staff',
    isAdmin: role === 'admin',
    login,
    loginAs,
    logout,
    profile,
    hasProfile: !!profile,
    saveProfile,
    forgetProfile,
    knownProfileCount: Object.keys(profiles).length,
  }
}
