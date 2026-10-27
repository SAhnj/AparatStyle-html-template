/* ============================================================
   AparatStyle — ui.js
   ------------------------------------------------------------
   Global UI behaviour, loaded on EVERY page:
   1. Toast notifications (black pill, bottom center)
   2. Header dropdown panels (categories / mobile menu)
   3. Slider arrows (RTL aware) for .scroller sections
   4. Mobile filters toggle (catalog)
   5. Wishlist hearts ([data-wish]) everywhere
   6. Header count badges ([data-cart-count] / [data-wish-count])
   7. "Top stores" chip switcher (home page)
   8. Shared product-card HTML builder (used by wishlist/cart)

   WordPress → enqueue as global script; items 7–8 disappear
   once PHP renders real products (server-side loops).
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = (global.APARAT = global.APARAT || {});
  var store = APARAT.store;
  var util = APARAT.util;

  /* --------------------------- 1. toast --------------------------- */

  var toastTimer = null;

  function toast(message) {
    var wrap = doc.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = doc.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("aria-live", "polite");
      doc.body.appendChild(wrap);
    }
    wrap.innerHTML = "";
    var pill = doc.createElement("div");
    pill.className = "toast";
    pill.textContent = message;
    wrap.appendChild(pill);
    if (toastTimer) global.clearTimeout(toastTimer);
    toastTimer = global.setTimeout(function () {
      if (pill.parentNode) pill.parentNode.removeChild(pill);
    }, 2600);
  }

  APARAT.toast = toast;

  /* ----------------- 8. shared product-card builder ---------------- */
  /* Mirrors the baked markup of the static template exactly.          */

  var ICON_HEART =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>';

  function cardHTML(product) {
    var fa = util.faPrice;
    var oldPrice = product.oldPrice
      ? '<del class="ap-card__price-old">' + fa(product.oldPrice) + "</del>"
      : "";
    var discount = product.discount
      ? '<span class="ap-card__discount">' + util.faDigits(product.discount) + "٪</span>"
      : "";
    return (
      '<article class="ap-card" data-id="' + product.id + '" data-price="' + product.price + '"' +
      ' data-discount="' + (product.discount || 0) + '" data-store="' + product.store + '"' +
      ' data-taxonomy="' + product.taxonomy + '" data-category="' + product.category + '"' +
      ' data-name="' + product.name + '" data-brand="' + product.brand + '">' +
      '<div class="ap-card__media">' +
      '<a class="ap-card__link" href="product.html" aria-label="' + product.name + " — " + product.brand + '">' +
      '<img class="ap-card__img" src="' + product.images[0] + '" alt="' + product.name + '" loading="lazy">' +
      "</a>" +
      discount +
      '<button type="button" class="ap-card__wish" data-wish="' + product.id + '" aria-pressed="false" aria-label="افزودن به ذخیره‌ها">' + ICON_HEART + "</button>" +
      "</div>" +
      '<a class="ap-card__body" href="product.html">' +
      '<p class="ap-card__brand">' + product.brand + "</p>" +
      '<h3 class="ap-card__name">' + product.name + "</h3>" +
      '<div class="ap-card__price">' +
      oldPrice +
      '<span class="ap-card__price-now">' + fa(product.price) + ' <span class="ap-card__price-unit">تومان</span></span>' +
      "</div></a></article>"
    );
  }

  APARAT.cardHTML = cardHTML;

  /* ------------------- 2. header dropdown panels ------------------- */

  function closePanels(except) {
    doc.querySelectorAll(".header-panel").forEach(function (panel) {
      if (panel !== except) {
        panel.hidden = true;
        var trigger = doc.querySelector('[data-panel="#' + panel.id + '"]');
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-panel]");
    if (trigger) {
      var panel = doc.querySelector(trigger.getAttribute("data-panel"));
      if (panel) {
        var willOpen = panel.hidden;
        closePanels(willOpen ? panel : null);
        panel.hidden = !willOpen;
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
        // swap burger icon (menu ↔ close)
        trigger.querySelectorAll("[data-icon]").forEach(function (img) {
          img.hidden = img.getAttribute("data-icon") !== (willOpen ? "close" : "menu");
        });
        e.preventDefault();
      }
      return;
    }
    if (!e.target.closest(".header-panel")) closePanels();
  });

  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanels();
  });

  /* ------------------- 3. slider arrows (RTL) ---------------------- */

  doc.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-scroll]");
    if (!btn) return;
    var scope = btn.closest("section") || doc;
    var scroller = scope.querySelector(".scroller");
    if (!scroller) return;

    // In RTL, scrolling to the "next" items means a NEGATIVE scrollBy.
    var dirNext = btn.getAttribute("data-scroll") === "next";
    var isRtl = (doc.documentElement.dir || "rtl") === "rtl";
    var step = Math.max(280, Math.round(scroller.clientWidth * 0.7));
    var delta = dirNext ? -step : step;
    if (!isRtl) delta = -delta;

    scroller.scrollBy({ left: delta, behavior: "smooth" });
  });

  /* ---------------- 4. mobile filters toggle (catalog) ------------- */

  doc.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-toggle]");
    if (!toggle) return;
    var target = doc.querySelector(toggle.getAttribute("data-toggle"));
    if (!target) return;
    var willOpen = !target.classList.contains("is-open");
    target.classList.toggle("is-open", willOpen);
    toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  /* -------------------- 5. wishlist hearts ------------------------- */

  function syncHearts() {
    doc.querySelectorAll("[data-wish]").forEach(function (btn) {
      var active = store.isWishlisted(btn.getAttribute("data-wish"));
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      var label = active ? "حذف از ذخیره‌ها" : "افزودن به ذخیره‌ها";
      if (btn.getAttribute("aria-label") !== label) btn.setAttribute("aria-label", label);
    });
  }

  doc.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-wish]");
    if (!btn) return;
    var removed = store.toggleWishlist(btn.getAttribute("data-wish"));
    toast(removed ? "از ذخیره‌ها حذف شد" : "به ذخیره‌ها اضافه شد");
  });

  /* -------------------- 6. header count badges --------------------- */

  function syncBadges() {
    var cartCount = store.cartCount();
    var wishCount = store.wishlist().length;
    doc.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = util.faDigits(cartCount);
      el.hidden = cartCount === 0;
    });
    doc.querySelectorAll("[data-wish-count]").forEach(function (el) {
      el.textContent = util.faDigits(wishCount);
      el.hidden = wishCount === 0;
    });
  }

  store.subscribe(function () {
    syncHearts();
    syncBadges();
  });

  /* ----------------- 7. top-stores chip switcher ------------------- */
  /* Home page: clicking a store chip re-renders the 4-product grid.
     WordPress → this is a plain link to ?brand=slug (see stores.php). */

  doc.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-store-chip]");
    if (!chip) return;
    var storeName = chip.getAttribute("data-store-chip");
    var grid = doc.querySelector("[data-stores-grid]");
    if (!grid) return;

    doc.querySelectorAll("[data-store-chip]").forEach(function (c) {
      var active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-pressed", active ? "true" : "false");
    });

    var products = APARAT.data.products.filter(function (p) {
      return p.store === storeName;
    }).slice(0, 4);

    grid.innerHTML = products.length
      ? products.map(cardHTML).join("")
      : '<div class="empty"><div class="empty__icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div><h3 class="empty__title">محصولی برای این فروشگاه پیدا نشد</h3></div>';

    syncHearts();
  });

  /* --------------------------- boot ------------------------------- */

  function boot() {
    syncHearts();
    syncBadges();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
