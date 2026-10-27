/* ============================================================
   AparatStyle — store.js
   ------------------------------------------------------------
   Client-side shop state: cart / wishlist / user / orders,
   persisted in localStorage (same key as the original design),
   with a tiny pub/sub so all widgets stay in sync.

   ⭐ WORDPRESS NOTES
   - Cart  → WooCommerce session (WC()->cart), server-side.
   - Wishlist → a plugin (or the theme's inc/wishlist.php AJAX
     endpoint in the companion AparatStyle WP theme).
   - Orders → WooCommerce orders (My Account endpoint).
   → You can DELETE this file after wiring WooCommerce.
   ============================================================ */

(function (global) {
  "use strict";

  var STORAGE_KEY = "aparat-style-state-v1";

  /* ------------------------- persistence ------------------------- */

  function loadState() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { cart: [], wishlist: [], user: null, orders: [] };
      var parsed = JSON.parse(raw);
      return {
        cart: Array.isArray(parsed.cart) ? parsed.cart : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
        user: parsed.user || null,
        orders: Array.isArray(parsed.orders) ? parsed.orders : []
      };
    } catch (err) {
      return { cart: [], wishlist: [], user: null, orders: [] };
    }
  }

  var state = loadState();
  var listeners = [];

  function persist() {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* ignore quota errors */
    }
  }

  function emit() {
    listeners.forEach(function (fn) {
      try { fn(state); } catch (e) { /* keep other listeners alive */ }
    });
  }

  function update(mutator) {
    mutator(state);
    persist();
    emit();
  }

  /** Subscribe to state changes; returns an unsubscribe function. */
  function subscribe(fn) {
    listeners.push(fn);
    return function () {
      listeners = listeners.filter(function (l) { return l !== fn; });
    };
  }

  /* --------------------------- helpers --------------------------- */

  var products = (global.APARAT && global.APARAT.data ? global.APARAT.data.products : []) || [];

  function getProduct(id) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].id === id) return products[i];
    }
    return undefined;
  }

  /** unique line key: productId|color|size */
  function itemKey(item) {
    return [item.productId, item.color || "", item.size || ""].join("|");
  }

  var MAX_QTY = 9;
  var SHIPPING = 75000; // flat demo shipping cost (تومان)

  /* ----------------------------- API ----------------------------- */

  var store = {
    /** current state snapshot */
    get: function () { return state; },

    subscribe: subscribe,

    getProduct: getProduct,
    SHIPPING: SHIPPING,
    MAX_QTY: MAX_QTY,

    /* ------------------------- cart ------------------------- */

    cartLines: function () {
      return state.cart.map(function (item) {
        return { item: item, product: getProduct(item.productId) };
      });
    },

    cartCount: function () {
      return state.cart.reduce(function (n, i) { return n + i.qty; }, 0);
    },

    /** sum of price × qty (what the customer pays for items) */
    cartTotal: function () {
      return state.cart.reduce(function (sum, i) {
        var p = getProduct(i.productId);
        return sum + (p ? p.price * i.qty : 0);
      }, 0);
    },

    /** sum of (oldPrice − price) × qty */
    cartDiscount: function () {
      return state.cart.reduce(function (sum, i) {
        var p = getProduct(i.productId);
        if (!p) return sum;
        return sum + ((p.oldPrice || p.price) - p.price) * i.qty;
      }, 0);
    },

    addToCart: function (productId, color, size, qty) {
      qty = qty || 1;
      var key = itemKey({ productId: productId, color: color, size: size });
      var existing = state.cart.some(function (i) { return itemKey(i) === key; });
      update(function (s) {
        if (existing) {
          s.cart = s.cart.map(function (i) {
            return itemKey(i) === key ? { productId: i.productId, color: i.color, size: i.size, qty: Math.min(i.qty + qty, MAX_QTY) } : i;
          });
        } else {
          s.cart = s.cart.concat([{ productId: productId, color: color || null, size: size || null, qty: qty }]);
        }
      });
    },

    updateQty: function (item, qty) {
      var key = itemKey(item);
      update(function (s) {
        if (qty <= 0) {
          s.cart = s.cart.filter(function (i) { return itemKey(i) !== key; });
        } else {
          s.cart = s.cart.map(function (i) {
            return itemKey(i) === key ? { productId: i.productId, color: i.color, size: i.size, qty: Math.min(qty, MAX_QTY) } : i;
          });
        }
      });
    },

    removeFromCart: function (item) {
      var key = itemKey(item);
      update(function (s) {
        s.cart = s.cart.filter(function (i) { return itemKey(i) !== key; });
      });
    },

    clearCart: function () {
      update(function (s) { s.cart = []; });
    },

    /* ------------------------ wishlist ----------------------- */

    wishlist: function () { return state.wishlist.slice(); },

    wishlistProducts: function () {
      return state.wishlist
        .map(getProduct)
        .filter(function (p) { return Boolean(p); });
    },

    isWishlisted: function (productId) {
      return state.wishlist.indexOf(productId) !== -1;
    },

    toggleWishlist: function (productId) {
      var exists = state.wishlist.indexOf(productId) !== -1;
      update(function (s) {
        s.wishlist = exists
          ? s.wishlist.filter(function (id) { return id !== productId; })
          : s.wishlist.concat([productId]);
      });
      return exists; // true → removed
    },

    /* -------------------------- user ------------------------- */

    user: function () { return state.user; },

    login: function (name) {
      update(function (s) { s.user = { name: name || "کاربر آپارات‌استایل" }; });
    },

    logout: function () {
      update(function (s) { s.user = null; });
    },

    /* ------------------------- orders ------------------------ */

    orders: function () { return state.orders.slice(); },

    /** Commit the cart as an order (status: processing) and clear it. */
    placeOrder: function () {
      if (state.cart.length === 0) return null;
      var total = store.cartTotal();
      var order = {
        id: "o-" + Date.now(),
        code: String(Math.floor(100000 + Math.random() * 899999)),
        createdAt: Date.now(),
        items: state.cart,
        total: total,
        status: "processing"
      };
      update(function (s) {
        s.orders = [order].concat(s.orders);
        s.cart = [];
      });
      return order;
    }
  };

  /* ---------------------------- export --------------------------- */

  global.APARAT = global.APARAT || {};
  global.APARAT.store = store;
})(window);
