window.SEC_5_7 = function(){ return `
<h1 class="sec-title">5.7 多处理器基本概念</h1>
<div class="sec-meta">
  <b>考点定位</b> · 主要是概念辨析题 · Flynn 分类与共享内存模型是近几年考过的点
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">
    当单个 CPU 性能到头，出路是"<b>多干一点</b>"——同时处理多个指令流/数据流。
    本节理清三种并行层次：<em>指令/数据并行（Flynn）</em>、<em>线程并行（SMT/多核）</em>、<em>任务并行（多处理器系统）</em>。
  </p>
</div>

<!-- ============================================ 5.7.1 ============================================ -->
<h2 class="h2">5.7.1 SISD / SIMD / MIMD <span class="sub-tag" style="margin-left:10px">§5.7.1</span></h2>

<p><b>Flynn 分类</b>：按"<b>指令流</b>数" × "<b>数据流</b>数"分 4 类。MISD 在实际计算机中几乎没有，所以重点记 SISD、SIMD、MIMD。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.7.1</span> Flynn 四分类矩阵</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- 表头 -->
    <text x="200" y="40" text-anchor="middle" class="t-title">单数据流 SD</text>
    <text x="550" y="40" text-anchor="middle" class="t-title">多数据流 MD</text>
    <text x="60" y="120" class="t-title" transform="rotate(-90, 60, 120)">单指令流 SI</text>
    <text x="60" y="220" class="t-title" transform="rotate(-90, 60, 220)">多指令流 MI</text>

    <!-- 四象限 -->
    <rect x="100" y="60" width="300" height="90" rx="10" fill="#DBEAFE" stroke="#2563EB"/>
    <text x="250" y="90" text-anchor="middle" class="t-title" fill="#1E3A8A">SISD</text>
    <text x="250" y="112" text-anchor="middle" class="t-small">单处理器 / 冯·诺依曼机</text>
    <text x="250" y="130" text-anchor="middle" class="t-small">一条指令操作一个数据</text>

    <rect x="420" y="60" width="300" height="90" rx="10" fill="#D1FAE5" stroke="#059669"/>
    <text x="570" y="90" text-anchor="middle" class="t-title" fill="#065F46">SIMD</text>
    <text x="570" y="112" text-anchor="middle" class="t-small">向量机 / GPU / x86 SSE/AVX</text>
    <text x="570" y="130" text-anchor="middle" class="t-small">一条指令同时处理多个数据</text>

    <rect x="100" y="160" width="300" height="90" rx="10" fill="#FEE2E2" stroke="#DC2626"/>
    <text x="250" y="190" text-anchor="middle" class="t-title" fill="#991B1B">MISD</text>
    <text x="250" y="212" text-anchor="middle" class="t-small">几乎不存在的架构</text>
    <text x="250" y="230" text-anchor="middle" class="t-small">只在容错系统中偶见</text>

    <rect x="420" y="160" width="300" height="90" rx="10" fill="#E0E7FF" stroke="#6366F1"/>
    <text x="570" y="190" text-anchor="middle" class="t-title" fill="#3730A3">MIMD</text>
    <text x="570" y="212" text-anchor="middle" class="t-small">多核处理器 · 集群 · 云计算</text>
    <text x="570" y="230" text-anchor="middle" class="t-small">各核独立执行各自的程序和数据</text>
  </svg>
</div>

<table class="tbl">
  <thead><tr><th>类别</th><th>指令流 × 数据流</th><th>典型代表</th><th>并行粒度</th></tr></thead>
  <tbody>
    <tr><td><b>SISD</b></td><td>1 × 1</td><td>单核 CPU</td><td>指令级（通过流水线）</td></tr>
    <tr><td><b>SIMD</b></td><td>1 × N</td><td>向量机、GPU、SSE/AVX</td><td>数据级</td></tr>
    <tr><td><b>MISD</b></td><td>N × 1</td><td>极少见</td><td>—</td></tr>
    <tr><td><b>MIMD</b></td><td>N × N</td><td>多核、多处理器系统、集群</td><td>线程/任务级</td></tr>
  </tbody>
</table>

<p>MIMD 进一步按内存组织分：</p>
<div class="compare">
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#4F46E5"></span>共享内存 Shared Memory</div>
    <ul>
      <li>所有处理器访问<b>同一物理地址空间</b></li>
      <li>通信靠读写内存（隐式）</li>
      <li>UMA（均匀访存）/ NUMA（非均匀）</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#DC2626"></span>消息传递 Message Passing</div>
    <ul>
      <li>各处理器各有<b>私有内存</b></li>
      <li>通信靠发消息（显式）</li>
      <li>典型：集群、MPI</li>
    </ul>
  </div>
</div>

<!-- ============================================ 5.7.2 ============================================ -->
<h2 class="h2">5.7.2 硬件多线程 <span class="sub-tag" style="margin-left:10px">§5.7.2</span></h2>

<p>在<b>一个</b>物理核上，让多个硬件线程<b>共享流水线</b>，用硬件切换来掩盖访存延迟、提高部件利用率。三种策略：</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.7.2</span> 三种硬件多线程调度</div>
  <div class="toggle-row" id="mt-tgl">
    <button class="tgl active" data-tgl="mt" data-val="cg">① 粗粒度 CGMT</button>
    <button class="tgl" data-tgl="mt" data-val="fg">② 细粒度 FGMT</button>
    <button class="tgl" data-tgl="mt" data-val="smt">③ 同时多线程 SMT</button>
  </div>
  <svg viewBox="0 0 820 200" xmlns="http://www.w3.org/2000/svg" id="mt-svg"></svg>
  <div class="step-note" id="mt-note"></div>
</div>

<table class="tbl">
  <thead><tr><th>类型</th><th>切换时机</th><th>每周期指令来自</th><th>代表</th></tr></thead>
  <tbody>
    <tr><td><b>粗粒度 CGMT</b></td><td>发生<b>长延迟</b>（Cache miss）才切换</td><td>同一线程</td><td>早期多线程 CPU</td></tr>
    <tr><td><b>细粒度 FGMT</b></td><td>每一拍都轮转</td><td>同一线程</td><td>Sun UltraSPARC T1</td></tr>
    <tr><td><b>同时多线程 SMT</b></td><td>每拍从<b>多条流水线</b>中选</td><td><b>多个线程的指令混合</b></td><td>Intel HT / AMD SMT</td></tr>
  </tbody>
</table>

<div class="callout brand">
  <div class="co-icon">★</div>
  <div class="co-body">
    <div class="co-title">SMT 为什么高效</div>
    <p>超标量处理器一个周期能发射 N 条指令，但单线程常常凑不够 N 条独立指令。SMT 把多条线程的指令混着发，<b>填满了闲置的发射槽</b>。</p>
  </div>
</div>

<!-- ============================================ 5.7.3 ============================================ -->
<h2 class="h2">5.7.3 多核处理器 <span class="sub-tag" style="margin-left:10px">§5.7.3</span></h2>

<p>在<b>一块芯片</b>上集成多个完整的 CPU 核。典型现代处理器结构：</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.7.3</span> 四核处理器（每核私有 L1/L2 + 共享 L3）</div>
  <svg viewBox="0 0 820 330" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="20" width="760" height="290" rx="16" fill="#FAFAFA" stroke="#18181B" stroke-dasharray="5 4"/>
    <text x="50" y="42" class="t-title">芯片 Die</text>

    ${[0,1,2,3].map(i => {
      const x = 60 + i*180;
      return `
      <rect x="${x}" y="60" width="160" height="170" rx="10" fill="#fff" stroke="#4F46E5"/>
      <text x="${x+80}" y="84" text-anchor="middle" class="t-label" style="font-weight:700;fill:#312E81">Core ${i+1}</text>
      <rect x="${x+20}" y="100" width="120" height="34" rx="4" fill="#EEF2FF" stroke="#818CF8"/>
      <text x="${x+80}" y="122" text-anchor="middle" class="t-small">ALU · 寄存器</text>
      <rect x="${x+20}" y="142" width="120" height="34" rx="4" fill="#DBEAFE" stroke="#60A5FA"/>
      <text x="${x+80}" y="164" text-anchor="middle" class="t-small">L1 I-Cache / D-Cache</text>
      <rect x="${x+20}" y="184" width="120" height="34" rx="4" fill="#BFDBFE" stroke="#3B82F6"/>
      <text x="${x+80}" y="206" text-anchor="middle" class="t-small">L2 Cache（私有）</text>
    `;}).join("")}

    <rect x="60" y="250" width="700" height="40" rx="8" fill="#FEF3C7" stroke="#D97706"/>
    <text x="410" y="274" text-anchor="middle" class="t-label" style="font-weight:700;fill:#92400E">L3 Cache（共享） · 片上互连 · 通向内存控制器</text>
  </svg>
</div>

<div class="row-2">
  <div>
    <h4 class="h4">多核 vs 多处理器 vs SMT</h4>
    <ul>
      <li><b>多处理器</b>：多块芯片、每块一个处理器（板级）。</li>
      <li><b>多核</b>：一块芯片里多个完整核心（片级）。</li>
      <li><b>SMT</b>：一个核里让多个硬件线程共享流水线（核内）。</li>
    </ul>
    <p style="margin-top:10px">三者是递进关系：粒度由粗到细，资源共享由少到多。</p>
  </div>
  <div>
    <h4 class="h4">多核的优点</h4>
    <ul>
      <li>片内互连带宽大、延迟小</li>
      <li>共享 L3 / 内存控制器 → 成本低</li>
      <li>功耗可控 → 单核频率无需太高</li>
    </ul>
  </div>
</div>

<!-- ============================================ 5.7.4 ============================================ -->
<h2 class="h2">5.7.4 共享内存多处理器 <span class="sub-tag" style="margin-left:10px">§5.7.4</span></h2>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.7.4</span> UMA vs NUMA</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- UMA -->
    <text x="200" y="30" text-anchor="middle" class="t-title">UMA · 均匀访存</text>
    ${[0,1,2].map(i => `
      <rect x="${70 + i*90}" y="50" width="70" height="40" rx="6" fill="#EEF2FF" stroke="#4F46E5"/>
      <text x="${105 + i*90}" y="74" text-anchor="middle" class="t-label">P${i+1}</text>
      <line x1="${105 + i*90}" y1="90" x2="${105 + i*90}" y2="140" class="stroke-line"/>
    `).join("")}
    <rect x="70" y="140" width="250" height="30" fill="#FEF3C7" stroke="#D97706"/>
    <text x="195" y="160" text-anchor="middle" class="t-label" style="font-weight:700;fill:#92400E">共享总线</text>
    <rect x="70" y="190" width="250" height="40" rx="6" fill="#F5F3FF" stroke="#7C3AED"/>
    <text x="195" y="214" text-anchor="middle" class="t-label" style="font-weight:700;fill:#5B21B6">统一主存</text>
    <text x="195" y="248" text-anchor="middle" class="t-small">任一处理器访问任一地址延迟相同</text>

    <!-- NUMA -->
    <text x="610" y="30" text-anchor="middle" class="t-title">NUMA · 非均匀访存</text>
    ${[0,1,2].map(i => {
      const x = 450 + i*110;
      return `
      <rect x="${x}" y="50" width="80" height="40" rx="6" fill="#EEF2FF" stroke="#4F46E5"/>
      <text x="${x+40}" y="74" text-anchor="middle" class="t-label">P${i+1}</text>
      <rect x="${x}" y="100" width="80" height="30" rx="5" fill="#F5F3FF" stroke="#7C3AED"/>
      <text x="${x+40}" y="120" text-anchor="middle" class="t-small">本地 Mem</text>
      <line x1="${x+40}" y1="130" x2="${x+40}" y2="175" class="stroke-line"/>
    `;}).join("")}
    <rect x="440" y="175" width="340" height="30" fill="#FEE2E2" stroke="#DC2626"/>
    <text x="610" y="195" text-anchor="middle" class="t-label" style="font-weight:700;fill:#991B1B">互连网络</text>
    <text x="610" y="230" text-anchor="middle" class="t-small">访问本地快、访问远端慢</text>
  </svg>
</div>

<table class="tbl">
  <thead><tr><th>对比</th><th>UMA</th><th>NUMA</th></tr></thead>
  <tbody>
    <tr><td>访存延迟</td><td>对所有 P 相同</td><td>本地快、远端慢</td></tr>
    <tr><td>可扩展性</td><td>差（共享总线瓶颈）</td><td><b>好</b></td></tr>
    <tr><td>编程难度</td><td>简单</td><td>需考虑数据布局</td></tr>
    <tr><td>典型</td><td>桌面多核（通过共享 L3）</td><td>服务器多路 CPU</td></tr>
  </tbody>
</table>

<h3 class="h3">Cache 一致性问题</h3>
<p>多核各有私有 Cache，如果两个核都缓存了同一个地址的数据，一个改了——另一个怎么知道？这就是<b>缓存一致性</b>问题。</p>
<ul>
  <li><b>MESI 协议</b>（Modified / Exclusive / Shared / Invalid）：每个 Cache 行维护状态，用"<b>总线侦听</b>"或"<b>目录</b>"通知其他核。</li>
  <li>写策略：写直达 vs 写回；写传播靠"写广播"或"写失效"。</li>
</ul>

<div class="callout info">
  <div class="co-icon">i</div>
  <div class="co-body">
    <div class="co-title">一致性 vs 同步</div>
    <p><b>一致性</b>：任何时刻多个 Cache 看到的同一地址值必须相同（硬件保证）。<b>同步</b>：多个线程按正确顺序访问共享资源（软件用互斥锁/信号量保证）。</p>
  </div>
</div>

<div class="mnemonic">
  <div class="mn-label">记</div>
  <div class="mn-body">
    并行三个层次：<b>数据级 (SIMD)</b> · <b>线程级 (SMT/多核)</b> · <b>任务级 (多机/集群)</b>。<br/>
    共享内存：<b>UMA 一碗水端平、NUMA 远近有别</b>。
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2017 年 408</span><span class="exam-tag">选择题</span></div>
  <div class="exam-body">
    <div class="q">下列关于多核处理器的叙述中，错误的是（ ）。<br/>
      A. 每个核心都有自己的寄存器组　B. 每个核心都有自己的 L1 Cache<br/>
      C. 每个核心都有自己的主存　　　D. 多个核心通常共享最后一级 Cache</div>
    <div class="exam-ans">C。主存是全片共享的；即使是 NUMA，"本地内存"也是逻辑上共享地址空间的一部分。</div>
  </div>
</div>
`; };

