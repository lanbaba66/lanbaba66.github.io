/**
 * Admin 后台核心逻辑
 * 路由切换、文章管理、书签管理（Vditor 编辑器）
 * 支持：上传暂存、提交反馈（spinner+toast）、编辑器状态保持
 */

// ====== 全局状态 ======
var state = {
  currentView: 'articles',
  posts: [],
  editingPost: null,
  // 各面板独立编辑器引用（不再互相销毁）
  newPostEditor: null,      // 新建文章编辑器
  articleEditor: null,      // 编辑已有文章编辑器
  bmBodyEditor: null,       // 书签正文编辑器
  // 书签数据
  bookmarks: [],
  bookmarkSha: null,
  bookmarkFrontMatter: null,
  bookmarkTitle: '',
  bookmarkBody: '',
  editingBookmarkIndex: null,
  // 上传暂存
  stagedFiles: [],           // { id, file, path, placeholder, isImage, blobUrl, name }
  // 新建文章是否已初始化
  newPostInitialized: false
};

// ====== Toast 提示 ======
var toastTimer = null;
function showToast(msg, type) {
  var el = document.getElementById('toast');
  if (toastTimer) clearTimeout(toastTimer);
  el.textContent = msg;
  el.className = 'toast toast-' + (type === 'error' ? 'error' : 'success') + ' toast-show';
  el.style.display = 'block';
  toastTimer = setTimeout(function() {
    el.classList.remove('toast-show');
    setTimeout(function() { el.style.display = 'none'; }, 300);
  }, 2500);
}

// ====== 状态栏 ======
function setStatus(msg) {
  document.getElementById('status-text').textContent = msg;
}

// ====== 路由切换 ======
function switchView(view) {
  state.currentView = view;
  document.querySelectorAll('.nav-item').forEach(function(el) { el.classList.remove('active'); });
  document.querySelector('[data-view="' + view + '"]').classList.add('active');
  document.querySelectorAll('.view-panel').forEach(function(el) { el.style.display = 'none'; });
  document.getElementById('view-' + view).style.display = 'block';

  if (view === 'articles') renderArticleList();
  if (view === 'bookmarks') loadBookmarks();
  // 新建文章面板：首次访问才初始化，之后只显示（保留编辑内容）
  if (view === 'new-post' && !state.newPostInitialized) {
    showNewPostEditor();
  }
}

document.querySelectorAll('.nav-item').forEach(function(item) {
  item.addEventListener('click', function() { switchView(item.dataset.view); });
});

// ====== 文章解析工具 ======
function parseFrontMatter(raw) {
  var match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { frontMatter: {}, body: raw };
  var yamlStr = match[1];
  var body = match[2] || '';
  var frontMatter = jsyaml.load(yamlStr) || {};
  if (typeof frontMatter.tags === 'string') {
    frontMatter.tags = [frontMatter.tags];
  }
  return { frontMatter: frontMatter, body: body };
}

function buildMarkdown(frontMatter, body) {
  var fm = {
    layout: frontMatter.layout || 'post',
    title: frontMatter.title || '',
    author: frontMatter.author || 'Wang',
    'header-style': frontMatter['header-style'] || 'text',
    catalog: frontMatter.catalog !== undefined ? frontMatter.catalog : true,
    tags: frontMatter.tags || []
  };
  if (frontMatter.bookmarks) fm.bookmarks = frontMatter.bookmarks;
  var knownKeys = ['layout', 'title', 'author', 'header-style', 'catalog', 'tags', 'bookmarks'];
  Object.keys(frontMatter).forEach(function(k) {
    if (!knownKeys.includes(k) && frontMatter[k] !== undefined && frontMatter[k] !== null) {
      fm[k] = frontMatter[k];
    }
  });
  var yaml = jsyaml.dump(fm, { lineWidth: -1, quotingType: '"', forceQuotes: true });
  return '---\n' + yaml + '---\n' + body;
}

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-鿿_-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

// ====== 上传暂存（核心新功能） ======

/**
 * 暂存单个文件——不立即上传到 GitHub，仅保存到内存
 * 返回要插入编辑器的 markdown 字符串
 */
