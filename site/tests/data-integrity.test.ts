import { describe, it, expect } from 'vitest';
import type { ModelRecord } from '$lib/data/models';
import { models as modelData } from '$lib/data/models';
import { benchmarks } from '$lib/data/benchmarks';

describe('Data Integrity', () => {
  describe('models.ts structure', () => {
    it('should have at least one published model', () => {
      const published = modelData.filter((m) => m.siteVisibility === 'published');
      expect(published.length).toBeGreaterThan(0);
    });

    it('each ModelRecord should have required fields', () => {
      for (const model of modelData) {
        expect(model.id).toBeDefined();
        expect(model.displayName).toBeDefined();
        expect(model.family).toBeDefined();
        expect(model.params).toBeDefined();
        expect(model.overallMean).toBeDefined();
        expect(model.benchmarkMeans).toBeDefined();
        expect(Array.isArray(model.runs)).toBe(true);
      }
    });

    it('overallMean should be between 0 and 1', () => {
      for (const model of modelData) {
        expect(model.overallMean).toBeGreaterThanOrEqual(0);
        expect(model.overallMean).toBeLessThanOrEqual(1);
      }
    });

    it('benchmarkMeans values should be between 0 and 1', () => {
      for (const model of modelData) {
        for (const [key, value] of Object.entries(model.benchmarkMeans)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should have consistent benchmark keys across models', () => {
      const expectedKeys = new Set(Object.keys(modelData[0].benchmarkMeans));
      for (const model of modelData) {
        const actualKeys = new Set(Object.keys(model.benchmarkMeans));
        expect(actualKeys).toEqual(expectedKeys);
      }
    });

    it('overallMean should match average of runs overall values', () => {
      for (const model of modelData) {
        if (model.runs.length > 0) {
          const avg = model.runs.reduce((sum, r) => sum + r.overall, 0) / model.runs.length;
          expect(model.overallMean).toBeCloseTo(avg, 5);
        }
      }
    });

    it('should have unique model IDs', () => {
      const ids = modelData.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('benchmarks.ts structure', () => {
    it('should have at least one benchmark', () => {
      expect(benchmarks.length).toBeGreaterThan(0);
    });

    it('each BenchmarkInfo should have required fields', () => {
      for (const bench of benchmarks) {
        expect(bench.name).toBeDefined();
        expect(bench.shortName).toBeDefined();
      }
    });
  });

  describe('Published vs draft filtering', () => {
    it('published models should be filterable from all models', () => {
      const published = modelData.filter((m) => m.siteVisibility === 'published');
      expect(published.length).toBeLessThan(modelData.length);
      for (const m of published) {
        expect(m.siteVisibility).toBe('published');
      }
    });

    it('draft models should exist', () => {
      const drafts = modelData.filter((m) => m.siteVisibility === 'draft');
      expect(drafts.length).toBeGreaterThan(0);
    });
  });
});
