import { useState } from 'react'
import { Syringe, CalendarClock, ChevronDown, Info, ExternalLink } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { vaccinations } from '../data/mock'
import { vaccinationSchedule } from '../data/vaccinationSchedule'

const STATUS_MAP = {
  overdue: { variant: 'critical', label: 'Overdue' },
  'due-soon': { variant: 'warning', label: 'Due soon' },
  scheduled: { variant: 'good', label: 'Scheduled' },
}

const TIER_MAP = {
  free: { variant: 'good', label: 'Free · Govt. programme' },
  recommended: { variant: 'neutral', label: 'Recommended' },
  situational: { variant: 'warning', label: 'Situational / travel' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Vaccinations() {
  const sorted = [...vaccinations].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  const [openStages, setOpenStages] = useState(() => new Set([vaccinationSchedule[0].stage]))

  function toggleStage(stage) {
    setOpenStages((prev) => {
      const next = new Set(prev)
      if (next.has(stage)) next.delete(stage)
      else next.add(stage)
      return next
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Vaccination Alerts"
        title="Never miss a due date"
        description="A running list of doses that are overdue, due soon, or already scheduled."
      />

      <div className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
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

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="mb-5 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            The full vaccination schedule, birth to older adulthood
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Every dose recommended for India, organised by age — from the government's free Universal Immunization
            Programme through adult and travel vaccines.
          </p>
        </div>

        <div
          className="mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Info size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <p>
            General reference information, not personalised medical advice — timing can shift based on individual
            health, catch-up needs, and updated guidance. Confirm your exact schedule with a paediatrician or doctor.
          </p>
        </div>

        <div className="space-y-2.5">
          {vaccinationSchedule.map((group) => {
            const isOpen = openStages.has(group.stage)
            return (
              <div key={group.stage} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleStage(group.stage)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                    >
                      <Syringe size={14} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {group.stage}
                      </span>
                      <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                        {group.doses.length} vaccine{group.doses.length > 1 ? 's' : ''}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t px-4 pb-4 pt-3 sm:px-5" style={{ borderColor: 'var(--border)' }}>
                    {group.doses.map((d) => {
                      const t = TIER_MAP[d.tier]
                      return (
                        <div key={d.vaccine} className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0" style={{ borderColor: 'var(--gridline)' }}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {d.vaccine}
                            </p>
                            <Badge variant={t.variant} showIcon={false}>
                              {t.label}
                            </Badge>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Protects against: {d.protects}
                          </p>
                          {d.note && (
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                              {d.note}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ExternalLink size={13} className="mt-0.5 shrink-0" />
          Compiled from the Government of India Universal Immunization Programme (Ministry of Health &amp; Family
          Welfare), Indian Academy of Pediatrics ACVIP recommendations, and FOGSI/IAP pregnancy immunization
          guidance.
        </p>
      </div>
    </>
  )
}
