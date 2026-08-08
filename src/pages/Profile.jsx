import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, MapPin, Phone, UserRound, Check, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { auth, profile, saveProfile, logout, forgetProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    age: profile?.age ?? '',
    location: profile?.location ?? '',
  })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setSaved(false)
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
      setError('Enter where you stay.')
      return
    }
    setError('')
    saveProfile({ name: form.name.trim(), age, location: form.location.trim() })
    setSaved(true)
    setTimeout(() => navigate('/'), 600)
  }

  return (
    <>
      <PageHeader
        eyebrow="Your Profile"
        title="Keep your details up to date"
        description="We use your location to show hospitals and doctors closer to you first."
      />

      <div className="mx-auto max-w-lg px-4 pb-20 sm:px-6">
        <form onSubmit={handleSubmit} className="card space-y-4 p-5 sm:p-6">
          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Name
            </label>
            <div
              className="flex items-center overflow-hidden rounded-lg"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
            >
              <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                <UserRound size={16} />
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Age
            </label>
            <input
              name="age"
              inputMode="numeric"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
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
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Mobile number
            </label>
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              <Phone size={15} /> {auth?.phone}
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: 'var(--status-critical)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              'Save changes'
            )}
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold"
            style={{ color: 'var(--status-critical)', border: '1px solid var(--border)' }}
          >
            <LogOut size={15} /> Log out
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
            Logging out keeps these details, so signing in with {auth?.phone ?? 'this number'} again skips the setup
            form.
          </p>

          {/* Shared-phone escape hatch: wipe this number's saved details. */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Erase your saved name, age and location from this device? You will be asked for them again next time.')) {
                forgetProfile()
                logout()
              }
            }}
            className="flex w-full items-center justify-center gap-2 text-xs font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            <Trash2 size={13} /> Forget my details on this device
          </button>
        </form>
      </div>
    </>
  )
}
