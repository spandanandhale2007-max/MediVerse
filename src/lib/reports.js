// Local record of what users submitted through the support and ambulance
// forms, so the admin console has something real to show.
//
// IMPORTANT — where submissions actually go: the live forms POST to Netlify
// Forms, which emails mediversehelp@gmail.com. That is the system of record.
// This file only keeps a copy in the submitting browser's localStorage, which
// means an admin sees the reports raised on their OWN device, not everyone's.
// Reading the real cross-user inbox needs a server call with a Netlify API
// token, and a token cannot live in client-side code.
const KEY = 'mediverse-reports'
const LIMIT = 100

export function readReports() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function write(list) {
  window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, LIMIT)))
}

// `submittedBy` is the signed-in identity, not whatever the user typed into
// the form's name field — so an admin can tell which account raised a ticket
// even if the person filled the form in differently.
export function recordReport(kind, payload, { delivered, submittedBy }) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind, // 'support' | 'emergency'
    payload,
    submittedBy: submittedBy ?? null, // { phone, name } | null if signed out
    delivered, // false in dev — nothing was actually sent anywhere
    read: false,
    at: new Date().toISOString(),
  }
  write([entry, ...readReports()])
  // Same-tab listeners don't get the native `storage` event (it only fires in
  // OTHER tabs), so announce it ourselves for the admin console to pick up.
  window.dispatchEvent(new CustomEvent('mediverse:report', { detail: entry }))
  return entry
}

export function unreadReportCount() {
  return readReports().filter((r) => !r.read).length
}

export function markReportRead(id, read = true) {
  write(readReports().map((r) => (r.id === id ? { ...r, read } : r)))
}

export function clearReports() {
  write([])
}
