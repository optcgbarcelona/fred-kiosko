/* FRED Café & Kiosko — demo.
   Novedades (reserva 48 h, pagas al recoger) + Tienda (carrito, recogida o envío, pago de prueba)
   + Revistas (encargo). En la versión final, NOVEDADES y el catálogo vendrán de Square. */
(function () {
  "use strict";

  /* ---------------- datos de demo ----------------
     Precios orientativos y fotos de ejemplo. Sustituir por el catálogo real (Square). */
  var PHOTO = "assets/photo/";
  var NOVEDADES = [
    { id: "n-mantequilla", name: "Squishy mantequilla", note: "El de TikTok · se aplasta y vuelve despacito", price: 5.5, img: "mantequilla", bg: "yellow", daysAgo: 0, stock: 4 },
    { id: "n-blindbox", name: "Blind box sorpresa", note: "Figura coleccionable · no sabes cuál te toca", price: 12.9, img: "blindbox", bg: "sky", daysAgo: 1, stock: 6 },
    { id: "n-croissant", name: "Squishy croissant", note: "Huele a nada, pero lo parece", price: 5.5, img: "croissant", bg: "orange", daysAgo: 1, stock: 5 },
    { id: "n-sobre", name: "Sobre One Piece TCG (EN)", note: "Nueva colección · foto de ejemplo", price: 5.5, img: "sobre", bg: "purple", daysAgo: 2, stock: 18 },
    { id: "n-gel", name: "Bola antiestrés purpurina", note: "Gel por dentro", price: 3.9, img: "gelball", bg: "green", daysAgo: 3, stock: 9 },
    { id: "n-gato", name: "Squishy mochi gatito", note: "Cabe en la mano", price: 3.5, img: "mochigato", bg: "sky", daysAgo: 4, stock: 0 }
  ];
  var CATS = [["virales", "Virales"], ["juegos", "Juegos"], ["cartas", "Cartas"], ["merch", "Merch Fred"]];
  var PRODUCTS = [
    { id: "queso", cat: "virales", name: "Squishy queso", price: 5.9, img: "queso", bg: "sky", tag: ["¡Viral!", "y"] },
    { id: "tostada", cat: "virales", name: "Squishy tostada", price: 4.9, img: "tostada", bg: "yellow", tag: ["Últimas 3", "w"] },
    { id: "mantequilla", cat: "virales", name: "Squishy mantequilla", price: 5.5, img: "mantequilla", bg: "orange", tag: ["Nuevo", "r"] },
    { id: "croissant", cat: "virales", name: "Squishy croissant", price: 5.5, img: "croissant", bg: "green" },
    { id: "gato", cat: "virales", name: "Squishy mochi gatito", price: 3.5, img: "mochigato", bg: "purple" },
    { id: "llavero", cat: "virales", name: "Llavero squishy aguacate", price: 3.5, img: "llavero", bg: "yellow" },
    { id: "blindbox", cat: "virales", name: "Blind box sorpresa", price: 12.9, img: "blindbox", bg: "sky", tag: ["¿Cuál te toca?", "y"] },
    { id: "gel", cat: "virales", name: "Bola antiestrés purpurina", price: 3.9, img: "gelball", bg: "orange" },
    { id: "spinner", cat: "juegos", name: "Fidget spinner metal", price: 4.9, img: "spinner", bg: "orange", tag: ["Clásico", "w"] },
    { id: "babosa", cat: "juegos", name: "Babosa fidget articulada", price: 4.9, img: "babosa", bg: "green", tag: ["Top", "r"] },
    { id: "popit", cat: "juegos", name: "Pop-it arcoíris", price: 2.9, img: "popit", bg: "sky" },
    { id: "cubo", cat: "juegos", name: "Cubo de velocidad 3×3", price: 6.9, img: "cubo", bg: "yellow" },
    { id: "fcube", cat: "juegos", name: "Fidget cube", price: 5.9, img: "fidgetcube", bg: "purple" },
    { id: "infinity", cat: "juegos", name: "Cubo infinito metal", price: 6.5, img: "infinitycube", bg: "sky" },
    { id: "yoyo", cat: "juegos", name: "Yo-yo con luz", price: 3.9, img: "yoyo", bg: "yellow" },
    { id: "slime", cat: "juegos", name: "Slime galaxia", price: 3.5, img: "slime", bg: "green" },
    { id: "op", cat: "cartas", name: "Sobre One Piece TCG (inglés)", price: 5.5, img: "sobre", bg: "orange", tag: ["Nuevo", "r"], note: "Foto de ejemplo" },
    { id: "pk", cat: "cartas", name: "Sobre Pokémon TCG (inglés)", price: 5.9, img: "sobre", bg: "yellow", note: "Foto de ejemplo" },
    { id: "lor", cat: "cartas", name: "Sobre Lorcana (inglés)", price: 6.5, img: "sobre", bg: "purple", note: "Foto de ejemplo" },
    { id: "taza", cat: "merch", name: "Taza Fred clásica", price: 14, img: "taza-fred", bg: "sky", tag: ["Fred", "r"], cover: true },
    { id: "tazas", cat: "merch", name: "Taza Fred de colores", price: 14, img: "tazas-fred", bg: "green", cover: true, note: "Elige color al recoger" },
    { id: "stickers", cat: "merch", name: "Pack de pegatinas Fred", price: 4, img: "../img/sticker-sheet", bg: "yellow", contain: true }
  ];
  var SHIPPING = 4.9; // [DATO REAL] coste de envío España
  var HOLD_HOURS = 48;
  var STATEMENTS = ["COFFEE FIRST. CULTURE ALSO.", "NOT YOUR AVERAGE KIOSK", "DRINK RESPONSIBLY. READ IRRESPONSIBLY.", "MÉS QUE UN KIOSK", "WE BREW OPINIONS (& COFFEE)", "JUDGE A BOOK BY ITS COVER"];

  /* ---------------- utilidades ---------------- */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]; }); };
  var eur = function (n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €"; };
  var eurS = function (n) { return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "€"; };
  var store = {
    get: function (k) { try { return JSON.parse(window.localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  var src = function (img) { return PHOTO + img + ".webp"; };
  var circ = function (p, cls) { return '<span class="circ ' + (cls || "") + '"><img class="ph" src="' + src(p.img) + '" alt="" loading="lazy"' + (p.cover ? ' style="object-fit:cover;width:100%;height:100%;mix-blend-mode:normal"' : "") + "></span>"; };
  var bgv = function (c) { return "var(--" + c + ")"; };
  var code = function () { return "FR-" + String(Math.floor(1000 + Math.random() * 9000)); };
  var dayLabel = function (d) {
    if (d === 0) return "Hoy";
    if (d === 1) return "Ayer";
    var t = new Date(); t.setDate(t.getDate() - d);
    var s = t.toLocaleDateString("es-ES", { weekday: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  var fmtUntil = function (date) {
    var d = date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
    var h = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    return d + " · " + h;
  };

  /* ---------------- ticker ---------------- */
  (function () {
    var one = STATEMENTS.map(function (s) { return "<span>" + esc(s) + "</span><i></i>"; }).join("");
    $("ticker").innerHTML = one + one;
  })();

  /* ---------------- novedades ---------------- */
  var reservedStock = store.get("fred-stock") || {};
  var stockOf = function (n) { return Math.max(0, n.stock - (reservedStock[n.id] || 0)); };

  function renderNovedades() {
    var f = NOVEDADES[0], left = stockOf(f);
    $("feat").innerHTML =
      '<div class="feat__pic" style="background:' + bgv(f.bg) + '">' + circ(f) + "</div>" +
      '<span class="sticker sticker--r">Llegó ' + dayLabel(f.daysAgo).toLowerCase() + "</span>" +
      '<span class="stock">' + (left ? "Quedan " + left : "Agotado") + "</span>" +
      '<div class="feat__body"><div class="feat__row"><div><h3>' + esc(f.name) + "</h3><small>" + esc(f.note) + '</small></div><span class="pr">' + eurS(f.price) + "</span></div>" +
      '<button class="btn btn--red btn--block" type="button" data-reserve="' + f.id + '"' + (left ? "" : " disabled") + ">" + (left ? "Resérvalo · pagas al recoger" : "Agotado") + "</button></div>";
    $("rail").innerHTML = NOVEDADES.slice(1).map(function (n) {
      var l = stockOf(n);
      return '<li><article class="mini' + (l ? "" : " soldout") + '"><div class="mini__pic" style="background:' + bgv(n.bg) + '">' + circ(n) + '</div><span class="day">' + dayLabel(n.daysAgo) + "</span>" +
        '<div class="mini__body"><span>' + esc(n.name) + '</span><div class="mini__row"><b>' + eurS(n.price) + "</b>" +
        (l ? '<button class="mini__res" type="button" data-reserve="' + n.id + '">Reservar</button>' : '<span class="mini__res" style="background:#fff;color:var(--red);border:2px solid var(--red)">Agotado</span>') +
        "</div></div></article></li>";
    }).join("");
  }
  renderNovedades();
  (function () {
    var m = 12;
    setInterval(function () { m += 1; $("nov-updated").textContent = "Actualizado hace " + m + " min"; }, 60000);
  })();

  /* ---------------- tienda ---------------- */
  var cat = store.get("fred-cat") || "virales";
  var cart = store.get("fred-cart") || {};
  var byId = {}; PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  Object.keys(cart).forEach(function (k) { if (!byId[k]) delete cart[k]; });

  function renderTabs() {
    $("tabs").innerHTML = CATS.map(function (c) {
      return '<button class="tab" role="tab" type="button" data-cat="' + c[0] + '" aria-selected="' + (c[0] === cat) + '">' + c[1] + "</button>";
    }).join("");
  }
  function renderGrid() {
    $("grid").innerHTML = PRODUCTS.filter(function (p) { return p.cat === cat; }).map(function (p, i) {
      var tag = p.tag ? '<span class="sticker sticker--' + p.tag[1] + '">' + esc(p.tag[0]) + "</span>" : "";
      return '<li><article class="card" style="animation-delay:' + i * 40 + 'ms"><div class="card__pic" style="background:' + bgv(p.bg) + '">' + circ(p) + "</div>" + tag +
        '<div class="card__body"><p class="card__name">' + esc(p.name) + (p.note ? '<span class="card__note">' + esc(p.note) + "</span>" : "") + "</p>" +
        '<div class="card__row"><span class="card__pr">' + eurS(p.price) + '</span><button class="plus" type="button" data-add="' + p.id + '" aria-label="Añadir ' + esc(p.name) + '">+</button></div></div></article></li>';
    }).join("");
  }
  renderTabs(); renderGrid();
  $("tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat; store.set("fred-cat", cat); renderTabs(); renderGrid();
  });

  function cartCount() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k]; }, 0); }
  function cartSub() { return Object.keys(cart).reduce(function (a, k) { return a + cart[k] * byId[k].price; }, 0); }
  function syncCart(bump) {
    store.set("fred-cart", cart);
    var n = cartCount();
    $("navbag-n").textContent = n;
    $("dock").hidden = n === 0;
    $("dock-n").textContent = n;
    $("dock-t").textContent = eur(cartSub());
    if (bump) {
      [$("navbag"), $("dock")].forEach(function (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    }
  }
  syncCart(false);
  $("grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]"); if (!b) return;
    var id = b.dataset.add; cart[id] = (cart[id] || 0) + 1; syncCart(true);
    b.classList.remove("added"); void b.offsetWidth; b.classList.add("added"); b.textContent = "✓";
    setTimeout(function () { b.textContent = "+"; b.classList.remove("added"); }, 900);
  });

  /* ---------------- hoja (sheet) ---------------- */
  var lastFocus = null;
  function openSheet(html) {
    lastFocus = document.activeElement;
    $("sheet-body").innerHTML = html;
    $("sheet").hidden = false;
    document.body.style.overflow = "hidden";
    var f = $("panel").querySelector("input, button:not(.sheet__x)"); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet() {
    $("sheet").hidden = true; document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  $("sheet").addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("sheet").hidden) closeSheet(); });

  /* ---------------- reservar novedad ---------------- */
  var nById = {}; NOVEDADES.forEach(function (n) { nById[n.id] = n; });
  var saved = store.get("fred-me") || {};
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-reserve]"); if (!b) return;
    openReserve(nById[b.dataset.reserve]);
  });
  function openReserve(n) {
    var max = stockOf(n), q = 1;
    openSheet(
      '<h2 class="sh-title" id="sheet-title">Resérvalo</h2><p class="sh-sub">Te lo guardamos ' + HOLD_HOURS + ' horas. Pagas al recogerlo en el kiosko.</p>' +
      '<div class="sh-prod">' + circ(n) + "<div><h3>" + esc(n.name) + "</h3><b>" + eurS(n.price) + '</b><div class="qty" style="margin-top:8px"><button type="button" data-q="-1" aria-label="Menos">–</button><span id="rq">1</span><button type="button" data-q="1" aria-label="Más">+</button></div></div></div>' +
      '<form class="sh-form" id="resform" novalidate><label for="r-name">Tu nombre</label><input id="r-name" autocomplete="given-name" value="' + esc(saved.name || "") + '" required>' +
      '<label for="r-phone">WhatsApp (para avisarte)</label><input id="r-phone" inputmode="tel" autocomplete="tel" placeholder="600 000 000" value="' + esc(saved.phone || "") + '" required>' +
      '<p class="sh-err" id="r-err" hidden>Pon tu nombre y un teléfono para que Óskarys sepa de quién es.</p>' +
      '<button class="btn btn--red btn--block" type="submit">Reservar · ' + eur(n.price) + "</button></form>"
    );
    $("panel").querySelector(".sh-prod .qty").addEventListener("click", function (e) {
      var d = e.target.closest("[data-q]"); if (!d) return;
      q = Math.min(max, Math.max(1, q + Number(d.dataset.q)));
      $("rq").textContent = q;
      $("resform").querySelector("button[type=submit]").textContent = "Reservar · " + eur(n.price * q);
    });
    $("resform").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("r-name").value.trim(), phone = $("r-phone").value.replace(/\D/g, "");
      if (!name || phone.length < 9) { $("r-err").hidden = false; return; }
      saved = { name: name, phone: phone }; store.set("fred-me", saved);
      reservedStock[n.id] = (reservedStock[n.id] || 0) + q; store.set("fred-stock", reservedStock);
      var c = code(), until = new Date(Date.now() + HOLD_HOURS * 3600 * 1000);
      renderNovedades();
      openSheet(ticketHTML({
        code: c, who: name, kicker: "Te lo guardamos hasta", big: HOLD_HOURS + " H", when: fmtUntil(until),
        lines: [[q + "× " + n.name, n.price * q]], total: n.price * q,
        note: "Pagas al recoger · en el kiosko", stamp: ["Reservado", "¡es tuyo!"], say: "Pásate y dile tu nombre a Óskarys"
      }));
      setTimeout(function () {
        notify("FRED · Reservas", "<b>Nueva reserva #" + c + "</b><br>" + esc(name) + " · " + q + "× " + esc(n.name) + " · " + eur(n.price * q) + "<br>Recoge antes del " + esc(fmtUntil(until)));
      }, 900);
    });
  }

  /* ---------------- ticket ---------------- */
  function ticketHTML(t) {
    return '<div class="ticket"><div class="receipt"><img class="receipt__logo" src="assets/img/logo-bubble.webp" alt="FRED">' +
      '<p class="receipt__meta">Fred · Café &amp; Kiosko<br>Nàpols 227 · Barcelona<br>' + esc(t.code) + " · " + esc(t.who) + "</p><hr>" +
      '<div class="receipt__big"><small>' + esc(t.kicker) + "</small><strong>" + esc(t.big) + '</strong><span class="when">' + esc(t.when) + "</span></div><hr>" +
      t.lines.map(function (l) { return '<div class="receipt__li"><span>' + esc(l[0]) + "</span><span>" + eurS(l[1]) + "</span></div>"; }).join("") +
      '<div class="receipt__tot"><span>Total</span><span>' + eur(t.total) + "</span></div>" +
      '<div class="receipt__note">' + esc(t.note) + '</div><div class="receipt__bars"></div><p class="receipt__code">' + esc(t.code.replace("-", "")) + "</p></div>" +
      '<div class="stamp">' + esc(t.stamp[0]) + "<small>" + esc(t.stamp[1]) + "</small></div>" +
      '<div class="ticket__say"><img src="assets/img/eddie-head.webp" alt=""><p>' + esc(t.say) + "</p></div>" +
      '<button class="btn btn--white" type="button" data-close>Seguir mirando</button></div>';
  }

  /* ---------------- notificación simulada (lo que ve Óskarys) ---------------- */
  var notiT = null;
  function notify(title, html) {
    var n = $("noti");
    n.innerHTML = '<span class="noti__tag">Demo · así le llega a Óskarys</span><div class="noti__ic"><img src="assets/img/logo-bubble-inv.webp" alt=""></div><div><div class="noti__top">' + esc(title) + "<span>ahora</span></div><p>" + html + "</p></div>";
    n.hidden = false; n.style.animation = "none"; void n.offsetWidth; n.style.animation = "";
    clearTimeout(notiT); notiT = setTimeout(function () { n.hidden = true; }, 6500);
  }
  $("noti").addEventListener("click", function () { $("noti").hidden = true; });

  /* ---------------- carrito y checkout ---------------- */
  var ship = store.get("fred-ship") || "recoger";
  function openCart() {
    var ids = Object.keys(cart);
    if (!ids.length) {
      openSheet('<h2 class="sh-title" id="sheet-title">Tu pedido</h2><div class="empty"><img src="assets/img/fran-head.webp" alt="">Todavía no hay nada. Date una vuelta por la tienda.</div><a class="btn btn--red btn--block" href="#tienda" data-close>Ir a la tienda</a>');
      return;
    }
    var sub = cartSub(), total = sub + (ship === "envio" ? SHIPPING : 0);
    openSheet(
      '<h2 class="sh-title" id="sheet-title">Tu pedido</h2><p class="sh-sub">' + cartCount() + " artículos</p>" +
      '<ul class="lines" id="lines">' + ids.map(function (k) {
        var p = byId[k];
        return '<li class="line">' + circ(p) + '<span class="line__n">' + esc(p.name) + '</span><span class="line__p">' + eurS(p.price * cart[k]) +
          '<span class="qty"><button type="button" data-l="' + k + '" data-d="-1" aria-label="Menos">–</button><span>' + cart[k] + '</span><button type="button" data-l="' + k + '" data-d="1" aria-label="Más">+</button></span></span></li>';
      }).join("") + "</ul>" +
      '<div class="opts" role="radiogroup" aria-label="Entrega">' +
      '<label class="opt"><input type="radio" name="ship" value="recoger"' + (ship === "recoger" ? " checked" : "") + "><span>Recoger en Fred<br><small>Nàpols 227 · listo en 24 h</small></span><em>Gratis</em></label>" +
      '<label class="opt"><input type="radio" name="ship" value="envio"' + (ship === "envio" ? " checked" : "") + "><span>Envío a casa (España)<br><small>[DATO REAL] plazos y coste</small></span><em>" + eurS(SHIPPING) + "</em></label></div>" +
      '<form class="sh-form" id="coform" novalidate>' +
      '<label for="c-name">Nombre</label><input id="c-name" autocomplete="name" value="' + esc(saved.name || "") + '" required>' +
      '<label for="c-phone">Teléfono</label><input id="c-phone" inputmode="tel" autocomplete="tel" value="' + esc(saved.phone || "") + '" placeholder="600 000 000" required>' +
      '<div id="addr" ' + (ship === "envio" ? "" : "hidden") + ' class="sh-form"><label for="c-addr">Dirección de envío</label><textarea id="c-addr" rows="2" autocomplete="street-address" placeholder="Calle, número, piso, CP y ciudad"></textarea></div>' +
      '<div class="tot"><small>Total</small><span id="c-tot">' + eur(total) + "</span></div>" +
      '<p class="sh-err" id="c-err" hidden></p>' +
      '<button class="btn btn--red btn--block" type="submit">Ir a pagar</button></form>'
    );
    $("lines").addEventListener("click", function (e) {
      var b = e.target.closest("[data-l]"); if (!b) return;
      var k = b.dataset.l; cart[k] += Number(b.dataset.d); if (cart[k] <= 0) delete cart[k];
      syncCart(false); openCart();
    });
    $("panel").querySelectorAll('input[name="ship"]').forEach(function (r) {
      r.addEventListener("change", function () {
        ship = r.value; store.set("fred-ship", ship);
        $("addr").hidden = ship !== "envio";
        $("c-tot").textContent = eur(cartSub() + (ship === "envio" ? SHIPPING : 0));
      });
    });
    $("coform").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("c-name").value.trim(), phone = $("c-phone").value.replace(/\D/g, ""), addr = $("c-addr").value.trim();
      var err = !name ? "Falta tu nombre." : phone.length < 9 ? "Pon un teléfono válido para avisarte." : ship === "envio" && addr.length < 8 ? "Escribe la dirección completa para el envío." : "";
      if (err) { $("c-err").textContent = err; $("c-err").hidden = false; return; }
      saved = { name: name, phone: phone }; store.set("fred-me", saved);
      openPay(name);
    });
  }
  function openPay(name) {
    var total = cartSub() + (ship === "envio" ? SHIPPING : 0), method = "Tarjeta";
    openSheet(
      '<h2 class="sh-title" id="sheet-title">Pagar</h2><p class="sh-sub">Total ' + eur(total) + "</p>" +
      '<p class="sh-note">Pago de prueba: en la demo no se pide ningún dato bancario y no se cobra nada.</p>' +
      '<div class="pay" id="paym">' + ["Tarjeta", "Bizum", "Apple Pay"].map(function (m, i) { return '<button type="button" aria-pressed="' + (i === 0) + '">' + m + "</button>"; }).join("") + "</div>" +
      '<button class="btn btn--red btn--block" type="button" id="paybtn">Pagar ' + eur(total) + " (demo)</button>"
    );
    $("paym").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      method = b.textContent;
      $("paym").querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    });
    $("paybtn").addEventListener("click", function () {
      var btn = $("paybtn"); btn.disabled = true; btn.textContent = "Procesando…";
      setTimeout(function () {
        var c = code(), lines = Object.keys(cart).map(function (k) { return [cart[k] + "× " + byId[k].name, byId[k].price * cart[k]]; });
        if (ship === "envio") lines.push(["Envío", SHIPPING]);
        var pick = ship === "recoger";
        cart = {}; syncCart(false);
        openSheet(ticketHTML({
          code: c, who: name, kicker: pick ? "Lo tendrás listo en" : "Te lo enviamos en",
          big: pick ? "24 H" : "24-72 H", when: pick ? "Recógelo en Nàpols 227" : "[DATO REAL] plazo de envío",
          lines: lines, total: total, note: "Pagado con " + method + " · pago de prueba", stamp: ["Pagado", "(demo)"],
          say: pick ? "¡Te esperamos en el kiosko!" : "¡Va de camino!"
        }));
        setTimeout(function () { notify("FRED · Pedidos", "<b>Nuevo pedido #" + c + "</b><br>" + esc(name) + " · " + lines.length + " líneas · " + eur(total) + "<br>" + (pick ? "Recoge en el kiosko" : "Envío a domicilio")); }, 900);
      }, 1100);
    });
  }
  $("navbag").addEventListener("click", openCart);
  $("dock-btn").addEventListener("click", openCart);

  /* ---------------- revistas ---------------- */
  $("magform").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = $("mag-title").value.trim(), n = $("mag-name").value.trim(), p = $("mag-phone").value.replace(/\D/g, "");
    if (!t || !n || p.length < 9) { $("mag-err").hidden = false; return; }
    $("mag-err").hidden = true;
    var ok = $("mag-ok");
    ok.innerHTML = "¡Apuntado, " + esc(n) + "! Pedimos «" + esc(t) + "» y te escribimos por WhatsApp cuando llegue. Te la guardamos " + HOLD_HOURS + " h.";
    ok.hidden = false;
    notify("FRED · Encargos", "<b>Encargo de revista</b><br>" + esc(n) + " quiere «" + esc(t) + "»");
    e.target.reset();
  });
})();
