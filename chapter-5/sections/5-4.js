window.SEC_5_4 = function(){ return `
<h1 class="sec-title">5.4 控制器</h1>
<div class="sec-meta">
  <b>考点定位</b> · 硬布线 vs 微程序的对比是 408 高频选择题 · 微程序控制器的"控存/μIR/μPC"必考综合题
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">控制器就是 CPU 的"大脑中的大脑"：根据 IR 里的操作码，在<b>每一拍</b>发出对应的<b>微命令</b>去驱动数据通路。
  实现方式两大流派：<b>硬布线</b>（快但改不动）和<b>微程序</b>（慢但灵活）。</p>
</div>

<!-- ============================================ 5.4.1 ============================================ -->
<h2 class="h2">5.4.1 控制器的结构和功能 <span class="sub-tag" style="margin-left:10px">§5.4.1</span></h2>

<h3 class="h3">控制器要干的事</h3>
<ol>
  <li><b>取指令</b>：从 PC 指向的主存位置取回指令放入 IR。</li>
  <li><b>分析指令</b>（译码）：把操作码翻译出来，知道这是条什么指令。</li>
  <li><b>生成微命令序列</b>：按阶段、按拍发出驱动数据通路的信号。</li>
  <li><b>改 PC</b>：正常 +1、跳转 JMP、被中断等。</li>
  <li><b>响应异常和中断</b>：检测中断请求，在适当时机转入处理。</li>
</ol>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.4.1</span> 控制器的输入与输出</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- 左 inputs -->
    ${[
      ["操作码 OP(IR)",60,50,"#FEF3C7"],
      ["标志位 PSW",60,100,"#FEF3C7"],
      ["时钟节拍 T",60,150,"#FEF3C7"],
      ["外部请求 INTR",60,200,"#FEF3C7"],
    ].map(([n,x,y,c]) => `
      <rect x="${x}" y="${y}" width="150" height="36" rx="5" fill="${c}" stroke="#D97706"/>
      <text x="${+x+75}" y="${+y+22}" text-anchor="middle" class="t-label">${n}</text>
      <line x1="${+x+150}" y1="${+y+18}" x2="300" y2="130" class="stroke-line-thin" marker-end="url(#a4)"/>
    `).join("")}
    <!-- 中间 -->
    <rect x="300" y="60" width="220" height="140" rx="10" class="cu-box"/>
    <text x="410" y="90" text-anchor="middle" class="t-title" fill="#DC2626">控制单元 CU</text>
    <text x="410" y="115" text-anchor="middle" class="t-small">= 组合逻辑 或 控存+μPC+μIR</text>
    <text x="410" y="140" text-anchor="middle" class="t-small">依据 OP·T·PSW·INTR 生成控制信号</text>

    <!-- 右 outputs -->
    ${[
      ["寄存器 in/out 信号",620,50,"#D1FAE5"],
      ["ALU 操作码",620,100,"#D1FAE5"],
      ["访存读写 R/W",620,150,"#D1FAE5"],
      ["总线使能 BUS ctrl",620,200,"#D1FAE5"],
    ].map(([n,x,y,c]) => `
      <rect x="${x}" y="${y}" width="180" height="36" rx="5" fill="${c}" stroke="#059669"/>
      <text x="${+x+90}" y="${+y+22}" text-anchor="middle" class="t-label">${n}</text>
      <line x1="520" y1="130" x2="${x}" y2="${+y+18}" class="stroke-line-thin" marker-end="url(#a4)"/>
    `).join("")}

    <defs>
      <marker id="a4" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#18181B"/>
      </marker>
    </defs>
  </svg>
</div>

<!-- ============================================ 5.4.2 ============================================ -->
<h2 class="h2">5.4.2 硬布线控制器 <span class="sub-tag" style="margin-left:10px">§5.4.2</span></h2>

<p>硬布线：用"<b>一堆门电路</b>"直接把输入（OP、T、PSW 等）<b>组合</b>出控制信号。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.4.2</span> 硬布线的逻辑</div>
  <div class="fig-desc">每一个控制信号 C<sub>i</sub> = 一个布尔表达式。比如 "MAR<sub>in</sub> = FE·T1 + (LOAD+STORE)·T5"。</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- 输入组 -->
    ${[
      ["OP 译码输出",40,50,"ADD, SUB, LOAD, …"],
      ["节拍发生器",40,115,"T1, T2, T3, …"],
      ["标志 PSW",40,180,"ZF, CF, …"],
    ].map(([n,x,y,d]) => `
      <rect x="${x}" y="${y}" width="160" height="50" rx="6" fill="#fff" stroke="#A1A1AA"/>
      <text x="${+x+80}" y="${+y+20}" text-anchor="middle" class="t-label" style="font-weight:700">${n}</text>
      <text x="${+x+80}" y="${+y+38}" text-anchor="middle" class="t-small">${d}</text>
      <line x1="${+x+160}" y1="${+y+25}" x2="290" y2="140" class="stroke-line-thin"/>
    `).join("")}

    <!-- 组合逻辑云 -->
    <ellipse cx="410" cy="140" rx="120" ry="70" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.5"/>
    <text x="410" y="130" text-anchor="middle" class="t-title" fill="#DC2626">组合逻辑网络</text>
    <text x="410" y="150" text-anchor="middle" class="t-small">AND/OR/NOT 门电路</text>
    <text x="410" y="168" text-anchor="middle" class="t-tiny t-mono">无状态、一次成型</text>

    <!-- 输出信号 -->
    ${[
      ["PC out", 620, 50],["MAR in", 620, 90],["ALU +", 620, 130],["MEM R", 620, 170],["…", 620, 210],
    ].map(([n,x,y]) => `
      <rect x="${x}" y="${y}" width="140" height="28" rx="4" fill="#D1FAE5" stroke="#059669"/>
      <text x="${+x+70}" y="${+y+18}" text-anchor="middle" class="t-mono t-label" style="font-weight:700">${n}</text>
      <line x1="530" y1="140" x2="${x}" y2="${+y+14}" class="stroke-line-thin" marker-end="url(#a5)"/>
    `).join("")}

    <defs>
      <marker id="a5" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#18181B"/>
      </marker>
    </defs>
  </svg>
</div>

<div class="row-2">
  <div>
    <h4 class="h4">硬布线的设计步骤</h4>
    <ol>
      <li>列出所有指令的<b>微操作时序表</b>（每条指令 × 每一拍需要哪些信号）。</li>
      <li>对每个控制信号 C<sub>i</sub>，写出它在什么情况下为 1 ——得到布尔表达式。</li>
      <li>用门电路实现表达式；节拍发生器提供 T1/T2/… 信号。</li>
    </ol>
  </div>
  <div>
    <h4 class="h4">示例：<code>MAR<sub>in</sub></code> 何时为 1？</h4>
    <div class="codeblock">
<span class="cmt">// 任意指令的 FE · T1 都需要 MAR 接收 PC</span>
MAR<sub>in</sub> = FE·T1
       <span class="cmt">// LOAD/STORE 的 EX 阶段也要把有效地址给 MAR</span>
       + (LOAD + STORE)·T5
       <span class="cmt">// 间址周期 T1 也要</span>
       + IND·T1
    </div>
  </div>
</div>

<div class="callout warn">
  <div class="co-icon">!</div>
  <div class="co-body">
    <div class="co-title">硬布线的"软肋"</div>
    <p>只要指令集改一点，整张电路就要重新设计。所以 RISC（指令少、格式整齐）倾向硬布线；CISC（指令多、变化大）倾向微程序。</p>
  </div>
</div>

<!-- ============================================ 5.4.3 ============================================ -->
<h2 class="h2">5.4.3 微程序控制器 <span class="sub-tag" style="margin-left:10px">§5.4.3</span></h2>

<p>微程序的核心思想：把"每条指令该发什么微命令"提前写成<b>一段程序</b>存在 ROM 里；执行时像跑普通程序一样，一条一条地取微指令、发微命令。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.4.3</span> 微程序控制器内部结构</div>
  <div class="fig-desc">可以把它当成"小一号的冯·诺依曼机"：控存 = 主存，μPC = PC，μIR = IR。</div>
  <svg viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg">
    <!-- 指令 IR -->
    <rect x="40" y="40" width="160" height="40" rx="5" class="reg-box"/>
    <text x="120" y="64" text-anchor="middle" class="reg-label">IR（OP）</text>

    <!-- 微地址形成部件 -->
    <rect x="40" y="120" width="160" height="60" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="120" y="145" text-anchor="middle" class="t-label" style="font-weight:700">微地址形成部件</text>
    <text x="120" y="165" text-anchor="middle" class="t-small">根据 OP + 标志生成入口</text>
    <line x1="120" y1="80" x2="120" y2="120" class="stroke-line" marker-end="url(#a6)"/>

    <!-- μPC -->
    <rect x="40" y="220" width="160" height="40" rx="5" class="reg-box"/>
    <text x="120" y="244" text-anchor="middle" class="reg-label">μPC · 微地址寄存器</text>
    <line x1="120" y1="180" x2="120" y2="220" class="stroke-line" marker-end="url(#a6)"/>

    <!-- 控存 -->
    <rect x="250" y="100" width="280" height="200" rx="10" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5"/>
    <text x="390" y="130" text-anchor="middle" class="t-title" fill="#7C3AED">控制存储器 CM（ROM）</text>
    <text x="390" y="150" text-anchor="middle" class="t-small">存放全部微指令</text>
    ${[0,1,2,3,4].map(i => `
      <rect x="270" y="${165+i*22}" width="240" height="18" rx="3" fill="#fff" stroke="#DDD6FE"/>
      <text x="278" y="${178+i*22}" class="t-mono t-tiny">μADR ${(i*2).toString(16).toUpperCase().padStart(2,'0')}: ${['PC→MAR','Read','MDR→IR','OP→CU','μPC+1→μPC'][i]||'...'}</text>
    `).join("")}
    <line x1="200" y1="240" x2="250" y2="200" class="stroke-line" marker-end="url(#a6)"/>

    <!-- μIR -->
    <rect x="580" y="120" width="200" height="60" rx="6" class="reg-box"/>
    <text x="680" y="148" text-anchor="middle" class="reg-label">μIR · 微指令寄存器</text>
    <text x="680" y="166" text-anchor="middle" class="t-small">| 操作控制字段 | 顺序控制字段 |</text>
    <line x1="530" y1="160" x2="580" y2="150" class="stroke-line" marker-end="url(#a6)"/>

    <!-- 操作控制 -> 微命令 -->
    <rect x="580" y="220" width="200" height="40" rx="5" fill="#D1FAE5" stroke="#059669"/>
    <text x="680" y="244" text-anchor="middle" class="t-label" style="font-weight:700">→ 产生微命令</text>
    <line x1="680" y1="180" x2="680" y2="220" class="stroke-line" marker-end="url(#a6)"/>

    <!-- 下址 -> μPC -->
    <path d="M 680 260 Q 680 320 120 320 Q 120 260 120 260" class="stroke-line-thin" fill="none" stroke-dasharray="4 3" marker-end="url(#a6)"/>
    <text x="420" y="340" text-anchor="middle" class="t-small">"下地址字段" 回写 μPC（选择下条微指令）</text>

    <defs>
      <marker id="a6" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#18181B"/>
      </marker>
    </defs>
  </svg>
</div>

<h3 class="h3">关键术语一次说清</h3>
<table class="tbl">
  <thead><tr><th style="width:170px">术语</th><th>定义</th></tr></thead>
  <tbody>
    <tr><td>微命令 Microcommand</td><td>控制数据通路的<b>最小</b>控制信号，如 <code>PC<sub>out</sub></code></td></tr>
    <tr><td>微操作 Microoperation</td><td>微命令<b>引起</b>的动作，如"PC 把内容送到总线"</td></tr>
    <tr><td>微指令 Microinstruction</td><td>同一拍要同时发出的一组微命令，就是控存中的一"条"</td></tr>
    <tr><td>微周期</td><td>从控存中读出并执行<b>一条</b>微指令的时间</td></tr>
    <tr><td>微程序 Microprogram</td><td>实现一条<b>机器指令</b>的若干微指令的序列</td></tr>
    <tr><td>控制存储器 CM</td><td>存放<b>全部</b>微程序的只读存储器</td></tr>
    <tr><td>μPC</td><td>给出下一条微指令在 CM 中的地址</td></tr>
    <tr><td>μIR</td><td>保存当前从 CM 读出的微指令</td></tr>
  </tbody>
</table>

<div class="callout err">
  <div class="co-icon">!</div>
  <div class="co-body">
    <div class="co-title">易混：机器指令 vs 微指令</div>
    <p>机器指令 = 程序员看到的"那一条"汇编；微指令 = 实现那一条所需的<b>硬件内部步骤</b>。一条机器指令通常对应 5~20 条微指令。</p>
  </div>
</div>

<h3 class="h3">微指令格式：水平型 vs 垂直型</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.4.4</span> 两种微指令格式对比</div>
  <div class="toggle-row">
    <button class="tgl active" data-tgl="uformat" data-val="horiz">水平型</button>
    <button class="tgl" data-tgl="uformat" data-val="vert">垂直型</button>
  </div>
  <div id="uformat-area"></div>
</div>

<table class="tbl">
  <thead><tr><th>维度</th><th>水平型微指令</th><th>垂直型微指令</th></tr></thead>
  <tbody>
    <tr><td>格式特点</td><td>字长<b>很长</b>，每位对应一个微命令</td><td>字长<b>短</b>，类似机器指令，带 μOP 码</td></tr>
    <tr><td>并行度</td><td>高：一条微指令可同时发多个微命令</td><td>低：一条微指令只做 1~2 件事</td></tr>
    <tr><td>微程序长度</td><td>短</td><td>长</td></tr>
    <tr><td>执行速度</td><td>快</td><td>慢</td></tr>
    <tr><td>控存容量</td><td>字长大 × 条数少</td><td>字长小 × 条数多</td></tr>
    <tr><td>用户理解难度</td><td>难，位分配复杂</td><td>易，像小汇编</td></tr>
  </tbody>
</table>

<h3 class="h3">微指令编码方式（操作控制字段）</h3>
<div class="compare">
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#4F46E5"></span>直接编码（不译码）</div>
    <ul>
      <li>一位 = 一个微命令，置 1 即发出</li>
      <li>并行性最高，速度最快</li>
      <li>字长很长 → 控存贵</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#059669"></span>字段直接编码（分段）</div>
    <ul>
      <li>把<b>互斥</b>的微命令分到同一字段，n 位表达 2<sup>n</sup>–1 个命令</li>
      <li>并行性尚可，字长变短</li>
      <li>408 中最常考；注意"全 0"留给"不发命令"</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#D97706"></span>字段间接编码</div>
    <ul>
      <li>一个字段的含义依赖另一字段</li>
      <li>进一步减少字长</li>
      <li>并行性更低、译码复杂</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#7C3AED"></span>混合编码</div>
    <ul>
      <li>上述几种组合</li>
      <li>实际工程常用</li>
    </ul>
  </div>
</div>

<h3 class="h3">下地址字段（顺序控制）</h3>
<p>怎么决定"下一条微指令在哪儿"？三种主流方法：</p>
<ol>
  <li><b>μPC + 1</b>：最常见，顺序执行。</li>
  <li><b>条件转移</b>：μIR 的下址字段给出"转移目标 + 条件"，根据 PSW 标志选择。</li>
  <li><b>按 OP 散转</b>：机器指令取指完后，要根据 <code>OP(IR)</code> 跳到对应指令的微程序入口——"<b>微地址形成部件</b>"的主职能。</li>
</ol>

<h3 class="h3">一条机器指令的完整微程序流程</h3>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.4.5</span> 取指微程序 + 执行微程序（共用取指段）</div>
  <svg viewBox="0 0 820 200" xmlns="http://www.w3.org/2000/svg">
    <!-- 公共取指段 -->
    <rect x="40" y="60" width="300" height="80" rx="8" fill="#DBEAFE" stroke="#2563EB"/>
    <text x="190" y="90" text-anchor="middle" class="t-title" fill="#2563EB">公共取指微程序</text>
    <text x="190" y="110" text-anchor="middle" class="t-small">PC→MAR, Read, MDR→IR, PC+1</text>
    <text x="190" y="128" text-anchor="middle" class="t-small">由 OP(IR) 决定下一条微指令入口</text>

    <!-- 执行段：按 OP 分支 -->
    ${[
      ["ADD 微程序",450,20,"#D1FAE5","#059669"],
      ["LOAD 微程序",450,90,"#FEF3C7","#D97706"],
      ["STORE 微程序",450,160,"#FEE2E2","#DC2626"],
    ].map(([n,x,y,bg,st]) => `
      <rect x="${x}" y="${y}" width="200" height="38" rx="6" fill="${bg}" stroke="${st}"/>
      <text x="${+x+100}" y="${+y+24}" text-anchor="middle" class="t-label" style="font-weight:700">${n}</text>
      <line x1="340" y1="100" x2="${x}" y2="${+y+20}" class="stroke-line-thin" marker-end="url(#a7)"/>
    `).join("")}

    <!-- 回到取指 -->
    <path d="M 650 39 Q 780 100 650 180" class="stroke-line-thin" fill="none" stroke-dasharray="4 3"/>
    <path d="M 40 100 Q 20 180 650 180" class="stroke-line-thin" fill="none" stroke-dasharray="4 3" marker-end="url(#a7)"/>
    <text x="760" y="108" text-anchor="middle" class="t-tiny" transform="rotate(90, 760, 108)">各指令执行完 → 回公共取指</text>

    <defs>
      <marker id="a7" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#18181B"/>
      </marker>
    </defs>
  </svg>
</div>

<h3 class="h3">硬布线 vs 微程序：终极对比</h3>
<table class="tbl">
  <thead><tr><th>维度</th><th>硬布线</th><th>微程序</th></tr></thead>
  <tbody>
    <tr><td>实现方式</td><td>门电路<b>组合逻辑</b></td><td>控存 <b>ROM</b> + μPC + μIR</td></tr>
    <tr><td>速度</td><td><b>快</b>（一层逻辑延迟）</td><td>慢（要访问控存）</td></tr>
    <tr><td>灵活性</td><td>差，改指令=改硬件</td><td><b>好</b>，改微程序即可</td></tr>
    <tr><td>规整性</td><td>乱，手工布线</td><td>整齐，像小程序</td></tr>
    <tr><td>适合</td><td>RISC（指令少）</td><td>CISC（指令多）</td></tr>
    <tr><td>典型代表</td><td>早期 MIPS、多数 RISC</td><td>x86、VAX、IBM 360</td></tr>
  </tbody>
</table>

<div class="mnemonic">
  <div class="mn-label">记</div>
  <div class="mn-body">
    <b>硬快活，微慢灵</b>：硬布线快但不灵活；微程序慢但灵活。<br/>
    <b>RISC 用硬、CISC 用微</b>——指令越多越乱，越要靠微程序。
  </div>
</div>

<h3 class="h3">经典计算：控存容量 & 微指令字长</h3>
<div class="callout brand">
  <div class="co-icon">Σ</div>
  <div class="co-body">
    <div class="co-title">典型考题公式</div>
    <p><b>控存容量</b> = 微指令条数 × 微指令字长</p>
    <p><b>微指令字长</b> = 操作控制字段位数 + 下地址字段位数</p>
    <p><b>下地址字段位数</b> = ⌈log₂(微指令条数)⌉</p>
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>例题</span><span class="exam-tag">计算</span></div>
  <div class="exam-body">
    <div class="q">某机有 64 条机器指令，每条指令的微程序平均 5 条微指令；
      微指令采用字段直接编码：3 个互斥字段分别有 7、3、12 个命令。
      求：(1) 操作控制字段位数 (2) 下地址字段位数 (3) 控存容量（以位计）。</div>
    <div class="exam-ans">
      (1) 3 个字段各需 ⌈log₂(7+1)⌉=3、⌈log₂(3+1)⌉=2、⌈log₂(12+1)⌉=4，共 <b>3+2+4 = 9 位</b>。<br/>
      (2) 微指令总数 ≈ 64×5 = 320，下地址 = ⌈log₂ 320⌉ = <b>9 位</b>。<br/>
      (3) 微指令字长 = 9+9 = 18 位；容量 = 320×18 = <b>5760 位</b>。<br/>
      实际做题时若题目指明按 2 的幂向上取条数，再算容量。
    </div>
  </div>
</div>
`; };

