import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Printer } from "lucide-react";
import data from "../content/documents.json";
import { useContent, useDocuments, useLocale } from "../lib/i18n";
import { pagePath } from "../lib/metadata";
import { IconButton } from "./IconButton";

export function getDocument(id: string | null) {
  return data.documents.find((document) => document.id === id);
}

export function DocumentLinks() {
  const data = useDocuments();
  const locale = useLocale();
  return (
    <div className="document-links">
      <div>
        <h3>{data.labels.title}</h3>
        <p className="small muted">{data.labels.description}</p>
      </div>
      <ul>
        {data.documents.map((document) => (
          <li key={document.id}>
            <a href={pagePath(locale, document.id)} target="_blank" rel="noreferrer">
              {document.label}
              <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DocumentPage({
  document: original,
}: {
  document: NonNullable<ReturnType<typeof getDocument>>;
}) {
  const data = useDocuments();
  const locale = useLocale();
  const content = useContent();
  const doc = data.documents.find((item) => item.id === original.id)!;
  useEffect(() => {
    window.document.title = `${doc.title} — ${content.site.name}`;
    window.document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", doc.subtitle);
  }, [doc]);
  return (
    <div className={`document-page document-page--${doc.id}`}>
      <nav className="document-toolbar" aria-label={data.labels.title}>
        <a
          href={`${pagePath(locale)}#specimens`}
          className="icon-link"
          aria-label={data.labels.back}
          title={data.labels.back}
        >
          <ArrowLeft size={19} aria-hidden="true" />
        </a>
        <IconButton icon={Printer} label={data.labels.print} onClick={() => window.print()} />
      </nav>
      <main className="document-paper">
        <header>
          <p className="eyebrow">{doc.meta}</p>
          <h1>{doc.title}</h1>
          <p className="document-subtitle">{doc.subtitle}</p>
        </header>
        {doc.metrics.length > 0 && (
          <dl className="document-metrics">
            {doc.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="document-prose">
          {doc.blocks.map((block, index) => {
            if (block.kind === "heading") return <h2 key={index}>{block.text}</h2>;
            if (block.kind === "quote") return <blockquote key={index}>{block.text}</blockquote>;
            if (block.kind === "list")
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            if (block.kind === "code")
              return (
                <pre key={index}>
                  <code>{block.text}</code>
                </pre>
              );
            return <p key={index}>{block.text}</p>;
          })}
        </div>
        <footer className="document-footer">
          {content.site.name} · {data.labels.sample}
        </footer>
      </main>
    </div>
  );
}
