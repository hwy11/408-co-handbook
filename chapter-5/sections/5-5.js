window.SEC_5_5 = function(){ return `
<h1 class="sec-title">5.5 异常和中断机制</h1>
<div class="sec-meta">
  <b>考点定位</b> · 异常/中断的分类是每年必考的概念辨析题 · 响应过程的 6 步必须顺背
</div>

<div class="section-intro">
  <div class="intro-tag">本节主线</div>
  <p class="lead" style="margin:0">程序在跑，突然发生"意外"：有可能是 CPU 自己的错（除零）、可能是软件的请求（系统调用）、
  可能是外设发来的呼叫（键盘、磁盘）。本节讲<b>这种打断怎么识别、怎么响应、响应完怎么回来</b>。</p>
</div>

<!-- ============================================ 5.5.1 ============================================ -->
<h2 class="h2">5.5.1 基本概念 <span class="sub-tag" style="margin-left:10px">§5.5.1</span></h2>

<p>广义的"中断"包括一切<b>打断现行程序</b>的事件。按教材分两类：</p>

<div class="compare">
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#DC2626"></span>异常 Exception · 内部事件</div>
    <ul>
      <li>由 <b>CPU 自身</b>执行指令时触发</li>
      <li>与当前指令<b>同步</b>：查得出、定得准</li>
      <li>例：除零、溢出、非法指令、缺页、访存违例、系统调用 TRAP</li>
      <li>早期中文教材也称"内中断"</li>
    </ul>
  </div>
  <div class="cmp-card">
    <div class="cmp-title"><span class="dot" style="background:#4F46E5"></span>中断 Interrupt · 外部事件</div>
    <ul>
      <li>由 <b>CPU 之外</b>（I/O 设备、定时器等）发来</li>
      <li>与当前指令<b>异步</b>：何时来不一定</li>
      <li>例：键盘/鼠标输入完成、磁盘 DMA 完成、定时中断</li>
      <li>早期中文教材也称"外中断"</li>
    </ul>
  </div>
</div>

<div class="callout brand">
  <div class="co-icon">★</div>
  <div class="co-body">
    <div class="co-title">为什么要有中断机制？</div>
    <p>如果没有中断：CPU 要<b>轮询</b>每个设备、每种错误——效率极低。有了中断，CPU 可以"专心干活"，让设备"需要时叫我"，
    把异步事件变成"叫醒服务"。</p>
  </div>
</div>

<!-- ============================================ 5.5.2 ============================================ -->
<h2 class="h2">5.5.2 异常和中断的分类 <span class="sub-tag" style="margin-left:10px">§5.5.2</span></h2>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.5.1</span> 完整分类树</div>
  <svg viewBox="0 0 820 380" xmlns="http://www.w3.org/2000/svg">
    <!-- root -->
    <rect x="340" y="20" width="160" height="36" rx="6" fill="#18181B"/>
    <text x="420" y="43" text-anchor="middle" class="t-white t-label" style="font-weight:700">打断事件</text>

    <!-- 两大支 -->
    <rect x="120" y="90" width="180" height="40" rx="6" class="fill-err-soft" stroke="#DC2626"/>
    <text x="210" y="115" text-anchor="middle" class="t-label" style="font-weight:700;fill:#DC2626">异常 Exception（内部）</text>
    <line x1="420" y1="56" x2="210" y2="90" class="stroke-line"/>

    <rect x="540" y="90" width="180" height="40" rx="6" class="fill-brand-soft" stroke="#4F46E5"/>
    <text x="630" y="115" text-anchor="middle" class="t-label" style="font-weight:700;fill:#4F46E5">中断 Interrupt（外部）</text>
    <line x1="420" y1="56" x2="630" y2="90" class="stroke-line"/>

    <!-- 异常三小类 -->
    ${[
      ["故障 Fault", 30, "可恢复：缺页、访存违例","#FEE2E2"],
      ["自陷 Trap", 185, "主动触发：系统调用","#FEE2E2"],
      ["终止 Abort", 340, "不可恢复：硬件错、非法指令","#FEE2E2"],
    ].map(([n,x,d,c],i) => `
      <rect x="${x}" y="170" width="145" height="56" rx="6" fill="${c}" stroke="#DC2626"/>
      <text x="${+x+72}" y="192" text-anchor="middle" class="t-label" style="font-weight:700;fill:#991B1B">${n}</text>
      <text x="${+x+72}" y="210" text-anchor="middle" class="t-tiny">${d}</text>
      <line x1="210" y1="130" x2="${+x+72}" y2="170" class="stroke-line-thin"/>
    `).join("")}

    <!-- 异常触发时机 -->
    <text x="240" y="255" text-anchor="middle" class="t-tiny" fill="#71717A">触发时机：</text>
    <text x="90" y="275" text-anchor="middle" class="t-tiny">指令执行期间</text>
    <text x="250" y="275" text-anchor="middle" class="t-tiny">指令执行后</text>
    <text x="410" y="275" text-anchor="middle" class="t-tiny">指令执行期间</text>

    <!-- 中断两小类 -->
    ${[
      ["可屏蔽中断 INTR", 495, "一般外设、可被 IF 屏蔽","#EEF2FF"],
      ["不可屏蔽中断 NMI", 660, "严重错误、掉电等，不能屏蔽","#EEF2FF"],
    ].map(([n,x,d,c]) => `
      <rect x="${x}" y="170" width="150" height="56" rx="6" fill="${c}" stroke="#4F46E5"/>
      <text x="${+x+75}" y="192" text-anchor="middle" class="t-label" style="font-weight:700;fill:#312E81">${n}</text>
      <text x="${+x+75}" y="210" text-anchor="middle" class="t-tiny">${d}</text>
      <line x1="630" y1="130" x2="${+x+75}" y2="170" class="stroke-line-thin"/>
    `).join("")}

    <!-- 补充：响应策略 -->
    <rect x="60" y="310" width="700" height="60" rx="8" fill="#F4F4F2" stroke="#A1A1AA"/>
    <text x="80" y="332" class="t-label" style="font-weight:700">检查时机</text>
    <text x="200" y="332" class="t-small">· 异常：发生时立即处理或指令末尾</text>
    <text x="500" y="332" class="t-small">· 中断：每条指令执行末尾统一检查 INTR</text>
    <text x="80" y="352" class="t-label" style="font-weight:700">是否重执</text>
    <text x="200" y="352" class="t-small">· Fault 可重新执行（恢复后接着来）</text>
    <text x="450" y="352" class="t-small">· Trap 执行后继续下一条</text>
    <text x="650" y="352" class="t-small">· Abort 不恢复</text>
  </svg>
</div>

<h3 class="h3">三种异常的例子，别记混</h3>
<table class="tbl">
  <thead><tr><th style="width:110px">类别</th><th>典型例子</th><th>发生时机</th><th>返回地址</th></tr></thead>
  <tbody>
    <tr><td><span class="pill err">故障 Fault</span></td><td>缺页异常 · 段错误 · 除零</td><td>指令执行<b>中</b>发现</td><td>返回到<b>当前指令</b>（处理后重试）</td></tr>
    <tr><td><span class="pill warn">自陷 Trap</span></td><td>系统调用 <code>int 0x80</code> · 断点指令 <code>INT 3</code></td><td>指令<b>执行完</b>后</td><td>返回到<b>下一条指令</b></td></tr>
    <tr><td><span class="pill ink">终止 Abort</span></td><td>硬件故障 · 非法操作码</td><td>任意</td><td><b>不返回</b>，系统处理</td></tr>
  </tbody>
</table>

<div class="callout warn">
  <div class="co-icon">!</div>
  <div class="co-body">
    <div class="co-title">最容易混的两对</div>
    <ul>
      <li><b>Fault vs Abort</b>：能不能恢复。缺页能恢复（换页回来重做），硬件错不能。</li>
      <li><b>Trap vs 中断</b>：Trap 是主动的（用户执行了 INT 指令自己找的），中断是被动的（外设突然来了）。</li>
    </ul>
  </div>
</div>

<!-- ============================================ 5.5.3 ============================================ -->
<h2 class="h2">5.5.3 响应过程 <span class="sub-tag" style="margin-left:10px">§5.5.3</span></h2>

<p>下面是中断响应的<b>经典 6 步</b>，硬件自动完成，顺序必背。</p>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.5.2</span> 中断响应 6 步流程（可点击逐步查看）</div>
  <div class="steps-bar" id="sb-intr">
    ${[
      "① 关中断", "② 保存断点", "③ 识别源", "④ 保护现场", "⑤ 执行 ISR", "⑥ 恢复并返回"
    ].map((n,i) => `<button class="step-btn ${i===0?'active':''}" data-ns="intr" data-v="${i}">${n}</button>`).join("")}
    <div class="spacer"></div>
    <button class="play-btn" data-ns="intr">▶ 播放</button>
    <button class="reset-btn" data-ns="intr">⟲ 重置</button>
  </div>
  <div class="step-note" id="intr-note">
    <span class="sn-step" id="intr-lbl">STEP 1</span><span id="intr-txt">——</span>
  </div>

  <svg viewBox="0 0 820 240" xmlns="http://www.w3.org/2000/svg" id="intr-svg">
    <!-- 主程序 -->
    <rect x="40" y="40" width="180" height="160" rx="10" fill="#fff" stroke="#A1A1AA"/>
    <text x="130" y="65" text-anchor="middle" class="t-title">主程序</text>
    ${[0,1,2,3,4].map(i => `<line x1="60" y1="${85+i*20}" x2="200" y2="${85+i*20}" stroke="#D6D3D1"/>`).join("")}
    <circle cx="130" cy="125" r="6" fill="#DC2626" id="intr-here"/>
    <text x="145" y="128" class="t-tiny" fill="#DC2626">指令 k 结束，发现中断</text>

    <!-- 栈 -->
    <rect x="280" y="40" width="120" height="160" rx="10" fill="#FFFBEB" stroke="#F59E0B"/>
    <text x="340" y="65" text-anchor="middle" class="t-title" fill="#92400E">栈 / 现场</text>
    ${[0,1,2,3].map(i => `<rect x="295" y="${85+i*26}" width="90" height="22" fill="#fff" stroke="#FDE68A" id="stack-${i}"/>`).join("")}
    <text x="340" y="215" text-anchor="middle" class="t-tiny">SP</text>

    <!-- ISR -->
    <rect x="460" y="40" width="180" height="160" rx="10" fill="#EEF2FF" stroke="#4F46E5"/>
    <text x="550" y="65" text-anchor="middle" class="t-title" fill="#312E81">中断服务程序 ISR</text>
    ${[0,1,2,3,4].map(i => `<line x1="480" y1="${85+i*20}" x2="620" y2="${85+i*20}" stroke="#C7D2FE"/>`).join("")}

    <!-- 中断源 / 向量表 -->
    <rect x="680" y="40" width="120" height="80" rx="10" fill="#F5F3FF" stroke="#7C3AED"/>
    <text x="740" y="65" text-anchor="middle" class="t-title" fill="#5B21B6">中断向量表</text>
    <text x="740" y="85" text-anchor="middle" class="t-tiny">设备号 → ISR 地址</text>

    <!-- 动态箭头 -->
    <g id="arrow-stage"></g>
  </svg>
</div>

<h3 class="h3">6 步详细说</h3>
<table class="tbl">
  <thead><tr><th style="width:120px">步骤</th><th>动作</th><th>谁完成</th></tr></thead>
  <tbody>
    <tr><td>① 关中断</td><td>把 EFLAGS/PSW 的 IF 位置 0，防止中断嵌套失控</td><td>硬件</td></tr>
    <tr><td>② 保存断点</td><td>把 PC（有的架构还有 PSW）压栈</td><td>硬件</td></tr>
    <tr><td>③ 识别中断源</td><td>向量法：读向量表；查询法：轮询接口</td><td>硬件</td></tr>
    <tr><td>④ 保护现场</td><td>把通用寄存器保存到栈</td><td><b>软件</b>（ISR 入口）</td></tr>
    <tr><td>⑤ 执行 ISR</td><td>处理中断的具体逻辑</td><td>软件</td></tr>
    <tr><td>⑥ 恢复与返回</td><td>恢复通用寄存器、开中断、<code>IRET</code> 弹出 PC</td><td>软件→硬件</td></tr>
  </tbody>
</table>

<div class="callout info">
  <div class="co-icon">i</div>
  <div class="co-body">
    <div class="co-title">"硬件完成"与"软件完成"的分界线</div>
    <p><b>①②③</b> 由硬件自动完成（称为"中断隐指令"），<b>④⑤⑥</b> 由中断服务程序（软件）完成。所以考题常问："保护断点"和"保护现场"分别是谁干的？——断点=硬件；现场=软件。</p>
  </div>
</div>

<h3 class="h3">中断隐指令（不可编程的"虚拟指令"）</h3>
<p>硬件自动执行、用户不能用汇编写出的一段动作，合称"中断隐指令"：</p>
<ol>
  <li>关中断（IF ← 0）</li>
  <li>保护断点（PC → 栈；有的架构 PSW 也压）</li>
  <li>送中断服务程序入口地址（由向量表查得）→ PC</li>
</ol>

<h3 class="h3">向量中断 vs 非向量中断</h3>
<table class="tbl">
  <thead><tr><th>方式</th><th>机制</th><th>速度</th></tr></thead>
  <tbody>
    <tr><td><b>向量中断</b></td><td>每个中断源有唯一编号 → 查向量表 → 直接跳到 ISR</td><td>快</td></tr>
    <tr><td><b>非向量中断</b></td><td>所有中断共用一个入口，入口程序再查询是谁 → 分支到 ISR</td><td>慢</td></tr>
  </tbody>
</table>

<h3 class="h3">多重中断 / 中断嵌套</h3>
<p>ISR 执行中，允许更<b>高优先级</b>的中断打断当前 ISR，叫多重中断。要点：</p>
<ul>
  <li>ISR 入口先关中断保护现场；</li>
  <li>保护完<b>开中断</b>才可能被更高优先级抢占；</li>
  <li>返回前再关中断、恢复现场、最后 IRET 开中断并回用户程序。</li>
</ul>

<div class="fig">
  <div class="fig-title"><span class="fig-idx">FIG 5.5.3</span> 单重 vs 多重中断（时间轴）</div>
  <svg viewBox="0 0 820 220" xmlns="http://www.w3.org/2000/svg">
    <!-- 单重 -->
    <text x="20" y="40" class="t-label" style="font-weight:700">单重</text>
    <rect x="80" y="20" width="300" height="30" fill="#FEF3C7" stroke="#D97706"/>
    <text x="230" y="40" text-anchor="middle" class="t-small">主程序</text>
    <rect x="380" y="20" width="320" height="30" fill="#FEE2E2" stroke="#DC2626"/>
    <text x="540" y="40" text-anchor="middle" class="t-small">ISR-1（全程关中断，不可打断）</text>
    <rect x="700" y="20" width="100" height="30" fill="#FEF3C7" stroke="#D97706"/>
    <text x="750" y="40" text-anchor="middle" class="t-small">主程序</text>

    <!-- 多重 -->
    <text x="20" y="130" class="t-label" style="font-weight:700">多重</text>
    <rect x="80" y="110" width="200" height="30" fill="#FEF3C7" stroke="#D97706"/>
    <text x="180" y="130" text-anchor="middle" class="t-small">主程序</text>

    <rect x="280" y="110" width="100" height="30" fill="#FEE2E2" stroke="#DC2626"/>
    <text x="330" y="130" text-anchor="middle" class="t-small">ISR-1 入口</text>

    <rect x="380" y="110" width="160" height="30" fill="#EEF2FF" stroke="#4F46E5"/>
    <text x="460" y="130" text-anchor="middle" class="t-small">ISR-2（高优先级打断）</text>

    <rect x="540" y="110" width="140" height="30" fill="#FEE2E2" stroke="#DC2626"/>
    <text x="610" y="130" text-anchor="middle" class="t-small">回到 ISR-1</text>

    <rect x="680" y="110" width="120" height="30" fill="#FEF3C7" stroke="#D97706"/>
    <text x="740" y="130" text-anchor="middle" class="t-small">主程序</text>

    <line x1="80" y1="80" x2="800" y2="80" stroke="#D6D3D1"/>
    <line x1="80" y1="170" x2="800" y2="170" stroke="#D6D3D1"/>

    <text x="410" y="200" text-anchor="middle" class="t-small">多重中断要求 ISR 在"保护完现场后"主动开中断</text>
  </svg>
</div>

<div class="mnemonic">
  <div class="mn-label">记</div>
  <div class="mn-body">
    <b>"关、断、源 → 场、服、返"</b>——关中断、保断点、识源 / 保现场、执行 ISR、恢复返回。<br/>
    前三步<b>硬件</b>做，后三步<b>软件</b>做。
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2010 年 408</span><span class="exam-tag">选择题</span></div>
  <div class="exam-body">
    <div class="q">下列事件中，属于异常（内部中断）的是（ ）。<br/>
      A. 键盘输入 　 B. 除法运算除零 　 C. 打印机缺纸 　 D. 磁盘 DMA 完成</div>
    <div class="exam-ans">B。A/C/D 均为外部 I/O 引发，属于（可屏蔽）中断；只有 B 是由 CPU 执行 DIV 指令内部触发。</div>
  </div>
</div>

<div class="exam">
  <div class="exam-head"><span>真题 · 2016 年 408</span><span class="exam-tag">选择题</span></div>
  <div class="exam-body">
    <div class="q">下列关于异常/中断处理的叙述，错误的是（ ）。<br/>
      A. 关中断由硬件完成　B. 保护断点由硬件完成　C. 保护现场由软件完成　D. 中断服务程序首地址由程序员填写到 PC</div>
    <div class="exam-ans">D。ISR 首地址由硬件从中断向量表中取出并送入 PC，程序员只设置向量表内容，不是"手动填 PC"。</div>
  </div>
</div>
`; };

