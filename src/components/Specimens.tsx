import { useEffect, useRef, useState } from "react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";
import { X, ArrowUpRight } from "lucide-react";

type Sample = ReturnType<typeof useContent>["samples"][number];

function Specimen({ sample, compact = false }: { sample: Sample; compact?: boolean }) {
  return (
    <article className={`specimen specimen--${sample.kind} ${compact ? "specimen--compact" : ""}`}>
      <p className="eyebrow">{sample.kicker}</p>
      <h3>{sample.heading}</h3>
      <div className="specimen-prose">
        {sample.paragraphs.slice(0, compact ? 1 : undefined).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {sample.kind === "collection" ? (
        <ol className="collection-list">
          {sample.tags.map((tag, i) => (
            <li key={tag}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {tag}
            </li>
          ))}
        </ol>
      ) : (
        <div className="tags">
          {sample.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="specimen-meta">{sample.meta}</p>
    </article>
  );
}

export function Specimens() {
  const content = useContent();
  const [selected, setSelected] = useState<Sample | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selected || !dialog.current) return;
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);
  return (
    <>
      <div className="specimen-grid">
        {content.samples.map((sample) => (
          <div className="sample-item" key={sample.id}>
            <button
              className="specimen-trigger"
              onClick={() => setSelected(sample)}
              aria-label={`${content.labels.preview}: ${sample.title}`}
            >
              <div aria-hidden="true">
                <Specimen sample={sample} compact />
              </div>
              <span className="specimen-open" aria-hidden="true">
                <ArrowUpRight size={18} strokeWidth={1.6} />
              </span>
            </button>
            <h3>{sample.title}</h3>
            <p className="muted small">{sample.subtitle}</p>
          </div>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="sample-dialog"
        aria-label={selected?.title}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <div className="dialog-content">
            <div className="dialog-heading">
              <span className="eyebrow">{content.labels.sample}</span>
              <IconButton
                icon={X}
                label={content.labels.close}
                onClick={() => dialog.current?.close()}
              />
            </div>
            <Specimen sample={selected} />
          </div>
        )}
      </dialog>
    </>
  );
}
