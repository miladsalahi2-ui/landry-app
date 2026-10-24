"use strict";
/* لندری من — نسخه مستقل آفلاین (داده روی خود دستگاه ذخیره می‌شود) */

// ---------- ثابت‌ها ----------
var STORAGE_KEY = "landry-data-v1";

var STATUSES = {
  PENDING:     { label: "در انتظار",      cls: "badge-pending" },
  IN_PROGRESS: { label: "در حال شستشو",   cls: "badge-progress" },
  READY:       { label: "آماده تحویل",    cls: "badge-ready" },
  DELIVERED:   { label: "تحویل شده",      cls: "badge-delivered" }
};
var STATUS_FLOW = ["PENDING", "IN_PROGRESS", "READY", "DELIVERED"];
var NEXT_STEP = { PENDING: { next: "IN_PROGRESS", label: "شروع کار" }, IN_PROGRESS: { next: "READY", label: "آماده شد" }, READY: { next: "DELIVERED", label: "تحویل شد" }, DELIVERED: null };
var SERVICES = { WASH: "شستشو", DRY_CLEAN: "خشکشویی", IRON: "اتو", WASH_IRON: "شستشو + اتو", OTHER: "سایر" };
var REPEATS = { NONE: "یک‌باره", DAILY: "هر روز", WEEKLY: "هفتگی" };
var WEEKDAYS = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

var ICONS = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  wash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><circle cx="12" cy="13" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
  alarm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
};

// ---------- ابزار ----------
function $(id) { return document.getElementById(id); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

function faNum(n) { try { return new Intl.NumberFormat("fa-IR").format(n); } catch (e) { return String(n); } }
function dayKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function persianWeekday(d) { return (d.getDay() + 1) % 7; }
function isSameDay(a, b) { return dayKey(a) === dayKey(b); }
function formatJalaliFull(d) { try { return new Intl.DateTimeFormat("fa-IR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(d); } catch (e) { return d.toLocaleDateString("fa-IR"); } }
function formatJalaliShort(d) { try { return new Intl.DateTimeFormat("fa-IR", { month: "long", day: "numeric" }).format(d); } catch (e) { return d.toLocaleDateString("fa-IR"); } }
function formatTime(d) { try { return new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(d); } catch (e) { return d.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }); } }
function formatPrice(n) { return faNum(n) + " تومان"; }

function dueLabel(dueDate, now) {
  var diffMin = Math.round((dueDate.getTime() - now.getTime()) / 60000);
  var abs = Math.abs(diffMin);
  if (abs < 1) return "همین حالا";
  if (abs < 60) return diffMin > 0 ? faNum(abs) + " دقیقه مانده" : faNum(abs) + " دقیقه تأخیر";
  var h = Math.floor(abs / 60), m = abs % 60;
  var s = m > 0 ? faNum(h) + " ساعت و " + faNum(m) + " دقیقه" : faNum(h) + " ساعت";
  return diffMin > 0 ? s + " مانده" : s + " تأخیر";
}
function isOrderOverdue(o, now) { return o.status !== "DELIVERED" && new Date(o.dueDate).getTime() < now.getTime(); }
function isOrderDueToday(o, now) { return o.status !== "DELIVERED" && isSameDay(new Date(o.dueDate), now); }
function isTaskScheduledToday(t, now) {
  if (t.repeat === "DAILY") return true;
  if (t.repeat === "WEEKLY") return t.weekday === persianWeekday(now);
  if (t.dueDate) return dayKey(new Date(t.dueDate)) <= dayKey(now);
  return false;
}
function isTaskDoneToday(t, now) {
  if (t.repeat === "NONE") return !!t.done;
  return t.lastCompletedOn === dayKey(now);
}
function tasksForToday(tasks, now) {
  return tasks.filter(function (t) { return isTaskScheduledToday(t, now); }).sort(function (a, b) {
    var da = isTaskDoneToday(a, now) ? 1 : 0, db = isTaskDoneToday(b, now) ? 1 : 0;
    if (da !== db) return da - db;
    return (a.time || "99:99").localeCompare(b.time || "99:99");
  });
}

// ---------- وضعیت و ذخیره‌سازی ----------
function seedState() {
  var now = new Date();
  function at(dayOffset, h) { var d = new Date(); d.setDate(d.getDate() + dayOffset); d.setHours(h, 0, 0, 0); return d.toISOString(); }
  var todayKey = dayKey(now);
  return {
    seeded: true,
    orders: [
      { id: uid(), customerName: "خانم احمدی", phone: "09121234567", items: "۴ عدد پیراهن مردانه، ۲ عدد شلوار پارچه‌ای", serviceType: "WASH_IRON", quantity: 6, price: 480000, dueDate: at(0, 18), status: "IN_PROGRESS", notes: "پیراهن سفید جدا شسته شود", createdAt: new Date().toISOString() },
      { id: uid(), customerName: "آقای رضایی", phone: "09359876543", items: "۱ کت و شلوار کامل", serviceType: "DRY_CLEAN", quantity: 2, price: 350000, dueDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), status: "PENDING", notes: "لکه جوهر روی جلیقه — بررسی شود", createdAt: new Date().toISOString() },
      { id: uid(), customerName: "آقای موسوی", phone: "09123334455", items: "۳ عدد پالتو و بارانی", serviceType: "DRY_CLEAN", quantity: 3, price: 690000, dueDate: at(1, 12), status: "READY", notes: "مشتری خبر کند آماده است", createdAt: new Date().toISOString() }
    ],
    tasks: [
      { id: uid(), title: "چک کردن بخارپز و پر کردن مخزن آب", note: "قبل از شروع کار صبح", time: "09:00", repeat: "DAILY", weekday: null, dueDate: null, done: false, lastCompletedOn: null, createdAt: new Date().toISOString() },
      { id: uid(), title: "تماس با مشتری‌های «آماده تحویل»", note: "از فهرست سفارش‌ها چک کن", time: "17:00", repeat: "DAILY", weekday: null, dueDate: null, done: false, lastCompletedOn: null, createdAt: new Date().toISOString() },
      { id: uid(), title: "خرید مواد شوینده و نرم‌کننده", note: "فاکتور یادت نره", time: "11:00", repeat: "WEEKLY", weekday: 0, dueDate: null, done: false, lastCompletedOn: null, createdAt: new Date().toISOString() },
      { id: uid(), title: "جارو کردن سالن لندری", note: null, time: "20:00", repeat: "DAILY", weekday: null, dueDate: null, done: false, lastCompletedOn: todayKey, createdAt: new Date().toISOString() }
    ]
  };
}
function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { var s = JSON.parse(raw); return { seeded: true, orders: s.orders || [], tasks: s.tasks || [] }; }
  } catch (e) {}
  return null;
}
var state = loadState() || seedState();
function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { toast("خطا در ذخیره‌سازی داده"); } }

