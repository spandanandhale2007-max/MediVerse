import { useMemo, useState } from 'react'
import { Search, Star, Clock } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { doctors, departments } from '../data/mock'

const STATUS_MAP = {
  available: { variant: 'good', label: 'Available' },
  'in-surgery': { variant: 'warning', label: 'In surgery' },
  'off-duty': { variant: 'neutral', label: 'Off duty' },
}

export default function Doctors() {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All')

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesDept = department === 'All' || d.specialty === department
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase()) || d.specialty.toLowerCase().includes(query.toLowerCase())
      return matchesDept && matchesQuery
    })
  }, [query, department])

  return (
    <>
      <PageHeader
        eyebrow="Doctor Information"
        title="Find the right specialist"
        description="Browse by department, check experience and live availability before you book."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
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
                <div key={d.id} className="card flex flex-col gap-3 p-5">
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
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {d.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {d.specialty} &middot; {d.experience} yrs experience
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
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
