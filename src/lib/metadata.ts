import english from "../content/showcase.json" with { type: "json" };
import chinese from "../content/showcase.zh.json" with { type: "json" };
import englishDocuments from "../content/documents.json" with { type: "json" };
import chineseDocuments from "../content/documents.zh.json" with { type: "json" };

export type Locale = "en" | "zh";

export function pagePath(locale: Locale, documentId?: string) {
  return `${locale === "zh" ? "/zh/" : "/"}${documentId ? `documents/${documentId}/` : ""}`;
}

export function resolvePage(pathname: string, search = "") {
  const parts = pathname.split("/").filter(Boolean);
  const locale: Locale = parts[0] === "zh" ? "zh" : "en";
  const documentIndex = parts.indexOf("documents");
  const candidate =
    documentIndex >= 0 ? parts[documentIndex + 1] : new URLSearchParams(search).get("document");
  const documentId = englishDocuments.documents.find((item) => item.id === candidate)?.id;
  return { locale, documentId };
}

export function pageMetadata(locale: Locale, documentId?: string) {
  const content = locale === "zh" ? chinese : english;
  const documents = locale === "zh" ? chineseDocuments : englishDocuments;
  const sample = documents.documents.find((item) => item.id === documentId);
  const heading = sample?.title ?? content.site.title;
  return {
    locale,
    documentId: sample?.id,
    path: pagePath(locale, sample?.id),
    title: sample
      ? `${heading} — ${content.site.name}`
      : `${content.site.name} — ${heading.replaceAll("\n", " ")}`,
    heading,
    subtitle: sample?.subtitle ?? content.site.description,
    description: sample?.subtitle ?? content.site.metadata,
    siteName: content.site.name,
    imageAlt: `${content.site.imageAlt} ${heading.replaceAll("\n", " ")}`,
    imagePath:
      locale === "en" && !sample
        ? "/opengraph-image.png"
        : `/og/${locale}-${sample?.id ?? "home"}.png`,
    ogLocale: locale === "zh" ? "zh_CN" : "en_US",
  };
}

export const sharingPages = (["en", "zh"] satisfies Locale[]).flatMap((locale) => [
  pageMetadata(locale),
  ...englishDocuments.documents.map((sample) => pageMetadata(locale, sample.id)),
]);
