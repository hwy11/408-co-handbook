const CHAPTER = {
  num: "3",
  title: "存储系统",
  mark: "MEM",
  sections: [
    {
      id: "3-1",
      num: "3.1",
      title: "存储器概述",
      subs: ["3.1.1 存储器的分类", "3.1.2 存储器的性能指标", "3.1.3 多级层次的存储系统"],
      lead: "存储系统的第一性原理很简单：CPU 想要又快又大又便宜的存储，但现实里三者不能同时满足，所以计算机用层次结构把矛盾拆开。",
      blocks: [
        ["分类主线", "按层次可分为寄存器、Cache、主存、外存；按介质可分为半导体、磁表面、光存储；按读写特性可分为 RAM、ROM、顺序访问和直接访问。408 更常考的是分类背后的速度、容量、易失性和访问方式。"],
        ["性能指标", "容量看能装多少位，速度看存取时间、存取周期和带宽。存取时间是一次访问从发出到完成的时间，存取周期还包含恢复时间，所以通常大于存取时间。"],
        ["层次结构", "越靠近 CPU 越快、越贵、容量越小；越远离 CPU 越慢、越便宜、容量越大。层次结构成立的根基是程序访问局部性。"]
      ],
      exam: ["区分存取时间和存取周期。", "看到层次结构题，先抓速度、容量、成本三个变量。", "Cache 和虚拟存储器都利用局部性，但前者缓解 CPU 和主存速度差，后者扩展地址空间。"]
    },
    {
      id: "3-2",
      num: "3.2",
      title: "主存储器",
      subs: ["3.2.1 SRAM芯片和DRAM芯片", "3.2.2 只读存储器", "3.2.3 主存储器的基本组成", "3.2.4 多模块存储器"],
      lead: "主存是 CPU 可以直接编址访问的大容量工作区，考试里最核心的是 SRAM/DRAM 的差异、芯片组织和并行扩展。",
      blocks: [
        ["SRAM 与 DRAM", "SRAM 用触发器存 1 位，速度快、成本高、集成度低，常用于 Cache；DRAM 用电容存 1 位，必须刷新，容量大、成本低，常用于主存。"],
        ["ROM 家族", "ROM 的关键词不是绝对不能写，而是非易失。PROM、EPROM、EEPROM、Flash 的差别主要在可擦写方式和粒度。"],
        ["主存组成", "主存由存储体、地址寄存器、数据寄存器和控制逻辑组成。地址线决定可寻址单元数，数据线决定一次传送宽度。"],
        ["多模块存储器", "单体多字适合连续取指，多体并行通过低位交叉或高位交叉提高带宽。低位交叉更适合连续地址并行访问。"]
      ],
      exam: ["DRAM 刷新通常按行进行，刷新期间可能不能正常访存。", "芯片扩展题先算字数扩展，再算位数扩展。", "低位交叉能把连续地址分散到不同模块，是提高连续访问速度的常见答案。"]
    },
    {
      id: "3-3",
      num: "3.3",
      title: "主存储器与 CPU 的连接",
      subs: ["3.3.1 连接原理", "3.3.2 主存容量的扩展", "3.3.3 存储芯片的地址分配和片选", "3.3.4 存储器与CPU的连接"],
      lead: "连接题本质是在问三件事：CPU 给什么地址，芯片需要哪些地址线，剩下的高位地址如何译码成片选信号。",
      blocks: [
        ["连接原理", "地址总线负责选择单元，数据总线负责传送数据，控制总线负责读写节拍。CPU 的访存能力由地址线位数和数据线宽度共同约束。"],
        ["容量扩展", "位扩展增加字长，字扩展增加字数；既扩字又扩位时，先用若干芯片并联得到目标字长，再用多组芯片扩展地址空间。"],
        ["片选方法", "线选法简单但浪费地址空间，译码片选能让地址空间连续、利用率高。全译码没有地址重叠，部分译码可能出现地址别名。"],
        ["答题算法", "先把目标容量化成字数乘字长，再和芯片规格相除，得到每组芯片数和组数，最后分配低位地址接片内地址，高位地址接译码器。"]
      ],
      exam: ["地址线 n 根对应 2 的 n 次方个可寻址单元。", "题目说按字节编址时，容量换算必须先落到字节。", "部分译码不是错误，但会产生多个地址访问同一芯片的现象。"]
    },
    {
      id: "3-4",
      num: "3.4",
      title: "外部存储器",
      subs: ["3.4.1 磁盘存储器", "3.4.2 固态硬盘"],
      lead: "外存解决的是持久化和大容量问题，速度瓶颈从电子电路变成机械寻道、旋转等待或闪存擦写管理。",
      blocks: [
        ["磁盘访问时间", "磁盘访问时间通常由寻道时间、旋转延迟和传输时间组成。平均旋转延迟约等于旋转一周时间的一半。"],
        ["磁盘组织", "盘面、磁道、扇区、柱面是定位数据的基本概念。连续块读写能显著降低机械移动带来的开销。"],
        ["SSD", "固态硬盘没有机械寻道，随机访问性能更好，但写入前通常需要擦除，内部依赖磨损均衡、垃圾回收和映射表。"]
      ],
      exam: ["磁盘题先拆时间项，不要只看传输率。", "SSD 快不等于没有管理成本，擦除块和写放大是理解性能波动的关键。"]
    },
    {
      id: "3-5",
      num: "3.5",
      title: "高速缓冲存储器",
      subs: ["3.5.1 程序访问的局部性原理", "3.5.2 Cache的基本工作原理", "3.5.3 Cache和主存的映射方式", "3.5.4 Cache 中主存块的替换算法", "3.5.5 Cache的一致性问题"],
      lead: "Cache 的核心不是背概念，而是会把主存地址拆成标记、索引和块内地址，并能判断命中、替换和写回。",
      blocks: [
        ["局部性", "时间局部性说明刚访问过的数据可能很快再次访问；空间局部性说明附近地址可能很快被访问。Cache 每次调入一个块，就是在利用空间局部性。"],
        ["工作过程", "CPU 先查 Cache，命中就直接读写；未命中则从主存调块。命中率越高，平均访问时间越接近 Cache 访问时间。"],
        ["映射方式", "直接映射位置唯一，速度快但冲突多；全相联位置任意，冲突少但比较复杂；组相联折中，先定位组再在组内相联查找。"],
        ["替换与写策略", "常见替换算法有随机、FIFO、LRU。写命中可写直达或写回，写不命中可写分配或非写分配。"],
        ["一致性", "多级 Cache 或多处理器中，同一数据可能有多个副本。写回策略提高效率，但会带来一致性维护问题。"]
      ],
      exam: ["直接映射：主存块号 mod Cache 行数。", "组相联：主存块号 mod 组数。", "平均访问时间通常等于命中时间加未命中率乘未命中代价。"]
    },
    {
      id: "3-6",
      num: "3.6",
      title: "虚拟存储器",
      subs: ["3.6.1 虚拟存储器的基本概念", "3.6.2 页式虚拟存储器", "3.6.3 段式虚拟存储器", "3.6.4 段页式虚拟存储器", "3.6.5 虚拟存储器与Cache的比较"],
      lead: "虚拟存储器把程序看到的地址空间和真实主存分开，让程序以为自己拥有连续大空间，操作系统和硬件负责翻译与调度。",
      blocks: [
        ["基本概念", "CPU 产生虚拟地址，经过地址变换得到物理地址。页表记录虚页到物理页框的映射，缺页时由操作系统把页面从外存调入。"],
        ["页式", "页大小固定，便于管理，地址分为页号和页内偏移。页表可能很大，所以需要多级页表和 TLB 加速地址变换。"],
        ["段式", "段按程序逻辑划分，便于共享和保护，但段长可变，容易产生外部碎片。"],
        ["段页式", "先分段，再在段内分页，兼顾逻辑保护和固定页框管理，但地址变换过程更复杂。"],
        ["与 Cache 比较", "Cache 是硬件为主、解决速度差；虚拟存储器是软硬件结合、解决容量和地址空间抽象。"]
      ],
      exam: ["页内偏移位数由页面大小决定。", "TLB 命中只省页表访问，不省真正的数据访问。", "缺页不是普通 Cache miss，它会触发操作系统介入，代价极高。"]
    },
    {
      id: "3-7",
      num: "3.7",
      title: "本章小结",
      subs: ["3.7 本章小结"],
      lead: "本章可以压成一条线：寄存器和 Cache 追速度，主存追工作容量，外存追持久容量，虚拟存储器追抽象空间。",
      blocks: [
        ["复习主线", "先掌握存储层次，再掌握主存芯片连接，然后用 Cache 解决速度差，用虚拟存储器解决地址空间和容量错觉。"],
        ["计算主线", "容量换算、地址划分、Cache 映射、平均访问时间、磁盘访问时间，是本章最容易出计算题的地方。"]
      ],
      exam: ["凡是地址题，先确认编址单位。", "凡是 Cache 题，先确认块大小、行数、组数。", "凡是虚存题，先确认页大小和页表项含义。"]
    },
    {
      id: "3-8",
      num: "3.8",
      title: "常见问题和易混淆知识点",
      subs: ["3.8 常见问题和易混淆知识点"],
      lead: "存储系统最容易错在把相似机制混成一类：Cache miss、缺页、TLB miss、地址别名、写回一致性，其实每个问题发生的层次不同。",
      blocks: [
        ["Cache miss 与缺页", "Cache miss 发生在 Cache 和主存之间，通常硬件处理；缺页发生在主存和外存之间，通常需要操作系统处理。"],
        ["TLB 与 Cache", "TLB 缓存页表项，解决地址变换速度；Cache 缓存数据或指令块，解决访存速度。"],
        ["全译码与部分译码", "全译码让每个物理芯片只响应唯一地址范围；部分译码会让多个地址映射到同一芯片。"]
      ],
      exam: ["不要把页面大小和 Cache 块大小混用。", "不要把外部碎片和内部碎片混用。", "不要把主存容量扩展和地址空间扩展混用。"]
    }
  ]
};

