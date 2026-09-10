/* ============================================================
   LOTI 单页交互逻辑
   - 移动端菜单 / 导航滚动效果
   - 滚动入场动画 + 数字滚动
   - 行情表格 + 跑马灯（模拟实时数据）
   - Canvas 价格走势图（Hero 卡片 & 手机模型）
   ============================================================ */

// ---------- 模拟行情数据 ----------
const COINS = [
  { sym: "BTC",  name: "比特币", nameEn: "Bitcoin",   price: 67238.5,  change: 2.34,  high: 68120,  icon: "₿", cls: "coin-btc" },
  { sym: "ETH",  name: "以太坊", nameEn: "Ethereum",  price: 3512.4,   change: 1.82,  high: 3568,   icon: "Ξ", cls: "coin-eth" },
  { sym: "SOL",  name: "索拉纳", nameEn: "Solana",    price: 172.42,   change: -0.94, high: 176.8,  icon: "◎", cls: "coin-sol" },
  { sym: "BNB",  name: "币安币", nameEn: "BNB",       price: 604.18,   change: 0.76,  high: 611.4,  icon: "B", cls: "coin-bnb" },
  { sym: "XRP",  name: "瑞波币", nameEn: "XRP",       price: 0.6234,   change: 3.12,  high: 0.638,  icon: "X", cls: "coin-xrp" },
  { sym: "DOGE", name: "狗狗币", nameEn: "Dogecoin",  price: 0.1582,   change: -2.05, high: 0.1654, icon: "Ð", cls: "coin-doge" },
  { sym: "ADA",  name: "艾达币", nameEn: "Cardano",   price: 0.4521,   change: 1.24,  high: 0.461,  icon: "A", cls: "coin-ada" },
  { sym: "AVAX", name: "雪崩币", nameEn: "Avalanche", price: 38.76,    change: 4.58,  high: 39.9,   icon: "▲", cls: "coin-avax" },
];

