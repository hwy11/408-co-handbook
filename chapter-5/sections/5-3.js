window.SEC_5_3 = function(){ return `
<h1 class="sec-title">5.3 数据通路</h1>
<div class="sec-meta">
  <b>考点定位</b> · 单总线数据通路的微操作序列是近年综合题热门 · 必须能写出每条指令在单总线/专用通路下的每拍 CU 信号
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">"数据通路"就是 CPU 内部<b>数据流动的路径</b>——由寄存器、ALU、多路选择器和总线组成。
  同样一条指令，用"单总线"实现和用"专用通路"实现，每拍能做什么、要多少拍，差别巨大。</p>
</div>

<!-- ============================================ 5.3.1 ============================================ -->
<h2 class="h2">5.3.1 数据通路的功能 <span class="sub-tag" style="margin-left:10px">§5.3.1</span></h2>

<p>数据通路干三件事：<b>(1)</b> 实现 CPU 内部寄存器与寄存器间的数据传送； <b>(2)</b> 实现 CPU 与主存/IO 之间的数据传送； <b>(3)</b> 提供算术和逻辑运算的路径。</p>

<div class="callout brand">
  <div class="co-icon">★</div>
  <div class="co-body">
    <div class="co-title">通路 vs 控制：不要混淆</div>
    <p>数据通路只负责"路修在哪儿、怎么走"；"走哪条、什么时候走"是<b>控制器</b>决定的（下一节）。一个是路、一个是路标。</p>
  </div>
</div>

<h3 class="h3">数据通路里有什么</h3>
<table class="tbl">
  <thead><tr><th style="width:150px">部件</th><th>作用</th></tr></thead>
  <tbody>
    <tr><td>寄存器 Register</td><td>临时存放操作数、中间结果、地址</td></tr>
    <tr><td>ALU</td><td>完成运算，数据通路的"心脏"</td></tr>
    <tr><td>多路选择器 MUX</td><td>从多个源中选一路作为 ALU/寄存器输入</td></tr>
    <tr><td>三态门 / 总线驱动器</td><td>让多个部件<b>共享总线</b>而不冲突</td></tr>
    <tr><td>总线 BUS</td><td>多个部件间的公共传输通道</td></tr>
  </tbody>
</table>

<!-- ============================================ 5.3.2 ============================================ -->
<h2 class="h2">5.3.2 数据通路的组成 <span class="sub-tag" style="margin-left:10px">§5.3.2</span></h2>

<p>两种工程选择决定了通路长什么样：<b>用总线</b>（共享、省线、慢）还是<b>用专线</b>（独立、多线、快）。</p>

<div class="row-2">
  <div>
    <h4 class="h4">方式 ① 专用通路 Dedicated Data Path</h4>
    <p>每对需要通信的部件之间<b>各拉一根线</b>。优点是多个传送可同时进行；缺点是线多、硬件贵。</p>
  </div>
  <div>
    <h4 class="h4">方式 ② 总线通路 Bus Based Data Path</h4>
    <p>多个部件共用一条 / 几条公共总线。每一拍只能有<b>一对</b>部件通信；便宜但慢。</p>
  </div>
</div>

<!-- ============================================ 5.3.3 ============================================ -->
<h2 class="h2">5.3.3 数据通路的基本结构 <span class="sub-tag" style="margin-left:10px">§5.3.3</span></h2>

<h3 class="h3">① CPU 内部单总线结构</h3>
<p>最经典的教学模型：所有寄存器和 ALU 都挂在一条内部总线上。每拍"出一个 → 进一个"。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.3.1</span> 单总线 CPU 数据通路</div>
  <div class="fig-desc">寄存器的 "<code>X<sub>out</sub></code>" 信号控制它把内容"送上总线"；"<code>X<sub>in</sub></code>" 信号控制它把总线内容"接进来"。ALU 两个输入中，Y 是暂存器、另一路来自总线。</div>

  <svg viewBox="0 0 820 420" xmlns="http://www.w3.org/2000/svg" id="single-bus-svg">
    <!-- 总线 -->
    <rect x="40" y="180" width="740" height="30" class="bus"/>
    <text x="780" y="176" text-anchor="end" class="bus-label">CPU 内部总线</text>

    <!-- 上方寄存器 PC / IR / MAR / MDR / GPR -->
    ${[
      ["PC", 60],["IR",160],["MAR",260],["MDR",360],["R0",470],["R1",540],["R2",610],["R3",680]
    ].map(([n,x]) => `
      <rect x="${x}" y="60" width="80" height="36" rx="5" class="reg-box"/>
      <text x="${+x+40}" y="82" text-anchor="middle" class="reg-label">${n}</text>
      <line x1="${+x+40}" y1="96" x2="${+x+40}" y2="180" class="stroke-line"/>
      <circle cx="${+x+40}" cy="108" r="3" fill="#18181B"/>
      <text x="${+x+48}" y="112" class="t-tiny">${n}<tspan baseline-shift="sub">out/in</tspan></text>
    `).join("")}

    <!-- ALU 区域 -->
    <rect x="60" y="260" width="80" height="36" rx="5" class="reg-box"/>
    <text x="100" y="282" text-anchor="middle" class="reg-label">Y</text>
    <line x1="100" y1="260" x2="100" y2="210" class="stroke-line"/>
    <text x="106" y="232" class="t-tiny">Y<tspan baseline-shift="sub">in</tspan></text>

    <polygon points="200,260 360,260 340,310 220,310" class="alu-shape"/>
    <text x="280" y="290" text-anchor="middle" class="reg-label" fill="#4F46E5">ALU</text>
    <line x1="140" y1="280" x2="200" y2="280" class="stroke-line"/>
    <line x1="240" y1="210" x2="260" y2="260" class="stroke-line"/>
    <text x="250" y="246" class="t-tiny">ALU 另一路来自总线</text>

    <rect x="400" y="270" width="80" height="36" rx="5" class="reg-box"/>
    <text x="440" y="292" text-anchor="middle" class="reg-label">Z</text>
    <line x1="360" y1="285" x2="400" y2="285" class="stroke-line"/>
    <line x1="440" y1="270" x2="440" y2="210" class="stroke-line"/>
    <text x="446" y="238" class="t-tiny">Z<tspan baseline-shift="sub">out</tspan></text>

    <!-- CU -->
    <rect x="560" y="260" width="210" height="80" rx="8" class="cu-box"/>
    <text x="665" y="290" text-anchor="middle" class="reg-label" fill="#DC2626">控制单元 CU</text>
    <text x="665" y="310" text-anchor="middle" class="t-small">产生 PC<sub>in</sub>/<sub>out</sub>, Y<sub>in</sub>, ALU<sub>op</sub>, Z<sub>in</sub>/<sub>out</sub>…</text>
    <text x="665" y="328" text-anchor="middle" class="t-small">时序信号 T1, T2, T3, …</text>

    <!-- 主存接口 -->
    <rect x="60" y="360" width="380" height="46" rx="6" fill="#F5F3FF" stroke="#7C3AED"/>
    <text x="75" y="385" class="t-label" fill="#7C3AED" style="font-weight:700">主存</text>
    <text x="120" y="385" class="t-small">← 地址来自 MAR，数据经 MDR 双向传输</text>
  </svg>

  <div class="callout warn">
    <div class="co-icon">!</div>
    <div class="co-body">
      <div class="co-title">为什么 ALU 旁要有 Y 和 Z？</div>
      <p>单总线上一拍只能送一个数。但 ALU 至少要<b>两个输入</b>——于是把一个数先"暂存"在 Y 里；结果也不能直接回总线（会跟输入抢总线），所以先放到 Z，下一拍再 Z→目的寄存器。这是单总线结构必须用 Y/Z 的根本原因。</p>
    </div>
  </div>
</div>

<h3 class="h3">② CPU 内部多总线 / 专用通路</h3>
<p>把一条总线扩展为两条或三条；或者给关键数据路径拉专线。这样 ALU 的两个输入可以同拍上总线，不再需要 Y 暂存器。</p>

<div class="row-2">
  <div class="fig" style="margin:0">
    <div class="fig-title"><span class="fig-idx">FIG 5.3.2</span> 双总线示意</div>
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="360" height="18" class="bus"/>
      <text x="360" y="36" text-anchor="end" class="bus-label">A 总线</text>
      <rect x="20" y="140" width="360" height="18" class="bus"/>
      <text x="360" y="136" text-anchor="end" class="bus-label">B 总线</text>
      <rect x="40" y="70" width="60" height="28" class="reg-box" rx="4"/><text x="70" y="89" text-anchor="middle" class="reg-label">R1</text>
      <rect x="120" y="70" width="60" height="28" class="reg-box" rx="4"/><text x="150" y="89" text-anchor="middle" class="reg-label">R2</text>
      <polygon points="220,80 310,80 300,130 230,130" class="alu-shape"/>
      <text x="265" y="110" text-anchor="middle" class="reg-label" fill="#4F46E5">ALU</text>
      <line x1="70" y1="70" x2="70" y2="58" class="stroke-line"/>
      <line x1="150" y1="70" x2="150" y2="58" class="stroke-line"/>
      <line x1="70" y1="98" x2="220" y2="105" class="stroke-line-thin"/>
      <line x1="150" y1="98" x2="220" y2="120" class="stroke-line-thin"/>
      <line x1="265" y1="130" x2="265" y2="140" class="stroke-line"/>
    </svg>
  </div>
  <div>
    <h4 class="h4">对比看一眼</h4>
    <table class="tbl">
      <thead><tr><th>维度</th><th>单总线</th><th>多总线</th></tr></thead>
      <tbody>
        <tr><td>每拍传送数</td><td>1</td><td>多个</td></tr>
        <tr><td>需要 Y/Z 暂存</td><td>需要</td><td>可省</td></tr>
        <tr><td>硬件成本</td><td>低</td><td>高</td></tr>
        <tr><td>控制复杂度</td><td>简单</td><td>复杂</td></tr>
        <tr><td>执行速度</td><td>慢</td><td>快</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- ============================================ 5.3.4 ============================================ -->
<h2 class="h2">5.3.4 数据通路操作举例 <span class="sub-tag" style="margin-left:10px">§5.3.4</span></h2>

<p>下面用单总线模型，逐拍演示典型操作。点击步骤按钮查看每一拍的总线上在跑什么。</p>

<h3 class="h3">例 1：<code>(R0) → R1</code> 寄存器间传送</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.3.3</span> 寄存器到寄存器（单总线，1 拍完成）</div>
  <div class="steps-bar">
    <button class="step-btn active" data-ns="rr" data-v="0">T1</button>
    <div class="spacer"></div>
    <span class="t-tiny" style="color:var(--ink-3)">单总线下，寄存器间传送只需 1 拍</span>
  </div>
  <div class="step-note" id="note-rr">
    <span class="sn-step">T1</span>发 <code>R0<sub>out</sub></code> 和 <code>R1<sub>in</sub></code>：R0 的内容走上总线，R1 接收。其他寄存器的 in/out 信号都保持 0。
  </div>
  <svg viewBox="0 0 820 220" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="110" width="740" height="24" class="bus"/>
    <rect x="100" y="50" width="100" height="40" class="reg-box active" rx="6"/>
    <text x="150" y="75" text-anchor="middle" class="reg-label">R0</text>
    <rect x="620" y="50" width="100" height="40" class="reg-box active" rx="6"/>
    <text x="670" y="75" text-anchor="middle" class="reg-label">R1</text>
    <line x1="150" y1="90" x2="150" y2="110" class="dataflow"/>
    <line x1="670" y1="110" x2="670" y2="90" class="dataflow"/>
    <text x="400" y="100" text-anchor="middle" class="t-mono" fill="#4F46E5" style="font-size:13px;font-weight:700">(R0) 流向 R1</text>
    <text x="150" y="45" text-anchor="middle" class="t-tiny" fill="#4F46E5">R0<tspan baseline-shift="sub">out</tspan>=1</text>
    <text x="670" y="45" text-anchor="middle" class="t-tiny" fill="#4F46E5">R1<tspan baseline-shift="sub">in</tspan>=1</text>
    <!-- 其他寄存器保持灰 -->
    ${["R2","R3","MAR","MDR"].map((n,i) => `
      <rect x="${230+i*90}" y="60" width="60" height="30" class="reg-box" rx="4" opacity=".25"/>
      <text x="${260+i*90}" y="80" text-anchor="middle" class="reg-label" opacity=".5">${n}</text>
    `).join("")}
    <text x="400" y="180" text-anchor="middle" class="t-small">CU 发出的微命令：<tspan class="t-mono" style="font-weight:700">R0<tspan baseline-shift="sub">out</tspan>, R1<tspan baseline-shift="sub">in</tspan></tspan></text>
  </svg>
</div>

<h3 class="h3">例 2：<code>(R0) + (R1) → R2</code> 加法运算</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.3.4</span> 加法（单总线，3 拍完成）</div>
  <div class="steps-bar" id="sb-add">
    <button class="step-btn active" data-ns="add" data-v="0">T1</button>
    <button class="step-btn" data-ns="add" data-v="1">T2</button>
    <button class="step-btn" data-ns="add" data-v="2">T3</button>
    <div class="spacer"></div>
    <button class="play-btn" data-ns="add">▶ 播放</button>
    <button class="reset-btn" data-ns="add">⟲ 重置</button>
  </div>
  <div class="step-note" id="note-add">
    <span class="sn-step" id="note-add-lbl">T1</span><span id="note-add-txt">R0 的内容送上总线，锁进 ALU 的暂存器 Y。</span>
  </div>

  <svg viewBox="0 0 820 320" xmlns="http://www.w3.org/2000/svg" id="add-svg">
    <rect x="40" y="150" width="740" height="24" class="bus"/>

    <!-- R0 R1 R2 -->
    ${[["R0",80],["R1",220],["R2",360]].map(([n,x]) => `
      <g id="add-${n}">
        <rect x="${x}" y="60" width="100" height="40" class="reg-box" rx="6"/>
        <text x="${+x+50}" y="86" text-anchor="middle" class="reg-label">${n}</text>
        <line x1="${+x+50}" y1="100" x2="${+x+50}" y2="150" class="stroke-line-thin add-line" id="line-${n}"/>
      </g>
    `).join("")}

    <!-- Y -->
    <g id="add-Y">
      <rect x="80" y="210" width="100" height="40" class="reg-box" rx="6"/>
      <text x="130" y="236" text-anchor="middle" class="reg-label">Y</text>
      <line x1="130" y1="210" x2="130" y2="174" class="stroke-line-thin" id="line-Y"/>
    </g>

    <!-- ALU -->
    <polygon points="260,210 420,210 400,270 280,270" class="alu-shape" id="add-ALU"/>
    <text x="340" y="245" text-anchor="middle" class="reg-label" fill="#4F46E5">ALU (+)</text>
    <line x1="180" y1="230" x2="260" y2="230" class="stroke-line-thin" id="line-YtoALU"/>
    <line x1="340" y1="210" x2="340" y2="174" class="stroke-line-thin" id="line-ALUin"/>

    <!-- Z -->
    <g id="add-Z">
      <rect x="480" y="230" width="100" height="40" class="reg-box" rx="6"/>
      <text x="530" y="256" text-anchor="middle" class="reg-label">Z</text>
      <line x1="420" y1="240" x2="480" y2="240" class="stroke-line-thin" id="line-ALUtoZ"/>
      <line x1="530" y1="230" x2="530" y2="174" class="stroke-line-thin" id="line-Z"/>
    </g>

    <text x="410" y="300" text-anchor="middle" class="t-small" id="add-mc"></text>
  </svg>
</div>

<table class="tbl">
  <thead><tr><th>拍</th><th>微命令</th><th>动作含义</th></tr></thead>
  <tbody>
    <tr><td>T1</td><td><code>R0<sub>out</sub>, Y<sub>in</sub></code></td><td>R0 上总线 → Y 寄存器锁存</td></tr>
    <tr><td>T2</td><td><code>R1<sub>out</sub>, ALU<sub>+</sub>, Z<sub>in</sub></code></td><td>R1 上总线 → 与 Y 相加 → 结果进 Z</td></tr>
    <tr><td>T3</td><td><code>Z<sub>out</sub>, R2<sub>in</sub></code></td><td>Z 上总线 → R2 接收</td></tr>
  </tbody>
</table>

<h3 class="h3">例 3：完整取指周期（单总线）</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.3.5</span> 取指周期的典型微操作序列</div>
  <div class="fig-desc">考试中经常让你写出一条指令在<b>单总线模型</b>下"每拍做什么"——记住这套模板。</div>
  <table class="tbl">
    <thead><tr><th>拍</th><th>微命令</th><th>作用</th></tr></thead>
    <tbody>
      <tr><td>T1</td><td><code>PC<sub>out</sub>, MAR<sub>in</sub></code></td><td>指令地址送到地址寄存器</td></tr>
      <tr><td>T2</td><td><code>1→R, MEM(MAR)→MDR</code></td><td>启动读主存，数据返回 MDR</td></tr>
      <tr><td>T3</td><td><code>MDR<sub>out</sub>, IR<sub>in</sub></code></td><td>把读回的指令送到 IR</td></tr>
      <tr><td>T4</td><td><code>(PC)+1 → PC</code></td><td>PC 自增，指向下一条指令</td></tr>
    </tbody>
  </table>
  <div class="callout info" style="margin-top:10px">
    <div class="co-icon">i</div>
    <div class="co-body">
      <div class="co-title">注意：PC+1 这一步可以和 T2、T3 并行</div>
      <p>实际设计中，PC 自增由独立加法器完成，不抢总线，所以可以"偷偷"和其他拍一起做，但在<b>考试写微命令序列时仍单独列一拍</b>以求清晰。</p>
    </div>
  </div>
</div>

<h3 class="h3">例 4：访存 LOAD 指令  <code>R1 ← M[R0]</code></h3>
<table class="tbl">
  <thead><tr><th>拍</th><th>阶段</th><th>微命令</th></tr></thead>
  <tbody>
    <tr><td>T1</td><td rowspan="4">FE 取指</td><td><code>PC<sub>out</sub>, MAR<sub>in</sub>, (PC)+1→PC</code></td></tr>
    <tr><td>T2</td><td><code>1→R, MEM→MDR</code></td></tr>
    <tr><td>T3</td><td><code>MDR<sub>out</sub>, IR<sub>in</sub></code></td></tr>
    <tr><td>T4</td><td>指令译码</td></tr>
    <tr><td>T5</td><td rowspan="2">EX 执行</td><td><code>R0<sub>out</sub>, MAR<sub>in</sub></code> 把有效地址送给 MAR</td></tr>
    <tr><td>T6</td><td><code>1→R, MEM→MDR, MDR<sub>out</sub>, R1<sub>in</sub></code></td></tr>
  </tbody>
</table>

<div class="mnemonic">
  <div class="mn-label">套路</div>
  <div class="mn-body">
    单总线写微操作的<b>三要素</b>：<br/>
    ① 总线上每拍只能传一个值（一个 out + 若干 in）；<br/>
    ② 要做运算就必须先把一个数锁进 Y；<br/>
    ③ 运算结果要先放 Z，再下一拍 Z→目的。
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2013 年 408（节选）</span><span class="exam-tag">综合题</span></div>
  <div class="exam-body">
    <div class="q">在单总线结构中，写出 <code>ADD R0, R1</code>（R0 ← R0 + R1）执行阶段的微操作序列。</div>
    <div class="exam-ans">
      T1: <code>R0<sub>out</sub>, Y<sub>in</sub></code><br/>
      T2: <code>R1<sub>out</sub>, ALU<sub>+</sub>, Z<sub>in</sub></code><br/>
      T3: <code>Z<sub>out</sub>, R0<sub>in</sub></code>
    </div>
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2014 年 408（节选）</span><span class="exam-tag">综合题</span></div>
  <div class="exam-body">
    <div class="q">说明为什么单总线结构必须设置 Y、Z 两个暂存器？</div>
    <div class="exam-ans">
      (1) ALU 需要<b>两个同时到位</b>的输入，但单总线一拍只能传一个值，所以要用 Y 暂存第一个操作数；<br/>
      (2) ALU 的输出如果直接上总线，会和此时正向 ALU 输送的第二个操作数抢总线，产生冲突，所以用 Z 作为输出暂存，下一拍再发往目的。
    </div>
  </div>
</div>
`; };

