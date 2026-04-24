// ============ 交互式图解组件 ============

/* ---------- 1. 进制转换器 ---------- */
function BaseConverter() {
  const [value, setValue] = useState("156");
  const [fromBase, setFromBase] = useState(10);
  const n = parseInt(value, fromBase);
  const ok = !isNaN(n) && n >= 0;

  // 计算转换过程：除基取余
  const divSteps = useMemo(() => {
    if (!ok) return [];
    const steps = [];
    let x = n;
    const target = 2;
    while (x > 0) {
      steps.push({ q: Math.floor(x / target), r: x % target, dividend: x });
      x = Math.floor(x / target);
    }
    return steps;
  }, [n, ok]);

  const bin = ok ? n.toString(2) : "--";
  const oct = ok ? n.toString(8) : "--";
  const hex = ok ? n.toString(16).toUpperCase() : "--";
  const dec = ok ? n.toString(10) : "--";

  return (
    <Diagram caption="输入任意进制的数，即时查看四种进制表示及「除基取余」过程">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>输入：</label>
        <input className="input" value={value} onChange={e => setValue(e.target.value)} style={{ width: 180 }} />
        <select className="input" value={fromBase} onChange={e => setFromBase(+e.target.value)}>
          <option value={2}>二进制 (B)</option>
          <option value={8}>八进制 (O)</option>
          <option value={10}>十进制 (D)</option>
          <option value={16}>十六进制 (H)</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["十进制", dec, "D"],
          ["二进制", bin, "B"],
          ["八进制", oct, "O"],
          ["十六进制", hex, "H"],
        ].map(([name, v, suf]) => (
          <div key={name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{name}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 18, color: "var(--accent)", wordBreak: "break-all" }}>
              {v}<span style={{ color: "var(--text-3)", fontSize: 13 }}>{suf}</span>
            </div>
          </div>
        ))}
      </div>

      {ok && n > 0 && n < 1024 && (
        <div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 10, letterSpacing: "0.05em" }}>▸ 十进制 → 二进制：除 2 取余（从下往上读）</div>
          <div style={{ background: "var(--bg-3)", borderRadius: 8, padding: 16, fontFamily: "var(--mono)", fontSize: 14 }}>
            {divSteps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, color: "var(--text-2)" }}>
                <span style={{ color: "var(--text-3)", width: 30 }}>{i + 1}.</span>
                <span>{s.dividend}</span>
                <span style={{ color: "var(--text-3)" }}>÷ 2 =</span>
                <span>{s.q}</span>
                <span style={{ color: "var(--text-3)" }}>余</span>
                <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: 16 }}>{s.r}</span>
                {i === divSteps.length - 1 && <span style={{ color: "var(--green)", marginLeft: 8 }}>↑ 最高位</span>}
                {i === 0 && <span style={{ color: "var(--blue)", marginLeft: 8 }}>↑ 最低位</span>}
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", color: "var(--accent)" }}>
              ⇒ 从下往上读: <span style={{ fontSize: 16, fontWeight: 600 }}>{bin}</span>
            </div>
          </div>
        </div>
      )}
    </Diagram>
  );
}

