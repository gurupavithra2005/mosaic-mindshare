export type CategoryId =
  | "ideas"
  | "creativity"
  | "technology"
  | "campus"
  | "culture"
  | "sustainability"
  | "travel"
  | "music"
  | "learning"
  | "community";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}

export type ParticipationMode = "open" | "guided" | "collaborative" | "reflective" | "challenge";

export type TileType = "idea" | "question" | "perspective" | "story" | "challenge" | "resource";

export type Intent = "agree" | "challenge" | "expand" | "question" | "connect";

export interface User {
  id: string;
  name: string;
  handle: string;
  statement: string;
  interests: string[];
  initials: string;
  accent: string;
  mosaicsJoined: number;
  perspectives: number;
}

export interface Mosaic {
  id: string;
  title: string;
  prompt: string;
  description: string;
  category: CategoryId;
  mode: ParticipationMode;
  theme: string;
  participants: number;
  contributions: number;
  activity: "quiet" | "steady" | "buzzing";
  cover: string;
  createdBy: string;
  featured?: boolean | undefined;
}

export interface Tile {
  id: string;
  mosaicId: string;
  authorId: string;
  type: TileType;
  text: string;
  createdAt: string;
  parentId?: string | undefined;
  intent?: Intent | undefined;
  span?: "sm" | "md" | "lg" | undefined;
  reactions: {
    resonate: number;
    support: number;
    asks: number;
  };
}

export interface AppNotification {
  id: string;
  kind: "build" | "resonate" | "activity" | "invite" | "ask";
  text: string;
  mosaicId?: string | undefined;
  time: string;
}
