import { describe, expect, it } from "vitest";
import { safeUrl, sanitizeLine, sanitizeText } from "./sanitize";

describe("sanitizeText", () => {
  it("strips HTML tags from pasted markup", () => {
    expect(sanitizeText("<script>alert('x')</script>hello")).toBe("alert('x')hello");
  });

  it("removes stray angle brackets", () => {
    expect(sanitizeText("a > b < c")).toBe("a  b  c");
  });

  it("collapses runaway blank lines and trims", () => {
    expect(sanitizeText("  one\n\n\n\ntwo  ")).toBe("one\n\ntwo");
  });

  it("caps the length", () => {
    expect(sanitizeText("x".repeat(1000), 50)).toHaveLength(50);
  });

  it("keeps ordinary text untouched", () => {
    expect(sanitizeText("Ideas connect better than they stack.")).toBe(
      "Ideas connect better than they stack.",
    );
  });
});

describe("sanitizeLine", () => {
  it("flattens newlines into a single line", () => {
    expect(sanitizeLine("My\nmosaic\ttitle")).toBe("My mosaic title");
  });
});

describe("safeUrl", () => {
  it("accepts http and https", () => {
    expect(safeUrl("https://example.com/a")).toBe("https://example.com/a");
  });

  it("rejects javascript: and malformed urls", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(safeUrl("not a url")).toBeNull();
  });
});
