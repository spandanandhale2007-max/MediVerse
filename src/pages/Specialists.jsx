import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, MapPin, Stethoscope, Star, Clock, ArrowRight, SearchX, Globe, ExternalLink, Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import DoctorProfileModal from '../components/DoctorProfileModal'
import DoctorDataNotice from '../components/DoctorDataNotice'
import { departments, states } from '../data/mock'
import { useDirectory } from '../context/AdminContext'

const STATUS_MAP = {
  available: { variant: 'good', label: 'Available' },
  'in-surgery': { variant: 'warning', label: 'In surgery' },
  'off-duty': { variant: 'neutral', label: 'Off duty' },
}

// Count of specialists in a state for a field. Nationwide (telehealth) doctors
// count for every state, and the roster is passed in so admin-hidden doctors shrink it.
function countFor(roster, stateName, dept) {
  return roster.filter((d) => d.specialty === dept && (d.state === stateName || d.availableNationwide)).length
}

export default function Specialists() {
  const { doctors, hospitals: realHospitals } = useDirectory()
  const [state, setState] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeDoctor, setActiveDoctor] = useState(null)

  // Specialty options cascade off the chosen state, showing only fields that
  // have someone — otherwise many state x specialty picks led to empty results.
  const specialtyOptions = useMemo(() => {
    if (!state) return []
    return departments.map((d) => ({ name: d, count: countFor(doctors, state, d) })).filter((d) => d.count > 0)
  }, [state, doctors])

  function handleStateChange(e) {
    const next = e.target.value
    setState(next)
    setSubmitted(false)
    // Drop a specialty that the new state has nobody for.
    if (specialty && countFor(doctors, next, specialty) === 0) setSpecialty('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!state || !specialty) return
    setSubmitted(true)
  }

  // Doctors in that state, plus nationwide/telehealth doctors in the same specialty.
  const results = submitted
    ? doctors
        .filter((d) => d.specialty === specialty && (d.state === state || d.availableNationwide))
        .sort((a, b) => (b.featured === a.featured ? b.rating - a.rating : b.featured ? 1 : -1))
    : []

  // Independent hospitals in the state that publish their own consultant list.
  // We link out instead of copying it — their page stays current and attributed.
  const hospitalDirectories = submitted
    ? realHospitals.filter((h) => h.state === state && h.doctorsUrl)
    : []

  return (
    <>
      <PageHeader
        eyebrow="Top Specialists"
        title="Find a renowned specialist near you"
        description="Tell us your state and the specialisation you need. The specialisation list only shows fields we actually have someone in for that state, so every choice returns a match — the number in brackets is how many."
      />

      <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-3 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Which state are you in?
            </label>
            <select
              required
              value={state}
              onChange={handleStateChange}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              <option value="" disabled>
                Select a state
              </option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Which specialisation?
            </label>
            <select
              required
              value={specialty}
              disabled={!state}
              onChange={(e) => {
                setSpecialty(e.target.value)
                setSubmitted(false)
              }}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            >
              <option value="" disabled>
                {!state
                  ? 'Select a state first'
                  : specialtyOptions.length === 0
                    ? 'No specialists listed here'
                    : 'e.g. ENT, Cardiology...'}
              </option>
              {specialtyOptions.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.count})
                </option>
              ))}
            </select>
            {/* Reachable if an admin has hidden every doctor in a state. */}
            {state && specialtyOptions.length === 0 && (
              <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                No specialists are listed for {state} at the moment. You can still browse real hospitals there.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            <Stethoscope size={15} /> Find
          </button>
        </form>

        {submitted && (
          <div className="mt-6">
            {results.length === 0 ? (
              <div className="card flex flex-col items-center gap-2 p-8 text-center">
                <SearchX size={22} style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  No {specialty} specialists in {state} yet
                </p>
                <p className="max-w-xs text-xs" style={{ color: 'var(--text-muted)' }}>
                  Try browsing every {specialty} doctor in our directory instead.
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <Link
                    to={`/doctors?q=${encodeURIComponent(specialty)}`}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
                    style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                  >
                    View all {specialty} doctors <ArrowRight size={13} />
                  </Link>
                  <Link
                    to={`/hospitals?state=${encodeURIComponent(state)}`}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
                    style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    Browse real hospitals in {state} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <DoctorDataNotice className="mb-4" />
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  {results.length} specialist{results.length > 1 ? 's' : ''} for {state}
                </p>
                {results.map((d) => {
                  const s = STATUS_MAP[d.status]
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setActiveDoctor(d)}
                      className="card flex w-full items-center justify-between gap-3 p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                          style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                        >
                          {d.name
                            .split(' ')
                            .slice(-2)
                            .map((p) => p[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {d.name}
                            {d.featured && (
                              <span
                                className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                style={{ color: '#c2447a', background: 'color-mix(in srgb, #c2447a 14%, transparent)' }}
                              >
                                <Award size={10} /> Featured
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {d.specialty} &middot; {d.experience} yrs
                          </p>
                          <p className="mt-1 flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                            <span className="flex items-center gap-1">
                              {d.availableNationwide ? <Globe size={12} /> : <MapPin size={12} />}
                              {d.availableNationwide ? 'Available nationwide' : d.state}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} fill="currentColor" stroke="none" style={{ color: 'var(--status-warning)' }} />
                              {d.rating}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={s.variant}>{s.label}</Badge>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Clock size={12} /> {d.nextSlot}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {hospitalDirectories.length > 0 && (
              <section className="mt-8">
                <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Consultants at hospitals in {state}
                </p>
                <div
                  className="mt-2 mb-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
                  style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
                >
                  <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
                  <p>
                    These are independent hospitals, <strong style={{ color: 'var(--text-primary)' }}>not part of MediVerse</strong>.
                    Each link opens that hospital's own consultant list — so the names, qualifications and timings you
                    see are theirs and always current. We don't copy their roster here, because a stale copy could
                    send you to see a doctor who has moved on.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {hospitalDirectories.map((h) => (
                    <a
                      key={h.id}
                      href={h.doctorsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card flex items-center justify-between gap-3 p-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {h.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <MapPin size={12} /> {h.area ? `${h.area}, ` : ''}
                          {h.city}
                        </p>
                      </div>
                      <span
                        className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                      >
                        View doctors <ExternalLink size={11} />
                      </span>
                    </a>
                  ))}
                </div>

                <Link
                  to={`/hospitals?state=${encodeURIComponent(state)}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: 'var(--brand)' }}
                >
                  See all hospitals in {state} <ArrowRight size={13} />
                </Link>
              </section>
            )}
          </div>
        )}
      </div>

      {activeDoctor && <DoctorProfileModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />}
    </>
  )
}
