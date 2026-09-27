import { useState } from "react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";
import { RotateCcw } from "lucide-react";
import { Section } from "./Section";
import { CodeBlock } from "./CodeBlock";
import { Specimens } from "./Specimens";
import { TypographyStudy } from "./TypographyStudy";
import { InteractionExamples } from "./InteractionExamples";
import { DocumentLinks } from "./Documents";
import { ComponentExamples } from "./ComponentExamples";
import { useTokenValues } from "../lib/tokens";

export function DesignPage({ dark }: { dark: boolean }) {
  const content = useContent();
  const values = useTokenValues(dark);
  const [motionKey, setMotionKey] = useState(0);
  return (
    <>
      <header className="hero">
        <h1>{content.site.name}</h1>
        <p className="hero-tagline">{content.site.title.replaceAll("\n", " ")}</p>
        <p className="hero-description">{content.site.description}</p>
        <dl className="hero-tokens">
          {content.themeOverview.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.kind === "color" && (
                  <span
                    className="token-dot"
                    style={{ background: `var(${item.token})` }}
                    aria-hidden="true"
                  />
                )}
                {item.kind === "neutral" ? (
                  <span>
                    {item.tokens.length} {content.themeDefinition.neutralScale}
                  </span>
                ) : (
                  <code>
                    {item.kind === "font"
                      ? values[item.token]?.split(",")[0]?.replaceAll('"', "")
                      : values[item.token]}
                  </code>
                )}
              </dd>
              <dd className="theme-definition-detail">{item.detail}</dd>
              {item.kind === "neutral" && (
                <dd className="neutral-strip" aria-hidden="true">
                  {item.tokens.map((token) => (
                    <span key={token} style={{ background: `var(${token})` }} />
                  ))}
                </dd>
              )}
            </div>
          ))}
        </dl>
        <p className="theme-definition-note">{content.themeDefinition.supporting}</p>
      </header>
      <Section id="specimens">
        <Specimens />
        <DocumentLinks />
      </Section>
      <Section id="principles">
        <ol className="principle-grid">
          {content.principles.map((principle, index) => (
            <li key={principle.title}>
              <span className="annotation">{String(index + 1).padStart(2, "0")}</span>
              <p>
                <strong>{principle.title}</strong> {principle.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="color">
        <div className="neutral-grid">
          {content.colors
            .filter((color) => color.group === "neutral")
            .map((color) => (
              <article key={color.token}>
                <div className="swatch" style={{ background: `var(${color.token})` }} />
                <h3>{color.name}</h3>
                <p className="small muted">{color.role}</p>
                <code>{values[color.token]}</code>
              </article>
            ))}
        </div>
        <div className="accent-feature">
          <div>
            <p className="eyebrow">{content.accent.subtitle}</p>
            <h3>{content.accent.title}</h3>
            <p>{content.accent.text}</p>
          </div>
          <div className="accent-specimens">
            {content.colors
              .filter((color) => color.group === "accent")
              .map((color) => (
                <div key={color.token}>
                  <span className="accent-swatch" style={{ background: `var(${color.token})` }} />
                  <span>{color.name}</span>
                  <code>{values[color.token]}</code>
                </div>
              ))}
          </div>
        </div>
        <div className="state-palette">
          {content.colors
            .filter((color) => color.group === "state")
            .map((color) => (
              <div key={color.token}>
                <span className="state-swatch" style={{ background: `var(${color.token})` }} />
                <div>
                  <h3>{color.name}</h3>
                  <p className="small muted">{color.role}</p>
                </div>
                <code>{values[color.token]}</code>
              </div>
            ))}
        </div>
        <p className="small muted color-note">{content.accent.note}</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{content.labels.token}</th>
                <th>
                  {content.labels.value} / {dark ? content.labels.dark : content.labels.light}
                </th>
                <th>{content.labels.role}</th>
              </tr>
            </thead>
            <tbody>
              {content.colorTable.map((row) => (
                <tr key={row.token}>
                  <td>
                    <code>{row.token}</code>
                  </td>
                  <td>
                    <code>{values[row.token]}</code>
                  </td>
                  <td>{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="typography">
        {content.typography.map((type) => (
          <article className="type-specimen" key={type.token}>
            <div>
              <span className="eyebrow">{type.role}</span>
              <h3>{type.name}</h3>
              <code>{type.token}</code>
            </div>
            <div>
              <p className={`type-sample type-sample--${type.kind}`}>{type.sample}</p>
              <p className="small muted">{type.detail}</p>
            </div>
          </article>
        ))}
        <div className="weight-scale">
          {content.weights.map((weight) => (
            <div key={weight.value} style={{ fontWeight: weight.value }}>
              <span>Aa</span>
              <p>
                {weight.value} / {weight.label}
              </p>
            </div>
          ))}
        </div>
        <TypographyStudy values={values} />
      </Section>
      <Section id="structure">
        <div className="space-study">
          <div>
            <h3>{content.structure.spacingTitle}</h3>
            <p className="muted">{content.structure.spacingText}</p>
          </div>
          <div className="space-examples">
            {(["compact", "comfortable", "generous"] as const).map((kind) => (
              <div key={kind}>
                <div className={`space-lines space-lines--${kind}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="small muted">{content.structure[kind]}</span>
              </div>
            ))}
          </div>
        </div>
        <h3 className="subheading">{content.structure.radiusTitle}</h3>
        <div className="radius-grid">
          {content.radii.map((radius) => (
            <div key={radius.token}>
              <div className="radius-sample" style={{ borderRadius: `var(${radius.token})` }}>
                {values[radius.token]}
              </div>
              <code>{radius.token}</code>
              <p className="small muted">{radius.label}</p>
            </div>
          ))}
        </div>
        <h3 className="subheading">{content.structure.shadowTitle}</h3>
        <div className="shadow-grid">
          {content.shadows.map((shadow) => (
            <div style={{ boxShadow: `var(${shadow.token})` }} key={shadow.token}>
              <h3>{shadow.label}</h3>
              <code>{shadow.token}</code>
            </div>
          ))}
        </div>
      </Section>
      <Section id="motion">
        <div className="motion-grid">
          {content.motion.map((motion) => (
            <article key={motion.token}>
              <div className="motion-track">
                <span
                  key={motionKey}
                  className={motionKey ? "motion-object motion-object--playing" : "motion-object"}
                  style={{ animationDuration: `var(${motion.token})` }}
                />
              </div>
              <div className="motion-heading">
                <h3>{motion.label}</h3>
                <code>{values[motion.token]}</code>
              </div>
              <p className="small muted">{motion.description}</p>
              <code>{motion.token}</code>
            </article>
          ))}
        </div>
        <div className="motion-footer">
          <p className="muted small">
            {content.motionNote}
            <br />
            {content.labels.reduced}
          </p>
          <IconButton
            icon={RotateCcw}
            label={content.labels.replay}
            onClick={() => setMotionKey((key) => key + 1)}
          />
        </div>
      </Section>
      <Section id="components">
        <ComponentExamples />
        <InteractionExamples />
      </Section>
      <Section id="usage">
        <CodeBlock title={content.usage.title} code={content.usage.importCode} />
        <CodeBlock
          title={content.usage.exampleTitle}
          code={content.usage.exampleCode}
          filename={content.usage.filename}
          language={content.usage.language}
          highlightLines={content.usage.highlightLines}
        />
        <div className="usage-notes">
          <h3>{content.usage.themeTitle}</h3>
          <p>{content.usage.themeText}</p>
          <p className="muted">{content.usage.boundaries}</p>
        </div>
      </Section>
      <Section id="decisions">
        <div className="table-scroll">
          <table className="decision-table">
            <thead>
              <tr>
                <th>{content.labels.role}</th>
                <th>{content.labels.recommended}</th>
                <th>{content.labels.avoid}</th>
              </tr>
            </thead>
            <tbody>
              {content.decisions.map((decision) => (
                <tr key={decision.task}>
                  <th scope="row">{decision.task}</th>
                  <td>{decision.use}</td>
                  <td className="muted">{decision.avoid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
