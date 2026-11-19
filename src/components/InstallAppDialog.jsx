import { useEffect, useRef } from 'react'
import { X, Smartphone, Monitor, Share, MoreVertical, Download } from 'lucide-react'
import { isIOS } from '../lib/pwa'

// Shown by "Get app" when the browser can't open its own install dialog
// (always the case on iPhone/iPad, where Safari only installs via Share).
// Lists the steps for each platform, with the visitor's own platform first.
export default function InstallAppDialog({ onClose }) {
  const closeRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    returnFocusRef.current = document.activeElement
    closeRef.current?.focus()
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      returnFocusRef.current?.focus?.()
    }
  }, [onClose])

  const ios = {
    key: 'ios',
    icon: Smartphone,
    title: 'iPhone / iPad (Safari)',
    steps: [
      <>
        Tap the <Share size={13} className="inline align-[-2px]" aria-label="Share" /> Share button.
      </>,
      'Choose "Add to Home Screen", then "Add".',
    ],
  }
  const android = {
    key: 'android',
    icon: Smartphone,
    title: 'Android (Chrome)',
    steps: [
      <>
        Tap the <MoreVertical size={13} className="inline align-[-2px]" aria-label="menu" /> menu.
      </>,
      'Choose "Install app" or "Add to Home screen".',
    ],
  }
  const desktop = {
    key: 'desktop',
    icon: Monitor,
    title: 'Windows / Mac (Chrome or Edge)',
    steps: [
      <>
        Click the <Download size={13} className="inline align-[-2px]" aria-label="install" /> install icon in the
        address bar,
      </>,
      'or open the browser menu and choose "Install MediVerse".',
    ],
  }
  const platforms = isIOS() ? [ios, android, desktop] : [android, desktop, ios]

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: 'rgba(10, 15, 15, 0.5)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        className="card relative w-full max-w-md rounded-b-none p-6 sm:rounded-2xl"
        style={{ boxShadow: '0 24px 60px -20px rgba(0,0,0,0.5)' }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close install instructions"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          <img src="/icons/icon-192.png" alt="" className="h-12 w-12 rounded-xl" />
          <div>
            <h2 id="install-title" className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Install MediVerse
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Opens full screen with its own icon, like any app.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {platforms.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.key}>
                <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <Icon size={15} style={{ color: 'var(--brand)' }} /> {p.title}
                </p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-9 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {p.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
