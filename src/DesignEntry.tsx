import App from "./App";
import { syncLocaleMetadata } from "./lib/i18n";
import { resolvePage } from "./lib/metadata";
import { DocumentPage, getDocument } from "./components/Documents";
import "./styles/global.css";
import "./styles/showcase.css";
import "./styles/examples.css";
import "./styles/character.css";

syncLocaleMetadata();

const sample = getDocument(resolvePage(location.pathname, location.search).documentId ?? null);

export default function DesignEntry() {
  return sample ? <DocumentPage document={sample} /> : <App />;
}