/* ---------- 2. 有符号数编码滑块（原/反/补/移） ---------- */
function SignedEncodingExplorer() {
  const [val, setVal] = useState(-13);
  const BITS = 8;
  const max = 127, min = -128;

  const toBin = (n, bits) => {
    if (n < 0) n = (1 << bits) + n; // 用模补
    return n.toString(2).padStart(bits, "0").slice(-bits);
  };

  // 原码：符号位 + |val| 的二进制
  const yuanma = useMemo(() => {
    if (val === 0) return "00000000";
    const sign = val < 0 ? "1" : "0";
    const mag = Math.abs(val).toString(2).padStart(BITS - 1, "0");
    return sign + mag;
  }, [val]);

  // 反码
  const fanma = useMemo(() => {
    if (val >= 0) return yuanma;
    // 负数：符号位不变，其余取反
    return "1" + yuanma.slice(1).split("").map(b => b === "0" ? "1" : "0").join("");
  }, [val, yuanma]);

  // 补码
  const buma = useMemo(() => {
    if (val >= 0) return yuanma;
    // 负数反码+1
    let arr = fanma.split("");
    let carry = 1;
    for (let i = arr.length - 1; i >= 0 && carry; i--) {
      const s = +arr[i] + carry;
      arr[i] = (s % 2).toString();
      carry = Math.floor(s / 2);
    }
    return arr.join("");
  }, [val, fanma, yuanma]);

  // 移码 = 补码符号位取反
  const yima = useMemo(() => {
    const b = buma;
    return (b[0] === "0" ? "1" : "0") + b.slice(1);
  }, [buma]);

  const rows = [
    { name: "原码", sign: "Sign + Magnitude", bits: yuanma, note: "符号位 + |x| 的二进制，±0 有两种表示", color: "var(--purple)" },
    { name: "反码", sign: "1's complement", bits: fanma, note: "负数：符号位不变，数值位按位取反", color: "var(--cyan)" },
    { name: "补码", sign: "2's complement", bits: buma, note: "负数：反码末位 +1，唯一 0 表示", color: "var(--accent)" },
    { name: "移码", sign: "Biased / Excess-128", bits: yima, note: "补码的符号位取反，只用于浮点阶码", color: "var(--green)" },
  ];

  return (
    <Diagram caption="拖动滑块改变十进制值，观察四种编码如何同步变化">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>十进制值</span>
          <div style={{ fontFamily: "var(--mono)", fontSize: 28, fontWeight: 700, color: "var(--accent)", minWidth: 80 }}>{val}</div>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>(8位机器数范围: −128 ~ +127)</span>
        </div>
        <input type="range" min={min} max={max} value={val} onChange={e => setVal(+e.target.value)} 
          style={{ width: "100%", accentColor: "var(--accent)" }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map(r => (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, alignItems: "center", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: r.color }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.sign}</div>
            </div>
            <div>
              <div className="bitrow">
                {r.bits.split("").map((b, i) => (
                  <div key={i} className={`bit ${b === "1" ? "on" : ""} ${i === 0 ? "sign" : ""}`}>{b}</div>
                ))}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>{r.note}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 14, background: "var(--bg-3)", borderRadius: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
        <strong style={{ color: "var(--text)" }}>观察要点：</strong>
        当 val = 0 时，原码/反码会有 +0 与 −0 两种表示；补码始终唯一。
        当 val = −128 时，只有补码能表示（<code>10000000</code>），这就是为什么 n 位补码范围比原码多一个负值。
      </div>
    </Diagram>
  );
}

/* ---------- 3. 补码加减法分步演示 ---------- */
function AddSubStepper() {
  const [a, setA] = useState(25);
  const [b, setB] = useState(-13);
  const [op, setOp] = useState("add"); // add / sub
  const [step, setStep] = useState(0);

  const BITS = 8;
  const toBu = (n) => {
    if (n >= 0) return n.toString(2).padStart(BITS, "0");
    return ((1 << BITS) + n).toString(2).padStart(BITS, "0").slice(-BITS);
  };
  const bComp = op === "sub" ? -b : b;
  const aBu = toBu(a);
  const bBu = toBu(bComp);
  // 逐位加
  let carry = 0;
  const res = [];
  const carries = [];
  for (let i = BITS - 1; i >= 0; i--) {
    const s = +aBu[i] + +bBu[i] + carry;
    res.unshift(s % 2);
    carries.unshift(carry);
    carry = Math.floor(s / 2);
  }
  const finalCarry = carry;
  const resStr = res.join("");
  const resVal = resStr[0] === "1" ? parseInt(resStr, 2) - (1 << BITS) : parseInt(resStr, 2);
  // 溢出判断：次高位进位 与 最高位进位 不同
  const cn = finalCarry;
  const cn_1 = carries[0];
  const overflow = cn !== cn_1;

  const steps = [
    { title: "Step 1 · 写出两个操作数的补码", desc: `[${a}]补 = ${aBu}, [${op === "sub" ? -b : b}]补 = ${bBu}` },
    { title: "Step 2 · 减法转加法", desc: op === "sub" ? `A − B = A + (−B)，把 ${b} 变为 ${-b} 的补码: ${bBu}` : "加法直接进行，不需转换" },
    { title: "Step 3 · 按位相加（含符号位）", desc: "符号位一同参与运算，最终进位丢弃" },
    { title: "Step 4 · 溢出判断", desc: `最高位进位 Cn = ${cn}，次高位进位 Cn-1 = ${cn_1}；Cn ⊕ Cn-1 = ${overflow ? "1 → 溢出" : "0 → 结果正确"}` },
    { title: "Step 5 · 读出结果", desc: `结果补码 = ${resStr}，对应十进制 = ${overflow ? "溢出，结果无意义" : resVal}` },
  ];

  return (
    <Diagram caption="补码加减法的 5 个关键步骤 —— 核心口诀：减法变加法，符号位参与运算，进位丢弃">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <input type="number" className="input" value={a} onChange={e => { setA(+e.target.value); setStep(0); }} style={{ width: 90 }} />
        <select className="input" value={op} onChange={e => { setOp(e.target.value); setStep(0); }}>
          <option value="add">+</option>
          <option value="sub">−</option>
        </select>
        <input type="number" className="input" value={b} onChange={e => { setB(+e.target.value); setStep(0); }} style={{ width: 90 }} />
        <span style={{ color: "var(--text-3)" }}>=</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 18, color: overflow ? "var(--red)" : "var(--accent)" }}>
          {overflow ? "OVERFLOW" : resVal}
        </span>
      </div>

      <Stepper step={step} total={steps.length} onStep={setStep} />

      <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8, minHeight: 280 }}>
        <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 8 }}>{steps[step].title}</div>
        <div style={{ color: "var(--text-2)", marginBottom: 16, fontSize: 14 }}>{steps[step].desc}</div>

        {/* 竖式展示 */}
        <div style={{ fontFamily: "var(--mono)", fontSize: 16, lineHeight: 1.8 }}>
          {/* 进位行 */}
          {step >= 2 && (
            <div style={{ display: "flex", gap: 2, marginBottom: 4, color: "var(--red)", fontSize: 12, alignItems: "flex-end" }}>
              <span style={{ width: 40, textAlign: "right", marginRight: 8 }}>进位</span>
              {[...carries, finalCarry].map((c, i) => (
                <div key={i} style={{ width: 26, textAlign: "center", color: c ? "var(--red)" : "var(--text-3)" }}>{c}</div>
              ))}
            </div>
          )}

          {/* A */}
          <div style={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 4 }}>
            <span style={{ width: 40, textAlign: "right", marginRight: 8, color: "var(--text-3)", fontSize: 12 }}>[A]补</span>
            <span style={{ width: 26 }}></span>
            {aBu.split("").map((b, i) => (
              <div key={i} className={`bit ${b === "1" ? "on" : ""} ${i === 0 ? "sign" : ""}`}>{b}</div>
            ))}
          </div>

          {/* B */}
          <div style={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 4 }}>
            <span style={{ width: 40, textAlign: "right", marginRight: 8, color: "var(--text-3)", fontSize: 12 }}>[{op === "sub" ? "−B" : "B"}]补</span>
            <span style={{ width: 26, color: "var(--accent)" }}>+</span>
            {bBu.split("").map((b, i) => (
              <div key={i} className={`bit ${b === "1" ? "on" : ""} ${i === 0 ? "sign" : ""}`}>{b}</div>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--border-strong)", margin: "6px 0 6px 48px" }} />

          {/* 结果 */}
          {step >= 3 && (
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              <span style={{ width: 40, textAlign: "right", marginRight: 8, color: "var(--text-3)", fontSize: 12 }}>结果</span>
              <div style={{ width: 26, textAlign: "center", color: finalCarry ? "var(--red)" : "var(--text-3)", fontSize: 12 }}>
                {finalCarry ? "丢弃" : ""}
              </div>
              {res.map((b, i) => (
                <div key={i} className={`bit ${b === 1 ? "on" : ""} ${i === 0 ? "sign" : ""} ${step === 4 ? "highlight" : ""}`}>{b}</div>
              ))}
            </div>
          )}

          {step >= 3 && finalCarry === 1 && (
            <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-3)" }}>
              ↑ 最高位产生的进位（{finalCarry}）被丢弃 —— 这是无符号与有符号的区别之一
            </div>
          )}
        </div>
      </div>
    </Diagram>
  );
}

