import { useState } from 'react'
import { Pill, Check, Plus, X } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { initialMedications } from '../data/mock'

export default function Medications() {
  const [meds, setMeds] = useState(initialMedications)
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

  return (
    <>
      <PageHeader
        eyebrow="Medication Tracking"
        title="Stay on top of every dose"
        description="Track schedules, mark doses as taken, and keep an eye on refill counts."
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Current medications
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
            style={{ background: 'var(--brand)' }}
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
              className="rounded-lg py-2 text-sm font-semibold text-white"
              style={{ background: 'var(--brand)' }}
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
