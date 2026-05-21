<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { models }: { models: ModelRecord[] } = $props();

	const familyColors: Record<string, string> = {
		'Llama 3.1': '#6C5CE7',
		'Gemma-Kimu': '#00B894',
		'Qwen3-VL (Latxa)': '#E17055',
		'Gemma 4': '#FDCB6E',
		'Qwen 3.5': '#0984E3',
		'Qwen 3.6': '#D63031',
	};

	const scatterData = $derived(
		models
			.filter((m) => m.siteVisibility === 'published')
			.map((m) => ({
				id: m.id,
				label: m.displayName,
				x: m.releaseDateUtc ? new Date(m.releaseDateUtc).getTime() : null,
				y: Math.round(m.overallMean * 100),
				family: m.family,
				color: familyColors[m.family] || '#636e72',
			}))
			.filter((d) => d.x !== null)
			.sort((a, b) => a.x - b.x),
	);

	function formatDate(ts: number): string {
		return new Date(ts).toLocaleDateString('en-GB', {
			year: 'numeric',
			month: 'short',
		});
	}
</script>

<div class="timeline-chart">
	<h3>Release Date vs Accuracy</h3>
	<svg viewBox="0 0 720 400" class="tl-svg">
		<!-- Grid lines -->
		{#each [50, 60, 70, 80] as yVal}
			<line x1="60" y1={350 - (yVal / 100) * 280} x2="700" y2={350 - (yVal / 100) * 280} stroke="#eee" stroke-width="1"/>
			<text x="50" y={354 - (yVal / 100) * 280} text-anchor="end" font-size="11" fill="#636e72">{yVal}%</text>
		{/each}

		<!-- X-axis labels -->
		{#each scatterData as d, i}
			<text x={60 + (i / Math.max(scatterData.length - 1, 1)) * 640} y="395" text-anchor="middle" font-size="9" fill="#636e72">
				{formatDate(d.x)}
			</text>
		{/each}

		<!-- Axis labels -->
		<text x="380" y="410" text-anchor="middle" font-size="12" fill="#2d3436">Release Date →</text>
		<text x="15" y="200" text-anchor="middle" font-size="12" fill="#2d3436" transform="rotate(-90, 15, 200)">Accuracy (%) →</text>

		<!-- Data points -->
		{#each scatterData as d}
			<circle
				cx={60 + (scatterData.indexOf(d) / Math.max(scatterData.length - 1, 1)) * 640}
				cy={350 - (d.y / 100) * 280}
				r="7"
				fill={d.color}
				stroke="#fff"
				stroke-width="2"
			>
				<title>{d.label}: {d.y}%</title>
			</circle>
		{/each}

		<!-- Legend removed — using HTML legend below -->
	</svg>

	<!-- Simple legend -->
	<div class="tl-legend">
		{#each Object.entries(familyColors) as [family, color]}
			<span class="tl-legend-item">
				<span class="tl-dot" style="background: {color}"></span>
				{family}
			</span>
		{/each}
	</div>
</div>

<style>
	.timeline-chart {
		width: 100%;
		max-width: 760px;
		margin: 0 auto;
	}

	.timeline-chart h3 {
		text-align: center;
		font-size: 16px;
		color: #2d3436;
		margin-bottom: 8px;
	}

	.tl-svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.tl-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: center;
		margin-top: 8px;
	}

	.tl-legend-item {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: #636e72;
	}

	.tl-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		display: inline-block;
	}
</style>
