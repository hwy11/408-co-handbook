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

const RICH = {
  "3-1": `
    <div class="card"><h3 class="h3" style="margin-top:0">先建立直觉</h3><p>存储系统不是一块“很大的内存”，而是一套妥协方案。CPU 每秒能做海量操作，如果每次都去慢速外存取数据，CPU 大部分时间都会干等；但如果所有数据都用最快的触发器保存，成本和体积又完全不可接受。所以真正的设计思路是：把最可能马上用到的数据放在离 CPU 最近、最快的地方，把暂时不用但必须保存的数据放到更远、更便宜、更大的地方。</p><p>这就是存储层次的核心。它不是教材为了分类而分类，而是在解决一个物理矛盾：速度、容量、价格不能同时最优。408 考这章，表面上问 SRAM、DRAM、Cache、虚拟存储器，底层一直在问你是否理解这套分层为什么成立。</p></div>
    <h2 class="h2">存储器分类怎么记才不乱</h2><p>按层次看，寄存器最快最小，Cache 次之，主存再往下，外存最大最慢。这个顺序要直接长在脑子里，因为很多判断题会变着法问“谁由硬件管理、谁由操作系统管理、谁对程序员可见”。寄存器通常是 CPU 内部显式可见资源，Cache 对程序员基本透明，主存是程序运行时直接依赖的空间，外存负责长期保存。</p><p>按存取方式看，随机存取意味着访问任意单元时间基本相同，RAM 就是典型例子；顺序存取必须按顺序移动到目标位置，磁带是典型例子；直接存取可以先定位到大致区域再顺序找，磁盘比较接近这个模型。按信息保存能力看，易失性存储器掉电丢数据，非易失性存储器掉电不丢，ROM、Flash、磁盘、SSD 都属于后者。</p>
    <h2 class="h2">性能指标的考试口径</h2><p>容量是能存多少信息，通常用位、字节或字数乘字长表示。题里说“1M × 8 位芯片”，意思是有 1M 个可寻址单元，每个单元 8 位，总容量是 8M bit，也就是 1MB。这里最容易错的是 M 在计算机里常按 2 的 20 次方理解。</p><p>存取时间是从发出读写请求到数据可用或写入完成的时间。存取周期是在连续两次访问之间必须间隔的最短时间，它包含恢复、刷新、预充电等额外过程，所以通常大于或等于存取时间。带宽看单位时间传多少数据，它不只由单次延迟决定，还受数据线宽度、总线频率、交叉存储和突发传输影响。</p>
    <h2 class="h2">多级存储系统为什么有效</h2><p>多级存储系统能骗过 CPU，靠的是局部性原理。时间局部性说刚访问过的东西大概率很快还会访问，比如循环变量；空间局部性说访问了某个地址后，很可能访问附近地址，比如顺序执行指令、遍历数组。没有局部性，Cache 就只是昂贵的小内存，层次结构也不会显著提升平均速度。</p><p>考试里看到“平均访问时间”，就要想到加权平均：命中时走快路径，未命中时付出额外代价。比如 Cache 平均访问时间常写成命中时间加未命中率乘未命中代价。这个式子背后的意思很朴素：系统看起来快不快，不取决于最慢那层有多慢，而取决于你多频繁掉到那一层。</p>
  `,
  "3-2": `
    <div class="card"><h3 class="h3" style="margin-top:0">先建立直觉</h3><p>主存是 CPU 正常执行程序时直接面对的“大工作台”。程序、数据、栈、堆都要先进入主存，CPU 才能通过地址访问它们。主存这节真正要学的不是背器件名，而是理解一个存储芯片怎样从“很多个 0/1 单元”组织成可寻址、可读写、可扩展的系统。</p></div>
    <h2 class="h2">SRAM 和 DRAM 的本质差别</h2><p>SRAM 用触发器保存 1 位信息，只要不断电，状态可以稳定保持，不需要刷新。它速度快、控制简单，但每位需要多个晶体管，所以面积大、成本高、集成度低，适合做容量较小但速度要求极高的 Cache。</p><p>DRAM 用电容上的电荷表示 1 位。电容会漏电，所以必须周期性刷新。它读出时还可能破坏原信息，需要再生。缺点是控制复杂、速度较慢，优点是单元简单、集成度高、容量大、成本低，所以主存通常用 DRAM。408 喜欢问“为什么主存不用 SRAM”，答案不是 SRAM 不好，而是太贵、太占面积。</p>
    <h2 class="h2">ROM 不等于永远不能写</h2><p>ROM 的核心特征是非易失，而不是现代语境里绝对不可修改。掩膜 ROM 出厂固化；PROM 可一次编程；EPROM 可用紫外线擦除；EEPROM 可电擦写；Flash 是 EEPROM 的一种发展，通常按块擦除，广泛用于 SSD、U 盘和固件存储。考试里把它们按“能不能改、怎么改、掉电丢不丢”三条线整理就够了。</p>
    <h2 class="h2">主存基本组成</h2><p>主存储器由存储体、地址译码、读写控制、数据寄存器和地址寄存器等部分构成。CPU 给出地址，地址译码器选择对应单元；读操作时数据从存储体送到数据线，写操作时数据线上的内容写入被选单元。地址线数量决定能选多少个单元，数据线数量决定一次能传多少位。</p><p>如果按字节编址，地址 0、1、2、3 指的是一个个字节；如果按字编址，地址 0、1、2、3 指的是一个个机器字。408 容量题最容易在这里翻车，因为同样 32 根地址线，按字节编址和按字编址对应的总位容量不一样。</p>
    <h2 class="h2">多模块存储器的意义</h2><p>主存访问速度跟不上 CPU 时，可以通过并行组织提高吞吐。高位交叉把连续地址放在同一模块的一段区域，适合按模块扩展容量；低位交叉把连续地址轮流分散到不同模块，适合连续访问时并行工作。比如四体低位交叉中，地址 0、1、2、3 分属四个模块，连续取指时多个模块可以交叠响应。</p>
  `,
  "3-3": `
    <div class="card"><h3 class="h3" style="margin-top:0">先建立直觉</h3><p>主存和 CPU 连接题，本质像给一栋楼安排门牌号。CPU 手里有一串地址线，它只会喊“我要访问某个地址”；存储芯片内部有自己的地址脚，只能识别芯片内部的门牌。你要做的事，就是把 CPU 地址的低位接给芯片内部寻址，把高位拿去判断“这次该哪一片芯片响应”。</p></div>
    <h2 class="h2">容量扩展的固定算法</h2><p>第一步，把目标存储器写成“字数 × 字长”。第二步，把单个芯片规格也写成同样形式。第三步，字长不够就做位扩展：多片芯片并联，地址线共用，每片负责数据总线的一部分。第四步，字数不够就做字扩展：多组芯片共享数据总线，用片选信号决定哪一组工作。</p><p>例如目标是 64K × 16 位，芯片是 16K × 8 位。字长 16 位需要两片 8 位芯片并联成一组；字数 64K 是 16K 的 4 倍，需要 4 组；总共 8 片。芯片内部 16K 单元需要 14 根地址线，所以 CPU 地址低 14 位接芯片地址脚；剩下高位用来译码产生 4 个片选。</p>
    <h2 class="h2">片选为什么重要</h2><p>如果没有片选，多片芯片会同时往数据总线上送数据，结果就冲突。片选信号就是告诉某一片或某一组芯片“这次轮到你”。线选法直接用高位地址线作为片选，简单但浪费地址空间；译码片选把若干高位地址送入译码器，产生互斥片选信号，地址空间更规整。</p><p>全译码会使用所有相关高位地址参与译码，因此每个物理单元只有唯一地址；部分译码只用部分高位地址，硬件简单，但会产生地址重叠，也就是多个不同地址访问到同一物理单元。考试判断“是否有地址重叠”时，就看是不是所有未接入片内地址的高位都参与了译码。</p>
    <h2 class="h2">和 CPU 总线的关系</h2><p>地址总线宽度给出 CPU 理论可寻址范围，数据总线宽度给出一次传输位数，控制线给出读、写、片选、允许等时序信号。存储器连接图里，低位地址通常进芯片地址端，高位地址进译码器，数据端并到数据总线，读写控制端接 CPU 控制信号。</p>
  `,
  "3-4": `
    <div class="coach-card"><p><strong>先把磁盘想成一台“旋转的图书馆”。</strong>数据不是凭空放在一个抽象空间里，而是写在一圈一圈的磁道上。磁头像读书机器的探针，先移动到目标那一圈，再等目标扇区转到自己下面，最后才开始真正读数据。你如果没先建立这个画面，后面的“寻道时间、旋转延迟、传输时间”就全是空话。</p></div>
    <section class="disk-story">
      <div class="disk-map">
        <div class="track-ring ring-1"></div>
        <div class="track-ring ring-2"></div>
        <div class="track-ring ring-3"></div>
        <div class="sector sector-a">扇区</div>
        <div class="disk-head">磁头</div>
      </div>
      <div class="story-copy">
        <h2>磁盘到底在读什么</h2>
        <p><strong>盘面</strong>是一张能记录磁信号的圆盘表面，<strong>磁道</strong>是盘面上一圈一圈的同心圆，<strong>扇区</strong>是磁道上切出来的小段，也是磁盘读写数据的基本单位之一。</p>
        <p>多个盘面上半径相同的磁道合在一起，叫<strong>柱面</strong>。这个词不是为了增加难度，它的意义是：磁头组在同一个半径上切换盘面，比移动磁臂去另一个半径更快。</p>
      </div>
    </section>
    <section class="time-breakdown">
      <h2>一次磁盘随机读，慢在这三步</h2>
      <div class="time-steps">
        <div><span>01</span><b>寻道时间</b><p>磁头移动到目标磁道。随机访问经常慢在这里，因为每次位置都可能差很远。</p></div>
        <div><span>02</span><b>旋转延迟</b><p>盘片继续转，等目标扇区转到磁头下面。平均等半圈，所以平均旋转延迟约等于半圈时间。</p></div>
        <div><span>03</span><b>传输时间</b><p>扇区到了磁头下面，数据才真正开始连续读出。顺序读快，是因为前两步成本被摊薄了。</p></div>
      </div>
      <div class="formula-callout"><strong>磁盘访问时间 ≈ 寻道时间 + 平均旋转延迟 + 数据传输时间</strong><span>这不是死公式，是“先找到哪一圈、再等哪一段、最后读出来”的物理过程。</span></div>
    </section>
    <section class="ssd-story">
      <div>
        <h2>SSD 为什么不是“更快的磁盘”这么简单</h2>
        <p><strong>SSD 没有磁头、盘片、寻道、旋转等待。</strong>所以它随机读通常强很多，尤其是读很多零散小块时，机械硬盘会被定位时间拖死，SSD 不会。</p>
        <p>但 SSD 的麻烦在写入。Flash 通常不能像内存那样随便覆盖一个字节，它常常要先<strong>按块擦除</strong>，再写入页面。控制器还要做<strong>磨损均衡</strong>，避免某些块被反复写坏；还要做<strong>垃圾回收</strong>，把有效数据搬走、整理空块。于是 SSD 快，但不是没有代价。</p>
      </div>
      <div class="ssd-grid">
        ${Array.from({ length: 32 }, (_, i) => `<span class="${i % 7 === 0 ? "hot" : ""}"></span>`).join("")}
      </div>
    </section>
  `,
  "3-5": `
    <div class="card"><h3 class="h3" style="margin-top:0">先建立直觉</h3><p>Cache 可以理解成 CPU 身边的一张小抄。CPU 不可能每次都翻完整本主存，于是把最近可能用到的一小块内容放在小抄上。问题是小抄很小，所以必须解决三件事：主存块放到 Cache 哪儿，怎么判断它在不在，满了替换谁。</p></div>
    <h2 class="h2">地址划分是核心技能</h2><p>Cache 题最重要的是把地址拆开。块内地址由块大小决定，比如块大小 32B，则块内偏移 5 位。Cache 有多少行或多少组，决定索引位数。剩下高位就是标记 Tag，用来判断这个位置里放的到底是哪一个主存块。</p><p>直接映射中，每个主存块只能进固定 Cache 行，行号等于主存块号 mod Cache 行数。全相联中，主存块可以进任意行，不需要索引所有行的固定位置，但要比较所有 Tag。组相联折中，主存块先按 mod 组数进入某一组，再在组内任意行放置。</p>
    <h2 class="h2">命中、未命中和平均访问时间</h2><p>命中就是 CPU 要的块已经在 Cache 中；未命中就必须从下一层调入。平均访问时间常见表达是：命中时间 + 未命中率 × 未命中代价。这里的未命中代价包括访问主存、把块装入 Cache、可能写回脏块等开销。</p><p>别把命中率当成唯一指标。块太小，空间局部性利用不充分；块太大，会挤掉其他有用块，还可能增加调块时间。Cache 设计一直在平衡命中率、命中时间和未命中代价。</p>
    <h2 class="h2">替换算法和写策略</h2><p>满了以后替换谁，是替换算法要解决的问题。FIFO 换最早进入的块，简单但不一定合理；LRU 换最长时间没用的块，更贴近时间局部性，但硬件维护成本更高；随机替换实现简单，效果有时也不差。</p><p>写策略分两层：写命中时，写直达会同时写 Cache 和主存，一致性简单但流量大；写回只改 Cache，等替换时再写回主存，速度快但要维护脏位。写不命中时，写分配会把块调入 Cache 再写，非写分配则直接写下层。</p>
  `,
  "3-6": `
    <div class="card"><h3 class="h3" style="margin-top:0">先建立直觉</h3><p>虚拟存储器给程序制造了一个“我拥有一大片连续内存”的幻觉。程序发出的地址不是物理内存真实地址，而是虚拟地址。硬件和操作系统合作，把虚拟地址翻译成物理地址；如果对应页面不在主存，就从外存调入。</p></div>
    <h2 class="h2">页式虚拟存储器</h2><p>页式系统把虚拟地址空间切成固定大小的页，把物理主存切成同样大小的页框。虚拟地址分成虚页号和页内偏移。页内偏移不需要翻译，因为页和页框大小相同；真正要查的是虚页号对应哪个物理页框。</p><p>页表就是这张映射表。页表项通常包含页框号、有效位、访问权限、修改位、访问位等。有效位为 0 说明该页不在主存，访问它会产生缺页异常，操作系统介入，把页面从外存调入，必要时还要换出某个旧页。</p>
    <h2 class="h2">TLB 的意义</h2><p>如果每次访存都先访问页表，再访问数据，访存次数会翻倍。TLB 是页表项的小型高速缓存，用来保存最近用过的虚页到页框映射。TLB 命中时可以快速得到物理地址；TLB 未命中但页面在主存时，只需要查页表并回填 TLB；如果页表显示页面不在主存，才是缺页。</p>
    <h2 class="h2">段式和段页式</h2><p>段式按程序逻辑划分，比如代码段、数据段、栈段。它方便共享和保护，因为段本身有明确语义，但段长可变，容易出现外部碎片。页式没有外部碎片，管理规整，但页没有逻辑意义。段页式先分段，再在段内分页，兼顾逻辑保护和固定大小管理，代价是地址变换更复杂。</p>
  `,
  "3-7": `
    <div class="card"><h3 class="h3" style="margin-top:0">本章真正要带走的东西</h3><p>存储系统不是散点知识，它是一条从“快”到“大”的链。寄存器解决立即操作，Cache 解决 CPU 和主存速度差，主存承载运行中的程序，外存保存长期数据，虚拟存储器把主存和外存组织成程序可用的地址空间。</p><p>复习时不要先背名词，先问每一层解决什么矛盾。SRAM/DRAM 解决成本与速度的器件选择，主存扩展解决容量与位宽，Cache 解决局部性带来的加速，虚拟存储器解决程序地址空间与真实主存容量不一致。</p></div>
    <h2 class="h2">计算题抓手</h2><p>容量题先统一单位；连接题先算芯片片数，再分低位地址和高位片选；Cache 题先算块内偏移、索引和标记；虚存题先算页内偏移和页号；磁盘题先拆寻道、旋转、传输。只要这个顺序不乱，大部分题不会无从下手。</p>
  `,
  "3-8": `
    <div class="card"><h3 class="h3" style="margin-top:0">最容易混的几组概念</h3><p>Cache miss、TLB miss、缺页这三件事最容易混。TLB miss 是地址翻译的小缓存没命中，不代表页面不在主存；Cache miss 是数据缓存没命中，要去下层存储找数据；缺页是页表发现页面不在主存，需要操作系统把它从外存调进来。三者代价不是一个数量级。</p><p>内部碎片和外部碎片也要分清。分页因为页大小固定，最后一页可能用不满，这是内部碎片；分段因为段长可变，内存空洞可能分散，这是外部碎片。Cache 块大小、页面大小、磁盘块大小也不能混用，它们属于不同层次。</p></div>
    <h2 class="h2">答题时的自检句</h2><p>看到地址，先问编址单位是什么。看到映射，先问谁映射到谁。看到命中，先问是哪一级命中。看到替换，先问替换对象是 Cache 块还是虚存页面。把这四个问题问完，很多“看起来会、做起来错”的题会立刻变清楚。</p>
  `
};

