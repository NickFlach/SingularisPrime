export interface PlayerAttributes {
  quantum: number;
  temporal: number;
  pattern: number;
}

export interface Player {
  name: string;
  origin: string;
  attributes: PlayerAttributes;
  energy: number;
  knowledge: number;
  paradox: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface CodexEntry {
  id: string;
  title: string;
  discovered: string;
  excerpt: string;
  content: string;
}

export interface NarrativeScene {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface NarrativeChoice {
  id: string;
  text: string;
  description: string;
  nextSceneId: string;
  requiredItems?: string[];
  requiredAttributes?: Record<string, number>;
  effects?: Record<string, number>;
}

export interface Narrative {
  currentScene: NarrativeScene;
  visitedScenes: string[];
  unlockedChoices: string[];
}

export interface Location {
  name: string;
}

export interface GameSettings {
  cycle: string;
  audioEnabled: boolean;
}

export interface GameState {
  currentScreen: string;
  player: Player;
  inventory: InventoryItem[];
  codexEntries: CodexEntry[];
  narrative: Narrative;
  location: Location;
  game: GameSettings;
}

export interface Origin {
  id: string;
  name: string;
  description: string;
  defaultAttributes: Partial<PlayerAttributes>;
}

export interface Attribute {
  id: keyof PlayerAttributes;
  name: string;
  description: string;
  defaultValue: number;
}

export interface GameSave {
  id: number;
  userId: number;
  saveData: GameState;
  createdAt: string;
  name: string;
}
