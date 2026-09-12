import type { ReactNode } from "react";
import { useContent } from "../lib/i18n";

export function Section({ id, children }: { id: string; children: ReactNode }) {
  const content = useContent();
  const index = content.sections.findIndex((section) => section.id === id);
  const section = content.sections[index]!;
  return (
    <section id={id} className="section" aria-labelledby={`${id}-heading`}>
      <header className="section-heading">
        <p className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {section.label}
        </p>
        <h2 id={`${id}-heading`}>{section.title}</h2>
        <p>{section.description}</p>
      </header>
      {children}
    </section>
  );
}