// ---------- 多语言 i18n（中文 / English） ----------
const I18N = {
  zh: {
    meta_title: "LOTI 乐提 — 即将上线的数字资产交易平台 · 内测预约",
    meta_desc: "LOTI 乐提是一家正在筹备中的数字资产交易平台，即将提供安全、专业、便捷的比特币、以太坊等加密货币现货与合约交易服务，内测预约现已开启。",
    announce_text: "LOTI 平台正在筹备中，预计近期正式上线。现在预约内测，可享早期用户专属权益。",
    announce_link: "立即预约 →",
    nav_markets: "行情", nav_features: "服务", nav_guide: "新手指南",
    nav_security: "安全保障", nav_app: "App 预约", nav_about: "关于我们",
    nav_contact: "联系我们", nav_reserve: "预约内测", mobile_reserve: "立即预约内测",
    hero_badge: "全新数字资产交易平台 · 即将上线 · 内测预约已开启",
    hero_title_1: "把握趋势", hero_title_2: "领跑数字资产交易",
    hero_desc: "LOTI 乐提是一家初创数字资产交易平台，正在为正式上线全力筹备。未来我们将提供比特币、以太坊等主流加密货币的现货与合约交易服务，以银行级安全架构、顶级交易深度与 7×24 小时多语言客服，打造安心、专业的交易体验。",
    hero_cta_primary: "预约抢先体验", hero_cta_secondary: "了解 LOTI",
    stat_security_t: "安全架构", stat_security_d: "冷热钱包分离 · 储备金证明规划",
    stat_perf_t: "极致性能", stat_perf_d: "每秒 140 万笔撮合引擎",
    stat_global_t: "全球视野", stat_global_d: "多语种服务 · 合规布局中",
    coin_btc: "比特币", ticker_spot: "现货", chart_aria: "BTC 价格走势图",
    ticker_high: "24h 最高", ticker_low: "24h 最低", ticker_vol: "24h 量",
    ticker_cta: "预约内测 · 上线优先交易",
    markets_title: "热门市场行情",
    markets_sub: "实时追踪主流加密货币价格，把握每一个交易机会",
    markets_more: "查看全部市场 →",
    th_coin: "币种", th_price: "最新价格", th_change: "24h 涨跌", th_high: "24h 最高", th_action: "操作",
    btn_reserve: "预约",
    features_title: "一站式数字资产服务",
    features_sub: "从现货到合约，从理财到支付，LOTI 满足你对加密世界的全部需求",
    f1_t: "银行级安全保障",
    f1_p: "规划冷热钱包分离、多重签名与投资者保护基金；上线后将定期公开储备金证明（PoR），资产安全可查可验。",
    f2_t: "极致交易深度",
    f2_p: "撮合引擎实测每秒可处理 140 万笔订单；上线后将聚合全球顶级做市商流动性，大额交易也能滑点极低、成交极速。",
    f3_t: "极具竞争力费率",
    f3_p: "现货手续费将低至 0.1%，平台币抵扣再享折扣；VIP 等级越高费率越优，maker 挂单有望享受零费率。",
    f4_t: "7×24 多语言客服",
    f4_p: "上线后提供全天候在线支持，并配备新手学院、跟单与网格交易工具，帮助每位用户快速上手。",
    start_title: "现在预约，上线快人一步",
    start_sub: "平台即将上线，留下邮箱加入候补名单，上线后简单三步即可买卖比特币",
    step1_t: "预约登记",
    step1_p: "留下你的邮箱或手机号，加入 LOTI 早期用户候补名单，上线第一时间通知你。",
    step2_t: "账户开通",
    step2_p: "平台上线后，凭预约信息 30 秒完成注册与实名认证，即可解锁全部功能。",
    step3_t: "开始交易",
    step3_p: "充值资金后，现货、合约、理财任你选择，随时随地在网页与 App 端下单交易。",
    start_cta: "加入候补名单，锁定早期用户权益",
    security_tag: "安全第一",
    security_title_1: "为你的资产", security_title_2: "构建铜墙铁壁",
    security_sub: "我们正以金融机构级标准构建安全体系，致力于让未来每一位用户的资产都得到妥善守护。",
    sec1_t: "冷热钱包分离架构", sec1_p: "规划 98% 资产存储于离线冷钱包，动用需多重签名授权。",
    sec2_t: "储备金证明（PoR）", sec2_p: "上线后每月由顶级审计机构以 Merkle Tree 验证，储备率公开透明。",
    sec3_t: "投资者保护基金规划", sec3_p: "规划设立 SAFU 级紧急安全基金，为极端情况下的用户资产提供保障。",
    sec4_t: "全链路风控系统", sec4_p: "设备管理、反钓鱼码、提现白名单与 AI 异常监测，正在研发测试中。",
    chip1: "冷钱包 98% 规划", chip2: "PoR 月度公开", chip3: "安全体系建设中",
    app_title: "随时随地，交易尽在掌握",
    app_sub: "LOTI App 正与网页端同步开发中。现在预约上线提醒，上线第一时间体验移动端交易：价格提醒、一键跟单、指纹登录，让盈利机会不再错过。",
    app_btn_small: "即将上线 · 预约通知", app_btn_small2: "即将上线 · 预约通知",
    app_btn_ios: "App Store 预约", app_btn_gp: "Google Play 预约",
    app_rate: "iOS / Android 双端同步开发中，预约用户将优先获得内测邀请",
    ph_balance: "总资产估值 (USDT)", ph_today: "+3.86% 今日",
    ph_nav_home: "首页", ph_nav_markets: "行情", ph_nav_buy: "买币",
    ph_nav_futures: "合约", ph_nav_assets: "资产",
    footer_about: "LOTI 乐提是一家初创数字资产交易平台，目前正处于筹备阶段。我们致力于为全球用户打造安全、专业、便捷的加密货币交易服务，平台即将上线，敬请期待。",
    fcol_product: "产品服务",
    f_spot: "现货交易", f_futures: "合约交易", f_earn: "理财赚币", f_copy: "跟单交易", f_app: "移动 App",
    fcol_about: "关于我们",
    f_company: "公司简介", f_careers: "加入我们", f_news: "新闻中心",
    f_compliance: "合规与安全", f_contact: "联系我们",
    fcol_support: "支持与帮助",
    f_guide: "新手指南", f_help: "帮助中心", f_fees: "费率说明", f_api: "API 文档", f_feedback: "意见反馈",
    fcol_legal: "合规服务",
    f_terms: "服务条款", f_privacy: "隐私政策", f_risk: "风险提示", f_por: "储备金证明", f_license: "牌照信息",
    footer_copy1: "© 2026 LOTI 乐提. 平台正在筹备中，暂未开放任何交易与注册服务，页面数据仅为界面演示。",
    footer_copy2: "加密资产交易存在较大价格波动风险，正式上线后请谨慎评估自身风险承受能力。",
  },
  en: {
    meta_title: "LOTI — Upcoming Digital Asset Trading Platform · Beta Waitlist",
    meta_desc: "LOTI is a digital asset trading platform now in preparation, soon to offer secure, professional spot and futures trading for Bitcoin, Ethereum and more. Beta signup is open.",
    announce_text: "LOTI is in preparation and expected to launch soon. Join the beta waitlist now for exclusive early-bird benefits.",
    announce_link: "Reserve now →",
    nav_markets: "Markets", nav_features: "Services", nav_guide: "Guide",
    nav_security: "Security", nav_app: "App", nav_about: "About",
    nav_contact: "Contact Us", nav_reserve: "Join Beta", mobile_reserve: "Join Beta Now",
    hero_badge: "Next-gen crypto exchange · Launching soon · Beta waitlist open",
    hero_title_1: "Ride the Trend", hero_title_2: "Lead Crypto Trading",
    hero_desc: "LOTI is a startup digital asset exchange gearing up for official launch. We will offer spot and futures trading for major cryptocurrencies such as Bitcoin and Ethereum, with bank-grade security architecture, top-tier liquidity depth and 24/7 multilingual support — for a safe, professional trading experience.",
    hero_cta_primary: "Reserve Early Access", hero_cta_secondary: "About LOTI",
    stat_security_t: "Security First", stat_security_d: "Hot/cold wallet separation · Proof of Reserves planned",
    stat_perf_t: "Blazing Performance", stat_perf_d: "Matching engine up to 1.4M orders/sec",
    stat_global_t: "Global Vision", stat_global_d: "Multilingual service · Compliance in progress",
    coin_btc: "Bitcoin", ticker_spot: "Spot", chart_aria: "BTC price chart",
    ticker_high: "24h High", ticker_low: "24h Low", ticker_vol: "24h Volume",
    ticker_cta: "Join Beta · Trade First at Launch",
    markets_title: "Popular Markets",
    markets_sub: "Track leading crypto prices in real time and seize every opportunity",
    markets_more: "View all markets →",
    th_coin: "Pair", th_price: "Last Price", th_change: "24h Change", th_high: "24h High", th_action: "Action",
    btn_reserve: "Reserve",
    features_title: "One-Stop Digital Asset Services",
    features_sub: "From spot to futures, from earn to payments — LOTI covers everything you need in the crypto world",
    f1_t: "Bank-Grade Security",
    f1_p: "Hot/cold wallet separation, multi-signature and an investor protection fund are on the roadmap. After launch, Proof of Reserves (PoR) will be published regularly so assets remain verifiable.",
    f2_t: "Deep Liquidity",
    f2_p: "Our matching engine has been tested at up to 1.4 million orders per second. At launch we will aggregate liquidity from top global market makers for ultra-low slippage and instant execution, even on large orders.",
    f3_t: "Competitive Fees",
    f3_p: "Spot trading fees as low as 0.1%, with extra discounts when paying with the platform token. Higher VIP tiers enjoy better rates, with zero maker fees on the roadmap.",
    f4_t: "24/7 Multilingual Support",
    f4_p: "Round-the-clock online support at launch, plus a beginner academy and copy-trading and grid-trading tools to help every user get started fast.",
    start_title: "Reserve Now, Trade First at Launch",
    start_sub: "The platform is launching soon. Leave your email to join the waitlist — buy and sell Bitcoin in three simple steps once we go live.",
    step1_t: "Sign Up",
    step1_p: "Leave your email or phone number to join the LOTI early-user waitlist and be notified the moment we launch.",
    step2_t: "Open Account",
    step2_p: "After launch, complete registration and identity verification in 30 seconds with your reservation details to unlock all features.",
    step3_t: "Start Trading",
    step3_p: "Fund your account and choose spot, futures or earn products — trade anytime on web and mobile.",
    start_cta: "Join the Waitlist & Lock In Early-Bird Benefits",
    security_tag: "Security First",
    security_title_1: "An Iron Wall", security_title_2: "Around Your Assets",
    security_sub: "We are building our security system to financial-institution standards, so every future user's assets are thoroughly protected.",
    sec1_t: "Hot/Cold Wallet Separation", sec1_p: "98% of assets are planned to be held in offline cold wallets, accessible only via multi-signature authorization.",
    sec2_t: "Proof of Reserves (PoR)", sec2_p: "After launch, monthly Merkle Tree verification by top-tier auditors will keep reserve ratios fully transparent.",
    sec3_t: "Investor Protection Fund", sec3_p: "A SAFU-grade emergency security fund is planned to protect user assets in extreme situations.",
    sec4_t: "End-to-End Risk Control", sec4_p: "Device management, anti-phishing codes, withdrawal whitelists and AI anomaly monitoring are in development and testing.",
    chip1: "98% Cold Storage Planned", chip2: "Monthly PoR Planned", chip3: "Security System Under Construction",
    app_title: "Trade Anywhere, Right in Your Pocket",
    app_sub: "The LOTI App is being built alongside the web platform. Reserve launch alerts now to experience mobile trading first: price alerts, one-tap copy trading and fingerprint login — never miss a profit opportunity.",
    app_btn_small: "Coming soon · Notify me", app_btn_small2: "Coming soon · Notify me",
    app_btn_ios: "Reserve on App Store", app_btn_gp: "Reserve on Google Play",
    app_rate: "iOS and Android in parallel development — waitlist users get priority beta invites",
    ph_balance: "Total Est. Assets (USDT)", ph_today: "+3.86% Today",
    ph_nav_home: "Home", ph_nav_markets: "Markets", ph_nav_buy: "Buy Crypto",
    ph_nav_futures: "Futures", ph_nav_assets: "Assets",
    footer_about: "LOTI is a startup digital asset exchange currently in the preparation stage. We are committed to building secure, professional and convenient cryptocurrency trading services for users worldwide. The platform is launching soon — stay tuned.",
    fcol_product: "Products",
    f_spot: "Spot Trading", f_futures: "Futures Trading", f_earn: "Earn", f_copy: "Copy Trading", f_app: "Mobile App",
    fcol_about: "About",
    f_company: "Company", f_careers: "Careers", f_news: "News",
    f_compliance: "Compliance & Security", f_contact: "Contact Us",
    fcol_support: "Support",
    f_guide: "Beginner Guide", f_help: "Help Center", f_fees: "Fee Schedule", f_api: "API Docs", f_feedback: "Feedback",
    fcol_legal: "Legal",
    f_terms: "Terms of Service", f_privacy: "Privacy Policy", f_risk: "Risk Warning", f_por: "Proof of Reserves", f_license: "Licenses",
    footer_copy1: "© 2026 LOTI. The platform is in preparation; no trading or registration services are available yet. Data shown is for UI demonstration only.",
    footer_copy2: "Crypto assets are subject to significant price volatility. After launch, please carefully assess your own risk tolerance.",
  },
};

