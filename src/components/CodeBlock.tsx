import { Fragment, useState } from "react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";
import { Copy, Check } from "lucide-react";

export function CodeBlock({
  title,
  code,
  filename,
  language,
  highlightLines = [],
}: {
  title: string;
  code: string;
  filename?: string;
  language?: string;
  highlightLines?: number[];
}) {
  const content = useContent();
  const [status, setStatus] = useState("");
  const lines = code.split("\n");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus(content.labels.copied);
    } catch {
      setStatus(content.labels.copyFailed);
    }
  }
  return (
    <div className="code-block">
      <div className="code-heading">
        <div>
          <h3>{title}</h3>
          {filename && (
            <p className="code-meta">
              {filename} · {language}
            </p>
          )}
        </div>
        <IconButton
          icon={status === content.labels.copied ? Check : Copy}
          label={content.labels.copy}
          onClick={copy}
        />
      </div>
      <pre tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <Fragment key={index}>
              <span
                className={`code-line ${highlightLines.includes(index + 1) ? "code-line--highlight" : ""}`}
              >
                {line || " "}
              </span>
              {index < lines.length - 1 ? "\n" : ""}
            </Fragment>
          ))}
        </code>
      </pre>
      <p className="copy-status" role="status">
        {status}
      </p>
    </div>
  );
}
