import { useState } from "react";
import { BookOpen, Columns2, Rows3 } from "lucide-react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";

export function TypographyStudy({ values }: { values: Record<string, string> }) {
  const content = useContent();
  const [view, setView] = useState("both");
  const c = content.comparison;
  return (
    <>
      <h3 className="subheading">{content.typeScale.title}</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {content.typeScale.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.typeScale.rows.map((row) => (
              <tr key={row.size}>
                <td>{row.label}</td>
                <td>
                  <code>{values[row.size]}</code>
                </td>
                <td>
                  <code>{values[row.line]}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="study-heading">
        <div>
          <h3>{c.title}</h3>
          <p className="small muted">{c.description}</p>
        </div>
        <div className="button-row" role="group" aria-label={c.title}>
          <IconButton
            icon={Columns2}
            label={c.both}
            aria-pressed={view === "both"}
            onClick={() => setView("both")}
          />
          <IconButton
            icon={BookOpen}
            label={c.reading}
            aria-pressed={view === "reading"}
            onClick={() => setView("reading")}
          />
          <IconButton
            icon={Rows3}
            label={c.everyday}
            aria-pressed={view === "everyday"}
            onClick={() => setView("everyday")}
          />
        </div>
      </div>
      <div className="comparison-grid" data-view={view}>
        {c.variants.map((variant) => (
          <article
            key={variant.id}
            className={`comparison-panel comparison-panel--${variant.id}`}
            hidden={view !== "both" && view !== variant.id}
          >
            <header>
              <h4>{variant.label}</h4>
              <p className="small muted">{variant.description}</p>
            </header>
            <div className="comparison-content">
              <p className="eyebrow">{c.kicker}</p>
              <h3>{c.heading}</h3>
              {c.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <blockquote>{c.quote}</blockquote>
              <p className="sample-meta">{c.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
