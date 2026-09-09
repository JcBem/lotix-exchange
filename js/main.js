/* ============================================================
   LOTIX 单页交互逻辑
   - 移动端菜单 / 导航滚动效果
   - 滚动入场动画 + 数字滚动
   - 行情表格 + 跑马灯（模拟实时数据）
   - Canvas 价格走势图（Hero 卡片 & 手机模型）
   ============================================================ */

// ---------- 模拟行情数据 ----------
const COINS = [
  { sym: "BTC",  name: "比特币", price: 67238.5,  change: 2.34,  high: 68120,  icon: "₿", cls: "coin-btc" },
  { sym: "ETH",  name: "以太坊", price: 3512.4,   change: 1.82,  high: 3568,   icon: "Ξ", cls: "coin-eth" },
  { sym: "SOL",  name: "索拉纳", price: 172.42,   change: -0.94, high: 176.8,  icon: "◎", cls: "coin-sol" },
  { sym: "BNB",  name: "币安币", price: 604.18,   change: 0.76,  high: 611.4,  icon: "B", cls: "coin-bnb" },
  { sym: "XRP",  name: "瑞波币", price: 0.6234,   change: 3.12,  high: 0.638,  icon: "X", cls: "coin-xrp" },
  { sym: "DOGE", name: "狗狗币", price: 0.1582,   change: -2.05, high: 0.1654, icon: "Ð", cls: "coin-doge" },
  { sym: "ADA",  name: "艾达币", price: 0.4521,   change: 1.24,  high: 0.461,  icon: "A", cls: "coin-ada" },
  { sym: "AVAX", name: "雪崩币", price: 38.76,    change: 4.58,  high: 39.9,   icon: "▲", cls: "coin-avax" },
];

const fmtPrice = (p) =>
  p >= 1000
    ? "$" + p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "$" + p.toFixed(p >= 1 ? 2 : 4);

// ---------- 移动端菜单 ----------
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
navToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", open);
});
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    navToggle.classList.remove("open");
  })
);

// ---------- 导航滚动阴影 ----------
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// ---------- 滚动入场动画 ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ---------- 数字滚动 ----------
const numIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      numIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll(".count-up").forEach((el) => numIO.observe(el));

// ---------- 行情表格 ----------
function renderMarket() {
  const wrap = document.getElementById("marketRows");
  wrap.innerHTML = COINS.map(
    (c) => `
    <div class="market-row" data-sym="${c.sym}">
      <span class="col-coin">
        <span class="mk-coin">
          <span class="coin-icon ${c.cls}">${c.icon}</span>
          <span><strong>${c.sym}/USDT</strong><small>${c.name}</small></span>
        </span>
      </span>
      <span class="col-price mk-price">${fmtPrice(c.price)}</span>
      <span class="col-change mk-change ${c.change >= 0 ? "up" : "down"}">
        ${c.change >= 0 ? "+" : ""}${c.change.toFixed(2)}%
      </span>
      <span class="col-high mk-high">${fmtPrice(c.high)}</span>
      <span class="col-action">
        <button class="btn btn-primary" type="button">交易</button>
      </span>
    </div>`
  ).join("");
}
renderMarket();

// ---------- 跑马灯 ----------
function renderMarquee() {
  const track = document.getElementById("marqueeTrack");
  const item = (c) => `
    <span class="marquee-item">
      <span class="m-name">${c.sym}/USDT</span>
      <span class="m-price">${fmtPrice(c.price)}</span>
      <span class="${c.change >= 0 ? "up" : "down"}">${c.change >= 0 ? "▲" : "▼"} ${Math.abs(c.change).toFixed(2)}%</span>
    </span>`;
  const list = COINS.map(item).join("");
  track.innerHTML = list + list; // 双份保证无缝滚动
}
renderMarquee();

// ---------- 模拟实时价格波动 ----------
function tickPrices() {
  COINS.forEach((c) => {
    const drift = (Math.random() - 0.5) * 0.002;
    c.price = Math.max(c.price * (1 + drift), 0.0001);
    c.change = c.change + drift * 100;
  });

  document.querySelectorAll(".market-row").forEach((row) => {
    const c = COINS.find((x) => x.sym === row.dataset.sym);
    if (!c) return;
    row.querySelector(".mk-price").textContent = fmtPrice(c.price);
    const chg = row.querySelector(".mk-change");
    chg.textContent = `${c.change >= 0 ? "+" : ""}${c.change.toFixed(2)}%`;
    chg.className = `col-change mk-change ${c.change >= 0 ? "up" : "down"}`;
  });
  renderMarquee();
}
setInterval(tickPrices, 2600);

// ---------- Canvas 走势图 ----------
function buildPoints(base, volatility, trend, n) {
  const pts = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.5) * volatility + trend;
    pts.push(v);
  }
  return pts;
}

function drawChart(canvas, points, colorUp, colorDown) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || canvas.width;
  const h = canvas.clientHeight || canvas.height;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const pad = 8;
  const x = (i) => (i / (points.length - 1)) * w;
  const y = (v) => pad + (1 - (v - min) / range) * (h - pad * 2);

  const rising = points[points.length - 1] >= points[0];
  const stroke = rising ? colorUp : colorDown;

  // 渐变填充
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, rising ? "rgba(22,199,132,.28)" : "rgba(234,57,67,.28)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(x(i), y(p)) : ctx.lineTo(x(i), y(p))));
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = "round";
  ctx.stroke();

  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // 末端高亮点
  const lx = x(points.length - 1);
  const ly = y(points[points.length - 1]);
  ctx.beginPath();
  ctx.arc(lx - 2, ly, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = stroke;
  ctx.fill();
}

// Hero BTC 图表
let heroPts = buildPoints(67000, 900, 60, 40);
const heroCanvas = document.getElementById("heroChart");
function drawHero() {
  drawChart(heroCanvas, heroPts, "#2FE3E0", "#EA3943");
}
drawHero();
window.addEventListener("resize", drawHero);

// Hero 卡片价格同步跳动
const heroPriceEl = document.getElementById("heroPrice");
const heroChangeEl = document.getElementById("heroChange");
const heroHighEl = document.getElementById("heroHigh");
const heroLowEl = document.getElementById("heroLow");
setInterval(() => {
  const last = heroPts[heroPts.length - 1];
  const next = Math.max(last + (Math.random() - 0.48) * 220, 50000);
  heroPts.push(next);
  heroPts.shift();
  drawHero();

  heroPriceEl.textContent = fmtPrice(next);
  const first = heroPts[0];
  const pct = ((next - first) / first) * 100;
  heroChangeEl.textContent = `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
  heroChangeEl.className = `ticker-change ${pct >= 0 ? "up" : "down"}`;
  const hi = Math.max(...heroPts);
  const lo = Math.min(...heroPts);
  heroHighEl.textContent = fmtPrice(hi);
  heroLowEl.textContent = fmtPrice(lo);
}, 1800);

// 手机模型小图表
const phoneCanvas = document.getElementById("phoneChart");
const phonePts = buildPoints(100, 4, 0.25, 28);
function drawPhone() {
  drawChart(phoneCanvas, phonePts, "#2FE3E0", "#EA3943");
}
drawPhone();
window.addEventListener("resize", drawPhone);
setInterval(() => {
  const last = phonePts[phonePts.length - 1];
  phonePts.push(Math.max(last + (Math.random() - 0.45) * 2.2, 80));
  phonePts.shift();
  drawPhone();
}, 2200);
