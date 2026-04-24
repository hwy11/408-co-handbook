window.SEC_5_6 = function(){ return `
<h1 class="sec-title">5.6 指令流水线</h1>
<div class="sec-meta">
  <b>考点定位</b> · 本章分值权重最高的一节 · 时空图、冒险分析、性能公式几乎年年考
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">
    把一条指令切成几段，让多条指令<b>像工厂流水线一样重叠</b>进行——这就是流水线。
    本节把它拆成四件事：<em>为什么能这么干</em>、<em>怎么实现</em>、<em>哪些情况会翻车</em>、<em>怎么算性能</em>。
  </p>
</div>

<!-- ============================================ 5.6.1 ============================================ -->
<h2 class="h2">5.6.1 基本概念 <span class="sub-tag" style="margin-left:10px">§5.6.1</span></h2>

<h3 class="h3">为什么能流水？——一条指令分成若干段</h3>
<p>典型的 MIPS 5 段：<b>IF</b>(取指) → <b>ID</b>(译码) → <b>EX</b>(执行/ALU) → <b>MEM</b>(访存) → <b>WB</b>(写回)。
每一段都有自己的硬件，所以<b>不同指令</b>可以同时占用<b>不同段</b>。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.6.1</span> 顺序执行 vs 流水线（5 条指令）</div>
  <div class="toggle-row" id="pipe-tgl">
    <button class="tgl active" data-tgl="pipe0" data-val="seq">顺序执行</button>
    <button class="tgl" data-tgl="pipe0" data-val="pipe">流水线执行</button>
  </div>
  <svg viewBox="0 0 820 280" xmlns="http://www.w3.org/2000/svg" id="pipe0-svg"></svg>
  <div class="legend">
    <span class="lg"><span class="lg-dot pipe-IF" style="background:#DBEAFE"></span>IF 取指</span>
    <span class="lg"><span class="lg-dot pipe-ID" style="background:#FEF3C7"></span>ID 译码</span>
    <span class="lg"><span class="lg-dot pipe-EX" style="background:#D1FAE5"></span>EX 执行</span>
    <span class="lg"><span class="lg-dot pipe-MEM" style="background:#FCE7F3"></span>MEM 访存</span>
    <span class="lg"><span class="lg-dot pipe-WB" style="background:#E0E7FF"></span>WB 写回</span>
  </div>
</div>

<div class="stat-grid">
  <div class="stat"><div class="s-num">k + n − 1</div><div class="s-lbl">n 条指令流水执行所需周期（k 段）</div></div>
  <div class="stat"><div class="s-num">kn</div><div class="s-lbl">顺序执行所需周期</div></div>
  <div class="stat"><div class="s-num">≈ k</div><div class="s-lbl">最大加速比（n→∞）</div></div>
</div>

<h3 class="h3">流水线的三要素与必要条件</h3>
<ul>
  <li><b>各段时间尽量相等</b>：总时钟周期由最慢段决定，差距大 = 浪费。</li>
  <li><b>各段独立硬件</b>：不能让不同阶段抢同一部件。</li>
  <li><b>流水段之间有锁存器</b>：IF/ID、ID/EX、EX/MEM、MEM/WB 四组<b>段间寄存器</b>，保证每段的输入在该周期稳定。</li>
</ul>

<!-- ============================================ 5.6.2 ============================================ -->
<h2 class="h2">5.6.2 基本实现 <span class="sub-tag" style="margin-left:10px">§5.6.2</span></h2>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.6.2</span> 5 段流水线的数据通路</div>
  <div class="fig-desc">绿色竖条 = 段间寄存器；它们把每一段的输出锁住，给下一段做输入。</div>
  <svg viewBox="0 0 820 280" xmlns="http://www.w3.org/2000/svg">
    <!-- 段 -->
    ${[
      ["IF", 40, "#DBEAFE", "#2563EB", "取指令\\nPC→I-MEM"],
      ["ID", 200,"#FEF3C7", "#D97706", "译码\\n读寄存器"],
      ["EX", 360,"#D1FAE5", "#059669", "ALU\\n算地址/结果"],
      ["MEM",520,"#FCE7F3", "#DB2777", "访存\\nload/store"],
      ["WB", 680,"#E0E7FF", "#6366F1", "写回\\n写寄存器组"],
    ].map(([n,x,bg,st,d]) => {
      const lines = d.split("\\n");
      return `
      <rect x="${x}" y="60" width="120" height="150" rx="10" fill="${bg}" stroke="${st}" stroke-width="1.5"/>
      <text x="${+x+60}" y="90" text-anchor="middle" class="t-title" fill="${st}" style="font-size:16px">${n}</text>
      <text x="${+x+60}" y="130" text-anchor="middle" class="t-small">${lines[0]}</text>
      <text x="${+x+60}" y="150" text-anchor="middle" class="t-small">${lines[1]||""}</text>
    `;}).join("")}
    <!-- 段间寄存器 -->
    ${[160,320,480,640].map((x,i) => `
      <rect x="${x}" y="50" width="12" height="170" fill="#059669" />
      <text x="${x+6}" y="240" text-anchor="middle" class="t-tiny">${['IF/ID','ID/EX','EX/MEM','MEM/WB'][i]}</text>
    `).join("")}
    <text x="410" y="30" text-anchor="middle" class="t-title">5 段流水线</text>
  </svg>
</div>

<!-- ============================================ 5.6.3 ============================================ -->
<h2 class="h2">5.6.3 冒险与处理 <span class="sub-tag" style="margin-left:10px">§5.6.3</span></h2>

<p>流水线美好的前提是"指令之间完全独立"。现实中三种情况会"翻车"——称为<b>流水线冒险 Hazard</b>：</p>

<div class="compare">
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#D97706"></span>结构冒险 Structural</div>
    <ul>
      <li>两条指令<b>同一周期争用同一硬件</b></li>
      <li>典型：取指和访存都用同一块内存端口</li>
      <li>解决：加端口（哈佛结构，分 I-Cache/D-Cache）</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#DC2626"></span>数据冒险 Data</div>
    <ul>
      <li>后一条指令要用前一条还没写回的结果</li>
      <li>RAW（写后读）最常见；WAR/WAW 只在乱序时</li>
      <li>解决：<b>前递 Forwarding</b> + 必要时<b>插入气泡 Stall</b></li>
    </ul>
  </div>
  <div class="cmp-card" style="grid-column:span 2">
    <div class="cmp-title"><span class="dot" style="background:#7C3AED"></span>控制冒险 Control</div>
    <ul>
      <li>分支指令到 EX/MEM 才知道是否跳；流水线已经取了后续指令</li>
      <li>解决：延迟槽、分支预测、尽早判断条件（把比较移到 ID）</li>
    </ul>
  </div>
</div>

<h3 class="h3">数据冒险实战 · RAW</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.6.3</span> RAW 冒险：没处理 / 插气泡 / 前递</div>
  <div class="toggle-row" id="raw-tgl">
    <button class="tgl active" data-tgl="raw" data-val="none">① 不处理（错）</button>
    <button class="tgl" data-tgl="raw" data-val="stall">② 插入气泡</button>
    <button class="tgl" data-tgl="raw" data-val="fwd">③ 前递（Forwarding）</button>
  </div>
  <svg viewBox="0 0 820 230" xmlns="http://www.w3.org/2000/svg" id="raw-svg"></svg>
  <div class="step-note" id="raw-note"></div>
</div>

<div class="callout info">
  <div class="co-icon">i</div>
  <div class="co-body">
    <div class="co-title">为什么"前递"能救？</div>
    <p>前一条指令的 ALU 结果<b>在 EX 段末</b>就已经算出来了，但 WB 要到 5 拍后才发生。前递就是直接把 EX/MEM 寄存器里的"半成品"送回给下一条 EX 的输入 MUX，无需等 WB。</p>
  </div>
</div>

<h3 class="h3">LOAD-USE：前递也救不了的情况</h3>
<p><code>LW R1,(R2)</code> 紧跟着用 R1——load 的结果要到 <b>MEM 段末</b>才出来，下一条的 EX 段已经要用了——必须<b>插入 1 个气泡</b>。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.6.4</span> LOAD-USE：仍需 1 拍气泡</div>
  <svg viewBox="0 0 820 140" xmlns="http://www.w3.org/2000/svg" id="loaduse-svg"></svg>
</div>

<h3 class="h3">控制冒险处理</h3>
<table class="tbl">
  <thead><tr><th>方法</th><th>思路</th><th>代价</th></tr></thead>
  <tbody>
    <tr><td>延迟槽 Delayed Branch</td><td>在分支指令后<b>硬性插入</b>若干条必执行的指令，填满流水线</td><td>编译器要找到合适指令</td></tr>
    <tr><td>静态预测 Static</td><td>总预测<b>不跳</b>或总预测<b>跳</b>；或按方向（向后跳=循环=跳）</td><td>错预测需冲刷流水线</td></tr>
    <tr><td>动态预测 Dynamic</td><td>用 BHT/BTB 根据历史决定</td><td>硬件开销大</td></tr>
    <tr><td>尽早判断</td><td>把分支条件的比较移到 ID 段</td><td>延迟缩短至 1 拍</td></tr>
  </tbody>
</table>

<!-- ============================================ 5.6.4 ============================================ -->
<h2 class="h2">5.6.4 性能指标 <span class="sub-tag" style="margin-left:10px">§5.6.4</span></h2>

<div class="callout brand">
  <div class="co-icon">Σ</div>
  <div class="co-body">
    <div class="co-title">必背三公式</div>
    <p><b>吞吐率 TP</b> = 任务数 / 完成时间。理想（k 段流水、n 任务、每段 Δt）：
       TP = n / ((k + n − 1)·Δt)</p>
    <p><b>加速比 S</b> = 顺序执行时间 / 流水线执行时间 =  kn / (k + n − 1)</p>
    <p><b>效率 E</b> = 各段"忙"时间总和 / (段数 × 流水时长) =  n / (k + n − 1)</p>
  </div>
</div>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.6.5</span> 性能随 n 的变化趋势（k = 5）</div>
  <svg viewBox="0 0 820 240" xmlns="http://www.w3.org/2000/svg">
    <!-- 坐标轴 -->
    <line x1="70" y1="20" x2="70" y2="200" class="stroke-line"/>
    <line x1="70" y1="200" x2="780" y2="200" class="stroke-line"/>
    <text x="60" y="30" class="t-small">S / E</text>
    <text x="780" y="218" text-anchor="end" class="t-small">n（任务数）</text>

    <!-- k=5 渐近线 -->
    <line x1="70" y1="40" x2="780" y2="40" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="780" y="36" text-anchor="end" class="t-tiny" fill="#DC2626">加速比上限 = k = 5</text>

    <!-- 加速比曲线 S = 5n/(4+n) -->
    <path d="${(() => {
      const pts = [];
      for(let n=1;n<=60;n++){
        const S = 5*n/(4+n);
        const x = 70 + (n/60)*(780-70);
        const y = 200 - (S/5)*(200-40);
        pts.push((pts.length===0?'M':'L')+x.toFixed(1)+','+y.toFixed(1));
      }
      return pts.join(' ');
    })()}" fill="none" stroke="#4F46E5" stroke-width="2"/>
    <text x="680" y="60" class="t-small" fill="#4F46E5">加速比 S</text>

    <!-- 效率曲线 E = n/(4+n) -->
    <path d="${(() => {
      const pts = [];
      for(let n=1;n<=60;n++){
        const E = n/(4+n);
        const x = 70 + (n/60)*(780-70);
        const y = 200 - E*(200-40);
        pts.push((pts.length===0?'M':'L')+x.toFixed(1)+','+y.toFixed(1));
      }
      return pts.join(' ');
    })()}" fill="none" stroke="#059669" stroke-width="2"/>
    <text x="680" y="110" class="t-small" fill="#059669">效率 E</text>

    <!-- 刻度 -->
    ${[0,10,20,30,40,50,60].map(n => `
      <line x1="${70 + (n/60)*710}" y1="200" x2="${70 + (n/60)*710}" y2="204" class="stroke-line-thin"/>
      <text x="${70 + (n/60)*710}" y="218" text-anchor="middle" class="t-tiny">${n}</text>
    `).join("")}
  </svg>
</div>

<div class="exam">
  <div class="exam-head"><span>例题</span><span class="exam-tag">计算</span></div>
  <div class="exam-body">
    <div class="q">5 段流水线，每段耗时 10 ns。执行 100 条指令（无冒险），求吞吐率、加速比、效率。</div>
    <div class="exam-ans">
      流水用时 = (5 + 100 − 1) × 10 ns = 1040 ns<br/>
      顺序用时 = 5 × 100 × 10 ns = 5000 ns<br/>
      <b>TP</b> = 100 / 1040 ns ≈ 9.615 × 10<sup>7</sup> 条/秒 <br/>
      <b>S</b> = 5000 / 1040 ≈ <b>4.81</b><br/>
      <b>E</b> = 100 / 520 = 100 / (5+99) ≈ <b>0.96</b>
    </div>
  </div>
</div>

<!-- ============================================ 5.6.5 ============================================ -->
<h2 class="h2">5.6.5 高级流水线技术 <span class="sub-tag" style="margin-left:10px">§5.6.5</span></h2>

<p>基本 5 段流水 CPI 理想值 = 1。要想进一步提速，需要<b>更激进</b>的组织方式。</p>

<div class="row-2">
  <div class="card">
    <h4 class="h4">① 超标量 Superscalar</h4>
    <p>每拍同时<b>发射多条</b>指令到多条流水线。理想 CPI &lt; 1（IPC &gt; 1）。硬件动态检查冲突。</p>
    <div class="t-small" style="color:var(--ink-3)">代表：Intel Pentium 之后、ARM Cortex-A 系列</div>
  </div>
  <div class="card">
    <h4 class="h4">② 超流水 Super-Pipeline</h4>
    <p>把流水段切得<b>更细</b>（如 12、20 段），时钟周期更短，频率更高。</p>
    <div class="t-small" style="color:var(--ink-3)">代价：冒险罚分更重、功耗上升</div>
  </div>
  <div class="card">
    <h4 class="h4">③ 超长指令字 VLIW</h4>
    <p>一条"超长指令"里<b>并列打包</b>多条操作，由<b>编译器</b>静态安排并行。硬件简单，编译器压力大。</p>
    <div class="t-small" style="color:var(--ink-3)">代表：Itanium、某些 DSP</div>
  </div>
  <div class="card">
    <h4 class="h4">④ 动态调度 / 乱序执行</h4>
    <p>CPU 运行时根据数据就绪情况<b>乱序</b>发射；保留站、重排序缓冲等硬件支持。</p>
    <div class="t-small" style="color:var(--ink-3)">代表：现代 x86/ARM 大核</div>
  </div>
</div>

<table class="tbl">
  <thead><tr><th>技术</th><th>CPI 理想</th><th>并行性来源</th><th>谁负责调度</th></tr></thead>
  <tbody>
    <tr><td>单流水线</td><td>= 1</td><td>阶段并行</td><td>硬件</td></tr>
    <tr><td>超标量</td><td>&lt; 1</td><td>多条并行发射</td><td>硬件（动态）</td></tr>
    <tr><td>超流水</td><td>= 1</td><td>更细分阶段、提升频率</td><td>硬件</td></tr>
    <tr><td>VLIW</td><td>&lt; 1</td><td>一条长指令内并行</td><td><b>编译器</b>（静态）</td></tr>
  </tbody>
</table>

<div class="mnemonic">
  <div class="mn-label">记</div>
  <div class="mn-body">
    <b>超标量</b> = "<i>更宽</i>"，多条同时发；<b>超流水</b> = "<i>更细</i>"，段切更小；<b>VLIW</b> = "<i>更长</i>"，打包并行。
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2014 年 408</span><span class="exam-tag">选择题</span></div>
  <div class="exam-body">
    <div class="q">某 5 段流水线，下列相邻指令序列中存在数据冒险的是（ ）。<br/>
      A. ADD R1,R2,R3 ; SUB R4,R5,R6<br/>
      B. ADD R1,R2,R3 ; SUB R4,R1,R6<br/>
      C. LW  R1,0(R2) ; ADD R3,R4,R5<br/>
      D. SW  R1,0(R2) ; ADD R3,R4,R5</div>
    <div class="exam-ans">B。第二条指令的源寄存器 R1 正是第一条的目的寄存器，构成 RAW 冒险。</div>
  </div>
</div>
`; };

