var scheduled = false;

self.addEventListener('message', function(event) {
    if (!event.data || event.data.action !== 'schedule') return;
    if (scheduled) return;
    scheduled = true;
    var delay = event.data.delay || 5000;
    setTimeout(function() {
        scheduled = false;
        clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function(list) {
            if (list.length > 0) {
                list.forEach(function(c) {
                    c.navigate('/').then(function() {
                        try { c.focus(); } catch(e) {}
                    }).catch(function() {
                        try { c.focus(); } catch(e) {}
                    });
                });
            } else {
                clients.openWindow('/').catch(function() {});
            }
        });
    }, delay);
});

self.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'cancel') { scheduled = false; }
});

self.addEventListener('fetch', function(event) {
    event.respondWith(fetch(event.request).catch(function() {
        return new Response('', {status: 503});
    }));
});

self.addEventListener('install', function() { self.skipWaiting(); });
self.addEventListener('activate', function(event) { event.waitUntil(self.clients.claim()); });
