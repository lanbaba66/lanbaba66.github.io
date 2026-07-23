/**
 * GitHub API 封装模块
 * 浏览器 JS 直接调用 GitHub REST API 读写仓库文件
 */

// === 配置 ===
const GITHUB_REPO = 'lanbaba66/lanbaba66.github.io';
const API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

// === Token 管理（存 sessionStorage，避免 GitHub 自动吊销） ===
function getToken() {
  return sessionStorage.getItem('gh_token') || '';
}

// === 通用请求头 ===
function headers() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Accept': 'application/vnd.github.v3+json'
  };
}

// === 错误处理 ===
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(resp) {
  if (resp.status === 401) throw new ApiError(401, '认证失败，请检查 Token 是否有效');
  if (resp.status === 409) throw new ApiError(409, '文件已被修改，请刷新后重试');
  if (resp.status === 422) throw new ApiError(422, '文件过大（GitHub 限制 100MB）');
  if (!resp.ok) throw new ApiError(resp.status, `请求失败 (HTTP ${resp.status})`);
  return resp.json();
}

// === UTF-8 字符串 → Base64 编码 ===
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// === 列出 _posts/ 下所有 .md 文件（按日期倒序） ===
async function fetchPosts() {
  const data = await fetch(`${API_BASE}/_posts`, { headers: headers() }).then(handleResponse);
  return data
    .filter(f => f.name.endsWith('.md'))
    .sort((a, b) => b.name.localeCompare(a.name)) // 文件名含日期，字符串排序即日期倒序
    .map(f => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      rawUrl: f.download_url
    }));
}

// === Base64 → UTF-8 解码（正确处理中文等多字节字符） ===
function fromBase64(base64) {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

// === 读取文件内容 ===
async function fetchFile(path) {
  const data = await fetch(`${API_BASE}/${path}`, { headers: headers() }).then(handleResponse);
  return {
    content: fromBase64(data.content),
    sha: data.sha
  };
}

// === 保存/更新文件 ===
async function saveFile(path, content, sha, message) {
  const body = {
    message: message || `admin: update ${path}`,
    content: toBase64(content),
    branch: 'master'
  };
  if (sha) body.sha = sha;

  await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse);
}

// === 删除文件 ===
async function deleteFile(path, sha, message) {
  await fetch(`${API_BASE}/${path}`, {
    method: 'DELETE',
    headers: headers(),
    body: JSON.stringify({
      message: message || `admin: delete ${path}`,
      sha: sha,
      branch: 'master'
    })
  }).then(handleResponse);
}

// === 删除已上传文件（先取 SHA 再删，用于失败回滚） ===
async function deleteUploadedFile(path) {
  try {
    var data = await fetchFile(path);
    await deleteFile(path, data.sha, 'admin: cleanup failed upload');
  } catch(e) {
    // 文件可能不存在，忽略
  }
}

// === 上传媒体文件（图片/视频/文件） ===
// 返回 { url, isImage } — 调用方根据 isImage 决定插入语法
async function uploadMedia(file) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿()-]/g, '_');
  const path = `img/posts/${timestamp}-${safeName}`;
  return await uploadFileToPath(file, path);
}

// === 上传文件到指定路径（暂存系统用） ===
// 返回 { url, path, isImage }
async function uploadFileToPath(file, path) {
  // 大小检查
  if (file.size > 100 * 1024 * 1024) {
    throw new ApiError(422, `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），GitHub 限制 100MB`);
  }

  // 读取文件内容
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  // 分块转 base64（大文件防栈溢出：每 8KB 一块）
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    binary += String.fromCharCode(...uint8Array.slice(i, i + chunkSize));
  }
  const base64 = btoa(binary);

  await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `admin: upload ${file.name}`,
      content: base64,
      branch: 'master'
    })
  }).then(handleResponse);

  const isImage = file.type.startsWith('image/');
  return {
    url: `/${path}`,
    path: path,
    isImage: isImage
  };
}

// 兼容旧调用（暂存系统内部使用）
