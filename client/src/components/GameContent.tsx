import React from 'react';
import IntroScreen from './IntroScreen';
import CharacterCreation from './CharacterCreation';
import NarrativeScreen from './NarrativeScreen';
import PlayerStatus from './PlayerStatus';
import Inventory from './Inventory';
import Codex from './Codex';
import { useGameState } from '@/hooks/useGameState';

const GameContent: React.FC = () => {
  const { gameState } = useGameState();

  // Determine which screen to show based on game state
  const renderGameState = () => {
    switch (gameState.currentScreen) {
      case 'introScreen':
        return <IntroScreen />;
      case 'characterCreation':
        return <CharacterCreation />;
      case 'narrativeScreen':
        return <NarrativeScreen />;
      default:
        return <IntroScreen />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8" id="gameContent">
      {/* Game State Container - this will change based on game state */}
      <div className="w-full lg:w-3/4">
        {renderGameState()}
      </div>
      
      {/* Right Sidebar */}
      <div className="w-full lg:w-1/4 space-y-6">
        <PlayerStatus />
        <Inventory />
        <Codex />
      </div>
    </div>
  );
};

export default GameContent;
