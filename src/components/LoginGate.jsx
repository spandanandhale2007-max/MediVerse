import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  UserRound,
  Stethoscope,
  ShieldHalf,
  AlertTriangle,
} from 'lucide-react'
import { requestOtp, confirmOtp, isValidEmail, normaliseEmail, isDemoOtp } from '../lib/otp'
import { ROLE_LIST, demoAccountsFor, verifyStaffCredentials } from '../lib/auth'
import { useAuth } from '../context/AuthContext'
import PasswordInput from './PasswordInput'
import BrandGlyph from './BrandGlyph'

const RESEND_SECONDS = 30
const OTP_LENGTH = 6

const ROLE_ICONS = { patient: UserRound, staff: Stethoscope, admin: ShieldHalf }

export default function LoginGate() {
  const { login, loginAs } = useAuth()
  // After sign-in, send users to their home screen instead of the last URL/deep link.
  const navigate = useNavigate()
  // role | email | otp | credentials
  const [step, setStep] = useState('role')
  const [role, setRole] = useState(null)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [creds, setCreds] = useState({ userId: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const otpRefs = useRef([])

  // Normalised so "Spandan@Gmail.com" and "spandan@gmail.com" are one account.
  const cleanEmail = normaliseEmail(email)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  function chooseRole(r) {
    setRole(r)
    setError('')
    setStep(r.method === 'otp' ? 'email' : 'credentials')
  }

  function backToRoles() {
    setStep('role')
    setRole(null)
    setError('')
    setCreds({ userId: '', password: '' })
  }

  async function sendOtp() {
    setError('')
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const result = await requestOtp(cleanEmail)
      setDevCode(result.devCode ?? '')
      setStep('otp')
      setResendIn(RESEND_SECONDS)
      setOtp(Array(OTP_LENGTH).fill(''))
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch (err) {
      // Show the real error (e.g. rate limit, unconfigured project) — a generic
      // "try again" would trap the user in a loop that can't succeed.
      setError(err?.message || "Couldn't send the code right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleEmailSubmit(e) {
    e.preventDefault()
    sendOtp()
  }

  // Fill boxes with `digits` starting at `startIndex`, then focus the last one filled.
  function fillOtpFrom(startIndex, digits) {
    if (!digits) return
    setOtp((prev) => {
      const next = [...prev]
      for (let i = 0; i < digits.length && startIndex + i < OTP_LENGTH; i += 1) {
        next[startIndex + i] = digits[i]
      }
      return next
    })
    const landed = Math.min(startIndex + digits.length, OTP_LENGTH) - 1
    otpRefs.current[landed]?.focus()
  }

  function handleOtpChange(index, value) {
    const digits = value.replace(/\D/g, '')

    if (!digits) {
      setOtp((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    // Correcting a box that already holds a digit: the box now contains the old
    // digit plus the one just typed. Keep only the newly typed one, so editing a
    // filled box isn't mistaken for a paste (which would scramble the whole code).
    if (digits.length === 2 && otp[index] && (digits[0] === otp[index] || digits[1] === otp[index])) {
      const typed = digits[0] === otp[index] ? digits[1] : digits[0]
      setOtp((prev) => {
        const next = [...prev]
        next[index] = typed
        return next
      })
      if (index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
      return
    }

    // Several digits at once = a paste that arrived via an input event (common on
    // mobile, where the paste event may not fire). Fill the whole code from box 1.
    if (digits.length > 1) {
      fillOtpFrom(0, digits.slice(0, OTP_LENGTH))
      return
    }

    // Normal single-digit typing.
    setOtp((prev) => {
      const next = [...prev]
      next[index] = digits
      return next
    })
    if (index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Real paste events (desktop): listener on the row catches a paste into any
  // box and fills from the first.
  function handleOtpPaste(e) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!digits) return
    e.preventDefault()
    fillOtpFrom(0, digits)
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
      const ok = await confirmOtp(cleanEmail, code)
      if (ok) {
        navigate('/', { replace: true })
        login(cleanEmail)
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
            <BrandGlyph size={24} />
          </span>
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            MediVerse
          </span>
        </div>

        <div className="card p-6">
          {/* role chooser */}
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

          {/* patient: email step */}
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <BackLink onClick={backToRoles} label="Choose a different role" />
              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Login to continue
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                We'll email you a one-time code. If you've signed in before, we'll bring your details back
                automatically.
              </p>

              <label htmlFor="login-email" className="mb-1 mt-5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <div
                className="flex items-center overflow-hidden rounded-lg"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
              >
                <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
                  <Mail size={16} />
                </span>
                <input
                  id="login-email"
                  autoFocus
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-2.5 pr-3 text-sm outline-none"
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
                <Mail size={16} /> {loading ? 'Sending code...' : 'Email me a code'}
              </button>

              <p className="mt-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                By continuing, you agree to MediVerse's Terms of Use and Privacy Policy.
              </p>
            </form>
          )}

          {/* patient: otp step */}
          {step === 'otp' && (
            <form onSubmit={handleVerify}>
              <BackLink
                onClick={() => {
                  setStep('email')
                  setError('')
                }}
                label="Change email"
              />

              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Enter the code
              </h1>
              <p className="mt-1 break-all text-sm" style={{ color: 'var(--text-secondary)' }}>
                Sent to <span style={{ color: 'var(--text-primary)' }}>{cleanEmail}</span>
              </p>

              {(import.meta.env.DEV || isDemoOtp) && devCode && (
                <p
                  className="mt-3 rounded-lg px-3 py-2 text-xs"
                  style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
                >
                  {isDemoOtp ? 'Demo mode: no email is sent.' : 'Dev preview only: no real email was sent.'} Your code is{' '}
                  <strong>{devCode}</strong>.
                </p>
              )}

              <div
                className="mt-4 flex justify-between gap-2"
                onPaste={handleOtpPaste}
                role="group"
                aria-label={`${OTP_LENGTH}-digit verification code`}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
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
                    <RefreshCw size={12} /> Resend code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* staff / admin credentials */}
          {step === 'credentials' && role && (
            <form onSubmit={handleCredentials}>
              <BackLink onClick={backToRoles} label="Choose a different role" />

              <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {role.label} sign-in
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {role.blurb}
              </p>

              <label htmlFor="staff-userid" className="mb-1 mt-5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                {role.idLabel}
              </label>
              <input
                autoFocus
                id="staff-userid"
                value={creds.userId}
                onChange={(e) => setCreds((c) => ({ ...c, userId: e.target.value }))}
                placeholder={role.idPlaceholder}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{ border: '1px solid var(--border)', background: 'var(--surface-1)', color: 'var(--text-primary)' }}
              />

              <label htmlFor="staff-password" className="mb-1 mt-4 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <PasswordInput
                id="staff-password"
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
              {import.meta.env.DEV && demoAccountsFor(role.id).length > 0 && (
                <div
                  className="mt-4 rounded-lg px-3 py-2.5 text-xs"
                  style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: 'var(--warn-fg)' }}
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
                        <strong>{a.userId}</strong> / {a.hint}
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
