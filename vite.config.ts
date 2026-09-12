import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import content from "./src/content/showcase.json" with { type: "json" };

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["dist/**", "node_modules/**", ".idea/**"],
  },
  fmt: { ignorePatterns: ["dist/**", "node_modules/**", ".idea/**"] },
  test: {
    include: ["tests/**/*.test.ts"],
    // Let jsdom provide browser storage instead of Node's experimental storage.
    execArgv: ["--no-experimental-webstorage"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json-summary", "html"],
    },
  },
  plugins: [
    react(),
    {
      name: "showcase-metadata",
      transformIndexHtml: {
        order: "pre",
        handler: (html) =>
          html
            .replace(
              "%SITE_TITLE%",
              escapeHtml(`${content.site.name} — ${content.site.title.replaceAll("\n", " ")}`),
            )
            .replace("%SITE_DESCRIPTION%", escapeHtml(content.site.metadata))
            .replace(
              /(['"])__THEME_KEY__\1/,
              JSON.stringify(content.site.themeKey).replaceAll("<", "\\u003c"),
            ),
      },
    },
  ],
});
