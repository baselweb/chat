const CACHE_NAME = 'chat-rooms-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'styles.css',
  'manifest.json',
  'statusBar.js',
  'legal.html'
  'legal.css'
  '404.html',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
