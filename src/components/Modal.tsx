import { useEffect, useRef, type ReactNode, type KeyboardEventHandler } from "react";
import { X } from "lucide-react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";

export function Modal({
  title,
  onClose,
  children,
  sheet = false,
  className = "",
  onKeyDown,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  sheet?: boolean;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
}) {
  const content = useContent();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const trigger = document.activeElement;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      requestAnimationFrame(() => {
        if (!dialog.isConnected && trigger instanceof HTMLElement && trigger.isConnected)
          trigger.focus();
      });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`sample-dialog interaction-dialog ${sheet ? "interaction-dialog--sheet" : ""} ${className}`}
      aria-label={title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) ref.current?.close();
      }}
    >
      <div className="dialog-heading">
        <h3>{title}</h3>
        <IconButton
          icon={X}
          label={content.interactions.close}
          onClick={() => ref.current?.close()}
          autoFocus
        />
      </div>
      <div className="dialog-body">{children}</div>
    </dialog>
  );
}
