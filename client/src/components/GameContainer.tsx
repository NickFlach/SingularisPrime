import React, { useState } from 'react';
import GameContent from './GameContent';
import { useGameState } from '@/hooks/useGameState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GameContainer: React.FC = () => {
  const { gameState, updateGameState, saveGame, isLoading } = useGameState();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState(`Cycle ${gameState.game.cycle}`);
  
  const toggleAudio = () => {
    updateGameState(prev => ({
      ...prev,
      game: {
        ...prev.game,
        audioEnabled: !prev.game.audioEnabled
      }
    }));
  };
  
  const openSaveDialog = () => {
    setSaveDialogOpen(true);
    setSaveName(`Cycle ${gameState.game.cycle}`);
  };
  
  const handleSaveGame = async () => {
    await saveGame(saveName);
    setSaveDialogOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-quantum-blue to-quantum-purple">
            SINGULARIS <span className="text-quantum-cyan">PRIME</span>
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm tracking-wider">THE QUANTUM LANGUAGE OF REALITY</p>
        </div>
        
        {/* Nav Menu */}
        <nav className="flex space-x-2 p-2 border border-gray-700 rounded-lg bg-space-light/80">
          <button 
            className="px-3 py-2 rounded hover:bg-space-dark transition flex items-center"
            onClick={toggleAudio}
          >
            <i className={`ri-volume-${gameState.game.audioEnabled ? 'up' : 'mute'}-line mr-2`}></i>
            <span className="hidden sm:inline">Audio</span>
          </button>
          <button className="px-3 py-2 rounded hover:bg-space-dark transition flex items-center">
            <i className="ri-settings-3-line mr-2"></i>
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button 
            className="px-3 py-2 rounded hover:bg-space-dark transition flex items-center"
            onClick={openSaveDialog}
            disabled={isLoading}
          >
            <i className="ri-save-line mr-2"></i>
            <span className="hidden sm:inline">Save</span>
          </button>
        </nav>
      </header>

      {/* Game State Indicators */}
      <div className="flex justify-between mb-6 flex-wrap gap-2">
        <div className="flex space-x-4">
          <div className="px-3 py-1 bg-space-light rounded-md border border-gray-700 flex items-center">
            <i className="ri-map-pin-line text-quantum-cyan mr-2"></i>
            <span className="text-sm">{gameState.location.name}</span>
          </div>
          <div className="px-3 py-1 bg-space-light rounded-md border border-gray-700 flex items-center">
            <i className="ri-time-line text-quantum-green mr-2"></i>
            <span className="text-sm">Cycle {gameState.game.cycle}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="px-3 py-1 bg-space-light rounded-md border border-gray-700 flex items-center">
            <i className="ri-flashlight-line text-amber-400 mr-2"></i>
            <span className="text-sm">{gameState.player.energy} Energy</span>
          </div>
          <div className="px-3 py-1 bg-space-light rounded-md border border-gray-700 flex items-center">
            <i className="ri-brain-line text-quantum-purple mr-2"></i>
            <span className="text-sm">{gameState.player.knowledge} Knowledge</span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <GameContent />
      
      {/* Game Footer */}
      <footer className="text-center text-gray-500 text-xs mt-8">
        <p>Mythos of SINGULARIS PRIME v0.1.0 • Quantum Cycle 87.342.5</p>
      </footer>
      
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="bg-space-light text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-quantum-cyan font-orbitron">Save Game Progress</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your progress will be stored in your browser's local storage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm text-gray-300 block mb-2">Save Name</label>
            <Input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="bg-space-darker border-gray-700 text-white"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveGame}
              className="bg-quantum-blue hover:bg-quantum-blue/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Game"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameContainer;
