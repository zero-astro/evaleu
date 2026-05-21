<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { models, benchmarks }: { models: ModelRecord[]; benchmarks: any[] } = $props();

	interface DrillState {
		benchmarkName: string | null;
	}

	let drill = $state<DrillState>({ benchmarkName: null });
	let familyFilter = $state<string>('all');

	function formatPercent(val: number): string {
		return `${(val * 100).toFixed(2)}%`;
	}

	const families = ['all', ...Array.from(new Set(models.map((m) => m.family)))];

	function getDrillData() {
		if (!drill.benchmarkName) return null;

		const bench = benchmarks.find((b: any) => b.name === drill.benchmarkName);
		if (!bench) return null;

		const published = models.filter(
			(m) => m.siteVisibility === 'published' && (m.benchmarkMeans[drill.benchmarkName] ?? 0) > 0,
		);

		let filtered = familyFilter !== 'all' ? published.filter((m) => m.family === familyFilter) : [...published];

		filtered.sort((a, b) => {
			const aVal = a.benchmarkMeans[drill.benchmarkName] ?? 0;
			const bVal = b.benchmarkMeans[drill.benchmarkName] ?? 0;
			return bVal - aVal;
		});

		return { bench, models: filtered };
	}

	function getDeltaClass(model: any): string {
		if (!drill.benchmarkName) return 'delta-neutral';
		const val = model.benchmarkMeans[drill.benchmarkName] ?? 0;
		const mean = drillData?.bench.meanAcrossModels ?? 0;
		if (val > mean) return 'delta-pos';
		if (val < mean) return 'delta-neg';
		return 'delta-neutral';
	}

	function getDeltaText(model: any): string {
		if (!drill.benchmarkName || !drillData) return '';
		const val = model.benchmarkMeans[drill.benchmarkName] ?? 0;
		const delta = ((val - drillData.bench.meanAcrossModels) * 100).toFixed(2);
		return `${delta > 0 ? '+' : ''}${delta}%`;
	}

	function getBarWidth(model: any): number {
		if (!drillData) return 0;
		const val = model.benchmarkMeans[drill.benchmarkName] ?? 0;
		const mean = drillData.bench.meanAcrossModels;
		if (mean === 0) return 0;
		return Math.min((val / mean) * 100, 200);
	}

	let drillData = $derived(getDrillData());
</script>

<div class="drilldown">
	<!-- Benchmark selector -->
	<div class="dd-selector glass-card">
		<h3>🔍 Benchmark Drill-Down</h3>
		<p class="dd-desc">Select a benchmark to see per-model rankings and scores.</p>
		<select bind:value={drill.benchmarkName}>
			<option value="" disabled>-- Select a benchmark --</option>
			{#each benchmarks as b}
				<option value={b.name}>{b.name}</option>
			{/each}
		</select>

		{#if drill.benchmarkName}
			<select bind:value={familyFilter}>
				{#each families as f}
					<option value={f}>{f === 'all' ? 'All Families' : f}</option>
				{/each}
			</select>
		{/if}
	</div>

	<!-- Drill-down results -->
	{#if drillData}
		<div class="dd-results glass-card">
			<div class="dd-header">
				<h3>{drillData.bench.name}</h3>
				<span class="dd-stats">
					Mean: {formatPercent(drillData.bench.meanAcrossModels)} |
					Std: {formatPercent(drillData.bench.stdAcrossModels)} |
					{drillData.models.length} models
				</span>
			</div>

			<div class="dd-table-wrap">
				<table class="dd-table">
					<thead>
						<tr>
							<th>#</th>
							<th>Model</th>
							<th>Family</th>
							<th>Score</th>
							<th>Delta</th>
						</tr>
					</thead>
					<tbody>
						{#each drillData.models as model, i}
							<tr class="dd-row">
								<td class="dd-rank">{i + 1}</td>
								<td class="dd-name">{model.displayName}</td>
								<td><span class="dd-badge" style="background: {familyColors[model.family] || '#636E72'}; color: #fff;">{model.family}</span></td>
								<td class="dd-score">{formatPercent(model.benchmarkMeans[drill.benchmarkName] ?? 0)}</td>
								<td class="dd-delta {getDeltaClass(model)}">
									{getDeltaText(model)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Visual bar chart -->
			<div class="dd-bars">
				{#each drillData.models as model}
					<div class="dd-bar-item">
						<span class="dd-bar-label">{model.displayName}</span>
						<div class="dd-bar-track">
							<div class="dd-bar-fill" style="width: {getBarWidth(model)}%;"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.drilldown {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
	}

	.dd-selector h3,
	.dd-results h3 {
		margin: 0 0 0.5rem;
		font-size: 1.2rem;
		color: var(--text);
	}

	.dd-desc {
		color: var(--text-muted);
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.dd-selector select,
	.dd-results select {
		padding: 8px 14px;
		border: 1px solid var(--border);
		border-radius: 8px;
		font-size: 15px;
		outline: none;
		background: #fff;
		cursor: pointer;
		margin-right: 8px;
	}

	.dd-selector {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}

	.dd-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--border);
		flex-wrap: wrap;
		gap: 8px;
	}

	.dd-stats {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.dd-table-wrap {
		overflow-x: auto;
		border-radius: 12px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
		background: #fff;
		margin-bottom: 1.5rem;
	}

	.dd-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.dd-table th,
	.dd-table td {
		padding: 10px 16px;
		text-align: left;
		border-bottom: 1px solid #f0f0f0;
	}

	.dd-table thead th {
		background: #f8f9fa;
		font-weight: 600;
		color: #2d3436;
	}

	.dd-rank {
		font-weight: 700;
		color: #636e72;
		width: 50px;
		text-align: center;
	}

	.dd-name {
		font-weight: 600;
		color: #2d3436;
	}

	.dd-score {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.dd-badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
	}

	.dd-delta {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}

	.delta-pos { color: #00b894; }
	.delta-neg { color: #d63031; }
	.delta-neutral { color: #636e72; }

	.dd-bars {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.dd-bar-item {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: center;
		gap: 8px;
	}

	.dd-bar-label {
		font-size: 0.8rem;
		color: var(--text-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dd-bar-track {
		background: var(--border);
		border-radius: 4px;
		height: 16px;
		overflow: hidden;
	}

	.dd-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #74b9ff);
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	@media (max-width: 640px) {
		.dd-selector select { margin-right: 0; margin-bottom: 8px; }
		.dd-bar-item { grid-template-columns: 100px 1fr; }
	}
</style>