window.INIT_5_6 = function(){
  // ------ 顺序 vs 流水 ------
  const stages = ["IF","ID","EX","MEM","WB"];
  const colors = {IF:"pipe-IF",ID:"pipe-ID",EX:"pipe-EX",MEM:"pipe-MEM",WB:"pipe-WB"};
  function cell(x,y,w,h,stage,label,stall){
    const cls = stall ? "pipe-bubble" : colors[stage];
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="pipe-cell ${cls}"/>
            <text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" class="pipe-text ${stall?'pipe-text-dim':''}">${label||stage}</text>`;
  }
  function grid(svgId, cycles, rows, cellsFn){
    const svg = document.getElementById(svgId);
    const cellW = 58, cellH = 28, x0 = 70, y0 = 50;
    let out = "";
    // header
    for(let c=0;c<cycles;c++){
      out += `<text x="${x0 + c*cellW + cellW/2}" y="${y0 - 10}" text-anchor="middle" class="pipe-hdr">C${c+1}</text>`;
    }
    for(let r=0;r<rows.length;r++){
      out += `<text x="${x0 - 10}" y="${y0 + r*cellH + cellH/2 + 4}" text-anchor="end" class="pipe-hdr">${rows[r]}</text>`;
    }
    out += cellsFn({x0,y0,cellW,cellH});
    svg.innerHTML = out;
  }

  function renderPipe0(val){
    const rows = ["I1","I2","I3","I4","I5"];
    const cycles = val === "seq" ? 25 : 9;
    grid("pipe0-svg", cycles, rows, ({x0,y0,cellW,cellH}) => {
      let out = "";
      rows.forEach((name,r) => {
        stages.forEach((s,i) => {
          const c = val === "seq" ? r*5 + i : r + i;
          out += cell(x0 + c*cellW, y0 + r*cellH, cellW, cellH, s);
        });
      });
      return out;
    });
    // 画竖线指示完工
    const svg = document.getElementById("pipe0-svg");
    const cellW = 58, x0 = 70;
    const done = val === "seq" ? 25 : 9;
    const y0 = 50, yE = y0 + 5*28;
    svg.innerHTML += `<line x1="${x0+done*cellW}" y1="${y0-20}" x2="${x0+done*cellW}" y2="${yE+10}" class="clk-edge"/>
                      <text x="${x0+done*cellW}" y="${yE+30}" text-anchor="middle" class="t-small">共 ${done} 周期</text>`;
  }
  bindToggles("#pipe-tgl", "pipe0", renderPipe0);
  renderPipe0("seq"); renderPipe0("pipe");

  // ------ RAW 冒险 ------
  function renderRaw(val){
    const rows = ["ADD R1,R2,R3", "SUB R4,R1,R5"];
    const cells = val === "stall" ? 9 : 8;
    grid("raw-svg", cells, rows, ({x0,y0,cellW,cellH}) => {
      let out = "";
      if(val === "none"){
        // I1: IF ID EX MEM WB 在 1..5
        // I2: IF ID EX MEM WB 在 2..6  → ID 在 C3 读 R1 但 I1 要 C5 WB 才写 → 读旧值（错）
        stages.forEach((s,i) => { out += cell(x0 + i*cellW, y0, cellW, cellH, s); });
        stages.forEach((s,i) => { out += cell(x0 + (i+1)*cellW, y0 + cellH, cellW, cellH, s); });
        out += `<rect x="${x0 + 2*cellW - 3}" y="${y0 + cellH - 3}" width="${cellW + 6}" height="${cellH + 6}" fill="none" stroke="#DC2626" stroke-width="2"/>`;
        out += `<text x="${x0 + 2.5*cellW}" y="${y0 + 3*cellH}" text-anchor="middle" class="t-small" fill="#DC2626">I2 在 C3 读 R1，但 I1 的 WB 要 C5 才发生 → 读到旧值</text>`;
      } else if(val === "stall"){
        stages.forEach((s,i) => { out += cell(x0 + i*cellW, y0, cellW, cellH, s); });
        // I2 延后 3 拍
        const plan = ["IF","stall","stall","ID","EX","MEM","WB"];
        plan.forEach((s,i) => {
          const st = s === "stall";
          out += cell(x0 + (i+1)*cellW, y0 + cellH, cellW, cellH, st ? "IF" : s, st ? "—" : s, st);
        });
        out += `<text x="${x0 + 3.5*cellW}" y="${y0 + 3*cellH}" text-anchor="middle" class="t-small" fill="#D97706">插入 3 个气泡，等待 I1 的 WB 完成</text>`;
      } else if(val === "fwd"){
        stages.forEach((s,i) => { out += cell(x0 + i*cellW, y0, cellW, cellH, s); });
        stages.forEach((s,i) => { out += cell(x0 + (i+1)*cellW, y0 + cellH, cellW, cellH, s); });
        // 画前递箭头 从 I1 EX 末 → I2 EX 前
        const ex1x = x0 + 2*cellW + cellW, y1 = y0 + cellH/2;
        const ex2x = x0 + 3*cellW, y2 = y0 + cellH + cellH/2;
        out += `<path d="M ${ex1x} ${y1} Q ${ex1x+20} ${(y1+y2)/2} ${ex2x} ${y2}" class="dataflow ok" fill="none"/>`;
        out += `<text x="${x0 + 3.5*cellW}" y="${y0 + 3*cellH}" text-anchor="middle" class="t-small" fill="#059669">EX/MEM 寄存器的结果<b>前递</b>给 I2 的 EX：零气泡</text>`;
      }
      return out;
    });
    const texts = {
      none: "不做任何处理：I2 在 ID 阶段（C3）读取的 R1 还是老值，结果必然错。",
      stall:"硬件检测到冒险，在 I2 后面插入气泡，直到 I1 写回完成，I2 才能 ID。简单但损性能。",
      fwd: "把 I1 的 EX 结果直接送回 I2 的 EX 输入 MUX——无需停顿，性能不损失。",
    };
    document.getElementById("raw-note").innerHTML = `<span class="sn-step">${val.toUpperCase()}</span>${texts[val]}`;
  }
  bindToggles("#raw-tgl","raw",renderRaw);
  renderRaw("none");

  // ------ LOAD-USE ------
  (function(){
    grid("loaduse-svg", 8, ["LW R1,0(R2)", "ADD R3,R1,R4"], ({x0,y0,cellW,cellH}) => {
      const stages=["IF","ID","EX","MEM","WB"];
      let out = "";
      stages.forEach((s,i) => { out += cell(x0 + i*cellW, y0, cellW, cellH, s); });
      // I2: IF ID stall EX MEM WB
      const plan = ["IF","ID","stall","EX","MEM","WB"];
      plan.forEach((s,i) => {
        const st = s === "stall";
        out += cell(x0 + (i+1)*cellW, y0 + cellH, cellW, cellH, st ? "EX" : s, st ? "—" : s, st);
      });
      // 前递箭头：MEM末 → EX开
      const mx = x0 + 3*cellW + cellW, my = y0 + cellH/2;
      const ex2x = x0 + 4*cellW, ey = y0 + cellH + cellH/2;
      out += `<path d="M ${mx} ${my} Q ${mx+15} ${(my+ey)/2} ${ex2x} ${ey}" class="dataflow ok" fill="none"/>`;
      out += `<text x="${x0 + 4.5*cellW}" y="${y0 + 3*cellH}" text-anchor="middle" class="t-small" fill="#D97706">必须 1 拍气泡 + 从 MEM/WB 前递</text>`;
      return out;
    });
  })();
};
