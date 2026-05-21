import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';

// Mock @nivo/radar to avoid canvas/SVG issues in jsdom
vi.mock('@nivo/radar', () => ({
  Radar: () => null,
}));

import RadarPlot from '$lib/components/RadarPlot.svelte';

const mockModel = {
  id: 'test-model',
  displayName: 'Radar Test Model',
  family: 'Test-Family',
  params: '7B',
  weightsQuant: 'Q4_K_M',
  kvCache: 'default',
  upstreamModelId: null,
  releaseDateUtc: null,
  releaseSourceUrl: null,
  siteVisibility: 'published' as const,
  runs: [],
  overallMean: 0.75,
  overallStd: 0.02,
  benchmarkMeans: {
    'BasqueGLUE_bec': 0.8,
    'LatxaEval_mc': 0.65,
  },
};

describe('RadarPlot Component', () => {
  it('should render model name in h3', () => {
    const { container } = render(RadarPlot, { props: { model: mockModel } });
    expect(container.textContent).toContain('Radar Test Model');
  });

  it('should pass radar data to mocked Radar component', () => {
    const { container } = render(RadarPlot, { props: { model: mockModel } });
    // Component should render without crashing
    expect(container.querySelector('.radar-plot')).toBeTruthy();
  });

  it('should handle single benchmark', () => {
    const singleBenchmark = { ...mockModel, benchmarkMeans: { 'BasqueGLUE_bec': 0.9 } };
    const { container } = render(RadarPlot, { props: { model: singleBenchmark } });
    expect(container.textContent).toContain('Radar Test Model');
  });

  it('should handle multiple benchmarks', () => {
    const multiBenchmark = {
      ...mockModel,
      benchmarkMeans: {
        'BasqueGLUE_bec': 0.8,
        'LatxaEval_mc': 0.65,
        'BasqueGLUE_xnli': 0.72,
      },
    };
    const { container } = render(RadarPlot, { props: { model: multiBenchmark } });
    expect(container.textContent).toContain('Radar Test Model');
  });

  it('should have radar-plot class wrapper', () => {
    const { container } = render(RadarPlot, { props: { model: mockModel } });
    expect(container.querySelector('.radar-plot')).toBeTruthy();
  });
});
