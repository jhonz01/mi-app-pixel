// Nombre de la caché
const CACHE_NAME = 'mi-app-offline-v2';

// Archivos iniciales a cachear
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',

  // JS y CSS si los tienes
  './main.js',
  './style.css',

  // Sprites
  './sprites/idle.png',
  './sprites/walk.png',
  './sprites/ella_idle.png',
  './sprites/ella_walk.png',
  './sprites/corazones_animados.png',
  './sprites/suelo.png',
  './sprites/fondo_nubes_dia.png',
  './sprites/fondo_nubes_tarde.png',
  './sprites/fondo_nubes_noche.png',

  // Audios
  './voz/voz1.mp3',
  './voz/voz2.mp3',
  './voz/voz3.mp3',
  './voz/voz4.mp3',

  // Fallback (opcional)
  './offline.html'
];

// Instalar y guardar todos los archivos
self.addEventListener('install', event => {
  console.log('Instalando service worker y cacheando recursos...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activar y limpiar versiones viejas del cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interceptar las peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si el archivo está en cache, úsalo
      if (cachedResponse) return cachedResponse;

      // Si no, intenta traerlo de la red
      return fetch(event.request).then(networkResponse => {
        // Si es un archivo local (de tu app), lo guarda en cache automáticamente
        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Si falla (offline), muestra index o un fallback
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
