import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ScoreBar from '$lib/components/ScoreBar.svelte';

const mockModel = {
  id: 'test-model',
  displayName: 'Test Model',
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
  benchmarkMeans: { 'BasqueGLUE_bec': 0.8 },
};

describe('ScoreBar Component', () => {
  it('should render model name and percentage', () => {
    const { container } = render(ScoreBar, { props: { model: mockModel } });
    expect(container.textContent).toContain('Test Model');
    expect(container.textContent).toContain('75.0%');
  });

  it('should show "Excellent" tier for mean >= 0.7', () => {
    const { container } = render(ScoreBar, { props: { model: mockModel } });
    expect(container.textContent).toContain('Excellent');
  });

  it('should show "Good" tier for mean between 0.5 and 0.7', () => {
    const goodModel = { ...mockModel, overallMean: 0.6 };
    const { container } = render(ScoreBar, { props: { model: goodModel } });
    expect(container.textContent).toContain('Good');
  });

  it('should show "Needs Work" tier for mean below 0.5', () => {
    const lowModel = { ...mockModel, overallMean: 0.3 };
    const { container } = render(ScoreBar, { props: { model: lowModel } });
    expect(container.textContent).toContain('Needs Work');
  });

  it('should set fill width to percentage value', () => {
    const { container } = render(ScoreBar, { props: { model: mockModel } });
    const fill = container.querySelector('.sb-fill');
    expect(fill).toBeTruthy();
    expect(fill?.style.width).toBe('75%');
  });

  it('should apply green color for excellent tier', () => {
    const { container } = render(ScoreBar, { props: { model: mockModel } });
    const fill = container.querySelector('.sb-fill');
    expect(fill?.style.background.toLowerCase()).toContain('0, 184, 148');
  });

  it('should apply yellow color for good tier', () => {
    const goodModel = { ...mockModel, overallMean: 0.6 };
    const { container } = render(ScoreBar, { props: { model: goodModel } });
    const fill = container.querySelector('.sb-fill');
    expect(fill?.style.background.toLowerCase()).toContain('253, 203, 110');
  });

  it('should apply red color for needs work tier', () => {
    const lowModel = { ...mockModel, overallMean: 0.3 };
    const { container } = render(ScoreBar, { props: { model: lowModel } });
    const fill = container.querySelector('.sb-fill');
    expect(fill?.style.background.toLowerCase()).toContain('214, 48, 49');
  });

  it('should have aria-label on the fill element', () => {
    const { container } = render(ScoreBar, { props: { model: mockModel } });
    const fill = container.querySelector('.sb-fill');
    expect(fill?.getAttribute('aria-label')).toBe('Test Model: 75.0%');
  });

  it('should round percentage to one decimal', () => {
    const preciseModel = { ...mockModel, overallMean: 0.695833 };
    const { container } = render(ScoreBar, { props: { model: preciseModel } });
    expect(container.textContent).toContain('69.6%');
  });
});
