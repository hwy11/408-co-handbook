// ==================================================================
// 浏览器端 ZIP Writer · store 模式（无压缩）
// 规范：APPNOTE.TXT v6.3.x
// 结构：[LFH + data] × n  →  [CD header] × n  →  EOCD
// ==================================================================

(function (global) {
  'use strict';

  // ---------- CRC32（IEEE 802.3 / PKZIP 多项式 0xEDB88320，查表法） ----------
  const CRC_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      tbl[n] = c >>> 0;
    }
    return tbl;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  // ---------- 小端序写入辅助 ----------
  function u16(v) {
    return new Uint8Array([v & 0xFF, (v >>> 8) & 0xFF]);
  }
  function u32(v) {
    return new Uint8Array([
      v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF
    ]);
  }
  function concat(arrays) {
    let total = 0;
    for (const a of arrays) total += a.length;
    const out = new Uint8Array(total);
    let off = 0;
    for (const a of arrays) { out.set(a, off); off += a.length; }
    return out;
  }

  // ---------- DOS 时间戳（把 JS Date 转 DOS time / date 两段 16 位） ----------
  function dosDateTime(d) {
    const year = d.getFullYear();
    if (year < 1980) {
      // ZIP 纪元从 1980 开始
      return { date: 0x0021, time: 0 }; // 1980-01-01 00:00:00
    }
    const time =
      ((d.getHours()   & 0x1F) << 11) |
      ((d.getMinutes() & 0x3F) << 5)  |
      ((Math.floor(d.getSeconds() / 2)) & 0x1F);
    const date =
      (((year - 1980) & 0x7F) << 9) |
      (((d.getMonth() + 1) & 0x0F) << 5) |
      (d.getDate() & 0x1F);
    return { date, time };
  }

  // ---------- UTF-8 编码 ----------
  const ENC = new TextEncoder();
  function encodeName(name) {
    // 规范化：去掉前导 ./，强制正斜杠
    const s = name.replace(/^\.\//, '').replace(/\\/g, '/');
    return ENC.encode(s);
  }

  // ==================================================================
  // 核心：把一组 { name, data(Uint8Array), date? } 打成单个 ZIP Uint8Array
  // ==================================================================
  //
  //   LFH (Local File Header) — 每个文件前头：
  //   ┌──────┬──────────────────────────────────────────────────────┐
  //   │ 0x04034b50 │ ver=20 │ flags=0x800(UTF-8) │ method=0 (store) │
  //   │ mtime │ mdate │ crc32 │ compressed=sz │ uncompressed=sz     │
  //   │ name_len │ extra_len=0 │ <name bytes> │ <file data>         │
  //   └──────┴──────────────────────────────────────────────────────┘
  //
  //   CD (Central Directory Header)：
  //   ┌──────────────────────────────────────────────────────────────┐
  //   │ 0x02014b50 │ ver_made_by=20 │ ver_needed=20 │ flags │ method │
  //   │ mtime │ mdate │ crc │ csz │ usz │ name_len │ extra_len=0    │
  //   │ comment_len=0 │ disk=0 │ int_attr=0 │ ext_attr=0             │
  //   │ local_header_offset │ <name bytes>                           │
  //   └──────────────────────────────────────────────────────────────┘
  //
  //   EOCD (End Of Central Directory)：
  //   ┌──────────────────────────────────────────────────────────────┐
  //   │ 0x06054b50 │ disk=0 │ cd_disk=0 │ entries_on_disk=n          │
  //   │ total_entries=n │ cd_size │ cd_offset │ comment_len=0        │
  //   └──────────────────────────────────────────────────────────────┘
  //
  // 参考实现：手写，最小可用子集。
  // ==================================================================
  function buildZip(entries) {
    const chunks = [];            // 所有 LFH+data 的字节片段（顺序）
    const cdChunks = [];          // 所有 CD 记录
    let offset = 0;               // 当前写入偏移（供 CD 的 local_header_offset）

    for (const ent of entries) {
      const nameBytes = encodeName(ent.name);
      const data = ent.data instanceof Uint8Array ? ent.data : new Uint8Array(ent.data);
      const crc = crc32(data);
      const size = data.length;
      const dt = dosDateTime(ent.date || new Date());

      // ---- 构造 Local File Header ----
      // 4  signature   0x04034b50
      // 2  ver_needed  20
      // 2  flags       0x0800  (bit 11: UTF-8 filename)
      // 2  method      0       (store)
      // 2  mtime
      // 2  mdate
      // 4  crc32
      // 4  compressed_size    (= size，store 模式)
      // 4  uncompressed_size
      // 2  name_len
      // 2  extra_len   0
      const lfh = concat([
        u32(0x04034b50),
        u16(20),
        u16(0x0800),
        u16(0),
        u16(dt.time),
        u16(dt.date),
        u32(crc),
        u32(size),
        u32(size),
        u16(nameBytes.length),
        u16(0),
        nameBytes
      ]);
      chunks.push(lfh);
      chunks.push(data);

      // ---- 构造 Central Directory 记录（先缓存，最后拼） ----
      // 4  signature    0x02014b50
      // 2  ver_made_by  20
      // 2  ver_needed   20
      // 2  flags        0x0800
      // 2  method       0
      // 2  mtime
      // 2  mdate
      // 4  crc32
      // 4  compressed_size
      // 4  uncompressed_size
      // 2  name_len
      // 2  extra_len    0
      // 2  comment_len  0
      // 2  disk_start   0
      // 2  int_attr     0
      // 4  ext_attr     0
      // 4  local_header_offset
      // + name
      const cd = concat([
        u32(0x02014b50),
        u16(20),
        u16(20),
        u16(0x0800),
        u16(0),
        u16(dt.time),
        u16(dt.date),
        u32(crc),
        u32(size),
        u32(size),
        u16(nameBytes.length),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(0),
        u32(offset),
        nameBytes
      ]);
      cdChunks.push(cd);

      // 更新写入偏移（LFH 总长 + 文件数据）
      offset += lfh.length + data.length;
    }

    // 拼 Central Directory
    const cdStart = offset;
    let cdSize = 0;
    for (const c of cdChunks) cdSize += c.length;

    // ---- 构造 EOCD ----
    // 4  signature          0x06054b50
    // 2  disk               0
    // 2  cd_disk            0
    // 2  entries_on_disk
    // 2  total_entries
    // 4  cd_size
    // 4  cd_offset
    // 2  comment_len        0
    const n = entries.length;
    if (n > 0xFFFF) {
      throw new Error('文件数超过 65535（需 ZIP64 扩展，未实现）');
    }
    const eocd = concat([
      u32(0x06054b50),
      u16(0),
      u16(0),
      u16(n),
      u16(n),
      u32(cdSize),
      u32(cdStart),
      u16(0)
    ]);

    // 合并所有段
    return concat([...chunks, ...cdChunks, eocd]);
  }

  // ---------- 便捷：直接下载 ----------
  function downloadZip(filename, entries) {
    const bytes = buildZip(entries);
    const blob = new Blob([bytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 100);
    return { blob, size: bytes.length, url };
  }

  // ---------- 导出 ----------
  global.ZipWriter = {
    buildZip,
    downloadZip,
    crc32,
    _internals: { CRC_TABLE, dosDateTime, encodeName }
  };

})(window);
