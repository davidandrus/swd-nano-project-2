const CACHE_NAME = 'transit-cache-v1';
const urlsToCache =   [
  '/',
  '/main.bundle.js',
];


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).then(console.log);
      })
  );
});
