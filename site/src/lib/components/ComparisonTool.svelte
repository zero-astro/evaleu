<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { models }: { models: ModelRecord[] } = $props();

	let selected = $state<string[]>([]);

	const publishedModels = $derived(models.filter((m) => m.siteVisibility === 'published'));

	function toggleModel(id: string) {
		if (selected.includes(id)) {
			selected = selected.filter((s) => s !== id);
		} else if (selected.length < 4) {
			selected = [...selected, id];
		}
	}

	const selectedModels = $derived(
		publishedModels.filter((m) => selected.includes(m.id)),
	);

	function getBenchmarkNames() {
		if (selectedModels.length === 0) return [];
		return Object.keys(selectedModels[0].benchmarkMeans);
	}

	function formatPercent(val: number) {
		return `${(val * 100).toFixed(1)}%`;
	}

	function getBestBenchmark() {
		const names = getBenchmarkNames();
		if (names.length === 0 || selectedModels.length < 2) return {};
		const best: Record<string, number> = {};
		for (const name of names) {
			let maxVal = -Infinity;
			for (const m of selectedModels) {
				if (m.benchmarkMeans[name] > maxVal) {
					maxVal = m.benchmarkMeans[name];
				}
			}
			best[name] = maxVal;
		}
		return best;
	}

	const benchmarkNames = $derived(getBenchmarkNames());
	const bestScores = $derived(getBestBenchmark());
</script>

<div class="comparison-tool">
	<h3>Compare Models</h3>
	<p class="comp-hint">Select 2–4 models to compare</p>

	<!-- Model selector -->
	<div class="comp-selectors">
		{#each publishedModels as model}
			<button
				class="comp-chip"
				class:active={selected.includes(model.id)}
				onclick={() => toggleModel(model.id)}
				disabled={!selected.includes(model.id) && selected.length >= 4}
			>
				{model.displayName}
			</button>
		{/each}
	</div>

	<!-- Comparison table -->
	{#if selectedModels.length >= 2}
		<div class="comp-table-wrap">
			<table class="comp-table">
				<thead>
					<tr>
						<th>Benchmark</th>
						{#each selectedModels as model}
							<th>{model.displayName}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					<!-- Overall mean row -->
					<tr class="comp-row comp-overall">
						<td><strong>Overall Mean</strong></td>
						{#each selectedModels as model}
							<td class="comp-cell">{formatPercent(model.overallMean)}</td>
						{/each}
					</tr>

					<!-- Benchmark rows -->
					{#each benchmarkNames as name}
						<tr class="comp-row">
							<td>{name}</td>
							{#each selectedModels as model}
								<td
									class="comp-cell"
									class:best={model.benchmarkMeans[name] === bestScores[name]}
								>
									{formatPercent(model.benchmarkMeans[name])}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if selectedModels.length === 1}
		<p class="comp-empty">Select at least one more model to compare.</p>
	{/if}
</div>

<style>
	.comparison-tool {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
	}

	.comparison-tool h3 {
		text-align: center;
		font-size: 18px;
		color: var(--text);
		margin-bottom: 4px;
		transition: color 0.3s;
	}

	.comp-hint {
		text-align: center;
		font-size: 13px;
		color: var(--text-muted);
		margin-bottom: 12px;
		transition: color 0.3s;
	}

	.comp-selectors {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		margin-bottom: 16px;
	}

	.comp-chip {
		padding: 6px 14px;
		border: 2px solid var(--border);
		border-radius: 20px;
		background: transparent;
		font-size: 13px;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-muted);
	}

	.comp-chip:hover:not(:disabled) {
		border-color: var(--accent);
		color: var(--accent);
		transform: translateY(-1px);
	}

	.comp-chip.active {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
		box-shadow: 0 2px 8px rgba(9, 132, 227, 0.3);
	}

	.comp-chip:disabled:not(.active) {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.comp-table-wrap {
		overflow-x: auto;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		background: #fff;
		transition: all 0.3s;
	}

	.comp-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.comp-table th,
	.comp-table td {
		padding: 10px 14px;
		text-align: center;
		border-bottom: 1px solid #f0f0f0;
	}

	.comp-table thead th {
		background: #f8f9fa;
		font-weight: 600;
		color: var(--text);
		transition: all 0.3s;
	}

	.comp-row td:first-child,
	.comp-overall td:first-child {
		text-align: left;
		font-weight: 500;
	}

	.comp-cell.best {
		background: rgba(0, 184, 148, 0.12);
		color: #00b894;
		font-weight: 700;
		border-radius: 4px;
	}

	.comp-overall td {
		background: #f8f9fa;
		font-weight: 700;
	}

	.comp-empty {
		text-align: center;
		color: var(--text-muted);
		padding: 24px;
		transition: color 0.3s;
	}
</style>
