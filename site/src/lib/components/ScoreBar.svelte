<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';

	let { model }: { model: ModelRecord } = $props();

	function getTierColor(mean: number): string {
		if (mean >= 0.7) return '#00b894'; // green
		if (mean >= 0.5) return '#fdcb6e'; // yellow
		return '#d63031'; // red
	}

	function getTierLabel(mean: number): string {
		if (mean >= 0.7) return 'Excellent';
		if (mean >= 0.5) return 'Good';
		return 'Needs Work';
	}

	const pct = $derived(model.overallMean * 100);
	const color = $derived(getTierColor(model.overallMean));
	const label = $derived(getTierLabel(model.overallMean));
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
	<span class="sb-tier">{label}</span>
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
		color: #2d3436;
	}

	.sb-pct {
		font-size: 22px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	.sb-track {
		width: 100%;
		height: 24px;
		background: #f0f0f0;
		border-radius: 12px;
		overflow: hidden;
		position: relative;
	}

	.sb-fill {
		height: 100%;
		border-radius: 12px;
		transition: width 1s ease-out;
		min-width: 4px;
	}

	.sb-tier {
		display: block;
		text-align: right;
		font-size: 13px;
		color: #636e72;
		margin-top: 4px;
	}
</style>