// ---------- وضعیت رابط ----------
var now = new Date();
var activeTab = "today";
var search = "";
var statusFilter = "ALL";

// ---------- توست ----------
function toast(msg) {
  var root = $("toast-root");
  var el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(function () {
    el.classList.add("out");
    setTimeout(function () { el.remove(); }, 260);
  }, 2400);
}

// ---------- مودال ----------
var modalRoot = $("modal-root"), modalCard = $("modal-card");
function openModal(html) {
  modalCard.innerHTML = '<button class="modal-close" data-close="1" aria-label="بستن">' + ICONS.x + "</button>" + html;
  modalRoot.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modalRoot.classList.add("hidden");
  modalCard.innerHTML = "";
  document.body.style.overflow = "";
}
modalRoot.addEventListener("click", function (e) { if (e.target.getAttribute("data-close")) closeModal(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modalRoot.classList.contains("hidden")) closeModal(); });

// ---------- رندر ----------
function render() {
  $("header-date").textContent = formatJalaliFull(now);
  renderStats();
  renderBannerAndBell();
  renderTabPanels();
}

function renderStats() {
  var overdue = state.orders.filter(function (o) { return isOrderOverdue(o, now); }).length;
  var todayCount = state.orders.filter(function (o) { return isOrderDueToday(o, now); }).length;
  var inProgress = state.orders.filter(function (o) { return o.status === "IN_PROGRESS"; }).length;
  var ready = state.orders.filter(function (o) { return o.status === "READY"; }).length;
  var stats = [
    { label: "موعد امروز", value: todayCount, cls: "stat-amber", icon: ICONS.clock },
    { label: "عقب‌افتاده", value: overdue, cls: "stat-rose", icon: ICONS.bell },
    { label: "در حال شستشو", value: inProgress, cls: "stat-teal", icon: ICONS.wash },
    { label: "آماده تحویل", value: ready, cls: "stat-emerald", icon: ICONS.check }
  ];
  $("stats").innerHTML = stats.map(function (s) {
    return '<div class="stat-card ' + s.cls + '"><div class="stat-top">' + s.icon + '<span class="stat-value">' + faNum(s.value) + "</span></div>" + '<span class="stat-label">' + s.label + "</span></div>";
  }).join("");
}

