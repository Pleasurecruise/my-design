import { Languages, Moon, Sun } from "lucide-react";
import { useContent, useLocale, setLocale } from "../lib/i18n";
import { IconButton } from "./IconButton";

export function ShowcaseToolbar({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const content = useContent();
  const c = content.toolbar;
  const locale = useLocale();
  return (
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
    </div>
  );
}
