// ============ 2.1 数制与编码 ============
function Section2_1() {
  return (
    <div className="fade-in">
      <div className="section-kicker">CHAPTER 2 · 2.1</div>
      <h1 className="section-title">数制与编码</h1>
      <p className="section-lead">
        计算机只认识 0 和 1。这一节解决两个问题：<strong>如何用 0/1 表示任意数</strong>（进制 + 各种编码），以及<strong>这些表示之间如何高效运算</strong>（补码的核心价值）。
      </p>

      {/* ========== 2.1.1 ========== */}
      <h2 id="s-2-1-1" className="block-title">2.1.1 进位计数制及其相互转换</h2>
      <div className="narrative">
        <p>
          进位计数制听起来像是一套规则，实际上它只解决一件事：<strong>用有限的符号写出无限的数</strong>。
          人类选择十进制完全是因为长了十根手指 —— 跟数学没关系。如果我们有八根手指，今天的小学课本就是八进制的。
        </p>
        <p>
          但计算机不同。计算机的"手指"是晶体管的两种稳定状态：通电 / 不通电。想让它用十进制，意味着每个存储单元要可靠地区分十种电压 —— 
          这在物理上几乎不可能稳定实现。<strong>所以二进制不是聪明，而是唯一的现实选择</strong>。一旦定了二进制，
          八进制和十六进制就顺势冒出来了：它们的基数是 2 的整数次幂（8 = 2³，16 = 2⁴），一位八进制正好对应三位二进制，
          一位十六进制正好对应四位二进制 —— 于是人能更紧凑地"阅读"机器里的数，而机器不需要任何换算。
        </p>
        <p>
          理解了这一点，所谓"进制转换"就不神秘了。任何进制背后的本质都是同一套数学：
          <strong>位权展开</strong> —— 第 i 位上的数字乘以基数的 i 次方，全部加起来。把数学上的真值算出来，
          再用另一套基数表示它，转换就完成了。
          <span className="whisper">记住：进制只是"书写方式"，数本身没有变。</span>
        </p>
      </div>
      <p>
        形式化地写出来，一个 r 进制数 <code>(dₙ...d₁d₀.d₋₁...d₋ₘ)ᵣ</code> 的真值等于各位数字乘以对应的 r 的幂次之和：
      </p>
      <pre>
{`(123.45)₁₀ = 1×10² + 2×10¹ + 3×10⁰ + 4×10⁻¹ + 5×10⁻²
(1011.01)₂ = 1×2³  + 0×2²  + 1×2¹  + 1×2⁰  + 0×2⁻¹ + 1×2⁻²  = 11.25`}
      </pre>

      <h3 className="sub-title">四种进制对照</h3>
      <table>
        <thead><tr><th>进制</th><th>基数</th><th>后缀</th><th>数字符号</th><th>一位=二进制</th></tr></thead>
        <tbody>
          <tr><td><strong>二进制</strong></td><td>2</td><td>B</td><td>0, 1</td><td>1 位</td></tr>
          <tr><td><strong>八进制</strong></td><td>8</td><td>O / Q</td><td>0~7</td><td>3 位</td></tr>
          <tr><td><strong>十进制</strong></td><td>10</td><td>D</td><td>0~9</td><td>—</td></tr>
          <tr><td><strong>十六进制</strong></td><td>16</td><td>H</td><td>0~9, A~F</td><td>4 位</td></tr>
        </tbody>
      </table>

      <h3 className="sub-title">转换规则速查</h3>
      <Compare
        leftTitle="整数部分：除基取余（从下往上读）"
        rightTitle="小数部分：乘基取整（从上往下读）"
        left={
          <pre style={{ margin: 0 }}>
{`156 ÷ 2 = 78 … 0  ← 低位
 78 ÷ 2 = 39 … 0
 39 ÷ 2 = 19 … 1
 19 ÷ 2 =  9 … 1
  9 ÷ 2 =  4 … 1
  4 ÷ 2 =  2 … 0
  2 ÷ 2 =  1 … 0
  1 ÷ 2 =  0 … 1  ← 高位
→ 10011100`}
          </pre>
        }
        right={
          <pre style={{ margin: 0 }}>
{`0.625 × 2 = 1.25  取 1  ← 高位
0.25  × 2 = 0.50  取 0
0.50  × 2 = 1.00  取 1  ← 低位
→ 0.101`}
          </pre>
        }
      />

      <Callout kind="blue" label="二 ↔ 八 / 十六 的秒算法则">
        <p>因为 2³=8、2⁴=16，<strong>八进制一位 ↔ 二进制 3 位；十六进制一位 ↔ 二进制 4 位</strong>。以小数点为界向两边分组即可。</p>
        <pre style={{ background: "var(--bg-2)", margin: "8px 0 0" }}>
{`1 0110 1101.1100₂ = 16D.C₁₆    (4位一组)
10 110 110 1.110 0₂ = 266.70₈    (3位一组，注意补零)`}
        </pre>
      </Callout>

      <h3 className="sub-title">交互演示：进制转换器</h3>
      <BaseConverter />

      <Mnemonic>
        整数除基取余由下往上，小数乘基取整由上往下；<br/>
        八进三位连一片，十六进制四位看。
      </Mnemonic>

      {/* ========== 2.1.2 ========== */}
      <h2 id="s-2-1-2" className="block-title">2.1.2 定点数的编码表示</h2>
      <div className="narrative">
        <p>
          先把一个容易被忽略的事情说清楚：<strong>机器里没有"小数点"，也没有"负号"</strong>。
          存储单元里只有 0 和 1。所谓"小数点在哪"、"这个数是正是负"，全是人跟机器<strong>约定</strong>出来的 ——
          这个约定就叫编码。"定点数"意思是：我们提前讲好，小数点的位置固定不动（比如固定在最右端表示整数，或固定在符号位之后表示纯小数），
          所以不用专门花一位去存它。
        </p>
        <p>
          有了这个前提，符号怎么办？最自然的想法是：拿出最高位当"符号位"，0 代表正，1 代表负，剩下的位存绝对值 —— 
          这就是<strong>原码</strong>。直观、符合人的书写习惯，但是致命缺陷有两个：
          一是 0 有两个表示（+0 和 −0），浪费编码；二是做减法要先判符号、再比大小、再决定走加法器还是减法器，硬件逻辑很复杂。
          工程师绝对不能忍受"为了一个减号多造一套电路"，于是想出了<strong>补码</strong>。
        </p>
        <p>
          补码的思路非常巧妙，它借用了"钟表回绕"的直觉：把 n 位的数想象成一个有 2ⁿ 个刻度的环，
          <strong>往前拨 3 格等于往后拨 2ⁿ − 3 格</strong>。这样"减法"被翻译成"加上一个等价的正数"，
          硬件只要一个加法器就搞定了加和减。副作用是正数的表示跟原码一样、零只有一种、还能多表示一个最小负数 —— 
          可以说是"白嫖了范围"。<strong>反码</strong>是补码的过渡品，今天几乎没人直接用。
          <strong>移码</strong>是另一种思路：把所有数整体平移 2ⁿ⁻¹，让编码从小到大恰好对应真值从小到大 ——
          这样"比较大小"就等于"按无符号比较位串"，非常适合做浮点数的阶码。
          <span className="whisper">记住四种编码各自在解决什么问题，公式自然就记住了。</span>
        </p>
      </div>
      <p>
        形式化一点说：<strong>定点数</strong> = 小数点位置固定的数（纯小数小数点在符号位后；纯整数小数点在最右端）。
        同一个真值在机器里可能有多种不同的 0/1 表示方式 —— 这就是<strong>编码</strong>。
      </p>

      <h3 className="sub-title">四大编码：原码、反码、补码、移码</h3>
      <table>
        <thead><tr><th>编码</th><th>正数</th><th>负数</th><th>0 的表示</th><th>n 位范围</th><th>用途</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>原码</strong></td>
            <td>符号位 0 + 数值</td>
            <td>符号位 1 + |x|</td>
            <td>±0 各一种</td>
            <td>−(2ⁿ⁻¹−1) ~ +(2ⁿ⁻¹−1)</td>
            <td>乘除法、浮点尾数</td>
          </tr>
          <tr>
            <td><strong>反码</strong></td>
            <td>同原码</td>
            <td>原码数值位取反</td>
            <td>±0 各一种</td>
            <td>−(2ⁿ⁻¹−1) ~ +(2ⁿ⁻¹−1)</td>
            <td>过渡（很少直接用）</td>
          </tr>
          <tr>
            <td><strong>补码</strong> <Tag kind="hot">核心</Tag></td>
            <td>同原码</td>
            <td>反码 + 1</td>
            <td>唯一</td>
            <td>−2ⁿ⁻¹ ~ +(2ⁿ⁻¹−1)</td>
            <td>整数加减法、表示整数</td>
          </tr>
          <tr>
            <td><strong>移码</strong></td>
            <td colSpan="2">补码符号位取反（即 2ⁿ⁻¹ + 真值）</td>
            <td>唯一</td>
            <td>同补码</td>
            <td>浮点数阶码</td>
          </tr>
        </tbody>
      </table>

      <Callout kind="" label="为什么非要有补码？">
        <p>
          <strong>原因一：统一加减。</strong>原码做减法要判断符号、比较大小、决定加/减 —— 硬件复杂。补码把减法变成加法：<code>A − B = A + (−B)补</code>，硬件只要一个加法器。<br/>
          <strong>原因二：唯一的 0。</strong>原码 <code>00000000</code> 和 <code>10000000</code> 都是 0，浪费了一个编码；补码只有一个 0，所以范围能多表示一个负数（如 8 位补码的 −128）。<br/>
          <strong>原因三：符号位可参与运算。</strong>补码下，符号位和数值位一样按位相加即可，不需要单独处理。
        </p>
      </Callout>

      <h3 className="sub-title">交互演示：四种编码的同步视图</h3>
      <SignedEncodingExplorer />

      <h3 className="sub-title">补码的快速求法</h3>
      <Card title="方法 A：定义法（逐步）">
        <ol>
          <li>写出 |x| 的二进制（原码数值位）</li>
          <li>若 x ≥ 0，符号位 0，直接得到补码</li>
          <li>若 x &lt; 0：符号位 1 + 数值位<strong>按位取反</strong> + <strong>末位加 1</strong></li>
        </ol>
      </Card>
      <Card title="方法 B：扫描法（推荐考场用）">
        <p>对负数：<strong>从最低位开始向左扫，遇到第一个 1 及之前（含自己）的位保持不变，之后的每一位都取反。</strong>符号位保持 1。</p>
        <pre>{`例：求 [-52]₈补
 52 = 0011 0100
扫描:           ↑ 最低位的 1 在这里
保持:    ....... 100
取反:   1 1001 100
⇒ [-52]补 = 1100 1100`}</pre>
      </Card>

      <Mnemonic>
        正数三码相同最容易；<br/>
        负数原码符号 1 带绝对值；<br/>
        反码负数数值位按位翻；<br/>
        补码反码末位再加一；<br/>
        移码补码符号位取反。
      </Mnemonic>

      {/* ========== 2.1.3 ========== */}
      <h2 id="s-2-1-3" className="block-title">2.1.3 整数的表示</h2>
      <div className="narrative">
        <p>
          这一小节其实是把 2.1.2 的编码理论"落地"到真实的存储空间上。
          现实中 CPU 里的寄存器就是 8 / 16 / 32 / 64 位这些固定长度的小格子 —— 这些格子既可以装一个<strong>无符号整数</strong>
          （所有位都是数值位，能表示的最大值翻倍），也可以装一个<strong>有符号整数</strong>（最高位是符号位）。
        </p>
        <p>
          <strong>同样的一串二进制，解释方式不同，真值就完全不同</strong>。比如 8 位的 <code>11111111</code>：
          当无符号看是 255；当有符号（补码）看是 −1。这不是机器出了 bug，而是 C 语言里用 <code>int</code> 还是 <code>unsigned</code> 声明它的结果。
          <strong>位是中性的，含义来自约定</strong> —— 这是整个计算机系统最底层的思想，也是很多难 bug 的根源。
        </p>
        <p>
          有符号整数现代计算机<strong>统一用补码</strong>，原因在 2.1.2 已经说过。要特别记住补码的范围是"不对称"的：
          n 位能表示 −2ⁿ⁻¹ 到 +2ⁿ⁻¹ − 1，<strong>负数那一侧多一个</strong>。因为补码只有一个 0，原本原码里多出来的那个 −0
          被"借"去表示了最小负数。所以 8 位有 −128 却没有 +128，对 −128 求绝对值会溢出 —— 这是考试高频陷阱。
        </p>
      </div>
      <p>
        整数按是否有符号分两类。现代计算机<strong>有符号整数统一用补码表示</strong>。
      </p>

      <Compare
        leftTitle="无符号整数 Unsigned"
        rightTitle="有符号整数 Signed（补码）"
        left={
          <>
            <ul>
              <li>所有位都是数值位，没有符号位</li>
              <li>n 位范围：<code>0 ~ 2ⁿ − 1</code></li>
              <li>8 位：0 ~ 255</li>
              <li>16 位：0 ~ 65535</li>
              <li>32 位：0 ~ 4294967295（约 4.29×10⁹）</li>
              <li>加法进位 = 结果超出范围（溢出）</li>
            </ul>
          </>
        }
        right={
          <>
            <ul>
              <li>最高位是符号位（0 正 / 1 负）</li>
              <li>n 位范围：<code>−2ⁿ⁻¹ ~ 2ⁿ⁻¹ − 1</code></li>
              <li>8 位：−128 ~ +127</li>
              <li>16 位：−32768 ~ +32767</li>
              <li>32 位：约 −2.15×10⁹ ~ +2.15×10⁹</li>
              <li>溢出：双高位进位异号</li>
            </ul>
          </>
        }
      />

      <Callout kind="red" label="边界易错点">
        <p>
          <strong>n 位补码能表示 −2ⁿ⁻¹，但不能表示 +2ⁿ⁻¹。</strong>
          比如 8 位：−128 能表示（<code>10000000</code>）而 +128 不能。对这个最小负数求绝对值会溢出：
          <code>|−128|</code> 需要 8 位，但 +128 需要 9 位才能表示。所以 <code>−(−128)</code> 在 8 位机里仍是 −128。
        </p>
      </Callout>

      {/* ========== 2.1.4 ========== */}
      <h2 id="s-2-1-4" className="block-title">2.1.4 C 语言中的整数类型及类型转换</h2>
      <div className="narrative">
        <p>
          C 语言是离硬件最近的高级语言，它的整数类型几乎就是寄存器的直接映射。学 C 的类型系统，本质上是在学
          "<strong>一块内存被如何解释</strong>"。同样 32 位的内存区域，你告诉编译器它是 <code>int</code>、<code>unsigned</code>、
          <code>float</code>，打印出来的数字就完全不同 —— 内存的位一点没变，变的只是"解释它的规则"。
        </p>
        <p>
          类型转换的所有规则都可以从一个原则推出来：<strong>能不动位就不动位，动了位也是为了保持真值</strong>。
          同长度有符号和无符号互转，位模式完全不变，只换一副"眼镜"看它；
          短类型转长类型，为了<strong>保持真值</strong>，有符号数就要做符号扩展（高位全补符号位），无符号数就补 0 —— 
          这两种扩展的选择不是任意的，是"想让真值不变"这个要求强行决定的；
          长类型转短类型只能直接截断高位，<strong>真值大概率会变</strong>，这是信息丢失，程序员要自己负责。
        </p>
        <p>
          最容易坑人的是<strong>混合运算</strong>。C 的规矩是："有符号和无符号出现在同一个表达式里，有符号的那个被悄悄转成无符号。"
          于是 <code>-1 &lt; 1u</code> 这样看起来天经地义的判断会返回假。这是 C 语言的历史包袱，不是 bug ——
          它的存在让循环 <code>for (unsigned i = n; i &gt;= 0; i--)</code> 永远死循环，让无数老鸟栽跟头。
          408 考这个点，考的不是你会不会背规则，是考你<strong>有没有意识到"类型在背后默默改变了运算含义"</strong>。
        </p>
      </div>
      <h3 className="sub-title">常见类型（以 32 位平台为例）</h3>
      <table>
        <thead><tr><th>类型</th><th>大小</th><th>范围（有符号）</th><th>范围（无符号）</th></tr></thead>
        <tbody>
          <tr><td>char</td><td>1 B</td><td>−128 ~ 127</td><td>0 ~ 255</td></tr>
          <tr><td>short</td><td>2 B</td><td>−32768 ~ 32767</td><td>0 ~ 65535</td></tr>
          <tr><td>int</td><td>4 B</td><td>≈ ±2.15×10⁹</td><td>0 ~ ≈ 4.29×10⁹</td></tr>
          <tr><td>long</td><td>4 B (Win) / 8 B (Linux)</td><td colSpan="2">平台相关</td></tr>
          <tr><td>long long</td><td>8 B</td><td>±9.2×10¹⁸</td><td>0 ~ 1.8×10¹⁹</td></tr>
        </tbody>
      </table>

      <h3 className="sub-title">类型转换规则</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="① 同长度 有符号 ↔ 无符号">
          <p><strong>位模式不变，只改变解释方式。</strong></p>
          <pre>{`int i = -1;              // 0xFFFFFFFF
unsigned u = (unsigned)i; // 位不变
printf("%u", u);          // 4294967295`}</pre>
        </Card>
        <Card title="② 短 → 长（扩展）">
          <p>有符号用<strong>符号位扩展</strong>（补符号位），无符号用<strong>零扩展</strong>（补 0）。</p>
          <pre>{`char c = -1;     // 0xFF
int i = c;       // 0xFFFFFFFF (符号扩展)
unsigned char uc = 0xFF;
int j = uc;      // 0x000000FF (零扩展)`}</pre>
        </Card>
        <Card title="③ 长 → 短（截断）">
          <p><strong>直接截掉高位</strong>，保留低位。结果可能改变数值含义（可能变负）。</p>
          <pre>{`int i = 258;        // 0x00000102
char c = (char)i;   // 0x02 = 2
int j = 300;        
char d = (char)j;   // 0x2C = 44`}</pre>
        </Card>
        <Card title="④ 混合表达式：向无符号看齐">
          <p>有符号和无符号混合运算，有符号数会被<strong>隐式转换为无符号</strong>！这是 C 语言经典陷阱。</p>
          <pre>{`int i = -1;
unsigned u = 1;
if (i < u)           // 直觉：真
    // 不会执行！
// i 被转成 0xFFFFFFFF
// 比较 4294967295 < 1 ⇒ 假`}</pre>
        </Card>
      </div>

      <Callout kind="red" label="考试必考：扩展 + 截断 + 无符号比较">
        <p>408 真题最喜欢考的是：<br/>
        ① 一个 <code>char</code> 变量赋一个负值后作为 <code>int</code> 参与运算；<br/>
        ② <code>int</code> 与 <code>unsigned</code> 比较的结果；<br/>
        ③ 循环变量用 <code>unsigned</code> 做倒数时死循环。记住口诀：<strong>符号扩展看原类型，混合比较靠无符号。</strong></p>
      </Callout>

      <h3 className="sub-title">真题演练</h3>
      <Quiz
        meta="【2012 统考 · 选择】"
        question="若 x 的补码表示为 1111 1111（8 位），则 x 的真值是？"
        options={["−1", "−127", "−128", "−255"]}
        answer={0}
        explanation="补码 1111 1111：最高位 1 表示负。求真值：取反 0000 0000，+1 得 0000 0001 = 1。加负号得 −1。也可直接用公式：真值 = −2⁷·1 + 2⁶·1 + … + 2⁰·1 = −128 + 127 = −1。"
      />

      <Quiz
        meta="【C 语言类型陷阱】"
        question={<>下列代码的输出是？ <code>{`unsigned short a = 65535; short b = a; printf("%d", b);`}</code></>}
        options={["65535", "-1", "0", "未定义"]}
        answer={1}
        explanation="a = 65535 的位模式是 1111 1111 1111 1111。赋给 short b 时位模式保持不变。按有符号 short（补码）解释：最高位 1 为负数，数值 = 全 1 补码 = −1。这就是『同长度有符号↔无符号位模式不变』规则的体现。"
      />
    </div>
  );
}

window.Section2_1 = Section2_1;
