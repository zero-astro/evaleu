<script lang="ts">
	import { models } from '$lib/data/models';
	import { benchmarks } from '$lib/data/benchmarks';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import ScoreBar from '$lib/components/ScoreBar.svelte';
	import RadarPlot from '$lib/components/RadarPlot.svelte';
	import TimelineChart from '$lib/components/TimelineChart.svelte';
	import ComparisonTool from '$lib/components/ComparisonTool.svelte';
	import ExportButton from '$lib/components/ExportButton.svelte';
	import ModelDetailModal from '$lib/components/ModelDetailModal.svelte';
	import BenchmarkDrilldown from '$lib/components/BenchmarkDrilldown.svelte';
	import { onMount } from 'svelte';

	const published = models.filter((m) => m.siteVisibility === 'published');
	const topModel = [...published].sort((a, b) => b.overallMean - a.overallMean)[0];

	let isDark = $state(false);
	let selectedModel: typeof published[0] | null = $state(null);

	onMount(() => {
		try { isDark = localStorage.getItem('evaleu-theme') === 'dark'; } catch {}
	});

	function toggleTheme() {
		isDark = !isDark;
		try { localStorage.setItem('evaleu-theme', isDark ? 'dark' : 'light'); } catch {}
		document.documentElement.classList.toggle('dark', isDark);
	}

	function handleModelClick(model: typeof published[0]) {
		selectedModel = model;
	}
</script>

<svelte:head>
	<title>Evaleu — Basque LLM Evaluation</title>
</svelte:head>

<main class="page">
	<!-- Header -->
	<header class="hero glass">
		<button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle theme">
			{#if isDark} 🌙 {:else} ☀️ {/if}
		</button>
		<h1>Evaleu</h1>
		<p class="hero-sub">Basque LLM Evaluation Dashboard</p>
	</header>

	<!-- Leaderboard -->
	<section class="section glass-card">
		<div class="card-header">
			<h2>🏆 Leaderboard</h2>
			<ExportButton {models} />
		</div>
		<Leaderboard {models} {benchmarks} onModelClick={handleModelClick} />
	</section>

	<!-- Top model score bar -->
	<section class="section section-center glass-card">
		<h2>⭐ Top Performer</h2>
		{#if topModel}
			<ScoreBar model={topModel} />
		{/if}
	</section>

	<!-- Radar + Timeline side by side -->
	<section class="section glass-card">
		<div class="card-header"><h2>📊 Benchmark Breakdown &amp; Trends</h2></div>
		<div class="charts-grid">
			{#each published.slice(0, 4) as model}
				<RadarPlot model={model} />
			{/each}
		</div>
		<TimelineChart models={published} />
	</section>

	<!-- Benchmark Drill-Down -->
	<section class="section glass-card">
		<div class="card-header"><h2>🔍 Per-Benchmark Drill-Down</h2></div>
		<BenchmarkDrilldown {models} {benchmarks} />
	</section>

	<!-- Comparison tool -->
	<section class="section glass-card">
		<div class="card-header"><h2>⚔️ Model Comparison</h2></div>
		<ComparisonTool {models} />
	</section>

	<!-- Model Detail Modal -->
	{#if selectedModel}
		<ModelDetailModal model={selectedModel} benchmarks={benchmarks} onClose={() => (selectedModel = null)} />
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: var(--bg);
		color: var(--text);
		transition: background 0.3s ease, color 0.3s ease;
	}

	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	.hero {
		text-align: center;
		padding: 2.5rem 0 1.5rem;
		border-bottom: 2px solid var(--border);
		margin-bottom: 2rem;
		position: relative;
	}

	.theme-toggle {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		background: none;
		border: 2px solid var(--border);
		border-radius: 50%;
		width: 44px;
		height: 44px;
		font-size: 1.3rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.theme-toggle:hover {
		transform: scale(1.1);
		border-color: var(--accent);
	}

	.hero h1 {
		font-size: 3rem;
		font-weight: 800;
		color: var(--accent);
		margin: 0;
		letter-spacing: -1px;
		background: linear-gradient(135deg, var(--accent), #6c5ce7);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-sub {
		font-size: 1.15rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	.section {
		margin-bottom: 2.5rem;
	}

	.section-center {
		text-align: center;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.card-header h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 1rem;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 640px) {
		.hero h1 { font-size: 2rem; }
		.charts-grid { grid-template-columns: 1fr; }
		.theme-toggle { top: 0.5rem; right: 0.5rem; width: 38px; height: 38px; font-size: 1.1rem; }
	}

	/* Glassmorphism */
	.glass, .glass-card {
		background: var(--card-bg);
		backdrop-filter: blur(12px);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 24px var(--shadow);
		border: 1px solid var(--border);
		transition: all 0.3s ease;
	}

	.glass-card:hover {
		box-shadow: 0 8px 32px var(--shadow-hover);
		transform: translateY(-2px);
	}

	/* Light theme (default) */
	:root {
		--bg: #f5f6fa;
		--text: #2d3436;
		--text-muted: #636e72;
		--accent: #0984e3;
		--border: rgba(0, 0, 0, 0.1);
		--card-bg: rgba(255, 255, 255, 0.75);
		--shadow: rgba(0, 0, 0, 0.06);
		--shadow-hover: rgba(9, 132, 227, 0.12);
	}

	/* Dark theme */
	:root.dark {
		--bg: #0f0f1a;
		--text: #dfe6e9;
		--text-muted: #b2bec3;
		--accent: #74b9ff;
		--border: rgba(255, 255, 255, 0.1);
		--card-bg: rgba(30, 30, 50, 0.8);
		--shadow: rgba(0, 0, 0, 0.3);
		--shadow-hover: rgba(116, 185, 255, 0.2);
	}

	/* Dark theme overrides for components */
	:root.dark .lb-search { background: var(--card-bg); color: var(--text); border-color: var(--border); }
	:root.dark .lb-filters select { background: var(--card-bg); color: var(--text); border-color: var(--border); }
	:root.dark .lb-table-wrap { background: var(--card-bg); box-shadow: 0 2px 12px var(--shadow); }
	:root.dark .lb-table thead th { background: rgba(255,255,255,0.05); color: var(--text); }
	:root.dark .lb-sortable:hover { background: rgba(255,255,255,0.08); }
	:root.dark .lb-row:hover { background: rgba(255,255,255,0.04); }

	:root.dark .comp-table-wrap { background: var(--card-bg); box-shadow: 0 2px 12px var(--shadow); }
	:root.dark .comp-table thead th { background: rgba(255,255,255,0.05); color: var(--text); }

	:root.dark .dd-selector select { background: var(--card-bg); color: var(--text); border-color: var(--border); }
</style>
