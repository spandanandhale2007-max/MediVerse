import { useSyncExternalStore } from 'react'
import { subscribeInstallPrompt, getInstallPrompt, promptInstall, isStandalone } from '../lib/pwa'

// React view of the install-prompt store in lib/pwa.js.
export function usePwaInstall() {
  const prompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPrompt, () => null)
  return { canPrompt: !!prompt, installed: isStandalone(), promptInstall }
}
