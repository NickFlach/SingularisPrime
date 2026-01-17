# Quantum Decision System in SINGULARIS PRIME

## Overview

The Quantum Decision System is a core mechanic of SINGULARIS PRIME, simulating quantum computing principles to create dynamic narrative choices. This document outlines the system's architecture and implementation, particularly focusing on the fractal patterns inspired by Hofstadter's butterfly.

## Core Components

### 1. Quantum Decisions

Quantum decisions are narrative choices that operate according to quantum principles:
- **Superposition**: The decision exists in multiple possible states until observed
- **Entanglement**: Decisions can be connected, influencing each other's outcomes
- **Quantum Geometry**: The probability space forms complex non-Euclidean patterns

### 2. Hofstadter's Butterfly Integration

The system implements fractal patterns inspired by Hofstadter's butterfly, a mathematical phenomenon observed in quantum systems:

- **Self-similarity**: Decision outcomes exhibit recursive patterns at different scales
- **Fractal Geometry**: The probability space for decisions forms a fractal structure
- **Quantum Hall Effect**: Simulates how quantum states behave in magnetic fields

### 3. Bytecode Representation

Each quantum decision generates a unique bytecode that encodes its quantum properties:
```
QSP:3|QET:0.85|QMS:0.7200|QFR:0.6734|QGM:0.7071|ID:5fdb31|TS:1679098452319
```

Components include:
- `QSP`: Superposition states count
- `QET`: Entanglement factor
- `QMS`: Base probability measurement
- `QFR`: Fractal pattern coefficient (Hofstadter's butterfly)
- `QGM`: Quantum geometry signature

## Technical Implementation

### Fractal Pattern Generation

```typescript
export function hofstadterButterflyPattern(complexity: number, entanglementFactor: number): number {
  // Simulate self-similar fractal pattern based on complexity and entanglement
  const fractalCoefficient = Math.sin(complexity * Math.PI * 2) * 
                             Math.cos(entanglementFactor * Math.PI);
  const recursiveComponent = Math.sin(complexity * entanglementFactor * Math.PI * 4) / 2;
  
  // Map to range 0-1 with fractal-like distribution
  return Math.abs((fractalCoefficient + recursiveComponent) / 2 + 0.5);
}
```

This function generates a coefficient that simulates the recursive patterns seen in Hofstadter's butterfly fractal. The complexity and entanglement factors combine to create self-similar but unpredictable patterns that influence decision outcomes.

### Quantum Geometry

The system applies non-Euclidean geometry to transform decision probabilities:

```typescript
export function applyQuantumGeometry(decision: QuantumDecision, playerQuantum: number): QuantumDecision {
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
```

This approach simulates how quantum decisions might operate in a quantum computing environment, where probability spaces are not constrained by classical geometry.

## AI-AI Consensus Mechanism

The system includes a consensus mechanism that simulates how multiple AI agents would reach decisions through quantum entanglement:

```typescript
export function simulateQuantumConsensus(
  agentCount: number,
  decision: QuantumDecision,
  consensusThreshold: number = 0.7
): {
  reached: boolean;
  agreement: number;
  outcome: string;
}
```

This function represents how multiple AI entities might collaborate in a quantum-entangled decision space, reaching consensus through principles of quantum superposition.

## Player Interaction

The player's quantum attribute directly influences the quantum decision system:
- Higher quantum attributes increase the influence of fractal patterns
- Players with high quantum skills can perceive more complex decision outcomes
- The quantum processor's capabilities determine the maximum complexity of quantum decisions

## Future Integration

In future iterations, this system could be expanded to:
1. Connect to actual quantum computing APIs for true quantum-based decision making
2. Implement more complex fractal patterns beyond Hofstadter's butterfly
3. Create a visualization system to allow players to see the quantum probability space
4. Develop a quantum programming language for players to modify the quantum decision system