const DEEP = {
  "3-1": {
    tag: "Memory Hierarchy",
    thesis: "存储系统不是在问“有哪些存储器”，而是在问：CPU 想要的数据，怎么用最低成本尽可能快地送到它手里。",
    visual: "ladder",
    anchors: [
      ["3.1.1 存储器的分类", "先按离 CPU 远近建立层次，再按存取方式、介质、掉电是否丢失去补充分类。分类不是目的，分类背后的速度、容量、价格、可见性才是考点。"],
      ["3.1.2 存储器的性能指标", "容量、存取时间、存取周期、带宽是四个口径。存取时间看一次访问多久，存取周期看两次访问之间至少隔多久，带宽看单位时间能搬多少。"],
      ["3.1.3 多级层次的存储系统", "层次结构成立靠局部性。没有时间局部性和空间局部性，Cache 就没有意义，平均访问时间也不会被拉低。"]
    ],
    examples: [
      {
        title: "例题 1：为什么存储器不能全部用最快的 SRAM？",
        q: "既然 SRAM 比 DRAM 快，为什么主存通常不用 SRAM 全部实现？",
        a: "因为 SRAM 每位需要多个晶体管，成本高、面积大、集成度低。主存追求大容量和可接受成本，所以通常用 DRAM；SRAM 更适合放在容量小但速度要求极高的 Cache。",
        trap: "别答成“SRAM 不稳定”或“SRAM 会丢数据”。SRAM 只要不断电是稳定的，问题在成本和集成度。"
      },
      {
        title: "例题 2：存取时间和存取周期怎么区分？",
        q: "某存储器存取时间为 60ns，恢复时间为 20ns，连续两次读操作最快间隔是多少？",
        a: "最快间隔是存取周期，等于 60ns + 20ns = 80ns。60ns 只是一次访问从请求到数据可用的时间，不代表马上能开始下一次访问。",
        trap: "题目问连续访问间隔时，要答存取周期，不是存取时间。"
      },
      {
        title: "例题 3：平均访问时间的第一性原理",
        q: "Cache 命中时间 10ns，未命中率 5%，未命中代价 100ns，平均访问时间是多少？",
        a: "平均访问时间 = 10ns + 5% × 100ns = 15ns。意思是大多数时候走快路，少数时候掉到慢路并付出额外代价。",
        trap: "未命中代价是否包含命中时间要看题目口径。408 常见写法是命中时间 + 未命中率 × 未命中代价。"
      }
    ]
  },
  "3-3": {
    tag: "CPU ↔ Memory",
    thesis: "CPU 和主存连接题，本质是把 CPU 给出的地址拆成两部分：低位进芯片内部找格子，高位做片选决定哪组芯片响应。",
    visual: "address",
    anchors: [
      ["3.3.1 连接原理", "地址线负责指定位置，数据线负责搬内容，控制线负责告诉芯片读还是写。连接图不是画线游戏，而是地址、数据、控制三类信号的分工。"],
      ["3.3.2 主存容量的扩展", "位扩展解决字长不够，字扩展解决字数不够。先横向拼宽，再纵向拼多，这是最稳的解题顺序。"],
      ["3.3.3 存储芯片的地址分配和片选", "芯片内部地址脚吃低位地址；片选电路吃高位地址。全译码无地址重叠，部分译码可能有地址别名。"],
      ["3.3.4 存储器与 CPU 的连接", "最终要能说清楚：哪些 CPU 地址线接芯片地址端，哪些地址线进译码器，数据线如何并联，读写控制线接到哪里。"]
    ],
    examples: [
      {
        title: "例题 1：芯片数量怎么算",
        q: "用 8K × 8 位芯片组成 32K × 16 位存储器，需要多少片？",
        a: "字长从 8 位扩到 16 位，需要 2 片并联；字数从 8K 扩到 32K，需要 4 组。所以总片数 = 2 × 4 = 8 片。",
        trap: "先看字长，再看字数。不要直接用总容量相除后就结束，因为还要说明组织方式。"
      },
      {
        title: "例题 2：地址线怎么分",
        q: "上题中，单片 8K 需要几根片内地址线？32K 总空间需要几根地址线？",
        a: "8K = 2¹³，所以单片片内地址线 13 根。32K = 2¹⁵，所以总地址线 15 根。低 13 位接芯片地址端，高 2 位用于译码产生 4 组片选。",
        trap: "高位不是接到每片芯片内部地址脚，而是用来选择哪一组芯片工作。"
      },
      {
        title: "例题 3：部分译码为什么会地址重叠",
        q: "若 CPU 有若干高位地址没有参与片选译码，会发生什么？",
        a: "这些高位无论取 0 还是 1，片选结果都一样，于是多个不同地址会访问同一物理芯片单元，这就是地址重叠或地址别名。",
        trap: "地址重叠不一定导致电路不能工作，但会浪费地址空间，也可能让程序访问出现多个地址对应同一单元。"
      }
    ]
  },
  "3-4": {
    tag: "External Storage",
    thesis: "外存不是主存的低配版，它解决的是“长期保存大量数据”；磁盘慢在机械定位，SSD 快在没有机械定位，但写入又被擦除和管理成本牵制。",
    visual: "disk",
    anchors: [
      ["3.4.1 磁盘存储器", "先记画面：盘片在转，磁头在移动，数据在磁道的扇区里。读一个扇区要先找磁道，再等扇区转过来，最后才传输数据。"],
      ["磁盘为什么随机慢", "随机读每次都可能重新移动磁头、重新等待旋转；顺序读一旦定位成功，后面很多扇区能连续读，所以定位成本被摊薄。"],
      ["3.4.2 固态硬盘", "SSD 没有机械寻道和旋转等待，所以随机读强；但 Flash 写入前常要擦除，还要做磨损均衡、垃圾回收，写入不是零成本。"]
    ],
    examples: [
      {
        title: "例题 0：先判断这题在考哪一层",
        q: "题目说“磁盘随机访问慢”，你第一反应应该是什么？",
        a: "先想到不是传输带宽低，而是定位成本高。机械硬盘要移动磁头到目标磁道，还要等目标扇区转到磁头下面，这两步就是随机访问慢的根。",
        trap: "不要一看到慢就只谈“传输速率”。磁盘随机访问的核心矛盾是机械定位。"
      },
      {
        title: "例题 1：平均旋转延迟",
        q: "磁盘转速 7200 rpm，平均旋转延迟约为多少？",
        a: "7200 rpm = 每分钟 7200 转 = 每秒 120 转。转一圈时间是 1/120 秒 ≈ 8.33ms。平均旋转延迟约半圈，所以约 4.17ms。",
        trap: "rpm 先换成每秒转数，再算一圈时间。不要直接拿 7200 当频率。"
      },
      {
        title: "例题 2：磁盘访问时间",
        q: "平均寻道 6ms，平均旋转延迟 4ms，传输时间 1ms，一次随机读大约多久？",
        a: "总时间约为 6 + 4 + 1 = 11ms。随机读不是只看传输时间，定位成本通常才是大头。",
        trap: "题目问随机访问时，不能只用数据量除传输率。"
      },
      {
        title: "例题 3：为什么 SSD 随机访问强",
        q: "SSD 为什么随机读性能通常远好于机械硬盘？",
        a: "SSD 没有磁头移动和盘片旋转，不需要寻道和等待扇区转过来。它的随机读主要是控制器定位 Flash 页并读出，机械延迟被消除了。",
        trap: "SSD 不是没有任何延迟，写入还会受擦除块、垃圾回收、写放大影响。"
      }
    ]
  },
  "3-5": {
    tag: "Cache",
    thesis: "Cache 的本质是一张很小但很快的“近身索引表”：它赌你马上要用的数据，大概率就在刚用过的数据附近。",
    visual: "cache",
    anchors: [
      ["3.5.1 程序访问的局部性原理", "时间局部性说明刚用过的还会用，空间局部性说明旁边的也会用。Cache 每次调入一整块，就是在利用空间局部性。"],
      ["3.5.2 Cache 的基本工作原理", "CPU 先查 Cache，命中直接用；未命中从主存调块。平均访问时间取决于命中时间、未命中率、未命中代价。"],
      ["3.5.3 Cache 和主存的映射方式", "直接映射位置唯一，全相联位置任意，组相联先定位组再组内任选。地址拆分是核心。"],
      ["3.5.4 Cache 中主存块的替换算法", "满了才需要替换。FIFO 简单，LRU 贴近局部性，随机实现低成本。"],
      ["3.5.5 Cache 的一致性问题", "写回提高效率但会让 Cache 和主存暂时不一致，多处理器还会出现多个 Cache 副本一致性问题。"]
    ],
    examples: [
      {
        title: "例题 1：地址字段划分",
        q: "32 位地址，Cache 容量 16KB，块大小 32B，直接映射。块内偏移、行索引、Tag 各几位？",
        a: "块大小 32B，所以块内偏移 5 位。Cache 行数 = 16KB / 32B = 512 = 2⁹，所以行索引 9 位。Tag = 32 - 9 - 5 = 18 位。",
        trap: "Cache 容量要除以块大小得到行数，不是直接拿容量位数当索引。"
      },
      {
        title: "例题 2：组相联映射",
        q: "Cache 共 64 行，4 路组相联，主存块号 27 映射到哪一组？",
        a: "组数 = 64 / 4 = 16。组号 = 主存块号 mod 组数 = 27 mod 16 = 11，所以进第 11 组。",
        trap: "组相联取模用组数，不是用总行数。"
      },
      {
        title: "例题 3：平均访问时间",
        q: "命中时间 2ns，命中率 95%，未命中代价 80ns，平均访问时间是多少？",
        a: "未命中率 5%。平均访问时间 = 2ns + 0.05 × 80ns = 6ns。",
        trap: "命中率要先转成未命中率。不要写成 2 + 0.95 × 80。"
      }
    ]
  },
  "3-6": {
    tag: "Virtual Memory",
    thesis: "虚拟存储器给程序制造了一个巨大、连续、独占的地址空间幻觉；页表、TLB、缺页异常负责把幻觉落到真实主存和外存上。",
    visual: "virtual",
    anchors: [
      ["3.6.1 虚拟存储器的基本概念", "CPU 产生虚拟地址，硬件查表翻译成物理地址。页面不在主存时触发缺页，由操作系统调页。"],
      ["3.6.2 页式虚拟存储器", "页大小固定，虚拟地址分成虚页号和页内偏移。页号查页表，偏移原样保留。"],
      ["3.6.3 段式虚拟存储器", "段按程序逻辑划分，便于共享保护，但段长可变，容易产生外部碎片。"],
      ["3.6.4 段页式虚拟存储器", "先分段，再分页，兼顾逻辑结构和固定大小管理，但地址变换更复杂。"],
      ["3.6.5 虚拟存储器与 Cache 的比较", "Cache 主要解决速度差，虚拟存储器主要解决地址空间抽象和主存容量限制。"]
    ],
    examples: [
      {
        title: "例题 1：虚拟地址划分",
        q: "虚拟地址 32 位，页面大小 4KB，虚页号和页内偏移各几位？",
        a: "4KB = 2¹²B，所以页内偏移 12 位。虚页号 = 32 - 12 = 20 位。",
        trap: "页内偏移由页面大小决定，不由主存大小决定。"
      },
      {
        title: "例题 2：TLB miss 一定缺页吗？",
        q: "TLB 未命中是否一定说明页面不在主存？",
        a: "不一定。TLB 只是页表项的高速缓存。TLB miss 只说明快表里没有该映射，还要查页表；页表有效位为 1，页面就在主存，只需回填 TLB。",
        trap: "TLB miss、Cache miss、缺页是三个层次的问题，不能混成一个。"
      },
      {
        title: "例题 3：缺页为什么代价巨大",
        q: "为什么缺页比普通 Cache miss 慢很多？",
        a: "缺页要操作系统介入，可能选择牺牲页、若脏则写回外存，再从磁盘或 SSD 调入目标页，最后恢复进程执行。它跨越主存和外存，代价远高于 Cache 到主存。", 
        trap: "缺页不是硬件悄悄调一个块那么简单，它会引发异常处理流程。"
      }
    ]
  },
  "3-7": {
    tag: "Chapter Summary",
    thesis: "第三章要串成一条链：快的靠近 CPU，大的远离 CPU，地址和映射负责把不同层次连成一个可运行的整体。",
    visual: "summary",
    anchors: [
      ["存储层次", "寄存器、Cache、主存、外存从快到慢、从小到大、从贵到便宜。"],
      ["主存组织", "芯片通过位扩展和字扩展组成目标容量，通过地址译码和片选接入 CPU。"],
      ["Cache", "利用局部性解决 CPU 和主存速度差，核心技能是地址拆分和映射判断。"],
      ["虚拟存储器", "用地址变换和调页机制给程序提供大而连续的地址空间幻觉。"]
    ],
    examples: [
      {
        title: "综合例题 1：看到地址题先问什么",
        q: "遇到存储容量、Cache、虚存地址题，第一步分别问什么？",
        a: "容量题先问编址单位；Cache 题先问块大小和行/组数；虚存题先问页面大小。第一步问错，后面全会偏。",
        trap: "不要一上来套公式，先把地址被什么划分搞清楚。"
      },
      {
        title: "综合例题 2：谁负责管理",
        q: "Cache 和虚拟存储器分别主要由谁管理？",
        a: "Cache 主要由硬件自动管理，对程序员透明；虚拟存储器由硬件和操作系统共同管理，缺页时操作系统必须介入。",
        trap: "二者都利用局部性，但解决的问题和管理者不同。"
      }
    ]
  },
  "3-8": {
    tag: "Confusion Killer",
    thesis: "这一节不是复习新知识，而是把最容易混成一团的概念拆开；408 很爱考这种边界感。",
    visual: "confusion",
    anchors: [
      ["Cache miss", "数据或指令块不在 Cache，要去主存找。通常硬件处理。"],
      ["TLB miss", "地址翻译缓存里没有页表项，要去页表找。页面可能仍然在主存。"],
      ["缺页", "页表发现页面不在主存，要从外存调页。操作系统介入，代价极高。"],
      ["内部碎片与外部碎片", "分页易有内部碎片，分段易有外部碎片。"]
    ],
    examples: [
      {
        title: "辨析例题 1：TLB miss 后一定访问外存吗？",
        q: "TLB miss 后一定会访问外存调页吗？",
        a: "不一定。先查页表，如果页表有效位为 1，只是 TLB 没缓存该映射；只有有效位为 0 才缺页并访问外存。",
        trap: "TLB miss 是快表没命中，缺页是主存没页面。"
      },
      {
        title: "辨析例题 2：Cache 块和页面能不能混用？",
        q: "Cache 块大小和虚拟存储器页面大小是不是同一个概念？",
        a: "不是。Cache 块是 Cache 和主存之间交换的数据单位；页面是主存和外存之间虚拟存储管理的单位。层次不同，大小也通常不同。",
        trap: "题中出现 offset 时，要先判断这是块内偏移还是页内偏移。"
      },
      {
        title: "辨析例题 3：分页为什么没有外部碎片？",
        q: "页式虚拟存储器为什么通常说没有外部碎片？",
        a: "因为页面和页框大小固定，任意虚页都能装入任意空闲页框，不需要寻找连续可变长空间。但一个进程最后一页可能用不满，所以可能有内部碎片。",
        trap: "分段是按逻辑段可变长分配，更容易产生外部碎片。"
      }
    ]
  }
};

