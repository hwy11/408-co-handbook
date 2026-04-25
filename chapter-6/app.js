const CHAPTER = {
  num: "6",
  title: "总线",
  sections: [
    { id: "6-talk", num: "导读", title: "本章串讲", subs: ["第六章总线串讲"], lead: "", blocks: [], exam: [] },
    {
      id: "6-1",
      num: "6.1",
      title: "总线概述",
      subs: ["6.1.1 总线基本概念", "6.1.2 总线的分类", "6.1.3 系统总线的结构", "6.1.4 常见的总线标准", "6.1.5 总线的性能指标"],
      lead: "总线解决的是多个部件如何共享一组通信线路。它牺牲一点并行自由度，换来连接简单、成本可控和扩展方便。",
      blocks: [
        ["基本概念", "总线是一组能被多个部件分时共享的公共信息传输线。共享意味着同一时刻通常只能有一个主设备控制总线，否则会发生冲突。"],
        ["分类", "按位置可分为片内总线、系统总线和通信总线；系统总线常分为数据总线、地址总线和控制总线。"],
        ["系统总线结构", "单总线结构简单但瓶颈明显；双总线、三总线通过分离 CPU、主存和 I/O 通路提升并行性。"],
        ["总线标准", "总线标准规定机械、电气、功能和过程特性。408 不要求追具体工程细节，但要理解标准化让不同设备能协同工作。"],
        ["性能指标", "总线宽度影响一次能传多少位，总线频率影响单位时间能传多少次，带宽通常由宽度和频率共同决定。"]
      ],
      exam: ["地址总线宽度决定可寻址范围，数据总线宽度影响一次传送数据量。", "总线带宽要注意单位是 bit/s 还是 B/s。", "总线共享会带来仲裁问题。"]
    },
    {
      id: "6-2",
      num: "6.2",
      title: "总线事务和定时",
      subs: ["6.2.1 总线事务", "6.2.2 总线定时"],
      lead: "一次总线传输不是一根线变一下这么简单，而是申请、仲裁、寻址、传送和结束组成的事务。",
      blocks: [
        ["总线事务", "典型事务包括请求总线、获得总线、给出地址和命令、传输数据、释放总线。主设备发起事务，从设备响应事务。"],
        ["总线仲裁", "集中仲裁由一个仲裁器决定谁使用总线，分布仲裁由各设备按规则竞争。优先级高的设备响应快，但可能让低优先级设备等待过久。"],
        ["同步定时", "同步总线用统一时钟控制各阶段，控制简单、速度高，但要求设备速度差异不能太大。"],
        ["异步定时", "异步总线通过请求和应答握手推进，不依赖统一时钟，适合速度差异大的设备，但控制更复杂。"],
        ["半同步与分离事务", "半同步在统一时钟下允许插入等待周期；分离事务把请求和响应拆开，让总线在等待期间服务其他设备。"]
      ],
      exam: ["同步不是一定快，前提是各设备能跟上统一节拍。", "异步握手题要看请求和应答信号谁先发、谁撤销。", "总线周期不等于时钟周期，一个总线周期可能包含多个时钟周期。"]
    },
    {
      id: "6-3",
      num: "6.3",
      title: "本章小结",
      subs: ["6.3 本章小结"],
      lead: "总线章很短，但它把 CPU、主存和 I/O 的通信方式串起来。抓住共享、仲裁、定时、带宽四个词就抓住了骨架。",
      blocks: [
        ["复习主线", "先理解总线为什么要共享，再理解共享带来的仲裁问题，最后理解传输过程如何通过定时协议保证双方配合。"],
        ["计算主线", "带宽题通常由宽度、频率和每周期传输次数决定。题目给的是 MHz、bit、Byte 时，先统一单位再计算。"]
      ],
      exam: ["带宽等于每次传输量乘每秒传输次数。", "总线结构题要说明瓶颈和并行性的取舍。", "定时题要把同步、异步、半同步区别讲到控制方式上。"]
    },
    {
      id: "6-4",
      num: "6.4",
      title: "常见问题和易混淆知识点",
      subs: ["6.4 常见问题和易混淆知识点"],
      lead: "总线题看似简单，实际容易把线路类型、总线结构、传输周期和时钟周期混成一团。",
      blocks: [
        ["地址总线与数据总线", "地址总线决定去哪儿，数据总线决定传什么。地址总线通常单向由主设备发出，数据总线可能双向。"],
        ["总线周期与机器周期", "总线周期描述一次总线操作的过程，机器周期描述 CPU 执行阶段的节拍，二者可能相关但不是同一个概念。"],
        ["同步与异步", "同步靠共同节拍，异步靠握手信号。判断题里看到等待响应、请求确认，通常是在考异步通信。"]
      ],
      exam: ["不要把总线宽度和总线数量混淆。", "不要把突发传输理解成多条总线同时传。", "不要漏掉仲裁，多个主设备共享总线时必须决定谁先用。"]
    }
  ]
};

