// ============ 2.3 浮点数的表示与运算 ============
function Section2_3() {
  return (
    <div className="fade-in">
      <div className="section-kicker">CHAPTER 2 · 2.3</div>
      <h1 className="section-title">浮点数的表示与运算</h1>
      <p className="section-lead">
        定点数范围有限、精度固定；而现实世界既有 <code>6.022×10²³</code> 也有 <code>1.6×10⁻¹⁹</code>。
        浮点数借用科学计数法的思路，用<strong>可变的小数点位置</strong>换来超大动态范围。代价是：精度不均匀、运算规则更复杂。
      </p>

      {/* ========== 2.3.1 ========== */}
      <h2 id="s-2-3-1" className="block-title">2.3.1 浮点数的表示</h2>
      <div className="narrative">
        <p>
          物理世界的数字跨度非常夸张：一个原子的质量是 10⁻²⁷ 量级，一个星系的质量是 10⁴² 量级。
          如果用定点数来存，要覆盖这个范围需要上百位才够，还绝大部分位是浪费的。
          人类在做科学计算时早就想出了一个好办法 —— <strong>科学计数法</strong>：把一个数写成"一位有效数字 × 10 的若干次方"。
          这样表示 6.022 × 10²³ 和 1.6 × 10⁻¹⁹ 只需要寥寥几个字符。浮点数就是把这个思想搬到机器里：
          <strong>一个尾数 M，一个阶码 E，合在一起就能覆盖巨大的动态范围</strong>。
        </p>
        <p>
          但这里有一个不能忽略的事：<strong>浮点数不是"更精确"，而是"范围更广"。相反，它的精度是有限且不均匀的</strong>。
          同样 32 位，定点数能精确地表示每一个整数；而 32 位浮点数只有 24 位有效尾数，所以在 10⁷ 以上，相邻的两个可表示值就不再相邻，中间的数根本表达不出来 ——
          于是 <code>0.1 + 0.2 ≠ 0.3</code> 这种诡异的事情才会发生。
          浮点的口号应该是：<strong>用精度换取范围</strong>。
        </p>
        <p>
          浮点数还有一个麻烦：同一个真值可以有很多种写法（<code>0.5 × 2² = 1 × 2¹ = 2 × 2⁰</code>）。如果不规定，
          比较两个浮点数相等都做不到。于是引入<strong>规格化</strong>：强制尾数的最高有效位必须是 1，
          这样每个数都有唯一形式。IEEE 754 走得更远：反正规格化后最高位<strong>一定</strong>是 1，那干脆就不存这一位了，
          省下来的一位用来多存一位尾数精度 —— 这就是"隐藏位"。
          阶码用<strong>移码（偏置）</strong>也是为了一个实用目的：让浮点数可以像无符号整数一样直接比大小，硬件比较电路不用改。
          <span className="whisper">IEEE 754 的每一个设计细节，都能追溯到"让硬件更简单"或"让软件更安全"这两个动机之一。</span>
        </p>
      </div>
      <p>
        浮点数的一般形式：<code>V = (−1)<sup>S</sup> × M × R<sup>E</sup></code>
      </p>
      <ul>
        <li><strong>S 符号位</strong> — 1 位，决定正负</li>
        <li><strong>M 尾数</strong>（Mantissa / Significand）— 定点小数，承载有效数字</li>
        <li><strong>E 阶码</strong>（Exponent）— 定点整数，决定小数点位置</li>
        <li><strong>R 基数</strong> — 通常为 2（固定，不存储）</li>
      </ul>

      <h3 className="sub-title">规格化：为什么要规格化？</h3>
      <Callout label="直觉">
        <p>
          同一个数可以有多种浮点表示：<code>0.0011 × 2³</code>、<code>0.0110 × 2²</code>、<code>0.1100 × 2¹</code> 都等于 <code>1.5</code>。
          如果不规定格式，比较两个浮点数是否相等、或者做加减法会很混乱。
          所以规定：<strong>尾数的最高有效位必须为 1</strong> —— 这就是规格化。
        </p>
      </Callout>

      <table>
        <thead><tr><th>编码</th><th>规格化条件</th><th>举例（非规格化 → 规格化）</th></tr></thead>
        <tbody>
          <tr><td>原码</td><td>M 的第一位数值位 = 1，即 <code>0.1xxx</code>（正）/ <code>1.1xxx</code>（负）</td><td>0.0101 → 左规两次</td></tr>
          <tr><td>补码</td><td>符号位与第一数值位<strong>相反</strong>：<code>0.1xxx</code> 或 <code>1.0xxx</code></td><td>见下</td></tr>
        </tbody>
      </table>

      <h3 className="sub-title">IEEE 754 标准</h3>
      <p>
        这是现代计算机的事实标准。它在普通浮点基础上引入了三个关键设计：<strong>阶码移码（偏置）</strong>、<strong>尾数隐藏位</strong>、<strong>特殊值</strong>。
      </p>

      <table>
        <thead><tr><th>精度</th><th>总位</th><th>符号 S</th><th>阶码 E</th><th>尾数 M</th><th>偏置 bias</th><th>C 类型</th></tr></thead>
        <tbody>
          <tr><td>单精度</td><td>32</td><td>1</td><td>8</td><td>23</td><td>127</td><td><code>float</code></td></tr>
          <tr><td>双精度</td><td>64</td><td>1</td><td>11</td><td>52</td><td>1023</td><td><code>double</code></td></tr>
          <tr><td>扩展双</td><td>80</td><td>1</td><td>15</td><td>64</td><td>16383</td><td><code>long double</code> (x86)</td></tr>
        </tbody>
      </table>

      <Card title="① 阶码用移码（偏置码）">
        <p>存储的阶码 = 真实阶码 + 偏置。<strong>为什么要偏置？</strong>让两个浮点数的大小可以像无符号整数一样比较——无需单独处理符号、阶码。移码 <code>0000...0</code> 是最小，<code>1111...1</code> 是最大。</p>
      </Card>
      <Card title="② 尾数隐含首位 1">
        <p>规格化后尾数一定是 <code>1.xxxx</code>，既然首位固定为 1，干脆不存！<strong>32 位单精度实际尾数精度是 24 位</strong>（23 位存储 + 1 位隐含）。</p>
      </Card>
      <Card title="③ 特殊值（靠阶码识别）">
        <ul>
          <li><strong>阶码全 0 & 尾数全 0</strong> → <code>±0</code></li>
          <li><strong>阶码全 0 & 尾数 ≠ 0</strong> → 非规格化数（denormal），表示极小的数，<strong>无隐含 1</strong>，尾数作 <code>0.xxx × 2<sup>1−bias</sup></code></li>
          <li><strong>阶码全 1 & 尾数全 0</strong> → <code>±∞</code></li>
          <li><strong>阶码全 1 & 尾数 ≠ 0</strong> → <code>NaN</code>（Not a Number）</li>
        </ul>
      </Card>

      <h3 className="sub-title">交互演示：IEEE 754 位视图</h3>
      <IEEE754Viewer />

      <Callout kind="blue" label="32 位单精度的几个关键数字">
        <p>
          最大规格化正数 ≈ <code>3.4 × 10³⁸</code>（阶码 <code>11111110</code>, 尾数全 1）<br/>
          最小规格化正数 ≈ <code>1.18 × 10⁻³⁸</code>（阶码 <code>00000001</code>, 尾数 0）<br/>
          最小非规格化正数 ≈ <code>1.4 × 10⁻⁴⁵</code>（阶码 0, 尾数末位为 1）
        </p>
      </Callout>

      <Mnemonic>
        一符八阶二三尾，127 偏置定阶真；<br/>
        规格化数暗藏一，乘方公式 1.M 起；<br/>
        全零全一有特殊，零、次、无穷与 NaN。
      </Mnemonic>

      {/* ========== 2.3.2 ========== */}
      <h2 id="s-2-3-2" className="block-title">2.3.2 浮点数的加减运算</h2>
      <div className="narrative">
        <p>
          浮点加法在人看来就是一行算式，在硬件里却是<strong>五个前后相连的步骤</strong>。原因在于：两个浮点数的小数点位置可能完全不同。
          比如 1.2 × 10³ + 4.5 × 10¹，不能直接加尾数 1.2 + 4.5 —— 这是在加两个不同量级的数，结果毫无意义。
          必须先让两个数的<strong>小数点对齐到同一阶码</strong>，再加尾数。这一整套流程，每一步都有它必须存在的理由。
        </p>
        <p>
          第一步"对阶"是<strong>小阶向大阶看齐</strong>，不是随便挑一个。为什么？
          因为让小的那个数的尾数右移，丢掉的是低位（精度损失小）；反过来让大的那个数左移，丢掉的是<strong>高位</strong>（有效数字没了）。
          所以规则只有一个方向可选。第二步"尾数相加减"跟定点加法一样，没什么新东西。
          关键是第三步"规格化"—— 尾数加完后可能变成 <code>10.xxx</code>（进位，要右规一位）或 <code>0.0xxx</code>（太小，要左规直到首位是 1），
          需要相应地调整阶码。
        </p>
        <p>
          第四步"舍入"是浮点数<strong>误差的源头</strong>。对阶时右移出去的位、规格化左规补上的位，都要以某种方式处理。
          IEEE 754 默认用"就近舍入到偶"—— 正好在中点时选末位为 0 的那个，这样长期来看正负误差相互抵消，不会系统性漂移。
          最后第五步"溢出判断"看的是<strong>阶码</strong>：阶码太大叫上溢（结果被记为 ±∞），阶码太小叫下溢（结果被记为 0 或非规格化数）。
          注意：尾数在规格化过程中那次短暂的"溢出"根本不算浮点溢出 —— 右规一次就解决了，只要阶码没爆。
          <span className="whisper">这五步的顺序不是死记，而是一个"必须按此序"的因果链。</span>
        </p>
      </div>
      <p>
        浮点加减远比定点复杂。它必须先把"小数点对齐"，再做尾数运算，之后还要规格化、舍入、判溢出。这五步是高频考点，务必背熟顺序和每一步的细节。
      </p>

      <FloatAddPipeline />

      <h3 className="sub-title">舍入方式</h3>
      <table>
        <thead><tr><th>方式</th><th>规则</th><th>IEEE 名称</th></tr></thead>
        <tbody>
          <tr><td>截断（Truncate）</td><td>直接丢弃低位</td><td>Round toward 0</td></tr>
          <tr><td>0 舍 1 入</td><td>丢弃位最高为 0 则舍，为 1 则入（向绝对值更大方向）</td><td>—（近似最近偶）</td></tr>
          <tr><td><strong>就近舍入到偶</strong> <Tag kind="key">IEEE 默认</Tag></td><td>恰好处于中点时，选末位为偶数的那个</td><td>Round to nearest, ties to even</td></tr>
          <tr><td>向 +∞ 舍入</td><td>永远取更大的值</td><td>Round toward +∞</td></tr>
          <tr><td>向 −∞ 舍入</td><td>永远取更小的值</td><td>Round toward −∞</td></tr>
        </tbody>
      </table>

      <Callout kind="red" label="考点：为什么小阶向大阶看齐？">
        <p>
          因为尾数右移只丢失<strong>低位</strong>（精度损失小），而尾数左移会丢失<strong>高位</strong>（有效数字损失大）。所以永远让<strong>小阶尾数右移</strong>。
        </p>
      </Callout>

      <Callout kind="blue" label="考点：浮点溢出只看阶码">
        <p>
          规格化过程中尾数"溢出"（变成 <code>1.xxx</code>）不算浮点溢出，右规一次即可。
          真正的浮点溢出是<strong>阶码超出最大值（上溢，→∞）</strong>或<strong>小于最小值（下溢，→0）</strong>。
        </p>
      </Callout>

      {/* ========== 2.3.3 ========== */}
      <h2 id="s-2-3-3" className="block-title">2.3.3 C 语言中的浮点数类型</h2>
      <div className="narrative">
        <p>
          学 C 的浮点类型要<strong>抛开"float 就是小数"的直觉</strong>。<code>float</code> 和 <code>int</code> 在内存里都是 32 位，
          但它们对这 32 位的<strong>解释方式截然不同</strong>。同一块 32 位的数据，按 int 看可能是几亿，按 float 看可能是 10⁻³⁰ 的极小数。
          这不是随便设计的 —— float 的 8 位阶码 + 23 位尾数，就是 2.3.1 讲的 IEEE 754 直接映射过来。
        </p>
        <p>
          浮点和整数之间的转换远比整数之间复杂，核心问题是<strong>精度是否够用</strong>。
          32 位 int 能精确表示 0 到 ±2³¹ 的每一个整数，但 32 位 float 只有 24 位有效尾数 —— 
          所以当 int 的值大于 2²⁴ 时，转成 float 会<strong>丢精度</strong>。
          反向转（float → int）问题更大：小数部分直接截断（向 0 取整，不是四舍五入），如果超出 int 范围更是未定义行为。
          <strong>double 有 53 位有效尾数，装得下 32 位 int 的全部值</strong>，所以 int 转 double 是安全的。
        </p>
        <p>
          最经典的陷阱是<strong>浮点相等比较</strong>。<code>0.1 + 0.2 != 0.3</code> 不是语言的 bug，而是 0.1 这个十进制小数
          在二进制下是<strong>无限循环</strong>（就像 1/3 在十进制下是 0.333...），它被截断成 52 位后带着小小的误差存进去了。
          三个带微小误差的数加起来，当然不完全等于 0.3 的精确表示。
          <strong>在浮点世界里，"相等"要换成"足够接近"</strong>：<code>fabs(a−b) &lt; ε</code>。这不是一个可选的编码规范，是必须。
        </p>
      </div>

      <table>
        <thead><tr><th>类型</th><th>标准</th><th>大小</th><th>有效数字（十进制）</th><th>范围（绝对值）</th></tr></thead>
        <tbody>
          <tr><td><code>float</code></td><td>IEEE 754 单精度</td><td>4 B</td><td>≈ 7 位</td><td>±1.2×10⁻³⁸ ~ ±3.4×10³⁸</td></tr>
          <tr><td><code>double</code></td><td>IEEE 754 双精度</td><td>8 B</td><td>≈ 15~17 位</td><td>±2.2×10⁻³⁰⁸ ~ ±1.8×10³⁰⁸</td></tr>
          <tr><td><code>long double</code></td><td>平台相关</td><td>8/10/16 B</td><td>≥ double</td><td>≥ double</td></tr>
        </tbody>
      </table>

      <h3 className="sub-title">浮点 ↔ 整型的转换</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card title="int → float">
          <p>两者都是 32 位，但 float 只有 <strong>24 位有效</strong>，可能丢失精度。</p>
          <pre>{`int  i = 2147483520;  // 2^31 - 128
float f = i;
int  j = (int)f;
// j ≠ i！被舍入到最近的可表示值`}</pre>
        </Card>
        <Card title="float → int">
          <p>小数部分被<strong>截断</strong>（向 0 取整）。若浮点数超出 int 范围则行为未定义。</p>
          <pre>{`float f = 3.7;
int i = (int)f;     // i = 3
float g = -3.7;
int j = (int)g;     // j = -3（不是 -4）`}</pre>
        </Card>
        <Card title="int → double">
          <p>double 有 <strong>53 位有效</strong>，32 位 int 完全放得下，<strong>不会丢精度</strong>。</p>
        </Card>
        <Card title="float → double">
          <p><strong>无精度损失</strong>，低位补 0；阶码和尾数重新偏置。</p>
        </Card>
      </div>

      <Callout kind="red" label="经典陷阱：浮点数相等比较">
        <p>
          <code>0.1 + 0.2 == 0.3</code> 在 IEEE 754 下是 <strong>false</strong>！因为 0.1、0.2、0.3 都是无限循环二进制小数，存储时被截断。
          <strong>正确做法：</strong><code>fabs(a − b) &lt; 1e−9</code>。
        </p>
      </Callout>

      {/* ========== 2.3.4 ========== */}
      <h2 id="s-2-3-4" className="block-title">2.3.4 数据的大小端和对齐存储</h2>
      <div className="narrative">
        <p>
          这一小节的两个话题（字节序、对齐）单拎出来都不难，但是它们都在回答同一个问题：
          <strong>一个大于一字节的数据，在内存里到底该怎么摆？</strong>内存是一维的字节数组，而 int 是 4 字节、double 是 8 字节 ——
          这 4 个或 8 个字节要按什么顺序、放到哪个地址上？答案不是唯一的，不同 CPU 厂商做了不同选择，于是有了历史包袱。
        </p>
        <p>
          <strong>字节序</strong>问题源于一个根本的非对称性：一个多字节整数"哪个是高位字节、哪个是低位字节"是明确的，
          但"内存地址的增长方向"跟"整数的高低位方向"不存在天然的映射。<strong>大端</strong>派说：人类书写从高位到低位，就让低地址放高位字节，跟书写一致；
          <strong>小端</strong>派说：CPU 做加减从低位算起，低地址放低位字节硬件上更自然。
          两派都有道理，最后 x86 选了小端、网络协议选了大端，世界就分裂了。
          程序员只有一件事要记住：<strong>跨机器通信时，一定要做字节序转换</strong>（<code>htonl/ntohl</code> 就是干这个的）。
        </p>
        <p>
          <strong>对齐</strong>问题的起源是：CPU 从内存取数据不是"一个字节一个字节"拿的，而是一次拿一整个"字"（比如 4 或 8 字节）。
          如果一个 int 不幸跨越了两个字的边界，CPU 就得取两次内存、再把两半拼起来 —— 慢好几倍，有些 RISC 架构甚至直接报错拒绝访问。
          所以编译器会自动在结构体的字段之间<strong>插入空字节（padding）</strong>，让每个字段的起始地址都落在它"自然对齐"的位置上。
          这就是为什么一个 <code>struct &#123; char; int; short; &#125;</code> 的 sizeof 是 12 而不是 7 ——
          那 5 个字节的"浪费"换来了每次访问的速度。
          <strong>了解这个之后，调换字段顺序就能省内存</strong>：把大类型放前面、小类型放后面，padding 自然就少了。
        </p>
      </div>

      <h3 className="sub-title">大端 vs 小端</h3>
      <p>
        一个多字节数据（比如 32 位 int）在内存中占用连续的多个字节。<strong>哪个字节放在低地址，哪个放在高地址？</strong>这就是字节序（Byte Order）问题。
      </p>

      <EndianDemo />

      <table>
        <thead><tr><th>字节序</th><th>规则</th><th>典型平台</th><th>读取</th></tr></thead>
        <tbody>
          <tr><td><strong>大端 Big-Endian</strong></td><td>高位字节在低地址</td><td>PowerPC, SPARC, MIPS（默认）, <strong>网络字节序</strong></td><td>与人类书写顺序一致，调试直观</td></tr>
          <tr><td><strong>小端 Little-Endian</strong></td><td>低位字节在低地址</td><td>x86, x86-64, ARM（默认）</td><td>CPU 从低位开始做加减时访问更高效</td></tr>
        </tbody>
      </table>

      <Callout kind="blue" label="判断本机字节序的 C 代码">
        <pre style={{ margin: 0, background: "var(--bg-2)", border: "none" }}>
{`int i = 1;
char* p = (char*)&i;
if (*p == 1) printf("Little-Endian");
else         printf("Big-Endian");
// 把 int(1)=0x00000001 的首字节读出来：
// 小端低地址放 0x01，大端低地址放 0x00`}
        </pre>
      </Callout>

      <h3 className="sub-title">数据对齐 Data Alignment</h3>
      <p>
        为什么要对齐？因为多数 CPU 访问内存时<strong>以"字"为单位</strong>（比如 4 字节一次）。如果一个 int 跨越两个"字"的边界，
        CPU 就要访问两次内存然后拼接，变慢甚至出错（某些 RISC 架构直接报错）。
      </p>

      <h4 className="small-title">对齐规则</h4>
      <ol>
        <li>每个基本类型的<strong>自然对齐</strong>值 = 它的大小（char=1, short=2, int=4, double=8）</li>
        <li>结构体成员的偏移必须是<strong>成员对齐值的倍数</strong></li>
        <li>结构体整体大小必须是<strong>最大成员对齐值的倍数</strong>（便于数组连续存放）</li>
        <li>编译器可能在成员间或尾部插入 <strong>padding 字节</strong></li>
      </ol>

      <StructAlignmentDemo />

      <Mnemonic>
        大端小端看低址，高位低址是大端；<br/>
        每员偏移整数倍，总长最大对齐对。<br/>
        调换字段能省空，大员放前最紧凑。
      </Mnemonic>

      <h3 className="sub-title">真题演练</h3>
      <Quiz
        meta="【2017 统考 · 选择】"
        question="以下 C 代码在 32 位小端机器上，printf 输出的第一个字节值是？"
        options={["0x01", "0x78", "0x12", "0x34"]}
        answer={1}
        explanation={<>代码：<code>{`int x = 0x12345678; printf("%x", *((char*)&x));`}</code>。小端模式下，低位字节存在低地址：内存从低到高依次是 0x78, 0x56, 0x34, 0x12。取 <code>(char*)&x</code> 就是低地址字节 = 0x78。</>}
      />

      <Quiz
        meta="【浮点经典】"
        question="IEEE 754 单精度浮点数 0x C1 48 00 00 的十进制值是？"
        options={["−12.5", "−12.0", "−50.0", "+12.5"]}
        answer={0}
        explanation="0xC1480000 = 1100 0001 0100 1000 0000 0000 0000 0000。符号 S=1（负）；阶码 E=10000010=130，真值 E−127=3；尾数 M=10010000...，加上隐含 1. 得 1.1001；值 = −1.1001 × 2³ = −1100.1 = −12.5。"
      />

      <Quiz
        meta="【结构体对齐】"
        question={<>32 位系统下 <code>{`struct { char a; int b; short c; };`}</code> 的 sizeof 是？</>}
        options={["7", "8", "12", "16"]}
        answer={2}
        explanation="a 占 1 字节 (0)；b 是 int 需 4 字节对齐，从偏移 4 开始，前面填 3 字节 padding (1~3)；b 占 4 字节 (4~7)；c 是 short 需 2 字节对齐，偏移 8 已对齐，占 2 字节 (8~9)。总长需是最大对齐值 (int 的 4) 的倍数，所以末尾补 2 字节 padding。总计 12 字节。"
      />
    </div>
  );
}

window.Section2_3 = Section2_3;
