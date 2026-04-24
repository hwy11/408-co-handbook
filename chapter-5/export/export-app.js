// ==================================================================
// 导出页面主逻辑：探测文件 → fetch 字节流 → 交给 ZipWriter 打包
// ==================================================================

(function () {
  'use strict';

  // ---- 默认文件清单：本手册站点全部源文件 ----
  const DEFAULT_MANIFEST = [
    'index.html',
    'export.html',
    'app.js',
    'styles/base.css',
    'styles/components.css',
    'styles/diagrams.css',
    'sections/5-1.js',
    'sections/5-2.js',
    'sections/5-3.js',
    'sections/5-4.js',
    'sections/5-5.js',
    'sections/5-6.js',
    'sections/5-7.js',
    'export/zip-writer.js',
    'export/export-app.js',
  ];

  // ---- DOM ----
  const $ = (id) => document.getElementById(id);
  const el = {
    baseUrl:    $('baseUrl'),
    customList: $('customList'),
    zipName:    $('zipName'),
    fileList:   $('fileList'),
    bar:        $('bar'),
    statLeft:   $('statLeft'),
    statRight:  $('statRight'),
    exportBtn:  $('exportBtn'),
    refreshBtn: $('refreshBtn'),
    log:        $('log'),
    result:     $('result'),
    resultTitle:$('resultTitle'),
    resultMeta: $('resultMeta'),
    downloadLink: $('downloadLink'),
  };

  // ---- 日志 ----
  function now() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3,'0')}`;
  }
  function log(msg, level = '') {
    const line = document.createElement('div');
    line.innerHTML = `<span class="t">${now()}</span><span class="${level}">${msg}</span>`;
    el.log.appendChild(line);
    el.log.scrollTop = el.log.scrollHeight;
  }

  // ---- 状态 ----
  let state = {
    files: [],        // { path, status: 'idle'|'loading'|'ok'|'err', size, bytes, err, row }
    running: false,
  };

  // ---- 清单获取 ----
  function getManifest() {
    const custom = el.customList.value.trim();
    if (custom) {
      return custom.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return DEFAULT_MANIFEST.slice();
  }

  // ---- 人类可读字节 ----
  function fmtBytes(n) {
    if (n == null) return '—';
    if (n < 1024) return n + ' B';
    if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
    return (n/1024/1024).toFixed(2) + ' MB';
  }

  // ---- 渲染文件清单 ----
  function renderFileList() {
    el.fileList.innerHTML = '';
    state.files.forEach((f) => {
      const row = document.createElement('div');
      row.className = 'filerow';
      row.innerHTML = `
        <div class="st ${f.status}"></div>
        <div class="path">${f.path}</div>
        <div class="sz">${f.size != null ? fmtBytes(f.size) : ''}</div>
      `;
      el.fileList.appendChild(row);
      f.row = row;
      updateRow(f);
    });
  }

  const GLYPH = { idle:'·', loading:'◐', ok:'✓', err:'✕' };
  function updateRow(f) {
    if (!f.row) return;
    const st = f.row.querySelector('.st');
    st.className = 'st ' + f.status;
    st.textContent = GLYPH[f.status] || '·';
    f.row.querySelector('.sz').textContent = f.size != null ? fmtBytes(f.size) : '';
    if (f.err) {
      f.row.querySelector('.path').title = f.err;
    }
  }

  // ---- 初始化文件状态 ----
  function initFiles() {
    state.files = getManifest().map(p => ({
      path: p, status: 'idle', size: null, bytes: null, err: null, row: null,
    }));
    renderFileList();
    el.statLeft.textContent = '待探测';
    el.statRight.textContent = `0 / ${state.files.length}`;
    el.bar.style.width = '0%';
    el.result.classList.remove('show');
  }

  // ---- 探测单个文件是否存在 + 获取大小 ----
  async function probeFile(f, baseUrl) {
    const url = joinUrl(baseUrl, f.path);
    try {
      // 大多数静态托管不给 HEAD CORS，所以直接用带 Range 的小 GET 试探；失败则回退
      const res = await fetch(url, { method: 'HEAD' }).catch(() => null);
      if (res && res.ok) {
        const cl = res.headers.get('Content-Length');
        if (cl) f.size = parseInt(cl, 10);
        f.status = 'ok';
      } else {
        // HEAD 不可用或失败；先标 idle，等 fetch 时再判断
        f.status = 'idle';
      }
    } catch (e) {
      f.status = 'idle';
    }
    updateRow(f);
  }

  // ---- 拉取单个文件 ----
  async function fetchFile(f, baseUrl) {
    const url = joinUrl(baseUrl, f.path);
    f.status = 'loading';
    updateRow(f);
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = await res.arrayBuffer();
      f.bytes = new Uint8Array(buf);
      f.size = f.bytes.length;
      f.status = 'ok';
      log(`  ✓ ${f.path} <span class="info">${fmtBytes(f.size)}</span>`, 'ok');
    } catch (e) {
      f.status = 'err';
      f.err = e.message;
      log(`  ✕ ${f.path} — ${e.message}`, 'err');
    }
    updateRow(f);
  }

  function joinUrl(base, rel) {
    if (!base) return rel;
    if (base.endsWith('/')) return base + rel;
    return base + '/' + rel;
  }

  // ---- 主流程 ----
  async function runExport() {
    if (state.running) return;
    state.running = true;
    el.exportBtn.disabled = true;
    el.refreshBtn.disabled = true;
    el.result.classList.remove('show');
    el.log.innerHTML = '';

    const baseUrl = el.baseUrl.value.trim() || './';
    const zipName = (el.zipName.value.trim() || 'archive.zip').replace(/[^\w.\-]+/g, '_');

    log(`<span class="info">▸ 开始导出</span>  base=<b>${baseUrl}</b>  zip=<b>${zipName}</b>`, 'info');
    log(`  清单共 ${state.files.length} 个文件`);

    // 并发 fetch，限制并发数避免浏览器过载
    const CONCURRENCY = 6;
    let done = 0;
    const total = state.files.length;
    const queue = state.files.slice();

    async function worker() {
      while (queue.length) {
        const f = queue.shift();
        await fetchFile(f, baseUrl);
        done++;
        el.statRight.textContent = `${done} / ${total}`;
        el.bar.style.width = (done / total * 100).toFixed(1) + '%';
        el.statLeft.textContent = `拉取中… (${done}/${total})`;
      }
    }
    const workers = Array.from({ length: Math.min(CONCURRENCY, state.files.length) }, worker);
    await Promise.all(workers);

    // 过滤成功的
    const okFiles = state.files.filter(f => f.status === 'ok' && f.bytes);
    const failed  = state.files.filter(f => f.status === 'err');

    if (okFiles.length === 0) {
      log(`<span class="err">所有文件拉取失败，无法打包。</span>`, 'err');
      el.statLeft.textContent = '失败';
      state.running = false;
      el.exportBtn.disabled = false;
      el.refreshBtn.disabled = false;
      return;
    }

    log(`<span class="info">▸ 所有文件就绪，开始组装 ZIP…</span>`, 'info');
    el.statLeft.textContent = '组装 ZIP…';

    // 允许 UI 刷一帧
    await new Promise(r => requestAnimationFrame(r));

    let totalIn = 0;
    for (const f of okFiles) totalIn += f.size;

    const t0 = performance.now();
    let zipBytes;
    try {
      zipBytes = ZipWriter.buildZip(
        okFiles.map(f => ({ name: f.path, data: f.bytes }))
      );
    } catch (e) {
      log(`<span class="err">✕ 打包失败：${e.message}</span>`, 'err');
      state.running = false;
      el.exportBtn.disabled = false;
      el.refreshBtn.disabled = false;
      return;
    }
    const t1 = performance.now();

    log(`  CRC32 × ${okFiles.length} + LFH/CD/EOCD 组装完毕，用时 <b>${(t1-t0).toFixed(1)} ms</b>`, 'ok');
    log(`  原始字节合计：<b>${fmtBytes(totalIn)}</b>  →  ZIP：<b>${fmtBytes(zipBytes.length)}</b>  (store 模式)`, 'ok');
    if (failed.length) {
      log(`  <span class="warn">⚠ 跳过 ${failed.length} 个失败文件</span>`, 'warn');
    }

    // 触发下载
    const blob = new Blob([zipBytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); }, 200);

    log(`<span class="ok">✓ 已触发浏览器下载：${zipName}</span>`, 'ok');

    // 结果面板
    el.resultTitle.textContent = `✓ 打包完成 · ${zipName}`;
    el.resultMeta.innerHTML =
      `${okFiles.length} 个文件 · 总 ${fmtBytes(zipBytes.length)} · 组装 ${(t1-t0).toFixed(1)} ms`;
    el.downloadLink.href = url;
    el.downloadLink.download = zipName;
    el.result.classList.add('show');
    el.statLeft.textContent = '完成';
    el.bar.style.width = '100%';

    state.running = false;
    el.exportBtn.disabled = false;
    el.refreshBtn.disabled = false;
  }

  // ---- 探测流程（点"重新探测"按钮时跑） ----
  async function runProbe() {
    if (state.running) return;
    initFiles();
    const baseUrl = el.baseUrl.value.trim() || './';
    log(`<span class="info">▸ 探测文件存在性</span>  base=<b>${baseUrl}</b>`, 'info');
    el.statLeft.textContent = '探测中…';
    // 并发 HEAD
    const CONCURRENCY = 8;
    const queue = state.files.slice();
    async function worker() {
      while (queue.length) {
        const f = queue.shift();
        await probeFile(f, baseUrl);
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    const okCount = state.files.filter(f => f.status === 'ok').length;
    log(`  HEAD 响应 ${okCount}/${state.files.length}（未响应的将在打包时通过 GET 验证）`);
    el.statLeft.textContent = '就绪';
  }

  // ---- 绑定事件 ----
  el.exportBtn.addEventListener('click', runExport);
  el.refreshBtn.addEventListener('click', runProbe);
  el.customList.addEventListener('blur', initFiles);

  // ---- 启动 ----
  initFiles();
  log(`<span class="info">ZipWriter 已载入</span> · 可打包文件数上限 65535（ZIP32）`, 'info');
  log(`  默认清单 ${DEFAULT_MANIFEST.length} 个文件，点「开始打包」立即导出`, '');

})();
