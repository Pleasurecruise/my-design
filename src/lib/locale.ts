export type Locale = "en" | "zh";
export const localeKey = "my-design:locale";

export function getInitialLocale(): Locale {
  if (window.location.pathname.split("/").filter(Boolean)[0] === "zh") return "zh";

  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(localeKey);
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "SecurityError")) throw error;
  }
  if (saved === "en" || saved === "zh") return saved;

  const language = window.navigator.languages.find((value) => /^(en|zh)(-|$)/i.test(value));
  return language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}
