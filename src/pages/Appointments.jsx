import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarCheck, Clock, User, CheckCircle2, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { departments, appointmentSlots } from '../data/mock'
import { useDirectory } from '../context/AdminContext'
import { useAppointments } from '../context/AppointmentsContext'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function Appointments() {
  const { profile, identity } = useAuth()
  const { doctors } = useDirectory() // a doctor hidden by an admin can't be booked
  // Shared store, so a booking reaches the doctor/ward console (not just local state).
  const { book, cancel, forPatient } = useAppointments()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    department: departments[0],
    doctorId: '',
    date: todayISO(),
    slot: appointmentSlots[0],
  })

  // Arriving from a doctor's profile with "Book appointment" (?doctor=id) —
  // preselect their department and themselves.
  useEffect(() => {
    const doctorId = searchParams.get('doctor')
    if (!doctorId) return
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      setForm((f) => ({ ...f, department: doctor.specialty, doctorId: doctor.id }))
    }
  }, [searchParams, doctors])
  const [confirmed, setConfirmed] = useState(false)

  // This patient's own bookings, pulled from the shared store.
  const appointments = forPatient(identity)

  const availableDoctors = doctors.filter((d) => d.specialty === form.department)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value, ...(name === 'department' ? { doctorId: '' } : {}) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    const doctor = doctors.find((d) => d.id === form.doctorId)
    book({
      patientName: form.name.trim(),
      patientEmail: identity ?? '',
      // Tagging the booking with the doctor's hospital is what lets that
      // hospital's console pick it up. "Any available doctor" has none.
      hospitalId: doctor?.hospitalId ?? null,
      hospitalName: doctor?.hospital ?? '',
      department: form.department,
      doctorId: doctor?.id ?? '',
      doctorName: doctor ? doctor.name : 'Any available doctor',
      date: form.date,
      slot: form.slot,
    })
    setConfirmed(true)
    setForm((f) => ({ ...f, name: '', doctorId: '' }))
    setTimeout(() => setConfirmed(false), 3500)
  }

  function cancelAppointment(id) {
    cancel(id)
  }

  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Book a visit in under a minute"
        description="Pick a department, choose your doctor, and lock in a slot — no phone queues."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-5 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Full name
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Department
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Doctor (optional)
            </label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              <option value="">Any available doctor</option>
              {availableDoctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Date
              </label>
              <input
                type="date"
                name="date"
                min={todayISO()}
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Time slot
              </label>
              <select
                name="slot"
                value={form.slot}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              >
                {appointmentSlots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            <CalendarCheck size={16} /> Confirm appointment
          </button>

          {confirmed && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              style={{ color: 'var(--status-good)', background: 'color-mix(in srgb, var(--status-good) 12%, transparent)' }}
            >
              <CheckCircle2 size={16} /> Appointment booked successfully.
            </div>
          )}
        </form>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Your appointments
          </h2>
          {appointments.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No appointments yet.
            </p>
          )}
          {appointments.map((a) => (
            <div key={a.id} className="card flex items-start justify-between gap-3 p-4">
              <div className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                >
                  <User size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {a.patientName} &middot; {a.department}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {a.doctorName}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Clock size={12} /> {a.date} &middot; {a.slot}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={a.status === 'confirmed' ? 'good' : 'neutral'}>
                  {a.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                </Badge>
                {a.status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => cancelAppointment(a.id)}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
