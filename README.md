# Basque LLM Evaluation (single-CLI workflow)

This repo benchmarks Basque-capable local LLMs served through a private OpenAI-compatible endpoint and publishes an interactive comparison website.

The operational interface is **one CLI**:

```bash
uv run evaleu.py <command> [options]
```

---

## Commands

### Evaluate one model (default day-to-day)
```bash
uv run evaleu.py eval --model latxa-qwen3-vl-4b
```
Runs all 9 benchmarks for seeds `42,123,777` (default), writes per-seed JSONs into `eval/`, refreshes `eval/summary.json`, and rebuilds `site/data.json`.

Back-compat shortcut also works:
```bash
uv run evaleu.py --model latxa-qwen3-vl-4b
```

### Evaluate all models in `model_cards.json`
```bash
uv run evaleu.py eval --all
```

### Summarize existing eval JSONs
```bash
uv run evaleu.py summarize
```

### Build website data from summary
```bash
uv run evaleu.py build
```

### Add or update a model
```bash
uv run evaleu.py model \
  --id my-model \
  --display-name "My Model" \
  --family "Llama" \
  --params "8B" \
  --upstream-model-id org/model \
  --release-date-utc 2026-01-01T00:00:00Z \
  --release-source-url https://huggingface.co/org/model
```

### Check progress
```bash
uv run evaleu.py status
```

### Clean legacy wrappers/artifacts
```bash
uv run evaleu.py clean --apply
```

---

## Benchmarks (all-bench suite)
- Core: EusTrivia, XNLIeu
- BasqueGLUE: QNLI, BEC, WiC, Intent
- LatxaEvalSuite: EusExams, EusProficiency, EusReading

## Methodology
- `temperature=0`
- Multi-seed robust view (`42,123,777` by default)
- Equal sampling budget per benchmark (`80` default)
- Ranking by mean overall accuracy
- UI shows rounded values, with `mean ± std` on hover
- Best value per benchmark highlighted in bold

For `qwen3.5-27b`, eval uses no-thinking mode (`--max-tokens 4096 --timeout 300`).

---

## Repository structure

```
evaleu.py              # single operational CLI (entry point)
model_cards.json       # model registry + metadata (display names, families, params)
README.md              # this file
TODO.md                # development backlog & phase tracking

eval/                  # evaluation engine & data
  run_eval.py          # evaluator engine (benchmark registry + scoring)
  summarize_multiseed.py  # summary builder → eval/summary.json
  summary.json         # aggregated results from all seeds
  openai-endpoint-config.yaml  # endpoint configuration template
  BENCHMARK4_ONBOARDING.md     # benchmark onboarding guide

site/                  # SvelteKit static website (interactive dashboard)
  package.json         # npm dependencies & scripts
  svelte.config.js     # SvelteKit + adapter-static config
  vite.config.ts       # Vite build configuration
  src/routes/+page.svelte   # main dashboard page
  src/lib/components/      # reusable UI components:
    Leaderboard.svelte        # interactive table (sort, filter, search)
    ScoreBar.svelte         # animated horizontal bar chart
    RadarPlot.svelte        # radar/spider chart per model (@nivo/radar)
    TimelineChart.svelte    # custom SVG scatter plot (date vs accuracy)
    ComparisonTool.svelte   # multi-select comparison selector (2-4 models)
  src/lib/data/           # typed data modules:
    benchmarks.ts         # benchmark metadata (auto-generated from summary.json)
    models.ts             # model records (auto-generated from summary.json)
  build_site_data.py      # Python script → generates TS modules from eval/summary.json

.github/workflows/deploy-pages.yml   # CI/CD: push main → gh-pages deploy
tests/                   # unit tests for CLI and site data pipeline
docs/                    # project documentation & resources
```

---

## Publish (deployment)

The website is deployed via **GitHub Actions** to GitHub Pages. The workflow runs automatically on every push to `main`:

1. Checkout the repository
2. Optionally rebuild `site/data.json` from `eval/summary.json` if present in the repo
3. Deploy `site/build/` (static export) to the `gh-pages` branch using `peaceiris/actions-gh-pages@v4`

### Local workflow (how to publish new evaluations)

```bash
# 1. Run evaluation locally
uv run evaleu.py eval --model my-new-model

# 2. Summarize results
uv run evaleu.py summarize

# 3. Build site data pipeline
uv run evaleu.py build   # or: cd site && npm run build-data

# 4. Preview locally (optional)
cd site && npm run preview

# 5. Commit and push → triggers GitHub Actions deploy
git add -A && git commit -m "Add my-new-model evaluation" && git push origin main
```

The website will be live on `gh-pages` within a few minutes after the push.

### Previewing locally

```bash
cd site
npm install          # if not already done
npm run build-data   # regenerate typed data from summary.json
npm run dev          # start dev server at localhost:5173
# or
npm run build        # production build → site/build/
npm run preview      # serve built output locally
```

---

## Privacy
- Keep endpoint in local `.env` (`OPENAI_API_BASE=...`)
- Keep auth token in local `.env` (`OPENAI_API_KEY=`; empty for local/no-auth endpoints)
- Never commit private endpoint URLs
- Tracked artifacts must use placeholders where needed
