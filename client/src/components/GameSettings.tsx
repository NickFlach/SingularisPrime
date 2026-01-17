import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Volume2, VolumeX, Cpu, GitBranch } from 'lucide-react';

const GameSettings: React.FC = () => {
  const { gameState, updateGameState } = useGameState();

  const toggleAudio = () => {
    updateGameState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        audioEnabled: !prev.game.audioEnabled
      }
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          className="px-3 py-2 rounded hover:bg-space-dark transition flex items-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border border-quantum-blue text-white backdrop-blur-lg">
        <div className="space-y-4 p-4">
          <h3 className="text-lg font-bold text-center text-quantum-cyan font-orbitron">
            Quantum Interface
          </h3>
          
          <div className="flex items-center justify-between p-2 border border-space-light rounded-md">
            <div className="flex items-center space-x-2">
              {gameState.game.audioEnabled ? (
                <Volume2 className="h-5 w-5 text-quantum-cyan" />
              ) : (
                <VolumeX className="h-5 w-5 text-red-400" />
              )}
              <Label htmlFor="audio-toggle" className="cursor-pointer font-medium">
                Audio System
              </Label>
            </div>
            <Switch 
              id="audio-toggle" 
              checked={gameState.game.audioEnabled} 
              onCheckedChange={toggleAudio}
              className="data-[state=checked]:bg-quantum-cyan"
            />
          </div>

          <div className="space-y-2 p-2 border border-space-light rounded-md">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-quantum-purple" />
              <Label className="font-medium">Quantum Processor</Label>
            </div>
            <div className="pl-7 space-y-1 text-sm">
              <p>
                <span className="text-gray-400">Qubits:</span>{" "}
                <span className="text-quantum-cyan">{gameState.game.quantumProcessor?.qubits}</span>
              </p>
              <p>
                <span className="text-gray-400">Entanglement:</span>{" "}
                <span className="text-quantum-cyan">{gameState.game.quantumProcessor?.entanglementCapacity}%</span>
              </p>
              <p>
                <span className="text-gray-400">Coherence:</span>{" "}
                <span className="text-quantum-cyan">{gameState.game.quantumProcessor?.coherenceTime}ms</span>
              </p>
              <p>
                <span className="text-gray-400">Error Correction:</span>{" "}
                <span className="text-quantum-cyan">Level {gameState.game.quantumProcessor?.errorCorrectionLevel}</span>
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-400 mt-2 text-center">
            <p>Singularis Prime Quantum Cycle {gameState.game.cycle}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GameSettings;