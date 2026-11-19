// Email OTP via Supabase Auth. Replaces the WhatsApp/Twilio SMS flow:
// SMS costs money per message, email is free at this volume.
//
// Why this is the real fix: the old version called a Netlify function
// (/.netlify/functions/send-otp) that was never written, so every deployed
// login hit a 404 and the whole site was unusable. Supabase verifies the code
// server-side and issues a signed JWT — nothing to build, nothing the browser
// can forge.
//
// Dev uses the same real path on purpose: the old bug hid because dev and prod
// ran different code (the local on-screen code masked the dead prod endpoint).
// Local now signs in through Supabase too.
//
// The local-code fallback stays for two dev-only cases: a clone with no
// .env.local, or VITE_DEV_LOCAL_OTP=true (working without a mail provider).
// Neither can turn on in a production build.

import { supabase, isSupabaseConfigured } from './supabase'

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

// Exported because useAuthState must agree with this exact decision. When it
// is true no Supabase session is ever created, so the session-derived login
// there would never fire and nobody could sign in locally. One constant, one
// answer — the two files cannot drift apart.
//
// Demo builds (`npm run build:demo`, VITE_DEMO_OTP=true in .env.demo) also use
// the on-screen code in production, so a public demo works with no backend.
// This does NOT verify email ownership — only for presentations, never for
// real patients.
export const isDemoOtp = import.meta.env.VITE_DEMO_OTP === 'true'

export const usesLocalOtp =
  isDemoOtp ||
  (import.meta.env.DEV && (!isSupabaseConfigured || import.meta.env.VITE_DEV_LOCAL_OTP === 'true'))

const localFallback = usesLocalOtp

// A production build with no Supabase URL/key has no way to send anything.
// Fail with the actual cause instead of dereferencing a null client, because
// "supabase is null" in a minified bundle tells nobody what to go and fix.
function assertConfigured() {
  if (!supabase) {
    throw new Error('Login is not configured: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY missing.')
  }
}

export async function requestOtp(email) {
  const key = normaliseEmail(email)

  if (localFallback) {
    const code = generateCode()
    window.sessionStorage.setItem(`mediverse-otp:${key}`, code)
    await new Promise((r) => setTimeout(r, 400))
    return { ok: true, devCode: code }
  }

  assertConfigured()
  const { error } = await supabase.auth.signInWithOtp({
    email: key,
    options: {
      // Anyone who hasn't signed in before is created on first verification.
      shouldCreateUser: true,
    },
  })

  if (error) {
    // Supabase's own sender allows 2 emails/hour project-wide, so this is the
    // error a real user is most likely to hit before custom SMTP is set up.
    // Say what actually happened rather than a generic failure.
    if (/rate limit|too many/i.test(error.message)) {
      throw new Error('Too many codes requested. Please wait a minute and try again.')
    }
    throw new Error(error.message || 'Failed to send the code')
  }
  return { ok: true }
}

export async function confirmOtp(email, code) {
  const key = normaliseEmail(email)

  if (localFallback) {
    await new Promise((r) => setTimeout(r, 300))
    const expected = window.sessionStorage.getItem(`mediverse-otp:${key}`)
    const isValid = expected != null && expected === code
    if (isValid) window.sessionStorage.removeItem(`mediverse-otp:${key}`)
    return isValid
  }

  assertConfigured()
  const { data, error } = await supabase.auth.verifyOtp({
    email: key,
    token: code,
    type: 'email',
  })

  if (error) return false
  return !!data?.session
}

export async function signOut() {
  if (localFallback) return
  await supabase.auth.signOut()
}
