/**
 * Custom test runner for quantum mechanics components
 * This provides a lightweight alternative to Jest for testing our quantum functions
 */

// Import test implementations
import { hofstadterButterflyPattern, testHofstadterFunction } from './hofstadter-test';
import { testQuantumGeometry } from './quantum-geometry-test';
import { testQuantumBytecode } from './quantum-bytecode-test';

// Simple test framework
class TestRunner {
  private tests: Array<{ name: string, fn: () => boolean }> = [];
  private results: Array<{ name: string, passed: boolean, error?: Error }> = [];

  addTest(name: string, fn: () => boolean) {
    this.tests.push({ name, fn });
    return this;
  }

  runAll() {
    console.log('🧪 Running Quantum Mechanics Test Suite');
    console.log('======================================\n');

    let passed = 0;
    let failed = 0;

    this.tests.forEach(test => {
      try {
        console.log(`Running test: ${test.name}`);
        const result = test.fn();
        
        if (result) {
          console.log(`✅ PASS: ${test.name}\n`);
          this.results.push({ name: test.name, passed: true });
          passed++;
        } else {
          console.log(`❌ FAIL: ${test.name}\n`);
          this.results.push({ name: test.name, passed: false });
          failed++;
        }
      } catch (error) {
        console.log(`❌ ERROR: ${test.name}`);
        console.error(error);
        console.log('\n');
        this.results.push({ name: test.name, passed: false, error: error as Error });
        failed++;
      }
    });

    console.log('Test Summary:');
    console.log(`Total: ${this.tests.length}, Passed: ${passed}, Failed: ${failed}`);
    
    return failed === 0;
  }
}

// Helper functions for assertions
function assertEqual(actual: any, expected: any, message?: string): boolean {
  const result = actual === expected;
  
  if (!result) {
    console.log(`Assertion failed${message ? ': ' + message : ''}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
  }
  
  return result;
}

function assertInRange(value: number, min: number, max: number, message?: string): boolean {
  const result = value >= min && value <= max;
  
  if (!result) {
    console.log(`Assertion failed${message ? ': ' + message : ''}`);
    console.log(`  Expected value between ${min} and ${max}`);
    console.log(`  Actual: ${value}`);
  }
  
  return result;
}

// Add tests
const runner = new TestRunner();

// Add Hofstadter test
runner.addTest('Hofstadter Butterfly Pattern', testHofstadterFunction);

// Add Quantum Geometry test
runner.addTest('Quantum Geometry Transformation', testQuantumGeometry);

// Add individual tests for the hofstadter function
runner.addTest('Hofstadter Output Range Test', () => {
  // Test with various inputs
  const testCases = [
    { complexity: 0.1, entanglement: 0.1 },
    { complexity: 0.5, entanglement: 0.5 },
    { complexity: 0.9, entanglement: 0.9 },
    { complexity: 0.3, entanglement: 0.7 },
    { complexity: 0.7, entanglement: 0.3 }
  ];
  
  // All outputs should be in range 0-1
  return testCases.every(testCase => {
    const result = hofstadterButterflyPattern(testCase.complexity, testCase.entanglement);
    return assertInRange(
      result, 
      0, 
      1, 
      `Value for inputs (${testCase.complexity}, ${testCase.entanglement}) should be between 0 and 1`
    );
  });
});

runner.addTest('Hofstadter Deterministic Test', () => {
  // For the same inputs, the function should always return the same output
  const c = 0.42;
  const e = 0.73;
  
  const result1 = hofstadterButterflyPattern(c, e);
  const result2 = hofstadterButterflyPattern(c, e);
  
  return assertEqual(result1, result2, 'Function should be deterministic for the same inputs');
});

// Run all tests
const passed = runner.runAll();

// Report test success/failure to the process exit code
process.exit(passed ? 0 : 1);