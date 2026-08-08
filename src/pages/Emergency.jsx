import { useState } from 'react'
import { Siren, Phone, MapPin, CheckCircle2, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { recordReport } from '../lib/reports'

const NATIONAL_AMBULANCE_NUMBER = '108'

function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
}

export default function Emergency() {
  const { auth, profile } = useAuth()
  const submittedBy = auth?.phone ? { phone: auth.phone, name: profile?.name ?? null } : null
  const [area, setArea] = useState(profile?.location ?? '')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | preview | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!area.trim()) return
    setStatus('sending')

    const payload = {
      'form-name': 'emergency',
      phone: auth?.phone ?? '',
      name: profile?.name ?? '',
      area,
      details,
    }

    if (import.meta.env.DEV) {
      await new Promise((r) => setTimeout(r, 600))
      recordReport('emergency', payload, { delivered: false, submittedBy })
      setStatus('preview')
      return
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      recordReport('emergency', payload, { delivered: true, submittedBy })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Emergency Care"
        title="Request an ambulance to your area"
        description="We'll dispatch based on where you are — not a bed count. For life-threatening emergencies, call directly instead of waiting on a form."
      />

      <div className="mx-auto max-w-lg px-4 pb-20 sm:px-6">
        <a
          href={`tel:${NATIONAL_AMBULANCE_NUMBER}`}
          className="mb-5 flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-white"
          style={{ background: 'var(--status-critical)' }}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Phone size={18} />
            </span>
            <span>
              <span className="block text-xs font-medium text-white/80">Life-threatening? Call now</span>
              <span className="block text-lg font-semibold">Dial {NATIONAL_AMBULANCE_NUMBER}</span>
            </span>
          </span>
          <Siren size={22} />
        </a>

        {status === 'sent' || status === 'preview' ? (
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background:
                  status === 'preview' ? 'var(--brand-soft-2)' : 'color-mix(in srgb, var(--status-good) 16%, transparent)',
                color: status === 'preview' ? 'var(--brand)' : 'var(--status-good)',
              }}
            >
              <CheckCircle2 size={24} />
            </span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {status === 'preview' ? 'Request works — local preview only' : 'Ambulance requested'}
            </h2>
            <p className="max-w-sm text-sm" style={{ color: 'var(--text-secondary)' }}>
              {status === 'preview'
                ? 'This is running on localhost, so nothing was actually dispatched. Once deployed, this request routes straight to our admin team.'
                : `Your request for ${area} has been sent to our emergency team. Stay on this number — we'll call you back to confirm.`}
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
            >
              Request another
            </button>
          </div>
        ) : (
          <form
            name="emergency"
            onSubmit={handleSubmit}
            className="card space-y-4 p-5 sm:p-6"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value="emergency" />
            <p className="hidden">
              <label>
                Don't fill this out: <input name="bot-field" onChange={() => {}} />
              </label>
            </p>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Your area
              </label>
              <div
                className="flex items-center overflow-hidden rounded-lg"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
              >
                <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                  <MapPin size={16} />
                </span>
                <input
                  required
                  name="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Andheri, Mumbai"
                  className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>
              {profile?.location && area === profile.location && (
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Pulled from your profile — edit it if you're somewhere else right now.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                What's happening? (optional)
              </label>
              <textarea
                name="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Briefly describe the situation so responders know what to expect"
                className="w-full resize-none rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>

            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
              style={{ color: 'var(--text-muted)', background: 'var(--surface-1)' }}
            >
              <Phone size={13} className="shrink-0" /> We'll call you back on {auth?.phone ?? 'your registered number'}.
            </div>

            {status === 'error' && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ color: 'var(--status-critical)', background: 'color-mix(in srgb, var(--status-critical) 12%, transparent)' }}
              >
                <AlertTriangle size={16} /> Couldn't send that just now — please call {NATIONAL_AMBULANCE_NUMBER} directly instead.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--status-critical)' }}
            >
              <Siren size={16} /> {status === 'sending' ? 'Requesting...' : 'Request ambulance'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}