function renderTOC() {
  const toc = document.getElementById("toc");
  toc.innerHTML = `<div class="toc-group"><div class="toc-group-title">第 ${CHAPTER.num} 章 · ${CHAPTER.title}</div>${CHAPTER.sections.map(s => `<div class="toc-item" data-id="${s.id}"><span class="toc-num">${s.num}</span><span>${s.title}</span></div>`).join("")}</div>`;
  toc.querySelectorAll(".toc-item").forEach(el => el.addEventListener("click", () => goTo(el.dataset.id)));
}

function currentId() {
  const hash = location.hash.replace("#", "");
  return CHAPTER.sections.some(s => s.id === hash) ? hash : (localStorage.getItem(`chapter-${CHAPTER.num}-section`) || CHAPTER.sections[0].id);
}

function goTo(id) {
  location.hash = id;
  localStorage.setItem(`chapter-${CHAPTER.num}-section`, id);
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderSection(sec) {
  return `
    <h1 class="sec-title">${sec.num} ${sec.title}</h1>
    <div class="sec-meta"><b>第 ${CHAPTER.num} 章</b> / ${CHAPTER.title}</div>
    <p class="lead">${sec.lead}</p>
    <div class="callout info"><b>本节目录</b><ul>${sec.subs.map(sub => `<li>${sub}</li>`).join("")}</ul></div>
    ${sec.blocks.map(([title, body]) => `<h2 class="h2">${title}</h2><p>${body}</p>`).join("")}
    <div class="card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item => `<li>${item}</li>`).join("")}</ul></div>
  `;
}

function render() {
  const id = currentId();
  const sec = CHAPTER.sections.find(s => s.id === id);
  document.querySelectorAll(".toc-item").forEach(el => el.classList.toggle("active", el.dataset.id === id));
  document.getElementById("crumb").innerHTML = `第 ${CHAPTER.num} 章 · ${CHAPTER.title} <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;
  document.getElementById("content").innerHTML = renderSection(sec);
  const idx = CHAPTER.sections.findIndex(s => s.id === id);
  const prev = CHAPTER.sections[idx - 1], next = CHAPTER.sections[idx + 1];
  document.getElementById("prevTitle").textContent = prev ? `${prev.num} ${prev.title}` : "已到开头";
  document.getElementById("nextTitle").textContent = next ? `${next.num} ${next.title}` : "已到结尾";
  ["prevBtn", "prevBtn2"].forEach(btn => { document.getElementById(btn).disabled = !prev; document.getElementById(btn).onclick = () => prev && goTo(prev.id); });
  ["nextBtn", "nextBtn2"].forEach(btn => { document.getElementById(btn).disabled = !next; document.getElementById(btn).onclick = () => next && goTo(next.id); });
}

document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  const idx = CHAPTER.sections.findIndex(s => s.id === currentId());
  if (e.key === "ArrowLeft" && idx > 0) goTo(CHAPTER.sections[idx - 1].id);
  if (e.key === "ArrowRight" && idx < CHAPTER.sections.length - 1) goTo(CHAPTER.sections[idx + 1].id);
});
window.addEventListener("hashchange", render);
renderTOC();
render();
