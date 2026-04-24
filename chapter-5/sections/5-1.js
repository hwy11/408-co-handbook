window.SEC_5_1 = function(){ return `
<h1 class="sec-title">5.1 CPU 的功能和基本结构</h1>
<div class="sec-meta">
  <b>考点定位</b> · 概念理解为主 · 寄存器分类与用户可见性是高频选择题点
</div>

<div class="section-intro">
  <div class="intro-tag">章节地图</div>
  <p class="lead" style="margin:0">CPU = <b>运算器</b> + <b>控制器</b>。运算器负责"算"，控制器负责"指挥"。
  本节要把 CPU 拆开看：它要干哪几件事？内部由哪些部件组成？哪些寄存器程序员看得见、哪些看不见？</p>
</div>

<!-- ============================================ 5.1.1 ============================================ -->
<h2 class="h2">5.1.1 CPU 的功能 <span class="sub-tag" style="margin-left:10px">§5.1.1</span></h2>

<p>CPU 作为计算机的"大脑"，承担五项核心职能。这五条不是死记硬背，而是顺着"一条指令怎么跑完"自然推出来的。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.1.1</span> CPU 的五大功能：从"指挥"到"响应"</div>
  <div class="fig-desc">指令控制、操作控制、时间控制、数据加工属于"运行时"职责；中断处理属于"响应外部"职责。</div>
  <svg viewBox="0 0 820 260" xmlns="http://www.w3.org/2000/svg">
    <!-- CPU 主体 -->
    <rect x="290" y="60" width="240" height="140" rx="12" class="fill-bg" stroke="#18181B" stroke-width="2"/>
    <text x="410" y="90" text-anchor="middle" class="t-title" style="font-size:16px">CPU</text>
    <text x="410" y="110" text-anchor="middle" class="t-small">中央处理器</text>
    <circle cx="410" cy="150" r="26" class="fill-ink" />
    <text x="410" y="154" text-anchor="middle" class="t-white" style="font-weight:700;font-size:12px">核心</text>

    <!-- 五个功能 -->
    ${[
      ["①","指令控制",  60, 40, "顺序取指、译码、执行"],
      ["②","操作控制", 680, 40, "产生微操作信号"],
      ["③","时间控制", 680,140, "节拍 / 周期 / 时序"],
      ["④","数据加工", 680,240, "算术 & 逻辑运算"],
      ["⑤","中断处理",  60,240, "响应异常 / 外部请求"],
    ].map(([no,name,x,y,desc]) => `
      <g>
        <rect x="${x}" y="${y}" width="150" height="60" rx="8" class="fill-bg" stroke="#E7E5E4"/>
        <text x="${+x+14}" y="${+y+22}" class="t-title" style="font-size:13px">${no} ${name}</text>
        <text x="${+x+14}" y="${+y+42}" class="t-small">${desc}</text>
        <line x1="${+x < 400 ? +x+150 : +x}" y1="${+y+30}" x2="${+x < 400 ? 290 : 530}" y2="${+y < 200 ? 130 : 160}" class="stroke-line-thin"/>
      </g>
    `).join("")}
  </svg>
</div>

<div class="row-2">
  <div>
    <h4 class="h4">① 指令控制 · Program Control</h4>
    <p>按程序设定的顺序，<b>取出指令 → 分析指令 → 执行指令</b>。这是最本质的一条：没有它 CPU 就不是 CPU。</p>
    <h4 class="h4">② 操作控制 · Operation Control</h4>
    <p>一条指令要拆成若干<b>微操作</b>（如"PC→MAR"、"M→MDR"），控制器产生这些微命令信号去驱动部件。</p>
    <h4 class="h4">③ 时间控制 · Timing Control</h4>
    <p>给每个微操作<b>定时</b>。节拍发生器（时钟）敲出一拍一拍的时序，保证信号该来的时候来、该走的时候走。</p>
  </div>
  <div>
    <h4 class="h4">④ 数据加工 · Data Processing</h4>
    <p>由 <b>ALU</b> 完成算术（加减乘除）与逻辑（与或非异或、移位）运算。这是 CPU 真正"干活"的部分。</p>
    <h4 class="h4">⑤ 中断处理 · Interrupt Handling</h4>
    <p>面对 I/O 请求、除零错、非法访存等<b>异步或异常事件</b>，CPU 要能暂停当前工作、保护现场、跳去处理，处理完再回来。</p>
    <div class="callout brand" style="margin-top:10px">
      <div class="co-icon">★</div>
      <div class="co-body"><div class="co-title">口诀</div><p>"<b>指 · 操 · 时 · 数 · 断</b>"——指令、操作、时间、数据、中断。前四项是"主业"，中断是"兼职"。</p></div>
    </div>
  </div>
</div>

<!-- ============================================ 5.1.2 ============================================ -->
<h2 class="h2">5.1.2 CPU 的基本结构 <span class="sub-tag" style="margin-left:10px">§5.1.2</span></h2>

<p>按功能分，CPU 由两大部件组成：<em>运算器 ALU / Data Path</em> 与 <em>控制器 Control Unit</em>。
它们各自带一组寄存器，再加一块<b>中断系统</b>，就构成完整 CPU。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.1.2</span> CPU 整体结构框图（点击下方按钮高亮不同部件）</div>
  <div class="fig-desc">运算器关心"怎么算"，控制器关心"下一步做什么"。两者通过内部总线与寄存器通信。</div>

  <div class="steps-bar">
    <button class="step-btn active" data-ns="cpu512" data-h="all">整体</button>
    <button class="step-btn" data-ns="cpu512" data-h="alu">运算器</button>
    <button class="step-btn" data-ns="cpu512" data-h="cu">控制器</button>
    <button class="step-btn" data-ns="cpu512" data-h="reg">寄存器组</button>
    <button class="step-btn" data-ns="cpu512" data-h="int">中断系统</button>
  </div>

  <svg viewBox="0 0 820 400" xmlns="http://www.w3.org/2000/svg" id="cpu-struct-svg">
    <!-- 外边框 -->
    <rect x="10" y="10" width="800" height="380" rx="14" fill="none" stroke="#18181B" stroke-width="2" stroke-dasharray="6 4"/>
    <text x="30" y="35" class="t-title">CPU</text>

    <!-- 运算器 -->
    <g data-part="alu">
      <rect x="40" y="60" width="340" height="180" rx="10" class="alu-shape"/>
      <text x="60" y="85" class="t-title" fill="#4F46E5">运算器 (ALU + 通用寄存器)</text>
      <!-- ALU 梯形 -->
      <polygon points="130,130 250,130 280,170 100,170" class="fill-brand-soft" stroke="#4F46E5" stroke-width="1.5"/>
      <text x="190" y="155" text-anchor="middle" class="reg-label" fill="#4F46E5">ALU</text>
      <!-- 寄存器 -->
      <rect x="60" y="195" width="60" height="32" rx="4" class="reg-box"/>
      <text x="90" y="215" text-anchor="middle" class="reg-label">ACC</text>
      <rect x="130" y="195" width="60" height="32" rx="4" class="reg-box"/>
      <text x="160" y="215" text-anchor="middle" class="reg-label">X</text>
      <rect x="200" y="195" width="60" height="32" rx="4" class="reg-box"/>
      <text x="230" y="215" text-anchor="middle" class="reg-label">MQ</text>
      <rect x="270" y="195" width="90" height="32" rx="4" class="reg-box"/>
      <text x="315" y="215" text-anchor="middle" class="reg-label">PSW</text>
    </g>

    <!-- 控制器 -->
    <g data-part="cu">
      <rect x="420" y="60" width="360" height="180" rx="10" class="cu-box"/>
      <text x="440" y="85" class="t-title" fill="#DC2626">控制器 (Control Unit)</text>
      <rect x="440" y="100" width="80" height="32" rx="4" class="reg-box"/>
      <text x="480" y="120" text-anchor="middle" class="reg-label">PC</text>
      <rect x="530" y="100" width="80" height="32" rx="4" class="reg-box"/>
      <text x="570" y="120" text-anchor="middle" class="reg-label">IR</text>
      <rect x="620" y="100" width="140" height="32" rx="4" class="reg-box"/>
      <text x="690" y="120" text-anchor="middle" class="reg-label">MAR / MDR</text>
      <!-- 译码与控制 -->
      <rect x="440" y="150" width="150" height="72" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.2"/>
      <text x="515" y="175" text-anchor="middle" class="t-label">指令译码器 ID</text>
      <text x="515" y="195" text-anchor="middle" class="t-small">OP → 译码</text>
      <text x="515" y="212" text-anchor="middle" class="t-small">地址码 → 有效地址</text>

      <rect x="605" y="150" width="160" height="72" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.2"/>
      <text x="685" y="175" text-anchor="middle" class="t-label">时序/微操作生成</text>
      <text x="685" y="195" text-anchor="middle" class="t-small">节拍发生器 · CU</text>
      <text x="685" y="212" text-anchor="middle" class="t-small">→ 产生控制信号</text>
    </g>

    <!-- 寄存器组 tag（与 alu/cu 内部重叠，点击高亮所有寄存器） -->
    <g data-part="reg"></g>

    <!-- 中断系统 -->
    <g data-part="int">
      <rect x="40" y="270" width="340" height="100" rx="10" class="mem-box"/>
      <text x="60" y="295" class="t-title" fill="#7C3AED">中断系统</text>
      <rect x="60" y="310" width="120" height="32" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.2"/>
      <text x="120" y="330" text-anchor="middle" class="t-label">中断请求 INTR</text>
      <rect x="200" y="310" width="160" height="32" rx="4" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.2"/>
      <text x="280" y="330" text-anchor="middle" class="t-label">中断判优 / 屏蔽寄存器</text>
    </g>

    <!-- 内部总线 -->
    <g>
      <rect x="420" y="275" width="360" height="28" rx="4" class="bus"/>
      <text x="600" y="294" text-anchor="middle" class="bus-label">CPU 内部总线（数据/地址/控制）</text>
    </g>

    <!-- 出 CPU 到存储器方向 -->
    <g>
      <rect x="640" y="320" width="140" height="60" rx="6" fill="#fff" stroke="#A1A1AA" stroke-dasharray="4 3"/>
      <text x="710" y="348" text-anchor="middle" class="t-label">系统总线</text>
      <text x="710" y="365" text-anchor="middle" class="t-small">→ 主存 / I/O</text>
    </g>
  </svg>

  <div class="legend" style="margin-top:12px">
    <span class="lg"><span class="lg-dot" style="background:#EEF2FF;border-color:#4F46E5"></span>运算器</span>
    <span class="lg"><span class="lg-dot" style="background:#FEF2F2;border-color:#DC2626"></span>控制器</span>
    <span class="lg"><span class="lg-dot" style="background:#FFFBEB;border-color:#F59E0B"></span>寄存器</span>
    <span class="lg"><span class="lg-dot" style="background:#F5F3FF;border-color:#7C3AED"></span>中断系统</span>
  </div>
</div>

<h3 class="h3">运算器的核心部件</h3>
<table class="tbl">
  <thead><tr><th style="width:120px">部件</th><th>作用</th><th style="width:180px">关键说明</th></tr></thead>
  <tbody>
    <tr><td><code>ALU</code> 算术逻辑单元</td><td>执行加减乘除、与或非异或、移位等运算</td><td>组合逻辑电路，无状态</td></tr>
    <tr><td><code>ACC</code> 累加器</td><td>存放操作数或运算结果</td><td>单累加器结构的核心</td></tr>
    <tr><td><code>X</code> / <code>Y</code></td><td>ALU 的另一个输入暂存器</td><td>组合 ACC 参与二元运算</td></tr>
    <tr><td><code>MQ</code> 乘商寄存器</td><td>乘法中存乘数、除法中存商</td><td>配合 ACC 放双倍字长结果</td></tr>
    <tr><td>通用寄存器组 <code>GPR</code></td><td>暂存操作数、地址、结果</td><td>现代 CPU 用 GPR 替代 ACC/X/MQ</td></tr>
    <tr><td><code>PSW</code> 程序状态字寄存器</td><td>存标志位（CF/OF/ZF/SF 等）与控制位</td><td>影响条件转移与中断</td></tr>
    <tr><td>移位器 Shifter</td><td>对数据进行逻辑/算术移位</td><td>常作 ALU 输出端扩展</td></tr>
  </tbody>
</table>

<h3 class="h3">控制器的核心部件</h3>
<table class="tbl">
  <thead><tr><th style="width:120px">部件</th><th>作用</th><th style="width:180px">关键说明</th></tr></thead>
  <tbody>
    <tr><td><code>PC</code> 程序计数器</td><td>存放<b>下一条</b>待取指令的地址</td><td>自动 +"指令字长" 字节</td></tr>
    <tr><td><code>IR</code> 指令寄存器</td><td>存放<b>当前正在执行</b>的指令</td><td>取指阶段由 MDR 传入</td></tr>
    <tr><td><code>MAR</code> 存储器地址寄存器</td><td>存放将要访问的主存地址</td><td>连接地址总线</td></tr>
    <tr><td><code>MDR</code> 存储器数据寄存器</td><td>存放与主存交换的数据</td><td>连接数据总线</td></tr>
    <tr><td>指令译码器 ID</td><td>将 IR 中的操作码翻译成控制信号</td><td>是"硬布线 vs 微程序"的分野</td></tr>
    <tr><td>时序产生器</td><td>产生节拍、脉冲</td><td>给 CU 的控制信号做同步</td></tr>
    <tr><td>控制单元 CU</td><td>发出一条指令所需的全部微操作信号</td><td>5.4 节重点展开</td></tr>
  </tbody>
</table>

<!-- ============================================ 5.1.3 ============================================ -->
<h2 class="h2">5.1.3 CPU 的寄存器 <span class="sub-tag" style="margin-left:10px">§5.1.3</span></h2>

<p>寄存器是 CPU 里<b>速度最快</b>的存储。按"程序员能不能看到"分两类，这是 408 选择题的高频考点。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.1.3</span> 用户可见 vs 用户不可见寄存器</div>
  <div class="fig-desc">"可见"指能通过汇编指令直接读写。PC 看似能跳转，但你不能用 mov 随便改它、它是控制器内部的。</div>
  <svg viewBox="0 0 820 300" xmlns="http://www.w3.org/2000/svg">
    <!-- 用户可见 -->
    <rect x="20" y="30" width="380" height="250" rx="12" fill="#ECFDF5" stroke="#059669" stroke-width="1.5"/>
    <text x="40" y="60" class="t-title" fill="#059669">用户可见寄存器（汇编可直接访问）</text>
    ${[
      ["GPR 通用寄存器","存操作数、地址、临时结果",50,90],
      ["数据寄存器","仅存操作数/结果（部分架构）",50,135],
      ["地址寄存器","存地址、变址、栈指针 SP",50,180],
      ["条件码寄存器 (部分位)","CF / OF / ZF / SF …",50,225],
    ].map(([n,d,x,y]) => `
      <rect x="${x}" y="${y}" width="320" height="36" rx="6" fill="#fff" stroke="#A7F3D0"/>
      <text x="${x+16}" y="${y+16}" class="t-label" style="font-weight:700;fill:#065F46">${n}</text>
      <text x="${x+16}" y="${y+30}" class="t-small">${d}</text>
    `).join("")}

    <!-- 用户不可见 -->
    <rect x="420" y="30" width="380" height="250" rx="12" fill="#FEF2F2" stroke="#DC2626" stroke-width="1.5"/>
    <text x="440" y="60" class="t-title" fill="#DC2626">用户不可见寄存器（控制器内部）</text>
    ${[
      ["PC 程序计数器","下一条指令地址（跳转/自增）",450,90],
      ["IR 指令寄存器","当前正执行的指令",450,135],
      ["MAR 存储器地址寄存器","要访问的主存地址",450,180],
      ["MDR 存储器数据寄存器","与主存交换的数据",450,225],
    ].map(([n,d,x,y]) => `
      <rect x="${x}" y="${y}" width="320" height="36" rx="6" fill="#fff" stroke="#FECACA"/>
      <text x="${x+16}" y="${y+16}" class="t-label" style="font-weight:700;fill:#991B1B">${n}</text>
      <text x="${x+16}" y="${y+30}" class="t-small">${d}</text>
    `).join("")}
  </svg>
</div>

<div class="callout warn">
  <div class="co-icon">!</div>
  <div class="co-body">
    <div class="co-title">最容易混的几个</div>
    <ul>
      <li><b>PC 能被 JMP / CALL 改变，但它仍然是"用户不可见"的</b>——因为你不能用 <code>MOV PC, R1</code> 这类指令直接读写它（ISA 层面不提供显式编号）。改变它是跳转指令的"副作用"。</li>
      <li>部分架构（如 ARM）把 PC 做成通用寄存器 R15，那种情况下 PC 就"可见"了。408 以传统模型为准。</li>
      <li><b>PSW 整体不可见、但条件码位可见</b>：用户可以通过条件转移指令"感知"到标志位，但不能直接读 PSW 的系统模式位。</li>
      <li>MAR / MDR 是 CPU 和主存之间的"缓冲寄存器"，程序员完全接触不到。</li>
    </ul>
  </div>
</div>

<h3 class="h3">寄存器的大致速度与容量层级</h3>
<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.1.4</span> 存储层次里的寄存器</div>
  <svg viewBox="0 0 820 180" xmlns="http://www.w3.org/2000/svg">
    ${[
      ["寄存器", "数十个字长",   "< 1 ns",  60, "#18181B", "#fff"],
      ["Cache", "KB ~ MB",    "1~10 ns", 220, "#3F3F46", "#fff"],
      ["主存",   "GB 级",       "50~100 ns",380, "#71717A", "#fff"],
      ["磁盘",   "TB 级",       "ms 级",     540, "#A1A1AA", "#fff"],
      ["光盘/磁带","海量",      "秒 ~ 分",   700, "#D6D3D1", "#18181B"],
    ].map(([n,c,s,x,bg,fg]) => `
      <rect x="${x}" y="40" width="110" height="100" rx="8" fill="${bg}"/>
      <text x="${+x+55}" y="70" text-anchor="middle" class="t-label" fill="${fg}" style="font-weight:700">${n}</text>
      <text x="${+x+55}" y="98" text-anchor="middle" class="t-small" fill="${fg}">${c}</text>
      <text x="${+x+55}" y="120" text-anchor="middle" class="t-small" fill="${fg}">${s}</text>
    `).join("")}
    <text x="410" y="165" text-anchor="middle" class="t-small">速度 ← 左快右慢 · 容量 → 左小右大 · 价格 ← 左贵右便宜</text>
  </svg>
</div>

<!-- ============================================ 易错 & 真题 ============================================ -->
<h2 class="h2">易错点 · 考点速览</h2>

<table class="tbl">
  <thead><tr><th>考点</th><th>正确表述</th><th>常见陷阱</th></tr></thead>
  <tbody>
    <tr><td>PC 是否"用户可见"</td><td>不可见（程序员不能直接通过指令读写）</td><td>被"转移指令能改 PC"误导成"可见"</td></tr>
    <tr><td>IR 的来源</td><td>由 <code>MDR → IR</code></td><td>误以为由 MAR 或直接从主存</td></tr>
    <tr><td>MAR 宽度</td><td>= 主存地址总线宽度 = <b>log₂(主存单元数)</b></td><td>和 MDR/数据总线混</td></tr>
    <tr><td>MDR 宽度</td><td>= 存储字长 = 数据总线宽度</td><td>和字长/机器字长混</td></tr>
    <tr><td>PSW 归属</td><td>多数教材放在运算器，部分放在控制器（王道：运算器）</td><td>教材不同表述不同</td></tr>
    <tr><td>ALU 是否有状态</td><td>是组合逻辑，<b>本身无状态</b>（状态由 PSW 保存）</td><td>把 ACC 当作 ALU 一部分无所谓，但 ALU 自己不记事</td></tr>
  </tbody>
</table>

<div class="mnemonic">
  <div class="mn-label">口诀</div>
  <div class="mn-body">
    <b>运算器看"数"</b>：ALU · ACC · X · MQ · PSW。<br/>
    <b>控制器看"路"</b>：PC · IR · MAR · MDR · ID · CU。<br/>
    <b>可见与否</b>：看得见 → 能被指令<i>直接命名</i>；PC/IR/MAR/MDR 只是"被动参与"，<b>不可见</b>。
  </div>
</div>

<div class="exam">
  <div class="exam-head">
    <span>真题 · 2009 年 408</span>
    <span class="exam-tag">选择题</span>
  </div>
  <div class="exam-body">
    <div class="q">下列部件中，属于 CPU 的是（ ）。<br/>
      Ⅰ. 指令寄存器 IR 　 Ⅱ. 程序计数器 PC 　 Ⅲ. 通用寄存器 GPR 　 Ⅳ. 主存储器 MM</div>
    <div class="exam-ans">Ⅰ、Ⅱ、Ⅲ。主存储器 MM 位于 CPU 之外，通过系统总线与 CPU 相连。</div>
  </div>
</div>

<div class="exam">
  <div class="exam-head">
    <span>真题 · 典型题</span>
    <span class="exam-tag">判断</span>
  </div>
  <div class="exam-body">
    <div class="q">用户可以通过汇编指令直接访问 PC。</div>
    <div class="exam-ans">错误。PC 是控制器内部寄存器，不对用户"透明命名"；跳转/调用指令<b>间接</b>修改它。</div>
  </div>
</div>

`; };

window.INIT_5_1 = function(){
  const svg = document.getElementById("cpu-struct-svg");
  const btns = document.querySelectorAll('[data-ns="cpu512"].step-btn');
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.toggle("active", x===b));
    const h = b.dataset.h;
    svg.querySelectorAll("g[data-part]").forEach(g => {
      if(h === "all") g.classList.remove("dim");
      else if(h === "reg") {
        // 寄存器高亮：让 reg-box 周围不 dim、其他 dim
        g.classList.add("dim");
      } else {
        g.classList.toggle("dim", g.dataset.part !== h);
      }
    });
    if(h === "reg"){
      // 专门高亮所有 .reg-box
      svg.querySelectorAll("g[data-part]").forEach(g => g.classList.add("dim"));
      svg.querySelectorAll(".reg-box").forEach(r => {
        r.classList.add("active");
        // 让其祖先 g 不 dim
        let p = r.parentNode;
        while(p && p !== svg){ if(p.dataset && p.dataset.part) p.classList.remove("dim"); p = p.parentNode; }
      });
    } else {
      svg.querySelectorAll(".reg-box").forEach(r => r.classList.remove("active"));
    }
  }));
};
