// @vitest-environment jsdom
import { act, createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { setLocale } from "../src/lib/i18n";
import content from "../src/content/showcase.json";
import App from "../src/App";
import { ShowcaseToolbar } from "../src/components/ShowcaseToolbar";
import { useTheme } from "../src/lib/theme";
import english from "../src/content/showcase.json";
import chinese from "../src/content/showcase.zh.json";
import documents from "../src/content/documents.zh.json";

function ThemeControl() {
  const { dark, toggle } = useTheme();
  return createElement("button", { onClick: toggle }, dark ? "Dark" : "Light");
}

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => Object.assign(new EventTarget(), { matches: false }));
  document.documentElement.style.setProperty("--color-accent", "#526682");
  document.documentElement.className = "";
  localStorage.clear();
  setLocale("en");
  document.head.innerHTML = '<meta name="description" content="">';
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
  ).toBe("?document=essay");
  expect(document.documentElement.lang).toBe("zh-CN");
  expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
    chinese.site.metadata,
  );
  expect(localStorage.getItem("my-design:locale")).toBe("zh");
  fireEvent.click(screen.getByRole("button", { name: chinese.toolbar.switchLanguage }));
  expect(screen.getByLabelText("Message")).toBe(screen.getByDisplayValue("Keep my draft."));
  expect(document.documentElement.lang).toBe("en");
});

it("restores the saved locale when the language module initializes", async () => {
  localStorage.setItem("my-design:locale", "zh");
  vi.resetModules();
  const restored = await import("../src/lib/i18n");
  restored.syncLocaleMetadata();
  expect(document.documentElement.lang).toBe("zh-CN");
  act(() => restored.setLocale("en"));
});

it("follows system changes until the user explicitly chooses a theme", () => {
  const query = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal("matchMedia", () => query);
  const removeListener = vi.spyOn(query, "removeEventListener");
  const { unmount } = render(createElement(ThemeControl));
  act(() => {
    query.matches = true;
    query.dispatchEvent(new Event("change"));
  });
  expect(screen.getByRole("button").textContent).toBe("Dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  fireEvent.click(screen.getByRole("button"));
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

it("restores focus on Escape and removes accessibility preferences on unmount", () => {
  const { unmount } = render(createElement(ShowcaseToolbar, { dark: false, toggle: vi.fn() }));
  const trigger = screen.getByRole("button", { name: content.toolbar.accessibility });
  fireEvent.click(trigger);
  const panel = screen.getByRole("region", { name: content.toolbar.accessibility });
  expect(document.activeElement).toBe(panel);
  fireEvent.click(screen.getByLabelText(content.toolbar.largerText));
  fireEvent.click(screen.getByLabelText(content.toolbar.strongFocus));
  fireEvent.click(screen.getByLabelText(content.toolbar.reduceMotion));
  expect(document.documentElement.hasAttribute("data-largertext")).toBe(true);
  expect(document.documentElement.hasAttribute("data-strongfocus")).toBe(true);
  expect(document.documentElement.hasAttribute("data-reducemotion")).toBe(true);
  fireEvent.keyDown(panel, { key: "Escape" });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
  fireEvent.click(trigger);
  fireEvent.pointerDown(document.body);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  unmount();
  expect(document.documentElement.hasAttribute("data-largertext")).toBe(false);
  expect(document.documentElement.hasAttribute("data-strongfocus")).toBe(false);
  expect(document.documentElement.hasAttribute("data-reducemotion")).toBe(false);
});
