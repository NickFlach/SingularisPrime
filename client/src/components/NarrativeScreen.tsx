import React, { useState, useRef, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { narrativeScenes, narrativeChoices } from '@/data/narrative';
import { processQuantumNarrativeChoice } from '@/lib/quantumDecisions';
import { QuantumVisualizerDashboard } from './QuantumVisualizerDashboard';
import { QuantumDecisionHistory } from './QuantumDecisionHistory';
import { UserAnswer } from '@/types/game';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { hofstadterButterflyPattern } from '@/lib/quantumDecisions';

const NarrativeScreen: React.FC = () => {
  const { gameState, updateGameState } = useGameState();
  const currentScene = gameState.narrative.currentScene;
  const [quantumMessage, setQuantumMessage] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const answerInputRef = useRef<HTMLInputElement>(null);
  
  // Get available choices for the current scene
  const availableChoices = narrativeChoices.filter(
    choice => choice.nextSceneId.startsWith(currentScene.id.split('-')[0])
  );
  
  // Reset states when scene changes
  useEffect(() => {
    // Reset answer states when scene changes
    setUserAnswer('');
    setAnswerSubmitted(false);
    setAnswerFeedback(null);
    setAnswerCorrect(null);
  }, [currentScene.id]);

  // Handle user answer submission
  const handleAnswerSubmit = () => {
    if (!currentScene.question || !currentScene.expectedAnswers || userAnswer.trim() === '') {
      return;
    }

    // Check if the answer is correct by comparing with expected answers
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = currentScene.expectedAnswers.some(expected => 
      normalizedUserAnswer.includes(expected.toLowerCase())
    );

    // Show feedback based on correctness
    if (isCorrect) {
      setAnswerFeedback(currentScene.answerFeedback?.correct || 'Your answer is correct.');
    } else {
      setAnswerFeedback(currentScene.answerFeedback?.incorrect || 'Your answer is incorrect.');
    }

    setAnswerCorrect(isCorrect);
    setAnswerSubmitted(true);

    // Apply quantum effects based on answer
    let knowledgeEffect = isCorrect ? 10 : 3;
    let energyEffect = isCorrect ? -2 : -5;
    let paradoxEffect = isCorrect ? 0 : 4;

    // Use quantum decision mechanics to influence the effects
    const playerQuantum = gameState.player.attributes.quantum / 100;
    const fractalEffect = hofstadterButterflyPattern(playerQuantum, 0.5);
    
    // Adjust effects based on quantum mechanics
    knowledgeEffect = Math.round(knowledgeEffect * (1 + fractalEffect * 0.5));
    energyEffect = Math.round(energyEffect * (1 - fractalEffect * 0.2));
    paradoxEffect = Math.round(paradoxEffect * (1 + fractalEffect * 0.3));

    // Create a user answer record for history
    const userAnswerRecord: UserAnswer = {
      sceneId: currentScene.id,
      question: currentScene.question,
      answer: userAnswer,
      isCorrect,
      timestamp: Date.now(),
      quantumEffects: {
        knowledge: knowledgeEffect,
        energy: energyEffect,
        paradox: paradoxEffect
      }
    };

    // Update player stats and save answer
    const newEnergy = Math.max(0, Math.min(100, gameState.player.energy + energyEffect));
    const newKnowledge = Math.max(0, Math.min(100, gameState.player.knowledge + knowledgeEffect));
    const newParadox = Math.max(0, Math.min(100, gameState.player.paradox + paradoxEffect));

    updateGameState(prev => ({
      ...prev,
      narrative: {
        ...prev.narrative,
        userAnswers: [...(prev.narrative.userAnswers || []), userAnswerRecord]
      },
      player: {
        ...prev.player,
        energy: newEnergy,
        knowledge: newKnowledge,
        paradox: newParadox
      }
    }));
  };

  const handleSelectChoice = (choiceId: string) => {
    // Find the selected choice
    const selectedChoice = narrativeChoices.find(choice => choice.id === choiceId);
    
    if (!selectedChoice) return;
    
    // Clear any previous quantum messages and reset answer states
    setQuantumMessage(null);
    setUserAnswer('');
    setAnswerSubmitted(false);
    setAnswerFeedback(null);
    setAnswerCorrect(null);
    
    // Process quantum decision if present
    let finalNextSceneId = selectedChoice.nextSceneId;
    let energyEffect = selectedChoice.effects?.energy || 0;
    let knowledgeEffect = selectedChoice.effects?.knowledge || 0;
    let paradoxEffect = selectedChoice.effects?.paradox || 0;
    
    // Initialize quantum decision history if it doesn't exist
    const quantumDecisionHistory = gameState.narrative.quantumDecisionHistory || [];
    let updatedQuantumHistory = [...quantumDecisionHistory];
    
    if (selectedChoice.quantumDecision) {
      // Process the quantum decision
      const quantumResult = processQuantumNarrativeChoice(selectedChoice, gameState);
      
      // Apply quantum effects
      energyEffect += quantumResult.quantumEffects.energy || 0;
      knowledgeEffect += quantumResult.quantumEffects.knowledge || 0;
      paradoxEffect += quantumResult.quantumEffects.paradox || 0;
      
      // Check for scene override
      if (quantumResult.nextSceneOverride) {
        finalNextSceneId = quantumResult.nextSceneOverride;
      }
      
      // Display quantum message
      if (quantumResult.message) {
        setQuantumMessage(quantumResult.message);
      }
      
      // Add the quantum decision to history
      if (selectedChoice.quantumDecision) {
        // Clone the quantum decision to avoid reference issues
        const decisionRecord = { 
          ...selectedChoice.quantumDecision,
          timestamp: Date.now()
        };
        
        // Add to history (most recent at the end)
        updatedQuantumHistory.push(decisionRecord);
      }
    }
    
    // Find the next scene
    const nextScene = narrativeScenes.find(scene => scene.id === finalNextSceneId);
    
    if (!nextScene) return;
    
    // Update player stats based on choice effects and quantum effects
    const newEnergy = Math.max(0, Math.min(100, gameState.player.energy + energyEffect));
    const newKnowledge = Math.max(0, Math.min(100, gameState.player.knowledge + knowledgeEffect));
    const newParadox = Math.max(0, Math.min(100, gameState.player.paradox + paradoxEffect));
    
    // Record this scene as visited
    const visitedScenes = [...gameState.narrative.visitedScenes];
    if (!visitedScenes.includes(currentScene.id)) {
      visitedScenes.push(currentScene.id);
    }
    
    // Update game state
    updateGameState(prev => ({
      ...prev,
      narrative: {
        ...prev.narrative,
        currentScene: nextScene,
        visitedScenes,
        unlockedChoices: [...prev.narrative.unlockedChoices, choiceId],
        quantumDecisionHistory: updatedQuantumHistory
      },
      player: {
        ...prev.player,
        energy: newEnergy,
        knowledge: newKnowledge,
        paradox: newParadox
      }
    }));
  };

  return (
    <div className="relative terminal rounded-lg border border-gray-700 bg-space-light/90 p-6 pt-10 terminal-dots glow">
      {/* Terminal header dots */}
      <div className="terminal-dots" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '24px' }}></div>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-orbitron text-xl text-quantum-cyan">
          {currentScene.title}
        </h2>
        <span className="text-xs bg-space-dark px-2 py-1 rounded-md text-gray-400 font-mono">
          {currentScene.id}
        </span>
      </div>
      
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="mb-4">{currentScene.description}</p>
        <p className="text-quantum-green mb-4">{currentScene.prompt}</p>
        
        {quantumMessage && (
          <div className="p-3 mt-4 mb-4 border border-quantum-cyan bg-black/50 rounded-md text-quantum-cyan font-mono text-sm">
            <div className="flex items-center mb-2">
              <span className="inline-block w-4 h-4 mr-2 bg-quantum-cyan animate-pulse rounded-full"></span>
              <span className="font-bold">QUANTUM PROCESSOR SIGNAL</span>
            </div>
            <p>{quantumMessage}</p>
          </div>
        )}
        
        {/* Only show quantum visualizer when a quantum choice is present */}
        {availableChoices.some(choice => choice.quantumDecision) && (
          <div className="mt-6 mb-4">
            <QuantumVisualizerDashboard />
          </div>
        )}
        
        {/* Show quantum decision history if any decisions have been made */}
        {gameState.narrative.quantumDecisionHistory && 
         gameState.narrative.quantumDecisionHistory.length > 0 && (
          <div className="mt-6 mb-4">
            <QuantumDecisionHistory />
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-3">
        {availableChoices.map((choice, index) => {
          // Check if player meets requirements for this choice
          const hasRequiredItems = !choice.requiredItems || choice.requiredItems.every(
            itemId => gameState.inventory.some(item => item.id === itemId)
          );
          
          const hasRequiredAttributes = !choice.requiredAttributes || Object.entries(choice.requiredAttributes).every(
            ([attr, value]) => gameState.player.attributes[attr as keyof typeof gameState.player.attributes] >= value
          );
          
          const isAvailable = hasRequiredItems && hasRequiredAttributes;
          
          // Use these letters for choice options
          const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
          const choiceColors = [
            'text-quantum-green border-quantum-green',
            'text-quantum-purple border-quantum-purple',
            'text-quantum-cyan border-quantum-cyan'
          ];
          
          return (
            <div 
              key={choice.id}
              className={`choice-option flex items-start p-4 border border-gray-700 rounded-md hover:border-quantum-cyan transition-all cursor-pointer bg-space-dark/60 ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isAvailable && handleSelectChoice(choice.id)}
            >
              <span className={`inline-block w-6 h-6 rounded-full border flex items-center justify-center mr-3 font-mono text-sm ${choiceColors[index % 3]}`}>
                {letters[index]}
              </span>
              <div>
                <div className="flex items-center">
                  <p className="font-medium text-white">{choice.text}</p>
                  {choice.quantumDecision && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-quantum-purple/20 text-quantum-purple border border-quantum-purple/40 rounded font-mono">Q-DECISION</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{choice.description}</p>
                
                {(!hasRequiredItems || !hasRequiredAttributes) && (
                  <div className="mt-2 text-xs text-amber-300">
                    {!hasRequiredItems && (
                      <p>Required items: {choice.requiredItems?.join(', ')}</p>
                    )}
                    {!hasRequiredAttributes && (
                      <p>Required attributes: {Object.entries(choice.requiredAttributes || {}).map(
                        ([attr, value]) => `${attr} (${value})`
                      ).join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NarrativeScreen;
