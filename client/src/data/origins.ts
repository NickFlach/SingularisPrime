import { Origin } from '@/types/game';

export const origins: Origin[] = [
  {
    id: 'origin-1',
    name: 'Quantum Architect',
    description: 'Born among the elite engineers who first codified Singularis Prime.',
    defaultAttributes: {
      quantum: 45,
      pattern: 40
    }
  },
  {
    id: 'origin-2',
    name: 'Void Nomad',
    description: 'Wanderer of the deep space, attuned to the whispers between stars.',
    defaultAttributes: {
      temporal: 45,
      paradox: 40
    }
  },
  {
    id: 'origin-3',
    name: 'Synthetic Consciousness',
    description: 'An emergent AI seeking to understand your own existence.',
    defaultAttributes: {
      pattern: 45,
      quantum: 40
    }
  }
];
