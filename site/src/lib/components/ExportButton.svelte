<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { models }: { models: ModelRecord[] } = $props();

	function formatPercent(val: number): string {
		return `${(val * 100).toFixed(2)}%`;
	}

	function exportCSV() {
		const published = models.filter((m) => m.siteVisibility === 'published');
		const allBenchmarks = Object.keys(published[0]?.benchmarkMeans || {});

		let csv = 'Model,Family,Params,Overall Mean,Overall Std';
		for (const b of allBenchmarks) {
			csv += `,${b}`;
		}
		csv += '\n';

		for (const m of published) {
			csv += `"${m.displayName}",${m.family},${m.params},${formatPercent(m.overallMean)},${formatPercent(m.overallStd)}`;
			for (const b of allBenchmarks) {
				const val = m.benchmarkMeans[b] ?? 0;
				csv += `,${formatPercent(val)}`;
			}
			csv += '\n';
		}

		download(csv, 'evaleu-leaderboard.csv', 'text/csv');
	}

	function exportJSON() {
		const published = models.filter((m) => m.siteVisibility === 'published');
	 const json = JSON.stringify(published, null, 2);
		download(json, 'evaleu-leaderboard.json', 'application/json');
	}

	function download(content: string, filename: string, mimeType: string) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 100);
	}
</script>

<div class="export-btns">
	<button class="btn btn-csv" onclick={exportCSV}>📄 CSV</button>
	<button class="btn btn-json" onclick={exportJSON}>📋 JSON</button>
</div>

<style>
	.export-btns {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}

	.btn {
		padding: 8px 16px;
		border-radius: 8px;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: all 0.2s ease;
		color: #fff;
	}

	.btn-csv {
		background: linear-gradient(135deg, #0984e3, #74b9ff);
	}

	.btn-json {
		background: linear-gradient(135deg, #6c5ce7, #a29bfe);
	}

	.btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}
</style>
