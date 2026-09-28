// @vitest-environment jsdom
import { act, createElement, StrictMode } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { setLocale } from "../src/lib/i18n";
import content from "../src/content/showcase.json";
import App from "../src/App";
import { useTheme } from "../src/lib/theme";
import english from "../src/content/showcase.json";
import chinese from "../src/content/showcase.zh.json";
import documents from "../src/content/documents.zh.json";
import { pageMetadata, resolvePage } from "../src/lib/metadata";
import LoadingLanding from "../src/components/LoadingLanding";
import englishLoading from "../src/content/loading.json";
import chineseLoading from "../src/content/loading.zh.json";

function ThemeControl() {
  const { dark, toggle } = useTheme();
  return createElement("button", { onClick: toggle }, dark ? "Dark" : "Light");
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => Object.assign(new EventTarget(), { matches: false }));
  document.documentElement.style.setProperty("--color-accent", "#526682");
  document.documentElement.className = "";
  localStorage.clear();
  history.replaceState(null, "", "/");
  setLocale("en");
  document.head.innerHTML = `<meta name="description" content="">
    <meta property="og:title"><meta property="og:description"><meta property="og:locale">
    <meta property="og:image:alt"><meta name="twitter:title"><meta name="twitter:description">
    <meta name="twitter:image:alt"><meta name="theme-color">`;
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute("style");
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  setLocale("en");
});

it("shows a localized loading status and redirects only once under StrictMode", () => {
  const replace = vi.fn();
  vi.stubGlobal("location", {
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    replace,
  });
  render(createElement(StrictMode, null, createElement(LoadingLanding)));
  expect(screen.getByRole("status").textContent).toBe(englishLoading.status);
  expect(screen.getByRole("link", { name: englishLoading.continue }).getAttribute("href")).toBe(
    "https://design.you-find.me/zh/oc/",
  );
  expect(document.title).toBe("l0ad.ing");
  act(() => {
    vi.advanceTimersByTime(1799);
  });
  expect(replace).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(replace).toHaveBeenCalledExactlyOnceWith("https://design.you-find.me/zh/oc/");
});

it("cancels the loading redirect when the page unmounts", () => {
  const replace = vi.fn();
  vi.stubGlobal("location", {
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    replace,
  });
  const view = render(createElement(LoadingLanding));
  view.unmount();
  act(() => {
    vi.advanceTimersByTime(2000);
  });
  expect(replace).not.toHaveBeenCalled();
});

it("shortens the intro for reduced motion and keeps the Chinese status accessible", () => {
  setLocale("zh");
  const replace = vi.fn();
  vi.stubGlobal("location", {
    href: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    replace,
  });
  vi.stubGlobal("matchMedia", () => ({ matches: true }));
  render(createElement(LoadingLanding));
  expect(screen.getByRole("status").textContent).toBe(chineseLoading.status);
  expect(screen.getByRole("link", { name: chineseLoading.continue })).toBeDefined();
  expect(document.documentElement.lang).toBe("zh-CN");
  act(() => {
    vi.advanceTimersByTime(199);
  });
  expect(replace).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(replace).toHaveBeenCalledExactlyOnceWith("https://design.you-find.me/zh/oc/");
});

it.each(["ring", "dots", "bars", "wave", "pulse", "bouncing-dots"])(
  "can select %s and keeps the same animation through rerenders",
  (kind) => {
    const kinds = ["ring", "dots", "bars", "wave", "pulse", "bouncing-dots"];
    const random = vi
      .spyOn(Math, "random")
      .mockReturnValue((kinds.indexOf(kind) + 0.5) / kinds.length);
    const view = render(createElement(LoadingLanding));
    const animation = view.container.querySelector(`.loading-${kind}`);
    expect(animation).not.toBeNull();
    random.mockReturnValue(0.99);
    view.rerender(createElement(LoadingLanding));
    expect(view.container.querySelector(`.loading-${kind}`)).toBe(animation);
  },
);

