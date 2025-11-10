import { beforeEach, afterEach, vi } from 'vitest';

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// Configure test environment
beforeEach(() => {
  // Clear localStorage
  localStorage.clear();
});
