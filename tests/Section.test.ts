// @vitest-environment jsdom
import { act, createElement, Fragment } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { setLocale } from "../src/lib/i18n";
import content from "../src/content/showcase.json";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { Section } from "../src/components/Section";
import { getDocument, DocumentPage } from "../src/components/Documents";
import chinese from "../src/content/documents.zh.json";

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

it("renders every chapter together with unique anchor targets and labelled headings", () => {
  const markup = renderToStaticMarkup(
    createElement(
      Fragment,
      null,
      ...content.sections.map((section) =>
        createElement(Section, { key: section.id, id: section.id, children: section.description }),
      ),
    ),
  );
  let previousPosition = -1;
  for (const section of content.sections) {
    const target = `id="${section.id}"`;
    expect(markup.split(target)).toHaveLength(2);
    expect(markup).toContain(`aria-labelledby="${section.id}-heading"`);
    expect(markup).toContain(`id="${section.id}-heading"`);
    const position = markup.indexOf(target);
    expect(position).toBeGreaterThan(previousPosition);
    previousPosition = position;
  }
});

it("keeps a document's content, metadata and print action aligned after changing language", () => {
  document.head.innerHTML = '<meta name="description" content="">';
  const doc = getDocument("essay");
  assert.ok(doc);
  const print = vi.spyOn(window, "print").mockImplementation(() => {});
  render(createElement(DocumentPage, { document: doc }));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(doc.title);
  act(() => setLocale("zh"));
  expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(chinese.documents[0].title);
  expect(document.title).toContain(chinese.documents[0].title);
  expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
    chinese.documents[0].subtitle,
  );
  fireEvent.click(screen.getByRole("button", { name: chinese.labels.print }));
  expect(print).toHaveBeenCalledOnce();
  expect(getDocument("unknown")).toBeUndefined();
});
