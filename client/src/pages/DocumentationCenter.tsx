import React from 'react';
import { Link } from 'wouter';
import Documentation from '@/components/Documentation';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/hooks/useGameState';

const DocumentationCenter: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-quantum-blue to-quantum-purple">
            SINGULARIS <span className="text-quantum-cyan">PRIME</span>
          </h1>
          <p className="text-gray-400 mt-1 font-mono text-sm tracking-wider">DOCUMENTATION CENTER</p>
        </div>
        
        <Link href="/">
          <Button variant="outline" className="text-quantum-cyan border-quantum-cyan hover:bg-space-dark">
            <i className="ri-arrow-left-line mr-2"></i>
            Return to Game
          </Button>
        </Link>
      </header>

      {/* Documentation Breadcrumbs */}
      <div className="flex items-center space-x-2 mb-6 text-sm text-gray-400">
        <Link href="/">
          <a className="hover:text-quantum-cyan">Game</a>
        </Link>
        <i className="ri-arrow-right-s-line"></i>
        <span className="text-quantum-cyan">Documentation</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Quick Links */}
        <div className="col-span-1">
          <div className="bg-space-light/90 rounded-lg border border-gray-700 p-4 glow">
            <h3 className="font-orbitron text-lg text-quantum-cyan mb-3">Quick Links</h3>
            
            <div className="space-y-2">
              <Link href="/">
                <a className="block p-2 rounded hover:bg-space-dark transition text-gray-300 hover:text-quantum-cyan">
                  <i className="ri-gamepad-line mr-2"></i>
                  Return to Game
                </a>
              </Link>
              <Link href="/documentation?category=quantum-mechanics">
                <a className="block p-2 rounded hover:bg-space-dark transition text-gray-300 hover:text-quantum-cyan">
                  <i className="ri-atom-line mr-2"></i>
                  Quantum Mechanics
                </a>
              </Link>
              <Link href="/documentation?category=singularis-prime-tech">
                <a className="block p-2 rounded hover:bg-space-dark transition text-gray-300 hover:text-quantum-cyan">
                  <i className="ri-server-line mr-2"></i>
                  Singularis Prime Technology
                </a>
              </Link>
              <Link href="/documentation?category=hofstadter-butterfly">
                <a className="block p-2 rounded hover:bg-space-dark transition text-gray-300 hover:text-quantum-cyan">
                  <i className="ri-butterfly-line mr-2"></i>
                  Hofstadter's Butterfly
                </a>
              </Link>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-700">
              <h4 className="font-orbitron text-sm text-quantum-blue mb-2">Game Progress</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Cycle</span>
                  <span className="text-quantum-green">{gameState.game.cycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location</span>
                  <span className="text-quantum-cyan">{gameState.location.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Codex Entries</span>
                  <span className="text-quantum-purple">{gameState.codexEntries.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Documentation Content */}
        <div className="col-span-1 lg:col-span-2">
          <Documentation />
        </div>
      </div>
      
      {/* Game Footer */}
      <footer className="text-center text-gray-500 text-xs mt-8">
        <p>Mythos of SINGULARIS PRIME v0.1.0 • Quantum Cycle 87.342.5</p>
      </footer>
    </div>
  );
};

export default DocumentationCenter;