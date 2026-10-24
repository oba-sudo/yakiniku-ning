import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const routes = JSON.parse(fs.readFileSync(path.join(dist, "manus-routes.json"), "utf8")).routes;
const stores = JSON.parse(fs.readFileSync(path.join(root, "src/data/stores.json"), "utf8")).stores;
const storeLinks = JSON.parse(fs.readFileSync(path.join(root, "src/data/store-links.json"), "utf8"));
const requiredAssets = [
  "images/nintoki-logo.png", "images/favicon.png", "images/apple-touch-icon.png",
  "images/signature-negi-tan.jpg", "images/signature-yukhoe-kimbap.jpg", "images/signature-tan-yukhoe.jpg",
  "images/tan-comparison.jpg", "images/store-nihonbashi.png", "images/store-umeda-higashidori.webp",
  "media/nintoki-interior.mp4",
];
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(dist, asset))) throw new Error(`Missing repository asset in dist: ${asset}`);
}
for (const asset of requiredAssets.filter((asset) => asset.startsWith("images/"))) {
  if (!fs.existsSync(path.join(dist, "public", asset))) throw new Error(`Missing image asset in dist/public: ${asset}`);
}

const expectedBaseRoutes = ["/", "/concept/", "/stores/", "/news/", "/recruit/", "/company/", "/contact/", "/faq/"];
const paths = new Set(routes.map(({ path: pagePath }) => pagePath));
for (const pagePath of expectedBaseRoutes) {
  if (!paths.has(pagePath)) throw new Error(`Missing required route: ${pagePath}`);
}
for (const store of stores) {
  const pagePath = `/stores/${store.slug}/`;
  if (!paths.has(pagePath)) throw new Error(`Missing store route: ${pagePath}`);
  const html = fs.readFileSync(path.join(dist, "stores", store.slug, "index.html"), "utf8");
  if (!html.includes('"@type":"Restaurant"')) throw new Error(`Missing Restaurant JSON-LD: ${store.slug}`);
  if (!html.includes('"@type":"BreadcrumbList"')) throw new Error(`Missing BreadcrumbList JSON-LD: ${store.slug}`);
  if (!html.includes(store.name)) throw new Error(`Missing visible store name: ${store.slug}`);
  if (!html.includes("支払い方法を教えてください。")) throw new Error(`Missing payment FAQ: ${store.slug}`);
  if (!html.includes("現金・クレジットカードをご利用いただけます。")) throw new Error(`Missing payment answer: ${store.slug}`);
  if (!html.includes(storeLinks[store.slug].reservationUrl)) throw new Error(`Missing reservation URL: ${store.slug}`);
  if (!html.includes("ネット予約")) throw new Error(`Missing reservation CTA: ${store.slug}`);
}
if (routes.length !== expectedBaseRoutes.length + stores.length) throw new Error(`Unexpected route count: ${routes.length}`);
const homepage = fs.readFileSync(path.join(dist, "index.html"), "utf8");
if (!homepage.includes("https://www.yakiniku-like.com/2026/08/25/yoru-lunch-bangohan/")) throw new Error("Missing first campaign target URL");
if (!(homepage.indexOf("home-updates") < homepage.indexOf("signature-strip"))) throw new Error("Campaign/news must precede signature menu");
if (!homepage.includes("/images/nintoki-logo.png")) throw new Error("Homepage does not reference the local logo asset");
const textFiles = ["styles.css", "site.js", ...routes.map(({ path: pagePath }) => pagePath === "/" ? "index.html" : `${pagePath.slice(1)}index.html`)];
for (const file of textFiles) {
  const output = fs.readFileSync(path.join(dist, file), "utf8");
  if (output.includes("/manus-storage/")) throw new Error(`External Manus storage reference remains in ${file}`);
}
console.log(`Verified ${stores.length} stores, ${routes.length} public routes, and repository-hosted visual assets.`);
