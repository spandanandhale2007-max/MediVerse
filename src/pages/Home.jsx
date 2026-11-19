import { Link } from 'react-router-dom'
import { Megaphone, ArrowRight, MapPin, Phone, ShieldCheck, Navigation } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import HScroll from '../components/HScroll'
import Badge from '../components/Badge'
import {
  AppointmentArt,
  DoctorArt,
  BedArt,
  PillArt,
  VaccineArt,
  CampaignArt,
  AmbulanceArt,
  SpecialistArt,
  HospitalArt,
  SupportArt,
  HeartArt,
  DiabetesArt,
  BoneArt,
  ChildArt,
  EyeArt,
  MindArt,
  LungArt,
  KidneyArt,
} from '../components/illustrations/ServiceArt'
import { bedStats, departments, campaigns } from '../data/mock'
import { mapsDirectionsUrl, VERIFICATION_LABELS } from '../data/hospitals'
import { useDirectory } from '../context/AdminContext'
import { vaccinationSchedule } from '../data/vaccinationSchedule'

// Artwork per service, so each tile reads at a glance instead of by its label.
const services = [
  { to: '/appointments', Art: AppointmentArt, title: 'Book Appointment', tagline: 'Confirmed in seconds', color: '#1c7a72' },
  { to: '/doctors', Art: DoctorArt, title: 'Find a Doctor', tagline: `${departments.length} departments`, color: '#2a78d6' },
  { to: '/beds', Art: BedArt, title: 'Bed Availability', tagline: 'Live occupancy', color: '#7a5af8' },
  { to: '/medications', Art: PillArt, title: 'Medication Tracker', tagline: 'Never miss a dose', color: '#c98500' },
  { to: '/vaccinations', Art: VaccineArt, title: 'Vaccination Alerts', tagline: 'Stay up to date', color: '#ec835a' },
  { to: '/campaigns', Art: CampaignArt, title: 'Campaigns', tagline: 'Free community drives', color: '#2f8f4e' },
  { to: '/emergency', Art: AmbulanceArt, title: 'Emergency Care', tagline: 'Ambulance to your area', color: '#d03b3b' },
  { to: '/specialists', Art: SpecialistArt, title: 'Top Specialists', tagline: 'By state & specialty', color: '#c2447a' },
  { to: '/hospitals', Art: HospitalArt, title: 'Nearby Hospitals', tagline: null, color: '#0e7490' },
  { to: '/support', Art: SupportArt, title: 'Help & Support', tagline: 'We reply by email', color: '#5b6ee1' },
]

// Deep-links into the doctor directory, which already filters on ?q=.
const concerns = [
  { q: 'Cardiology', Art: HeartArt, label: 'Heart', color: '#e0364f' },
  { q: 'Endocrinology', Art: DiabetesArt, label: 'Diabetes', color: '#c98500' },
  { q: 'Orthopedics', Art: BoneArt, label: 'Bone & Joint', color: '#6b7a99' },
  { q: 'Pediatrics', Art: ChildArt, label: 'Child Care', color: '#e08a3c' },
  { q: 'Ophthalmology', Art: EyeArt, label: 'Eye Care', color: '#2f8f8f' },
  { q: 'Psychiatry', Art: MindArt, label: 'Mental Health', color: '#8b5cf6' },
  { q: 'Pulmonology', Art: LungArt, label: 'Lungs & Chest', color: '#3aa0c9' },
  { q: 'Nephrology', Art: KidneyArt, label: 'Kidney', color: '#a15ba1' },
]

