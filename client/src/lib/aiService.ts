import { GameState, QuantumDecision, NarrativeChoice, UserAnswer, QuantumProcessor } from '@/types/game';
import { apiRequest } from './queryClient';

// AI Adjustment Interfaces
interface AIGameAdjustment {
  quantumComplexity: number; // 0-1 factor to adjust complexity of quantum decisions
  narrativeDirection: string; // Suggested narrative emphasis
  processorImprovements?: Partial<QuantumProcessor>; // Suggested processor improvements
  nextChoiceEmphasis?: string; // What type of choices to emphasize
  playerAttributeSuggestions?: Record<string, number>; // Attribute adjustment suggestions
}

interface AIQuantumDecisionAdjustment {
  probability: number;
  entanglementFactor: number;
  superpositionStates?: string[];
  suggestedOutcome?: string;
}

// Player Behavior Tracking
interface PlayerBehaviorMetrics {
  preferredChoiceTypes: Record<string, number>; // e.g. {"scientific": 5, "exploratory": 2}
  answerAccuracy: number; // 0-1 ratio of correct answers
  decisionConsistency: number; // 0-1 measure of consistent decision making
  explorationIndex: number; // 0-1 how much they explore vs. focus
  pacingPreference: number; // 0-1 slow methodical vs. fast progression
  recentTopics: string[]; // List of recently viewed topics
  sessionDuration: number; // Time spent in current session
}

// Main AI Service Class
class AIService {
  private playerMetrics: PlayerBehaviorMetrics;
  private lastAnalysisTime: number;
  
  constructor() {
    // Initialize default metrics
    this.playerMetrics = {
      preferredChoiceTypes: {},
      answerAccuracy: 0.5,
      decisionConsistency: 0.5,
      explorationIndex: 0.5,
      pacingPreference: 0.5,
      recentTopics: [],
      sessionDuration: 0
    };
    this.lastAnalysisTime = Date.now();
  }
  
  // Update player metrics based on their actions
  public updatePlayerMetrics(gameState: GameState, action: string, data: any): void {
    // Track session duration
    const now = Date.now();
    this.playerMetrics.sessionDuration += (now - this.lastAnalysisTime) / 1000; // in seconds
    this.lastAnalysisTime = now;
    
    switch(action) {
      case 'NARRATIVE_CHOICE':
        this.trackNarrativeChoice(data as NarrativeChoice);
        break;
      case 'USER_ANSWER':
        this.trackUserAnswer(data as UserAnswer);
        break;
      case 'VIEW_DOCUMENT':
        this.trackDocumentView(data as string);
        break;
      case 'VIEW_CODEX':
        this.trackCodexView(data as string);
        break;
    }
  }
  
  private trackNarrativeChoice(choice: NarrativeChoice): void {
    // Analyze choice and update metrics
    // Example: Tag choices by keywords in their text/description
    const choiceText = (choice.text + ' ' + choice.description).toLowerCase();
    
    // Track choice types
    const choiceTypes = [
      { type: 'scientific', keywords: ['quantum', 'experiment', 'theory', 'science', 'analysis'] },
      { type: 'exploratory', keywords: ['explore', 'discover', 'journey', 'venture'] },
      { type: 'cautious', keywords: ['careful', 'wait', 'observe', 'analyze', 'avoid'] },
      { type: 'bold', keywords: ['risk', 'charge', 'brave', 'confront', 'challenge'] }
    ];
    
    for (const { type, keywords } of choiceTypes) {
      if (keywords.some(keyword => choiceText.includes(keyword))) {
        this.playerMetrics.preferredChoiceTypes[type] = 
          (this.playerMetrics.preferredChoiceTypes[type] || 0) + 1;
      }
    }
  }
  
