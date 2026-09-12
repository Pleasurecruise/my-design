import { useEffect, useRef, useState } from "react";
import {
  Send,
  Reply,
  Trash2,
  Share2,
  Download,
  Link,
  RotateCcw,
  X,
  LoaderCircle,
  Check,
  FileText,
  Inbox,
  CircleAlert,
  AlignLeft,
} from "lucide-react";
import { useContent } from "../lib/i18n";
import { IconButton } from "./IconButton";
import { Modal } from "./Modal";
import { downloadText, validateComment, type CommentDraft } from "../lib/examples";

function ContentStates() {
  const content = useContent();
  const c = content.stateDemo;
  const [state, setState] = useState("ready");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const icons = [FileText, LoaderCircle, Inbox, CircleAlert, AlignLeft];
  function select(next: string) {
    if (timer.current) clearTimeout(timer.current);
    setState(next);
  }
  function retry() {
    select("loading");
    timer.current = setTimeout(() => setState("ready"), 500);
  }
  return (
    <article className="state-study">
      <div className="study-heading">
        <div>
          <h3>{c.title}</h3>
          <p className="small muted">{c.description}</p>
        </div>
        <div className="button-row" role="group" aria-label={c.title}>
          {c.states.map((item, index) => (
            <IconButton
              key={item.id}
              icon={icons[index]!}
              label={item.label}
              aria-pressed={state === item.id}
              onClick={() => select(item.id)}
            />
          ))}
        </div>
      </div>
      <div className="state-surface" aria-busy={state === "loading"}>
        <p className="eyebrow">{c.meta}</p>
        <p className={state === "long" ? "long-title" : ""} role="status">
          {c[state as "ready" | "loading" | "empty" | "error" | "long"]}
        </p>
        {state === "loading" && (
          <LoaderCircle className="loading-icon" size={19} aria-hidden="true" />
        )}
        {state === "error" && <IconButton icon={RotateCcw} label={c.retry} onClick={retry} />}
      </div>
    </article>
  );
}

