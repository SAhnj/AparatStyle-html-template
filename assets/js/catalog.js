/* ============================================================
   AparatStyle — catalog.js
   ------------------------------------------------------------
   Catalog page — client-side demo of the original behaviour:
   1. Initial filters from ?taxonomy= / ?category= / ?q= in the
      URL (hero tiles, circles and search all link this way)
      or from <body data-taxonomy data-category> (pre-filtered
      pages like catalog-men.html).
   2. Sort chips / discount checkbox / store filter / price range.
   3. Shows & hides the BAKED product cards via data-attributes
      (no re-rendering — markup stays visible for the developer).
   4. Active-filter chips + result counter.

   ⭐ WORDPRESS NOTES
   - Everything here is a real WP_Query on the server:
     taxonomy/category → product_cat, store → product_brand,
     price → meta_query, sort → orderby, discount → on_sale.
   → DELETE this file after moving filters to real URLs.
   ============================================================ */

(function (global) {
  "use strict";

  var doc = document;
  var APARAT = global.APARAT;
  var util = APARAT.util;

  var grid = doc.getElementById("catalog-grid");
  if (!grid) return; // not a catalog page

  var emptyEl = doc.getElementById("catalog-empty");
  var countEl = doc.querySelector("[data-catalog-count]");
  var titleEl = doc.querySelector("[data-catalog-title]");
  var chipsWrap = doc.getElementById("active-filters");

  /* --------------------- initial filter state ---------------------- */

  var params = new URLSearchParams(global.location.search);
  var body = doc.body;

  var state = {
    taxonomy: params.get("taxonomy") || body.getAttribute("data-taxonomy") || null,
    category: params.get("category") || body.getAttribute("data-category") || null,
    q: (params.get("q") || "").trim() || null,
    sort: "popular",
    onlyDiscount: false,
    store: null,
    min: null,
    max: null
  };

  /* --------------------- active filter chips ----------------------- */

  var X_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

  function chipHTML(label, removeUrl) {
    return '<a class="active-chip" href="' + removeUrl + '">' + label + X_ICON + "</a>";
  }

  function renderChips() {
    if (!chipsWrap) return;
    var html = "";
    if (state.taxonomy) {
      html += chipHTML(
        APARAT.data.taxonomyTitles[state.taxonomy] || state.taxonomy,
        removeParam("taxonomy")
      );
    }
    if (state.category) {
      html += chipHTML(
        APARAT.data.categoryTitles[state.category] || state.category,
        removeParam("category")
      );
    }
    if (state.q) {
      html += chipHTML("«" + state.q + "»", removeParam("q"));
    }
    chipsWrap.innerHTML = html;
  }

  /** URL without one of the filter params (works with static files). */
  function removeParam(key) {
    var p = new URLSearchParams(global.location.search);
    p.delete(key);
    var qs = p.toString();
    return "catalog.html" + (qs ? "?" + qs : "");
  }

  /** Update <h1> — taxonomy > search term > "همه محصولات". */
  function renderTitle() {
    if (!titleEl) return;
    if (state.taxonomy) {
      titleEl.textContent = APARAT.data.taxonomyTitles[state.taxonomy] || state.taxonomy;
    } else if (state.q) {
      titleEl.textContent = "نتایج جستجو برای «" + state.q + "»";
    } else {
      titleEl.textContent = "همه محصولات";
    }
  }

  /* --------------------------- filtering --------------------------- */

  function apply() {
    var cards = grid.querySelectorAll(".ap-card");
    var q = state.q ? state.q.toLowerCase() : "";
    var visible = 0;

    cards.forEach(function (card) {
      var d = card.dataset;
      var show = true;

      if (state.taxonomy && d.taxonomy !== state.taxonomy) show = false;
      if (show && state.category && d.category !== state.category) show = false;
      if (show && q && (d.name + " " + d.brand).toLowerCase().indexOf(q) === -1) show = false;
      if (show && state.onlyDiscount && Number(d.discount) === 0) show = false;
      if (show && state.store && d.store !== state.store) show = false;
      if (show && state.min !== null && Number(d.price) < state.min) show = false;
      if (show && state.max !== null && Number(d.price) > state.max) show = false;

      card.hidden = !show;
      if (show) visible++;
    });

    sortCards();
    if (countEl) countEl.textContent = util.faDigits(visible) + " کالا";
    if (emptyEl) emptyEl.hidden = visible > 0;
    grid.hidden = visible === 0;
  }

  /** Re-order the baked cards in the DOM according to the sort chip. */
  function sortCards() {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".ap-card"));
    var byOriginal = cards.slice();

    var sorted;
    switch (state.sort) {
      case "newest":
        sorted = byOriginal.slice().reverse();
        break;
      case "cheapest":
        sorted = byOriginal.slice().sort(function (a, b) {
          return Number(a.dataset.price) - Number(b.dataset.price);
        });
        break;
      case "expensive":
        sorted = byOriginal.slice().sort(function (a, b) {
          return Number(b.dataset.price) - Number(a.dataset.price);
        });
        break;
      case "discount":
        sorted = byOriginal.slice().sort(function (a, b) {
          return Number(b.dataset.discount) - Number(a.dataset.discount);
        });
        break;
      default:
        sorted = byOriginal; // "popular" = original data order
    }

    sorted.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  /* ------------------------- chip interactions --------------------- */

  // sort chips
  doc.querySelectorAll("[data-sort]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      doc.querySelectorAll("[data-sort]").forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
      });
      state.sort = chip.getAttribute("data-sort");
      apply();
    });
  });

  // store chips (+ store search box)
  function bindStoreChips() {
    doc.querySelectorAll("[data-store-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var name = chip.getAttribute("data-store-filter");
        state.store = state.store === name ? null : name;
        doc.querySelectorAll("[data-store-filter]").forEach(function (c) {
          var active = c === chip && state.store !== null;
          c.classList.toggle("is-active", c === chip ? state.store !== null : false);
        });
        apply();
      });
    });
  }
  bindStoreChips();

  var storeSearch = doc.querySelector("[data-store-search]");
  if (storeSearch) {
    storeSearch.addEventListener("input", function () {
      var term = storeSearch.value.trim();
      doc.querySelectorAll("[data-store-filter]").forEach(function (chip) {
        chip.hidden = term !== "" && chip.getAttribute("data-store-filter").indexOf(term) === -1;
      });
      if (term !== "" && doc.querySelector("[data-store-none]")) {
        doc.querySelector("[data-store-none]").hidden =
          doc.querySelectorAll("[data-store-filter]:not([hidden])").length > 0;
      }
    });
  }

  // discount-only checkbox
  var discountCheck = doc.querySelector("[data-only-discount]");
  if (discountCheck) {
    discountCheck.addEventListener("change", function () {
      state.onlyDiscount = discountCheck.checked;
      apply();
    });
  }

  // price range
  var applyPriceBtn = doc.querySelector("[data-apply-price]");
  if (applyPriceBtn) {
    applyPriceBtn.addEventListener("click", function () {
      var minInput = doc.querySelector("[data-min-price]");
      var maxInput = doc.querySelector("[data-max-price]");
      state.min = minInput && minInput.value.trim() !== "" ? Number(minInput.value) : null;
      state.max = maxInput && maxInput.value.trim() !== "" ? Number(maxInput.value) : null;
      apply();
    });
  }

  /* ----------------------------- boot ------------------------------ */

  renderChips();
  renderTitle();
  apply();
})(window);
