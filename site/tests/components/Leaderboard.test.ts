import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Leaderboard from '$lib/components/Leaderboard.svelte';

const mockModels = [
  {
    id: 'model-1',
    displayName: 'Latxa 70B',
    family: 'Llama 3.1',
    params: '70B',
    weightsQuant: 'Q8_0',
    kvCache: 'default',
    upstreamModelId: null,
    releaseDateUtc: null,
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
    releaseDateUtc: null,
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
    releaseDateUtc: null,
    releaseSourceUrl: null,
    siteVisibility: 'draft' as const,
    runs: [],
    overallMean: 0.3,
    overallStd: 0.01,
    benchmarkMeans: { 'BasqueGLUE_bec': 0.2 },
  },
];

const mockBenchmarks = [
  { key: 'BasqueGLUE_bec', label: 'BasqueGLUE BERT' },
];

describe('Leaderboard Component', () => {
  it('should render without crashing', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    expect(container).toBeTruthy();
  });

  it('should only show published models in table', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Should contain Latxa and Kimu but not Draft Model
    expect(container.textContent).toContain('Latxa 70B');
    expect(container.textContent).toContain('Kimu 9B');
    expect(container.textContent).not.toContain('Draft Model');
  });

  it('should sort by overallMean descending by default', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Latxa (0.713889) should appear before Kimu (0.625)
    const rows = container.querySelectorAll('.lb-row');
    expect(rows[0].textContent).toContain('Latxa 70B');
    expect(rows[1].textContent).toContain('Kimu 9B');
  });

  it('should filter by family', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Select Gemma-Kimu family
    const select = container.querySelector('select');
    await fireEvent.change(select!, { target: { value: 'Gemma-Kimu' } });
    
    expect(container.textContent).toContain('Kimu 9B');
    expect(container.textContent).not.toContain('Latxa 70B');
  });

  it('should filter by search text', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Type in search box
    const input = container.querySelector('.lb-search');
    await fireEvent.input(input!, { target: { value: 'Latxa' } });
    
    expect(container.textContent).toContain('Latxa 70B');
    expect(container.textContent).not.toContain('Kimu 9B');
  });

  it('should toggle sort direction when clicking header', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Click on Overall Mean header to reverse sort
    const headers = container.querySelectorAll('.lb-sortable');
    await fireEvent.click(headers[0]);
    
    // Now Kimu (lower) should appear before Latxa (higher)
    const rows = container.querySelectorAll('.lb-row');
    expect(rows[0].textContent).toContain('Kimu 9B');
  });

  it('should format percentages correctly', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Latxa overallMean is 0.713889, should display as 71.4%
    expect(container.textContent).toContain('71.4%');
  });

  it('should show family badges with colors', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Check that family badge exists
    const badges = container.querySelectorAll('.lb-badge');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should show rank numbers', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // First row should have rank 1
    expect(container.querySelector('.lb-rank')?.textContent).toBe('1');
  });

  it('should show params column', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    expect(container.textContent).toContain('70B');
    expect(container.textContent).toContain('9B');
  });

  it('should have lb-table class', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    expect(container.querySelector('.lb-table')).toBeTruthy();
  });

  it('should have leaderboard wrapper', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    expect(container.querySelector('.leaderboard')).toBeTruthy();
  });

  it('should show sort arrows for active column', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Default sort is desc (▼) on overallMean
    const headers = container.querySelectorAll('.lb-sortable');
    expect(headers[0].textContent).toContain('▼');
  });

  it('should handle empty published models list', () => {
    const noPublished = mockModels.filter((m) => m.siteVisibility === 'draft');
    const { container } = render(Leaderboard, {
      props: { models: noPublished, benchmarks: mockBenchmarks },
    });
    
    // Should not crash and should show no rows
    expect(container.textContent).not.toContain('Latxa 70B');
  });

  it('should reset search when cleared', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Search for Latxa
    const input = container.querySelector('.lb-search');
    await fireEvent.input(input!, { target: { value: 'Latxa' } });
    expect(container.textContent).toContain('Latxa 70B');
    
    // Clear search
    await fireEvent.input(input!, { target: { value: '' } });
    expect(container.textContent).toContain('Kimu 9B');
  });

  it('should show All Families option in select', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    const select = container.querySelector('select');
    expect(select?.value).toBe('all');
  });

  it('should sort by params column', async () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    // Click on Params header to sort
    const headers = container.querySelectorAll('.lb-sortable');
    await fireEvent.click(headers[2]); // Params column
    
    const rows = container.querySelectorAll('.lb-row');
    expect(rows.length).toBe(2);
  });

  it('should show family filter options', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    const select = container.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should have lb-filters wrapper', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    expect(container.querySelector('.lb-filters')).toBeTruthy();
  });

  it('should have lb-table-wrap wrapper', () => {
    const { container } = render(Leaderboard, {
      props: { models: mockModels, benchmarks: mockBenchmarks },
    });
    
    expect(container.querySelector('.lb-table-wrap')).toBeTruthy();
  });
});
