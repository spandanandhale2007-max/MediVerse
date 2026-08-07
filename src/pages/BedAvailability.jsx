import PageHeader from '../components/PageHeader'
import StatMeter from '../components/StatMeter'
import { bedStats } from '../data/mock'

export default function BedAvailability() {
  const totalBeds = bedStats.reduce((a, b) => a + b.total, 0)
  const totalOccupied = bedStats.reduce((a, b) => a + b.occupied, 0)
  const overallPct = Math.round((totalOccupied / totalBeds) * 100)

  return (
    <>
      <PageHeader
        eyebrow="Bed Availability"
        title="Real-time capacity across every ward"
        description="Updated occupancy so patients and staff know where space is open before a transfer or admission."
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Hospital-wide occupancy
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {overallPct}%
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Total beds
              </p>
              <p className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {totalBeds}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Occupied
              </p>
              <p className="font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {totalOccupied}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Free
              </p>
              <p className="font-semibold tabular-nums" style={{ color: 'var(--status-good)' }}>
                {totalBeds - totalOccupied}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bedStats.map((b) => (
            <StatMeter key={b.id} label={b.label} occupied={b.occupied} total={b.total} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <LegendDot color="var(--status-good)" label="Available (< 60%)" />
          <LegendDot color="var(--status-warning)" label="Moderate (60–79%)" />
          <LegendDot color="var(--status-serious)" label="High (80–94%)" />
          <LegendDot color="var(--status-critical)" label="Critical (95%+)" />
        </div>
      </div>
    </>
  )
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
