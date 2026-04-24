window.SEC_5_2 = function(){ return `
<h1 class="sec-title">5.2 指令执行过程</h1>
<div class="sec-meta">
  <b>考点定位</b> · 指令周期 4 个阶段及其数据流是综合题必考 · "FE/ID/OF/EX/WB"每一步哪个寄存器向哪个寄存器传数据
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">
    一条指令从"藏在内存里"到"执行完毕写回"，经历 <b>取指 → 间址 → 执行 → 中断</b> 四个可能的阶段。
    本节要让你能在白纸上画出每一阶段的<b>数据流图</b>——这是综合题的基础功。
  </p>
</div>

<!-- ============================================ 5.2.1 ============================================ -->
<h2 class="h2">5.2.1 指令周期 <span class="sub-tag" style="margin-left:10px">§5.2.1</span></h2>

<div class="row-2 wide-left">
  <div>
    <h4 class="h4">几个"周期"的层级</h4>
    <p><b>指令周期 Instruction Cycle</b>：CPU 从主存取出并执行一条指令所需的全部时间。</p>
    <p><b>机器周期 CPU Cycle / Bus Cycle</b>：又叫 CPU 周期，通常以"访存一次"为基本单位。</p>
    <p><b>时钟周期 Clock Cycle</b>：最小时间单位，CPU 频率的倒数。一个机器周期由若干时钟周期组成。</p>
    <div class="callout info" style="margin-top:12px">
      <div class="co-icon">i</div>
      <div class="co-body">
        <div class="co-title">关系</div>
        <p>1 指令周期 = n 机器周期；1 机器周期 = m 时钟周期（n、m 不一定相等且通常不同指令也不同）。</p>
      </div>
    </div>
  </div>
  <div class="fig">
    <div class="fig-title"><span class="fig-idx">FIG 5.2.1</span> 三级周期关系</div>
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <!-- 指令周期 -->
      <rect x="20" y="20" width="360" height="40" rx="6" class="fill-brand-soft" stroke="#4F46E5"/>
      <text x="200" y="45" text-anchor="middle" class="t-label" fill="#4F46E5" style="font-weight:700">指令周期</text>
      <!-- 机器周期 -->
      ${[0,1,2].map(i => `
        <rect x="${30+i*120}" y="80" width="110" height="36" rx="5" fill="#FEF3C7" stroke="#D97706"/>
        <text x="${85+i*120}" y="103" text-anchor="middle" class="t-label" style="font-weight:700;fill:#92400E">机器周期 ${i+1}</text>
      `).join("")}
      <!-- 时钟周期 -->
      ${[...Array(9)].map((_,i) => `
        <rect x="${32+i*40}" y="134" width="36" height="28" rx="3" fill="#DBEAFE" stroke="#2563EB"/>
        <text x="${50+i*40}" y="152" text-anchor="middle" class="t-small" style="fill:#1E3A8A;font-weight:700">T${i+1}</text>
      `).join("")}
      <text x="200" y="185" text-anchor="middle" class="t-tiny">时钟周期 = CPU 频率的倒数（1/f）</text>
    </svg>
  </div>
</div>

<h3 class="h3">指令周期的四个"工作阶段"</h3>

<p>一条典型指令可能经历以下 <b>4 个阶段</b>，注意不是每条指令都有全部四个（例如直接寻址不需要间址）。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.2.2</span> 指令周期流程（状态机）</div>
  <div class="fig-desc">间址周期：当寻址方式为"间接寻址"时才需要；中断周期：当本条指令执行完后检测到中断请求时才进入。</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- 阶段圆角块 -->
    ${[
      ["取指 FE", 40, "必做：从主存取出指令，PC+1", "#DBEAFE", "#2563EB"],
      ["间址 IND", 230, "条件：间接寻址，真正操作数地址还在内存中", "#FEF3C7", "#D97706"],
      ["执行 EX",  420, "必做：完成指令规定的操作", "#D1FAE5", "#059669"],
      ["中断 INT", 610, "条件：本指令执行完后响应中断请求", "#FEE2E2", "#DC2626"],
    ].map(([n,x,d,bg,st]) => `
      <rect x="${x}" y="80" width="170" height="80" rx="12" fill="${bg}" stroke="${st}" stroke-width="1.8"/>
      <text x="${+x+85}" y="115" text-anchor="middle" class="t-title" style="font-size:14px;fill:${st}">${n}</text>
      <foreignObject x="${+x+10}" y="125" width="150" height="40">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font:11px Inter,sans-serif;color:#52525B;line-height:1.35;text-align:center">${d}</div>
      </foreignObject>
    `).join("")}

    <!-- 箭头 -->
    ${[
      [210,120,230,120,"stroke-ink"],
      [400,120,420,120,"stroke-ink"],
      [590,120,610,120,"stroke-ink"],
    ].map(([x1,y1,x2,y2,cls]) => `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" marker-end="url(#a1)"/>
    `).join("")}

    <!-- 跳过间址 -->
    <path d="M 125 80 Q 315 30 505 80" class="stroke-line-thin" fill="none" stroke-dasharray="4 3" marker-end="url(#a1)"/>
    <text x="315" y="50" text-anchor="middle" class="t-small">直接寻址：跳过间址</text>

    <!-- 无中断回到取指 -->
    <path d="M 695 160 Q 695 210 400 210 Q 125 210 125 160" class="stroke-line-thin" fill="none" stroke-dasharray="4 3" marker-end="url(#a1)"/>
    <text x="410" y="232" text-anchor="middle" class="t-small">无中断请求 → 下一条指令的取指</text>

    <defs>
      <marker id="a1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <polygon points="0 0, 8 4, 0 8" fill="#18181B"/>
      </marker>
    </defs>
  </svg>
</div>

<div class="callout brand">
  <div class="co-icon">★</div>
  <div class="co-body">
    <div class="co-title">记住：FE 和 EX 必做；IND 和 INT 按需。</div>
    <p>"4 个周期"中，<b>取指、执行</b>是每条指令都有的；<b>间址</b>只在需要时、<b>中断</b>只在该条指令末尾有请求时。</p>
  </div>
</div>

<!-- ============================================ 5.2.2 ============================================ -->
<h2 class="h2">5.2.2 指令周期的数据流 <span class="sub-tag" style="margin-left:10px">§5.2.2</span></h2>

<p>下面这张图是 5.2 节的"主角"。点击阶段按钮，看看每个阶段里哪些寄存器在通信，方向是什么。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.2.3</span> 四阶段数据流（可切换 · 可播放）</div>
  <div class="fig-desc">红色点状线 = 该阶段被激活的数据通路；灰色 = 未激活。观察"谁给 MAR 送地址、谁接收 MDR 的数据"。</div>

  <div class="steps-bar" id="sb-521">
    <button class="step-btn active" data-ns="df" data-v="fe">① 取指 FE</button>
    <button class="step-btn" data-ns="df" data-v="ind">② 间址 IND</button>
    <button class="step-btn" data-ns="df" data-v="ex">③ 执行 EX</button>
    <button class="step-btn" data-ns="df" data-v="int">④ 中断 INT</button>
    <div class="spacer"></div>
    <button class="play-btn" data-ns="df">▶ 播放</button>
  </div>

  <div class="step-note" id="note-521">
    <span class="sn-step">FE</span><span id="note-521-txt">PC → MAR，读主存，M(MAR) → MDR → IR，PC ← PC + "1"，OP(IR) → CU 做指令译码。</span>
  </div>

  <svg viewBox="0 0 820 360" xmlns="http://www.w3.org/2000/svg" id="svg-521">
    <!-- CPU 边框 -->
    <rect x="10" y="10" width="540" height="340" rx="12" fill="none" stroke="#D6D3D1" stroke-dasharray="5 4"/>
    <text x="30" y="32" class="t-small">CPU</text>

    <!-- 寄存器们 -->
    <g id="r-PC"><rect x="40" y="60" width="80" height="38" class="reg-box" rx="5"/><text x="80" y="84" text-anchor="middle" class="reg-label">PC</text></g>
    <g id="r-IR"><rect x="40" y="130" width="80" height="38" class="reg-box" rx="5"/><text x="80" y="154" text-anchor="middle" class="reg-label">IR</text></g>
    <g id="r-MAR"><rect x="260" y="60" width="90" height="38" class="reg-box" rx="5"/><text x="305" y="84" text-anchor="middle" class="reg-label">MAR</text></g>
    <g id="r-MDR"><rect x="260" y="130" width="90" height="38" class="reg-box" rx="5"/><text x="305" y="154" text-anchor="middle" class="reg-label">MDR</text></g>
    <g id="r-ACC"><rect x="40" y="210" width="80" height="38" class="reg-box" rx="5"/><text x="80" y="234" text-anchor="middle" class="reg-label">ACC</text></g>
    <g id="r-CU"><rect x="380" y="200" width="140" height="60" rx="6" class="cu-box"/><text x="450" y="226" text-anchor="middle" class="reg-label" fill="#DC2626">CU · 译码/控制</text><text x="450" y="245" text-anchor="middle" class="t-small">PSW/INTR 检测</text></g>
    <g id="r-SP"><rect x="40" y="285" width="80" height="38" class="reg-box" rx="5"/><text x="80" y="309" text-anchor="middle" class="reg-label">SP</text></g>

    <!-- 主存 -->
    <g>
      <rect x="590" y="60" width="200" height="230" rx="10" class="mem-box"/>
      <text x="690" y="85" text-anchor="middle" class="t-title" fill="#7C3AED">主存储器</text>
      ${[0,1,2,3,4,5].map(i => `
        <rect x="610" y="${100+i*28}" width="160" height="22" rx="3" fill="#fff" stroke="#DDD6FE"/>
        <text x="620" y="${115+i*28}" class="t-mono t-small">M[${i}]</text>
      `).join("")}
    </g>

    <!-- 数据流（都预置，通过类 .active 控制高亮） -->
    <!-- FE: PC→MAR, MAR→M, M→MDR, MDR→IR, PC+1 -->
    <g id="flow-fe" class="flow">
      <line x1="120" y1="79" x2="260" y2="79" class="dataflow"/>
      <text x="175" y="70" text-anchor="middle" class="t-tiny" fill="#4F46E5">① PC→MAR</text>

      <line x1="350" y1="79" x2="590" y2="120" class="dataflow"/>
      <text x="470" y="92" text-anchor="middle" class="t-tiny" fill="#4F46E5">② 读命令</text>

      <line x1="590" y1="150" x2="350" y2="149" class="dataflow"/>
      <text x="470" y="142" text-anchor="middle" class="t-tiny" fill="#4F46E5">③ M→MDR</text>

      <line x1="260" y1="149" x2="120" y2="149" class="dataflow"/>
      <text x="195" y="140" text-anchor="middle" class="t-tiny" fill="#4F46E5">④ MDR→IR</text>

      <path d="M 80 60 Q 60 45 45 58" class="dataflow"/>
      <text x="50" y="48" class="t-tiny" fill="#4F46E5">⑤ PC+"1"</text>

      <line x1="120" y1="149" x2="380" y2="220" class="dataflow"/>
      <text x="250" y="196" text-anchor="middle" class="t-tiny" fill="#4F46E5">⑥ OP→CU</text>
    </g>

    <!-- IND: Ad(IR)→MAR, M→MDR, 有效地址回到 MDR/IR -->
    <g id="flow-ind" class="flow" style="display:none">
      <line x1="120" y1="149" x2="260" y2="79" class="dataflow warn"/>
      <text x="170" y="108" text-anchor="middle" class="t-tiny" fill="#D97706">① Ad(IR)→MAR</text>

      <line x1="350" y1="79" x2="590" y2="120" class="dataflow warn"/>
      <text x="470" y="92" text-anchor="middle" class="t-tiny" fill="#D97706">② 读主存</text>

      <line x1="590" y1="150" x2="350" y2="149" class="dataflow warn"/>
      <text x="470" y="142" text-anchor="middle" class="t-tiny" fill="#D97706">③ M→MDR（有效地址）</text>

      <line x1="260" y1="149" x2="120" y2="149" class="dataflow warn"/>
      <text x="195" y="168" text-anchor="middle" class="t-tiny" fill="#D97706">④ MDR→IR 的地址码</text>
    </g>

    <!-- EX -->
    <g id="flow-ex" class="flow" style="display:none">
      <line x1="120" y1="149" x2="260" y2="79" class="dataflow ok"/>
      <text x="160" y="108" text-anchor="middle" class="t-tiny" fill="#059669">① Ad(IR)→MAR</text>
      <line x1="590" y1="150" x2="350" y2="149" class="dataflow ok"/>
      <text x="470" y="142" text-anchor="middle" class="t-tiny" fill="#059669">② 读操作数→MDR</text>
      <line x1="260" y1="149" x2="120" y2="229" class="dataflow ok"/>
      <text x="165" y="185" text-anchor="middle" class="t-tiny" fill="#059669">③ MDR→ACC/ALU</text>
      <path d="M 120 229 Q 230 229 260 149" class="dataflow ok" fill="none"/>
      <text x="230" y="255" text-anchor="middle" class="t-tiny" fill="#059669">④ 运算结果 → 目的地</text>
    </g>

    <!-- INT -->
    <g id="flow-int" class="flow" style="display:none">
      <line x1="120" y1="304" x2="260" y2="79" class="dataflow err"/>
      <text x="155" y="215" class="t-tiny" fill="#DC2626">① SP-1 → MAR</text>
      <line x1="120" y1="79" x2="350" y2="149" class="dataflow err"/>
      <text x="220" y="100" class="t-tiny" fill="#DC2626">② PC → MDR（保护断点）</text>
      <line x1="350" y1="149" x2="590" y2="170" class="dataflow err"/>
      <text x="450" y="160" class="t-tiny" fill="#DC2626">③ MDR → M(SP)</text>
      <path d="M 120 79 Q 60 40 40 65" class="dataflow err" fill="none"/>
      <text x="40" y="36" class="t-tiny" fill="#DC2626">④ 中断向量 → PC</text>
    </g>
  </svg>

  <div class="legend" style="margin-top:10px">
    <span class="lg"><span class="lg-dot" style="background:#EEF2FF;border-color:#4F46E5"></span>FE 取指</span>
    <span class="lg"><span class="lg-dot" style="background:#FFFBEB;border-color:#D97706"></span>IND 间址</span>
    <span class="lg"><span class="lg-dot" style="background:#ECFDF5;border-color:#059669"></span>EX 执行</span>
    <span class="lg"><span class="lg-dot" style="background:#FEF2F2;border-color:#DC2626"></span>INT 中断</span>
  </div>
</div>

<h3 class="h3">四阶段数据流详细清单（必背）</h3>
<table class="tbl">
  <thead><tr><th style="width:120px">阶段</th><th>微操作序列（核心）</th><th style="width:150px">关键要点</th></tr></thead>
  <tbody>
    <tr>
      <td><span class="pill brand">FE 取指</span></td>
      <td><code>PC → MAR</code> → <code>1 → R</code>（读命令）→ <code>M(MAR) → MDR</code> → <code>MDR → IR</code> → <code>(PC)+"1" → PC</code> → <code>OP(IR) → CU</code></td>
      <td>注意 PC+1 是 +"1 条指令字长"，不是 +1 字节</td>
    </tr>
    <tr>
      <td><span class="pill warn">IND 间址</span></td>
      <td><code>Ad(IR) → MAR</code> → <code>1 → R</code> → <code>M(MAR) → MDR</code> → <code>MDR → Ad(IR)</code></td>
      <td>把 IR 中"地址的地址"替换为"真正的地址"</td>
    </tr>
    <tr>
      <td><span class="pill ok">EX 执行</span></td>
      <td>因指令而异：算术类 → ALU 运算；LOAD → 访存读；STORE → 访存写；转移 → 改 PC</td>
      <td>无统一数据流；各类指令 5.2.2 要会画</td>
    </tr>
    <tr>
      <td><span class="pill err">INT 中断</span></td>
      <td><code>(SP)-1 → SP</code> → <code>SP → MAR</code>，<code>PC → MDR</code>，<code>1 → W</code>（保护断点）→ 关中断 → 中断向量 → PC</td>
      <td>具体细节见 5.5 节</td>
    </tr>
  </tbody>
</table>

<h3 class="h3">执行周期数据流（按指令类型分）</h3>

<div class="compare">
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#4F46E5"></span>访存类 LOAD / STORE</div>
    <ul>
      <li>LOAD: <code>Ad(IR)→MAR</code> → 读 → <code>MDR→R</code></li>
      <li>STORE: <code>R→MDR</code>，<code>Ad(IR)→MAR</code> → 写</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#059669"></span>算术/逻辑类 ADD / AND …</div>
    <ul>
      <li>读出操作数：<code>Ad(IR)→MAR</code> → <code>M→MDR</code></li>
      <li>运算：<code>MDR、ACC → ALU → ACC</code></li>
      <li>置标志：<code>ALU → PSW</code></li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#D97706"></span>转移类 JMP / BRANCH</div>
    <ul>
      <li>无条件：<code>Ad(IR) → PC</code></li>
      <li>条件：先查 PSW 的标志位，再决定是否改 PC</li>
      <li>相对：<code>PC + 位移 → PC</code></li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#DC2626"></span>调用/返回 CALL / RET</div>
    <ul>
      <li>CALL: 压栈 PC → 跳转地址 → PC</li>
      <li>RET: 栈顶弹出 → PC</li>
    </ul>
  </div>
</div>

<!-- ============================================ 5.2.3 ============================================ -->
<h2 class="h2">5.2.3 指令执行方案 <span class="sub-tag" style="margin-left:10px">§5.2.3</span></h2>

<p>"怎么把一条指令的若干步骤安排在时间轴上？"——对应三种方案。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.2.4</span> 三种执行方案对比（以两条指令 I1、I2 为例）</div>
  <div class="toggle-row" id="sched-toggle">
    <button class="tgl active" data-tgl="sched" data-val="single">① 单周期</button>
    <button class="tgl" data-tgl="sched" data-val="multi">② 多周期</button>
    <button class="tgl" data-tgl="sched" data-val="pipe">③ 流水线</button>
  </div>
  <svg viewBox="0 0 820 220" xmlns="http://www.w3.org/2000/svg" id="sched-svg">
    <!-- 时钟刻度 -->
    ${[...Array(11)].map((_,i) => `
      <line x1="${80+i*60}" y1="20" x2="${80+i*60}" y2="200" class="clk-edge"/>
      <text x="${80+i*60}" y="16" text-anchor="middle" class="t-tiny">T${i}</text>
    `).join("")}
    <text x="30" y="16" class="t-tiny">时钟</text>
    <!-- 指令行 -->
    <text x="30" y="70" class="t-label" style="font-weight:700">I1</text>
    <text x="30" y="140" class="t-label" style="font-weight:700">I2</text>

    <g id="sched-cells">
      <!-- 动态注入 -->
    </g>
  </svg>
  <div class="step-note" id="sched-note"></div>
</div>

<h3 class="h3">三种方案对比</h3>
<table class="tbl">
  <thead><tr><th>方案</th><th>特点</th><th>优点</th><th>缺点</th></tr></thead>
  <tbody>
    <tr>
      <td><b>单周期</b></td>
      <td>一条指令在 <b>1 个</b>长时钟周期内完成</td>
      <td>控制简单、CPI = 1</td>
      <td>时钟周期由<b>最慢指令</b>决定，浪费时间；频率上不去</td>
    </tr>
    <tr>
      <td><b>多周期</b></td>
      <td>按阶段分若干<b>短</b>时钟周期，不同指令周期数可不同</td>
      <td>频率高；简单指令少占周期</td>
      <td>CPI &gt; 1；控制器复杂</td>
    </tr>
    <tr>
      <td><b>流水线</b></td>
      <td>把阶段重叠起来并行执行</td>
      <td>理想 CPI 接近 1，吞吐率高</td>
      <td>冒险、前递、乱序等大量工程复杂度（见 5.6）</td>
    </tr>
  </tbody>
</table>

<div class="mnemonic">
  <div class="mn-label">记</div>
  <div class="mn-body">单周期看"<b>最慢</b>"、多周期看"<b>合适</b>"、流水线看"<b>重叠</b>"。</div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2012 年 408 综合题（节选）</span><span class="exam-tag">综合题</span></div>
  <div class="exam-body">
    <div class="q">写出 <code>ADD R1, (R2)</code>（R1 ← R1 + M[R2]，R2 存主存地址）在各阶段的数据流。</div>
    <div class="exam-ans">
      FE: <code>PC→MAR, M→MDR→IR, PC+1</code>；<br/>
      EX: <code>R2→MAR, M→MDR, R1+MDR→ALU→R1, 置 PSW</code>。<br/>
      本指令无间址（R2 本身就是地址），若无中断请求，不进入 INT。
    </div>
  </div>
</div>
`; };

window.INIT_5_2 = function(){
  // 数据流切换
  const flows = ["fe","ind","ex","int"];
  const texts = {
    fe: "PC → MAR，读主存，M(MAR) → MDR → IR，PC ← PC + \"1\"，OP(IR) → CU 做指令译码。",
    ind:"Ad(IR) → MAR，读主存，把取回的有效地址 M(MAR) → MDR → IR 的地址码字段。",
    ex: "按指令类型执行：访存类读写内存；算术类走 ALU；转移类改 PC。最终结果写回寄存器或存储器。",
    int:"关中断 → 保护断点和程序状态：SP-1 → SP，PC/PSW 入栈 → 中断向量表项 → PC，转去执行中断服务程序。",
  };
  const svg = document.getElementById("svg-521");
  const note = document.getElementById("note-521-txt");
  const noteLbl = document.querySelector("#note-521 .sn-step");
  function setFlow(v){
    flows.forEach(f => {
      const el = svg.querySelector("#flow-"+f);
      if(el) el.style.display = (f === v ? "block" : "none");
    });
    note.textContent = texts[v];
    noteLbl.textContent = v.toUpperCase();
    document.querySelectorAll('[data-ns="df"].step-btn').forEach(b => b.classList.toggle("active", b.dataset.v === v));
  }
  document.querySelectorAll('[data-ns="df"].step-btn').forEach(b => b.addEventListener("click", () => setFlow(b.dataset.v)));

  // 播放
  let timer = null;
  const playBtn = document.querySelector('[data-ns="df"].play-btn');
  let i = 0;
  playBtn.addEventListener("click", () => {
    if(timer){ clearInterval(timer); timer=null; playBtn.textContent="▶ 播放"; return; }
    playBtn.textContent = "⏸ 暂停";
    timer = setInterval(() => {
      i = (i+1) % flows.length;
      setFlow(flows[i]);
    }, 1800);
  });

  // 执行方案
  const cells = document.getElementById("sched-cells");
  const schedNote = document.getElementById("sched-note");
  function renderSched(val){
    const stages = ["FE","ID","EX","WB"]; // 简化
    const colors = {FE:"#DBEAFE",ID:"#FEF3C7",EX:"#D1FAE5",WB:"#E0E7FF"};
    function cell(x,y,w,stage,lbl){
      return `<rect x="${x}" y="${y}" width="${w}" height="40" rx="4" fill="${colors[stage]}" stroke="#fff"/>
              <text x="${x+w/2}" y="${y+26}" text-anchor="middle" class="pipe-text">${lbl||stage}</text>`;
    }
    let out = "";
    if(val === "single"){
      // I1 占 4 个周期宽度，I2 再 4 个
      out += `<rect x="80" y="50" width="240" height="40" rx="4" fill="#E0E7FF" stroke="#fff"/>
              <text x="200" y="76" text-anchor="middle" class="pipe-text">I1 · FE ID EX WB</text>`;
      out += `<rect x="320" y="50" width="240" height="40" rx="4" fill="#FDE68A" stroke="#fff"/>
              <text x="440" y="76" text-anchor="middle" class="pipe-text">I2 · FE ID EX WB</text>`;
      schedNote.innerHTML = `<span class="sn-step">单周期</span>I1 用一个大周期干完全部阶段；I2 同理。周期必须按最慢指令定。`;
    } else if(val === "multi"){
      stages.forEach((s,i) => { out += cell(80+i*60, 50, 60, s); });
      stages.forEach((s,i) => { out += cell(320+i*60, 120, 60, s); });
      schedNote.innerHTML = `<span class="sn-step">多周期</span>每条指令按阶段占若干短周期；I2 必须等 I1 结束后才能开始。`;
    } else {
      stages.forEach((s,i) => { out += cell(80+i*60, 50, 60, s); });
      stages.forEach((s,i) => { out += cell(140+i*60, 120, 60, s); });
      schedNote.innerHTML = `<span class="sn-step">流水线</span>I2 只比 I1 晚一个阶段就能开始；理想情况下每周期都有一条指令完工。`;
    }
    cells.innerHTML = out;
  }
  bindToggles("#sched-toggle","sched", renderSched);
  renderSched("single");
};
