import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Mail, ExternalLink, Info, Navigation, Map as MapIcon, Search, X, Stethoscope } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { mapsDirectionsUrl, mapsEmbedUrl, VERIFICATION_LABELS } from '../data/hospitals'
import { useDirectory } from '../context/AdminContext'
import { indiaStateNames, citiesForState } from '../data/india'

const ALL = 'All'

export default function RealHospitals() {
  const { profile } = useAuth()
  // Respects anything an admin hid or edited.
  const { hospitals: realHospitals } = useDirectory()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState(searchParams.get('state') ?? ALL)
  const [city, setCity] = useState(searchParams.get('city') ?? ALL)
  const [query, setQuery] = useState('')
  const [openMapId, setOpenMapId] = useState(null)

  useEffect(() => {
    const s = searchParams.get('state')
    if (s !== null) setState(s)
    const c = searchParams.get('city')
    if (c !== null) setCity(c)
  }, [searchParams])

  // Covers all of India, not just states/cities we happen to have hospital
  // data for — the city list is gated behind picking a state first, both
  // because "which city" only makes sense once you know the state, and
  // because showing every Indian city in one flat list isn't usable.
  const states = indiaStateNames
  const cities = useMemo(() => (state === ALL ? [] : citiesForState(state)), [state])
  const hospitalCount = useMemo(() => {
    const counts = new Map()
    for (const h of realHospitals) counts.set(`${h.state}|${h.city}`, (counts.get(`${h.state}|${h.city}`) ?? 0) + 1)
    return counts
  }, [realHospitals])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return realHospitals.filter((h) => {
      if (state !== ALL && h.state !== state) return false
      if (city !== ALL && h.city !== city) return false
      if (!q) return true
      return (
        h.name.toLowerCase().includes(q) ||
        h.area?.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q)
      )
    })
  }, [state, city, query, realHospitals])

  const puneCount = realHospitals.filter((h) => h.city === 'Pune').length

  return (
    <>
      <PageHeader
        eyebrow="Hospital Directory"
        title="Real hospitals near you"
        description="Addresses, phone numbers, and one-tap directions — for independent hospitals, listed as reference."
      />

      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div
          className="mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Info size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <p>
            These are real, independently-operated hospitals listed as reference information.{' '}
            <strong style={{ color: 'var(--text-primary)' }}>They aren't part of the MediVerse network</strong>, aren't
            bookable here, and we hold no data on their live bed availability or doctors. Each entry shows how far its
            details were verified — always confirm by phone before travelling for something urgent.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospital, area or address..."
              className="w-full rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value)
              setCity(ALL)
            }}
            className="rounded-lg px-3 py-2.5 text-sm outline-none sm:w-44"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
          >
            <option value={ALL}>All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={state === ALL}
            className="rounded-lg px-3 py-2.5 text-sm outline-none sm:w-48 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
          >
            <option value={ALL}>{state === ALL ? 'Select a state first' : 'All cities'}</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
                {hospitalCount.get(`${state}|${c}`) ? ` (${hospitalCount.get(`${state}|${c}`)})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {realHospitals.length}
            listed nationwide
            {profile?.location ? ` · your profile says ${profile.location}` : ''}
          </p>
          {city !== 'Pune' && (
            <button
              type="button"
              onClick={() => {
                setState('Maharashtra')
                setCity('Pune')
              }}
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
            >
              Show Pune ({puneCount}) — our best-covered city
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <MapPin size={20} style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {query.trim()
                ? 'No hospitals match that search.'
                : `No hospitals listed for ${city !== ALL ? `${city}, ` : ''}${state === ALL ? 'this location' : state}.`}
            </p>
            <p className="max-w-sm text-xs" style={{ color: 'var(--text-muted)' }}>
              {query.trim()
                ? 'Try clearing the search box, or widening the state and city filters.'
                : 'Try another city — this one has nothing listed right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((h) => {
              const v = VERIFICATION_LABELS[h.verified]
              const mapOpen = openMapId === h.id
              return (
                <div key={h.id} className="card overflow-hidden">
                  <div className="p-5">
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {h.name}
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {h.area ? `${h.area} · ` : ''}
                          {h.city}, {h.state}
                        </p>
                      </div>
                      <Badge variant={v.variant} showIcon={false}>
                        {v.label}
                      </Badge>
                    </div>

                    <p className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin size={13} className="mt-0.5 shrink-0" /> {h.address}
                    </p>

                    {h.note && (
                      <p className="mt-1.5 text-xs italic" style={{ color: 'var(--text-muted)' }}>
                        {h.note}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a
                        href={`tel:${h.phone.replace(/[^\d+]/g, '')}`}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                      >
                        <Phone size={12} /> {h.phone}
                      </a>
                      {h.emergencyPhone && (
                        <a
                          href={`tel:${h.emergencyPhone.replace(/[^\d+]/g, '')}`}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                          style={{
                            color: 'var(--status-critical)',
                            background: 'color-mix(in srgb, var(--status-critical) 12%, transparent)',
                          }}
                        >
                          <Phone size={12} /> Emergency: {h.emergencyPhone}
                        </a>
                      )}
                      {/* Institutional address only — never a doctor's own */}
                      {h.email && (
                        <a
                          href={`mailto:${h.email}`}
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                        >
                          <Mail size={12} /> {h.email}
                        </a>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <a
                        href={mapsDirectionsUrl(h)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                        style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
                      >
                        <Navigation size={12} /> Get directions
                      </a>
                      <button
                        type="button"
                        onClick={() => setOpenMapId(mapOpen ? null : h.id)}
                        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                        style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      >
                        {mapOpen ? <X size={11} /> : <MapIcon size={11} />} {mapOpen ? 'Hide map' : 'View on map'}
                      </button>
                      {/* Deep link into the hospital's own doctor directory —
                          we never copy their roster here, see hospitals.js */}
                      {h.doctorsUrl && (
                        <a
                          href={h.doctorsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                          style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                        >
                          <Stethoscope size={12} /> Doctors here <ExternalLink size={10} />
                        </a>
                      )}
                      {/* Some entries deliberately carry no website — see hospitals.js */}
                      {h.website && (
                        <a
                          href={h.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
                          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                        >
                          Official site <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  {mapOpen && (
                    <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                      <iframe
                        title={`Map showing ${h.name}`}
                        src={mapsEmbedUrl(h)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="block h-64 w-full border-0 sm:h-72"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <p className="mt-6 text-xs" style={{ color: 'var(--text-muted)' }}>
          This directory isn't exhaustive — Mumbai and Pune alone have several hundred hospitals and nursing homes
          each. Only entries backed by a verifiable source are listed here rather than filling gaps with guesses.
        </p>
      </div>
    </>
  )
}
