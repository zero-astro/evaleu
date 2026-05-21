import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import TimelineChart from '$lib/components/TimelineChart.svelte';

const mockModels = [
  {
    id: 'model-1',
    displayName: 'Latxa 70B',
    family: 'Llama 3.1',
    params: '70B',
    weightsQuant: 'Q8_0',
    kvCache: 'default',
    upstreamModelId: null,
    releaseDateUtc: new Date('2025-06-01').toISOString(),
    releaseSourceUrl: null,
    siteVisibility: 'published' as const,
    runs: [],
    overallMean: 0.713889,
    overallStd: 0.007733,
    benchmarkMeans: { 'BasqueGLUE_bec': 0.645833 },
  },
  {
    id: 'model-2',
    displayName: 'Kimu 9B',
    family: 'Gemma-Kimu',
    params: '9B',
    weightsQuant: 'F16',
    kvCache: 'f16/f16',
    upstreamModelId: null,
    releaseDateUtc: new Date('2025-03-15').toISOString(),
    releaseSourceUrl: null,
    siteVisibility: 'published' as const,
    runs: [],
    overallMean: 0.625,
    overallStd: 0.011369,
    benchmarkMeans: { 'BasqueGLUE_bec': 0.475 },
  },
  {
    id: 'model-3',
    displayName: 'Draft Model',
    family: 'Test-Family',
    params: '1B',
    weightsQuant: 'Q4',
    kvCache: 'default',
    upstreamModelId: null,
    releaseDateUtc: new Date('2025-09-01').toISOString(),
    releaseSourceUrl: null,
    siteVisibility: 'draft' as const,
    runs: [],
    overallMean: 0.3,
    overallStd: 0.01,
    benchmarkMeans: { 'BasqueGLUE_bec': 0.2 },
  },
];

describe('TimelineChart Component', () => {
  it('should render title', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.textContent).toContain('Release Date vs Accuracy');
  });

  it('should show timeline-chart wrapper', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.querySelector('.timeline-chart')).toBeTruthy();
  });

  it('should have plot-container div', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.querySelector('.plot-container')).toBeTruthy();
  });

  it('should handle empty published models list', () => {
    const noPublished = mockModels.filter((m) => m.siteVisibility === 'draft');
    const { container } = render(TimelineChart, { props: { models: noPublished } });
    expect(container.textContent).toContain('Release Date vs Accuracy');
  });

  it('should handle models without release dates', () => {
    const noDateModel = [
      { ...mockModels[0], releaseDateUtc: null },
    ];
    const { container } = render(TimelineChart, { props: { models: noDateModel } });
    expect(container.textContent).toContain('Release Date vs Accuracy');
  });

  it('should handle empty models list', () => {
    const { container } = render(TimelineChart, { props: { models: [] } });
    expect(container.textContent).toContain('Release Date vs Accuracy');
  });
});