it("changes live copy and metadata without discarding a comment draft", () => {
  render(createElement(App));
  expect(screen.getAllByText("#526682").length).toBeGreaterThan(0);
  for (const section of english.sections) {
    expect(screen.getByRole("region", { name: section.title })).toBeDefined();
  }
  fireEvent.click(screen.getByText(english.interactions.summary));
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Mira" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Keep my draft." } });
  fireEvent.click(screen.getByRole("button", { name: english.toolbar.switchLanguage }));
  expect(screen.getByLabelText(chinese.interactions.fields[0].label)).toBe(
    screen.getByDisplayValue("Mira"),
  );
  expect(screen.getByLabelText(chinese.interactions.fields[2].label)).toBe(
    screen.getByDisplayValue("Keep my draft."),
  );
  expect(screen.getByText(chinese.interactions.comments[0].body)).toBeDefined();
  expect(
    screen.getByRole("link", { name: documents.documents[0].label }).getAttribute("href"),
  ).toBe("/zh/documents/essay/");
  expect(document.documentElement.lang).toBe("zh-CN");
  expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
    chinese.site.metadata,
  );
  expect(localStorage.getItem("my-design:locale")).toBe("zh");
  expect(document.title).toBe(`${chinese.site.name} — ${chinese.site.title.replaceAll("\n", " ")}`);
  expect(document.querySelector('meta[property="og:title"]')?.getAttribute("content")).toBe(
    document.title,
  );
  expect(document.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe(
    "zh_CN",
  );
  expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute("content")).toBe(
    chinese.site.metadata,
  );
  fireEvent.click(screen.getByRole("button", { name: chinese.toolbar.switchLanguage }));
  expect(screen.getByLabelText("Message")).toBe(screen.getByDisplayValue("Keep my draft."));
  expect(document.documentElement.lang).toBe("en");
  expect(document.querySelector('meta[property="og:locale"]')?.getAttribute("content")).toBe(
    "en_US",
  );
  expect(document.querySelector('meta[name="twitter:image:alt"]')?.getAttribute("content")).toBe(
    pageMetadata("en").imageAlt,
  );
});

it.each([
  { languages: ["zh-CN", "en-US"], saved: null, path: "/", expected: "zh-CN", address: "/zh/" },
  { languages: ["zh-TW"], saved: null, path: "/oc/", expected: "zh-CN", address: "/zh/oc/" },
  { languages: ["en-GB", "zh-CN"], saved: null, path: "/", expected: "en", address: "/" },
  { languages: ["fr-FR", "zh-CN"], saved: null, path: "/", expected: "zh-CN", address: "/zh/" },
  { languages: ["ja-JP"], saved: null, path: "/", expected: "en", address: "/" },
  { languages: ["zh-CN"], saved: "en", path: "/", expected: "en", address: "/" },
  { languages: ["en-US"], saved: "zh", path: "/", expected: "zh-CN", address: "/zh/" },
  { languages: ["en-US"], saved: "en", path: "/zh/oc/", expected: "zh-CN", address: "/zh/oc/" },
  { languages: ["zh-CN"], saved: "invalid", path: "/", expected: "zh-CN", address: "/zh/" },
])(
  "selects the initial language from the URL, saved choice and system preferences: $languages / $saved / $path",
  async ({ languages, saved, path, expected, address }) => {
    localStorage.clear();
    if (saved) localStorage.setItem("my-design:locale", saved);
    history.replaceState(null, "", path);
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
    vi.resetModules();
    const landing = render(createElement(LoadingLanding));
    expect(document.documentElement.lang).toBe(expected);
    expect(screen.getByRole("status").textContent).toBe(
      expected === "zh-CN" ? chineseLoading.status : englishLoading.status,
    );
    expect(location.pathname).toBe(path);
    landing.unmount();
    const restored = await import("../src/lib/i18n");
    restored.syncLocaleMetadata();
    expect(document.documentElement.lang).toBe(expected);
    expect(location.pathname).toBe(address);
    expect(localStorage.getItem("my-design:locale")).toBe(saved);
    act(() => restored.setLocale("en"));
  },
);

it("follows system changes until the user explicitly chooses a theme", () => {
  const query = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal("matchMedia", () => query);
  const removeListener = vi.spyOn(query, "removeEventListener");
  const { unmount } = render(createElement(ThemeControl));
  act(() => {
    document.documentElement.style.setProperty("--color-background", "#1c201f");
    query.matches = true;
    query.dispatchEvent(new Event("change"));
  });
  expect(screen.getByRole("button").textContent).toBe("Dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
    "#1c201f",
  );
  document.documentElement.style.setProperty("--color-background", "#f6f6f2");
  fireEvent.click(screen.getByRole("button"));
  expect(document.querySelector('meta[name="theme-color"]')?.getAttribute("content")).toBe(
    "#f6f6f2",
  );
  expect(localStorage.getItem(content.site.themeKey)).toBe("light");
  act(() => {
    query.dispatchEvent(new Event("change"));
  });
  expect(screen.getByRole("button").textContent).toBe("Light");
  act(() => {
    vi.runAllTimers();
  });
  expect(document.documentElement.classList.contains("theme-switching")).toBe(false);
  unmount();
  expect(removeListener).toHaveBeenCalledWith("change", expect.any(Function));
});

