// MediVerse service worker: makes the site installable and gives it an offline shell.
//
// Network-first for everything, so a new deploy shows up on the next load. The
// cache is only a fallback for when the network is unavailable. Third-party
// requests (maps, external links) are left alone.
const CACHE = 'mediverse-v1'
const SHELL = ['/index.html', '/manifest.webmanifest', '/icons/icon-192.png']

// Caching is best-effort throughout: if CacheStorage is unavailable (some
// private modes, storage-restricted browsers) the worker must still install,
// so the app stays installable - it just won't work offline.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {}),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .catch(() => {})
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    fetch(req)
      .then((res) => {
        const cacheable = req.mode === 'navigate' || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')
        if (res.ok && cacheable) {
          const copy = res.clone()
          caches
            .open(CACHE)
            .then((c) => c.put(req, copy))
            .catch(() => {})
        }
        return res
      })
      .catch(async () => {
        try {
          const hit = await caches.match(req)
          if (hit) return hit
          if (req.mode === 'navigate') {
            const shell = await caches.match('/index.html')
            if (shell) return shell
          }
        } catch {
          // Cache unavailable: fall through to a network error.
        }
        return Response.error()
      }),
  )
})
