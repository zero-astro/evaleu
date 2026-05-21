<script lang="ts">
	import { onMount } from 'svelte';
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

	let chartDiv: HTMLDivElement | null = $state(null);
	let plotlyInstance: any = $state(null);

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
			.filter((d) => d.x !== null) as Array<{
				id: string;
				label: string;
				x: number;
				y: number;
				family: string;
				color: string;
			}>,
	);

	function renderChart(dark: boolean) {
		if (!chartDiv || scatterData.length === 0) return;

		const traces = Object.entries(familyColors).map(([family, color]) => {
			const points = scatterData.filter((d) => d.family === family);
			return {
				x: points.map((p) => new Date(p.x)),
				y: points.map((p) => p.y),
				text: points.map((p) => `${p.label}<br>Accuracy: ${p.y}%`),
				mode: 'markers',
				marker: {
					size: 12,
					color: color,
					line: { width: 2, color: dark ? '#1e1e32' : '#ffffff' },
				},
				name: family,
				type: 'scatter',
				showlegend: true,
			};
		});

		const layout = {
			xaxis: {
				title: { text: 'Release Date', standoff: 10 },
				type: 'date',
				gridcolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
				tickfont: { color: dark ? '#b2bec3' : '#636e72', size: 11 },
			},
			yaxis: {
				title: { text: 'Accuracy (%)' },
				range: [40, 100],
				gridcolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
				tickfont: { color: dark ? '#b2bec3' : '#636e72', size: 11 },
			},
			paper_bgcolor: dark ? '#1e1e32' : '#ffffff',
			plot_bgcolor: dark ? '#1e1e32' : '#ffffff',
			font: { color: dark ? '#dfe6e9' : '#2d3436', family: '-apple-system, BlinkMacSystemFont, sans-serif' },
			margin: { l: 55, r: 30, t: 30, b: 60 },
			hovermode: 'closest',
			showlegend: true,
			legend: {
				x: 1.02,
				y: 1,
				xanchor: 'left',
				bgcolor: dark ? 'rgba(30,30,50,0.9)' : 'rgba(255,255,255,0.9)',
				bordercolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
				borderwidth: 1,
			},
		};

		const config = { responsive: true, displayModeBar: false, scrollZoom: true };

		import('plotly.js-dist-min').then((Plotly) => {
			if (plotlyInstance) {
				Plotly.react(chartDiv, traces, layout, config);
			} else {
				Plotly.newPlot(chartDiv, traces, layout, config).then((instance: any) => {
					plotlyInstance = instance;
				});
			}
		}).catch(() => {
			console.warn('Plotly.js failed to load');
		});
	}

	$effect(() => {
		const dark = document.documentElement.classList.contains('dark');
		renderChart(dark);

		return () => {
			if (chartDiv && plotlyInstance) {
				import('plotly.js-dist-min').then((Plotly) => {
					Plotly.purge(chartDiv);
				}).catch(() => {});
			}
		};
	});

	// Watch for theme toggle via MutationObserver on documentElement classList
	onMount(() => {
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.attributeName === 'class') {
					const dark = document.documentElement.classList.contains('dark');
					renderChart(dark);
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => observer.disconnect();
	});
</script>

<div class="timeline-chart">
	<h3>Release Date vs Accuracy</h3>
	<div bind:this={chartDiv} class="plot-container"></div>
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
		color: var(--text);
		margin-bottom: 8px;
		transition: color 0.3s;
	}

	.plot-container {
		width: 100%;
		height: auto;
		min-height: 400px;
	}
</style>
