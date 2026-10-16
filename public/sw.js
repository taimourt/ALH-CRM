const CACHE_VERSION = "alh-crm-v1";
const STATIC_CACHE = `alh-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `alh-dynamic-${CACHE_VERSION}`;
const API_CACHE = `alh-api-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/favicon.svg",
  "/favicon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/apple-touch-icon.png",
];

// 1. Install Event: Pre-cache static assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Pre-caching offline fallback and core PWA assets");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to pre-cache:", err);
      });
    })
  );
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== API_CACHE) {
            console.log("[SW] Removing legacy cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Caching Strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore cross-origin, non-GET, and non-http(s) requests
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Strategy A: HTML Page Navigations (Network-First -> Cache -> Offline Fallback)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If valid response, clone and cache for offline navigation
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          // If navigation completely fails and nothing cached, return offline.html
          const offlinePage = await caches.match("/offline.html");
          if (offlinePage) return offlinePage;

          return new Response("Offline mode active. Please reconnect to internet.", {
            headers: { "Content-Type": "text/html" },
          });
        })
    );
    return;
  }

  // Strategy B: Core API GET requests (Network-First with API Cache Fallback)
  if (url.pathname.startsWith("/api/")) {
    // Only cache read endpoints (leads, properties, deals, societies, etc.)
    const isCacheableAPI =
      url.pathname.startsWith("/api/leads") ||
      url.pathname.startsWith("/api/properties") ||
      url.pathname.startsWith("/api/deals") ||
      url.pathname.startsWith("/api/societies") ||
      url.pathname.startsWith("/api/teams");

    if (isCacheableAPI) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const copy = response.clone();
              caches.open(API_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match(request))
      );
      return;
    }

    // Other APIs go directly to network
    return;
  }

  // Strategy C: Static Assets (Images, Next Static Chunks, Fonts, Icons) -> Cache-First with Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".woff2");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(STATIC_CACHE).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        // Fetch from network, then cache
        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }
});

// 4. Message Event: Skip waiting if requested by client app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