/* ---------- 4. IEEE 754 位视图 ---------- */
function IEEE754Viewer() {
  const [val, setVal] = useState(6.5);
  const [precision, setPrecision] = useState("single");

  const bits = useMemo(() => {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    if (precision === "single") {
      view.setFloat32(0, val);
      const u = view.getUint32(0);
      return u.toString(2).padStart(32, "0");
    } else {
      view.setFloat64(0, val);
      const high = view.getUint32(0).toString(2).padStart(32, "0");
      const low = view.getUint32(4).toString(2).padStart(32, "0");
      return high + low;
    }
  }, [val, precision]);

  const signLen = 1;
  const expLen = precision === "single" ? 8 : 11;
  const fracLen = precision === "single" ? 23 : 52;
  const bias = precision === "single" ? 127 : 1023;

  const sign = bits[0];
  const exp = bits.slice(1, 1 + expLen);
  const frac = bits.slice(1 + expLen);
  const expVal = parseInt(exp, 2);
  const E = expVal - bias;

  // 解析特殊情况
  let category = "规格化";
  if (expVal === 0 && parseInt(frac, 2) === 0) category = sign === "1" ? "负零" : "正零";
  else if (expVal === 0) category = "非规格化（denormal）";
  else if (expVal === (precision === "single" ? 255 : 2047)) {
    category = parseInt(frac, 2) === 0 ? (sign === "1" ? "−∞" : "+∞") : "NaN";
  }

  return (
    <Diagram caption="IEEE 754 浮点数的三段结构：符号位 S · 阶码 E · 尾数 M">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>数值：</label>
        <input type="number" className="input" value={val} step="any" onChange={e => setVal(parseFloat(e.target.value) || 0)} style={{ width: 160 }} />
        <select className="input" value={precision} onChange={e => setPrecision(e.target.value)}>
          <option value="single">单精度 (32位 float)</option>
          <option value="double">双精度 (64位 double)</option>
        </select>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6 }}>
          {[0.1, 1.0, -13.5, 6.5, 3.14159, 1e-40, Infinity, NaN].map(v => (
            <button key={String(v)} className="btn" onClick={() => setVal(v)} style={{ fontSize: 12 }}>{String(v)}</button>
          ))}
        </div>
      </div>

      {/* 位视图 */}
      <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8, overflowX: "auto" }}>
        <div className="bitrow" style={{ marginBottom: 12, flexWrap: precision === "double" ? "wrap" : "nowrap" }}>
          {bits.split("").map((b, i) => {
            let cls = "bit";
            if (b === "1") cls += " on";
            if (i < signLen) cls += " sign";
            else if (i < signLen + expLen) cls += " exp";
            else cls += " frac";
            return <div key={i} className={cls} style={{ width: precision === "double" ? 20 : 22, fontSize: 11 }}>{b}</div>;
          })}
        </div>
        <div className="bit-legend">
          <span className="sign">符号 S (1位)</span>
          <span className="exp">阶码 E ({expLen}位, 偏置={bias})</span>
          <span className="frac">尾数 M ({fracLen}位)</span>
        </div>
      </div>

      {/* 解码展示 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
        {[
          ["符号 S", sign, sign === "0" ? "正" : "负", "var(--red)"],
          ["阶码 E（偏置）", expVal, `真值 E = ${expVal} − ${bias} = ${E}`, "var(--blue)"],
          ["尾数 M", "0x" + parseInt(frac || "0", 2).toString(16), `隐含 1. 前缀`, "var(--green)"],
          ["类别", category, `值 ≈ ${val}`, "var(--accent)"],
        ].map(([n, v, sub, c]) => (
          <div key={n} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{n}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 16, color: c, wordBreak: "break-all" }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 14, background: "var(--bg-3)", borderRadius: 8, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
        <strong style={{ color: "var(--text)" }}>值的计算公式：</strong>
        <div style={{ fontFamily: "var(--mono)", marginTop: 6, color: "var(--accent)" }}>
          V = (−1)<sup>S</sup> × 1.M × 2<sup>E−bias</sup>（规格化）
        </div>
      </div>
    </Diagram>
  );
}

/* ---------- 5. 移位运算演示 ---------- */
function ShiftDemo() {
  const [val, setVal] = useState(-20);
  const [shift, setShift] = useState(2);
  const BITS = 8;
  const toBu = n => n >= 0 ? n.toString(2).padStart(BITS, "0") : ((1 << BITS) + n).toString(2).padStart(BITS, "0").slice(-BITS);
  const orig = toBu(val);

  // 四种移位：逻辑左、逻辑右、算术左、算术右（补码）
  const logLeft = orig.slice(shift) + "0".repeat(shift);
  const logRight = "0".repeat(shift) + orig.slice(0, BITS - shift);
  const ariLeft = orig[0] + orig.slice(1 + shift) + "0".repeat(shift); // 符号位不动
  const ariRight = orig[0].repeat(shift) + orig.slice(0, BITS - shift); // 符号位扩展

  const bu2dec = s => s[0] === "1" ? parseInt(s, 2) - (1 << BITS) : parseInt(s, 2);

  const rows = [
    { name: "逻辑左移", bits: logLeft, val: parseInt(logLeft, 2), desc: "左移补 0，最高位丢弃。等价于 ×2ⁿ（无符号）" },
    { name: "逻辑右移", bits: logRight, val: parseInt(logRight, 2), desc: "右移补 0，最低位丢弃。用于无符号数 ÷2ⁿ" },
    { name: "算术左移", bits: ariLeft, val: bu2dec(ariLeft), desc: "符号位保持，空位补 0。等价于有符号 ×2ⁿ（可能溢出）" },
    { name: "算术右移", bits: ariRight, val: bu2dec(ariRight), desc: "符号位扩展填入，负数补 1、正数补 0。等价于 ÷2ⁿ（向负无穷取整）" },
  ];

  return (
    <Diagram caption="4 种移位的区别：逻辑 vs 算术、左 vs 右。算术移位要保持符号">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>数值：</label>
        <input type="number" className="input" value={val} onChange={e => setVal(+e.target.value)} style={{ width: 90 }} />
        <label style={{ fontSize: 13, color: "var(--text-2)", marginLeft: 16 }}>移动位数：</label>
        <input type="number" className="input" value={shift} min={1} max={7} onChange={e => setShift(Math.max(1, Math.min(7, +e.target.value)))} style={{ width: 70 }} />
        <span style={{ color: "var(--text-3)", fontSize: 13 }}>（原始补码: {orig}）</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map(r => (
          <div key={r.name} style={{ display: "grid", gridTemplateColumns: "140px 1fr 120px", gap: 12, alignItems: "center", padding: "12px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{r.name}</div>
            <div>
              <div className="bitrow">
                {r.bits.split("").map((b, i) => (
                  <div key={i} className={`bit ${b === "1" ? "on" : ""} ${i === 0 ? "sign" : ""}`}>{b}</div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{r.desc}</div>
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 16, color: "var(--accent)", textAlign: "right" }}>= {r.val}</div>
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/* ---------- 6. 乘法演示：原码一位乘 vs 补码（Booth） ---------- */
function MultiplyDemo() {
  const [mode, setMode] = useState("yuan"); // yuan / booth
  const [x, setX] = useState(-5);
  const [y, setY] = useState(3);
  const BITS = 5; // 数值位 4 + 符号 1

  // 原码一位乘：|x|·|y|, 符号 = 异或
  const yuanSteps = useMemo(() => {
    const ax = Math.abs(x), ay = Math.abs(y);
    const xBin = ax.toString(2).padStart(BITS - 1, "0"); // 数值位
    const yBin = ay.toString(2).padStart(BITS - 1, "0");
    const steps = [];
    let P = 0; // 部分积累加器
    for (let i = BITS - 2; i >= 0; i--) {
      const yBit = +yBin[i];
      const add = yBit ? ax : 0;
      const before = P;
      P = (P + add) >> 0;
      const shifted = P >> 1;
      steps.push({
        i: BITS - 2 - i,
        yBit,
        add,
        pBefore: before,
        pAfter: P,
        pShifted: shifted,
      });
      P = shifted;
    }
    const sign = (x < 0) ^ (y < 0) ? 1 : 0;
    const result = (sign ? -1 : 1) * (ax * ay);
    return { xBin, yBin, steps, sign, result };
  }, [x, y]);

  return (
    <Diagram caption="乘法：原码一位乘法用「加法 + 右移」迭代 n 次，符号位单独由两操作数符号异或决定">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>X =</label>
        <input type="number" className="input" value={x} min={-15} max={15} onChange={e => setX(+e.target.value)} style={{ width: 70 }} />
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>Y =</label>
        <input type="number" className="input" value={y} min={-15} max={15} onChange={e => setY(+e.target.value)} style={{ width: 70 }} />
        <span style={{ color: "var(--text-3)", fontSize: 13 }}>（5位机，|x|,|y| ≤ 15）</span>
      </div>

      <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 12, lineHeight: 1.8 }}>
          <strong style={{ color: "var(--accent)" }}>原码一位乘法</strong>：取绝对值 |X|={Math.abs(x)} ({yuanSteps.xBin})，|Y|={Math.abs(y)} ({yuanSteps.yBin})
          <br/>从 Y 的最低位开始，为 1 则加 |X|，为 0 则加 0，然后部分积右移一位。共迭代 n = {BITS - 1} 次。
        </div>

        <table style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
          <thead>
            <tr>
              <th>步骤</th>
              <th>Y 当前位</th>
              <th>操作</th>
              <th>加后部分积</th>
              <th>右移后</th>
            </tr>
          </thead>
          <tbody>
            {yuanSteps.steps.map(s => (
              <tr key={s.i}>
                <td>{s.i + 1}</td>
                <td style={{ color: s.yBit ? "var(--accent)" : "var(--text-3)" }}>{s.yBit}</td>
                <td>{s.yBit ? `+ |X| (${Math.abs(x)})` : "+ 0"}</td>
                <td>{s.pAfter.toString(2).padStart(BITS - 1, "0")}</td>
                <td style={{ color: "var(--accent)" }}>{s.pShifted.toString(2).padStart(BITS - 1, "0")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 16, padding: 12, background: "var(--bg-2)", borderRadius: 6, fontSize: 14 }}>
          <span style={{ color: "var(--text-2)" }}>符号位：Sx ⊕ Sy = {x < 0 ? 1 : 0} ⊕ {y < 0 ? 1 : 0} = <strong style={{ color: "var(--red)" }}>{yuanSteps.sign}</strong></span>
          <span style={{ marginLeft: 24, color: "var(--text-2)" }}>结果：<strong style={{ color: "var(--accent)", fontSize: 16 }}>{yuanSteps.result}</strong></span>
        </div>
      </div>
    </Diagram>
  );
}

/* ---------- 7. 浮点加法流水线 ---------- */
function FloatAddPipeline() {
  const [step, setStep] = useState(0);
  // 例子: 0.1101 × 2^1  +  0.1011 × 2^-1
  // 为简化，使用小阶对大阶（右移小阶尾数）
  const stages = [
    {
      name: "① 对阶",
      detail: "找出两个阶码的差值 Δ = |Ex − Ey|。将阶码较小的数的尾数右移 Δ 位，阶码增大，直到两个阶码相等。",
      key: "小阶向大阶看齐（为什么？右移丢失的是低位精度，影响小；左移会丢失高位有效数字，后果严重）",
      visual: (
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>
          <div>X = 0.1101 × 2<sup>01</sup></div>
          <div>Y = 0.1011 × 2<sup>−01</sup> <span style={{ color: "var(--text-3)" }}>→ 小阶</span></div>
          <div style={{ color: "var(--accent)", marginTop: 8 }}>Y 尾数右移 2 位，阶码 +2：</div>
          <div>Y' = 0.001011 × 2<sup>01</sup></div>
        </div>
      ),
    },
    {
      name: "② 尾数加减",
      detail: "阶码对齐后，尾数按定点补码加减法运算（符号位参与）",
      key: "尾数加减的规则和定点数补码完全一致",
      visual: (
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>
          <div>  0.1101 00</div>
          <div>+ 0.0010 11</div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 4 }}>
            = <span style={{ color: "var(--accent)" }}>0.1111 11</span> × 2<sup>01</sup>
          </div>
        </div>
      ),
    },
    {
      name: "③ 规格化",
      detail: "若尾数形如 0.1xxx... (原码) 或满足 M[0] ≠ M[1] (补码)，则已规格化。否则左规/右规：",
      key: "左规：尾数左移 1 位，阶码减 1（直到规格化）；右规：尾数右移 1 位，阶码加 1（加法溢出时用一次）",
      visual: (
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>
          <div>0.1111 11 × 2<sup>01</sup></div>
          <div style={{ color: "var(--green)", marginTop: 8 }}>✓ 已规格化 (0.1xxx)，无需操作</div>
          <div style={{ color: "var(--text-3)", marginTop: 8, fontSize: 12 }}>
            若结果是 1.xxxx → 右规（尾数 &gt;&gt; 1，阶码 +1）<br/>
            若结果是 0.0xxx → 左规（尾数 &lt;&lt; k，阶码 −k）
          </div>
        </div>
      ),
    },
    {
      name: "④ 舍入",
      detail: "规格化丢失的低位用「0舍1入」「就近舍入到偶数（IEEE 默认）」等方式处理",
      key: "IEEE 754 默认「就近舍入到偶数」—— 恰好处在中间值时，选末位为偶数的那一个，避免舍入偏置",
      visual: (
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>
          <div>0.1111 <span style={{ color: "var(--red)" }}>11</span> × 2<sup>01</sup></div>
          <div style={{ color: "var(--accent)", marginTop: 8 }}>末两位 11 → 进位</div>
          <div>→ 0.1111 + 0.0001 = <span style={{ color: "var(--accent)" }}>1.0000</span> × 2<sup>01</sup></div>
          <div style={{ color: "var(--red)", marginTop: 4, fontSize: 12 }}>进位后尾数溢出，需要再次右规 →</div>
        </div>
      ),
    },
    {
      name: "⑤ 溢出判断",
      detail: "检查阶码：阶码上溢 → +∞ 或 −∞（异常）；阶码下溢 → 记作 0",
      key: "只判阶码！尾数溢出由规格化解决，阶码溢出才是真正的浮点溢出",
      visual: (
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.8 }}>
          <div>经右规后：0.1000 × 2<sup>10</sup></div>
          <div style={{ color: "var(--green)", marginTop: 8 }}>✓ 阶码 10 在合法范围内</div>
          <div style={{ color: "var(--accent)", marginTop: 4 }}>最终结果：0.1000 × 2<sup>10</sup></div>
        </div>
      ),
    },
  ];

  return (
    <Diagram caption="浮点加减法五步流水：对阶 → 尾数加减 → 规格化 → 舍入 → 溢出判断">
      <Stepper step={step} total={stages.length} onStep={setStep} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 12 }}>{stages[step].name}</div>
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 12 }}>{stages[step].detail}</p>
          <div style={{ padding: 12, background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)", borderRadius: "0 6px 6px 0", fontSize: 13, color: "var(--text)" }}>
            <strong>要点：</strong>{stages[step].key}
          </div>
        </div>
        <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>示例运算</div>
          {stages[step].visual}
        </div>
      </div>

      {/* 流水线指示 */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, background: "var(--bg-3)", padding: "12px 16px", borderRadius: 8 }}>
        {stages.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ 
            cursor: "pointer",
            flex: 1,
            textAlign: "center",
            padding: "8px 4px",
            background: i === step ? "var(--accent)" : i < step ? "var(--accent-soft)" : "transparent",
            color: i === step ? "#0a0a0b" : i < step ? "var(--accent)" : "var(--text-3)",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            transition: "all .2s",
            margin: "0 2px",
          }}>
            {s.name}
          </div>
        ))}
      </div>
    </Diagram>
  );
}

