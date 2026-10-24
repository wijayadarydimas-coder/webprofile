/**
 * Sanitizes plain text by escaping HTML special characters to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates external URL to prevent javascript: or data: injection.
 */
export function isSafeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Sanitizes user-submitted comment or markdown text.
 * Strips out script tags, onclick/onerror handlers, iframe tags, etc.
 */
export function sanitizeMarkdownText(text: string): string {
  if (!text) return "";
  let clean = text
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, "")
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "blocked:");
  return clean.trim();
}

/**
 * Returns true only if the SVG text contains no active content
 * (scripts, event handlers, foreignObject, external references, etc.).
 * Strict reject-based check: unsafe files are refused, not rewritten.
 */
export function isSafeSvg(text: string): boolean {
  if (!text || !/<\s*svg[\s>]/i.test(text)) return false;

  const forbidden: RegExp[] = [
    /<\s*script/i,
    /<\s*foreignObject/i,
    /<\s*(iframe|embed|object|audio|video|link|meta)\b/i,
    /<!\s*(ENTITY|DOCTYPE)/i,
    /\bon[a-z]+\s*=/i, // onload=, onbegin=, onclick=, ...
    /javascript\s*:/i,
    /vbscript\s*:/i,
    /(?:href|src)\s*=\s*(?!["']?\s*#)/i, // only in-document #fragment refs allowed
    /attributeName\s*=\s*["']?\s*(?:xlink:)?href/i, // <set>/<animate> href hijack
    /@import/i,
    /url\s*\(\s*(?!["']?\s*#)/i,
  ];

  return !forbidden.some((re) => re.test(text));
}

/**
 * Checks that the file's leading bytes match its declared MIME type.
 * SVG (text) is not covered here — see isSafeSvg().
 */
export function matchesMagicBytes(buffer: Buffer, mimeType: string): boolean {
  switch (mimeType) {
    case "image/jpeg":
      return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return (
        buffer.length > 8 &&
        buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      );
    case "image/webp":
      return (
        buffer.length > 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
      );
    case "application/pdf":
      return buffer.subarray(0, 1024).toString("latin1").includes("%PDF-");
    default:
      return false;
  }
}
