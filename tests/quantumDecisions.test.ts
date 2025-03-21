import {
  hofstadterButterflyPattern,
  applyQuantumGeometry,
  generateQuantumBytecode,
  executeQuantumDecision,
  createQuantumDecision,
  simulateQuantumConsensus,
  initializeQuantumProcessor,
  processQuantumNarrativeChoice
} from '@/lib/quantumDecisions';
import { GameState, NarrativeChoice, QuantumDecision } from '@/types/game';

// Mock data for testing
const mockQuantumDecision: QuantumDecision = {
  id: 'test-qd-1',
  probability: 0.7,
  outcome: 'success',
  entanglementFactor: 0.6,
  superpositionStates: ['success', 'failure', 'partial'],
  quantumByteCode: ''
};

const mockNarrativeChoice: NarrativeChoice = {
  id: 'test-choice-1',
  text: 'Test choice',
  description: 'A test choice with quantum decision',
  nextSceneId: 'next-scene-1',
  quantumDecision: mockQuantumDecision
};

const mockGameState: GameState = {
  currentScreen: 'narrative',
  player: {
    name: 'Test Player',
    origin: 'test-origin',
    attributes: {
      quantum: 70,
      temporal: 60,
      pattern: 50
    },
    energy: 100,
    knowledge: 50,
    paradox: 10
  },
  inventory: [],
  codexEntries: [],
  narrative: {
    currentScene: {
      id: 'test-scene',
      title: 'Test Scene',
      description: 'A test scene',
      prompt: 'What do you do?'
    },
    visitedScenes: [],
    unlockedChoices: []
  },
  location: {
    name: 'Test Location'
  },
  game: {
    cycle: 'alpha',
    audioEnabled: true,
    quantumProcessor: {
      qubits: 12,
      entanglementCapacity: 70,
      coherenceTime: 8000,
      errorCorrectionLevel: 5,
      activeAlgorithms: ['shor', 'grover']
    }
  }
};

