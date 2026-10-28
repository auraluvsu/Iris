# CLAUDE.md

Guidance for LLM sessions working in this repo. Read this first, then `TODO.md` for current priorities.

## What this is

**Iris** (package name `task-tracker`) is a client-only React + TypeScript + Vite task board. There is no backend. All data lives in the browser's `localStorage`.

Features:
- **Cards** page: a three-column kanban board (`todo` → `inprogress` → `done`) with drag-and-drop (`@dnd-kit`), priority status (`urgent` / `pressing` / `lenient`), due dates, subcards, and links. Archive and restore are supported.
- **Lists** page: standalone checklist, bullet, or numbered lists.
- **Focus mode**: pick up to 3 cards per day. Selection is stored under `focus-YYYY-MM-DD`.
- **Pomodoro**: a global timer (25/5 min) that can be attached to a card. Session counts are kept per card.
- **Backdrops**: 14 photo backdrops (`public/backdrops/*.webp`) plus a default.
- **Export**: downloads all data as JSON.

## Commands

```bash
npm run dev         # Vite dev server (port 5173)
npm run build       # vite build → dist/ (does NOT typecheck)
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint .
npm test            # vitest run (jsdom)
npm run test:watch  # vitest watch
```

`test:e2e` calls `playwright test`, but there is no Playwright config and no e2e tests yet.

Before calling work done, run `typecheck`, `lint`, and `test`. Known failures are listed in `TODO.md`.

## Layout

```
src/
  main.tsx              entry; wraps <App/> in StrictMode
  App.tsx               shell: Topbar, page switch (tasks|lists), PomodoroFloating, FocusMode overlay
  types.ts              Card, Subcard, LinkItem, CardStatus, CardStage
  pages/
    TasksPage.tsx       kanban board, DnD, archive, backdrop state. Also contains Column, SortableCard, CardChip
    ListsPage.tsx       list sidebar and items
  components/
    Topbar.tsx          nav tabs + Focus / Export buttons
    CardModal.tsx       create/edit card (subcards, links, due date, status)
    FocusMode.tsx       daily 3-card focus overlay
    PomodoroTimer.tsx   PomodoroInline (per card) and PomodoroFloating
    ArchiveDrawer.tsx   archived cards: restore or delete
    BackdropPicker.tsx  backdrop grid. Exports BACKDROPS
    BackdropLayers.tsx  crossfade background layers
  utils/
    pomodoroContext.tsx PomodoroProvider / usePomodoro (global timer state)
    dueDate.ts          getDueState / formatDue
    exportData.ts       exportJSON()
  test/setup.ts         jest-dom matchers; clears localStorage after each test
```

Tests are colocated as `*.test.ts` next to their source in `src/utils/`. Only `utils` has tests.

## Data model and storage

localStorage keys (all values are JSON):

| Key | Shape |
|---|---|
| `cards` | `Card[]` (active cards) |
| `archived` | `Card[]` (each has `archivedAt`) |
| `lists` | `TaskList[]` with `{id, name, type: "checkbox"\|"bullet"\|"numeric", items}` |
| `backdropId` | string, e.g. `"default"` or `"photo-3"` |
| `focus-YYYY-MM-DD` | `string[]` of card ids |

Writes go straight to `localStorage` from the component that owns the state, with no abstraction layer. When you change a shape, update `types.ts`, `exportData.ts`, and every reader. Old data is not migrated.

## Conventions

- **Inline styles.** Styling is mostly `style={...}` objects at the bottom of each file, using CSS variables from `src/index.css` (`var(--jade)`, `var(--urgent)`, `var(--border)`, …). Fonts are DM Mono (labels) and the body font. Follow the existing pattern and don't add a CSS framework.
- **Explicit return types.** Handlers are typed as `(): void =>`. Components use `export default function Name(props: Props)`, with an `interface NameProps` above each component.
- **Prettier style differs by file.** `TasksPage.tsx`, `ListsPage.tsx`, `CardModal.tsx`, and `Topbar.tsx` use double quotes and semicolons. Most others use single quotes and no semicolons. Match the file you are editing.
- **Stage and status values** are string literal unions in `types.ts`. Meta maps (`STATUS_META`, `STAGE_META`) are defined in the file that renders them.
- **Dates** are `YYYY-MM-DD` strings. Parse with `new Date(d + 'T00:00:00')` to avoid timezone shifts.
- **IDs** come from `crypto.randomUUID()`.

## Gotchas

- `JSON.parse(localStorage.getItem(...))` gets `string | null`, which fails strict typecheck. Use `?? ''` or a helper like `load()` in `TasksPage.tsx`.
- `pomodoroContext.tsx` `tick()` calls `setState` inside other `setState` updaters. Those updaters can run more than once under StrictMode, so session counts may double-increment in dev. Verify before changing.
- `CardModal.addLink()` fetches each link's `<title>` through `https://api.allorigins.win/get?url=…`. This sends every URL the user adds to a third-party proxy. Keep this in mind for any change near it.
- `dist/` is git-ignored. Don't commit build output.
- The README is out of date. It describes a password gate (`VITE_APP_PASSWORD`, `PasswordGate.jsx`) and `.jsx` filenames. Neither exists. Trust the code.
- There is no router. Navigation is `useState` in `App.tsx`.

## Working in this repo

- Keep changes small and in the style of the file you touch. Don't refactor across files unless asked.
- Don't add dependencies without a reason. The dependency list is short on purpose.
- Don't add a backend, auth, or network calls without asking. The app is intentionally local-only, apart from the link-title fetch noted above.
- Commit messages mostly follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`). A few older commits don't.
