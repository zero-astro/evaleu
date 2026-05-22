# TODO

## Basque Evaluation Expansion Backlog

- [ ] Add support for **MMLU EU** using `orai-nlp/MMLU_HT_eu_sample` as the first integration target (MVP adapter + benchmark wiring).
- [ ] Decide and document whether `orai-nlp/MMLU_HT_eu_sample` is temporary (pilot) or long-term benchmark source.
- [ ] Evaluate optional multilingual alternatives with `eu` coverage (for larger-scale follow-up):
  - `alexandrainst/m_mmlu`
  - `jon-tow/okapi_mmlu`

## Additional Basque Benchmarks to Add (pending)

- [ ] **Math reasoning in Basque**
  - Candidate: `mgsm_native_cot_eu`
- [ ] **Reading comprehension in Basque**
  - Candidate: `xstorycloze_eu`
  - Candidate: `belebele_eus_Latn`
- [ ] **Science / commonsense QA in Basque**
  - Candidate: `arc_eu_easy_mc`
  - Candidate: `arc_eu_challenge_mc`
  - Candidate: `piqa_eu_mc`
  - Candidate: `siqa_eu_mc`
- [ ] **Exam / proficiency / trivia coverage alignment**
  - Candidate: `eus_exams_eu`
  - Candidate: `eus_proficiency`
  - Candidate: `eus_trivia`
- [ ] **Basque QA variants**
  - Candidate: `bertaqa_eu_local`
  - Candidate: `bertaqa_eu_global`
- [ ] **Other candidate benchmark from discussion**
  - Candidate: `bl2mp`

## New Website Design

- [x] **Phase 1: Project scaffolding** ✅
  - [x] Remove existing `site/` directory (old HTML + Chart.js approach)
  - [x] Initialize SvelteKit project with Vite
  - [x] Configure TypeScript, ESLint, Prettier
  - [x] Set up `site/package.json`, `vite.config.ts`, `svelte.config.js`
  - [x] Add `.gitignore` entries for node_modules and build artifacts
  - [x] Build verified: `npm run build` → outputs to `build/`

- [x] **Phase 2: Data pipeline** ✅
  - [x] Keep existing Python CLI (`evaleu.py`) — it generates `summary.json` and `data.json`
  - [x] Create a new Python script (`build_site_data.py`) that outputs Svelte-compatible JSON
  - [x] Ensure the build step reads `summary.json` → produces typed TS modules (`benchmarks.ts`, `models.ts`)
  - [x] Add npm script: `npm run build-data` to regenerate typed data from Python output

- [x] **Phase 3: Core components** ✅
  - [x] `Leaderboard.svelte` — interactive table with sorting, filtering by family, search
  - [x] `ScoreBar.svelte` — animated bar chart showing overall accuracy (0 → value animation)
  - [x] `RadarPlot.svelte` — radar/spider chart per model using @nivo/radar
  - [x] `TimelineChart.svelte` — custom SVG scatter plot of release date vs accuracy
  - [x] `ComparisonTool.svelte` — side-by-side comparison selector (pick 2-4 models)
  - [x] `+page.svelte` dashboard layout integrating all components
  - [x] Build verified: `npm run build` → clean, no warnings

- [x] **Phase 4: UI/UX polish** ✅
  - [x] Dark/light mode toggle with localStorage persistence (🌙/☀️ button)
  - [x] Glassmorphism card design system (CSS variables, backdrop-filter blur effects)
  - [x] Color-coded model families via familyColors map
  - [x] Smooth transitions and hover micro-interactions (hover lift, scale, color shifts)
  - [x] Responsive mobile-first layout (@media breakpoints)
  - [x] Gradient hero title, emoji section headers

- [x] **Phase 5: Build & deploy** ✅
  - [x] Configure SvelteKit static export (`adapter-static`)
  - [x] GitHub Actions workflow (`deploy-pages.yml`) — deploys `site/` to gh-pages on push to main
    - No evaluation step in CI (evaluations run locally, then commit + push triggers deploy)
    - Optionally rebuilds data from `summary.json` if present in repo
  - [x] Document the workflow in README.md

- [x] **Phase 6: Testing — New Website Design** ✅
  - [x] Install test framework (Playwright E2E + Vitest unit)
  - [x] **Data integrity tests:**
    - [x] `build_site_data.py` output matches `summary.json` structure
    - [x] Generated `models.ts` has correct TypeScript types
    - [x] Generated `benchmarks.ts` lists all benchmarks from summary
    - [x] Published vs draft visibility filtering works correctly
  - [x] **Component unit tests (Vitest):**
    - [x] Leaderboard — sorting by any column, family filter, text search
    - [x] ScoreBar — renders correct percentage and tier color
    - [x] RadarPlot — renders with model data, no crashes on empty data
    - [x] TimelineChart — scatter plot renders correctly
    - [x] ComparisonTool — selection logic (2-4 models max), comparison table rendering
  - [x] **E2E tests (Playwright):**
    - [x] Page loads and all sections render without errors
    - [x] Dark/light theme toggle persists via localStorage
    - [x] Leaderboard sorting changes column order visually
    - [x] Family filter dropdown filters rows correctly
    - [x] Search input filters leaderboard rows by model name/family
    - [x] ComparisonTool allows selecting 2-4 models and shows comparison table
    - [x] Responsive layout adapts on mobile viewport (640px breakpoint)
    - [x] Build produces clean output with no console errors
  - [x] Add `npm test` script to site/package.json
  - [x] Document testing workflow in README.md

- [x] **Phase 7: Advanced features (nice-to-have)** ✅
  - [x] CSV/JSON export of leaderboard data (`ExportButton.svelte`)
  - [x] Bookmarkable URLs for filtered/sorted views (`url-sync.ts` + `initUrlSync()`)
  - [x] Per-benchmark drill-down view (`BenchmarkDrilldown.svelte`)
  - [x] Model detail modal with metadata and release info (`ModelDetailModal.svelte`)
  - [x] All 73 tests passing (Vitest unit + data integrity)

## Theme Selector & i18n

- [x] **Phase 8: Three-button theme selector** ✅
  - [x] Replace single toggle button with three buttons: Auto / Dark / Light
  - [x] Active mode visually highlighted (border, background, or icon fill)
  - [x] Persist selection in localStorage (`evaleu-theme-mode`)
  - [x] Auto mode respects system `prefers-color-scheme` and reacts to changes
  - [x] Update `+page.svelte` header with new selector UI
  - [x] Ensure MutationObserver in TimelineChart still works with theme changes

- [ ] **Phase 9: i18n (Basque / English)**
  - [ ] Create translations store (`src/lib/i18n.ts`) with `eu` and `en` keys
  - [ ] Add language selector (EU / EN) to header alongside theme buttons
  - [ ] Persist language in localStorage (`evaleu-lang`)
  - [ ] Replace all hardcoded text strings across components:
    - [ ] `+page.svelte` — hero subtitle, section titles
    - [ ] `Leaderboard.svelte` — column headers, search placeholder, filter labels, row hint
    - [ ] `ComparisonTool.svelte` — selection hints, table headers
    - [ ] `ModelDetailModal.svelte` — metadata labels, modal title, close button
    - [ ] `ExportButton.svelte` — export button labels
    - [ ] `TimelineChart.svelte` — chart title, axis labels, legend
    - [ ] `RadarPlot.svelte` — chart title
  - [ ] Update svelte-head `<title>` dynamically based on language
  - [ ] Test both languages render correctly in all components
