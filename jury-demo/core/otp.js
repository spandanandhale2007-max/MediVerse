// Passwordless login code.
// Extracted from src/lib/otp.js (the local fallback path).
//
// SAY THIS OUT LOUD: production does NOT verify codes here. The deployed app
// calls supabase.auth.signInWithOtp() and supabase.auth.verifyOtp()
// (src/lib/otp.js:71 and :103). Supabase checks the code on its own servers
// and returns a signed JWT, so a browser cannot forge a session.
//
// This file is the fallback the app uses in development, or in a demo build
// with no mail provider. It is the same state machine, running where you can
// watch it: generate, store, compare, consume on success.

// Stands in for window.sessionStorage. One pending code per email.
const pending = new Map()

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Normalised so "Spandan@Gmail.com " and "spandan@gmail.com" are one account
// rather than two. Everything downstream keys off this value.
export function normaliseEmail(email) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())
}

export function requestOtp(email) {
  if (!isValidEmail(email)) return { ok: false, reason: 'invalid-email' }
  const key = normaliseEmail(email)
  const code = generateCode()
  pending.set(key, code)
  return { ok: true, devCode: code }
}

export function confirmOtp(email, code) {
  const key = normaliseEmail(email)
  const expected = pending.get(key)
  const isValid = expected != null && expected === code
  // A code is single use: consumed the moment it works, so a replay fails.
  if (isValid) pending.delete(key)
  return isValid
}

export function pendingCount() {
  return pending.size
}
