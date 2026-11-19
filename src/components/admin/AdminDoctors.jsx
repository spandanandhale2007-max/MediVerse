import { useMemo, useState } from 'react'
import { Search, EyeOff, Eye, PencilLine, Undo2, AlertTriangle } from 'lucide-react'
import Badge from '../Badge'
import { EditForm } from './AdminHospitals'
import { useAuth } from '../../context/AuthContext'
import { useDirectory } from '../../context/AdminContext'
import { departments, states } from '../../data/mock'

const EDITABLE = [
  { key: 'name', label: 'Name' },
  { key: 'specialty', label: 'Specialty' },
  { key: 'state', label: 'State' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'experience', label: 'Years of experience' },
  { key: 'fee', label: 'Consultation fee (₹)' },
  { key: 'nextSlot', label: 'Next slot' },
  { key: 'bio', label: 'Bio' },
]

export default function AdminDoctors() {
  const { auth } = useAuth()
  const d = useDirectory()
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState('All')
  const [state, setState] = useState('All')
  const [view, setView] = useState('live')
  const [editing, setEditing] = useState(null)

  const actor = auth?.userId ?? 'admin'

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return d.allDoctors.filter((doc) => {
      const hidden = d.hiddenDoctors.includes(doc.id)
      if (view === 'live' && hidden) return false
      if (view === 'hidden' && !hidden) return false
      if (view === 'edited' && !d.doctorEdits[doc.id]) return false
      if (dept !== 'All' && doc.specialty !== dept) return false
      if (state !== 'All' && doc.state !== state) return false
      if (!q) return true
      return doc.name.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q) || doc.id.toLowerCase() === q
    })
  }, [d, query, dept, state, view])

  return (
    <div className="space-y-4">
      <p
        className="flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: 'var(--warn-fg)' }}
      >
        <AlertTriangle size={14} className="mt-0.5 shrink-0" strokeWidth={2.5} />
        <span>
          <strong>This roster is sample data.</strong> These are illustrative profiles, not real practitioners — editing
          one changes a demo record, not anybody's real listing. Real doctors are only ever linked out to their own
          hospital's directory.
        </span>
      </p>

      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, specialty or id..."
            className="w-full rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
            style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
          />
        </div>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none sm:w-44"
          style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        >
          <option value="All">All departments</option>
          {departments.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm outline-none sm:w-40"
          style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
        >
          <option value="All">All states</option>
          {states.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tab active={view === 'live'} onClick={() => setView('live')} label={`Live (${d.doctors.length})`} />
        <Tab active={view === 'hidden'} onClick={() => setView('hidden')} label={`Hidden (${d.hiddenDoctors.length})`} />
        <Tab active={view === 'edited'} onClick={() => setView('edited')} label={`Edited (${Object.keys(d.doctorEdits).length})`} />
        <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
          {rows.length} shown
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Nothing matches those filters.
        </p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((doc) => {
            const hidden = d.hiddenDoctors.includes(doc.id)
            const edited = !!d.doctorEdits[doc.id]
            return (
              <div key={doc.id} className="card p-4" style={hidden ? { opacity: 0.62 } : undefined}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {doc.name}
                      </span>
                      <code className="rounded px-1.5 py-0.5 text-[10px]" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                        {doc.id}
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
                      {doc.specialty} · {doc.state} · {doc.experience} yrs · ₹{doc.fee}
                    </p>
                    <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                      {doc.qualifications} — {doc.hospital}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-1.5">
                    <RowBtn onClick={() => setEditing(editing === doc.id ? null : doc.id)} icon={PencilLine} label="Edit" />
                    {edited && <RowBtn onClick={() => d.revertDoctor(doc, actor)} icon={Undo2} label="Revert" />}
                    {hidden ? (
                      <RowBtn onClick={() => d.restoreDoctor(doc, actor)} icon={Eye} label="Restore" tone="var(--status-good)" />
                    ) : (
                      <RowBtn
                        onClick={() => {
                          if (window.confirm(`Hide ${doc.name} from the public site?\n\nThey stop appearing in the doctor directory, specialists search and appointment booking. Restorable from the Hidden tab.`))
                            d.hideDoctor(doc, actor)
                        }}
                        icon={EyeOff}
                        label="Hide"
                        tone="var(--status-critical)"
                      />
                    )}
                  </div>
                </div>

                {editing === doc.id && (
                  <EditForm
                    record={doc}
                    fields={EDITABLE}
                    onCancel={() => setEditing(null)}
                    onSave={(patch) => {
                      d.editDoctor(doc, { ...patch, experience: Number(patch.experience) || doc.experience, fee: Number(patch.fee) || doc.fee }, actor)
                      setEditing(null)
                    }}
                  />
                )}
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
