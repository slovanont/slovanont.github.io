const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/redirect.html',
];

// Install event: Caches the initial app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Intercepts network requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // If not, fetch from network
        return fetch(event.request)
          .catch(() => {
            // Serve the offline page if fetch fails
            return caches.match('/offline.html');
          });
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
