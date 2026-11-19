import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Star, Clock, MapPin, Building2, Languages, IndianRupee, GraduationCap, CalendarCheck, Globe } from 'lucide-react'
import Badge from './Badge'

const STATUS_MAP = {
  available: { variant: 'good', label: 'Available' },
  'in-surgery': { variant: 'warning', label: 'In surgery' },
  'off-duty': { variant: 'neutral', label: 'Off duty' },
}

export default function DoctorProfileModal({ doctor, onClose }) {
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    // Remember what had focus so we can restore it when the dialog closes.
    returnFocusRef.current = document.activeElement

    function handleKey(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Keep Tab focus inside the dialog while it's open.
      if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(
          panelRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null)
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    // Move focus into the dialog (its close button) on open.
    const t = setTimeout(() => panelRef.current?.querySelector('button')?.focus(), 0)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      clearTimeout(t)
      returnFocusRef.current?.focus?.()
    }
  }, [onClose])

  if (!doctor) return null
  const s = STATUS_MAP[doctor.status]
  const initials = doctor.name.split(' ').slice(-2).map((p) => p[0]).join('')

  function bookNow() {
    onClose()
    navigate(`/appointments?doctor=${doctor.id}`)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(10, 15, 15, 0.5)' }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="card relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-2xl"
        style={{ boxShadow: '0 24px 60px -20px rgba(0,0,0,0.5)' }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
            style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="doctor-modal-title" className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {doctor.name}
              </h2>
              {doctor.featured && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ color: '#c2447a', background: 'color-mix(in srgb, #c2447a 14%, transparent)' }}
                >
                  Featured
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {doctor.specialty} &middot; {doctor.experience} yrs experience
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                <Star size={12} fill="currentColor" stroke="none" style={{ color: 'var(--status-warning)' }} />
                {doctor.rating}
              </span>
              <Badge variant={s.variant} showIcon={false}>
                {s.label}
              </Badge>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {doctor.bio}
        </p>

        <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={GraduationCap} label="Qualifications" value={doctor.qualifications} />
          <InfoRow icon={Building2} label="Hospital" value={doctor.hospital} />
          <InfoRow
            icon={doctor.availableNationwide ? Globe : MapPin}
            label="Location"
            value={doctor.availableNationwide ? `${doctor.state} · available nationwide` : doctor.state}
          />
          <InfoRow icon={Languages} label="Languages" value={doctor.languages?.join(', ')} />
          <InfoRow icon={IndianRupee} label="Consultation fee" value={`₹${doctor.fee}`} />
          <InfoRow icon={Clock} label="Next slot" value={doctor.nextSlot} />
        </dl>

        <button
          type="button"
          onClick={bookNow}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
        >
          <CalendarCheck size={16} /> Book appointment with {doctor.name}
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
      >
        <Icon size={13} />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </dt>
        <dd className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {value}
        </dd>
      </div>
    </div>
  )
}
