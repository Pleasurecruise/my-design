import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { syncLocaleMetadata } from "./lib/i18n";
import App from "./App";
import { resolvePage } from "./lib/metadata";
import { DocumentPage, getDocument } from "./components/Documents";
import "./styles/global.css";
import "./styles/showcase.css";
import "./styles/examples.css";
import "./styles/character.css";

syncLocaleMetadata();

const sample = getDocument(resolvePage(location.pathname, location.search).documentId ?? null);

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");

createRoot(root).render(
  <StrictMode>{sample ? <DocumentPage document={sample} /> : <App />}</StrictMode>,
);
