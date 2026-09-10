import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { MosaicProvider, useMosaicStore } from "./mosaic-store";

const wrapper = ({ children }: { children: ReactNode }) => <MosaicProvider>{children}</MosaicProvider>;
const setup = () => renderHook(() => useMosaicStore(), { wrapper });

describe("mosaic store", () => {
  it("seeds mosaics, tiles and users", () => {
    const { result } = setup();
    expect(result.current.mosaics.length).toBeGreaterThanOrEqual(12);
    expect(result.current.tiles.length).toBeGreaterThanOrEqual(30);
    expect(result.current.users.length).toBeGreaterThanOrEqual(10);
  });

  it("adds a tile to a mosaic and counts the contribution", () => {
    const { result } = setup();
    const before = result.current.tilesOf("m1").length;
    act(() => {
      result.current.addTile({ mosaicId: "m1", type: "perspective", text: "A new angle on this." });
    });
    expect(result.current.tilesOf("m1")).toHaveLength(before + 1);
    expect(result.current.getMosaic("m1")?.contributions).toBeGreaterThan(0);
  });

  it("sanitizes contribution text before it reaches the store", () => {
    const { result } = setup();
    act(() => {
      result.current.addTile({ mosaicId: "m1", type: "idea", text: "<b>bold</b> idea" });
    });
    const added = result.current.tilesOf("m1").at(-1);
    expect(added?.text).toBe("bold idea");
  });

  it("connects a built-on tile to its parent", () => {
    const { result } = setup();
    const parent = result.current.tilesOf("m1")[0]!;
    act(() => {
      result.current.addTile({
        mosaicId: "m1",
        type: "idea",
        text: "Building on this.",
        parentId: parent.id,
        intent: "expand",
      });
    });
    expect(result.current.childrenOf(parent.id).at(-1)?.text).toBe("Building on this.");
  });

  it("toggles resonate on and off", () => {
    const { result } = setup();
    const tile = result.current.tiles[0]!;
    act(() => result.current.toggleResonate(tile.id));
    expect(result.current.resonated).toContain(tile.id);
    act(() => result.current.toggleResonate(tile.id));
    expect(result.current.resonated).not.toContain(tile.id);
  });

  it("saves and unsaves a mosaic", () => {
    const { result } = setup();
    act(() => result.current.toggleSaveMosaic("m3"));
    expect(result.current.savedMosaics).toContain("m3");
    act(() => result.current.toggleSaveMosaic("m3"));
    expect(result.current.savedMosaics).not.toContain("m3");
  });

  it("creates a mosaic and joins it", () => {
    const { result } = setup();
    let id = "";
    act(() => {
      id = result.current.addMosaic({
        title: "Quiet campus corners",
        prompt: "Where do you go to think?",
        description: "Mapping the calm places on campus.",
        category: "campus",
        mode: "open",
        theme: "Places",
        cover: "linear-gradient(120deg,#e8dccb,#c8b9a3)",
      }).id;
    });
    expect(result.current.getMosaic(id)?.title).toBe("Quiet campus corners");
    expect(result.current.joined).toContain(id);
  });

  it("records an ask as a question tile", () => {
    const { result } = setup();
    const tile = result.current.tiles[0]!;
    act(() => result.current.askOn(tile.id, "What made you think that?"));
    const asked = result.current.childrenOf(tile.id).at(-1);
    expect(asked?.type).toBe("question");
  });

  it("persists state to localStorage", () => {
    const { result } = setup();
    act(() => result.current.toggleSaveMosaic("m5"));
    expect(window.localStorage.getItem("mosaic.state.v1")).toContain("m5");
  });

  it("keeps drafts until they are removed", () => {
    const { result } = setup();
    act(() => result.current.saveDraft("m1", "Half-written thought"));
    expect(result.current.drafts).toHaveLength(1);
    act(() => result.current.removeDraft(result.current.drafts[0]!.id));
    expect(result.current.drafts).toHaveLength(0);
  });
});
