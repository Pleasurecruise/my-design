// @vitest-environment jsdom
import { act, createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
import { setLocale } from "../src/lib/i18n";
import content from "../src/content/showcase.json";
import assert from "node:assert/strict";
import { validateComment, downloadText } from "../src/lib/examples";
import { InteractionExamples } from "../src/components/InteractionExamples";

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

it("rejects whitespace-only fields before adding a comment", () => {
  expect(validateComment({ name: "  ", email: "\t", message: "\n" })).toEqual({
    name: "required",
    email: "required",
    message: "required",
  });
});

it("distinguishes malformed email from missing content", () => {
  expect(validateComment({ name: "Mira", email: "mira@", message: "A quiet note." })).toEqual({
    name: "",
    email: "email",
    message: "",
  });
});

it("accepts surrounding whitespace without changing the draft", () => {
  const draft = { name: " Mira ", email: " mira+notes@example.com ", message: " A quiet note. " };
  const original = { ...draft };
  expect(Object.values(validateComment(draft)).every((error) => !error)).toBe(true);
  expect(draft).toEqual(original);
});

it("validates a comment, focuses the first error and submits one reply while pending", () => {
  const c = content.interactions;
  render(createElement(InteractionExamples));
  fireEvent.click(screen.getByText(c.summary));
  fireEvent.click(screen.getByRole("button", { name: c.submit }));
  const name = screen.getByLabelText("Name");
  expect(document.activeElement).toBe(name);
  expect(name.getAttribute("aria-invalid")).toBe("true");
  fireEvent.change(name, { target: { value: "Mira" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "mira@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Reply: Ren" }));
  const message = screen.getByLabelText("Message");
  expect(document.activeElement).toBe(message);
  fireEvent.change(message, { target: { value: "A new reply." } });
  const form = message.closest("form");
  assert.ok(form);
  fireEvent.submit(form);
  expect(screen.getByRole("button", { name: c.pending }).hasAttribute("disabled")).toBe(true);
  fireEvent.submit(form);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(screen.getAllByText("A new reply.")).toHaveLength(1);
  assert.ok(message instanceof HTMLTextAreaElement);
  expect(message.value).toBe("");
  expect(screen.getByText(c.success)).toBeDefined();
  expect(screen.queryByText("mira@example.com")).toBeNull();
});

it("does not let a stale retry overwrite a subsequently selected empty state", () => {
  render(createElement(InteractionExamples));
  fireEvent.click(screen.getByText(content.interactions.summary));
  fireEvent.click(screen.getByRole("button", { name: "Show error state" }));
  fireEvent.click(screen.getByRole("button", { name: content.stateDemo.retry }));
  expect(screen.getByText(content.stateDemo.loading)).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Show empty state" }));
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(screen.getByText(content.stateDemo.empty)).toBeDefined();
  fireEvent.click(screen.getByRole("button", { name: "Show error state" }));
  fireEvent.click(screen.getByRole("button", { name: content.stateDemo.retry }));
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(screen.getByText(content.stateDemo.ready)).toBeDefined();
});

it("downloads a Markdown file and releases its temporary URL after the click", () => {
  vi.useFakeTimers();
  const createObjectURL = vi.fn(() => "blob:conversation");
  const revokeObjectURL = vi.fn();
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("conversation.md");
      expect(this.href).toBe("blob:conversation");
    });
  downloadText("## A thought\n\nKeep this.", "conversation.md");
  expect(click).toHaveBeenCalledOnce();
  expect(createObjectURL).toHaveBeenCalledWith(
    expect.objectContaining({ type: "text/markdown;charset=utf-8" }),
  );
  expect(revokeObjectURL).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1000);
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:conversation");
});
