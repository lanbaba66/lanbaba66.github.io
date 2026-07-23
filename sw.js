// 过渡版 sw.js：注销自身并清除旧缓存（升级到 vite-plugin-pwa 的 sw-new.js 后）
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(c => c.navigate(c.url));
  })());
});
