// WhatsApp OTP delivery — seam for a real provider.
//
// In dev, there's no backend to actually send a WhatsApp message, so a code
// is generated locally and shown in the UI (clearly marked as dev-only).
// Once a provider (Twilio Verify, MSG91, Gupshup, etc.) is wired up behind a
// Netlify Function, only the two branches below marked "PROD" need to change
// — nothing in LoginGate.jsx has to move.

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function requestOtp(fullPhone) {
  if (import.meta.env.DEV) {
    const code = generateCode()
    window.sessionStorage.setItem(`mediverse-otp:${fullPhone}`, code)
    await new Promise((r) => setTimeout(r, 500))
    return { ok: true, devCode: code }
  }

  // PROD: replace with a real WhatsApp OTP provider behind a Netlify Function.
  const res = await fetch('/.netlify/functions/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: fullPhone }),
  })
  if (!res.ok) throw new Error('Failed to send OTP')
  return { ok: true }
}

export async function confirmOtp(fullPhone, code) {
  if (import.meta.env.DEV) {
    await new Promise((r) => setTimeout(r, 400))
    const expected = window.sessionStorage.getItem(`mediverse-otp:${fullPhone}`)
    const isValid = expected != null && expected === code
    if (isValid) window.sessionStorage.removeItem(`mediverse-otp:${fullPhone}`)
    return isValid
  }

  // PROD: replace with a real WhatsApp OTP provider behind a Netlify Function.
  const res = await fetch('/.netlify/functions/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: fullPhone, code }),
  })
  if (!res.ok) return false
  const data = await res.json()
  return !!data.verified
}
