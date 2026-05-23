<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import { t, lang } from '$lib/i18n';

	let { model }: { model: ModelRecord } = $props();

	function getTierColor(mean: number): string {
		if (mean >= 0.7) return '#00b894'; // green
		if (mean >= 0.5) return '#fdcb6e'; // yellow
		return '#d63031'; // red
	}

	function getTierKey(mean: number): string {
		if (mean >= 0.7) return 'tier_excellent';
		if (mean >= 0.5) return 'tier_good';
		return 'tier_needs_work';
	}

	const pct = $derived(model.overallMean * 100);
	const color = $derived(getTierColor(model.overallMean));
	const tierKey = $derived(getTierKey(model.overallMean));
</script>

<div class="score-bar">
	<div class="sb-header">
		<span class="sb-name">{model.displayName}</span>
		<span class="sb-pct" style="color: {color}">{pct.toFixed(1)}%</span>
	</div>
	<div class="sb-track">
		<div
			class="sb-fill"
			style="width: {pct}%; background: {color};"
			aria-label={`${model.displayName}: ${pct.toFixed(1)}%`}
		></div>
	</div>
	<span class="sb-tier">{t(tierKey, $lang)}</span>
</div>

<style>
	.score-bar {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
	}

	.sb-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 6px;
	}

	.sb-name {
		font-weight: 700;
		font-size: 18px;
		color: var(--text);
		transition: color 0.3s;
	}

	.sb-pct {
		font-size: 22px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	.sb-track {
		width: 100%;
		height: 24px;
		background: var(--border);
		border-radius: 12px;
		overflow: hidden;
		position: relative;
		transition: background 0.3s;
	}

	.sb-fill {
		height: 100%;
		border-radius: 12px;
		transition: width 1s ease-out, background 0.3s;
		min-width: 4px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.15);
	}

	.sb-tier {
		display: block;
		text-align: right;
		font-size: 13px;
		color: var(--text-muted);
		margin-top: 4px;
		transition: color 0.3s;
	}
</style>
