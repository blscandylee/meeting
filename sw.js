const CACHE_NAME = 'meeting-task-v1';
const ASSETS = [
    './会议任务系统.html',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.url.includes('firebase') || e.request.url.includes('ntfy')) {
        e.respondWith(fetch(e.request));
        return;
    }
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});

self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    const title = data.title || '任务通知';
    const body = data.body || '有新消息';
    e.waitUntil(self.registration.showNotification(title, {
        body: body,
        icon: './icon.svg',
        badge: './icon.svg'
    }));
});