window.INIT_5_4 = function(){
  function render(v){
    const area = document.getElementById("uformat-area");
    if(!area) return;
    if(v === "horiz"){
      area.innerHTML = `
        <svg viewBox="0 0 780 90" xmlns="http://www.w3.org/2000/svg" style="margin-top:10px">
          ${[
            ["PCout",0],["PCin",1],["MARin",2],["MDRin",3],["MDRout",4],["IRin",5],
            ["Yin",6],["Zout",7],["R0out",8],["R0in",9],["R1out",10],["R1in",11],
            ["ALU+",12],["ALU-",13],["Read",14],["Write",15]
          ].map(([n,i]) => `
            <rect x="${i*42}" y="10" width="40" height="40" fill="${i%2? '#EEF2FF':'#fff'}" stroke="#4F46E5"/>
            <text x="${i*42+20}" y="35" text-anchor="middle" class="t-tiny t-mono">${n}</text>
          `).join("")}
          <rect x="672" y="10" width="108" height="40" fill="#FEF3C7" stroke="#D97706"/>
          <text x="726" y="35" text-anchor="middle" class="t-tiny">下地址字段</text>
          <text x="390" y="75" text-anchor="middle" class="t-small">每一位都是一个微命令开关 · 字长很长（此处示意 16 位）</text>
        </svg>
        <div class="callout info" style="margin-top:8px">
          <div class="co-icon">i</div>
          <div class="co-body">水平型：并行度最高。同一条微指令里可以同时让 "R0out=1, Yin=1" 等多个命令生效。</div>
        </div>`;
    } else {
      area.innerHTML = `
        <svg viewBox="0 0 780 90" xmlns="http://www.w3.org/2000/svg" style="margin-top:10px">
          <rect x="60" y="10" width="140" height="40" fill="#DBEAFE" stroke="#2563EB"/>
          <text x="130" y="35" text-anchor="middle" class="t-label" style="font-weight:700">μOP (操作码)</text>
          <rect x="210" y="10" width="140" height="40" fill="#FEF3C7" stroke="#D97706"/>
          <text x="280" y="35" text-anchor="middle" class="t-label">源地址</text>
          <rect x="360" y="10" width="140" height="40" fill="#D1FAE5" stroke="#059669"/>
          <text x="430" y="35" text-anchor="middle" class="t-label">目的地址</text>
          <rect x="510" y="10" width="200" height="40" fill="#F5F3FF" stroke="#7C3AED"/>
          <text x="610" y="35" text-anchor="middle" class="t-label">下地址字段</text>
          <text x="390" y="75" text-anchor="middle" class="t-small">格式像"小汇编"：一次做一件事，字长短、程序长</text>
        </svg>
        <div class="callout info" style="margin-top:8px">
          <div class="co-icon">i</div>
          <div class="co-body">垂直型：好写好读，但一条只做一件事，微程序很长。</div>
        </div>`;
    }
  }
  bindToggles("div.fig", "uformat", render);
  render("horiz");
};
