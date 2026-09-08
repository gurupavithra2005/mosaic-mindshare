import type { CategoryId, Mosaic } from "@/data/types";

import ideasCover from "@/assets/cover-ideas.jpg";
import peopleCover from "@/assets/cover-people.jpg";
import communityCover from "@/assets/cover-community.jpg";
import experienceCover from "@/assets/cover-experience.jpg";

/** Lens groups used by the discovery filter. */
export type Lens = "people" | "ideas" | "communities" | "experiences";

export const lensOf: Record<CategoryId, Lens> = {
  ideas: "ideas",
  technology: "ideas",
  learning: "ideas",
  creativity: "experiences",
  travel: "experiences",
  music: "experiences",
  culture: "people",
  campus: "people",
  community: "communities",
  sustainability: "communities",
};

const byLens: Record<Lens, string> = {
  ideas: ideasCover,
  people: peopleCover,
  communities: communityCover,
  experiences: experienceCover,
};

export function coverImageFor(mosaic: Pick<Mosaic, "category">): string {
  return byLens[lensOf[mosaic.category] ?? "ideas"];
}

export const lenses: { id: Lens | "all"; label: string; blurb: string }[] = [
  { id: "all", label: "Everything", blurb: "Every open mosaic right now" },
  { id: "people", label: "People", blurb: "Perspectives from lives unlike yours" },
  { id: "ideas", label: "Ideas", blurb: "Unfinished thinking, open for building" },
  { id: "communities", label: "Communities", blurb: "Groups shaping something together" },
  { id: "experiences", label: "Experiences", blurb: "Things worth doing, made and shared" },
];
