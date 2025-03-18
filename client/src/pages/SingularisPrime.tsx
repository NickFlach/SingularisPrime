import React from 'react';
import GameContainer from '@/components/GameContainer';
import Starfield from '@/components/Starfield';
import { useGameState } from '@/hooks/useGameState';

const SingularisPrime: React.FC = () => {
  const { gameState } = useGameState();
  
  return (
    <div className="font-inter text-gray-200 overflow-x-hidden min-h-screen relative">
      <Starfield />
      <GameContainer />
    </div>
  );
};

export default SingularisPrime;
