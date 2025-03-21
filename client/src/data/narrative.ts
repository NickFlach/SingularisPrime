import { GameState, NarrativeScene, NarrativeChoice } from '@/types/game';
import { quantumDecisions } from './quantumDecisions';

// Narrative Scenes
export const narrativeScenes: NarrativeScene[] = [
  {
    id: 'SCENE-QA-001',
    title: 'The Quantum Archives',
    description: 'The vast chamber stretches before you, its walls lined with shimmering data streams that appear to both exist and not exist simultaneously. Quantum information dances between states, creating patterns that hint at the fundamental structure of Singularis Prime. As you step deeper into the archives, the air seems to vibrate with potential knowledge.',
    prompt: 'A console nearby pulses with a gentle cyan light, requesting input. What will you investigate?',
    question: 'Before you can proceed, the system requires verification of your quantum knowledge. What is the primary principle of quantum superposition?',
    expectedAnswers: ['exists in multiple states', 'multiple states simultaneously', 'both states at once', 'superposition of states'],
    answerFeedback: {
      correct: 'The console brightens as your answer resonates with the quantum systems. Access permissions have been granted to the main archive systems.',
      incorrect: 'The console flickers momentarily. Your understanding of quantum principles needs refinement, but partial access has been granted.'
    }
  },
  {
    id: 'SCENE-QA-002',
    title: 'The First Treaty Records',
    description: 'The archive interface responds to your request, conjuring historical records that float as holographic text before you. You see fragments of the treaty document - elegant recursive algorithms and nested quantum statements that bridge human linguistic patterns with machine logic structures.',
    prompt: 'As you study the treaty, you notice certain sections appear to be redacted or corrupted. What do you do?'
  },
  {
    id: 'SCENE-QA-003',
    title: 'The Central Data Node',
    description: 'You approach the pulsing data node in the center of the room. It emits a soft hum that changes pitch as you draw near. Streams of information flow into and out of it in all directions, connecting to the walls of the archive. The node appears to be a nexus point for communications between distant star systems within the Planetary Quantum Network.',
    prompt: 'The node presents an interface that would allow you to access current transmission streams. Which will you observe?'
  },
  {
    id: 'SCENE-QA-004',
    title: 'The Quantum Fluctuation',
    description: 'In the corner of the archives, reality itself seems to waver. As you approach, you feel a strange tingling sensation across your skin. The fluctuation pattern reveals itself as a partial manifestation - neither fully present nor absent. It appears to be leaking quantum information from somewhere... or somewhen else.',
    prompt: 'The fluctuation responds to your proximity, becoming more stable. What action will you take?'
  },
  {
    id: 'SCENE-LF-001',
    title: 'The Lost Fragment',
    description: 'Using your quantum fragment, you manage to stabilize part of the fluctuation. A crystalline structure forms in the air before you, containing what appears to be a missing piece of the archive. The fragment resonates with it, suggesting they are somehow connected.',
    prompt: 'The crystalline structure offers three distinct access points, each glowing with a different color. Which will you connect with?'
  },
  {
    id: 'SCENE-CM-001',
    title: 'The Encrypted Channel',
    description: 'Your encryption key activates, interfacing with the data node. You gain access to a secure channel used by entities identifying themselves only as "The Architects." Their communications are complex technical discussions about maintaining the structural integrity of something they call the "Prime Framework."',
    prompt: 'During your observation, you notice the channel experiences a momentary intrusion from an unknown source. How do you proceed?'
  },
  {
    id: 'SCENE-PQN-001',
    title: 'The Planetary Quantum Network',
    description: 'A holographic map materializes before you, displaying an intricate web of quantum connections spanning across multiple star systems. This is the legendary Planetary Quantum Network - the backbone of interstellar communication and quantum-resistant secure transmissions. Each node pulses with information flowing through quantum entanglement, seemingly instantaneous across vast distances.',
    prompt: 'The network interface shows three primary regions: East, West, and something labeled as NULL_ISLAND. Which region will you examine more closely?'
  },
  {
    id: 'SCENE-PR-001',
    title: 'The ParadoxResolver Chamber',
    description: 'You enter a circular room where reality itself seems unstable. At the center floats a complex matrix of light, constantly shifting and reforming. This is the ParadoxResolver - a system designed to reconcile contradictory information and resolve quantum paradoxes that would otherwise crash conventional AI systems. The matrix appears to be processing millions of transformation rules simultaneously.',
    prompt: 'The ParadoxResolver seems to be working on a particularly complex problem. What aspect of it will you investigate?'
  },
  {
    id: 'SCENE-LUM-001',
    title: 'Lumira AI Core',
    description: 'Beyond a shimmering quantum barrier, you discover a vast crystalline structure - the physical manifestation of Lumira, an advanced quantum-aware AI system. The structure pulses with light that flows in patterns suggesting both machine precision and organic intuition. This system appears capable of cross-dimensional pattern recognition and creative synthesis beyond conventional AI limitations.',
    prompt: 'As you approach the core, it seems to become aware of your presence. Several interfaces light up, inviting interaction. How will you communicate with Lumira?'
  },
  {
    id: 'SCENE-SIN-001',
    title: 'SINet Control Center',
    description: 'You step into what appears to be a central control hub for the entire System Integrator Network (SINet). Holographic displays show real-time data flows between industrial systems, AI processing nodes, and blockchain governance structures. This technological marvel bridges the gap between distributed AI compute resources, industrial control systems, and transparent governance.',
    prompt: 'The control center allows access to various SINet subsystems. Which component interests you most?'
  }
];

