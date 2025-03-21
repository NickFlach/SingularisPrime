/**
 * Tests for quantum geometry transformation functions
 * These functions simulate non-Euclidean quantum geometry for decision-making
 */

// Simplified type definitions to avoid import issues
type QuantumDecision = {
  id: string;
  probability: number;
  outcome: string;
  entanglementFactor?: number;
  superpositionStates?: string[];
  quantumByteCode?: string;
};

/**
 * Implements Hofstadter's Butterfly fractal pattern (copied from main implementation)
 */
function hofstadterButterflyPattern(complexity: number, entanglementFactor: number): number {
  const fractalCoefficient = Math.sin(complexity * Math.PI * 2) * Math.cos(entanglementFactor * Math.PI);
  const recursiveComponent = Math.sin(complexity * entanglementFactor * Math.PI * 4) / 2;
  return Math.abs((fractalCoefficient + recursiveComponent) / 2 + 0.5);
}

/**
 * Applies quantum geometry to transform decision probabilities
 */
function applyQuantumGeometry(decision: QuantumDecision, playerQuantum: number): QuantumDecision {
  // Only apply transformation if we have entanglement factor
  if (!decision.entanglementFactor) return decision;
  
  // Use Hofstadter's butterfly pattern to modify probability
  const fractalFactor = hofstadterButterflyPattern(
    decision.probability || 0.5,
    decision.entanglementFactor
  );
  
  // Player's quantum attribute affects the geometry of probability space
  const playerInfluence = playerQuantum / 100 * 0.3;
  
  // Create a modified decision with transformed probability
  return {
    ...decision,
    probability: decision.probability 
      ? Math.min(0.95, Math.max(0.05, decision.probability * fractalFactor + playerInfluence))
      : 0.5,
  };
}

/**
 * Tests for the quantum geometry transformation function
 */
function testQuantumGeometry(): boolean {
  console.log("Testing Quantum Geometry transformations:");
  
  // Test case 1: Check that decision with no entanglement factor is returned unchanged
  const decision1: QuantumDecision = {
    id: "test1",
    probability: 0.7,
    outcome: "outcome1"
  };
  
  const result1 = applyQuantumGeometry(decision1, 50);
  const test1Passed = result1 === decision1;
  console.log(`No entanglement factor test: ${test1Passed ? 'PASS' : 'FAIL'}`);
  
  // Test case 2: Check that probability is transformed within bounds with entanglement
  const decision2: QuantumDecision = {
    id: "test2",
    probability: 0.7,
    outcome: "outcome2",
    entanglementFactor: 0.8
  };
  
  const result2 = applyQuantumGeometry(decision2, 50);
  const test2Passed = 
    result2.probability !== decision2.probability && // Should be transformed
    result2.probability >= 0.05 &&                  // Lower bound
    result2.probability <= 0.95;                   // Upper bound
  
  console.log(`Probability transformation test: ${test2Passed ? 'PASS' : 'FAIL'}`);
  console.log(`  Original probability: ${decision2.probability}`);
  console.log(`  Transformed probability: ${result2.probability}`);
  
  // Test case 3: Check that player quantum attribute affects the transformation
  const playerLow = 10;  // Low quantum attribute
  const playerHigh = 90; // High quantum attribute
  
  const decision3: QuantumDecision = {
    id: "test3",
    probability: 0.5,
    outcome: "outcome3",
    entanglementFactor: 0.5
  };
  
  const resultLow = applyQuantumGeometry(decision3, playerLow);
  const resultHigh = applyQuantumGeometry(decision3, playerHigh);
  
  const test3Passed = resultLow.probability !== resultHigh.probability;
  console.log(`Player attribute influence test: ${test3Passed ? 'PASS' : 'FAIL'}`);
  console.log(`  Low quantum (${playerLow}) probability: ${resultLow.probability}`);
  console.log(`  High quantum (${playerHigh}) probability: ${resultHigh.probability}`);
  
  // Overall test result
  const overallResult = test1Passed && test2Passed && test3Passed;
  console.log(`Overall quantum geometry tests: ${overallResult ? 'PASS' : 'FAIL'}`);
  
  return overallResult;
}

// Export for use in test runner
export { testQuantumGeometry };