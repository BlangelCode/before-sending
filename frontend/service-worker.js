const CACHE_NAME = "antes-de-enviar-static-v12";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/foundation.css",
  "./css/layout.css",
  "./css/editor.css",
  "./css/findings.css",
  "./css/feedback.css",
  "./css/responsive.css",
  "./css/theme.css",
  "./js/app.js",
  "./js/config.js",
  "./js/detection.js",
  "./js/findings-view.js",
  "./js/translations.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("antes-de-enviar-static-") && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => cachedResponse || fetch(request))
      .catch((error) => {
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        throw error;
      }),
  );
});