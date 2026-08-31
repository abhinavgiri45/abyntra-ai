const CACHE_NAME = 'girionix-edge-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/app.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET, API calls, and streaming LLM requests
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api') || url.hostname.includes('openrouter.ai') || url.hostname.includes('googleapis.com')) {
    return;
  }

  // Cache-First for Hashed Static Assets (.js, .css, .woff2, .png, .ico, cdn mirrors)
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.ico') || url.pathname.endsWith('.png') || url.hostname.includes('cloudflare.com') || url.hostname.includes('jsdelivr.net')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Stale-While-Revalidate for HTML navigations
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse || caches.match('/index.html'));

      return cachedResponse || fetchPromise;
    })
  );
});
