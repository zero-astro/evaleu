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

	function getScoreColor(mean: number): string {
		if (mean >= 0.55) return '#00b894';   // berdea = onenak
		if (mean >= 0.40) return '#e17055';   // laranja = erdipurdikoak
		return '#d63031';                      // gorria = txarrak
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
					<th>Name</th>
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
						<td>
						<div class="score-cell">
							<span class="score-text">{formatPercent(model.overallMean)}</span>
							<div class="score-track">
								<div
									class="score-fill"
									style="width: {model.overallMean * 100}%; background: {getScoreColor(model.overallMean)};"
								></div>
							</div>
							<span class="score-label">Top Performance</span>
						</div>
					</td>
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
		background: var(--card-bg);
		color: var(--text);
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
		background: var(--card-bg);
		color: var(--text);
		cursor: pointer;
		transition: all 0.3s;
	}

	.lb-table-wrap {
		overflow-x: auto;
		border-radius: 12px;
		box-shadow: 0 2px 12px var(--shadow);
		background: var(--card-bg);
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
		border-bottom: 1px solid var(--border);
		color: var(--text);
	}

	.lb-table thead th {
		background: rgba(0, 0, 0, 0.04);
		font-weight: 600;
		color: var(--text);
		position: sticky;
		top: 0;
	}

	.lb-sortable {
		cursor: pointer;
		user-select: none;
		transition: background 0.15s;
	}

	.lb-sortable:hover {
		background: rgba(0, 0, 0, 0.04);
	}

	.lb-arrow {
		margin-left: 4px;
		font-size: 12px;
		color: var(--text-muted);
	}

	.lb-rank {
		font-weight: 700;
		color: var(--text-muted);
		width: 50px;
		text-align: center;
	}

	.lb-name {
		font-weight: 600;
		color: var(--text);
	}

	.score-cell {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 200px;
	}

	.score-text {
		font-weight: 700;
		white-space: nowrap;
		min-width: 55px;
	}

	.score-track {
		flex: 1;
		height: 8px;
		background: var(--border);
		border-radius: 4px;
		overflow: hidden;
	}

	.score-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.6s ease-out, background 0.3s;
	}

	.score-label {
		font-size: 11px;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--text-muted);
		white-space: nowrap;
		min-width: fit-content;
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
		background: rgba(0, 0, 0, 0.04);
		transition: background 0.15s;
	}

	.lb-hint {
		text-align: center;
		color: var(--text-muted);
		font-size: 0.85rem;
		margin-top: 8px;
	}
</style>
