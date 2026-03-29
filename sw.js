/**
 * 知行录 - Service Worker 缓存
 */

const CACHE_NAME = 'zhixinglu-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/base.css',
    './css/layout.css',
    './css/detail.css',
    './js/data-manager.js',
    './js/storage-manager.js',
    './js/ui-renderer.js',
    './js/detail-renderer.js',
    './js/search-manager.js',
    './js/share-manager.js',
    './js/app.js',
    './data/books.json',
    './data/history.json',
    './data/shanhaijing.json'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存资源');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// 请求拦截 - 缓存优先策略
self.addEventListener('fetch', (event) => {
    // 跳过非 GET 请求
    if (event.request.method !== 'GET') return;

    // JSON 数据使用网络优先策略
    if (event.request.url.endsWith('.json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // 其他资源使用缓存优先策略
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
            .catch(() => caches.match('./index.html'))
    );
});
