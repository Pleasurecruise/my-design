import { useState } from "react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";
import {
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  LockKeyhole,
  Plus,
  CircleCheck,
  TriangleAlert,
  CircleX,
  BookOpen,
} from "lucide-react";

export function ComponentExamples() {
  const content = useContent();
  const c = content.components;
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [created, setCreated] = useState("");
  const [reading, setReading] = useState(false);
  return (
    <div className="examples-grid">
      <article className="example-panel">
        <h3>{c.buttons}</h3>
        <div className="button-row">
          <IconButton
            icon={saved ? BookmarkCheck : Bookmark}
            label={c.save}
            variant="primary"
            onClick={() => setSaved(!saved)}
            aria-pressed={saved}
          />
          <IconButton icon={RotateCcw} label={c.reset} onClick={() => setSaved(false)} />
          <IconButton icon={LockKeyhole} label={c.disabled} disabled />
        </div>
        <p className="small muted" role="status">
          {saved ? c.savedMessage : c.idleMessage}
        </p>
      </article>
      <article className="example-panel">
        <h3>{c.fields}</h3>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setError(!name.trim());
            setCreated(name.trim());
          }}
        >
          <label htmlFor="collection-name">{c.inputLabel}</label>
          <div className="input-row">
            <input
              id="collection-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(false);
                setCreated("");
              }}
              placeholder={c.placeholder}
              aria-invalid={error}
              aria-describedby="collection-hint"
              required
            />
            <IconButton icon={Plus} label={c.submit} type="submit" />
          </div>
          <p
            id="collection-hint"
            className={`small ${error ? "state-error" : "muted"}`}
            aria-live="polite"
          >
            {error ? c.empty : created ? `${c.created} ${created}` : c.hint}
          </p>
        </form>
      </article>
      <article className="example-panel">
        <h3>{c.states}</h3>
        <ul className="status-list">
          <li className="state-success">
            <CircleCheck size={19} strokeWidth={1.6} aria-hidden="true" />
            {c.success}
          </li>
          <li className="state-warning">
            <TriangleAlert size={19} strokeWidth={1.6} aria-hidden="true" />
            {c.warning}
          </li>
          <li className="state-error">
            <CircleX size={19} strokeWidth={1.6} aria-hidden="true" />
            {c.error}
          </li>
        </ul>
      </article>
      <article className="example-panel">
        <h3>{c.preferences}</h3>
        <div className="switch-row">
          <label htmlFor="reading-mode">{c.switchLabel}</label>
          <IconButton
            icon={BookOpen}
            label={c.switchLabel}
            id="reading-mode"
            aria-pressed={reading}
            aria-describedby="reading-hint"
            onClick={() => setReading(!reading)}
          />
        </div>
        <p id="reading-hint" className="small muted">
          {c.switchHint}
        </p>
        <p className={`reading-example ${reading ? "reading-example--spacious" : ""}`}>
          {c.readingSample}
        </p>
      </article>
    </div>
  );
}
