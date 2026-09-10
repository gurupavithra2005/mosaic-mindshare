/**
 * Input hardening for a frontend-only app.
 *
 * Nothing here is ever rendered with `dangerouslySetInnerHTML`, but user text
 * is still normalised before it enters the store so that pasted markup,
 * control characters or absurd lengths can't corrupt the local state that we
 * persist to `localStorage`.
 */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Strips angle brackets, control characters and collapses runaway whitespace. */
export function sanitizeText(input: string, maxLength = 600): string {
  return input
    .replace(CONTROL_CHARS, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/[ \t]{3,}/g, "  ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/** Single-line variant for titles, names and prompts. */
export function sanitizeLine(input: string, maxLength = 120): string {
  return sanitizeText(input.replace(/\s+/g, " "), maxLength);
}

/** Only allows http(s) links; anything else (javascript:, data:) becomes null. */
export function safeUrl(input: string): string | null {
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
