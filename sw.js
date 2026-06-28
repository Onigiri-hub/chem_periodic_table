const CACHE = 'genso-v4';

const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './game_puzzle.js',
  './game_memory.js',
  './data_elements.js',
  './manifest.json',
];

const STATIC_ASSETS = [
  './sounds/cards.mp3',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll([...CORE_ASSETS, ...STATIC_ASSETS]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // 外部リソース (Google Fonts等): ネットワーク優先、失敗時はキャッシュ
  if (!e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  const pathname = new URL(e.request.url).pathname;

  // 静的アセット (icons, sounds, imgs): キャッシュ優先
  if (pathname.includes('/sounds/') || pathname.includes('/icons/') || pathname.includes('/imgs/')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // コアファイル (HTML/CSS/JS): Stale-While-Revalidate
  // → キャッシュをすぐ返しつつ、バックグラウンドで最新版を取得してキャッシュ更新
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(res => {
          cache.put(e.request, res.clone());
          return res;
        });
        if (cached) {
          fetchPromise.catch(() => {});
          return cached;
        }
        return fetchPromise;
      })
    )
  );
});
