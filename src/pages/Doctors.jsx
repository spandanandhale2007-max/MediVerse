import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Star, Clock, MapPin } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import DoctorProfileModal from '../components/DoctorProfileModal'
import DoctorDataNotice from '../components/DoctorDataNotice'
import { departments } from '../data/mock'
import { useDirectory } from '../context/AdminContext'

const STATUS_MAP = {
  available: { variant: 'good', label: 'Available' },
  'in-surgery': { variant: 'warning', label: 'In surgery' },
  'off-duty': { variant: 'neutral', label: 'Off duty' },
}

export default function Doctors() {
  const { doctors } = useDirectory() // admin hides/edits applied
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [department, setDepartment] = useState('All')
  const [activeDoctor, setActiveDoctor] = useState(null)

  // A homepage search arrives as ?q=... — keep the search box in sync with it.
  useEffect(() => {
    const q = searchParams.get('q')
    if (q !== null) setQuery(q)
  }, [searchParams])

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesDept = department === 'All' || d.specialty === department
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.specialty.toLowerCase().includes(query.toLowerCase())
      return matchesDept && matchesQuery
    })
  }, [query, department, doctors])

  return (
    <>
      <PageHeader
        eyebrow="Doctor Information"
        title="Find the right specialist"
        description="Browse by department, check experience and live availability before you book. Tap a doctor for their full profile."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <DoctorDataNotice className="mb-5" />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctors or specialties..."
              className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-lg px-3 py-2 text-sm outline-none sm:w-56"
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

        {filtered.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No doctors match your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => {
              const s = STATUS_MAP[d.status]
              return (
                <button
                  type="button"
                  key={d.id}
                  onClick={() => setActiveDoctor(d)}
                  className="card flex flex-col gap-3 p-5 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                    >
                      {d.name
                        .split(' ')
                        .slice(-2)
                        .map((p) => p[0])
                        .join('')}
                    </div>
                    <Badge variant={s.variant}>{s.label}</Badge>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {d.name}
                      {d.featured && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                          style={{ color: '#c2447a', background: 'color-mix(in srgb, #c2447a 14%, transparent)' }}
                        >
                          Featured
                        </span>
                      )}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {d.specialty} &middot; {d.experience} yrs experience
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> {d.state}
                      {d.availableNationwide ? ' · nationwide' : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Star size={13} fill="currentColor" stroke="none" style={{ color: 'var(--status-warning)' }} />
                      {d.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {d.nextSlot}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {activeDoctor && <DoctorProfileModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />}
    </>
  )
}
