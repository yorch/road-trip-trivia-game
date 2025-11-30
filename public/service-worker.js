// Service Worker for Road Trip Trivia - Offline Support

const CACHE_NAME = 'road-trip-trivia-v1';

// Determine base path from service worker location
// This allows the app to work in subdirectories
const getBasePath = () => {
  const url = new URL(self.location.href);
  const pathParts = url.pathname.split('/');
  pathParts.pop(); // Remove 'service-worker.js'
  return `${pathParts.join('/')}/`;
};

const BASE_PATH = getBasePath();

// Files to cache (relative to base path)
// Note: For production builds, Vite bundles JS/CSS into assets/ with hashed names
// This list is for development mode
const filesToCache = ['', 'index.html', 'curated-questions.json'];

// Convert relative paths to absolute URLs
const urlsToCache = filesToCache.map((file) => `${BASE_PATH}${file}`);

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache');
              return caches.delete(cacheName);
            }
            return null;
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Cache new resources as they're fetched
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
      .catch(() => {
        // Offline fallback - if both cache and network fail
        // Return a basic offline page or cached index
        return caches.match(`${BASE_PATH}index.html`);
      }),
  );
});
