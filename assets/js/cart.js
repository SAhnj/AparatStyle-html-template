/* ============================================================
   AparatStyle — cart.js
   ------------------------------------------------------------
   Cart page:
   1. Renders cart lines + totals from the localStorage store
   2. Qty steppers / remove buttons
   3. "ثبت سفارش" → creates an order, then redirects to orders.html
   4. Tabs: "سبد خرید" ↔ "خرید بعدی" (wishlist grid)

   The static markup inside #cart-items is a SAMPLE for design
   review; it is replaced at runtime by render().

   ⭐ WORDPRESS NOTES
   - WooCommerce renders the cart server-side (woocommerce/cart);
     totals, qty update and coupons are WC core.
   → DELETE this file after switching to WooCommerce.
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = global.APARAT;
  var store = APARAT.store;
  var util = APARAT.util;

  var itemsEl = doc.getElementById("cart-items");
  if (!itemsEl) return; // not the cart page

  var filledEl = doc.getElementById("cart-filled");
  var emptyEl = doc.getElementById("cart-empty");
  var rowsEl = doc.getElementById("summary-rows");
  var totalEl = doc.getElementById("summary-total");
  var nextGridEl = doc.getElementById("next-grid");
  var nextEmptyEl = doc.getElementById("next-empty");

  /* --------------------- markup builders --------------------------- */

  var ICON_MINUS = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
  var ICON_PLUS = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
  var ICON_TRASH = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  function lineHTML(line, index) {
    var item = line.item;
    var p = line.product;
    if (!p) return "";
    var variant = [item.color ? "طرح: " + item.color : null, item.size ? "سایز: " + item.size : null]
      .filter(Boolean)
      .join(" | ");
    return (
      '<div class="cart-line">' +
      '<a href="product.html"><img class="cart-line__img" src="' + p.images[0] + '" alt="' + p.name + '"></a>' +
      '<div class="cart-line__body">' +
      '<p class="cart-line__brand">' + p.brand + "</p>" +
      '<p class="cart-line__name">' + p.name + "</p>" +
      (variant ? '<p class="cart-line__variant">' + variant + "</p>" : "") +
      '<p class="cart-line__price">' + util.faPrice(p.price * item.qty) + " تومان</p>" +
      '<div class="cart-line__actions">' +
      '<div class="qty" dir="ltr">' +
      '<button type="button" class="qty__btn" data-dec="' + index + '" aria-label="کاهش تعداد"' + (item.qty <= 1 ? " disabled" : "") + ">" + ICON_MINUS + "</button>" +
      '<span class="qty__value">' + util.faDigits(item.qty) + "</span>" +
      '<button type="button" class="qty__btn" data-inc="' + index + '" aria-label="افزایش تعداد"' + (item.qty >= store.MAX_QTY ? " disabled" : "") + ">" + ICON_PLUS + "</button>" +
      "</div>" +
      '<button type="button" class="cart-line__remove" data-remove="' + index + '" aria-label="حذف از سبد">' + ICON_TRASH + "</button>" +
      "</div></div></div>"
    );
  }

  /* -------------------------- rendering ---------------------------- */

  function render() {
    var lines = store.cartLines();

    // tab: cart
    if (filledEl && emptyEl) {
      filledEl.hidden = lines.length === 0;
      emptyEl.hidden = lines.length > 0;
    }

    if (lines.length === 0) {
      itemsEl.innerHTML = "";
      if (rowsEl) rowsEl.innerHTML = "";
      if (totalEl) totalEl.innerHTML = "";
    } else {
      itemsEl.innerHTML = lines.map(lineHTML).join("");

      var itemsSum = store.cartTotal() + store.cartDiscount();
      var itemsDiscount = store.cartDiscount();
      var shipping = store.SHIPPING;

      if (rowsEl) {
        rowsEl.innerHTML =
          '<div class="summary__row"><span>قیمت کالاها (' + util.faDigits(store.cartCount()) + ")</span><span>" + util.faPrice(itemsSum) + " تومان</span></div>" +
          '<div class="summary__row"><span>تخفیف کالاها</span>' +
          (itemsDiscount > 0
            ? '<span class="summary__discount">' + util.faPrice(itemsDiscount) + " تومان</span>"
            : '<span class="summary__muted">۰ تومان</span>') +
          "</div>" +
          '<div class="summary__row"><span>هزینه ارسال</span><span>' + util.faPrice(shipping) + " تومان</span></div>";
      }
      if (totalEl) {
        totalEl.innerHTML =
          "<span>مبلغ قابل پرداخت</span><span>" + util.faPrice(store.cartTotal() + shipping) + " تومان</span>";
      }
    }

    // tab: next purchase (= wishlist)
    var wishProducts = store.wishlistProducts();
    if (nextGridEl && nextEmptyEl) {
      nextGridEl.hidden = wishProducts.length === 0;
      nextEmptyEl.hidden = wishProducts.length > 0;
      nextGridEl.innerHTML = wishProducts.map(APARAT.cardHTML).join("");
      // bind fresh hearts
      nextGridEl.querySelectorAll("[data-wish]").forEach(function (btn) {
        var active = store.isWishlisted(btn.getAttribute("data-wish"));
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
  }

  /* ---------------------- line interactions ------------------------ */

  function findLine(index) {
    var lines = store.cartLines();
    return lines[index] ? lines[index].item : null;
  }

  itemsEl.addEventListener("click", function (e) {
    var inc = e.target.closest("[data-inc]");
    var dec = e.target.closest("[data-dec]");
    var rem = e.target.closest("[data-remove]");
    if (inc) {
      var lineA = findLine(Number(inc.getAttribute("data-inc")));
      if (lineA) store.updateQty(lineA, lineA.qty + 1);
    } else if (dec) {
      var lineB = findLine(Number(dec.getAttribute("data-dec")));
      if (lineB) store.updateQty(lineB, lineB.qty - 1);
    } else if (rem) {
      var lineC = findLine(Number(rem.getAttribute("data-remove")));
      if (lineC) store.removeFromCart(lineC);
    }
  });

  /* ------------------------ submit order --------------------------- */

  var submitBtn = doc.getElementById("submit-order");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      if (store.cartCount() === 0) return;
      var order = store.placeOrder();
      if (order) {
        APARAT.toast("سفارش " + util.faDigits(order.code) + " با موفقیت ثبت شد");
        global.setTimeout(function () {
          global.location.href = "orders.html";
        }, 350);
      }
    });
  }

  /* ---------------------------- tabs ------------------------------- */

  doc.querySelectorAll("[data-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var name = btn.getAttribute("data-tab");
      doc.querySelectorAll("[data-tab]").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      var cartPanel = doc.getElementById("tab-cart");
      var nextPanel = doc.getElementById("tab-next");
      if (cartPanel) cartPanel.hidden = name !== "cart";
      if (nextPanel) nextPanel.hidden = name !== "next";
    });
  });

  /* ---------------------------- boot ------------------------------- */

  store.subscribe(render);
  render();
})(window);
