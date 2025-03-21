// Manual test for hofstadterButterflyPattern function
import { hofstadterButterflyPattern } from './client/src/lib/quantumDecisions.js';

console.log('Starting manual test for hofstadterButterflyPattern');

// Test that the function returns a value between 0 and 1
const result = hofstadterButterflyPattern(0.5, 0.5);
console.log('Result:', result);

if (result >= 0 && result <= 1) {
  console.log('✅ PASS: Value is between 0 and 1');
} else {
  console.log('❌ FAIL: Value should be between 0 and 1');
}

// Test that different inputs produce different outputs
const result1 = hofstadterButterflyPattern(0.3, 0.7);
const result2 = hofstadterButterflyPattern(0.7, 0.3);
console.log('Result 1:', result1);
console.log('Result 2:', result2);

if (result1 !== result2) {
  console.log('✅ PASS: Different inputs produce different outputs');
} else {
  console.log('❌ FAIL: Different inputs should produce different outputs');
}

console.log('Manual test completed');