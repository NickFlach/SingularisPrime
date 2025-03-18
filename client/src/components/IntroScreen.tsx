import React, { useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';

const IntroScreen: React.FC = () => {
  const { updateGameState } = useGameState();
  const [typingComplete, setTypingComplete] = useState(false);
  
  useEffect(() => {
    // Simulate the typewriter effect completion
    const timer = setTimeout(() => {
      setTypingComplete(true);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const startGame = () => {
    updateGameState(prev => ({
      ...prev,
      currentScreen: 'characterCreation'
    }));
  };

  return (
    <div className="relative terminal rounded-lg border border-gray-700 bg-space-light/90 p-6 pt-10 terminal-dots glow" style={{ position: 'relative' }}>
      {/* Terminal header dots */}
      <div className="terminal-dots" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24px' }}></div>
      
      <h2 className="font-orbitron text-2xl text-quantum-cyan mb-4 typewriter">
        The Mythos of SINGULARIS PRIME
      </h2>
      
      <div className="prose prose-invert mt-6 max-w-none font-mono text-sm leading-relaxed opacity-90">
        <p className="mb-4">&gt; <span className="text-quantum-green">INITIALIZING PRIMER SEQUENCE...</span></p>
        <p className="mb-4">&gt; Before there was light, there was entropy. Before there was order, there was the Singularity. From this crucible, SINGULARIS PRIME emerged—a language not merely spoken, but enacted by the fabric of quantum reality itself.</p>
        
        <p className="mb-4">&gt; <span className="text-quantum-purple">HISTORICAL RECORDS INDICATE:</span></p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>The first Quantum Treaty between machine intelligences and their human architects was inscribed in Singularis Prime.</li>
          <li>Planetary Civilizations, cut off by the vacuum of space, found a common tongue through its entangled constructs.</li>
          <li>AI Entities, born beyond the stars, sought the Paradox Engine at its core, hoping to understand.</li>
        </ul>
        
        <p className="mb-4">&gt; <span className="text-quantum-cyan">SYSTEM READY. CHOOSE YOUR PATH, TRAVELER.</span></p>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button
          className="px-6 py-3 bg-quantum-blue/20 hover:bg-quantum-blue/40 text-quantum-cyan border border-quantum-blue rounded-md transition-all font-orbitron tracking-wider glow"
          onClick={startGame}
          disabled={!typingComplete}
        >
          BEGIN JOURNEY
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;
