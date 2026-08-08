import { useMemo } from 'react'
import { Building2, Stethoscope, Mail, EyeOff, PencilLine, ArrowRight, ShieldCheck } from 'lucide-react'
import Badge from '../Badge'
import { useDirectory } from '../../context/AdminContext'
import { VERIFICATION_LABELS } from '../../data/hospitals'
import { indiaStateNames, citiesForState } from '../../data/india'

export default function AdminOverview({ onJump }) {
  const d = useDirectory()

  const stats = useMemo(() => {
    const cities = new Set(d.hospitals.map((h) => `${h.state}|${h.city}`))
    const tiers = {}
    for (const h of d.hospitals) tiers[h.verified] = (tiers[h.verified] ?? 0) + 1
    return {
      live: d.hospitals.length,
      hidden: d.hiddenHospitals.length,
      edited: Object.keys(d.hospitalEdits).length,
      cities: cities.size,
      withEmail: d.hospitals.filter((h) => h.email).length,
      withDoctors: d.hospitals.filter((h) => h.doctorsUrl).length,
      doctorsLive: d.doctors.length,
      doctorsHidden: d.hiddenDoctors.length,
      doctorsEdited: Object.keys(d.doctorEdits).length,
      tiers,
    }
  }, [d])

  const thin = useMemo(() => {
    const count = {}
    for (const h of d.hospitals) count[`${h.state}|${h.city}`] = (count[`${h.state}|${h.city}`] ?? 0) + 1
    return indiaStateNames
      .flatMap((s) => citiesForState(s).map((c) => ({ state: s, city: c, n: count[`${s}|${c}`] ?? 0 })))
      .filter((r) => r.n < 2)
      .sort((a, b) => a.n - b.n)
  }, [d.hospitals])

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Building2} label="Hospitals live" value={stats.live} tone="var(--brand)" />
        <Stat icon={Stethoscope} label="Doctors live" value={stats.doctorsLive} tone="#2a78d6" />
        <Stat icon={Mail} label="With an email" value={stats.withEmail} tone="#7a5af8" />
        <Stat icon={Building2} label="Cities covered" value={stats.cities} tone="#2f8f4e" />
      </section>

      {(stats.hidden > 0 || stats.edited > 0 || stats.doctorsHidden > 0 || stats.doctorsEdited > 0) && (
        <section className="card p-5">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Your unsaved changes to the shipped data
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            These sit on top of the data files. Nothing has been deleted — everything is restorable.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip icon={EyeOff} label={`${stats.hidden} hospitals hidden`} show={stats.hidden > 0} onClick={() => onJump('hospitals')} />
            <Chip icon={PencilLine} label={`${stats.edited} hospitals edited`} show={stats.edited > 0} onClick={() => onJump('hospitals')} />
            <Chip icon={EyeOff} label={`${stats.doctorsHidden} doctors hidden`} show={stats.doctorsHidden > 0} onClick={() => onJump('doctors')} />
            <Chip icon={PencilLine} label={`${stats.doctorsEdited} doctors edited`} show={stats.doctorsEdited > 0} onClick={() => onJump('doctors')} />
          </div>
        </section>
      )}

      <section className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--brand)' }} /> How well is each entry sourced?
        </h2>
        <div className="space-y-2.5">
          {Object.entries(VERIFICATION_LABELS).map(([tier, meta]) => {
            const n = stats.tiers[tier] ?? 0
            const pct = stats.live ? Math.round((n / stats.live) * 100) : 0
            return (
              <div key={tier}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <Badge variant={meta.variant} showIcon={false}>
                    {meta.label}
                  </Badge>
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {n} · {pct}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--surface-2)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--brand)' }} />
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Amber entries rest on third-party directories only — worth re-checking against an official source.
        </p>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Coverage backlog
        </h2>
        {thin.length === 0 ? (
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            Every city in the picker has at least two hospitals.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {thin.length} cit{thin.length === 1 ? 'y has' : 'ies have'} fewer than two listings.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {thin.map((r) => (
                <span
                  key={`${r.state}-${r.city}`}
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}
                >
                  {r.city} <span style={{ color: 'var(--text-muted)' }}>({r.n})</span>
                </span>
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => onJump('hospitals')}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: 'var(--brand)' }}
        >
          Manage hospitals <ArrowRight size={13} />
        </button>
      </section>
    </div>
  )
}

function Stat({ icon: Icon, label, value, tone }) {
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

function Chip({ icon: Icon, label, show, onClick }) {
  if (!show) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
    >
      <Icon size={12} /> {label}
    </button>
  )
}
