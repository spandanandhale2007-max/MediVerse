import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Stethoscope,
  BedDouble,
  Pill,
  Syringe,
  Megaphone,
  ArrowRight,
} from 'lucide-react'
import { bedStats } from '../data/mock'

const features = [
  {
    to: '/appointments',
    icon: CalendarCheck,
    title: 'Appointment Scheduling',
    description: 'Book, reschedule, and track visits with any department in a few taps.',
  },
  {
    to: '/doctors',
    icon: Stethoscope,
    title: 'Doctor Information',
    description: 'Browse specialists, experience, ratings, and real-time availability.',
  },
  {
    to: '/beds',
    icon: BedDouble,
    title: 'Bed Availability',
    description: 'Live occupancy across ICU, general, maternity, and emergency wards.',
  },
  {
    to: '/medications',
    icon: Pill,
    title: 'Medication Tracking',
    description: 'Stay on schedule with dosage reminders and refill counts.',
  },
  {
    to: '/vaccinations',
    icon: Syringe,
    title: 'Vaccination Alerts',
    description: 'Never miss a due date — overdue, upcoming, and scheduled at a glance.',
  },
  {
    to: '/campaigns',
    icon: Megaphone,
    title: 'Healthcare Campaigns',
    description: 'Community drives, screenings, and awareness programs near you.',
  },
]

export default function Home() {
  const totalBeds = bedStats.reduce((a, b) => a + b.total, 0)
  const freeBeds = bedStats.reduce((a, b) => a + (b.total - b.occupied), 0)

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
          >
            One platform, every hospital service
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            Hospital services,{' '}
            <span style={{ color: 'var(--brand)' }}>unified</span> in one place
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg" style={{ color: 'var(--text-secondary)' }}>
            MediVerse centralises appointments, doctor information, bed availability, medication tracking,
            vaccination alerts, and healthcare campaigns — replacing fragmented, time-consuming access with a
            single streamlined interface.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ background: 'var(--brand)' }}
            >
              Book an appointment <ArrowRight size={16} />
            </Link>
            <Link
              to="/beds"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-black/5"
              style={{ color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              Check bed availability
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:mt-14">
          <StatPill value={freeBeds} label="beds free now" />
          <StatPill value={totalBeds} label="total capacity" />
          <StatPill value="24/7" label="scheduling access" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
            Everything you need, digitised
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            Six core services built to cut administrative delay and improve accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="card group flex flex-col gap-3 p-5 transition-shadow hover:shadow-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
              <span
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-0.5"
                style={{ color: 'var(--brand)' }}
              >
                Open <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function StatPill({ value, label }) {
  return (
    <div className="card px-3 py-4 text-center">
      <div className="text-xl font-semibold tabular-nums sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  )
}