const RICH = {
  "6-1": `
    <div class="coach-card"><p><strong>总线就是计算机内部的公共道路。</strong>CPU、主存、I/O 如果两两单独连线，硬件会复杂到爆；总线让大家共用一组线。好处是省线、好扩展，坏处是同一时刻不能大家一起说话，所以必须有仲裁和定时规则。</p></div>
    <h2 class="h2">三类系统总线</h2><p>数据总线传数据，宽度决定一次最多能传多少位。地址总线传地址，宽度决定可寻址范围。控制总线传读写、时钟、中断请求、总线请求、总线允许等控制信号。不要把地址总线和数据总线都简单理解成“线越多越快”：地址线更多主要扩大寻址空间，数据线更宽才直接增加单次数据传输量。</p>
    <h2 class="h2">总线结构的取舍</h2><p>单总线结构让 CPU、主存、I/O 都挂在同一条总线上，简单便宜，但所有通信抢同一通道，瓶颈明显。双总线、三总线通过拆分主存总线、I/O 总线、DMA 总线等方式减少冲突，提高并行性，但硬件复杂度上升。</p><p>判断总线结构题时，不要只背名字，要问“哪些通信可以并行，哪些仍然互相阻塞”。这比记图更可靠。</p>
    <h2 class="h2">性能指标怎么计算</h2><p>总线带宽通常等于每次传输的数据量乘每秒传输次数。比如总线宽度 64 bit，频率 100 MHz，每个时钟传一次，则带宽是 64 × 100M bit/s，也就是 800 MB/s。若每周期传两次或采用突发传输，还要按题目给的传输次数修正。</p>
  `,
  "6-2": `
    <div class="coach-card"><p><strong>一次总线传输不是“把数据放线上”这么简单。</strong>先要抢到总线，再把地址和命令放出去，再等从设备准备好，再传数据，最后释放总线。设备速度不一样，所以才需要同步、异步、等待周期这些规则。</p></div>
    <h2 class="h2">总线事务的过程</h2><p>典型读事务是：主设备请求总线，仲裁器授权，主设备放出地址和读命令，从设备识别地址并准备数据，从设备把数据放上数据总线，主设备接收数据，最后释放总线。写事务类似，只是数据方向从主设备到从设备。</p><p>主设备是发起传输的一方，不一定永远是 CPU。DMA 控制器也可以成为总线主设备，直接在 I/O 设备和主存之间搬数据。这个点连接到第七章 I/O，是 408 很爱串的地方。</p>
    <h2 class="h2">仲裁为什么必须存在</h2><p>多个主设备如果同时驱动总线，会造成冲突。集中式仲裁由一个仲裁器统一决定谁获得总线，常见方式有链式查询、计数器定时查询、独立请求。链式查询硬件简单，但离仲裁器近的设备优先级高，可能导致远端设备饥饿；独立请求速度快、优先级灵活，但控制线多。</p>
    <h2 class="h2">同步、异步、半同步</h2><p>同步定时靠统一时钟推进，每个动作在哪个时钟边沿发生都预先规定，控制简单，适合速度接近的部件。异步定时不用统一时钟，而是靠请求和应答信号握手，谁准备好了谁发信号，因此适合速度差异大的设备，但控制逻辑复杂。</p><p>半同步是在同步基础上允许慢设备插入等待周期。它保留统一时钟的大框架，又给慢设备留出喘息空间。题目里看到 WAIT、READY 之类信号，常常就是在考这个思想。</p>
  `,
  "6-3": `
    <div class="coach-card"><p><strong>第六章抓四个词就够狠：共享、仲裁、定时、带宽。</strong>共享带来竞争，竞争需要仲裁；设备速度不同，需要定时；传输能力有限，就会考带宽。它连接主存、CPU、I/O，不是孤立小章。</p></div>
    <h2 class="h2">计算题抓手</h2><p>带宽题先统一单位：bit 和 Byte 差 8 倍，MHz 是每秒百万周期，宽度是每次传输量，频率是每秒节拍数。总线周期可能包含多个时钟周期，所以不能看到频率就直接乘宽度，还要看一次传输需要几个周期。</p>
  `,
  "6-4": `
    <div class="coach-card"><p><strong>总线题最容易输在单位和层次。</strong>宽度是一次传多少，带宽是每秒传多少；时钟周期是基础节拍，总线周期是完成一次总线操作的时间；同步靠统一时钟，异步靠握手。别把这些词混着答。</p></div>
    <h2 class="h2">答题自检</h2><p>看到“多个设备”，先想仲裁。看到“速度不同”，先想异步或等待周期。看到“带宽”，先统一 bit、Byte、Hz、周期数。看到“DMA”，先想到它可能临时成为总线主设备，和 CPU 争用总线。</p>
  `
};

