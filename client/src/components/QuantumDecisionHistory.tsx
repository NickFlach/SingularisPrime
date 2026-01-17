import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import { QuantumDecision } from '@/types/game';
import { 
  ActivitySquare, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  NetworkIcon, 
  RefreshCcw 
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * A component that displays the history of quantum decisions made by the player
 * and their effects on the game state
 */
export function QuantumDecisionHistory() {
  const { gameState } = useGameState();
  const [showFullHistory, setShowFullHistory] = React.useState(false);
  
  // If we don't have a quantum decision history, create a default empty array
  const decisionHistory = gameState.narrative.quantumDecisionHistory || [];
  
  // Display only the last 3 quantum decisions or all if showFullHistory is true
  const displayedDecisions = showFullHistory 
    ? decisionHistory 
    : decisionHistory.slice(-3);
  
  // No decisions made yet
  if (decisionHistory.length === 0) {
    return (
      <Card className="p-4 bg-gray-900/60 border-gray-800">
        <div className="flex items-center gap-2 text-gray-400">
          <Cpu className="h-4 w-4" />
          <p className="text-sm">No quantum decisions recorded yet</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4 bg-black/60 border-purple-900/40 overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <ActivitySquare className="h-5 w-5 text-quantum-purple" />
          <h3 className="text-sm font-medium text-quantum-purple">Quantum Decision History</h3>
        </div>
        <Badge variant="outline" className="text-xs bg-quantum-purple/20 border-quantum-purple/30">
          {decisionHistory.length} Record{decisionHistory.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {displayedDecisions.map((decision, index) => (
          <AccordionItem 
            key={`${decision.id}-${index}`}
            value={`${decision.id}-${index}`}
            className="border-b-purple-900/30"
          >
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2 text-left">
                <span className="inline-block w-6 h-6 rounded-full flex items-center justify-center
                                bg-purple-900/30 text-quantum-purple font-mono text-xs">
                  {decisionHistory.length - (showFullHistory ? index : (decisionHistory.length - displayedDecisions.length + index))}
                </span>
                <div>
                  <p className="text-sm text-white font-medium truncate max-w-[180px]">
                    {decision.outcome}
                  </p>
                  <p className="text-xs text-gray-400">
                    Probability: {(decision.probability * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-xs">
              <div className="grid gap-2 py-1">
                {decision.entanglementFactor && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400">
                      <NetworkIcon className="h-3 w-3" />
                      <span>Entanglement</span>
                    </div>
                    <span className="font-mono bg-purple-900/10 text-purple-300 px-1.5 rounded">
                      {(decision.entanglementFactor * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
                
                {decision.quantumByteCode && (
                  <div className="mt-1">
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                      <Cpu className="h-3 w-3" />
                      <span>Quantum Bytecode</span>
                    </div>
                    <div className="font-mono text-[10px] bg-black/60 p-1.5 rounded border border-purple-900/30 
                                text-purple-300 whitespace-pre-wrap break-all">
                      {decision.quantumByteCode}
                    </div>
                  </div>
                )}
                
                {decision.superpositionStates && decision.superpositionStates.length > 0 && (
                  <div className="mt-1">
                    <div className="flex items-center gap-1 text-gray-400 mb-1">
                      <RefreshCcw className="h-3 w-3" />
                      <span>Superposition States</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {decision.superpositionStates.map((state, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className={`text-[10px] ${
                            state === decision.outcome 
                              ? 'bg-purple-900/20 text-quantum-purple border-purple-900/30' 
                              : 'bg-gray-900/20 text-gray-400 border-gray-800/30'
                          }`}
                        >
                          {state}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {decisionHistory.length > 3 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowFullHistory(!showFullHistory)}
          className="w-full mt-2 text-xs text-gray-400 hover:text-white"
        >
          {showFullHistory ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" /> 
              Show Recent
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" /> 
              Show All ({decisionHistory.length})
            </>
          )}
        </Button>
      )}
    </Card>
  );
}