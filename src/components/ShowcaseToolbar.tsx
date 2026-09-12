import { useEffect, useRef, useState } from "react";
import { Accessibility, Languages, Moon, Sun, X } from "lucide-react";
import { useContent, useLocale, setLocale } from "../lib/i18n";
import { IconButton } from "./IconButton";

export function ShowcaseToolbar({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const content = useContent();
  const c = content.toolbar;
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    largerText: false,
    strongFocus: false,
    reduceMotion: false,
  });
  const options: { key: keyof typeof preferences; label: string }[] = [
    { key: "largerText", label: c.largerText },
    { key: "strongFocus", label: c.strongFocus },
    { key: "reduceMotion", label: c.reduceMotion },
  ];
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    for (const [key, value] of Object.entries(preferences)) {
      document.documentElement.toggleAttribute(`data-${key.toLowerCase()}`, value);
    }
    window.dispatchEvent(new Event("resize"));
    return () => {
      for (const key of Object.keys(preferences))
        document.documentElement.removeAttribute(`data-${key.toLowerCase()}`);
    };
  }, [preferences]);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <div
      className="toolbar"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <div className="toolbar-controls" role="group" aria-label={c.label}>
        <button
          className="toolbar-language"
          type="button"
          aria-label={c.switchLanguage}
          title={c.switchLanguage}
          onClick={() => setLocale(locale === "en" ? "zh" : "en")}
        >
          <Languages size={15} strokeWidth={1.6} aria-hidden="true" />
          <span>{c.locale}</span>
        </button>
        <IconButton
          icon={dark ? Moon : Sun}
          onClick={toggle}
          label={dark ? content.labels.switchLight : content.labels.switchDark}
        />
        <IconButton
          icon={Accessibility}
          label={c.accessibility}
          aria-expanded={open}
          aria-controls="accessibility-panel"
          onClick={(event) => {
            trigger.current = event.currentTarget;
            setOpen(!open);
          }}
        />
      </div>
      <div
        className="accessibility-panel"
        id="accessibility-panel"
        role="region"
        aria-labelledby="accessibility-title"
        hidden={!open}
        ref={panel}
        tabIndex={-1}
      >
        <div className="accessibility-heading">
          <h2 id="accessibility-title">{c.accessibility}</h2>
          <IconButton icon={X} label={c.close} onClick={close} />
        </div>
        <p>{c.description}</p>
        {options.map(({ key, label }) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={(event) => setPreferences({ ...preferences, [key]: event.target.checked })}
            />
          </label>
        ))}
        <p className="small muted">{c.motionNote}</p>
      </div>
    </div>
  );
}
