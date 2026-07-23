# 首页与 About 背景图加载优化设计

## 目标

降低首次访问时两张主要背景图的传输体积，同时保留当前构图、色彩和页面布局；清理由历史构建遗留且已确认无引用的 JavaScript 文件。

## 已确认方案

- About 背景图从 `1916×821` 的 PNG 转为宽度 `1600px` 的 WebP，保持原始宽高比和现有视觉构图。
- Home 背景图从 `3060×1280` 缩放至宽度 `1920px`，继续使用高质量 JPG。
- 原图分别备份为 `img/about-bg-原图.png` 和 `img/home-bg1-原图.jpg`，与优化图位于同一目录并提交到 GitHub。
- About 页面改用 `img/about-bg.webp`；Home 仍使用 `img/home-bg1.jpg`，因此现有预缓存地址继续有效。
- 仅删除部署仓库中未出现在 Vite manifest、HTML、源码和 Service Worker 清单里的 7 个旧哈希 JavaScript 文件。
- 不调整布局、文字、图谱、其他图片或预缓存策略。

## 验收标准

- 两张优化图可正常解码，尺寸符合设计，展示构图与原图一致。
- 优化图体积明显低于原图，两份原图备份的字节内容与修改前完全相同。
- Vite 构建及知识图谱测试通过。
- 部署产物只保留 manifest 指向的主 JavaScript 文件，页面引用不存在断链。
- GitHub Pages 部署成功，线上 Home 与 About 背景图返回 HTTP 200。