function renderDeepSection(sec, deep) {
  return `
    <section class="lesson-hero deep-hero">
      <div>
        <div class="lesson-kicker">${deep.tag}</div>
        <h1 class="lesson-title">${sec.num} ${sec.title}</h1>
        <p class="lesson-thesis">${deep.thesis}</p>
      </div>
      ${renderDeepVisual(deep.visual)}
    </section>
    <section class="anchor-map">
      ${deep.anchors.map(([name, body]) => `<article><b>${name}</b><p>${body}</p></article>`).join("")}
    </section>
    ${RICH[sec.id] || ""}
    <section class="example-zone">
      <div class="zone-head"><span>Exam Drill</span><h2>用例题把概念钉住</h2></div>
      ${deep.examples.map((ex, index) => `
        <article class="exam-deep">
          <div class="exam-num">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <h3>${ex.title}</h3>
            <p class="question">${ex.q}</p>
            <p class="answer">${ex.a}</p>
            <p class="trap"><strong>易错提醒：</strong>${ex.trap}</p>
          </div>
        </article>
      `).join("")}
    </section>
    <div class="card exam-card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item => `<li>${item}</li>`).join("")}</ul></div>
  `;
}

function renderDeepVisual(type) {
  if (type === "ladder") {
    return `<div class="hierarchy-visual">${[
      ["寄存器", "最快 / 最小"],
      ["Cache", "很快 / 较小"],
      ["主存", "工作区"],
      ["外存", "最大 / 最慢"]
    ].map((row, i) => `<div style="--i:${i}"><b>${row[0]}</b><span>${row[1]}</span></div>`).join("")}</div>`;
  }
  if (type === "address") {
    return `<div class="address-visual"><div class="addr-bits"><span>高位地址</span><span>低位地址</span></div><div class="addr-flow"><b>片选译码</b><i></i><b>片内寻址</b></div><p>高位决定哪组芯片，低位决定芯片里的哪一格。</p></div>`;
  }
  if (type === "disk") {
    return `<div class="disk-visual"><div class="platter"><span></span><span></span><span></span></div><div class="arm"></div><p>寻道 + 旋转 + 传输，随机访问慢在定位。</p></div>`;
  }
  if (type === "cache") {
    return `<div class="cache-visual"><div class="cpu-chip">CPU</div><div class="cache-lines">${Array.from({length:6},(_,i)=>`<span style="--i:${i}">Tag | Index | Offset</span>`).join("")}</div><p>地址拆分后，先定位，再比较 Tag。</p></div>`;
  }
  if (type === "virtual") {
    return `<div class="virtual-visual"><div>虚拟页号</div><span>页表 / TLB</span><div>物理页框</div><p>页内偏移原样带过去，页号负责查映射。</p></div>`;
  }
  if (type === "summary") {
    return `<div class="summary-visual"><b>快</b><span></span><span></span><span></span><b>大</b><p>越靠近 CPU 越快，越远离 CPU 越大。</p></div>`;
  }
  return `<div class="confusion-visual"><b>TLB miss</b><b>Cache miss</b><b>缺页</b><p>名字相似，层次完全不同。</p></div>`;
}

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
  if (sec.id === "3-2") return renderMainMemorySection(sec);
  if (DEEP[sec.id]) return renderDeepSection(sec, DEEP[sec.id]);
  return `
    <h1 class="sec-title">${sec.num} ${sec.title}</h1>
    <div class="sec-meta"><b>第 ${CHAPTER.num} 章</b> / ${CHAPTER.title}</div>
    <p class="lead">${sec.lead}</p>
    <div class="callout info"><b>本节目录</b><ul>${sec.subs.map(sub => `<li>${sub}</li>`).join("")}</ul></div>
    ${RICH[sec.id] || ""}
    ${sec.blocks.map(([title, body]) => `<h2 class="h2">${title}</h2><p>${body}</p>`).join("")}
    <div class="card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item => `<li>${item}</li>`).join("")}</ul></div>
  `;
}

