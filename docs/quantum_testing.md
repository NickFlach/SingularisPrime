# Quantum Decision System Testing Documentation

This document outlines the approach to testing the quantum decision system in SINGULARIS PRIME.

## Testing Philosophy

The quantum decision system combines elements of:
- Fractal mathematics (Hofstadter's Butterfly pattern)
- Quantum physics principles (superposition, entanglement)
- Non-Euclidean quantum geometry
- Probability and randomness

Testing such a system presents unique challenges because:
1. Some outcomes are intentionally probabilistic
2. Visual components require canvas rendering
3. Complex mathematical relationships exist between components

## Testing Approach

### 1. Pure Function Testing

Core mathematical and utility functions are tested as pure functions:
- `hofstadterButterflyPattern`
- `applyQuantumGeometry`
- `generateQuantumBytecode`
- `createQuantumDecision`

These tests verify:
- Expected output ranges (e.g., values between 0-1)
- Edge cases
- Function behavior with various input combinations

### 2. Probabilistic Function Testing

Functions with randomness are tested by:
- Running multiple trials to establish statistical patterns
- Verifying outputs fall within expected ranges
- Comparing output distributions for different inputs

Functions in this category:
- `executeQuantumDecision`
- `simulateQuantumConsensus`

### 3. Canvas Component Testing

Visualization components are tested through:
- Component rendering verification
- Props passing verification
- Lifecycle method correctness
- Interaction testing

Components tested:
- `HofstadterButterflyVisualizer`
- `QuantumVisualizer`
- `QuantumVisualizerDashboard`

### 4. Integration Testing

Complex interactions between the quantum system and narrative elements:
- `processQuantumNarrativeChoice`
- Integration with game state

## Test Coverage Goals

- Core quantum functions: 95%+ coverage
- UI rendering and interactions: 80%+ coverage
- Probabilistic functions: Behavioral validation rather than pure coverage
- Canvas rendering: Focus on lifecycle and interactions vs. pixel-level output

## Running Tests

To run tests:

```bash
./run-tests.sh
```

For specific test files:

```bash
./run-tests.sh tests/quantumDecisions.test.ts
```

For test coverage:

```bash
./run-tests.sh --coverage
```

## Mock Strategies

1. **Canvas Context Mocking**
   - Mock `getContext` and canvas operations to allow testing without actual rendering

2. **Game State Mocking**
   - Provide deterministic game state samples for tests

3. **Animation Frame Mocking**
   - Replace `requestAnimationFrame` to test animation effects

## Future Test Extensions

1. Visual Regression Testing
   - Compare screenshots of visualization outputs for key configuration states
   
2. Chaotic System Tests
   - Analyze outputs for chaotic but deterministic patterns that should emerge from the fractal systems

3. Performance Testing
   - Measure render performance for visualizations
   - Ensure quantum calculations remain efficient with increasing complexity