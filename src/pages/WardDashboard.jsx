import { useMemo, useState } from 'react'
import { BedDouble, Stethoscope, AlertTriangle, CalendarClock, Users } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { useDirectory } from '../context/AdminContext'
import { bedStats, appointmentSlots, departments } from '../data/mock'

// Ward / doctor view. Everything here reads the same local mock data the
// patient side uses — there is no backend, so this is a working layout for a
// real feed to plug into, not a live picture of any hospital.
function occupancyVariant(pct) {
  if (pct >= 90) return 'critical'
  if (pct >= 75) return 'serious'
  if (pct >= 55) return 'warning'
  return 'good'
}

export default function WardDashboard() {
  const { auth } = useAuth()
  // Same roster the public site sees — a doctor an admin hid must not still
  // appear here as on-duty cover.
  const { doctors } = useDirectory()
  const [dept, setDept] = useState('All')

  const totals = useMemo(() => {
    const total = bedStats.reduce((a, b) => a + b.total, 0)
    const occupied = bedStats.reduce((a, b) => a + b.occupied, 0)
    return { total, occupied, free: total - occupied, pct: Math.round((occupied / total) * 100) }
  }, [])

  const onDuty = useMemo(
    () => doctors.filter((d) => d.status === 'available' && (dept === 'All' || d.specialty === dept)),
    [dept, doctors],
  )

  // Guard the modulo: with an empty roster `i % 0` is NaN, which would render
  // an undefined doctor and crash on `.name`. Reachable if an admin hides
  // every doctor.
  const queue = useMemo(
    () =>
      appointmentSlots.map((slot, i) => ({
        slot,
        doctor: doctors.length > 0 ? doctors[i % doctors.length] : null,
        waiting: (i * 3 + 2) % 7,
      })),
    [doctors],
  )

  return (
    <>
      <PageHeader
        eyebrow="Ward & Doctor Console"
        title={auth?.name ?? 'Ward console'}
        description="Occupancy, on-duty cover and today's clinic queue at a glance."
      />

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <div
          className="mb-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-xs"
          style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: '#9a6a00' }}
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" strokeWidth={2.5} />
          <p>
            <strong>Sample data.</strong> These bed counts, duty rosters and queues come from the app's local demo
            dataset — they are not a live feed from any hospital. Don't make clinical or staffing decisions from this
            screen.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={BedDouble} label="Beds free" value={totals.free} tone="var(--status-good)" />
          <StatCard icon={Users} label="Occupied" value={totals.occupied} tone="var(--status-serious)" />
          <StatCard icon={BedDouble} label="Total capacity" value={totals.total} tone="var(--brand)" />
          <StatCard icon={Stethoscope} label="Doctors available" value={onDuty.length} tone="#2a78d6" />
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Occupancy by ward
          </h2>
          <div className="space-y-2.5">
            {bedStats.map((w) => {
              const pct = Math.round((w.occupied / w.total) * 100)
              return (
                <div key={w.id} className="card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {w.label}
                    </span>
                    <Badge variant={occupancyVariant(pct)}>{pct}% full</Badge>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--surface-2)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: `var(--status-${occupancyVariant(pct)})` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {w.total - w.occupied} of {w.total} free
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              On duty now
            </h2>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="rounded-lg px-3 py-2 text-xs outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              <option value="All">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {onDuty.length === 0 ? (
            <p className="card p-5 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              Nobody marked available in {dept} right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {onDuty.map((d) => (
                <div key={d.id} className="card flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {d.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {d.specialty} · {d.state}
                    </p>
                  </div>
                  <Badge variant="good">Available</Badge>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-7">
          <h2 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Today's clinic queue
          </h2>
          <div className="card divide-y overflow-hidden p-0" style={{ borderColor: 'var(--border)' }}>
            {queue.map((q) => (
              <div key={q.slot} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                  <CalendarClock size={15} style={{ color: 'var(--text-muted)' }} /> {q.slot}
                </span>
                <span className="min-w-0 flex-1 truncate px-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {q.doctor ? `${q.doctor.name} · ${q.doctor.specialty}` : 'Unassigned'}
                </span>
                <Badge variant={q.waiting > 4 ? 'warning' : 'neutral'} showIcon={false}>
                  {q.waiting} waiting
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
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
