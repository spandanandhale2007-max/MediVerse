import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { usesLocalOtp } from '../lib/otp'

// True when a patient login is backed by a real Supabase session.
// Not enough to just be configured: the dev escape hatch (VITE_DEV_LOCAL_OTP)
// verifies codes locally and never creates a session, so we check both here
// (and nowhere else) or we'd lock everyone out.
const sessionBacked = isSupabaseConfigured && !usesLocalOtp

const AUTH_KEY = 'mediverse-auth'
const LEGACY_PROFILE_KEY = 'mediverse-profile' // oldest: single unkeyed profile
const PROFILES_KEY = 'mediverse-profiles' // { [identity]: profile }

// Identity is the email address (was the phone number under WhatsApp OTP;
// login moved to email since email is free to send). Every per-user record
// keys off this, so it's the one place to change if identity ever moves again.
// Phone still exists as a profile field (ambulance needs a callback number),
// it just no longer identifies the account.
export function identityOf(auth) {
  return auth?.email ?? null
}

// Builds a patient from a Supabase session. That session is a JWT Supabase
// signed after verifying the emailed code, so the browser can't forge one:
// editing localStorage gives a bad signature and Postgres rejects the request.
// WARNING: staff/admin still use the local check in lib/auth.js, so the
// role-forgery hole documented there is NOT closed for them yet.
function patientFromSession(session) {
  if (!session?.user?.email) return null
  return {
    role: 'patient',
    email: session.user.email,
    userId: session.user.id,
    verifiedAt: session.user.last_sign_in_at ?? new Date().toISOString(),
  }
}

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

// Profiles are stored per identity, so a returning address restores that
// person's details instead of asking again.
function readProfiles() {
  const map = readStored(PROFILES_KEY)
  if (map && typeof map === 'object') return map

  // Migrate the old single-profile format into the keyed map.
  const legacy = readStored(LEGACY_PROFILE_KEY)
  const auth = readStored(AUTH_KEY)
  const id = identityOf(auth) ?? auth?.phone
  if (legacy && id) {
    const migrated = { [id]: legacy }
    writeStored(PROFILES_KEY, migrated)
    window.localStorage.removeItem(LEGACY_PROFILE_KEY)
    return migrated
  }
  return {}
}

// Reads the stored staff/admin session. When Supabase is live, old local
// patient records are dropped — only a real session may grant that role, and
// trusting a stale local copy would reopen the forgery hole.
function readLocalAuth() {
  const stored = readStored(AUTH_KEY)
  if (!stored) return null

  if (stored.role === 'patient') {
    if (sessionBacked) {
      window.localStorage.removeItem(AUTH_KEY)
      return null
    }
    // A session created before the switch to email has a phone but no email.
    // It can't be re-keyed safely, so end it and ask the person to sign in
    // again — one login beats silently attaching their records to the wrong
    // identity.
    if (!stored.email) {
      window.localStorage.removeItem(AUTH_KEY)
      return null
    }
  }
  return stored
}

// Raw auth + profile state. Not exported to components directly — AuthContext
// wraps this once so every component shares the same instance (a logout in the
// navbar has to be visible to the gate that reads it).
export function useAuthState() {
  const [localAuth, setLocalAuth] = useState(readLocalAuth)
  const [sessionAuth, setSessionAuth] = useState(null)
  // Restoring a session is an async round-trip. Without this flag the gate
  // renders first and every returning user sees a login screen flash before
  // being silently signed back in.
  const [restoring, setRestoring] = useState(sessionBacked)
  const [profiles, setProfiles] = useState(readProfiles)

  useEffect(() => {
    if (!sessionBacked) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSessionAuth(patientFromSession(data.session))
      setRestoring(false)
    })

    // Fires on sign-in, sign-out and token refresh — including in another tab,
    // so logging out in one window ends the session in all of them.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      setSessionAuth(patientFromSession(session))
      setRestoring(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // The Supabase session wins whenever there is one; the local record only
  // ever carries staff and admin once Supabase is configured.
  const auth = sessionAuth ?? localAuth

  // Patient sign-in. With Supabase the session is already established by
  // verifyOtp() and onAuthStateChange has the state — nothing to store. The
  // localStorage path remains for a clone running without a .env.local.
  const login = useCallback((email) => {
    if (sessionBacked) return
    const record = { role: 'patient', email, verifiedAt: new Date().toISOString() }
    writeStored(AUTH_KEY, record)
    setLocalAuth(record)
  }, [])

  // Staff / admin sign-in: whatever verifyStaffCredentials() returned.
  const loginAs = useCallback((user) => {
    const record = { ...user, verifiedAt: new Date().toISOString() }
    writeStored(AUTH_KEY, record)
    setLocalAuth(record)
  }, [])

  // Ends the session only. Saved profiles deliberately survive so returning
  // with the same address skips the setup form.
  const logout = useCallback(async () => {
    window.localStorage.removeItem(AUTH_KEY)
    setLocalAuth(null)
    if (sessionBacked) {
      await supabase.auth.signOut()
      setSessionAuth(null)
    }
  }, [])

  const identity = identityOf(auth)
  const profile = identity ? (profiles[identity] ?? null) : null

  const saveProfile = useCallback(
    (data) => {
      if (!identity) return
      setProfiles((prev) => {
        const next = { ...prev, [identity]: data }
        writeStored(PROFILES_KEY, next)
        return next
      })
    },
    [identity],
  )

  // Wipes this account's saved details for good — the escape hatch for "that
  // isn't me" on a shared device.
  const forgetProfile = useCallback(() => {
    if (!identity) return
    setProfiles((prev) => {
      const next = { ...prev }
      delete next[identity]
      writeStored(PROFILES_KEY, next)
      return next
    })
  }, [identity])

  const role = auth?.role ?? null

  return {
    auth,
    identity,
    isAuthenticated: !!auth,
    restoring,
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
