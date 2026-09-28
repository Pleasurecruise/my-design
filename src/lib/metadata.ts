import english from "../content/showcase.json" with { type: "json" };
import chinese from "../content/showcase.zh.json" with { type: "json" };
import englishDocuments from "../content/documents.json" with { type: "json" };
import chineseDocuments from "../content/documents.zh.json" with { type: "json" };

import type { Locale } from "./locale";
export type { Locale } from "./locale";
export type SiteSection = "design" | "oc";

export function pagePath(locale: Locale, documentId?: string, section: SiteSection = "design") {
  return `${locale === "zh" ? "/zh/" : "/"}${documentId ? `documents/${documentId}/` : section === "oc" ? "oc/" : ""}`;
}

export function resolvePage(pathname: string, search = "") {
  const parts = pathname.split("/").filter(Boolean);
  const locale: Locale = parts[0] === "zh" ? "zh" : "en";
  const route = locale === "zh" ? parts.slice(1) : parts;
  const candidate =
    route.length === 2 && route[0] === "documents"
      ? route[1]
      : route.length === 0
        ? new URLSearchParams(search).get("document")
        : undefined;
  const documentId = englishDocuments.documents.find((item) => item.id === candidate)?.id;
  const section: SiteSection = route.length === 1 && route[0] === "oc" ? "oc" : "design";
  return { locale, documentId, section };
}

export function pageMetadata(locale: Locale, documentId?: string, section: SiteSection = "design") {
  const content = locale === "zh" ? chinese : english;
  const documents = locale === "zh" ? chineseDocuments : englishDocuments;
  const sample = documents.documents.find((item) => item.id === documentId);
  const character = section === "oc" && !sample;
  const heading = sample?.title ?? (character ? content.oc.title : content.site.title);
  return {
    locale,
    section,
    documentId: sample?.id,
    path: pagePath(locale, sample?.id, section),
    title:
      sample || character
        ? `${heading} — ${content.site.name}`
        : `${content.site.name} — ${heading.replaceAll("\n", " ")}`,
    heading,
    subtitle: sample?.subtitle ?? (character ? content.oc.description : content.site.description),
    description: sample?.subtitle ?? (character ? content.oc.description : content.site.metadata),
    siteName: content.site.name,
    imageAlt: `${content.site.imageAlt} ${heading.replaceAll("\n", " ")}`,
    imagePath:
      locale === "en" && !sample && !character
        ? "/opengraph-image.png"
        : `/og/${locale}-${sample?.id ?? (character ? "oc" : "home")}.png`,
    ogLocale: locale === "zh" ? "zh_CN" : "en_US",
  };
}

export const sharingPages = (["en", "zh"] satisfies Locale[]).flatMap((locale) => [
  pageMetadata(locale),
  pageMetadata(locale, undefined, "oc"),
  ...englishDocuments.documents.map((sample) => pageMetadata(locale, sample.id)),
]);
