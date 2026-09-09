# MOSAIC — Social, without the endless scroll

MOSAIC is a **100% frontend-only** social experience. There is no backend, no
database, no API server and no server-side authentication anywhere in this
project. Everything runs from React state, static TypeScript data and
`localStorage`.

## The idea

Instead of a feed, you enter a **Mosaic**: a shared surface built around one
prompt. Every contribution is a **Tile**, and tiles connect to each other
rather than stacking chronologically. There are no likes and no followers.

Meaningful actions replace them:

| Action | What it means |
| --- | --- |
| Resonate | This landed with me |
| Add perspective | A different angle on the same tile |
| Build on it | Extend someone's idea into a new one |
| Ask | Open a question on a tile |
| Support | Back the person, not the popularity |
| Invite | Share the surface with someone |

## Participation modes

`OPEN` · `GUIDED` · `COLLABORATIVE` · `REFLECTIVE` · `CHALLENGE` — each mosaic
declares how people are meant to contribute, shown on the mosaic header.

## Pages

- `/` — landing: hero, layered tile composition, featured mosaics,
  "WHAT YOU SHOULD FOCUS ON", closing section
- `/discover` — "Explore new perspectives": lens filters
  (People · Ideas · Communities · Experiences), category chips, live search
- `/communities` — mosaics grouped into themed communities you can join
- `/mosaic/$mosaicId` — the canvas of connected tiles plus the tile detail
  panel with all interaction actions
- `/create` — create a mosaic (title, description, category, prompt, cover,
  community style, participation type)
- `/my-space` — saved mosaics, saved contributions, created, joined, drafts,
  recent interactions
- `/search` — one search across mosaics, contributions, people and topics
- `/notifications` — purposeful, dismissible updates
- `/profile` — contribution identity: shared interests, tiles, mosaics
- `/auth` — browser-only sign in / sign up

## Data and persistence

- `src/data/mock.ts` — 10 categories, 10 users, 12 mosaics, 40+ tiles,
  6 notifications
- `src/lib/mosaic-store.tsx` — React context store persisted to
  `localStorage` under `mosaic.state.v1`
- `src/lib/auth-store.tsx` — browser-only accounts (`mosaic.accounts.v1`,
  `mosaic.session.v1`). Demo persistence only — not real security.

## Accessibility and responsiveness

Skip-to-content link, semantic landmarks, labelled controls, `aria-pressed`
states, visible focus, live regions on result counts, 44px+ mobile targets,
bottom navigation on small screens, and full `prefers-reduced-motion` support
in `src/styles.css`. Layouts are tested from 320px to 1440px.

## Run it

```bash
bun install
bun run dev
```