function renderBannerAndBell() {
  var overdue = state.orders.filter(function (o) { return isOrderOverdue(o, now); });
  var banner = $("overdue-banner");
  if (overdue.length > 0) {
    banner.classList.remove("hidden");
    banner.innerHTML = "<strong>" + faNum(overdue.length) + " سفارش از موعد تحویل گذشته است!</strong><span>برای مشاهده و پیگیری کلیک کنید</span>";
  } else { banner.classList.add("hidden"); }

  var todayTasks = tasksForToday(state.tasks, now).filter(function (t) { return !isTaskDoneToday(t, now); }).length;
  var count = overdue.length + todayTasks;
  var bell = $("bell-badge"), tabBadge = $("tab-badge");
  if (count > 0) {
    bell.textContent = faNum(count); bell.classList.remove("hidden");
    tabBadge.textContent = faNum(count); tabBadge.classList.remove("hidden");
  } else { bell.classList.add("hidden"); tabBadge.classList.add("hidden"); }
}

function orderCardHTML(o) {
  var st = STATUSES[o.status] || STATUSES.PENDING;
  var overdue = isOrderOverdue(o, now);
  var dueToday = isOrderDueToday(o, now);
  var due = new Date(o.dueDate);
  var next = NEXT_STEP[o.status];
  var badges = '<span class="badge ' + st.cls + '">' + st.label + "</span>";
  if (overdue) badges += '<span class="badge badge-overdue">عقب‌افتاده</span>';
  else if (dueToday) badges += '<span class="badge badge-duetoday">موعد امروز</span>';
  var dueCls = overdue ? "overdue" : dueToday ? "due-today" : "";
  return '<div class="order-card' + (overdue ? " overdue" : dueToday ? " due-today" : "") + (o.status === "DELIVERED" ? " delivered" : "") + '" data-id="' + o.id + '">' +
    '<div class="order-head"><div style="min-width:0"><div class="badges"><span class="order-name">' + esc(o.customerName) + "</span>" + badges + "</div>" +
    '<p class="order-items">' + esc(o.items) + "</p>" +
    (o.notes ? '<p class="order-note">📝 ' + esc(o.notes) + "</p>" : "") + "</div>" +
    '<button class="task-menu-btn" data-action="order-menu" aria-label="گزینه‌های سفارش">' + ICONS.dots + "</button></div>" +
    '<div class="order-meta"><span class="badge badge-soft">' + (SERVICES[o.serviceType] || "سایر") + "</span><span>" + faNum(o.quantity) + " قلم</span>" +
    (o.price > 0 ? '<span class="order-price">' + formatPrice(o.price) + "</span>" : "") + "</div>" +
    '<div class="order-foot"><span class="order-due ' + dueCls + '">' + ICONS.clock + "<span>" + formatJalaliShort(due) + " — ساعت " + formatTime(due) + " (" + dueLabel(due, now) + ")</span></span>" +
    '<div class="order-actions">' + (o.phone ? '<a class="btn btn-outline btn-sm" href="tel:' + esc(o.phone) + '">' + ICONS.phone + "تماس</a>" : "") +
    (next ? '<button class="btn btn-primary btn-sm" data-action="order-next">' + next.label + "</button>" : "") + "</div></div></div>";
}

function taskCardHTML(t, opts) {
  opts = opts || {};
  var done = isTaskDoneToday(t, now);
  var overdue = !done && t.repeat === "NONE" && t.dueDate && new Date(t.dueDate) < now;
  var meta = "";
  if (t.time) meta += '<span style="display:inline-flex;align-items:center;gap:3px">' + ICONS.alarm + faNum(t.time) + "</span>";
  var rep = t.repeat === "WEEKLY" ? "هر " + (WEEKDAYS[t.weekday] || "") : REPEATS[t.repeat];
  meta += '<span class="badge badge-soft">' + (t.repeat === "WEEKLY" ? ICONS.repeat : "") + rep + "</span>";
  if (t.repeat === "NONE" && t.dueDate && opts.showDue) meta += "<span>" + formatJalaliShort(new Date(t.dueDate)) + "</span>";
  if (t.note) meta += "<span>" + esc(t.note) + "</span>";
  return '<div class="task-card' + (done ? " done" : "") + (overdue ? " overdue" : "") + '" data-id="' + t.id + '">' +
    '<button class="task-check' + (done ? " checked" : "") + '" data-action="task-toggle" role="checkbox" aria-checked="' + done + '" aria-label="انجام شد">' + ICONS.check + "</button>" +
    '<div class="task-body"><p class="task-title">' + esc(t.title) + "</p>" +
    (meta ? '<div class="task-meta">' + meta + "</div>" : "") +
    (overdue ? '<p class="task-overdue-note">این کار از موعدش گذشته و هنوز انجام نشده است</p>' : "") + "</div>" +
    '<button class="task-menu-btn" data-action="task-menu" aria-label="گزینه‌های یادآوری">' + ICONS.dots + "</button></div>";
}

function emptyState(icon, title, desc, btnAction, btnLabel) {
  return '<div class="empty">' + icon + "<strong>" + title + "</strong><p>" + desc + "</p>" +
    (btnAction ? '<button class="btn btn-outline btn-sm" data-action="' + btnAction + '">' + ICONS.plus + btnLabel + "</button>" : "") + "</div>";
}

