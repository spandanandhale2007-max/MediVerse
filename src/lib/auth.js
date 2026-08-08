// Role definitions and the credential-check seam.
//
// ⚠️  THIS IS NOT REAL AUTHENTICATION. There is no backend yet, so the checks
// below run in the browser against constants that ship inside the JS bundle.
// Anyone can read them in devtools. It exists so the three sign-in journeys
// and the role-based routing can be built and reviewed now; it protects
// nothing and must not be treated as a security boundary.
//
// When the backend lands, replace `verifyStaffCredentials` with a POST to it
// and keep everything else — the same shape is already what the UI expects.
// That is the same seam pattern used by src/lib/otp.js for the WhatsApp OTP.

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
    idLabel: 'Staff ID',
    idPlaceholder: 'e.g. WARD-101',
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

// The admin login comes from .env.local (gitignored) so it stays out of git
// history. Vite still inlines it into the bundle, so it is readable in
// devtools on the deployed site — keeping it out of the repo is the only
// protection this buys. See .env.example.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@mediverse.app'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123'

// Demo logins. Replace wholesale with a real identity provider — do not
// "harden" these; there is nothing to harden without a server.
const DEMO_ACCOUNTS = [
  { role: 'staff', userId: 'WARD-101', password: 'Ward@123', name: 'Ward Desk — 1st Floor' },
  { role: 'staff', userId: 'DOC-204', password: 'Doc@123', name: 'Dr. On-Call, General Medicine' },
  { role: 'admin', userId: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: 'MediVerse Admin' },
]

// Staff demo logins are safe to print on screen. The admin one is a real
// password the owner chose, so it is never displayed anywhere in the UI.
export function demoAccountsFor(role) {
  return role === 'admin' ? [] : DEMO_ACCOUNTS.filter((a) => a.role === role)
}

// Mirrors the shape a real POST /auth/login would return.
export async function verifyStaffCredentials(role, userId, password) {
  await new Promise((r) => setTimeout(r, 350)) // pretend network
  const match = DEMO_ACCOUNTS.find(
    (a) => a.role === role && a.userId.toLowerCase() === userId.trim().toLowerCase() && a.password === password,
  )
  if (!match) return { ok: false }
  return { ok: true, user: { role: match.role, userId: match.userId, name: match.name } }
}
