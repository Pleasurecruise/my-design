import { useSyncExternalStore } from "react";
import english from "../content/showcase.json";
import chinese from "../content/showcase.zh.json";
import englishDocuments from "../content/documents.json";
import chineseDocuments from "../content/documents.zh.json";

export type Locale = "en" | "zh";
const key = "my-design:locale";
let locale: Locale =
  typeof window !== "undefined" && window.localStorage.getItem(key) === "zh" ? "zh" : "en";
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
  const content = locale === "zh" ? chinese : english;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", content.site.metadata);
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
