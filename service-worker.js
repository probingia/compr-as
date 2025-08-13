const CACHE_NAME = 'compr-as-cache-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    '/images/icon-192.png',
    '/images/icon-512.png'
];

// Evento de Instalación: se dispara cuando el SW se instala.
self.addEventListener('install', event => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Cache abierto. Cacheando archivos principales.');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('[Service Worker] Falló el cacheo de archivos durante la instalación:', err);
            })
    );
});

// Evento de Activación: se dispara cuando el SW se activa.
// Es el lugar ideal para limpiar cachés antiguos.
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activando...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Limpiando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Evento Fetch: se dispara con cada petición de red (ej. CSS, JS, imágenes).
// Estrategia: Cache First (primero busca en caché, si no, va a la red).
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en el caché, la devuelve.
                if (response) {
                    // console.log(`[Service Worker] Sirviendo desde caché: ${event.request.url}`);
                    return response;
                }
                // Si no, hace la petición a la red.
                // console.log(`[Service Worker] Buscando en red: ${event.request.url}`);
                return fetch(event.request);
            })
    );
});