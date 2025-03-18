import { GameState, NarrativeScene, NarrativeChoice } from '@/types/game';

// Narrative Scenes
export const narrativeScenes: NarrativeScene[] = [
  {
    id: 'SCENE-QA-001',
    title: 'The Quantum Archives',
    description: 'The vast chamber stretches before you, its walls lined with shimmering data streams that appear to both exist and not exist simultaneously. Quantum information dances between states, creating patterns that hint at the fundamental structure of Singularis Prime. As you step deeper into the archives, the air seems to vibrate with potential knowledge.',
    prompt: 'A console nearby pulses with a gentle cyan light, requesting input. What will you investigate?'
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
    description: 'You approach the pulsing data node in the center of the room. It emits a soft hum that changes pitch as you draw near. Streams of information flow into and out of it in all directions, connecting to the walls of the archive. The node appears to be a nexus point for communications between distant star systems.',
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
    }
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
    }
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
    { id: 'item-3', name: 'Neural Interface', icon: 'cpu-line', description: 'A direct brain-to-data connector, allowing faster processing of quantum information patterns.' }
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
    audioEnabled: true
  }
};
