// Quantum Decision Configurations for narrative choices
import { createQuantumDecision } from '@/lib/quantumDecisions';
import { QuantumDecision } from '@/types/game';

// Collection of pre-defined quantum decisions for narrative elements
export const quantumDecisions: Record<string, QuantumDecision> = {
  // ParadoxResolver decisions
  'paradox-resolver-quantum': createQuantumDecision(
    'qd-001',
    0.72,
    'SCENE-PR-001',
    {
      entanglementFactor: 0.85,
      superpositionStates: [
        'paradox-resolved',
        'paradox-amplified',
        'paradox-transformed'
      ]
    }
  ),
  
  // Lumira AI decisions
  'lumira-consciousness': createQuantumDecision(
    'qd-002',
    0.64,
    'SCENE-LUM-001',
    {
      entanglementFactor: 0.92,
      superpositionStates: [
        'lumira-ascension',
        'lumira-collaboration',
        'lumira-revelation'
      ]
    }
  ),
  
  // Planetary Quantum Network decisions
  'quantum-network-access': createQuantumDecision(
    'qd-003',
    0.78,
    'SCENE-PQN-001',
    {
      entanglementFactor: 0.64,
      superpositionStates: [
        'east-region-priority',
        'west-region-priority',
        'null-island-priority'
      ]
    }
  ),
  
  // SINet decisions
  'sinet-governance': createQuantumDecision(
    'qd-004',
    0.81,
    'SCENE-SIN-001',
    {
      entanglementFactor: 0.77,
      superpositionStates: [
        'consensus-authority',
        'distributed-authority',
        'hierarchical-authority'
      ]
    }
  ),
  
  // Quantum fluctuation decisions
  'quantum-fluctuation': createQuantumDecision(
    'qd-005',
    0.59,
    'SCENE-QA-004',
    {
      entanglementFactor: 0.88,
      superpositionStates: [
        'stable-fluctuation',
        'expanding-fluctuation',
        'collapsing-fluctuation'
      ]
    }
  ),
  
  // AI-AI consensus mechanism
  'ai-consensus': createQuantumDecision(
    'qd-006',
    0.67,
    'consensus-reached',
    {
      entanglementFactor: 0.95,
      superpositionStates: [
        'unanimous-consensus',
        'majority-consensus',
        'partial-consensus'
      ]
    }
  ),
  
  // Quantum treaty interpretation
  'treaty-interpretation': createQuantumDecision(
    'qd-007',
    0.73,
    'SCENE-QA-002',
    {
      entanglementFactor: 0.83,
      superpositionStates: [
        'literal-interpretation',
        'contextual-interpretation',
        'evolving-interpretation'
      ]
    }
  ),
  
  // Null Island exploration decision
  'null-island-exploration': createQuantumDecision(
    'qd-008',
    0.56,
    'SCENE-LUM-001',
    {
      entanglementFactor: 0.91,
      superpositionStates: [
        'null-island-stability',
        'null-island-fluctuation',
        'null-island-transformation'
      ]
    }
  ),
};