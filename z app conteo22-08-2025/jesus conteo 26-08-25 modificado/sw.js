// Service Worker para PWA - Versión 3.0 FORCE UPDATE
const CACHE_NAME = 'conteo-pwa-v3.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css?v=30',
    './script.js?v=30',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Instalar el service worker y cachear archivos
self.addEventListener('install', event => {
  // SIN skipWaiting para evitar recargas automáticas
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto con nombre:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar requests y servir desde cache (estrategia Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          return response;
        }
        // Si no está en cache, obtener de la red
        return fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            return response;
          });
      })
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