function renderTabPanels() {
  // --- امروز ---
  var todayOrders = state.orders.filter(function (o) { return isOrderDueToday(o, now) || isOrderOverdue(o, now); });
  var sorted = todayOrders.slice().sort(function (a, b) { return (isOrderOverdue(b, now) ? 1 : 0) - (isOrderOverdue(a, now) ? 1 : 0) || new Date(a.dueDate) - new Date(b.dueDate); });
  var todayTasks = tasksForToday(state.tasks, now);
  var html = '<h2 class="section-title">' + ICONS.clock + "سفارش‌های نیازمند پیگیری امروز</h2>";
  html += sorted.length === 0
    ? emptyState(ICONS.wash, "امروز سفارش فوری نداریم", "همه سفارش‌ها سر موعدشان هستند. آفرین!", "open-order-modal", "ثبت سفارش جدید")
    : '<div class="stack">' + sorted.map(orderCardHTML).join("") + "</div>";
  html += '<h2 class="section-title" style="margin-top:22px">' + ICONS.calendar + "کارهای امروز</h2>";
  html += todayTasks.length === 0
    ? emptyState(ICONS.calendar, "یادآوری‌ای برای امروز ثبت نشده", "کارهای تکراری روزانه و هفتگی اینجا نمایش داده می‌شوند.", "open-task-modal", "افزودن یادآوری")
    : '<div class="stack">' + todayTasks.map(function (t) { return taskCardHTML(t, {}); }).join("") + "</div>";
  $("tab-today").innerHTML = html;

  // --- سفارش‌ها ---
  var chips = ['<button class="chip' + (statusFilter === "ALL" ? " active" : "") + '" data-filter="ALL">همه</button>'];
  STATUS_FLOW.forEach(function (s) {
    chips.push('<button class="chip' + (statusFilter === s ? " active" : "") + '" data-filter="' + s + '">' + STATUSES[s].label + "</button>");
  });
  $("status-chips").innerHTML = chips.join("");

  var list = state.orders.slice();
  if (statusFilter !== "ALL") list = list.filter(function (o) { return o.status === statusFilter; });
  var q = search.trim().toLowerCase();
  if (q) list = list.filter(function (o) { return (o.customerName + " " + o.items + " " + (o.phone || "")).toLowerCase().indexOf(q) !== -1; });
  var active = list.filter(function (o) { return o.status !== "DELIVERED"; }).sort(function (a, b) { return new Date(a.dueDate) - new Date(b.dueDate); });
  var delivered = list.filter(function (o) { return o.status === "DELIVERED"; }).sort(function (a, b) { return new Date(b.dueDate) - new Date(a.dueDate); });
  var all = active.concat(delivered);
  $("orders-list").innerHTML = all.length === 0
    ? emptyState(ICONS.clipboard, search || statusFilter !== "ALL" ? "سفارشی یافت نشد" : "هنوز سفارشی ثبت نشده", search || statusFilter !== "ALL" ? "عبارت جستجو یا فیلتر را تغییر بدهید." : "اولین سفارش لندری را ثبت کنید.", "open-order-modal", "سفارش جدید")
    : all.map(orderCardHTML).join("");

  // --- یادآوری‌ها ---
  var repeated = state.tasks.filter(function (t) { return t.repeat !== "NONE"; }).sort(function (a, b) { return (a.time || "99:99").localeCompare(b.time || "99:99"); });
  var oneTime = state.tasks.filter(function (t) { return t.repeat === "NONE"; }).sort(function (a, b) { return new Date(a.dueDate || 0) - new Date(b.dueDate || 0); });
  var rHtml = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><h2 class="section-title" style="margin:0">کارهای تکرارشونده</h2><button class="btn btn-outline btn-sm" data-action="open-task-modal">' + ICONS.plus + "یادآوری</button></div>";
  rHtml += repeated.length === 0
    ? emptyState(ICONS.repeat, "یادآوری تکرارشونده‌ای ندارید", "مثل «بخارپز رو هر روز ساعت ۹ چک کن».", "open-task-modal", "افزودن یادآوری")
    : '<div class="stack">' + repeated.map(function (t) { return taskCardHTML(t, {}); }).join("") + "</div>";
  rHtml += '<h2 class="section-title" style="margin-top:22px">کارهای یک‌باره</h2>';
  rHtml += oneTime.length === 0
    ? emptyState(ICONS.clipboard, "کار یک‌باره‌ای ثبت نشده", "مثل «خرید مواد شوینده در روز شنبه».", "open-task-modal", "افزودن یادآوری")
    : '<div class="stack">' + oneTime.map(function (t) { return taskCardHTML(t, { showDue: true }); }).join("") + "</div>";
  $("tab-reminders").innerHTML = rHtml;
}

