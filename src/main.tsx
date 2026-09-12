import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { syncLocaleMetadata } from "./lib/i18n";
import App from "./App";
import { DocumentPage, getDocument } from "./components/Documents";
import "./styles/global.css";
import "./styles/showcase.css";
import "./styles/examples.css";

syncLocaleMetadata();

const sample = getDocument(new URLSearchParams(location.search).get("document"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>{sample ? <DocumentPage document={sample} /> : <App />}</StrictMode>,
);
