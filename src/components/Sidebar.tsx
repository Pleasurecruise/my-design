import { Cat, Layers, UserRound } from "lucide-react";
import { useContent, useLocale } from "../lib/i18n";
import { pagePath } from "../lib/metadata";
import type { SiteSection } from "../lib/metadata";
import { ShowcaseToolbar } from "./ShowcaseToolbar";

export function Sidebar({
  section,
  dark,
  toggle,
}: {
  section: SiteSection;
  dark: boolean;
  toggle: () => void;
}) {
  const content = useContent();
  const locale = useLocale();
  const chapters = section === "oc" ? content.oc.chapters : content.sections;
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href={pagePath(locale)}>
        <Cat className="character-mark" size={24} strokeWidth={1.35} aria-hidden="true" />
        <span>
          {content.site.name}
          <small>{content.navigation.studio}</small>
        </span>
      </a>
      <nav className="sidebar-navigation" aria-label={content.navigation.label}>
        <a
          className="sidebar-link"
          href={pagePath(locale)}
          aria-current={section === "design" ? "page" : undefined}
        >
          <Layers size={18} strokeWidth={1.5} aria-hidden="true" />
          {content.navigation.design}
          <span className="sidebar-code" aria-hidden="true">
            01
          </span>
        </a>
        <a
          className="sidebar-link"
          href={pagePath(locale, undefined, "oc")}
          aria-current={section === "oc" ? "page" : undefined}
        >
          <UserRound size={18} strokeWidth={1.5} aria-hidden="true" />
          {content.navigation.oc}
          <span className="sidebar-code" aria-hidden="true">
            02
          </span>
        </a>
        <div className="sidebar-chapters">
          <p className="eyebrow">{content.navigation.chapters}</p>
          <ol>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  {chapter.label}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="sidebar-footer">
        <p>{content.site.signature}</p>
        <ShowcaseToolbar dark={dark} toggle={toggle} />
      </div>
    </aside>
  );
}