export default function Home() {
  const { hospitals, doctors } = useDirectory()
  const totalBeds = bedStats.reduce((a, b) => a + b.total, 0)
  const freeBeds = bedStats.reduce((a, b) => a + (b.total - b.occupied), 0)
  const nextCampaign = campaigns[0]

  // Best-sourced hospitals first — the shortcut rail leads with our most confident entries.
  const featuredHospitals = [...hospitals]
    .sort((a, b) => (a.verified === 'direct' ? -1 : 0) - (b.verified === 'direct' ? -1 : 0))
    .slice(0, 12)

  return (
    <>
      {/* hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="hero-banner relative overflow-hidden rounded-3xl px-5 py-10 sm:px-10 sm:py-14">
          <div className="hero-banner-glow" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl text-center">
            <span
              className="hero-in inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/25"
              style={{ animationDelay: '0ms' }}
            >
              One Platform, Every Healthcare You Need
            </span>

            {/* Brand name animates in letter by letter (each span has its own
                delay), then a sheen sweeps across. aria-label gives screen
                readers "MediVerse", not the letters one at a time. */}
            <h1
              className="hero-sheen mt-4 text-5xl font-bold leading-none tracking-tight text-white sm:text-7xl"
              aria-label="MediVerse"
            >
              {'MediVerse'.split('').map((ch, i) => (
                <span key={i} className="hero-letter" style={{ '--d': `${120 + i * 55}ms` }} aria-hidden="true">
                  {ch}
                </span>
              ))}
            </h1>

            <p
              className="hero-in mx-auto mt-4 max-w-xl text-lg font-medium text-white/95 sm:text-2xl"
              style={{ animationDelay: '760ms' }}
            >
              Hospital care, <span className="whitespace-nowrap">one search away</span>
            </p>

            <p
              className="hero-in mx-auto mt-3 max-w-xl text-sm text-white/80 sm:text-base"
              style={{ animationDelay: '900ms' }}
            >
              Find a doctor, book an appointment, check bed availability, or track medication &amp; vaccinations —
              all from one place.
            </p>

            <div className="hero-in mt-7" style={{ animationDelay: '1040ms' }}>
              <SearchBar />
            </div>

            <div
              className="hero-in mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-white/80 sm:text-sm"
              style={{ animationDelay: '1180ms' }}
            >
              <span>{doctors.length}+ doctors listed</span>
              <span className="opacity-50">&bull;</span>
              <span>{hospitals.length} hospitals with directions</span>
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

      {/* services */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead title="Everything you need, digitised" sub="Tap any service to get started." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {services.map(({ to, Art, title, tagline, color }) => (
            <Link key={title} to={to} data-magnetic
              className="card group flex flex-col items-center gap-2 p-3 text-center sm:p-4">
              <span className="transition-transform group-hover:scale-105">
                <Art tone={color} size={64} />
              </span>
              <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {title}
              </span>
              <span className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>
                {tagline ?? `${hospitals.length} with directions`}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* browse by health concern */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead
          title="Browse by health concern"
          sub="Jump straight to the right specialist."
          action={{ to: '/doctors', label: 'All departments' }}
        />
        <HScroll ariaLabel="Health concerns" gap="gap-3">
          {concerns.map(({ q, Art, label, color }) => (
            <Link
              key={label}
              to={`/doctors?q=${encodeURIComponent(q)}`}
              data-magnetic
              className="card group flex w-[7.5rem] flex-col items-center gap-2 p-3 text-center sm:w-32"
            >
              <span className="transition-transform group-hover:scale-105">
                <Art tone={color} size={60} />
              </span>
              <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {label}
              </span>
            </Link>
          ))}
        </HScroll>
      </section>

      {/* hospitals rail */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead
          title="Hospitals near you"
          sub="Real addresses and phone numbers, with one-tap directions."
          action={{ to: '/hospitals', label: `All ${hospitals.length}` }}
        />
        <HScroll ariaLabel="Hospitals near you" gap="gap-3">
          {featuredHospitals.map((h) => {
            const v = VERIFICATION_LABELS[h.verified]
            return (
              <article key={h.id} className="card flex w-64 flex-col justify-between gap-3 p-4 sm:w-72">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <HospitalArt tone="#0e7490" size={40} />
                    {v && (
                      <Badge variant={v.variant} showIcon={false}>
                        {h.verified === 'direct' ? 'Verified' : h.verified === 'govt' ? 'Govt listed' : 'Listed'}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {h.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">
                      {h.area ? `${h.area}, ` : ''}
                      {h.city}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href={`tel:${h.phone.replace(/[^\d+]/g, '')}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold"
                    style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                  >
                    <Phone size={11} /> Call
                  </a>
                  <a
                    href={mapsDirectionsUrl(h)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold"
                    style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
                  >
                    <Navigation size={11} /> Route
                  </a>
                </div>
              </article>
            )
          })}
        </HScroll>
      </section>

      {/* vaccination rail */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead
          title="Vaccinations by life stage"
          sub="From birth to older adulthood — what's due, and when."
          action={{ to: '/vaccinations', label: 'Full schedule' }}
        />
        <HScroll ariaLabel="Vaccination life stages" gap="gap-3">
          {vaccinationSchedule.slice(0, 10).map((stage) => (
            <Link
              key={stage.stage}
              to="/vaccinations"
              className="card flex w-44 flex-col gap-2 p-4 sm:w-48"
              style={{ borderTop: '3px solid #ec835a' }}
            >
              <VaccineArt tone="#ec835a" size={40} />
              <span className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {stage.stage}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {stage.doses.length} vaccine{stage.doses.length === 1 ? '' : 's'}
              </span>
            </Link>
          ))}
        </HScroll>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead title="How it works" sub="Three steps, no paperwork." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            { n: '1', title: 'Tell us what you need', body: 'Search, browse by health concern, or ask the assistant.' },
            { n: '2', title: 'Pick where and when', body: 'Compare hospitals near you, or choose a doctor and a slot.' },
            { n: '3', title: 'Go, with directions', body: 'One-tap routing, the phone number, and what it should cost.' },
          ].map((s) => (
            <div key={s.n} className="card p-5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                {s.n}
              </span>
              <h3 className="mt-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {s.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* government schemes */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead
          title="You may be paying more than you need to"
          sub="Real Government of India schemes, free to use."
          action={{ to: '/campaigns', label: 'All schemes' }}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { tone: '#2f8f4e', head: '50–80% off medicines', body: 'Jan Aushadhi sells the same generics far cheaper. 19,502 outlets, no card needed.' },
            { tone: '#1c7a72', head: '₹5 lakh free treatment', body: 'Ayushman Bharat covers hospital care at 32,000+ hospitals. Everyone 70+ qualifies.' },
            { tone: '#2a78d6', head: 'Free doctor on video', body: 'eSanjeevani connects you to a government doctor 24×7, in 22 languages.' },
          ].map((s) => (
            <Link key={s.head} to="/campaigns" className="card p-5" style={{ borderLeft: `3px solid ${s.tone}` }}>
              <p className="text-sm font-semibold" style={{ color: s.tone }}>
                {s.head}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {s.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* emergency band */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div
          className="flex flex-col items-start justify-between gap-4 rounded-3xl px-6 py-7 sm:flex-row sm:items-center sm:px-10"
          style={{ background: 'var(--status-critical)' }}
        >
          <div className="flex items-center gap-4">
            <AmbulanceArt tone="#ffffff" size={56} />
            <div>
              <p className="text-lg font-semibold text-white sm:text-xl">Something urgent?</p>
              <p className="mt-0.5 text-sm text-white/85">
                Call an ambulance directly, or request one to your area.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href="tel:108"
              className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold"
              style={{ color: 'var(--status-critical)' }}
            >
              <Phone size={15} /> Dial 108
            </a>
            <Link
              to="/emergency"
              className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ border: '1px solid rgba(255,255,255,0.55)' }}
            >
              Request an ambulance
            </Link>
          </div>
        </div>
      </section>

      {/* why mediverse */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <SectionHead title="Why trust what you see here" sub="Where our information actually comes from." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              head: 'Every hospital is verified',
              body: 'Each address and phone number is traced to an official or government source, and every entry shows how far it was checked.',
            },
            {
              head: 'Government data, not guesses',
              body: 'Scheme details come from the schemes’ own portals. Anything that changes daily links straight to the official finder.',
            },
            {
              head: 'Real doctors stay with their hospital',
              body: 'We link to each hospital’s own consultant list rather than copying it, so what you see is never out of date.',
            },
            {
              head: 'No medical advice, ever',
              body: 'We route you to a clinician. We never diagnose, and never suggest a medicine or a dose.',
            },
          ].map((f) => (
            <div key={f.head} className="card p-5">
              <ShieldCheck size={18} style={{ color: 'var(--brand)' }} />
              <h3 className="mt-2.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {f.head}
              </h3>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill value={`${freeBeds}`} label="beds free now" />
          <StatPill value={`${totalBeds}`} label="total capacity" />
          <StatPill value={`${hospitals.length}`} label="hospitals listed" />
          <StatPill value="24/7" label="scheduling access" />
        </div>

        <p
          className="mt-4 flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <ShieldCheck size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <span>
            Hospital details are real and sourced from official listings. The MediVerse doctor directory is sample data
            for demonstration — check any real practitioner on the{' '}
            <a
              href="https://www.nmc.org.in/information-desk/indian-medical-register/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: 'var(--brand)' }}
            >
              Indian Medical Register
            </a>
            .
          </span>
        </p>
      </section>
    </>
  )
}

function SectionHead({ title, sub, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {sub && (
          <p className="mt-0.5 text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            {sub}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold"
          style={{ color: 'var(--brand)' }}
        >
          {action.label} <ArrowRight size={13} />
        </Link>
      )}
    </div>
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
