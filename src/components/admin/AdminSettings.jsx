import { ShieldAlert, RotateCcw, KeyRound, Server, Download } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDirectory } from '../../context/AdminContext'

export default function AdminSettings() {
  const { auth } = useAuth()
  const d = useDirectory()

  function exportOverrides() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            hiddenHospitals: d.hiddenHospitals,
            hospitalEdits: d.hospitalEdits,
            hiddenDoctors: d.hiddenDoctors,
            doctorEdits: d.doctorEdits,
            log: d.log,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mediverse-admin-overrides-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* This is the most important panel in the console. Do not soften it. */}
      <section className="card overflow-hidden p-0">
        <div
          className="flex items-start gap-2.5 px-5 py-4"
          style={{ background: 'color-mix(in srgb, var(--status-critical) 12%, transparent)', color: 'var(--status-critical)' }}
        >
          <ShieldAlert size={17} className="mt-0.5 shrink-0" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-semibold">This console is not access-controlled</p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Your password is checked in the browser against a value bundled into the JavaScript. Anyone who opens
              devtools on the deployed site can read it, and anyone who sets one localStorage key can reach this page
              without a password at all. It keeps honest people out of the wrong screen — nothing more.
            </p>
          </div>
        </div>
        <div className="space-y-3 px-5 py-4">
          <Row
            icon={KeyRound}
            title="Where the password lives"
            body={
              <>
                In <code>.env.local</code>, which is gitignored so it stays out of the repo. Vite still inlines it into
                the built bundle. Change it there and restart the dev server.
              </>
            }
          />
          <Row
            icon={Server}
            title="What real protection needs"
            body="A backend that verifies the password server-side and issues a session token, with the admin check happening on the server for every request. Until then, don't put anything genuinely sensitive behind this screen."
          />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Signed-in account
        </h2>
        <dl className="mt-3 space-y-1.5 text-xs">
          <div className="flex justify-between gap-3">
            <dt style={{ color: 'var(--text-muted)' }}>Email</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{auth?.userId}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt style={{ color: 'var(--text-muted)' }}>Role</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{auth?.role}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt style={{ color: 'var(--text-muted)' }}>Session started</dt>
            <dd style={{ color: 'var(--text-primary)' }}>{auth?.verifiedAt ? new Date(auth.verifiedAt).toLocaleString() : '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Your changes to the directory
        </h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {d.pendingCount === 0
            ? 'Nothing overridden — the site is showing the shipped data exactly as it is.'
            : `${d.pendingCount} override${d.pendingCount === 1 ? '' : 's'} active. Export them if you want them folded into the data files.`}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportOverrides}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold"
            style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
          >
            <Download size={13} /> Export as JSON
          </button>

          {d.pendingCount > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Discard every hide and edit you have made?\n\nThe directory returns to the shipped data. This cannot be undone.'))
                  d.resetAll(auth?.userId ?? 'admin')
              }}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold"
              style={{ color: 'var(--status-critical)', border: '1px solid var(--border)' }}
            >
              <RotateCcw size={13} /> Discard all changes
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

function Row({ icon: Icon, title, body }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
      <div>
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {body}
        </p>
      </div>
    </div>
  )
}
