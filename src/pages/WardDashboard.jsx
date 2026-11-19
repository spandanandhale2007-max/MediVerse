import { useEffect, useMemo, useState } from 'react'
import { BedDouble, Stethoscope, AlertTriangle, CalendarClock, Users, X, Plus, Minus, RotateCcw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { useDirectory } from '../context/AdminContext'
import { useAppointments } from '../context/AppointmentsContext'
import { useBedAvailability, DEFAULT_BEDS } from '../hooks/useBedAvailability'

// Ward / doctor view. Roster and appointments are real and scoped to the
// hospital this staff member signed in as (bookings are browser-local for now).
// Bed availability is a single figure the ward desk sets here, default 100.

// How each doctor status renders in the roster.
const DOCTOR_STATUS = {
  available: { variant: 'good', label: 'Available' },
  'in-surgery': { variant: 'warning', label: 'In surgery' },
  'off-duty': { variant: 'neutral', label: 'Off duty' },
}
function statusMeta(status) {
  return DOCTOR_STATUS[status] ?? { variant: 'neutral', label: status ?? 'Unknown' }
}

// Parses a slot label like "9:00 AM" / "12:30 PM" into minutes since midnight,
// so same-day bookings sort by real time instead of lexically ("9:00 AM" must
// not land after "10:30 AM").
function slotToMinutes(slot) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((slot ?? '').trim())
  if (!m) return 0
  let h = Number(m[1]) % 12
  if (/pm/i.test(m[3])) h += 12
  return h * 60 + Number(m[2])
}

export default function WardDashboard() {
  const { auth } = useAuth()
  // Same roster the public site sees — a doctor an admin hid must not still
  // appear here as on-duty cover.
  const { doctors } = useDirectory()
  const { forHospital, appointments, setStatus } = useAppointments()
  const [dept, setDept] = useState('All')

  // Which hospital is this console for? Set on the VishwaRaj demo login; the
  // generic staff accounts have none and fall back to the whole network.
  const hospitalId = auth?.hospitalId ?? null
  const roster = hospitalId ? doctors.filter((d) => d.hospitalId === hospitalId) : doctors
  const appts = hospitalId ? forHospital(hospitalId) : appointments

  // Ward-set bed count, saved per hospital on this device. Defaults to 100.
  const { beds, setBeds, reset, isDefault } = useBedAvailability(hospitalId)
  const [bedDraft, setBedDraft] = useState(String(beds))
  useEffect(() => setBedDraft(String(beds)), [beds])
  function commitBedDraft() {
    if (bedDraft === '') {
      setBedDraft(String(beds))
      return
    }
    setBeds(bedDraft)
  }

  // Departments this hospital actually has — no point listing empty ones.
  const rosterDepts = useMemo(() => [...new Set(roster.map((d) => d.specialty))].sort(), [roster])

  // Every doctor at this hospital (all statuses), narrowed by the filter.
  const shownDoctors = useMemo(
    () => (dept === 'All' ? roster : roster.filter((d) => d.specialty === dept)),
    [dept, roster],
  )
  const availableCount = useMemo(() => roster.filter((d) => d.status === 'available').length, [roster])

  // Confirmed bookings first, then cancelled; within a status, by date then by
  // actual clock time (via slotToMinutes, so "9:00 AM" sorts before "10:30 AM").
  const bookings = useMemo(
    () =>
      [...appts].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'confirmed' ? -1 : 1
        if (a.date !== b.date) return a.date < b.date ? -1 : 1
        return slotToMinutes(a.slot) - slotToMinutes(b.slot)
      }),
    [appts],
  )
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length

  return (
    <>
      <PageHeader
        eyebrow="Ward & Doctor Console"
        title={auth?.name ?? 'Ward console'}
        description="On-duty cover and the appointments patients have booked with this hospital."
      />

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div
          className="mb-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-xs"
          style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: 'var(--warn-fg)' }}
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" strokeWidth={2.5} />
          <p>
            <strong>Demo console.</strong> Bed availability is a figure you set here for testing (saved on this device),
            and the doctors shown are demo profiles, not real staff of this hospital. The appointments below are real
            bookings made through this app in this browser. Don't make clinical or staffing decisions from this screen.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={CalendarClock} label="Appointments" value={confirmedCount} tone="var(--brand)" />
          <StatCard icon={BedDouble} label="Beds available" value={beds} tone="var(--status-good)" />
          <StatCard icon={Stethoscope} label="Doctors" value={roster.length} tone="#2a78d6" />
          <StatCard icon={Users} label="Available now" value={availableCount} tone="#7c3aed" />
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Bed availability
          </h2>
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {beds}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  beds free right now
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StepperButton onClick={() => setBeds(beds - 1)} disabled={beds <= 0} label="Decrease beds">
                  <Minus size={16} />
                </StepperButton>
                <input
                  aria-label="Beds available"
                  inputMode="numeric"
                  value={bedDraft}
                  onChange={(e) => setBedDraft(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onBlur={commitBedDraft}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      e.currentTarget.blur()
                    }
                  }}
                  className="h-11 w-20 rounded-lg text-center text-lg font-semibold tabular-nums outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                />
                <StepperButton onClick={() => setBeds(beds + 1)} label="Increase beds">
                  <Plus size={16} />
                </StepperButton>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Default is {DEFAULT_BEDS}. Changes are saved on this device only.
              </p>
              {!isDefault && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                >
                  <RotateCcw size={12} /> Reset to {DEFAULT_BEDS}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Doctors at this hospital
            </h2>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="rounded-lg px-3 py-2 text-xs outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              <option value="All">All departments</option>
              {rosterDepts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {shownDoctors.length === 0 ? (
            <p className="card p-5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No doctors in {dept}.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {shownDoctors.map((d) => {
                const meta = statusMeta(d.status)
                return (
                  <div key={d.id} className="card flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {d.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {d.specialty} · {d.state}
                      </p>
                    </div>
                    <Badge variant={meta.variant} showIcon={false}>
                      {meta.label}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Booked appointments
          </h2>
          {bookings.length === 0 ? (
            <p className="card p-5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              No appointments booked yet. Sign in as a patient, book one with a doctor at this hospital, and it will
              appear here.
            </p>
          ) : (
            <div className="card divide-y divide-[var(--border)] overflow-hidden p-0" style={{ borderColor: 'var(--border)' }}>
              {bookings.map((a) => {
                const cancelled = a.status === 'cancelled'
                return (
                  <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium"
                        style={{
                          color: cancelled ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: cancelled ? 'line-through' : 'none',
                        }}
                      >
                        {a.patientName} · {a.department}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <CalendarClock size={12} /> {a.date} · {a.slot} · {a.doctorName}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant={cancelled ? 'neutral' : 'good'} showIcon={false}>
                        {cancelled ? 'Cancelled' : 'Confirmed'}
                      </Badge>
                      {!cancelled && (
                        <button
                          type="button"
                          onClick={() => setStatus(a.id, 'cancelled')}
                          title="Cancel this appointment"
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium"
                          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

function StepperButton({ onClick, disabled, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
      style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
    >
      {children}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="card p-4">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `color-mix(in srgb, ${tone} 16%, transparent)`, color: tone }}
      >
        <Icon size={17} />
      </span>
      <p className="mt-2.5 text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </div>
  )
}
