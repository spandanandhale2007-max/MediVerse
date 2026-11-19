import { createContext, useCallback, useContext, useState } from 'react'

// Shared appointment store: single source of truth for both the booking page
// and the ward/doctor console. Persisted to localStorage so bookings survive a
// reload and show up in the console.
//
// Browser-local, no backend yet: a booking is only visible in the SAME browser
// that made it — the console won't see bookings from other devices. Swap this
// one file for Supabase to get real cross-user queries; consumers stay unchanged.

const KEY = 'mediverse-appointments'

// Console starts empty on purpose so the VishwaRaj test panel only shows real
// bookings. Older builds seeded one demo booking; it's stripped on read so
// previously-seeded browsers also start from zero.
const LEGACY_SEED_ID = 'seed-vrh-1'

function read() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw == null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((a) => a?.id !== LEGACY_SEED_ID)
  } catch {
    return []
  }
}

function write(list) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
}

const AppointmentsContext = createContext(null)

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState(read)

  // Returns the created record so the caller can show a confirmation.
  const book = useCallback((appt) => {
    const record = {
      id: `a-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...appt,
    }
    setAppointments((list) => {
      const next = [record, ...list]
      write(next)
      return next
    })
    return record
  }, [])

  const setStatus = useCallback((id, status) => {
    setAppointments((list) => {
      const next = list.map((a) => (a.id === id ? { ...a, status } : a))
      write(next)
      return next
    })
  }, [])

  const value = {
    appointments,
    book,
    cancel: (id) => setStatus(id, 'cancelled'),
    setStatus,
    // Appointments booked at one hospital — what its console shows.
    forHospital: (hospitalId) => appointments.filter((a) => a.hospitalId === hospitalId),
    // A given patient's own bookings, keyed by the email they signed in with.
    forPatient: (email) => appointments.filter((a) => a.patientEmail && a.patientEmail === email),
  }

  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
}

export function useAppointments() {
  const ctx = useContext(AppointmentsContext)
  if (!ctx) throw new Error('useAppointments must be used within an AppointmentsProvider')
  return ctx
}
