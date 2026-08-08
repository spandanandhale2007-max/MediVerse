import { useState } from 'react'
import { Pill, Check, Plus, X, Pencil, AlertTriangle, HeartPulse, Activity } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import HealthProfileForm from '../components/HealthProfileForm'
import CarePlan from '../components/CarePlan'
import { useHealthProfile } from '../hooks/useHealthProfile'
import { useMedications } from '../hooks/useMedications'
import { useAuth } from '../context/AuthContext'

function bmiOf(weight, height) {
  const w = Number(weight)
  const h = Number(height) / 100
  if (!w || !h) return null
  const value = w / (h * h)
  if (!isFinite(value)) return null
  const rounded = value.toFixed(1)
  if (value < 18.5) return { value: rounded, label: 'Underweight', variant: 'warning' }
  if (value < 25) return { value: rounded, label: 'Healthy range', variant: 'good' }
  if (value < 30) return { value: rounded, label: 'Overweight', variant: 'warning' }
  return { value: rounded, label: 'Obese', variant: 'serious' }
}

export default function Medications() {
  const { auth, profile } = useAuth()
  // Scoped to the signed-in number — clinical data must never leak between
  // accounts sharing a device.
  const { healthProfile, hasHealthProfile, saveHealthProfile } = useHealthProfile(auth?.phone)
  const [editingProfile, setEditingProfile] = useState(false)

  const [meds, setMeds] = useMedications(auth?.phone)
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState({ name: '', schedule: '', remaining: 10 })

  function toggleTaken(id) {
    setMeds((list) => list.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m)))
  }

  function removeMed(id) {
    setMeds((list) => list.filter((m) => m.id !== id))
  }

  function addMed(e) {
    e.preventDefault()
    if (!draft.name.trim() || !draft.schedule.trim()) return
    setMeds((list) => [
      { id: `m-${Date.now()}`, name: draft.name.trim(), schedule: draft.schedule.trim(), remaining: Number(draft.remaining) || 0, taken: false },
      ...list,
    ])
    setDraft({ name: '', schedule: '', remaining: 10 })
    setShowForm(false)
  }

  // First visit (or an explicit edit) → collect the health history before
  // showing the tracker, so reminders and interaction flags have context.
  if (!hasHealthProfile || editingProfile) {
    return (
      <>
        <PageHeader
          eyebrow="Medication Tracking"
          title={hasHealthProfile ? 'Update your health profile' : 'First, a bit about your health'}
          description="A few questions about your history so we can track your medication safely."
        />
        <HealthProfileForm
          initial={healthProfile}
          defaultAge={profile?.age}
          onCancel={hasHealthProfile ? () => setEditingProfile(false) : undefined}
          onSave={(data) => {
            saveHealthProfile(data)
            setEditingProfile(false)
          }}
        />
      </>
    )
  }

  const bmi = bmiOf(healthProfile.weight, healthProfile.height)
  const allAllergies = [...(healthProfile.drugAllergies ?? []), ...(healthProfile.otherAllergies ?? [])]

  return (
    <>
      <PageHeader
        eyebrow="Medication Tracking"
        title="Stay on top of every dose"
        description="Track schedules, mark doses as taken, and keep an eye on refill counts."
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {/* Health profile summary */}
        <div className="card mb-6 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <HeartPulse size={16} style={{ color: 'var(--brand)' }} /> Your health profile
            </h2>
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
            >
              <Pencil size={12} /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Age" value={healthProfile.age || '—'} />
            <Stat label="Weight" value={healthProfile.weight ? `${healthProfile.weight} kg` : '—'} />
            <Stat label="Height" value={healthProfile.height ? `${healthProfile.height} cm` : '—'} />
            <Stat label="Blood group" value={healthProfile.bloodGroup || '—'} />
          </div>

          {bmi && (
            <div className="mt-4 flex items-center gap-2 border-t pt-4" style={{ borderColor: 'var(--gridline)' }}>
              <Activity size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                BMI <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{bmi.value}</strong>
              </span>
              <Badge variant={bmi.variant}>{bmi.label}</Badge>
            </div>
          )}

          {allAllergies.length > 0 && (
            <div
              className="mt-4 flex items-start gap-2.5 rounded-lg px-3 py-2.5"
              style={{ background: 'color-mix(in srgb, var(--status-critical) 10%, transparent)' }}
            >
              <AlertTriangle size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--status-critical)' }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--status-critical)' }}>
                  Allergies on file
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {allAllergies.join(', ')}
                </p>
              </div>
            </div>
          )}

          {(healthProfile.conditions?.length > 0 || healthProfile.medications?.length > 0) && (
            <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: 'var(--gridline)' }}>
              {healthProfile.conditions?.length > 0 && (
                <SummaryRow label="Conditions" items={healthProfile.conditions} />
              )}
              {healthProfile.medications?.length > 0 && (
                <SummaryRow label="Long-term medication" items={healthProfile.medications} />
              )}
            </div>
          )}
        </div>

        <CarePlan healthProfile={healthProfile} />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Current medications
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            {showForm ? <X size={14} /> : <Plus size={14} />}
            {showForm ? 'Close' : 'Add medication'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addMed} className="card mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1fr_1fr_100px_auto] sm:items-end">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Name &amp; dosage
              </label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Ibuprofen 200mg"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Schedule
              </label>
              <input
                value={draft.schedule}
                onChange={(e) => setDraft((d) => ({ ...d, schedule: e.target.value }))}
                placeholder="e.g. 8:00 AM, 8:00 PM"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Doses left
              </label>
              <input
                type="number"
                min="0"
                value={draft.remaining}
                onChange={(e) => setDraft((d) => ({ ...d, remaining: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg py-2 text-sm font-semibold"
              style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
            >
              Save
            </button>
          </form>
        )}

        <div className="space-y-3">
          {meds.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No medications tracked yet.
            </p>
          )}
          {meds.map((m) => (
            <div key={m.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                >
                  <Pill size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {m.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {m.schedule} &middot; {m.remaining} doses left
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.taken ? 'good' : 'neutral'}>{m.taken ? 'Taken today' : 'Pending'}</Badge>
                <button
                  type="button"
                  onClick={() => toggleTaken(m.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: m.taken ? 'color-mix(in srgb, var(--status-good) 16%, transparent)' : 'var(--surface-2)',
                    color: m.taken ? 'var(--status-good)' : 'var(--text-muted)',
                    border: '1px solid var(--border)',
                  }}
                  aria-label={m.taken ? 'Mark as not taken' : 'Mark as taken'}
                >
                  <Check size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => removeMed(m.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                  aria-label="Remove medication"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  )
}

function SummaryRow({ label, items }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {items.join(', ')}
      </span>
    </div>
  )
}