function renderMainMemorySection(sec) {
  return `
    <section class="lesson-hero memory-hero">
      <div>
        <div class="lesson-kicker">3.2 Main Memory</div>
        <h1 class="lesson-title">${sec.num} ${sec.title}</h1>
        <p class="lesson-thesis">主存不是一堆芯片的堆叠，而是 CPU 的<strong>工作台</strong>：程序必须先被搬到这里，CPU 才能按地址一格一格地取指令、读数据、写结果。</p>
      </div>
      <div class="memory-stack-visual" aria-hidden="true">
        <div class="cpu-chip">CPU</div>
        <div class="bus-lines"><span></span><span></span><span></span></div>
        <div class="ram-board">
          ${Array.from({ length: 24 }, (_, i) => `<span style="--i:${i}"></span>`).join("")}
        </div>
        <div class="visual-caption">地址线选位置，数据线搬内容，控制线决定读还是写</div>
      </div>
    </section>

    <div class="exam-compass">
      <div><b>这一节你真正要会什么</b><span>不是背 SRAM、DRAM 名词，而是能解释<strong>为什么主存用 DRAM、Cache 用 SRAM</strong>，能看懂<strong>芯片容量怎么扩展</strong>，能判断<strong>多模块存储器为什么能提速</strong>。</span></div>
      <div><b>考试最爱怎么卡你</b><span>把 <strong>字数 × 字长</strong>、按字节编址、地址线位数、芯片片选混在一起。只要这些层次乱了，计算题就会错。</span></div>
    </div>

    <section class="concept-panel">
      <div class="panel-copy">
        <span class="section-chip">3.2.1 SRAM 与 DRAM</span>
        <h2>先别背表，先看它们各自在解决什么问题</h2>
        <p><strong>SRAM 像一个稳定的开关。</strong>它用触发器保存 1 位，只要不断电，状态就能稳稳保持，不需要刷新。代价是一个存储位要用多个晶体管，所以面积大、成本高、容量做不大。</p>
        <p><strong>DRAM 像一个会漏水的小杯子。</strong>它用电容有没有电表示 1 位，结构很省，容量能做大，也便宜；但电荷会漏，所以必须周期性刷新。读的时候还可能破坏原来的电荷状态，因此读完要再生。</p>
      </div>
      <div class="compare-lab">
        <div class="cell-card sram-cell">
          <div class="cell-title">SRAM</div>
          <div class="flipflop">
            <span>1</span><i></i><span>0</span>
          </div>
          <p>稳，不用刷新，贵，快。</p>
          <b>常放在 Cache</b>
        </div>
        <div class="cell-card dram-cell">
          <div class="cell-title">DRAM</div>
          <div class="capacitor"><span></span></div>
          <p>会漏电，要刷新，便宜，容量大。</p>
          <b>常放在主存</b>
        </div>
      </div>
    </section>

    <table class="tbl decision-table">
      <thead><tr><th>比较点</th><th>SRAM</th><th>DRAM</th><th>你要形成的判断</th></tr></thead>
      <tbody>
        <tr><td>基本单元</td><td>触发器</td><td>电容</td><td>触发器稳定但占面积，电容简单但会漏电。</td></tr>
        <tr><td>刷新</td><td>不需要刷新</td><td>需要周期刷新</td><td>看到“刷新”，第一反应就是 DRAM。</td></tr>
        <tr><td>速度和成本</td><td>快、贵、容量小</td><td>慢一些、便宜、容量大</td><td>所以 Cache 用 SRAM，主存用 DRAM。</td></tr>
        <tr><td>408 常考句</td><td>适合小容量高速缓冲</td><td>适合大容量主存</td><td>不是谁更先进，而是谁更适合那个层次。</td></tr>
      </tbody>
    </table>

    <section class="concept-panel reverse">
      <div class="chip-expansion">
        <div class="target-memory">
          <b>目标</b>
          <span>64K × 16 位</span>
        </div>
        <div class="chip-groups">
          ${[0,1,2,3].map(group => `<div class="chip-row"><em>组 ${group}</em><span>16K × 8</span><span>16K × 8</span></div>`).join("")}
        </div>
      </div>
      <div class="panel-copy">
        <span class="section-chip">3.2.3 主存组成</span>
        <h2>芯片扩展题，本质是在拼“格子数”和“每格宽度”</h2>
        <p>目标存储器写成 <strong>字数 × 字长</strong>。字数表示有多少个地址able 单元，字长表示每个单元能放多少位。比如 <strong>64K × 16 位</strong>，意思是有 64K 个单元，每个单元 16 位。</p>
        <p>如果芯片是 <strong>16K × 8 位</strong>，那它每片只有 16K 个单元，每格也只有 8 位。要得到 16 位字长，先用两片并联做<strong>位扩展</strong>；要从 16K 扩到 64K，再做 4 组<strong>字扩展</strong>。所以总片数是 <strong>2 × 4 = 8 片</strong>。</p>
      </div>
    </section>

    <div class="formula-strip">
      <div><span>片内地址线</span><b>log₂(16K) = 14 根</b></div>
      <div><span>数据线宽度</span><b>两片 8 位并成 16 位</b></div>
      <div><span>片选信号</span><b>4 组需要 2 位译码</b></div>
    </div>

    <section class="concept-panel">
      <div class="panel-copy">
        <span class="section-chip">3.2.4 多模块存储器</span>
        <h2>低位交叉为什么能提速</h2>
        <p>连续取指、遍历数组时，CPU 常常访问一串连续地址。如果连续地址都落在同一个存储模块里，那还是排队；如果把连续地址轮流分给不同模块，就能让多个模块<strong>交叠工作</strong>。</p>
        <p><strong>低位交叉</strong>就是用地址低位决定模块号。四体低位交叉时，地址 0、1、2、3 分别去模块 0、1、2、3；下一轮 4、5、6、7 再重复。这样连续访问时，模块可以像流水线一样接力。</p>
      </div>
      <div class="interleave-demo" id="interleaveDemo">
        <div class="addr-stream">
          ${Array.from({ length: 8 }, (_, i) => `<button class="addr-token ${i === 0 ? "active" : ""}" data-addr="${i}">${i}</button>`).join("")}
        </div>
        <div class="module-grid">
          ${[0,1,2,3].map(i => `<div class="module-bank" data-bank="${i}"><b>模块 ${i}</b><span></span><span></span></div>`).join("")}
        </div>
        <p class="demo-note" id="interleaveNote">地址 0 的低 2 位是 00，所以落到模块 0。</p>
      </div>
    </section>

    <section class="example-zone">
      <div class="zone-head"><span>Exam Drill</span><h2>用例题把主存这节打透</h2></div>
      ${[
        {
          title: "例题 1：为什么 Cache 用 SRAM、主存用 DRAM？",
          q: "SRAM 速度快，为什么不把整个主存都做成 SRAM？",
          a: "SRAM 用触发器保存信息，速度快且不需要刷新，但每位晶体管数量多，面积大、成本高、集成度低。主存追求大容量和低成本，所以通常用 DRAM；Cache 容量小但速度要求极高，所以用 SRAM。",
          trap: "不要答成 DRAM 比 SRAM 更先进。这里不是先进程度问题，而是速度、容量、成本三者取舍。"
        },
        {
          title: "例题 2：DRAM 为什么必须刷新？",
          q: "DRAM 的存储单元为什么需要周期性刷新？刷新会带来什么影响？",
          a: "DRAM 用电容电荷表示 0/1，电容会漏电，时间久了信息会消失，所以必须周期性读出并再写回。刷新期间可能占用存储阵列，使正常访存等待，影响主存可用带宽。",
          trap: "刷新不是因为断电，而是在通电运行时也会发生漏电。"
        },
        {
          title: "例题 3：芯片扩展计算",
          q: "用 16K × 4 位芯片组成 64K × 16 位存储器，需要多少片？",
          a: "字长从 4 位到 16 位，需要 4 片并联做位扩展；字数从 16K 到 64K，需要 4 组做字扩展。总片数 = 4 × 4 = 16 片。",
          trap: "位扩展和字扩展都要算，不能只用总 bit 容量相除后不说明组织。"
        },
        {
          title: "例题 4：低位交叉映射",
          q: "四体低位交叉存储器中，地址 13 应落到哪个模块？",
          a: "四体低位交叉用地址低 2 位决定模块号，13 mod 4 = 1，所以地址 13 落到模块 1。",
          trap: "低位交叉看低位或取模；高位交叉才是按一大片连续地址分到同一模块。"
        }
      ].map((ex, index) => `
        <article class="exam-deep">
          <div class="exam-num">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <h3>${ex.title}</h3>
            <p class="question">${ex.q}</p>
            <p class="answer">${ex.a}</p>
            <p class="trap"><strong>易错提醒：</strong>${ex.trap}</p>
          </div>
        </article>
      `).join("")}
    </section>

    <section class="mistake-board">
      <h2>这一节最容易丢分的地方</h2>
      <div class="mistake-grid">
        <div><b>把 bit 和 Byte 混了</b><p>芯片规格常写成 K × 位，内存容量常用 KB/MB。先统一单位，不要直接相乘完就写 MB。</p></div>
        <div><b>把字扩展和位扩展混了</b><p>位扩展解决每个单元不够宽，字扩展解决单元数量不够多。一个横向拼宽，一个纵向拼多。</p></div>
        <div><b>把低位交叉背成口诀</b><p>低位交叉不是玄学，它只是把连续地址分散到不同模块，让连续访问不再挤同一扇门。</p></div>
      </div>
    </section>

    <div class="card exam-card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item => `<li>${item}</li>`).join("")}</ul></div>
  `;
}

