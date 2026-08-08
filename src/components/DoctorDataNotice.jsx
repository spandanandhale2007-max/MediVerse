import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react'

// The MediVerse doctor roster in src/data/mock.js is invented sample data —
// nobody in it is a real practitioner. That is fine for a demo, but the app
// presents ratings, fees and appointment slots, which read exactly like real
// listings. So say so plainly wherever those doctors are shown, and point
// users at the one place that holds genuine, verifiable credentials: the
// National Medical Commission's Indian Medical Register.
export const IMR_URL = 'https://www.nmc.org.in/information-desk/indian-medical-register/'

export default function DoctorDataNotice({ className = '' }) {
  return (
    <div className={`card overflow-hidden p-0 ${className}`}>
      <div
        className="flex items-start gap-2.5 px-4 py-3 text-xs"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: '#9a6a00' }}
      >
        <AlertTriangle size={15} className="mt-0.5 shrink-0" strokeWidth={2.5} />
        <p>
          <strong>Sample directory.</strong> The MediVerse doctors listed here are illustrative profiles used to
          demonstrate booking — they are not real practitioners, and their ratings, fees and slots are not real
          availability. Don't rely on them for care decisions.
        </p>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <ShieldCheck size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          To check a real doctor's registration, qualifications and medical council, search the government's Indian
          Medical Register — it's free and needs no login.
        </p>
        <a
          href={IMR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
          style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
        >
          Verify a doctor <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}
