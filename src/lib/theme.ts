import { useEffect, useState } from "react";
import content from "../content/showcase.json";

export function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", dark);
  void root.offsetWidth;
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const query = matchMedia("(prefers-color-scheme: dark)");
    const syncSystem = () => {
      try {
        const saved = localStorage.getItem(content.site.themeKey);
        if (saved === "light" || saved === "dark") return;
      } catch {
        /* Storage is optional. */
      }
      applyTheme(query.matches);
      setDark(query.matches);
    };
    query.addEventListener("change", syncSystem);
    return () => query.removeEventListener("change", syncSystem);
  }, []);
  function toggle() {
    applyTheme(!dark);
    setDark(!dark);
    try {
      localStorage.setItem(content.site.themeKey, dark ? "light" : "dark");
    } catch {
      /* Storage is optional. */
    }
  }
  return { dark, toggle };
}
