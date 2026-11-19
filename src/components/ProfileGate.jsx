import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, UserRound, Phone } from 'lucide-react'
import BrandGlyph from './BrandGlyph'
import { useAuth } from '../context/AuthContext'

export default function ProfileGate() {
  const { saveProfile } = useAuth()
  const navigate = useNavigate()
  // Phone is required (not optional): ambulance dispatch needs a callback number.
  const [form, setForm] = useState({ name: '', age: '', location: '', phone: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Enter your name.')
      return
    }
    const age = Number(form.age)
    if (!age || age < 1 || age > 120) {
      setError('Enter a valid age.')
      return
    }
    if (!form.location.trim()) {
      setError('Enter where you stay — this helps us show hospitals near you.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Enter a valid 10-digit mobile number — an ambulance crew needs a way to call you back.')
      return
    }
    setError('')
    // Land on the home page, not whatever URL happened to be open.
    navigate('/', { replace: true })
    saveProfile({
      name: form.name.trim(),
      age,
      location: form.location.trim(),
      phone: `+91${form.phone}`,
    })
  }

  return (
    <div
      className="flex min-h-full items-center justify-center px-4 py-10"
      style={{ background: 'var(--body-bg)', backgroundAttachment: 'fixed' }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            <BrandGlyph size={24} />
          </span>
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            MediVerse
          </span>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit}>
            <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Set up your profile
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Just a few details so we can show you hospitals and doctors near you.
            </p>

            <label className="mb-1 mt-5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Your name
            </label>
            <div
              className="flex items-center overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
            >
              <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                <UserRound size={16} />
              </span>
              <input
                autoFocus
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <label className="mb-1 mt-4 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Age
            </label>
            <input
              name="age"
              inputMode="numeric"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
              placeholder="e.g. 29"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />

            <label className="mb-1 mt-4 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Where do you stay?
            </label>
            <div
              className="flex items-center overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
            >
              <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={16} />
              </span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Andheri, Mumbai"
                className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <label className="mb-1 mt-4 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Mobile number
            </label>
            <div
              className="flex items-center overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
            >
              <span
                className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium"
                style={{ color: 'var(--text-secondary)', borderRight: '1px solid var(--border)' }}
              >
                <Phone size={14} /> +91
              </span>
              <input
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="98765 43210"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Used only so an ambulance crew or the hospital can call you back.
            </p>

            {error && (
              <p className="mt-3 text-xs" style={{ color: 'var(--status-critical)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
            >
              Continue to MediVerse
            </button>

            <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              You can update these anytime from your profile.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
