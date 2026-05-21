<script lang="ts">
	import { models } from '$lib/data/models';
	import { benchmarks } from '$lib/data/benchmarks';
	import Leaderboard from '$lib/components/Leaderboard.svelte';
	import ScoreBar from '$lib/components/ScoreBar.svelte';
	import RadarPlot from '$lib/components/RadarPlot.svelte';
	import TimelineChart from '$lib/components/TimelineChart.svelte';
	import ComparisonTool from '$lib/components/ComparisonTool.svelte';

	const published = models.filter((m) => m.siteVisibility === 'published');
	const topModel = [...published].sort((a, b) => b.overallMean - a.overallMean)[0];
</script>

<svelte:head>
	<title>Evaleu — Basque LLM Evaluation</title>
</svelte:head>

<main class="page">
	<!-- Header -->
	<header class="hero">
		<h1>Evaleu</h1>
		<p class="hero-sub">Basque LLM Evaluation Dashboard</p>
	</header>

	<!-- Leaderboard -->
	<section class="section">
		<h2>Leaderboard</h2>
		<Leaderboard {models} {benchmarks} />
	</section>

	<!-- Top model score bar -->
	<section class="section section-center">
		<h2>Top Performer</h2>
		{#if topModel}
			<ScoreBar model={topModel} />
		{/if}
	</section>

	<!-- Radar + Timeline side by side -->
	<section class="section">
		<h2>Benchmark Breakdown &amp; Trends</h2>
		<div class="charts-grid">
			{#each published.slice(0, 4) as model}
				<RadarPlot model={model} />
			{/each}
		</div>
		<TimelineChart models={published} />
	</section>

	<!-- Comparison tool -->
	<section class="section">
		<ComparisonTool {models} />
	</section>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: #f5f6fa;
		color: #2d3436;
	}

	.page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	.hero {
		text-align: center;
		padding: 2rem 0 1rem;
		border-bottom: 2px solid #dfe6e9;
		margin-bottom: 2rem;
	}

	.hero h1 {
		font-size: 3rem;
		font-weight: 800;
		color: #0984e3;
		margin: 0;
		letter-spacing: -1px;
	}

	.hero-sub {
		font-size: 1.15rem;
		color: #636e72;
		margin-top: 0.25rem;
	}

	.section {
		margin-bottom: 2.5rem;
	}

	.section-center {
		text-align: center;
	}

	.section h2 {
		font-size: 1.3rem;
		font-weight: 700;
		color: #2d3436;
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
	}
</style>
