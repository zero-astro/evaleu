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

  it('should only show published models as data points', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    // Only Latxa and Kimu should appear (not Draft Model)
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('should show accuracy percentages on Y-axis', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    // Check that percentage labels exist (50%, 60%, 70%, 80%)
    expect(container.textContent).toContain('50%');
    expect(container.textContent).toContain('60%');
    expect(container.textContent).toContain('70%');
    expect(container.textContent).toContain('80%');
  });

  it('should show axis labels', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.textContent).toContain('Release Date');
    expect(container.textContent).toContain('Accuracy');
  });

  it('should show family legend items', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.textContent).toContain('Llama 3.1');
    expect(container.textContent).toContain('Gemma-Kimu');
  });

  it('should have tl-legend class', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.querySelector('.tl-legend')).toBeTruthy();
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

  it('should show model names in SVG titles', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    const titles = container.querySelectorAll('title');
    const titleTexts = Array.from(titles).map((t) => t.textContent).join(', ');
    expect(titleTexts).toContain('Latxa 70B');
    expect(titleTexts).toContain('Kimu 9B');
  });

  it('should color points by family', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    const circles = container.querySelectorAll('circle');
    // First circle should be Gemma-Kimu green (#00B894) - Kimu 9B (earlier date)
    // Second circle should be Llama 3.1 purple (#6C5CE7) - Latxa 70B
    expect(circles[0].getAttribute('fill')).toBe('#00B894');
    expect(circles[1].getAttribute('fill')).toBe('#6C5CE7');
  });

  it('should have tl-svg class', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.querySelector('.tl-svg')).toBeTruthy();
  });

  it('should show timeline-chart wrapper', () => {
    const { container } = render(TimelineChart, { props: { models: mockModels } });
    expect(container.querySelector('.timeline-chart')).toBeTruthy();
  });
});