// ---------- عملیات سفارش ----------
function saveOrderFromForm(editing) {
  var name = $("f-name").value.trim();
  var items = $("f-items").value.trim();
  var due = $("f-due").value;
  if (!name || !items || !due) { toast("نام، شرح سفارش و موعد تحویل الزامی است"); return false; }
  var data = {
    customerName: name, phone: $("f-phone").value.trim() || null, items: items,
    serviceType: $("f-service").value, quantity: Math.max(1, parseInt($("f-qty").value, 10) || 1),
    price: Math.max(0, parseInt($("f-price").value, 10) || 0),
    dueDate: new Date(due).toISOString(), notes: $("f-notes").value.trim() || null
  };
  if (editing) { Object.assign(findOrder(editing.id), data); toast("سفارش ویرایش شد"); }
  else { data.id = uid(); data.status = "PENDING"; data.createdAt = new Date().toISOString(); state.orders.push(data); toast("سفارش ثبت شد — یادآوری تحویل فعال شد"); }
  saveState(); render(); return true;
}
function findOrder(id) { return state.orders.filter(function (o) { return o.id === id; })[0]; }
function findTask(id) { return state.tasks.filter(function (t) { return t.id === id; })[0]; }

function changeStatus(o, status) {
  o.status = status; saveState(); render();
  toast("وضعیت سفارش: «" + STATUSES[status].label + "»");
  closeModal();
}

// ---------- عملیات یادآوری ----------
function toggleTask(t) {
  if (t.repeat === "NONE") { t.done = !t.done; if (t.done) toast("آفرین! کار انجام شد."); }
  else {
    var key = dayKey(now);
    if (t.lastCompletedOn === key) { t.lastCompletedOn = null; }
    else { t.lastCompletedOn = key; toast("آفرین! کار انجام شد."); }
  }
  saveState(); render();
}
function saveTaskFromForm(editing) {
  var title = $("f-title").value.trim();
  if (!title) { toast("عنوان یادآوری الزامی است"); return false; }
  var repeat = $("f-repeat").value;
  var data = { title: title, note: $("f-note").value.trim() || null, time: $("f-time").value || null, repeat: repeat, weekday: null, dueDate: null };
  if (repeat === "WEEKLY") data.weekday = parseInt($("f-weekday").value, 10);
  if (repeat === "NONE") {
    var off = parseInt(state._dueDay || "0", 10);
    var d = new Date(); d.setDate(d.getDate() + off); d.setHours(9, 0, 0, 0);
    data.dueDate = d.toISOString();
  }
  if (editing) { Object.assign(findTask(editing.id), data); toast("یادآوری ویرایش شد"); }
  else { data.id = uid(); data.done = false; data.lastCompletedOn = null; data.createdAt = new Date().toISOString(); state.tasks.push(data); toast("یادآوری ثبت شد"); }
  saveState(); render(); return true;
}