window.INIT_5_5 = function(){
  const steps = [
    { lbl:"关中断",    txt:"硬件将 IF 位清 0，禁止同级/更低优先级中断再次打断。",
      draw:`<line x1="130" y1="135" x2="130" y2="200" class="dataflow err"/>
            <text x="90" y="220" class="t-tiny" fill="#DC2626">关 IF → 0</text>` },
    { lbl:"保护断点",  txt:"硬件自动把当前 PC（和 PSW）压栈，便于日后返回。",
      draw:`<line x1="220" y1="125" x2="295" y2="90" class="dataflow err"/>
            <text x="250" y="80" class="t-tiny" fill="#DC2626">PC → 栈</text>
            <rect x="295" y="85" width="90" height="22" fill="#FCA5A5" stroke="#DC2626"/>
            <text x="340" y="101" text-anchor="middle" class="t-mono t-tiny" fill="#fff">PC 断点</text>` },
    { lbl:"识别中断源", txt:"硬件根据中断号从向量表取出 ISR 入口地址 → PC。",
      draw:`<line x1="680" y1="80" x2="465" y2="80" class="dataflow err"/>
            <text x="570" y="70" class="t-tiny" fill="#DC2626">查向量表 → PC</text>` },
    { lbl:"保护现场",  txt:"软件（ISR 开头）把通用寄存器压栈，之后才能开中断。",
      draw:`<rect x="295" y="111" width="90" height="22" fill="#FDE68A" stroke="#F59E0B"/>
            <text x="340" y="127" text-anchor="middle" class="t-mono t-tiny">R0..Rn</text>
            <text x="400" y="122" class="t-tiny">软件保存寄存器</text>` },
    { lbl:"执行 ISR",  txt:"在 ISR 中完成真正的中断处理（读键盘缓冲、应答设备等）。",
      draw:`<rect x="480" y="95" width="140" height="18" fill="#4F46E5"/>
            <text x="550" y="108" text-anchor="middle" class="t-tiny" fill="#fff">正在执行 ISR 体</text>` },
    { lbl:"恢复与返回", txt:"软件恢复现场，执行 IRET：硬件弹出 PC，恢复 IF，回到用户程序。",
      draw:`<line x1="295" y1="96" x2="130" y2="125" class="dataflow ok"/>
            <text x="195" y="90" class="t-tiny" fill="#059669">IRET · 弹 PC 回主程序</text>` },
  ];
  const stage = document.querySelector("#intr-svg #arrow-stage");
  const note = document.getElementById("intr-txt");
  const lbl = document.getElementById("intr-lbl");
  function setStep(i){
    const s = steps[i];
    stage.innerHTML = s.draw;
    note.textContent = s.txt;
    lbl.textContent = "STEP " + (i+1);
    document.querySelectorAll('[data-ns="intr"].step-btn').forEach((b,idx) => b.classList.toggle("active", idx===i));
  }
  document.querySelectorAll('[data-ns="intr"].step-btn').forEach(b => b.addEventListener("click", () => setStep(+b.dataset.v)));

  let timer = null, i = 0;
  const play = document.querySelector('[data-ns="intr"].play-btn');
  const reset = document.querySelector('[data-ns="intr"].reset-btn');
  play.addEventListener("click", () => {
    if(timer){ clearInterval(timer); timer=null; play.textContent="▶ 播放"; return; }
    play.textContent = "⏸ 暂停";
    timer = setInterval(() => { i=(i+1)%steps.length; setStep(i); }, 1700);
  });
  reset.addEventListener("click", () => { if(timer){clearInterval(timer);timer=null;play.textContent="▶ 播放";} i=0; setStep(0); });

  setStep(0);
};
