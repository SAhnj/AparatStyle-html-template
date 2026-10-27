/* ============================================================
   AparatStyle — product.js
   ------------------------------------------------------------
   Single product page behaviour:
   1. Gallery (prev / next arrows + "۱ از ۲" counter)
   2. Option chips (طرح / سایز) single-select per group
   3. Add-to-cart with validation + toast
   4. Share button (copy link)
   5. Accordions (مشخصات / معرفی / ارسال)

   ⭐ WORDPRESS NOTES
   - The whole page becomes woocommerce/single-product.php;
     gallery → WooCommerce product gallery (photoswipe),
     variations → wc variation form,
     add-to-cart → the standard WC "add to cart" form.
   → DELETE this file on the WP side.
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = global.APARAT;
  var store = APARAT.store;

  var root = doc.querySelector("[data-product-id]");
  if (!root) return; // not the product page

  var product = APARAT.data.products.filter(function (p) {
    return p.id === root.getAttribute("data-product-id");
  })[0];
  if (!product) return;

  /* ------------------------- 1. gallery --------------------------- */

  var imgEl = doc.getElementById("gallery-img");
  var counterEl = doc.getElementById("gallery-counter");
  var prevBtn = doc.getElementById("gallery-prev");
  var nextBtn = doc.getElementById("gallery-next");
  var index = 0;
  var count = product.images.length;

  function renderGallery() {
    if (imgEl) {
      imgEl.src = product.images[index];
      imgEl.alt = product.name;
    }
    if (counterEl) {
      counterEl.textContent = APARAT.util.faDigits(index + 1) + " از " + APARAT.util.faDigits(count);
    }
    // hide arrows when there is a single image (like the original)
    if (prevBtn) prevBtn.hidden = count < 2;
    if (nextBtn) nextBtn.hidden = count < 2;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      index = (index - 1 + count) % count;
      renderGallery();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      index = (index + 1) % count;
      renderGallery();
    });
  }
  renderGallery();

  /* ------------------ 2. option chips (single select) -------------- */

  doc.querySelectorAll("[data-option-group]").forEach(function (group) {
    var valueEl = group.querySelector("[data-option-value]");
    group.querySelectorAll(".opt-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        if (chip.disabled) return;
        var wasSelected = chip.classList.contains("is-selected");
        group.querySelectorAll(".opt-chip").forEach(function (c) {
          c.classList.remove("is-selected");
          c.setAttribute("aria-pressed", "false");
        });
        if (!wasSelected) {
          chip.classList.add("is-selected");
          chip.setAttribute("aria-pressed", "true");
        }
        if (valueEl) {
          valueEl.textContent = wasSelected ? "انتخاب کنید" : chip.textContent.trim();
        }
      });
    });
  });

  /** Currently selected option label inside a group (or null). */
  function selectedOption(groupName) {
    var group = doc.querySelector('[data-option-group="' + groupName + '"]');
    if (!group) return null;
    var chip = group.querySelector(".opt-chip.is-selected");
    return chip ? chip.textContent.trim() : null;
  }

  /* --------------------- 3. add to cart ---------------------------- */

  var addBtn = doc.getElementById("add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      var color = selectedOption("color");
      var size = selectedOption("size");

      // validation mirrors the original design exactly
      if (product.colors.length > 0 && !color) {
        APARAT.toast("لطفاً طرح را انتخاب کنید");
        return;
      }
      if (product.sizes.length > 0 && !size) {
        APARAT.toast("لطفاً سایز را انتخاب کنید");
        return;
      }

      store.addToCart(product.id, color, size);
      APARAT.toast("به سبد خرید اضافه شد");
    });
  }

  /* --------------------- 4. share / copy link ---------------------- */

  var shareBtn = doc.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      if (global.navigator.clipboard) {
        global.navigator.clipboard.writeText(global.location.href).catch(function () {});
      }
      APARAT.toast("لینک کپی شد");
    });
  }

  /* ----------------------- 5. accordions --------------------------- */
  /* Single-open collapsible (like the original Radix accordion,
     first item "مشخصات کالا" is open by default in the markup).   */

  doc.querySelectorAll(".acc__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".acc__item");
      var isOpen = item.classList.contains("is-open");
      doc.querySelectorAll(".acc__item").forEach(function (i) {
        i.classList.remove("is-open");
        var t = i.querySelector(".acc__trigger");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})(window);
