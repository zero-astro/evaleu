<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import { i18n } from '$lib/i18n';

	let { model }: { model: ModelRecord } = $props();

	const benchmarks = $derived(
		Object.entries(model.benchmarkMeans).map(([key, value]) => ({
			id: key.replace('BasqueGLUE_', '').replace('LatxaEval_', ''),
			value: Math.round(value * 100),
		})),
	);

	let chartDiv: HTMLDivElement | null = $state(null);
	let plotlyInstance: any = $state(null);

	$effect(() => {
		if (!chartDiv || benchmarks.length === 0) return;

		const labels = benchmarks.map((b) => b.id);
		const values = benchmarks.map((b) => b.value);

		const trace = {
			type: 'scatterpolar',
			r: values,
			labels: labels,
			fill: 'toself',
			line: { color: '#0984e3', width: 2 },
			fillcolor: 'rgba(9,132,227,0.2)',
			marker: { size: 6, color: '#0984e3' },
			hovertemplate: i18n['radar_hover']?.[$lang] ?? '<b>%{label}</b><br>Accuracy: %{r:.1f}%<extra></extra>',
		};

		const dark = document.documentElement.classList.contains('dark');

		const layout = {
			polar: {
				radialaxis: {
					tickfont: { color: dark ? '#b2bec3' : '#636e72', size: 10 },
					range: [0, 100],
					gridcolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
				},
				angularaxis: {
					tickfont: { color: dark ? '#b2bec3' : '#636e72', size: 10 },
					gridcolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
				},
			},
			paper_bgcolor: dark ? '#1e1e32' : '#ffffff',
			font: { color: dark ? '#dfe6e9' : '#2d3436', size: 11 },
			margin: { l: 20, r: 20, t: 20, b: 20 },
		};

		const config = { responsive: true, displayModeBar: false };

		import('plotly.js-dist-min').then((Plotly) => {
			if (plotlyInstance) {
				Plotly.react(chartDiv, [trace], layout, config);
			} else {
				Plotly.newPlot(chartDiv, [trace], layout, config).then((instance: any) => {
					plotlyInstance = instance;
				});
			}
		}).catch(() => {
			console.warn('Plotly.js failed to load');
		});

		return () => {
			if (chartDiv && plotlyInstance) {
				import('plotly.js-dist-min').then((Plotly) => {
					Plotly.purge(chartDiv);
				}).catch(() => {});
			}
		};
	});
</script>

<div class="radar-plot">
	<h3>{model.displayName}</h3>
	<div bind:this={chartDiv} class="plot-container"></div>
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

	.plot-container {
		width: 100%;
		max-width: 480px;
		height: auto;
		min-height: 280px;
	}
</style>
