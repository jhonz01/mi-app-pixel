const CACHE_NAME = 'mi-cache-cachetona-v3';
const OFFLINE_FALLBACK = './index.html';

// Función para cachear todos los archivos de la carpeta
async function cacheAllFiles() {
  const cache = await caches.open(CACHE_NAME);

  const urlsToCache = [
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    './sprites/idle.png',
    './sprites/walk.png',
    './sprites/ella_idle.png',
    './sprites/ella_walk.png',
    './sprites/corazones_animados.png',
    './sprites/suelo.png',
    './sprites/fondo_nubes_dia.png',
    './sprites/fondo_nubes_tarde.png',
    './sprites/fondo_nubes_noche.png',
    './voz/voz1.mp3',
    './voz/voz2.mp3',
    './voz/voz3.mp3',
    './voz/voz4.mp3'
  ];

  // Cachear cualquier archivo que esté en la página
  const resp = await fetch('./');
  const text = await resp.text();
  const matches = text.match(/src="([^"]+)"/g) || [];
  matches.forEach(m => {
    const url = m.replace('src="','').replace('"','');
    if (!urlsToCache.includes(url)) urlsToCache.push(url);
  });

  await cache.addAll(urlsToCache);
}

// Install: cache inicial
self.addEventListener('install', event => {
  event.waitUntil(cacheAllFiles());
  self.skipWaiting();
});

// Activate: limpiar caches viejos
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

// Fetch: responder con cache o con red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        const responseClone = response.clone();
        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_FALLBACK);
        }
      });
    })
  );
});