/* ---------- 8. 大小端存储可视化 ---------- */
function EndianDemo() {
  const [val, setVal] = useState("0x12345678");
  const n = parseInt(val, 16);
  const ok = !isNaN(n);
  const bytes = ok ? [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff
  ] : [0, 0, 0, 0];

  const big = bytes; // 高字节在低地址
  const little = [...bytes].reverse();

  const Row = ({ label, arr, desc, color }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-3)" }}>{desc}</div>
      </div>
      <div style={{ display: "flex", gap: 8, fontFamily: "var(--mono)" }}>
        {arr.map((b, i) => (
          <div key={i} style={{ flex: 1, background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 6 }}>地址 0x{(0x1000 + i).toString(16)}</div>
            <div style={{ fontSize: 18, color, fontWeight: 600 }}>0x{b.toString(16).padStart(2, "0").toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", fontSize: 11, color: "var(--text-3)", marginTop: 6, gap: 8 }}>
        <span style={{ flex: 1, textAlign: "center" }}>← 低地址</span>
        <span style={{ flex: 1, textAlign: "center" }}>高地址 →</span>
      </div>
    </div>
  );

  return (
    <Diagram caption="大端：高字节在低地址，符合阅读顺序；小端：低字节在低地址，x86/ARM 默认">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <label style={{ fontSize: 13, color: "var(--text-2)" }}>一个 32 位整数：</label>
        <input className="input" value={val} onChange={e => setVal(e.target.value)} style={{ width: 180 }} />
      </div>
      <Row label="大端 Big-Endian" arr={big} desc="PowerPC, 网络字节序" color="var(--blue)" />
      <Row label="小端 Little-Endian" arr={little} desc="x86, x64, ARM (默认)" color="var(--green)" />

      <Callout kind="blue" label="记忆法">
        <p><strong>大端</strong>像我们写字：数的"头"（高位）放在最前面（低地址）。<br/>
        <strong>小端</strong>反过来：数的"尾"（低位）放在最前面。CPU 做加减时从低位开始，小端序读取更高效。</p>
      </Callout>
    </Diagram>
  );
}

/* ---------- 9. 结构体对齐可视化 ---------- */
function StructAlignmentDemo() {
  const [preset, setPreset] = useState(0);
  const presets = [
    {
      name: "紧凑但未对齐（差）",
      fields: [
        { name: "c", type: "char", size: 1, color: "var(--red)" },
        { name: "i", type: "int", size: 4, color: "var(--blue)" },
        { name: "s", type: "short", size: 2, color: "var(--green)" },
      ],
      order: [0, 1, 2],
    },
    {
      name: "重排后（好）",
      fields: [
        { name: "i", type: "int", size: 4, color: "var(--blue)" },
        { name: "s", type: "short", size: 2, color: "var(--green)" },
        { name: "c", type: "char", size: 1, color: "var(--red)" },
      ],
      order: [0, 1, 2],
    },
  ];

  const cur = presets[preset];
  // 计算对齐布局
  const layout = [];
  let offset = 0;
  let maxAlign = 1;
  for (const f of cur.fields) {
    const align = f.size; // 简化：按自身大小对齐
    maxAlign = Math.max(maxAlign, align);
    const padding = (align - (offset % align)) % align;
    if (padding > 0) {
      layout.push({ type: "pad", size: padding, offset });
      offset += padding;
    }
    layout.push({ type: "field", ...f, offset });
    offset += f.size;
  }
  // 末尾补齐到 maxAlign 倍数
  const tailPad = (maxAlign - (offset % maxAlign)) % maxAlign;
  if (tailPad > 0) {
    layout.push({ type: "pad", size: tailPad, offset });
    offset += tailPad;
  }

  const totalBytes = 16;
  const actualSize = offset;

  return (
    <Diagram caption="结构体成员按 max(成员对齐, 编译器默认对齐) 对齐；末尾按最大成员对齐补 padding">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {presets.map((p, i) => (
          <button key={i} className={`btn ${i === preset ? "primary" : ""}`} onClick={() => setPreset(i)}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--bg-3)", padding: 20, borderRadius: 8 }}>
        <pre style={{ background: "var(--bg-2)", fontSize: 13, margin: "0 0 16px" }}>
{`struct S {
${cur.fields.map(f => `  ${f.type} ${f.name};`).join("\n")}
};  // sizeof = ${actualSize} 字节`}
        </pre>

        <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 8, letterSpacing: "0.1em" }}>内存布局（每格 1 字节）</div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: Math.max(totalBytes, actualSize) }).map((_, i) => {
            const block = layout.find(b => i >= b.offset && i < b.offset + b.size);
            if (!block) return <div key={i} style={{ width: 36, height: 48, background: "var(--bg-2)", border: "1px dashed var(--border)", borderRadius: 4 }} />;
            const isStart = i === block.offset;
            return (
              <div key={i} style={{
                width: 36, height: 48,
                background: block.type === "pad" ? "repeating-linear-gradient(45deg, var(--bg-2), var(--bg-2) 4px, var(--bg-3) 4px, var(--bg-3) 8px)" : block.color + "30",
                border: `1px solid ${block.type === "pad" ? "var(--border)" : block.color}`,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: block.type === "pad" ? "var(--text-3)" : block.color,
              }}>
                <div style={{ fontSize: 10, color: "var(--text-3)" }}>{i}</div>
                <div>{isStart ? (block.type === "pad" ? "pad" : block.name) : ""}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>
          偏移:&nbsp;
          {cur.fields.map(f => {
            const b = layout.find(x => x.type === "field" && x.name === f.name);
            return <span key={f.name} style={{ marginRight: 12, color: f.color }}>{f.name} @ {b.offset}</span>;
          })}
        </div>
      </div>

      <Callout label="对齐黄金法则" kind="">
        <p>① 每个成员的偏移量必须是其类型对齐值的整数倍；<br/>
        ② 结构体总大小必须是最大成员对齐值的整数倍；<br/>
        ③ 因此：<strong>把大的成员放前面</strong> 通常能减少 padding 浪费。</p>
      </Callout>
    </Diagram>
  );
}

/* ---------- 10. 全加器电路图（静态 SVG + 动画） ---------- */
function FullAdderDiagram() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [cin, setCin] = useState(0);
  const xor1 = a ^ b;
  const sum = xor1 ^ cin;
  const and1 = a & b;
  const and2 = xor1 & cin;
  const cout = and1 | and2;

  const wire = (on) => on ? "var(--accent)" : "var(--border-strong)";
  const dotStyle = (on) => ({ fill: on ? "var(--accent)" : "var(--text-3)" });

  return (
    <Diagram caption="全加器 Full Adder：把两个位 A、B 和上一级的进位 Cin 相加，产生本位 Sum 和向高位的进位 Cout">
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        {["A", "B", "Cin"].map((label, i) => {
          const v = [a, b, cin][i];
          const setter = [setA, setB, setCin][i];
          return (
            <button key={label} className="btn" onClick={() => setter(v ? 0 : 1)}
              style={{ fontFamily: "var(--mono)", background: v ? "var(--accent)" : "#fff", color: v ? "#fff" : "var(--text)", borderColor: v ? "var(--accent)" : "var(--border-strong)" }}>
              {label} = {v}
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--text-2)" }}>
          Sum = <span style={{ color: "var(--accent)", fontSize: 18 }}>{sum}</span>
          <span style={{ margin: "0 12px" }}>|</span>
          Cout = <span style={{ color: "var(--accent)", fontSize: 18 }}>{cout}</span>
        </div>
      </div>

      <svg viewBox="0 0 640 320" width="100%" style={{ background: "var(--bg-3)", borderRadius: 8 }}>
        {/* 输入标签 */}
        <text x={20} y={60} fill="var(--text)" fontFamily="var(--mono)" fontSize="14">A={a}</text>
        <text x={20} y={120} fill="var(--text)" fontFamily="var(--mono)" fontSize="14">B={b}</text>
        <text x={20} y={230} fill="var(--text)" fontFamily="var(--mono)" fontSize="14">Cin={cin}</text>

        {/* A,B 到第一个 XOR */}
        <path d={`M 55 55 L 140 55`} stroke={wire(a)} strokeWidth="2" fill="none" />
        <path d={`M 55 115 L 140 115`} stroke={wire(b)} strokeWidth="2" fill="none" />
        {/* XOR1 */}
        <g transform="translate(140, 60)">
          <path d="M 0 0 Q 20 25 0 50 Q 40 25 60 25 Q 40 25 0 0 Z" fill="var(--bg-2)" stroke={wire(xor1)} strokeWidth="2" />
          <path d="M -6 0 Q 14 25 -6 50" fill="none" stroke={wire(xor1)} strokeWidth="2" />
          <text x={22} y={30} fill="var(--text-2)" fontSize="11" textAnchor="middle">XOR</text>
        </g>
        <path d={`M 200 85 L 260 85`} stroke={wire(xor1)} strokeWidth="2" fill="none" />
        <text x={230} y={80} fill={wire(xor1)} fontSize="11" textAnchor="middle">{xor1}</text>

        {/* A,B 到 AND1 */}
        <path d={`M 100 55 L 100 170 L 140 170`} stroke={wire(a)} strokeWidth="2" fill="none" />
        <path d={`M 110 115 L 110 190 L 140 190`} stroke={wire(b)} strokeWidth="2" fill="none" />
        <circle cx={100} cy={55} r="3" style={dotStyle(a)} />
        <circle cx={110} cy={115} r="3" style={dotStyle(b)} />
        {/* AND1 */}
        <g transform="translate(140, 160)">
          <path d="M 0 0 L 30 0 Q 60 0 60 20 Q 60 40 30 40 L 0 40 Z" fill="var(--bg-2)" stroke={wire(and1)} strokeWidth="2" />
          <text x={30} y={25} fill="var(--text-2)" fontSize="11" textAnchor="middle">AND</text>
        </g>
        <path d={`M 200 180 L 260 180 L 260 260`} stroke={wire(and1)} strokeWidth="2" fill="none" />
        <text x={220} y={175} fill={wire(and1)} fontSize="11" textAnchor="middle">{and1}</text>

        {/* 第二个 XOR 接 xor1 和 Cin */}
        <path d={`M 260 85 L 340 85`} stroke={wire(xor1)} strokeWidth="2" fill="none" />
        <circle cx={260} cy={85} r="3" style={dotStyle(xor1)} />
        <path d={`M 55 225 L 260 225 L 260 115 L 340 115`} stroke={wire(cin)} strokeWidth="2" fill="none" />
        <g transform="translate(340, 60)">
          <path d="M 0 0 Q 20 25 0 50 Q 40 25 60 25 Q 40 25 0 0 Z" fill="var(--bg-2)" stroke={wire(sum)} strokeWidth="2" />
          <path d="M -6 0 Q 14 25 -6 50" fill="none" stroke={wire(sum)} strokeWidth="2" />
          <text x={22} y={30} fill="var(--text-2)" fontSize="11" textAnchor="middle">XOR</text>
        </g>
        <path d={`M 400 85 L 570 85`} stroke={wire(sum)} strokeWidth="2" fill="none" />
        <text x={580} y={90} fill="var(--accent)" fontFamily="var(--mono)" fontSize="16" fontWeight="600">Sum={sum}</text>

        {/* AND2: xor1 & cin */}
        <path d={`M 260 85 L 260 145 L 340 170`} stroke={wire(xor1)} strokeWidth="2" fill="none" opacity="0" />
        <path d={`M 300 85 L 300 175 L 340 175`} stroke={wire(xor1)} strokeWidth="2" fill="none" />
        <circle cx={300} cy={85} r="3" style={dotStyle(xor1)} />
        <path d={`M 310 225 L 310 195 L 340 195`} stroke={wire(cin)} strokeWidth="2" fill="none" />
        <circle cx={310} cy={225} r="3" style={dotStyle(cin)} />
        <g transform="translate(340, 165)">
          <path d="M 0 0 L 30 0 Q 60 0 60 20 Q 60 40 30 40 L 0 40 Z" fill="var(--bg-2)" stroke={wire(and2)} strokeWidth="2" />
          <text x={30} y={25} fill="var(--text-2)" fontSize="11" textAnchor="middle">AND</text>
        </g>
        <path d={`M 400 185 L 440 185 L 440 240 L 460 240`} stroke={wire(and2)} strokeWidth="2" fill="none" />

        {/* OR 输出 Cout */}
        <path d={`M 260 260 L 440 260 L 440 260 L 460 260`} stroke={wire(and1)} strokeWidth="2" fill="none" />
        <g transform="translate(460, 230)">
          <path d="M 0 0 Q 20 20 0 40 Q 40 20 60 20 Q 40 20 0 0 Z" fill="var(--bg-2)" stroke={wire(cout)} strokeWidth="2" />
          <text x={22} y={25} fill="var(--text-2)" fontSize="11" textAnchor="middle">OR</text>
        </g>
        <path d={`M 520 250 L 570 250`} stroke={wire(cout)} strokeWidth="2" fill="none" />
        <text x={580} y={255} fill="var(--accent)" fontFamily="var(--mono)" fontSize="16" fontWeight="600">Cout={cout}</text>
      </svg>

      <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-2)", lineHeight: 1.8 }}>
        <strong style={{ color: "var(--text)" }}>电路方程：</strong>
        <code>Sum = A ⊕ B ⊕ Cin</code>，<code>Cout = AB + (A⊕B)·Cin</code><br/>
        把 n 个全加器级联（Cout→Cin）就得到 n 位行波进位加法器（CRA）。
      </div>
    </Diagram>
  );
}

Object.assign(window, {
  BaseConverter, SignedEncodingExplorer, AddSubStepper, IEEE754Viewer,
  ShiftDemo, MultiplyDemo, FloatAddPipeline, EndianDemo, StructAlignmentDemo,
  FullAdderDiagram,
});
