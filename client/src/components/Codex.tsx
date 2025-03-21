import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

const Codex: React.FC = () => {
  const { gameState } = useGameState();
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  
  // Find the selected codex entry data
  const entryData = selectedEntry 
    ? gameState.codexEntries.find(entry => entry.id === selectedEntry) 
    : null;
  
  const handleViewEntry = (entryId: string) => {
    setSelectedEntry(entryId);
  };
  
  const closeEntryDialog = () => {
    setSelectedEntry(null);
  };

  return (
    <>
      <div className="bg-space-light/90 rounded-lg border border-gray-700 p-4 glow">
        <h3 className="font-orbitron text-lg text-quantum-cyan mb-3">Singularis Codex</h3>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 font-mono text-xs">
          {gameState.codexEntries.map(entry => (
            <div 
              key={entry.id}
              className="border-b border-gray-700 pb-2 last:border-b-0 cursor-pointer hover:text-quantum-cyan"
              onClick={() => handleViewEntry(entry.id)}
            >
              <div className="flex justify-between">
                <span className="text-quantum-cyan">{entry.title}</span>
                <span className="text-gray-500 text-xs">{entry.discovered}</span>
              </div>
              <p className="text-xs text-gray-400 truncate">{entry.excerpt}</p>
            </div>
          ))}
          
          {gameState.codexEntries.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No codex entries discovered yet.
            </div>
          )}
        </div>
      </div>
      
      {/* Codex Entry Detail Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={closeEntryDialog}>
        <DialogContent className="bg-space-light border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-quantum-cyan font-orbitron">
              {entryData?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Discovered: {entryData?.discovered}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 max-h-96 overflow-y-auto">
            <div className="prose prose-invert prose-sm max-w-none font-mono">
              <p>{entryData?.content || entryData?.excerpt}</p>
              
              {/* Related Documentation Links */}
              {entryData && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="text-quantum-cyan text-sm font-bold mb-2">Related Documentation</h4>
                  <div className="space-y-2">
                    {entryData.id === 'codex-1' && (
                      <Link href="/documentation?category=singularis-prime-tech" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        Singularis Prime Technology
                      </Link>
                    )}
                    {entryData.id === 'codex-2' && (
                      <Link href="/documentation?category=singularis-prime-tech#paradox-engine" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        Paradox Engine Documentation
                      </Link>
                    )}
                    {entryData.id === 'codex-3' && (
                      <Link href="/documentation?category=quantum-mechanics#entanglement" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        Quantum Entanglement Theory
                      </Link>
                    )}
                    {entryData.id === 'codex-4' && (
                      <Link href="/documentation?category=singularis-prime-tech#sinet-architecture" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        Three-Region Architecture
                      </Link>
                    )}
                    {entryData.id === 'codex-5' && (
                      <Link href="/documentation?category=singularis-prime-tech#paradox-resolver" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        ParadoxResolver OS Documentation
                      </Link>
                    )}
                    {entryData.id === 'codex-6' && (
                      <Link href="/documentation?category=singularis-prime-tech#lumira-ai" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        Lumira AI Technical Documentation
                      </Link>
                    )}
                    {entryData.id === 'codex-7' && (
                      <Link href="/documentation?category=singularis-prime-tech#sinet" className="text-quantum-blue hover:text-quantum-purple flex items-center">
                        <i className="ri-book-2-line mr-2"></i>
                        SINet Complete Documentation
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Codex;
