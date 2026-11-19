import { Megaphone, CalendarDays, ExternalLink, Landmark, Info, ArrowRight, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import HScroll from '../components/HScroll'
import Badge from '../components/Badge'
import { campaigns } from '../data/mock'
import { govPrograms, liveFinders } from '../data/govPrograms'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Campaigns() {
  return (
    <>
      <PageHeader
        eyebrow="Health Schemes & Campaigns"
        title="Free treatment, cheaper medicine, and where to donate blood"
        description="Real Government of India programmes you can use today — plus live finders for camps and centres near you."
      />

      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* government programmes */}
        <section>
          <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Landmark size={17} style={{ color: 'var(--brand)' }} /> Government of India schemes
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Verified against each scheme's official portal. Figures move over time — follow the link for today's numbers.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {govPrograms.map((p) => (
              <article key={p.id} className="card flex flex-col gap-3 p-5" style={{ borderTop: `3px solid ${p.tone}` }}>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ color: p.tone, background: `color-mix(in srgb, ${p.tone} 14%, transparent)` }}
                  >
                    {p.category}
                  </span>
                  <Badge variant="good" showIcon={false}>
                    Official
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: p.tone }}>
                    {p.short}
                  </p>
                </div>

                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {p.body}
                </p>

                <ul className="space-y-1">
                  {p.facts.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: p.tone }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>Who can use it: </strong>
                  {p.who}
                </p>

                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold"
                  style={{ background: p.tone, color: '#fff' }}
                >
                  {p.action} <ExternalLink size={12} />
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* live finders */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Search size={17} style={{ color: 'var(--brand)' }} /> Find camps &amp; centres near you
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            These open the government's own live finders.
          </p>

          <HScroll ariaLabel="Government finders" className="mt-4" gap="gap-3">
            {liveFinders.map((f) => (
              <a
                key={f.id}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex w-60 flex-col gap-2 p-4 sm:w-64"
                style={{ borderLeft: `3px solid ${f.tone}` }}
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {f.label}
                </span>
                <span className="text-xs leading-snug" style={{ color: 'var(--text-muted)' }}>
                  {f.body}
                </span>
                <span className="mt-auto flex items-center gap-1 pt-1 text-xs font-semibold" style={{ color: f.tone }}>
                  Open <ExternalLink size={11} />
                </span>
              </a>
            ))}
          </HScroll>
        </section>

        {/* why we link out */}
        <p
          className="mt-6 flex items-start gap-2 rounded-xl px-4 py-3 text-xs"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Info size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <span>
            <strong style={{ color: 'var(--text-primary)' }}>Why we link out for camps.</strong> Camp dates and venues
            change constantly, and a copy of them here would go stale within days — sending you across the city to a
            drive that finished last week. The schemes above are stable enough to describe; anything dated comes
            straight from the government portal that maintains it.
          </span>
        </p>

        {/* MediVerse own drives */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                <Megaphone size={17} style={{ color: 'var(--brand)' }} /> MediVerse community drives
              </h2>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Sample events used to demonstrate the booking flow.
              </p>
            </div>
            <Badge variant="warning" showIcon={false}>
              Sample data
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {campaigns.map((c) => (
              <div key={c.id} className="card flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                  >
                    <Megaphone size={18} />
                  </span>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                  >
                    {c.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {c.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {c.description}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <CalendarDays size={13} /> {formatDate(c.date)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <a
          href="https://mohfw.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex items-center justify-center gap-1.5 text-xs font-semibold"
          style={{ color: 'var(--brand)' }}
        >
          Ministry of Health &amp; Family Welfare <ArrowRight size={13} />
        </a>
      </div>
    </>
  )
}
