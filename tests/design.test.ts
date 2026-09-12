import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { expect, it } from "vite-plus/test";
import english from "../src/content/showcase.json";
import chinese from "../src/content/showcase.zh.json";
import englishDocuments from "../src/content/documents.json";
import chineseDocuments from "../src/content/documents.zh.json";

const tokens = await readFile("src/styles/tokens.css", "utf8");
const palette = await readFile("src/styles/palette.css", "utf8");

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
