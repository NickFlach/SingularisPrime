import React, { useState, useEffect } from 'react';
import { HofstadterButterflyVisualizer } from './HofstadterButterflyVisualizer';
import { QuantumVisualizer } from './QuantumVisualizer';
import { useGameState } from '@/hooks/useGameState';
import { quantumDecisions } from '@/data/quantumDecisions';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  RefreshCw
} from 'lucide-react';
import { QuantumDecision } from '@/types/game';

/**
 * A dashboard component that displays various quantum visualizations
 * This includes Hofstadter's Butterfly fractal and Quantum Decision visualizations
 */
export function QuantumVisualizerDashboard() {
  const { gameState } = useGameState();
  const { player, game } = gameState;
  
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState('fractal');
  const [magnetic, setMagnetic] = useState(0.5);
  const [energy, setEnergy] = useState(0.5);
  const [colorScheme, setColorScheme] = useState<'quantum' | 'spectrum' | 'monochrome'>('quantum');
  
  // For animation/pulsing effect on parameter values
  const [animatedValues, setAnimatedValues] = useState({
    magnetic: magnetic,
    energy: energy
  });
  
  // Create a slight animation/pulsing effect on the visualization parameters
  useEffect(() => {
    if (!expanded) return;
    
    const interval = setInterval(() => {
      // Create subtle variations based on player's quantum attribute
      const quantumFactor = (player?.attributes.quantum || 50) / 100;
      const variationMagnitude = 0.05 * quantumFactor;
      
      setAnimatedValues({
        magnetic: magnetic + (Math.sin(Date.now() / 3000) * variationMagnitude),
        energy: energy + (Math.cos(Date.now() / 2000) * variationMagnitude)
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [expanded, magnetic, energy, player]);
  
  // Get current active quantum processor
  const processor = game.quantumProcessor;
  
  // Variable size based on expanded state
  const size = expanded ? 500 : 280;
  const butterflyHeight = expanded ? 300 : 180;
  
  // Get available quantum decisions from the narrative
  const getActiveQuantumDecisions = () => {
    // Check if we have any quantum decisions in the history
    const history = gameState.narrative.quantumDecisionHistory || [];
    
    // Get the current scene ID
    const currentSceneId = gameState.narrative.currentScene.id;
    
    // If we have history, use the most recent decision first
    if (history.length > 0) {
      return history[history.length - 1].id;
    }
    
    // Otherwise, find quantum decisions associated with the current scene
    const relevantDecisions = Object.values(quantumDecisions) as QuantumDecision[];
    const matchingDecisions = relevantDecisions
      .filter(qd => qd.outcome === currentSceneId || qd.outcome.includes(currentSceneId.split('-')[1]));
    
    if (matchingDecisions.length > 0) {
      return matchingDecisions[0].id;
    }
    
    // Fallback - generate an ID based on player state
    const timestamp = Date.now().toString(16).slice(-6);
    const playerQ = (player?.attributes.quantum || 0).toString(16);
    return `QD-${playerQ}-${timestamp}`;
  };
  
  const [decisionId, setDecisionId] = useState(() => getActiveQuantumDecisions());
  
  // Refresh the decision ID - either rotate through history or generate a new one
  const refreshDecision = () => {
    const history = gameState.narrative.quantumDecisionHistory || [];
    
    if (history.length > 1) {
      // Find current index in history
      const currentIndex = history.findIndex(qd => qd.id === decisionId);
      
      // Get next or wrap around to start
      const nextIndex = (currentIndex + 1) % history.length;
      setDecisionId(history[nextIndex].id);
    } else {
      // Just regenerate if we don't have multiple history entries
      setDecisionId(getActiveQuantumDecisions());
    }
  };
  
  // Toggle between expanded and collapsed states
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 
                    p-4 shadow-lg border border-purple-900/40 bg-black/80
                    ${expanded ? 'max-w-3xl' : 'max-w-sm'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-purple-100">
          Quantum Visualization System
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={refreshDecision} title="Generate new quantum state">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleExpanded}>
            {expanded ? 
              <Minimize2 className="h-4 w-4" /> : 
              <Maximize2 className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-2 bg-purple-950/50">
          <TabsTrigger value="fractal">Hofstadter's Butterfly</TabsTrigger>
          <TabsTrigger value="quantum">Quantum Decision Space</TabsTrigger>
          {expanded && <TabsTrigger value="combined">Combined View</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="fractal" className="pt-2">
          <HofstadterButterflyVisualizer
            width={size}
            height={butterflyHeight}
            resolution={expanded ? 2 : 1}
            magnetic={animatedValues.magnetic}
            energy={animatedValues.energy}
            colorScheme={colorScheme}
          />
          
          {expanded && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="magnetic">Magnetic Field (Φ/Φ₀)</Label>
                <Slider 
                  id="magnetic"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[magnetic]} 
                  onValueChange={(values) => setMagnetic(values[0])} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="energy">Energy Level (E)</Label>
                <Slider 
                  id="energy"
                  min={0} 
                  max={1} 
                  step={0.01} 
                  value={[energy]} 
                  onValueChange={(values) => setEnergy(values[0])} 
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <div className="flex gap-2 mt-1">
                  <Button 
                    size="sm" 
                    variant={colorScheme === 'quantum' ? 'default' : 'outline'}
                    onClick={() => setColorScheme('quantum')}
                  >
                    Quantum
                  </Button>
                  <Button 
                    size="sm" 
                    variant={colorScheme === 'spectrum' ? 'default' : 'outline'}
                    onClick={() => setColorScheme('spectrum')}
                  >
                    Spectrum
                  </Button>
                  <Button 
                    size="sm" 
                    variant={colorScheme === 'monochrome' ? 'default' : 'outline'}
                    onClick={() => setColorScheme('monochrome')}
                  >
                    Monochrome
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-400">
            <p>
              Hofstadter's Butterfly visualizes the fractal structure of electron energy levels 
              in a magnetic field, representing quantum states in a 2D lattice.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="quantum" className="pt-2">
          <QuantumVisualizer
            player={player}
            processor={processor}
            decisionId={decisionId}
            size={size}
          />
          
          <div className="mt-3 text-xs text-gray-400">
            <p>
              This visualization shows the current quantum decision space with entanglement
              connections and fractal patterns based on your Quantum attribute and processor capabilities.
            </p>
            {expanded && (
              <p className="mt-1">
                Move your cursor over the visualization to interact with the quantum probability space.
              </p>
            )}
          </div>
        </TabsContent>
        
        {expanded && (
          <TabsContent value="combined" className="pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1 text-purple-200">Hofstadter's Butterfly</h4>
                <HofstadterButterflyVisualizer
                  width={size / 2}
                  height={butterflyHeight}
                  resolution={1}
                  magnetic={animatedValues.magnetic}
                  energy={animatedValues.energy}
                  colorScheme={colorScheme}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1 text-purple-200">Quantum Decision Space</h4>
                <QuantumVisualizer
                  player={player}
                  processor={processor}
                  decisionId={decisionId}
                  size={size / 2}
                />
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium mb-2 text-purple-200">Quantum-Fractal Relationship</h4>
                <p className="text-xs text-gray-300">
                  The quantum decision system in SINGULARIS PRIME uses fractal mathematics to model 
                  the complex behavior of quantum systems. The patterns you see in Hofstadter's 
                  Butterfly directly influence how quantum decisions are processed and how reality 
                  branches in the narrative.
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  With a Quantum attribute of {player?.attributes.quantum || 0}, you can perceive {" "}
                  {(player?.attributes.quantum || 0) > 70 ? "intricate" : 
                    (player?.attributes.quantum || 0) > 40 ? "moderate" : "basic"} 
                  {" "} fractal patterns in the quantum decision space.
                </p>
                <p className="text-xs text-gray-300 mt-2">
                  Your quantum processor has {processor?.qubits || 0} qubits with a coherence time of {" "}
                  {processor?.coherenceTime || 0}, allowing for {" "}
                  {(processor?.qubits || 0) > 12 ? "sophisticated" : 
                    (processor?.qubits || 0) > 8 ? "advanced" : "simple"} 
                  {" "} quantum operations.
                </p>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {!expanded && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-1 h-6 text-xs" 
          onClick={toggleExpanded}
        >
          {expanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          {expanded ? "Collapse" : "Expand Dashboard"}
        </Button>
      )}
    </Card>
  );
}