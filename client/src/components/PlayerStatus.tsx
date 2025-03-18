import React from 'react';
import { useGameState } from '@/hooks/useGameState';

const PlayerStatus: React.FC = () => {
  const { gameState } = useGameState();
  const { player } = gameState;

  return (
    <div className="bg-space-light/90 rounded-lg border border-gray-700 p-4 glow-purple">
      <h3 className="font-orbitron text-lg text-quantum-purple mb-3">Entity Status</h3>
      
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-quantum-blue to-quantum-purple flex items-center justify-center">
          <i className="ri-user-line text-2xl"></i>
        </div>
        <div className="ml-3">
          <p className="font-medium text-white">{player.name || 'Unnamed Entity'}</p>
          <p className="text-xs text-gray-400">{player.origin || 'Origin Unknown'}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Energy</span>
            <span className="text-quantum-cyan">{player.energy}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-quantum-blue to-quantum-cyan h-1.5 rounded-full" 
              style={{ width: `${player.energy}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Knowledge</span>
            <span className="text-quantum-purple">{player.knowledge}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-quantum-purple to-quantum-cyan h-1.5 rounded-full" 
              style={{ width: `${player.knowledge}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400">Paradox Tolerance</span>
            <span className="text-quantum-green">{player.paradox}%</span>
          </div>
          <div className="w-full bg-space-dark rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-quantum-green to-quantum-cyan h-1.5 rounded-full" 
              style={{ width: `${player.paradox}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;
