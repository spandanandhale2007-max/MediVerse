// Appointment store.
// Extracted from src/context/AppointmentsContext.jsx. One store is the single
// source of truth for BOTH the patient booking page and the ward console:
// forPatient() is what a patient sees, forHospital() is what that hospital's
// ward desk sees, and they read the same array.
//
// The React version persists to localStorage, which means browser-local: a
// booking is visible only in the browser that made it. Swapping this one file
// for a Supabase query is what makes it cross-user. Consumers stay unchanged.

export function createStore() {
  let appointments = []

  // Returns the created record so the caller can show a confirmation.
  function book(appt) {
    const record = {
      id: `a-${Date.now()}-${appointments.length}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      ...appt,
    }
    appointments = [record, ...appointments]
    return record
  }

  function setStatus(id, status) {
    appointments = appointments.map((a) => (a.id === id ? { ...a, status } : a))
    return appointments.find((a) => a.id === id)
  }

  return {
    book,
    setStatus,
    cancel: (id) => setStatus(id, 'cancelled'),
    all: () => appointments,
    // Appointments booked at one hospital. This is what its console shows.
    forHospital: (hospitalId) => appointments.filter((a) => a.hospitalId === hospitalId),
    // A given patient's own bookings, keyed by the email they signed in with.
    forPatient: (email) => appointments.filter((a) => a.patientEmail && a.patientEmail === email),
  }
}
