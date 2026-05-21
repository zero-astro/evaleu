<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import type { BenchmarkInfo } from '$lib/data/benchmarks';

	let { models, benchmarks }: { models: ModelRecord[]; benchmarks: BenchmarkInfo[] } = $props();

	interface SortConfig {
		key: keyof ModelRecord;
		dir: 'asc' | 'desc';
	}

	let sort = $state<SortConfig>({ key: 'overallMean', dir: 'desc' });
	let search = $state('');
	let familyFilter = $state<string>('all');

	const families = $derived(['all', ...Array.from(new Set(models.map((m) => m.family)))]);

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

	function toggleSort(key: keyof ModelRecord) {
		if (sort.key === key) {
			sort.dir = sort.dir === 'asc' ? 'desc' : 'asc';
		} else {
			sort = { key, dir: 'desc' };
		}
	}

	function getSortedModels() {
		let filtered = models.filter((m) => m.siteVisibility === 'published');

		if (search.trim()) {
			const q = search.toLowerCase();
			filtered = filtered.filter(
				(m) => m.displayName.toLowerCase().includes(q),
			);
		}

		if (familyFilter !== 'all') {
			filtered = filtered.filter((m) => m.family === familyFilter);
		}

		return [...filtered].sort((a, b) => {
			const aVal = a[sort.key];
			const bVal = b[sort.key];

			if (sort.key === 'params') {
				const numA = parseFloat(a.params);
				const numB = parseFloat(b.params);
				return sort.dir === 'asc' ? numA - numB : numB - numA;
			}

			if (typeof aVal === 'number' && typeof bVal === 'number') {
				return sort.dir === 'asc' ? aVal - bVal : bVal - aVal;
			}

			return sort.dir === 'asc'
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal));
		});
	}

	function formatPercent(val: number) {
		return `${(val * 100).toFixed(1)}%`;
	}

	const sorted = $derived(getSortedModels());
</script>

<div class="leaderboard">
	<!-- Filters -->
	<div class="lb-filters">
		<input
			type="text"
			class="lb-search"
			placeholder="Search models..."
			bind:value={search}
		/>
		<select bind:value={familyFilter}>
			{#each families as f}
				<option value={f}>{f === 'all' ? 'All Families' : f}</option>
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
							onclick={() => toggleSort(col.key)}
						>
							{col.label}
							<span class="lb-arrow">
								{sort.key === col.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
							</span>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each sorted as model, i}
					<tr class="lb-row">
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
		border: 1px solid #dfe6e9;
		border-radius: 8px;
		font-size: 15px;
		outline: none;
		transition: border-color 0.2s;
	}

	.lb-search:focus {
		border-color: #0984e3;
	}

	.lb-filters select {
		padding: 8px 14px;
		border: 1px solid #dfe6e9;
		border-radius: 8px;
		font-size: 15px;
		outline: none;
		background: #fff;
		cursor: pointer;
	}

	.lb-table-wrap {
		overflow-x: auto;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		background: #fff;
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
	}
</style>
