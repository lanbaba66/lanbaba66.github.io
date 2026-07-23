import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    manifest: true,
    outDir: 'assets/dist',
    emptyOutDir: false,  // sass 产物 hux.css 也会放在此目录，Vite 重建时不能清
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/main.js'),
      },
      output: {
        // IIFE 格式，内联脚本依赖 $/jQuery 全局
        format: 'iife',
        globals: {
          jquery: 'jQuery',
        },
      },
      external: ['jquery'],
    },
  },
  plugins: [
    VitePWA({
      registerType: 'prompt',
      // 从 pwa/manifest.json 迁移，name 改为 Wang Blog
      manifest: {
        name: 'Wang Blog',
        short_name: 'Wang Blog',
        description: '王的宫殿 | Wang Blog',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fff',
        theme_color: '#000',
        icons: [
          { src: '/pwa/icons/128.png', sizes: '128x128', type: 'image/png' },
          { src: '/pwa/icons/512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      includeAssets: ['img/**', 'pwa/icons/**'],
      workbox: {
        cleanupOutdatedCaches: true,
        // 离线回退到 offline.html（替代默认 index.html）
        navigateFallback: 'offline.html',
        additionalManifestEntries: [
          { url: '/offline.html', revision: null },
          // 关键静态资源显式预缓存（install 即缓存，无需等待首次访问）
          { url: '/img/home-bg1.jpg', revision: null },
          { url: '/img/404-bg.jpg', revision: null },
          { url: '/img/icon_wechat.png', revision: null },
          { url: '/img/wang_avatar.jpg', revision: null },
          { url: '/img/favicon_wang.ico', revision: null },
        ],
        // SW 输出 sw.js（asset/dist 下），旧 sw.js（根目录自卸载）处理老读者
        runtimeCaching: [
          // CDN 资源离线缓存（Font Awesome、FastClick 等）
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'wang-cdn',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // HTML 页面：网络优先 + cache-busting 绕过 GitHub Pages max-age:600
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wang-html',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
              plugins: [
                {
                  // 请求时加 cb 时间戳，绕过浏览器/CDN 的 max-age 缓存
                  requestWillFetch: async ({ request }) => {
                    const url = new URL(request.url)
                    if (url.hostname === self.location.hostname) {
                      url.searchParams.set('cb', Date.now().toString())
                      return new Request(url.href, request)
                    }
                    return request
                  },
                },
                {
                  // 缓存存储时去掉 cb，用干净 URL 做 cache key
                  cacheKeyWillBeUsed: async ({ request }) => {
                    const url = new URL(request.url)
                    url.searchParams.delete('cb')
                    return url.href
                  },
                },
              ],
            },
          },
          // 静态资源：缓存优先（文件名带 hash）
          {
            urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wang-assets',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
})