  private trackUserAnswer(answer: UserAnswer): void {
    // Update answer accuracy
    const currentTotal = this.playerMetrics.answerAccuracy * 10; // Assume based on 10 answers
    const newTotal = answer.isCorrect ? currentTotal + 1 : currentTotal;
    this.playerMetrics.answerAccuracy = newTotal / 11; // New weighted average
    
    // Track topics from the question
    const questionLower = answer.question.toLowerCase();
    if (questionLower.includes('quantum')) this.playerMetrics.recentTopics.push('quantum');
    if (questionLower.includes('paradox')) this.playerMetrics.recentTopics.push('paradox');
    if (questionLower.includes('butterfly') || questionLower.includes('fractal')) 
      this.playerMetrics.recentTopics.push('fractal-patterns');
    
    // Keep only last 5 topics
    if (this.playerMetrics.recentTopics.length > 5) {
      this.playerMetrics.recentTopics = this.playerMetrics.recentTopics.slice(-5);
    }
  }
  
  private trackDocumentView(documentId: string): void {
    // Add to recent topics
    this.playerMetrics.recentTopics.push(documentId);
    if (this.playerMetrics.recentTopics.length > 5) {
      this.playerMetrics.recentTopics = this.playerMetrics.recentTopics.slice(-5);
    }
    
    // Increase exploration index (shows they're researching)
    this.playerMetrics.explorationIndex = Math.min(
      1.0, 
      this.playerMetrics.explorationIndex + 0.05
    );
  }
  
  private trackCodexView(codexId: string): void {
    // Similar to document view
    this.trackDocumentView(codexId);
  }
  
  // Get AI recommendations for game adjustments
  public async getGameAdjustments(gameState: GameState): Promise<AIGameAdjustment> {
    // Default return if API call fails
    const defaultAdjustment: AIGameAdjustment = {
      quantumComplexity: 0.5,
      narrativeDirection: "continue current path",
      nextChoiceEmphasis: "balance"
    };
    
    try {
      // Call server API endpoint
      const data = await apiRequest<AIGameAdjustment>(
        "/api/ai/game-state",
        "POST",
        {
          playerMetrics: this.playerMetrics,
          gameState
        }
      );
      
      // Return the response data
      return data || defaultAdjustment;
      
    } catch (error) {
      console.error("Error getting AI game adjustments:", error);
      return defaultAdjustment;
    }
  }
  
  // Get AI adjustments for a specific quantum decision
  public async adjustQuantumDecision(
    decision: QuantumDecision, 
    gameState: GameState
  ): Promise<QuantumDecision> {
    try {
      // Call server API endpoint
      const adjustment = await apiRequest<AIQuantumDecisionAdjustment>(
        "/api/ai/quantum-decision",
        "POST",
        {
          decision,
          playerMetrics: this.playerMetrics,
          gameState
        }
      );
      
      // Apply adjustments to the decision
      return {
        ...decision,
        probability: adjustment?.probability !== undefined 
          ? adjustment.probability 
          : decision.probability,
        entanglementFactor: adjustment?.entanglementFactor !== undefined 
          ? adjustment.entanglementFactor 
          : decision.entanglementFactor || 0,
        superpositionStates: adjustment?.superpositionStates 
          ? adjustment.superpositionStates 
          : decision.superpositionStates,
      };
      
    } catch (error) {
      console.error("Error adjusting quantum decision:", error);
      return decision; // Return original decision if adjustment fails
    }
  }
  
  // Function to generate AI-enhanced narrative content
  public async generateNarrativeContent(prompt: string, type: string): Promise<string> {
    try {
      // Call server API endpoint
      const data = await apiRequest<{content: string}>(
        "/api/ai/completion",
        "POST",
        {
          prompt,
          systemPrompt: `You are an AI narrative generator for a quantum-themed game called Singularis Prime. Generate ${type} content that is scientifically informed, engaging, and fits within the quantum reality theme.`,
          maxTokens: 300,
          temperature: 0.7
        }
      );
      
      return data?.content || "Content generation failed.";
      
    } catch (error) {
      console.error("Error generating narrative content:", error);
      return "Error generating content. Please try again.";
    }
  }
}

export const aiService = new AIService();