// Staff / admin credential check.
// Extracted from src/lib/auth.js. Same logic, one substitution: the browser
// hashes with crypto.subtle.digest('SHA-256'), Node hashes with node:crypto.
// Same digest, same comparison, same failure cases.
//
// NOT REAL AUTHENTICATION, and the web app says so in the same place. With no
// backend the check runs on the client, so it is bypassable with one
// localStorage key. Hashing only keeps the owner's real password out of the
// shipped JS bundle. The replacement is in supabase/schema.sql.

import { createHash } from 'node:crypto'

export function sha256Hex(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

// Only the EMAIL and a HASH come from the environment. The admin password
// itself is never referenced in code, so it cannot be inlined into a build.
const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_HASH = process.env.VITE_ADMIN_PASSWORD_SHA256 || ''

// Staff demo logins. Throwaway values printed in the UI on purpose so the
// flows can be reviewed. Hashed anyway, to keep one single code path.
export const DEMO_ACCOUNTS = [
  {
    role: 'staff',
    userId: 'vishwaraj',
    hash: '561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324', // sha256('vishwaraj@123')
    hint: 'vishwaraj@123',
    name: 'VishwaRaj Hospital - Ward Desk',
    hospitalId: 'vishwaraj',
  },
  {
    role: 'staff',
    userId: 'WARD-101',
    hash: '242f99222d56df85f0daefb86a79697588b595c18661c15f2fcbec5c2887c4a5',
    hint: 'Ward@123',
    name: 'Ward Desk - 1st Floor',
  },
  {
    role: 'staff',
    userId: 'DOC-204',
    hash: '87b6cad54af872d1632baf0b418b5d88ecde80c364b73668c036da565cd384ce',
    hint: 'Doc@123',
    name: 'Dr. On-Call, General Medicine',
  },
  { role: 'admin', userId: ADMIN_EMAIL, hash: ADMIN_HASH, hint: null, name: 'MediVerse Admin' },
]

// The web version awaits a 350 ms "pretend network" delay here so the UI shows
// a real pending state. Dropped in the terminal: nothing to animate.
export function verifyStaffCredentials(role, userId, password) {
  const account = DEMO_ACCOUNTS.find(
    (a) => a.role === role && a.userId.toLowerCase() === userId.trim().toLowerCase(),
  )

  // An unconfigured admin hash must FAIL CLOSED, never match an empty string.
  if (!account || !account.hash) return { ok: false, reason: account ? 'not-configured' : 'no-such-user' }

  const attempted = sha256Hex(password)
  if (attempted !== account.hash) return { ok: false, reason: 'wrong-password', attempted }

  return {
    ok: true,
    attempted,
    user: {
      role: account.role,
      userId: account.userId,
      name: account.name,
      hospitalId: account.hospitalId ?? null,
    },
  }
}
