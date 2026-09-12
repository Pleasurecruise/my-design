import { useState, type ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "./Button";

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label" | "title"
> & {
  icon: LucideIcon;
  label: string;
  variant?: "primary" | "secondary";
};

export function IconButton({
  icon: Icon,
  label,
  variant = "secondary",
  className = "",
  onKeyDown,
  onFocus,
  ...props
}: IconButtonProps) {
  const [dismissed, setDismissed] = useState(false);
  return (
    <span
      className="icon-control"
      data-tooltip={label}
      data-dismissed={dismissed}
      onPointerEnter={() => setDismissed(false)}
    >
      <Button
        {...props}
        variant={variant}
        className={`icon-button ${className}`}
        aria-label={label}
        onFocus={(event) => {
          setDismissed(false);
          onFocus?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setDismissed(true);
          onKeyDown?.(event);
        }}
      >
        <Icon size={19} strokeWidth={1.6} aria-hidden="true" focusable="false" />
      </Button>
    </span>
  );
}
