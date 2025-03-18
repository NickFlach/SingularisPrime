import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState } from '@/types/game';
import { initialGameState } from '@/data/narrative';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface GameStateContextType {
  gameState: GameState;
  updateGameState: (updater: (prev: GameState) => GameState) => void;
  saveGame: (name: string, userId?: number) => Promise<void>;
  loadGame: (saveId: number) => Promise<void>;
  resetGame: () => void;
  isLoading: boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage if available
    const savedState = localStorage.getItem('singularisPrimeGameState');
    return savedState ? JSON.parse(savedState) : initialGameState;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('singularisPrimeGameState', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = (updater: (prev: GameState) => GameState) => {
    setGameState(prev => updater(prev));
  };

  const saveGame = async (name: string, userId?: number) => {
    if (!userId) {
      // Just save to localStorage if no user ID
      toast({
        title: "Game Saved Locally",
        description: "Your progress has been saved to your browser's storage.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const saveData = {
        userId,
        saveData: gameState,
        createdAt: new Date().toISOString(),
        name
      };

      await apiRequest('POST', '/api/game-saves', saveData);
      
      toast({
        title: "Game Saved",
        description: `Your progress has been saved as "${name}".`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your game progress.",
        variant: "destructive"
      });
      console.error("Save error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGame = async (saveId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/game-saves/${saveId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to load save');
      }
      
      const saveData = await response.json();
      setGameState(saveData.saveData);
      
      toast({
        title: "Game Loaded",
        description: `Your saved game "${saveData.name}" has been loaded.`,
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "There was an error loading your saved game.",
        variant: "destructive"
      });
      console.error("Load error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setGameState(initialGameState);
    toast({
      title: "Game Reset",
      description: "Your game has been reset to the beginning.",
    });
  };

  return (
    <GameStateContext.Provider 
      value={{ gameState, updateGameState, saveGame, loadGame, resetGame, isLoading }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
