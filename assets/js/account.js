/* ============================================================
   AparatStyle — account.js
   ------------------------------------------------------------
   Account area pages:
   1. profile.html — mock login/logout, toggles guest/user state
   2. orders.html  — renders order cards from the localStorage
      store (created by cart.js "ثبت سفارش")

   The baked markup is a STATIC SAMPLE for design review;
   render() replaces it with real stored data at runtime.

   ⭐ WORDPRESS NOTES
   - This whole area becomes WooCommerce My Account
     (endpoints: orders, view-order, edit-address…).
   - Login/logout → real wp-login.php / WC authentication.
   → DELETE this file after switching to WooCommerce.
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = global.APARAT;
  var store = APARAT.store;
  var util = APARAT.util;

  /* ========================= profile page ========================== */

  var guestEl = doc.getElementById("profile-guest");
  if (guestEl) {
    var userEl = doc.getElementById("profile-user");
    var linksEl = doc.getElementById("profile-links");
    var nameEl = doc.querySelector("[data-user-name]");
    var avatarEl = doc.querySelector("[data-user-avatar]");

    function renderProfile() {
      var user = store.user();
      guestEl.hidden = Boolean(user);
      if (userEl) userEl.hidden = !user;
      if (linksEl) linksEl.hidden = !user;
      if (user && nameEl) nameEl.textContent = user.name;
      if (user && avatarEl) avatarEl.textContent = user.name.trim().charAt(0);
    }

    var loginBtn = doc.getElementById("profile-login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        store.login();
        APARAT.toast("خوش آمدید! 👋");
      });
    }

    var logoutBtn = doc.getElementById("profile-logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        store.logout();
        APARAT.toast("از حساب خارج شدید");
      });
    }

    store.subscribe(renderProfile);
    renderProfile();
  }

  /* ========================== orders page ========================== */

  var ordersList = doc.getElementById("orders-list");
  if (ordersList) {
    var loginGate = doc.getElementById("orders-login");
    var emptyGate = doc.getElementById("orders-empty");

    function orderHTML(order) {
      var statusMeta = {
        processing: { cls: "status-chip--processing", label: "در حال پردازش" },
        shipped: { cls: "status-chip--muted", label: "ارسال شده" },
        delivered: { cls: "status-chip--muted", label: "تحویل شده" }
      }[order.status] || { cls: "status-chip--muted", label: order.status };

      var thumbs = order.items
        .slice(0, 4)
        .map(function (item, i) {
          var p = store.getProduct(item.productId);
          return p
            ? '<img class="order-card__thumb" src="' + p.images[0] + '" alt="' + p.name + '">'
            : "";
        })
        .join("");

      var rest = order.items.length - Math.min(order.items.length, 4);
      if (rest > 0) {
        thumbs += '<span class="order-card__more">+' + util.faDigits(rest) + "</span>";
      }

      return (
        '<article class="order-card">' +
        '<div class="order-card__head">' +
        '<p class="order-card__code">سفارش ' + util.faDigits(order.code) + "</p>" +
        '<span class="status-chip ' + statusMeta.cls + '">' + statusMeta.label + "</span>" +
        "</div>" +
        '<p class="order-card__date">' + new Date(order.createdAt).toLocaleDateString("fa-IR") + "</p>" +
        '<div class="order-card__thumbs">' + thumbs + "</div>" +
        '<div class="order-card__total">' +
        '<span class="order-card__total-label">مبلغ پرداختی</span>' +
        '<span class="order-card__total-value">' + util.faPrice(order.total) + " تومان</span>" +
        "</div></article>"
      );
    }

    function renderOrders() {
      var user = store.user();
      var orders = store.orders();

      if (loginGate) loginGate.hidden = Boolean(user) || orders.length > 0;
      if (emptyGate) emptyGate.hidden = !user || orders.length > 0;

      ordersList.hidden = orders.length === 0;
      ordersList.innerHTML = orders.map(orderHTML).join("");
    }

    var loginBtn = doc.getElementById("orders-login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", function () {
        store.login();
        APARAT.toast("خوش آمدید! 👋");
      });
    }

    store.subscribe(renderOrders);
    renderOrders();
  }
})(window);
