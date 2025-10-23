import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Extend matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
  }
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock fetch globally
beforeAll(() => {
  global.fetch = vi.fn();
});

afterAll(() => {
  vi.clearAllMocks();
});