const DEEP = {
  "6-1": {
    tag: "Bus Basics",
    thesis: "总线不是一根神秘的线，它就是计算机内部的公共道路。公共道路的好处是省线、好扩展，坏处是大家不能同时乱开。",
    visual: "bus",
    points: [
      ["为什么要总线", "如果 CPU、主存、I/O 两两直连，线路会爆炸。总线让多个部件共享一组通信线。"],
      ["三类系统总线", "地址总线决定去哪，数据总线决定传什么，控制总线决定什么时候读、写、请求、响应。"],
      ["带宽的直觉", "带宽不是只看频率，也不是只看宽度，而是每次传多少乘每秒传几次。"]
    ],
    examples: [
      ["例题 1：地址线和数据线谁决定容量？", "地址线宽度决定可寻址范围，数据线宽度决定一次能传多少数据。", "不要把数据线宽度当成寻址范围。"],
      ["例题 2：64 位总线、100MHz、每周期传一次，带宽多少？", "64 bit × 100M/s = 6400M bit/s = 800MB/s。", "bit 转 Byte 要除以 8。"],
      ["例题 3：为什么单总线结构有瓶颈？", "CPU、主存、I/O 都抢一条路，同一时刻能进行的传输有限。结构简单，但并行性差。", "瓶颈来自共享通路，不是总线名字本身。"]
    ]
  },
  "6-2": {
    tag: "Transaction & Timing",
    thesis: "一次总线传输不是“把数据放线上”这么简单，它要先抢路，再发地址和命令，再等对方配合，最后释放总线。",
    visual: "timing",
    points: [
      ["总线事务", "一次读写通常包含请求、仲裁、寻址、传输、结束。主设备发起，从设备响应。"],
      ["总线仲裁", "多个主设备想用总线时，必须决定谁先用。DMA 控制器也可能成为主设备。"],
      ["同步和异步", "同步靠统一时钟，适合速度接近的部件；异步靠请求/应答握手，适合速度差异大的部件。"]
    ],
    examples: [
      ["例题 1：DMA 为什么会和 CPU 争总线？", "DMA 控制器要直接在 I/O 和主存之间搬数据，它会临时成为总线主设备，所以要参与仲裁。", "DMA 不是绕开总线传数据，它只是少让 CPU 逐字节参与。"],
      ["例题 2：异步总线为什么适合慢设备？", "它不强迫所有设备按同一个时钟节拍完成，而是用请求和应答确认对方准备好了。", "异步不是没有规则，它的规则是握手。"],
      ["例题 3：总线周期等于时钟周期吗？", "不一定。一次总线操作可能需要多个时钟周期，慢设备还可能插入等待周期。", "题目给频率时，还要看一次传输需要几个周期。"]
    ]
  },
  "6-3": {
    tag: "Chapter Summary",
    thesis: "第六章抓四个词就够狠：共享、仲裁、定时、带宽。共享带来仲裁，速度差带来定时，传输能力带来带宽计算。",
    visual: "summary",
    points: [
      ["共享", "多部件共用总线，省硬件但会竞争。"],
      ["仲裁", "多个主设备同时请求时，必须决定谁先用。"],
      ["定时", "规定地址、数据、控制信号什么时候有效。"],
      ["带宽", "单位时间传输多少数据，计算题要统一 bit、Byte、Hz 和周期数。"]
    ],
    examples: [
      ["综合例题 1：总线题第一反应是什么？", "看到多个主设备，先想仲裁；看到速度差异，先想异步或等待周期；看到带宽，先统一单位。", "这三个入口基本覆盖第六章高频题。"],
      ["综合例题 2：第六章和 I/O 有什么关系？", "I/O 设备通过接口接入系统，总线提供 CPU、主存、I/O 交换信息的通道，DMA、中断都离不开总线控制。", "总线不是孤立章节，它是后面 I/O 的地基。"]
    ]
  },
  "6-4": {
    tag: "Confusion Killer",
    thesis: "总线题最容易错在把几个“周期”和几个“宽度”混掉。把单位和层次分开，题就会简单很多。",
    visual: "confuse",
    points: [
      ["总线宽度 vs 总线带宽", "宽度是一次传多少，带宽是每秒传多少。"],
      ["时钟周期 vs 总线周期", "时钟周期是基础节拍，总线周期是完成一次总线操作所需时间。"],
      ["同步 vs 异步", "同步靠统一时钟，异步靠握手信号。"]
    ],
    examples: [
      ["辨析例题 1：宽度翻倍，带宽一定翻倍吗？", "如果频率和每次传输节拍不变，宽度翻倍带宽翻倍；但如果频率下降或周期数增加，就不一定。", "带宽看乘积，不看单个指标。"],
      ["辨析例题 2：突发传输是不是多条总线一起传？", "不是。突发传输是在一次地址给出后连续传多个数据，减少重复寻址和控制开销。", "突发是时序组织方式，不是总线数量增加。"],
      ["辨析例题 3：看到 READY/WAIT 信号说明什么？", "通常说明设备可能没准备好，需要插入等待或通过握手协调。", "这类信号常和半同步、异步思想相关。"]
    ]
  }
};

