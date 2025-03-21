import React, { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { aiService } from '@/lib/aiService';
import { QuantumDecision, NarrativeChoice, UserAnswer, QuantumProcessor } from '@/types/game';
import { createQuantumDecision, executeQuantumDecision } from '@/lib/quantumDecisions';

// Interface for AI Director Props
interface AIDirectorProps {
  enabled: boolean;
  analysisInterval?: number; // How often to analyze in ms
  children?: React.ReactNode;
}

// Interface for AI Director Context
interface AIDirectorContextType {
  isEnabled: boolean;
  toggleAI: () => void;
  lastAnalysis: Date | null;
  processingAdjustment: boolean;
  latestRecommendation: string | null;
  adjustQuantumDecision: (decision: QuantumDecision) => Promise<QuantumDecision>;
  trackAction: (action: string, data: any) => void;
  generateContent: (prompt: string, type: string) => Promise<string>;
}

// Create context
const AIDirectorContext = React.createContext<AIDirectorContextType | undefined>(undefined);

// Hook for components to access AI Director
export const useAIDirector = () => {
  const context = React.useContext(AIDirectorContext);
  if (!context) {
    throw new Error('useAIDirector must be used within an AIDirectorProvider');
  }
  return context;
};

// Main AI Director Component
export const AIDirector: React.FC<AIDirectorProps> = ({
  enabled = true,
  analysisInterval = 60000, // Default: analyze once per minute
  children
}) => {
  const { gameState, updateGameState } = useGameState();
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [processingAdjustment, setProcessingAdjustment] = useState<boolean>(false);
  const [latestRecommendation, setLatestRecommendation] = useState<string | null>(null);
  const [analysisTimer, setAnalysisTimer] = useState<NodeJS.Timeout | null>(null);

  // Toggle AI functionality
  const toggleAI = () => {
    setIsEnabled(!isEnabled);
  };

  // Track player actions for AI analysis
  const trackAction = (action: string, data: any) => {
    if (!isEnabled) return;
    
    aiService.updatePlayerMetrics(gameState, action, data);
  };

  // Adjust a quantum decision using AI
  const adjustQuantumDecision = async (decision: QuantumDecision): Promise<QuantumDecision> => {
    if (!isEnabled) return decision;
    
    try {
      return await aiService.adjustQuantumDecision(decision, gameState);
    } catch (error) {
      console.error("Error in AI quantum decision adjustment:", error);
      return decision;
    }
  };

  // Generate narrative content using AI
  const generateContent = async (prompt: string, type: string): Promise<string> => {
    if (!isEnabled) return "AI generation is disabled.";
    
    try {
      return await aiService.generateNarrativeContent(prompt, type);
    } catch (error) {
      console.error("Error generating content:", error);
      return "Error generating content.";
    }
  };

  // Periodic game state analysis
  useEffect(() => {
    if (!isEnabled) {
      if (analysisTimer) {
        clearInterval(analysisTimer);
        setAnalysisTimer(null);
      }
      return;
    }

    // Set up interval for periodic analysis
    const timer = setInterval(async () => {
      if (!gameState || processingAdjustment) return;
      
      setProcessingAdjustment(true);
      
      try {
        // Get AI adjustments
        const adjustments = await aiService.getGameAdjustments(gameState);
        
        // Apply subtle adjustments to game state
        updateGameState(prev => {
          // Create a deep copy to avoid direct state mutation
          const newState = JSON.parse(JSON.stringify(prev));
          
          // 1. Apply quantum processor improvements if suggested
          if (adjustments.processorImprovements && newState.game.quantumProcessor) {
            newState.game.quantumProcessor = {
              ...newState.game.quantumProcessor,
              ...adjustments.processorImprovements
            };
          }
          
          // 2. Prepare a recommendation message
          const recommendation = `AI Director: ${adjustments.narrativeDirection}`;
          setLatestRecommendation(recommendation);
          
          // 3. Apply attribute suggestions (very subtle adjustments)
          if (adjustments.playerAttributeSuggestions) {
            Object.entries(adjustments.playerAttributeSuggestions).forEach(([attr, value]) => {
              // Only make very small adjustments
              if (newState.player.attributes[attr] !== undefined) {
                // Subtle +0.1 nudge in the suggested direction
                newState.player.attributes[attr] += 0.1;
              }
            });
          }
          
          return newState;
        });
        
        setLastAnalysis(new Date());
      } catch (error) {
        console.error("Error in AI Director analysis:", error);
      } finally {
        setProcessingAdjustment(false);
      }
    }, analysisInterval);
    
    setAnalysisTimer(timer);
    
    // Cleanup on unmount
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isEnabled, gameState, processingAdjustment]);

  // Provider value
  const value: AIDirectorContextType = {
    isEnabled,
    toggleAI,
    lastAnalysis,
    processingAdjustment,
    latestRecommendation,
    adjustQuantumDecision,
    trackAction,
    generateContent
  };

  return (
    <AIDirectorContext.Provider value={value}>
      {children}
    </AIDirectorContext.Provider>
  );
};

export default AIDirector;