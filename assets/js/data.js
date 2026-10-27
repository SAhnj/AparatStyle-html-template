/* ============================================================
   AparatStyle — data.js
   ------------------------------------------------------------
   STATIC DEMO DATASET (22 products + home-page content).
   Persian (RTL) fashion store — prices are in Toman.

   ⭐ WORDPRESS NOTES
   - This file exists ONLY so the static template is a working
     demo (cart / wishlist / filters need product data).
   - In WordPress the products come from WooCommerce
     (post type: product, taxonomy: product_cat / product_brand).
   - The server renders real products via PHP loops, so you can
     DELETE this file in production together with the page
     scripts that consume it (cart.js, wishlist.js, catalog.js…).
   - Keep the same field names if you feed this JSON via a REST
     API / WPGraphQL instead.
   ============================================================ */

(function (global) {
  "use strict";

  var CDN = "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt";

  /* ---------------- Persian digit & price helpers ---------------- */

  var FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  /** "4588000" -> "۴,۵۸۸,۰۰۰" (latin digits -> Persian + thousand separators) */
  function faDigits(input) {
    return String(input).replace(/\d/g, function (d) {
      return FA_DIGITS[Number(d)];
    });
  }

  /** 4588000 -> "۴,۵۸۸,۰۰۰" */
  function faPrice(value) {
    return faDigits(Number(value).toLocaleString("en-US"));
  }

  /* ------------------------- home content ------------------------- */

  /** Hero banners (top of the home page) — WP: featured product_cat terms with thumbnail */
  var heroTiles = [
    { title: "زنانه", taxonomy: "women", image: CDN + "/59609e06200e.jpg" },
    { title: "مردانه", taxonomy: "men", image: CDN + "/dafd9c5b58ca.jpg" },
    { title: "بچگانه", taxonomy: "kids", image: CDN + "/66553fb6202d.jpg" },
    { title: "زیبایی و سلامت", taxonomy: "beauty", image: CDN + "/995969788753.jpg" }
  ];

  /** Category circles slider — WP: product_cat terms with thumbnail */
  var categoryCircles = [
    { title: "پوشاک", category: "clothing", taxonomy: null, image: CDN + "/19d8936caed4.jpg" },
    { title: "کفش", category: "shoes", taxonomy: null, image: CDN + "/00c7f819cf79.jpg" },
    { title: "کیف", category: "bag", taxonomy: null, image: CDN + "/26777e29867c.jpg" },
    { title: "اکسسوری", category: "accessory", taxonomy: null, image: CDN + "/7b9ec24a179c.jpg" },
    { title: "دخترونه", category: "clothing", taxonomy: "kids", image: CDN + "/66553fb6202d.jpg" },
    { title: "پسرانه", category: "clothing", taxonomy: "kids", image: CDN + "/614b72a93d4f.jpg" },
    { title: "نوزادی", category: "clothing", taxonomy: "kids", image: CDN + "/9758a3d40b42.jpg" }
  ];

  /** Top stores chips — WP: product_brand terms */
  var stores = ["نارین", "مانگو", "زارا", "اچ اند ام", "تری براون", "نایکی", "آدیداس"];

  /** Catalog sort options — WP: pre_get_posts orderby */
  var sortOptions = [
    { value: "popular", label: "پرفروش‌ترین" },
    { value: "newest", label: "جدیدترین" },
    { value: "cheapest", label: "ارزان‌ترین" },
    { value: "expensive", label: "گران‌ترین" },
    { value: "discount", label: "بیشترین تخفیف" }
  ];

  var taxonomyTitles = { men: "مردانه", women: "زنانه", kids: "بچگانه", beauty: "زیبایی و سلامت" };
  var categoryTitles = { clothing: "پوشاک", shoes: "کفش", bag: "کیف", accessory: "اکسسوری" };

  /* --------------------------- products --------------------------- */
  /* fields:
     id        — unique SKU-like id (WP: post id / slug)
     name      — WP: post title
     brand     — WP: product_brand term
     price     — Toman (WP: _price meta)
     oldPrice  — optional regular price (WP: _regular_price)
     discount  — optional percent (computed from old/regular price)
     taxonomy  — men | women | kids | beauty     (WP: product_cat)
     category  — clothing | shoes | bag | accessory
     images    — gallery urls (WP: featured image + gallery)
     colors    — attribute "طرح" options        (WP: pa_ color attribute)
     sizes     — attribute "سایز" options
     store     — shop name (WP: product_brand or vendor)
  */
  var products = [
    {
      id: "7e778e0285858f39",
      name: "پولوشرت یقه راه‌راه",
      brand: "نارین",
      price: 4588000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/4eb0669f503c.jpg", CDN + "/19d8936caed4.jpg"],
      colors: [
        { name: "شیری", hex: "#f3ede2", available: true },
        { name: "مشکی", hex: "#1f1f1f", available: true },
        { name: "صورتی‌آبی", hex: "#d9b8c4", available: false }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "XL", available: true },
        { label: "۴", available: false }
      ],
      inStock: true,
      store: "نارین",
      description:
        "پولوشرت یقه راه‌راه از جنس پنبه پیکه، با یقه بافت و دکمه مخفی؛ انتخابی راحت و شیک برای استایل روزمره. مناسب فصل بهار و تابستان.",
      details: [
        { label: "رنگ", value: "مشکی، سرمه‌ای، کرم" },
        { label: "طرح", value: "راه‌راه" },
        { label: "جنس", value: "پنبه پیکه" },
        { label: "سایز", value: "S" }
      ]
    },
    {
      id: "a1f2c3d4e5f60718",
      name: "شلوار جین مام فیت",
      brand: "نارین",
      price: 2228000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/e585beb4a52f.jpg"],
      colors: [
        { name: "آبی روشن", hex: "#9db8d6", available: true },
        { name: "آبی تیره", hex: "#3b4a63", available: true }
      ],
      sizes: [
        { label: "۲۵", available: true },
        { label: "۲۶", available: true },
        { label: "۲۸", available: true },
        { label: "۳۰", available: true },
        { label: "۳۱", available: false }
      ],
      inStock: true,
      store: "نارین",
      description:
        "شلوار جین مام فیت با کمر بالا و دماغه گشاد، مدل محبوب دهه ۹۰؛ از جنس دنیم سنگ‌شور نرم و راحت.",
      details: [
        { label: "رنگ", value: "آبی روشن" },
        { label: "فیت", value: "مام فیت" },
        { label: "جنس", value: "دنیم" }
      ]
    },
    {
      id: "b2e3d4c5f6a71829",
      name: "شلوار جین آرا کالکشاد",
      brand: "نارین",
      price: 3990000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/39a06e035902.jpg", CDN + "/93a4c943bf6d.png"],
      colors: [{ name: "آبی", hex: "#7d9cc0", available: true }],
      sizes: [
        { label: "۲۶", available: true },
        { label: "۲۸", available: true },
        { label: "۳۰", available: true }
      ],
      inStock: true,
      store: "نارین",
      description: "شلوار جین زنانه با برش راسته و پایه کوتاه؛ ترکیبی ایده‌آل از راحتی و استایل مدرن.",
      details: [
        { label: "رنگ", value: "آبی" },
        { label: "فیت", value: "راسته" },
        { label: "جنس", value: "دنیم کشی" }
      ]
    },
    {
      id: "c3f4e5d6a7b82930",
      name: "شومیز جین زنانه",
      brand: "مانگو",
      price: 1680000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/59609e06200e.jpg"],
      colors: [
        { name: "آبی جین", hex: "#6d8cb4", available: true },
        { name: "سفید", hex: "#f5f5f0", available: true }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true }
      ],
      inStock: true,
      store: "مانگو",
      description: "شومیز جین با یقه انگلیسی و دکمه‌های فلزی؛ ست‌شدنی با شلوار پارچه‌ای و جین.",
      details: [
        { label: "رنگ", value: "آبی جین" },
        { label: "جنس", value: "دنیم سبک" }
      ]
    },
    {
      id: "d4a5b6c7d8e93a41",
      name: "پیراهن ساتن مجلسی",
      brand: "زارا",
      price: 5980000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/cb5d990e0a12.webp", CDN + "/fce34f5dfb89.jpg", CDN + "/d67b3b7522e6.jpg"],
      colors: [
        { name: "زیتونی", hex: "#b5b98a", available: true },
        { name: "یاسی", hex: "#c8b6d8", available: true }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: false }
      ],
      inStock: true,
      store: "زارا",
      description: "پیراهن بلند ساتن با دامن کلوش و کمر جمع‌شده؛ درخششی لطیف برای مهمانی‌های شما.",
      details: [
        { label: "رنگ", value: "زیتونی" },
        { label: "قد", value: "بلند" },
        { label: "جنس", value: "ساتن" }
      ]
    },
    {
      id: "e5b6c7d8e9f04a52",
      name: "پالتو تک بلند",
      brand: "زارا",
      price: 6480000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/ff538ca5712e.jpg", CDN + "/082e88162dfb.jpg", CDN + "/c9db06dc67bd.jpg"],
      colors: [
        { name: "بژ", hex: "#d9c6a9", available: true },
        { name: "شتری", hex: "#c19a6b", available: true }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true }
      ],
      inStock: true,
      store: "زارا",
      description: "پالتو بلند با کمربند پارچه‌ای و یقه انگلیسی؛ گرم، سبک و همه‌جا مناسب.",
      details: [
        { label: "رنگ", value: "بژ" },
        { label: "قد", value: "بلند" },
        { label: "جنس", value: "مخلوط پشمی" }
      ]
    },
    {
      id: "f6c7d8e9fa015b63",
      name: "کیف دستی چرم طبیعی",
      brand: "تری براون",
      price: 3450000,
      taxonomy: "women",
      category: "bag",
      images: [CDN + "/28ea1e4f1868.png", CDN + "/26777e29867c.jpg"],
      colors: [
        { name: "مشکی", hex: "#1f1f1f", available: true },
        { name: "خاکستری", hex: "#6b6b6b", available: true }
      ],
      sizes: [],
      inStock: true,
      store: "تری براون",
      description: "کیف دستی از چرم طبیعی با دوخت دست و آستر پارچه‌ای؛ جادار و ماندگار.",
      details: [
        { label: "جنس", value: "چرم طبیعی" },
        { label: "بند", value: "دوشی قابل تنظیم" }
      ]
    },
    {
      id: "a7d8e9fab0126c74",
      name: "شومیز تروپیکال",
      brand: "اچ اند ام",
      price: 1780000,
      taxonomy: "women",
      category: "clothing",
      images: [CDN + "/b23b00e66e85.jpg"],
      colors: [{ name: "سبز", hex: "#3f7a5c", available: true }],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true }
      ],
      inStock: true,
      store: "اچ اند ام",
      description: "شومیز یقه هفت با چاپ برگ‌های استوایی؛ الهام‌گرفته از تعطیلات گرم استوایی.",
      details: [
        { label: "طرح", value: "چاپ برگ" },
        { label: "جنس", value: "ویسکوز" }
      ]
    },
    {
      id: "b8e9fa0b1237d85",
      name: "کیف دوشی مینیمال",
      brand: "زارا",
      price: 2384000,
      oldPrice: 2980000,
      discount: 20,
      taxonomy: "women",
      category: "bag",
      images: [CDN + "/9f5e282e6241.jpg", CDN + "/4b6eb8f63ea9.jpg"],
      colors: [
        { name: "خاکستری", hex: "#6b6b6b", available: true },
        { name: "قهوه‌ای", hex: "#7a5236", available: false }
      ],
      sizes: [],
      inStock: true,
      store: "زارا",
      description: "کیف دوشی کوچک با قفل فلزی و بافت ضربدری؛ مینیمال و شیک برای هر روز.",
      details: [
        { label: "جنس", value: "چرم مصنوعی" },
        { label: "اندازه", value: "کوچک" }
      ]
    },
    {
      id: "c9fa0b1c2348e96",
      name: "پولوشرت پیکه مردانه",
      brand: "نارین",
      price: 2288000,
      taxonomy: "men",
      category: "clothing",
      images: [CDN + "/c9b54b0a24e8.png", CDN + "/4eb0669f503c.jpg"],
      colors: [
        { name: "سفید", hex: "#f5f5f0", available: true },
        { name: "شتری", hex: "#c19a6b", available: true }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true },
        { label: "XL", available: true }
      ],
      inStock: true,
      store: "نارین",
      description: "پولوشرت پیکه با یقه کلاسیک و دکمه‌ای؛ پایه‌ای‌ترین قطعه کمد لباس مردانه.",
      details: [
        { label: "جنس", value: "پنبه پیکه" },
        { label: "یقه", value: "پولو" }
      ]
    },
    {
      id: "da1b2c3d459ea7f0",
      name: "شلوار جین راسته مردانه",
      brand: "زارا",
      price: 2980000,
      taxonomy: "men",
      category: "clothing",
      images: [CDN + "/9f7d445d8300.jpg", CDN + "/4de37bdee1e0.jpg"],
      colors: [
        { name: "آبی تیره", hex: "#3b4a63", available: true },
        { name: "شسته", hex: "#8fa8c4", available: true }
      ],
      sizes: [
        { label: "۳۰", available: true },
        { label: "۳۲", available: true },
        { label: "۳۴", available: true },
        { label: "۳۶", available: false }
      ],
      inStock: true,
      store: "زارا",
      description: "شلوار جین راسته با فیت راحت و دنیم مقاوم؛ مناسب محیط کار و استایل روزمره.",
      details: [
        { label: "فیت", value: "راسته" },
        { label: "جنس", value: "دنیم" }
      ]
    },
    {
      id: "eab2c3d4560afb8",
      name: "پیراهن آستین کوتاه مردانه",
      brand: "اچ اند ام",
      price: 1890000,
      taxonomy: "men",
      category: "clothing",
      images: [CDN + "/dafd9c5b58ca.jpg", CDN + "/3272901ba701.jpg"],
      colors: [
        { name: "آبی روشن", hex: "#a9c4dd", available: true },
        { name: "سفید", hex: "#f5f5f0", available: true }
      ],
      sizes: [
        { label: "S", available: true },
        { label: "M", available: true },
        { label: "L", available: true }
      ],
      inStock: true,
      store: "اچ اند ام",
      description: "پیراهن نخی آستین کوتاه با رنگ‌های ملایم؛ خنک و راحت برای روزهای گرم.",
      details: [
        { label: "جنس", value: "نخ" },
        { label: "آستین", value: "کوتاه" }
      ]
    },
    {
      id: "fbc3d4e5671ba09",
      name: "پیراهن چاپی مردانه",
      brand: "اچ اند ام",
      price: 2150000,
      taxonomy: "men",
      category: "clothing",
      images: [CDN + "/daea3f669823.jpg"],
      colors: [{ name: "شتری", hex: "#c19a6b", available: true }],
      sizes: [
        { label: "M", available: true },
        { label: "L", available: true },
        { label: "XL", available: true }
      ],
      inStock: true,
      store: "اچ اند ام",
      description: "پیراهن با چاپ آبرنگی و فرم اورسایز؛ راحتی اسپرت با حس‌وحال هنری.",
      details: [
        { label: "طرح", value: "چاپ آبرنگی" },
        { label: "فرم", value: "اورسایز" }
      ]
    },
    {
      id: "acd4e5f6782cb1a",
      name: "جین اسلیم فیت آبی",
      brand: "مانگو",
      price: 3120000,
      taxonomy: "men",
      category: "clothing",
      images: [CDN + "/7ebaf9416df2.jpg", CDN + "/a195fe16702d.jpg"],
      colors: [{ name: "آبی", hex: "#6d8cb4", available: true }],
      sizes: [
        { label: "۳۰", available: true },
        { label: "۳۲", available: true },
        { label: "۳۴", available: true }
      ],
      inStock: true,
      store: "مانگو",
      description: "شلوار جین اسلیم فیت با کشسانی ملایم؛ ظاهری مرتب و راحتی تمام‌روز.",
      details: [
        { label: "فیت", value: "اسلیم" },
        { label: "جنس", value: "دنیم کشی" }
      ]
    },
    {
      id: "bde5f6a7893dc2b",
      name: "کتانی سفید روزمره",
      brand: "نایکی",
      price: 3880000,
      taxonomy: "men",
      category: "shoes",
      images: [CDN + "/00c7f819cf79.jpg", CDN + "/2835f0518d85.jpg"],
      colors: [
        { name: "سفید", hex: "#f5f5f0", available: true },
        { name: "کرم", hex: "#e8ddc8", available: true }
      ],
      sizes: [
        { label: "۴۰", available: true },
        { label: "۴۱", available: true },
        { label: "۴۲", available: true },
        { label: "۴۳", available: true },
        { label: "۴۴", available: false }
      ],
      inStock: true,
      store: "نایکی",
      description: "کتانی چرم سفید با زیره لاستیکی و کفی طبی؛ سبک و همه‌روزه.",
      details: [
        { label: "جنس", value: "چرم طبیعی" },
        { label: "زیره", value: "لاستیک" }
      ]
    },
    {
      id: "cef6a7b894ed3c",
      name: "کتانی استن‌اسمیت",
      brand: "آدیداس",
      price: 3360000,
      oldPrice: 4200000,
      discount: 20,
      taxonomy: "men",
      category: "shoes",
      images: [CDN + "/f3ffd96a0ca0.jpg", CDN + "/14ef061c4288.jpg"],
      colors: [
        { name: "سفید", hex: "#f5f5f0", available: true },
        { name: "سبز", hex: "#3f7a5c", available: false }
      ],
      sizes: [
        { label: "۴۰", available: true },
        { label: "۴۲", available: true },
        { label: "۴۴", available: true }
      ],
      inStock: true,
      store: "آدیداس",
      description: "کتانی کلاسیک با رویه چرم و نوار لاستیکی؛ نماد بی‌زمان استایل اسپرت.",
      details: [
        { label: "مدل", value: "استن‌اسمیت" },
        { label: "جنس", value: "چرم" }
      ]
    },
    {
      id: "dfa7b8c9a5fe4d",
      name: "پیراهن مجلسی بچگانه",
      brand: "نارین",
      price: 1280000,
      taxonomy: "kids",
      category: "clothing",
      images: [CDN + "/66553fb6202d.jpg"],
      colors: [{ name: "صورتی", hex: "#e8c4cc", available: true }],
      sizes: [
        { label: "۴", available: true },
        { label: "۶", available: true },
        { label: "۸", available: true }
      ],
      inStock: true,
      store: "نارین",
      description: "پیراهن مجلسی بچگانه با دامن پفی و آستین اریب؛ برای جشن‌ها و مهمانی‌ها.",
      details: [
        { label: "جنس", value: "ساتن" },
        { label: "دامن", value: "پفی" }
      ]
    },
    {
      id: "ea8b9cdab6af5e71",
      name: "ست راحتی بچگانه",
      brand: "اچ اند ام",
      price: 980000,
      taxonomy: "kids",
      category: "clothing",
      images: [CDN + "/da8ff99fd925.jpg", CDN + "/614b72a93d4f.jpg"],
      colors: [{ name: "سرمه‌ای", hex: "#2c3a55", available: true }],
      sizes: [
        { label: "۴", available: true },
        { label: "۶", available: true },
        { label: "۸", available: true }
      ],
      inStock: true,
      store: "اچ اند ام",
      description: "ست هودی و شلوار بچگانه با پارچه نرم و طرح خرس؛ گرم و بازیگوش.",
      details: [
        { label: "جنس", value: "نخ پنبه‌ای" },
        { label: "تعداد", value: "دو تکه" }
      ]
    },
    {
      id: "fbc9daec7b8f0a62",
      name: "کت جیر بچگانه",
      brand: "زارا",
      price: 1450000,
      taxonomy: "kids",
      category: "clothing",
      images: [CDN + "/9758a3d40b42.jpg"],
      colors: [{ name: "زرشکی", hex: "#7c2d3e", available: true }],
      sizes: [
        { label: "۱", available: true },
        { label: "۲", available: true }
      ],
      inStock: true,
      store: "زارا",
      description: "کت مخملی نوزادی با دکمه‌های پنهان؛ لطیف و امن روی پوست نوزاد.",
      details: [
        { label: "جنس", value: "مخمل" },
        { label: "گروه سنی", value: "نوزادی" }
      ]
    },
    {
      id: "acdaebfc08a713d4",
      name: "ست مراقبت از پوست",
      brand: "بیودرما",
      price: 2750000,
      taxonomy: "beauty",
      category: "accessory",
      images: [CDN + "/5845b97b1e08.jpg"],
      colors: [],
      sizes: [],
      inStock: true,
      store: "بیودرما",
      description: "ست کامل مراقبت از پوست شامل شوینده، تونر و کرم آبرسان؛ مناسب انواع پوست.",
      details: [
        { label: "تعداد", value: "۳ قلم" },
        { label: "نوع پوست", value: "همه انواع" }
      ]
    },
    {
      id: "bdaebfcd19b82",
      name: "روغن آرگان طبیعی",
      brand: "لافارر",
      price: 890000,
      taxonomy: "beauty",
      category: "accessory",
      images: [CDN + "/526c55c4600f.webp"],
      colors: [],
      sizes: [],
      inStock: true,
      store: "لافارر",
      description: "روغن آرگان خالص ارگانیک برای مو و پوست؛ مغذی و سبک، بدون سیلیکون.",
      details: [
        { label: "حجم", value: "۱۰۰ میلی‌لیتر" },
        { label: "منشأ", value: "مراکش" }
      ]
    },
    {
      id: "ceabfcde2ac93",
      name: "ست اسکین‌کر روزانه",
      brand: "لافارر",
      price: 1330000,
      oldPrice: 1900000,
      discount: 30,
      taxonomy: "beauty",
      category: "accessory",
      images: [CDN + "/995969788753.jpg"],
      colors: [],
      sizes: [],
      inStock: true,
      store: "لافارر",
      description: "ست روزانه مراقبت پوست با سرم ویتامین C و کرم شب؛ درخشندگی و آبرسانی عمیق.",
      details: [
        { label: "تعداد", value: "۴ قلم" },
        { label: "مناسب", value: "پوست خشک و معمولی" }
      ]
    }
  ];

  /* ------------------------------ export ------------------------------ */

  global.APARAT_DATA = {
    cdn: CDN,
    heroTiles: heroTiles,
    categoryCircles: categoryCircles,
    stores: stores,
    sortOptions: sortOptions,
    taxonomyTitles: taxonomyTitles,
    categoryTitles: categoryTitles,
    products: products
  };

  // unified namespace used by all page scripts
  global.APARAT = global.APARAT || {};
  global.APARAT.data = global.APARAT_DATA;
  global.APARAT.util = { faDigits: faDigits, faPrice: faPrice };
})(typeof window !== "undefined" ? window : globalThis);
