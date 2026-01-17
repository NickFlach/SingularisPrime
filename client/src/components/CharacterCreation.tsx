import React, { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { origins } from '@/data/origins';
import { attributes } from '@/data/attributes';
import { Slider } from '@/components/ui/slider';

const MAX_ATTRIBUTE_POINTS = 150;

const CharacterCreation: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  
  const [name, setName] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [attributeValues, setAttributeValues] = useState({
    quantum: 35,
    temporal: 40,
    pattern: 50
  });
  
  // Calculate remaining points
  const usedPoints = Object.values(attributeValues).reduce((sum, value) => sum + value, 0);
  const remainingPoints = MAX_ATTRIBUTE_POINTS - usedPoints;
  
  const handleAttributeChange = (attributeId: string, value: number[]) => {
    const newValue = value[0];
    
    // Calculate total points that would be used with this change
    const currentValue = attributeValues[attributeId as keyof typeof attributeValues];
    const diff = newValue - currentValue;
    const wouldUse = usedPoints + diff;
    
    // Only allow the change if it doesn't exceed max points
    if (wouldUse <= MAX_ATTRIBUTE_POINTS) {
      setAttributeValues(prev => ({
        ...prev,
        [attributeId]: newValue
      }));
    }
  };
  
  const handleCompleteCreation = () => {
    if (!name.trim()) {
      return; // Require a name
    }
    
    if (!selectedOrigin) {
      return; // Require an origin
    }
    
    // Update game state with character info
    updateGameState(prev => ({
      ...prev,
      currentScreen: 'narrativeScreen',
      player: {
        ...prev.player,
        name: name,
        origin: origins.find(o => o.id === selectedOrigin)?.name || '',
        attributes: attributeValues
      }
    }));
  };
  
  return (
    <div className="relative terminal rounded-lg border border-gray-700 bg-space-light/90 p-6 pt-10 terminal-dots glow">
      {/* Terminal header dots */}
      <div className="terminal-dots" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24px' }}></div>
      
      <h2 className="font-orbitron text-2xl text-quantum-cyan mb-6">Entity Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="block text-sm font-medium mb-2 text-gray-300">Entity Designation</Label>
          <Input 
            type="text" 
            className="w-full bg-space-dark border border-gray-700 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-quantum-cyan focus:border-transparent" 
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <div className="mt-6">
            <Label className="block text-sm font-medium mb-2 text-gray-300">Origin Path</Label>
            <RadioGroup value={selectedOrigin} onValueChange={setSelectedOrigin}>
              <div className="space-y-2">
                {origins.map(origin => (
                  <div 
                    key={origin.id}
                    className="choice-option flex items-center p-3 border border-gray-700 rounded-md hover:border-quantum-cyan transition-all cursor-pointer bg-space-dark/60"
                  >
                    <RadioGroupItem id={origin.id} value={origin.id} className="mr-3" />
                    <div>
                      <Label htmlFor={origin.id} className="font-medium text-quantum-cyan">
                        {origin.name}
                      </Label>
                      <p className="text-xs text-gray-400">{origin.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Attribute Distribution</h3>
          
          <div className="space-y-4">
            {attributes.map(attr => (
              <div key={attr.id} className="attribute-slider">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium text-quantum-cyan">{attr.name}</Label>
                  <span className="text-xs bg-space-dark px-2 py-1 rounded font-mono">
                    {attributeValues[attr.id]}
                  </span>
                </div>
                <Slider
                  value={[attributeValues[attr.id]]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleAttributeChange(attr.id, value)}
                  className="w-full h-2 bg-space-dark rounded-lg appearance-none cursor-pointer accent-quantum-purple"
                />
                <p className="text-xs text-gray-400 mt-1">{attr.description}</p>
              </div>
            ))}
            
            <div className="mt-6">
              <p className="text-xs text-gray-400 mb-2">
                Points Remaining: <span className="font-mono text-quantum-green">{remainingPoints}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button
          className="px-6 py-2 bg-quantum-purple/20 hover:bg-quantum-purple/40 text-white border border-quantum-purple rounded-md transition-all font-orbitron tracking-wider glow-purple"
          onClick={handleCompleteCreation}
          disabled={!name.trim() || !selectedOrigin}
        >
          INITIALIZE ENTITY
        </Button>
      </div>
    </div>
  );
};

export default CharacterCreation;
