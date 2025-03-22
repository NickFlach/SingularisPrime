import { GameState } from "@shared/schema";
import type { QuantumDecision } from "@/types/game";
import { apiRequest } from "@/lib/queryClient";

/**
 * Interface for xAI's game state analysis response
 */
interface XAIGameAdjustment {
  quantumComplexity: number; // 0-1 factor to adjust complexity of quantum decisions
  narrativeDirection: string; // Suggested narrative emphasis
  processorImprovements?: Partial<Record<string, any>>; // Suggested processor improvements
  nextChoiceEmphasis?: string; // What type of choices to emphasize
  playerAttributeSuggestions?: Record<string, number>; // Attribute adjustment suggestions
}

/**
 * Interface for xAI's quantum decision adjustment response
 */
interface XAIQuantumDecisionAdjustment {
  probability: number;
  entanglementFactor: number;
  superpositionStates?: string[];
  suggestedOutcome?: string;
}

/**
 * Interface for tracking player behavior to inform AI decisions
 */
interface PlayerBehaviorMetrics {
  preferredChoiceTypes: Record<string, number>; // e.g. {"scientific": 5, "exploratory": 2}
  answerAccuracy: number; // 0-1 ratio of correct answers
  decisionConsistency: number; // 0-1 measure of consistent decision making
  explorationIndex: number; // 0-1 how much they explore vs. focus
  pacingPreference: number; // 0-1 slow methodical vs. fast progression
  recentTopics: string[]; // List of recently viewed topics
  sessionDuration: number; // Time spent in current session
}

/**
 * XAI Service class for handling xAI API interactions
 */
class XAIService {
  private playerMetrics: PlayerBehaviorMetrics;
  private lastAnalysisTime: number;

