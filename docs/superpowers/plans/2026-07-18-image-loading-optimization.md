# 首页与 About 背景图加载优化实施计划

> **供自动化执行者使用：** 按以下检查项顺序实施，每项完成后立即验证。

**目标：** 减少 Home 与 About 背景图的首次加载体积，并删除确认无引用的旧构建 JavaScript。

**架构：** 保持现有 Jekyll 与 Vite 架构不变，仅替换静态图片资源、更新 About 的图片路径，并清理部署目录中的孤立哈希产物。Home 文件名和预缓存配置保持不变。

**技术栈：** Jekyll、Vite、Pillow、GitHub Pages。

## 全局约束

- 不修改页面布局和文案。
- 原图必须以带有“原图”的文件名保存在 GitHub 同一图片目录。
- 预缓存机制必须保留。
- 只删除有完整无引用证据的 JavaScript 文件。

---

### 任务 1：备份和优化图片

**文件：**

- 新增：`img/about-bg-原图.png`
- 新增：`img/home-bg1-原图.jpg`
- 新增：`img/about-bg.webp`
- 修改：`img/home-bg1.jpg`
- 修改：`about.html`

- [ ] 复制两张原图并用 SHA-256 验证备份与原文件一致。
- [ ] 使用 Pillow 的 Lanczos 重采样生成 `1600px` 宽、质量 `82` 的 About WebP。
- [ ] 使用 Pillow 的 Lanczos 重采样生成 `1920px` 宽、质量 `84` 的 Home JPG。
- [ ] 将 `about.html` 的 `header-img` 改为 `img/about-bg.webp`。
- [ ] 验证优化图可解码、尺寸正确且体积下降。

### 任务 2：构建和清理产物

**文件：**

- 修改：`assets/dist/**`
- 删除：部署目录中 7 个已确认无引用的旧 `main-*.js`

- [ ] 运行 `npm run build`，确认构建退出码为 0。
- [ ] 运行 `npm run test:skill-graph`，确认测试全部通过。
- [ ] 核对 manifest 和 Service Worker 只引用当前哈希入口。
- [ ] 在部署仓库按精确文件名删除 7 个旧 JavaScript 文件。

### 任务 3：发布和线上验证

**文件：**

- 同步本次范围内的图片、页面、构建产物和文档到 GitHub Pages 仓库。

- [ ] 检查 Git 差异，只暂存本次范围内文件。
- [ ] 提交并推送 `master`。
- [ ] 等待 GitHub Pages 工作流成功完成。
- [ ] 请求线上 Home、About 及两张优化图，确认 HTTP 200 和实际传输体积。
