self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./sprites/idle.png",
        "./sprites/walk.png",
        "./sprites/ella_idle.png",
        "./sprites/ella_walk.png",
        "./sprites/corazones_animados.png",
        "./sprites/suelo.png",
        "./sprites/fondo_nubes_dia.png",
        "./sprites/fondo_nubes_tarde.png",
        "./sprites/fondo_nubes_noche.png",
        "./voz/voz1.mp3",
        "./voz/voz2.mp3",
        "./voz/voz3.mp3",
        "./voz/voz4.mp3"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
