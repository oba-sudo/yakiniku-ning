import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const routes = JSON.parse(fs.readFileSync(path.join(dist, "manus-routes.json"), "utf8")).routes;
const stores = JSON.parse(fs.readFileSync(path.join(root, "src/data/stores.json"), "utf8")).stores;
const storeLinks = JSON.parse(fs.readFileSync(path.join(root, "src/data/store-links.json"), "utf8"));

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
console.log(`Verified ${stores.length} stores and ${routes.length} public routes.`);
