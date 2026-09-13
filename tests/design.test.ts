import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { expect, it } from "vite-plus/test";
import { build } from "vite-plus";
import { JSDOM } from "jsdom";
import english from "../src/content/showcase.json";
import chinese from "../src/content/showcase.zh.json";
import englishDocuments from "../src/content/documents.json";
import chineseDocuments from "../src/content/documents.zh.json";
import { sharingPages, pageMetadata } from "../src/lib/metadata";

const tokens = await readFile("src/styles/tokens.css", "utf8");
const palette = await readFile("src/styles/palette.css", "utf8");

it("ships crawler-readable metadata and valid linked image assets without JavaScript", async () => {
  const result = await build({ build: { write: false }, logLevel: "silent" });
  assert.ok(!Array.isArray(result) && "output" in result);
  for (const page of sharingPages) {
    const fileName = page.path === "/" ? "index.html" : `${page.path.slice(1)}index.html`;
    const file = result.output.find((item) => item.fileName === fileName);
    assert.ok(file && file.type === "asset" && typeof file.source === "string");
    const parsed = new JSDOM(file.source);
    const doc = parsed.window.document;
    expect(doc.documentElement.lang).toBe(page.locale === "zh" ? "zh-CN" : "en");
    expect(doc.title).toBe(page.title);
    const origin = `https://${(await readFile("public/CNAME", "utf8")).trim()}`;
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${origin}${page.path}`,
    );
    expect(doc.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(
      `${origin}${page.imagePath}`,
    );
    expect(doc.querySelector('meta[property="og:description"]')?.getAttribute("content")).toBe(
      page.description,
    );
    expect(doc.querySelectorAll('link[rel="alternate"][hreflang]').length).toBe(3);
    expect(file.source).not.toMatch(/%[A-Z_]+%|__THEME_KEY__/);
    const image = await readFile(`public${page.imagePath}`);
    expect([image.readUInt32BE(16), image.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(await readFile("public/sitemap.xml", "utf8")).toContain(
      `<loc>${origin}${page.path}</loc>`,
    );
    parsed.window.close();
  }
  const html = result.output.find((file) => file.fileName === "index.html");
  assert.ok(html && html.type === "asset" && typeof html.source === "string");
  expect(html.source).not.toMatch(/%[A-Z_]+%|__THEME_KEY__/);
  const dom = new JSDOM(html.source);
  const head = dom.window.document.head;
  const metadata = (selector: string) => head.querySelector(selector)?.getAttribute("content");
  const origin = `https://${(await readFile("public/CNAME", "utf8")).trim()}/`;
  expect(head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(origin);
  expect(metadata('meta[property="og:url"]')).toBe(origin);
  expect(metadata('meta[property="og:title"]')).toBe(dom.window.document.title);
  expect(metadata('meta[property="og:description"]')).toBe(english.site.metadata);
  expect(metadata('meta[property="og:type"]')).toBe("website");
  expect(metadata('meta[property="og:image"]')).toBe(`${origin}opengraph-image.png`);
  expect(metadata('meta[property="og:image:alt"]')).toBe(pageMetadata("en").imageAlt);
  expect(metadata('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(metadata('meta[name="twitter:image"]')).toBe(metadata('meta[property="og:image"]'));
  for (const link of head.querySelectorAll(
    'link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]',
  )) {
    const href = link.getAttribute("href");
    assert.ok(href?.startsWith("/"));
    expect((await readFile(`public${href}`)).length).toBeGreaterThan(0);
  }
  for (const [name, width, height] of [
    ["opengraph-image.png", 1200, 630],
    ["apple-touch-icon.png", 180, 180],
    ["icon-192.png", 192, 192],
    ["icon-512.png", 512, 512],
  ] satisfies [string, number, number][]) {
    const png = await readFile(`public/${name}`);
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([width, height]);
  }
  const ico = await readFile("public/favicon.ico");
  expect(ico.readUInt16LE(2)).toBe(1);
  expect(ico.readUInt16LE(4)).toBe(3);
  [16, 32, 48].forEach((size, index) => {
    const entry = 6 + index * 16;
    expect([ico[entry], ico[entry + 1]]).toEqual([size, size]);
    const offset = ico.readUInt32LE(entry + 12);
    const length = ico.readUInt32LE(entry + 8);
    expect(offset + length).toBeLessThanOrEqual(ico.length);
    expect(ico.readUInt32BE(offset + 16)).toBe(size);
  });
  const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
  expect(manifest.name).toBe(english.site.name);
  expect(manifest.icons.map((icon: { src: string }) => icon.src)).toEqual([
    "/icon-192.png",
    "/icon-512.png",
  ]);
  expect(await readFile("public/robots.txt", "utf8")).toContain(`Sitemap: ${origin}sitemap.xml`);
  expect(await readFile("public/sitemap.xml", "utf8")).toContain(`<loc>${origin}</loc>`);
  dom.window.close();
});

it("keeps application colors behind declared semantic tokens", async () => {
  const declared = new Set([...tokens.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  const files = await readdir("src", { recursive: true });
  for (const file of files.filter((name) => /\.(tsx?|css|json)$/.test(name))) {
    if (file === "styles/palette.css") continue;
    const source = await readFile(join("src", file), "utf8");
    if (file !== "styles/tokens.css") {
      expect(source, `Palette boundary: ${file}`).not.toMatch(/--palette-/);
      expect(source, `Explicit color: ${file}`).not.toMatch(/#[\da-f]{3,8}\b/i);
    }
    for (const [token] of source.matchAll(
      /--(?:color|font|radius|shadow|duration|text|leading|weight)-[\w-]+/g,
    )) {
      expect(declared.has(token), `Undefined ${token} in ${file}`).toBe(true);
    }
  }
});

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
}

it("keeps both locale structures and navigation identities aligned", () => {
  expect(shape(chinese)).toEqual(shape(english));
  expect(shape(chineseDocuments)).toEqual(shape(englishDocuments));
  expect(chinese.sections.map((section) => section.id)).toEqual(
    english.sections.map((section) => section.id),
  );
  expect(chineseDocuments.documents.map((document) => document.id)).toEqual(
    englishDocuments.documents.map((document) => document.id),
  );
  expect(chinese.usage.exampleCode).toBe(english.usage.exampleCode);
});

function luminance(hex: string) {
  assert.match(hex, /^#[\da-f]{6}$/i, "Expected a six-digit palette color");
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

it("keeps designated text roles at AA contrast on both page surfaces", () => {
  const paletteValues = new Map(
    [...palette.matchAll(/(--palette-[\w-]+):\s*(#[\da-f]{6})/gi)].map(
      ([, name, value]): [string, string] => [name, value],
    ),
  );
  const light = tokens.match(/:root\s*\{([^}]+)\}/);
  const dark = tokens.match(/\.dark\s*\{([^}]+)\}/);
  assert.ok(light, "Light token block is missing");
  assert.ok(dark, "Dark token block is missing");
  for (const [mode, css] of [
    ["light", light[1]],
    ["dark", light[1] + dark[1]],
  ]) {
    const colors = new Map<string, string>();
    for (const [, role, name] of css.matchAll(/(--color-[\w-]+):\s*var\((--palette-[\w-]+)\)/g)) {
      const value = paletteValues.get(name);
      assert.ok(value, `Missing palette value: ${name}`);
      colors.set(role, value);
    }
    const background = colors.get("--color-background");
    assert.ok(background, `Missing background: ${mode}`);
    for (const role of [
      "foreground",
      "muted-foreground",
      "accent",
      "secondary",
      "subtle-accent",
      "success",
      "warning",
      "error",
    ]) {
      const foreground = colors.get(`--color-${role}`);
      assert.ok(foreground, `Missing text color: ${role}`);
      const a = luminance(foreground);
      const b = luminance(background);
      const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      expect(contrast, `${mode} ${role} on the page surface`).toBeGreaterThanOrEqual(4.5);
    }
  }
});
