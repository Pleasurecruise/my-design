import content from "../src/content/showcase.json" with { type: "json" };
import { pageMetadata, pagePath } from "../src/lib/metadata.ts";
import type { Locale, SiteSection } from "../src/lib/metadata.ts";
import { readFileSync } from "node:fs";

export const siteUrl = `https://${readFileSync(new URL("../public/CNAME", import.meta.url), "utf8").trim()}/`;

export const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Browser chrome uses the interface background in each theme.
const palette = readFileSync(new URL("../src/styles/palette.css", import.meta.url), "utf8");
const tokens = readFileSync(new URL("../src/styles/tokens.css", import.meta.url), "utf8");
export function themeColor(dark = false) {
  const block = tokens.match(dark ? /\.dark\s*\{([^}]+)\}/ : /:root\s*\{([^}]+)\}/)?.[1];
  const name = block?.match(/--color-background:\s*var\((--palette-[\w-]+)\)/)?.[1];
  const values = new Map(
    [...palette.matchAll(/(--palette-[\w-]+):\s*(#[\da-f]{6})/gi)].map(([, name, value]) => [
      name,
      value,
    ]),
  );
  const value = name && values.get(name);
  if (!value) throw new Error(`Missing ${dark ? "dark" : "light"} background color`);
  return value;
}

export function renderMetadata(
  html: string,
  locale: Locale,
  documentId?: string,
  section: SiteSection = "design",
) {
  const page = pageMetadata(locale, documentId, section);
  const url = new URL(page.path, siteUrl).href;
  const image = new URL(page.imagePath, siteUrl).href;
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    ...(["en", "zh"] satisfies Locale[]).map(
      (language) =>
        `<link rel="alternate" hreflang="${language === "zh" ? "zh-CN" : "en"}" href="${new URL(pagePath(language, page.documentId, section), siteUrl).href}" />`,
    ),
    `<link rel="alternate" hreflang="x-default" href="${new URL(pagePath("en", page.documentId, section), siteUrl).href}" />`,
    ...Object.entries({
      description: page.description,
      "application-name": page.siteName,
      "twitter:card": "summary_large_image",
      "twitter:title": page.title,
      "twitter:description": page.description,
      "twitter:image": image,
      "twitter:image:alt": page.imageAlt,
    }).map(([name, value]) => `<meta name="${name}" content="${escapeHtml(value)}" />`),
    ...Object.entries({
      "og:type": "website",
      "og:site_name": page.siteName,
      "og:title": page.title,
      "og:description": page.description,
      "og:url": url,
      "og:locale": page.ogLocale,
      "og:locale:alternate": locale === "en" ? "zh_CN" : "en_US",
      "og:image": image,
      "og:image:type": "image/png",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": page.imageAlt,
    }).map(([property, value]) => `<meta property="${property}" content="${escapeHtml(value)}" />`),
  ];
  return html
    .replace(/<html lang="[^"]*"/, `<html lang="${locale === "zh" ? "zh-CN" : "en"}"`)
    .replace(
      /<!-- site-metadata:start -->[\s\S]*?<!-- site-metadata:end -->/,
      `<!-- site-metadata:start -->\n${tags.join("\n")}\n<!-- site-metadata:end -->`,
    )
    .replaceAll("%THEME_LIGHT%", themeColor())
    .replaceAll("%THEME_DARK%", themeColor(true))
    .replace(
      /(['"])__THEME_KEY__\1/,
      JSON.stringify(content.site.themeKey).replaceAll("<", "\\u003c"),
    );
}
