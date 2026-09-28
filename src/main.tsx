import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadingHost } from "./lib/loading";
import "./styles/entry.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");

const { default: Page } =
  location.hostname === loadingHost
    ? await import("./components/LoadingLanding")
    : await import("./DesignEntry");

createRoot(root).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
