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

- [ ] **Phase 1: Project scaffolding**
  - [ ] Remove existing `site/` directory (old HTML + Chart.js approach)
  - [ ] Initialize SvelteKit project with Vite (`npm create svelte@latest site -- --template minimal --types typescript`)
  - [ ] Configure TypeScript, ESLint, Prettier
  - [ ] Set up `site/package.json`, `vite.config.ts`, `svelte.config.js`
  - [ ] Add `.gitignore` entries for node_modules and build artifacts

- [ ] **Phase 2: Data pipeline**
  - [ ] Keep existing Python CLI (`evaleu.py`) — it generates `summary.json` and `data.json`
  - [ ] Create a new Python script (or extend `build_site_data.py`) that outputs Svelte-compatible JSON
  - [ ] Ensure the build step reads `summary.json` → produces `site/src/lib/data/summary.ts` (typed TS module)
  - [ ] Add npm script: `npm run build-data` to regenerate typed data from Python output

- [ ] **Phase 3: Core components**
  - [ ] `Leaderboard.svelte` — interactive table with sorting, filtering by family, search
  - [ ] `ScoreBar.svelte` — animated bar chart showing overall accuracy (0 → value animation)
  - [ ] `RadarPlot.svelte` — radar/spider chart per model using D3.js or Recharts
  - [ ] `TimelineChart.svelte` — scatter plot of release date vs accuracy
  - [ ] `ComparisonTool.svelte` — side-by-side comparison selector (pick 2-4 models)

- [ ] **Phase 4: UI/UX polish**
  - [ ] Dark/light mode toggle with localStorage persistence
  - [ ] Glassmorphism card design system (CSS variables, blur effects)
  - [ ] Color-coded model families (Core = blue, BasqueGLUE = green, LatxaEvalSuite = purple)
  - [ ] Smooth transitions and hover micro-interactions
  - [ ] Responsive mobile-first layout

- [ ] **Phase 5: Build & deploy**
  - [ ] Configure SvelteKit static export (`adapter-static`)
  - [ ] Create GitHub Actions workflow:
    - Step 1: Run `uv run evaleu.py eval --model <new-model>` (manual trigger, not auto)
    - Step 2: Run `uv run evaleu.py summarize && uv run evaleu.py build`
    - Step 3: Run `npm install && npm run build-data && npm run build`
    - Step 4: Deploy to gh-pages
  - [ ] Document the workflow in README.md

- [ ] **Phase 6: Advanced features (nice-to-have)**
  - [ ] CSV/JSON export of leaderboard data
  - [ ] Bookmarkable URLs for filtered/sorted views
  - [ ] Per-benchmark drill-down view
  - [ ] Model detail modal with metadata and release info
