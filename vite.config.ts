import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { sharingPages, resolvePage } from "./src/lib/metadata";

import { renderMetadata } from "./scripts/site-metadata";

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
        handler: (html, context) => {
          const url = new URL(context.originalUrl ?? context.path, "https://local.invalid");
          const page = resolvePage(url.pathname, url.search);
          return renderMetadata(html, page.locale, page.documentId, page.section);
        },
      },
      generateBundle: {
        order: "post",
        handler(_, bundle) {
          const index = bundle["index.html"];
          if (!index || index.type !== "asset" || typeof index.source !== "string") {
            throw new Error("Missing built HTML for localized sharing pages");
          }
          for (const page of sharingPages.filter((page) => page.path !== "/")) {
            this.emitFile({
              type: "asset",
              fileName: `${page.path.slice(1)}index.html`,
              source: renderMetadata(index.source, page.locale, page.documentId, page.section),
            });
          }
        },
      },
    },
  ],
});
