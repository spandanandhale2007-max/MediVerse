import { Megaphone, CalendarDays } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { campaigns } from '../data/mock'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Campaigns() {
  return (
    <>
      <PageHeader
        eyebrow="Healthcare Campaigns"
        title="Community drives &amp; awareness programs"
        description="Stay informed about screenings, donation drives, and vaccination campaigns near you."
      />

      <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
    </>
  )
}