// ---------- مودال‌ها ----------
function openOrderModal(o) {
  var isEdit = !!o;
  o = o || { customerName: "", phone: "", items: "", serviceType: "WASH", quantity: 1, price: "", dueDate: "", notes: "" };
  function toInput(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") + "T" + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  var quick = [
    { label: "امروز ۱۸:۰۰", fn: function () { var d = new Date(); d.setHours(18, 0, 0, 0); return d; } },
    { label: "امروز ۲۱:۰۰", fn: function () { var d = new Date(); d.setHours(21, 0, 0, 0); return d; } },
    { label: "فردا ۱۰:۰۰", fn: function () { var d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; } },
    { label: "فردا ۱۸:۰۰", fn: function () { var d = new Date(); d.setDate(d.getDate() + 1); d.setHours(18, 0, 0, 0); return d; } },
    { label: "۲ روز بعد", fn: function () { var d = new Date(); d.setDate(d.getDate() + 2); d.setHours(10, 0, 0, 0); return d; } },
    { label: "۳ روز بعد", fn: function () { var d = new Date(); d.setDate(d.getDate() + 3); d.setHours(10, 0, 0, 0); return d; } }
  ];
  var serviceOpts = Object.keys(SERVICES).map(function (k) { return '<option value="' + k + '"' + (o.serviceType === k ? " selected" : "") + ">" + SERVICES[k] + "</option>"; }).join("");
  openModal(
    '<h2 class="modal-title">' + (isEdit ? "ویرایش سفارش" : "ثبت سفارش جدید") + "</h2>" +
    '<p class="modal-desc">اطلاعات مشتری و موعد تحویل را وارد کنید تا در زمان مقرر یادآوری شود.</p>' +
    '<div class="form-grid">' +
    '<div class="form-row"><div class="field"><label>نام مشتری <span class="req">*</span></label><input id="f-name" placeholder="مثلاً: خانم احمدی" value="' + esc(o.customerName) + '"></div>' +
    '<div class="field"><label>شماره تماس</label><input id="f-phone" inputmode="tel" placeholder="09123456789" value="' + esc(o.phone || "") + '"></div></div>' +
    '<div class="field"><label>شرح سفارش <span class="req">*</span></label><textarea id="f-items" rows="2" placeholder="مثلاً: ۳ عدد پیراهن مردانه، ۱ کت">' + esc(o.items) + "</textarea></div>" +
    '<div class="form-row triple"><div class="field"><label>نوع سرویس</label><select id="f-service">' + serviceOpts + "</select></div>" +
    '<div class="field"><label>تعداد</label><input id="f-qty" inputmode="numeric" value="' + (o.quantity || 1) + '"></div>' +
    '<div class="field"><label>قیمت (تومان)</label><input id="f-price" inputmode="numeric" value="' + (o.price || "") + '"><div class="field-hint" id="price-hint"></div></div></div>' +
    '<div class="field"><label>موعد تحویل <span class="req">*</span></label><div class="quick-row" id="quick-dates">' +
    quick.map(function (q, i) { return '<button type="button" class="quick-chip" data-qi="' + i + '">' + q.label + "</button>"; }).join("") +
    '</div><input id="f-due" type="datetime-local" value="' + (o.dueDate ? toInput(new Date(o.dueDate)) : "") + '"></div>' +
    '<div class="field"><label>یادداشت (اختیاری)</label><input id="f-notes" placeholder="مثلاً: لکه روی آستین — مراقبت شود" value="' + esc(o.notes || "") + '"></div>' +
    "</div>" +
    '<div class="modal-footer"><button class="btn btn-outline" data-close="1">انصراف</button><button class="btn btn-primary" id="f-save">' + (isEdit ? "ذخیره تغییرات" : "ثبت سفارش") + "</button></div>"
  );
  var quickFns = quick.map(function (q) { return q.fn; });
  modalCard.querySelector("#quick-dates").addEventListener("click", function (e) {
    var b = e.target.closest("[data-qi]");
    if (b) { $("f-due").value = toInput(quickFns[parseInt(b.getAttribute("data-qi"), 10)]()); }
  });
  $("f-price").addEventListener("input", function () {
    var v = parseInt(this.value, 10) || 0;
    $("price-hint").textContent = v > 0 ? formatPrice(v) : "";
  });
  $("f-save").addEventListener("click", function () { if (saveOrderFromForm(isEdit ? o : null)) closeModal(); });
}

function openTaskModal(t) {
  var isEdit = !!t;
  t = t || { title: "", note: "", time: "", repeat: "NONE", weekday: 0 };
  var repeatOpts = Object.keys(REPEATS).map(function (k) { return '<option value="' + k + '"' + (t.repeat === k ? " selected" : "") + ">" + REPEATS[k] + "</option>"; }).join("");
  var weekdayOpts = WEEKDAYS.map(function (d, i) { return '<option value="' + i + '"' + ((t.weekday || 0) === i ? " selected" : "") + ">" + d + "</option>"; }).join("");
  var dueDays = [
    { v: 0, label: "امروز" }, { v: 1, label: "فردا" }, { v: 2, label: "پس‌فردا" }
  ];
  state._dueDay = "0";
  openModal(
    '<h2 class="modal-title">' + (isEdit ? "ویرایش یادآوری" : "یادآوری جدید") + "</h2>" +
    '<p class="modal-desc">کار روزانه‌ات را ثبت کن تا هر روز سر ساعت به تو یادآوری شود.</p>' +
    '<div class="form-grid">' +
    '<div class="field"><label>عنوان <span class="req">*</span></label><input id="f-title" placeholder="مثلاً: تماس با مشتری‌های آماده تحویل" value="' + esc(t.title) + '"></div>' +
    '<div class="field"><label>توضیح (اختیاری)</label><textarea id="f-note" rows="2" placeholder="مثلاً: قبل از ساعت ۱۲ تماس بگیر">' + esc(t.note || "") + "</textarea></div>" +
    '<div class="form-row"><div class="field"><label>تکرار</label><select id="f-repeat">' + repeatOpts + "</select></div>" +
    '<div class="field"><label>ساعت یادآوری</label><input id="f-time" type="time" value="' + esc(t.time || "") + '"></div></div>' +
    '<div class="field" id="weekday-block" style="display:none"><label>روز هفته</label><select id="f-weekday">' + weekdayOpts + "</select></div>" +
    '<div class="field" id="dueday-block"><label>روز انجام</label><div class="quick-row" id="due-days">' +
    dueDays.map(function (d) { return '<button type="button" class="quick-chip' + (d.v === 0 ? " selected" : "") + '" data-dv="' + d.v + '">' + d.label + " (" + formatJalaliShort(function () { var x = new Date(); x.setDate(x.getDate() + d.v); return x; }()) + ")</button>"; }).join("") +
    "</div></div>" +
    '<div class="info-note" id="daily-note" style="display:none">این یادآوری هر روز در فهرست «کارهای امروز» ظاهر می‌شود.</div>' +
    "</div>" +
    '<div class="modal-footer"><button class="btn btn-outline" data-close="1">انصراف</button><button class="btn btn-primary" id="f-save-t">' + (isEdit ? "ذخیره تغییرات" : "افزودن یادآوری") + "</button></div>"
  );
  function syncRepeat() {
    var r = $("f-repeat").value;
    $("weekday-block").style.display = r === "WEEKLY" ? "" : "none";
    $("dueday-block").style.display = r === "NONE" ? "" : "none";
    $("daily-note").style.display = r === "DAILY" ? "" : "none";
  }
  $("f-repeat").addEventListener("change", syncRepeat);
  syncRepeat();
  modalCard.querySelector("#due-days").addEventListener("click", function (e) {
    var b = e.target.closest("[data-dv]");
    if (!b) return;
    modalCard.querySelectorAll("#due-days .quick-chip").forEach(function (c) { c.classList.remove("selected"); });
    b.classList.add("selected");
    state._dueDay = b.getAttribute("data-dv");
  });
  $("f-save-t").addEventListener("click", function () { if (saveTaskFromForm(isEdit ? t : null)) closeModal(); });
}