// 语言优先级：localStorage 记忆 > 浏览器语言 > 中文
let currentLang = (function () {
  try {
    const saved = localStorage.getItem("lotix_lang");
    if (saved === "zh" || saved === "en") return saved;
  } catch (e) {}
  return (navigator.language || "zh").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
})();

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key] != null)
    ? I18N[currentLang][key]
    : (I18N.zh[key] != null ? I18N.zh[key] : key);
}

function applyLang() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t("meta_title");
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", t("meta_desc"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-label")));
  });
  // 切换按钮显示目标语言
  document.querySelectorAll(".lang-switch .lang-label").forEach((el) => {
    el.textContent = currentLang === "zh" ? "EN" : "中文";
  });
  // 动态内容重渲染
  renderMarket();
  try { localStorage.setItem("lotix_lang", currentLang); } catch (e) {}
}

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
          <span><strong>${c.sym}/USDT</strong><small>${currentLang === "en" ? c.nameEn : c.name}</small></span>
        </span>
      </span>
      <span class="col-price mk-price">${fmtPrice(c.price)}</span>
      <span class="col-change mk-change ${c.change >= 0 ? "up" : "down"}">
        ${c.change >= 0 ? "+" : ""}${c.change.toFixed(2)}%
      </span>
      <span class="col-high mk-high">${fmtPrice(c.high)}</span>
      <span class="col-action">
        <button class="btn btn-primary" type="button">${t("btn_reserve")}</button>
      </span>
    </div>`
  ).join("");
}

// ---------- 语言切换 ----------
document.querySelectorAll(".lang-switch").forEach((btn) =>
  btn.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    applyLang();
  })
);

// 初始化语言（会触发首次行情表格渲染）
applyLang();

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
