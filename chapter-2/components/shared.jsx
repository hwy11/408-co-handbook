// ============ 共享 UI 组件 ============
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// 小标签
function Tag({ children, kind }) {
  return <span className={`tag ${kind || ""}`}>{children}</span>;
}

// 提示框
function Callout({ kind = "", label, children }) {
  return (
    <div className={`callout ${kind}`}>
      {label && <div className="callout-label">{label}</div>}
      {children}
    </div>
  );
}

// 口诀框
function Mnemonic({ label = "口诀", children }) {
  return (
    <div className="mnemonic">
      <div className="mnemonic-label">{label}</div>
      <div className="mnemonic-text">{children}</div>
    </div>
  );
}

// 卡片
function Card({ title, children, style }) {
  return (
    <div className="card" style={style}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}

// 图解容器
function Diagram({ caption, children, style }) {
  return (
    <div className="diagram" style={style}>
      {children}
      {caption && <div className="diagram-caption">{caption}</div>}
    </div>
  );
}

// 比特显示
function BitRow({ bits, labels, highlights = [] }) {
  // bits: "10110101" 字符串 或 数组
  const arr = typeof bits === "string" ? bits.split("") : bits;
  return (
    <div>
      <div className="bitrow">
        {arr.map((b, i) => {
          const cls = ["bit"];
          if (b === "1" || b === 1) cls.push("on");
          if (labels && labels[i]) cls.push(labels[i]);
          if (highlights.includes(i)) cls.push("highlight");
          return <div key={i} className={cls.join(" ")}>{b}</div>;
        })}
      </div>
    </div>
  );
}

// 步骤器
function Stepper({ step, total, onStep, labels }) {
  return (
    <div className="stepper">
      <button className="btn" onClick={() => onStep(Math.max(0, step - 1))} disabled={step === 0}>← 上一步</button>
      <div className="step-dots">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
        ))}
      </div>
      <div className="step-label">{step + 1} / {total}</div>
      <button className="btn primary" onClick={() => onStep(Math.min(total - 1, step + 1))} disabled={step === total - 1}>下一步 →</button>
      {labels && <div style={{ fontSize: 13, color: "var(--text-2)", marginLeft: 12 }}>{labels[step]}</div>}
    </div>
  );
}

// 真题卡
function Quiz({ meta, question, options, answer, explanation }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="quiz">
      <div className="quiz-meta">{meta}</div>
      <div className="quiz-q">{question}</div>
      <ul className="quiz-opts">
        {options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          let cls = "";
          if (picked !== null) {
            if (i === answer) cls = "correct";
            else if (i === picked) cls = "wrong";
          }
          return (
            <li key={i} className={cls} onClick={() => picked === null && setPicked(i)}>
              <span className="opt-letter">{letter}</span>
              <span>{opt}</span>
            </li>
          );
        })}
      </ul>
      {picked !== null && (
        <div className="quiz-expl fade-in">
          <strong>解析：</strong>{explanation}
        </div>
      )}
      {picked === null && (
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>点击选项查看答案与解析</div>
      )}
    </div>
  );
}

// 两列对比
function Compare({ left, right, leftTitle, rightTitle }) {
  return (
    <div className="compare">
      <div>
        <h4>{leftTitle}</h4>
        {left}
      </div>
      <div>
        <h4>{rightTitle}</h4>
        {right}
      </div>
    </div>
  );
}

Object.assign(window, { Tag, Callout, Mnemonic, Card, Diagram, BitRow, Stepper, Quiz, Compare });