it("keeps manual switching usable when theme storage is unavailable", () => {
  const query = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal("matchMedia", () => query);
  document.documentElement.classList.add("dark");
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  render(createElement(ThemeControl));
  fireEvent.click(screen.getByRole("button", { name: "Dark" }));
  expect(screen.getByRole("button").textContent).toBe("Light");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

it("links the sidebar to chapters and a localized character page", () => {
  render(createElement(App));
  const navigation = screen.getByRole("navigation", { name: english.navigation.label });
  expect(navigation).toBeDefined();
  expect(
    screen.getByRole("link", { name: english.navigation.design }).getAttribute("aria-current"),
  ).toBe("page");
  expect(screen.getByRole("link", { name: english.navigation.oc }).getAttribute("href")).toBe(
    "/oc/",
  );
  for (const chapter of english.sections) {
    expect(screen.getByRole("link", { name: chapter.label }).getAttribute("href")).toBe(
      `#${chapter.id}`,
    );
  }
  fireEvent.click(screen.getByRole("button", { name: english.toolbar.switchLanguage }));
  expect(screen.getByRole("link", { name: chinese.navigation.oc }).getAttribute("href")).toBe(
    "/zh/oc/",
  );
});

it("keeps the character page selected when changing language and theme", () => {
  history.replaceState(null, "", "/oc/#oc-stickers");
  setLocale("en");
  render(createElement(App));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(english.oc.title);
  const englishGallery = screen.getByRole("region", { name: english.oc.chapters[2].title });
  for (const artwork of english.oc.referenceViews) {
    expect(within(englishGallery).getByRole("img", { name: artwork.alt }).getAttribute("src")).toBe(
      artwork.src,
    );
  }
  expect(
    screen.getByRole("link", { name: english.navigation.oc }).getAttribute("aria-current"),
  ).toBe("page");
  fireEvent.click(screen.getByRole("button", { name: english.labels.switchDark }));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: english.toolbar.switchLanguage }));
  expect(location.pathname).toBe("/zh/oc/");
  expect(location.hash).toBe("#oc-stickers");
  expect(document.title).toBe(pageMetadata("zh", undefined, "oc").title);
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(chinese.oc.title);
  expect(screen.getByRole("link", { name: chinese.navigation.design }).getAttribute("href")).toBe(
    "/zh/",
  );
  expect(screen.getByRole("img", { name: chinese.oc.portrait.alt }).getAttribute("src")).toBe(
    "/oc/qiye-portrait.png",
  );
  expect(screen.getByText(chinese.oc.personality[0].text)).toBeDefined();
  const navigation = screen.getByRole("navigation", { name: chinese.navigation.label });
  expect(document.querySelector(".character-index")).toBeNull();
  for (const chapter of chinese.oc.chapters) {
    expect(within(navigation).getByRole("link", { name: chapter.label }).getAttribute("href")).toBe(
      `#${chapter.id}`,
    );
    expect(screen.getByRole("region", { name: chapter.title }).id).toBe(chapter.id);
  }
  expect(document.querySelector("#oc-pv")).toBeNull();
  expect(document.querySelector("#oc-ui")).toBeNull();
  expect(document.querySelector('a[href="#oc-ui"]')).toBeNull();
  expect(document.querySelector('a[href="#oc-pv"]')).toBeNull();
  const wardrobe = screen.getByRole("region", { name: chinese.oc.chapters[1].title });
  expect(
    within(wardrobe).getByRole("heading", { name: chinese.oc.wardrobe.current.title }),
  ).toBeDefined();
  for (const item of chinese.oc.wardrobe.current.details) {
    expect(within(wardrobe).getByText(item.text)).toBeDefined();
  }
  const gallery = screen.getByRole("region", { name: chinese.oc.chapters[2].title });
  for (const artwork of chinese.oc.referenceViews) {
    expect(within(gallery).getByRole("img", { name: artwork.alt }).getAttribute("src")).toBe(
      artwork.src,
    );
  }
  for (const artwork of chinese.oc.wardrobe.alternates) {
    fireEvent.click(within(wardrobe).getByRole("button", { name: new RegExp(artwork.title) }));
    expect(within(wardrobe).getByRole("img", { name: artwork.alt }).getAttribute("src")).toBe(
      artwork.src,
    );
  }
  const stickers = screen.getByRole("region", { name: chinese.oc.chapters[3].title });
  expect(within(stickers).getAllByRole("img")).toHaveLength(24);
  expect(
    within(stickers)
      .getByRole("link", { name: chinese.oc.stickers.sheetLink })
      .getAttribute("href"),
  ).toBe(chinese.oc.stickers.src);
  for (const artwork of [...chinese.oc.gallery.scenes, chinese.oc.gallery.details]) {
    expect(screen.getByRole("img", { name: artwork.alt }).getAttribute("src")).toBe(artwork.src);
  }
  const currentSources = new Set([
    chinese.oc.portrait.src,
    ...chinese.oc.referenceViews.map((artwork) => artwork.src),
    ...chinese.oc.wardrobe.alternates.map((artwork) => artwork.src),
    ...chinese.oc.gallery.scenes.map((artwork) => artwork.src),
    chinese.oc.gallery.details.src,
    chinese.oc.stickers.src,
  ]);
  for (const image of screen.getAllByRole("img")) {
    expect(currentSources.has(image.getAttribute("src") ?? "")).toBe(true);
  }
});

