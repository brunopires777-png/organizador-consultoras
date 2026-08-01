const CACHE_NAME = "organizador-consultoras-v1";
const APP_SHELL = [
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Estratégia: shell do app fica em cache (funciona offline para abrir a tela);
// chamadas ao Firebase (auth/firestore) sempre vão pra rede, nunca são cacheadas.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isAppShell = APP_SHELL.some((p) => url.pathname.endsWith(p.replace("./", "")));

  if (isAppShell) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
  // outras requisições (Firebase, fontes) seguem direto pra rede normalmente
});
