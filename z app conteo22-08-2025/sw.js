const CACHE_NAME = 'conteo-pwa-v2.1';
const urlsToCache = [
  './',
  './index.html',
  './script.js?v=2.1',
  './styles.css?v=2.1',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar el service worker y cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests y servir desde cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devolver desde cache si existe, sino hacer fetch
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Actualizar cache cuando hay nueva versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Forzar que todos los clientes usen la nueva versión
      return self.clients.claim();
    })
  );
});

// Forzar actualización cuando hay nueva versión disponible
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Manejar notificaciones push (opcional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: 'icon-192.png',
    badge: 'icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification('App Conteo', options)
  );
});