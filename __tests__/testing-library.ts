import { afterEach, expect } from 'bun:test';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// @ts-expect-error - this came from Bun docs, but has a type error https://bun.sh/guides/test/testing-library
expect.extend(matchers);

// Optional: cleans up `render` after each test
afterEach(() => {
  cleanup();
});