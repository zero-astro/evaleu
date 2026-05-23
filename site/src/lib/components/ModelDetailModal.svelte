<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import { t, lang } from '$lib/i18n';

	let { model }: { model: ModelRecord | null } = $props();

	function formatPercent(val: number): string {
		return `${(val * 100).toFixed(2)}%`;
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'N/A';
		const d = new Date(dateStr);
		return d.toLocaleDateString('eu', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	let isOpen = $derived(model !== null);
</script>

{#if isOpen && model}
	<div class="modal-overlay" onclick={() => model = null}>
		<div class="modal-content" onclick={(e) => e.stopPropagation()}>
			<!-- Header -->
			<div class="modal-header">
				<h2>{model.displayName}</h2>
				<button class="close-btn" onclick={() => model = null} aria-label={t('modal_close', $lang)}>&times;</button>
			</div>

			<!-- Metadata grid -->
			<dl class="meta-grid">
				<div class="meta-item">
					<dt>{t('meta_family', $lang)}</dt>
					<dd><span class="badge" style="background: var(--family-color, #636E72); color: #fff;">{model.family}</span></dd>
				</div>
				<div class="meta-item">
					<dt>{t('meta_params', $lang)}</dt>
					<dd>{model.params}</dd>
				</div>
				<div class="meta-item">
					<dt>{t('meta_weights_quant', $lang)}</dt>
					<dd>{model.weightsQuant}</dd>
				</div>
				<div class="meta-item">
					<dt>{t('meta_kv_cache', $lang)}</dt>
					<dd>{model.kvCache}</dd>
				</div>
				<div class="meta-item">
					<dt>{t('meta_release_date', $lang)}</dt>
					<dd>{formatDate(model.releaseDateUtc)}</dd>
				</div>
				<div class="meta-item">
					<dt>{t('meta_hf', $lang)}</dt>
					<dd>
						{#if model.releaseSourceUrl}
							<a href={model.releaseSourceUrl} target="_blank" rel="noopener">{model.upstreamModelId}</a>
						{:else}
							N/A
						{/if}
					</dd>
				</div>
			</dl>

			<!-- Overall scores -->
			<h3 class="section-title">{t('scores_section', $lang)}</h3>
			<div class="score-row">
				<span class="label">{t('scores_overall_mean_label', $lang)}</span>
				<span class="value highlight">{formatPercent(model.overallMean)}</span>
			</div>
			<div class="score-row">
				<span class="label">{t('scores_std_dev_label', $lang)}</span>
				<span class="value">{formatPercent(model.overallStd)}</span>
			</div>

			<!-- Benchmark breakdown -->
			<h3 class="section-title">{t('breakdown_title', $lang)}</h3>
			<div class="bench-list">
				{#each Object.entries(model.benchmarkMeans).sort((a, b) => b[1] - a[1]) as [name, value]}
					<div class="bench-item">
						<span class="bench-name">{name}</span>
						<div class="bench-bar-wrap">
							<div class="bench-bar" style="width: {value * 100}%;"></div>
						</div>
						<span class="bench-val">{formatPercent(value)}</span>
					</div>
				{/each}
			</div>

			<!-- Runs table -->
			<h3 class="section-title">{t('runs_title', $lang)}</h3>
			<div class="runs-table-wrap">
				<table class="runs-table">
					<thead>
						<tr><th>{t('seed_col', $lang)}</th><th>{t('runs_overall_col', $lang)}</th></tr>
					</thead>
					<tbody>
						{#each model.runs as run}
							<tr>
								<td>{run.seed}</td>
								<td>{formatPercent(run.overall)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		max-width: 640px;
		width: 100%;
		max-height: 85vh;
		overflow-y: auto;
		padding: 2rem;
		animation: slideUp 0.3s ease;
		background: #ffffff;
		color: var(--text);
		border-radius: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		border: 1px solid var(--border);
	}

	/* Dark mode modal background */
	:global(.dark) .modal-content {
		background: #1e1e32;
		color: var(--text);
	}

	@keyframes slideUp {
		from { transform: translateY(20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid var(--border);
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text);
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: var(--text-muted);
		line-height: 1;
		padding: 0 0.5rem;
		transition: color 0.2s;
	}

	.close-btn:hover {
		color: var(--accent);
	}

	.meta-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.meta-item dt {
		font-size: 0.75rem;
		text-transform: uppercase;
		color: var(--text-muted);
		letter-spacing: 0.5px;
		margin-bottom: 4px;
	}

	.meta-item dd {
		margin: 0;
		font-weight: 600;
		color: var(--text);
	}

	.meta-item a {
		color: var(--accent);
		word-break: break-all;
	}

	.badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 600;
	}

	.section-title {
		margin: 1.5rem 0 0.75rem;
		font-size: 1.1rem;
		color: var(--text);
	}

	.score-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid var(--border);
	}

	.score-row .label {
		color: var(--text-muted);
	}

	.score-row .value {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.score-row .highlight {
		color: var(--accent);
		font-size: 1.2rem;
	}

	.bench-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 0.5rem;
	}

	.bench-item {
		display: grid;
		grid-template-columns: 140px 1fr 60px;
		align-items: center;
		gap: 8px;
	}

	.bench-name {
		font-size: 0.85rem;
		color: var(--text-muted);
		word-break: break-all;
	}

	.bench-bar-wrap {
		background: var(--border);
		border-radius: 4px;
		height: 12px;
		overflow: hidden;
	}

	.bench-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #74b9ff);
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.bench-val {
		font-weight: 700;
		font-size: 0.85rem;
		text-align: right;
		font-variant-numeric: tabular-nums;
		color: var(--text);
	}

	.runs-table-wrap {
		border-radius: 12px;
		overflow-x: auto;
		background: var(--card-bg);
		box-shadow: 0 2px 12px var(--shadow);
	}

	.runs-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}

	.runs-table th,
	.runs-table td {
		padding: 10px 16px;
		text-align: center;
		border-bottom: 1px solid var(--border);
	}

	.runs-table thead th {
		background: rgba(255,255,255,0.05);
		font-weight: 600;
		color: var(--text);
	}

	@media (max-width: 480px) {
		.modal-content { padding: 1rem; }
		.meta-grid { grid-template-columns: 1fr; }
		.bench-item { grid-template-columns: 100px 1fr 50px; }
	}
</style>
