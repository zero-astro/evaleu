<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import type { BenchmarkInfo } from '$lib/benchmarks';
	import { filterStore, applyFilter, initUrlSync, applyFiltersToModels } from '$lib/state/url-sync';
	import { onMount } from 'svelte';

	let { models, benchmarks, onModelClick }: { models: ModelRecord[]; benchmarks: BenchmarkInfo[]; onModelClick?: (model: ModelRecord) => void } = $props();
	onModelClick ||= () => {};

	const familyColors: Record<string, string> = {
		'Llama 3.1': '#6C5CE7',
		'Gemma-Kimu': '#00B894',
		'Qwen3-VL (Latxa)': '#E17055',
		'Gemma 4': '#FDCB6E',
		'Qwen 3.5': '#0984E3',
		'Qwen 3.6': '#D63031',
	};

	const columns: { key: keyof ModelRecord; label: string }[] = [
		{ key: 'overallMean', label: 'Overall Mean' },
		{ key: 'params', label: 'Params' },
		{ key: 'family', label: 'Family' },
	];

	function formatPercent(val: number) {
		return `${(val * 100).toFixed(1)}%`;
	}

	// Local reactive state for the leaderboard filters
	let f = $state({ sortKey: 'overallMean', sortDir: 'desc' as const, familyFilter: 'all', search: '' });

	onMount(() => initUrlSync());

	function getSortedModels() {
		return applyFiltersToModels(models, f);
	}

	const sorted = $derived(getSortedModels());

	function handleSort(key: keyof ModelRecord) {
		f.sortDir = f.sortKey === key && f.sortDir === 'desc' ? 'asc' : 'desc';
		f.sortKey = String(key);
		applyFilter({ sortKey: f.sortKey, sortDir: f.sortDir });
	}

	function handleSearch(value: string) {
		f.search = value;
		applyFilter({ search: value });
	}

	function handleFamily(value: string) {
		f.familyFilter = value;
		applyFilter({ familyFilter: value });
	}
</script>

<div class="leaderboard">
	<!-- Filters -->
	<div class="lb-filters">
		<input
			type="text"
			class="lb-search"
			placeholder="Search models..."
			value={f.search}
			oninput={(e) => handleSearch((e.target as HTMLInputElement).value)}
		/>
		<select value={f.familyFilter} onchange={(e) => handleFamily((e.target as HTMLSelectElement).value)}>
			{#each ['all', ...Array.from(new Set(models.map((m) => m.family)))] as ff}
				<option value={ff}>{ff === 'all' ? 'All Families' : ff}</option>
			{/each}
		</select>
	</div>

	<!-- Table -->
	<div class="lb-table-wrap">
		<table class="lb-table">
			<thead>
				<tr>
					<th>#</th>
					{#each columns as col}
						<th
							class="lb-sortable"
							onclick={() => handleSort(col.key)}
						>
							{col.label}
							<span class="lb-arrow">
								{f.sortKey === String(col.key) ? (f.sortDir === 'asc' ? '▲' : '▼') : ''}
							</span>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each sorted as model, i}
					<tr class="lb-row" onclick={() => onModelClick(model)} style="cursor: pointer;">
						<td class="lb-rank">{i + 1}</td>
						<td class="lb-name">{model.displayName}</td>
						<td class="lb-score">{formatPercent(model.overallMean)}</td>
						<td>{model.params}</td>
						<td>
							<span
								class="lb-badge"
								style="background: {familyColors[model.family] || '#636E72'}; color: #fff;"
							>
								{model.family}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- Row count hint -->
	<p class="lb-hint">{sorted.length} models shown · Click a row for details</p>
</div>

<style>
	.leaderboard {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
	}

	.lb-filters {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
		flex-wrap: wrap;
	}

	.lb-search {
		flex: 1;
		min-width: 200px;
		padding: 8px 14px;
		border: 1px solid var(--border);
		border-radius: 8px;
		font-size: 15px;
		outline: none;
		transition: border-color 0.2s, background 0.3s;
	}

	.lb-search:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(9, 132, 227, 0.15);
	}

	.lb-filters select {
		padding: 8px 14px;
		border: 1px solid var(--border);
		border-radius: 8px;
		font-size: 15px;
		outline: none;
		background: #fff;
		cursor: pointer;
		transition: all 0.3s;
	}

	.lb-table-wrap {
		overflow-x: auto;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		background: #fff;
		transition: all 0.3s;
	}

	.lb-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 15px;
	}

	.lb-table th,
	.lb-table td {
		padding: 12px 16px;
		text-align: left;
		border-bottom: 1px solid #f0f0f0;
	}

	.lb-table thead th {
		background: #f8f9fa;
		font-weight: 600;
		color: #2d3436;
		position: sticky;
		top: 0;
	}

	.lb-sortable {
		cursor: pointer;
		user-select: none;
		transition: background 0.15s;
	}

	.lb-sortable:hover {
		background: #e9ecef;
	}

	.lb-arrow {
		margin-left: 4px;
		font-size: 12px;
		color: #636e72;
	}

	.lb-rank {
		font-weight: 700;
		color: #636e72;
		width: 50px;
		text-align: center;
	}

	.lb-name {
		font-weight: 600;
		color: #2d3436;
	}

	.lb-score {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.lb-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
	}

	.lb-row:hover {
		background: #f8f9fa;
		transition: background 0.15s;
	}

	.lb-hint {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.85rem;
		margin-top: 8px;
	}
</style>
