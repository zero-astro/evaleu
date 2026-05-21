<script lang="ts">
	import type { ModelRecord } from '$lib/data/models';
	import { Radar } from '@nivo/radar';

	let { model }: { model: ModelRecord } = $props();

	// Build radar data from benchmarkMeans
	const radarData = $derived(
		Object.entries(model.benchmarkMeans).map(([key, value]) => ({
			id: key.replace('BasqueGLUE_', '').replace('LatxaEval_', ''),
			value: Math.round(value * 100),
		})),
	);

	const colors = ['#636e72', '#0984e3'];
</script>

<div class="radar-plot">
	<h3>{model.displayName}</h3>
	<Radar
		data={[{ id: model.displayName, data: radarData }]}
		keys={['value']}
		indexBy="id"
		valueFormat={(v: number) => `${v}%`}
		colors={colors}
		fillOpacity={0.15}
		borderWidth={2}
		pointRadius={6}
		pointColor="#fff"
		pointBorderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
		gridLabelOffset={18}
		ticksOffsetX={0}
		ticksOffsetY={0}
		axisLabelsOffset={14}
		dimensionLabelsOffset={20}
		sliceLabelsRotation={-45}
		isInteractive
		enableDotsBorder={false}
		width={480}
		height={400}
		margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
		blinkData={[{ id: model.displayName }]}
		theme={{
			textStyle: { fill: '#2d3436', fontSize: '12px' },
			background: 'transparent',
		}}
	/>
</div>

<style>
	.radar-plot {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.radar-plot h3 {
		margin-bottom: 8px;
		font-size: 16px;
		color: #2d3436;
		text-align: center;
	}
</style>
