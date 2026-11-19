// PWA support: registers the service worker and captures the browser's
// "install app" prompt.
//
// The prompt (beforeinstallprompt) fires once per page load, often while the
// login screen is showing and the navbar isn't mounted yet. So it's caught
// here at module load (main.jsx imports this first) and kept until the
// "Get app" button asks for it. Skipped inside the Capacitor Android app.

const isNative = typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()

let deferredPrompt = null
const subscribers = new Set()
const notify = () => subscribers.forEach((fn) => fn())

if (typeof window !== 'undefined' && !isNative) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}

// Production web only: in dev a service worker would cache stale modules.
export function registerServiceWorker() {
  if (isNative || !import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

export function subscribeInstallPrompt(fn) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

export function getInstallPrompt() {
  return deferredPrompt
}

// Shows the browser's own install dialog. Each captured prompt works once.
export async function promptInstall() {
  const e = deferredPrompt
  if (!e) return false
  deferredPrompt = null
  notify()
  e.prompt()
  const { outcome } = await e.userChoice
  return outcome === 'accepted'
}

// Already running as an installed app (home-screen / desktop window).
export function isStandalone() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}

// iPadOS reports itself as a Mac, so also check for touch support.
export function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export { isNative as isNativeApp }
