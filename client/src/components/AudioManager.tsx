import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';

// Sound types for different game contexts
type SoundContextType = 'intro' | 'exploration' | 'quantum' | 'narrative' | 'danger' | 'discovery';

interface AudioManagerProps {
  defaultVolume?: number;
}

const AudioManager: React.FC<AudioManagerProps> = ({ defaultVolume = 0.5 }) => {
  const { gameState } = useGameState();
  const [currentContext, setCurrentContext] = useState<SoundContextType>('intro');
  const [volume, setVolume] = useState(defaultVolume);
  
  // Audio references
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const explorationAudioRef = useRef<HTMLAudioElement | null>(null);
  const quantumAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrativeAudioRef = useRef<HTMLAudioElement | null>(null);
  const dangerAudioRef = useRef<HTMLAudioElement | null>(null);
  const discoveryAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Current active audio element
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements 
    introAudioRef.current = new Audio('/audio/intro-ambience.mp3');
    explorationAudioRef.current = new Audio('/audio/exploration-ambience.mp3');
    quantumAudioRef.current = new Audio('/audio/quantum-ambience.mp3');
    narrativeAudioRef.current = new Audio('/audio/narrative-ambience.mp3');
    dangerAudioRef.current = new Audio('/audio/danger-ambience.mp3');
    discoveryAudioRef.current = new Audio('/audio/discovery-ambience.mp3');
    
    // Set looping for all audio
    [
      introAudioRef, 
      explorationAudioRef, 
      quantumAudioRef, 
      narrativeAudioRef,
      dangerAudioRef,
      discoveryAudioRef
    ].forEach(ref => {
      if (ref.current) {
        ref.current.loop = true;
      }
    });

    // Clean up on unmount
    return () => {
      [
        introAudioRef, 
        explorationAudioRef, 
        quantumAudioRef, 
        narrativeAudioRef,
        dangerAudioRef,
        discoveryAudioRef
      ].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.src = '';
        }
      });
    };
  }, []);

  // Handle game state changes to determine audio context
  useEffect(() => {
    let newContext: SoundContextType = 'intro';
    
    // Determine context based on game state
    if (gameState.currentScreen === 'introScreen') {
      newContext = 'intro';
    } else if (gameState.currentScreen === 'characterCreation') {
      newContext = 'exploration';
    } else if (gameState.currentScreen === 'narrativeScreen') {
      // Check if it's a quantum-focused scene
      const sceneId = gameState.narrative.currentScene.id;
      
      if (sceneId.includes('QA-')) {
        newContext = 'quantum';
      } else if (sceneId.includes('PR-') || gameState.player.paradox > 70) {
        newContext = 'danger';
      } else if (sceneId.includes('LF-') || sceneId.includes('CM-')) {
        newContext = 'discovery';
      } else {
        newContext = 'narrative';
      }
    }
    
    setCurrentContext(newContext);
  }, [gameState.currentScreen, gameState.narrative.currentScene, gameState.player.paradox]);

  // Handle volume change from settings
  useEffect(() => {
    setVolume(gameState.game.audioEnabled ? defaultVolume : 0);
  }, [gameState.game.audioEnabled, defaultVolume]);

  // Fade between audio contexts
  useEffect(() => {
    // Get the new audio reference based on context
    const getAudioForContext = (context: SoundContextType): HTMLAudioElement | null => {
      switch (context) {
        case 'intro': return introAudioRef.current;
        case 'exploration': return explorationAudioRef.current;
        case 'quantum': return quantumAudioRef.current;
        case 'narrative': return narrativeAudioRef.current;
        case 'danger': return dangerAudioRef.current;
        case 'discovery': return discoveryAudioRef.current;
        default: return introAudioRef.current;
      }
    };

    const newAudio = getAudioForContext(currentContext);
    
    if (!newAudio) return;
    
    // Fade out current audio
    const fadeOut = (audio: HTMLAudioElement, callback: () => void) => {
      let vol = audio.volume;
      const interval = setInterval(() => {
        if (vol > 0.05) {
          vol -= 0.05;
          audio.volume = vol;
        } else {
          clearInterval(interval);
          audio.pause();
          callback();
        }
      }, 100);
    };
    
    // Fade in new audio
    const fadeIn = (audio: HTMLAudioElement) => {
      audio.volume = 0;
      audio.play().catch(e => console.log("Audio play error:", e));
      
      let vol = 0;
      const interval = setInterval(() => {
        if (vol < volume) {
          vol += 0.05;
          audio.volume = vol;
        } else {
          clearInterval(interval);
        }
      }, 100);
    };
    
    // Handle transition
    if (activeAudio && activeAudio !== newAudio) {
      fadeOut(activeAudio, () => fadeIn(newAudio));
    } else if (!activeAudio) {
      fadeIn(newAudio);
    }
    
    setActiveAudio(newAudio);
    
    // Update volume when it changes
    return () => {
      if (activeAudio) {
        activeAudio.volume = volume;
      }
    };
  }, [currentContext, volume]);

  // This component doesn't render anything visible
  return null;
};

export default AudioManager;