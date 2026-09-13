import { useSyncExternalStore } from "react";
import english from "../content/showcase.json";
import chinese from "../content/showcase.zh.json";
import englishDocuments from "../content/documents.json";
import chineseDocuments from "../content/documents.zh.json";

import { pageMetadata, pagePath, resolvePage } from "./metadata";
import type { Locale } from "./metadata";
export type { Locale } from "./metadata";
const key = "my-design:locale";
const initialPage =
  typeof window === "undefined"
    ? undefined
    : resolvePage(window.location.pathname, window.location.search);
let locale: Locale =
  initialPage?.locale === "zh" ||
  (typeof window !== "undefined" &&
    window.location.pathname === "/" &&
    window.localStorage.getItem(key) === "zh")
    ? "zh"
    : "en";
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function setLocale(next: Locale) {
  window.localStorage.setItem(key, next);
  locale = next;
  syncLocaleMetadata();
  listeners.forEach((listener) => listener());
}
export function syncLocaleMetadata() {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  const { documentId } = resolvePage(location.pathname, location.search);
  const page = pageMetadata(locale, documentId);
  const canonical = document.querySelector('link[rel="canonical"]');
  const base = canonical?.getAttribute("href") ?? location.origin;
  const url = new URL(page.path, base).href;
  const image = new URL(page.imagePath, base).href;
  document.title = page.title;
  canonical?.setAttribute("href", url);
  for (const [selector, value] of [
    [
      'meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]',
      page.description,
    ],
    ['meta[property="og:title"], meta[name="twitter:title"]', page.title],
    ['meta[property="og:image:alt"], meta[name="twitter:image:alt"]', page.imageAlt],
    ['meta[property="og:image"], meta[name="twitter:image"]', image],
    ['meta[property="og:url"]', url],
    ['meta[property="og:locale"]', page.ogLocale],
    ['meta[property="og:locale:alternate"]', locale === "zh" ? "en_US" : "zh_CN"],
  ]) {
    document
      .querySelectorAll(selector)
      .forEach((element) => element.setAttribute("content", value));
  }
  for (const language of ["en", "zh"] satisfies Locale[]) {
    document
      .querySelector(`link[hreflang="${language === "zh" ? "zh-CN" : "en"}"]`)
      ?.setAttribute("href", new URL(pagePath(language, documentId), base).href);
  }
  document
    .querySelector('link[hreflang="x-default"]')
    ?.setAttribute("href", new URL(pagePath("en", documentId), base).href);
  const address = new URL(location.href);
  address.pathname = page.path;
  address.searchParams.delete("document");
  history.replaceState(history.state, "", address);
}
export function useLocale() {
  return useSyncExternalStore<Locale>(
    subscribe,
    () => locale,
    () => locale,
  );
}
export function useContent(): typeof english {
  return useLocale() === "zh" ? chinese : english;
}
export function useDocuments(): typeof englishDocuments {
  return useLocale() === "zh" ? chineseDocuments : englishDocuments;
}
