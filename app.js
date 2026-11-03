/* FRED Café & Kiosko — demo v2.
   Un único pedido con dos tipos de línea:
   · RESERVA (Novedades): te lo guardamos 48 h, pagas al recoger.
   · COMPRA (Tienda): recoger en Fred o envío, pago de prueba.
   Todo suma en la barra "café gratis": a 20 € el café va por Fred.
   En la versión final, Novedades y catálogo vendrán de Square. */
(function () {
  "use strict";

  /* ---------------- datos de demo (precios orientativos, fotos de ejemplo) ---------------- */
  var FREE_AT = 20;
  var HOLD_HOURS = 48;
  var SHIPPING = 4.9; // [DATO REAL]
  var NOVEDADES = [
    { id: "mantequilla", name: "Squishy mantequilla", price: 5.5, img: "mantequilla", daysAgo: 0, stock: 4 },
    { id: "blindbox", name: "Blind box sorpresa", price: 12.9, img: "blindbox", daysAgo: 1, stock: 6 },
    { id: "croissant", name: "Squishy croissant", price: 5.5, img: "croissant", daysAgo: 1, stock: 5 },
    { id: "sobre", name: "Sobre One Piece TCG", price: 5.5, img: "sobre", daysAgo: 2, stock: 18 },
    { id: "gel", name: "Bola antiestrés", price: 3.9, img: "gelball", daysAgo: 3, stock: 9 },
    { id: "gato", name: "Squishy mochi gatito", price: 3.5, img: "mochigato", daysAgo: 4, stock: 0 }
  ];
  var CATS = [["virales", "Virales"], ["juegos", "Juegos"], ["cartas", "Cartas"], ["merch", "Merch Fred"]];
  var PRODUCTS = [
    { id: "queso", cat: "virales", name: "Squishy queso", price: 5.9, img: "queso", bg: "sky", tag: ["¡Viral!", ""] },
    { id: "tostada", cat: "virales", name: "Squishy tostada", price: 4.9, img: "tostada", bg: "yellow", tag: ["Últimas 3", "w"] },
    { id: "mantequilla", cat: "virales", name: "Squishy mantequilla", price: 5.5, img: "mantequilla", bg: "orange", tag: ["Nuevo", "r"] },
    { id: "croissant", cat: "virales", name: "Squishy croissant", price: 5.5, img: "croissant", bg: "green" },
    { id: "gato", cat: "virales", name: "Squishy mochi gatito", price: 3.5, img: "mochigato", bg: "purple" },
    { id: "llavero", cat: "virales", name: "Llavero squishy aguacate", price: 3.5, img: "llavero", bg: "yellow" },
    { id: "blindbox", cat: "virales", name: "Blind box sorpresa", price: 12.9, img: "blindbox", bg: "sky", tag: ["¿Cuál te toca?", ""] },
    { id: "gel", cat: "virales", name: "Bola antiestrés purpurina", price: 3.9, img: "gelball", bg: "orange" },
    { id: "babosa", cat: "juegos", name: "Babosa fidget", price: 4.9, img: "babosa", bg: "green", tag: ["Top", "r"] },
    { id: "spinner", cat: "juegos", name: "Fidget spinner", price: 4.9, img: "spinner", bg: "orange" },
    { id: "popit", cat: "juegos", name: "Pop-it arcoíris", price: 2.9, img: "popit", bg: "sky" },
    { id: "cubo", cat: "juegos", name: "Cubo de velocidad 3×3", price: 6.9, img: "cubo", bg: "yellow" },
    { id: "fcube", cat: "juegos", name: "Fidget cube", price: 5.9, img: "fidgetcube", bg: "purple" },
    { id: "infinity", cat: "juegos", name: "Cubo infinito metal", price: 6.5, img: "infinitycube", bg: "sky" },
    { id: "yoyo", cat: "juegos", name: "Yo-yo con luz", price: 3.9, img: "yoyo", bg: "yellow" },
    { id: "slime", cat: "juegos", name: "Slime galaxia", price: 3.5, img: "slime", bg: "green" },
    { id: "op", cat: "cartas", name: "Sobre One Piece TCG (EN)", price: 5.5, img: "sobre", bg: "orange", tag: ["Nuevo", "r"], note: "Foto de ejemplo" },
    { id: "pk", cat: "cartas", name: "Sobre Pokémon TCG (EN)", price: 5.9, img: "sobre", bg: "yellow", note: "Foto de ejemplo" },
    { id: "lor", cat: "cartas", name: "Sobre Lorcana (EN)", price: 6.5, img: "sobre", bg: "purple", note: "Foto de ejemplo" },
    { id: "taza", cat: "merch", name: "Taza Fred clásica", price: 14, img: "taza-fred", bg: "sky", tag: ["Fred", "r"], cover: true },
    { id: "tazas", cat: "merch", name: "Taza Fred de colores", price: 14, img: "tazas-fred", bg: "green", cover: true },
    { id: "stickers", cat: "merch", name: "Pack de pegatinas Fred", price: 4, img: "../img/sticker-sheet", bg: "yellow" }
  ];
  var TICKER = ["COFFEE FIRST. CULTURE ALSO.", "GASTA 20 € Y EL CAFÉ VA POR NOSOTROS", "DRINK RESPONSIBLY. READ IRRESPONSIBLY.", "MÉS QUE UN KIOSK", "WE BREW OPINIONS (& COFFEE)"];

  /* ---------------- utilidades ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); };
  var num = function (n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var eur = function (n) { return num(n) + " €"; };
  var store = {
    get: function (k) { try { return JSON.parse(window.localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  var photo = function (img) { return "assets/photo/" + img + ".webp"; };
  var thumb = function (p) { return '<span class="th"><img class="ph" src="' + photo(p.img) + '" alt="" loading="lazy"></span>'; };
  var code = function () { return String(Math.floor(1000 + Math.random() * 9000)); };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dayLabel = function (d) {
    if (d === 0) return "Hoy";
    if (d === 1) return "Ayer";
    var t = new Date(); t.setDate(t.getDate() - d);
    var s = t.toLocaleDateString("es-ES", { weekday: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  var fmtUntil = function (date) {
    return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" }) + " · " + date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  /* ---------------- estado: un pedido, dos tipos de línea ---------------- */
  var NOV = {}, PROD = {};
  NOVEDADES.forEach(function (n) { NOV[n.id] = n; });
  PRODUCTS.forEach(function (p) { PROD[p.id] = p; });
  var bag = store.get("fred-bag2") || { res: {}, buy: {} };
  ["res", "buy"].forEach(function (k) {
    bag[k] = bag[k] || {};
    Object.keys(bag[k]).forEach(function (id) { if (!(k === "res" ? NOV : PROD)[id] || bag[k][id] <= 0) delete bag[k][id]; });
  });
  var me = store.get("fred-me") || {};
  var ship = store.get("fred-ship") || "recoger";
  var cat = store.get("fred-cat") || "virales";

  var sumOf = function (k) { var src = k === "res" ? NOV : PROD; return Object.keys(bag[k]).reduce(function (a, id) { return a + src[id].price * bag[k][id]; }, 0); };
  var countOf = function (k) { return Object.keys(bag[k]).reduce(function (a, id) { return a + bag[k][id]; }, 0); };
  var total = function () { return sumOf("res") + sumOf("buy"); };
  var count = function () { return countOf("res") + countOf("buy"); };

  /* ---------------- barra café gratis ---------------- */
  function progHTML(t, opts) {
    opts = opts || {};
    var pct = Math.min(100, Math.round((t / FREE_AT) * 100)), full = t >= FREE_AT;
    var left = full ? (opts.fullTxt || "¡Café gratis desbloqueado!") : "Te faltan " + eur(FREE_AT - t) + " para tu café gratis";
    var right = opts.right === "pct" ? pct + "%" : num(t) + " / " + FREE_AT + " €";
    return '<span class="prog' + (full ? " full" : "") + '"><span class="prog__track"><span class="prog__fill" style="width:' + pct + '%"></span><span class="prog__ticks"><i></i><i></i><i></i></span></span>' +
      '<span class="prog__mug"><svg class="prog__steam" viewBox="0 0 16 12" aria-hidden="true"><path d="M4 11c-2-3 2-5 0-9M11 11c-2-3 2-5 0-9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="prog__cup"><b style="height:' + pct + '%"></b></span><span class="prog__ear"></span></span></span>' +
      '<span class="prog__txt"><span>' + left + "</span><b>" + (full ? "☕ ¡Listo!" : right) + "</b></span>";
  }

  /* ---------------- render ---------------- */
  function renderTicker() {
    var one = TICKER.map(function (s) { return "<span>" + esc(s) + "</span><i></i>"; }).join("");
    $("ticker").innerHTML = one + one;
  }

  function renderNovedades() {
    $("menu").innerHTML = NOVEDADES.map(function (n) {
      var q = bag.res[n.id] || 0, sel = q > 0, out = n.stock === 0;
      var meta = (n.daysAgo === 0 ? "" : dayLabel(n.daysAgo) + " · ") + (out ? "Agotado" : "Quedan " + (n.stock - q));
      var ctl = out ? '<span class="soldout">Agotado</span>'
        : sel ? '<span class="qty"><button type="button" data-res="' + n.id + '" data-d="-1" aria-label="Menos ' + esc(n.name) + '">–</button><span>' + q + '</span><button type="button" data-res="' + n.id + '" data-d="1" aria-label="Más ' + esc(n.name) + '">+</button></span>'
        : '<button class="add" type="button" data-res="' + n.id + '" data-d="1" aria-label="Reservar ' + esc(n.name) + '">+</button>';
      return '<li class="nrow' + (sel ? " sel" : "") + (out ? " off" : "") + '">' + thumb(n) +
        '<span class="nrow__n">' + esc(n.name) + (n.daysAgo === 0 ? ' <span class="tag">Hoy</span>' : "") + "<small>" + meta + "</small></span>" +
        '<span class="nrow__p">' + num(n.price) + "</span>" + ctl + "</li>";
    }).join("");
    var r = sumOf("res");
    $("nov-btn").disabled = r === 0;
    $("nov-btn-t").textContent = eur(r);
    $("step2").classList.toggle("on", r > 0);
    $("nov-prog").innerHTML = progHTML(total());
  }

  function renderTabs() {
    $("tabs").innerHTML = CATS.map(function (c) {
      return '<button class="tab" role="tab" type="button" data-cat="' + c[0] + '" aria-selected="' + (c[0] === cat) + '">' + c[1] + "</button>";
    }).join("");
  }

  function renderGrid() {
    $("grid").innerHTML = PRODUCTS.filter(function (p) { return p.cat === cat; }).map(function (p, i) {
      var q = bag.buy[p.id] || 0;
      var tag = p.tag ? '<span class="sticker' + (p.tag[1] ? " sticker--" + p.tag[1] : "") + '">' + esc(p.tag[0]) + "</span>" : "";
      var img = '<img class="ph" src="' + photo(p.img) + '" alt="" loading="lazy"' + (p.cover ? ' style="object-fit:cover;width:100%;height:100%;mix-blend-mode:normal"' : "") + ">";
      return '<li><article class="card" style="animation-delay:' + i * 40 + 'ms"><div class="card__art" style="background:var(--' + p.bg + ')"><span class="circ">' + img + "</span></div>" + tag +
        '<div class="card__meta"><p class="card__n">' + esc(p.name) + (p.note ? "<small>" + esc(p.note) + "</small>" : "") + "</p>" +
        '<div class="card__row"><span class="card__pr">' + num(p.price) + '€</span><button class="plus" type="button" data-buy="' + p.id + '" aria-label="Añadir ' + esc(p.name) + '">' + (q ? "✓<i>" + q + "</i>" : "+") + "</button></div></div></article></li>";
    }).join("");
  }

  function renderDock() {
    var n = count(), t = total();
    $("navbag-n").textContent = n;
    $("dock").hidden = n === 0;
    $("dock-n").textContent = n;
    $("dock-t").textContent = eur(t);
    $("dock-prog").innerHTML = progHTML(t, { right: "pct" });
  }

  var wasFree = total() >= FREE_AT;
  function sync() {
    store.set("fred-bag2", bag);
    renderNovedades(); renderGrid(); renderDock();
    var isFree = total() >= FREE_AT;
    if (isFree && !wasFree) celebrate();
    wasFree = isFree;
  }
  function bumpBag() {
    [$("navbag"), document.querySelector(".dock__box")].forEach(function (el) { if (!el) return; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
  }

  /* ---------------- celebración ---------------- */
  var toastT = null;
  function toast(msg) {
    var t = $("toast"); t.textContent = msg; t.hidden = false; t.style.animation = "none"; void t.offsetWidth; t.style.animation = "";
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function confetti() {
    if (reduced) return;
    var box = $("confetti"), cols = ["#FFFF00", "#FFFFFF", "#6FBAE0", "#39AE4A", "#F07B00", "#FF0000"], html = "";
    for (var i = 0; i < 36; i++) {
      html += '<i style="left:' + Math.random() * 100 + "%;background:" + cols[i % cols.length] + ";animation-delay:" + Math.random() * .35 + "s;animation-duration:" + (1.2 + Math.random() * .9) + "s;transform:rotate(" + Math.random() * 360 + 'deg)"></i>';
    }
    box.innerHTML = html;
    setTimeout(function () { box.innerHTML = ""; }, 2600);
  }
  function celebrate() { confetti(); toast("☕ ¡Café gratis desbloqueado!"); }

  /* ---------------- eventos de página ---------------- */
  document.addEventListener("click", function (e) {
    var r = e.target.closest("[data-res]");
    if (r) {
      var n = NOV[r.dataset.res], d = Number(r.dataset.d), q = (bag.res[n.id] || 0) + d;
      q = Math.max(0, Math.min(n.stock, q));
      if (q) bag.res[n.id] = q; else delete bag.res[n.id];
      sync(); if (d > 0) bumpBag();
      if (r.closest("#panel")) openBag();
      return;
    }
    var b = e.target.closest("[data-buy]");
    if (b) {
      var id = b.dataset.buy, dd = Number(b.dataset.d || 1);
      bag.buy[id] = (bag.buy[id] || 0) + dd;
      if (bag.buy[id] <= 0) delete bag.buy[id];
      sync(); if (dd > 0) bumpBag();
      if (b.closest("#panel")) openBag();
    }
  });
  $("tabs").addEventListener("click", function (e) {
    var t = e.target.closest("[data-cat]"); if (!t) return;
    cat = t.dataset.cat; store.set("fred-cat", cat); renderTabs(); renderGrid();
  });
  $("nov-btn").addEventListener("click", openBag);
  $("navbag").addEventListener("click", openBag);
  $("dock-btn").addEventListener("click", openBag);

  /* nav roja sobre rojo, blanca sobre blanco (como en los frames) */
  (function () {
    var nav = $("nav"), ticking = false;
    function check() {
      ticking = false;
      var y = nav.getBoundingClientRect().bottom + 2, el = document.elementFromPoint(12, y), zone = el && el.closest("[data-nav]");
      nav.classList.toggle("is-light", !!zone && zone.dataset.nav === "white");
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    window.addEventListener("resize", check);
    check();
  })();

  /* ---------------- hoja ---------------- */
  var lastFocus = null;
  function openSheet(html) {
    if ($("sheet").hidden) lastFocus = document.activeElement;
    var keepScroll = !$("sheet").hidden ? $("panel").scrollTop : 0;
    $("sheet-body").innerHTML = html;
    $("sheet").hidden = false;
    $("panel").scrollTop = keepScroll;
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    $("sheet").hidden = true; document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $("sheet").addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("sheet").hidden) closeSheet(); });

  /* ---------------- pedido (frame v3 nº4) ---------------- */
  function lineHTML(kind, p) {
    var q = bag[kind][p.id], attr = kind === "res" ? "data-res" : "data-buy";
    return '<li class="line">' + thumb(p) + '<span class="line__n">' + esc(p.name) + (kind === "res" ? "<small>Reserva 48 h · pagas al recoger</small>" : "") + "</span>" +
      '<span class="line__r"><b>' + num(p.price * q) + '</b><span class="qty"><button type="button" ' + attr + '="' + p.id + '" data-d="-1" aria-label="Menos">–</button><span>' + q + "</span><button type=\"button\" " + attr + '="' + p.id + '" data-d="1" aria-label="Más">+</button></span></span></li>';
  }
  function openBag() {
    var nRes = countOf("res"), nBuy = countOf("buy"), t = total();
    if (!nRes && !nBuy) {
      openSheet('<h2 class="sh-title" id="sheet-title">Tu pedido</h2><div class="empty"><img src="assets/img/fran-head.webp" alt="">Todavía no hay nada. Reserva una novedad o date una vuelta por la tienda.</div><div class="progbox">' + progHTML(0) + '</div><p></p><a class="btn btn--red btn--block" href="#novedades" data-close>Ver novedades</a>');
      return;
    }
    var free = t >= FREE_AT, sh = nBuy && ship === "envio" ? SHIPPING : 0;
    var html = '<h2 class="sh-title" id="sheet-title">Tu pedido</h2><p class="sh-sub">' + (nRes + nBuy) + " artículos" + (nBuy ? " · " + (ship === "envio" ? "envío a casa" : "recoger en Fred") : "") + "</p>";
    if (nRes) html += '<span class="sh-group">Reservas · pagas al recoger</span><ul class="lines">' + Object.keys(bag.res).map(function (id) { return lineHTML("res", NOV[id]); }).join("") + "</ul>";
    if (nBuy) html += '<span class="sh-group">Compras</span><ul class="lines">' + Object.keys(bag.buy).map(function (id) { return lineHTML("buy", PROD[id]); }).join("") + "</ul>";
    html += '<div class="sh-box">' + (free
      ? '<div class="unlock"><span class="unlock__free">Gratis</span><h3>¡Café gratis desbloqueado!</h3><p>Has llegado a ' + FREE_AT + ' €. Enséñale el ticket a Óskarys y el café va por nosotros.</p>' + progHTML(t, { right: "eur" }) + "</div>"
      : '<div class="progbox">' + progHTML(t) + "</div>") + "</div>";
    if (nBuy) html += '<div class="opts" role="radiogroup" aria-label="Entrega de las compras">' +
      '<label class="opt"><input type="radio" name="ship" value="recoger"' + (ship === "recoger" ? " checked" : "") + "><span>Recoger en Fred<small>Nàpols 227 · listo en 24 h</small></span><em>Gratis</em></label>" +
      '<label class="opt"><input type="radio" name="ship" value="envio"' + (ship === "envio" ? " checked" : "") + "><span>Envío a casa (España)<small>[DATO REAL] plazos y coste</small></span><em>" + num(SHIPPING) + "€</em></label></div>";
    html += '<div class="tot"><small>Total</small><span>' + eur(t + sh) + "</span></div>";
    if (nRes && nBuy) html += '<p class="split"><span>Pagas ahora: ' + eur(sumOf("buy") + sh) + "</span><span>Pagas al recoger: " + eur(sumOf("res")) + "</span></p>";
    html += '<form class="sh-form" id="coform" novalidate>' +
      '<label for="c-name">Tu nombre</label><input id="c-name" autocomplete="given-name" value="' + esc(me.name || "") + '" required>' +
      '<label for="c-phone">WhatsApp (para avisarte)</label><input id="c-phone" inputmode="tel" autocomplete="tel" placeholder="600 000 000" value="' + esc(me.phone || "") + '" required>' +
      (nBuy && ship === "envio" ? '<label for="c-addr">Dirección de envío</label><textarea id="c-addr" rows="2" autocomplete="street-address" placeholder="Calle, número, piso, CP y ciudad"></textarea>' : "") +
      '<p class="sh-err" id="c-err" hidden></p>' +
      '<button class="btn btn--red btn--block" type="submit">' + (nBuy ? "Ir a pagar" : "Confirmar reserva · 48 h") + "</button></form>";
    openSheet(html);
    $("panel").querySelectorAll('input[name="ship"]').forEach(function (r) {
      r.addEventListener("change", function () { ship = r.value; store.set("fred-ship", ship); openBag(); });
    });
    $("coform").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("c-name").value.trim(), phone = $("c-phone").value.replace(/\D/g, ""), addrEl = $("c-addr"), addr = addrEl ? addrEl.value.trim() : "";
      var err = !name ? "Falta tu nombre." : phone.length < 9 ? "Pon un teléfono válido para avisarte." : addrEl && addr.length < 8 ? "Escribe la dirección completa para el envío." : "";
      if (err) { $("c-err").textContent = err; $("c-err").hidden = false; return; }
      me = { name: name, phone: phone }; store.set("fred-me", me);
      if (nBuy) openPay(); else finish("");
    });
  }

  function openPay() {
    var sh = ship === "envio" ? SHIPPING : 0, now = sumOf("buy") + sh, method = "Tarjeta";
    openSheet('<h2 class="sh-title" id="sheet-title">Pagar</h2><p class="sh-sub">Ahora pagas ' + eur(now) + (countOf("res") ? " · las reservas, al recoger" : "") + "</p>" +
      '<p class="sh-note">Pago de prueba: en la demo no se pide ningún dato bancario y no se cobra nada.</p>' +
      '<div class="pay" id="paym">' + ["Tarjeta", "Bizum", "Apple Pay"].map(function (m, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + m + "</button>"; }).join("") + "</div>" +
      '<button class="btn btn--red btn--block" type="button" id="paybtn">Pagar ' + eur(now) + " (demo)</button>");
    $("paym").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      method = b.textContent;
      $("paym").querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
    $("paybtn").addEventListener("click", function () {
      var btn = $("paybtn"); btn.disabled = true; btn.textContent = "Procesando…";
      setTimeout(function () { finish(method); }, 1100);
    });
  }

  /* ---------------- ticket (frame v3 nº5) ---------------- */
  function finish(method) {
    var nRes = countOf("res"), nBuy = countOf("buy"), t = total(), free = t >= FREE_AT, c = code();
    var sh = nBuy && ship === "envio" ? SHIPPING : 0;
    var lines = [];
    Object.keys(bag.res).forEach(function (id) { lines.push([bag.res[id] + "× " + NOV[id].name + " (reserva)", NOV[id].price * bag.res[id]]); });
    Object.keys(bag.buy).forEach(function (id) { lines.push([bag.buy[id] + "× " + PROD[id].name, PROD[id].price * bag.buy[id]]); });
    if (sh) lines.push(["Envío", sh]);
    if (free) lines.push(["☕ Café gratis", 0]);
    var until = new Date(Date.now() + HOLD_HOURS * 3600 * 1000);
    var kicker, big, sub;
    if (nBuy && ship === "envio") { kicker = "Te lo enviamos en"; big = "24-72 H"; sub = nRes ? "La reserva te la guardamos 48 h en el kiosko" : "[DATO REAL] plazo de envío"; }
    else if (nBuy) { kicker = "Listo para recoger en"; big = "24 H"; sub = nRes ? "La reserva te la guardamos 48 h" : "Recógelo en Nàpols 227"; }
    else { kicker = "Te lo guardamos hasta"; big = "48 H"; sub = fmtUntil(until); }
    var note = free ? "Café gratis · código CAFE-" + c : nBuy ? "Pagado con " + method + " · pago de prueba" : "Pagas al recoger · en el kiosko";
    var stamp = nBuy ? ["Pagado", "(demo)"] : ["Reservado", "¡es tuyo!"];
    var say = free ? "¡El café va por<br>nosotros!" : "¡Te esperamos<br>en el kiosko!";
    var who = me.name || "";
    var summary = (nRes + nBuy) + " artículos · " + eur(t + sh);
    bag = { res: {}, buy: {} }; wasFree = false; sync();
    openSheet('<div class="ticket"><div class="receipt"><img class="receipt__logo" src="assets/img/logo-bubble.webp" alt="FRED">' +
      '<p class="receipt__meta">Fred · Café &amp; Kiosko<br>Nàpols 227 · Barcelona<br>Pedido #FR-' + c + " · " + esc(who) + "</p><hr>" +
      '<div class="receipt__big"><small>' + kicker + "</small><strong>" + big + "</strong><small>" + esc(sub) + "</small></div><hr>" +
      lines.map(function (l) { return '<div class="receipt__li"><span>' + esc(l[0]) + "</span><span>" + num(l[1]) + "</span></div>"; }).join("") +
      '<div class="receipt__tot"><span>Total</span><span>' + eur(t + sh) + '</span></div><div class="receipt__note">' + esc(note) + '</div><div class="receipt__bars"></div><p class="receipt__code">FR' + c + "</p></div>" +
      '<div class="stamp">' + stamp[0] + "<small>" + stamp[1] + "</small></div>" +
      '<div class="ticket__say"><img src="assets/img/eddie-head.webp" alt=""><p>' + say + "</p></div>" +
      '<button class="btn btn--white" type="button" data-close>Seguir mirando</button></div>');
    $("panel").scrollTop = 0;
    if (free) setTimeout(confetti, 300);
    setTimeout(function () {
      notify(nBuy ? "FRED · Pedidos" : "FRED · Reservas",
        "<b>" + (nBuy ? "Nuevo pedido" : "Nueva reserva") + " #FR-" + c + "</b><br>" + esc(who) + " · " + summary +
        (nRes ? "<br>Reserva hasta el " + esc(fmtUntil(until)) : "") + (free ? "<br>☕ Incluye café gratis (CAFE-" + c + ")" : ""));
    }, 1000);
  }

  /* ---------------- notificación simulada (lo que ve Óskarys) ---------------- */
  var notiT = null;
  function notify(title, html) {
    var n = $("noti");
    n.innerHTML = '<span class="noti__tag">Demo · así le llega a Óskarys</span><div class="noti__ic"><img src="assets/img/logo-bubble-inv.webp" alt=""></div><div><div class="noti__top">' + esc(title) + "<span>ahora</span></div><p>" + html + "</p></div>";
    n.hidden = false; n.style.animation = "none"; void n.offsetWidth; n.style.animation = "";
    clearTimeout(notiT); notiT = setTimeout(function () { n.hidden = true; }, 7000);
  }
  $("noti").addEventListener("click", function () { $("noti").hidden = true; });

  /* ---------------- revistas ---------------- */
  $("magform").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = $("mag-title").value.trim(), n = $("mag-name").value.trim(), p = $("mag-phone").value.replace(/\D/g, "");
    if (!t || !n || p.length < 9) { $("mag-err").hidden = false; return; }
    $("mag-err").hidden = true;
    $("mag-ok").textContent = "¡Apuntado, " + n + "! Pedimos «" + t + "» y te escribimos por WhatsApp cuando llegue. Te la guardamos " + HOLD_HOURS + " h.";
    $("mag-ok").hidden = false;
    notify("FRED · Encargos", "<b>Encargo de revista</b><br>" + esc(n) + " quiere «" + esc(t) + "»");
    e.target.reset();
  });

  /* ---------------- arranque ---------------- */
  renderTicker(); renderTabs(); sync();
})();
