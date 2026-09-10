import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  currentUserId,
  mosaics as seedMosaics,
  notifications as seedNotifications,
  tiles as seedTiles,
  users,
} from "@/data/mock";
import type { AppNotification, Intent, Mosaic, Tile, TileType, User } from "@/data/types";

const STORAGE_KEY = "mosaic.state.v1";

interface PersistedState {
  mosaics: Mosaic[];
  tiles: Tile[];
  savedMosaics: string[];
  savedTiles: string[];
  joined: string[];
  resonated: string[];
  supported: string[];
  drafts: { id: string; mosaicId: string; text: string; savedAt: string }[];
  dismissedNotifications: string[];
  recent: { id: string; text: string; time: string }[];
}

const emptyState: PersistedState = {
  mosaics: seedMosaics,
  tiles: seedTiles,
  savedMosaics: ["m2"],
  savedTiles: ["t25"],
  joined: ["m1", "m9"],
  resonated: [],
  supported: [],
  drafts: [],
  dismissedNotifications: [],
  recent: [],
};

interface StoreValue extends PersistedState {
  users: User[];
  me: User;
  notifications: AppNotification[];
  getMosaic: (id: string) => Mosaic | undefined;
  getUser: (id: string) => User;
  tilesOf: (mosaicId: string) => Tile[];
  childrenOf: (tileId: string) => Tile[];
  addTile: (input: {
    mosaicId: string;
    type: TileType;
    text: string;
    parentId?: string;
    intent?: Intent;
  }) => Tile;
  addMosaic: (input: Omit<Mosaic, "id" | "participants" | "contributions" | "activity" | "createdBy">) => Mosaic;
  toggleResonate: (tileId: string) => void;
  toggleSupport: (tileId: string) => void;
  askOn: (tileId: string, question: string) => void;
  toggleSaveMosaic: (id: string) => void;
  toggleSaveTile: (id: string) => void;
  toggleJoin: (id: string) => void;
  saveDraft: (mosaicId: string, text: string) => void;
  removeDraft: (id: string) => void;
  dismissNotification: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function load(): PersistedState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...emptyState, ...parsed };
  } catch {
    return emptyState;
  }
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

export function MosaicProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — the session still works in memory */
    }
  }, [state, hydrated]);

  const logRecent = useCallback((text: string) => {
    setState((s) => ({
      ...s,
      recent: [{ id: uid("r"), text, time: new Date().toISOString() }, ...s.recent].slice(0, 12),
    }));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const getUser = (id: string) => users.find((u) => u.id === id) ?? users[0]!;

    return {
      ...state,
      users,
      me: getUser(currentUserId),
      notifications: seedNotifications.filter((n) => !state.dismissedNotifications.includes(n.id)),
      getMosaic: (id) => state.mosaics.find((m) => m.id === id),
      getUser,
      tilesOf: (mosaicId) => state.tiles.filter((t) => t.mosaicId === mosaicId),
      childrenOf: (tileId) => state.tiles.filter((t) => t.parentId === tileId),

      addTile: ({ mosaicId, type, text, parentId, intent }) => {
        const clean = sanitizeText(text);
        const tile: Tile = {
          id: uid("t"),
          mosaicId,
          authorId: currentUserId,
          type,
          text: clean,
          parentId,
          intent,
          createdAt: new Date().toISOString(),
          span: text.length > 160 ? "md" : "sm",
          reactions: { resonate: 0, support: 0, asks: 0 },
        };
        setState((s) => ({
          ...s,
          tiles: [...s.tiles, tile],
          mosaics: s.mosaics.map((m) =>
            m.id === mosaicId ? { ...m, contributions: m.contributions + 1 } : m,
          ),
        }));
        logRecent(parentId ? "You built on a contribution" : "You added a contribution");
        return tile;
      },

      addMosaic: (input) => {
        const mosaic: Mosaic = {
          ...input,
          id: uid("m"),
          participants: 1,
          contributions: 0,
          activity: "quiet",
          createdBy: currentUserId,
        };
        setState((s) => ({
          ...s,
          mosaics: [mosaic, ...s.mosaics],
          joined: [...s.joined, mosaic.id],
        }));
        logRecent(`You created "${mosaic.title}"`);
        return mosaic;
      },

      toggleResonate: (tileId) =>
        setState((s) => {
          const on = s.resonated.includes(tileId);
          return {
            ...s,
            resonated: on ? s.resonated.filter((i) => i !== tileId) : [...s.resonated, tileId],
            tiles: s.tiles.map((t) =>
              t.id === tileId
                ? { ...t, reactions: { ...t.reactions, resonate: t.reactions.resonate + (on ? -1 : 1) } }
                : t,
            ),
          };
        }),

      toggleSupport: (tileId) =>
        setState((s) => {
          const on = s.supported.includes(tileId);
          return {
            ...s,
            supported: on ? s.supported.filter((i) => i !== tileId) : [...s.supported, tileId],
            tiles: s.tiles.map((t) =>
              t.id === tileId
                ? { ...t, reactions: { ...t.reactions, support: t.reactions.support + (on ? -1 : 1) } }
                : t,
            ),
          };
        }),

      askOn: (tileId, question) => {
        const parent = state.tiles.find((t) => t.id === tileId);
        if (!parent) return;
        const tile: Tile = {
          id: uid("t"),
          mosaicId: parent.mosaicId,
          authorId: currentUserId,
          type: "question",
          text: question,
          parentId: tileId,
          intent: "question",
          createdAt: new Date().toISOString(),
          span: "sm",
          reactions: { resonate: 0, support: 0, asks: 0 },
        };
        setState((s) => ({
          ...s,
          tiles: [
            ...s.tiles.map((t) =>
              t.id === tileId ? { ...t, reactions: { ...t.reactions, asks: t.reactions.asks + 1 } } : t,
            ),
            tile,
          ],
        }));
        logRecent("You asked a question");
      },

      toggleSaveMosaic: (id) =>
        setState((s) => ({
          ...s,
          savedMosaics: s.savedMosaics.includes(id)
            ? s.savedMosaics.filter((i) => i !== id)
            : [...s.savedMosaics, id],
        })),

      toggleSaveTile: (id) =>
        setState((s) => ({
          ...s,
          savedTiles: s.savedTiles.includes(id)
            ? s.savedTiles.filter((i) => i !== id)
            : [...s.savedTiles, id],
        })),

      toggleJoin: (id) =>
        setState((s) => {
          const on = s.joined.includes(id);
          return {
            ...s,
            joined: on ? s.joined.filter((i) => i !== id) : [...s.joined, id],
            mosaics: s.mosaics.map((m) =>
              m.id === id ? { ...m, participants: m.participants + (on ? -1 : 1) } : m,
            ),
          };
        }),

      saveDraft: (mosaicId, text) =>
        setState((s) => ({
          ...s,
          drafts: [{ id: uid("d"), mosaicId, text, savedAt: new Date().toISOString() }, ...s.drafts],
        })),

      removeDraft: (id) => setState((s) => ({ ...s, drafts: s.drafts.filter((d) => d.id !== id) })),

      dismissNotification: (id) =>
        setState((s) => ({ ...s, dismissedNotifications: [...s.dismissedNotifications, id] })),
    };
  }, [state, logRecent]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMosaicStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMosaicStore must be used inside MosaicProvider");
  return ctx;
}
