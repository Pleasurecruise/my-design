import { useEffect, useState } from "react";

export function useTokenValues(dark: boolean) {
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const update = () => {
      const computed = getComputedStyle(document.documentElement);
      const next: Record<string, string> = {};
      for (let index = 0; index < computed.length; index++) {
        const name = computed.item(index);
        if (/^--(color|font|radius|shadow|duration|text|leading|weight)-/.test(name))
          next[name] = computed.getPropertyValue(name).trim();
      }
      setValues(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [dark]);
  return values;
}