function renderDeep(sec) {
  const deep = DEEP[sec.id];
  return `
    <section class="lesson-hero">
      <div><div class="lesson-kicker">${deep.tag}</div><h1 class="lesson-title">${sec.num} ${sec.title}</h1><p class="lesson-thesis">${deep.thesis}</p></div>
      ${renderVisual(deep.visual)}
    </section>
    <section class="anchor-map">${deep.points.map(([title, body]) => `<article><b>${title}</b><p>${body}</p></article>`).join("")}</section>
    ${RICH[sec.id] || ""}
    <section class="example-zone"><div class="zone-head"><span>Exam Drill</span><h2>用例题把概念钉住</h2></div>${deep.examples.map((ex, i) => `<article class="exam-deep"><div class="exam-num">${String(i + 1).padStart(2, "0")}</div><div><h3>${ex[0]}</h3><p class="question">${ex[1]}</p><p class="answer">${ex[2]}</p><p class="trap"><strong>易错提醒：</strong>${ex[3]}</p></div></article>`).join("")}</section>
  `;
}

function renderVisual(type) {
  if (type === "bus") return `<div class="bus-visual"><b>CPU</b><span></span><b>主存</b><span></span><b>I/O</b><p>共享一组公共通信线，所以必须有规则。</p></div>`;
  if (type === "timing") return `<div class="bus-visual timing"><b>请求</b><span></span><b>仲裁</b><span></span><b>传输</b><span></span><b>释放</b></div>`;
  if (type === "summary") return `<div class="bus-visual summary"><b>共享</b><b>仲裁</b><b>定时</b><b>带宽</b></div>`;
  return `<div class="bus-visual summary"><b>宽度</b><b>频率</b><b>周期</b><b>单位</b></div>`;
}

function renderTOC(){const toc=document.getElementById("toc");toc.innerHTML=`<div class="toc-group"><div class="toc-group-title">第 ${CHAPTER.num} 章 · ${CHAPTER.title}</div>${CHAPTER.sections.map(s=>`<div class="toc-item" data-id="${s.id}"><span class="toc-num">${s.num}</span><span>${s.title}</span></div>`).join("")}</div>`;toc.querySelectorAll(".toc-item").forEach(el=>el.addEventListener("click",()=>goTo(el.dataset.id)));}
function currentId(){const hash=location.hash.replace("#","");return CHAPTER.sections.some(s=>s.id===hash)?hash:(localStorage.getItem(`chapter-${CHAPTER.num}-section`)||CHAPTER.sections[0].id);}
function goTo(id){location.hash=id;localStorage.setItem(`chapter-${CHAPTER.num}-section`,id);render();window.scrollTo({top:0,behavior:"instant"});}
function renderSection(sec){if(sec.id==="6-talk")return window.renderChapterTalk?window.renderChapterTalk("6"):`<div class="card">本章串讲内容加载中...</div>`;return `${renderDeep(sec)}<div class="card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item=>`<li>${item}</li>`).join("")}</ul></div>`;}
function render(){const id=currentId();const sec=CHAPTER.sections.find(s=>s.id===id);document.querySelectorAll(".toc-item").forEach(el=>el.classList.toggle("active",el.dataset.id===id));document.getElementById("crumb").innerHTML=`第 ${CHAPTER.num} 章 · ${CHAPTER.title} <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;document.getElementById("content").innerHTML=renderSection(sec);const idx=CHAPTER.sections.findIndex(s=>s.id===id);const prev=CHAPTER.sections[idx-1],next=CHAPTER.sections[idx+1];document.getElementById("prevTitle").textContent=prev?`${prev.num} ${prev.title}`:"已到开头";document.getElementById("nextTitle").textContent=next?`${next.num} ${next.title}`:"已到结尾";["prevBtn","prevBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!prev;document.getElementById(btn).onclick=()=>prev&&goTo(prev.id);});["nextBtn","nextBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!next;document.getElementById(btn).onclick=()=>next&&goTo(next.id);});}
document.addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;const idx=CHAPTER.sections.findIndex(s=>s.id===currentId());if(e.key==="ArrowLeft"&&idx>0)goTo(CHAPTER.sections[idx-1].id);if(e.key==="ArrowRight"&&idx<CHAPTER.sections.length-1)goTo(CHAPTER.sections[idx+1].id);});
window.addEventListener("hashchange",render);renderTOC();render();
