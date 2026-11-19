import { useId, useRef, useState } from 'react'
import { Lock, Eye, EyeOff, ArrowBigUp } from 'lucide-react'

// Password field with show/hide toggle. Use for EVERY password input, not a
// bare <input type="password">, to keep behaviour consistent.
// Easy-to-miss details:
//  - type="button" on the toggle, else it submits the form
//  - caret is restored on toggle, so revealing mid-typing keeps the cursor
//  - toggle is out of tab order (tabIndex -1) so keyboard users reach submit
//    next; still clickable and announced to screen readers
//  - Caps Lock warning, since a mis-cased password fails silently otherwise
export default function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  name = 'password',
  autoFocus = false,
  required = false,
  id,
}) {
  const [visible, setVisible] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const inputRef = useRef(null)
  const generatedId = useId()
  const inputId = id ?? generatedId

  function toggle() {
    const el = inputRef.current
    const start = el?.selectionStart
    const end = el?.selectionEnd
    setVisible((v) => !v)
    // Restore caret after React swaps the input type.
    requestAnimationFrame(() => {
      if (!el) return
      el.focus()
      if (start !== null && start !== undefined) {
        try {
          el.setSelectionRange(start, end)
        } catch {
          // Some browsers reject setSelectionRange on some input types;
          // focus alone is fine.
        }
      }
    })
  }

  function trackCapsLock(e) {
    if (typeof e.getModifierState === 'function') setCapsOn(e.getModifierState('CapsLock'))
  }

  return (
    <>
      <div
        className="flex items-center overflow-hidden rounded-lg"
        style={{ border: '1px solid var(--border)', background: 'var(--surface-1)' }}
      >
        <span className="flex items-center px-3" style={{ color: 'var(--text-muted)' }}>
          <Lock size={15} />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onKeyUp={trackCapsLock}
          onKeyDown={trackCapsLock}
          onBlur={() => setCapsOn(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          className="w-full bg-transparent py-2.5 text-sm outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          type="button"
          onClick={toggle}
          tabIndex={-1}
          aria-controls={inputId}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          title={visible ? 'Hide password' : 'Show password'}
          className="flex items-center px-3 py-2.5"
          style={{ color: visible ? 'var(--brand)' : 'var(--text-muted)' }}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {capsOn && (
        <p className="mt-1.5 flex items-center gap-1 text-xs" style={{ color: 'var(--warn-fg)' }}>
          <ArrowBigUp size={13} strokeWidth={2.5} /> Caps Lock is on
        </p>
      )}
    </>
  )
}
