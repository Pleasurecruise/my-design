// @vitest-environment jsdom
import { act, createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { setLocale } from "../src/lib/i18n";
import content from "../src/content/showcase.json";
import { renderToStaticMarkup } from "react-dom/server";
import { Bookmark, Plus } from "lucide-react";
import { IconButton } from "../src/components/IconButton";
import { ComponentExamples } from "../src/components/ComponentExamples";
import { CodeBlock } from "../src/components/CodeBlock";
import { TypographyStudy } from "../src/components/TypographyStudy";

beforeEach(() => {
  setLocale("en");
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  setLocale("en");
});

it("keeps a readable name and decorative SVG on an icon-only action", () => {
  const markup = renderToStaticMarkup(
    createElement(IconButton, { icon: Bookmark, label: "Save note", "aria-pressed": true }),
  );
  expect(markup).toContain('aria-label="Save note"');
  expect(markup).toContain('data-tooltip="Save note"');
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('aria-hidden="true"');
  expect(markup).toContain('type="button"');
});

it("preserves native submit and disabled behavior", () => {
  const markup = renderToStaticMarkup(
    createElement(IconButton, {
      icon: Plus,
      label: "Create collection",
      type: "submit",
      disabled: true,
    }),
  );
  expect(markup).toContain('type="submit"');
  expect(markup).toContain('disabled=""');
  expect(markup).toContain('aria-label="Create collection"');
});

it("gives every example action an icon and a nonempty accessible name", () => {
  const markup = renderToStaticMarkup(createElement(ComponentExamples));
  const buttons = [...markup.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
  expect(buttons).toHaveLength(5);
  for (const [, attributes, body] of buttons) {
    expect(attributes).toMatch(/aria-label="[^"]+"/);
    expect(body).toContain("<svg");
    expect(body.replace(/<[^>]*>/g, "").trim()).toBe("");
  }
});

it("copies the original code and exposes a recoverable clipboard failure", async () => {
  const writeText = vi
    .fn()
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error("Denied"));
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const code = "first line\n\nlast line";
  render(
    createElement(CodeBlock, {
      title: "Example",
      code,
      filename: "example.ts",
      language: "TS",
      highlightLines: [1],
    }),
  );
  await act(async () => fireEvent.click(screen.getByRole("button", { name: content.labels.copy })));
  expect(writeText).toHaveBeenCalledWith(code);
  expect(screen.getByRole("status").textContent).toBe(content.labels.copied);
  await act(async () => fireEvent.click(screen.getByRole("button", { name: content.labels.copy })));
  expect(screen.getByRole("status").textContent).toBe(content.labels.copyFailed);
});

it("switches A/B views while preserving identical reading content", () => {
  render(createElement(TypographyStudy, { values: {} }));
  expect(screen.getAllByRole("article")).toHaveLength(2);
  fireEvent.click(screen.getByRole("button", { name: content.comparison.reading }));
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByRole("article").textContent).toContain(content.comparison.paragraphs[0]);
  fireEvent.click(screen.getByRole("button", { name: content.comparison.everyday }));
  expect(screen.getAllByRole("article")).toHaveLength(1);
  expect(screen.getByRole("article").textContent).toContain(content.comparison.paragraphs[0]);
  fireEvent.click(screen.getByRole("button", { name: content.comparison.both }));
  expect(screen.getAllByRole("article")).toHaveLength(2);
});

it("validates collection names and resets a saved note", () => {
  const c = content.components;
  render(createElement(ComponentExamples));
  fireEvent.click(screen.getByRole("button", { name: c.submit }));
  expect(screen.getByLabelText(c.inputLabel).getAttribute("aria-invalid")).toBe("true");
  fireEvent.change(screen.getByLabelText(c.inputLabel), { target: { value: "  Notes  " } });
  fireEvent.click(screen.getByRole("button", { name: c.submit }));
  expect(screen.getByText(`${c.created} Notes`)).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: c.save }));
  expect(screen.getByRole("button", { name: c.save }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: c.reset }));
  expect(screen.getByRole("button", { name: c.save }).getAttribute("aria-pressed")).toBe("false");
});
