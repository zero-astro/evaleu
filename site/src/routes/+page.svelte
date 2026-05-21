<script lang="ts">
	import { models } from '$lib/data/models';
	import { benchmarks } from '$lib/data/benchmarks';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import ScoreBar from '$lib/components/ScoreBar.svelte';
	import TimelineChart from '$lib/components/TimelineChart.svelte';
	import ComparisonTool from '$lib/components/ComparisonTool.svelte';
	import ExportButton from '$lib/components/ExportButton.svelte';
	import ModelDetailModal from '$lib/components/ModelDetailModal.svelte';
	import { onMount } from 'svelte';

	const published = models.filter((m) => m.siteVisibility === 'published');
	const topModel = [...published].sort((a, b) => b.overallMean - a.overallMean)[0];

	let selectedModel: typeof published[0] | null = $state(null);

	// Theme mode: auto | dark | light
	type ThemeMode = 'auto' | 'dark' | 'light';
	let themeMode = $state<ThemeMode>(() => {
		try {
			const stored = localStorage.getItem('evaleu-theme-mode');
			if (stored === 'auto' || stored === 'dark' || stored === 'light') return stored;
		} catch {}
		return 'auto';
	});

	function applyTheme(mode: ThemeMode) {
		const isDark = mode === 'dark' ? true : mode === 'light' ? false : window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList.toggle('dark', isDark);
	}

	function setTheme(mode: ThemeMode) {
		themeMode = mode;
		try { localStorage.setItem('evaleu-theme-mode', mode); } catch {}
		applyTheme(mode);
	}

	onMount(() => {
		applyTheme(themeMode);

		// Listen for system theme changes when in auto mode
		const mql = window.matchMedia('(prefers-color-scheme: dark)');
		mql.addEventListener?.('change', () => {
			if (themeMode === 'auto') applyTheme('auto');
		});
	});

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
		<!-- Theme selector: Auto / Dark / Light -->
		<div class="theme-selector" role="group" aria-label="Theme selection">
			<button class="theme-btn {themeMode === 'auto' ? 'active' : ''}" onclick={() => setTheme('auto')} title="Automatikoa">🌗</button>
			<button class="theme-btn {themeMode === 'dark' ? 'active' : ''}" onclick={() => setTheme('dark')} title="Iluna">🌙</button>
			<button class="theme-btn {themeMode === 'light' ? 'active' : ''}" onclick={() => setTheme('light')} title="Argia">☀️</button>
		</div>
		<h1>Evaleu</h1>
		<p class="hero-sub">Basque LLM Evaluation Dashboard</p>
	</header>

	<!-- Top model score bar -->
	<section class="section section-center glass-card">
		<h2>⭐ Top Performer</h2>
		{#if topModel}
			<ScoreBar model={topModel} />
		{/if}
	</section>

	<!-- Leaderboard -->
	<section class="section glass-card">
		<div class="card-header">
			<h2>🏆 Leaderboard</h2>
			<ExportButton {models} />
		</div>
		<Leaderboard {models} {benchmarks} onModelClick={handleModelClick} />
	</section>

	<!-- Evolution over time -->
	<section class="section glass-card">
		<div class="card-header"><h2>📈 Evolution Over Time</h2></div>
		<TimelineChart models={published} />
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

	.theme-selector {
		position: absolute;
		top: 1rem;
		right: 1.5rem;
		display: flex;
		gap: 4px;
		background: var(--card-bg);
		border: 2px solid var(--border);
		border-radius: 8px;
		padding: 4px;
	}

	.theme-btn {
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		width: 36px;
		height: 36px;
		border-radius: 6px;
	}

	.theme-btn:hover {
		transform: scale(1.1);
		background: var(--shadow-hover);
	}

	.theme-btn.active {
		background: var(--accent);
		box-shadow: 0 2px 8px var(--shadow-hover);
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

	@media (max-width: 640px) {
		.hero h1 { font-size: 2rem; }
		.theme-selector { top: 0.5rem; right: 0.5rem; gap: 2px; padding: 3px; }
		.theme-btn { width: 32px; height: 32px; font-size: 1rem; }
	}

	/* Glassmorphism */
	.glass, .glass-card {
		background: var(--card-bg);
		backdrop-filter: blur(12px);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 4px 24px var(--shadow);
		border: 1px solid var(--border);
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


</style>