  constructor() {
    // Initialize player metrics
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

  /**
   * Update player metrics based on in-game actions
   */
  public updatePlayerMetrics(gameState: GameState, action: string, data: any): void {
    // Update session duration
    this.playerMetrics.sessionDuration = (Date.now() - this.lastAnalysisTime) / 1000; // in seconds
    this.lastAnalysisTime = Date.now();
    
    // Update metrics based on action type
    switch (action) {
      case "narrativeChoice":
        this.trackNarrativeChoice(data);
        break;
      case "userAnswer":
        this.trackUserAnswer(data);
        break;
      case "documentView":
        this.trackDocumentView(data);
        break;
      case "codexView":
        this.trackCodexView(data);
        break;
    }
  }

  /**
   * Track narrative choices to determine player preferences
   */
  private trackNarrativeChoice(choice: any): void {
    // Determine choice type
    let choiceType = "unknown";
    
    // Analyze the choice text to determine the type
    const text = choice.text.toLowerCase();
    if (text.includes("science") || text.includes("research") || text.includes("study") || text.includes("analyze")) {
      choiceType = "scientific";
    } else if (text.includes("explore") || text.includes("investigate") || text.includes("discover")) {
      choiceType = "exploratory";
    } else if (text.includes("wait") || text.includes("observe") || text.includes("caution")) {
      choiceType = "cautious";
    } else if (text.includes("quick") || text.includes("fast") || text.includes("immediate")) {
      choiceType = "impulsive";
    }
    
    // Update preferred choice types
    this.playerMetrics.preferredChoiceTypes[choiceType] = 
      (this.playerMetrics.preferredChoiceTypes[choiceType] || 0) + 1;
    
    // Update consistency score (how much they stick to a particular type)
    const totalChoices = Object.values(this.playerMetrics.preferredChoiceTypes).reduce((a, b) => a + b, 0);
    const maxChoiceCount = Math.max(...Object.values(this.playerMetrics.preferredChoiceTypes));
    this.playerMetrics.decisionConsistency = maxChoiceCount / totalChoices;
  }

  /**
   * Track user answers to determine accuracy and learning preferences
   */
  private trackUserAnswer(answer: any): void {
    // Update answer accuracy
    if (answer.isCorrect !== undefined) {
      const allAnswers = answer.totalAnswers || 1;
      const correctAnswers = answer.totalCorrect || (answer.isCorrect ? 1 : 0);
      this.playerMetrics.answerAccuracy = correctAnswers / allAnswers;
    }
    
    // Track topic from the question
    if (answer.question) {
      const topic = this.extractTopicFromQuestion(answer.question);
      if (topic && !this.playerMetrics.recentTopics.includes(topic)) {
        this.playerMetrics.recentTopics.unshift(topic);
        // Keep only the 5 most recent topics
        this.playerMetrics.recentTopics = this.playerMetrics.recentTopics.slice(0, 5);
      }
    }
    
    // Update exploration index based on breadth of topics
    const uniqueTopics = new Set(this.playerMetrics.recentTopics).size;
    this.playerMetrics.explorationIndex = Math.min(uniqueTopics / 5, 1);
  }

  /**
   * Extract topic from a question
   */
  private extractTopicFromQuestion(question: string): string | null {
    // Simple keyword extraction
    const keywords = [
      "quantum", "paradox", "entanglement", "superposition", "singularity",
      "timeline", "universe", "consciousness", "reality", "dimension",
      "physics", "theory", "multiverse", "temporal", "space", "time"
    ];
    
    const lowercaseQuestion = question.toLowerCase();
    for (const keyword of keywords) {
      if (lowercaseQuestion.includes(keyword)) {
        return keyword;
      }
    }
    
    return null;
  }

  /**
   * Track document views
   */
  private trackDocumentView(documentId: string): void {
    // Add to recent topics if it's a recognizable topic
    if (!this.playerMetrics.recentTopics.includes(documentId)) {
      this.playerMetrics.recentTopics.unshift(documentId);
      this.playerMetrics.recentTopics = this.playerMetrics.recentTopics.slice(0, 5);
    }
    
    // Increase exploration index slightly
    this.playerMetrics.explorationIndex = Math.min(this.playerMetrics.explorationIndex + 0.05, 1);
  }

  /**
   * Track codex entry views
   */
  private trackCodexView(codexId: string): void {
    // Same as document view for now
    this.trackDocumentView(codexId);
  }

  /**
   * Get game adjustments from xAI
   */
  public async getGameAdjustments(gameState: GameState): Promise<XAIGameAdjustment> {
    try {
      // Add player metrics to the request
      const enrichedGameState = {
        ...gameState,
        _playerMetrics: this.playerMetrics
      };
      
      // Make API request to xAI endpoint
      const response = await apiRequest<{adjustments: XAIGameAdjustment, model: string}>('/api/xai/game-state', 'POST', {
        gameState: enrichedGameState
      });
      
      return response.adjustments;
    } catch (error) {
      console.error("Error getting AI game adjustments:", error);
      
      // Return sensible defaults if API call fails
      return {
        quantumComplexity: 0.5,
        narrativeDirection: "Continue with current narrative path.",
        nextChoiceEmphasis: "balanced"
      };
    }
  }

  /**
   * Adjust quantum decision using xAI
   */
  public async adjustQuantumDecision(
    decision: QuantumDecision, 
    gameState: GameState
  ): Promise<QuantumDecision> {
    try {
      // Make API request to xAI endpoint
      const response = await apiRequest<{adjustedDecision: QuantumDecision}>('/api/xai/quantum-decision', 'POST', {
        decision,
        gameState: {
          ...gameState,
          _playerMetrics: this.playerMetrics
        }
      });
      
      // Return the adjusted decision
      return response.adjustedDecision;
    } catch (error) {
      console.error("Error adjusting quantum decision:", error);
      // Return original decision if API call fails
      return decision;
    }
  }

  /**
   * Generate narrative content using xAI
   */
  public async generateNarrativeContent(prompt: string, type: string): Promise<string> {
    try {
      // Make API request to xAI endpoint
      const response = await apiRequest<{content: string, model: string}>('/api/xai/generate', 'POST', {
        prompt,
        type
      });
      
      return response.content;
    } catch (error) {
      console.error("Error generating narrative content:", error);
      return "Error generating content with xAI.";
    }
  }
  
  /**
   * Analyze image using xAI vision capabilities
   */
  public async analyzeImage(base64Image: string, prompt?: string): Promise<string> {
    try {
      // Make API request to xAI image analysis endpoint
      const response = await apiRequest<{analysis: string, model: string}>('/api/xai/image-analysis', 'POST', {
        base64Image,
        prompt
      });
      
      return response.analysis;
    } catch (error) {
      console.error("Error analyzing image:", error);
      return "Error analyzing image with xAI.";
    }
  }
}

export const xaiService = new XAIService();