function initSection(id) {
  if (id !== "3-2") return;
  const demo = document.getElementById("interleaveDemo");
  const note = document.getElementById("interleaveNote");
  if (!demo || !note) return;
  const tokens = demo.querySelectorAll(".addr-token");
  const banks = demo.querySelectorAll(".module-bank");
  const explain = addr => {
    const bank = addr % 4;
    tokens.forEach(token => token.classList.toggle("active", Number(token.dataset.addr) === addr));
    banks.forEach(item => item.classList.toggle("active", Number(item.dataset.bank) === bank));
    note.innerHTML = `地址 <strong>${addr}</strong> 的低 2 位是 <strong>${addr.toString(2).padStart(3, "0").slice(-2)}</strong>，所以落到 <strong>模块 ${bank}</strong>。连续地址轮流进不同模块，这就是低位交叉的提速来源。`;
  };
  tokens.forEach(token => token.addEventListener("click", () => explain(Number(token.dataset.addr))));
  let cur = 0;
  explain(0);
  clearInterval(window.__memInterleaveTimer);
  window.__memInterleaveTimer = setInterval(() => {
    cur = (cur + 1) % 8;
    explain(cur);
  }, 1700);
}

function render() {
  const id = currentId();
  const sec = CHAPTER.sections.find(s => s.id === id);
  document.querySelectorAll(".toc-item").forEach(el => el.classList.toggle("active", el.dataset.id === id));
  document.getElementById("crumb").innerHTML = `第 ${CHAPTER.num} 章 · ${CHAPTER.title} <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;
  document.getElementById("content").innerHTML = renderSection(sec);
  initSection(sec.id);
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
