// ============ 站点主逻辑 ============
const SECTIONS = [
  { id:"5-talk", num:"导读", title:"本章串讲", subs:["第五章中央处理器串讲"] },
  { id:"5-1", num:"5.1", title:"CPU 的功能和基本结构", subs:["5.1.1 CPU的功能","5.1.2 CPU的基本结构","5.1.3 CPU的寄存器"] },
  { id:"5-2", num:"5.2", title:"指令执行过程", subs:["5.2.1 指令周期","5.2.2 指令周期的数据流","5.2.3 指令执行方案"] },
  { id:"5-3", num:"5.3", title:"数据通路", subs:["5.3.1 数据通路的功能","5.3.2 数据通路的组成","5.3.3 数据通路的基本结构","5.3.4 数据通路的操作举例"] },
  { id:"5-4", num:"5.4", title:"控制器", subs:["5.4.1 控制器的结构和功能","5.4.2 硬布线控制器","5.4.3 微程序控制器"] },
  { id:"5-5", num:"5.5", title:"异常和中断机制", subs:["5.5.1 基本概念","5.5.2 分类","5.5.3 响应过程"] },
  { id:"5-6", num:"5.6", title:"指令流水线", subs:["5.6.1 基本概念","5.6.2 基本实现","5.6.3 冒险与处理","5.6.4 性能指标","5.6.5 高级流水线"] },
  { id:"5-7", num:"5.7", title:"多处理器基本概念", subs:["5.7.1 SISD/SIMD/MIMD","5.7.2 硬件多线程","5.7.3 多核处理器","5.7.4 共享内存多处理器"] },
];

// ------ 侧边栏渲染 ------
function renderTOC(){
  const toc = document.getElementById("toc");
  toc.innerHTML = `
    <div class="toc-group">
      <div class="toc-group-title">第 5 章 · 中央处理器</div>
      ${SECTIONS.map(s => `
        <div class="toc-item" data-id="${s.id}">
          <span class="toc-num">${s.num}</span>
          <span>${s.title}</span>
        </div>
      `).join("")}
    </div>
  `;
  toc.querySelectorAll(".toc-item").forEach(el => {
    el.addEventListener("click", () => goTo(el.dataset.id));
  });
}

// ------ 路由 ------
function currentId(){
  const h = location.hash.replace("#","");
  return SECTIONS.find(s => s.id === h) ? h : (localStorage.getItem("cpu-section") || "5-1");
}
function goTo(id){
  location.hash = id;
  localStorage.setItem("cpu-section", id);
  render();
  window.scrollTo({ top:0, behavior:"instant" });
}

function render(){
  const id = currentId();
  const sec = SECTIONS.find(s => s.id === id);
  document.querySelectorAll(".toc-item").forEach(el => {
    el.classList.toggle("active", el.dataset.id === id);
  });
  document.getElementById("crumb").innerHTML = `第 5 章 · 中央处理器 <span style="color:var(--ink-4);margin:0 8px">/</span> <b>${sec.num} ${sec.title}</b>`;

  const content = document.getElementById("content");
  const renderer = window["SEC_" + id.replace("-","_")];
  if(id === "5-talk"){
    content.innerHTML = window.renderChapterTalk ? window.renderChapterTalk("5") : `<div class="card">本章串讲内容加载中...</div>`;
  } else if(renderer){
    content.innerHTML = renderer();
    // 运行节内初始化
    const init = window["INIT_" + id.replace("-","_")];
    if(init) try{ init(); }catch(e){ console.error(e); }
  } else {
    content.innerHTML = `<div class="card">本节内容加载中…</div>`;
  }

  // 上/下
  const idx = SECTIONS.findIndex(s => s.id === id);
  const prev = SECTIONS[idx-1], next = SECTIONS[idx+1];
  document.getElementById("prevTitle").textContent = prev ? `${prev.num} ${prev.title}` : "已到开头";
  document.getElementById("nextTitle").textContent = next ? `${next.num} ${next.title}` : "已到结尾";
  document.getElementById("prevBtn").disabled = !prev;
  document.getElementById("nextBtn").disabled = !next;
  document.getElementById("prevBtn2").disabled = !prev;
  document.getElementById("nextBtn2").disabled = !next;

  const prevGo = () => prev && goTo(prev.id);
  const nextGo = () => next && goTo(next.id);
  ["prevBtn","prevBtn2"].forEach(i => document.getElementById(i).onclick = prevGo);
  ["nextBtn","nextBtn2"].forEach(i => document.getElementById(i).onclick = nextGo);
}

// ------ 键盘 ------
document.addEventListener("keydown", e => {
  if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  const id = currentId();
  const idx = SECTIONS.findIndex(s => s.id === id);
  if(e.key === "ArrowLeft" && idx > 0) goTo(SECTIONS[idx-1].id);
  if(e.key === "ArrowRight" && idx < SECTIONS.length-1) goTo(SECTIONS[idx+1].id);
});

window.addEventListener("hashchange", render);

// ------ 启动 ------
renderTOC();
render();

// ============ 通用交互工具 ============
// 步骤条：在容器内给 .step-btn 绑定切换，触发 window[`STEP_${ns}`](i)
window.bindSteps = function(rootSel, ns, total, onStep){
  const root = document.querySelector(rootSel);
  if(!root) return;
  const btns = root.querySelectorAll(`[data-ns="${ns}"].step-btn`);
  const play = root.querySelector(`[data-ns="${ns}"].play-btn`);
  const reset = root.querySelector(`[data-ns="${ns}"].reset-btn`);
  let cur = 0, timer = null;

  function setStep(i){
    cur = Math.max(0, Math.min(total-1, i));
    btns.forEach((b,idx) => b.classList.toggle("active", idx===cur));
    onStep(cur);
  }
  btns.forEach((b,idx) => b.addEventListener("click", () => { stop(); setStep(idx); }));

  function stop(){ if(timer){ clearInterval(timer); timer=null; if(play) play.textContent="▶ 播放"; } }
  function start(){
    if(cur >= total-1) setStep(0);
    if(play) play.textContent="⏸ 暂停";
    timer = setInterval(() => {
      if(cur >= total-1){ stop(); return; }
      setStep(cur+1);
    }, 1400);
  }
  if(play) play.addEventListener("click", () => { timer ? stop() : start(); });
  if(reset) reset.addEventListener("click", () => { stop(); setStep(0); });

  setStep(0);
  return { setStep, stop };
};

// Toggle 切换（互斥按钮组）
window.bindToggles = function(rootSel, ns, onChange){
  const root = document.querySelector(rootSel);
  if(!root) return;
  const btns = root.querySelectorAll(`[data-tgl="${ns}"]`);
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.classList.toggle("active", x===b));
    onChange(b.dataset.val);
  }));
};
