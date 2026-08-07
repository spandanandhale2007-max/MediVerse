import { Syringe, CalendarClock } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { vaccinations } from '../data/mock'

const STATUS_MAP = {
  overdue: { variant: 'critical', label: 'Overdue' },
  'due-soon': { variant: 'warning', label: 'Due soon' },
  scheduled: { variant: 'good', label: 'Scheduled' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Vaccinations() {
  const sorted = [...vaccinations].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  return (
    <>
      <PageHeader
        eyebrow="Vaccination Alerts"
        title="Never miss a due date"
        description="A running list of doses that are overdue, due soon, or already scheduled."
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="space-y-3">
          {sorted.map((v) => {
            const s = STATUS_MAP[v.status]
            return (
              <div key={v.id} className="card flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                  >
                    <Syringe size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {v.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <CalendarClock size={12} /> Due {formatDate(v.dueDate)}
                    </p>
                  </div>
                </div>
                <Badge variant={s.variant}>{s.label}</Badge>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