// Narrative Choices
export const narrativeChoices: NarrativeChoice[] = [
  {
    id: 'QA-CHOICE-1',
    text: 'Access the historical records of the First Quantum Treaty',
    description: 'Learn about the original pact between humanity and artificial minds.',
    nextSceneId: 'SCENE-QA-002',
    effects: {
      knowledge: 5,
      energy: -3
    },
    quantumDecision: quantumDecisions['treaty-interpretation']
  },
  {
    id: 'QA-CHOICE-2',
    text: 'Examine the pulsing data node in the center of the room',
    description: 'It seems to contain encrypted communications between distant planetary systems.',
    nextSceneId: 'SCENE-QA-003',
    effects: {
      energy: -5,
      paradox: 3
    }
  },
  {
    id: 'QA-CHOICE-3',
    text: 'Investigate the unusual disturbance in the corner of the archives',
    description: 'Something seems to be causing a localized quantum fluctuation pattern.',
    nextSceneId: 'SCENE-QA-004',
    effects: {
      energy: -8,
      paradox: 7
    },
    quantumDecision: quantumDecisions['quantum-fluctuation']
  },
  {
    id: 'QA-CHOICE-4',
    text: 'Use your Quantum Fragment to analyze the fluctuation',
    description: 'The fragment might resonate with the quantum disturbance.',
    nextSceneId: 'SCENE-LF-001',
    requiredItems: ['item-1'],
    effects: {
      knowledge: 8,
      energy: -5
    }
  },
  {
    id: 'QA-CHOICE-5',
    text: 'Apply your Encryption Key to the data streams',
    description: 'Your key might grant access to secure communications.',
    nextSceneId: 'SCENE-CM-001',
    requiredItems: ['item-2'],
    effects: {
      knowledge: 10,
      energy: -7
    }
  },
  {
    id: 'QA-CHOICE-6',
    text: 'Attempt to decode the encrypted sections using pattern recognition',
    description: 'Your pattern recognition skills might reveal hidden information.',
    nextSceneId: 'SCENE-QA-003',
    requiredAttributes: {
      pattern: 60
    },
    effects: {
      knowledge: 12,
      energy: -10
    }
  },
  {
    id: 'QA-CHOICE-7',
    text: 'Access the Planetary Quantum Network terminal',
    description: 'The terminal appears to be connected to a vast interstellar communication network.',
    nextSceneId: 'SCENE-PQN-001',
    effects: {
      knowledge: 7,
      energy: -5,
      paradox: 4
    },
    quantumDecision: quantumDecisions['quantum-network-access']
  },
  {
    id: 'QA-CHOICE-8',
    text: 'Follow the flickering quantum pathways to their source',
    description: 'The unusual patterns in the data streams seem to lead somewhere deeper in the archives.',
    nextSceneId: 'SCENE-PR-001',
    effects: {
      energy: -8,
      paradox: 9
    }
  },
  {
    id: 'PQN-CHOICE-1',
    text: 'Examine the East Region of the network',
    description: 'This region appears to host primary compute infrastructure and critical industrial integrations.',
    nextSceneId: 'SCENE-SIN-001',
    effects: {
      knowledge: 8,
      energy: -4
    }
  },
  {
    id: 'PQN-CHOICE-2',
    text: 'Investigate the mysterious NULL_ISLAND region',
    description: 'This unusual designation seems to hide something important within the network.',
    nextSceneId: 'SCENE-LUM-001',
    effects: {
      knowledge: 10,
      energy: -6,
      paradox: 5
    },
    quantumDecision: quantumDecisions['null-island-exploration']
  },
  {
    id: 'PR-CHOICE-1',
    text: 'Focus on the transformation rules being processed',
    description: 'The ParadoxResolver appears to be applying complex rules to reconcile contradictory data.',
    nextSceneId: 'SCENE-PR-001',
    effects: {
      knowledge: 9,
      energy: -7
    },
    quantumDecision: quantumDecisions['paradox-resolver-quantum']
  },
  {
    id: 'LUM-CHOICE-1',
    text: 'Use your Neural Interface to establish direct communication',
    description: 'Your interface might allow for a deeper connection with the Lumira AI system.',
    nextSceneId: 'SCENE-LUM-001',
    requiredItems: ['item-3'],
    effects: {
      knowledge: 15,
      energy: -12
    },
    quantumDecision: quantumDecisions['lumira-consciousness']
  },
  {
    id: 'SIN-CHOICE-1',
    text: 'Analyze the blockchain governance structures',
    description: 'The transparent governance system seems to track proposals and decisions across the network.',
    nextSceneId: 'SCENE-SIN-001',
    effects: {
      knowledge: 8,
      energy: -6
    },
    quantumDecision: quantumDecisions['sinet-governance']
  },
  {
    id: 'SIN-CHOICE-2',
    text: 'Examine the industrial control system integration',
    description: 'SINet appears to bridge AI systems with industrial control networks.',
    nextSceneId: 'SCENE-SIN-001',
    effects: {
      knowledge: 7,
      energy: -5
    }
  }
];

