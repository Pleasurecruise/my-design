import { useContent } from "./lib/i18n";
import { useTheme } from "./lib/theme";
import { resolvePage } from "./lib/metadata";
import { Sidebar } from "./components/Sidebar";
import { CharacterPage } from "./components/CharacterPage";
import { DesignPage } from "./components/DesignPage";
import { ArrowUp } from "lucide-react";

export default function App() {
  const content = useContent();
  const section = resolvePage(window.location.pathname).section;
  const { dark, toggle } = useTheme();
  return (
    <>
      <a className="skip-link" href="#main">
        {content.labels.skip}
      </a>
      <Sidebar section={section} dark={dark} toggle={toggle} />
      <div className="page" id="top">
        <main id="main" tabIndex={-1}>
          {section === "oc" ? <CharacterPage /> : <DesignPage dark={dark} />}
        </main>
        <footer>
          <span>
            {content.site.name} · {content.site.footer}
          </span>
          <a
            className="icon-link"
            href="#top"
            aria-label={content.labels.back}
            title={content.labels.back}
          >
            <ArrowUp size={19} strokeWidth={1.6} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </>
  );
}
