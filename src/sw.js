const CACHE_NAME = 'transit-cache-v1';
const urlsToCache = [
  '/',
  // these will need to change to be the correct paths based on environment
  '/static/main.bundle.js',
  '/static/main.css'
];

const apiUrl = 'localhost:3000';
const apiRE = new RegExp(apiUrl);
const isApiUrl = url => apiRE.test(url);
const isInStaticCache = url => urlsToCache.some(assetUrl => {
  return (new RegExp(`${assetUrl}$`)).test(url);
});
const isCacheUrl = url => apiRE.test(url) || isInStaticCache(url);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', event => {
  if (isCacheUrl(event.request.url)) {
    // @TODO - add cache expiration stuff
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {

          if (response) {
            return response;
          }

          var fetchRequest = event.request.clone();
          var newFetch = fetch(fetchRequest)
          newFetch.then(
            function(response) {

              // Check if we received a valid response
              if(!response || response.status !== 200) {
                return response;
              }

              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
          return newFetch;
        })
    );
  }
})
