import { Link } from 'react-router-dom'
import {
  Stethoscope,
  CalendarClock,
  Syringe,
  HeartPulse,
  AlertTriangle,
  Clock,
  Info,
  ArrowRight,
  Building2,
  Pill,
} from 'lucide-react'
import { conditionCarePlans, medicationGuidance, dosingIntervals } from '../data/carePlan'

export default function CarePlan({ healthProfile }) {
  const conditions = healthProfile.conditions ?? []
  const plans = conditions.map((c) => [c, conditionCarePlans[c]]).filter(([, plan]) => plan)

  const specialists = [...new Map(plans.map(([, p]) => [p.specialty, p.specialist])).entries()]
  const vaccines = [...new Set(plans.flatMap(([, p]) => p.vaccines ?? []))]
  const redFlags = [...new Set(plans.flatMap(([, p]) => p.redFlags ?? []))]
  const myMeds = (healthProfile.medications ?? []).filter((m) => medicationGuidance[m])

  const hasAnything = plans.length > 0 || myMeds.length > 0

  if (!hasAnything) {
    return (
      <div className="card mb-6 flex items-start gap-3 p-5">
        <Info size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No conditions or long-term medications on file, so there's nothing specific to flag yet. Add them via
          <strong style={{ color: 'var(--text-primary)' }}> Edit</strong> above and your care plan will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <HeartPulse size={17} style={{ color: 'var(--brand)' }} />
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Your care plan
        </h2>
      </div>

      {/* Disclaimer — kept up top, not buried at the bottom */}
      <div
        className="mb-5 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 14%, transparent)', color: 'var(--text-secondary)' }}
      >
        <AlertTriangle size={17} className="mt-0.5 shrink-0" style={{ color: 'var(--warn-fg)' }} />
        <p>
          <strong style={{ color: 'var(--text-primary)' }}>This does not prescribe medication.</strong> It won't tell
          you which drug to start or what dose to take — that depends on your kidney and liver function, lab results,
          and interactions, and only your doctor can judge that safely. What's below is published guidance on
          check-ups, specialists, and vaccines for your conditions.
        </p>
      </div>

      {/* Emergency red flags — kept near the top */}
      {redFlags.length > 0 && (
        <div
          className="mb-5 rounded-2xl p-4"
          style={{ background: 'color-mix(in srgb, var(--status-critical) 10%, transparent)' }}
        >
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--status-critical)' }}>
            <AlertTriangle size={15} /> Seek medical care immediately if you notice
          </h3>
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {redFlags.map((f) => (
              <li key={f} className="flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--status-critical)' }}>•</span> {f}
              </li>
            ))}
          </ul>
          <Link
            to="/emergency"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: 'var(--status-critical)' }}
          >
            Request an ambulance <ArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* Specialists to consult */}
      {specialists.length > 0 && (
        <Section icon={Stethoscope} title="Doctors to consult">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {specialists.map(([specialty, specialist]) => (
              <Link
                key={specialty}
                to={`/doctors?q=${encodeURIComponent(specialty)}`}
                className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 transition-colors"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
              >
                <span>
                  <span className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {specialist}
                  </span>
                  <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                    {specialty} department
                  </span>
                </span>
                <ArrowRight size={14} style={{ color: 'var(--brand)' }} />
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/specialists"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
              style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
            >
              <Stethoscope size={12} /> Find top specialists by state
            </Link>
            <Link
              to="/hospitals"
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              <Building2 size={12} /> Hospitals near you
            </Link>
          </div>
        </Section>
      )}

      {/* Per-condition monitoring */}
      {plans.map(([condition, plan]) => (
        <Section key={condition} icon={CalendarClock} title={condition}>
          <p className="mb-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {plan.summary}
          </p>

          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            When to get checked
          </p>
          <ul className="mb-3 space-y-1.5">
            {plan.monitoring.map((m) => (
              <li key={m.what} className="flex flex-wrap items-baseline gap-x-1.5 text-xs">
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {m.what}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>— {m.when}</span>
              </li>
            ))}
          </ul>

          {plan.lifestyle?.length > 0 && (
            <>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Day to day
              </p>
              <div className="flex flex-wrap gap-1.5">
                {plan.lifestyle.map((l) => (
                  <span
                    key={l}
                    className="rounded-full px-2.5 py-1 text-xs"
                    style={{ background: 'var(--surface-1)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    {l}
                  </span>
                ))}
              </div>
            </>
          )}

          <Link
            to={`/doctors?q=${encodeURIComponent(plan.specialty)}`}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: 'var(--brand)' }}
          >
            Book a {plan.specialist.split(' / ')[0]} <ArrowRight size={12} />
          </Link>
        </Section>
      ))}

      {/* Vaccines */}
      {vaccines.length > 0 && (
        <Section icon={Syringe} title="Vaccinations recommended for your conditions">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {vaccines.map((v) => (
              <span
                key={v}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
              >
                {v}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            People with chronic conditions are at higher risk of complications from flu and pneumonia, which is why
            these are recommended more strongly than for the general population.
          </p>
          <Link
            to="/vaccinations"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
            style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
          >
            <Syringe size={12} /> See the full vaccination schedule
          </Link>
        </Section>
      )}

      {/* Guidance on medications they already take */}
      {myMeds.length > 0 && (
        <Section icon={Pill} title="How to take your current medications">
          <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            Timing and administration guidance for what you already take. Your <strong>dose</strong> comes from your
            prescription — this doesn't change it.
          </p>
          <div className="space-y-3">
            {myMeds.map((m) => {
              const g = medicationGuidance[m]
              return (
                <div key={m} className="border-b pb-3 last:border-b-0 last:pb-0" style={{ borderColor: 'var(--gridline)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {m}
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
                    <span>
                      <strong style={{ color: 'var(--text-primary)' }}>{g.timing}</strong> — {g.why}
                    </span>
                  </p>
                  {g.cautions?.map((c) => (
                    <p key={c} className="mt-1 flex items-start gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <AlertTriangle size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--status-warning)' }} /> {c}
                    </p>
                  ))}
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* Dosing interval reference */}
      <Section icon={Clock} title="Spacing your doses">
        <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          What the frequency on your prescription label means in practice.
        </p>
        <div className="space-y-2">
          {dosingIntervals.map((d) => (
            <div key={d.label} className="flex flex-wrap items-baseline gap-x-2 text-xs">
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {d.label}
              </span>
              <span style={{ color: 'var(--brand)' }}>{d.gap}</span>
              <span style={{ color: 'var(--text-muted)' }}>— {d.note}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card mb-3 p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        <Icon size={15} style={{ color: 'var(--brand)' }} /> {title}
      </h3>
      {children}
    </div>
  )
}
