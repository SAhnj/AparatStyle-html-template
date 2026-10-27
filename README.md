# قالب استاتیک آپارات‌استایل — AparatStyle Static Template

نسخه‌ی تمیز، ماژولار و ساختارمند از طرحی که باهم طراحی کردیم — **HTML خالص + CSS/JS مستقل، بدون هیچ کدی از Next.js/React** — آماده‌ی تحویل به برنامه‌نویس برای تبدیل به قالب وردپرس.

ظاهر دقیقاً همان طرح تأییدشده است (RTL، فونت وزیرمتن، رنگ کهربایی `#F59E0B` + مشکی `#0A0A0A`) و هر بخش با **کامنت انگلیسی** مشخص شده تا تبدیل به وردپرس راحت باشد.

---

## 🚀 اجرا

هیچ نصب و بیلدی لازم نیست:

```bash
# راه ۱: مستقیم فایل index.html را در مرورگر باز کنید
# راه ۲ (پیشنهادی): یک سرور استاتیک ساده
npx serve .            # یا
python3 -m http.server 8080
```

---

## 📁 ساختار پروژه

```
aparatstyle-html/
├── index.html              صفحه اصلی (Hero + دسته‌بندی‌ها + جدیدترین‌ها + فروشگاه‌ها)
├── catalog.html            کاتالوگ همه محصولات (۲۲ کالا)
├── catalog-men.html        کاتالوگ مردانه (پیش‌فیلترشده)
├── catalog-women.html      کاتالوگ زنانه (پیش‌فیلترشده)
├── product.html            صفحه تک‌کالا (محصول نمونه: پولوشرت یقه راه‌راه)
├── cart.html               سبد خرید + تب «خرید بعدی»
├── wishlist.html           ذخیره‌های من
├── orders.html             سفارش‌های من
├── profile.html            حساب کاربری (ورود/خروج نمایشی)
├── privacy.html            سیاست‌نامه حریم خصوصی (نمونه صفحه استاتیک)
│
├── assets/
│   ├── css/                ← هر ماژول، یک فایل مستقل
│   │   ├── base.css        توکن‌های طراحی، ریست، دکمه، چیپ، اسلایدر، EmptyState، Toast
│   │   ├── header.css      نوار اعلان + هدر کامل + زیرهدر صفحات داخلی
│   │   ├── footer.css      فوتر گرد داخل‌شده
│   │   ├── product-card.css کامپوننت مشترک کارت محصول
│   │   ├── home.css        بخش‌های صفحه اصلی
│   │   ├── catalog.css     سایدبار فیلترها + گرید کاتالوگ
│   │   ├── product.css     صفحه محصول (گالری، واریانت‌ها، خدمات، آکاردئون)
│   │   ├── cart.css        سبد خرید + استپر تعداد + جمع سفارش
│   │   ├── account.css     پروفایل + کارت سفارش‌ها
│   │   └── page.css        صفحات استاتیک (حریم خصوصی) + گرید ذخیره‌ها
│   │
│   ├── js/                 ← هر ماژول، یک فایل مستقل (همه با کامنت انگلیسی)
│   │   ├── data.js         دیتاست ۲۲ محصول + محتوای صفحه اصلی (فقط برای دمو)
│   │   ├── store.js        وضعیت سبد/ذخیره/کاربر/سفارش در localStorage
│   │   ├── ui.js           رفتارهای عمومی: پنل‌های هدر، فلش اسلایدرها (RTL)، Toast، قلب‌ها، بج‌ها
│   │   ├── product.js      گالری + انتخاب طرح/سایز + افزودن به سبد + آکاردئون
│   │   ├── cart.js         رندر سبد + استپر + ثبت سفارش + تب‌ها
│   │   ├── wishlist.js     رندر صفحه ذخیره‌ها
│   │   ├── catalog.js      فیلترها/مرتب‌سازی/جستجو/قیمت (روی کارت‌های استاتیک)
│   │   └── account.js      پروفایل و سفارش‌ها
│   │
│   └── fonts/
│       └── vazirmatn-var.woff2   فونت وزیرمتن (متغیر، ۱۰۰–۹۰۰)
└── README.md
```

---

## 🧭 نقشه‌ی تبدیل به وردپرس (Section Map)

هر بخش از HTML با کامنت `<!-- SECTION: ... -->` و مسیر پیشنهادی وردپرس مشخص شده:

| بخش در HTML (کامنت انگلیسی) | فایل وردپرس پیشنهادی |
|---|---|
| `ANNOUNCEMENT BAR` | `template-parts/announcement-bar.php` (متن از Customizer) |
| `SITE HEADER` (sticky) | `header.php` — شاخه‌ی صفحه اصلی/آرشیو |
| `PAGE HEADER` (زیرهدر) | `header.php` — شاخه‌ی صفحات داخلی |
| `SITE FOOTER` | `footer.php` + `wp_nav_menu` لوکیشن `footer` |
| `HERO BANNERS` | `template-parts/section/hero.php` (تصویر شاخص دسته‌ها) |
| `CATEGORY CIRCLES` | `template-parts/section/categories.php` |
| `NEWEST PRODUCTS` | `template-parts/section/newest.php` (`WP_Query` ۸ محصول آخر) |
| `TOP STORES` | `template-parts/section/stores.php` (تاکسونومی برند + `?brand=`) |
| `PRODUCT CARD` (کامپوننت مشترک) | `template-parts/card/product.php` — یک فایل برای همه‌ی حلقه‌ها |
| `CATALOG SIDEBAR` + `PRODUCT GRID` | `woocommerce/archive-product.php` |
| `PRODUCT GALLERY / INFO / SERVICES / ACCORDIONS` | `woocommerce/single-product.php` + `template-parts/product/services.php` |
| `CART …` | شورت‌کد سبد ووکامرس + استایل `cart.css` |
| `WISHLIST GRID` | `template-wishlist.php` (AJAX یا افزونه) |
| `ORDERS / PROFILE` | اندپوینت‌های My Account ووکامرس |
| `PRIVACY POLICY` | `page.php` + `the_content()` |

💡 **نکته:** پوشه‌ی `wordpress-theme/aparatstyle/` (بسته‌ی قبلی) یک پیاده‌سازی کامل از همین نقشه است و می‌تواند مرجع مستقیم برنامه‌نویس باشد؛ نام کلاس‌ها (`ap-*`) بین هر دو نسخه هماهنگ است.

---

## 🎨 سیستم طراحی (base.css)

همه‌ی توکن‌ها در `:root` فایل `assets/css/base.css`:

```css
--ink: #0a0a0a        /* مشکی اصلی */
--surface: #f6f6f6    /* خاکستری باکس‌ها */
--amber: #f59e0b      /* نوار اعلان */
--radius-xl: 24px     /* rounded-3xl */
--container: 1400px
```

- جهت کل سایت `dir="rtl"` است؛ CSS از propertyهای منطقی (`padding-inline`) استفاده می‌کند.
- **اسلایدرها**: کلاس `.scroller` عمداً `overflow-y: hidden` دارد تا مشکل اسکرول‌بار عمودیِ ۱ پیکسلی (که قبلاً گزارش کردید) در هیچ مرورگری تکرار نشود. این الگو را در وردپرس هم حفظ کنید.
- فونت: وزیرمتن متغیر به‌صورت لوکال + `font-feature-settings: "ss02"`.

---

## 📦 آیکون‌ها

همه‌ی آیکون‌ها **SVG اینلاین (Lucide)** هستند — هیچ وابستگی خارجی وجود ندارد. در وردپرس می‌توانید همان SVGها را در یک تابع کمکی (`aparatstyle_icon()` در پوشه‌ی inc قالب مرجع) central کنید.

---

## 🧪 اسکریپت‌ها — چه چیزی بعد از وردپرس حذف می‌شود؟

| فایل | نقش | بعد از وردپرس |
|---|---|---|
| `data.js` | دیتاست دمو | ❌ حذف (محصول از ووکامرس می‌آید) |
| `store.js` | سبد/ذخیره در localStorage | ❌ حذف (ووکامرس Session) |
| `cart.js` | رندر سبد دمو | ❌ حذف |
| `wishlist.js` | رندر ذخیره‌ها | ❌ حذف (AJAX/افزونه) |
| `catalog.js` | فیلترهای کلاینتی | ❌ حذف (فیلتر با URL واقعی) |
| `account.js` | لاگین/سفارش دمو | ❌ حذف (My Account) |
| `product.js` | گالری/واریانت دمو | ❌ حذف (گالری و فرم ووکامرس) |
| `ui.js` | پنل هدر، فلش اسلایدرها، Toast | ✅ نگه دارید (بخش ۱–۴ آن عمومی است) |

---

## 🔧 بازسازی صفحات (اختیاری)

فایل‌های HTML با اسکریپت `tools/build-html.mjs` (داخل بسته‌ی پروژه‌ی اصلی) از پارشیال‌های مشترک ساخته می‌شوند تا هدر/فوتر/کارت محصول در همه‌ی صفحات یکسان بماند:

```bash
bun tools/build-html.mjs
```

برای تحویل به برنامه‌نویس نیازی به این اسکریپت نیست — خروجی HTML نهایی همین پوشه است.

---

## ✅ پوشش صفحات (۹ صفحه‌ی طرح اصلی)

| صفحه | فایل |
|---|---|
| `/` | `index.html` |
| `/catalog` | `catalog.html` |
| `/catalog?taxonomy=men` | `catalog-men.html` (و `?taxonomy=women` با پارامتر URL هم کار می‌کند) |
| `/product/7e778e0285858f39` | `product.html` |
| `/cart` | `cart.html` |
| `/wishlist` | `wishlist.html` |
| `/orders` | `orders.html` |
| `/profile` | `profile.html` |
| `/p/privacy-policy` | `privacy.html` |