export function InteractionExamples() {
  const content = useContent();
  const c = content.interactions;
  const [draft, setDraft] = useState<CommentDraft>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [comments, setComments] = useState(c.comments);
  const [replyTo, setReplyTo] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [overlay, setOverlay] = useState<"delete" | "share" | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function submit() {
    const next = validateComment(draft);
    setErrors(next);
    const invalid = Object.entries(next).find(([, value]) => value);
    if (invalid) {
      document.getElementById(`comment-${invalid[0]}`)?.focus();
      return;
    }
    setPending(true);
    setStatus(c.pending);
    timer.current = setTimeout(() => {
      setComments((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          name: draft.name.trim(),
          body: draft.message.trim(),
          meta: c.you,
          replyTo,
          author: false,
        },
      ]);
      setPending(false);
      setReplyTo("");
      setDraft({ name: "", email: "", message: "" });
      setStatus(c.success);
    }, 500);
  }
  const shareUrl = new URL("#components", location.href).href;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus(c.copied);
    } catch {
      setShareStatus(c.copyError);
    }
  }
  return (
    <details className="example-expansion">
      <summary>{c.summary}</summary>
      <p className="small muted expansion-intro">{c.intro}</p>
      <div className="examples-grid">
        <article className="example-panel">
          <h3>{c.formTitle}</h3>
          <form
            className="comment-form"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (!pending) submit();
            }}
            aria-busy={pending}
          >
            {c.fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={`comment-${field.id}`}>{field.label}</label>
                {field.id === "message" ? (
                  <textarea
                    id="comment-message"
                    rows={4}
                    value={draft.message}
                    placeholder={field.placeholder}
                    disabled={pending}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby="comment-message-error"
                    onChange={(event) => {
                      setDraft({ ...draft, message: event.target.value });
                      setErrors({ ...errors, message: "" });
                    }}
                  />
                ) : (
                  <input
                    id={`comment-${field.id}`}
                    type={field.id === "email" ? "email" : "text"}
                    autoComplete={field.id}
                    value={draft[field.id as "name" | "email"]}
                    placeholder={field.placeholder}
                    disabled={pending}
                    required
                    aria-invalid={Boolean(errors[field.id])}
                    aria-describedby={`comment-${field.id}-error`}
                    onChange={(event) => {
                      setDraft({ ...draft, [field.id]: event.target.value });
                      setErrors({ ...errors, [field.id]: "" });
                    }}
                  />
                )}
                <p className="field-error" id={`comment-${field.id}-error`}>
                  {errors[field.id] === "email"
                    ? c.invalidEmail
                    : errors[field.id]
                      ? c.required
                      : ""}
                </p>
              </div>
            ))}
            {replyTo && (
              <div className="reply-context">
                <span>
                  {c.replying} {replyTo}
                </span>
                <IconButton
                  icon={X}
                  label={c.cancelReply}
                  onClick={() => setReplyTo("")}
                  disabled={pending}
                />
              </div>
            )}
            <div className="form-footer">
              <p className="small muted" role="status">
                {status}
              </p>
              <IconButton
                icon={pending ? LoaderCircle : Send}
                className={pending ? "loading-icon" : ""}
                label={pending ? c.pending : c.submit}
                type="submit"
                variant="primary"
                disabled={pending}
              />
            </div>
          </form>
        </article>
        <article className="example-panel">
          <div className="thread-heading">
            <h3>{c.threadTitle}</h3>
            <div className="button-row">
              <IconButton
                icon={Share2}
                label={c.share}
                onClick={() => {
                  setShareStatus("");
                  setOverlay("share");
                }}
              />
              <IconButton
                icon={Trash2}
                label={c.delete}
                disabled={!comments.length || pending}
                onClick={() => setOverlay("delete")}
              />
            </div>
          </div>
          <ul className="comment-thread">
            {comments.map((storedComment) => {
              const comment =
                c.comments.find((sample) => sample.id === storedComment.id) ?? storedComment;
              return (
                <li key={comment.id} className={comment.replyTo ? "comment-reply" : ""}>
                  <span className="comment-avatar" aria-hidden="true">
                    {comment.name.slice(0, 1)}
                  </span>
                  <div>
                    <div className="comment-meta">
                      <strong>{comment.name}</strong>
                      {comment.author && <span className="tag">{c.author}</span>}
                      <span>{comment.meta}</span>
                    </div>
                    {comment.replyTo && (
                      <p className="small muted">
                        {c.replying} {comment.replyTo}
                      </p>
                    )}
                    <p>{comment.body}</p>
                    <IconButton
                      icon={Reply}
                      label={`${c.reply}: ${comment.name}`}
                      disabled={pending}
                      onClick={() => {
                        setReplyTo(comment.name);
                        document.getElementById("comment-message")?.focus();
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {!comments.length && <p className="small muted">{content.stateDemo.empty}</p>}
        </article>
      </div>
      <ContentStates />
      {overlay === "delete" && (
        <Modal title={c.deleteTitle} onClose={() => setOverlay(null)}>
          <p>{c.deleteDescription}</p>
          <div className="overlay-actions">
            <IconButton icon={X} label={c.cancel} onClick={() => setOverlay(null)} />
            <IconButton
              icon={Trash2}
              label={c.confirm}
              className="danger-action"
              onClick={() => {
                setComments((previous) => previous.slice(0, -1));
                setStatus(c.removed);
                setOverlay(null);
              }}
            />
          </div>
        </Modal>
      )}
      {overlay === "share" && (
        <Modal title={c.shareTitle} sheet onClose={() => setOverlay(null)}>
          <p>{c.shareDescription}</p>
          <div className="overlay-actions">
            <IconButton
              icon={shareStatus === c.copied ? Check : Link}
              label={c.copyLink}
              onClick={copyLink}
            />
            <IconButton
              icon={Download}
              label={c.download}
              onClick={() =>
                downloadText(
                  comments.map((comment) => `## ${comment.name}\n\n${comment.body}\n`).join("\n"),
                  "conversation.md",
                )
              }
            />
          </div>
          <p className="small muted" role="status">
            {shareStatus}
          </p>
          {shareStatus === c.copyError && <code className="share-url">{shareUrl}</code>}
        </Modal>
      )}
    </details>
  );
}
