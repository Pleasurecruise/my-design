import { readFile, writeFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import { sharingPages } from "../src/lib/metadata.ts";
import { escapeHtml, siteUrl } from "./site-metadata.ts";
import content from "../src/content/showcase.json" with { type: "json" };

const root = new URL("../", import.meta.url);
const font = async (path: string) =>
  `data:font/woff2;base64,${(await readFile(new URL(`node_modules/${path}`, root))).toString("base64")}`;
const geist = await font("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2");
const lora = await font("@fontsource-variable/lora/files/lora-latin-wght-normal.woff2");
let chineseFont = await readFile(
  new URL("node_modules/@fontsource-variable/noto-serif-sc/wght.css", root),
  "utf8",
);
for (const match of chineseFont.matchAll(/url\(([^)]+)\)/g)) {
  const path = match[1].replaceAll(/["']/g, "").replace(/^\.\//, "");
  chineseFont = chineseFont.replace(
    match[0],
    `url("${await font(`@fontsource-variable/noto-serif-sc/${path}`)}")`,
  );
}
const palette = await readFile(new URL("src/styles/palette.css", root), "utf8");
const tokens = (await readFile(new URL("src/styles/tokens.css", root), "utf8")).replace(
  '@import "./palette.css";',
  "",
);
const avatar = (await readFile(new URL(`public${content.oc.portrait.src}`, root))).toString(
  "base64",
);
await mkdir(new URL("public/og/", root), { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<!doctype html><html><head><style>
    html,body { margin:0; width:100%; height:100%; }
    img { display:block; width:100%; height:100%; object-fit:contain; }
    </style></head><body><img src="data:image/png;base64,${avatar}" alt=""></body></html>`);
  await page.evaluate(() => Promise.all(Array.from(document.images, (img) => img.decode())));
  for (const icon of [
    { size: 180, name: "apple-touch-icon.png" },
    { size: 192, name: "icon-192.png" },
    { size: 512, name: "icon-512.png" },
  ]) {
    await page.setViewportSize({ width: icon.size, height: icon.size });
    await page.screenshot({ path: new URL(`public/${icon.name}`, root).pathname });
  }
  const iconSizes = [16, 32, 48];
  const iconHeader = Buffer.alloc(6 + 16 * iconSizes.length);
  iconHeader.writeUInt16LE(1, 2);
  iconHeader.writeUInt16LE(iconSizes.length, 4);
  const iconImages: Buffer[] = [];
  let iconOffset = iconHeader.length;
  for (const [index, size] of iconSizes.entries()) {
    await page.setViewportSize({ width: size, height: size });
    const png = await page.screenshot({ type: "png" });
    const entry = 6 + index * 16;
    iconHeader[entry] = size;
    iconHeader[entry + 1] = size;
    iconHeader.writeUInt16LE(1, entry + 4);
    iconHeader.writeUInt16LE(32, entry + 6);
    iconHeader.writeUInt32LE(png.length, entry + 8);
    iconHeader.writeUInt32LE(iconOffset, entry + 12);
    iconImages.push(png);
    iconOffset += png.length;
  }
  await writeFile(new URL("public/favicon.ico", root), Buffer.concat([iconHeader, ...iconImages]));
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(`<!doctype html><html lang="en"><head><style>
  ${palette}${tokens}${chineseFont}
  @font-face { font-family: Geist; src: url("${geist}"); font-weight:100 900; }
  @font-face { font-family: Lora; src: url("${lora}"); font-weight:400 700; }
  * { box-sizing:border-box; }
  html,body { width:1200px; height:630px; margin:0; }
  body { color:var(--color-foreground); background:var(--color-background); font-family:Geist,sans-serif; }
  .card { height:100%; position:relative; overflow:hidden; }
  header { position:absolute; right:0; top:0; bottom:0; width:300px; display:flex;
    flex-direction:column; align-items:center; justify-content:center; gap:28px;
    color:var(--color-foreground); background:var(--color-background); }
  header::before, header::after { content:""; position:absolute; width:3px; height:116px; }
  header::before { top:0; left:54px; background:var(--color-accent); }
  header::after { bottom:0; right:54px; background:var(--color-secondary); }
  img { width:168px; height:168px; border-radius:10px; }
  .name { font-size:30px; font-weight:500; }
  main { position:absolute; top:114px; left:64px; right:364px; }
  h1 { font-family:Lora,"Noto Serif SC Variable",serif; font-size:60px; line-height:1.25;
    font-weight:500; margin:0 0 32px; white-space:pre-line; overflow-wrap:anywhere; }
  html[lang=zh-CN] h1 { font-size:60px; line-height:1.4; }
  .long h1 { font-size:52px; }
  p { font-family:Geist,"Noto Serif SC Variable",sans-serif; color:var(--color-muted-foreground);
    font-size:24px; line-height:1.65; margin:0; }
  footer { position:absolute; left:64px; right:364px; bottom:40px; display:flex;
    justify-content:space-between; color:var(--color-muted-foreground); font-size:16px; }
  .accent { width:56px; height:4px; align-self:center; background:var(--color-subtle-accent); }
  </style></head><body><div class="card"><header class="dark"><img src="data:image/png;base64,${avatar}" alt=""><span class="name"></span></header><main><h1></h1><p></p></main><footer><span>${escapeHtml(new URL(siteUrl).hostname)}</span><span class="accent"></span></footer></div></body></html>`);
  await page.evaluate(() => Promise.all(Array.from(document.images, (img) => img.decode())));
  for (const item of sharingPages) {
    await page.evaluate((item) => {
      document.documentElement.lang = item.locale === "zh" ? "zh-CN" : "en";
      const name = document.querySelector(".name");
      const heading = document.querySelector("h1");
      const subtitle = document.querySelector("p");
      if (!name || !heading || !subtitle) throw new Error("Missing Open Graph template element");
      name.textContent = item.siteName;
      heading.textContent = item.heading;
      subtitle.textContent = item.subtitle;
      document.body.classList.toggle("long", item.heading.length > 48);
    }, item);
    await page.evaluate(() => document.fonts.ready);
    const fits = await page.evaluate(() => {
      const main = document.querySelector("main");
      const footer = document.querySelector("footer");
      return (
        main &&
        footer &&
        main.getBoundingClientRect().bottom < footer.getBoundingClientRect().top - 20
      );
    });
    if (!fits) throw new Error(`Open Graph copy overflows: ${item.path}`);
    await page.screenshot({ path: new URL(`public${item.imagePath}`, root).pathname, type: "png" });
  }
} finally {
  await browser.close();
}
await writeFile(
  new URL("public/robots.txt", root),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`,
);
await writeFile(
  new URL("public/sitemap.xml", root),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sharingPages.map((page) => `<url><loc>${escapeHtml(new URL(page.path, siteUrl).href)}</loc></url>`).join("")}</urlset>\n`,
);
