# Top 5 Pressing Items

Checked against the repo on 2026-10-28. Verification commands are in each item.

- [ ] **1. Make `npm run typecheck` pass.** It currently fails with 3 errors, all from `JSON.parse(localStorage.getItem(...))` receiving `string | null`:
  - `src/App.tsx:19` and `src/App.tsx:27`
  - `src/components/FocusMode.tsx:32`

  The build does not catch this because `vite build` skips typechecking. Fix by using `?? ''` or a shared `load()` helper like the one in `TasksPage.tsx`.
  *Verify:* `npm run typecheck` exits 0.

- [ ] **2. Make `npm run lint` pass.** It currently reports 9 errors:
  - `no-empty` in `src/App.tsx:23` and `src/components/FocusMode.tsx:34`. Add a comment or handle the error.
  - `no-explicit-any` in `src/pages/TasksPage.tsx` at lines 177, 182, 185, 451, and 452. Replace with `CardStage`, `DragEndEvent`, or proper types.
  - `react-refresh/only-export-components` in `src/components/BackdropPicker.tsx:10` (`BACKDROPS`) and `src/utils/pomodoroContext.tsx:101` (`usePomodoro`). Move these to a separate module.

  *Verify:* `npm run lint` exits 0.

- [ ] **3. Check the Pomodoro session counter for a double-count bug.** In `src/utils/pomodoroContext.tsx`, `tick()` calls `setPhase` and `setCardId` (and then `setSessions`) inside other state updaters. React can run updaters twice in StrictMode (dev), which could inflate `sessions[cardId]`. Suspected, not yet reproduced.
  - Reproduce: add a Vitest test that starts a card, advances fake timers by 25 minutes, and checks `sessions`. Run it under `<StrictMode>`.
  - Fix: compute the next phase and counts from the current values, and don't call setters from inside updaters.

- [ ] **4. Stop sending user-entered URLs to a third-party proxy, or disclose it.** `src/components/CardModal.tsx` (`addLink`, ~line 108) fetches `https://api.allorigins.win/get?url=…` to read each link's `<title>`. Every link the user adds goes to that service.
  - Options: (a) remove the title fetch and let the user type a title; (b) keep it but add a clear note in the UI and README; (c) move it behind a user opt-in.
  - Decide with the owner first. It changes behavior.

- [ ] **5. Update the README, which describes features that no longer exist.** It still documents:
  - the password gate and `VITE_APP_PASSWORD` (removed in commit `8c8ab31`)
  - the default password `"breath"`
  - `PasswordGate.jsx`, `CardModal.jsx`, and other `.jsx` filenames (the code is `.tsx`)
  - the project name `task-tracker` and `git clone <repository-url>` placeholders
  - "Lazy loading via code splitting" and "Module Federation", which are not in `vite.config.ts`

  Rewrite the Usage, Setup, and Project Structure sections to match the code. Remove the password references.
  *Verify:* every file path in the README exists under `src/`.

## Not in the top 5, but noticed

- `npm run test:e2e` calls `playwright test`, but there is no `playwright.config.*` and no e2e tests.
- Only `src/utils/` has tests. Components and the Pomodoro context are untested.
- `.gitignore` covers `dist/`, and `dist/` is not tracked. The `dist/` directory is still present locally.
