const CHAPTER = {
  num: "4",
  title: "指令系统",
  sections: [
    {
      id: "4-1",
      num: "4.1",
      title: "指令系统",
      subs: ["4.1.1 指令集体系结构", "4.1.2 指令的基本格式", "4.1.3 定长操作码指令格式", "4.1.4 扩展操作码指令格式", "4.1.5 指令的操作类型"],
      lead: "指令系统是硬件和软件之间的契约。程序员看到的是指令语义，CPU 实现的是取指、译码、执行和写回。",
      blocks: [
        ["ISA 的边界", "指令集体系结构规定寄存器、数据类型、指令格式、寻址方式、中断异常和机器级可见状态。微体系结构可以变化，但只要 ISA 不变，软件就能继续运行。"],
        ["指令格式", "一条指令通常由操作码和地址码组成。操作码说明做什么，地址码说明操作数在哪里或结果写到哪里。"],
        ["定长操作码", "定长操作码译码简单，但当指令种类差异很大时会浪费编码空间。"],
        ["扩展操作码", "扩展操作码把部分短地址指令的地址字段借给操作码，让不同地址数的指令共享编码空间，考题常要求计算最多能设计多少条指令。"],
        ["操作类型", "常见操作包括数据传送、算术逻辑、移位、转移、输入输出和特权控制。理解操作类型有助于后面看机器级代码。"]
      ],
      exam: ["指令长度不等于机器字长，二者只是常被设计成方便配合。", "地址码个数影响访存次数，也影响指令长度。", "扩展操作码题要从短码保留模式往长码扩展，不要把所有位平均分。"]
    },
    {
      id: "4-2",
      num: "4.2",
      title: "指令的寻址方式",
      subs: ["4.2.1 指令寻址和数据寻址", "4.2.2 常见的数据寻址方式"],
      lead: "寻址方式回答的是“操作数到底在哪里”。做题时先分清形式地址、有效地址和真实操作数。",
      blocks: [
        ["指令寻址", "顺序寻址通常由 PC 自动加一或加指令长度完成；跳跃寻址通过改变 PC 实现程序转移。"],
        ["立即寻址", "操作数就在指令中，速度快，不需要再访存取操作数，但数值范围受指令字段长度限制。"],
        ["直接与间接", "直接寻址的地址字段就是有效地址；间接寻址的地址字段指向一个存放有效地址的存储单元，灵活但多一次访存。"],
        ["寄存器相关", "寄存器寻址直接在寄存器中取数，速度快；寄存器间接寻址把寄存器内容当作有效地址。"],
        ["变址与基址", "变址适合数组访问，基址适合程序浮动和重定位。相对寻址用 PC 加偏移，适合转移指令。"]
      ],
      exam: ["立即寻址没有有效地址这个中间层，字段本身就是操作数。", "间接寻址多访问一次主存，这是性能题的常见扣分点。", "相对寻址的偏移通常相对于当前或下一条指令地址，题目口径要看清。"]
    },
    {
      id: "4-3",
      num: "4.3",
      title: "程序的机器级代码表示",
      subs: ["4.3.1 常用汇编指令介绍", "4.3.2 选择语句的机器级表示", "4.3.3 循环语句的机器级表示", "4.3.4 过程调用的机器级表示"],
      lead: "机器级代码不是另一门玄学，它只是把高级语言里的选择、循环和函数调用改写成比较、跳转、栈和寄存器约定。",
      blocks: [
        ["常用指令", "数据传送负责在寄存器和内存之间移动数据，算术逻辑负责计算，比较和条件跳转负责控制流。"],
        ["选择语句", "if-else 通常被翻译成比较加条件跳转。条件不满足时跳到 else 或跳过 then，最终在汇合点继续执行。"],
        ["循环语句", "循环由初始化、条件判断、循环体和更新组成。机器级实现通常是标签和跳转，while 与 for 的差别主要体现在判断位置。"],
        ["过程调用", "函数调用需要保存返回地址、传递参数、建立栈帧、保存必要寄存器并在返回时恢复现场。递归能工作，是因为每次调用都有自己的栈帧。"],
        ["栈的作用", "栈保存局部变量、返回地址、旧帧指针和溢出的参数。理解栈帧是看懂过程调用的关键。"]
      ],
      exam: ["条件码由比较或运算结果设置，条件跳转只读取这些状态。", "调用者保存和被调用者保存寄存器是约定，不是硬件天然规定。", "递归题先画栈帧，不要只盯源代码。"]
    },
    {
      id: "4-4",
      num: "4.4",
      title: "CISC 和 RISC 的基本概念",
      subs: ["4.4.1 复杂指令系统计算机(CISC)", "4.4.2 精简指令系统计算机(RISC)", "4.4.3 CISC和RISC的比较"],
      lead: "CISC 和 RISC 的分歧，本质是把复杂性放在硬件指令里，还是放在编译器和简单流水线友好的指令组合里。",
      blocks: [
        ["CISC", "CISC 指令多、格式多、寻址方式多，单条指令可能完成复杂功能。它对汇编程序员友好，但译码和流水线实现更复杂。"],
        ["RISC", "RISC 指令种类少、格式规整、长度固定，强调 Load/Store 结构，大多数运算只在寄存器之间进行，适合流水线和编译优化。"],
        ["比较", "CISC 代码密度可能更高，RISC 控制简单、执行节拍更规整。现代处理器常在外部兼容复杂 ISA，内部再转成更简单的微操作执行。"]
      ],
      exam: ["RISC 不是功能少，而是单条指令语义更简单。", "Load/Store 结构意味着访存指令和运算指令分开。", "CISC 与 RISC 的比较题要从指令格式、寻址方式、控制器、流水线和编译器一起看。"]
    },
    {
      id: "4-5",
      num: "4.5",
      title: "本章小结",
      subs: ["4.5 本章小结"],
      lead: "本章的主线是：指令格式定义机器能表达什么，寻址方式定义数据怎么找，机器级代码展示高级结构如何落到跳转和栈。",
      blocks: [
        ["复习路径", "先学指令格式，再学寻址方式，再把选择、循环、函数调用映射到机器级流程，最后用 CISC/RISC 理解设计取舍。"],
        ["和第五章的关系", "第四章规定 CPU 要执行什么，第五章解释 CPU 如何一步步执行。先有指令系统这个契约，才有数据通路和控制器的实现。"]
      ],
      exam: ["指令格式题重在位数分配。", "寻址方式题重在有效地址计算。", "机器级代码题重在控制流和栈帧。"]
    },
    {
      id: "4-6",
      num: "4.6",
      title: "常见问题和易混淆知识点",
      subs: ["4.6 常见问题和易混淆知识点"],
      lead: "指令系统的坑通常不是概念太难，而是层次混乱：ISA、汇编、机器码、微操作、数据通路分别在不同抽象层。",
      blocks: [
        ["ISA 与微体系结构", "ISA 是软件可见的规范，微体系结构是硬件内部实现。流水线级数、Cache 结构、微操作拆分通常不属于 ISA。"],
        ["形式地址与有效地址", "形式地址是指令地址字段里的值，有效地址是按寻址方式计算后真正用于访问操作数的地址。"],
        ["转移地址", "转移指令改变 PC，不等于直接改写普通寄存器。条件转移是否发生取决于条件码或比较结果。"]
      ],
      exam: ["不要把指令地址和数据地址混在一起。", "不要把汇编助记符和机器码字段一一机械等同。", "不要把微程序控制器里的微指令当成 ISA 指令。"]
    }
  ]
};

