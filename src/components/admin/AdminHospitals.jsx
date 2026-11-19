import { useMemo, useState } from 'react'
import { Search, EyeOff, Eye, PencilLine, Undo2, X, Check, AlertTriangle } from 'lucide-react'
import Badge from '../Badge'
import { useAuth } from '../../context/AuthContext'
import { useDirectory } from '../../context/AdminContext'
import { VERIFICATION_LABELS } from '../../data/hospitals'
import { indiaStateNames } from '../../data/india'

const EDITABLE = [
  { key: 'name', label: 'Name' },
  { key: 'area', label: 'Area' },
  { key: 'address', label: 'Address' },
  { key: 'phone', label: 'Phone' },
  { key: 'emergencyPhone', label: 'Emergency phone' },
  { key: 'email', label: 'Email' },
  { key: 'website', label: 'Website' },
  { key: 'doctorsUrl', label: 'Doctors page' },
  { key: 'note', label: 'Note' },
]

export default function AdminHospitals() {
  const { auth } = useAuth()
  const d = useDirectory()
  const [query, setQuery] = useState('')
  const [state, setState] = useState('All')
  const [view, setView] = useState('live') // live | hidden | edited
  const [editing, setEditing] = useState(null)

  const actor = auth?.userId ?? 'admin'

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return d.allHospitals.filter((h) => {
      const hidden = d.hiddenHospitals.includes(h.id)
      if (view === 'live' && hidden) return false
      if (view === 'hidden' && !hidden) return false
      if (view === 'edited' && !d.hospitalEdits[h.id]) return false
      if (state !== 'All' && h.state !== state) return false
      if (!q) return true
      return (
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.address.toLowerCase().includes(q) ||
        h.id.toLowerCase() === q
      )
    })
  }, [d, query, state, view])

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, city, address or id..."
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
          />
        </div>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none sm:w-44"
          style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        >
          <option value="All">All states</option>
          {indiaStateNames.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tab active={view === 'live'} onClick={() => setView('live')} label={`Live (${d.hospitals.length})`} />
        <Tab active={view === 'hidden'} onClick={() => setView('hidden')} label={`Hidden (${d.hiddenHospitals.length})`} />
        <Tab active={view === 'edited'} onClick={() => setView('edited')} label={`Edited (${Object.keys(d.hospitalEdits).length})`} />
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          {rows.length} shown
        </span>
      </div>

      {view === 'hidden' && d.hiddenHospitals.length > 0 && (
        <p
          className="flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Eye size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          Hidden hospitals are removed from search, the directory and the specialists page — but nothing is deleted.
          Restore any of them here at any time.
        </p>
      )}

      {rows.length === 0 ? (
        <p className="card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Nothing matches those filters.
        </p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((h) => {
            const hidden = d.hiddenHospitals.includes(h.id)
            const edited = !!d.hospitalEdits[h.id]
            const v = VERIFICATION_LABELS[h.verified]
            return (
              <div key={h.id} className="card p-4" style={hidden ? { opacity: 0.62 } : undefined}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {h.name}
                      </span>
                      <code className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        {h.id}
                      </code>
                      {edited && (
                        <Badge variant="warning" showIcon={false}>
                          Edited
                        </Badge>
                      )}
                      {hidden && (
                        <Badge variant="critical" showIcon={false}>
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                      {h.area ? `${h.area}, ` : ''}
                      {h.city}, {h.state} · {h.phone}
                    </p>
                    <div className="mt-1.5">
                      <Badge variant={v.variant} showIcon={false}>
                        {v.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    <RowBtn onClick={() => setEditing(editing === h.id ? null : h.id)} icon={PencilLine} label="Edit" />
                    {edited && <RowBtn onClick={() => d.revertHospital(h, actor)} icon={Undo2} label="Revert" />}
                    {hidden ? (
                      <RowBtn onClick={() => d.restoreHospital(h, actor)} icon={Eye} label="Restore" tone="var(--status-good)" />
                    ) : (
                      <RowBtn
                        onClick={() => {
                          if (window.confirm(`Hide "${h.name}" from the public directory?\n\nIt stops appearing everywhere on the site. You can restore it from the Hidden tab.`))
                            d.hideHospital(h, actor)
                        }}
                        icon={EyeOff}
                        label="Hide"
                        tone="var(--status-critical)"
                      />
                    )}
                  </div>
                </div>

                {editing === h.id && <EditForm record={h} fields={EDITABLE} onCancel={() => setEditing(null)} onSave={(patch) => { d.editHospital(h, patch, actor); setEditing(null) }} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Tab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{
        color: active ? 'var(--brand-on)' : 'var(--text-secondary)',
        background: active ? 'var(--brand)' : 'var(--surface-2)',
      }}
    >
      {label}
    </button>
  )
}

function RowBtn({ onClick, icon: Icon, label, tone }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium"
      style={{ color: tone ?? 'var(--text-secondary)', border: '1px solid var(--border)' }}
    >
      <Icon size={12} /> {label}
    </button>
  )
}

export function EditForm({ record, fields, onCancel, onSave }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map((f) => [f.key, record[f.key] ?? ''])))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])))
      }}
      className="mt-4 border-t pt-4"
      style={{ borderColor: 'var(--border)' }}
    >
      <p
        className="mb-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: 'var(--warn-fg)' }}
      >
        <AlertTriangle size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
        Edits are stored in this browser only and override the shipped data file. Use Revert to drop them.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {f.label}
            </span>
            <input
              value={form[f.key]}
              onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold"
          style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
        >
          <Check size={13} /> Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium"
          style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </form>
  )
}
