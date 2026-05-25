var CACHE_NAME = 'razgovorchiki-v1';
var FILES_TO_CACHE = [
  './game.html',
  './manifest.json'
];

// Установка: кэшируем файлы
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Запрос: отдаем из кэша или загружаем из сети
self.addEventListener('fetch', function(evt) {
  evt.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(evt.request).then(function(response) {
        var fetchPromise = fetch(evt.request).then(function(networkResponse) {
          cache.put(evt.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});