function openOrderMenu(o) {
  var items = ['<button class="modal-action" data-mact="edit">' + ICONS.pencil + "ویرایش</button>"];
  STATUS_FLOW.filter(function (s) { return s !== o.status; }).forEach(function (s) {
    items.push('<button class="modal-action" data-mact="status" data-val="' + s + '"><span class="badge ' + STATUSES[s].cls + '">' + STATUSES[s].label + "</span>تغییر وضعیت به این</button>");
  });
  items.push('<button class="modal-action danger" data-mact="delete">' + ICONS.trash + "حذف سفارش</button>");
  openModal('<h2 class="modal-title">' + esc(o.customerName) + "</h2>" + '<p class="modal-desc">مدیریت سفارش</p><div class="modal-actions">' + items.join("") + "</div>");
  modalCard.querySelectorAll("[data-mact]").forEach(function (b) {
    b.addEventListener("click", function () {
      var act = b.getAttribute("data-mact");
      if (act === "edit") { openOrderModal(o); }
      else if (act === "status") { changeStatus(o, b.getAttribute("data-val")); }
      else if (act === "delete") { openDeleteConfirm("order", o); }
    });
  });
}

function openTaskMenu(t) {
  openModal(
    '<h2 class="modal-title">' + esc(t.title) + "</h2>" +
    '<p class="modal-desc">مدیریت یادآوری</p><div class="modal-actions">' +
    '<button class="modal-action" data-mact="edit">' + ICONS.pencil + "ویرایش</button>" +
    '<button class="modal-action danger" data-mact="delete">' + ICONS.trash + "حذف</button></div>"
  );
  modalCard.querySelectorAll("[data-mact]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-mact") === "edit") openTaskModal(t);
      else openDeleteConfirm("task", t);
    });
  });
}

function openDeleteConfirm(kind, item) {
  var text = kind === "order"
    ? 'سفارش «' + esc(item.customerName) + "» برای همیشه حذف می‌شود. مطمئن هستید؟"
    : 'یادآوری «' + esc(item.title) + "» حذف می‌شود. مطمئن هستید؟";
  openModal(
    '<div class="confirm-box"><div class="confirm-icon">' + ICONS.trash + "</div>" +
    '<h2 class="modal-title">تأیید حذف</h2><p class="modal-desc" style="margin-top:8px">' + text + "</p>" +
    '<div class="modal-footer"><button class="btn btn-outline" data-close="1">انصراف</button><button class="btn btn-rose" id="confirm-del">بله، حذف کن</button></div></div>'
  );
  $("confirm-del").addEventListener("click", function () {
    if (kind === "order") state.orders = state.orders.filter(function (x) { return x.id !== item.id; });
    else state.tasks = state.tasks.filter(function (x) { return x.id !== item.id; });
    saveState(); render(); closeModal(); toast(kind === "order" ? "سفارش حذف شد" : "یادآوری حذف شد");
  });
}

