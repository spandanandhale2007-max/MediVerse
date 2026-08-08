import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Stethoscope,
  BedDouble,
  Pill,
  Syringe,
  Megaphone,
  Siren,
  Award,
  Building2,
  ArrowRight,
} from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { bedStats, departments, campaigns } from '../data/mock'
import { useDirectory } from '../context/AdminContext'

const tiles = [
  {
    to: '/appointments',
    icon: CalendarCheck,
    title: 'Book Appointment',
    tagline: 'Confirmed in seconds',
    color: '#1c7a72',
  },
  {
    to: '/doctors',
    icon: Stethoscope,
    title: 'Find a Doctor',
    tagline: `${departments.length} departments`,
    color: '#2a78d6',
  },
  {
    to: '/beds',
    icon: BedDouble,
    title: 'Bed Availability',
    tagline: 'Live occupancy',
    color: '#7a5af8',
  },
  {
    to: '/medications',
    icon: Pill,
    title: 'Medication Tracker',
    tagline: 'Never miss a dose',
    color: '#c98500',
  },
  {
    to: '/vaccinations',
    icon: Syringe,
    title: 'Vaccination Alerts',
    tagline: 'Stay up to date',
    color: '#ec835a',
  },
  {
    to: '/campaigns',
    icon: Megaphone,
    title: 'Campaigns',
    tagline: 'Free community drives',
    color: '#2f8f4e',
  },
  {
    to: '/emergency',
    icon: Siren,
    title: 'Emergency Care',
    tagline: 'Ambulance to your area',
    color: '#d03b3b',
  },
  {
    to: '/specialists',
    icon: Award,
    title: 'Top Specialists',
    tagline: 'By state & specialty',
    color: '#c2447a',
  },
  {
    to: '/hospitals',
    icon: Building2,
    title: 'Nearby Hospitals',
    // Filled in at render — the count moves when an admin hides a hospital.
    tagline: null,
    color: '#0e7490',
  },
]

export default function Home() {
  const { hospitals, doctors } = useDirectory()
  const totalBeds = bedStats.reduce((a, b) => a + b.total, 0)
  const freeBeds = bedStats.reduce((a, b) => a + (b.total - b.occupied), 0)
  const nextCampaign = campaigns[0]

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="hero-banner relative overflow-hidden rounded-3xl px-5 py-10 sm:px-10 sm:py-14">
          <div className="hero-banner-glow" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/25">
              One Platform, Every Healthcare You Need
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Hospital care, <span className="whitespace-nowrap">one search away</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/85 sm:text-base">
              Find a doctor, book an appointment, check bed availability, or track medication &amp; vaccinations —
              all from one place.
            </p>

            <div className="mt-7">
              <SearchBar />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-white/80 sm:text-sm">
              <span>{doctors.length}+ doctors listed</span>
              <span className="opacity-50">&bull;</span>
              <span>Book appointments online</span>
              <span className="opacity-50">&bull;</span>
              <span>24/7 scheduling</span>
            </div>
          </div>
        </div>

        {nextCampaign && (
          <Link
            to="/campaigns"
            className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
            style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
          >
            <Megaphone size={16} className="shrink-0" />
            <span className="flex-1 truncate">
              <strong className="font-semibold">{nextCampaign.title}</strong>
              <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>
                — {new Date(nextCampaign.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, free &amp; open to all
              </span>
            </span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto mb-7 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
            Everything you need, digitised
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Six core services, plus fast paths to emergency care and support.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {tiles.map(({ to, icon: Icon, title, tagline: staticTagline, color }) => {
            const tagline = staticTagline ?? `${hospitals.length} with directions`
            return (
            <Link
              key={title}
              to={to}
              className="card group flex flex-col items-center gap-2.5 p-4 text-center sm:p-5"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
              >
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {tagline}
              </span>
            </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatPill value={`${freeBeds}`} label="beds free now" />
          <StatPill value={`${totalBeds}`} label="total capacity" />
          <StatPill value="24/7" label="scheduling access" />
        </div>
      </section>
    </>
  )
}

function StatPill({ value, label }) {
  return (
    <div className="card px-4 py-5 text-center">
      <div className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  )
}
