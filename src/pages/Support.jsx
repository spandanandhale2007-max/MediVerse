import { useState } from 'react'
import { LifeBuoy, Mail, Send, CheckCircle2, AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { recordReport } from '../lib/reports'

const ADMIN_EMAIL = 'mediversehelp@gmail.com'
const MAILTO_HREF = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('MediVerse Support Request')}`

const categories = [
  'Technical issue / bug',
  'Appointment problem',
  'Doctor or bed information',
  'Medication or vaccination records',
  'Account issue',
  'Other',
]

function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
}

export default function Support() {
  const { auth, profile } = useAuth()
  const submittedBy = auth?.phone ? { phone: auth.phone, name: profile?.name ?? null } : null
  const [form, setForm] = useState({ name: '', email: '', category: categories[0], subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [copied, setCopied] = useState(false)

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(ADMIN_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (rare, e.g. very old browsers) — the
      // email is already visible as plain text right next to the button.
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    if (import.meta.env.DEV) {
      // Netlify Forms only has a real endpoint on Netlify's own servers —
      // there's nothing on the Vite dev server to receive this POST, so a
      // real fetch here would always fail. Simulate the round trip instead
      // of showing a false "couldn't send" error during local review.
      await new Promise((r) => setTimeout(r, 500))
      recordReport('support', form, { delivered: false, submittedBy })
      setStatus('preview')
      setForm({ name: '', email: '', category: categories[0], subject: '', message: '' })
      return
    }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'support', ...form }),
      })
      if (!res.ok) throw new Error('Network response was not ok')
      recordReport('support', form, { delivered: true, submittedBy })
      setStatus('sent')
      setForm({ name: '', email: '', category: categories[0], subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer Support"
        title="Something not working? Tell us."
        description="Every report here is routed straight to our support inbox so a real person can follow up."
      />

      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_260px]">
        {status === 'sent' || status === 'preview' ? (
          <div className="card flex flex-col items-center gap-3 p-8 text-center">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background:
                  status === 'preview'
                    ? 'var(--brand-soft-2)'
                    : 'color-mix(in srgb, var(--status-good) 16%, transparent)',
                color: status === 'preview' ? 'var(--brand)' : 'var(--status-good)',
              }}
            >
              <CheckCircle2 size={24} />
            </span>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {status === 'preview' ? 'Form works — local preview only' : 'Report received'}
            </h2>
            <p className="max-w-sm text-sm" style={{ color: 'var(--text-secondary)' }}>
              {status === 'preview'
                ? `This is running on localhost, so nothing was actually emailed. Once deployed, this exact submission will land in ${ADMIN_EMAIL}.`
                : `Thanks — your message has been sent to our support team at ${ADMIN_EMAIL}. We'll get back to you by email.`}
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
            >
              Send another report
            </button>
          </div>
        ) : (
          <form
            name="support"
            onSubmit={handleSubmit}
            className="card space-y-4 p-5 sm:p-6"
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            {/* Netlify form-detection fields (harmless outside Netlify) */}
            <input type="hidden" name="form-name" value="support" />
            <p className="hidden">
              <label>
                Don't fill this out: <input name="bot-field" onChange={() => {}} />
              </label>
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Your name
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Email address
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                What's this about?
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Subject
              </label>
              <input
                required
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Short summary of the issue"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Details
              </label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="What happened, what you expected, and any steps to reproduce it..."
                className="w-full resize-none rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />
            </div>

            {status === 'error' && (
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
                style={{ color: 'var(--status-critical)', background: 'color-mix(in srgb, var(--status-critical) 12%, transparent)' }}
              >
                <AlertTriangle size={16} /> Couldn't send that just now — please try again in a moment.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
            >
              <Send size={16} /> {status === 'sending' ? 'Sending...' : 'Submit report'}
            </button>
          </form>
        )}

        <aside className="card h-fit space-y-4 p-5">
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
            >
              <LifeBuoy size={16} />
            </span>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Prefer email?
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Every issue reported on this page is sent straight to our admin inbox. You can also reach us directly:
          </p>
          <a href={MAILTO_HREF} className="mail-cta group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium">
            <span className="flex items-center gap-2 truncate">
              <Mail size={15} /> {ADMIN_EMAIL}
            </span>
            <ExternalLink size={13} className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors"
            style={{
              color: copied ? 'var(--status-good)' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied to clipboard' : 'Copy email address instead'}
          </button>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            The button above opens your default email app with {ADMIN_EMAIL} already filled in — if nothing happens
            (no default mail app set, or you're viewing this in an embedded preview), copy the address instead.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            For medical emergencies, do not use this form — contact your hospital's emergency line directly.
          </p>
        </aside>
      </div>
    </>
  )
}
