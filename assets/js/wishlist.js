/* ============================================================
   AparatStyle — wishlist.js
   ------------------------------------------------------------
   "ذخیره‌های من" page — renders the saved products grid from
   the localStorage store and switches between the grid and
   the empty state. Hearts inside the cards work through ui.js.

   ⭐ WORDPRESS NOTES
   - In the companion AparatStyle WP theme this page is
     template-wishlist.php + inc/wishlist.php (AJAX endpoint
     that renders product cards from stored IDs).
   - Or use any wishlist plugin you prefer.
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = global.APARAT;
  var store = APARAT.store;

  var gridEl = doc.getElementById("wishlist-grid");
  if (!gridEl) return; // not the wishlist page

  var emptyEl = doc.getElementById("wishlist-empty");

  function render() {
    var products = store.wishlistProducts();
    gridEl.hidden = products.length === 0;
    if (emptyEl) emptyEl.hidden = products.length > 0;

    gridEl.innerHTML = products.map(APARAT.cardHTML).join("");

    // bind freshly injected hearts (ui.js only binds via delegation
    // for clicks — the visual state needs a manual pass here)
    gridEl.querySelectorAll("[data-wish]").forEach(function (btn) {
      var active = store.isWishlisted(btn.getAttribute("data-wish"));
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  // re-render when an item is removed from this very page
  store.subscribe(function (state) {
    render(state);
  });

  render();
})(window);
