// ============ 2.2 运算方法和运算电路 ============
function Section2_2() {
  return (
    <div className="fade-in">
      <div className="section-kicker">CHAPTER 2 · 2.2</div>
      <h1 className="section-title">运算方法和运算电路</h1>
      <p className="section-lead">
        前一节我们有了"数"，这一节让它"动起来"。核心是两个东西：<strong>算术逻辑单元 ALU</strong> —— 机器算术的物理载体；和<strong>补码下的四则运算</strong> —— 为什么硬件可以这么简洁。
      </p>

      {/* ========== 2.2.1 ========== */}
      <h2 id="s-2-2-1" className="block-title">2.2.1 基本运算部件</h2>
      <div className="narrative">
        <p>
          计算机里所有的加减乘除、所有的与或非、甚至所有的"判断是否相等"，<strong>最终都由同一个叫 ALU 的电路块完成</strong>。
          它像一台万能计算器，接收两个输入和一个"你要我做什么"的控制信号，给出一个输出和几个小旗子（标志位），告诉外部世界结果是不是零、有没有溢出。
        </p>
        <p>
          ALU 的核心零件是 <strong>全加器</strong> —— 只能给一个位做加法的小电路。有人第一次听会觉得可笑：一位加法有什么难？
          难的不是加法本身，而是"进位"。把两位 A、B 加起来容易，可如果低位有进位进来呢？这个进位又会不会传给下一位？
          全加器就是把"两个数相加 + 考虑进位 + 输出本位和 + 输出向高位的进位"这四件事用几个与或异或门拼起来的最小单元。
          把 n 个全加器串起来，就得到了一个 n 位的加法器。
        </p>
        <p>
          但这里有个工程难题：一串全加器里，第 k 位必须等前面所有位都算完进位才能开始工作。位数越多，等待越久 —— 
          这就是<strong>行波进位加法器（CRA）</strong>的瓶颈。
          工程师的解法是<strong>先行进位（CLA）</strong>：不串等了，用组合逻辑<strong>提前把每一位的进位算出来</strong>。
          代价是电路变复杂（门电路数量暴增），收益是延迟从线性降到对数级 —— 这是典型的"用硅换时间"。
          现代 CPU 的加法器都是 CLA 的各种变体。
        </p>
      </div>
      <p>
        形式上讲，<strong>ALU（Arithmetic Logic Unit）</strong>接收两个操作数 A、B 和一个控制信号 K，
        输出一个结果 F 和若干状态标志（ZF / SF / CF / OF）。
      </p>

      <h3 className="sub-title">从 1 位全加器到 n 位加法器</h3>
      <p>
        ALU 里最基础的零件是<strong>全加器（FA）</strong>。它解决"一个位的加法"：三个输入 A、B、Cin（来自低位的进位），
        两个输出 Sum（本位和）、Cout（向高位的进位）。
      </p>

      <FullAdderDiagram />

      <h3 className="sub-title">行波进位 vs 先行进位</h3>
      <Compare
        leftTitle="行波进位加法器 CRA"
        rightTitle="先行进位加法器 CLA"
        left={
          <>
            <p>把 n 个全加器串起来，上一级的 Cout 接下一级的 Cin，像水波一样传过去。</p>
            <ul>
              <li>电路简单，<strong>面积小</strong></li>
              <li>延迟随位宽<strong>线性增长</strong>：n 位 ≈ n·t<sub>FA</sub></li>
              <li>32 位时明显变慢</li>
            </ul>
          </>
        }
        right={
          <>
            <p>先算出每一位的进位公式，进位不再等待传播。</p>
            <ul>
              <li><code>Gᵢ = AᵢBᵢ</code>（生成），<code>Pᵢ = Aᵢ⊕Bᵢ</code>（传递）</li>
              <li><code>Cᵢ₊₁ = Gᵢ + Pᵢ·Cᵢ</code>，可展开成并行电路</li>
              <li>延迟降到 <strong>O(log n)</strong></li>
              <li>代价：门电路数量增加，面积大</li>
            </ul>
          </>
        }
      />

      <Callout kind="blue" label="ALU 的状态标志 ZF/SF/CF/OF">
        <p>
          <strong>ZF</strong>（Zero Flag）：结果是否为 0；<br/>
          <strong>SF</strong>（Sign Flag）：结果最高位（1 表示负）；<br/>
          <strong>CF</strong>（Carry Flag）：最高位产生的<strong>进位</strong>。用于<strong>无符号数</strong>溢出判断；<br/>
          <strong>OF</strong>（Overflow Flag）：用于<strong>有符号数</strong>溢出判断。<code>OF = Cn ⊕ Cn-1</code>。
        </p>
      </Callout>

      {/* ========== 2.2.2 ========== */}
      <h2 id="s-2-2-2" className="block-title">2.2.2 定点数的移位运算</h2>
      <div className="narrative">
        <p>
          为什么要专门讲移位？因为<strong>移位是硬件里最便宜的运算</strong>。乘以 2 不需要调用乘法器 —— 那是一个动辄十几个时钟周期的大家伙；
          只要把每一位往左挪一格，最低位补 0，就等价于 ×2 了。
          这个道理跟十进制一样：123 × 10 只要写成 1230，根本不用真的去做乘法。
        </p>
        <p>
          但问题来了：负数怎么办？右移时最左端补什么？这就是<strong>逻辑移位</strong>和<strong>算术移位</strong>的分水岭。
          逻辑移位把二进制串当成<strong>一串没有意义的位</strong>，两端都补 0，适合无符号数；
          算术移位认定最高位是<strong>符号位</strong>，右移时补符号位（正数补 0、负数补 1）以保持符号不变 —— 
          这样右移一位就等价于整数除以 2。
        </p>
        <p>
          但是注意一个坑：算术右移的除法是<strong>向负无穷取整</strong>（floor），不是 C 语言 <code>/</code> 运算符的"向零取整"。
          比如 −5 算术右移 1 位得 −3（floor(−2.5) = −3），而 C 的 <code>−5 / 2 = −2</code>（向 0 截断）。
          所以你不能拿右移当成"等价于除法"写进代码里 —— 编译器在负数下不会用右移实现整数除法，
          它要做一些修正才能保持语义。<span className="whisper">这是很多人以为自己懂了、实际上没懂的地方。</span>
        </p>
      </div>
      <p>
        所以移位按规则不同分为<strong>逻辑移位</strong>和<strong>算术移位</strong>，再加上<strong>循环移位</strong>共三类。
      </p>

      <ShiftDemo />

      <table>
        <thead><tr><th>移位类型</th><th>填入位</th><th>作用于</th><th>等价运算</th></tr></thead>
        <tbody>
          <tr><td>逻辑左移</td><td>右端填 0</td><td>无符号</td><td>× 2ⁿ</td></tr>
          <tr><td>逻辑右移</td><td>左端填 0</td><td>无符号</td><td>÷ 2ⁿ</td></tr>
          <tr><td>算术左移</td><td>右端填 0，<strong>符号位不变</strong></td><td>有符号（补码）</td><td>× 2ⁿ（会溢出）</td></tr>
          <tr><td>算术右移</td><td>左端<strong>补符号位</strong>（正补 0，负补 1）</td><td>有符号（补码）</td><td>÷ 2ⁿ（向 −∞ 取整）</td></tr>
          <tr><td>循环左移</td><td>最高位循环到最低位</td><td>均可</td><td>—</td></tr>
          <tr><td>循环右移</td><td>最低位循环到最高位</td><td>均可</td><td>—</td></tr>
        </tbody>
      </table>

      <Callout kind="red" label="易错点：算术右移 ≠ 整数除法">
        <p>
          算术右移是<strong>向负无穷取整</strong>（Floor），而 C 语言的 <code>/</code> 是<strong>向 0 取整</strong>（Truncate）。
          正数两者相同，负数不同：<code>−5 &gt;&gt; 1 = −3</code>，但 <code>−5 / 2 = −2</code>。
        </p>
      </Callout>

      <Mnemonic>
        逻辑全补零，算术看符号；<br/>
        左移乘二可溢出，右移除二向下取。
      </Mnemonic>

      {/* ========== 2.2.3 ========== */}
      <h2 id="s-2-2-3" className="block-title">2.2.3 定点数的加减运算</h2>
      <div className="narrative">
        <p>
          这一小节可以说是整章最核心、也最值得体会的部分 —— 它展示了<strong>数学上的巧思怎么拯救硬件</strong>。
          如果用原码做减法，你需要比较两个数的绝对值谁大、决定结果的符号、再做一次"大的减小的"。
          这意味着硬件里除了加法器，还得配一个减法器、一个比较器、一套控制逻辑。
          而补码只用一个加法器就搞定了：<strong>A − B 直接变成 A + (−B) 的补码</strong>。
        </p>
        <p>
          为什么这么神奇？因为补码本质上是"模 2ⁿ 运算"。在 n 位的世界里，<strong>2ⁿ 等于 0</strong>（高位进位会被丢掉），
          所以 −B 就等价于 2ⁿ − B。于是 A − B = A + (2ⁿ − B) = A + [−B]补，加完超出的那个 2ⁿ 自动被丢弃 —— 
          <strong>溢出的那一位不是错误，而是设计的一部分</strong>。理解了这一点，你再看补码的公式就没有什么需要"死记"的了。
        </p>
        <p>
          但是便宜没有白占的，代价是：<strong>有符号数的溢出需要单独判断</strong>。
          因为位运算本身不知道这是"有符号的加法"，它只是老老实实把位加起来。所以必须从外部观察："这个结果是不是真的在范围内？"
          判断方法有三种（双符号位、进位异或、同号变号），底层是同一件事：<strong>同号相加如果结果变号，就一定溢出了</strong>。
          还要注意有符号溢出（OF 标志）和无符号溢出（CF 标志）是两回事 —— 
          同一次加法，这两个标志可以一个为真一个为假，要看你把这个数当有符号还是无符号用。
        </p>
      </div>
      <p>
        补码加减法漂亮的地方在于：<strong>符号位和数值位一起按位加，最高位溢出位直接丢弃，结果自动正确。</strong>
      </p>

      <h3 className="sub-title">公式</h3>
      <Card>
        <pre style={{ margin: 0, background: "transparent", border: "none", padding: 0 }}>
{`[A + B]补 = [A]补 + [B]补       (模 2ⁿ 加法)
[A − B]补 = [A]补 + [−B]补      (减法转加法)
[−B]补 = 对 [B]补「连符号位按位取反 + 1」`}
        </pre>
      </Card>

      <h3 className="sub-title">交互演示：分步做一道加减法</h3>
      <AddSubStepper />

      <h3 className="sub-title">溢出判断的三种方法</h3>
      <Card title="方法 1 · 双符号位（变形补码）">
        <p>操作数用<strong>两位符号位</strong>（00 正、11 负）参与运算，运算结束后看符号位：</p>
        <ul>
          <li><code>00</code> 或 <code>11</code> → 无溢出</li>
          <li><code>01</code> → 正溢出（结果太大）</li>
          <li><code>10</code> → 负溢出（结果太小）</li>
        </ul>
        <pre>{`  00.1010  (+10)
+ 00.0110  (+6)
  --------
= 01.0000  → 双符号位 01，发生正溢出！真值 +16 超出 4 位补码范围 [-8, +7]`}</pre>
      </Card>
      <Card title="方法 2 · 单符号位 + 进位比较（硬件常用）">
        <p>设 <code>Cn</code> 为符号位产生的进位，<code>Cn-1</code> 为最高数值位产生的进位。</p>
        <pre>{`OF = Cn ⊕ Cn-1
      同号为 0 → 正确；异号为 1 → 溢出`}</pre>
      </Card>
      <Card title="方法 3 · 符号比较">
        <p><strong>两个同号数相加，结果符号变了 → 溢出。</strong>（异号相加永远不会溢出。减法同理：看 A 和 −B 的符号）</p>
      </Card>

      <Callout kind="" label="无符号溢出 vs 有符号溢出">
        <p>
          <strong>无符号溢出</strong>由 <code>CF</code>（最高位进位）判断：<code>CF = 1</code> 即溢出。<br/>
          <strong>有符号溢出</strong>由 <code>OF</code>（<code>Cn ⊕ Cn-1</code>）判断。<br/>
          同一个加法，这两个标志可能不同！比如 <code>0x7F + 0x01 = 0x80</code>：无符号是 128 正常，有符号却从 +127 溢出到 −128。
        </p>
      </Callout>

      <Mnemonic>
        补码加减真简单：符号位同样参加；<br/>
        最高丢位不用管，次高异或来报警。
      </Mnemonic>

      {/* ========== 2.2.4 ========== */}
      <h2 id="s-2-2-4" className="block-title">2.2.4 定点数的乘除运算</h2>
      <div className="narrative">
        <p>
          乘法和除法比加减法<strong>贵得多</strong>。加减法一个时钟周期就出结果，乘法在早期 CPU 里要几十个周期，
          除法更慢。所以历代 CPU 工程师都在琢磨怎么让乘除变快。
          这一小节介绍的几种算法，不是纯粹的数学题，而是<strong>"硬件可实现"这个约束下的工程折中</strong>。
        </p>
        <p>
          <strong>原码一位乘</strong>是最朴素的思路 —— 就是你小学手算乘法的二进制版：逐位看乘数，为 1 就把被乘数累加上来，然后右移。
          n 位就加 n 次、移 n 次。它简单可实现，但速度受限于位数。
          后来的<strong>Booth 算法</strong>利用一个很聪明的性质：连续的 k 个 1 等价于"最右端加一次、最左端减一次"（因为 2ᵏ − 1 = 2ᵏ⁺¹⁻¹ − 2⁰），
          所以遇到长串的 1 就可以跳过、只在"由 0 变 1"和"由 1 变 0"的边界做加减 —— 
          而且关键是：<strong>Booth 不区分正负数，符号位自动对</strong>，这对补码硬件极其友好。
        </p>
        <p>
          除法更麻烦，因为<strong>除法本质是"试"</strong>——每一位商都得先假设是 1、做减法、看能不能减得动。
          恢复余数法就是字面意思的"试减"：试减失败就把减掉的加回去，再移位。
          <strong>不恢复余数法</strong>（加减交替法）是个巧妙的优化：既然失败要加回去、下一步还要减，那么"加回去 + 左移 + 减"
          在数学上等价于"左移 + 加"，于是这两步合成了一步，不用再做那次"恢复"。步数固定、硬件好实现，所以实际机器都用这个。
          <span className="whisper">记住：乘除算法设计的主旋律就是"如何少做几次加减 + 如何让硬件简单"。</span>
        </p>
      </div>

      <h3 className="sub-title">原码一位乘法</h3>
      <p>
        思路很朴素：用乘法分配律展开，每次处理一位乘数。
      </p>
      <pre>
{`计算 X × Y，设 Y = y₀.y₁y₂...yₙ (原码小数)
P₀ = 0 (初始部分积)
for i = 1 to n:
    if yᵢ == 1: P = P + |X|
    else:       P = P + 0
    P 右移 1 位
符号位 = Sx ⊕ Sy （单独计算，不参与乘法）`}
      </pre>

      <MultiplyDemo />

      <h3 className="sub-title">补码一位乘法（Booth 算法）</h3>
      <Card title="核心思想">
        <p>Booth 算法巧妙地利用"一串连续 1 的和可以用两端差值表示"这个性质，把多次加法合并。</p>
        <p><strong>辅助位：</strong>在乘数最低位右侧再加一个 0（<code>y₋₁ = 0</code>）。每次看相邻两位 <code>yᵢ yᵢ₋₁</code>：</p>
        <table>
          <thead><tr><th>yᵢ yᵢ₋₁</th><th>操作</th><th>含义</th></tr></thead>
          <tbody>
            <tr><td><code>0 0</code></td><td>部分积 + 0，右移</td><td>连续 0 中间</td></tr>
            <tr><td><code>0 1</code></td><td>部分积 + [X]补，右移</td><td>连续 1 的末尾（结束）</td></tr>
            <tr><td><code>1 0</code></td><td>部分积 + [−X]补，右移</td><td>连续 1 的开始</td></tr>
            <tr><td><code>1 1</code></td><td>部分积 + 0，右移</td><td>连续 1 中间</td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          共迭代 n 次（n = 数值位数），最后<strong>只右移不加</strong>（或者再看一次末位差）。Booth 的优势：<strong>符号位自动处理，不需要单独异或</strong>。
        </p>
      </Card>

      <h3 className="sub-title">原码除法：恢复余数 vs 不恢复余数</h3>
      <Compare
        leftTitle="恢复余数法"
        rightTitle="不恢复余数法（加减交替法）"
        left={
          <>
            <ol>
              <li>余数左移一位（或被除数右移一位）</li>
              <li>试减除数：R = R − |Y|</li>
              <li>若 R ≥ 0：商上 1</li>
              <li>若 R &lt; 0：商上 0，<strong>R 加回 |Y|</strong> 恢复</li>
            </ol>
            <p style={{ color: "var(--text-3)", fontSize: 12, marginTop: 8 }}>缺点：当试减失败时要多做一次加法，速度不稳定。</p>
          </>
        }
        right={
          <>
            <p>利用"减 + 加 = 左移再减"的数学等价：</p>
            <ul>
              <li>若本次余数 ≥ 0：商上 1，下次做 <strong>左移后减 |Y|</strong></li>
              <li>若本次余数 &lt; 0：商上 0，下次做 <strong>左移后加 |Y|</strong></li>
              <li>末尾若余数为负，再加一次 |Y| 得正确余数</li>
            </ul>
            <p style={{ color: "var(--text-3)", fontSize: 12, marginTop: 8 }}>优点：步数固定 = 数值位数，硬件好实现。现代机器几乎都用这个。</p>
          </>
        }
      />

      <Callout kind="red" label="除法易错点">
        <p>
          ① 除数不能为 0；② 定点小数除法要求 <code>|被除数| &lt; |除数|</code>，否则<strong>商溢出</strong>；
          ③ 商符 = 被除数与除数符号异或；④ 余数符号 = 被除数符号（恢复余数法）。
        </p>
      </Callout>

      <h3 className="sub-title">真题演练</h3>
      <Quiz
        meta="【2013 统考 · 选择】"
        question="有符号整数用补码表示。8 位二进制补码数 1111 0000 表示的十进制数是？"
        options={["−112", "−16", "−15", "240"]}
        answer={1}
        explanation="补码 1111 0000：最高位 1 为负数。方法一：扫描法取负绝对值——从右扫到第一个 1（第4位）保持 '10000'，之前各位取反：0000 1111 的左半... 实际上更简单：取反加一得 0000 1111 + 1 = 0001 0000 = 16。所以真值 = −16。"
      />

      <Quiz
        meta="【溢出判断】"
        question="8 位补码 A = 0100 1000，B = 0011 1000。A + B 的结果是？"
        options={["+128，正常", "溢出，结果无效", "−128", "+120"]}
        answer={1}
        explanation="A = 72，B = 56，真值相加 = 128。但 8 位补码范围是 [−128, +127]，+128 超出。按位相加：0100 1000 + 0011 1000 = 1000 0000。双符号位看：00.1001000 + 00.0111000 = 01.0000000，符号位 01 表示正溢出。这是典型的『同号相加结果变号』场景。"
      />
    </div>
  );
}

window.Section2_2 = Section2_2;