function renderTOC(){const toc=document.getElementById("toc");toc.innerHTML=`<div class="toc-group"><div class="toc-group-title">第 ${CHAPTER.num} 章 · ${CHAPTER.title}</div>${CHAPTER.sections.map(s=>`<div class="toc-item" data-id="${s.id}"><span class="toc-num">${s.num}</span><span>${s.title}</span></div>`).join("")}</div>`;toc.querySelectorAll(".toc-item").forEach(el=>el.addEventListener("click",()=>goTo(el.dataset.id)));}
function currentId(){const hash=location.hash.replace("#","");return CHAPTER.sections.some(s=>s.id===hash)?hash:(localStorage.getItem(`chapter-${CHAPTER.num}-section`)||CHAPTER.sections[0].id);}
function goTo(id){location.hash=id;localStorage.setItem(`chapter-${CHAPTER.num}-section`,id);render();window.scrollTo({top:0,behavior:"instant"});}
function renderSection(sec){return `<h1 class="sec-title">${sec.num} ${sec.title}</h1><div class="sec-meta"><b>第 ${CHAPTER.num} 章</b> / ${CHAPTER.title}</div><p class="lead">${sec.lead}</p><div class="callout info"><b>本节目录</b><ul>${sec.subs.map(sub=>`<li>${sub}</li>`).join("")}</ul></div>${sec.blocks.map(([title,body])=>`<h2 class="h2">${title}</h2><p>${body}</p>`).join("")}<div class="card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item=>`<li>${item}</li>`).join("")}</ul></div>`;}
function render(){const id=currentId();const sec=CHAPTER.sections.find(s=>s.id===id);document.querySelectorAll(".toc-item").forEach(el=>el.classList.toggle("active",el.dataset.id===id));document.getElementById("crumb").innerHTML=`第 ${CHAPTER.num} 章 · ${CHAPTER.title} <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;document.getElementById("content").innerHTML=renderSection(sec);const idx=CHAPTER.sections.findIndex(s=>s.id===id);const prev=CHAPTER.sections[idx-1],next=CHAPTER.sections[idx+1];document.getElementById("prevTitle").textContent=prev?`${prev.num} ${prev.title}`:"已到开头";document.getElementById("nextTitle").textContent=next?`${next.num} ${next.title}`:"已到结尾";["prevBtn","prevBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!prev;document.getElementById(btn).onclick=()=>prev&&goTo(prev.id);});["nextBtn","nextBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!next;document.getElementById(btn).onclick=()=>next&&goTo(next.id);});}
document.addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;const idx=CHAPTER.sections.findIndex(s=>s.id===currentId());if(e.key==="ArrowLeft"&&idx>0)goTo(CHAPTER.sections[idx-1].id);if(e.key==="ArrowRight"&&idx<CHAPTER.sections.length-1)goTo(CHAPTER.sections[idx+1].id);});
window.addEventListener("hashchange",render);renderTOC();render();