describe('Quantum Decision System', () => {
  describe('hofstadterButterflyPattern', () => {
    test('returns a value between 0 and 1', () => {
      const result = hofstadterButterflyPattern(0.5, 0.5);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    test('produces different values for different inputs', () => {
      const result1 = hofstadterButterflyPattern(0.3, 0.7);
      const result2 = hofstadterButterflyPattern(0.7, 0.3);
      expect(result1).not.toEqual(result2);
    });

    test('produces fractal-like distribution', () => {
      // Test multiple points to ensure we're getting a distribution
      // that resembles fractal patterns (not just linear)
      const samples = [];
      for (let i = 0; i < 10; i++) {
        const complexity = i / 10;
        const entanglement = 0.5;
        samples.push(hofstadterButterflyPattern(complexity, entanglement));
      }
      
      // In a fractal pattern, we expect non-linear distribution
      let isNonLinear = false;
      for (let i = 2; i < samples.length; i++) {
        const diff1 = Math.abs(samples[i] - samples[i-1]);
        const diff2 = Math.abs(samples[i-1] - samples[i-2]);
        if (Math.abs(diff1 - diff2) > 0.05) {
          isNonLinear = true;
          break;
        }
      }
      expect(isNonLinear).toBe(true);
    });
  });

  describe('applyQuantumGeometry', () => {
    test('returns unmodified decision when entanglementFactor is missing', () => {
      const decision: QuantumDecision = {
        id: 'test',
        probability: 0.5,
        outcome: 'success'
      };
      const result = applyQuantumGeometry(decision, 50);
      expect(result).toEqual(decision);
    });

    test('modifies probability based on entanglement and player quantum', () => {
      const decision: QuantumDecision = {
        id: 'test',
        probability: 0.5,
        outcome: 'success',
        entanglementFactor: 0.8
      };
      
      const result = applyQuantumGeometry(decision, 80);
      expect(result.probability).not.toEqual(decision.probability);
      expect(result.probability).toBeGreaterThanOrEqual(0.05);
      expect(result.probability).toBeLessThanOrEqual(0.95);
    });
  });

  describe('generateQuantumBytecode', () => {
    test('generates bytecode string', () => {
      const decision: Partial<QuantumDecision> = {
        probability: 0.7,
        entanglementFactor: 0.6,
        superpositionStates: ['a', 'b', 'c']
      };
      
      const bytecode = generateQuantumBytecode(decision);
      expect(typeof bytecode).toBe('string');
      expect(bytecode.length).toBeGreaterThan(0);
    });

    test('includes all relevant patterns', () => {
      const decision: Partial<QuantumDecision> = {
        probability: 0.7,
        entanglementFactor: 0.6,
        superpositionStates: ['a', 'b', 'c']
      };
      
      const bytecode = generateQuantumBytecode(decision);
      
      // Check for expected patterns in bytecode
      expect(bytecode).toContain('QSP:3'); // Superposition states
      expect(bytecode).toContain('QET:0.60'); // Entanglement
      expect(bytecode).toContain('QMS:0.7000'); // Measurement/probability
      expect(bytecode).toContain('QFR:'); // Fractal pattern
      expect(bytecode).toContain('ID:'); // Unique ID
      expect(bytecode).toContain('TS:'); // Timestamp
    });
  });

  describe('executeQuantumDecision', () => {
    test('returns outcome based on probability', () => {
      // Test with 100% probability to ensure we get the expected outcome
      const decision: QuantumDecision = {
        id: 'test',
        probability: 1.0, // 100% probability
        outcome: 'success',
        quantumByteCode: ''
      };
      
      const result = executeQuantumDecision(decision);
      expect(result).toBe('success');
    });

    test('returns from superposition states when provided', () => {
      const decision: QuantumDecision = {
        id: 'test',
        probability: 0.5,
        outcome: 'default',
        superpositionStates: ['a', 'b', 'c'],
        quantumByteCode: ''
      };
      
      const result = executeQuantumDecision(decision);
      expect(['a', 'b', 'c']).toContain(result);
    });

    test('uses entanglement factor to modify outcome selection', () => {
      // We'll run multiple trials to see statistical effects of entanglement
      const withoutEntanglement: QuantumDecision = {
        id: 'test1',
        probability: 0.5,
        outcome: 'success',
        quantumByteCode: ''
      };
      
      const withEntanglement: QuantumDecision = {
        id: 'test2',
        probability: 0.5,
        outcome: 'success',
        entanglementFactor: 0.9,
        quantumByteCode: ''
      };
      
      const trials = 100;
      let successCountWithout = 0;
      let successCountWith = 0;
      
      for (let i = 0; i < trials; i++) {
        if (executeQuantumDecision(withoutEntanglement) === 'success') {
          successCountWithout++;
        }
        if (executeQuantumDecision(withEntanglement) === 'success') {
          successCountWith++;
        }
      }
      
      // The entangled decision should have a different distribution
      // We don't test exact values since it's probabilistic
      expect(successCountWith).not.toBe(successCountWithout);
    });
  });

  describe('createQuantumDecision', () => {
    test('creates a complete quantum decision object', () => {
      const decision = createQuantumDecision('test-id', 0.7, 'success', {
        entanglementFactor: 0.6,
        superpositionStates: ['success', 'failure']
      });
      
      expect(decision.id).toBe('test-id');
      expect(decision.probability).toBe(0.7);
      expect(decision.outcome).toBe('success');
      expect(decision.entanglementFactor).toBe(0.6);
      expect(decision.superpositionStates).toEqual(['success', 'failure']);
      expect(decision.quantumByteCode).toBeDefined();
      expect(decision.quantumByteCode.length).toBeGreaterThan(0);
    });
  });

  describe('simulateQuantumConsensus', () => {
    test('calculates consensus among multiple agents', () => {
      // Force high consensus with very high probability
      const highProbabilityDecision: QuantumDecision = {
        id: 'test',
        probability: 0.99,
        outcome: 'consensus',
        quantumByteCode: ''
      };
      
      const result = simulateQuantumConsensus(5, highProbabilityDecision);
      
      expect(result.reached).toBe(true);
      expect(result.agreement).toBeGreaterThanOrEqual(0.7); // Default threshold
      expect(result.outcome).toBe('consensus');
    });
    
    test('fails to reach consensus with low probability', () => {
      // Force low consensus with very low probability
      const lowProbabilityDecision: QuantumDecision = {
        id: 'test',
        probability: 0.1,
        outcome: 'rare',
        quantumByteCode: ''
      };
      
      const result = simulateQuantumConsensus(5, lowProbabilityDecision);
      
      expect(result.reached).toBe(false);
      expect(result.agreement).toBeLessThan(0.7); // Default threshold
      expect(result.outcome).toBe('consensus_failed');
    });
  });

  describe('initializeQuantumProcessor', () => {
    test('creates a quantum processor with default values', () => {
      const processor = initializeQuantumProcessor();
      
      expect(processor.qubits).toBe(8); // Default
      expect(processor.entanglementCapacity).toBe(80);
      expect(processor.coherenceTime).toBe(8000);
      expect(processor.errorCorrectionLevel).toBe(0);
      expect(processor.activeAlgorithms).toContain('shor');
    });
    
    test('creates a quantum processor with specified qubits', () => {
      const processor = initializeQuantumProcessor(16);
      
      expect(processor.qubits).toBe(16);
      expect(processor.entanglementCapacity).toBe(100); // Max value
      expect(processor.coherenceTime).toBe(16000);
      expect(processor.errorCorrectionLevel).toBe(1);
    });
  });

  describe('processQuantumNarrativeChoice', () => {
    test('returns default values for choice without quantum decision', () => {
      const choiceWithoutQD: NarrativeChoice = {
        id: 'test-choice',
        text: 'Test choice',
        description: 'A test choice',
        nextSceneId: 'next-scene'
      };
      
      const result = processQuantumNarrativeChoice(choiceWithoutQD, mockGameState);
      
      expect(result.outcome).toBe('');
      expect(result.quantumEffects).toEqual({});
    });
    
    test('processes a choice with quantum decision', () => {
      const result = processQuantumNarrativeChoice(mockNarrativeChoice, mockGameState);
      
      expect(result.outcome).toBeDefined();
      expect(result.quantumEffects).toHaveProperty('knowledge');
      expect(result.quantumEffects).toHaveProperty('paradox');
      expect(result.quantumEffects).toHaveProperty('energy');
    });
    
    test('generates a message for high entanglement quantum decisions', () => {
      const highEntanglementChoice: NarrativeChoice = {
        ...mockNarrativeChoice,
        quantumDecision: {
          ...mockQuantumDecision,
          entanglementFactor: 0.9,
        }
      };
      
      const result = processQuantumNarrativeChoice(highEntanglementChoice, mockGameState);
      
      // Should generate a message for high entanglement decisions
      expect(result.message).toBeDefined();
      expect(result.message!.length).toBeGreaterThan(0);
    });
  });
});