function stageFile(file) {
  var id = 'staged_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  var isImage = file.type.startsWith('image/');
  var safeName = file.name.replace(/[^a-zA-Z0-9._一-鿿()-]/g, '_');
  var timestamp = Date.now();

  // 根据文件类型选择目标路径
  var targetPath;
  if (isImage) {
    targetPath = 'img/posts/' + timestamp + '-' + safeName;
  } else {
    targetPath = 'files/' + timestamp + '-' + safeName;
  }

  var placeholder, markdown, blobUrl = null;

  if (isImage) {
    // 图片：用 blob URL 实现编辑器内预览
    blobUrl = URL.createObjectURL(file);
    placeholder = blobUrl;
    markdown = '![' + file.name + '](' + blobUrl + ')';
  } else {
    // 非图片：用占位符标记，提交时替换
    placeholder = '__STAGED__/' + id;
    markdown = '[' + file.name + '](__STAGED__/' + id + ')';
  }

  state.stagedFiles.push({
    id: id,
    file: file,
    path: targetPath,
    placeholder: placeholder,
    isImage: isImage,
    blobUrl: blobUrl,
    name: file.name
  });

  updateStagedBadge();
  return markdown;
}

/** 更新所有暂存数量徽标 + 暂存清单 */
function updateStagedBadge() {
  var badges = document.querySelectorAll('.staged-count');
  badges.forEach(function(badge) {
    if (state.stagedFiles.length > 0) {
      badge.textContent = state.stagedFiles.length;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  });
  renderStagedList();
}

/** 渲染暂存文件清单（所有面板中的容器同步更新） */
function renderStagedList() {
  var containers = document.querySelectorAll('.staged-files-container');
  containers.forEach(function(container) {
    if (state.stagedFiles.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }
    container.style.display = 'block';
    var html = '<div class="staged-files-header">📎 待上传附件（' + state.stagedFiles.length + ' 个）</div>';
    state.stagedFiles.forEach(function(sf, i) {
      var icon = sf.isImage ? '🖼️' : '📄';
      var size = sf.file.size > 1024 * 1024
        ? (sf.file.size / 1024 / 1024).toFixed(1) + ' MB'
        : (sf.file.size / 1024).toFixed(0) + ' KB';
      html += '<div class="staged-file-item">' +
        '<span class="staged-file-icon">' + icon + '</span>' +
        '<span class="staged-file-name" title="' + escapeHtml(sf.name) + '">' + escapeHtml(sf.name) + '</span>' +
        '<span class="staged-file-size">' + size + '</span>' +
        '<button type="button" class="staged-file-copy" onclick="copyStagedRef(' + i + ')" title="复制引用链接">📋</button>' +
        '<button type="button" class="staged-file-remove" onclick="removeStagedFile(' + i + ')" title="移除此附件">×</button>' +
        '</div>';
    });
    container.innerHTML = html;
  });
}

/** 从编辑器内容中移除某个暂存文件的 markdown 标记 */
function removePlaceholderFromContent(content, sf) {
  var escaped = sf.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (sf.isImage) {
    // 匹配 ![...](placeholder)
    var regex = new RegExp('!\\[[^\\]]*\\]\\(' + escaped + '\\)\\s*', 'g');
    return content.replace(regex, '');
  } else {
    // 匹配 [...](placeholder)
    var regex = new RegExp('\\[[^\\]]*\\]\\(' + escaped + '\\)\\s*', 'g');
    return content.replace(regex, '');
  }
}

/** 移除单个暂存文件（同时清理编辑器中的对应内容） */
function removeStagedFile(index) {
  if (index < 0 || index >= state.stagedFiles.length) return;
  var sf = state.stagedFiles[index];

  // 从所有活跃编辑器中移除对应 markdown（容错：编辑器异常不影响删除）
  var editors = [state.newPostEditor, state.articleEditor, state.bmBodyEditor];
  editors.forEach(function(ref) {
    try {
      if (ref && typeof ref.getValue === 'function') {
        var content = ref.getValue();
        var newContent = removePlaceholderFromContent(content, sf);
        if (newContent !== content) {
          ref.setValue(newContent);
        }
      }
    } catch(e) { /* 编辑器不可用，跳过内容清理 */ }
  });

  // 释放 blob URL
  if (sf.blobUrl) URL.revokeObjectURL(sf.blobUrl);

  // 从暂存数组移除（放在最后确保一定执行）
  state.stagedFiles.splice(index, 1);
  updateStagedBadge();
}

/** 复制暂存文件的最终引用链接（Markdown 格式） */
function copyStagedRef(index) {
  if (index < 0 || index >= state.stagedFiles.length) return;
  var sf = state.stagedFiles[index];
  var targetUrl = '/' + sf.path;  // 提交后的真实 URL
  var ref = sf.isImage
    ? '![' + sf.name + '](' + targetUrl + ')'
    : '[' + sf.name + '](' + targetUrl + ')';
  navigator.clipboard.writeText(ref).then(function() {
    showToast('引用已复制：' + ref, 'success');
  }).catch(function() {
    // fallback：旧浏览器或不安全上下文
    prompt('请手动复制引用：', ref);
  });
}

/** 批量上传所有暂存文件，返回替换映射表 + 已上传路径（用于失败回滚） */
async function uploadAllStaged() {
  var replacements = []; // [{placeholder, realUrl}]
  var uploadedPaths = []; // 用于失败回滚

  for (var i = 0; i < state.stagedFiles.length; i++) {
    var sf = state.stagedFiles[i];
    setStatus('上传附件 ' + (i + 1) + '/' + state.stagedFiles.length + ' · ' + sf.name);

    try {
      var result = await uploadFileToPath(sf.file, sf.path);
      uploadedPaths.push({ path: sf.path, url: result.url });
      replacements.push({
        placeholder: sf.placeholder,
        realUrl: result.url
      });
    } catch (e) {
      // 回滚：删除已上传的文件
      setStatus('上传失败，清理已上传文件...');
      await cleanupUploadedFiles(uploadedPaths);
      throw new Error('附件「' + sf.name + '」上传失败：' + e.message);
    }
  }

  // 返回 uploadedPaths 以便调用方在后续步骤失败时清理
  return { replacements: replacements, uploadedPaths: uploadedPaths };
}

/** 清理已上传的文件（回滚用） */
async function cleanupUploadedFiles(uploadedPaths) {
  for (var j = 0; j < uploadedPaths.length; j++) {
    try { await deleteUploadedFile(uploadedPaths[j].path); } catch(cleanErr) { /* 忽略清理错误 */ }
  }
}

/** 清除所有暂存（释放 blob URL + 清空数组） */
function clearStagedFiles() {
  state.stagedFiles.forEach(function(sf) {
    if (sf.blobUrl) URL.revokeObjectURL(sf.blobUrl);
  });
  state.stagedFiles = [];
  updateStagedBadge();
}

/**
 * 替换 markdown 正文中的占位符
 * replacements: [{placeholder, realUrl}]
 */
function replacePlaceholders(body, replacements) {
  for (var i = 0; i < replacements.length; i++) {
    var r = replacements[i];
    // 用 split+join 做全局替换（处理同一图片多次引用的情况）
    body = body.split(r.placeholder).join(r.realUrl);
  }
  return body;
}

// ====== 文章列表 ======
async function renderArticleList() {
  var el = document.getElementById('view-articles');
  try {
    setStatus('加载文章列表...');
    var posts = await fetchPosts();
    state.posts = posts;

    if (posts.length === 0) {
      el.innerHTML = '<div class="panel-title">文章管理</div><p style="color:#999;">暂无文章</p>';
      setStatus('就绪');
      return;
    }

    var html = '<div class="panel-title">文章管理 <span style="font-weight:400;color:#999;font-size:14px;">' + posts.length + ' 篇</span></div><ul class="post-list">';
    posts.forEach(function(p) {
      var dateMatch = p.name.match(/^(\d{4}-\d{2}-\d{2})-/);
      var date = dateMatch ? dateMatch[1] : '';
      var title = p.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '').replace(/-/g, ' ');
      html += '<li class="post-list-item" data-path="' + escapeHtml(p.path) + '" data-sha="' + escapeHtml(p.sha) + '">';
      html += '<span class="post-info" style="flex:1;cursor:pointer;"><span class="post-title">' + escapeHtml(title) + '</span><span class="post-date">' + escapeHtml(date) + '</span></span>';
      html += '<button class="btn btn-danger btn-sm post-del-btn" title="删除">删除</button>';
      html += '</li>';
    });
    html += '</ul>';
    el.innerHTML = html;

    el.querySelectorAll('.post-info').forEach(function(info) {
      var li = info.parentElement;
      info.addEventListener('click', function() { openArticleEditor(li.dataset.path, li.dataset.sha); });
    });
    el.querySelectorAll('.post-del-btn').forEach(function(btn) {
      var li = btn.parentElement;
      btn.addEventListener('click', function(e) { e.stopPropagation(); deleteArticle(li.dataset.path, li.dataset.sha); });
    });

    setStatus('就绪');
  } catch (e) {
    el.innerHTML = '<div class="panel-title">文章管理</div><p style="color:#e74c3c;">加载失败：' + escapeHtml(e.message) + '</p>';
    setStatus('加载失败');
  }
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ====== 删除文章 ======
async function deleteArticle(path, sha) {
  var title = path.replace(/_posts\//, '').replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
  if (!confirm('确定要删除文章「' + title + '」吗？\n\n此操作不可撤销。')) return;
  setStatus('删除中...');
  try {
    await deleteFile(path, sha, 'admin: delete ' + title);
    setStatus('已删除 · ' + new Date().toLocaleTimeString());
    renderArticleList();
  } catch (e) {
    alert('删除失败：' + e.message);
    setStatus('删除失败');
  }
}

// ====== 编辑器管理 ======

/** 销毁指定编辑器实例 */
function destroyEditorRef(ref) {
  if (ref && typeof ref.destroy === 'function') {
    try { ref.destroy(); } catch(e) {}
  }
}

/** 创建上传处理器（暂存模式） */
function makeUploadHandler() {
  return {
    handler: async function(files) {
      var results = [];
      for (var i = 0; i < files.length; i++) {
        try {
          var md = stageFile(files[i]);
          results.push(md);
          setStatus('文件已暂存（' + state.stagedFiles.length + ' 个），提交时统一上传');
        } catch (e) {
          alert('暂存失败：' + e.message);
          setStatus('暂存失败');
        }
      }
      return results.join('\n');
    }
  };
}

/** 在指定容器中创建 Vditor 编辑器 */
function createVditor(containerId, value, h) {
  var el = document.getElementById(containerId);
  el.innerHTML = '';
  return new Vditor(containerId, {
    height: h || 500,
    mode: 'wysiwyg',
    placeholder: '在这里开始写文章...',
    value: value || '',
    toolbar: [
      'headings', 'bold', 'italic', 'strike', '|',
      'quote', 'list', 'ordered-list', 'check', '|',
      'link', 'upload', '|',
      'undo', 'redo', '|',
      'preview', 'fullscreen'
    ],
    upload: makeUploadHandler(),
    cache: { enable: false }
  });
}

// ====== 编辑已有文章 ======
function renderEditorUI(el, title, tags, body) {
  el.innerHTML = '<div class="panel-title">编辑文章</div>' +
    '<button class="btn btn-secondary btn-sm" style="margin-bottom:16px;" onclick="cancelEditArticle()">返回列表</button>' +
    '<input type="text" id="edit-title" class="input-field" value="' + escapeHtml(title || '') + '" placeholder="文章标题">' +
    '<div class="tag-input-area" id="edit-tags">' +
      (tags || []).map(function(t) { return '<span class="tag-pill">' + escapeHtml(t) + '<span class="tag-remove" onclick="removeTag(this)">&times;</span></span>'; }).join('') +
      '<input type="text" id="edit-tag-input" class="input-field" style="width:100px;margin-bottom:0;" placeholder="添加标签" onkeydown="if(event.key===\'Enter\'){addTag(\'edit-tags\',\'edit-tag-input\');event.preventDefault();}">' +
    '</div>' +
    '<div id="vditor-edit" style="margin-bottom:12px;"></div>' +
    '<div class="staged-files-container" style="display:none;"></div>' +
    '<div style="display:flex;gap:12px;align-items:center;">' +
      '<button class="btn btn-primary" id="btn-save-article" onclick="saveArticle()">' +
        '保存文章' +
        '<span class="staged-badge staged-count" style="display:none;">0</span>' +
      '</button>' +
      '<button class="btn btn-secondary" onclick="cancelEditArticle()">取消</button>' +
    '</div>';
}

function cancelEditArticle() {
  state.editingPost = null;
  destroyEditorRef(state.articleEditor);
  state.articleEditor = null;
  renderArticleList();
}

async function openArticleEditor(path, sha) {
  setStatus('加载文章...');
  var el = document.getElementById('view-articles');
  // 销毁旧的文章编辑器（如果存在）
  destroyEditorRef(state.articleEditor);
  state.articleEditor = null;

  try {
    var file = await fetchFile(path);
    var parsed = parseFrontMatter(file.content);
    state.editingPost = { path: path, sha: sha, frontMatter: parsed.frontMatter, body: parsed.body };
    renderEditorUI(el, parsed.frontMatter.title, parsed.frontMatter.tags, parsed.body);
    state.articleEditor = createVditor('vditor-edit', parsed.body, 500);
    updateStagedBadge();
    setStatus('就绪');
  } catch (e) {
    el.innerHTML = '<div class="panel-title">编辑文章</div><p style="color:#e74c3c;">加载失败：' + escapeHtml(e.message) + '</p>';
    setStatus('加载失败');
  }
}

function addTag(containerId, inputId) {
  var input = document.getElementById(inputId);
  var val = input.value.trim();
  if (!val) return;
  var container = document.getElementById(containerId);
  var pill = document.createElement('span');
  pill.className = 'tag-pill';
  pill.innerHTML = escapeHtml(val) + '<span class="tag-remove" onclick="removeTag(this)">&times;</span>';
  container.insertBefore(pill, input);
  input.value = '';
}

function removeTag(el) {
  el.parentElement.remove();
}

function getTags(containerId) {
  var container = document.getElementById(containerId);
  return Array.from(container.querySelectorAll('.tag-pill')).map(function(p) { return p.textContent.replace('×', '').trim(); });
}

// ====== 保存已有文章（含暂存上传 + 提交反馈） ======
async function saveArticle() {
  if (!state.editingPost) return;
  var btn = document.getElementById('btn-save-article');
  var title = document.getElementById('edit-title').value.trim();
  if (!title) { alert('请输入标题'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>提交中...';
  setStatus('正在提交...');

  var uploadedPaths = []; // 用于失败回滚

  try {
    var tags = getTags('edit-tags');
    var body = (state.articleEditor && typeof state.articleEditor.getValue === 'function') ? state.articleEditor.getValue() : (state.editingPost ? state.editingPost.body : '');

    // 1. 上传暂存文件
    var replacements = [];
    if (state.stagedFiles.length > 0) {
      var uploadResult = await uploadAllStaged();
      replacements = uploadResult.replacements;
      uploadedPaths = uploadResult.uploadedPaths;
    }

    // 2. 替换占位符
    body = replacePlaceholders(body, replacements);

    // 3. 保存文章
    state.editingPost.frontMatter.title = title;
    state.editingPost.frontMatter.tags = tags;
    var fullContent = buildMarkdown(state.editingPost.frontMatter, body);
    await saveFile(state.editingPost.path, fullContent, state.editingPost.sha, 'admin: update ' + title);

    // 4. 更新 SHA（后续编辑用）
    var updated = await fetchFile(state.editingPost.path);
    state.editingPost.sha = updated.sha;

    // 5. 成功清理
    clearStagedFiles();
    showToast('文章已保存！', 'success');
    setStatus('已保存 · ' + new Date().toLocaleTimeString());
  } catch (e) {
    // 失败：回滚已上传文件 + 保留暂存
    if (uploadedPaths.length > 0) {
      setStatus('保存失败，清理已上传文件...');
      await cleanupUploadedFiles(uploadedPaths);
    }
    showToast('保存失败：' + e.message, 'error');
    setStatus('保存失败');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '保存文章<span class="staged-badge staged-count" style="display:none;">' + state.stagedFiles.length + '</span>';
    updateStagedBadge();
  }
}

// ====== 新建文章（含编辑器状态保持 + 暂存上传 + 提交反馈） ======
function showNewPostEditor() {
  var el = document.getElementById('view-new-post');
  state.editingPost = null;

  // 销毁旧编辑器（如果存在）
  destroyEditorRef(state.newPostEditor);
  state.newPostEditor = null;

  el.innerHTML = '<div class="panel-title">新建文章</div>' +
    '<input type="text" id="new-title" class="input-field" placeholder="文章标题">' +
    '<div class="tag-input-area" id="new-tags">' +
      '<span class="tag-pill">日常<span class="tag-remove" onclick="removeTag(this)">&times;</span></span>' +
      '<input type="text" id="new-tag-input" class="input-field" style="width:100px;margin-bottom:0;" placeholder="添加标签" onkeydown="if(event.key===\'Enter\'){addTag(\'new-tags\',\'new-tag-input\');event.preventDefault();}">' +
    '</div>' +
    '<div id="vditor-new" style="margin-bottom:12px;"></div>' +
    '<div class="staged-files-container" style="display:none;"></div>' +
    '<div style="display:flex;gap:12px;align-items:center;">' +
      '<button class="btn btn-primary" id="btn-save-new" onclick="saveNewPost()">' +
        '发布文章' +
        '<span class="staged-badge staged-count" style="display:none;">0</span>' +
      '</button>' +
    '</div>';

  state.newPostEditor = createVditor('vditor-new', '', 500);
  state.newPostInitialized = true;
  updateStagedBadge();
}

async function saveNewPost() {
  var btn = document.getElementById('btn-save-new');
  var title = document.getElementById('new-title').value.trim();
  if (!title) { alert('请输入标题'); return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>提交中...';
  setStatus('正在提交...');

  var uploadedPaths = []; // 用于失败回滚

  try {
    var tags = getTags('new-tags');
    var body = (state.newPostEditor && typeof state.newPostEditor.getValue === 'function') ? state.newPostEditor.getValue() : '';

    // 1. 上传暂存文件
    var replacements = [];
    if (state.stagedFiles.length > 0) {
      var uploadResult = await uploadAllStaged();
      replacements = uploadResult.replacements;
      uploadedPaths = uploadResult.uploadedPaths;
    }

    // 2. 替换占位符
    body = replacePlaceholders(body, replacements);

    // 3. 构建并保存文章
    var today = new Date().toISOString().split('T')[0];
    var slug = titleToSlug(title);
    var filename = today + '-' + slug + '.md';
    var path = '_posts/' + filename;
    var frontMatter = { layout: 'post', title: title, author: 'Wang', 'header-style': 'text', catalog: true, tags: tags };
    var fullContent = buildMarkdown(frontMatter, body);

    await saveFile(path, fullContent, null, 'admin: new post ' + title);

    // 4. 成功：清理暂存 + 重置编辑器
    clearStagedFiles();
    showToast('文章发布成功！', 'success');
    setStatus('发布成功 · ' + new Date().toLocaleTimeString());

    // 重置编辑器（清空内容）
    state.newPostInitialized = false;
    showNewPostEditor();
  } catch (e) {
    // 失败：回滚已上传文件 + 保留暂存 + 保留编辑内容
    if (uploadedPaths.length > 0) {
      setStatus('发布失败，清理已上传文件...');
      await cleanupUploadedFiles(uploadedPaths);
    }
    showToast('发布失败：' + e.message, 'error');
    setStatus('发布失败');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '发布文章<span class="staged-badge staged-count" style="display:none;">' + state.stagedFiles.length + '</span>';
    updateStagedBadge();
  }
}

// ====== 书签管理 ======
var BOOKMARK_POST_PATH = '_posts/2025-10-25-wangzhan.md';

async function loadBookmarks() {
  var el = document.getElementById('view-bookmarks');
  try {
    setStatus('加载书签...');
    var file = await fetchFile(BOOKMARK_POST_PATH);
    var parsed = parseFrontMatter(file.content);
    state.bookmarkSha = file.sha;
    state.bookmarkFrontMatter = parsed.frontMatter;
    state.bookmarks = parsed.frontMatter.bookmarks || [];
    state.bookmarkTitle = parsed.frontMatter.title || '';
    state.bookmarkBody = parsed.body;
    renderBookmarkEditor(el);
    setStatus('就绪');
  } catch (e) {
    el.innerHTML = '<div class="panel-title">书签管理</div><p style="color:#e74c3c;">加载失败：' + escapeHtml(e.message) + '</p>';
    setStatus('加载失败');
  }
}

function renderBookmarkEditor(el) {
  var html = '<div class="panel-title">书签管理 · ' + escapeHtml(state.bookmarkTitle) + '</div>';

  html += '<div class="bookmark-form"><div style="font-weight:600;margin-bottom:12px;">新增书签</div><div class="bookmark-form-grid">';
  html += '<input type="text" id="bm-name" class="input-field" placeholder="网站名称 *" style="margin-bottom:0;">';
  html += '<input type="text" id="bm-url" class="input-field" placeholder="网址 *" style="margin-bottom:0;">';
  html += '<input type="text" id="bm-desc" class="input-field" placeholder="描述（选填）" style="margin-bottom:0;">';
  html += '<input type="text" id="bm-tags" class="input-field" placeholder="标签，逗号分隔（选填）" style="margin-bottom:0;">';
  html += '</div><button class="btn btn-primary btn-sm" onclick="addBookmark()">+ 添加书签</button>';
  html += '<span style="color:#999;font-size:12px;margin-left:8px;">* 为必填项</span></div>';

  html += '<div style="margin-bottom:20px;">';
  html += '<label style="font-weight:600;font-size:13px;">文章标题</label>';
  html += '<input type="text" id="bm-post-title" class="input-field" value="' + escapeHtml(state.bookmarkTitle) + '">';
  html += '<label style="font-weight:600;font-size:13px;">文章说明（可选）</label>';
  html += '<div id="vditor-bm-body" style="margin-bottom:0;"></div>';
  html += '</div>';

  html += '<div style="font-weight:600;margin-bottom:12px;">现有书签（' + state.bookmarks.length + ' 条）</div><div id="bm-list">';

  if (state.bookmarks.length === 0) {
    html += '<p style="color:#999;">暂无书签</p>';
  } else {
    state.bookmarks.forEach(function(bm, index) {
      html += '<div class="bookmark-card" data-index="' + index + '"><div class="bm-info">';
      html += '<div class="bm-name">' + escapeHtml(bm.name) + '</div>';
      html += '<div class="bm-url">' + escapeHtml(bm.url) + '</div>';
      if (bm.desc) html += '<div class="bm-desc">' + escapeHtml(bm.desc) + '</div>';
      if (bm.tags && bm.tags.length) {
        html += '<div style="margin-top:4px;">' + bm.tags.map(function(t) { return '<span class="tag-pill">' + escapeHtml(t) + '</span>'; }).join('') + '</div>';
      }
      html += '</div><div class="bm-actions">';
      html += '<button class="btn btn-secondary btn-sm" onclick="editBookmark(' + index + ')">编辑</button>';
      html += '<button class="btn btn-danger btn-sm" onclick="deleteBookmark(' + index + ')">删除</button>';
      html += '</div></div>';
    });
  }

  html += '</div><div style="margin-top:20px;">' +
    '<button class="btn btn-primary" id="btn-save-bookmarks" onclick="saveBookmarks()">保存书签</button>' +
    '</div>';

  el.innerHTML = html;

  // 书签正文用 Vditor（小号）
  destroyEditorRef(state.bmBodyEditor);
  try {
    state.bmBodyEditor = new Vditor('vditor-bm-body', {
      height: 200,
      mode: 'wysiwyg',
      placeholder: '文章说明...',
      value: state.bookmarkBody || '',
      toolbar: ['headings', 'bold', 'italic', '|', 'link', 'upload', '|', 'preview'],
      upload: makeUploadHandler(),
      cache: { enable: false }
    });
  } catch(e) {
    state.bmBodyEditor = null;
    console.error('书签编辑器初始化失败：', e);
  }
}

function addBookmark() {
  var name = document.getElementById('bm-name').value.trim();
  var url = document.getElementById('bm-url').value.trim();
  if (!name) { alert('请输入网站名称'); return; }
  if (!url) { alert('请输入网址'); return; }
  var desc = document.getElementById('bm-desc').value.trim();
  var tagsRaw = document.getElementById('bm-tags').value.trim();
  var tags = tagsRaw ? tagsRaw.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];
  state.bookmarks.push({ name: name, url: url, desc: desc, tags: tags });
  renderBookmarkEditor(document.getElementById('view-bookmarks'));
}

function editBookmark(index) {
  var bm = state.bookmarks[index];
  document.getElementById('bm-name').value = bm.name;
  document.getElementById('bm-url').value = bm.url;
  document.getElementById('bm-desc').value = bm.desc || '';
  document.getElementById('bm-tags').value = (bm.tags || []).join(', ');
  state.editingBookmarkIndex = index;

  var form = document.querySelector('.bookmark-form');
  var btn = form.querySelector('button');
  btn.textContent = '确认修改';
  btn.className = 'btn btn-primary btn-sm';
  btn.onclick = confirmEditBookmark;

  if (!document.getElementById('bm-cancel-edit')) {
    var cancelBtn = document.createElement('button');
    cancelBtn.id = 'bm-cancel-edit';
    cancelBtn.className = 'btn btn-secondary btn-sm';
    cancelBtn.textContent = '取消';
    cancelBtn.style.marginLeft = '8px';
    cancelBtn.onclick = function() {
      state.editingBookmarkIndex = null;
      renderBookmarkEditor(document.getElementById('view-bookmarks'));
    };
    btn.parentNode.appendChild(cancelBtn);
  }

  document.querySelectorAll('.bookmark-card').forEach(function(c) { c.style.background = '#fff'; });
  var card = document.querySelector('.bookmark-card[data-index="' + index + '"]');
  if (card) card.style.background = '#e8f4f8';
}

function confirmEditBookmark() {
  if (state.editingBookmarkIndex === null || state.editingBookmarkIndex === undefined) return;
  var name = document.getElementById('bm-name').value.trim();
  var url = document.getElementById('bm-url').value.trim();
  if (!name || !url) { alert('名称和网址为必填'); return; }
  var desc = document.getElementById('bm-desc').value.trim();
  var tagsRaw = document.getElementById('bm-tags').value.trim();
  var tags = tagsRaw ? tagsRaw.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];
  state.bookmarks[state.editingBookmarkIndex] = { name: name, url: url, desc: desc, tags: tags };
  state.editingBookmarkIndex = null;
  renderBookmarkEditor(document.getElementById('view-bookmarks'));
}

function deleteBookmark(index) {
  if (!confirm('确定要删除书签「' + state.bookmarks[index].name + '」吗？')) return;
  state.bookmarks.splice(index, 1);
  state.editingBookmarkIndex = null;
  renderBookmarkEditor(document.getElementById('view-bookmarks'));
}

async function saveBookmarks() {
  var btn = document.getElementById('btn-save-bookmarks');
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-spinner"></span>保存中...';
  setStatus('保存书签...');

  var uploadedPaths = []; // 用于失败回滚

  try {
    var title = document.getElementById('bm-post-title').value.trim();
    // 安全取值：Vditor 异步初始化中或已销毁时回退到上次加载的内容
    var body = state.bookmarkBody;
    try {
      if (state.bmBodyEditor && typeof state.bmBodyEditor.getValue === 'function') {
        body = state.bmBodyEditor.getValue();
      }
    } catch(e) { /* 编辑器不可用，使用 fallback */ }

    // 上传暂存文件 + 替换占位符
    var replacements = [];
    if (state.stagedFiles.length > 0) {
      var uploadResult = await uploadAllStaged();
      replacements = uploadResult.replacements;
      uploadedPaths = uploadResult.uploadedPaths;
    }
    body = replacePlaceholders(body, replacements);

    var frontMatter = Object.assign({}, state.bookmarkFrontMatter || {});
    frontMatter.title = title || frontMatter.title || '一些好用的网站推荐';
    frontMatter.bookmarks = state.bookmarks;

    var fullContent = buildMarkdown(frontMatter, body);
    await saveFile(BOOKMARK_POST_PATH, fullContent, state.bookmarkSha, 'admin: update bookmarks');

    var updated = await fetchFile(BOOKMARK_POST_PATH);
    state.bookmarkSha = updated.sha;

    clearStagedFiles();
    showToast('书签已保存！', 'success');
    setStatus('书签已保存 · ' + new Date().toLocaleTimeString());
  } catch (e) {
    // 失败：回滚已上传文件 + 保留暂存
    if (uploadedPaths.length > 0) {
      setStatus('保存失败，清理已上传文件...');
      await cleanupUploadedFiles(uploadedPaths);
    }
    showToast('保存失败：' + e.message, 'error');
    setStatus('保存失败');
  } finally {
    btn.disabled = false;
    btn.textContent = '保存书签';
  }
}

// ====== 应用入口 ======
function initApp() {
  renderArticleList();
  // 预初始化新建文章面板（不显示，但编辑器就绪）
  // 首次点击"新建文章"时才真正初始化
  setStatus('就绪');
}

// ====== 页面卸载前清理 blob URL ======
window.addEventListener('beforeunload', function() {
  clearStagedFiles();
});
