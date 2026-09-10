import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FocusSection } from "./FocusSection";
import { EmptyState } from "./EmptyState";

describe("FocusSection", () => {
  it("lists all nine focus principles with their blurbs", () => {
    render(<FocusSection />);
    const expected: [string, string][] = [
      ["Originality", "A fresh and distinctive concept"],
      ["User Experience", "Intuitive and engaging"],
      ["Meaningful Interaction", "Real value for users"],
      ["Creative Social Concepts", "New ways to connect and participate"],
      ["Visual Design", "Distinctive and polished UI"],
      ["Functionality", "A working and interactive experience"],
      ["Responsiveness", "Works across all devices"],
      ["Accessibility", "Usable and inclusive for everyone"],
      ["Frontend Implementation Quality", "Clean, well-structured, and maintainable"],
    ];
    for (const [title, blurb] of expected) {
      expect(screen.getByText(title)).toBeInTheDocument();
      expect(screen.getByText(blurb)).toBeInTheDocument();
    }
  });

  it("uses a heading for the section", () => {
    render(<FocusSection />);
    expect(screen.getByText(/WHAT YOU SHOULD FOCUS ON/i)).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders a titled, described placeholder", () => {
    render(<EmptyState title="Nothing saved yet" description="Save a mosaic to see it here." />);
    expect(screen.getByRole("heading", { name: "Nothing saved yet" })).toBeInTheDocument();
    expect(screen.getByText("Save a mosaic to see it here.")).toBeInTheDocument();
  });
});
