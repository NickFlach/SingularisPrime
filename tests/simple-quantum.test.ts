import { hofstadterButterflyPattern } from '../client/src/lib/quantumDecisions';

describe('Basic Quantum Function Test', () => {
  test('hofstadterButterflyPattern returns a value between 0 and 1', () => {
    const result = hofstadterButterflyPattern(0.5, 0.5);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });
});