function openBackupModal() {
  var json = JSON.stringify({ orders: state.orders, tasks: state.tasks }, null, 2);
  openModal(
    '<h2 class="modal-title">پشتیبان‌گیری و بازیابی</h2>' +
    '<p class="modal-desc">داده‌های شما فقط روی همین دستگاه ذخیره می‌شود. برای انتقال به گوشی دیگر، متن پشتیبان را کپی و در دستگاه مقصد وارد کنید.</p>' +
    '<h3 class="backup-section-title">۱. خروجی گرفتن</h3>' +
    '<textarea class="backup-area" id="backup-out" readonly>' + esc(json) + "</textarea>" +
    '<div class="modal-footer" style="margin-top:10px"><button class="btn btn-outline" id="backup-copy">کپی متن</button><button class="btn btn-outline" id="backup-download">دانلود فایل</button></div>' +
    '<h3 class="backup-section-title">۲. بازیابی (متن پشتیبان را اینجا بچسبانید)</h3>' +
    '<textarea class="backup-area" id="backup-in" placeholder=\'{"orders":[...],"tasks":[...]}\'></textarea>' +
    '<div class="modal-footer" style="margin-top:10px"><button class="btn btn-outline" data-close="1">بستن</button><button class="btn btn-primary" id="backup-import">بازیابی داده‌ها</button></div>'
  );
  $("backup-copy").addEventListener("click", function () {
    var ta = $("backup-out");
    ta.select();
    try { document.execCommand("copy"); toast("متن پشتیبان کپی شد"); }
    catch (e) { if (navigator.clipboard) { navigator.clipboard.writeText(ta.value).then(function () { toast("متن پشتیبان کپی شد"); }); } }
  });
  $("backup-download").addEventListener("click", function () {
    try {
      var blob = new Blob([json], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "landry-backup-" + dayKey(new Date()) + ".json";
      document.body.appendChild(a); a.click(); a.remove();
      toast("فایل پشتیبان دانلود شد");
    } catch (e) { toast("در این محیط از «کپی متن» استفاده کنید"); }
  });
  $("backup-import").addEventListener("click", function () {
    try {
      var parsed = JSON.parse($("backup-in").value);
      if (!Array.isArray(parsed.orders) || !Array.isArray(parsed.tasks)) throw new Error("bad");
      state.orders = parsed.orders; state.tasks = parsed.tasks;
      saveState(); render(); closeModal();
      toast("بازیابی انجام شد — " + faNum(state.orders.length) + " سفارش و " + faNum(state.tasks.length) + " یادآوری");
    } catch (e) { toast("متن پشتیبان نامعتبر است"); }
  });
}

// ---------- رویدادها ----------
document.addEventListener("click", function (e) {
  var actionEl = e.target.closest("[data-action]");
  var card = e.target.closest("[data-id]");
  var id = card ? card.getAttribute("data-id") : null;

  if (actionEl) {
    var act = actionEl.getAttribute("data-action");
    if (act === "open-order-modal") { openOrderModal(null); return; }
    if (act === "open-task-modal") { openTaskModal(null); return; }
    if (act === "order-menu" && id) { openOrderMenu(findOrder(id)); return; }
    if (act === "task-menu" && id) { openTaskMenu(findTask(id)); return; }
    if (act === "order-next" && id) { var o = findOrder(id); if (o && NEXT_STEP[o.status]) changeStatus(o, NEXT_STEP[o.status].next); return; }
    if (act === "task-toggle" && id) { toggleTask(findTask(id)); return; }
  }
  var chip = e.target.closest("[data-filter]");
  if (chip) { statusFilter = chip.getAttribute("data-filter"); render(); return; }
  var tab = e.target.closest("[data-tab]");
  if (tab) {
    activeTab = tab.getAttribute("data-tab");
    document.querySelectorAll("#tabs .tab").forEach(function (t) {
      var on = t.getAttribute("data-tab") === activeTab;
      t.classList.toggle("active", on); t.setAttribute("aria-selected", on);
    });
    document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.remove("active"); });
    $("tab-" + activeTab).classList.add("active");
    $("fab").classList.toggle("hidden", activeTab === "orders");
    return;
  }
});

$("btn-new-order").addEventListener("click", function () { openOrderModal(null); });
$("btn-new-order-2").addEventListener("click", function () { openOrderModal(null); });
$("btn-backup").addEventListener("click", openBackupModal);
$("btn-bell").addEventListener("click", function () {
  document.querySelector('[data-tab="today"]').click();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("overdue-banner").addEventListener("click", function () {
  document.querySelector('[data-tab="today"]').click();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("fab").addEventListener("click", function () {
  if (activeTab === "reminders") openTaskModal(null); else openOrderModal(null);
});
$("search-input").addEventListener("input", function () { search = this.value; renderTabPanels(); });

// ---------- تایمر و شروع ----------
setInterval(function () { now = new Date(); render(); }, 30000);
document.addEventListener("visibilitychange", function () { if (!document.hidden) { now = new Date(); render(); } });
if (!loadState()) { saveState(); }
render();
