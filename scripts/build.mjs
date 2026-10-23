import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const storeData = JSON.parse(fs.readFileSync(path.join(root, "src/data/stores.json"), "utf8"));
const storeLinks = JSON.parse(fs.readFileSync(path.join(root, "src/data/store-links.json"), "utf8"));
const content = JSON.parse(fs.readFileSync(path.join(root, "src/data/content.json"), "utf8"));
const stores = storeData.stores.map((store) => ({ ...store, ...storeLinks[store.slug] }));
const siteUrl = (process.env.SITE_URL || "").trim().replace(/\/$/, "");

const assets = {
  logo: "/manus-storage/nintoki_official_logo_33543b83.png",
  thickTan: "/manus-storage/menu_thick_negi_tan_bb85ada8.jpg",
  kimbap: "/manus-storage/menu_yukhoe_kimbap_50820597.jpg",
  tanYukhoe: "/manus-storage/menu_tan_yukhoe_a3f167bd.jpg",
  tanComparison: "/manus-storage/menu_tan_comparison_aae9ee6b.jpg",
  nihonbashi: "/manus-storage/nintoki_nihonbashi_exterior_1fd16f33.png",
  umeda: "/manus-storage/nintoki_umeda_exterior_ae800c63.webp",
  interiorVideo: "/manus-storage/nintoki_video_01_cb90386c.mp4",
};
const brand = { name: "YAKINIKUEN 忍鬨", instagram: "https://www.instagram.com/yakinikuen_ning/", line: "" };
const primaryNavigation = [
  ["/", "ホーム"], ["/concept/", "コンセプト"], ["/stores/", "店舗・メニュー"],
  ["/news/", "お知らせ"], ["/recruit/", "採用"], ["/company/", "会社概要"], ["/contact/", "お問い合わせ"],
];
const globalFaqs = [
  ["忍鬨はどんな焼肉店ですか？", "精肉店卸直営を強みとし、鮮度と質にこだわった国産牛を、肉好きが納得できる価格で提供する焼肉店です。大阪府内に8店舗あります。"],
  ["忍鬨の看板メニューは何ですか？", "元祖厚切りネギ包みタン、元祖ユッケ載せキンパ、タンユッケ、牛タン食べ比べセットが代表的な看板メニューです。取扱いは店舗により異なる場合があります。"],
  ["店舗ごとにメニューは異なりますか？", "はい。店舗によってメニュー、価格、取扱い状況が異なる場合があります。ご利用予定の店舗ページで最新の掲載内容をご確認ください。"],
  ["予約はできますか？", "各店舗ページの電話番号から直接お問い合わせいただけます。席やコース、当日の空席については店舗へご確認ください。"],
  ["営業時間・定休日はどこで確認できますか？", "各店舗ページの「基本情報」に営業時間と定休日を掲載しています。臨時変更がある場合は、店舗へ事前にお問い合わせください。"],
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}
function nl2br(value = "") { return escapeHtml(value).replace(/&lt;br&gt;/g, "<br>"); }
function absolute(urlPath) { return siteUrl ? `${siteUrl}${urlPath}` : ""; }
function write(file, page) { const target = path.join(dist, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, page, "utf8"); }
function jsonScript(value) { return `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, "\\u003c")}</script>`; }
function pageRoot(pagePath) { return "../".repeat(pagePath.split("/").filter(Boolean).length); }
function imageForStore(store) {
  if (store.slug === "nihonbashi") return assets.nihonbashi;
  if (store.slug === "umeda-higashidori") return assets.umeda;
  if (store.slug === "osaka-umeda") return assets.tanComparison;
  return assets.thickTan;
}
function dateLabel(date) { return date.replaceAll("-", "."); }
function pageMeta({ title, description, path: pagePath, image = assets.thickTan, keywords }) {
  const canonical = absolute(pagePath);
  const imageUrl = absolute(image);
  const canonicalTags = canonical ? `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}">` : "";
  const imageTags = imageUrl ? `<meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image">` : `<meta name="twitter:card" content="summary">`;
  return `<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="keywords" content="${escapeHtml(keywords)}">
<meta name="robots" content="index,follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(brand.name)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
${canonicalTags}
${imageTags}
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">`;
}
function header(activePath) {
  const links = primaryNavigation.map(([href, label]) => `<a href="${href}" ${activePath === href || (href === "/stores/" && activePath.startsWith("/stores/")) ? "aria-current=\"page\"" : ""}>${label}</a>`).join("");
  return `<header class="site-header"><div class="utility"><span>精肉店卸直営　肉好きが納得する焼肉店</span><a href="${brand.instagram}" target="_blank" rel="noopener">Instagram</a></div><div class="nav-wrap"><a class="brand" href="/"><img src="${assets.logo}" alt="YAKINIKUEN 忍鬨"></a><button class="menu-toggle" type="button" aria-label="メニューを開く" aria-expanded="false"><i></i><i></i><i></i></button><nav class="main-nav" aria-label="メインナビゲーション">${links}</nav></div></header>`;
}
function footer() {
  const links = primaryNavigation.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  return `<footer class="site-footer"><div class="footer-main"><a href="/" class="footer-logo"><img src="${assets.logo}" alt="YAKINIKUEN 忍鬨"></a><div><h2>YAKINIKUEN 忍鬨</h2><p>精肉店卸直営。肉好きが、納得する。</p><div class="footer-links">${links}<a href="/faq/">よくある質問</a><a href="${brand.instagram}" target="_blank" rel="noopener">Instagram</a></div></div></div><small>© YAKINIKUEN 忍鬨 All Rights Reserved.</small></footer>`;
}
function layout({ title, description, pagePath, image, keywords, body, structuredData = [] }) {
  const rootPrefix = pageRoot(pagePath);
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${pageMeta({ title, description, path: pagePath, image, keywords })}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&family=Oswald:wght@500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="${rootPrefix}styles.css">${structuredData.map(jsonScript).join("")}</head><body>${header(pagePath)}${body}${footer()}<script src="${rootPrefix}site.js" defer></script></body></html>`;
}
function breadcrumbs(store) {
  const entries = [["ホーム", "/"], ["店舗・メニュー", "/stores/"], [store.name, `/stores/${store.slug}/`]];
  const itemListElement = entries.map(([name, href], index) => ({ "@type": "ListItem", position: index + 1, name, ...(siteUrl ? { item: absolute(href) } : {}) }));
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement };
}
function restaurantSchema(store) {
  const pagePath = `/stores/${store.slug}/`;
  const result = { "@context": "https://schema.org", "@type": "Restaurant", name: store.name, telephone: store.telephoneInternational, priceRange: "¥¥", servesCuisine: ["焼肉", "和牛"], address: { "@type": "PostalAddress", streetAddress: store.address, addressLocality: store.addressLocality, addressRegion: store.addressRegion, postalCode: `〒${store.postalCode}`, addressCountry: "JP" }, openingHoursSpecification: store.openingHoursSchema.map((hours) => ({ "@type": "OpeningHoursSpecification", ...hours })), hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.address}`)}`, acceptsReservations: true, sameAs: [brand.instagram] };
  if (siteUrl) Object.assign(result, { "@id": `${absolute(pagePath)}#restaurant`, url: absolute(pagePath), image: [absolute(imageForStore(store))], menu: `${absolute(pagePath)}#menu` });
  return result;
}
function storeFaqs(store) {
  const menuAnswer = store.menuStatus === "available" ? `はい。${store.name}のページ内に、提供資料をもとにした${store.menuItemCount}品目のメニューを掲載しています。内容や価格は変更される場合があります。` : `現在、${store.name}のメニュー資料は掲載準備中です。最新の取扱いは店舗へ直接お問い合わせください。`;
  return [["営業時間を教えてください。", `${store.name}の営業時間は、${store.openingHoursText.replace(/<br>/g, " ")}です。`], ["定休日はありますか？", `定休日は${store.closedText}です。臨時変更の可能性があるため、ご来店前に電話でご確認ください。`], ["最寄駅からのアクセスを教えてください。", store.access], ["メニューは確認できますか？", menuAnswer], ["支払い方法を教えてください。", "お支払いは現金・クレジットカードをご利用いただけます。PayPayなどのQRコード決済には対応していません。"], ["予約・問い合わせはどこからできますか？", `各店舗ページの「ネット予約」ボタン、またはお電話（${store.telephone}）でお問い合わせいただけます。`]];
}
function faqItems(items) { return items.map(([question, answer]) => `<details><summary>${escapeHtml(question)}<span>+</span></summary><div class="faq-answer">${nl2br(answer)}</div></details>`).join(""); }
function campaignCards() {
  return content.campaigns.map((item, index) => `<a class="campaign-card campaign-card-${index + 1}" href="${item.url}" ${item.external ? "target=\"_blank\" rel=\"noopener\"" : ""}><img src="${item.image}" alt="${escapeHtml(item.title)}"><span class="campaign-overlay"><small>CAMPAIGN</small><strong>${escapeHtml(item.title)}</strong></span></a>`).join("");
}
function newsList(items, className = "news-list") {
  return `<ul class="${className}">${items.map((item) => `<li><time datetime="${item.publishedAt}">${dateLabel(item.publishedAt)}</time><span class="news-category">${escapeHtml(item.category || "キャンペーン")}</span><a href="${item.url}" ${item.external ? "target=\"_blank\" rel=\"noopener\"" : ""}>${escapeHtml(item.title)}　<span aria-hidden="true">→</span></a></li>`).join("")}</ul>`;
}
function storeCard(store) {
  const image = imageForStore(store);
  return `<article class="store-card"><a href="/stores/${store.slug}/" aria-label="${escapeHtml(store.name)}の詳細を見る"><div class="store-card-image" style="background-image:url('${image}')"></div><div class="store-card-body"><p class="store-card-kicker">OSAKA / ${escapeHtml(store.addressLocality)}</p><h2>${escapeHtml(store.name.replace("YAKINIKUEN 忍鬨 ", ""))}</h2><p>${escapeHtml(store.access)}</p><span>店舗詳細を見る　→</span></div></a></article>`;
}
function homePage() {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: brand.name, sameAs: [brand.instagram] };
  if (siteUrl) Object.assign(organization, { "@id": `${siteUrl}/#organization`, url: `${siteUrl}/`, logo: absolute(assets.logo) });
  const campaignNews = `<section class="home-updates"><div class="campaign-rail">${campaignCards()}</div><div class="update-columns"><section><div class="home-section-title"><p>CAMPAIGN</p><h2>キャンペーン情報</h2></div>${newsList(content.campaigns, "home-feed")}</section><section><div class="home-section-title"><p>TOPICS</p><h2>最新情報</h2></div>${newsList(content.news, "home-feed")}</section></div></section>`;
  return layout({ title: "YAKINIKUEN 忍鬨｜大阪8店舗の精肉店卸直営焼肉店", description: "精肉店卸直営の焼肉店・YAKINIKUEN 忍鬨。大阪8店舗の店舗情報、メニュー、アクセス、営業時間、お知らせをご案内します。", pagePath: "/", image: assets.thickTan, keywords: "忍鬨,焼肉,大阪,精肉店卸直営,牛タン,店舗一覧", structuredData: [organization], body: `<main><section class="home-hero" style="background-image:url('${assets.thickTan}')"><video class="hero-video" muted autoplay loop playsinline preload="metadata" poster="${assets.thickTan}"><source src="${assets.interiorVideo}" type="video/mp4"></video><div class="hero-shade"></div><div class="hero-copy"><img src="${assets.logo}" alt="YAKINIKUEN 忍鬨"><p>精肉店卸直営</p><h1>肉好きが、<br>納得する。</h1><a class="button button-light" href="/stores/">お近くの店舗を探す</a></div></section>${campaignNews}<section class="signature-strip"><a href="/stores/"><img src="${assets.thickTan}" alt="元祖厚切りネギ包みタン"><span><small>SIGNATURE 01</small>元祖厚切りネギ包みタン</span></a><a href="/stores/"><img src="${assets.kimbap}" alt="元祖ユッケ載せキンパ"><span><small>SIGNATURE 02</small>元祖ユッケ載せキンパ</span></a><a href="/stores/"><img src="${assets.tanYukhoe}" alt="タンユッケ"><span><small>SIGNATURE 03</small>タンユッケ</span></a></section><section class="intro-section"><div><p class="eyebrow">QUALITY × COST PERFORMANCE</p><h2>精肉店卸直営だから、<br>肉の価値にまっすぐ。</h2></div><p>鮮度と品質にこだわった国産牛を、肉好きが納得できる一皿へ。ご利用のシーンに合わせて選べる、大阪8店舗の忍鬨へお越しください。</p></section><section class="content-section stores-overview"><div class="section-heading"><div><p class="eyebrow">SHOP & MENU</p><h2>店舗・メニュー</h2></div><a href="/stores/" class="text-link">全店舗を見る　→</a></div><div class="store-grid">${stores.map(storeCard).join("")}</div></section></main>` });
}
function conceptPage() {
  return layout({ title: "コンセプト｜YAKINIKUEN 忍鬨", description: "精肉店卸直営のYAKINIKUEN 忍鬨。肉好きが納得できる品質とコストパフォーマンスに込めた想いをご紹介します。", pagePath: "/concept/", image: assets.tanComparison, keywords: "忍鬨 コンセプト,精肉店卸直営,焼肉,牛タン,大阪", body: `<main><section class="concept-hero" style="background-image:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35)),url('${assets.tanComparison}')"><div><img src="${assets.logo}" alt="忍鬨"><p>CONCEPT</p><h1>忍鬨の想い</h1><span></span></div></section><section class="concept-lead"><p class="eyebrow">QUALITY × COST PERFORMANCE</p><h2>肉好きが、<br>心から納得できる焼肉を。</h2><p>精肉店卸直営だからこそ、肉を見極め、品質にこだわり、その価値をまっすぐにお届けします。忍鬨は、一皿の驚きと、また食べたくなる満足感を大切にする焼肉店です。</p></section><section class="concept-points"><article><p>01</p><h3>精肉店卸直営</h3><span>仕入れから品質まで、肉と真摯に向き合う。</span></article><article><p>02</p><h3>肉の価値にまっすぐ</h3><span>鮮度・質・価格。そのすべてに妥協しない。</span></article><article><p>03</p><h3>記憶に残る名物</h3><span>牛タンをはじめ、忍鬨でしか味わえない一皿を。</span></article></section><section class="content-section signature-feature"><img src="${assets.thickTan}" alt="元祖厚切りネギ包みタン"><div><p class="eyebrow">SIGNATURE MENU</p><h2>元祖厚切り<br>ネギ包みタン</h2><p>肉の旨みと、香り豊かなねぎの一体感。忍鬨を象徴する看板メニューです。</p><a class="button button-red" href="/stores/">店舗・メニューを見る</a></div></section></main>` });
}
function storesPage() {
  const storeList = stores.map((store) => `<article class="store-directory-item"><h2>${escapeHtml(store.name.replace("YAKINIKUEN 忍鬨 ", ""))}</h2><p>${escapeHtml(store.address)}</p><div class="directory-actions"><span class="line-placeholder" aria-label="LINE公式アカウントは準備中">LINE</span><a href="/stores/${store.slug}/">店舗情報</a><a href="/stores/${store.slug}/#menu">メニュー</a><a class="directory-reserve" href="${store.reservationUrl}" target="_blank" rel="noopener">ネット予約</a></div></article>`).join("");
  return layout({ title: "店舗・メニュー｜YAKINIKUEN 忍鬨 大阪8店舗", description: "YAKINIKUEN 忍鬨の全8店舗をご案内します。各店舗の住所、営業時間、アクセス、メニュー、Googleマップ、電話番号をご確認いただけます。", pagePath: "/stores/", image: assets.umeda, keywords: "忍鬨 店舗,大阪 焼肉,心斎橋 焼肉,梅田 焼肉,日本橋 焼肉", body: `<main><section class="directory-hero"><p class="eyebrow">SHOP & MENU</p><h1>店舗・メニュー</h1><p>大阪8店舗。お近くの忍鬨をお選びください。</p></section><section class="store-directory">${storeList}</section></main>` });
}
function storePage(store) {
  const pagePath = `/stores/${store.slug}/`;
  const shortName = store.name.replace("YAKINIKUEN 忍鬨 ", "");
  const description = `${store.name}の店舗情報です。住所、電話番号、営業時間、アクセス、メニュー、Googleマップ、よくある質問をご案内します。`;
  const categories = Object.entries(Object.groupBy(store.menu, ({ category }) => category));
  const menuHtml = store.menuStatus === "pending" ? `<p class="notice">現在、公式メニュー資料を確認中です。最新の取扱い・価格は店舗へ直接お問い合わせください。</p>` : categories.map(([category, entries]) => `<details class="menu-group" ${category === "名物" ? "open" : ""}><summary>${escapeHtml(category)} <span>${entries.length}品　＋</span></summary><ul>${entries.map((item) => `<li><div><strong>${escapeHtml(item.name)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}</div><b>${item.price ? `¥${item.price.toLocaleString()}` : "価格は店頭でご確認ください"}</b></li>`).join("")}</ul></details>`).join("");
  const mapQuery = encodeURIComponent(`${store.name} ${store.address}`);
  const reservationLink = `<a class="contact-action reserve" href="${store.reservationUrl}" target="_blank" rel="noopener">ネット予約（空席確認）　↗</a>`;
  const lineLink = brand.line ? `<a class="contact-action line" href="${brand.line}" target="_blank" rel="noopener">LINE公式アカウント</a>` : `<span class="contact-action disabled">LINE公式アカウントは公開準備中</span>`;
  return layout({ title: `${store.name}｜${store.addressLocality}の焼肉店`, description, pagePath, image: imageForStore(store), keywords: `${shortName},忍鬨,${store.addressLocality},焼肉,牛タン,和牛`, structuredData: [restaurantSchema(store), breadcrumbs(store)], body: `<main><section class="store-hero" style="background-image:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.16)),url('${imageForStore(store)}')"><div><p class="eyebrow">YAKINIKUEN NING / OSAKA</p><h1>${escapeHtml(shortName)}</h1><p>${escapeHtml(store.access)}</p><div class="hero-actions"><a class="button button-light" href="tel:${escapeHtml(store.telephone)}">電話する　${escapeHtml(store.telephone)}</a><a class="button button-reserve" href="${store.reservationUrl}" target="_blank" rel="noopener">ネット予約　↗</a></div></div></section><nav class="local-nav" aria-label="${escapeHtml(shortName)}のページ内ナビ"><a href="#information">基本情報</a><a href="#menu">メニュー</a><a href="#access">アクセス</a><a href="#instagram">Instagram</a><a href="#faq">Q&A</a></nav><section class="content-section" id="information"><div class="section-heading"><div><p class="eyebrow">STORE INFORMATION</p><h2>${escapeHtml(shortName)}の基本情報</h2></div></div><div class="info-layout"><dl class="store-info"><div><dt>店舗名</dt><dd>${escapeHtml(store.name)}</dd></div><div><dt>住所</dt><dd>〒${escapeHtml(store.postalCode)}<br>${escapeHtml(store.address)}</dd></div><div><dt>電話番号</dt><dd><a href="tel:${escapeHtml(store.telephone)}">${escapeHtml(store.telephone)}</a></dd></div><div><dt>営業時間</dt><dd>${nl2br(store.openingHoursText)}</dd></div><div><dt>定休日</dt><dd>${escapeHtml(store.closedText)}</dd></div><div><dt>アクセス</dt><dd>${escapeHtml(store.access)}</dd></div></dl><aside class="contact-panel"><p>ご予約・お問い合わせ</p><a class="contact-phone" href="tel:${escapeHtml(store.telephone)}">${escapeHtml(store.telephone)}</a>${reservationLink}<a class="contact-action instagram" href="${brand.instagram}" target="_blank" rel="noopener">Instagramを見る</a>${lineLink}</aside></div></section><section class="content-section tone-section" id="menu"><div class="section-heading"><div><p class="eyebrow">MENU</p><h2>${escapeHtml(shortName)}のメニュー</h2></div><p class="menu-source">メニュー資料：${escapeHtml(store.menuSource)}<br>最終確認：${escapeHtml(store.verifiedDate)}</p></div>${menuHtml}</section><section class="content-section" id="access"><div class="section-heading"><div><p class="eyebrow">ACCESS</p><h2>地図・アクセス</h2></div><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noopener">Googleマップで開く　→</a></div><div class="map-wrap"><iframe title="${escapeHtml(store.name)}の地図" src="https://www.google.com/maps?q=${mapQuery}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></section><section class="content-section store-instagram" id="instagram"><div class="instagram-panel"><div><p class="eyebrow">OFFICIAL INSTAGRAM</p><h2>忍鬨のInstagram</h2><p>看板メニュー、店舗の最新情報、焼肉をもっと楽しむための情報を発信しています。</p><p class="instagram-handle">@yakinikuen_ning</p></div><a class="button button-instagram" href="${brand.instagram}" target="_blank" rel="noopener">Instagramを見る　↗</a></div></section><section class="content-section latest-info"><div class="section-heading"><div><p class="eyebrow">LATEST INFORMATION</p><h2>最新情報</h2></div><a href="/news/" class="text-link">お知らせ一覧　→</a></div>${newsList(content.news.slice(0, 2))}</section><section class="content-section faq-section" id="faq"><div class="section-heading"><div><p class="eyebrow">Q&A</p><h2>${escapeHtml(shortName)}について</h2></div><a href="/faq/" class="text-link">全体Q&Aを見る　→</a></div><div class="faq-list">${faqItems(storeFaqs(store))}</div></section></main>` });
}
function newsPage() {
  return layout({ title: "お知らせ｜YAKINIKUEN 忍鬨", description: "YAKINIKUEN 忍鬨の最新情報とキャンペーン情報をご案内します。", pagePath: "/news/", image: assets.kimbap, keywords: "忍鬨 お知らせ,忍鬨 キャンペーン,大阪 焼肉", body: `<main><section class="page-hero"><p class="eyebrow">NEWS</p><h1>お知らせ</h1><p>キャンペーン情報、店舗情報、最新のお知らせを掲載します。</p></section><section class="content-section news-archive"><div class="section-heading"><div><p class="eyebrow">CAMPAIGN</p><h2>キャンペーン情報</h2></div></div><div class="campaign-archive">${campaignCards()}</div></section><section class="content-section"><div class="section-heading"><div><p class="eyebrow">TOPICS</p><h2>最新情報</h2></div></div>${newsList(content.news)}</section></main>` });
}
function placeholderPage({ path: pagePath, title, eyebrow, headline, description, action }) {
  return layout({ title: `${title}｜YAKINIKUEN 忍鬨`, description, pagePath, image: assets.umeda, keywords: `忍鬨 ${title},大阪 焼肉`, body: `<main><section class="page-hero"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></section><section class="placeholder-page"><div><p class="eyebrow">COMING SOON</p><h2>${headline}</h2><p>ただいま情報を準備しています。最新の内容は、このページでお知らせします。</p>${action || ""}</div></section></main>` });
}
function contactPage() {
  return layout({ title: "お問い合わせ｜YAKINIKUEN 忍鬨", description: "YAKINIKUEN 忍鬨への店舗予約・お問い合わせをご案内します。", pagePath: "/contact/", image: assets.nihonbashi, keywords: "忍鬨 お問い合わせ,忍鬨 予約,大阪 焼肉", body: `<main><section class="page-hero"><p class="eyebrow">CONTACT</p><h1>お問い合わせ</h1><p>店舗へのお問い合わせ・ご予約についてご案内します。</p></section><section class="placeholder-page"><div><p class="eyebrow">RESERVATION</p><h2>ご予約・店舗への<br>お問い合わせ</h2><p>当日の空席、予約、店舗のご利用に関するお問い合わせは、各店舗へ直接お電話ください。</p><a class="button button-red" href="/stores/">店舗・メニューを見る</a></div></section></main>` });
}
function faqPage() { return layout({ title: "よくある質問｜YAKINIKUEN 忍鬨", description: "YAKINIKUEN 忍鬨の店舗、看板メニュー、予約、営業時間、アクセスに関するよくある質問をご案内します。", pagePath: "/faq/", image: assets.tanYukhoe, keywords: "忍鬨 FAQ,忍鬨 予約,忍鬨 メニュー,大阪 焼肉", body: `<main><section class="page-hero"><p class="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h1>よくある質問</h1><p>忍鬨全体と店舗のご利用についてお答えします。</p></section><section class="content-section faq-section"><div class="faq-list">${faqItems(globalFaqs)}</div><p class="faq-note">店舗ごとの営業時間、定休日、アクセス、メニューは各店舗ページでご確認ください。</p><a href="/stores/" class="button button-red">店舗・メニューを見る</a></section></main>` }); }

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
write("styles.css", fs.readFileSync(path.join(root, "src/site.css"), "utf8"));
write("site.js", fs.readFileSync(path.join(root, "src/site.js"), "utf8"));
write("index.html", homePage());
write("concept/index.html", conceptPage());
write("stores/index.html", storesPage());
write("news/index.html", newsPage());
write("recruit/index.html", placeholderPage({ path: "/recruit/", title: "採用", eyebrow: "RECRUIT", headline: "採用情報", description: "YAKINIKUEN 忍鬨の採用情報をご案内します。" }));
write("company/index.html", placeholderPage({ path: "/company/", title: "会社概要", eyebrow: "COMPANY", headline: "会社概要", description: "YAKINIKUEN 忍鬨の会社情報をご案内します。" }));
write("contact/index.html", contactPage());
write("faq/index.html", faqPage());
for (const store of stores) write(`stores/${store.slug}/index.html`, storePage(store));
const routes = [{ path: "/", title: "ホーム" }, { path: "/concept/", title: "コンセプト" }, { path: "/stores/", title: "店舗・メニュー" }, { path: "/news/", title: "お知らせ" }, { path: "/recruit/", title: "採用" }, { path: "/company/", title: "会社概要" }, { path: "/contact/", title: "お問い合わせ" }, { path: "/faq/", title: "よくある質問" }, ...stores.map((store) => ({ path: `/stores/${store.slug}/`, title: store.name }))];
write("manus-routes.json", JSON.stringify({ routes }, null, 2));
write("robots.txt", ["User-agent: *", "Allow: /", "Disallow: /api/*", ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : [])].join("\n") + "\n");
const sitemap = siteUrl ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(({ path: itemPath }) => `  <url><loc>${siteUrl}${itemPath}</loc><lastmod>2026-10-23</lastmod></url>`).join("\n")}\n</urlset>\n` : `<?xml version="1.0" encoding="UTF-8"?>\n<!-- SITE_URL must be set to the real public HTTPS origin before deployment. -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;
write("sitemap.xml", sitemap);
write("SEO_DEPLOYMENT_CHECKLIST.txt", "Set SITE_URL to the final public HTTPS origin, rebuild, and verify canonical tags, og:url, Restaurant JSON-LD URLs, sitemap.xml, and robots.txt before publication. After publication, test that public URLs return HTTP 200 (not 403) and validate sample pages in Google Search Console URL Inspection and Rich Results Test.\n");
console.log(`Built ${routes.length} static SEO routes in ${dist}${siteUrl ? ` for ${siteUrl}` : " without a public origin"}.`);
