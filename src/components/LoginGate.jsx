import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity,
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  UserRound,
  Stethoscope,
  ShieldHalf,
  AlertTriangle,
} from 'lucide-react'
import { requestOtp, confirmOtp } from '../lib/otp'
import { ROLE_LIST, demoAccountsFor, verifyStaffCredentials } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'

const COUNTRY_CODE = '+91'
const RESEND_SECONDS = 30
const OTP_LENGTH = 6

const ROLE_ICONS = { patient: UserRound, staff: Stethoscope, admin: ShieldHalf }

function isValidPhone(digits) {
  return /^[6-9]\d{9}$/.test(digits)
}

export default function LoginGate() {
  const { login, loginAs } = useAuth()
  // Signing in has to land you on your own home screen. Without this the
  // router keeps whatever URL was open before — so someone who was last on
  // /hospitals, or who followed a deep link, got dropped straight there
  // instead of the home page.
  const navigate = useNavigate()
  // role | phone | otp | credentials
  const [step, setStep] = useState('role')
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [creds, setCreds] = useState({ userId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const otpRefs = useRef([])

  const fullPhone = `${COUNTRY_CODE}${phone}`

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function chooseRole(r) {
    setRole(r)
    setError('')
    setStep(r.method === 'otp' ? 'phone' : 'credentials')
  }

  function backToRoles() {
    setStep('role')
    setRole(null)
    setError('')
    setCreds({ userId: '', password: '' })
  }

  async function sendOtp() {
    setError('')
    if (!isValidPhone(phone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    try {
      const result = await requestOtp(fullPhone)
      setDevCode(result.devCode ?? '')
      setStep('otp')
      setResendIn(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch {
      setError("Couldn't send the OTP right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handlePhoneSubmit(e) {
    e.preventDefault()
    sendOtp()
  }

  function handleOtpChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1)
    setOtp((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!text) return
    e.preventDefault()
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => text[i] ?? ''))
    otpRefs.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus()
  }

  async function handleVerify(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) {
      setError('Enter the full 6-digit code.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const ok = await confirmOtp(fullPhone, code)
      if (ok) {
        navigate('/', { replace: true })
        login(fullPhone)
      } else {
        setError('That code is incorrect or has expired. Try again.')
        setOtp(Array(OTP_LENGTH).fill(''))
        otpRefs.current[0]?.focus()
      }
    } catch {
      setError("Couldn't verify that just now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCredentials(e) {
    e.preventDefault()
    if (!creds.userId.trim() || !creds.password) {
      setError('Enter both fields to continue.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const result = await verifyStaffCredentials(role.id, creds.userId, creds.password)
      if (result.ok) {
        navigate(role.home, { replace: true })
        loginAs(result.user)
      } else setError("Those details don't match an account.")
    } finally {
      setLoading(false)
    }
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
            <Activity size={22} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            MediVerse
          </span>
        </div>

        <div className="card p-6">
          {/* ------------------------------------------------ role chooser */}
          {step === 'role' && (
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                How are you signing in?
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Each role sees a different part of MediVerse.
              </p>

              <div className="mt-5 space-y-2.5">
                {ROLE_LIST.map((r) => {
                  const Icon = ROLE_ICONS[r.id]
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => chooseRole(r)}
                      className="flex w-full items-center gap-3 rounded-xl p-3.5 text-left"
                      style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                      >
                        <Icon size={19} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {r.label}
                        </span>
                        <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>
                          {r.blurb}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------- patient: phone step */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit}>
              <BackLink onClick={backToRoles} label="Choose a different role" />
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Login to continue
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                We'll verify it's you with a one-time code on WhatsApp. If you've signed in before, we'll bring your
                details back automatically.
              </p>

              <label className="mb-1 mt-5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
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
                  {COUNTRY_CODE}
                </span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              {error && <FieldError>{error}</FieldError>}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                <MessageCircle size={16} /> {loading ? 'Sending code...' : 'Send OTP on WhatsApp'}
              </button>

              <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                By continuing, you agree to MediVerse's Terms of Use and Privacy Policy.
              </p>
            </form>
          )}

          {/* --------------------------------------------- patient: otp step */}
          {step === 'otp' && (
            <form onSubmit={handleVerify}>
              <BackLink
                onClick={() => {
                  setStep('phone')
                  setError('')
                }}
                label="Change number"
              />

              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Enter the code
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Sent via WhatsApp to <span style={{ color: 'var(--text-primary)' }}>{fullPhone}</span>
              </p>

              {import.meta.env.DEV && devCode && (
                <p
                  className="mt-3 rounded-lg px-3 py-2 text-xs"
                  style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                >
                  Dev preview only — no real WhatsApp message was sent. Your code is <strong>{devCode}</strong>.
                </p>
              )}

              <div className="mt-4 flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-12 w-full rounded-lg text-center text-lg font-semibold outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
                  />
                ))}
              </div>

              {error && <FieldError>{error}</FieldError>}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                <ShieldCheck size={16} /> {loading ? 'Verifying...' : 'Verify & continue'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {resendIn > 0 ? (
                  <span>Resend code in {resendIn}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loading}
                    className="flex items-center gap-1 font-medium"
                    style={{ color: 'var(--brand)' }}
                  >
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ------------------------------------- staff / admin credentials */}
          {step === 'credentials' && role && (
            <form onSubmit={handleCredentials}>
              <BackLink onClick={backToRoles} label="Choose a different role" />

              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {role.label} sign-in
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {role.blurb}
              </p>

              <label className="mb-1 mt-5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {role.idLabel}
              </label>
              <input
                autoFocus
                value={creds.userId}
                onChange={(e) => setCreds((c) => ({ ...c, userId: e.target.value }))}
                placeholder={role.idPlaceholder}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />

              <label className="mb-1 mt-4 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <PasswordInput
                value={creds.password}
                onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))}
              />

              {error && <FieldError>{error}</FieldError>}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                <ShieldCheck size={16} /> {loading ? 'Checking...' : `Sign in as ${role.label}`}
              </button>

              {/* Demo-only. These constants ship in the bundle — see lib/auth.js */}
              {import.meta.env.DEV && (
                <div
                  className="mt-4 rounded-lg px-3 py-2.5 text-xs"
                  style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: '#9a6a00' }}
                >
                  <p className="flex items-start gap-1.5 font-semibold">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                    Demo sign-in — not real security
                  </p>
                  <p className="mt-1">
                    There's no backend yet, so these are checked in the browser and protect nothing. Use:
                  </p>
                  <ul className="mt-1.5 space-y-0.5">
                    {demoAccountsFor(role.id).map((a) => (
                      <li key={a.userId}>
                        <strong>{a.userId}</strong> / {a.password}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function BackLink({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 flex items-center gap-1 text-xs font-medium"
      style={{ color: 'var(--text-muted)' }}
    >
      <ArrowLeft size={13} /> {label}
    </button>
  )
}

function FieldError({ children }) {
  return (
    <p className="mt-2 text-xs" style={{ color: 'var(--status-critical)' }}>
      {children}
    </p>
  )
}
