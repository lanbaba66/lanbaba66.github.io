// jquery 外部化（vite.config external + globals），通过独立 <script> 标签加载

// BS5 组件（按需 import，Hux 实际用到的）
import 'bootstrap/js/dist/collapse'
import 'bootstrap/js/dist/dropdown'

// vendor 插件（从 js/ 移过来）
import './vendor/jquery.nav.js'
import './vendor/jquery.tagcloud.js'
import './vendor/simple-jekyll-search.min.js'
import './vendor/snackbar.js'
import './vendor/animatescroll.min.js'
import './vendor/archive.js'

// Hux 原有逻辑
import './hux-blog.js'

// PWA Service Worker 注册（vite-plugin-pwa 生成 assets/dist/sw.js）
// 旧 sw.js（根目录）已自卸载，新老读者平稳过渡
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/assets/dist/sw.js')
      .then(registration => {
        // 首次安装提示
        if (!navigator.serviceWorker.controller) {
          console.log('SW 首次安装成功')
          if (typeof createSnackbar === 'function') {
            createSnackbar({
              message: '博客已可离线使用',
              duration: 3000,
            })
          }
        }

        // 监听新 SW 更新
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            // 新 SW 安装完毕且有旧 SW 在运行 → 内容已更新
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('SW 检测到新内容')
              if (typeof createSnackbar === 'function') {
                createSnackbar({
                  message: '博客内容已更新',
                  actionText: '刷新',
                  action: () => {
                    // 跳过 waiting 状态，立即激活新 SW
                    if (registration.waiting) {
                      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
                    }
                    window.location.reload()
                  },
                  duration: 0, // 不自动消失
                })
              }
            }
          })
        })

        // 处理已在 waiting 状态的 SW（页面已打开时 SW 更新完毕的情况）
        if (registration.waiting) {
          console.log('SW 已在 waiting 状态')
        }
      })
      .catch(err => console.warn('SW 注册失败:', err))
  })

  // 监听 SW 的 skipWaiting 完成
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('SW 已激活新版本')
  })
}
