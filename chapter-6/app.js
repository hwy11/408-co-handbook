const CHAPTER = {
  num: "6",
  title: "总线",
  sections: [
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

function renderTOC(){const toc=document.getElementById("toc");toc.innerHTML=`<div class="toc-group"><div class="toc-group-title">第 ${CHAPTER.num} 章 · ${CHAPTER.title}</div>${CHAPTER.sections.map(s=>`<div class="toc-item" data-id="${s.id}"><span class="toc-num">${s.num}</span><span>${s.title}</span></div>`).join("")}</div>`;toc.querySelectorAll(".toc-item").forEach(el=>el.addEventListener("click",()=>goTo(el.dataset.id)));}
function currentId(){const hash=location.hash.replace("#","");return CHAPTER.sections.some(s=>s.id===hash)?hash:(localStorage.getItem(`chapter-${CHAPTER.num}-section`)||CHAPTER.sections[0].id);}
function goTo(id){location.hash=id;localStorage.setItem(`chapter-${CHAPTER.num}-section`,id);render();window.scrollTo({top:0,behavior:"instant"});}
function renderSection(sec){return `<h1 class="sec-title">${sec.num} ${sec.title}</h1><div class="sec-meta"><b>第 ${CHAPTER.num} 章</b> / ${CHAPTER.title}</div><p class="lead">${sec.lead}</p><div class="callout info"><b>本节目录</b><ul>${sec.subs.map(sub=>`<li>${sub}</li>`).join("")}</ul></div>${sec.blocks.map(([title,body])=>`<h2 class="h2">${title}</h2><p>${body}</p>`).join("")}<div class="card"><h3 class="h3" style="margin-top:0">408 抓分点</h3><ul>${sec.exam.map(item=>`<li>${item}</li>`).join("")}</ul></div>`;}
function render(){const id=currentId();const sec=CHAPTER.sections.find(s=>s.id===id);document.querySelectorAll(".toc-item").forEach(el=>el.classList.toggle("active",el.dataset.id===id));document.getElementById("crumb").innerHTML=`第 ${CHAPTER.num} 章 · ${CHAPTER.title} <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;document.getElementById("content").innerHTML=renderSection(sec);const idx=CHAPTER.sections.findIndex(s=>s.id===id);const prev=CHAPTER.sections[idx-1],next=CHAPTER.sections[idx+1];document.getElementById("prevTitle").textContent=prev?`${prev.num} ${prev.title}`:"已到开头";document.getElementById("nextTitle").textContent=next?`${next.num} ${next.title}`:"已到结尾";["prevBtn","prevBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!prev;document.getElementById(btn).onclick=()=>prev&&goTo(prev.id);});["nextBtn","nextBtn2"].forEach(btn=>{document.getElementById(btn).disabled=!next;document.getElementById(btn).onclick=()=>next&&goTo(next.id);});}
document.addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;const idx=CHAPTER.sections.findIndex(s=>s.id===currentId());if(e.key==="ArrowLeft"&&idx>0)goTo(CHAPTER.sections[idx-1].id);if(e.key==="ArrowRight"&&idx<CHAPTER.sections.length-1)goTo(CHAPTER.sections[idx+1].id);});
window.addEventListener("hashchange",render);renderTOC();render();