window.INIT_5_3 = function(){
  // 加法演示
  const svg = document.getElementById("add-svg");
  if(!svg) return;
  const steps = [
    { hi:["R0","Y","line-R0","line-Y"], mc:"R0out, Yin", txt:"R0 的内容送上总线，锁进 ALU 的暂存器 Y。" },
    { hi:["R1","ALU","Z","line-R1","line-ALUin","line-ALUtoZ"], mc:"R1out, ALU+, Zin", txt:"R1 上总线 → ALU 加 Y → 结果进 Z。" },
    { hi:["Z","R2","line-Z","line-R2"], mc:"Zout, R2in", txt:"Z 上总线 → R2 接收，加法完成。" },
  ];
  const allIds = ["R0","R1","R2","Y","Z","ALU"];
  const allLines = ["line-R0","line-R1","line-R2","line-Y","line-Z","line-YtoALU","line-ALUin","line-ALUtoZ"];

  function setStep(i){
    const s = steps[i];
    allIds.forEach(id => {
      const g = document.getElementById("add-"+id);
      if(!g) return;
      const box = g.querySelector("rect, polygon");
      if(!box) return;
      const on = s.hi.includes(id);
      box.classList.toggle("active", on);
      box.style.opacity = on ? 1 : .45;
    });
    allLines.forEach(id => {
      const l = document.getElementById(id);
      if(!l) return;
      const on = s.hi.includes(id);
      l.classList.toggle("dataflow", on);
      l.classList.toggle("stroke-line-thin", !on);
    });
    document.getElementById("add-mc").textContent = "CU 微命令：" + s.mc;
    document.getElementById("note-add-txt").textContent = s.txt;
    document.getElementById("note-add-lbl").textContent = "T" + (i+1);
    document.querySelectorAll('[data-ns="add"].step-btn').forEach((b,idx) => b.classList.toggle("active", idx===i));
  }
  document.querySelectorAll('[data-ns="add"].step-btn').forEach(b => b.addEventListener("click", () => setStep(+b.dataset.v)));
  // 播放
  let timer = null, i = 0;
  const play = document.querySelector('[data-ns="add"].play-btn');
  const reset = document.querySelector('[data-ns="add"].reset-btn');
  play.addEventListener("click", () => {
    if(timer){ clearInterval(timer); timer=null; play.textContent="▶ 播放"; return; }
    play.textContent = "⏸ 暂停";
    timer = setInterval(() => {
      i = (i+1) % steps.length;
      setStep(i);
    }, 1500);
  });
  reset.addEventListener("click", () => { if(timer){clearInterval(timer);timer=null;play.textContent="▶ 播放";} i = 0; setStep(0); });

  setStep(0);
};
