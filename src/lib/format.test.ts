import { describe, expect, it } from "vitest";
import { modeCopy, tileTypeCopy, timeAgo } from "./format";

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

describe("timeAgo", () => {
  it("reads 'just now' under a minute", () => {
    expect(timeAgo(ago(5_000))).toBe("just now");
  });

  it("reads minutes, hours, days and weeks", () => {
    expect(timeAgo(ago(10 * 60_000))).toBe("10m ago");
    expect(timeAgo(ago(3 * 3_600_000))).toBe("3h ago");
    expect(timeAgo(ago(3 * 86_400_000))).toBe("3d ago");
    expect(timeAgo(ago(21 * 86_400_000))).toBe("3w ago");
  });
});

describe("copy maps", () => {
  it("covers all five participation modes", () => {
    for (const mode of ["open", "guided", "collaborative", "reflective", "challenge"]) {
      expect(modeCopy[mode]?.label).toBeTruthy();
      expect(modeCopy[mode]?.hint).toBeTruthy();
    }
  });

  it("covers all six tile types", () => {
    for (const type of ["idea", "question", "perspective", "story", "challenge", "resource"]) {
      expect(tileTypeCopy[type]?.label).toBeTruthy();
    }
  });
});
