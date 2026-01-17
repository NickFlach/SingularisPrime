import React, { useEffect, useState, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useToast } from '@/hooks/use-toast';

// Sound types for different game contexts
type SoundContextType = 'intro' | 'exploration' | 'quantum' | 'narrative' | 'danger' | 'discovery';

interface AudioManagerProps {
  defaultVolume?: number;
}

const AudioManager: React.FC<AudioManagerProps> = ({ defaultVolume = 0.5 }) => {
  const { gameState } = useGameState();
  const { toast } = useToast();
  const [currentContext, setCurrentContext] = useState<SoundContextType>('intro');
  const [volume, setVolume] = useState(defaultVolume);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  // Audio references
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const explorationAudioRef = useRef<HTMLAudioElement | null>(null);
  const quantumAudioRef = useRef<HTMLAudioElement | null>(null);
  const narrativeAudioRef = useRef<HTMLAudioElement | null>(null);
  const dangerAudioRef = useRef<HTMLAudioElement | null>(null);
  const discoveryAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Current active audio element
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
  const [activeContext, setActiveContext] = useState<SoundContextType>('intro');

  // Initialize audio elements
  useEffect(() => {
    // Create audio elements 
    introAudioRef.current = new Audio('/audio/intro-ambience.mp3');
    explorationAudioRef.current = new Audio('/audio/exploration-ambience.mp3');
    quantumAudioRef.current = new Audio('/audio/quantum-ambience.mp3');
    narrativeAudioRef.current = new Audio('/audio/narrative-ambience.mp3');
    dangerAudioRef.current = new Audio('/audio/danger-ambience.mp3');
    discoveryAudioRef.current = new Audio('/audio/discovery-ambience.mp3');
    
    // Set looping for all audio and add error handling
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
        
        // Add error handlers
        ref.current.onerror = (e) => {
          console.warn('Audio error:', e);
          // Don't show error toast since placeholder files are expected to fail in this demo
        };
        
        // Preload metadata
        ref.current.preload = 'metadata';
      }
    });

    setAudioInitialized(true);

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

  // Map game state to audio context
  useEffect(() => {
    let newContext: SoundContextType = 'intro';
    
    // Determine context based on game state
    if (gameState.currentScreen === 'introScreen') {
      newContext = 'intro';
    } else if (gameState.currentScreen === 'characterCreation') {
      newContext = 'exploration';
    } else if (gameState.currentScreen === 'narrativeScreen') {
      // Check scene type based on ID
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
    
    // Only update if the context has changed to avoid unnecessary transitions
    if (newContext !== currentContext) {
      setCurrentContext(newContext);
    }
  }, [gameState.currentScreen, gameState.narrative.currentScene, gameState.player.paradox, currentContext]);

  // Handle volume change from settings
  useEffect(() => {
    setVolume(gameState.game.audioEnabled ? defaultVolume : 0);
    
    // If audio was previously disabled and now enabled, we need to restart playback
    if (gameState.game.audioEnabled && activeAudio && activeAudio.paused) {
      try {
        activeAudio.play().catch(e => console.warn("Audio playback failed:", e));
      } catch (err) {
        console.warn("Failed to resume audio:", err);
      }
    }
  }, [gameState.game.audioEnabled, defaultVolume, activeAudio]);

  // Context-aware audio playback with smooth transitions
  useEffect(() => {
    if (!audioInitialized || !gameState.game.audioEnabled) return;
    
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
    
    // Skip transition if it's the same audio that's already playing
    if (activeAudio === newAudio && activeContext === currentContext) {
      return;
    }
    
    // Smooth cross-fade between audio tracks
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
    
    // Fade in new audio with error handling
    const fadeIn = (audio: HTMLAudioElement) => {
      audio.volume = 0;
      
      try {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
              let vol = 0;
              const interval = setInterval(() => {
                if (vol < volume) {
                  vol += 0.05;
                  audio.volume = vol;
                } else {
                  clearInterval(interval);
                }
              }, 100);
            })
            .catch(e => {
              console.warn("Audio play error:", e);
              // Browser requires user interaction to play audio
              // Don't show error toast for placeholder files
            });
        }
      } catch (err) {
        console.warn("Audio playback failed:", err);
      }
    };
    
    // Handle transition between audio contexts
    if (activeAudio && activeAudio !== newAudio) {
      fadeOut(activeAudio, () => fadeIn(newAudio));
    } else if (!activeAudio) {
      fadeIn(newAudio);
    }
    
    setActiveAudio(newAudio);
    setActiveContext(currentContext);
    
    // Update volume when it changes
    return () => {
      if (activeAudio) {
        activeAudio.volume = volume;
      }
    };
  }, [currentContext, volume, audioInitialized, gameState.game.audioEnabled, activeContext]);

  // This component doesn't render anything visible
  return null;
};

export default AudioManager;