window.INIT_5_7 = function(){
  // 硬件多线程示意
  const svg = document.getElementById("mt-svg");
  const note = document.getElementById("mt-note");
  function renderMT(v){
    const cycles = 12, rows = 2, cellW = 50, cellH = 40, x0 = 70, y0 = 40;
    let out = "";
    // 表头
    for(let c=0;c<cycles;c++){
      out += `<text x="${x0+c*cellW+cellW/2}" y="${y0-10}" text-anchor="middle" class="pipe-hdr">C${c+1}</text>`;
    }
    out += `<text x="${x0-10}" y="${y0+cellH/2+4}" text-anchor="end" class="pipe-hdr">发射槽 1</text>`;
    if(v === "smt") out += `<text x="${x0-10}" y="${y0+cellH+cellH/2+4}" text-anchor="end" class="pipe-hdr">发射槽 2</text>`;

    const colors = { T1:"#DBEAFE", T2:"#FEF3C7", T3:"#D1FAE5", ST:"#F4F4F2" };
    function cell(x,y,w,h,t){
      const col = colors[t] || "#fff";
      const fn = t === "ST" ? "pipe-bubble" : "";
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="pipe-cell ${fn}" fill="${col}"/>
              <text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" class="pipe-text">${t === "ST" ? "—" : t}</text>`;
    }

    let seq;
    if(v === "cg"){
      // 粗粒度：T1 跑好几拍，遇到 miss 后切 T2
      seq = ["T1","T1","T1","T1","ST","ST","T2","T2","T2","T2","T1","T1"];
    } else if(v === "fg"){
      seq = ["T1","T2","T3","T1","T2","T3","T1","T2","T3","T1","T2","T3"];
    } else {
      // SMT 双发射
      for(let c=0;c<cycles;c++){
        out += cell(x0+c*cellW, y0, cellW, cellH, ["T1","T2","T1","T2","T3","T1","T2","T3","T1","T2","T1","T3"][c]);
        out += cell(x0+c*cellW, y0+cellH, cellW, cellH, ["T2","T3","T3","T1","T1","T3","T1","T2","T2","T3","T3","T1"][c]);
      }
      svg.innerHTML = out;
      note.innerHTML = `<span class="sn-step">SMT</span>每周期从多个线程的就绪指令中<b>混合发射</b>，填满所有发射槽——利用率最高。`;
      return;
    }
    seq.forEach((t,c) => out += cell(x0+c*cellW, y0, cellW, cellH, t));
    svg.innerHTML = out;
    const txt = v === "cg"
      ? "发生长延迟事件（Cache miss）时，才切换到别的线程。切换开销小，但单线程阻塞时才能用到并行。"
      : "每周期都轮转切线程。需要为每个线程维护独立的 PC 和寄存器组。";
    note.innerHTML = `<span class="sn-step">${v.toUpperCase()}</span>${txt}`;
  }
  bindToggles("#mt-tgl","mt",renderMT);
  renderMT("cg");
};
