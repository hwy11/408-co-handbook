// ============ 主应用 ============
const { useState, useEffect } = React;

const NAV = [
  {
    title: "第二章 数据的表示和运算",
    items: [
      { id: "s-2-1", label: "2.1 数制与编码", section: "2.1" },
      { id: "s-2-1-1", label: "2.1.1 进位计数制及其相互转换", section: "2.1", sub: true },
      { id: "s-2-1-2", label: "2.1.2 定点数的编码表示", section: "2.1", sub: true },
      { id: "s-2-1-3", label: "2.1.3 整数的表示", section: "2.1", sub: true },
      { id: "s-2-1-4", label: "2.1.4 C 语言中的整数类型及类型转换", section: "2.1", sub: true },

      { id: "s-2-2", label: "2.2 运算方法和运算电路", section: "2.2" },
      { id: "s-2-2-1", label: "2.2.1 基本运算部件", section: "2.2", sub: true },
      { id: "s-2-2-2", label: "2.2.2 定点数的移位运算", section: "2.2", sub: true },
      { id: "s-2-2-3", label: "2.2.3 定点数的加减运算", section: "2.2", sub: true },
      { id: "s-2-2-4", label: "2.2.4 定点数的乘除运算", section: "2.2", sub: true },

      { id: "s-2-3", label: "2.3 浮点数的表示与运算", section: "2.3" },
      { id: "s-2-3-1", label: "2.3.1 浮点数的表示", section: "2.3", sub: true },
      { id: "s-2-3-2", label: "2.3.2 浮点数的加减运算", section: "2.3", sub: true },
      { id: "s-2-3-3", label: "2.3.3 C 语言中的浮点数类型", section: "2.3", sub: true },
      { id: "s-2-3-4", label: "2.3.4 数据的大小端和对齐存储", section: "2.3", sub: true },
    ],
  },
];

function App() {
  // 持久化当前节
  const [active, setActive] = useState(() => localStorage.getItem("cs408-active") || "2.1");
  const [scrollTo, setScrollTo] = useState(null);

  useEffect(() => {
    localStorage.setItem("cs408-active", active);
  }, [active]);

  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 32, behavior: "smooth" });
      }
      setScrollTo(null);
    }
  }, [scrollTo, active]);

  const handleNav = (item) => {
    if (item.section !== active) {
      setActive(item.section);
      // 等待下一帧再滚动
      setTimeout(() => {
        const el = document.getElementById(item.id);
        if (el) window.scrollTo({ top: el.offsetTop - 32, behavior: "smooth" });
        else window.scrollTo({ top: 0 });
      }, 50);
    } else {
      const el = document.getElementById(item.id);
      if (el) window.scrollTo({ top: el.offsetTop - 32, behavior: "smooth" });
      else window.scrollTo({ top: 0 });
    }
  };

  // 切换节时滚到顶部
  const switchSection = (sec) => {
    setActive(sec);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  return (
    <div className="app" data-screen-label={`Section ${active}`}>
      {/* 侧栏 */}
      <aside className="sidebar">
        <div className="brand">408 · 组成原理</div>
        <div className="brand-title">可视化手册<span className="dot">.</span></div>

        {NAV.map((group, gi) => (
          <div className="nav-group" key={gi}>
            <div className="nav-group-title">{group.title}</div>
            {group.items.map(item => {
              const isTop = !item.sub;
              const isActive = isTop && item.section === active;
              return (
                <a
                  key={item.id}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  style={item.sub ? { paddingLeft: 28, fontSize: 13, color: "var(--text-3)" } : {}}
                  onClick={() => handleNav(item)}
                >
                  {!item.sub && <span className="num">{item.section}</span>}
                  {item.sub ? item.label.replace(/^\d+\.\d+\.\d+\s*/, "") : item.label.replace(/^\d+\.\d+\s*/, "")}
                </a>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop: 40, padding: "16px 12px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 }}>
          点击目录章节快速跳转<br/>
          小节内交互图解可实时调节参数
        </div>
      </aside>

      {/* 主内容 */}
      <main className="content">
        {active === "2.1" && <Section2_1 />}
        {active === "2.2" && <Section2_2 />}
        {active === "2.3" && <Section2_3 />}

        {/* 底部导航 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
          {active !== "2.1" ? (
            <button className="btn" onClick={() => switchSection(active === "2.3" ? "2.2" : "2.1")}>
              ← 上一节
            </button>
          ) : <div />}
          {active !== "2.3" && (
            <button className="btn primary" onClick={() => switchSection(active === "2.1" ? "2.2" : "2.3")}>
              下一节 →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
