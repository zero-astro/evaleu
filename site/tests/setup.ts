import { vi } from 'vitest';
import { configure } from '@testing-library/svelte';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Configure testing library to use Svelte 5 client-side rendering
configure({
  async: false,
});