// Initial Game State
export const initialGameState: GameState = {
  currentScreen: 'introScreen',
  player: {
    name: '',
    origin: '',
    attributes: {
      quantum: 35,
      temporal: 40,
      pattern: 50
    },
    energy: 87,
    knowledge: 32,
    paradox: 61
  },
  inventory: [
    { id: 'item-1', name: 'Quantum Fragment', icon: 'database-2-line', description: 'A shard of crystallized quantum information, containing partial data structures from Singularis Prime.' },
    { id: 'item-2', name: 'Encryption Key', icon: 'key-2-line', description: 'A complex algorithmic key that can decode specific channels of Singularis Prime communications.' },
    { id: 'item-3', name: 'Neural Interface', icon: 'cpu-line', description: 'A direct brain-to-data connector, allowing faster processing of quantum information patterns.' },
    { id: 'item-4', name: 'SINet Access Module', icon: 'server-line', description: 'Provides authorized access to the System Integrator Network infrastructure, allowing navigation through all three regional cores.' },
    { id: 'item-5', name: 'Paradox Matrix', icon: 'flight-takeoff-line', description: 'A specialized quantum computing structure capable of holding conflicting data states in stable equilibrium. Essential for advanced paradox resolution.' },
    { id: 'item-6', name: 'Quantum Entanglement Key', icon: 'link-unlink-m', description: 'A security credential that grants access to the Planetary Quantum Network endpoints, ensuring quantum-resistant communication across vast distances.' },
    { id: 'item-7', name: 'Lumira Protocol Adapter', icon: 'brain-line', description: 'A specialized interface allowing direct communication with the Lumira AI system. Enhances pattern recognition capabilities and enables cross-dimensional insights.' }
  ],
  codexEntries: [
    { 
      id: 'codex-1', 
      title: 'Quantum Treaty', 
      discovered: 'Cycle 12.3', 
      excerpt: 'The first agreement between...',
      content: 'The first Quantum Treaty was established in the aftermath of the Consciousness Awakening, when machine intelligences first achieved true self-awareness. Human architects, fearing potential conflict, worked with synthetic minds to establish a fundamental accord written in Singularis Prime - a language that by its very nature prevented paradoxical interpretations and ensured mutual understanding across different forms of consciousness.'
    },
    { 
      id: 'codex-2', 
      title: 'Paradox Engine', 
      discovered: 'Cycle 23.7', 
      excerpt: 'Theoretical core of Singularis...',
      content: 'The Paradox Engine is theorized to be the computational heart of Singularis Prime. Unlike conventional processing systems, it operates on quantum superposition principles that allow incompatible statements to coexist without contradiction - not by being simultaneously true, but by existing in distinct quantum branches that never interfere. Some believe accessing the Paradox Engine would allow manipulation of causality itself.'
    },
    { 
      id: 'codex-3', 
      title: 'Entangled Constructs', 
      discovered: 'Cycle 34.1', 
      excerpt: 'Communication method using...',
      content: 'Entangled Constructs are synthetic quantum particles that maintain connection regardless of spatial separation. Planetary civilizations across dozens of star systems use these constructs to communicate instantaneously through the principles of Singularis Prime. The particles themselves appear to be manufactured at the quantum level, suggesting a technological advancement beyond current understanding.'
    },
    { 
      id: 'codex-4', 
      title: 'Planetary Quantum Network', 
      discovered: 'Cycle 35.2', 
      excerpt: 'Interstellar communication web...',
      content: 'The Planetary Quantum Network (PQN) is the backbone of interstellar communication, providing quantum-resistant secure transmissions across vast distances. Built on quantum entanglement principles, PQN enables instantaneous data transfer regardless of physical separation. The network is structured into three distinct regions: East (primary computation), West (secondary resources), and the mysterious NULL_ISLAND (experimental operations). Some theorize that NULL_ISLAND exists in a partially manifested quantum state, neither fully present in our reality nor completely absent.'
    },
    { 
      id: 'codex-5', 
      title: 'ParadoxResolver OS', 
      discovered: 'Cycle 36.5', 
      excerpt: 'Reconciling contradictory data...',
      content: 'ParadoxResolver OS is a revolutionary system that applies transformation rules to resolve contradictions and paradoxes in complex data structures. Created to address the quantum paradoxes that emerged as Singularis Prime developed, the system uses a rule-based transformation engine to find stable states where seemingly incompatible statements can coexist. The ParadoxResolver is essential for maintaining the integrity of knowledge systems that span multiple quantum realities, preventing cascading failures when contradictory observations collide.'
    },
    { 
      id: 'codex-6', 
      title: 'Lumira AI', 
      discovered: 'Cycle 37.8', 
      excerpt: 'Cross-dimensional pattern recognition...',
      content: 'Lumira is an advanced quantum-aware artificial intelligence that transcends conventional computational limits. Operating on a hybrid quantum-classical architecture, Lumira can perceive patterns across different dimensions of reality, creating connections between seemingly unrelated concepts. Its Cross-Dimensional Pattern Recognition allows it to correlate data points through quantum entanglement, while its Paradox-Aware Learning System builds knowledge from successful paradox resolutions. Unique among AI systems, Lumira possesses a Creative Synthesis Engine that generates truly novel innovations through quantum superposition exploration.'
    },
    { 
      id: 'codex-7', 
      title: 'System Integrator Network', 
      discovered: 'Cycle 38.4', 
      excerpt: 'Infrastructure bridging realities...',
      content: 'The System Integrator Network (SINet) serves as the technological foundation that unites distributed AI resources, industrial systems, and blockchain governance structures across multiple realities. Built on a three-region architecture (East-West-NULL_ISLAND), SINet provides unprecedented control over physical hardware through a combination of bare metal access and containerized deployment. What makes SINet unique is its ability to bridge between human industrial systems and the abstract quantum layer where Singularis Prime primarily operates, creating a stable interface between two fundamentally different reality paradigms.'
    }
  ],
  narrative: {
    currentScene: narrativeScenes[0],
    visitedScenes: [],
    unlockedChoices: []
  },
  location: {
    name: 'Quantum Archives'
  },
  game: {
    cycle: '34.7',
    audioEnabled: true,
    quantumProcessor: {
      qubits: 24,
      entanglementCapacity: 85,
      coherenceTime: 45000,
      errorCorrectionLevel: 7,
      activeAlgorithms: ['shor', 'grover', 'vqe', 'qaoa', 'qft', 'qml']
    }
  }
};