it("resolves localized sharing routes and preserves legacy document links", () => {
  expect(resolvePage("/zh/documents/essay/")).toEqual({
    locale: "zh",
    documentId: "essay",
    section: "design",
  });
  expect(resolvePage("/", "?document=report")).toEqual({
    locale: "en",
    documentId: "report",
    section: "design",
  });
  expect(resolvePage("/zh/oc/")).toEqual({ locale: "zh", documentId: undefined, section: "oc" });
  expect(resolvePage("/documents/unknown/").documentId).toBeUndefined();
});

it("updates the share URL and metadata while retaining query parameters and hash", () => {
  history.replaceState(null, "", "/documents/essay/?source=link#section");
  document.head.innerHTML +=
    '<link rel="canonical" href="https://design.you-find.me/documents/essay/"><meta property="og:image"><meta property="og:url">';
  setLocale("zh");
  expect(location.pathname).toBe("/zh/documents/essay/");
  expect(location.search).toBe("?source=link");
  expect(location.hash).toBe("#section");
  expect(document.querySelector('meta[property="og:image"]')?.getAttribute("content")).toBe(
    "https://design.you-find.me/og/zh-essay.png",
  );
  expect(document.title).toBe(pageMetadata("zh", "essay").title);
  history.replaceState(null, "", "/");
});

it("shows all stickers and preserves wardrobe selection across locales", () => {
  history.replaceState(null, "", "/oc/");
  render(createElement(App));
  const outfit = english.oc.wardrobe.alternates[1];
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`OF-03.*${outfit.title}`) }));
  const region = screen.getByRole("region", { name: english.oc.chapters[3].title });
  expect(within(region).queryByRole("searchbox")).toBeNull();
  expect(within(region).getAllByRole("img")).toHaveLength(24);
  fireEvent.click(screen.getByRole("button", { name: english.toolbar.switchLanguage }));
  const translated = chinese.oc.wardrobe.alternates[1];
  expect(
    screen
      .getByRole("button", { name: new RegExp(`OF-03.*${translated.title}`) })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  expect(screen.getByRole("img", { name: translated.alt }).getAttribute("src")).toBe(outfit.src);
});

it("keeps OC routes separate from legacy document queries", () => {
  expect(resolvePage("/oc/", "?document=essay")).toEqual({
    locale: "en",
    documentId: undefined,
    section: "oc",
  });
  expect(resolvePage("/other/documents/essay/").documentId).toBeUndefined();
  expect(resolvePage("/zh/", "?document=essay")).toEqual({
    locale: "zh",
    documentId: "essay",
    section: "design",
  });
});

it("loads and switches locale when browser storage is blocked", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Blocked", "SecurityError");
  });
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["zh-CN"]);
  vi.resetModules();
  const restored = await import("../src/lib/i18n");
  restored.syncLocaleMetadata();
  expect(document.documentElement.lang).toBe("zh-CN");
  restored.setLocale("en");
  expect(document.documentElement.lang).toBe("en");
  expect(location.pathname).toBe("/");
});

it("does not suppress unexpected locale persistence errors", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new TypeError("Unexpected storage failure");
  });
  vi.resetModules();
  await expect(import("../src/lib/i18n")).rejects.toThrow("Unexpected storage failure");
});

it("keeps locale switching usable when storage is full", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new DOMException("Full", "QuotaExceededError");
  });
  setLocale("zh");
  expect(document.documentElement.lang).toBe("zh-CN");
});
