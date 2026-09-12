export type CommentDraft = { name: string; email: string; message: string };
export function validateComment(draft: CommentDraft) {
  return {
    name: draft.name.trim() ? "" : "required",
    email: !draft.email.trim()
      ? "required"
      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
        ? ""
        : "email",
    message: draft.message.trim() ? "" : "required",
  };
}
export function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
