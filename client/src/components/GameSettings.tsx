import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Volume2, VolumeX } from 'lucide-react';

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
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border border-purple-800 text-white backdrop-blur-lg">
        <div className="space-y-4 p-2">
          <h3 className="text-lg font-semibold text-center text-purple-300">Quantum Interface Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {gameState.game.audioEnabled ? (
                <Volume2 className="h-4 w-4 text-green-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-red-400" />
              )}
              <Label htmlFor="audio-toggle" className="cursor-pointer">Audio</Label>
            </div>
            <Switch 
              id="audio-toggle" 
              checked={gameState.game.audioEnabled} 
              onCheckedChange={toggleAudio} 
            />
          </div>

          <div className="pt-2">
            <p className="text-xs text-purple-200 opacity-70 mt-4 text-center">
              Quantum Processor: {gameState.game.quantumProcessor?.qubits} qubits | 
              Entanglement: {gameState.game.quantumProcessor?.entanglementCapacity}% | 
              Coherence: {gameState.game.quantumProcessor?.coherenceTime}ms
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GameSettings;