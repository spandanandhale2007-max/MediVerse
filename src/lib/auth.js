// Role definitions and the credential-check seam.
//
// ⚠️  NOT REAL AUTHENTICATION. No backend, so the check runs in the browser.
// Anyone can bypass it by setting one localStorage key and reloading:
//     localStorage.setItem('mediverse-auth', '{"role":"admin","userId":"x"}')
// No password needed. Only a server that verifies credentials can close this
// hole — see supabase/schema.sql for the intended replacement.
//
// The hashing below only keeps the owner's real password out of the JS bundle
// (it may be reused elsewhere). Unsalted SHA-256 is NOT safe for storing real
// passwords; it just keeps a known plaintext out of a public artifact.

export const ROLES = {
  patient: {
    id: 'patient',
    label: 'Patient',
    blurb: 'Book appointments, track medication and find hospitals near you.',
    method: 'otp',
    home: '/',
  },
  staff: {
    id: 'staff',
    label: 'Doctor / Ward',
    blurb: 'Ward occupancy, today’s appointment queue and patient flow.',
    method: 'credentials',
    home: '/ward',
    idLabel: 'Username',
    idPlaceholder: 'e.g. vishwaraj',
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    blurb: 'Manage the hospital directory, doctors, support reports and settings.',
    method: 'credentials',
    home: '/admin',
    idLabel: 'Work email',
    idPlaceholder: 'you@yourdomain.com',
  },
}

export const ROLE_LIST = [ROLES.patient, ROLES.staff, ROLES.admin]

// Only the EMAIL and a HASH come from the environment. The password itself is
// never referenced in code, so it cannot be inlined into the bundle.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com'
const ADMIN_HASH = import.meta.env.VITE_ADMIN_PASSWORD_SHA256 || ''

// Staff demo logins. These are throwaway values published in the UI on
// purpose so the flows can be reviewed, so hashing them buys nothing — but
// they are hashed anyway to keep one single code path.
const DEMO_ACCOUNTS = [
  {
    role: 'staff',
    userId: 'vishwaraj',
    hash: '561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324', // sha256('vishwaraj@123')
    hint: 'vishwaraj@123',
    name: 'VishwaRaj Hospital — Ward Desk',
    // Ties this login to one hospital, so the console shows that hospital's
    // doctors and the appointments patients booked there. See data/mock.js.
    hospitalId: 'vishwaraj',
  },
  {
    role: 'staff',
    userId: 'WARD-101',
    hash: '242f99222d56df85f0daefb86a79697588b595c18661c15f2fcbec5c2887c4a5',
    hint: 'Ward@123',
    name: 'Ward Desk — 1st Floor',
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

// Staff hints are safe to print — they are demo values. The admin account has
// no hint, so nothing about the owner's password is ever rendered.
export function demoAccountsFor(role) {
  return role === 'admin' ? [] : DEMO_ACCOUNTS.filter((a) => a.role === role && a.hint)
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Mirrors the shape a real POST /auth/login would return.
export async function verifyStaffCredentials(role, userId, password) {
  await new Promise((r) => setTimeout(r, 350)) // pretend network

  const account = DEMO_ACCOUNTS.find(
    (a) => a.role === role && a.userId.toLowerCase() === userId.trim().toLowerCase(),
  )
  // An unconfigured admin hash must fail closed, never match an empty string.
  if (!account || !account.hash) return { ok: false }

  const attempted = await sha256Hex(password)
  if (attempted !== account.hash) return { ok: false }

  return {
    ok: true,
    user: {
      role: account.role,
      userId: account.userId,
      name: account.name,
      // Carried into the session so the console can scope itself to one
      // hospital. Undefined for the generic staff/admin demo accounts.
      hospitalId: account.hospitalId ?? null,
    },
  }
}
