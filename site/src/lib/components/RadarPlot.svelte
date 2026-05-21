<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { model }: { model: ModelRecord } = $props();

	const cx = 240, cy = 200;
	const maxR = 150;

	function axisX(i: number) {
		const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
		return cx + maxR * Math.cos(angle);
	}

	function axisY(i: number) {
		const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
		return cy + maxR * Math.sin(angle);
	}

	function labelX(i: number) {
		const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
		return cx + (maxR + 30) * Math.cos(angle);
	}

	function labelY(i: number) {
		const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
		return cy + (maxR + 30) * Math.sin(angle);
	}

	function gridPoints(level: number) {
		const r = (level / 100) * maxR;
		return benchmarks.map((_, i) => {
			const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
			return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
		}).join(' ');
	}

	function dataPoints() {
		return benchmarks.map((bench, i) => {
			const angle = (i / benchmarks.length) * 2 * Math.PI - Math.PI / 2;
			const r = (bench.value / 100) * maxR;
			return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
		}).join(' ');
	}

	const benchmarks = $derived(
		Object.entries(model.benchmarkMeans).map(([key, value]) => ({
			id: key.replace('BasqueGLUE_', '').replace('LatxaEval_', ''),
			value: Math.round(value * 100),
		})),
	);

	const gridLevels = $derived([20, 40, 60, 80, 100]);
</script>

<div class="radar-plot">
	<h3>{model.displayName}</h3>
	<svg viewBox="0 0 480 400" class="radar-svg">
		<!-- Grid rings -->
		{#each gridLevels as level}
			<polygon points={gridPoints(level)} fill="none" stroke="var(--border)" stroke-width="0.5"/>
		{/each}

		{#each benchmarks as bench, i}
			<!-- Axis line -->
			<line x1={cx} y1={cy} x2={axisX(i)} y2={axisY(i)} stroke="var(--border)" stroke-width="0.5"/>
			<!-- Label -->
			<text x={labelX(i)} y={labelY(i)} text-anchor="middle" dominant-baseline="central" fill="var(--text)" font-size="11">{bench.id}</text>
			<!-- Data point -->
			<circle cx={axisX(i)} cy={axisY(i)} r="5" fill="#0984e3"/>
		{/each}

		<!-- Filled area -->
		<polygon points={dataPoints()} fill="#0984e3" fill-opacity="0.15" stroke="#0984e3" stroke-width="2"/>
	</svg>
</div>

<style>
	.radar-plot {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radar-plot h3 {
		margin-bottom: 8px;
		font-size: 16px;
		color: var(--text);
		text-align: center;
		transition: color 0.3s;
	}

	.radar-svg {
		width: 100%;
		max-width: 480px;
		height: auto;
	}
</style>
